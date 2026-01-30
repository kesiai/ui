import React from 'react'
import FormField from '@/registry/blocks/form/form-field/form-field'
import Form from '@/registry/blocks/form/form/form'
import { ComponentConfig } from '../types'

export const formFieldPropsConfig = [
  {
    name: 'name',
    label: '字段名称',
    type: 'text' as const,
    default: 'username',
    description: '表单字段的唯一标识符'
  },
  {
    name: 'label',
    label: '标签文本',
    type: 'text' as const,
    default: '用户名',
    description: '字段显示的标签'
  },
  {
    name: 'type',
    label: '字段类型',
    type: 'select' as const,
    default: 'text',
    options: [
      { value: 'text', label: '文本输入框' },
      { value: 'number', label: '数字输入框' },
      { value: 'textarea', label: '多行文本框' },
      { value: 'select', label: '下拉选择框' }
    ],
    description: '选择字段的输入类型'
  },
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '请输入用户名',
    description: '输入框的占位提示文本'
  },
  {
    name: 'description',
    label: '字段描述',
    type: 'text' as const,
    default: '请输入您的用户名',
    description: '显示在字段下方的说明文字'
  },
  {
    name: 'required',
    label: '必填字段',
    type: 'boolean' as const,
    default: true,
    description: '是否为必填项'
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false,
    description: '是否禁用该字段'
  },
  {
    name: 'showErrorState',
    label: '显示错误状态（演示用）',
    type: 'boolean' as const,
    default: false,
    description: '演示 FormField 在 Form 外使用时的错误状态'
  },
  {
    name: 'showInPreview',
    label: '在预览中显示',
    type: 'boolean' as const,
    default: true,
    description: '是否在组件预览中显示'
  },
  {
    name: 'options',
    label: '下拉选项 (Select类型用)',
    type: 'json' as const,
    default: '[\n  { "value": "option1", "name": "选项1" },\n  { "value": "option2", "name": "选项2" },\n  { "value": "option3", "name": "选项3" }\n]',
    description: '当类型为 select 时，配置下拉选项（JSON 格式）'
  }
]

export const formFieldDefaultProps = {
  name: 'username',
  label: '用户名',
  type: 'text' as 'text' | 'number' | 'textarea' | 'select',
  placeholder: '请输入用户名',
  description: '请输入您的用户名',
  required: true,
  disabled: false,
  showErrorState: false,
  showInPreview: true,
  options: [
    { value: 'option1', name: '选项1' },
    { value: 'option2', name: '选项2' },
    { value: 'option3', name: '选项3' }
  ]
}

const renderFormFieldPreview = (props: Record<string, any>) => {
  if (!props.showInPreview) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-slate-400 text-sm">已隐藏</div>
      </div>
    )
  }

  // 错误状态演示：FormField 在 Form 外使用
  if (props.showErrorState) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4 text-center">FormField 错误状态</h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h4 className="text-red-800 font-semibold mb-2">⚠️ 错误状态演示</h4>
            <p className="text-red-700 text-sm mb-4">
              当 FormField 组件不在 Form 容器内使用时，会显示错误状态。
            </p>
            <div className="bg-white rounded border border-red-300 p-4">
              <FormField
                name="username"
                label="用户名"
                type="text"
                placeholder="请输入用户名"
                required
              />
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="text-blue-800 font-semibold mb-2">💡 正确用法</h5>
            <p className="text-blue-700 text-sm">
              FormField 必须包裹在 Form 组件内部，这样才能访问表单上下文并正常工作。
            </p>
            <pre className="mt-3 bg-slate-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`<Form formId="my-form" onSubmit={handleSubmit}>
  <FormField name="username" label="用户名" />
</Form>`}
            </pre>
          </div>
        </div>
      </div>
    )
  }

  // 解析 options
  let options = undefined
  if (props.type === 'select') {
    try {
      options = typeof props.options === 'string'
        ? JSON.parse(props.options)
        : props.options
    } catch (e) {
      console.warn('Failed to parse options:', e)
      options = formFieldDefaultProps.options
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 text-center">FormField 表单字段</h3>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
          <Form
            formId="form-field-preview"
            onSubmit={(data) => {
              console.log('Form submitted:', data)
              alert('表单已提交，数据：' + JSON.stringify(data, null, 2))
            }}
            defaultValues={{
              [props.name]: props.type === 'select' ? '' : ''
            }}
          >
            <FormField
              name={props.name}
              label={props.label}
              type={props.type}
              placeholder={props.placeholder}
              description={props.description}
              required={props.required}
              disabled={props.disabled}
              options={options}
            />
            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                提交表单
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

const renderFormFieldCodePreview = (props: Record<string, any>) => {
  const optionsStr = props.type === 'select'
    ? `\n  options={${JSON.stringify(typeof props.options === 'string' ? JSON.parse(props.options) : props.options)}}`
    : ''

  return `import { Form } from '@airiot/client'
import FormField from '@/registry/blocks/form/form-field/form-field'

const MyForm = () => {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form
      formId="my-form"
      onSubmit={handleSubmit}
    >
      <FormField
        name="${props.name}"
        label="${props.label}"
        type="${props.type}"
        placeholder="${props.placeholder}"
        description="${props.description}"
        ${props.required ? 'required' : ''}
        ${props.disabled ? 'disabled' : ''}${optionsStr}
      />
    </Form>
  )
}`
}

export const formFieldConfig: ComponentConfig = {
  id: 'form-field',
  name: 'FormField 表单字段',
  propsConfig: formFieldPropsConfig,
  defaultProps: formFieldDefaultProps,
  renderPreview: renderFormFieldPreview,
  renderCodePreview: renderFormFieldCodePreview
}
