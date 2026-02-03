'use client'

import { ReactNode, useEffect, useMemo, useRef } from 'react'
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
  onData?: (data: any) => void
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
  onData,
  children
}: ApiDataSourceProps) {
  // 使用 API 数据
  const { dataset, loading } = useApiData(
    { url, method, headers, body, predata, table, appkey, appsecret, interval, submit: submit || '' },
    () => {} // onData callback handled in useEffect
  )

  // 使用 useDatasetSet 将数据存储到 jotai atom
  const setDataset = useDatasetSet(id)

  // 缓存上一次的查询参数字符串和最新的数据
  const prevParamsRef = useRef<string>('')
  const datasetRef = useRef<any>(null)

  // 保持 datasetRef 为最新值
  useEffect(() => {
    datasetRef.current = dataset
  }, [dataset])

  // 将查询参数序列化为字符串，用于比较是否发生变化
  const paramsString = useMemo(() => {
    return JSON.stringify({
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
  }, [url, method, headers, body, predata, table, appkey, appsecret, interval, submit])

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
    return loading ? null : dataset
  }, [loading, paramsString])

  // 使用 ContextProvider 包裹子组件
  return (
    <ContextProvider data={contextData}>
      {children}
    </ContextProvider>
  )
}
