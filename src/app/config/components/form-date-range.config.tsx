import * as React from "react"
import DateRange from '@/registry/blocks/form/form-date-range/form-date-range.tsx'
import { ComponentConfig } from '../types'

export const DateRangePreview: React.FC<{ props: Record<string, any> }> = ({ props }) => {
  const [value, setValue] = React.useState<string>('')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full" style={{ maxWidth: `${props.width || 100}%` }}>
        <DateRange
          format={props.format}
          disabled={props.disabled}
          placeholder={props.placeholder}
          value={value}
          onChange={setValue}
          cellKey="preview"
        />
      </div>
    </div>
  )
}

export const dateRangePropsConfig = [
  {
    name: 'format',
    label: '格式',
    type: 'select' as const,
    default: 'date',
    options: [
      { value: 'date', label: '日期' },
      { value: 'datetime', label: '日期时间' },
      { value: 'time', label: '时间' }
    ]
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '请选择日期范围',
    placeholder: '请输入占位符'
  },
  {
    name: 'width',
    label: '宽度',
    type: 'range' as const,
    default: 100,
    min: 50,
    max: 100,
    step: 1
  }
]

export const dateRangeDefaultProps = {
  format: 'date',
  disabled: false,
  placeholder: '请选择日期范围',
  width: 100
}

const renderDateRangePreview = (props: Record<string, any>) => {
  return <DateRangePreview props={props} />
}

const renderDateRangeCodePreview = (props: Record<string, any>) => {
  return `<DateRange
  format="${props.format}"
  disabled={${props.disabled}}
  placeholder="${props.placeholder}"
  cellKey="your-cell-key"
/>`
}

export const dateRangeConfig: ComponentConfig = {
  id: 'form-date-range',
  name: 'DateRange 日期范围',
  propsConfig: dateRangePropsConfig,
  defaultProps: dateRangeDefaultProps,
  renderPreview: renderDateRangePreview,
  renderCodePreview: renderDateRangeCodePreview
}
