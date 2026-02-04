import * as React from 'react'
import { TableFieldRichText } from '@/registry/blocks/table-field/table-field-rich-text/table-field-rich-text'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldRichTextPropsConfig = [
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '编辑富文本'
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'defaultVal',
    label: '默认值',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'inList',
    label: '在列表中显示',
    type: 'boolean' as const,
    default: false,
    description: '在列表中显示时，点击查看富文本内容'
  },
  {
    name: 'editableFields',
    label: '可编辑字段',
    type: 'boolean' as const,
    default: true
  }
]

export const tableFieldRichTextDefaultProps = {
  placeholder: '编辑富文本',
  disabled: false,
  defaultVal: '',
  inList: false,
  editableFields: true
}

const renderTableFieldRichTextPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState('<p>欢迎使用富文本编辑器</p>')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldRichText
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              placeholder: props.placeholder,
              disabled: props.disabled,
              defaultVal: props.defaultVal,
              inList: props.inList,
              editableFields: props.editableFields
            }
          }}
        />
      </div>
    </div>
  )
}

const renderTableFieldRichTextCodePreview = (props: Record<string, any>) => {
  return `<TableFieldRichText
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      placeholder: "${props.placeholder}",
      disabled: ${props.disabled},
      defaultVal: "${props.defaultVal}",
      inList: ${props.inList},
      editableFields: ${props.editableFields}
    }
  }}
/>`
}

export const tableFieldRichTextConfig: ComponentConfig = {
  id: 'table-field-rich-text',
  name: 'TableField.RichText 富文本',
  propsConfig: tableFieldRichTextPropsConfig,
  defaultProps: tableFieldRichTextDefaultProps,
  renderPreview: renderTableFieldRichTextPreview,
  renderCodePreview: renderTableFieldRichTextCodePreview
}

export default tableFieldRichTextConfig
