import * as React from 'react'
import { format as formatFn } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { zhCN } from 'date-fns/locale'
import isArray from 'lodash/isArray'
import moment from 'moment'

export interface DateRangeComponentProps {
  input: {
    value?: string | string[]
    onChange?: (value: string | null) => void
  }
  field?: {
    schema?: {
      dateFormat?: 'date' | 'datetime' | 'time'
      disabled?: boolean
      defaultVal?: string
      defaultValType?: 'fixed' | 'logic'
      size?: 'small' | 'middle' | 'large'
      [key: string]: any
    }
    filter?: any
    meta?: any
  }
  meta?: any
  cellKey?: string
  record?: any
  [key: string]: any
}

const DateRangeComponent = React.forwardRef<HTMLDivElement, DateRangeComponentProps>(
  (props, ref) => {
    const { input, field: { schema } = {}, meta, cellKey } = props
    const { value, onChange } = input || {}

    const {
      dateFormat = 'date',
      disabled = false,
      defaultVal,
      defaultValType = 'fixed',
      size = 'middle'
    } = schema || {}

    const formats: Record<string, string> = {
      'date': 'yyyy-MM-dd',
      'datetime': 'yyyy-MM-dd HH:mm:ss',
      'time': 'HH:mm:ss'
    }

    const timeFormat = formats[dateFormat]

    const [startDate, setStartDate] = React.useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined)
    const [isStartOpen, setIsStartOpen] = React.useState(false)
    const [isEndOpen, setIsEndOpen] = React.useState(false)

    // 解析值
    React.useEffect(() => {
      if (value && typeof value === 'string' && value.includes(' - ')) {
        const [start, end] = value.split(' - ')
        if (start) setStartDate(new Date(start))
        if (end) setEndDate(new Date(end))
      } else if (!value) {
        setStartDate(undefined)
        setEndDate(undefined)
      }
    }, [value])

    // 默认值生效
    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (!value && defaultVal && defaultValType !== 'logic' && onChange) {
          onChange(defaultVal)
        }
      }, 0)
      return () => clearTimeout(timer)
    }, [])

    const handleStartDateChange = (date: Date | undefined) => {
      setStartDate(date)
      if (endDate) {
        const startStr = formatRangeValue(date, endDate)
        onChange?.(startStr)
      } else {
        onChange?.(date ? formatRangeValue(date, undefined) : null)
      }
      setIsStartOpen(false)
    }

    const handleEndDateChange = (date: Date | undefined) => {
      setEndDate(date)
      if (startDate) {
        const endStr = formatRangeValue(startDate, date)
        onChange?.(endStr)
      } else {
        onChange?.(date ? formatRangeValue(undefined, date) : null)
      }
      setIsEndOpen(false)
    }

    const formatRangeValue = (start: Date | undefined, end: Date | undefined): string | null => {
      if (!start && !end) return null
      if (!start) return ` - ${formatFn(end!, timeFormat)}`
      if (!end) return `${formatFn(start!, timeFormat)} - `
      return `${formatFn(start, timeFormat)} - ${formatFn(end, timeFormat)}`
    }

    const formatDateValue = (date: Date): string => {
      return formatFn(date, timeFormat)
    }

    const handleClear = () => {
      setStartDate(undefined)
      setEndDate(undefined)
      onChange?.(null)
    }

    const sizeClasses = {
      small: 'h-8 px-2 py-1 text-sm',
      middle: 'h-10 px-3 py-2',
      large: 'h-12 px-4 py-3 text-lg'
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 w-full",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className={cn(
                "justify-start text-left font-normal",
                !startDate && "text-muted-foreground",
                sizeClasses[size]
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? formatDateValue(startDate) : <span>开始日期</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {dateFormat === 'date' && (
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                initialFocus
                locale={zhCN}
              />
            )}
            {dateFormat === 'datetime' && (
              <div className="flex gap-2 p-2">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                  locale={zhCN}
                />
                <input
                  type="time"
                  value={startDate ? formatFn(startDate, 'HH:mm:ss') : ''}
                  onChange={(e) => {
                    if (startDate) {
                      const [hours='00', minutes='00', seconds='00'] = e.target.value.split(':')
                      const newDate = new Date(startDate)
                      newDate.setHours(Number(hours), Number(minutes), Number(seconds))
                      handleStartDateChange(newDate)
                    }
                  }}
                  className="border rounded px-2 py-1"
                />
              </div>
            )}
            {dateFormat === 'time' && (
              <div className="flex gap-2 p-2">
                <input
                  type="time"
                  value={startDate ? formatFn(startDate, 'HH:mm:ss') : ''}
                  onChange={(e) => {
                    const [hours='00', minutes='00', seconds='00'] = e.target.value.split(':')
                    const newDate = new Date()
                    newDate.setHours(Number(hours), Number(minutes), Number(seconds))
                    handleStartDateChange(newDate)
                  }}
                  className="border rounded px-2 py-1"
                />
              </div>
            )}
          </PopoverContent>
        </Popover>

        <span className="text-muted-foreground">-</span>

        <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className={cn(
                "justify-start text-left font-normal",
                !endDate && "text-muted-foreground",
                sizeClasses[size]
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? formatDateValue(endDate) : <span>结束日期</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {dateFormat === 'date' && (
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                initialFocus
                locale={zhCN}
              />
            )}
            {dateFormat === 'datetime' && (
              <div className="flex gap-2 p-2">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateChange}
                  initialFocus
                  locale={zhCN}
                />
                <input
                  type="time"
                  value={endDate ? formatFn(endDate, 'HH:mm:ss') : ''}
                  onChange={(e) => {
                    if (endDate) {
                      const [hours='00', minutes='00', seconds='00'] = e.target.value.split(':')
                      const newDate = new Date(endDate)
                      newDate.setHours(Number(hours), Number(minutes), Number(seconds))
                      handleEndDateChange(newDate)
                    }
                  }}
                  className="border rounded px-2 py-1"
                />
              </div>
            )}
            {dateFormat === 'time' && (
              <div className="flex gap-2 p-2">
                <input
                  type="time"
                  value={endDate ? formatFn(endDate, 'HH:mm:ss') : ''}
                  onChange={(e) => {
                    const [hours='00', minutes='00', seconds='00'] = e.target.value.split(':')
                    const newDate = new Date()
                    newDate.setHours(Number(hours), Number(minutes), Number(seconds))
                    handleEndDateChange(newDate)
                  }}
                  className="border rounded px-2 py-1"
                />
              </div>
            )}
          </PopoverContent>
        </Popover>

        {(startDate || endDate) && (
          <Button
            onClick={handleClear}
            disabled={disabled}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            title="清除"
          >
            ×
          </Button>
        )}
      </div>
    )
  }
)

DateRangeComponent.displayName = 'DateRangeComponent'

export default DateRangeComponent
