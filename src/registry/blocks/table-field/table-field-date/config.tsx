import * as React from 'react'
import { TableFieldDate } from '@/registry/blocks/table-field/table-field-date/table-field-date'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldDatePropsConfig = [
  {
    name: 'format',
    label: '日期格式',
    type: 'select' as const,
    default: 'date',
    options: [
      { value: 'ym', label: '年月' },
      { value: 'date', label: '日期' },
      { value: 'datetime', label: '日期时间' },
      { value: 'ymdh', label: '年月日时' }
    ]
  },
  {
    name: 'format2',
    label: '选择器格式',
    type: 'select' as const,
    default: '',
    options: [
      { value: '', label: '跟随日期格式' },
      { value: 'ym', label: '年月' },
      { value: 'date', label: '日期' },
      { value: 'datetime', label: '日期时间' },
      { value: 'ymdh', label: '年月日时' }
    ],
    description: '为空则与日期格式一致'
  },
  {
    name: 'defaultVal',
    label: '默认值',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'afterNow',
    label: '禁用今天之前',
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

export const tableFieldDateDefaultProps = {
  format: 'date' as 'ym' | 'date' | 'datetime' | 'ymdh',
  format2: '' as 'ym' | 'date' | 'datetime' | 'ymdh' | '',
  defaultVal: '',
  disabled: false,
  afterNow: false,
  size: 'middle' as 'small' | 'middle' | 'large'
}

const renderTableFieldDatePreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(props.defaultVal || '')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldDate
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              format: props.format,
              format2: props.format2 || undefined,
              defaultVal: props.defaultVal,
              disabled: props.disabled,
              afterNow: props.afterNow,
              size: props.size
            }
          }}
        />
      </div>
    </div>
  )
}

const renderTableFieldDateCodePreview = (props: Record<string, any>) => {
  return `<TableFieldDate
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      format: "${props.format}",
      format2: "${props.format2}",
      defaultVal: "${props.defaultVal}",
      disabled: ${props.disabled},
      afterNow: ${props.afterNow},
      size: "${props.size}"
    }
  }}
/>`
}

export const tableFieldDateConfig: ComponentConfig = {
  id: 'table-field-date',
  name: 'TableField.Date 日期',
  propsConfig: tableFieldDatePropsConfig,
  defaultProps: tableFieldDateDefaultProps,
  renderPreview: renderTableFieldDatePreview,
  renderCodePreview: renderTableFieldDateCodePreview
}

export default tableFieldDateConfig
