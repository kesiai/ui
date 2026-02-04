import * as React from 'react'
import { TableFieldRate } from '@/registry/blocks/table-field/table-field-rate/table-field-rate'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldRatePropsConfig = [
  {
    name: 'count',
    label: '评分等级',
    type: 'number' as const,
    default: 5,
    description: '超过5级将使用线条模式'
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
    name: 'inList',
    label: '在列表中',
    type: 'boolean' as const,
    default: false,
    description: '在表格列表中显示时的样式'
  }
]

export const tableFieldRateDefaultProps = {
  count: 5,
  defaultVal: 0,
  disabled: false,
  inList: false
}

const renderTableFieldRatePreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(props.defaultVal || 0)

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldRate
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              count: props.count,
              defaultVal: props.defaultVal,
              disabled: props.disabled,
              inList: props.inList
            }
          }}
        />
      </div>
    </div>
  )
}

const renderTableFieldRateCodePreview = (props: Record<string, any>) => {
  return `<TableFieldRate
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      count: ${props.count},
      defaultVal: ${props.defaultVal},
      disabled: ${props.disabled},
      inList: ${props.inList}
    }
  }}
/>`
}

export const tableFieldRateConfig: ComponentConfig = {
  id: 'table-field-rate',
  name: 'TableField.Rate 评分',
  propsConfig: tableFieldRatePropsConfig,
  defaultProps: tableFieldRateDefaultProps,
  renderPreview: renderTableFieldRatePreview,
  renderCodePreview: renderTableFieldRateCodePreview
}

export default tableFieldRateConfig
