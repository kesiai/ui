'use client'

import { useMemo, useEffect, useState, useCallback, useRef, type ReactNode } from 'react'
import _ from 'lodash'
import { api } from '@airiot/client'
import { useDatasetSet } from '@airiot/client'
import { ContextProvider } from '@/registry/blocks/containers/context-provider/context-provider'

/**
 * 接口数据源配置
 */
export interface InterfaceDataConfig {
  op?: { key?: string }
  params?: { value?: Record<string, any> }
  predata?: boolean
  interval?: number
  submit?: string
}

export interface InterfaceDataSourceProps {
  id?: string
  op?: { key?: string }
  params?: { value?: Record<string, any> }
  predata?: boolean
  interval?: number
  submit?: string
  children?: ReactNode
}

// 默认配置
export const defaultInterfaceConfig: InterfaceDataConfig = {
  op: { key: 'device_max_values_Yglzib' },
  params: { value: {} },
  predata: false,
  interval: 0
}

/**
 * 过滤结果为图表格式
 */
const filterResult = (json: any): { dimensions: string[]; source: any[][] } => {
  let _json = json
  let dimensions: string[] = []
  let source: any[][] = []

  if (_.isPlainObject(_json)) {
    _json = [_json]
  } else if (!_.isArray(_json)) {
    _json = [{ result: _json }]
  }

  // 提取所有维度
  _json.forEach((item: any) => {
    const keys = _.keys(item)
    dimensions = _.union(dimensions, keys)
  })

  // 构建数据源
  _json.forEach((item: any) => {
    const values: any[] = []
    dimensions.forEach(key => {
      values.push(_.isArray(item[key]) ? JSON.stringify(item[key]) : item[key])
    })
    source.push(values)
  })

  return { dimensions, source }
}

/**
 * 接口数据源 Hook
 */
function useInterfaceData(config: InterfaceDataConfig) {
  const {
    op = { key: 'device_max_values_Yglzib' },
    params = { value: {} },
    predata = false,
    interval = 0,
    submit = '',
  } = config

  const [dataset, setDataset] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [requestId, setRequestId] = useState<string | null>(null)

  const queryCallback = useRef<(() => void) | null>(null)
  const submitRef = useRef<string>('')

  // 过滤和转换数据
  const filterData = useCallback((data: any): any => {
    try {
      let result = data

      // 预处理数据
      if (predata) {
        result = filterResult(data)
      }

      return result
    } catch (error) {
      console.error('数据过滤失败:', error)
      return data
    }
  }, [predata])

  // 获取数据
  const fetchData = useCallback(async () => {
    const url = op?.key ? `ds/p/${op.key}` : null

    if (!url) {
      console.warn('接口key为空，无法获取数据')
      return
    }

    setLoading(true)

    try {
      const { json } = await api({ name: url }).fetch('', {
        method: 'POST',
        body: JSON.stringify(params?.value || {})
      })

      const filteredData = filterData(json)
      setDataset(filteredData)
      setRequestId(`${Date.now()}-${Math.random().toString(36).substring(2, 11)}`)
    } catch (error) {
      console.error('获取接口数据失败:', error)
      setDataset(null)
      setRequestId(`${Date.now()}-${Math.random().toString(36).substring(2, 11)}`)
    } finally {
      setLoading(false)
    }
  }, [op?.key, params, filterData])

  // 保存到 ref
  queryCallback.current = fetchData

  // submit 变化时手动触发
  useEffect(() => {
    if (submit && submit !== submitRef.current) {
      submitRef.current = submit
      queryCallback.current?.()
    }
  }, [submit])

  // 初始加载
  useEffect(() => {
    queryCallback.current?.()
  }, [])

  // 自动轮询
  useEffect(() => {
    if (!interval || interval <= 0) {
      return
    }

    const tick = () => {
      queryCallback.current?.()
    }

    const id = setInterval(tick, interval * 1000)
    return () => clearInterval(id)
  }, [interval])

  return {
    dataset,
    loading,
    fetchData,
    requestId
  }
}

export function InterfaceDataSource({
  id = 'interface-data-source',
  op = { key: 'device_max_values_Yglzib' },
  params = { value: {} },
  predata = false,
  interval = 0,
  submit,
  children
}: InterfaceDataSourceProps) {
  const datasetSet = useDatasetSet(id)

  // 使用接口数据
  const { dataset, loading, requestId } = useInterfaceData({
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
