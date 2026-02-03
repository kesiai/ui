'use client'

import { ReactNode, useEffect, useMemo, useRef } from 'react'
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
  onData?: (data: any[]) => void
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
  onData,
  children
}: MessageDataSourceProps) {
  // 使用消息数据
  const { dataset, loading } = useMessageData(
    { initFilter, isGroup, group, columns, fieldOrder, limit, interval, feildFormat, submit: submit || '' }
  )

  // 使用 useDatasetSet 将数据存储到 jotai atom
  const setDataset = useDatasetSet(id)

  // 缓存上一次的查询参数字符串和最新的数据
  const prevParamsRef = useRef<string>('')
  const datasetRef = useRef<any[]>([])

  // 保持 datasetRef 为最新值
  useEffect(() => {
    datasetRef.current = dataset
  }, [dataset])

  // 将查询参数序列化为字符串，用于比较是否发生变化
  const paramsString = useMemo(() => {
    return JSON.stringify({
      initFilter,
      isGroup,
      group,
      columns,
      fieldOrder,
      limit,
      feildFormat,
      submit
    })
  }, [initFilter, isGroup, group, columns, fieldOrder, limit, feildFormat, submit])

  // 将数据存储到 atom，并触发 onData 回调
  useEffect(() => {
    // 只有当查询参数变化且数据加载完成时才更新
    if (!loading && paramsString !== prevParamsRef.current) {
      prevParamsRef.current = paramsString
      setDataset(datasetRef.current)
      if (onData) {
        onData(datasetRef.current)
      }
    }
  }, [loading, paramsString, setDataset, onData])

  // 构造 ContextProvider 的 data
  const contextData = useMemo(() => {
    return loading ? [] : dataset
  }, [loading, paramsString])

  // 使用 ContextProvider 包裹子组件
  return (
    <ContextProvider data={contextData}>
      {children}
    </ContextProvider>
  )
}

