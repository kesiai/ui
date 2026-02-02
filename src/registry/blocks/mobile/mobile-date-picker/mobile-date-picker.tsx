"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerContent,
  DrawerPortal,
} from "@/components/ui/drawer"
import { ChevronLeft } from "lucide-react"

export interface MobileDatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * 精度
   */
  precision?: 'year' | 'month' | 'week' | 'week-day' | 'day' | 'hour' | 'minute' | 'second'
  /**
   * 默认值
   */
  defaultValue?: string
  /**
   * 当前值
   */
  value?: string
  /**
   * 值变化回调
   */
  onChange?: (value: string) => void
  /**
   * 禁用状态
   */
  disabled?: boolean
  /**
   * 最小日期 (用于 day, week-day 精度)
   */
  minDate?: string
  /**
   * 最大日期 (用于 day, week-day 精度)
   */
  maxDate?: string
  /**
   * 最小时间 (用于 hour, minute, second 精度)
   */
  minDateTime?: string
  /**
   * 最大时间 (用于 hour, minute, second 精度)
   */
  maxDateTime?: string
  /**
   * 弹窗是否显示
   */
  popVisible?: boolean
}

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const WEEKDAY_VALUES = [0, 1, 2, 3, 4, 5, 6]

// 格式化日期
const formatDate = (date: Date, precision: string): string => {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hour = pad(date.getHours())
  const minute = pad(date.getMinutes())
  const second = pad(date.getSeconds())
  const weekday = date.getDay()

  switch (precision) {
    case 'year':
      return `${year}`
    case 'month':
      return `${year}-${month}`
    case 'week':
      const startOfYear = new Date(year, 0, 1)
      const weekNumber = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
      return `${year}-${weekNumber}周`
    case 'week-day':
      const startOfYear2 = new Date(year, 0, 1)
      const weekNum = Math.ceil(((date.getTime() - startOfYear2.getTime()) / 86400000 + startOfYear2.getDay() + 1) / 7)
      return `${year}-${weekNum}周-${WEEKDAYS[weekday]}`
    case 'hour':
      return `${year}-${month}-${day} ${hour}`
    case 'minute':
      return `${year}-${month}-${day} ${hour}:${minute}`
    case 'second':
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    default:
      return `${year}-${month}-${day}`
  }
}

// 解析日期字符串
const parseDate = (value: string, precision: string): Date | undefined => {
  if (!value) return undefined

  try {
    switch (precision) {
      case 'year':
        return new Date(parseInt(value), 0, 1)
      case 'month':
        const [year, month] = value.split('-').map(Number)
        return new Date(year, month - 1, 1)
      case 'hour':
        const [yh, mh, dh, hourh] = value.split(/[-\s:]/).map(Number)
        return new Date(yh, mh - 1, dh, hourh, 0, 0)
      case 'minute':
        const [ymi, mmi, dmi, hormi, minmi] = value.split(/[-\s:]/).map(Number)
        return new Date(ymi, mmi - 1, dmi, hormi, minmi, 0)
      case 'second':
        const [ys, ms, ds, hors, mins, secs] = value.split(/[-\s:]/).map(Number)
        return new Date(ys, ms - 1, ds, hors, mins, secs)
      default:
        const [yd, md, dd] = value.split('-').map(Number)
        return new Date(yd, md - 1, dd)
    }
  } catch {
    return undefined
  }
}

// 滚轮列项
interface WheelItem {
  value: number | string
  label: string
  isPadding?: boolean
}

// 生成年份数据 (前后10年)
const generateYears = (currentYear: number): WheelItem[] => {
  const years: WheelItem[] = []
  const startYear = currentYear - 10
  const endYear = currentYear + 10
  for (let y = startYear; y <= endYear; y++) {
    years.push({ value: y, label: `${y}年` })
  }
  return years
}

// 生成月份数据
const generateMonths = (): WheelItem[] => {
  return [
    { value: 0, label: '1月' },
    { value: 1, label: '2月' },
    { value: 2, label: '3月' },
    { value: 3, label: '4月' },
    { value: 4, label: '5月' },
    { value: 5, label: '6月' },
    { value: 6, label: '7月' },
    { value: 7, label: '8月' },
    { value: 8, label: '9月' },
    { value: 9, label: '10月' },
    { value: 10, label: '11月' },
    { value: 11, label: '12月' }
  ]
}

// 生成日期数据 (根据年月)
const generateDays = (year: number, month: number): WheelItem[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const items: WheelItem[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    items.push({ value: d, label: `${d}日` })
  }
  return items
}

// 生成周数据
const generateWeeks = (year: number): WheelItem[] => {
  const startOfYear = new Date(year, 0, 1)
  const weeks: WheelItem[] = []
  for (let w = 1; w <= 53; w++) {
    const weekStart = new Date(startOfYear)
    weekStart.setDate(weekStart.getDate() + (w - 1) * 7)
    if (weekStart.getFullYear() > year) break
    weeks.push({ value: w, label: `${w}周` })
  }
  return weeks
}

// 生成小时数据
const generateHours = (): WheelItem[] => {
  const items: WheelItem[] = []
  for (let h = 0; h < 24; h++) {
    items.push({ value: h, label: `${h}时` })
  }
  return items
}

// 生成分钟数据
const generateMinutes = (): WheelItem[] => {
  const items: WheelItem[] = []
  for (let m = 0; m < 60; m++) {
    items.push({ value: m, label: `${m}分` })
  }
  return items
}

// 生成秒数据
const generateSeconds = (): WheelItem[] => {
  const items: WheelItem[] = []
  for (let s = 0; s < 60; s++) {
    items.push({ value: s, label: `${s}秒` })
  }
  return items
}

// 星期数据
const generateWeekdays = (): WheelItem[] => {
  return WEEKDAYS.map((label, value) => ({ value: WEEKDAY_VALUES[value], label }))
}

// 滚轮列组件
interface WheelColumnProps {
  items: WheelItem[]
  value: number | string
  onChange: (value: any) => void
  height?: string,
  visible: boolean
}

const WheelColumn: React.FC<WheelColumnProps> = ({ items, value, onChange, height = "h-60", visible }) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  // 拖动状态
  const [offsetY, setOffsetY] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const [isAnimating, setIsAnimating] = React.useState(false)

  const startYRef = React.useRef(0)
  const startOffsetYRef = React.useRef(0)
  const lastYRef = React.useRef(0)
  const velocityRef = React.useRef(0)
  const animationRafRef = React.useRef<number | null>(null)

  const itemHeight = 36 // 每项高度
  const visibleCount = 7 // 可见项数
  const paddingCount = 2 // 上下各添加的空白项数量
  const containerHeight = visibleCount * itemHeight

  // 在 items 前后添加空白占位项
  const paddedItems = React.useMemo(() => {
    const paddingItems = Array(paddingCount).fill(null).map((_, i) => ({
      value: `__padding_top_${i}__`,
      label: '',
      isPadding: true
    }))
    const bottomPaddingItems = Array(paddingCount).fill(null).map((_, i) => ({
      value: `__padding_bottom_${i}__`,
      label: '',
      isPadding: true
    }))
    return [...paddingItems, ...items, ...bottomPaddingItems]
  }, [items, paddingCount])

  const totalHeight = paddedItems.length * itemHeight
  const maxOffset = totalHeight - containerHeight

  // 计算选中值对应的偏移量
  const getValueOffset = React.useCallback((val: number | string) => {
    const index = items.findIndex(item => item.value === val)
    if (index === -1) return paddingCount * itemHeight + containerHeight / 2 - itemHeight / 2
    const paddedIndex = index + paddingCount
    return Math.max(0, Math.min(
      (paddedIndex - Math.floor(visibleCount / 2)) * itemHeight,
      maxOffset
    ))
  }, [items, paddingCount, itemHeight, visibleCount, containerHeight, maxOffset])

  // 初始化滚动位置
  React.useEffect(() => {
    if (visible) {
      const targetOffset = getValueOffset(value)
      setOffsetY(targetOffset)
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 150)
      return () => clearTimeout(timer)
    }
  }, [visible, getValueOffset, value])

  // 从偏移量计算选中的索引
  const getSelectedIndex = React.useCallback((currentOffset: number) => {
    const centerOffset = containerHeight / 2 - itemHeight / 2
    const paddedIndex = Math.round((currentOffset + centerOffset) / itemHeight)
    return Math.max(paddingCount, Math.min(paddedIndex, paddedItems.length - 1 - paddingCount))
  }, [containerHeight, itemHeight, paddingCount, paddedItems.length])

  // 更新选中值
  const updateValue = React.useCallback((currentOffset: number) => {
    const selectedIndex = getSelectedIndex(currentOffset)
    const realIndex = selectedIndex - paddingCount
    if (realIndex >= 0 && realIndex < items.length) {
      const selectedItem = items[realIndex]
      if (selectedItem && selectedItem.value !== value) {
        onChange(selectedItem.value)
      }
    }
  }, [getSelectedIndex, paddingCount, items, value, onChange])

  // 惯性滚动动画
  const startInertia = React.useCallback(() => {
    // 取消之前的动画
    if (animationRafRef.current) {
      cancelAnimationFrame(animationRafRef.current)
      animationRafRef.current = null
    }

    // 直接吸附到最近的选项，不做惯性动画
    const selectedIndex = getSelectedIndex(offsetY)
    const targetOffset = Math.max(0, Math.min(
      (selectedIndex - Math.floor(visibleCount / 2)) * itemHeight,
      maxOffset
    ))
    setIsAnimating(true)
    setOffsetY(targetOffset)
    updateValue(targetOffset)
    const timer = setTimeout(() => setIsAnimating(false), 150)
    return () => clearTimeout(timer)
  }, [offsetY, getSelectedIndex, visibleCount, itemHeight, maxOffset, updateValue])

  // 触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setIsAnimating(false)
    startYRef.current = e.touches[0].clientY
    startOffsetYRef.current = offsetY
    lastYRef.current = e.touches[0].clientY
    velocityRef.current = 0

    // 取消之前的动画
    if (animationRafRef.current) {
      cancelAnimationFrame(animationRafRef.current)
      animationRafRef.current = null
    }
  }

  // 触摸移动
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    e.stopPropagation()

    const currentY = e.touches[0].clientY
    const deltaY = currentY - lastYRef.current
    lastYRef.current = currentY

    // 计算速度
    velocityRef.current = deltaY

    const newOffset = Math.max(-itemHeight * paddingCount, Math.min(
      startOffsetYRef.current + (startYRef.current - currentY),
      maxOffset + itemHeight * paddingCount
    ))

    setOffsetY(newOffset)
  }

  // 触摸结束
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    startInertia()
  }

  // 鼠标事件（支持桌面调试）
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setIsAnimating(false)
    startYRef.current = e.clientY
    startOffsetYRef.current = offsetY
    lastYRef.current = e.clientY
    velocityRef.current = 0

    if (animationRafRef.current) {
      cancelAnimationFrame(animationRafRef.current)
      animationRafRef.current = null
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    e.stopPropagation()

    const currentY = e.clientY
    const deltaY = currentY - lastYRef.current
    lastYRef.current = currentY
    velocityRef.current = deltaY

    const newOffset = Math.max(-itemHeight * paddingCount, Math.min(
      startOffsetYRef.current + (startYRef.current - currentY),
      maxOffset + itemHeight * paddingCount
    ))

    setOffsetY(newOffset)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isDragging) {
      setIsDragging(false)
      startInertia()
    }
  }

  // 清理
  React.useEffect(() => {
    return () => {
      if (animationRafRef.current) cancelAnimationFrame(animationRafRef.current)
    }
  }, [])

  // 处理全局鼠标释放（支持拖出容器后释放）
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        startInertia()
      }
    }

    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp)
      window.addEventListener('touchend', handleGlobalMouseUp)
      return () => {
        window.removeEventListener('mouseup', handleGlobalMouseUp)
        window.removeEventListener('touchend', handleGlobalMouseUp)
      }
    }
  }, [isDragging, startInertia])

  return (
    <div
      ref={containerRef}
      className={cn("relative flex-1 overflow-hidden", height)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
    >
      {/* 选中行的高亮指示器 */}
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none border-y border-primary/20 bg-primary/5"
        style={{
          top: (containerHeight - itemHeight) / 2,
          height: itemHeight,
        }}
      />
      {/* 列表容器 */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: 0,
          height: containerHeight,
          overflow: 'hidden',
        }}
      >
        <div
          className={cn("transition-transform will-change-transform", isAnimating && "transition-[transform] duration-300 ease-out")}
          style={{
            transform: `translateY(${-offsetY}px)`,
            height: totalHeight,
          }}
        >
          {paddedItems.map(item => (
            <div
              key={item.value}
              className={cn(
                "flex items-center justify-center select-none",
                "text-sm",
                !item.isPadding && value === item.value && "font-semibold text-primary",
                item.isPadding && "pointer-events-none",
              )}
              style={{ height: itemHeight }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const MobileDatePicker = React.forwardRef<HTMLDivElement, MobileDatePickerProps>(
  (
    {
      precision = 'day',
      defaultValue,
      value,
      disabled = false,
      minDate,
      maxDate,
      minDateTime,
      maxDateTime,
      popVisible = false,
      className,
      onChange,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(popVisible)
    const [dateStr, setDateStr] = React.useState<string | undefined>()

    // 暂存状态 - 用于存储用户在弹窗中选择但未确认的时间
    const [pendingDate, setPendingDate] = React.useState<Date>(() => {
      const initialValue = value ?? defaultValue
      return initialValue ? parseDate(initialValue, precision) || new Date() : new Date()
    })

    // 打开弹窗时，用当前值初始化暂存状态
    React.useEffect(() => {
      if (visible) {
        const initialValue = value ?? defaultValue
        setPendingDate(initialValue ? parseDate(initialValue, precision) || new Date() : new Date())
      }
    }, [visible, value, defaultValue, precision])

    // 计算最小最大限制
    const min = React.useMemo(() => {
      if (precision === 'day' || precision === 'week-day') {
        return minDate ? new Date(minDate) : undefined
      }
      if (precision === 'hour' || precision === 'minute' || precision === 'second') {
        return minDateTime ? new Date(minDateTime) : undefined
      }
      return undefined
    }, [minDate, minDateTime, precision])

    const max = React.useMemo(() => {
      if (precision === 'day' || precision === 'week-day') {
        return maxDate ? new Date(maxDate) : undefined
      }
      if (precision === 'hour' || precision === 'minute' || 'second') {
        return maxDateTime ? new Date(maxDateTime) : undefined
      }
      return undefined
    }, [maxDate, maxDateTime, precision])

    // 当前暂存值的各部分
    const currentYear = pendingDate.getFullYear()
    const currentMonth = pendingDate.getMonth()
    const currentDay = pendingDate.getDate()
    const currentHour = pendingDate.getHours()
    const currentMinute = pendingDate.getMinutes()
    const currentSecond = pendingDate.getSeconds()
    const currentWeekday = pendingDate.getDay()

    // 生成各列数据
    const yearItems = React.useMemo(() => generateYears(currentYear), [currentYear])
    const monthItems = generateMonths()
    const dayItems = React.useMemo(() => generateDays(currentYear, currentMonth), [currentYear, currentMonth])
    const weekItems = React.useMemo(() => generateWeeks(currentYear), [currentYear])
    const weekdayItems = generateWeekdays()
    const hourItems = generateHours()
    const minuteItems = generateMinutes()
    const secondItems = generateSeconds()

    // 处理选择确认 - 将暂存的时间真正保存
    const handleConfirm = () => {
      const formatted = formatDate(pendingDate, precision)
      onChange?.(formatted)
      setDateStr(formatted)
      setVisible(false)
    }
      
    // 更新暂存日期的某一部分（滚动时调用，不触发 onChange）
    const updatePendingDate = (part: string, newValue: any) => {
      const newDate = new Date(pendingDate)

      switch (part) {
        case 'year':
          newDate.setFullYear(newValue)
          break
        case 'month':
          newDate.setMonth(newValue)
          break
        case 'day':
          newDate.setDate(newValue)
          break
        case 'hour':
          newDate.setHours(newValue)
          break
        case 'minute':
          newDate.setMinutes(newValue)
          break
        case 'second':
          newDate.setSeconds(newValue)
          break
        case 'week':
          // 周选择：计算该周的第一天（周日）
          const year = newDate.getFullYear()
          const weekNum = newValue as number
          const startOfYear = new Date(year, 0, 1)
          const weekStart = new Date(startOfYear)
          weekStart.setDate(weekStart.getDate() + (weekNum - 1) * 7)
          newDate.setTime(weekStart.getTime())
          break
        case 'weekday':
          newDate.setDate(newDate.getDate() - newDate.getDay() + newValue)
          break
      }
      setPendingDate(newDate)
    }

    // 渲染选择器内容
    const renderPicker = (visible: boolean) => {
      const columns: { items: WheelItem[]; value: number | string; onChange: (v: any) => void }[] = []

      switch (precision) {
        case 'year':
          columns.push({
            items: yearItems,
            value: currentYear,
            onChange: (v) => updatePendingDate('year', v)
          })
          break
        case 'month':
          columns.push({
            items: yearItems,
            value: currentYear,
            onChange: (v) => updatePendingDate('year', v)
          })
          columns.push({
            items: monthItems,
            value: currentMonth,
            onChange: (v) => updatePendingDate('month', v)
          })
          break
        case 'week':
          columns.push({
            items: yearItems,
            value: currentYear,
            onChange: (v) => updatePendingDate('year', v)
          })
          columns.push({
            items: weekItems,
            value: Math.ceil(((pendingDate.getTime() - new Date(currentYear, 0, 1).getTime()) / 86400000 + new Date(currentYear, 0, 1).getDay() + 1) / 7),
            onChange: (v) => updatePendingDate('week', v)
          })
          break
        case 'week-day':
          columns.push({
            items: yearItems,
            value: currentYear,
            onChange: (v) => updatePendingDate('year', v)
          })
          columns.push({
            items: weekItems,
            value: Math.ceil(((pendingDate.getTime() - new Date(currentYear, 0, 1).getTime()) / 86400000 + new Date(currentYear, 0, 1).getDay() + 1) / 7),
            onChange: (v) => updatePendingDate('week', v)
          })
          columns.push({
            items: weekdayItems,
            value: currentWeekday,
            onChange: (v) => updatePendingDate('weekday', v)
          })
          break
        case 'day':
          columns.push({
            items: yearItems,
            value: currentYear,
            onChange: (v) => updatePendingDate('year', v)
          })
          columns.push({
            items: monthItems,
            value: currentMonth,
            onChange: (v) => updatePendingDate('month', v)
          })
          columns.push({
            items: dayItems,
            value: currentDay,
            onChange: (v) => updatePendingDate('day', v)
          })
          break
        case 'hour':
          columns.push({
            items: yearItems,
            value: currentYear,
            onChange: (v) => updatePendingDate('year', v)
          })
          columns.push({
            items: monthItems,
            value: currentMonth,
            onChange: (v) => updatePendingDate('month', v)
          })
          columns.push({
            items: dayItems,
            value: currentDay,
            onChange: (v) => updatePendingDate('day', v)
          })
          columns.push({
            items: hourItems,
            value: currentHour,
            onChange: (v) => updatePendingDate('hour', v)
          })
          break
        case 'minute':
          columns.push({
            items: yearItems,
            value: currentYear,
            onChange: (v) => updatePendingDate('year', v)
          })
          columns.push({
            items: monthItems,
            value: currentMonth,
            onChange: (v) => updatePendingDate('month', v)
          })
          columns.push({
            items: dayItems,
            value: currentDay,
            onChange: (v) => updatePendingDate('day', v)
          })
          columns.push({
            items: hourItems,
            value: currentHour,
            onChange: (v) => updatePendingDate('hour', v)
          })
          columns.push({
            items: minuteItems,
            value: currentMinute,
            onChange: (v) => updatePendingDate('minute', v)
          })
          break
        case 'second':
          columns.push({
            items: yearItems,
            value: currentYear,
            onChange: (v) => updatePendingDate('year', v)
          })
          columns.push({
            items: monthItems,
            value: currentMonth,
            onChange: (v) => updatePendingDate('month', v)
          })
          columns.push({
            items: dayItems,
            value: currentDay,
            onChange: (v) => updatePendingDate('day', v)
          })
          columns.push({
            items: hourItems,
            value: currentHour,
            onChange: (v) => updatePendingDate('hour', v)
          })
          columns.push({
            items: minuteItems,
            value: currentMinute,
            onChange: (v) => updatePendingDate('minute', v)
          })
          columns.push({
            items: secondItems,
            value: currentSecond,
            onChange: (v) => updatePendingDate('second', v)
          })
          break
      }
      return (
        <div
          onPointerDownCapture={(e) => e.stopPropagation()}
          onPointerMoveCapture={(e) => e.stopPropagation()}
          onPointerUpCapture={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <button
              type="button"
              className="text-primary px-3 py-1"
              onClick={() => setVisible(false)}
            >
              取消
            </button>
            <button
              type="button"
              className="text-primary px-3 py-1"
              onClick={handleConfirm}
            >
              确定
            </button>
          </div>
          <div className="flex py-2" style={{ touchAction: 'none' }}>
            {columns.map((column, index) => (
              <WheelColumn
                key={index}
                visible={visible}
                items={column.items}
                value={column.value}
                onChange={column.onChange}
              />
            ))}
          </div>
        </div>
      )
    }

    const displayValue = dateStr || '请选择'

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div
          className={cn(
            "flex items-center justify-between px-4 py-3 bg-background border rounded-md cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !disabled && setVisible(true)}
        >
          <span className="text-sm">{displayValue}</span>
          {!disabled && <ChevronLeft className="h-4 w-4 rotate-180" />}
        </div>

        <Drawer open={visible} onOpenChange={setVisible}>
          <DrawerPortal>
            <DrawerContent>
              {renderPicker(visible)}
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
      </div>
    )
  }
)

MobileDatePicker.displayName = "MobileDatePicker"

export { MobileDatePicker }