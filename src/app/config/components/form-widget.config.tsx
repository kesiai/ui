import * as React from "react"
import FormWidget from '@/registry/blocks/form/form-widget/form-widget'
import { ComponentConfig } from '../types'
import { createAPI } from "@airiot/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const FormWidgetPreview: React.FC<{ props: Record<string, any> }> = ({ props }) => {
  const [value, setValue] = React.useState<any>('')

  // 模拟不同的字段类型配置
  const fieldConfigs = {
    text: {
      type: 'string',
      fieldType: 'input',
      title: '文本字段',
      placeholder: '请输入文本'
    },
    number: {
      type: 'number',
      fieldType: 'inputNumber',
      title: '数字字段',
      placeholder: '请输入数字'
    },
    select: {
      type: 'string',
      enum1: ['option1', 'option2', 'option3'],
      enum_title1: ['选项1', '选项2', '选项3'],
      title: '选择字段'
    },
    date: {
      type: 'string',
      fieldType: 'datePicker',
      title: '日期字段'
    },
    checkbox: {
      type: 'boolean',
      fieldType: 'checkbox',
      title: '布尔字段'
    }
  }

  const currentConfig = fieldConfigs[props.fieldType || 'text']

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">字段类型: {props.fieldType || 'text'}</label>
          <FormWidget
            config={currentConfig}
            value={value}
            onChange={setValue}
            label={currentConfig.title}
            placeholder={currentConfig.placeholder}
            disabled={props.disabled}
            required={props.required}
            fieldSchema={props.fieldSchema}
          />
        </div>
      </div>
    </div>
  )
}

export const formWidgetPropsConfig = [
  {
    name: 'fieldType',
    label: '字段类型',
    type: 'select' as const,
    default: 'text',
    options: [
      { value: 'text', label: '文本' },
      { value: 'number', label: '数字' },
      { value: 'select', label: '选择器' },
      { value: 'date', label: '日期' },
      { value: 'checkbox', label: '布尔值' }
    ]
  },
  {
    name: 'fieldSchema',
    label: '字段Schema',
    type: 'code' as const,
    default: {}
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
  }
]

export const formWidgetDefaultProps = {
  fieldType: 'text',
  disabled: false,
  required: false,
  fieldSchema: `{
      "key": "text-8389",
      "type": "string",
      "title": "文本",
      "config": "文本",
      "createShow": true,
      "editShow": true,
      "listFields": true,
      "descriptionType": "tooltip",
      "canOrder": false,
      "fieldType": "input",
      "textType": "input",
      "textContent": "text"
    }`
}

const renderFormWidgetPreview = (props: Record<string, any>) => {
  return <FormWidgetPreview props={props} />
}

const renderFormWidgetCodePreview = (props: Record<string, any>) => {
  return `<FormWidget
  fieldType="${props.fieldType}"
  disabled={${props.disabled}}
  required={${props.required}}
  config={{
    type: "${props.fieldType === 'number' ? 'number' : 'string'}",
    ${props.fieldType === 'select' ? `enum1: ['option1', 'option2', 'option3'],
    enum_title1: ['选项1', '选项2', '选项3'],` : ''}
    fieldType: "${props.fieldType === 'checkbox' ? 'checkbox' : props.fieldType === 'date' ? 'datePicker' : 'input'}",
    title: "${props.fieldType === 'text' ? '文本字段' : props.fieldType === 'number' ? '数字字段' : props.fieldType === 'select' ? '选择字段' : props.fieldType === 'date' ? '日期字段' : '布尔字段'}",
    ${props.fieldType === 'text' || props.fieldType === 'number' ? `placeholder: "请输入${props.fieldType === 'text' ? '文本' : '数字'}"` : ''}
  }}
/>`
}

export const formWidgetConfig: ComponentConfig = {
  id: 'form-widget',
  name: 'FormWidget 表字段映射',
  propsConfig: formWidgetPropsConfig,
  defaultProps: formWidgetDefaultProps,
  renderPreview: renderFormWidgetPreview,
  renderCodePreview: renderFormWidgetCodePreview
}
