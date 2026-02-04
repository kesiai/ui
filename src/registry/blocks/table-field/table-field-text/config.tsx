import * as React from 'react'
import { TableFieldText } from '@/registry/blocks/table-field/table-field-text/table-field-text'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldTextPropsConfig = [
  {
    name: 'textType',
    label: '文本类型',
    type: 'select' as const,
    default: 'text',
    options: [
      { value: 'text', label: '单行文本' },
      { value: 'textArea', label: '多行文本' }
    ]
  },
  {
    name: 'textContent',
    label: '内容类型',
    type: 'select' as const,
    default: 'text',
    options: [
      { value: 'text', label: '文本' },
      { value: 'password', label: '密码' },
      { value: 'email', label: '邮箱' },
      { value: 'url', label: '网址' },
      { value: 'tel', label: '电话' }
    ]
  },
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '请输入文本内容'
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
  },
  {
    name: 'delBlank',
    label: '去除空格',
    type: 'boolean' as const,
    default: false,
    description: '失焦时自动去除首尾空格'
  },
  {
    name: 'size',
    label: '尺寸',
    type: 'select' as const,
    default: 'middle',
    options: [
      { value: 'small', label: '小' },
      { value: 'middle', label: '中' },
      { value: 'large', label: '大' }
    ]
  }
]

export const tableFieldTextDefaultProps = {
  textType: 'text' as 'text' | 'textArea',
  textContent: 'text' as 'text' | 'password' | 'email' | 'url' | 'tel',
  placeholder: '请输入文本内容',
  defaultVal: '',
  disabled: false,
  delBlank: false,
  size: 'middle' as 'small' | 'middle' | 'large'
}

const renderTableFieldTextPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(props.defaultVal || '')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldText
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              textType: props.textType,
              textContent: props.textContent,
              placeholder: props.placeholder,
              defaultVal: props.defaultVal,
              disabled: props.disabled,
              delBlank: props.delBlank,
              size: props.size
            }
          }}
        />
      </div>
    </div>
  )
}

const renderTableFieldTextCodePreview = (props: Record<string, any>) => {
  return `<TableFieldText
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      textType: "${props.textType}",
      textContent: "${props.textContent}",
      placeholder: "${props.placeholder}",
      defaultVal: "${props.defaultVal}",
      disabled: ${props.disabled},
      delBlank: ${props.delBlank},
      size: "${props.size}"
    }
  }}
/>`
}

export const tableFieldTextConfig: ComponentConfig = {
  id: 'table-field-text',
  name: 'TableField.Text 文本',
  propsConfig: tableFieldTextPropsConfig,
  defaultProps: tableFieldTextDefaultProps,
  renderPreview: renderTableFieldTextPreview,
  renderCodePreview: renderTableFieldTextCodePreview
}

export default tableFieldTextConfig
