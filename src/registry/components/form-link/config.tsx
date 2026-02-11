import * as React from 'react'
import { FormLink } from '@/registry/components/form-link/form-link'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-link.md?raw'

export const formLinkPropsConfig = [
  {
    name: 'linkType',
    label: '链接类型',
    type: 'select' as const,
    default: 'out',
    options: [
      { value: 'in', label: '内部链接' },
      { value: 'out', label: '外部链接' }
    ]
  },
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '请输入链接'
  },
  {
    name: 'defaultVal',
    label: '默认值',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  }
]

export const formLinkDefaultProps = {
  linkType: 'out' as 'in' | 'out',
  placeholder: '请输入链接',
  defaultVal: '',
  disabled: false
}

const renderFormLinkPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(props.defaultVal || '')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormLink
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              linkType: props.linkType,
              placeholder: props.placeholder,
              defaultVal: props.defaultVal,
              disabled: props.disabled
            }
          }}
        />
      </div>
    </div>
  )
}

const renderFormLinkCodePreview = (props: Record<string, any>) => {
  return `<FormLink
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      linkType: "${props.linkType}",
      placeholder: "${props.placeholder}",
      defaultVal: "${props.defaultVal}",
      disabled: ${props.disabled}
    }
  }}
/>`
}

export const formLinkConfig: ComponentConfig = {
  id: 'form-link',
  name: 'Form.Link 链接',
  propsConfig: formLinkPropsConfig,
  defaultProps: formLinkDefaultProps,
  renderPreview: renderFormLinkPreview,
  renderCodePreview: renderFormLinkCodePreview,
  documentation: documentationMd
}

export default formLinkConfig
