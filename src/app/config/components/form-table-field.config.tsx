import * as React from "react"
import FormTableField from '@/registry/blocks/form/form-tableField/form-tableField'
import { ComponentConfig } from '../types'

export const FormTableFieldPreview: React.FC<{ props: Record<string, any> }> = ({ props }) => {
  const [value, setValue] = React.useState<any>('')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">String 类型</label>
          <FormTableField
            type="string"
            value={value}
            onChange={setValue}
            label={props.label}
            placeholder={props.placeholder}
            disabled={props.disabled}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Number 类型</label>
          <FormTableField
            type="number"
            label="数字字段"
            placeholder="请输入数字"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Boolean 类型</label>
          <FormTableField
            type="boolean"
            label="布尔字段"
            value={false}
          />
        </div>
      </div>
    </div>
  )
}

export const formTableFieldPropsConfig = [
  {
    name: 'label',
    label: '字段标签',
    type: 'text' as const,
    default: '字段名称',
    placeholder: '请输入字段标签'
  },
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '请输入内容',
    placeholder: '请输入占位符'
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'required',
    label: '必填',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'description',
    label: '描述文本',
    type: 'text' as const,
    default: '',
    placeholder: '请输入描述文本'
  },
  {
    name: 'error',
    label: '错误提示',
    type: 'text' as const,
    default: '',
    placeholder: '请输入错误提示'
  }
]

export const formTableFieldDefaultProps = {
  label: '字段名称',
  placeholder: '请输入内容',
  disabled: false,
  required: false,
  description: '',
  error: ''
}

const renderFormTableFieldPreview = (props: Record<string, any>) => {
  return <FormTableFieldPreview props={props} />
}

const renderFormTableFieldCodePreview = (props: Record<string, any>) => {
  return `<FormTableField
  type="string"
  label="${props.label}"
  placeholder="${props.placeholder}"
  disabled={${props.disabled}}
  required={${props.required}}
  ${props.description ? `description="${props.description}"` : ''}
/>`
}

export const formTableFieldConfig: ComponentConfig = {
  id: 'form-tableField',
  name: 'FormTableField 数据表字段',
  propsConfig: formTableFieldPropsConfig,
  defaultProps: formTableFieldDefaultProps,
  renderPreview: renderFormTableFieldPreview,
  renderCodePreview: renderFormTableFieldCodePreview
}
