import * as React from 'react'
import { Input } from '@/components/ui/input'

export interface FormBytesArrayProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  defaultVal?: string
  disabled?: boolean
  filter?: any
  meta?: any
  record?: any
}

const FormBytesArray: React.FC<FormBytesArrayProps> = (props) => {
  const { value, onChange, placeholder, disabled } = props

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <Input
      value={value || ''}
      onChange={handleChange}
      placeholder={placeholder || '请输入内容'}
      disabled={disabled}
    />
  )
}

export { FormBytesArray }
export default FormBytesArray
