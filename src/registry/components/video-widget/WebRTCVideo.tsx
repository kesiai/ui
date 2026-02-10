import React, { useRef, useEffect, useState, useCallback } from 'react'

const defaultConfig = {
  server: '',
  app: '',
  stream: '',
  secret: '',
  autoplay: true,
  muted: true,
  iceServers: [],
  debug: false,
  showLatency: true,
  showControls: true,
  reconnectInterval: 5000,
  reconnectAttempts: 3,
}

interface WebRTCVideoProps {
  server?: string
  app?: string
  stream?: string
  secret?: string
  autoplay?: boolean
  muted?: boolean
  iceServers?: any[]
  debug?: boolean
  showLatency?: boolean
  showControls?: boolean
  reconnectInterval?: number
  reconnectAttempts?: number
  style?: React.CSSProperties
  className?: string
  onStatusChange?: (status: string, message: string) => void
  onError?: (message: string) => void
  onConnected?: () => void
  onDisconnected?: () => void
}

const WebRTCVideo: React.FC<WebRTCVideoProps> = (props) => {
  const {
    server,
    app,
    stream,
    secret,
    autoplay = defaultConfig.autoplay,
    muted = defaultConfig.muted,
    iceServers = defaultConfig.iceServers,
    debug = defaultConfig.debug,
    showLatency = defaultConfig.showLatency,
    showControls = defaultConfig.showControls,
    reconnectInterval = defaultConfig.reconnectInterval,
    reconnectAttempts = defaultConfig.reconnectAttempts,
    style,
    className,
    onStatusChange,
    onError,
    onConnected,
    onDisconnected,
  } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const latencyIntervalRef = useRef<any>(null)
  const reconnectTimerRef = useRef<any>(null)
  const reconnectCountRef = useRef(0)
  const startRef = useRef<() => void>(null)

  const [status, setStatus] = useState('disconnected')
  const [latency, setLatency] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isHovering, setIsHovering] = useState(false)

  const log = useCallback((message: string) => {
    if (debug) {
      console.warn(`[WebRTC] ${new Date().toLocaleTimeString()} - ${message}`)
    }
  }, [debug])

  const updateStatus = useCallback((newStatus: string, message = '') => {
    setStatus(newStatus)
    setErrorMessage(message)
    onStatusChange?.(newStatus, message)
    
    if (newStatus === 'connected') {
      onConnected?.()
    } else if (newStatus === 'disconnected') {
      onDisconnected?.()
    } else if (newStatus === 'error') {
      onError?.(message)
    }
  }, [onStatusChange, onConnected, onDisconnected, onError])

  const buildWhepUrl = useCallback(() => {
    if (!server || !app || !stream) {
      return null
    }
    let url = `${server}/index/api/whep?app=${app}&stream=${stream}`
    if (secret) {
      url += `&secret=${secret}`
    }
    return url
  }, [server, app, stream, secret])

  const startLatencyMonitor = useCallback(() => {
    if (latencyIntervalRef.current) {
      clearInterval(latencyIntervalRef.current)
    }

    latencyIntervalRef.current = setInterval(async () => {
      if (!peerConnectionRef.current) return

      try {
        const stats = await peerConnectionRef.current.getStats()
        let currentLatency = 0

        stats.forEach((report) => {
          if (report.type === 'inbound-rtp' && report.kind === 'video') {
            if (report.jitterBufferDelay && report.jitterBufferEmittedCount) {
              currentLatency = Math.round(
                (report.jitterBufferDelay / report.jitterBufferEmittedCount) * 1000
              )
            } else if (report.jitter) {
              currentLatency = Math.round(report.jitter * 1000)
            }
          }
        })

        if (currentLatency === 0) currentLatency = 200
        setLatency(currentLatency)
      } catch (e: any) {
        log('获取统计信息失败: ' + e.message)
      }
    }, 1000)
  }, [log])

  const stopLatencyMonitor = useCallback(() => {
    if (latencyIntervalRef.current) {
      clearInterval(latencyIntervalRef.current)
      latencyIntervalRef.current = null
    }
    setLatency(null)
  }, [])

  const stop = useCallback(() => {
    log('停止播放')
    stopLatencyMonitor()

    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    if (videoRef.current) {
      if (typeof videoRef.current.pause === 'function') {
        videoRef.current.pause()
      }
      videoRef.current.srcObject = null
      videoRef.current.removeAttribute('src')
      if (typeof videoRef.current.load === 'function') {
        videoRef.current.load()
      }
    }

    setIsPlaying(false)
    updateStatus('disconnected')
    reconnectCountRef.current = 0
  }, [log, stopLatencyMonitor, updateStatus])

  const start = useCallback(async () => {
    const whepUrl = buildWhepUrl()
    if (!whepUrl) {
      updateStatus('error', '配置不完整: 请提供 server, app, stream')
      return
    }

    try {
      log('开始连接...')
      updateStatus('connecting')

      const rtcConfiguration: RTCConfiguration = {
        iceServers: iceServers && iceServers.length > 0 ? iceServers : [],
      }

      peerConnectionRef.current = new RTCPeerConnection(rtcConfiguration)

      peerConnectionRef.current.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
          log('ICE candidate: ' + event.candidate.candidate.substring(0, 50))
        }
      })

      peerConnectionRef.current.addEventListener('iceconnectionstatechange', () => {
        const state = peerConnectionRef.current?.iceConnectionState
        log('ICE 状态: ' + state)

        if (state === 'connected' || state === 'completed') {
          updateStatus('connected')
          startLatencyMonitor()
          reconnectCountRef.current = 0
        } else if (state === 'failed' || state === 'disconnected') {
          updateStatus('error', '连接失败')
          stopLatencyMonitor()
          
          if (reconnectCountRef.current < reconnectAttempts!) {
            reconnectCountRef.current++
            log(`尝试重连 (${reconnectCountRef.current}/${reconnectAttempts})`)
            reconnectTimerRef.current = setTimeout(() => {
              startRef.current?.()
            }, reconnectInterval)
          }
        }
      })

      peerConnectionRef.current.addEventListener('track', (event) => {
        log('收到轨道: ' + event.track.kind)
        if (event.streams && event.streams[0]) {
          mediaStreamRef.current = event.streams[0]
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStreamRef.current
            setIsPlaying(true)
          }
        }
      })

      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })

      await peerConnectionRef.current.setLocalDescription(offer)
      log('SDP Offer 已创建')

      log('请求: ' + whepUrl)
      const response = await fetch(whepUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
        mode: 'cors',
      })

      log('响应状态: ' + response.status)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`请求失败: ${response.status} - ${errorText.substring(0, 100)}`)
      }

      const answerSdp = await response.text()
      log('收到 SDP Answer, 长度: ' + answerSdp.length)

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription({
          type: 'answer',
          sdp: answerSdp,
        })
      )

    } catch (error: any) {
      log('错误: ' + error.message)
      updateStatus('error', error.message)
      stop()
    }
  }, [
    buildWhepUrl,
    iceServers,
    log,
    reconnectAttempts,
    reconnectInterval,
    startLatencyMonitor,
    stop,
    stopLatencyMonitor,
    updateStatus,
  ])

  useEffect(() => {
    (startRef as any).current = start
  }, [start])

  useEffect(() => {
    if (autoplay && server && app && stream) {
      start()
    }

    return () => {
      stop()
    }
  }, [server, app, stream])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [])

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: '#000',
    cursor: 'pointer',
    ...style,
  }

  const videoStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    background: '#000',
  }

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '6px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    zIndex: 10,
    color: latency !== null && latency < 500 ? '#00d4aa' : latency !== null && latency < 1500 ? '#ffc107' : '#ff6b6b',
  }

  const controlsStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '10px',
    zIndex: 10,
    opacity: isHovering ? 1 : 0,
    transition: 'opacity 0.3s ease',
  }

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px',
  }

  const playButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #00d4aa 0%, #00a8cc 100%)',
    color: '#fff',
  }

  const stopButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
    color: '#fff',
  }

  const statusStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    zIndex: 10,
    opacity: isHovering ? 1 : 0,
    transition: 'opacity 0.3s ease',
    background:
      status === 'connected'
        ? 'rgba(0, 212, 170, 0.2)'
        : status === 'connecting'
        ? 'rgba(255, 193, 7, 0.2)'
        : status === 'error'
        ? 'rgba(238, 90, 111, 0.2)'
        : 'rgba(255, 107, 107, 0.2)',
    color:
      status === 'connected'
        ? '#00d4aa'
        : status === 'connecting'
        ? '#ffc107'
        : status === 'error'
        ? '#ee5a6f'
        : '#ff6b6b',
  }

  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    fontSize: '14px',
  }

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return '已连接'
      case 'connecting':
        return '正在连接...'
      case 'error':
        return errorMessage || '连接错误'
      default:
        return '未连接'
    }
  }

  return (
    <div 
      style={containerStyle} 
      className={className}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        style={videoStyle}
        autoPlay
        playsInline
        muted={muted}
      />

      {!isPlaying && (
        <div style={placeholderStyle}>
          <div style={{ fontSize: '48px', marginBottom: '10px', opacity: 0.5 }}>📡</div>
          <div>{status === 'connecting' ? '正在连接...' : '点击播放按钮'}</div>
        </div>
      )}

      {showLatency && latency !== null && (
        <div style={overlayStyle}>延迟: {latency} ms</div>
      )}

      {showControls && (
        <>
          <div style={statusStyle}>{getStatusText()}</div>
          <div style={controlsStyle}>
            <button
              style={playButtonStyle}
              onClick={start}
              disabled={status === 'connecting' || status === 'connected'}
            >
              ▶ 播放
            </button>
            <button
              style={stopButtonStyle}
              onClick={stop}
              disabled={status === 'disconnected'}
            >
              ⏹ 停止
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default WebRTCVideo
