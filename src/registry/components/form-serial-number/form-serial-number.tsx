import * as React from 'react'
import { Input } from '@/components/ui/input'

export interface FormSerialNumberProps {
  /** 当前值 */
  value?: string
  /** 是否禁用 */
  disabled?: boolean
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
