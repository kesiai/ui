"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Play, Pause, Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { createAPI } from '@airiot/client'
import { VideoWidget } from '@/registry/components/video-widget/video-widget'

// 视频记录类型
export interface VideoRecord {
  startTime: number
  endTime: number
}

// 时间选择器值类型
export interface TimeHMS {
  hour: string
  minute: string
  second: string
}

export interface VideoPlaybackWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  // 视频高度
  videoHeight?: number
  // 时间轴高度
  timelineHeight?: number
  // 当前日期
  date?: Date
  // 日期改变回调
  onDateChange?: (date: Date) => void
  // 视频记录
  videoRecords?: VideoRecord[]
  // 是否播放中
  isPlaying?: boolean
  // 播放状态改变回调
  onPlayChange?: (playing: boolean) => void
  // 当前时间（秒级时间戳）
  currentTime?: number
  // 时间改变回调
  onTimeChange?: (time: number) => void
  // 视频URL
  videoUrl?: string
  // 设备信息
  tableData?: Record<string, any>
  // 背景颜色
  backgroundColor?: string
  // 时间轴背景颜色
  timelineBackground?: string
  // 时间轴刻度颜色
  timelineScaleColor?: string
  // 唯一标识
  cellKey?: string
}

// 时间选择器组件
const TimePickerHMS = ({
  value,
  onChange,
  disableFutureTime = false,
}: {
  value: TimeHMS
  onChange: (value: TimeHMS) => void
  disableFutureTime?: boolean
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))
  const seconds = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentSecond = now.getSeconds()

  return (
    <div className="flex items-center gap-1">
      <select
        value={value.hour}
        onChange={(e) => onChange({ ...value, hour: e.target.value })}
        className="px-2 py-1 border rounded text-sm bg-white"
      >
        {hours.map((h) => (
          <option
            key={h}
            value={h}
            disabled={disableFutureTime && parseInt(h) > currentHour}
          >
            {h}
          </option>
        ))}
      </select>
      <span>:</span>
      <select
        value={value.minute}
        onChange={(e) => onChange({ ...value, minute: e.target.value })}
        className="px-2 py-1 border rounded text-sm bg-white"
      >
        {minutes.map((m) => (
          <option
            key={m}
            value={m}
            disabled={
              disableFutureTime &&
              parseInt(value.hour) === currentHour &&
              parseInt(m) > currentMinute
            }
          >
            {m}
          </option>
        ))}
      </select>
      <span>:</span>
      <select
        value={value.second}
        onChange={(e) => onChange({ ...value, second: e.target.value })}
        className="px-2 py-1 border rounded text-sm bg-white"
      >
        {seconds.map((s) => (
          <option
            key={s}
            value={s}
            disabled={
              disableFutureTime &&
              parseInt(value.hour) === currentHour &&
              parseInt(value.minute) === currentMinute &&
              parseInt(s) > currentSecond
            }
          >
            {s}
          </option>
        ))}
      </select>
    </div>
  )
}

// 简化版时间轴组件
const SimpleTimeline = ({
  width,
  height,
  currentTime,
  videoRecords,
  onTimeChange,
  background,
  scaleColor,
}: {
  width: number
  height: number
  currentTime: number
  videoRecords: VideoRecord[]
  onTimeChange: (time: number) => void
  background: string
  scaleColor: string
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const dragStartRef = React.useRef({ x: 0, time: 0 })

  // 绘制时间轴
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    // 绘制背景
    ctx.fillStyle = background
    ctx.fillRect(0, 0, width, height)

    // 绘制视频区域
    videoRecords.forEach((record) => {
      const dayStart = new Date(currentTime * 1000)
      dayStart.setHours(0, 0, 0, 0)
      const dayStartTimestamp = Math.floor(dayStart.getTime() / 1000)

      const startOffset = ((record.startTime - dayStartTimestamp) / (24 * 60 * 60)) * width
      const endOffset = ((record.endTime - dayStartTimestamp) / (24 * 60 * 60)) * width
      const rectWidth = endOffset - startOffset

      if (rectWidth > 0 && startOffset < width && endOffset > 0) {
        ctx.fillStyle = "rgba(251, 191, 36, 0.8)"
        ctx.fillRect(Math.max(0, startOffset), 0, Math.min(rectWidth, width - startOffset), height)
      }
    })

    // 绘制刻度
    for (let i = 0; i <= 24; i++) {
      const x = (i / 24) * width
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, i % 2 === 0 ? 20 : 10)
      ctx.strokeStyle = scaleColor
      ctx.lineWidth = 1
      ctx.stroke()

      if (i % 2 === 0 && i < 24) {
        ctx.font = "10px Arial"
        ctx.fillStyle = scaleColor
        ctx.fillText(`${i.toString().padStart(2, "0")}:00`, x + 2, height - 5)
      }
    }

    // 绘制当前时间指针
    const dayStart = new Date(currentTime * 1000)
    dayStart.setHours(0, 0, 0, 0)
    const dayStartTimestamp = Math.floor(dayStart.getTime() / 1000)
    const currentOffset = ((currentTime - dayStartTimestamp) / (24 * 60 * 60)) * width

    ctx.beginPath()
    ctx.moveTo(currentOffset, 0)
    ctx.lineTo(currentOffset, height)
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.stroke()
  }, [width, height, currentTime, videoRecords, background, scaleColor])

  // 处理点击
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = x / width

    const dayStart = new Date(currentTime * 1000)
    dayStart.setHours(0, 0, 0, 0)
    const dayStartTimestamp = Math.floor(dayStart.getTime() / 1000)
    const newTime = dayStartTimestamp + Math.floor(ratio * 24 * 60 * 60)

    onTimeChange(newTime)
  }

  // 处理拖拽
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, time: currentTime }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return
    const delta = e.clientX - dragStartRef.current.x
    const timeDelta = Math.floor((delta / width) * 24 * 60 * 60)
    onTimeChange(dragStartRef.current.time + timeDelta)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="cursor-pointer"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  )
}

const VideoPlaybackWidget = React.forwardRef<HTMLDivElement, VideoPlaybackWidgetProps>(
  (
    {
      className,
      videoHeight = 400,
      timelineHeight = 50,
      date: propDate,
      onDateChange,
      videoRecords = [],
      isPlaying: propIsPlaying = false,
      onPlayChange,
      currentTime: propCurrentTime,
      onTimeChange,
      videoUrl,
      tableData,
      backgroundColor = "rgba(13, 14, 27, 0.7)",
      timelineBackground = "#374151",
      timelineScaleColor = "#ffffff",
      cellKey = "playback",
      ...props
    },
    ref
  ) => {
    const [date, setDate] = React.useState<Date>(propDate || new Date())
    const [isPlaying, setIsPlaying] = React.useState(propIsPlaying)
    const [currentTime, setCurrentTime] = React.useState(
      propCurrentTime || Math.floor(new Date().setHours(0, 0, 0, 0) / 1000)
    )
    const [hms, setHms] = React.useState<TimeHMS>({ hour: "00", minute: "00", second: "00" })
    const [width, setWidth] = React.useState(600)
    const [records, setRecords] = React.useState<VideoRecord[]>(videoRecords)
    const [playback, setPlayback] = React.useState<{ current: any; play: boolean }>(() => ({ current: null, play: propIsPlaying }))
    const isUserInteracting = React.useRef(false)
    const lastUserActionTime = React.useRef(0)
    const containerRef = React.useRef<HTMLDivElement>(null)

    // 同步外部状态
    React.useEffect(() => {
      if (propDate) setDate(propDate)
    }, [propDate])

    React.useEffect(() => {
      setIsPlaying(propIsPlaying)
      setPlayback(prev => ({ ...prev, play: propIsPlaying }))
    }, [propIsPlaying])

    React.useEffect(() => {
      if (propCurrentTime !== undefined) {
        setCurrentTime(propCurrentTime)
        // 更新 HMS
        const d = new Date(propCurrentTime * 1000)
        setHms({
          hour: d.getHours().toString().padStart(2, "0"),
          minute: d.getMinutes().toString().padStart(2, "0"),
          second: d.getSeconds().toString().padStart(2, "0"),
        })
      }
    }, [propCurrentTime])

    // 获取容器宽度
    React.useEffect(() => {
      const updateWidth = () => {
        if (containerRef.current) {
          setWidth(containerRef.current.clientWidth)
        }
      }
      updateWidth()
      window.addEventListener("resize", updateWidth)
      return () => window.removeEventListener("resize", updateWidth)
    }, [])

    const formatUtcDateTime = (value: Date) => {
      const pad = (num: number) => num.toString().padStart(2, "0")
      return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}Z`
    }

    const hasVideoOnDate = (targetTimestamp: number, videoList: VideoRecord[]) => {
      if (!videoList?.length) return false
      return videoList.some((record) => {
        const recordStart = parseInt(record.startTime as any)
        const recordEnd = parseInt(record.endTime as any)
        return recordStart <= targetTimestamp && targetTimestamp <= recordEnd
      })
    }

    const findNearestVideoRecord = (targetTimestamp: number, videoList: VideoRecord[]) => {
      if (!videoList?.length) return null
      let nearest: VideoRecord | null = null
      let minDistance = Infinity
      videoList.forEach((record) => {
        const recordStart = parseInt(record.startTime as any)
        const recordEnd = parseInt(record.endTime as any)
        if (recordStart <= targetTimestamp && targetTimestamp <= recordEnd) {
          nearest = record
          minDistance = 0
          return
        }
        const distance = Math.min(Math.abs(targetTimestamp - recordStart), Math.abs(targetTimestamp - recordEnd))
        if (distance < minDistance) {
          minDistance = distance
          nearest = record
        }
      })
      return nearest
    }

    const getRecords = React.useCallback(async (targetDate: Date) => {
      if (!tableData?.id || !tableData?.table?.id) return
      const start = new Date(targetDate)
      start.setHours(0, 0, 0, 0)
      const end = new Date(targetDate)
      end.setHours(23, 59, 59, 0)
      const startTime = formatUtcDateTime(start)
      const endTime = formatUtcDateTime(end)
      const api = createAPI({ resource: 'video/playback/records' })
      const { json } = await api.fetch(`?id=${tableData.id}&startTime=${startTime}&endTime=${endTime}&table=${tableData.table.id}`, {}) as any
      if (json?.Records?.length) {
        const mapped = json.Records.map((item: any) => ({
          ...item,
          startTime: Date.parse(new Date(item.StartTime).toISOString()) / 1000,
          endTime: Date.parse(new Date(item.EndTime).toISOString()) / 1000
        }))
        setRecords(mapped)
      } else {
        setRecords([])
      }
    }, [tableData?.id, tableData?.table?.id])

    const getInvite = React.useCallback(async (startTime: string) => {
      if (!tableData?.id || !tableData?.table?.id) return
      const endTime = formatUtcDateTime(new Date(new Date(startTime).getTime() + 60 * 60 * 1000))
      const api = createAPI({ resource: 'video/playback/url' })
      const { json } = await api.fetch(`?id=${tableData.id}&startTime=${startTime}&endTime=${endTime}&table=${tableData.table.id}`, {}) as any
      setPlayback(prev => ({
        ...prev,
        current: {
          ...json,
          startTime,
          startTimestamp: Math.floor(new Date(startTime).getTime() / 1000)
        }
      }))
      setIsPlaying(true)
      onPlayChange?.(true)
    }, [tableData?.id, tableData?.table?.id, onPlayChange])

    React.useEffect(() => {
      if (tableData?.id) {
        getRecords(date)
      }
    }, [tableData?.id, date, getRecords])

    // 处理日期改变
    const handleDateChange = (newDate: Date | undefined) => {
      if (newDate) {
        setDate(newDate)
        const dayStart = Math.floor(newDate.setHours(0, 0, 0, 0) / 1000)
        setCurrentTime(dayStart)
        setHms({ hour: "00", minute: "00", second: "00" })
        onDateChange?.(newDate)
        if (tableData?.id) {
          getRecords(newDate)
        }
      }
    }

    // 处理播放/暂停
    const handlePlayToggle = () => {
      const newState = !isPlaying
      setIsPlaying(newState)
      setPlayback(prev => ({ ...prev, play: newState }))
      onPlayChange?.(newState)
    }

    // 处理时间选择器改变
    const handleHmsChange = (value: TimeHMS) => {
      lastUserActionTime.current = Date.now()
      isUserInteracting.current = true
      setHms(value)
      const dayStart = new Date(date)
      dayStart.setHours(parseInt(value.hour), parseInt(value.minute), parseInt(value.second), 0)
      const newTime = Math.floor(dayStart.getTime() / 1000)
      setCurrentTime(newTime)
      onTimeChange?.(newTime)
      if (tableData?.id) {
        if (hasVideoOnDate(newTime, records)) {
          getInvite(formatUtcDateTime(new Date(newTime * 1000)))
        } else {
          const nearest = findNearestVideoRecord(newTime, records)
          if (nearest) {
            const nearestStart = parseInt(nearest.startTime as any)
            setCurrentTime(nearestStart)
            const nearestDate = new Date(nearestStart * 1000)
            getInvite(formatUtcDateTime(nearestDate))
          }
        }
      }
      setTimeout(() => {
        isUserInteracting.current = false
      }, 500)
    }

    // 处理时间轴时间改变
    const handleTimelineChange = (time: number) => {
      lastUserActionTime.current = Date.now()
      isUserInteracting.current = true
      setCurrentTime(time)
      const d = new Date(time * 1000)
      setHms({
        hour: d.getHours().toString().padStart(2, "0"),
        minute: d.getMinutes().toString().padStart(2, "0"),
        second: d.getSeconds().toString().padStart(2, "0"),
      })
      onTimeChange?.(time)
      if (tableData?.id) {
        if (hasVideoOnDate(time, records)) {
          getInvite(formatUtcDateTime(d))
        } else {
          const nearest = findNearestVideoRecord(time, records)
          if (nearest) {
            const nearestStart = parseInt(nearest.startTime as any)
            setCurrentTime(nearestStart)
            const nearestDate = new Date(nearestStart * 1000)
            getInvite(formatUtcDateTime(nearestDate))
          }
        }
      }
      setTimeout(() => {
        isUserInteracting.current = false
      }, 500)
    }

    // 判断是否为今天
    const isToday = React.useMemo(() => {
      const today = new Date()
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      )
    }, [date])

    // 格式化当前时间显示
    const currentTimeDisplay = React.useMemo(() => {
      const d = new Date(currentTime * 1000)
      return format(d, "yyyy-MM-dd HH:mm:ss")
    }, [currentTime])

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {/* 日期选择器 */}
        <div className="flex justify-end mb-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                {format(date, "yyyy-MM-dd", { locale: zhCN })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                locale={zhCN}
                disabled={(d: Date) => d > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* 视频播放区域 */}
        <div
          className="relative flex items-center justify-center"
          style={{ height: videoHeight, backgroundColor }}
        >
          {playback.current?.url ? (
            <VideoWidget
              videoAction="record"
              playback={playback}
              type={playback.current?.protocol}
              url={playback.current?.url}
              tableData={tableData}
              playbackStartTime={playback.current?.startTime}
              playbackStartTimestamp={playback.current?.startTimestamp}
            />
          ) : (
            <div className="text-gray-400 text-sm">暂无视频</div>
          )}
          {/* 当前时间显示 */}
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentTimeDisplay}
          </div>
        </div>

        {/* 控制栏 */}
        <div className="flex items-center justify-between mt-3 mb-3">
          <Button
            variant="default"
            size="icon"
            className="rounded-full"
            onClick={handlePlayToggle}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <TimePickerHMS
            value={hms}
            onChange={handleHmsChange}
            disableFutureTime={isToday}
          />
        </div>

        {/* 时间轴 */}
        <div ref={containerRef} className="mt-4">
          <SimpleTimeline
            width={width}
            height={timelineHeight}
            currentTime={currentTime}
            videoRecords={records}
            onTimeChange={handleTimelineChange}
            background={timelineBackground}
            scaleColor={timelineScaleColor}
          />
        </div>
      </div>
    )
  }
)

VideoPlaybackWidget.displayName = "VideoPlaybackWidget"

export { VideoPlaybackWidget }
