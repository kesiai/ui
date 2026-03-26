import * as React from 'react'
import { Input } from '@/components/ui/input'

export interface FormSerialNumberProps {
  value?: string
  onChange?: (value: string) => void
  serialRules?: Array<{
    type: 'text' | 'time' | 'num'
    text?: string
    time?: string
    num?: {
      orderType?: 'random' | 'linear'
      bitNum?: number
      startNum?: number
    }
  }>
  disabled?: boolean
  meta?: any
  record?: any
}

const FormSerialNumber: React.FC<FormSerialNumberProps> = (props) => {
  const { value, disabled = true } = props

  return (
    <Input
      value={value || ''}
      disabled={disabled}
      placeholder="自动生成"
      className="bg-muted"
    />
  )
}

export { FormSerialNumber }
