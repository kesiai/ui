"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { createAPI } from '@airiot/client'

// 视频记录类型
export interface VideoRecord {
  startTime: number | string
  endTime: number | string
  StartTime?: string
  EndTime?: string
}

// 轴配置类型
export interface AxisConfiguration {
  scaleColor?: string
  background?: string
  textColor?: string
  textSize?: number
}

export interface TimeAxisWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  // 宽度
  width?: number
  // 高度
  height?: number
  // 当前时间（秒级时间戳）
  currentTime?: number
  // 视频记录数组
  videoRecords?: VideoRecord[]
  // 设备信息
  tableData?: Record<string, any>
  // 轴配置
  axisConfiguration?: AxisConfiguration
  // 时间改变回调
  onTimeChange?: (time: number, direction?: "left" | "right") => void
  // 是否只读
  readonly?: boolean
}

const TimeAxisWidget = React.forwardRef<HTMLDivElement, TimeAxisWidgetProps>(
  (
    {
      className,
      width = 600,
      height = 50,
      currentTime: propCurrentTime,
      videoRecords = [],
      tableData,
      axisConfiguration = {},
      onTimeChange,
      readonly = false,
      ...props
    },
    ref
  ) => {
    const [currentTime, setCurrentTime] = React.useState(
      propCurrentTime || Math.floor(Date.now() / 1000)
    )
    const [tipShow, setTipShow] = React.useState(false)
    const [mouseX, setMouseX] = React.useState(0)
    const [pointTime, setPointTime] = React.useState("")
    const [records, setRecords] = React.useState<VideoRecord[]>(videoRecords)

    const videoCanvasRef = React.useRef<HTMLCanvasElement>(null)
    const scaleCanvasRef = React.useRef<HTMLCanvasElement>(null)
    const interactionCanvasRef = React.useRef<HTMLCanvasElement>(null)
    const isDraggingRef = React.useRef(false)
    const dragStartXRef = React.useRef(0)
    const dragStartTimeRef = React.useRef(0)

    const {
      scaleColor = "#ffffff",
      background = "#374151",
      textColor = "#ffffff",
      textSize = 12,
    } = axisConfiguration

    // 同步外部时间
    React.useEffect(() => {
      if (propCurrentTime !== undefined) {
        setCurrentTime(propCurrentTime)
      }
    }, [propCurrentTime])

    React.useEffect(() => {
      if (!tableData?.id) {
        setRecords(videoRecords)
      }
    }, [JSON.stringify(videoRecords), tableData?.id])

    const formatUtcDateTime = (value: Date) => {
      const pad = (num: number) => num.toString().padStart(2, "0")
      return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}Z`
    }

    const getRecords = React.useCallback(async (targetTime: number) => {
      if (!tableData?.id || !tableData?.table?.id) return
      const start = new Date(targetTime * 1000)
      start.setHours(0, 0, 0, 0)
      const end = new Date(targetTime * 1000)
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

    React.useEffect(() => {
      if (tableData?.id && currentTime) {
        getRecords(currentTime)
      }
    }, [tableData?.id, currentTime, getRecords])

    // 格式化时间
    const formatTime = (timestamp: number) => {
      const date = new Date(timestamp * 1000)
      const pad = (n: number) => n.toString().padStart(2, "0")
      return {
        year: date.getFullYear(),
        month: pad(date.getMonth() + 1),
        day: pad(date.getDate()),
        hour: pad(date.getHours()),
        minute: pad(date.getMinutes()),
        second: pad(date.getSeconds()),
      }
    }

    // 格式化完整时间字符串
    const formatFullTime = (timestamp: number) => {
      const t = formatTime(timestamp)
      return `${t.year}-${t.month}-${t.day} ${t.hour}:${t.minute}:${t.second}`
    }

    // 计算鼠标位置对应的时间
    React.useEffect(() => {
      if (currentTime && mouseX) {
        const time = currentTime + mouseX * 60 - (currentTime % 60) - Math.floor(width / 2) * 60
        setPointTime(formatFullTime(time))
      }
    }, [width, currentTime, mouseX])

    // 绘制时间刻度
    const drawTimeScale = React.useCallback(() => {
      const canvas = scaleCanvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, width, height)

      // 计算时间偏移
      const remainder = (Math.floor(currentTime / 60) - Math.floor(width / 2)) % 60

      for (let i = 0; i < width; i++) {
        // 半小时刻度
        if ((remainder + i) % 30 === 0) {
          ctx.beginPath()
          ctx.moveTo(i, 0)
          ctx.lineTo(i, 10)
          ctx.strokeStyle = scaleColor
          ctx.lineWidth = 1
          ctx.stroke()
        }

        // 小时刻度及时间显示
        if ((remainder + i) % 60 === 0) {
          ctx.beginPath()
          ctx.moveTo(i, 0)
          ctx.lineTo(i, 20)
          ctx.strokeStyle = scaleColor
          ctx.lineWidth = 1
          ctx.stroke()

          const ct = currentTime + i * 60 - (currentTime % 60) - Math.floor(width / 2) * 60
          const t = formatTime(ct)
          ctx.font = `${textSize}px Arial`
          ctx.fillStyle = scaleColor
          ctx.fillText(`${t.hour}:${t.minute}`, i, 25)
        }
      }

      // 绘制中心指针线（蓝色）
      ctx.beginPath()
      ctx.moveTo(Math.floor(width / 2), 0)
      ctx.lineTo(Math.floor(width / 2), 35)
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.stroke()

      // 绘制当前时间文本
      ctx.font = `${textSize}px Arial`
      ctx.fillStyle = textColor
      const currentTimeStr = formatFullTime(currentTime)
      ctx.fillText(currentTimeStr, Math.floor(width / 2) - 60, height - 2)
    }, [width, height, currentTime, scaleColor, textColor, textSize])

    // 绘制视频区域
    const drawVideoScope = React.useCallback(() => {
      const canvas = videoCanvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, width, height)

      records.forEach((record) => {
        let startTimestamp: number
        let endTimestamp: number

        if (typeof record.startTime === "number") {
          startTimestamp = record.startTime
          endTimestamp = record.endTime as number
        } else if (record.StartTime) {
          startTimestamp = Math.floor(new Date(record.StartTime).getTime() / 1000)
          endTimestamp = Math.floor(new Date(record.EndTime!).getTime() / 1000)
        } else if (typeof record.startTime === "string") {
          startTimestamp = parseInt(record.startTime)
          endTimestamp = parseInt(record.endTime as string)
        } else {
          return
        }

        let startPoint = Math.floor(
          (startTimestamp + (width * 60) / 2 - currentTime + (currentTime % 60)) / 60
        )
        let endPoint = Math.floor(
          (endTimestamp + (width * 60) / 2 - currentTime + (currentTime % 60)) / 60
        )

        // 边界处理
        startPoint = Math.max(0, startPoint)
        endPoint = Math.min(width, endPoint)

        const w = endPoint - startPoint
        if (w > 0) {
          ctx.fillStyle = "rgba(251, 191, 36, 0.8)" // 黄色
          ctx.fillRect(startPoint, 0, w, height)
        }
      })
    }, [width, height, currentTime, records])

    // 重绘
    React.useEffect(() => {
      drawVideoScope()
      drawTimeScale()
    }, [drawVideoScope, drawTimeScale])

    // 处理鼠标移动显示时间提示
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isDraggingRef.current) return
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      setMouseX(x)
      setTipShow(true)
    }

    // 处理鼠标离开
    const handleMouseLeave = () => {
      setTipShow(false)
    }

    // 处理拖拽开始
    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (readonly) return
      isDraggingRef.current = true
      dragStartXRef.current = e.clientX
      dragStartTimeRef.current = currentTime
      setTipShow(false)
      e.currentTarget.setPointerCapture(e.pointerId)
    }

    // 处理拖拽移动
    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDraggingRef.current) {
        // 普通鼠标移动
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        setMouseX(x)
        setTipShow(true)
        return
      }

      const delta = dragStartXRef.current - e.clientX
      const newTime = dragStartTimeRef.current + delta * 60
      setCurrentTime(newTime)
    }

    // 处理拖拽结束
    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false

      const delta = dragStartXRef.current - e.clientX
      const direction = delta > 0 ? "right" : "left"
      const newTime = dragStartTimeRef.current + delta * 60

      // 检查边界
      let finalTime = newTime
      if (records.length > 0) {
        const lastRecord = records[records.length - 1]
        const lastEndTime =
          typeof lastRecord.endTime === "number"
            ? lastRecord.endTime
            : parseInt(lastRecord.endTime as string)
        if (finalTime > lastEndTime) {
          finalTime = lastEndTime
        }
      }

      setCurrentTime(finalTime)
      onTimeChange?.(finalTime, direction)
      e.currentTarget.releasePointerCapture(e.pointerId)
    }

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={{ width, height: height + 10 }}
        {...props}
      >
        {/* 时间提示 */}
        {tipShow && (
          <div
            className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 pointer-events-none"
            style={{
              left: mouseX - 60,
              top: -30,
            }}
          >
            {pointTime}
          </div>
        )}

        {/* 视频区域画布 */}
        <canvas
          ref={videoCanvasRef}
          width={width}
          height={height}
          className="absolute top-0 left-0"
          style={{ backgroundColor: background }}
        />

        {/* 刻度画布 */}
        <canvas
          ref={scaleCanvasRef}
          width={width}
          height={height}
          className="absolute top-0 left-0"
          style={{ backgroundColor: "transparent" }}
        />

        {/* 交互层画布 */}
        <canvas
          ref={interactionCanvasRef}
          width={width}
          height={height}
          className={cn(
            "absolute top-0 left-0",
            !readonly && "cursor-grab active:cursor-grabbing"
          )}
          style={{ backgroundColor: "transparent" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      </div>
    )
  }
)

TimeAxisWidget.displayName = "TimeAxisWidget"

export { TimeAxisWidget }
