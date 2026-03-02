import * as React from 'react'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Crosshair, Loader2 } from 'lucide-react'
import { createAPI } from '@airiot/client'
import { dealFilter, getQueryFilter } from '@/registry/lib/form-relate-utils'
import type { RelateFieldOption } from '@/registry/lib/form-relate-types'

interface AsyncSelectProps {
  input?: {
    value?: any
    onChange?: (value: any) => void
  }
  field?: {
    schema?: Record<string, any>
    filter?: any
    meta?: any
    key?: string
    displayField?: string
    tableID?: string
    relateShowFields?: Array<{
      key: string
      title: string
      mapToCurrent?: boolean
      mapField?: string
      fieldSchema?: any
    }>
    option?: {
      form?: {
        change: (field: string, value: any) => void
      }
    }
  }
  meta?: any
  record?: any
  antdForm?: any
  label?: string
  disabled?: boolean
  value?: {
    key: string
    label: string
    item?: any
  } | null | {
    key: string
    label: string
    item?: any
  }[]
  mode?: 'multiple' | 'tags'
  isOptionSelected?: (option: RelateFieldOption) => boolean
  style?: React.CSSProperties
  onChange?: (value: any) => void
}

/**
 * AsyncSelect - 异步选择器组件
 * 支持搜索、分页加载、精确搜索
 */
const AsyncSelect: React.FC<AsyncSelectProps> = (props) => {
  const {
    field = {},
    label = '请选择',
    disabled = false,
    mode,
    value: propValue,
    onChange,
    style,
  } = props

  const { displayField = 'name', schema, relateShowFields } = field

  // 状态管理
  const [loading, setLoading] = React.useState(false)
  const [pageLoading, setPageLoading] = React.useState(false)
  const [options, setOptions] = React.useState<RelateFieldOption[]>([])
  const [allOptions, setAllOptions] = React.useState<RelateFieldOption[]>([])
  const [page, setPage] = React.useState(0)
  const [count, setCount] = React.useState(50)
  const [precise, setPrecise] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')

  const itemsRef = React.useRef<RelateFieldOption[]>([])
  const currentPageRef = React.useRef(0)

  // 获取选项数据
  const loadOptions = React.useCallback(
    async (inputValue: string = '', pageNum: number = 0): Promise<number> => {
      if (currentPageRef.current >= pageNum && pageNum !== 0) {
        return 0
      }
      if (pageNum === 0) {
        itemsRef.current = []
        currentPageRef.current = 0
      }
      currentPageRef.current = pageNum

      let filterObj: any = {}
      if (inputValue) {
        filterObj = precise
          ? { [displayField]: inputValue }
          : { [displayField]: { $like: inputValue } }
      }

      dealFilter(filterObj, field, getQueryFilter)

      setLoading(true)
      try {
        const s = schema || field.schema
        const resource = s?.name ? s?.name : `core/t/${s?.relate?.id}/d`

        // 创建 API 实例
        const api = createAPI({ resource })

        // 使用 api.query 查询数据
        const { items } = await api.query(
          {
            limit: 50,
            skip: pageNum * 50,
            fields: ['id', displayField].filter(Boolean),
            ...(inputValue && { search: filterObj })
          }
        )

        const newOptions = items.map((item: any) => ({
          value: item.id,
          label: item[displayField] || item.name || item.id,
          key: item.id,
          item,
        }))

        itemsRef.current = [...itemsRef.current, ...newOptions]
        setOptions(itemsRef.current)
        setCount(items.length || 0)

        return items.length || 0
      } catch (error) {
        console.error('加载选项失败:', error)
        setOptions([])
        return 0
      } finally {
        setLoading(false)
      }
    },
    [JSON.stringify(field), displayField, schema, relateShowFields, precise]
  )

  // 初始加载
  React.useEffect(() => {
    loadOptions()
  }, [loadOptions])

  // 合并去重选项
  React.useEffect(() => {
    setAllOptions((before) => {
      return before
        .concat(options)
        .filter(
          (option, index, self) =>
            index === self.findIndex((t) => t.value === option.value)
        )
    })
  }, [options])

  // 多字段联动表单其他字段
  React.useEffect(() => {
    relateShowFields?.forEach((rsf) => {
      if (rsf.mapToCurrent && rsf.mapField) {
        const itemValue = isArray(propValue) ? propValue[0]?.item?.[rsf.key] : (propValue as any)?.item?.[rsf.key]
        if (itemValue) {
          field?.option?.form?.change(rsf.mapField, itemValue)
        }
      }
    })
  }, [JSON.stringify(propValue || {}), relateShowFields, field])

  // 处理值变化
  const handleChange = (selectedValue: string | string[]) => {
    if (!selectedValue || (isArray(selectedValue) && selectedValue.length === 0)) {
      onChange?.(mode === 'multiple' ? [] : {})
      return
    }

    if (mode === 'multiple' && isArray(selectedValue)) {
      const selectedOptions = selectedValue
        .map((key) => {
          const result = allOptions.find((item) => item.value === key)
          return result || (isArray(propValue) && propValue.find((v: any) => v?.key === key)) || null
        })
        .filter(Boolean)

      onChange?.(selectedOptions)
    } else {
      const selectedOption = allOptions.find((opt) => opt.value === selectedValue)
      onChange?.(selectedOption || {})
    }
  }

  // 处理搜索
  const handleSearch = async (value: string) => {
    setSearchValue(value)
    const _count = await loadOptions(value, 0)
    setCount(_count)
    setPage(0)
  }

  // 切换精确/模糊搜索
  const togglePrecise = () => {
    const _precise = !precise
    setPrecise(_precise)
    handleSearch(searchValue)
  }

  // 加载更多
  const loadMore = React.useCallback(async () => {
    if (pageLoading || count < 50) return

    const nextPage = page + 1
    setPage(nextPage)
    setPageLoading(true)

    const _count = await loadOptions(searchValue, nextPage)
    setCount(_count)
    setPageLoading(false)
  }, [page, pageLoading, count, searchValue, loadOptions])

  // 格式化显示值
  const formatDisplayValue = (val: any): string => {
    if (!val) return ''
    if (typeof val === 'string') return val
    if (isObject(val) && (val as any).label) return (val as any).label
    return String(val)
  }

  const currentValue: any =
    mode === 'multiple'
      ? (isArray(propValue) ? propValue.map((v) => (v as any)?.key || v).filter(Boolean) : [])
      : (propValue as any)?.key || propValue || ''

  return (
    <div style={{ position: 'relative', width: '100%', minWidth: 150, ...style }}>
      <Select
        value={currentValue}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={label}>
            {mode === 'multiple' && isArray(propValue) && propValue.length > 0
              ? propValue.map((v) => formatDisplayValue(v)).join(', ')
              : formatDisplayValue(propValue)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {loading && options.length === 0 ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2">加载中...</span>
            </div>
          ) : options.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">暂无数据</div>
          ) : (
            <>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
              {loading && page > 0 && (
                <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  加载中...
                </div>
              )}
              {!loading && count < 50 && page > 0 && (
                <div className="text-center p-2 text-sm text-muted-foreground">
                  已加载全部
                </div>
              )}
              {count === 50 && !loading && (
                <div className="text-center p-2">
                  <Button variant="ghost" size="sm" onClick={loadMore} disabled={pageLoading}>
                    {pageLoading ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        加载中...
                      </>
                    ) : (
                      '加载更多'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </SelectContent>
      </Select>

      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={togglePrecise}
            >
              <Crosshair className={`h-3 w-3 ${precise ? 'text-green-600' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{precise ? '模糊搜索' : '精确搜索'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}
    </div>
  )
}

export default AsyncSelect
