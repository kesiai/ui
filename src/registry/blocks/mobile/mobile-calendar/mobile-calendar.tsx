import * as React from "react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"

export interface MobileCalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  /**
   * 模式
   */
  mode?: "picker" | "calendar"
  /**
   * 日期选择类型
   */
  selectionMode?: "single" | "range"
  /**
   * 最小日期
   */
  min?: string
  /**
   * 最大日期
   */
  max?: string
  /**
   * 是否允许清除
   */
  allowClear?: boolean
  /**
   * 当前值
   */
  value?: string | string[]
  /**
   * 默认值
   */
  defaultValue?: string | string[]
  /**
   * 值变化回调
   */
  onChange?: (value: string | string[]) => void
  /**
   * 占位符文字
   */
  placeholder?: string
  /**
   * 是否禁用
   */
  disabled?: boolean
}

const MobileCalendar = React.forwardRef<HTMLDivElement, MobileCalendarProps>(
  (
    {
      className,
      mode = "picker",
      selectionMode = "single",
      min,
      max,
      allowClear = true,
      value,
      defaultValue,
      onChange,
      placeholder = "请选择",
      disabled = false,
      ...props
    },
    ref
  ) => {

    const convertToDate = (value?: string | string[]): Date | DateRange | undefined => {
      if (!value) return undefined
      if (Array.isArray(value)) {
        if (value.length === 0) return undefined
        return { from: new Date(value[0]), to: new Date(value[1]) }
      }
      return new Date(value)
    }

    const [visible, setVisible] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")
    const [pickerValue, setPickerValue] = React.useState<Date | DateRange | undefined>(
      convertToDate(defaultValue ?? "")
    )

    // 处理默认值
    React.useEffect(() => {
      if (defaultValue) {
        setInternalValue(defaultValue)
        setPickerValue(convertToDate(defaultValue))
      }
    }, [defaultValue])

    // 处理值变化
    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value)
        setPickerValue(convertToDate(value))
      }
    }, [value])

    const convertToString = (value: Date | DateRange | undefined): string | string[] => {
      if (!value) return ""
      if (selectionMode === "range" && value && "from" in value) {
        if (value.to) {
          return [
            format(value.from!, "yyyy-MM-dd"),
            format(value.to, "yyyy-MM-dd")
          ]
        }
        if (value.from) {
          return format(value.from, "yyyy-MM-dd")
        }
        return ""
      }
      return format(value as Date, "yyyy-MM-dd")
    }

    const handleDateChange = (dates: Date | DateRange | undefined) => {      
      if (!dates && !allowClear) return

      if (mode === "picker") {
        setPickerValue(dates)
      } else {
        const stringValue = convertToString(dates)
        setPickerValue(dates)
        setInternalValue(stringValue)
        onChange?.(stringValue)
      }
    }

    const handleConfirm = () => {
      if (mode === "picker") {
        const stringValue = convertToString(pickerValue)
        setInternalValue(stringValue)
        onChange?.(stringValue)
        setVisible(false)
      }
    }

    const displayValue = Array.isArray(internalValue)
      ? internalValue.join(" - ")
      : internalValue

    const placeholderText = !internalValue ? placeholder : displayValue

    return (
      <div ref={ref} className={cn("mobile-calendar px-3 py-2 border border-slate-300 rounded-lg", className)} {...props}>
        {
          mode === "calendar" ? (
            <Calendar
              mode={selectionMode}
              selected={pickerValue}
              onSelect={handleDateChange}
              disabled={disabled ? disabled : { after: max ? new Date(max) : undefined, before: min ? new Date(min) : undefined }}
              className="w-full overflow-y-auto"
              {...((selectionMode === "range" ? { required: true } : {}) as any)}
            />
          ) : <Drawer
            open={visible}
            onOpenChange={(open) => mode === "picker" ? setVisible(open) : undefined}
          >
            <DrawerTrigger asChild>
              <div className="cursor-pointer">{placeholderText}</div>
            </DrawerTrigger>
            <DrawerContent mask className="max-h-[50vh]">
              <div className="flex justify-between items-center px-4 py-2 border-bx">
                <button
                  type="button"
                  className="text-primary px-3 py-1"
                  onClick={() => setVisible(false)}
                >
                  取消
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-primary px-3 py-1"
                    onClick={handleConfirm}
                  >
                    确定
                  </button>
                </div>
              </div>
              <Calendar
                mode={selectionMode}
                selected={pickerValue}
                onSelect={handleDateChange}
                disabled={disabled ? disabled : { after: max ? new Date(max) : undefined, before: min ? new Date(min) : undefined }}
                className="w-full overflow-y-auto"
                {...((selectionMode === "range" ? { required: true } : {}) as any)}
              />
            </DrawerContent>
          </Drawer>
        }
      </div>
    )
  }
)
MobileCalendar.displayName = "MobileCalendar"

export { MobileCalendar }
