import * as React from 'react'
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import isNil from 'lodash/isNil'

export interface TableFieldCheckboxProps {
  input: {
    value?: boolean
    onChange?: (value: boolean) => void
  }
  field?: {
    schema?: {
      defaultVal?: boolean
      disabled?: boolean
      displayForm?: 'checkbox' | 'switch'
      checkedChildren?: string
      unCheckedChildren?: string
      label?: string
      attrs?: Record<string, any>
      [key: string]: any
    }
    filter?: any
    meta?: any
  }
  label?: string
  meta?: any
  record?: any
  group?: React.ComponentType<any>
  [key: string]: any
}

const TableFieldCheckbox = React.forwardRef<HTMLButtonElement, TableFieldCheckboxProps>(
  (props, ref) => {
    const { input, label, field: { schema } = {}, meta, record, group: FieldGroup } = props
    const { value, onChange } = input || {}

    const {
      defaultVal = false,
      disabled = false,
      displayForm = 'checkbox',
      checkedChildren = '是',
      unCheckedChildren = '否',
      attrs = {}
    } = schema || {}

    // 默认值生效
    React.useEffect(() => {
      if (isNil(value) || value === '') {
        onChange?.(!!defaultVal)
      }
    }, [])

    const checked = value === '' ? defaultVal : !!value

    const handleCheckedChange = (checked: boolean) => {
      onChange?.(checked)
    }

    const content = displayForm === 'switch' ? (
      // Switch 组件 (使用 Checkbox 的样式，但显示为开关样式)
      <label
        className={cn(
          "relative inline-flex items-center cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          type="checkbox"
          ref={ref as any}
          className="sr-only peer"
          checked={checked}
          onChange={(e) => handleCheckedChange(e.target.checked)}
          disabled={disabled}
          {...attrs}
        />
        <div className={cn(
          "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
        )} />
        <span className="ms-3 text-sm font-medium text-gray-900">
          {checked ? checkedChildren : unCheckedChildren}
        </span>
      </label>
    ) : (
      // Checkbox 组件
      <div className="flex items-center space-x-2">
        <ShadcnCheckbox
          ref={ref}
          id="checkbox-component"
          checked={checked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
          {...attrs}
        />
        <label
          htmlFor="checkbox-component"
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            disabled && "cursor-not-allowed"
          )}
        >
          {label || schema?.label}
        </label>
      </div>
    )

    if (FieldGroup) {
      return (
        <FieldGroup meta={meta} input={input} field={{ schema }} tailLayout={true}>
          {content}
        </FieldGroup>
      )
    }

    return content
  }
)

TableFieldCheckbox.displayName = 'TableFieldCheckbox'
TableFieldCheckbox.useGroup = false

export { TableFieldCheckbox }
export default TableFieldCheckbox
