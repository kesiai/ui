'use client'

import { ReactNode, useEffect, useMemo } from 'react'
import { useDatasetSet } from '@airiot/client'
import { ContextProvider } from '@/registry/blocks/containers/context-provider/context-provider'
import { useApiData } from './useApiData'

export interface ApiDataSourceProps {
  id?: string
  url?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Array<{ name: string; value: string }>
  body?: Array<{ name: string; value: string }>
  predata?: boolean
  table?: any
  appkey?: string
  appsecret?: string
  interval?: number
  submit?: string
  children?: ReactNode
}

/**
 * API 数据源组件 - 纯容器，不包含任何布局和样式
 * 内部集成 ContextProvider，子组件通过 useContextProvider 获取数据
 * 优化：只在查询参数变化时更新数据，避免大数据集的不必要比较
 */
export function ApiDataSource({
  id = 'api-data-source',
  url = '',
  method = 'GET',
  headers = [],
  body = [],
  predata = false,
  table,
  appkey,
  appsecret,
  interval = 0,
  submit,
  children
}: ApiDataSourceProps) {
  // 使用 API 数据
  const { dataset, loading, requestId } = useApiData({
    url,
    method,
    headers,
    body,
    predata,
    table,
    appkey,
    appsecret,
    interval,
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
