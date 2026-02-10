import * as React from 'react'
import { FormEditableTable } from '@/registry/components/form-editable-table/form-editable-table'
import { ComponentConfig } from '@/app/config/types'

export const formEditableTablePropsConfig = [
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

export const formEditableTableDefaultProps = {
  disabled: false,
  minCount: 0,
  maxCount: 100,
  displayForm: 'grid' as 'grid' | 'card',
  cardLayout: '3' as '1' | '2' | '3'
}

const renderFormEditableTablePreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState([
    { key: 1, field1: null, field2: 111 },
    { key: 2, field1: null, field2: 222 }
  ])

  const mockSchema = {
    disabled: props.disabled,
    minCount: props.minCount,
    maxCount: props.maxCount,
    displayForm: props.displayForm,
    cardLayout: props.cardLayout,
    forms: {
      form: ['field1', 'field2'],
      properties: {
        field1: {
          key: 'field1',
          title: '字段1',
          type: 'object',
          fieldType: 'map'
        },
        field2: {
          key: 'field2',
          title: '字段2',
          type: 'number'
        }
      }
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormEditableTable
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

const renderFormEditableTableCodePreview = (props: Record<string, any>) => {
  return `<FormEditableTable
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
    forms: {
      form: ['field1', 'field2'],
      properties: {
        field1: { key: 'field1', title: '字段1', type: 'object', fieldType: 'map' },
        field2: { key: 'field2', title: '字段2', type: 'number' }
      }
    }
  }}
/>`
}

export const formEditableTableConfig: ComponentConfig = {
  id: 'form-editable-table',
  name: 'Form.EditableTable 可编辑表格',
  propsConfig: formEditableTablePropsConfig,
  defaultProps: formEditableTableDefaultProps,
  renderPreview: renderFormEditableTablePreview,
  renderCodePreview: renderFormEditableTableCodePreview
}

export default formEditableTableConfig
