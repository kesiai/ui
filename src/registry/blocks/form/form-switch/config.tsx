import { FormSwitch } from '@/registry/blocks/form/form-switch/form-switch'
import { ComponentConfig } from '@/app/config/types'

export const formSwitchPropsConfig = [
  {
    name: 'defaultChecked',
    label: '默认值',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'disabled',
    label: '禁用状态',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'autoFocus',
    label: '自动获取焦点',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'size',
    label: '尺寸',
    type: 'select' as const,
    default: 'default',
    options: [
      { value: 'default', label: '标准' },
      { value: 'small', label: '小' }
    ]
  }
]

export const formSwitchDefaultProps = {
  defaultChecked: false,
  disabled: false,
  autoFocus: false,
  size: 'default' as 'default' | 'small'
}

const renderFormSwitchPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormSwitch
          defaultChecked={props.defaultChecked}
          disabled={props.disabled}
          autoFocus={props.autoFocus}
          size={props.size}
        />
      </div>
    </div>
  )
}

const renderFormSwitchCodePreview = (props: Record<string, any>) => {
  return `<FormSwitch
  ${props.defaultChecked ? 'defaultChecked' : ''}
  ${props.disabled ? 'disabled' : ''}
  ${props.autoFocus ? 'autoFocus' : ''}
  size="${props.size}"
/>`
}

export const formSwitchConfig: ComponentConfig = {
  id: 'form-switch',
  name: 'Form.Switch 开关',
  propsConfig: formSwitchPropsConfig,
  defaultProps: formSwitchDefaultProps,
  renderPreview: renderFormSwitchPreview,
  renderCodePreview: renderFormSwitchCodePreview
}
