import * as React from 'react'
import { FormBytesArray } from '@/registry/components/form-bytes-array/form-bytes-array'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-bytes-array.md?raw'

export const formBytesArrayPropsConfig = [
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '请输入内容'
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

export const formBytesArrayDefaultProps = {
  placeholder: '请输入内容',
  defaultVal: '',
  disabled: false
}

const renderFormBytesArrayPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(props.defaultVal || '')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormBytesArray
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
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

const renderFormBytesArrayCodePreview = (props: Record<string, any>) => {
  return `<FormBytesArray
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      placeholder: "${props.placeholder}",
      defaultVal: "${props.defaultVal}",
      disabled: ${props.disabled}
    }
  }}
/>`
}

export const formBytesArrayConfig: ComponentConfig = {
  id: 'form-bytes-array',
  name: 'Form.BytesArray 字节数组',
  propsConfig: formBytesArrayPropsConfig,
  defaultProps: formBytesArrayDefaultProps,
  renderPreview: renderFormBytesArrayPreview,
  renderCodePreview: renderFormBytesArrayCodePreview,
  documentation: documentationMd
}

export default formBytesArrayConfig
