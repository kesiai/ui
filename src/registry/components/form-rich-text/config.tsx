import * as React from 'react'
import { FormRichText } from '@/registry/components/form-rich-text/form-rich-text'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-rich-text.md?raw'

export const formRichTextPropsConfig = [
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
    name: 'ediforms',
    label: '可编辑字段',
    type: 'boolean' as const,
    default: true
  }
]

export const formRichTextDefaultProps = {
  placeholder: '编辑富文本',
  disabled: false,
  defaultVal: '',
  inList: false,
  ediforms: true
}

const renderFormRichTextPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState('<p>欢迎使用富文本编辑器</p>')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormRichText
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
              ediforms: props.ediforms
            }
          }}
        />
      </div>
    </div>
  )
}

const renderFormRichTextCodePreview = (props: Record<string, any>) => {
  return `<FormRichText
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
      ediforms: ${props.ediforms}
    }
  }}
/>`
}

export const formRichTextConfig: ComponentConfig = {
  id: 'form-rich-text',
  name: 'Form.RichText 富文本',
  propsConfig: formRichTextPropsConfig,
  defaultProps: formRichTextDefaultProps,
  renderPreview: renderFormRichTextPreview,
  renderCodePreview: renderFormRichTextCodePreview,
  documentation: documentationMd
}

export default formRichTextConfig
