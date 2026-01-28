import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/components/ui/button/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/components/ui/card/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/components/ui/popover/popover"
import { Trash2, Plus, Clock, Copy, Pencil } from "lucide-react"

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

    const minutesFromClientX = (clientX: number) => {
      const el = railRef.current
      if (!el || !railWidth) return 0
      const rect = el.getBoundingClientRect()
      const x = clamp(clientX - rect.left, 0, railWidth)
      if (x >= railWidth) return 1439
      return clamp(Math.round((x / railWidth) * 24 * 60), 0, 1439)
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

    // 渲染时间轴
    const renderTimeline = () => {
      const hours = Array.from({ length: 25 }, (_, i) => i)
      
      return (
        <div ref={railRef} className="relative w-full h-6 mb-2">
          {/* 时间刻度 */}
          {hours.map(hour => (
            <div
              key={hour}
              className="absolute top-0 bottom-0 border-l border-gray-300"
              style={{ left: `${(hour / 24) * 100}%` }}
            >
              <span className="absolute -top-4 -left-2 text-xs text-gray-500">
                {hour}
              </span>
            </div>
          ))}
        </div>
      )
    }

    const [hoveredDay, setHoveredDay] = React.useState<string | null>(null)
    const [copyOpenDay, setCopyOpenDay] = React.useState<string | null>(null)
    const [copySelectedDays, setCopySelectedDays] = React.useState<string[]>([])

    const applyCopy = (sourceDay: string) => {
      const toDays = copySelectedDays.filter(d => d && d !== sourceDay)
      if (!toDays.length) return

      const source = sortByTime(valueRef.current.filter(item => item.day_of_week === sourceDay))
      const keep = valueRef.current.filter(item => !toDays.includes(item.day_of_week))

      const next: TimeSegment[] = [...keep]
      toDays.forEach(day => {
        source.forEach((seg, idx) => {
          next.push({
            ...seg,
            id: `${Date.now()}_${Math.random()}`,
            day_of_week: day,
            name: `${day}${getDayIndex(day)}录制${idx}`
          })
        })
      })

      onChange?.(next)
      setCopyOpenDay(null)
      setCopySelectedDays([])
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

      const nextMinutes = minutesFromClientX(e.clientX)

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
        const endMin = minutesFromClientX(e.clientX)
        const range = normalizeRange(current.originStartMin, endMin)

        const insertIndex = daySegments.findIndex(s => timeToMinutes(s.start_time) > range.startMin)
        const prev = insertIndex > 0 ? daySegments[insertIndex - 1] : insertIndex === 0 ? undefined : daySegments[daySegments.length - 1]
        const next = insertIndex >= 0 ? daySegments[insertIndex] : undefined
        const prevEnd = prev ? timeToMinutes(prev.end_time) : 0
        const nextStart = next ? timeToMinutes(next.start_time) : 1440

        const startMin = clamp(range.startMin, prevEnd, 1438)
        const endBound = Math.min(1439, nextStart)
        const endMinClamped = clamp(range.endMin, startMin + 1, endBound)

        const newSegment: TimeSegment = {
          id: `${Date.now()}_${Math.random()}`,
          name: effectivePeriod === "week" ? `${current.dayOfWeek}${getDayIndex(current.dayOfWeek)}录制${daySegments.length}` : `录制${valueRef.current.length}`,
          day_of_week: current.dayOfWeek,
          start_time: minutesToTime(startMin),
          end_time: minutesToTime(endMinClamped),
          length: computeLength(startMin, endMinClamped),
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
      const startMin = minutesFromClientX(e.clientX)
      startGlobalDrag({
        type: "create",
        dayOfWeek,
        originStartMin: startMin,
        originEndMin: startMin + 1,
        originClientX: e.clientX
      })
      setCreatePreview({ dayOfWeek, startMin, endMin: startMin + 1 })
    }

    const beginResizeStart = (dayOfWeek: string, segment: TimeSegment, e: React.PointerEvent) => {
      if (readonly) return
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      startGlobalDrag({
        type: "resize_start",
        dayOfWeek,
        segmentId: getSegmentKey(segment),
        originStartMin: timeToMinutes(segment.start_time),
        originEndMin: timeToMinutes(segment.end_time),
        originClientX: e.clientX
      })
    }

    const beginResizeEnd = (dayOfWeek: string, segment: TimeSegment, e: React.PointerEvent) => {
      if (readonly) return
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      startGlobalDrag({
        type: "resize_end",
        dayOfWeek,
        segmentId: getSegmentKey(segment),
        originStartMin: timeToMinutes(segment.start_time),
        originEndMin: timeToMinutes(segment.end_time),
        originClientX: e.clientX
      })
    }

    const beginMove = (dayOfWeek: string, segment: TimeSegment, e: React.PointerEvent) => {
      if (readonly) return
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      const currentMin = minutesFromClientX(e.clientX)
      const originStart = timeToMinutes(segment.start_time)
      const originEnd = timeToMinutes(segment.end_time)
      const offset = clamp(currentMin - originStart, 0, Math.max(0, originEnd - originStart - 1))
      startGlobalDrag({
        type: "move",
        dayOfWeek,
        segmentId: getSegmentKey(segment),
        originStartMin: originStart - offset,
        originEndMin: originEnd - offset,
        originClientX: e.clientX
      })
    }

    const [editSegmentId, setEditSegmentId] = React.useState<string | null>(null)
    const [editStart, setEditStart] = React.useState<string>("00:00")
    const [editEnd, setEditEnd] = React.useState<string>("00:01")

    const openEdit = (segment: TimeSegment) => {
      setEditSegmentId(getSegmentKey(segment))
      setEditStart(segment.start_time)
      setEditEnd(segment.end_time)
    }

    const applyEdit = (dayOfWeek: string, segmentId: string) => {
      const daySegments = sortByTime(valueRef.current.filter(item => (item.day_of_week || "") === (dayOfWeek || "")))
      const idx = daySegments.findIndex(s => getSegmentKey(s) === segmentId)
      if (idx < 0) return

      const prev = daySegments[idx - 1]
      const next = daySegments[idx + 1]
      const prevEnd = prev ? timeToMinutes(prev.end_time) : 0
      const nextStart = next ? timeToMinutes(next.start_time) : 1440

      const desired = normalizeRange(timeToMinutes(editStart), timeToMinutes(editEnd))
      const startMin = clamp(desired.startMin, prevEnd, 1438)
      const endMin = clamp(desired.endMin, startMin + 1, Math.min(1439, nextStart))

      const updated = daySegments.map(s => {
        if (getSegmentKey(s) !== segmentId) return s
        return {
          ...s,
          start_time: minutesToTime(startMin),
          end_time: minutesToTime(endMin),
          length: computeLength(startMin, endMin)
        }
      })

      updateDaySegments(dayOfWeek, updated)
      setEditSegmentId(null)
    }

    // 渲染时间段
    const renderTimeSegments = (dayOfWeek: string, segments: TimeSegment[]) => {
      return (
        <div className={cn("relative w-full h-8 bg-gray-100 rounded", !readonly && "cursor-crosshair")}>
          {segments.map(segment => {
            const startPos = timeToPosition(segment.start_time)
            const endPos = timeToPosition(segment.end_time)
            const width = endPos - startPos

            return (
              <div
                key={getSegmentKey(segment)}
                className={cn(
                  "absolute top-0 h-full rounded cursor-move transition-all",
                  "bg-blue-500 bg-opacity-70 hover:bg-opacity-90",
                  readonly && "cursor-not-allowed opacity-60"
                )}
                style={{
                  left: `${startPos}%`,
                  width: `${width}%`
                }}
                onPointerDown={(e) => beginMove(segment.day_of_week || "", segment, e)}
              >
                <div className="h-full flex items-center justify-between px-1 group">
                  <div
                    className={cn(
                      "absolute top-0 left-0 h-full w-1 bg-white/40",
                      !readonly && "cursor-ew-resize"
                    )}
                    onPointerDown={(e) => beginResizeStart(segment.day_of_week || "", segment, e)}
                  />
                  <div
                    className={cn(
                      "absolute top-0 right-0 h-full w-1 bg-white/40",
                      !readonly && "cursor-ew-resize"
                    )}
                    onPointerDown={(e) => beginResizeEnd(segment.day_of_week || "", segment, e)}
                  />

                  <span className="text-xs text-white truncate pr-8">
                    {segment.start_time}-{segment.end_time}
                  </span>

                  {!readonly && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Popover open={editSegmentId === getSegmentKey(segment)} onOpenChange={(open) => {
                        if (!open) setEditSegmentId(null)
                      }}>
                        <PopoverTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 hover:bg-white/20"
                            onPointerDown={(e) => {
                              e.stopPropagation()
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              openEdit(segment)
                            }}
                          >
                            <Pencil className="h-3 w-3 text-white" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-64"
                          onPointerDownOutside={(e) => {
                            e.preventDefault()
                          }}
                        >
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">开始</div>
                              <input
                                type="time"
                                value={editStart}
                                onChange={(e) => setEditStart(e.target.value)}
                                className="w-full px-2 py-1 border rounded text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">结束</div>
                              <input
                                type="time"
                                value={editEnd}
                                onChange={(e) => setEditEnd(e.target.value)}
                                className="w-full px-2 py-1 border rounded text-sm"
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditSegmentId(null)}
                              >
                                取消
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => applyEdit(segment.day_of_week || "", segment.id)}
                              >
                                保存
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:bg-red-500"
                        onPointerDown={(e) => {
                          e.stopPropagation()
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          removeTimeSegment(getSegmentKey(segment))
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-white" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          {createPreview && railWidth > 0 && createPreview.dayOfWeek === (dayOfWeek || "") && (
            <div
              className="absolute top-0 h-full rounded bg-blue-500/40 pointer-events-none"
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
        className={cn("w-full space-y-4", className)}
        {...props}
      >
        {/* 操作按钮 */}
        {showActions && !readonly && (
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <select
                value={effectivePeriod}
                onChange={(e) => {
                  const next = e.target.value as PeriodType
                  setInternalPeriod(next)
                  onPeriodChange?.(next)
                  onChange?.([])
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                disabled={readonly}
              >
                <option value="week">按周</option>
                <option value="everyday">每天</option>
              </select>

              <select
                value={effectiveRecordingMode}
                onChange={(e) => {
                  const mode = e.target.value as RecordingMode
                  setInternalRecordingMode(mode)
                  onRecordingModeChange?.(mode)
                  onChange?.(value.map(item => ({ ...item, recording_mode: mode })))
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                disabled={readonly}
              >
                <option value="CMR">连续录制</option>
                <option value="ALARM">报警录制</option>
                <option value="MANUAL">手动录制</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={clearAllSegments}
              disabled={value.length === 0}
            >
              清空全部
            </Button>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              录制计划
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 时间轴 */}
            {renderTimeline()}

            {/* 周期数据 */}
            {periodData.map((dayData) => (
              <div
                key={dayData.day_of_week || "everyday"}
                className="space-y-2"
                onMouseEnter={() => setHoveredDay(dayData.day_of_week || "")}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div className="flex items-center justify-between">
                  <label className="font-medium text-sm">{dayData.title}</label>
                  {!readonly && (
                    <div className="flex items-center gap-2">
                      {effectivePeriod === "week" && hoveredDay === (dayData.day_of_week || "") && (
                        <Popover
                          open={copyOpenDay === (dayData.day_of_week || "")}
                          onOpenChange={(open) => {
                            if (open) {
                              setCopyOpenDay(dayData.day_of_week || "")
                              setCopySelectedDays([])
                            } else {
                              setCopyOpenDay(null)
                              setCopySelectedDays([])
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Copy className="h-3 w-3 mr-1" />
                              复制到...
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64">
                            <div className="space-y-2">
                              <div className="text-sm font-medium">复制到</div>
                              <div className="space-y-1 max-h-40 overflow-auto">
                                {weekDays
                                  .filter(d => d.day_of_week !== (dayData.day_of_week || ""))
                                  .map(d => {
                                    const checked = copySelectedDays.includes(d.day_of_week)
                                    return (
                                      <label key={d.day_of_week} className="flex items-center gap-2 text-sm">
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          onChange={(e) => {
                                            setCopySelectedDays(prev => {
                                              if (e.target.checked) return [...prev, d.day_of_week]
                                              return prev.filter(x => x !== d.day_of_week)
                                            })
                                          }}
                                        />
                                        <span>{d.title}</span>
                                      </label>
                                    )
                                  })}
                              </div>
                              <div className="flex justify-end gap-2 pt-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setCopyOpenDay(null)
                                    setCopySelectedDays([])
                                  }}
                                >
                                  取消
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => applyCopy(dayData.day_of_week || "")}
                                  disabled={!copySelectedDays.length}
                                >
                                  确认
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addTimeSegment(dayData.day_of_week)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        添加时间段
                      </Button>
                    </div>
                  )}
                </div>
                <div
                  onPointerDown={(e) => {
                    if (readonly) return
                    beginCreate(dayData.day_of_week || "", e)
                  }}
                >
                  {renderTimeSegments(dayData.day_of_week || "", dayData.data)}
                </div>
              </div>
            ))}

            {value.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>暂无录制时间段</p>
                <p className="text-sm">点击"添加时间段"开始配置</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }
)

VideoPeriodsWidget.displayName = "VideoPeriodsWidget"

export { VideoPeriodsWidget }
