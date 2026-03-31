import * as React from 'react'
import { FormTime } from '@/registry/components/form-time/form-time'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-time.md?raw'

export const formTimePropsConfig = [
  {
    name: 'timeFormat',
    label: '时间格式',
    type: 'select' as const,
    default: 'HH:mm:ss',
    options: [
      { value: 'HH:mm', label: 'HH:mm (时:分)' },
      { value: 'HH:mm:ss', label: 'HH:mm:ss (时:分:秒)' }
    ]
  },
  {
    name: 'defaultVal',
    label: '默认值',
    type: 'text' as const,
    default: '',
    description: '例如：14:30:00'
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
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

export const formTimeDefaultProps = {
  timeFormat: 'HH:mm:ss' as 'HH:mm' | 'HH:mm:ss',
  defaultVal: '',
  disabled: false,
  size: 'middle' as 'small' | 'middle' | 'large'
}

const renderFormTimePreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(props.defaultVal || '')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormTime
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              timeFormat: props.timeFormat,
              defaultVal: props.defaultVal,
              disabled: props.disabled,
              size: props.size
            }
          }}
        />
      </div>
    </div>
  )
}

const renderFormTimeCodePreview = (props: Record<string, any>) => {
  return `<FormTime
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      timeFormat: "${props.timeFormat}",
      defaultVal: "${props.defaultVal}",
      disabled: ${props.disabled},
      size: "${props.size}"
    }
  }}
/>`
}

export const formTimeConfig: ComponentConfig = {
  id: 'form-time',
  name: 'Form.Time 时间选择器',
  propsConfig: formTimePropsConfig,
  defaultProps: formTimeDefaultProps,
  renderPreview: renderFormTimePreview,
  renderCodePreview: renderFormTimeCodePreview,
  documentation: documentationMd
}

export default formTimeConfig
