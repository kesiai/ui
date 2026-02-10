import * as React from "react"
import DateRange from '@/registry/components/form-date-range/form-date-range.tsx'
import { ComponentConfig } from '@/app/config/types'

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
    name: 'defaultVal',
    label: '默认值',
    type: 'text' as const,
    default: '',
    description: '格式：开始时间 - 结束时间，例如：2024-01-01 - 2024-12-31（兼容 table-field）'
  },
  {
    name: 'size',
    label: '尺寸',
    type: 'select' as const,
    default: 'middle',
    options: [
      { value: 'small', label: '小' },
      { value: 'middle', label: '中' },
      { value: 'large', label: '大' }
    ],
    description: '兼容 table-field 配置'
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
  defaultVal: '',
  size: 'middle' as 'small' | 'middle' | 'large',
  disabled: false,
  placeholder: '请选择日期范围',
  width: 100
}

const renderDateRangePreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <DateRangePreview props={props} />
      </div>
    </div>
  )
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
