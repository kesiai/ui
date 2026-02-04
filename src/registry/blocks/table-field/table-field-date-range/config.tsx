import * as React from 'react'
import { TableFieldDateRange } from '@/registry/blocks/table-field/table-field-date-range/table-field-date-range'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldDateRangePropsConfig = [
  {
    name: 'dateFormat',
    label: '日期格式',
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
    description: '格式：开始时间 - 结束时间，例如：2024-01-01 - 2024-12-31'
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
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
    ]
  }
]

export const tableFieldDateRangeDefaultProps = {
  dateFormat: 'date' as 'date' | 'datetime' | 'time',
  defaultVal: '',
  disabled: false,
  size: 'middle' as 'small' | 'middle' | 'large'
}

const renderTableFieldDateRangePreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(props.defaultVal || '')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldDateRange
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              dateFormat: props.dateFormat,
              defaultVal: props.defaultVal,
              disabled: props.disabled,
              size: props.size
            }
          }}
        />
      </div>
    </div>
  )
}

const renderTableFieldDateRangeCodePreview = (props: Record<string, any>) => {
  return `<TableFieldDateRange
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      dateFormat: "${props.dateFormat}",
      defaultVal: "${props.defaultVal}",
      disabled: ${props.disabled},
      size: "${props.size}"
    }
  }}
/>`
}

export const tableFieldDateRangeConfig: ComponentConfig = {
  id: 'table-field-date-range',
  name: 'TableField.DateRange 日期范围',
  propsConfig: tableFieldDateRangePropsConfig,
  defaultProps: tableFieldDateRangeDefaultProps,
  renderPreview: renderTableFieldDateRangePreview,
  renderCodePreview: renderTableFieldDateRangeCodePreview
}

export default tableFieldDateRangeConfig
