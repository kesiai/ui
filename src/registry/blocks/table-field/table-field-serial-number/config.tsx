import * as React from 'react'
import { TableFieldSerialNumber } from '@/registry/blocks/table-field/table-field-serial-number/table-field-serial-number'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldSerialNumberPropsConfig = [
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: true,
    description: '序列号字段默认禁用，自动生成'
  }
]

export const tableFieldSerialNumberDefaultProps = {
  disabled: true
}

const renderTableFieldSerialNumberPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState('SN-20240203-0001')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldSerialNumber
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {}
          }}
          disabled={props.disabled}
        />
      </div>
    </div>
  )
}

const renderTableFieldSerialNumberCodePreview = (props: Record<string, any>) => {
  return `<TableFieldSerialNumber
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {}
  }}
  disabled={props.disabled}
/>`
}

export const tableFieldSerialNumberConfig: ComponentConfig = {
  id: 'table-field-serial-number',
  name: 'TableField.SerialNumber 序列号',
  propsConfig: tableFieldSerialNumberPropsConfig,
  defaultProps: tableFieldSerialNumberDefaultProps,
  renderPreview: renderTableFieldSerialNumberPreview,
  renderCodePreview: renderTableFieldSerialNumberCodePreview
}

export default tableFieldSerialNumberConfig
