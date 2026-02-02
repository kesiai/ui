import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useModel, useModelList, useModelQuery } from '@airiot/client'
import { Search, X, Filter } from 'lucide-react'

interface ViewFilterProps {
  modelId?: string
  fields?: Array<{
    key: string
    label: string
    type?: 'text' | 'number' | 'select' | 'date'
    options?: Array<{ label: string; value: any }>
  }>
  inline?: boolean
  collapsible?: boolean
  className?: string
}

interface FilterValue {
  [key: string]: any
}

const ViewFilter: React.FC<ViewFilterProps> = ({
  modelId,
  fields = [],
  inline = false,
  collapsible = false,
  className = ''
}) => {
  const { filters, setFilters, doFilter } = useModelQuery()
  const [collapsed, setCollapsed] = useState(false)
  const [localFilters, setLocalFilters] = useState<FilterValue>({})

  // 处理筛选条件变化
  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // 清除单个筛选条件
  const handleClearFilter = (key: string) => {
    setLocalFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[key]
      return newFilters
    })
  }

  // 应用筛选
  const handleApplyFilter = () => {
    setFilters(localFilters)
    doFilter()
  }

  // 重置所有筛选
  const handleResetFilter = () => {
    setLocalFilters({})
    setFilters({})
    doFilter()
  }

  // 是否有激活的筛选条件
  const hasActiveFilters = Object.keys(localFilters).length > 0

  if (collapsed) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCollapsed(false)}
        >
          <Filter className="h-4 w-4 mr-2" />
          筛选
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
              {Object.keys(localFilters).length}
            </span>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-900">筛选条件</h3>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
              {Object.keys(localFilters).length}
            </span>
          )}
        </div>
        {collapsible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(true)}
          >
            收起
          </Button>
        )}
      </div>

      <div className={`${inline ? 'flex flex-wrap gap-4 items-end' : 'space-y-4'}`}>
        {fields.map((field) => (
          <div key={field.key} className={`${inline ? 'flex-1 min-w-[200px]' : ''}`}>
            <Label htmlFor={`filter-${field.key}`} className="text-sm text-slate-700">
              {field.label}
            </Label>
            {field.type === 'select' && field.options ? (
              <select
                id={`filter-${field.key}`}
                value={localFilters[field.key] || ''}
                onChange={(e) => handleFilterChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">全部</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'date' ? (
              <Input
                id={`filter-${field.key}`}
                type="date"
                value={localFilters[field.key] || ''}
                onChange={(e) => handleFilterChange(field.key, e.target.value)}
                className="w-full"
              />
            ) : (
              <Input
                id={`filter-${field.key}`}
                type={field.type === 'number' ? 'number' : 'text'}
                value={localFilters[field.key] || ''}
                onChange={(e) => handleFilterChange(field.key, e.target.value)}
                placeholder={`请输入${field.label}`}
                className="w-full"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={handleApplyFilter}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          查询
        </Button>
        <Button
          variant="outline"
          onClick={handleResetFilter}
          disabled={!hasActiveFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          重置
        </Button>
      </div>

      {/* 激活的筛选标签 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
          {Object.entries(localFilters).map(([key, value]) => (
            <div
              key={key}
              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-sm"
            >
              <span className="text-slate-700">
                {fields.find(f => f.key === key)?.label || key}: {value}
              </span>
              <button
                onClick={() => handleClearFilter(key)}
                className="ml-1 text-slate-500 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewFilter
