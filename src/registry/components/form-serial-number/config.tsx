import * as React from 'react'
import { FormSerialNumber } from '@/registry/components/form-serial-number/form-serial-number'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-serial-number.md?raw'

export const formSerialNumberPropsConfig = [
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: true,
    description: '序列号字段默认禁用，自动生成'
  }
]

export const formSerialNumberDefaultProps = {
  disabled: true
}

const renderFormSerialNumberPreview = (props: Record<string, any>) => {
  const [value] = React.useState('SN-20240203-0001')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormSerialNumber
          value={value}
          disabled={props.disabled}
        />
      </div>
    </div>
  )
}

const renderFormSerialNumberCodePreview = (_props: Record<string, any>) => {
  return `<FormSerialNumber
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {}
  }}
  disabled={props.disabled}
/>`
}

export const formSerialNumberConfig: ComponentConfig = {
  id: 'form-serial-number',
  name: '序列号',
  propsConfig: formSerialNumberPropsConfig,
  defaultProps: formSerialNumberDefaultProps,
  renderPreview: renderFormSerialNumberPreview,
  renderCodePreview: renderFormSerialNumberCodePreview,
  documentation: documentationMd
}

export default formSerialNumberConfig
