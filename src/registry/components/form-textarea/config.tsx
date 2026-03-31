import { FormTextarea } from '@/registry/components/form-textarea/form-textarea'
import { ComponentConfig } from '@/app/config/types'

export const formTextareaPropsConfig = [
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '请输入内容'
  },
  {
    name: 'variant',
    label: '样式变体',
    type: 'select' as const,
    default: 'default',
    options: [
      { value: 'default', label: '默认' },
      { value: 'outline', label: '边框' },
      { value: 'filled', label: '填充' },
      { value: 'ghost', label: '幽灵' }
    ]
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'readOnly',
    label: '只读',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'allowClear',
    label: '显示清除按钮',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'showCount',
    label: '显示字数统计',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'delBlank',
    label: '去除空格',
    type: 'boolean' as const,
    default: false,
    description: '失焦时自动去除首尾空格'
  },
  {
    name: 'defaultVal',
    label: '默认值',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'maxLength',
    label: '最大长度',
    type: 'number' as const,
    default: undefined,
    min: 1
  },
  {
    name: 'bordered',
    label: '显示边框',
    type: 'boolean' as const,
    default: true
  }
]

export const formTextareaDefaultProps = {
  placeholder: '请输入内容',
  variant: 'default' as 'default' | 'outline' | 'filled' | 'ghost',
  disabled: false,
  readOnly: false,
  allowClear: false,
  showCount: false,
  delBlank: false,
  defaultVal: '',
  bordered: true,
  maxLength: undefined
}

const renderFormTextareaPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormTextarea
          placeholder={props.placeholder}
          variant={props.variant}
          disabled={props.disabled}
          readOnly={props.readOnly}
          allowClear={props.allowClear}
          showCount={props.showCount}
          delBlank={props.delBlank}
          defaultValue={props.defaultVal}
          maxLength={props.maxLength}
          bordered={props.bordered}
        />
      </div>
    </div>
  )
}

const renderFormTextareaCodePreview = (props: Record<string, any>) => {
  return `<FormTextarea
  placeholder="${props.placeholder}"
  variant="${props.variant}"
  ${props.disabled ? 'disabled' : ''}
  ${props.readOnly ? 'readOnly' : ''}
  ${props.allowClear ? 'allowClear' : ''}
  ${props.showCount ? 'showCount' : ''}
  ${props.delBlank ? 'delBlank' : ''}
  ${props.defaultVal ? `defaultValue="${props.defaultVal}"` : ''}
  ${props.maxLength ? `maxLength={${props.maxLength}}` : ''}
  ${props.bordered ? 'bordered' : 'bordered={false}'}
/>`
}

export const formTextareaConfig: ComponentConfig = {
  id: 'form-textarea',
  name: '多行文本框',
  propsConfig: formTextareaPropsConfig,
  defaultProps: formTextareaDefaultProps,
  renderPreview: renderFormTextareaPreview,
  renderCodePreview: renderFormTextareaCodePreview,
  documentation: ''
}
