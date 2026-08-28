import * as React from "react"
import type { BaseFormFieldProps } from "@/registry/lib/base-form-props"

import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

export interface FormSwitchProps
  extends Omit<BaseFormFieldProps, 'value' | 'onChange' | 'onBlur' | 'name' | 'ref' | 'id' | 'schema' | 'record'>,
  Omit<React.ComponentPropsWithoutRef<typeof Switch>, "onChange" | "value"> {
  /**
   * 当前值（react-hook-form 约定注入；归一为开关状态，显式 checked 优先）
   */
  value?: boolean | string | number | null
  /**
   * 当前值
   */
  checked?: boolean
  /**
   * 默认值
   */
  defaultChecked?: boolean
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 自动聚焦
   */
  autoFocus?: boolean
  /**
   * 值变化回调
   */
  onChange?: (checked: boolean) => void
}

/** 将 react-hook-form 注入的 value 归一为 boolean；非布尔形态返回 undefined（交由内部状态接管） */
const toChecked = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') return value
  if (value === 'true' || value === 1) return true
  if (value === 'false' || value === 0) return false
  return undefined
}

const FormSwitch = React.forwardRef<HTMLButtonElement, FormSwitchProps>(
  (
    {
      className,
      checked: controlledChecked,
      value,
      defaultChecked = false,
      disabled = false,
      autoFocus = false,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
    const valueChecked = toChecked(value)
    const isControlled = controlledChecked !== undefined || valueChecked !== undefined
    const checked = controlledChecked ?? valueChecked ?? internalChecked

    const handleChange = React.useCallback(
      (newChecked: boolean) => {
        if (!isControlled) {
          setInternalChecked(newChecked)
        }
        onChange?.(newChecked)
      },
      [isControlled, onChange]
    )

    return (
      <div className="widget-switch">
        <Switch
          ref={ref}
          className={cn(
            className
          )}
          checked={checked}
          onCheckedChange={handleChange}
          disabled={disabled}
          autoFocus={autoFocus}
          {...props}
          type="button"
        />
      </div>
    )
  }
)
FormSwitch.displayName = "FormSwitch"

export { FormSwitch }
