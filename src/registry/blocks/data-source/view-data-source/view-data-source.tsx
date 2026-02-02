'use client'

import { useState, useCallback } from 'react'
import { useViewData } from './useViewData'
import { cn } from '@/lib/utils'

export interface ViewDataSourceProps {
  view?: {
    id?: string
    name?: string
    config?: any
    datasetId?: string
    style?: any
  }
  dimension?: Array<{ id?: string; name?: string }>
  measure?: Array<any>
  interval?: number
  onDataChange?: (data: any) => void
  onConfigChange?: (config: Record<string, any>) => void
  className?: string
}

export function ViewDataSource({
  view = {},
  dimension = [],
  measure = [],
  interval = 0,
  onDataChange,
  onConfigChange,
  className
}: ViewDataSourceProps) {
  const [submit, setSubmit] = useState(Date.now().toString())

  // 手动刷新
  const handleRefresh = useCallback(() => {
    setSubmit(Date.now().toString())
  }, [])

  // 处理数据变化
  const handleDataChange = useCallback((data: any) => {
    onDataChange?.(data)
  }, [onDataChange])

  // 使用视图数据
  const { dataset, loading } = useViewData(
    { view, dimension, measure, interval, submit },
    handleDataChange
  )

  // 显示当前数据
  const renderDataPreview = () => {
    if (loading) {
      return (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">加载中...</p>
        </div>
      )
    }

    if (!dataset) {
      return (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">等待数据...</p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
          {JSON.stringify(dataset, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-700">
          视图数据源
        </h3>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '加载中...' : '刷新数据'}
        </button>
      </div>

      {/* 数据预览 */}
      <div className="bg-white rounded border border-slate-200 p-4">
        {renderDataPreview()}
      </div>
    </div>
  )
}
