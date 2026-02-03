import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import moment from 'moment'

export interface TableFieldTimeProps {
  input: {
    value?: string
    onChange?: (value: string | null) => void
  }
  field?: {
    schema?: {
      timeFormat?: string
      disabled?: boolean
      defaultVal?: string
      defaultValType?: 'fixed' | 'logic'
      size?: 'small' | 'middle' | 'large'
      [key: string]: any
    }
    filter?: any
    meta?: any
  }
  meta?: any
  style?: React.CSSProperties
  record?: any
  [key: string]: any
}

const TableFieldTime = React.forwardRef<HTMLInputElement, TableFieldTimeProps>(
  (props, ref) => {
    const { input, field: { schema } = {}, meta, style } = props
    const { value, onChange } = input || {}

    const {
      timeFormat = 'HH:mm:ss',
      disabled = false,
      defaultVal,
      defaultValType = 'fixed',
      size = 'middle'
    } = schema || {}

    // 默认值生效
    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (!value && defaultVal && defaultValType !== 'logic') {
          onChange?.(defaultVal)
        }
      }, 0)
      return () => clearTimeout(timer)
    }, [])

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      if (!val) {
        onChange?.(null)
        return
      }

      // 格式化时间为指定的格式
      const [hours = '00', minutes = '00', seconds = '00'] = val.split(':')

      if (timeFormat === 'HH:mm') {
        onChange?.(`${hours}:${minutes}`)
      } else if (timeFormat === 'HH:mm:ss') {
        onChange?.(`${hours}:${minutes}:${seconds}`)
      } else {
        // 其他格式，直接使用输入值
        onChange?.(val)
      }
    }

    const sizeClasses = {
      small: 'h-8 px-2 py-1 text-sm',
      middle: 'h-10 px-3 py-2',
      large: 'h-12 px-4 py-3 text-lg'
    }

    // 转换 value 格式以适配 input type="time"
    const getInputValue = () => {
      if (!value) return ''
      try {
        const date = moment(value, timeFormat)
        if (date.isValid()) {
          return date.format('HH:mm')
        }
      } catch (e) {
        // Ignore
      }
      return ''
    }

    return (
      <Input
        ref={ref}
        type="time"
        value={getInputValue()}
        onChange={handleTimeChange}
        disabled={disabled}
        className={cn(sizeClasses[size], 'w-full')}
        style={style}
      />
    )
  }
)

TableFieldTime.displayName = 'TableFieldTime'

export { TableFieldTime }
export default TableFieldTime
