'use client'

import { useRef, useMemo, type ReactNode } from 'react'
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
  onData?: (data: any) => void
  onConfigChange?: (config: Record<string, any>) => void
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
  onData,
  onConfigChange,
  children
}: InterfaceDataSourceProps) {
  const datasetSet = useDatasetSet(id)

  // 使用 ref 存储最新数据和参数
  const datasetRef = useRef<any>(null)
  const prevParamsRef = useRef<string>('')

  // 序列化查询参数用于比较
  const paramsKey = useMemo(() => {
    return JSON.stringify({ ds, op, params, predata, interval, submit })
  }, [ds, op, params, predata, interval, submit])

  // 处理数据变化
  const handleDataChange = useMemo(() => (data: any) => {
    onData?.(data)
  }, [onData])

  // 使用接口数据
  const { dataset, loading } = useInterfaceData(
    { ds, op, params, predata, interval, submit: submit || Date.now().toString() },
    handleDataChange
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
