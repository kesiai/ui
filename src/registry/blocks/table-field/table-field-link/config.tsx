import * as React from 'react'
import { TableFieldLink } from '@/registry/blocks/table-field/table-field-link/table-field-link'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldLinkPropsConfig = [
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

export const tableFieldLinkDefaultProps = {
  linkType: 'out' as 'in' | 'out',
  placeholder: '请输入链接',
  defaultVal: '',
  disabled: false
}

const renderTableFieldLinkPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(props.defaultVal || '')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldLink
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

const renderTableFieldLinkCodePreview = (props: Record<string, any>) => {
  return `<TableFieldLink
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

export const tableFieldLinkConfig: ComponentConfig = {
  id: 'table-field-link',
  name: 'TableField.Link 链接',
  propsConfig: tableFieldLinkPropsConfig,
  defaultProps: tableFieldLinkDefaultProps,
  renderPreview: renderTableFieldLinkPreview,
  renderCodePreview: renderTableFieldLinkCodePreview
}

export default tableFieldLinkConfig
