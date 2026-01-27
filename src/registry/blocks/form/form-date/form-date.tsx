"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/components/ui/popover/popover"
import { CalendarIcon, XIcon } from "lucide-react"

export interface FormDateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  /**
   * 清除按钮
   */
  allowClear?: boolean
  /**
   * 自动获取焦点
   */
  autoFocus?: boolean
  /**
   * 是否有边框
   */
  bordered?: boolean
  /**
   * 禁用
   */
  disabled?: boolean
  /**
   * 选择器类型
   */
  picker?: "time" | "date" | "dateTime" | "week" | "month" | "quarter" | "year"
  /**
   * 日历展开
   */
  isCalendar?: boolean
  /**
   * 提示文字
   */
  placeholder?: string
  /**
   * 尺寸
   */
  size?: "large" | "medium" | "small"
  /**
   * 12小时制
   */
  use12Hours?: boolean
  /**
   * 当前值
   */
  value?: string
  /**
   * 默认值
   */
  defaultValue?: string
  /**
   * 值变化回调
   */
  onChange?: (value: string) => void
}

const FormDate = React.forwardRef<HTMLDivElement, FormDateProps>(
  (
    {
      allowClear = true,
      autoFocus = false,
      bordered = true,
      disabled = false,
      picker = "date",
      isCalendar = false,
      placeholder = "请选择日期",
      size = "medium",
      use12Hours = false,
      value,
      defaultValue,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(() => {
      const initialValue = value ?? defaultValue
      return initialValue ? new Date(initialValue) : undefined
    })
    const [month, setMonth] = React.useState<Date | undefined>(date)
    const [inputValue, setInputValue] = React.useState(() => {
      const initialValue = value ?? defaultValue
      return initialValue ? formatDate(new Date(initialValue)) : ""
    })
    const inputRef = React.useRef<HTMLInputElement>(null)

    // 处理默认值
    React.useEffect(() => {
      if (defaultValue) {
        const newDate = new Date(defaultValue)
        setDate(newDate)
        setMonth(newDate)
        setInputValue(formatDate(newDate))
      }
    }, [defaultValue])

    // 处理值变化
    React.useEffect(() => {
      if (value !== undefined) {
        if (value) {
          const newDate = new Date(value)
          setDate(newDate)
          setMonth(newDate)
        } else {
          setDate(undefined)
        }
        setInputValue(value ? formatDate(new Date(value)) : "")
      }
    }, [value])

    // 自动获取焦点
    React.useEffect(() => {
      if (autoFocus && inputRef.current && !disabled) {
        inputRef.current.focus()
      }
    }, [autoFocus, disabled])

     // 辅助函数：补零
    const pad = (num: number) => num.toString().padStart(2, "0")

    function formatDate(date: Date | undefined) {
      if (!date) {
        return ""
      }

      // time 模式：返回 HH:mm:ss
      if (picker === "time") {
        return date.toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: use12Hours,
        })
      }

      // dateTime 模式：返回 YYYY-MM-DD HH:mm:ss
      if (picker === "dateTime") {
        const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
        const formattedTime = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
        return `${formattedDate} ${formattedTime}`
      }

      // week 模式
      if (picker === "week") {
        const startOfYear = new Date(date.getFullYear(), 0, 1)
        const week = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
        return `${date.getFullYear()}第${week}周`
      }

      // month 模式
      if (picker === "month") {
        return `${date.getFullYear()}年${date.getMonth() + 1}月`
      }

      // quarter 模式
      if (picker === "quarter") {
        const quarter = Math.floor(date.getMonth() / 3) + 1
        return `${date.getFullYear()}年第${quarter}季度`
      }

      // year 模式
      if (picker === "year") {
        return `${date.getFullYear()}年`
      }

      // date 模式：返回 YYYY-MM-DD 格式
      const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
      // const formattedTime = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
      return `${formattedDate}`
    }

    function isValidDate(date: Date | undefined) {
      if (!date) {
        return false
      }
      return !isNaN(date.getTime())
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)

      const newDate = new Date(newValue)
      if (isValidDate(newDate)) {
        setDate(newDate)
        setMonth(newDate)
        onChange?.(newValue)
      }
    }

    const handleDateSelect = (selectedDate: Date | undefined) => {
      setDate(selectedDate)
      if (selectedDate) {
        const formatted = formatDate(selectedDate)
        setInputValue(formatted)
        onChange?.(formatted)
      }
      setOpen(false)
    }

    const handleClear = () => {
      setDate(undefined)
      setInputValue("")
      onChange?.("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setOpen(true)
      }
    }

    // 获取尺寸样式
    const getSizeClass = () => {
      switch (size) {
        case "large":
          return "h-12 px-4 text-base"
        case "small":
          return "h-8 px-2 text-sm"
        default:
          return "h-10 px-3 text-sm"
      }
    }

    // 如果是日历展开模式，直接显示日历
    if (isCalendar) {
      return (
        <div ref={ref} className={cn("w-full", className)} {...props}>
          <Calendar
            mode="single"
            selected={date}
            month={month}
            onMonthChange={setMonth}
            onSelect={handleDateSelect}
            disabled={disabled}
          />
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("flex w-full gap-2 flex-row", className)} {...props}>
        {
          picker !== 'time' && 
          <InputGroup className={cn(bordered ? "" : "!border-0", getSizeClass())}>
          <InputGroupInput
            ref={inputRef}
            value={inputValue}
            placeholder={placeholder}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={cn(bordered ? "" : "!border-0", "focus-visible:ring-ring focus-visible:ring-offset-0")}
          />
          <InputGroupAddon align="inline-end">
            {allowClear && inputValue && (
              <InputGroupButton
                variant="ghost"
                size="icon-xs"
                onClick={handleClear}
                disabled={disabled}
              >
                <XIcon />
              </InputGroupButton>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <CalendarIcon />
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={date}
                  month={month}
                  onMonthChange={setMonth}
                  onSelect={handleDateSelect}
                  disabled={disabled}
                />
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
        </InputGroup>
        }
        {
          (picker == 'time' || picker == 'dateTime') && <InputGroupInput
            type="time"
            id="time-picker-optional"
            step="1"
            className={cn(bordered ? "" : "!border-0", "bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none", getSizeClass())}
          />
        }
      </div>
    )
  }
)
FormDate.displayName = "FormDate"

export { FormDate }
