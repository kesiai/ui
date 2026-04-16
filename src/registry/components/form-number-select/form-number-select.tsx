import * as React from "react"
import type { FormOption } from "@/registry/lib/base-form-props"
import { FormSelect, type FormSelectProps } from "@/registry/components/form-select/form-select"

export interface FormNumberSelectProps extends Omit<FormSelectProps, "value" | "defaultValue" | "onChange"> {
  /** 当前值（数字） */
  value?: number
  /** 默认值（数字） */
  defaultValue?: number
  /** 值改变时的回调 */
  onChange?: (value: number) => void
}

const FormNumberSelect = React.forwardRef<HTMLDivElement, FormNumberSelectProps>(
  ({ value, defaultValue, onChange, ...props }, ref) => {
    return (
      <FormSelect
        ref={ref}
        value={value !== undefined ? String(value) : undefined}
        defaultValue={defaultValue !== undefined ? String(defaultValue) : undefined}
        onChange={(v) => {
          if (v === "") {
            onChange?.(undefined as unknown as number)
          } else {
            onChange?.(Number(v))
          }
        }}
        {...props}
      />
    )
  },
)

FormNumberSelect.displayName = "FormNumberSelect"

export { FormNumberSelect }
