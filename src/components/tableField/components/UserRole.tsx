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
import { dealFilter } from '@/components/tableField/components/relate/utils'

export interface UserRoleOption {
  value: string
  label: string
  key: string
  item?: any
}

export interface UserRoleProps {
  input?: {
    value?: any
    onChange?: (value: any) => void
  }
  field?: {
    schema?: { name?: string }
    displayField?: string
    showField?: string
    relateSchema?: {
      ignoreAdmin?: boolean
      size?: string
    }
    fieldSchema?: {
      enum?: string[]
      enum_title?: string[]
      enum1?: string[]
      enum_title1?: string[]
    }
  }
  label?: string
  disabled?: boolean
  mode?: 'single' | 'multiple'
  meta?: any
  record?: any
}

const UserRoleSelect: React.FC<UserRoleProps> = (props) => {
  const { field, input, label, disabled, mode = 'single' } = props
  const [loading, setLoading] = React.useState(false)
  const [options, setOptions] = React.useState<UserRoleOption[]>([])
  const [open, setOpen] = React.useState(false)

  const displayField = field?.displayField || 'name'
  const showField = field?.showField

  // 加载选项
  const loadOptions = React.useCallback(
    async () => {
      setLoading(true)
      try {
        const api = createAPI({
          resource: field?.schema?.name || 'core/user',
          name: 'user'
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
          .filter((opt) => !(field?.relateSchema?.ignoreAdmin && opt.value === 'admin'))

        setOptions(newOptions)
      } catch (error) {
        console.error('加载用户列表失败:', error)
        setOptions([])
      } finally {
        setLoading(false)
      }
    },
    [JSON.stringify(field), displayField, showField]
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
    input?.onChange?.(selected?.item || {})
  }

  // 获取当前显示的值
  const currentValue = input?.value
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

const UserRoleComponent: React.FC<UserRoleProps> = (props) => {
  const { input, field, mode = 'single', disabled, label } = props

  if (mode === 'multiple') {
    // TODO: 多选模式待实现
    return (
      <div className="text-sm text-muted-foreground">
        用户多选（待实现）
      </div>
    )
  }

  return <UserRoleSelect input={input} field={field} mode={mode} disabled={disabled} label={label} />
}

export default UserRoleComponent
