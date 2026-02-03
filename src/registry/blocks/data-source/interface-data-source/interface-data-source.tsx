'use client'

import { useMemo, useEffect, type ReactNode } from 'react'
import { useDatasetSet } from '@airiot/client'
import { useInterfaceData } from './useInterfaceData'
import { ContextProvider } from '@/registry/blocks/containers/context-provider/context-provider'

export interface InterfaceDataSourceProps {
  id?: string
  ds?: string
  op?: { id?: string; key?: string; name?: string }
  params?: { value?: Record<string, any> }
  predata?: boolean
  interval?: number
  submit?: string
  children?: ReactNode
}

export function InterfaceDataSource({
  id = 'interface-data-source',
  ds = 'ai',
  op = { id: '67da8683f9f8102e30cf0b3b', key: 'device_max_values_Yglzib' },
  params = { value: {} },
  predata = false,
  interval = 0,
  submit,
  children
}: InterfaceDataSourceProps) {
  const datasetSet = useDatasetSet(id)

  // 使用接口数据
  const { dataset, loading, requestId } = useInterfaceData({
    ds,
    op,
    params,
    predata,
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
