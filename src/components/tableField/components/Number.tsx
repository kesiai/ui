import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import isNumber from 'lodash/isNumber'
import isNull from 'lodash/isNull'
import isUndefined from 'lodash/isUndefined'

export interface NumberComponentProps {
  input: {
    value?: number
    onChange?: (value: number | null) => void
  }
  field?: {
    schema?: {
      unit?: string
      placeholder?: string
      decimal?: number | null
      defaultVal?: number
      disabled?: boolean
      max?: number
      min?: number
      size?: 'small' | 'middle' | 'large'
      [key: string]: any
    }
    filter?: any
    meta?: any
  }
  meta?: any
  record?: any
  [key: string]: any
}

const NumberComponent = React.forwardRef<HTMLInputElement, NumberComponentProps>(
  (props, ref) => {
    const { input, field: { schema, filter } = {} } = props
    const { onChange, value } = input || {}

    const {
      unit = '',
      placeholder = '请输入数字',
      decimal = null,
      defaultVal,
      disabled = false,
      max,
      min,
      size = 'middle'
    } = schema || {}

    // 默认值生效
    React.useEffect(() => {
      const timer = setTimeout(() => {
        if ((isUndefined(value) || isNull(value) || value === '') && isNumber(defaultVal)) {
          onChange?.(defaultVal)
        }
      }, 0)
      return () => clearTimeout(timer)
    }, [])

    const displayValue = isNumber(value) ? value : ''

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      if (val === '') {
        onChange?.(null)
        return
      }

      const num = parseFloat(val)
      if (isNaN(num)) {
        return
      }

      // 处理小数位数
      if (decimal !== null && !isUndefined(decimal)) {
        const factor = Math.pow(10, decimal)
        const rounded = Math.round(num * factor) / factor
        onChange?.(rounded)
      } else {
        onChange?.(num)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      let val = parseFloat(e.target.value)
      if (isNaN(val)) return

      // 应用 min/max 限制
      if (!isUndefined(min) && val < min) val = min
      if (!isUndefined(max) && val > max) val = max

      // 处理小数位数
      if (decimal !== null && !isUndefined(decimal)) {
        const factor = Math.pow(10, decimal)
        val = Math.round(val * factor) / factor
      }

      onChange?.(val)
    }

    const sizeClasses = {
      small: 'h-8 px-2 py-1 text-sm',
      middle: 'h-10 px-3 py-2',
      large: 'h-12 px-4 py-3 text-lg'
    }

    const step = decimal !== null && !isUndefined(decimal) && decimal > 0
      ? 1 / Math.pow(10, decimal)
      : 1

    return (
      <div className="flex w-full items-center">
        <Input
          ref={ref}
          type="number"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={cn(sizeClasses[size], 'flex-1')}
        />
        {unit && (
          <span className="ml-2 text-sm text-muted-foreground">{unit}</span>
        )}
      </div>
    )
  }
)

NumberComponent.displayName = 'NumberComponent'

export default NumberComponent
