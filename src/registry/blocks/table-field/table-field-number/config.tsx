import * as React from 'react'
import { TableFieldNumber } from '@/registry/blocks/table-field/table-field-number/table-field-number'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldNumberPropsConfig = [
  {
    name: 'unit',
    label: '单位',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '请输入数字'
  },
  {
    name: 'decimal',
    label: '小数位数',
    type: 'number' as const,
    default: null,
    description: 'null表示不限制'
  },
  {
    name: 'defaultVal',
    label: '默认值',
    type: 'number' as const,
    default: 0
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'max',
    label: '最大值',
    type: 'number' as const,
    default: undefined
  },
  {
    name: 'min',
    label: '最小值',
    type: 'number' as const,
    default: undefined
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

export const tableFieldNumberDefaultProps = {
  unit: '',
  placeholder: '请输入数字',
  decimal: null,
  defaultVal: 0,
  disabled: false,
  max: undefined,
  min: undefined,
  size: 'middle' as 'small' | 'middle' | 'large'
}

const renderTableFieldNumberPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(props.defaultVal || 0)

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldNumber
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              unit: props.unit,
              placeholder: props.placeholder,
              decimal: props.decimal,
              defaultVal: props.defaultVal,
              disabled: props.disabled,
              max: props.max,
              min: props.min,
              size: props.size
            }
          }}
        />
      </div>
    </div>
  )
}

const renderTableFieldNumberCodePreview = (props: Record<string, any>) => {
  return `<TableFieldNumber
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      unit: "${props.unit}",
      placeholder: "${props.placeholder}",
      decimal: ${props.decimal},
      defaultVal: ${props.defaultVal},
      disabled: ${props.disabled},
      max: ${props.max},
      min: ${props.min},
      size: "${props.size}"
    }
  }}
/>`
}

export const tableFieldNumberConfig: ComponentConfig = {
  id: 'table-field-number',
  name: 'TableField.Number 数字',
  propsConfig: tableFieldNumberPropsConfig,
  defaultProps: tableFieldNumberDefaultProps,
  renderPreview: renderTableFieldNumberPreview,
  renderCodePreview: renderTableFieldNumberCodePreview
}

export default tableFieldNumberConfig
