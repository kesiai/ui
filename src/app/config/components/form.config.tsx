import React from 'react'
import Form from '@/registry/blocks/form/form/form'
import FormField from '@/registry/blocks/form/form-field/form-field'
import { ComponentConfig } from '../types'

export const formPropsConfig = [
  {
    name: 'formId',
    label: '表单ID',
    type: 'text' as const,
    default: 'demo-form',
    description: '表单的唯一标识符'
  },
  {
    name: 'mode',
    label: '验证模式',
    type: 'select' as const,
    default: 'onSubmit',
    options: [
      { value: 'onSubmit', label: '提交时验证' },
      { value: 'onBlur', label: '失焦时验证' },
      { value: 'onChange', label: '变更时验证' },
      { value: 'all', label: '全部触发' }
    ],
    description: '表单验证的触发时机'
  },
  {
    name: 'reValidateMode',
    label: '重新验证模式',
    type: 'select' as const,
    default: 'onChange',
    options: [
      { value: 'onChange', label: '变更时' },
      { value: 'onBlur', label: '失焦时' },
      { value: 'onSubmit', label: '提交时' }
    ],
    description: '错误状态下的重新验证时机'
  },
  {
    name: 'defaultValues',
    label: '默认值',
    type: 'json' as const,
    default: '{\n  "username": "",\n  "email": "",\n  "password": ""\n}',
    description: '表单字段的默认值，JSON 格式'
  },
  {
    name: 'showExample',
    label: '显示示例表单',
    type: 'boolean' as const,
    default: true,
    description: '是否在预览中显示示例表单字段'
  }
]

export const formDefaultProps = {
  formId: 'demo-form',
  mode: 'onSubmit' as 'onSubmit' | 'onBlur' | 'onChange' | 'all',
  reValidateMode: 'onChange' as 'onChange' | 'onBlur' | 'onSubmit',
  defaultValues: {
    username: '',
    email: '',
    password: ''
  },
  showExample: true
}

const renderFormPreview = (props: Record<string, any>) => {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
    alert('表单已提交，数据：' + JSON.stringify(data) )
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-lg border border-slate-200 shadow-sm p-8">
        <h3 className="text-lg font-semibold mb-4">表单示例</h3>
        <Form
          formId={props.formId}
          mode={props.mode}
          reValidateMode={props.reValidateMode}
          defaultValues={typeof props.defaultValues === 'object' ? props.defaultValues : formDefaultProps.defaultValues}
          onSubmit={handleSubmit}
        >
          {props.showExample && (
            <div className="space-y-4">
              <FormField
                name="username"
                label="用户名"
                type="text"
                placeholder="请输入用户名"
                required
              />
              <FormField
                name="email"
                label="邮箱"
                type="text"
                placeholder="请输入邮箱"
                required
              />
              <FormField
                name="password"
                label="密码"
                type="text"
                placeholder="请输入密码"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                提交
              </button>
            </div>
          )}
          {!props.showExample && (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              表单容器（请添加子组件）
            </div>
          )}
        </Form>
      </div>
    </div>
  )
}

const renderFormCodePreview = (props: Record<string, any>) => {
  const defaultValuesStr = typeof props.defaultValues === 'object'
    ? JSON.stringify(props.defaultValues, null, 2)
    : JSON.stringify(formDefaultProps.defaultValues, null, 2)

  return `import { Form } from '@airiot/client'
import FormField from '@/registry/blocks/form/form-field/form-field'

const MyForm = () => {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
  }

  return (
    <Form
      formId="${props.formId}"
      mode="${props.mode}"
      reValidateMode="${props.reValidateMode}"
      defaultValues={${defaultValuesStr}}
      onSubmit={handleSubmit}
    >
      <FormField
        name="username"
        label="用户名"
        type="text"
        placeholder="请输入用户名"
        required
      />
      <FormField
        name="email"
        label="邮箱"
        type="text"
        placeholder="请输入邮箱"
        required
      />
      <FormField
        name="password"
        label="密码"
        type="text"
        placeholder="请输入密码"
        required
      />
    </Form>
  )
}`
}

export const formConfig: ComponentConfig = {
  id: 'form',
  name: 'Form 表单容器',
  propsConfig: formPropsConfig,
  defaultProps: formDefaultProps,
  renderPreview: renderFormPreview,
  renderCodePreview: renderFormCodePreview
}
