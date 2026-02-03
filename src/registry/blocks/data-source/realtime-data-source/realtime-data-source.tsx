'use client'

import { useRef, useMemo, useCallback, type ReactNode } from 'react'
import { useDatasetSet } from '@airiot/client'
import { useRealtimeData } from './useRealtimeData'
import { ContextProvider } from '@/registry/blocks/containers/context-provider/context-provider'
import type { TagConfig, TimeLineConfig } from '../types'

export interface RealtimeDataSourceProps {
  id?: string
  tags?: TagConfig[]
  timeLine?: TimeLineConfig
  xFormat?: string
  interval?: number
  submit?: string
  onData?: (data: any) => void
  onConfigChange?: (config: Record<string, any>) => void
  children?: ReactNode
}

export function RealtimeDataSource({
  id = 'realtime-data-source',
  tags = [],
  timeLine = { count: 5, unit: 'm' },
  xFormat = 'YYYY-MM-DD HH:mm:ss',
  interval = 0,
  submit,
  onData,
  onConfigChange,
  children
}: RealtimeDataSourceProps) {
  const datasetSet = useDatasetSet(id)

  // 使用 ref 存储最新数据和参数
  const datasetRef = useRef<any>(null)
  const prevParamsRef = useRef<string>('')

  // 序列化查询参数用于比较
  const paramsKey = useMemo(() => {
    return JSON.stringify({ tags, timeLine, xFormat, submit })
  }, [tags, timeLine, xFormat, submit])

  // 使用实时数据
  const { dataset, loading } = useRealtimeData(
    { tags, timeLine, xFormat, submit: submit || Date.now().toString() }
  )

  // 只在参数变化或数据变化时更新
  useMemo(() => {
    // 检查参数是否变化
    if (prevParamsRef.current !== paramsKey) {
      prevParamsRef.current = paramsKey

      // 存储数据到 jotai atom
      if (dataset !== undefined) {
        datasetRef.current = dataset
        datasetSet(dataset)

        // 触发 onData 回调
        onData?.(dataset)
      }
    }
  }, [dataset, paramsKey, datasetSet, onData])

  // 准备 context 数据
  const contextData = useMemo(() => {
    if (loading) return undefined
    if (Array.isArray(datasetRef.current)) return datasetRef.current
    if (datasetRef.current) return [datasetRef.current]
    return undefined
  }, [loading])

  return (
    <ContextProvider data={contextData}>
      {children}
    </ContextProvider>
  )
}
