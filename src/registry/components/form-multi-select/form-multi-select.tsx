import * as React from "react"
import type { BaseFormFieldProps, FormOption } from "@/registry/lib/base-form-props"

import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface FormMultiSelectProps
  extends Omit<BaseFormFieldProps, "value" | "onChange">,
  Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onBlur" | "onFocus" | "defaultValue"> {
  /** 当前值 */
  value?: (string | number)[]
  /** 默认值 */
  defaultValue?: (string | number)[]
  /** 占位符 */
  placeholder?: string
  /** 选项列表 */
  options?: FormOption[]
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readOnly?: boolean
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示清除按钮 */
  allowClear?: boolean
  /** 最大可选数量 */
  maxCount?: number
  /** 值改变时的回调 */
  onChange?: (value: (string | number)[]) => void
  /** 失去焦点时的回调 */
  onBlur?: () => void
  /** 获得焦点时的回调 */
  onFocus?: () => void
}

const FormMultiSelect = React.forwardRef<HTMLDivElement, FormMultiSelectProps>(
  (
    {
      className,
      value,
      defaultValue,
      placeholder = "请选择",
      disabled = false,
      readOnly = false,
      bordered = true,
      allowClear = false,
      maxCount,
      onChange,
      onBlur,
      onFocus,
      ...props
    },
    _ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState<(string | number)[]>(
      defaultValue || [],
    )
    const [open, setOpen] = React.useState(false)

    // options 由 FormField 从 schema.enum 自动转换，或通过 options prop 显式传入
    const options: FormOption[] = props?.options || []

    const rawValue = value !== undefined ? value : internalValue
    const currentValue: (string | number)[] = Array.isArray(rawValue) ? rawValue : rawValue != null ? [rawValue] : []

    const handleSelect = (selectedValue: string | number) => {
      if (readOnly) return
      const isSelected = currentValue.some((v) => String(v) === String(selectedValue))
      let newValue: (string | number)[]

      if (isSelected) {
        newValue = currentValue.filter((v) => String(v) !== String(selectedValue))
      } else {
        if (maxCount !== undefined && currentValue.length >= maxCount) return
        newValue = [...currentValue, selectedValue]
      }

      setInternalValue(newValue)
      onChange?.(newValue)
    }

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      if (readOnly) return
      setInternalValue([])
      onChange?.([])
    }

    const handleRemove = (removedValue: string | number, e: React.MouseEvent) => {
      e.stopPropagation()
      if (readOnly) return
      const newValue = currentValue.filter((v) => String(v) !== String(removedValue))
      setInternalValue(newValue)
      onChange?.(newValue)
    }

    const selectedLabels = currentValue.map((v) => {
      const option = options.find((opt) => String(opt.value) === String(v))
      return option?.label || String(v)
    })

    const showClear = allowClear && currentValue.length > 0 && !disabled && !readOnly

    return (
      <Popover open={open} onOpenChange={(o) => {
        setOpen(o)
        if (o) {
          onFocus?.()
        } else {
          onBlur?.()
        }
      }}>
        <PopoverTrigger asChild>
          <div
            role="combobox"
            aria-expanded={open}
            className={cn(
              "flex w-full min-h-9 items-center justify-between gap-1 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
              bordered ? "border-input" : "border-transparent",
              className,
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {currentValue.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                currentValue.map((v, i) => (
                  <Badge
                    key={String(v)}
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                  >
                    {selectedLabels[i]}
                    {!disabled && !readOnly && (
                      <button
                        type="button"
                        onClick={(e) => handleRemove(v, e)}
                        className="ml-1 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {showClear && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="搜索选项..." />
            <CommandList>
              <CommandEmpty>没有找到匹配的选项</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = currentValue.some(
                    (v) => String(v) === String(option.value),
                  )
                  return (
                    <CommandItem
                      key={String(option.value)}
                      value={String(option.value)}
                      disabled={option.disabled}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option.label || String(option.value)}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)

FormMultiSelect.displayName = "FormMultiSelect"

export { FormMultiSelect }
