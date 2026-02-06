import * as React from "react"
import { cn } from "@/lib/utils"

export interface StatusConfig {
  /**
   * 状态名称
   */
  name: string
  /**
   * 激活类型：固定值或范围
   */
  activeType?: 'value' | 'range'
  /**
   * 匹配的固定值
   */
  activeValue?: string | number | boolean
  /**
   * 范围最小值（包含）
   */
  minValue?: number
  /**
   * 范围最大值（不包含）
   */
  maxValue?: number
  /**
   * 显示文字
   */
  text?: string
  /**
   * 背景色
   */
  bgColor?: string
  /**
   * 文字颜色
   */
  textColor?: string
  /**
   * 背景图片
   */
  backgroundImage?: string
  /**
   * 音频文件 URL
   */
  audioSrc?: string
}

export interface StatusProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 当前值，用于匹配状态
   */
  value?: string | number | boolean
  /**
   * 状态配置数组
   */
  statuses?: StatusConfig[]
  /**
   * 状态切换时是否闪烁
   * @default false
   */
  blinkOnStateChange?: boolean
  /**
   * 宽度
   */
  width?: string | number
  /**
   * 高度
   */
  height?: string | number
}

const Status = React.forwardRef<HTMLDivElement, StatusProps>(
  (
    {
      className,
      value,
      statuses = [],
      blinkOnStateChange = false,
      width,
      height,
      ...props
    },
    ref
  ) => {
    const prevStatusRef = React.useRef<StatusConfig | null>(null)
    const [isBlinking, setIsBlinking] = React.useState(false)
    const audioRef = React.useRef<HTMLAudioElement | null>(null)

    // 查找匹配的状态
    const currentStatus = React.useMemo(() => {
      if (!statuses || statuses.length === 0) {
        return null
      }

      // 如果 value 未定义，返回默认状态（activeValue 为 'false' 或 '0' 的状态）
      if (value === undefined || value === null) {
        return statuses.find(
          (s) => s.activeValue === 'false' || s.activeValue === '0' || s.activeValue === false
        ) || null
      }

      // 遍历状态数组，找到第一个匹配的状态
      for (const status of statuses) {
        if (!status.activeType) {
          // 如果没有指定类型，默认使用固定值匹配
          if (status.activeValue === value) {
            return status
          }
        } else if (status.activeType === 'value') {
          // 固定值匹配
          if (status.activeValue === value) {
            return status
          }
        } else if (status.activeType === 'range') {
          // 范围匹配（左闭右开区间）
          if (
            typeof value === 'number' &&
            status.minValue !== undefined &&
            status.maxValue !== undefined
          ) {
            if (value >= status.minValue && value < status.maxValue) {
              return status
            }
          }
        }
      }

      return null
    }, [value, statuses])

    // 状态切换时触发闪烁动画和播放音频
    React.useEffect(() => {
      if (currentStatus && currentStatus !== prevStatusRef.current) {
        // 触发闪烁动画
        if (blinkOnStateChange) {
          setIsBlinking(true)
          setTimeout(() => {
            setIsBlinking(false)
          }, 2000)
        }

        // 播放音频
        if (currentStatus.audioSrc) {
          // 停止之前的音频
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
          }

          // 创建并播放新音频
          const audio = new Audio(currentStatus.audioSrc)
          audioRef.current = audio
          audio.play().catch((error) => {
            console.warn('音频播放失败:', error)
          })
        }
      }
      prevStatusRef.current = currentStatus
    }, [currentStatus, blinkOnStateChange])

    // 计算样式
    const containerStyle = React.useMemo(() => {
      const style: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
      }

      if (width !== undefined) {
        style.width = typeof width === 'number' ? `${width}px` : width
      }
      if (height !== undefined) {
        style.height = typeof height === 'number' ? `${height}px` : height
      }

      if (currentStatus) {
        if (currentStatus.bgColor) {
          style.backgroundColor = currentStatus.bgColor
        }
        if (currentStatus.backgroundImage) {
          style.backgroundImage = `url('${currentStatus.backgroundImage}')`
        }
        if (currentStatus.textColor) {
          style.color = currentStatus.textColor
        }
      }

      // 添加闪烁动画
      if (isBlinking) {
        style.animation = 'blink-animation 0.5s ease-in-out 3'
      }

      return style
    }, [currentStatus, width, height, isBlinking])

    return (
      <div
        ref={ref}
        className={cn(
          "status-component",
          isBlinking && "status-blink",
          className
        )}
        style={containerStyle}
        {...props}
      >
        {currentStatus?.text || (value !== undefined ? String(value) : '-')}
      </div>
    )
  }
)

Status.displayName = "Status"

export { Status }
