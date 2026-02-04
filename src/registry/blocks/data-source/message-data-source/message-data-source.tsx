'use client'

import { ReactNode, useEffect, useMemo } from 'react'
import { useDatasetSet } from '@airiot/client'
import { ContextProvider } from '@/registry/blocks/containers/context-provider/context-provider'
import { useMessageData } from './useMessageData'

export interface MessageDataSourceProps {
  id?: string
  initFilter?: Record<string, any>
  isGroup?: boolean
  group?: Array<{
    field?: string
    dateOperator?: '天' | '周' | '月' | '年' | '一小时内的分钟数' | '一天内的小时数' | '一周内的天数' | '一月内的天数' | '一年内的天数' | '一年内的星期数' | '一年内的月数'
  }>
  columns?: Array<{
    name?: string
    field?: string
    accumulator?: '$count' | '$avg' | '$first' | '$last' | '$max' | '$min' | '$sum'
    expression?: any
  }>
  fieldOrder?: Array<{ value: string; order?: 'ASC' | 'DESC' }>
  limit?: number
  interval?: number
  feildFormat?: Array<{ field: string; format: string }>
  submit?: string
  children?: ReactNode
}

/**
 * 消息数据源组件 - 纯容器，不包含任何布局和样式
 * 内部集成 ContextProvider，子组件通过 useContextProvider 获取数据
 * 优化：只在查询参数变化时更新数据，避免大数据集的不必要比较
 */
export function MessageDataSource({
  id = 'message-data-source',
  initFilter = {},
  isGroup = false,
  group = [],
  columns = [],
  fieldOrder = [],
  limit = 3,
  interval = 0,
  feildFormat = [],
  submit,
  children
}: MessageDataSourceProps) {
  // 使用消息数据
  const { dataset, loading, requestId } = useMessageData({
    initFilter,
    isGroup,
    group,
    columns,
    fieldOrder,
    limit,
    interval,
    feildFormat,
    submit
  })

  const setDataset = useDatasetSet(id)

  useEffect(() => {
    setDataset({ data: dataset, loading })
  }, [requestId, loading, setDataset])

  const contextData = useMemo(() => {
    return [{ data: dataset, loading }]
  }, [requestId, loading])

  return (
    <ContextProvider data={contextData}>
      {children}
    </ContextProvider>
  )
}

