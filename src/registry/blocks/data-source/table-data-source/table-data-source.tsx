'use client'

import { useRef, useMemo, type ReactNode } from 'react'
import { useDatasetSet } from '@airiot/client'
import { useTableData } from './useTableData'
import { ContextProvider } from '@/registry/blocks/containers/context-provider/context-provider'

export interface TableDataSourceProps {
  id?: string
  selectType?: 'table' | 'dataset'
  table?: any
  initFilter?: Record<string, any>
  isGroup?: boolean
  showInnerField?: boolean
  statsBySingle?: any
  feildFormat?: Array<any>
  queryFields?: string[]
  interval?: number
  submit?: string
  onData?: (data: any) => void
  onConfigChange?: (config: Record<string, any>) => void
  children?: ReactNode
}

export function TableDataSource({
  id = 'table-data-source',
  selectType = 'table',
  table,
  initFilter,
  isGroup = false,
  showInnerField = false,
  statsBySingle,
  feildFormat,
  queryFields,
  interval = 0,
  submit,
  onData,
  onConfigChange,
  children
}: TableDataSourceProps) {
  const datasetSet = useDatasetSet(id)

  // 使用 ref 存储最新数据和参数
  const datasetRef = useRef<any>(null)
  const prevParamsRef = useRef<string>('')

  // 序列化查询参数用于比较
  const paramsKey = useMemo(() => {
    return JSON.stringify({ selectType, table, initFilter, isGroup, showInnerField, statsBySingle, feildFormat, queryFields, interval, submit })
  }, [selectType, table, initFilter, isGroup, showInnerField, statsBySingle, feildFormat, queryFields, interval, submit])

  // 使用表数据
  const { dataset, loading } = useTableData(
    { selectType, table, initFilter, isGroup, showInnerField, statsBySingle, feildFormat, queryFields, interval, submit: submit || Date.now().toString() }
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
