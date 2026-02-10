import * as React from "react"

import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"

export interface FormSwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Switch>, "onChange"> {
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
   * 尺寸
   */
  size?: "default" | "small"
  /**
   * 值变化回调
   */
  onChange?: (checked: boolean) => void
  /**
   * 单元格键值
   */
  cellKey?: string
}

const FormSwitch = React.forwardRef<HTMLButtonElement, FormSwitchProps>(
  (
    {
      className,
      checked: controlledChecked,
      defaultChecked = false,
      disabled = false,
      autoFocus = false,
      size = "default",
      onChange,
      cellKey,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
    const isControlled = controlledChecked !== undefined
    const checked = isControlled ? controlledChecked : internalChecked

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
            size === "small" && "h-5 w-9",
            size === "small" && "[&>[data-radix-switch-thumb]]:h-4 [&>[data-radix-switch-thumb]]:w-4",
            size === "small" && "[&>[data-radix-switch-thumb]]:data-[state=checked]:translate-x-4",
            className
          )}
          checked={checked}
          onCheckedChange={handleChange}
          disabled={disabled}
          autoFocus={autoFocus}
          {...props}
        />
      </div>
    )
  }
)
FormSwitch.displayName = "FormSwitch"

export { FormSwitch }
