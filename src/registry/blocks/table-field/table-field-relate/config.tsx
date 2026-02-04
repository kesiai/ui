import * as React from 'react'
import { TableFieldRelate } from '@/registry/blocks/table-field/table-field-relate'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldRelatePropsConfig = [
  {
    name: 'internalTable',
    label: '内部表关联',
    type: 'boolean' as const,
    default: true,
    description: '是否为内部表关联'
  },
  {
    name: 'displayField',
    label: '显示字段',
    type: 'text' as const,
    default: 'name'
  }
]

export const tableFieldRelateDefaultProps = {
  internalTable: true,
  displayField: 'name'
}

const renderTableFieldRelatePreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(null)

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldRelate
          input={{
            value,
            onChange: setValue
          }}
          field={{
            displayField: props.displayField,
            internalTable: props.internalTable,
            schema: {
              title: '关联字段'
            }
          }}
        />
      </div>
    </div>
  )
}

const renderTableFieldRelateCodePreview = (props: Record<string, any>) => {
  return `<TableFieldRelate
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    displayField: "${props.displayField}",
    internalTable: ${props.internalTable},
    schema: {
      title: "关联字段"
    }
  }}
/>`
}

export const tableFieldRelateConfig: ComponentConfig = {
  id: 'table-field-relate',
  name: 'TableField.Relate 关联字段',
  propsConfig: tableFieldRelatePropsConfig,
  defaultProps: tableFieldRelateDefaultProps,
  renderPreview: renderTableFieldRelatePreview,
  renderCodePreview: renderTableFieldRelateCodePreview
}

export default tableFieldRelateConfig
