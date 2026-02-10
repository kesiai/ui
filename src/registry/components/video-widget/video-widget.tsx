import * as React from "react"
import { cn } from "@/lib/utils"
import { createAPI } from '@airiot/client'
import { JessibucaVideo } from './JessibucaVideo'
import { StreamVideo } from './StreamVideo'
import Ckplayer from './Ckplayer'
import { EzuikitVideo } from './EzuikitWidget'
import WebRTCVideo from './WebRTCVideo'

// Native Video Component for MP4, HLS, FLV (simple version)
const NativeVideo = ({ videoData, className, configure, ...props }: any) => {
  const { url, type } = videoData || {}
  const finalUrl = url || props.url
  const finalType = type || props.type
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    if (!finalUrl) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(false)

    const video = videoRef.current
    if (video) {
      const handleLoadStart = () => setLoading(true)
      const handleCanPlay = () => setLoading(false)
      const handleLoadedData = () => setLoading(false) // Backup if canplay doesn't fire
      const handleError = () => {
        setLoading(false)
        setError(true)
      }

      video.addEventListener('loadstart', handleLoadStart)
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('loadeddata', handleLoadedData)
      video.addEventListener('error', handleError)

      // CRITICAL: Force reload when source changes
      video.load()

      return () => {
        video.removeEventListener('loadstart', handleLoadStart)
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('error', handleError)
      }
    }
  }, [finalUrl])

  if (error) {
    return (
      <div className={cn("flex items-center justify-center w-full h-full bg-slate-100 text-slate-500", className)}>
        <div className="text-center">
          <p>视频加载失败</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative w-full h-full", className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10 bg-opacity-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        autoPlay={configure?.autoplay ?? props.autoplay ?? false}
        loop={configure?.loop ?? props.loop ?? false}
        controls={configure?.controls ?? props.controls ?? true}
        muted={configure?.muted ?? props.muted ?? false}
        playsInline
        {...props}
      >
        <source src={finalUrl} type={finalType === "hls" || finalType === "m3u8" ? "application/x-mpegURL" : "video/mp4"} />
        您的浏览器不支持视频播放。
      </video>
    </div>
  )
}

// Logic from VideoCommon.js nodeVideoMessage
const nodeVideoMessage = async (value: any, resolution: any, frameRate: any, streamType: any, changeTimer?: any) => {
  let videoUrl, videoType, driverInstanceId

  if (value?.id) {
    let setting = {
      id: value?.id,
      table: typeof value?.table === 'string' ? value?.table : value?.table?.id,
      resolution,
      frameRate,
      streamType
    }

    try {
        const api = createAPI({ resource: 'video/live/url' })
        const { json } = await api.fetch('', { method: 'POST', body: JSON.stringify(setting) }) as any
        
        if (json?.url && json?.protocol) {
          if (json?.protocol == 'hls' && json.url && json.url.indexOf('http:') == -1) {
            let origin = window.location.origin
            videoUrl = `${origin}${json.url}`
          } else {
            videoUrl = json.url
          }
        }
        if (json?.protocol) {
          if (json.protocol == 'ws') { videoType = 'rtsp' } else { videoType = json.protocol }
          if (json?.protocol == 'flv') {
            if (json?.url && (!json.url.startsWith('ws') || !json.url.startsWith('wss'))) {
              const origin = window.location.origin
              if (origin && origin.startsWith('http')) videoUrl = `${origin.replace('http', 'ws')}/${json?.url}`
              if (origin && origin.startsWith('https')) videoUrl = `${origin.replace('https', 'wss')}/${json?.url}`
              if (!json.url.endsWith('.flv')) videoUrl = `${videoUrl}.flv`
            }
          }
        }
        if (json?.driverInstanceId) {
          driverInstanceId = json?.driverInstanceId
        }
        
        if (changeTimer && typeof changeTimer === 'function') {
            changeTimer(json)
        }

        return { videoType, videoUrl, driverInstanceId, frameRate: json.frameRate, resolution: json.resolution, noVideo: false, stream: streamType }

    } catch (err: any) {
        if (changeTimer && typeof changeTimer === 'function') changeTimer(err)
        return { videoType: '', videoUrl: '', driverInstanceId: '', frameRate: '', resolution: '', noVideo: true, stream: streamType }
    }
  }
  return { videoType: '', videoUrl: '', driverInstanceId: '', frameRate: '', resolution: '', noVideo: true, stream: streamType }
}

export type VideoType = "mp4" | "flv" | "hls" | "rtsp" | "rtmp" | "rtmp-ws" | "ezopen" | "ws-raw" | "webrtc" | "m3u8" | "ws" | ""

export interface VideoWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  videoType?: string
  tableData?: Record<string, any>
  warnTableData?: Record<string, any>
  streamType?: string
  fullscreenStreamType?: boolean
  type?: VideoType
  urlSource?: string
  url?: string
  uploadUrl?: Record<string, any>
  accessToken?: string
  videoAction?: string
  recordStartTime?: string
  recordEndTime?: string
  show?: boolean
  defaultImage?: string
  configure?: Record<string, any>
  jessConfigute?: Record<string, any>
  webrtcConfig?: Record<string, any>
  errorReload?: number
  cellKey?: string
  // Legacy props compatibility
  autoplay?: boolean
  loop?: boolean
  controls?: boolean
  muted?: boolean
  poster?: string
  showPlaceholder?: boolean
  width?: string | number
  height?: string | number
  videoId?: any
  videoUid?: any
  backUrl?: string
}

const VideoWidget = React.forwardRef<HTMLDivElement, VideoWidgetProps>(
  (props, ref) => {
    let { 
      className,
      type, 
      url, 
      videoType = "dataPoint", // Default matches VideoCommon
      tableData,
      warnTableData,
      configure, 
      videoAction = 'preview', 
      jessConfigute, 
      show, 
      defaultImage, 
      streamType = 'main',
      urlSource,
      recordStartTime,
      recordEndTime,
      videoId: propVideoId,
      videoUid: propVideoUid
    } = props

    if (tableData?._table && !tableData?.table) { 
        tableData = { ...tableData, table: { id: tableData?._table } } 
    }

    // State to hold video data (similar to VideoCommon)
    const [videoData, setVideoData] = React.useState<any>({ 
      type, 
      url, 
      driverInstanceId: null, 
      frameRate: null, 
      resolution: null, 
      noVideo: false, 
      streamType: streamType 
    })
    
    const [reload, setReload] = React.useState(0)
    const timerRef = React.useRef<any>(null)
    const [point, setPoint] = React.useState<any>(null)
    const [backUrl, setBackUrl] = React.useState<string>('')

    const videoId = propVideoId || propVideoUid || configure?.videoId || configure?.videoUid
    const vTableData = (typeof videoId === 'object') ? videoId : undefined;

    // TODO: implement logic to determine context data
    const ctxTableData = null 

    const formatLocalDateTime = (value: string | number | Date) => {
      if (!value) return ''
      const date = value instanceof Date ? value : new Date(value)
      const pad = (num: number) => num.toString().padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}Z`
    }

    const getTableData = async (item: any) => {
      const tableDataId = item?.tableData?.id
      const tableId = item?.table?.id
      if (tableId && tableDataId) {
        const api = createAPI({ resource: `core/t/${tableId}/d` })
        return api.get(tableDataId)
      }
      return null
    }

    const sortFunction = (a: any, b: any) => a.startTime - b.startTime

    const getInvite = async (id: string, startTime: string, endTime: string, videoNode: any) => {
      const table = videoNode?.table?.id
      if (id && startTime && table) {
        const api = createAPI({ resource: 'video/playback/url' })
        const { json } = await api.fetch(`?id=${id}&startTime=${startTime}&endTime=${endTime}&table=${table}`, {}) as any
        setVideoData({ type: json?.protocol, url: json?.url, driverInstanceId: json?.driverInstanceId })
        setBackUrl(json?.url)
      }
    }

    const getRecords = async (id: string, startTime: string, endTime: string, videoNode: any) => {
      const table = videoNode?.table?.id
      const api = createAPI({ resource: 'video/playback/records' })
      const { json } = await api.fetch(`?id=${id}&startTime=${startTime}&endTime=${endTime}&table=${table}`, {}) as any
      if (json?.Records?.length) {
        const datas = json?.Records.map((item: any) => ({
          ...item,
          startTime: Date.parse(new Date(item.StartTime).toISOString()) / 1000,
          endTime: Date.parse(new Date(item.EndTime).toISOString()) / 1000
        }))
        datas.sort(sortFunction)
        const end = datas[0]?.EndTime || endTime
        await getInvite(id, startTime, end, videoNode)
      } else {
        setVideoData({ ...videoData, type: null, url: null, driverInstanceId: null })
        setBackUrl('')
      }
    }

    const changeTimer = (err: any) => {
        if (err?.code == 400) {
          let videoNode = tableData || ctxTableData || point
          if (timerRef?.current) { clearTimeout(timerRef.current) }
          timerRef.current = setTimeout(async () => {
            if (videoNode?.id) {
              const res = await nodeVideoMessage(videoNode, configure?.resolution, configure?.frameRate, streamType, changeTimer)
              // @ts-ignore
              setVideoData({ type: res.videoType, url: res.videoUrl, driverInstanceId: res.driverInstanceId, frameRate: res.frameRate, resolution: res.resolution, noVideo: true, streamType: res.stream })
            }
          }, 5000)
    
        } else {
          if (timerRef?.current) { clearTimeout(timerRef.current) }
        }
    }

    React.useEffect(() => {
      (async () => {
        if (warnTableData?.tableData?.id) {
          const tableDataResult: any = await getTableData(warnTableData)
          let nextPoint = tableDataResult?._settings?.linkageVideo?.point
          if (tableDataResult?.linkageVideo?.length) {
            nextPoint = tableDataResult?.linkageVideo?.[0]
          }
          setPoint(nextPoint)
        }
      })()
    }, [warnTableData?.tableData?.id])

    // Effect to handle video type logic
    React.useEffect(() => {
      const fetchData = async () => {
        if (type == 'mp4' && videoType !== 'dataVideo') return;

        let videoNode = tableData || ctxTableData || point
        if (videoAction != 'record' || (type == 'ezopen')) {
            if (type != 'rtmp' && streamType) {
                // If it's dataVideo and we have a node, fetch url
                if (videoNode?.id && videoType === 'dataVideo') {
                    setVideoData((prev: any) => ({ ...prev, type: '', url: '' }))
                    let { videoType: vType, videoUrl, driverInstanceId, frameRate, resolution, noVideo, stream } = await nodeVideoMessage(videoNode, configure?.resolution, configure?.frameRate, streamType, changeTimer)
                    if (vType) {
                        // @ts-ignore
                        setVideoData({ type: vType, url: videoUrl, driverInstanceId, frameRate, resolution, noVideo, streamType: stream })
                    }
                } else {
                    // Custom video or direct url fallback
                    if (timerRef?.current) { clearTimeout(timerRef.current) }
                    
                    let finalUrl = url
                    if (urlSource === 'uploadUrl' && props.uploadUrl?.list?.[0]?.url) {
                        finalUrl = props.uploadUrl.list[0].url
                    }

                    setVideoData({ 
                        type: type, 
                        url: finalUrl, 
                        driverInstanceId: null, 
                        frameRate: null, 
                        resolution: null,
                        noVideo: false,
                        streamType: streamType
                    })
                }
            }
        }
      }

      fetchData()
    }, [videoAction, tableData?.id, JSON.stringify(ctxTableData), configure?.resolution, configure?.frameRate, type, url, streamType, point?.id, reload, videoType, urlSource, props.uploadUrl])

    React.useEffect(() => {
      let videoNode = tableData || ctxTableData || point
      if (videoAction == 'record' && type != 'ezopen') {
        const startTime = recordStartTime ? formatLocalDateTime(recordStartTime) : formatLocalDateTime(Date.now() - 24 * 60 * 60 * 1000)
        const endTime = recordEndTime ? formatLocalDateTime(recordEndTime) : formatLocalDateTime(Date.now())
        if (videoNode?.id && startTime && endTime) {
          const pointId = typeof videoNode?.hkvideo?.point === 'string' ? videoNode?.hkvideo?.point : videoNode?.hkvideo?.point?.id
          const id = pointId || videoNode.id
          id && startTime && endTime && getRecords(id, startTime, endTime, videoNode)
        }
      }
    }, [videoAction, tableData?.id, JSON.stringify(ctxTableData), configure?.resolution, configure?.frameRate, type, url, recordStartTime, recordEndTime, point])

    // Render logic matching VideoCommon
    const renderVideo = () => {
      // Determine effective type
      let effectiveType = (tableData?.id || (ctxTableData as any)?.id) ? videoData?.type : (type === 'hls' || type === 'm3u8') ? 'hls' : type
      let wsType = (effectiveType === 'rtsp' || effectiveType === 'ws') ? 'ws' : ''
      
      // Check for MP4/HLS/FLV conditions
      const isNativeOrSimple = (effectiveType === 'hls' || effectiveType === 'flv' || effectiveType === 'm3u8') && (videoData?.url || url) || 
                               (effectiveType === 'mp4' && (videoData?.url || url))

      if (effectiveType === 'ezopen') {
        return <EzuikitVideo videoAction={videoAction} {...props} videoData={videoData} />
      } else if (effectiveType === 'rtmp-ws') {
        return <StreamVideo rtmpType={'rtmp-ws'} setReload={setReload} reload={reload} timerRef={timerRef} videoData={videoData} {...props} tableData={tableData || vTableData} videoId={videoId} videoUid={videoId} />
      } else if ((videoData?.url && wsType === 'ws') || (wsType === 'ws' && url) || (wsType == 'ws' && videoId)) { 
        return <StreamVideo setReload={setReload} reload={reload} timerRef={timerRef} videoData={videoData} {...props} tableData={tableData || vTableData} videoId={videoId} videoUid={videoId} />
      } else if (isNativeOrSimple) {
        return <NativeVideo videoData={videoData} {...props} />
      } else if (effectiveType === 'ws-raw') {
        return <JessibucaVideo setReload={setReload} reload={reload} timerRef={timerRef} backUrl={backUrl || (props.backUrl as string)} videoData={videoData} {...props} jessConfigute={jessConfigute || configure?.jessConfigute} />
      } else if (effectiveType === 'rtmp') {
        return <Ckplayer {...props} />
      } else if (effectiveType === 'webrtc') {
        const webrtcConfig = {
          autoplay: true,
          muted: true,
          iceServers: [],
          debug: false,
          showLatency: true,
          showControls: true,
          reconnectInterval: 5000,
          reconnectAttempts: 3,
          ...props?.configure?.webrtcConfig,
          ...props?.webrtcConfig,
        }
        return <WebRTCVideo {...webrtcConfig} style={{ width: '100%', height: '100%' }} />
      } else {
        return show && defaultImage ? (
          <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={defaultImage} alt="placeholder" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-slate-100 text-slate-500">
             <div className="text-center">
               <p>暂无视频</p>
               {/* <p className="text-xs mt-1">{effectiveType ? `类型: ${effectiveType}` : ''}</p> */}
             </div>
          </div>
        )
      }
    }

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden w-full h-full", className)}
        style={{ width: props.width, height: props.height }}
      >
        {renderVideo()}
      </div>
    )
  }
)

VideoWidget.displayName = "VideoWidget"

export { VideoWidget }