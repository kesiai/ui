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
   * 表列表
   */
  tables?: Array<{ id?: string; title?: string; name?: string }>
  /**
   * 显示配置
   */
  displayConfig?: {
    noShow?: Array<{ tableId?: string; id?: string }>
  }
  /**
   * 是否只显示记录
   */
  onlyRecord?: boolean
  /**
   * 是否树形展示
   */
  tree?: boolean
  /**
   * 是否隐藏搜索
   */
  hideSearch?: boolean
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

export interface TableRecord {
  id: string
  name: string
  _label?: string
  __type__: 'tableData'
  table: {
    id: string
    title: string
  }
  isDevice?: boolean
}

/**
 * 表记录选择器组件
 * 简化实现 - 基础功能版本
 */
export const TableSelect: React.FC<TableSelectProps> = (props) => {
  const {
    cellKey,
    field,
    placeholder = _r('请选择表记录'),
    input = { value: undefined, onChange: undefined },
    multiple = false,
    tables = [],
    displayConfig,
    hideSearch = false,
    width = '100%',
    style = {},
    popupClassName,
    ...restProps
  } = props

  const { value, onChange } = input

  const [options, setOptions] = React.useState<Array<{ label: string; value: string; record?: TableRecord }>>([])
  const [loading, setLoading] = React.useState(false)

  // 转换表ID数组
  const tableIds = React.useMemo(() => {
    if (tables?.length) {
      return tables.map(item => item?.id).filter(i => i) as string[]
    }
    return null
  }, [tables])

  // 获取表记录
  const fetchRecords = React.useCallback(async (tableId: string) => {
    try {
      setLoading(true)

      // 查询表记录
      const { items } = await api({ name: `core/t/${tableId}/d` }).query(
        { fields: ['_label'] },
        { where: {} }
      )

      // 应用显示配置过滤
      const filteredItems = displayConfig?.noShow
        ? items.filter((item: any) => {
            const isHidden = displayConfig.noShow?.some(ns =>
              ns.tableId === tableId && ns.id === item.id
            )
            return !isHidden
          })
        : items

      // 转换为选项格式
      const newOptions = filteredItems.map((item: any) => ({
        label: item._label || item.id,
        value: item.id,
        record: {
          id: item.id,
          name: item._label || item.id,
          _label: item._label,
          __type__: 'tableData' as const,
          table: { id: tableId, title: item._label || item.id },
        }
      }))

      setOptions(prev => [...prev, ...newOptions])

    } catch (error) {
      console.error('获取表记录失败:', error)
    } finally {
      setLoading(false)
    }
  }, [displayConfig])

  // 获取所有表
  const fetchAllTables = React.useCallback(async () => {
    if (!tableIds || tableIds.length === 0) return

    setOptions([])

    for (const tableId of tableIds) {
      await fetchRecords(tableId)
    }
  }, [tableIds, fetchRecords])

  // 初始化加载
  React.useEffect(() => {
    if (tableIds && tableIds.length > 0) {
      fetchAllTables()
    }
  }, [fetchAllTables])

  // 处理值变化
  const handleChange = (selectedValue: string) => {
    if (!onChange) return

    const option = options.find(opt => opt.value === selectedValue)
    const record = option?.record || {
      id: selectedValue,
      name: selectedValue,
      __type__: 'tableData' as const,
      table: { id: '', title: '' }
    }
    onChange(record)
  }

  // 获取当前显示值
  const displayValue = React.useMemo(() => {
    if (!value) return undefined
    return typeof value === 'object' ? value.id : value
  }, [value])

  // 渲染选择器内容
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