'use client'

import { useMemo, useEffect, type ReactNode } from 'react'
import { useDatasetSet } from '@airiot/client'
import { useViewData } from './useViewData'
import { ContextProvider } from '@/registry/blocks/containers/context-provider/context-provider'

export interface ViewDataSourceProps {
  id?: string
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
  submit?: string
  children?: ReactNode
}

export function ViewDataSource({
  id = 'view-data-source',
  view = {},
  dimension = [],
  measure = [],
  interval = 0,
  submit,
  children
}: ViewDataSourceProps) {
  const datasetSet = useDatasetSet(id)

  // 使用视图数据
  const { dataset, loading, requestId } = useViewData({
    view,
    dimension,
    measure,
    interval,
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
