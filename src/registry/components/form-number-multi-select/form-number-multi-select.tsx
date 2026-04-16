import * as React from "react"
import type { FormOption } from "@/registry/lib/base-form-props"
import { FormMultiSelect, type FormMultiSelectProps } from "@/registry/components/form-multi-select/form-multi-select"

export interface FormNumberMultiSelectProps extends Omit<FormMultiSelectProps, "value" | "defaultValue" | "onChange"> {
  /** 当前值（数字数组） */
  value?: number[]
  /** 默认值（数字数组） */
  defaultValue?: number[]
  /** 值改变时的回调 */
  onChange?: (value: number[]) => void
}

const FormNumberMultiSelect = React.forwardRef<HTMLDivElement, FormNumberMultiSelectProps>(
  ({ value, defaultValue, onChange, ...props }, ref) => {
    return (
      <FormMultiSelect
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        {...props}
      />
    )
  },
)

FormNumberMultiSelect.displayName = "FormNumberMultiSelect"

export { FormNumberMultiSelect }
