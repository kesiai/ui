import * as React from "react"
import { format as formatFn } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { zhCN } from "date-fns/locale"

export interface DatePickerProps {
  /**
   * 日期格式：date-日期, datetime-日期时间, month-月份
   */
  format?: 'date' | 'datetime' | 'month' | 'ymdh'
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 值 (string 格式)
   */
  value?: string
  /**
   * 变化回调
   */
  onChange?: (value: string | null) => void
  /**
   * 占位符
   */
  placeholder?: string
  /**
   * 是否禁用今天之前的日期
   */
  disabledBeforeToday?: boolean
  /**
   * 大小
   */
  size?: 'small' | 'middle' | 'large'
}

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      format = 'date',
      disabled = false,
      value,
      onChange,
      placeholder = '请选择日期',
      disabledBeforeToday = false,
      size = 'middle',
      className,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [timeValue, setTimeValue] = React.useState('00:00:00')
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined)

    // 解析值
    React.useEffect(() => {
      if (value) {
        try {
          const date = new Date(value)
          if (!isNaN(date.getTime())) {
            setSelectedDate(date)
            if (format === 'datetime' || format === 'ymdh') {
              const hours = String(date.getHours()).padStart(2, '0')
              const minutes = String(date.getMinutes()).padStart(2, '0')
              const seconds = String(date.getSeconds()).padStart(2, '0')
              setTimeValue(`${hours}:${minutes}:${seconds}`)
            }
          }
        } catch (e) {
          setSelectedDate(undefined)
        }
      } else {
        setSelectedDate(undefined)
      }
    }, [value, format])

    const handleDateSelect = (date: Date | undefined) => {
      setSelectedDate(date)
      if (date) {
        if (format === 'datetime') {
          const [hours = '00', minutes = '00', seconds = '00'] = timeValue.split(':')
          date.setHours(Number(hours), Number(minutes), Number(seconds))
          onChange?.(formatFn(date, 'yyyy-MM-dd HH:mm:ss'))
        } else if (format === 'ymdh') {
          const [hours = '00', minutes = '00'] = timeValue.split(':')
          date.setHours(Number(hours), Number(minutes), 0)
          onChange?.(formatFn(date, 'yyyy-MM-dd HH:00:00'))
        } else if (format === 'month') {
          onChange?.(formatFn(date, 'yyyy-MM'))
        } else {
          onChange?.(formatFn(date, 'yyyy-MM-dd'))
        }
      } else {
        onChange?.(null)
      }
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTimeValue(e.target.value)
      if (selectedDate) {
        const newDate = new Date(selectedDate)
        const [hours = '00', minutes = '00', seconds = '00'] = e.target.value.split(':')
        newDate.setHours(Number(hours), Number(minutes), Number(seconds))
        if (format === 'ymdh') {
          onChange?.(formatFn(newDate, 'yyyy-MM-dd HH:00:00'))
        } else {
          onChange?.(formatFn(newDate, 'yyyy-MM-dd HH:mm:ss'))
        }
      }
    }

    const disabledDate = (date: Date) => {
      if (disabledBeforeToday) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date < today
      }
      return false
    }

    const formatDisplayValue = () => {
      if (!selectedDate) return ''
      if (format === 'datetime') {
        return formatFn(selectedDate, 'yyyy-MM-dd HH:mm:ss')
      } else if (format === 'ymdh') {
        return formatFn(selectedDate, 'yyyy-MM-dd HH:00')
      } else if (format === 'month') {
        return formatFn(selectedDate, 'yyyy-MM')
      } else {
        return formatFn(selectedDate, 'yyyy-MM-dd')
      }
    }

    const sizeClasses = {
      small: 'h-8 px-2 py-1 text-sm',
      middle: 'h-10 px-3 py-2',
      large: 'h-12 px-4 py-3 text-lg'
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            disabled={disabled}
            className={cn(
              "justify-start text-left font-normal w-full",
              !selectedDate && "text-muted-foreground",
              sizeClasses[size],
              className
            )}
            {...props}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? formatDisplayValue() : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {format === 'month' ? (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              disabled={disabledDate}
              locale={zhCN}
              fromYear={1960}
              toYear={2100}
              defaultMonth={selectedDate}
            />
          ) : (
            <div className={cn(format === 'datetime' || format === 'ymdh' ? "flex gap-2 p-2" : "")}>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                disabled={disabledDate}
                locale={zhCN}
              />
              {(format === 'datetime' || format === 'ymdh') && (
                <div className="flex flex-col gap-2">
                  <input
                    type={format === 'ymdh' ? 'time' : 'time'}
                    step={format === 'ymdh' ? 3600 : 1}
                    value={timeValue}
                    onChange={handleTimeChange}
                    className="border rounded px-2 py-1"
                  />
                </div>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    )
  }
)

DatePicker.displayName = "DatePicker"

export { DatePicker }
