import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/components/ui/select/select"

const selectVariants = cva(
  "relative border transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-background",
        outline: "border-2 border-primary",
        filled: "border-primary/20 bg-primary/5",
        ghost: "border-transparent hover:bg-accent/50",
      },
      size: {
        sm: "h-8 text-sm",
        md: "h-10 text-base",
        lg: "h-12 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface FormSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onBlur" | "onFocus">,
    VariantProps<typeof selectVariants> {
  /**
   * 当前值
   */
  value?: string
  /**
   * 默认值
   */
  defaultValue?: string
  /**
   * 占位符
   */
  placeholder?: string
  /**
   * 选项列表
   */
  options?: Array<{ value: string; label: string; disabled?: boolean }>
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否只读
   */
  readOnly?: boolean
  /**
   * 是否显示边框
   */
  bordered?: boolean
  /**
   * 是否显示清除按钮
   */
  allowClear?: boolean
  /**
   * 是否支持搜索
   */
  showSearch?: boolean
  /**
   * 是否显示下拉箭头
   */
  showArrow?: boolean
  /**
   * 是否自动获取焦点
   */
  autoFocus?: boolean
  /**
   * 默认是否展开
   */
  defaultOpen?: boolean
  /**
   * 下拉菜单和选择器同宽
   */
  dropdownMatchSelectWidth?: boolean
  /**
   * 值改变时的回调
   */
  onChange?: (value: string) => void
  /**
   * 失去焦点时的回调
   */
  onBlur?: () => void
  /**
   * 获得焦点时的回调
   */
  onFocus?: () => void
}

const FormSelect = React.forwardRef<HTMLDivElement, FormSelectProps>(
  ({
    className,
    variant,
    size,
    value,
    defaultValue,
    placeholder = "请选择",
    options = [],
    disabled = false,
    readOnly = false,
    bordered = true,
    allowClear = false,
    showSearch = false,
    showArrow = true,
    autoFocus = false,
    defaultOpen = false,
    dropdownMatchSelectWidth = true,
    onChange,
    onBlur,
    onFocus,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")
    const [isOpen, setIsOpen] = React.useState(defaultOpen)
    const [searchValue, setSearchValue] = React.useState("")
    const [isHovered, setIsHovered] = React.useState(false)
    const selectRef = React.useRef<HTMLButtonElement>(null)

    const handleValueChange = (newValue: string) => {
      if (readOnly) return
      setInternalValue(newValue)
      setSearchValue("") // 选择后清空搜索
      onChange?.(newValue)
    }

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      if (readOnly) return
      setInternalValue("")
      setSearchValue("")
      setIsOpen(false) // 确保清除后Select关闭
      onChange?.("")
    }

    const handleSearchChange = (value: string) => {
      setSearchValue(value)
    }

    const currentValue = value !== undefined ? value : internalValue

    // 过滤选项
    const filteredOptions = React.useMemo(() => {
      if (!showSearch || !searchValue.trim()) {
        return options
      }
      return options.filter(option =>
        option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        option.value.toLowerCase().includes(searchValue.toLowerCase())
      )
    }, [options, searchValue, showSearch])

    return (
      <div
        ref={ref}
        className={cn(
          selectVariants({ variant, size }),
          !bordered && "border-transparent",
          disabled && "opacity-50 cursor-not-allowed",
          readOnly && "cursor-default",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <Select
          value={currentValue}
          onValueChange={handleValueChange}
          disabled={disabled || readOnly}
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (open) {
              onFocus?.()
            } else {
              onBlur?.()
            }
          }}
        >
          <SelectTrigger
            ref={selectRef}
            className={cn(
              "w-full border-0 bg-transparent h-full px-3"
            )}
            showArrow={showArrow && (!allowClear || !currentValue || disabled || readOnly)}
            showClear={allowClear && currentValue && !disabled && !readOnly}
            onClear={handleClear}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent
            className={cn(
              dropdownMatchSelectWidth && "w-[var(--radix-select-trigger-width)]"
            )}
          >
            {showSearch && (
              <div className="px-3 py-2 border-b">
                <input
                  type="text"
                  placeholder="搜索选项..."
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))
            ) : (
              showSearch && searchValue && (
                <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                  没有找到匹配的选项
                </div>
              )
            )}
          </SelectContent>
        </Select>
      </div>
    )
  }
)

FormSelect.displayName = "FormSelect"

export { FormSelect }