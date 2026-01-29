'use client'

import { useState, useCallback } from 'react'
import { useApiData } from './useApiData'
import { cn } from '@/lib/utils'

export interface DataSourceProps {
  type?: 'api' | 'hybrid' | 'report' | 'interface' | 'history' | 'realtime' | 'table' | 'view' | 'message'
  config?: Record<string, any>
  onDataChange?: (data: any) => void
  className?: string
}

const dataSourceTypes = [
  { value: 'api', label: '平台接口' },
  { value: 'hybrid', label: '混合数据' },
  { value: 'report', label: '报表数据' },
  { value: 'interface', label: '数据接口' },
  { value: 'history', label: '历史数据' },
  { value: 'realtime', label: '实时数据' },
  { value: 'table', label: '表数据' },
  { value: 'view', label: '视图数据' },
  { value: 'message', label: '消息数据' }
]

export function DataSource({
  type = 'api',
  config = {},
  onDataChange,
  className
}: DataSourceProps) {
  const [selectedType, setSelectedType] = useState(type)

  // 处理数据变化
  const handleDataChange = useCallback((data: any) => {
    onDataChange?.(data)
  }, [onDataChange])

  // 使用 API 数据（只对 'api' 类型启用）
  const { dataset, loading } = useApiData(
    selectedType === 'api' ? config : (config as any),
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
        <p className="text-xs font-medium text-slate-600">数据预览:</p>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
          {JSON.stringify(dataset, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <div className={cn('w-full p-4 bg-slate-50 rounded-lg border border-slate-200', className)}>
      <div className="space-y-4">
        {/* 类型选择 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            数据源类型
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            {dataSourceTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* 配置信息 */}
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-600">
            当前选择: <span className="font-medium text-blue-600">{dataSourceTypes.find(t => t.value === selectedType)?.label}</span>
          </p>

          {/* 平台接口配置显示 */}
          {selectedType === 'api' && config && (
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">接口地址:</span>
                <span className="font-medium text-slate-800">{config.url || '未设置'}</span>
              </div>
              {config.interval > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">轮询:</span>
                  <span className="font-medium text-green-600">{config.interval}秒</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 数据预览 */}
        {(selectedType === 'api' || selectedType === 'interface') && (
          <div className="bg-white rounded border border-slate-200 p-4">
            {renderDataPreview()}
          </div>
        )}

        {/* 提示信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-xs text-blue-800">
            💡 提示: 配置数据源后，数据将通过 onDataChange 回调传递给父组件
          </p>
        </div>
      </div>
    </div>
  )
}
