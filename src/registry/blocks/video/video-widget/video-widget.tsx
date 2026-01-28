import * as React from "react"
import { cn } from "@/lib/utils"

export type VideoType = "mp4" | "flv" | "hls" | "m3u8" | "rtmp" | "rtsp"

export interface VideoWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 视频类型
   */
  type?: VideoType
  /**
   * 视频地址
   */
  url?: string
  /**
   * 是否自动播放
   */
  autoplay?: boolean
  /**
   * 是否循环播放
   */
  loop?: boolean
  /**
   * 是否显示控制栏
   */
  controls?: boolean
  /**
   * 是否静音
   */
  muted?: boolean
  /**
   * 视频宽度
   */
  width?: number | string
  /**
   * 视频高度
   */
  height?: number | string
  /**
   * 占位图
   */
  poster?: string
  /**
   * 错误重连时间（秒）
   */
  errorReload?: number
  /**
   * 是否显示占位图
   */
  showPlaceholder?: boolean
  /**
   * 默认占位图片
   */
  defaultImage?: string
}

const VideoWidget = React.forwardRef<HTMLDivElement, VideoWidgetProps>(
  (
    {
      className,
      type = "mp4",
      url = "",
      autoplay = false,
      loop = false,
      controls = true,
      muted = false,
      width = "100%",
      height = "100%",
      poster,
      errorReload = 5,
      showPlaceholder = false,
      defaultImage,
      ...props
    },
    ref
  ) => {
    const [error, setError] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const videoRef = React.useRef<HTMLVideoElement>(null)

    React.useEffect(() => {
      if (!url) {
        setError(true)
        setLoading(false)
        return
      }

      setError(false)
      setLoading(true)

      const video = videoRef.current
      if (video) {
        const handleLoadStart = () => setLoading(true)
        const handleCanPlay = () => setLoading(false)
        const handleError = () => {
          setError(true)
          setLoading(false)
          // 简单的重连逻辑
          if (errorReload > 0) {
            setTimeout(() => {
              video.load()
            }, errorReload * 1000)
          }
        }

        video.addEventListener('loadstart', handleLoadStart)
        video.addEventListener('canplay', handleCanPlay)
        video.addEventListener('error', handleError)

        return () => {
          video.removeEventListener('loadstart', handleLoadStart)
          video.removeEventListener('canplay', handleCanPlay)
          video.removeEventListener('error', handleError)
        }
      }
    }, [url, errorReload])

    const renderVideo = () => {
      if (error && showPlaceholder && defaultImage) {
        return (
          <img 
            src={defaultImage} 
            alt="视频占位图" 
            className="w-full h-full object-cover"
            style={{ width, height }}
          />
        )
      }

      if (error || !url) {
        return (
          <div 
            className={cn(
              "flex items-center justify-center bg-slate-100 text-slate-500",
              "w-full h-full"
            )}
            style={{ width, height }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">📹</div>
              <p className="text-sm">
                {error ? "视频加载失败" : "暂无视频"}
              </p>
            </div>
          </div>
        )
      }

      // 对于 mp4 和 m3u8，使用原生 video 标签
      if (type === "mp4" || type === "m3u8" || type === "hls") {
        return (
          <>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
                  <p className="text-sm text-slate-600">加载中...</p>
                </div>
              </div>
            )}
            <video
              ref={videoRef}
              className={cn("w-full h-full", className)}
              style={{ width, height }}
              autoPlay={autoplay}
              loop={loop}
              controls={controls}
              muted={muted}
              poster={poster}
              playsInline
            >
              <source src={url} type={type === "m3u8" || type === "hls" ? "application/x-mpegURL" : "video/mp4"} />
              您的浏览器不支持视频播放。
            </video>
          </>
        )
      }

      // 对于其他类型，显示提示信息
      return (
        <div 
          className={cn(
            "flex items-center justify-center bg-slate-100 text-slate-500",
            "w-full h-full"
          )}
          style={{ width, height }}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">📹</div>
            <p className="text-sm">
              {type} 类型视频播放器
            </p>
            <p className="text-xs mt-1">
              {url ? `地址: ${url}` : "请配置视频地址"}
            </p>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        style={{ width, height }}
        {...props}
      >
        {renderVideo()}
      </div>
    )
  }
)

VideoWidget.displayName = "VideoWidget"

export { VideoWidget }
