import * as React from 'react'
import { TableFieldReference } from '@/registry/blocks/table-field/table-field-reference/table-field-reference'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldReferencePropsConfig = [
  {
    name: 'numberFormat',
    label: '数字格式',
    type: 'text' as const,
    default: '',
    description: '数字格式化字符串'
  }
]

export const tableFieldReferenceDefaultProps = {
  numberFormat: ''
}

const renderTableFieldReferencePreview = (props: Record<string, any>) => {
  const mockTableData = {
    field1: '测试数据',
    field2: 123
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldReference
          schema={{
            key: 'reference',
            numberFormat: props.numberFormat
          }}
          field={{
            key: 'field1'
          }}
          tableData={mockTableData}
        />
      </div>
    </div>
  )
}

const renderTableFieldReferenceCodePreview = (props: Record<string, any>) => {
  return `<TableFieldReference
  schema={{
    key: 'reference',
    numberFormat: "${props.numberFormat}"
  }}
  field={{
    key: 'field1'
  }}
  tableData={tableData}
/>`
}

export const tableFieldReferenceConfig: ComponentConfig = {
  id: 'table-field-reference',
  name: 'TableField.Reference 查找引用',
  propsConfig: tableFieldReferencePropsConfig,
  defaultProps: tableFieldReferenceDefaultProps,
  renderPreview: renderTableFieldReferencePreview,
  renderCodePreview: renderTableFieldReferenceCodePreview
}

export default tableFieldReferenceConfig
