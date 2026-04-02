import { FormReference } from '@/registry/components/form-reference/form-reference'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-reference.md?raw'

export const formReferencePropsConfig = [
  {
    name: 'numberFormat',
    label: '数字格式',
    type: 'text' as const,
    default: '',
    description: '数字格式化字符串'
  }
]

export const formReferenceDefaultProps = {
  numberFormat: ''
}

const renderFormReferencePreview = (props: Record<string, any>) => {
  const mockTableData = {
    field1: '测试数据',
    field2: 123
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormReference
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

const renderFormReferenceCodePreview = (props: Record<string, any>) => {
  return `<FormReference
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

export const formReferenceConfig: ComponentConfig = {
  id: 'form-reference',
  name: '查找引用',
  propsConfig: formReferencePropsConfig,
  defaultProps: formReferenceDefaultProps,
  renderPreview: renderFormReferencePreview,
  renderCodePreview: renderFormReferenceCodePreview,
  documentation: documentationMd
}

export default formReferenceConfig
