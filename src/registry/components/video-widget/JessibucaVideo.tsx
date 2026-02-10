import React, { useRef, useState, useEffect } from 'react'
import _ from 'lodash'
import { getConfig, createAPI } from '@airiot/client'
const config = getConfig()

declare global {
  interface Window {
    JessibucaPro: any
    jessibuca: any
  }
}

// Helper for protocol
const getProtocol = () => window.location.protocol.replace(':', '')
const appendQuery = (url: string, key: string, value?: string) => {
  if (!value) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${key}=${value}`
}

interface JessibucaVideoProps {
  jessConfigute?: any
  url?: string
  tableData?: any
  type?: string
  style?: React.CSSProperties
  backUrl?: string
  value?: any
  changeTime?: any
  videoData?: any
  resetStreamType?: (type: string) => void
  videoAction?: string
  reload?: any
  videoType?: any
  setReload?: (val: any) => void
  timerRef?: any
  errorReload?: number
  fullscreenStreamType?: boolean
  callback?: any
  playback?: any
  driverInstanceId?: string
  cellKey?: string
  streamType?: string
}

const JessibucaVideo: React.FC<JessibucaVideoProps> = (props) => {
  const { 
    jessConfigute = {}, 
    url, 
    tableData, 
    style, 
    backUrl, 
    videoData, 
    videoAction = "preview", 
    reload, 
    setReload, 
    timerRef, 
    errorReload = 5, 
    fullscreenStreamType, 
    playback 
  } = props

  const container = useRef<HTMLDivElement>(null)
  const jessibucaPlayer = useRef<any>(null)
  
  const jessUrl = videoData?.url || url
  const [videoUrl, setVideoUrl] = useState(jessUrl)
  
  const driverInstanceId = videoData?.driverInstanceId || props?.driverInstanceId
  
  const previousVideoUrl = useRef<string | null>(null)
  const isCreatingPlayer = useRef(false)
  const isCancelled = useRef(false)
  const pendingVideoUrl = useRef<string | null>(null)
  const hasPlayedBefore = useRef(false)
  const stopStreamCallCount = useRef<any>({})
  const lastPlayState = useRef<any>(null)

  const host = window.location.host
  
  const reloadTime = (msg: string) => {
    console.log(msg)
    if (timerRef?.current) clearInterval(timerRef.current)
    if (setReload && timerRef) {
      timerRef.current = setInterval(() => {
        setReload((prev: number) => prev + 1)
      }, errorReload * 1000)
    }
  }

  const errorFunc = (jessibuca: any) => {
    jessibuca.on("error", function () {
      reloadTime('视频播放异常error')
    })
    jessibuca.on("timeout", function () {
      reloadTime('视频播放异常timeout')
    })
    jessibuca.on("delayTimeout", function () {
      reloadTime('视频播放异常delayTimeout')
    })
    jessibuca.on("loadingTimeout", function () {
      reloadTime('视频播放异常loadingTimeout')
    })
    jessibuca.on("stats", function (s: any) {
      // stats logic
      console.log('stats', s)
    })
  }

  const deleteElement = (jessibuca: any) => {
    if (!_.isEmpty(jessConfigute?.showPerformance) && container.current && jessibuca && props?.cellKey) {
        // Implementation for showing performance stats overlaid on video
        // Simplified for this port
    }
  }

  const hasLoad = () => {
     // Simplified logic
  }

  const jessFullscreen = (jessibuca: any) => {
    jessibuca.on('fullscreen', function (value: boolean) {
      // Fullscreen logic
      if (props?.videoAction == 'preview' && fullscreenStreamType) {
        if (value && videoData?.streamType == 'sub' && _.isFunction(props?.resetStreamType)) {
          props?.resetStreamType('main')
        } else if (!value && props?.streamType && _.isFunction(props?.resetStreamType)) {
          props?.resetStreamType(props?.streamType)
        }
      }
    })
  }

  const extractPath = (url: string) => {
    if (!url) return ''
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return url
    }
    try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        return path.startsWith('/') ? path.slice(1) : path;
    } catch(e) {
        return url
    }
  }

  const stopStream = (result: string, scene = 'default') => {
    if (result) {
      const countKey = `${scene}_${result}`
      const currentCount = stopStreamCallCount.current[countKey] || 0
      
      if (currentCount >= 2) {
        return Promise.resolve()
      }
      
      stopStreamCallCount.current[countKey] = currentCount + 1
      
      // Using fetch instead of api()
      return fetch(`/api/live/stop`, { 
          method: 'POST', 
          body: JSON.stringify({ url: result }),
          headers: {
              'Content-Type': 'application/json'
          }
      }).catch(err => console.error(err))
    }
    return Promise.resolve()
  }

  const getJess = async () => {
    if (container.current) {
      if (isCancelled.current) return
      if (isCreatingPlayer.current) return
      
      isCreatingPlayer.current = true
      
      if (jessibucaPlayer?.current) {
        try {
          if (previousVideoUrl.current && videoAction === 'record') {
            const result = extractPath(previousVideoUrl.current)
            if (result) {
              try {
                await stopStream(result, 'destroy_player')
              } catch (err) {}
            }
          }
          
          if (typeof jessibucaPlayer.current.pause === 'function') {
            jessibucaPlayer.current.pause()
          }
          
          await new Promise(resolve => setTimeout(resolve, 150))
          await jessibucaPlayer.current.destroy()
          jessibucaPlayer.current = null
         
          if (container.current) {
            container.current.innerHTML = ''
            container.current.removeAttribute('data-jbprov')
            container.current.className = ''
          }
          
          await new Promise(resolve => setTimeout(resolve, 200))
          
          if (isCancelled.current) {
            isCreatingPlayer.current = false
            return
          }
        } catch (err) {
          jessibucaPlayer.current = null
          if (container.current) {
            container.current.innerHTML = ''
            container.current.removeAttribute('data-jbprov')
            container.current.className = ''
          }
          isCreatingPlayer.current = false
          return
        }
      }

      const containerElement = container.current as any
      const reactFiberKeys = Object.keys(containerElement).filter(key => 
        key.startsWith('__reactFiber') || key.startsWith('__reactProps') || key.startsWith('__reactEvents')
      )
      reactFiberKeys.forEach(key => {
        delete containerElement[key]
      })
      
      let jessibucaObject = {
        container: containerElement,
        videoBuffer: jessConfigute?.videoBuffer || 1,
        isResize: jessConfigute?.isResize || false,
        isFullResize: jessConfigute?.isFullResize || false,
        hotKey: jessConfigute?.hotKey || false,
        background: jessConfigute?.background || '',
        loadingText: jessConfigute?.loadingText || "",
        debug: jessConfigute?.debug || false,
        showBandwidth: jessConfigute?.showBandwidth || false,
        supportDblclickFullscreen: jessConfigute?.supportDblclickFullscreen || false,
        keepScreenOn: jessConfigute?.keepScreenOn || false,
        hasAudio: jessConfigute?.hasAudio || true,
        hasVideo: jessConfigute?.hasVideo || true,
        rotate: jessConfigute?.rotate || 0,
        operateBtns: {
          fullscreen: jessConfigute?.operateBtns?.fullscreen,
          screenshot: jessConfigute?.operateBtns?.screenshot,
          play: jessConfigute?.operateBtns?.play,
          audio: jessConfigute?.operateBtns?.audio,
          record: jessConfigute?.operateBtns?.record
        },
        showPerformance: !_.isEmpty(jessConfigute?.showPerformance) && (jessConfigute?.showPerformance?.showAll === true || Object.keys(jessConfigute?.showPerformance)?.filter(key => key !== 'showAll' && jessConfigute?.showPerformance[key] === true)?.length) ? true : false,
        forceNoOffscreen: _.isBoolean(jessConfigute?.forceNoOffscreen) ? jessConfigute?.forceNoOffscreen : true,
        isNotMute: jessConfigute?.isNotMute || false,
        useMSE: jessConfigute?.useMSE || false,
        useSIMD: jessConfigute?.useSIMD || false,
        useWCS: jessConfigute?.useWCS || false,
        wcsUseVideoRender: jessConfigute?.wcsUseVideoRender || false,
        autoWasm: _.isBoolean(jessConfigute?.autoWasm) ? jessConfigute?.autoWasm : true,
        hiddenAutoPause: jessConfigute?.hiddenAutoPause || false,
        isFlv: jessConfigute?.isFlv || false,
        timeout: jessConfigute?.timeout || 10,
        heartTimeout: jessConfigute?.timeout || 10,
        loadingTimeout: jessConfigute?.timeout || 10,
        supportHls265: true,
        recordType: jessConfigute?.recordType || 'flv',
        useWebFullScreen: true,
        // Assuming decoder is available in public/r/
        decoder: '/r/jessibuca-pro/decoder-pro.js'
      }
    
      if (isCancelled.current) {
        isCreatingPlayer.current = false
        return
      }
      
      if (!container.current) {
        isCreatingPlayer.current = false
        return
      }
      
      if (container.current.innerHTML !== '' || container.current.hasAttribute('data-jbprov')) {
        container.current.innerHTML = ''
        container.current.removeAttribute('data-jbprov')
        container.current.className = ''
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // Assuming JessibucaPro is loaded globally or we load it
      // For now assume global availability or dynamic load
      const loadScript = () => {
          if (window.JessibucaPro) return Promise.resolve();
          return new Promise((resolve, reject) => {
              const script = document.createElement('script');
              // Adjust path to where you put jessibuca-pro.js
              script.src = '/r/jessibuca-pro/jessibuca-pro.js'; 
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
          });
      }

      try {
          await loadScript();
          if (window.JessibucaPro) {
            let jessibuca = new window.JessibucaPro(jessibucaObject)
            pendingVideoUrl.current = videoUrl || null
            hasPlayedBefore.current = true
            
            if (playback && 'play' in playback) {
              if (videoUrl) jessibuca.play(videoUrl)
              if (!playback?.play) {
                setTimeout(() => {
                  if (jessibuca && typeof jessibuca.pause === 'function') {
                    jessibuca.pause()
                  }
                }, 500)
              }
            } else {
              if (videoUrl) jessibuca.play(videoUrl)
            }

            const result = jessibuca.hasLoaded()
            jessFullscreen(jessibuca)
            jessibucaPlayer.current = jessibuca
            if (result) {
              setTimeout(() => { hasLoad() }, 100)
              deleteElement(jessibuca)
            }
            errorFunc(jessibuca)
          }
      } catch (err) {
          console.error("Jessibuca init error", err)
          isCreatingPlayer.current = false
          jessibucaPlayer.current = null
          if (container.current) {
            container.current.innerHTML = ''
            container.current.removeAttribute('data-jbprov')
            container.current.className = ''
          }
      }
      
      if (jessibucaPlayer.current) {
        errorFunc(jessibucaPlayer.current)
      }
      
      isCreatingPlayer.current = false
    }
  }

  useEffect(() => {
    isCancelled.current = false
    
    const initPlayer = async () => {
      if (container.current && !isCancelled.current) {
        if (videoUrl) {
          await getJess()
        }
      }
    }
    
    initPlayer()
    
    return () => {
      isCancelled.current = true
    }
  }, [ videoUrl, JSON.stringify(jessConfigute), reload ])

  useEffect(() => {
    // Mock headers logic
    const token = 'mock-token'
    const projectID = 'mock-project-id'
    
    if (backUrl) {
      let videoBakcUrl = `${getProtocol()}://${host}/${backUrl}?token=${token}`
      if (projectID) videoBakcUrl = videoBakcUrl + `&x-request-project=${projectID}`
      if (driverInstanceId) videoBakcUrl = videoBakcUrl + `&x-driver-instance-id=${driverInstanceId}`
      if (videoBakcUrl) {
        setVideoUrl(videoBakcUrl)
      }
    } else if (!videoData?.url && !url) {
        setVideoUrl(undefined)
    }
  }, [ backUrl, driverInstanceId ])

  useEffect(() => {
    if (previousVideoUrl.current && previousVideoUrl.current !== videoUrl && videoAction === 'record') {
      const result = extractPath(previousVideoUrl.current)
      if (result && jessibucaPlayer?.current) {
        stopStream(result, 'url_change')
      }
    }
    
    if (videoUrl) {
      previousVideoUrl.current = videoUrl
    }
  }, [videoUrl])

  // Playback control effect
  useEffect(() => {
    // 如果 playback 中没有 play 属性，不执行播放/暂停控制
    if (!playback || !('play' in playback)) {
      return
    }
    
    if (jessibucaPlayer.current && typeof jessibucaPlayer.current.isPlaying === 'function') {
      const isCurrentlyPlaying = jessibucaPlayer.current.isPlaying()
      if (playback?.play && !isCurrentlyPlaying) {
        if (!jessibucaPlayer.current) {
          return
        }
        
        const savedUrl = pendingVideoUrl.current
        if (!savedUrl) {
          return
        }
        
        if (typeof jessibucaPlayer.current.play === 'function') {
          try {
            jessibucaPlayer.current.play(savedUrl).catch((e: any) => console.error(e))
          } catch (e) {
            console.error(e)
          }
        }
      } else if (!playback?.play && isCurrentlyPlaying) {
        if (typeof jessibucaPlayer.current.pause === 'function') {
          jessibucaPlayer.current.pause().then(async () => {
              if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
              }
              
              if (pendingVideoUrl.current && videoAction === 'record') {
                const result = extractPath(pendingVideoUrl.current)
                if (result) {
                  try {
                    await stopStream(result, 'pause')
                  } catch (err) {}
                }
              }
            }).catch((e: any) => console.error(e))
        }
      }
      
      lastPlayState.current = playback?.play
    }
  }, [playback?.play])

  const getVideoUrl = (tableData: any) => {
    const api = createAPI({ resource: 'video/live/url' })
    api.fetch('', {
      method: 'POST',
      body: JSON.stringify({ id: tableData?.id, table: tableData?.table?.id })
    })
      .then(({ json }: any) => {
        let url = json?.url ? `${getProtocol()}://${host}/${json.url}` : json?.url
        url = appendQuery(url, 'x-driver-instance-id', json?.driverInstanceId)
        if (url) setVideoUrl(url)
      }).catch(err => {
        console.error("Failed to get video url", err)
      })
  }

  useEffect(() => {
    if (videoData?.type && videoData?.url) {
      let wsUrl: string | undefined = undefined
      if (videoData?.url) {
        if (videoData.url.startsWith('ws://') || videoData.url.startsWith('wss://')) {
          wsUrl = videoData.url
        } else if (videoData.url.startsWith('http://') || videoData.url.startsWith('https://')) {
          wsUrl = videoData.url
        } else {
          wsUrl = `${getProtocol()}://${host}/${videoData.url}`
        }
      }
      if (wsUrl && (wsUrl.startsWith('ws://') || wsUrl.startsWith('wss://') || videoData.url.startsWith('wss://'))) {
        wsUrl = appendQuery(wsUrl, 'x-driver-instance-id', driverInstanceId)
      }
      setVideoUrl(wsUrl)
    } else if (_.isEmpty(videoAction) || videoAction == 'preview') {
      let tableDataObj = tableData
      if (tableDataObj?.id) {
        getVideoUrl(tableData)
      }
    }
  }, [JSON.stringify(videoData), tableData?.id, JSON.stringify(videoAction), JSON.stringify(driverInstanceId)])

  useEffect(() => {
    const handleBeforeUnload = (e: any) => {
        console.log(e)
      const currentUrl = videoUrl || previousVideoUrl.current
      if (currentUrl && videoAction === 'record') {
        const result = extractPath(currentUrl)
        if (result) {
          stopStream(result, 'beforeunload')
        }
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      
      if (previousVideoUrl.current && videoAction === 'record') {
        const result = extractPath(previousVideoUrl.current)
        if (result && jessibucaPlayer?.current) {
          stopStream(result, 'unmount')
        }
        previousVideoUrl.current = null
      }

      if (jessibucaPlayer?.current) {
        jessibucaPlayer?.current.destroy()
        jessibucaPlayer.current = null
      }
    }
  }, [ videoUrl, videoAction ])

  return (
    <div className="container-shell" style={{ width: '100%', height: '100%' }}>
      <div className='jessibuc-container'
        style={{ background: 'rgba(13, 14, 27, 0.7)', width: style?.width || '100%', height: style?.height || '100%' }}
        ref={container} id={`container-${props.cellKey || 'video'}`}></div>
    </div>
  )
}

export { JessibucaVideo }
export default JessibucaVideo