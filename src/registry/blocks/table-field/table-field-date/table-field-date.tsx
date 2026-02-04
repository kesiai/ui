import * as React from 'react'
import { DatePicker as ShadcnDatePicker } from '@/components/ui/date-picker'
import moment from 'moment'

export interface TableFieldDateProps {
  input: {
    value?: string
    onChange?: (value: string | null) => void
  }
  field?: {
    schema?: {
      format?: 'ym' | 'date' | 'datetime' | 'ymdh'
      format2?: 'ym' | 'date' | 'datetime' | 'ymdh'
      disabled?: boolean
      defaultVal?: string
      defaultValType?: 'fixed' | 'logic'
      afterNow?: boolean
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

const TableFieldDate = React.forwardRef<HTMLButtonElement, TableFieldDateProps>(
  (props, ref) => {
    const { input, field: { schema } = {}, meta, style } = props
    const { value, onChange } = input || {}

    const {
      format = 'date',
      format2,
      disabled = false,
      defaultVal,
      defaultValType = 'fixed',
      afterNow = false,
      size = 'middle'
    } = schema || {}

    const pickerFormat = format2 || format

    // 格式映射
    const formatMap: Record<string, 'date' | 'datetime' | 'month' | 'ymdh'> = {
      'ym': 'month',
      'date': 'date',
      'datetime': 'datetime',
      'ymdh': 'ymdh'
    }

    // 默认值生效
    React.useEffect(() => {
      const timer = setTimeout(() => {
        if (!value && defaultVal && defaultValType !== 'logic') {
          onChange?.(defaultVal)
        }
      }, 0)
      return () => clearTimeout(timer)
    }, [])

    const handleDateChange = (dateValue: string | null) => {
      onChange?.(dateValue)
    }

    return (
      <ShadcnDatePicker
        ref={ref}
        format={formatMap[pickerFormat] || 'date'}
        disabled={disabled}
        value={value}
        onChange={handleDateChange}
        placeholder="请选择日期"
        disabledBeforeToday={afterNow}
        size={size}
        style={style}
      />
    )
  }
)

TableFieldDate.displayName = 'TableFieldDate'

export { TableFieldDate }
export default TableFieldDate
