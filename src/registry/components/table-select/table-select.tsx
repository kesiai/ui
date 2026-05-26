import * as React from 'react'
import { api } from '@airiot/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

// 翻译函数占位符
const _r = (str: string) => str
const _t1 = (str: string) => str

export interface TableSelectProps {
  /**
   * 字段配置
   */
  field?: any
  /**
   * 占位符文本
   */
  placeholder?: string
  /**
   * 输入值和控制函数
   */
  input?: {
    value?: any
    onChange?: (value: any) => void
  }
  /**
   * 是否多选
   */
  multiple?: boolean
  /**
   * 过滤条件
   */
  filter?: any
  /**
   * 是否树形展示
   */
  tree?: boolean
  /**
   * 是否排除设备表
   */
  excludeDevice?: boolean
  /**
   * 宽度
   */
  width?: string | number
  /**
   * 样式
   */
  style?: React.CSSProperties
  /**
   * 弹窗类名
   */
  popupClassName?: string
}

export interface TableInfo {
  id: string
  title: string
  name: string
  isDevice?: boolean
}

/**
 * 表选择器组件
 * 支持单选和多选
 */
export const TableSelect: React.FC<TableSelectProps> = (props) => {
  const {
    field,
    placeholder = _r('请选择表'),
    input = { value: undefined, onChange: undefined },
    multiple = false,
    filter,
    tree = false,
    excludeDevice = false,
    width = '100%',
    style = {},
    popupClassName,
    ...restProps
  } = props

  const { value, onChange } = input

  const [options, setOptions] = React.useState<Array<{ label: string; value: string; table?: TableInfo }>>([])
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const hasFetchedRef = React.useRef(false)

  // 获取表列表
  const fetchTables = React.useCallback(async () => {
    // 如果已经加载过且没有强制刷新需求，则跳过
    if (hasFetchedRef.current && options.length > 0) {
      return
    }

    try {
      setLoading(true)

      // 构建查询条件
      const where: Record<string, any> = {}

      // 应用过滤条件
      if (filter) {
        Object.assign(where, filter)
      }

      // 功能过滤
      if (field?.func) {
        where.function = { '$regex': field.func }
      }

      // 查询表列表
      const { items } = await api({ name: 'core/t/schema' }).query(
        { fields: ['title', 'name', 'isDevice'] },
        { where }
      )

      // 过滤设备表
      const filteredItems = excludeDevice
        ? items.filter((item: any) => !item.isDevice)
        : items

      // 转换为选项格式
      const newOptions = filteredItems.map((item: any) => ({
        label: item.title || item.name,
        value: item.id,
        table: {
          id: item.id,
          title: item.title || item.name,
          name: item.name,
          isDevice: item.isDevice
        }
      }))

      setOptions(newOptions)
      hasFetchedRef.current = true

    } catch (error) {
      console.error('获取表列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [filter, excludeDevice, field?.func, options.length])

  // 初始化加载和打开下拉时加载数据
  React.useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchTables()
    }
  }, [fetchTables])

  // 打开下拉时确保数据已加载
  React.useEffect(() => {
    if (open && !hasFetchedRef.current) {
      fetchTables()
    }
  }, [open, fetchTables])

  // 获取当前选中的值数组
  const selectedValues = React.useMemo(() => {
    if (!value) return []

    if (multiple) {
      return Array.isArray(value)
        ? value.map(v => (typeof v === 'object' ? v.id : v))
        : []
    } else {
      return typeof value === 'object' ? [value.id] : value ? [value] : []
    }
  }, [value, multiple])

  // 处理单选值变化
  const handleSingleChange = (selectedValue: string) => {
    if (!onChange) return

    const option = options.find(opt => opt.value === selectedValue)
    const table = option?.table || {
      id: selectedValue,
      title: selectedValue,
      name: selectedValue
    }
    onChange(table)
    setOpen(false)
  }

  // 处理多选 checkbox 变化
  const handleMultipleCheckboxChange = (selectedValue: string, checked: boolean) => {
    if (!onChange) return

    let newSelectedValues: string[]
    if (checked) {
      newSelectedValues = [...selectedValues, selectedValue]
    } else {
      newSelectedValues = selectedValues.filter(v => v !== selectedValue)
    }

    // 转换为 TableInfo 数组
    const selectedTables = newSelectedValues.map(val => {
      const option = options.find(opt => opt.value === val)
      return option?.table || {
        id: val,
        title: val,
        name: val
      }
    })
    onChange(selectedTables)
  }

  // 移除单个选项
  const handleRemove = (removedValue: string) => {
    if (!onChange) return

    const newSelectedValues = selectedValues.filter(v => v !== removedValue)
    const selectedTables = newSelectedValues.map(val => {
      const option = options.find(opt => opt.value === val)
      return option?.table || {
        id: val,
        title: val,
        name: val
      }
    })
    onChange(selectedTables)
  }

  // 获取已选项的标签
  const selectedLabels = React.useMemo(() => {
    return selectedValues.map(val => {
      const option = options.find(opt => opt.value === val)
      return option?.label || val
    })
  }, [selectedValues, options])

  // 多选实现
  if (multiple) {
    return (
      <div className="w-full" style={{ width, ...style }} {...restProps}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={loading}
              className="w-full justify-between h-auto py-1.5 min-h-[38px]"
            >
              <div className="flex flex-wrap items-center gap-1.5 flex-1">
                {selectedLabels.length === 0 ? (
                  <span className="text-sm text-muted-foreground">{placeholder}</span>
                ) : (
                  selectedLabels.map((label, idx) => (
                    <span
                      key={selectedValues[idx]}
                      className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs transition-colors"
                    >
                      <span className="max-w-[120px] truncate">
                        {label}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemove(selectedValues[idx])
                        }}
                        className="hover:text-destructive transition-colors"
                        title="删除"
                      >
                        <X className="!w-3 !h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <ScrollArea className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-sm text-muted-foreground">加载中...</span>
                </div>
              ) : options.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  暂无数据
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {options.map((option) => (
                    <div
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMultipleCheckboxChange(
                          option.value,
                          !selectedValues.includes(option.value)
                        )
                      }}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors",
                        selectedValues.includes(option.value) && 'bg-accent text-accent-foreground'
                      )}
                    >
                      <span className="flex-1 text-sm truncate">{option.label}</span>
                      {selectedValues.includes(option.value) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  // 单选实现
  return (
    <div className="w-full" style={{ width, ...style }} {...restProps}>
      <Select
        value={selectedValues[0]}
        onValueChange={handleSingleChange}
        disabled={loading}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <div className="p-2 text-center text-sm text-gray-500">加载中...</div>
          ) : options.length === 0 ? (
            <div className="p-2 text-center text-sm text-gray-500">暂无数据</div>
          ) : (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

TableSelect.displayName = 'TableSelect'