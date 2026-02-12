import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const radioVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
        filled: "",
        ghost: "",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface RadioProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof radioVariants> {
  /**
   * 数据项
   */
  options?: Array<{ name: string; value: string | number }>
  /**
   * 当前值
   */
  value?: string | number
  /**
   * 默认值
   */
  defaultValue?: string | number
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否只读
   */
  readOnly?: boolean
  /**
   * 值变化回调
   */
  onChange?: (value: string | number) => void
}

const FormRadio = React.forwardRef<HTMLDivElement, RadioProps>(
  (
    {
      className,
      options = [],
      value: controlledValue,
      defaultValue,
      disabled = false,
      readOnly = false,
      onChange,
      variant,
      size,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string | number>(
      defaultValue ?? ""
    )

    const isControlled = controlledValue !== undefined
    const currentValue = isControlled ? controlledValue : internalValue

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (readOnly) return
        if (!isControlled) {
          setInternalValue(newValue)
        }

        onChange?.(newValue)
      },
      [isControlled, readOnly, onChange]
    )

    return (
      <div
        ref={ref}
        className={cn(
          radioVariants({ variant, size }),
          className
        )}
        {...props}
      >
        <RadioGroup
          value={String(currentValue)}
          defaultValue={defaultValue !== undefined ? String(defaultValue) : undefined}
          onValueChange={handleValueChange}
          disabled={disabled || readOnly}
          className="flex flex-col space-y-2"
          aria-invalid
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={String(option.value)} id={String(option.value)} />
              <label
                htmlFor={String(option.value)}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.name}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>
    )
  }
)

FormRadio.displayName = "FormRadio"

export { FormRadio }