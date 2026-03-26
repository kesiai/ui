import React from 'react'
import {
  FieldGroup
} from "@/components/ui/field"
import { Form } from '@/registry/components/form/form'
import { FormField } from '@/registry/components/form-field/form-field'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form.md?raw'

// 预设的布局样式
export const layoutPresets: Record<string, {
  name: string
  description: string
  container: string
  field: string
  label: string
  input: string
  descriptionClass?: string
  error?: string
}> = {
  default: {
    name: '默认布局',
    description: '标准的表单布局，适中的间距',
    container: '',
    field: '',
    label: '',
    input: ''
  },
  compact: {
    name: '紧凑布局',
    description: '紧凑的表单布局，节省空间',
    container: 'gap-y-2',
    field: '',
    label: 'text-xs font-medium',
    input: 'text-sm'
  },
  spacious: {
    name: '宽松布局',
    description: '宽松的表单布局，更舒适的视觉',
    container: 'space-y-6',
    field: 'space-y-3',
    label: 'text-base font-medium',
    input: 'py-2'
  },
  grid: {
    name: '网格布局',
    description: '两列网格布局，节省垂直空间',
    container: 'grid grid-cols-2 gap-4',
    field: 'space-y-2',
    label: 'text-sm font-medium',
    input: ''
  },
  card: {
    name: '卡片布局',
    description: '每个字段都是卡片样式',
    container: '',
    field: 'p-4 bg-white border border-slate-200 rounded-lg shadow-sm',
    label: 'text-sm font-medium',
    input: 'mt-2'
  },
  inline: {
    name: '水平布局',
    description: '字段水平排列',
    container: '',
    field: 'grid grid-cols-5 gap-4',
    label: 'text-sm font-medium whitespace-nowrap h-full flex items-center justify-end',
    input: 'col-span-4',
    descriptionClass: 'col-span-4 col-start-2',
    error: 'col-span-4 col-start-2'
  },
  onlabel: {
    name: '无Label布局',
    description: '不显示Label，仅显示输入框',
    container: 'gap-4',
    field: '',
    label: 'hidden',
    input: ''
  }
}

export const formPropsConfig = [
  {
    name: 'formId',
    label: '表单ID',
    type: 'text' as const,
    default: 'demo-form',
    description: '表单的唯一标识符'
  },
  {
    name: 'layout',
    label: '布局样式',
    type: 'select' as const,
    default: 'default',
    options: Object.keys(layoutPresets).map(key => ({
      value: key,
      label: layoutPresets[key].name
    })),
    description: '选择表单的布局样式'
  },
  {
    name: 'classNames',
    label: '自定义样式类',
    type: 'json' as const,
    default: JSON.stringify(layoutPresets.default, null, 2),
    description: '自定义表单各元素的 className (JSON格式)'
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
  layout: 'default' as keyof typeof layoutPresets,
  classNames: null,
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

  // 根据 layout 选择对应的预设样式
  const layoutStyles = layoutPresets[props.layout] || layoutPresets.default
  const classNames = props.classNames ||
    {
      group: layoutStyles.container,
      field: layoutStyles.field,
      label: layoutStyles.label,
      input: layoutStyles.input,
      description: layoutStyles.descriptionClass,
      error: layoutStyles.error
    }

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">表单布局示例</h3>
            <p className="text-sm text-slate-600 mt-1">
              当前布局：<span className="font-medium text-slate-900">{layoutPresets[props.layout]?.label || props.layout}</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">{layoutPresets[props.layout]?.description}</p>
          </div>

          <Form
            formId={props.formId}
            mode={props.mode}
            reValidateMode={props.reValidateMode}
            defaultValues={typeof props.defaultValues === 'object' ? props.defaultValues : formDefaultProps.defaultValues}
            onSubmit={handleSubmit}
            classNames={classNames}
          >
            <FieldGroup className={classNames?.group}>
              <FormField
                name="username"
                label="用户名"
                type="text"
                placeholder="请输入用户名"
                description="用于登录的唯一标识"
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
                type="password"
                placeholder="请输入密码"
                required
              />
              <FormField
                name="bio"
                label="简介"
                type="textarea"
                placeholder="请输入个人简介"
              />
            </FieldGroup>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 mt-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              提交
            </button>
            {!props.showExample && (
              <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md w-full">
                表单容器（请添加子组件）
              </div>
            )}
          </Form>
        </div>
      </div>
    </div>
  )
}

const renderFormCodePreview = (props: Record<string, any>) => {
  const defaultValuesStr = typeof props.defaultValues === 'object'
    ? JSON.stringify(props.defaultValues, null, 2)
    : JSON.stringify(formDefaultProps.defaultValues, null, 2)

  const classNames = typeof props.classNames === 'object'
    ? props.classNames
    : layoutPresets[props.layout] || layoutPresets.default

  const classNamesStr = JSON.stringify(classNames, null, 2)

  return `import { Form } from '@airiot/client'
import { FormField } from '@/registry/components/form-field/form-field'
import { layoutPresets } from '@/registry/components/form/config'

const MyForm = () => {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data)
  }

  // 使用预设布局
  return (
    <Form
      formId="${props.formId}"
      mode="${props.mode}"
      reValidateMode="${props.reValidateMode}"
      defaultValues={${defaultValuesStr}}
      onSubmit={handleSubmit}
    >
      <FormField name="username" label="用户名" type="text" required />
      <FormField name="email" label="邮箱" type="text" required />
      <FormField name="password" label="密码" type="password" required />
      <button type="submit">提交</button>
    </Form>
  )

  // 或者自定义样式
  // return (
  //   <Form
  //     formId="${props.formId}"
  //     classNames={${classNamesStr}}
  //     onSubmit={handleSubmit}
  //   >
  //     <FormField name="username" label="用户名" type="text" required />
  //     ...
  //   </Form>
  // )
}`
}

export const formConfig: ComponentConfig = {
  id: 'form',
  name: 'Form 表单容器',
  propsConfig: formPropsConfig,
  defaultProps: formDefaultProps,
  renderPreview: renderFormPreview,
  renderCodePreview: renderFormCodePreview,
  documentation: documentationMd
}
