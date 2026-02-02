import * as React from 'react'
import { Input } from '@/components/ui/input'

export interface BytesArrayProps {
  input?: {
    value?: string
    onChange?: (value: string) => void
  }
  field?: {
    schema?: {
      placeholder?: string
      defaultVal?: string
      disabled?: boolean
    }
    filter?: any
  }
  disabled?: boolean
  meta?: any
  record?: any
}

const BytesArrayComponent: React.FC<BytesArrayProps> = (props) => {
  const { input, field, disabled } = props
  const { onChange, value } = input || {}
  const schema = field?.schema || {}

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <Input
      value={value || ''}
      onChange={handleChange}
      placeholder={schema.placeholder || '请输入内容'}
      disabled={disabled ?? schema.disabled}
    />
  )
}

export default BytesArrayComponent
