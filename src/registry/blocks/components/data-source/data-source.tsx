'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useApiData, defaultApiConfig } from './useApiData'
import { useHistoryData, defaultHistoryConfig } from './useHistoryData'
import { cn } from '@/lib/utils'

export interface DataSourceProps {
  type?: 'api' | 'hybrid' | 'report' | 'interface' | 'history' | 'realtime' | 'table' | 'view' | 'message'
  config?: Record<string, any>
  onDataChange?: (data: any) => void
  onConfigChange?: (config: Record<string, any>) => void
  className?: string
}

// 为每种数据源类型定义默认配置
const defaultConfigs: Record<string, Record<string, any>> = {
  api: defaultApiConfig,
  history: defaultHistoryConfig,
  interface: { url: '', method: 'GET', headers: [], body: [], interval: 0 },
  hybrid: {},
  report: {},
  realtime: {},
  table: {},
  view: {},
  message: {}
}

export function DataSource({
  type = 'api',
  config: externalConfig = {},
  onDataChange,
  onConfigChange,
  className
}: DataSourceProps) {
  // 为每种数据源类型维护独立的 submit 状态
  const [submitStates, setSubmitStates] = useState<Record<string, string>>(() => {
    const initialSubmits: Record<string, string> = {}
    Object.keys(defaultConfigs).forEach(key => {
      initialSubmits[key] = Date.now().toString()
    })
    return initialSubmits
  })

  // 获取当前类型的 config（合并默认配置和外部配置）
  const currentConfig = useMemo(() => {
    return {
      ...(defaultConfigs[type] || {}),
      ...externalConfig
    }
  }, [type, externalConfig])

  // 获取当前类型的 submit
  const currentSubmit = submitStates[type] || Date.now().toString()

  // 当 type 变化时，通知父组件配置已更改
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(currentConfig)
    }
  }, [type, currentConfig, onConfigChange])

  // 处理数据变化
  const handleDataChange = useCallback((data: any) => {
    onDataChange?.(data)
  }, [onDataChange])

  // 手动刷新（只更新当前类型的 submit）
  const handleRefresh = useCallback(() => {
    setSubmitStates(prev => ({
      ...prev,
      [type]: Date.now().toString()
    }))
  }, [type])

  // 使用 API 数据（只对 'api' 类型启用）
  const { dataset: apiDataset, loading: apiLoading } = useApiData(
    type === 'api' ? { ...currentConfig, submit: currentSubmit } : ({} as any),
    handleDataChange
  )

  // 使用历史数据（只对 'history' 类型启用）
  const historyDataResult = useHistoryData(
    type === 'history' ? { ...currentConfig, submit: currentSubmit } : ({} as any)
  )

  // 根据类型选择数据源
  let currentDataset: any = null
  let currentLoading: boolean = false

  if (type === 'api') {
    currentDataset = apiDataset
    currentLoading = apiLoading
  } else if (type === 'history') {
    currentDataset = historyDataResult.dataset
    currentLoading = historyDataResult.loading
  }

  // 显示当前数据
  const renderDataPreview = () => {
    if (currentLoading) {
      return (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">加载中...</p>
        </div>
      )
    }

    if (!currentDataset) {
      return (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">等待数据...</p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
          {JSON.stringify(currentDataset, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-700">
          数据源: <span className="font-semibold text-blue-600">{type}</span>
        </h3>
        <button
          onClick={handleRefresh}
          disabled={currentLoading}
          className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentLoading ? '加载中...' : '刷新数据'}
        </button>
      </div>

      {/* 数据预览 */}
      <div className="bg-white rounded border border-slate-200 p-4">
        {renderDataPreview()}
      </div>
    </div>
  )
}
