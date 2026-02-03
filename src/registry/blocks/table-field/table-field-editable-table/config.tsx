import * as React from 'react'
import { TableFieldEditableTable } from '@/registry/blocks/table-field/table-field-editable-table/table-field-editable-table'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldEditableTablePropsConfig = [
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'minCount',
    label: '最小行数',
    type: 'number' as const,
    default: 0
  },
  {
    name: 'maxCount',
    label: '最大行数',
    type: 'number' as const,
    default: 100
  },
  {
    name: 'displayForm',
    label: '显示方式',
    type: 'select' as const,
    default: 'grid',
    options: [
      { value: 'grid', label: '表格' },
      { value: 'card', label: '卡片' }
    ]
  },
  {
    name: 'cardLayout',
    label: '卡片布局',
    type: 'select' as const,
    default: '3',
    options: [
      { value: '1', label: '1列' },
      { value: '2', label: '2列' },
      { value: '3', label: '3列' }
    ]
  }
]

export const tableFieldEditableTableDefaultProps = {
  disabled: false,
  minCount: 0,
  maxCount: 100,
  displayForm: 'grid' as 'grid' | 'card',
  cardLayout: '3' as '1' | '2' | '3'
}

const renderTableFieldEditableTablePreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState([
    { key: 1, field1: '数据1', field2: '数据2' },
    { key: 2, field1: '数据3', field2: '数据4' }
  ])

  const mockSchema = {
    disabled: props.disabled,
    minCount: props.minCount,
    maxCount: props.maxCount,
    displayForm: props.displayForm,
    cardLayout: props.cardLayout,
    tableFields: {
      form: ['field1', 'field2'],
      properties: {
        field1: {
          key: 'field1',
          title: '字段1',
          fieldType: 'text'
        },
        field2: {
          key: 'field2',
          title: '字段2',
          fieldType: 'text'
        }
      }
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldEditableTable
          input={{
            value,
            onChange: setValue
          }}
          schema={mockSchema}
        />
      </div>
    </div>
  )
}

const renderTableFieldEditableTableCodePreview = (props: Record<string, any>) => {
  return `<TableFieldEditableTable
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  schema={{
    disabled: ${props.disabled},
    minCount: ${props.minCount},
    maxCount: ${props.maxCount},
    displayForm: "${props.displayForm}",
    cardLayout: "${props.cardLayout}",
    tableFields: {
      form: ['field1', 'field2'],
      properties: {
        field1: { key: 'field1', title: '字段1', fieldType: 'text' },
        field2: { key: 'field2', title: '字段2', fieldType: 'text' }
      }
    }
  }}
/>`
}

export const tableFieldEditableTableConfig: ComponentConfig = {
  id: 'table-field-editable-table',
  name: 'TableField.EditableTable 可编辑表格',
  propsConfig: tableFieldEditableTablePropsConfig,
  defaultProps: tableFieldEditableTableDefaultProps,
  renderPreview: renderTableFieldEditableTablePreview,
  renderCodePreview: renderTableFieldEditableTableCodePreview
}

export default tableFieldEditableTableConfig
