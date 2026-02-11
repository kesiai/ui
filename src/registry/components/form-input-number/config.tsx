import { FormInputNumber } from '@/registry/components/form-input-number/form-input-number'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-input-number.md?raw'

export const formInputNumberPropsConfig = [
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '请输入数字'
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
    name: 'bordered',
    label: '显示边框',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'autoFocus',
    label: '自动获取焦点',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'min',
    label: '最小值',
    type: 'number' as const,
    default: undefined
  },
  {
    name: 'max',
    label: '最大值',
    type: 'number' as const,
    default: undefined
  },
  {
    name: 'decimal',
    label: '小数位数',
    type: 'number' as const,
    default: null,
    description: 'null表示不限制，等同于precision'
  },
  {
    name: 'precision',
    label: '数值精度',
    type: 'number' as const,
    default: undefined
  },
  {
    name: 'step',
    label: '步长',
    type: 'number' as const,
    default: 1
  },
  {
    name: 'defaultVal',
    label: '默认值',
    type: 'number' as const,
    default: 0
  },
  {
    name: 'unit',
    label: '单位',
    type: 'text' as const,
    default: '',
    description: '显示在输入框右侧的单位'
  },
  {
    name: 'prefix',
    label: '前缀',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'suffix',
    label: '后缀',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'addonBefore',
    label: '前置标签',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'addonAfter',
    label: '后置标签',
    type: 'text' as const,
    default: ''
  }
]

export const formInputNumberDefaultProps = {
  placeholder: '请输入数字',
  variant: 'default' as const,
  size: 'md' as const,
  disabled: false,
  readOnly: false,
  bordered: true,
  autoFocus: false,
  step: 1,
  decimal: null,
  defaultVal: 0,
  unit: ''
}

const renderFormInputNumberPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormInputNumber
          placeholder={props.placeholder}
          variant={props.variant}
          size={props.size}
          disabled={props.disabled}
          readOnly={props.readOnly}
          bordered={props.bordered}
          autoFocus={props.autoFocus}
          min={props.min}
          max={props.max}
          precision={props.decimal ?? props.precision}
          step={props.step}
          defaultValue={props.defaultVal}
          unit={props.unit}
          prefix={props.prefix ? <span>{props.prefix}</span> : undefined}
          suffix={props.suffix ? <span>{props.suffix}</span> : undefined}
          addonBefore={props.addonBefore ? <span>{props.addonBefore}</span> : undefined}
          addonAfter={props.addonAfter ? <span>{props.addonAfter}</span> : undefined}
        />
      </div>
    </div>
  )
}

const renderFormInputNumberCodePreview = (props: Record<string, any>) => {
  return `<FormInputNumber
  placeholder="${props.placeholder}"
  variant="${props.variant}"
  size="${props.size}"
  ${props.disabled ? 'disabled' : ''}
  ${props.readOnly ? 'readOnly' : ''}
  ${props.autoFocus ? 'autoFocus' : ''}
  ${props.min !== undefined ? `min={${props.min}}` : ''}
  ${props.max !== undefined ? `max={${props.max}}` : ''}
  ${props.decimal !== null ? `precision={${props.decimal}}` : ''}
  ${props.step !== 1 ? `step={${props.step}}` : ''}
  ${props.defaultVal ? `defaultValue={${props.defaultVal}}` : ''}
  ${props.unit ? `unit="${props.unit}"` : ''}
  ${props.prefix ? `prefix={<span>${props.prefix}</span>}` : ''}
  ${props.suffix ? `suffix={<span>${props.suffix}</span>}` : ''}
  ${props.addonBefore ? `addonBefore={<span>${props.addonBefore}</span>}` : ''}
  ${props.addonAfter ? `addonAfter={<span>${props.addonAfter}</span>}` : ''}
  ${props.bordered ? 'bordered' : 'bordered={false}'}
/>`
}

export const formInputNumberConfig: ComponentConfig = {
  id: 'form-input-number',
  name: 'Form.InputNumber 数字输入框',
  propsConfig: formInputNumberPropsConfig,
  defaultProps: formInputNumberDefaultProps,
  renderPreview: renderFormInputNumberPreview,
  renderCodePreview: renderFormInputNumberCodePreview,
  documentation: documentationMd
}