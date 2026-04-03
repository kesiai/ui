import { useState, useEffect, useMemo } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'

import { ChevronDown, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { createAPI, getConfig } from '@airiot/client'

interface LogTypeItem {
  title: string
  value: string
  children?: LogTypeItem[]
}

interface FilterLogTypeProps {
  value: any
  onChange: (value: any) => void
  multiple?: boolean
}

const FilterLogType = ({ value, onChange, multiple = true }: FilterLogTypeProps) => {
  const [data, setData] = useState<LogTypeItem[]>([])
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { language, settings } = getConfig()
  const logSaveRule = settings?.log?.logSaveRule || settings?.logSaveRule

  // 处理 logSaveRule 数据
  const processedResult = useMemo(() => {
    const filteredObj: Record<string, boolean> = {}

    for (const key in logSaveRule) {
      if (key.includes('_')) {
        filteredObj[key] = logSaveRule[key]
      }
    }

    const logtrue: Record<string, boolean> = {}
    for (const key in filteredObj) {
      if (filteredObj[key] === true) {
        logtrue[key] = true
      }
    }

    function groupBy(data: Record<string, boolean>, separator = '_') {
      const result: Record<string, { children: { title: string; value: string }[] }> = {}
      for (const key in data) {
        const [parent, child] = key.split(separator)
        if (!(parent in result)) {
          result[parent] = { children: [] }
        }
        const val = key.substring(key.indexOf(separator) + 1)
        result[parent].children.push({ title: child, value: val })
      }
      return result
    }

    const groupedData = groupBy(logtrue)

    return Object.entries(groupedData).map(([title, { children }]) => ({
      title: title === '数据分析Outer' ? '数据分析' : title,
      value: title,
      children
    }))
  }, [logSaveRule])

  useEffect(() => {
    const api = createAPI({ name: 'core/log/type' })
    api.fetch('', {})
      .then(({ json }) => {
        const _data = language === 'zh_Hans' || language === 'zh-CN' ? json?.data : json?.[language]?.data
        const logJson = cloneDeep(_data)

        const nochildren = logJson?.reduce((arr: LogTypeItem[], item: LogTypeItem) => {
          if (!item.children) {
            arr.push({ title: item.title, value: item.value })
          }
          return arr
        }, [])

        const filteredData = logSaveRule
          ? nochildren?.filter((item: LogTypeItem) => logSaveRule[item?.value] === true)
          : []
        const combinedData = filteredData?.concat(processedResult)

        logSaveRule?.checked && !isEmpty(processedResult)
          ? setData(combinedData)
          : setData(logJson || [])
      })
  }, [logSaveRule, processedResult])

  // 获取选中的值
  const selectedValues = useMemo(() => {
    if (!value) return []
    if (isString(value)) return [value]
    if (value.$in) return value.$in
    return []
  }, [value])

  // 获取所有叶子节点（可选项）
  const flatOptions = useMemo(() => {
    const flat: { title: string; value: string; parentTitle?: string }[] = []
    const flatten = (items: LogTypeItem[], parentTitle?: string) => {
      items?.forEach(item => {
        if (item.children && item.children.length > 0) {
          flatten(item.children, item.title)
        } else {
          flat.push({ title: item.title, value: item.value, parentTitle })
        }
      })
    }
    flatten(data)
    return flat
  }, [data])

  // 过滤选项
  const filteredOptions = useMemo(() => {
    if (!search) return flatOptions
    return flatOptions.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [flatOptions, search])

  // 按父级分组
  const groupedOptions = useMemo(() => {
    const groups: Record<string, typeof flatOptions> = {}
    filteredOptions.forEach(item => {
      const key = item.parentTitle || '其他'
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    })
    return groups
  }, [filteredOptions])

  const handleToggle = (itemValue: string) => {
    const newValues = selectedValues.includes(itemValue)
      ? selectedValues.filter((v: string) => v !== itemValue)
      : [...selectedValues, itemValue]

    onChange(newValues.length > 0 ? { $in: newValues } : {})
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
  }

  const getSelectedLabels = () => {
    return flatOptions
      .filter(item => selectedValues.includes(item.value))
      .map(item => item.title)
  }

  const selectedLabels = getSelectedLabels()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between min-w-43.75',
            selectedValues.length === 0 && 'text-muted-foreground'
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedLabels.length > 0 ? (
              selectedLabels.map((label, index) => {
                const val = selectedValues[index]
                return (
                  <Badge key={val} variant="secondary" className="text-xs pl-1 pr-1 py-0">
                    {label}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer opacity-70 hover:opacity-100"
                      onClick={e => {
                        e.stopPropagation()
                        handleToggle(val)
                      }}
                    />
                  </Badge>
                )
              })
            ) : (
              <span>搜索操作类型</span>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            {selectedValues.length > 0 ? (
              <div onClick={handleClear}>
                <X className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer" />
              </div>
            ) : (
              <ChevronDown className="h-4 w-4 opacity-50" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="搜索..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>暂无数据</CommandEmpty>
            {Object.entries(groupedOptions).map(([group, items]) => (
              <CommandGroup key={group} heading={group}>
                {items.map(item => {
                  const isSelected = selectedValues.includes(item.value)
                  return (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={() => handleToggle(item.value)}
                      className="cursor-pointer"
                    >
                      <span className="flex-1">{item.title}</span>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

FilterLogType.displayName = 'FilterLogType'

export { FilterLogType }
