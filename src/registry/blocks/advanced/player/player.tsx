import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  RotateCcw,
  Settings,
  X,
} from "lucide-react"

export interface AudioTrack {
  /**
   * 音频文件 URL
   */
  src: string
  /**
   * 音频标题
   */
  title?: string
  /**
   * 音频类型 (mp3, wav, ogg, etc.)
   */
  type?: string
}

export interface PlayerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onProgress' | 'onVolumeChange'> {
  /**
   * 音频列表
   */
  playlist?: AudioTrack[] | string
  /**
   * 初始音频索引
   * @default 0
   */
  initialIndex?: number
  /**
   * 是否显示控制按钮
   * @default true
   */
  showControls?: boolean
  /**
   * 是否显示进度条
   * @default true
   */
  showProgress?: boolean
  /**
   * 是否显示音量控制
   * @default true
   */
  showVolume?: boolean
  /**
   * 是否显示播放列表
   * @default false
   */
  showPlaylist?: boolean
  /**
   * 单曲循环
   * @default false
   */
  loop?: boolean
  /**
   * 列表循环
   * @default false
   */
  loopAll?: boolean
  /**
   * 自动播放下一首
   * @default false
   */
  autoNext?: boolean
  /**
   * 自动播放
   * @default false
   */
  autoplay?: boolean
  /**
   * 初始音量 (0-1)
   * @default 1
   */
  initialVolume?: number
  /**
   * 宽度
   */
  width?: string | number
  /**
   * 高度
   * @default 40
   */
  height?: string | number
  /**
   * 进度变化回调
   */
  onProgress?: (progress: { played: number; playedSeconds: number; loadedSeconds: number }) => void
  /**
   * 播放状态变化回调
   */
  onPlayerStateChange?: (playing: boolean) => void
  /**
   * 音轨变化回调
   */
  onTrackChange?: (index: number, track: AudioTrack) => void
  /**
   * 音量变化回调
   */
  onVolumeChange?: (volume: number) => void
}

// 播放列表组件
const PlayList: React.FC<{
  playlist: AudioTrack[]
  currentIndex: number
  isPlaying: boolean
  onPlayTrack: (index: number) => void
  onClose: () => void
}> = ({ playlist, currentIndex, isPlaying, onPlayTrack, onClose }) => {
  return (
    <div className="absolute bottom-full left-0 mb-2 w-64 max-h-80 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between p-3 border-b border-slate-200">
        <span className="text-sm font-medium text-slate-700">播放列表</span>
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center w-6 h-6 p-0 border-0 bg-transparent rounded cursor-pointer text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
        >
          <X size={14} />
        </button>
      </div>
      <div className="p-2 space-y-1">
        {playlist.map((track, index) => {
          const isActive = index === currentIndex && isPlaying
          return (
            <button
              key={index}
              onClick={() => onPlayTrack(index)}
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-md text-left transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              )}
            >
              <div className={cn(
                "w-6 h-6 flex items-center justify-center rounded text-xs font-medium",
                isActive ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-600"
              )}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{track.title || `音频 ${index + 1}`}</p>
                {isActive && isPlaying && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
              {isActive ? (
                <Play size={14} className="text-blue-500" />
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const Player = React.forwardRef<HTMLDivElement, PlayerProps>(
  (
    {
      className,
      playlist = [],
      initialIndex = 0,
      showControls = true,
      showProgress = true,
      showVolume = true,
      showPlaylist = false,
      loop = false,
      loopAll = false,
      autoNext = false,
      autoplay = false,
      initialVolume = 1,
      width,
      height = 40,
      onProgress,
      onPlayerStateChange,
      onTrackChange,
      onVolumeChange,
      ...props
    },
    ref
  ) => {
    const audioRef = React.useRef<HTMLAudioElement>(null)
    const progressBarRef = React.useRef<HTMLInputElement>(null)
    const [showPlaylistPanel, setShowPlaylistPanel] = React.useState(false)
    const playlistButtonRef = React.useRef<HTMLButtonElement>(null)

    // 解析播放列表
    const audioList = React.useMemo<AudioTrack[]>(() => {
      if (!playlist) return []
      if (typeof playlist === 'string') {
        return [{ src: playlist, title: playlist }]
      }
      if (Array.isArray(playlist)) {
        return playlist.map((item) => {
          if (typeof item === 'string') {
            return { src: item, title: item }
          }
          return item
        })
      }
      return []
    }, [playlist])

    // 播放状态
    const [playing, setPlaying] = React.useState(false)
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex)
    const [volume, setVolume] = React.useState(initialVolume)
    const [muted, setMuted] = React.useState(false)
    const [progress, setProgress] = React.useState(0)
    const [duration, setDuration] = React.useState(0)
    const [currentTime, setCurrentTime] = React.useState(0)

    // 当前音频
    const currentAudio = audioList[currentIndex] || null

    // 播放/暂停
    const togglePlay = () => {
      if (!audioRef.current) return

      if (playing) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => {
          console.warn('播放失败:', error)
        })
      }
    }

    // 上一首
    const playPrevious = () => {
      if (audioList.length === 0) return

      const newIndex = currentIndex === 0 ? audioList.length - 1 : currentIndex - 1
      setCurrentIndex(newIndex)
      setPlaying(true)
    }

    // 下一首
    const playNext = () => {
      if (audioList.length === 0) return

      let newIndex: number

      if (loopAll) {
        newIndex = currentIndex === audioList.length - 1 ? 0 : currentIndex + 1
      } else {
        if (currentIndex === audioList.length - 1) {
          setPlaying(false)
          return
        }
        newIndex = currentIndex + 1
      }

      setCurrentIndex(newIndex)
      setPlaying(true)
    }

    // 静音切换
    const toggleMute = () => {
      setMuted(!muted)
    }

    // 音量变化
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value)
      setVolume(newVolume)
      setMuted(newVolume === 0)
    }

    // 进度条拖动
    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!audioRef.current) return

      const newProgress = parseFloat(e.target.value)
      audioRef.current.currentTime = (newProgress / 100) * duration
    }

    // 跳转到指定音轨
    const playTrack = (index: number) => {
      if (index < 0 || index >= audioList.length) return
      setCurrentIndex(index)
      setPlaying(true)
      setShowPlaylistPanel(false)
    }

    // 格式化时间
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // 点击外部关闭播放列表
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (showPlaylistPanel &&
            playlistButtonRef.current &&
            !playlistButtonRef.current.contains(event.target as Node) &&
            !(event.target as HTMLElement).closest('.player-list-panel')) {
          setShowPlaylistPanel(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [showPlaylistPanel])

    // 自动播放
    React.useEffect(() => {
      if (autoplay && audioRef.current && audioList.length > 0) {
        audioRef.current.play().catch((error) => {
          console.warn('自动播放失败:', error)
        })
      }
    }, [autoplay, audioList])

    // 播放状态变化回调
    React.useEffect(() => {
      onPlayerStateChange?.(playing)
    }, [playing, onPlayerStateChange])

    // 音轨索引变化时自动播放
    React.useEffect(() => {
      if (audioRef.current && audioList.length > 0) {
        audioRef.current.play().catch((error) => {
          console.warn('播放失败:', error)
        })
      }
    }, [currentIndex])

    // 音轨变化回调
    React.useEffect(() => {
      if (currentAudio) {
        onTrackChange?.(currentIndex, currentAudio)
      }
    }, [currentIndex, currentAudio, onTrackChange])

    // 音量变化回调
    React.useEffect(() => {
      onVolumeChange?.(volume)
    }, [volume, onVolumeChange])

    // 设置音频音量
    React.useEffect(() => {
      if (audioRef.current) {
        audioRef.current.volume = muted ? 0 : volume
      }
    }, [volume, muted])

    // 音频事件处理
    React.useEffect(() => {
      const audio = audioRef.current
      if (!audio) return

      const handlePlay = () => setPlaying(true)
      const handlePause = () => setPlaying(false)
      const handleTimeUpdate = () => {
        const current = audio.currentTime
        const dur = audio.duration
        setCurrentTime(current)
        if (dur > 0) {
          const prog = (current / dur) * 100
          setProgress(prog)
          onProgress?.({
            played: prog / 100,
            playedSeconds: current,
            loadedSeconds: dur,
          })
        }
      }
      const handleLoadedMetadata = () => {
        setDuration(audio.duration)
      }
      const handleEnded = () => {
        if (loop) {
          audio.currentTime = 0
          audio.play()
        } else if (autoNext) {
          playNext()
        } else {
          setPlaying(false)
        }
      }

      audio.addEventListener('play', handlePlay)
      audio.addEventListener('pause', handlePause)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('ended', handleEnded)

      return () => {
        audio.removeEventListener('play', handlePlay)
        audio.removeEventListener('pause', handlePause)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('ended', handleEnded)
      }
    }, [loop, autoNext, onProgress])

    // 容器样式
    const containerStyle = React.useMemo(() => {
      const style: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }

      if (width !== undefined) {
        style.width = typeof width === 'number' ? `${width}px` : width
      }
      if (height !== undefined) {
        style.height = typeof height === 'number' ? `${height}px` : height
      }

      return style
    }, [width, height])

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg transition-colors duration-200 hover:border-slate-300 relative",
          className
        )}
        style={containerStyle}
        {...props}
      >
        <audio
          ref={audioRef}
          src={currentAudio?.src}
          loop={loop}
        />

        {/* 播放列表 */}
        {showPlaylist && audioList.length > 1 && (
          <div className="relative">
            <button
              ref={playlistButtonRef}
              className={cn(
                "inline-flex items-center justify-center w-8 h-8 p-0 border-0 bg-transparent rounded-md cursor-pointer transition-all duration-200",
                showPlaylistPanel
                  ? "text-blue-500 bg-blue-50"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              )}
              onClick={() => setShowPlaylistPanel(!showPlaylistPanel)}
              title="播放列表"
            >
              <Settings size={16} />
            </button>
            {showPlaylistPanel && (
              <div className="player-list-panel">
                <PlayList
                  playlist={audioList}
                  currentIndex={currentIndex}
                  isPlaying={playing}
                  onPlayTrack={playTrack}
                  onClose={() => setShowPlaylistPanel(false)}
                />
              </div>
            )}
          </div>
        )}

        {/* 上一首 */}
        {audioList.length > 1 && showControls && (
          <button
            className="inline-flex items-center justify-center w-8 h-8 p-0 border-0 bg-transparent rounded-md cursor-pointer text-slate-500 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
            onClick={playPrevious}
            title="上一首"
          >
            <SkipBack size={16} />
          </button>
        )}

        {/* 播放/暂停 */}
        {showControls && (
          <button
            className={cn(
              "inline-flex items-center justify-center w-10 h-10 p-0 border-0 rounded-md cursor-pointer bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2",
              "hover:text-white"
            )}
            onClick={togglePlay}
            title={playing ? "暂停" : "播放"}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
        )}

        {/* 下一首 */}
        {audioList.length > 1 && showControls && (
          <button
            className="inline-flex items-center justify-center w-8 h-8 p-0 border-0 bg-transparent rounded-md cursor-pointer text-slate-500 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
            onClick={playNext}
            title="下一首"
          >
            <SkipForward size={16} />
          </button>
        )}

        {/* 进度条 */}
        {showProgress && (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="min-w-10 text-center text-xs text-slate-500 tabular-nums">{formatTime(currentTime)}</span>
            <input
              ref={progressBarRef}
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="flex-1 h-1.5 appearance-none bg-slate-200 rounded-md outline-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 ${progress}%, #e5e7eb ${progress}%)`
              }}
            />
            <span className="min-w-10 text-center text-xs text-slate-500 tabular-nums">{formatTime(duration)}</span>
          </div>
        )}

        {/* 音量控制 */}
        {showVolume && (
          <div className="flex items-center gap-1.5">
            <button
              className="inline-flex items-center justify-center w-8 h-8 p-0 border-0 bg-transparent rounded-md cursor-pointer text-slate-500 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
              onClick={toggleMute}
              title={muted ? "取消静音" : "静音"}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 appearance-none bg-slate-200 rounded-md outline-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 ${(muted ? 0 : volume) * 100}%, #e5e7eb ${(muted ? 0 : volume) * 100}%)`
              }}
            />
          </div>
        )}

        {/* 循环模式 */}
        {(loop || loopAll) && (
          <button
            className="inline-flex items-center justify-center w-8 h-8 p-0 border-0 bg-transparent rounded-md cursor-pointer text-blue-500 bg-blue-50 hover:bg-blue-100 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
            title={loop ? "单曲循环" : "列表循环"}
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    )
  }
)

Player.displayName = "Player"

export { Player }
