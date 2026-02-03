'use client'

import { useMemo, useEffect, type ReactNode } from 'react'
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
  children?: ReactNode
}

export function RealtimeDataSource({
  id = 'realtime-data-source',
  tags = [],
  timeLine = { count: 5, unit: 'm' },
  xFormat = 'YYYY-MM-DD HH:mm:ss',
  submit,
  children
}: RealtimeDataSourceProps) {
  const datasetSet = useDatasetSet(id)

  // 使用实时数据
  const { dataset, loading, requestId } = useRealtimeData({
    tags,
    timeLine,
    xFormat,
    submit
  })

  // 数据变化时：更新 atom
  useEffect(() => {
    datasetSet({ data: dataset, loading })
  }, [requestId, loading, datasetSet])

  // 准备 context 数据
  const contextData = useMemo(() => {
    return [{
      data: dataset,
      loading
    }]
  }, [requestId, loading])

  return (
    <ContextProvider data={contextData}>
      {children}
    </ContextProvider>
  )
}
