import * as React from 'react'
import { api } from '@airiot/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 翻译函数占位符
const _r = (str: string) => str
const _t1 = (str: string) => str

export interface TableSelectProps {
  /**
   * 单元格键值
   */
  cellKey?: string
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
 * 简化实现 - 基础功能版本
 */
export const TableSelect: React.FC<TableSelectProps> = (props) => {
  const {
    cellKey,
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
  const [tables, setTables] = React.useState<TableInfo[]>([])

  // 获取表列表
  const fetchTables = React.useCallback(async () => {
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
      setTables(filteredItems)

    } catch (error) {
      console.error('获取表列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [filter, excludeDevice, field?.func])

  // 初始化加载
  React.useEffect(() => {
    fetchTables()
  }, [fetchTables])

  // 处理值变化
  const handleChange = (selectedValue: string) => {
    if (!onChange) return

    const option = options.find(opt => opt.value === selectedValue)
    const table = option?.table || {
      id: selectedValue,
      title: selectedValue,
      name: selectedValue
    }
    onChange(table)
  }

  // 处理多选值变化
  const handleMultipleChange = (selectedValues: string[]) => {
    if (!onChange) return

    const selectedTables = selectedValues.map(val => {
      const option = options.find(opt => opt.value === val)
      return option?.table || {
        id: val,
        title: val,
        name: val
      }
    })
    onChange(selectedTables)
  }

  // 获取当前显示值
  const displayValue = React.useMemo(() => {
    if (!value) return multiple ? [] : undefined

    if (multiple) {
      return Array.isArray(value)
        ? value.map(v => (typeof v === 'object' ? v.id : v))
        : []
    } else {
      return typeof value === 'object' ? value.id : value
    }
  }, [value, multiple])

  // 多选处理
  if (multiple) {
    // 多选使用简单的div包装，实际项目中可能需要实现多选Select
    return (
      <div className="w-full" style={{ width, ...style }} {...restProps}>
        <Select
          value={displayValue?.[0]} // 多选暂不支持，使用单选占位
          onValueChange={handleChange}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-xs text-gray-500 mt-1">
          {_t1('多选功能暂未完全实现')}
        </div>
      </div>
    )
  }

  // 单选实现
  return (
    <div className="w-full" style={{ width, ...style }} {...restProps}>
      <Select
        value={displayValue}
        onValueChange={handleChange}
        disabled={loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

TableSelect.displayName = 'TableSelect'

export default TableSelect