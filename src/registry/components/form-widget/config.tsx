import * as React from "react"
import { FormWidget } from '@/registry/components/form-widget/form-widget'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-widget.md?raw'

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
    },
    map: {
      type: 'object',
      fieldType: 'map',
      title: '地图定位'
    },
    attachment: {
      type: 'object',
      fieldType: 'attachment',
      title: '附件上传'
    },
    attachments: {
      type: 'array',
      fieldType: 'attachments',
      title: '附件组'
    }
  }

  const currentConfig = fieldConfigs[(props.fieldType || 'text') as keyof typeof fieldConfigs]

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
            placeholder={'placeholder' in currentConfig ? currentConfig.placeholder : undefined}
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
      { value: 'checkbox', label: '布尔值' },
      { value: 'map', label: '地图定位' },
      { value: 'attachment', label: '附件上传' },
      { value: 'attachments', label: '附件组' }
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
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormWidgetPreview props={props} />
      </div>
    </div>
  )
}

const renderFormWidgetCodePreview = (props: Record<string, any>) => {
  const typeMap = {
    text: 'string',
    number: 'number',
    select: 'string',
    date: 'string',
    checkbox: 'boolean',
    map: 'object',
    attachment: 'object',
    attachments: 'array'
  } as const

  const fieldTypeMap = {
    text: 'input',
    number: 'inputNumber',
    select: 'select',
    date: 'datePicker',
    checkbox: 'checkbox',
    map: 'map',
    attachment: 'attachment',
    attachments: 'attachments'
  } as const

  const titleMap = {
    text: '文本字段',
    number: '数字字段',
    select: '选择字段',
    date: '日期字段',
    checkbox: '布尔字段',
    map: '地图定位',
    attachment: '附件上传',
    attachments: '附件组'
  } as const

  const type = typeMap[props.fieldType as keyof typeof typeMap] || 'string'
  const fieldType = fieldTypeMap[props.fieldType as keyof typeof fieldTypeMap] || 'input'
  const title = titleMap[props.fieldType as keyof typeof titleMap] || '字段'

  return `<FormWidget
  fieldType="${props.fieldType}"
  disabled={${props.disabled}}
  required={${props.required}}
  config={{
    type: "${type}",
    ${props.fieldType === 'select' ? `enum1: ['option1', 'option2', 'option3'],
    enum_title1: ['选项1', '选项2', '选项3'],` : ''}
    fieldType: "${fieldType}",
    title: "${title}",
    ${props.fieldType === 'text' || props.fieldType === 'number' ? `placeholder: "请输入${props.fieldType === 'text' ? '文本' : '数字'}"` : ''}
  }}
  cellKey="your-cell-key"
/>`
}

export const formWidgetConfig: ComponentConfig = {
  id: 'form-widget',
  name: 'FormWidget 表字段映射',
  propsConfig: formWidgetPropsConfig,
  defaultProps: formWidgetDefaultProps,
  renderPreview: renderFormWidgetPreview,
  renderCodePreview: renderFormWidgetCodePreview,
  documentation: documentationMd
}

export default formWidgetConfig
