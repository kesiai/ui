import * as React from 'react'
import { TableFieldBytesArray } from '@/registry/blocks/table-field/table-field-bytes-array/table-field-bytes-array'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldBytesArrayPropsConfig = [
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '请输入内容'
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
  }
]

export const tableFieldBytesArrayDefaultProps = {
  placeholder: '请输入内容',
  defaultVal: '',
  disabled: false
}

const renderTableFieldBytesArrayPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(props.defaultVal || '')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldBytesArray
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              placeholder: props.placeholder,
              defaultVal: props.defaultVal,
              disabled: props.disabled
            }
          }}
        />
      </div>
    </div>
  )
}

const renderTableFieldBytesArrayCodePreview = (props: Record<string, any>) => {
  return `<TableFieldBytesArray
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      placeholder: "${props.placeholder}",
      defaultVal: "${props.defaultVal}",
      disabled: ${props.disabled}
    }
  }}
/>`
}

export const tableFieldBytesArrayConfig: ComponentConfig = {
  id: 'table-field-bytes-array',
  name: 'TableField.BytesArray 字节数组',
  propsConfig: tableFieldBytesArrayPropsConfig,
  defaultProps: tableFieldBytesArrayDefaultProps,
  renderPreview: renderTableFieldBytesArrayPreview,
  renderCodePreview: renderTableFieldBytesArrayCodePreview
}

export default tableFieldBytesArrayConfig
