import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Copy } from "lucide-react"

export type RecordingMode = "CMR" | "ALARM" | "MANUAL"
export type PeriodType = "week" | "everyday"
export type TimeUnit = "m" | "h"

export interface TimeSegment {
  id?: string
  name: string
  day_of_week: string
  start_time: string
  end_time: string
  length: number
  recording_mode: RecordingMode
  segmentTime: {
    count: number
    unit: TimeUnit
  }
}

export interface VideoPeriodsWidgetProps {
  /**
   * 周期类型
   */
  period?: PeriodType
  onPeriodChange?: (period: PeriodType) => void
  /**
   * 录制模式
   */
  recordingMode?: RecordingMode
  onRecordingModeChange?: (mode: RecordingMode) => void
  /**
   * 时间段数据
   */
  value?: TimeSegment[]
  /**
   * 值变化回调
   */
  onChange?: (value: TimeSegment[]) => void
  /**
   * 是否显示操作按钮
   */
  showActions?: boolean
  /**
   * 是否只读
   */
  readonly?: boolean
  /**
   * CSS 类名
   */
  className?: string
  /**
   * 单元格唯一标识
   */
  cellKey?: string
}

const VideoPeriodsWidget = React.forwardRef<HTMLDivElement, VideoPeriodsWidgetProps>(
  (
    {
      className,
      period = "week",
      recordingMode = "CMR",
      onPeriodChange,
      onRecordingModeChange,
      value = [],
      onChange,
      showActions = true,
      readonly = false,
      ...props
    },
    ref
  ) => {

    // 初始化周数据
    const weekDays = [
      { title: "周一", day_of_week: "Monday" },
      { title: "周二", day_of_week: "Tuesday" },
      { title: "周三", day_of_week: "Wednesday" },
      { title: "周四", day_of_week: "Thursday" },
      { title: "周五", day_of_week: "Friday" },
      { title: "周六", day_of_week: "Saturday" },
      { title: "周日", day_of_week: "Sunday" }
    ]

    const everyDayData = { title: "每天", day_of_week: "" }

    const [internalPeriod, setInternalPeriod] = React.useState<PeriodType>(period)
    const [internalRecordingMode, setInternalRecordingMode] = React.useState<RecordingMode>(recordingMode)

    React.useEffect(() => {
      setInternalPeriod(period)
    }, [period])

    React.useEffect(() => {
      setInternalRecordingMode(recordingMode)
    }, [recordingMode])

    const effectivePeriod = internalPeriod
    const effectiveRecordingMode = internalRecordingMode

    const getSegmentKey = React.useCallback((segment: TimeSegment) => {
      return segment.id || segment.name
    }, [])

    const valueRef = React.useRef<TimeSegment[]>(value)
    React.useEffect(() => {
      valueRef.current = value
    }, [value])

    const railRef = React.useRef<HTMLDivElement | null>(null)
    const [railWidth, setRailWidth] = React.useState(0)

    React.useEffect(() => {
      const el = railRef.current
      if (!el) return

      const update = () => {
        const next = el.getBoundingClientRect().width
        if (Number.isFinite(next) && next > 0) setRailWidth(next)
      }

      update()

      const ro = new ResizeObserver(() => update())
      ro.observe(el)

      window.addEventListener("resize", update)
      return () => {
        ro.disconnect()
        window.removeEventListener("resize", update)
      }
    }, [])

    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

    const timeToMinutes = (time: string) => {
      if (!time) return 0
      const [h, m] = time.split(":").map(Number)
      if (!Number.isFinite(h) || !Number.isFinite(m)) return 0
      return clamp(h * 60 + m, 0, 1439)
    }

    const minutesToTime = (minutes: number) => {
      const clamped = clamp(Math.round(minutes), 0, 1439)
      const h = Math.floor(clamped / 60)
      const m = clamped % 60
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    }

    const minutesFromClientX = (clientX: number, rect?: DOMRect) => {
      const useRect = rect || railRef.current?.getBoundingClientRect()
      if (!useRect) return 0
      const width = useRect.width
      if (!width || width <= 0) return 0
      const x = clamp(clientX - useRect.left, 0, width)
      if (x >= width) return 1439
      return clamp(Math.round((x / width) * 24 * 60), 0, 1439)
    }

    const positionFromMinutes = (minutes: number) => {
      if (!railWidth) return 0
      return (clamp(minutes, 0, 1439) / (24 * 60)) * railWidth
    }

    const getDayIndex = (dayOfWeek: string) => {
      if (!dayOfWeek) return 0
      const idx = weekDays.findIndex(d => d.day_of_week === dayOfWeek)
      return idx < 0 ? 0 : idx
    }

    // 根据周期类型获取数据
    const getPeriodData = () => {
      if (effectivePeriod === "week") {
        return weekDays.map(day => ({
          ...day,
          data: value.filter(item => item.day_of_week === day.day_of_week),
          segmentTime: value.find(item => item.day_of_week === day.day_of_week)?.segmentTime || { count: 10, unit: "m" as TimeUnit }
        }))
      } else {
        return [{
          ...everyDayData,
          data: value.filter(item => !item.day_of_week),
          segmentTime: value.find(item => !item.day_of_week)?.segmentTime || { count: 10, unit: "m" as TimeUnit }
        }]
      }
    }

    // 时间转换为位置 (0-24小时映射到0-100%)
    const timeToPosition = (time: string) => {
      if (!time) return 0
      const [hours, minutes] = time.split(":").map(Number)
      return ((hours * 60 + minutes) / (24 * 60)) * 100
    }

    const normalizeRange = (startMin: number, endMin: number) => {
      const s = clamp(Math.min(startMin, endMin), 0, 1438)
      const e = clamp(Math.max(startMin, endMin), s + 1, 1439)
      return { startMin: s, endMin: e }
    }

    const computeLength = (startMin: number, endMin: number) => clamp(endMin - startMin, 1, 1439)

    const updateDaySegments = (dayOfWeek: string, nextDaySegments: TimeSegment[]) => {
      const rest = valueRef.current.filter(item => (item.day_of_week || "") !== (dayOfWeek || ""))
      onChange?.([...rest, ...nextDaySegments])
    }

    const sortByTime = (segments: TimeSegment[]) => {
      return [...segments].sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time))
    }


    // 添加时间段
    const addTimeSegment = (dayOfWeek: string) => {
      if (readonly) return

      const newSegment: TimeSegment = {
        id: `${Date.now()}_${Math.random()}`,
        name: effectivePeriod === "week" ? `${dayOfWeek}${getDayIndex(dayOfWeek)}录制${value.filter(item => item.day_of_week === dayOfWeek).length}` : `录制${value.length}`,
        day_of_week: dayOfWeek,
        start_time: "09:00",
        end_time: "10:00",
        length: 60,
        recording_mode: effectiveRecordingMode,
        segmentTime: { count: 10, unit: "m" }
      }

      onChange?.([...value, newSegment])
    }

    // 删除时间段
    const removeTimeSegment = (segmentId: string) => {
      if (readonly) return
      onChange?.(value.filter(item => (item.id || item.name) !== segmentId))
    }


    // 清空所有时间段
    const clearAllSegments = () => {
      if (readonly) return
      onChange?.([])
    }

    // 渲染时间刻度
    const renderTimeline = () => {
      const hours = Array.from({ length: 25 }, (_, i) => i)
      return (
        <div className="relative w-full h-4">
          {hours.map(hour => (
            <span
              key={hour}
              className="absolute text-xs text-gray-400"
              style={{ left: `${(hour / 24) * 100}%`, transform: 'translateX(-50%)' }}
            >
              {hour}
            </span>
          ))}
        </div>
      )
    }

    const [hoveredDay, setHoveredDay] = React.useState<string | null>(null)
    const [copyOpenDay, setCopyOpenDay] = React.useState<string | null>(null)
    const [copySelectedDays, setCopySelectedDays] = React.useState<string[]>([])
    const [showCopyConfirm, setShowCopyConfirm] = React.useState(false)
    
    // 编辑弹窗状态
    const [editingSegment, setEditingSegment] = React.useState<TimeSegment | null>(null)
    const [editStart, setEditStart] = React.useState<string>("")
    const [editEnd, setEditEnd] = React.useState<string>("")

    // 检查目标天是否已有计划
    const hasExistingPlans = (toDays: string[]) => {
      return toDays.some(day => valueRef.current.some(item => item.day_of_week === day))
    }

    const applyCopy = (sourceDay: string, confirmed = false) => {
      const toDays = copySelectedDays.filter(d => d && d !== sourceDay)
      if (!toDays.length) return

      // 如果目标天已有计划且未确认，显示确认提示
      if (!confirmed && hasExistingPlans(toDays)) {
        setShowCopyConfirm(true)
        return
      }

      const source = sortByTime(valueRef.current.filter(item => item.day_of_week === sourceDay))
      // 覆盖模式：移除目标天的所有计划
      const keep = valueRef.current.filter(item => !toDays.includes(item.day_of_week))

      const next: TimeSegment[] = [...keep]
      toDays.forEach(day => {
        source.forEach((seg, idx) => {
          next.push({
            ...seg,
            id: `${Date.now()}_${Math.random()}_${day}_${idx}`,
            day_of_week: day,
            name: `${day}${getDayIndex(day)}录制${idx}`
          })
        })
      })

      onChange?.(next)
      setCopyOpenDay(null)
      setCopySelectedDays([])
      setShowCopyConfirm(false)
    }

    // 打开编辑弹窗
    const openEditPopover = (segment: TimeSegment) => {
      if (readonly) return
      setEditingSegment(segment)
      setEditStart(segment.start_time)
      setEditEnd(segment.end_time)
    }

    // 保存编辑
    const saveEdit = () => {
      if (!editingSegment) return
      
      const startMin = timeToMinutes(editStart)
      const endMin = timeToMinutes(editEnd)
      
      if (startMin >= endMin) return
      
      const updated = value.map(seg => {
        if (getSegmentKey(seg) === getSegmentKey(editingSegment)) {
          return {
            ...seg,
            start_time: editStart,
            end_time: editEnd,
            length: endMin - startMin
          }
        }
        return seg
      })
      
      onChange?.(updated)
      setEditingSegment(null)
    }

    // 删除当前编辑的时间段
    const deleteEditingSegment = () => {
      if (!editingSegment) return
      const segmentKey = getSegmentKey(editingSegment)
      // 先关闭弹窗，再删除数据
      setEditingSegment(null)
      // 使用 setTimeout 确保状态更新后再删除
      setTimeout(() => {
        removeTimeSegment(segmentKey)
      }, 0)
    }

    const didDragRef = React.useRef(false)
    const dragRef = React.useRef<
      | null
      | {
          type: "resize_start" | "resize_end" | "move" | "create"
          dayOfWeek: string
          segmentId?: string
          originStartMin: number
          originEndMin: number
          originClientX: number
          railRect?: DOMRect  // 保存当前行的位置信息
        }
    >(null)

    const activeDragHandlersRef = React.useRef<null | {
      move: (e: PointerEvent) => void
      up: (e: PointerEvent) => void
    }>(null)

    const [createPreview, setCreatePreview] = React.useState<null | { dayOfWeek: string; startMin: number; endMin: number }>(null)

    const onGlobalPointerMove = React.useCallback((e: PointerEvent) => {
      const current = dragRef.current
      if (!current) return

      const daySegments = sortByTime(valueRef.current.filter(item => (item.day_of_week || "") === (current.dayOfWeek || "")))

      const deltaPx = e.clientX - current.originClientX
      if (Math.abs(deltaPx) > 2) didDragRef.current = true

      const nextMinutes = minutesFromClientX(e.clientX, current.railRect)

      if (current.type === "create") {
        const nextRange = normalizeRange(current.originStartMin, nextMinutes)
        setCreatePreview({ dayOfWeek: current.dayOfWeek, ...nextRange })
        return
      }

      if (!current.segmentId) return
      const idx = daySegments.findIndex(s => getSegmentKey(s) === current.segmentId)
      if (idx < 0) return

      const prev = daySegments[idx - 1]
      const next = daySegments[idx + 1]
      const prevEnd = prev ? timeToMinutes(prev.end_time) : 0
      const nextStart = next ? timeToMinutes(next.start_time) : 1440

      const originStart = current.originStartMin
      const originEnd = current.originEndMin
      const duration = originEnd - originStart

      let newStart = originStart
      let newEnd = originEnd

      if (current.type === "resize_start") {
        newStart = clamp(nextMinutes, prevEnd, originEnd - 1)
        newEnd = originEnd
      } else if (current.type === "resize_end") {
        newStart = originStart
        newEnd = clamp(nextMinutes, originStart + 1, Math.min(1439, nextStart))
      } else if (current.type === "move") {
        const maxStart = Math.min(nextStart - duration, 1439 - duration)
        newStart = clamp(nextMinutes, prevEnd, maxStart)
        newEnd = newStart + duration
      }

      const updated = daySegments.map(s => {
        if (getSegmentKey(s) !== current.segmentId) return s
        const start_time = minutesToTime(newStart)
        const end_time = minutesToTime(newEnd)
        return {
          ...s,
          start_time,
          end_time,
          length: computeLength(newStart, newEnd)
        }
      })

      updateDaySegments(current.dayOfWeek, updated)
    }, [getSegmentKey])

    const onGlobalPointerUp = React.useCallback((e: PointerEvent) => {
      const current = dragRef.current
      if (!current) return

      if (current.type === "create") {
        const daySegments = sortByTime(valueRef.current.filter(item => (item.day_of_week || "") === (current.dayOfWeek || "")))
        const endMin = minutesFromClientX(e.clientX, current.railRect)
        const range = normalizeRange(current.originStartMin, endMin)

        // 检查是否与已有时间段重叠
        const hasOverlap = daySegments.some(seg => {
          const segStart = timeToMinutes(seg.start_time)
          const segEnd = timeToMinutes(seg.end_time)
          return !(range.endMin <= segStart || range.startMin >= segEnd)
        })

        if (hasOverlap) {
          // 有重叠，不创建
          dragRef.current = null
          setCreatePreview(null)
          return
        }

        // 确保时间段有效（至少1分钟）
        if (range.endMin - range.startMin < 1) {
          dragRef.current = null
          setCreatePreview(null)
          return
        }

        const newSegment: TimeSegment = {
          id: `${Date.now()}_${Math.random()}`,
          name: effectivePeriod === "week" ? `${current.dayOfWeek}${getDayIndex(current.dayOfWeek)}录制${daySegments.length}` : `录制${valueRef.current.length}`,
          day_of_week: current.dayOfWeek,
          start_time: minutesToTime(range.startMin),
          end_time: minutesToTime(range.endMin),
          length: computeLength(range.startMin, range.endMin),
          recording_mode: effectiveRecordingMode,
          segmentTime: (daySegments[0]?.segmentTime || { count: 10, unit: "m" })
        }

        const nextDay = sortByTime([...daySegments, newSegment])
        updateDaySegments(current.dayOfWeek, nextDay)
      }

      dragRef.current = null
      setCreatePreview(null)
      const handlers = activeDragHandlersRef.current
      if (handlers) {
        window.removeEventListener("pointermove", handlers.move)
        window.removeEventListener("pointerup", handlers.up)
      }
      activeDragHandlersRef.current = null
      setTimeout(() => {
        didDragRef.current = false
      }, 0)
    }, [effectivePeriod, effectiveRecordingMode])

    const startGlobalDrag = (
      payload: NonNullable<typeof dragRef.current>
    ) => {
      didDragRef.current = false
      dragRef.current = payload

      const prev = activeDragHandlersRef.current
      if (prev) {
        window.removeEventListener("pointermove", prev.move)
        window.removeEventListener("pointerup", prev.up)
      }

      activeDragHandlersRef.current = {
        move: onGlobalPointerMove,
        up: onGlobalPointerUp,
      }

      window.addEventListener("pointermove", onGlobalPointerMove)
      window.addEventListener("pointerup", onGlobalPointerUp)
    }

    const beginCreate = (dayOfWeek: string, e: React.PointerEvent) => {
      if (readonly) return
      if (e.button !== 0) return
      if (!railWidth) return
      e.preventDefault()
      const target = e.currentTarget as HTMLElement
      const railRect = target.getBoundingClientRect()
      const startMin = minutesFromClientX(e.clientX, railRect)
      startGlobalDrag({
        type: "create",
        dayOfWeek,
        originStartMin: startMin,
        originEndMin: startMin + 1,
        originClientX: e.clientX,
        railRect
      })
      setCreatePreview({ dayOfWeek, startMin, endMin: startMin + 1 })
    }

    // 辅助函数：从元素向上查找 data-time-row
    const findTimeRowRect = (el: HTMLElement | null): DOMRect | undefined => {
      let current = el
      while (current) {
        if (current.hasAttribute('data-time-row')) {
          return current.getBoundingClientRect()
        }
        current = current.parentElement
      }
      return railRef.current?.getBoundingClientRect()
    }

    const beginResizeStart = (dayOfWeek: string, segment: TimeSegment, e: React.PointerEvent) => {
      if (readonly) return
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      const railRect = findTimeRowRect(e.currentTarget as HTMLElement)
      startGlobalDrag({
        type: "resize_start",
        dayOfWeek,
        segmentId: getSegmentKey(segment),
        originStartMin: timeToMinutes(segment.start_time),
        originEndMin: timeToMinutes(segment.end_time),
        originClientX: e.clientX,
        railRect
      })
    }

    const beginResizeEnd = (dayOfWeek: string, segment: TimeSegment, e: React.PointerEvent) => {
      if (readonly) return
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      const railRect = findTimeRowRect(e.currentTarget as HTMLElement)
      startGlobalDrag({
        type: "resize_end",
        dayOfWeek,
        segmentId: getSegmentKey(segment),
        originStartMin: timeToMinutes(segment.start_time),
        originEndMin: timeToMinutes(segment.end_time),
        originClientX: e.clientX,
        railRect
      })
    }

    const beginMove = (dayOfWeek: string, segment: TimeSegment, e: React.PointerEvent) => {
      if (readonly) return
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      const railRect = findTimeRowRect(e.currentTarget as HTMLElement)
      const currentMin = minutesFromClientX(e.clientX, railRect)
      const originStart = timeToMinutes(segment.start_time)
      const originEnd = timeToMinutes(segment.end_time)
      const offset = clamp(currentMin - originStart, 0, Math.max(0, originEnd - originStart - 1))
      startGlobalDrag({
        type: "move",
        dayOfWeek,
        segmentId: getSegmentKey(segment),
        originStartMin: originStart - offset,
        originEndMin: originEnd - offset,
        originClientX: e.clientX,
        railRect
      })
    }


    // 渲染时间段行（包含斜线背景）
    const renderTimeRow = (dayOfWeek: string, segments: TimeSegment[], isFirst: boolean) => {
      return (
        <div 
          ref={isFirst ? railRef : undefined}
          data-time-row
          className={cn(
            "relative w-full h-6 rounded",
            !readonly && "cursor-crosshair"
          )}
          style={{
            background: `repeating-linear-gradient(
              135deg,
              #e8ecf0,
              #e8ecf0 2px,
              #f3f5f7 2px,
              #f3f5f7 4px
            )`
          }}
          onPointerDown={(e) => {
            if (readonly) return
            beginCreate(dayOfWeek || "", e)
          }}
        >
          {segments.map(segment => {
            const startPos = timeToPosition(segment.start_time)
            const endPos = timeToPosition(segment.end_time)
            const width = endPos - startPos
            const isEditing = editingSegment && getSegmentKey(editingSegment) === getSegmentKey(segment)

            return (
              <Popover 
                key={getSegmentKey(segment)} 
                open={!!isEditing}
                onOpenChange={(open) => {
                  if (!open) setEditingSegment(null)
                }}
              >
                <PopoverTrigger asChild>
                  <div
                    className={cn(
                      "absolute top-0 h-full cursor-move",
                      "bg-blue-400/80 hover:bg-blue-500/90 border border-blue-500",
                      readonly && "cursor-not-allowed opacity-60",
                      isEditing && "ring-2 ring-blue-600"
                    )}
                    style={{
                      left: `${startPos}%`,
                      width: `${width}%`
                    }}
                    onPointerDown={(e) => {
                      e.stopPropagation()
                      beginMove(segment.day_of_week || "", segment, e)
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!didDragRef.current && !readonly) {
                        openEditPopover(segment)
                      }
                    }}
                  >
                    {/* 左侧调整手柄 - 增加宽度便于拖拽 */}
                    <div
                      className={cn(
                        "absolute top-0 left-0 h-full w-2 bg-blue-600 hover:bg-blue-700 z-10",
                        !readonly && "cursor-ew-resize"
                      )}
                      onPointerDown={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        beginResizeStart(segment.day_of_week || "", segment, e)
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {/* 右侧调整手柄 - 增加宽度便于拖拽 */}
                    <div
                      className={cn(
                        "absolute top-0 right-0 h-full w-2 bg-blue-600 hover:bg-blue-700 z-10",
                        !readonly && "cursor-ew-resize"
                      )}
                      onPointerDown={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        beginResizeEnd(segment.day_of_week || "", segment, e)
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {/* 时间标签 */}
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium truncate px-1">
                      {segment.start_time}
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-3" 
                  align="center"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={editStart}
                        onChange={(e) => setEditStart(e.target.value)}
                        className="px-2 py-1 border rounded text-sm w-24"
                      />
                      <span className="text-gray-500">→</span>
                      <input
                        type="time"
                        value={editEnd}
                        onChange={(e) => setEditEnd(e.target.value)}
                        className="px-2 py-1 border rounded text-sm w-24"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={deleteEditingSegment}
                      >
                        删 除
                      </Button>
                      <Button
                        size="sm"
                        onClick={saveEdit}
                      >
                        保 存
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )
          })}
          {/* 创建预览 */}
          {createPreview && railWidth > 0 && createPreview.dayOfWeek === (dayOfWeek || "") && (
            <div
              className="absolute top-0 h-full bg-blue-400/50 pointer-events-none border border-blue-400"
              style={{
                left: `${(positionFromMinutes(createPreview.startMin) / railWidth) * 100}%`,
                width: `${((positionFromMinutes(createPreview.endMin) - positionFromMinutes(createPreview.startMin)) / railWidth) * 100}%`
              }}
            />
          )}
        </div>
      )
    }


    const periodData = getPeriodData()

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      >
        {/* 顶部全部删除按钮 */}
        {showActions && !readonly && (
          <div className="mb-2">
            <Button
              variant="link"
              size="sm"
              onClick={clearAllSegments}
              className="text-blue-500 hover:text-blue-600 p-0 h-auto"
            >
              全部删除
            </Button>
          </div>
        )}

        {/* 周期数据 */}
        <div>
          {periodData.map((dayData, index) => (
            <div
              key={dayData.day_of_week || "everyday"}
              className="relative"
              onMouseEnter={() => setHoveredDay(dayData.day_of_week || "")}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div className="flex">
                {/* 左侧星期标签 - 与时间轴条居中对齐 */}
                <div className="w-10 text-sm text-gray-600 flex-shrink-0 flex items-center justify-center h-6">
                  {dayData.title}
                </div>
                
                {/* 时间轴区域 */}
                <div className="flex-1 flex flex-col">
                  {/* 时间段 */}
                  <div className="flex-1">
                    {renderTimeRow(dayData.day_of_week || "", dayData.data, index === 0)}
                  </div>
                  
                  {/* 底部时间刻度 */}
                  {renderTimeline()}
                </div>
                
                {/* 右侧复制按钮占位 - 保持布局一致 */}
                <div className="w-8 flex-shrink-0"></div>
              </div>
              
              {/* 右侧复制按钮 - 绝对定位不影响布局 */}
              {!readonly && effectivePeriod === "week" && hoveredDay === (dayData.day_of_week || "") && (
                <div className="absolute right-0 top-0 h-6 flex items-center">
                      <Popover
                        open={copyOpenDay === (dayData.day_of_week || "")}
                        onOpenChange={(open) => {
                          if (open) {
                            setCopyOpenDay(dayData.day_of_week || "")
                            setCopySelectedDays([dayData.day_of_week])
                          } else {
                            setCopyOpenDay(null)
                            setCopySelectedDays([])
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Copy className="h-4 w-4 text-gray-400" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56" align="end">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">复制到...</span>
                              <label className="flex items-center gap-1 text-sm cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 accent-blue-500"
                                  checked={copySelectedDays.length === weekDays.length}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setCopySelectedDays(weekDays.map(d => d.day_of_week))
                                    } else {
                                      setCopySelectedDays([dayData.day_of_week])
                                    }
                                  }}
                                />
                                <span>全选</span>
                              </label>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {weekDays.map(d => {
                                const checked = copySelectedDays.includes(d.day_of_week)
                                const isSource = d.day_of_week === dayData.day_of_week
                                return (
                                  <label key={d.day_of_week} className="flex items-center gap-1 text-sm cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 accent-blue-500"
                                      checked={checked}
                                      disabled={isSource}
                                      onChange={(e) => {
                                        setCopySelectedDays(prev => {
                                          if (e.target.checked) return [...prev, d.day_of_week]
                                          return prev.filter(x => x !== d.day_of_week)
                                        })
                                      }}
                                    />
                                    <span className={isSource ? "text-gray-400" : ""}>{d.title}</span>
                                  </label>
                                )
                              })}
                            </div>
                            {/* 确认覆盖提示 */}
                            {showCopyConfirm && (
                              <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded flex items-start gap-1">
                                <span>确认后会将原计划清空，替换为目标天的计划</span>
                              </div>
                            )}
                            <div className="flex justify-end gap-2 pt-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setCopyOpenDay(null)
                                  setCopySelectedDays([])
                                  setShowCopyConfirm(false)
                                }}
                              >
                                取 消
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  if (showCopyConfirm) {
                                    applyCopy(dayData.day_of_week || "", true)
                                  } else {
                                    applyCopy(dayData.day_of_week || "")
                                  }
                                }}
                                disabled={copySelectedDays.filter(d => d !== dayData.day_of_week).length === 0}
                              >
                                确 认
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
)

VideoPeriodsWidget.displayName = "VideoPeriodsWidget"

export { VideoPeriodsWidget }
