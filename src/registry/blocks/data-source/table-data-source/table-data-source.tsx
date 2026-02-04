'use client'

import { useMemo, useEffect, type ReactNode } from 'react'
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
  children
}: TableDataSourceProps) {
  const datasetSet = useDatasetSet(id)

  // 使用表数据
  const { dataset, loading, requestId } = useTableData({
    selectType,
    table,
    initFilter,
    isGroup,
    showInnerField,
    statsBySingle,
    feildFormat,
    queryFields,
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
