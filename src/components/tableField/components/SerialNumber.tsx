import * as React from 'react'
import { Input } from '@/components/ui/input'

export interface SerialNumberProps {
  input?: {
    value?: string
    onChange?: (value: string) => void
  }
  field?: {
    schema?: {
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
    }
  }
  disabled?: boolean
  meta?: any
  record?: any
}

const SerialNumberComponent: React.FC<SerialNumberProps> = (props) => {
  const { input, disabled = true } = props

  console.log(6666, input)
  return (
    <Input
      value={input?.value || ''}
      disabled={disabled}
      placeholder="自动生成"
      className="bg-muted"
    />
  )
}

export default SerialNumberComponent
