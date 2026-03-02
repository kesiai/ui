import * as React from 'react'
import { createAPI } from '@airiot/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

export interface FormUserRoleOption {
  value: string
  label: string
  key: string
  item?: any
}

export interface FormUserRoleProps {
  value?: any
  onChange?: (value: any) => void
  name?: string
  displayField?: string
  showField?: string
  ignoreAdmin?: boolean
  size?: string
  fieldSchema?: {
    enum?: string[]
    enum_title?: string[]
    enum1?: string[]
    enum_title1?: string[]
  }
  label?: string
  disabled?: boolean
  mode?: 'single' | 'multiple'
  meta?: any
  record?: any
}

const FormUserRoleSelect: React.FC<FormUserRoleProps> = (props) => {
  const {
    value,
    onChange,
    name,
    displayField = 'name',
    showField,
    ignoreAdmin = false,
    size,
    fieldSchema,
    label,
    disabled,
    mode = 'single'
  } = props

  const [loading, setLoading] = React.useState(false)
  const [options, setOptions] = React.useState<FormUserRoleOption[]>([])
  const [open, setOpen] = React.useState(false)

  // 加载选项
  const loadOptions = React.useCallback(
    async () => {
      setLoading(true)
      try {
        const api = createAPI({
          resource: 'core/' + (name || 'user'),
          name: name ||'user'
        })

        const fields = showField ? ['id', displayField, showField] : ['id', displayField]

        const { items } = await api.query({
          limit: 100,
          fields
        }, {})

        const newOptions = items
          .map((item: any) => ({
            value: item.id,
            label: item[displayField],
            key: item.id,
            item,
          }))
          .filter((opt) => !(ignoreAdmin && opt.value === 'admin'))

        setOptions(newOptions)
      } catch (error) {
        console.error('加载用户列表失败:', error)
        setOptions([])
      } finally {
        setLoading(false)
      }
    },
    [name, displayField, showField, ignoreAdmin]
  )

  // 打开下拉时加载选项
  React.useEffect(() => {
    if (open && options.length === 0) {
      loadOptions()
    }
  }, [open, options.length, loadOptions])

  // 处理选择变化
  const handleChange = (value: string) => {
    const selected = options.find((opt) => opt.value === value)
    onChange?.(selected?.item || {})
  }

  // 获取当前显示的值
  const currentValue = value
  const displayValue = currentValue?.[displayField] || currentValue?.id || ''

  return (
    <Select
      value={currentValue?.id || ''}
      onValueChange={handleChange}
      disabled={disabled}
      open={open}
      onOpenChange={setOpen}
    >
      <SelectTrigger className="w-full">
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-muted-foreground">加载中...</span>
          </div>
        ) : (
          <SelectValue placeholder={`选择${label || '用户'}...`}>
            {displayValue}
          </SelectValue>
        )}
      </SelectTrigger>
      <SelectContent>
        {options.length === 0 ? (
          <div className="px-3 py-2 text-center text-sm text-muted-foreground">
            暂无数据
          </div>
        ) : (
          options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}

const FormUserRole: React.FC<FormUserRoleProps> = (props) => {
  const { value, onChange, mode = 'single', disabled, label, name, displayField, showField, ignoreAdmin, fieldSchema } = props

  if (mode === 'multiple') {
    // TODO: 多选模式待实现
    return (
      <div className="text-sm text-muted-foreground">
        用户多选（待实现）
      </div>
    )
  }

  return <FormUserRoleSelect
    value={value}
    onChange={onChange}
    mode={mode}
    disabled={disabled}
    label={label}
    name={name}
    displayField={displayField}
    showField={showField}
    ignoreAdmin={ignoreAdmin}
    fieldSchema={fieldSchema}
  />
}

export { FormUserRole }
export default FormUserRole
