import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface TableFieldTextProps {
  input: {
    value?: string
    onChange?: (value: string | null) => void
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  }
  field?: {
    schema?: {
      textType?: 'text' | 'textArea'
      textContent?: 'text' | 'password' | 'email' | 'url' | 'tel'
      placeholder?: string
      defaultVal?: string
      defaultValType?: 'fixed' | 'logic'
      disabled?: boolean
      delBlank?: boolean
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

const TableFieldText = React.forwardRef<HTMLTextAreaElement | HTMLInputElement, TableFieldTextProps>(
  (props, ref) => {
    const { input, field: { schema, filter } = {}, meta } = props
    const { onChange, value, onBlur } = input || {}

    const {
      textType = 'text',
      textContent = 'text',
      placeholder = '请输入文本内容',
      defaultVal,
      defaultValType = 'fixed',
      disabled = false,
      delBlank = false,
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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      onChange?.(e.target.value || null)
    }

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (delBlank && e.target.value) {
        onChange?.(e.target.value.trim())
      }
      onBlur?.(e)
    }

    const sizeClasses = {
      small: 'h-8 px-2 py-1 text-sm',
      middle: 'h-10 px-3 py-2',
      large: 'h-12 px-4 py-3 text-lg'
    }

    const commonProps = {
      value: value || '',
      onChange: handleChange,
      onBlur: handleBlur,
      placeholder,
      disabled,
      className: cn(sizeClasses[size], 'w-full')
    }

    // 密码输入框
    if (textContent === 'password') {
      return (
        <Input
          ref={ref as React.Ref<HTMLInputElement>}
          type="password"
          {...commonProps}
        />
      )
    }

    // 文本域
    if (textType === 'textArea') {
      return (
        <Textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          {...commonProps}
          className={cn(commonProps.className, 'min-h-[80px]')}
        />
      )
    }

    // 普通文本输入框
    return (
      <Input
        ref={ref as React.Ref<HTMLInputElement>}
        type={textContent}
        {...commonProps}
      />
    )
  }
)

TableFieldText.displayName = 'TableFieldText'

export { TableFieldText }
export default TableFieldText
