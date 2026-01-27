import { FormInput } from '@/registry/blocks/form/form-input/form-input'
import { ComponentConfig } from '../types'

export const formInputPropsConfig = [
  {
    name: 'inputType',
    label: '输入类型',
    type: 'select' as const,
    default: 'input',
    options: [
      { value: 'input', label: '单行输入框' },
      { value: 'textarea', label: '多行文本框' }
    ]
  },
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
    name: 'size',
    label: '尺寸',
    type: 'select' as const,
    default: 'md',
    options: [
      { value: 'sm', label: '小' },
      { value: 'md', label: '中' },
      { value: 'lg', label: '大' }
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
    name: 'prefix',
    label: '前缀',
    type: 'text' as const,
    default: '',
    description: '显示在输入框左侧的内容'
  },
  {
    name: 'suffix',
    label: '后缀',
    type: 'text' as const,
    default: '',
    description: '显示在输入框右侧的内容'
  },
  {
    name: 'addonBefore',
    label: '前置标签',
    type: 'text' as const,
    default: '',
    description: '显示在输入框左侧的标签'
  },
  {
    name: 'addonAfter',
    label: '后置标签',
    type: 'text' as const,
    default: '',
    description: '显示在输入框右侧的标签'
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

export const formInputDefaultProps = {
  inputType: 'input' as 'input' | 'textarea',
  placeholder: '请输入内容',
  variant: 'default' as 'default' | 'outline' | 'filled' | 'ghost',
  size: 'md' as 'sm' | 'md' | 'lg',
  disabled: false,
  readOnly: false,
  allowClear: false,
  showCount: false,
  bordered: true,
  prefix: '',
  suffix: '',
  addonBefore: '',
  addonAfter: '',
  maxLength: undefined
}

const renderFormInputPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormInput
          inputType={props.inputType}
          placeholder={props.placeholder}
          variant={props.variant}
          size={props.size}
          disabled={props.disabled}
          readOnly={props.readOnly}
          allowClear={props.allowClear}
          showCount={props.showCount}
          prefix={props.prefix ? <span className="text-muted-foreground">{props.prefix}</span> : undefined}
          suffix={props.suffix ? <span className="text-muted-foreground">{props.suffix}</span> : undefined}
          addonBefore={props.addonBefore ? <span className="text-muted-foreground">{props.addonBefore}</span> : undefined}
          addonAfter={props.addonAfter ? <span className="text-muted-foreground">{props.addonAfter}</span> : undefined}
          maxLength={props.maxLength}
          bordered={props.bordered}
        />
      </div>
    </div>
  )
}

const renderFormInputCodePreview = (props: Record<string, any>) => {
  return `<FormInput
  inputType="${props.inputType}"
  placeholder="${props.placeholder}"
  variant="${props.variant}"
  size="${props.size}"
  ${props.disabled ? 'disabled' : ''}
  ${props.readOnly ? 'readOnly' : ''}
  ${props.allowClear ? 'allowClear' : ''}
  ${props.showCount ? 'showCount' : ''}
  ${props.prefix ? `prefix={<span>${props.prefix}</span>}` : ''}
  ${props.suffix ? `suffix={<span>${props.suffix}</span>}` : ''}
  ${props.addonBefore ? `addonBefore={<span>${props.addonBefore}</span>}` : ''}
  ${props.addonAfter ? `addonAfter={<span>${props.addonAfter}</span>}` : ''}
  ${props.maxLength ? `maxLength={${props.maxLength}}` : ''}
  ${props.bordered ? 'bordered' : 'bordered={false}'}
/>`
}

export const formInputConfig: ComponentConfig = {
  id: 'form-input',
  name: 'Form.Input 输入框',
  propsConfig: formInputPropsConfig,
  defaultProps: formInputDefaultProps,
  renderPreview: renderFormInputPreview,
  renderCodePreview: renderFormInputCodePreview
}