import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

export interface FormLinkProps {
  input?: {
    value?: string
    onChange?: (value: string) => void
  }
  field?: {
    schema?: {
      placeholder?: string
      defaultVal?: string
      disabled?: boolean
      linkType?: 'in' | 'out'
      size?: string
    }
  }
  disabled?: boolean
  meta?: any
  record?: any
}

const MenuItemSelect: React.FC<{
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}> = (props) => {
  const { value, onChange, placeholder, disabled } = props
  const [loading, setLoading] = React.useState(false)

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        菜单项选择器（待迁移）
      </p>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && (
        <p className="text-sm text-muted-foreground">
          {placeholder || '暂无菜单项'}
        </p>
      )}
    </div>
  )
}

const FormLink = React.forwardRef<HTMLDivElement, FormLinkProps>(
  (props, ref) => {
    const { input, field, disabled } = props
    const { onChange, value } = input || {}
    const schema = field?.schema || {}
    const { linkType } = schema

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value)
    }

    return linkType === 'in' ? (
      <MenuItemSelect
        value={value}
        onChange={onChange}
        placeholder={schema.placeholder || '选择系统内置的菜单项'}
        disabled={disabled ?? schema.disabled}
      />
    ) : (
      <Input
        value={value || ''}
        onChange={handleChange}
        placeholder={schema.placeholder || '请输入链接'}
        disabled={disabled ?? schema.disabled}
      />
    )
  }
)

FormLink.displayName = 'FormLink'

export { FormLink }
export default FormLink
