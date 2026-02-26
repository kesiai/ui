import * as React from "react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

export interface CheckboxOption {
  /**
   * 显示文字
   */
  name: string
  /**
   * 选项值
   */
  value: string
  /**
   * 是否默认选中
   */
  isDefault?: boolean
}

export interface FormCheckboxConfig {
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否显示全选
   */
  isCheckAll?: boolean
  /**
   * 全选框是否单独一行
   */
  checkAllSeparate?: boolean
}

export interface FormCheckboxProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * 当前值（多选时为数组）
   */
  value?: string | string[]
  /**
   * 默认值
   */
  defaultValue?: string | string[]
  /**
   * 选项列表
   */
  options?: CheckboxOption[]
  /**
   * 配置项
   */
  config?: FormCheckboxConfig
  /**
   * 值变化回调
   */
  onChange?: (value: string | string[]) => void
  /**
   * 单元格键值
   */
  cellKey?: string
  /**
   * 单选框标签（当 options 为空时使用）
   */
  label?: string
}

const FormCheckbox = React.forwardRef<HTMLDivElement, FormCheckboxProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue,
      options = [],
      config = {},
      onChange,
      cellKey,
      label,
      ...props
    },
    ref
  ) => {
    const isMulti = options.length > 1
    const defaultList = defaultValue && Array.isArray(defaultValue) ? defaultValue : []
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      isMulti ? defaultList : (defaultValue as string) || ""
    )
    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

    // 处理布尔值：当 options 为空时，value 可能是布尔值
    const getBooleanValue = () => {
      if (options.length === 0 && typeof value === 'boolean') {
        return value ? ['checked'] : []
      }
      return value
    }

    // 全选状态
    const [checkAll, setCheckAll] = React.useState(false)
    // 半选状态
    const [indeterminate, setIndeterminate] = React.useState(false)

    const currentValues = Array.isArray(getBooleanValue()) ? getBooleanValue() : getBooleanValue() ? [getBooleanValue()] : []

    // 更新全选/半选状态
    React.useEffect(() => {
      if (isMulti) {
        setCheckAll(getBooleanValue().length === options.length)
        setIndeterminate(getBooleanValue().length > 0 && getBooleanValue().length < options.length)
      }
    }, [getBooleanValue, options.length, isMulti])

    // 单个 checkbox 变化
    const handleCheckboxChange = React.useCallback(
      (optionValue: string, checked: string | boolean) => {
        const isChecked = checked === true || checked === "on"
        let newValues: string[]

        if (!isMulti) {
          // 单选模式
          newValues = isChecked ? [optionValue] : []
        } else {
          // 多选模式
          newValues = [...getBooleanValue()]
          if (isChecked) {
            if (!newValues.includes(optionValue)) {
              newValues.push(optionValue)
            }
          } else {
            const index = newValues.indexOf(optionValue)
            if (index > -1) {
              newValues.splice(index, 1)
            }
          }
        }

        const resultValue = isMulti ? newValues : (newValues[0] || "")
        if (!isControlled) {
          setInternalValue(resultValue)
        }
        onChange?.(resultValue)
      },
      [isMulti, currentValues, isControlled, onChange]
    )

    // 全选变化
    const handleCheckAllChange = React.useCallback(
      (checked: string | boolean) => {
        const isChecked = checked === true || checked === "on"
        const newValues = isChecked ? options.map((item) => item.value) : []
        if (!isControlled) {
          setInternalValue(newValues)
        }
        onChange?.(newValues)
      },
      [options, isControlled, onChange]
    )

    return (
      <div
        ref={ref}
        className={cn(
          "widget-checkbox",
          !config?.checkAllSeparate ? "flex" : "grid",
          !config?.checkAllSeparate ? "gap-2" : "",
          className
        )}
        {...props}
      >
        {options.length === 0 ? (
          // options 为空时，显示单个 checkbox（输出布尔值）
          label ? (
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={!!value}
                disabled={config?.disabled}
                onCheckedChange={(checked) => {
                  onChange?.(checked as any)
                }}
                aria-invalid={props['aria-invalid']}
              />
              <span className="text-sm">{label}</span>
            </label>
          ) : null
        ) : (
          <>
            {config?.isCheckAll && isMulti && (
              <label className="flex items-center gap-2 check-all">
                <Checkbox
                  checked={checkAll}
                  disabled={config?.disabled}
                  onCheckedChange={handleCheckAllChange}
                  className={indeterminate ? "data-[state=checked]:bg-indeterminate-500" : ""}
                />
                <span className="text-sm">全选</span>
              </label>
            )}
            <div
              className={cn(
                "flex flex-col gap-2",
                config?.checkAllSeparate ? "w-full" : "flex-wrap flex-row"
              )}
            >
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={getBooleanValue().includes(option.value)}
                    disabled={config?.disabled}
                    onCheckedChange={(checked) => handleCheckboxChange(option.value, checked)}
                    aria-invalid={props['aria-invalid']}
                  />
                  <span className="text-sm">{option.name}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }
)
FormCheckbox.displayName = "FormCheckbox"

export { FormCheckbox }
