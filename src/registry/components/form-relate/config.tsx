import * as React from 'react'
import { FormRelate } from '@/registry/components/form-relate'
import { ComponentConfig } from '@/app/config/types'

export const formRelatePropsConfig = [
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

export const formRelateDefaultProps = {
  internalTable: true,
  displayField: 'name'
}

const renderFormRelatePreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(null)

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormRelate
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

const renderFormRelateCodePreview = (props: Record<string, any>) => {
  return `<FormRelate
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

export const formRelateConfig: ComponentConfig = {
  id: 'form-relate',
  name: 'Form.Relate 关联字段',
  propsConfig: formRelatePropsConfig,
  defaultProps: formRelateDefaultProps,
  renderPreview: renderFormRelatePreview,
  renderCodePreview: renderFormRelateCodePreview
}

export default formRelateConfig
