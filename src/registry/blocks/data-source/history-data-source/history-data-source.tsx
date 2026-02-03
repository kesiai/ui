'use client'

import { ReactNode, useEffect, useMemo } from 'react'
import { useDatasetSet } from '@airiot/client'
import { ContextProvider } from '@/registry/blocks/containers/context-provider/context-provider'
import { useHistoryData } from './useHistoryData'
import type { TimeRangeConfig, GroupConfig } from '../types'

export interface HistoryDataSourceProps {
  id?: string
  timeRange?: TimeRangeConfig
  group?: GroupConfig
  tags?: Array<any>
  columns?: Array<any>
  interval?: number
  xFormat?: string
  submit?: string
  children?: ReactNode
}

/**
 * 历史数据源组件 - 纯容器，不包含任何布局和样式
 * 内部集成 ContextProvider，子组件通过 useContextProvider 获取数据
 * 优化：只在查询参数变化时更新数据，避免大数据集的不必要比较
 */
export function HistoryDataSource({
  id = 'history-data-source',
  timeRange,
  group,
  tags = [],
  columns = [],
  interval = 0,
  xFormat = 'YYYY-MM-DD HH:mm:ss',
  submit,
  children
}: HistoryDataSourceProps) {
  // 使用历史数据
  const { dataset, loading, requestId } = useHistoryData({
    timeRange,
    group,
    tags,
    columns,
    interval,
    xFormat,
    submit
  })

  // 使用 useDatasetSet 将数据存储到 jotai atom
  const setDataset = useDatasetSet(id)

  // 只监听 requestId 和 loading，更新 jotai atom
  useEffect(() => {
    setDataset({ data: dataset, loading })
  }, [requestId, loading, setDataset])

  // 构造 ContextProvider 的 data
  const contextData = useMemo(() => {
    return [{ data: dataset, loading }]
  }, [requestId, loading])

  // 使用 ContextProvider 包裹子组件
  return (
    <ContextProvider data={contextData}>
      {children}
    </ContextProvider>
  )
}
