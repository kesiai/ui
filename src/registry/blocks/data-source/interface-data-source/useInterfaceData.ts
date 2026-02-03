import { useState, useEffect, useCallback, useRef } from 'react'
import _ from 'lodash'
import { api } from '@airiot/client'

/**
 * 接口数据源配置
 */
export interface InterfaceDataConfig {
  ds?: string
  op?: { id?: string; key?: string; name?: string }
  params?: { value?: Record<string, any> }
  predata?: boolean
  interval?: number
  submit?: string
}

// 默认配置
export const defaultInterfaceConfig: InterfaceDataConfig = {
  ds: 'ai',
  op: { id: '67da8683f9f8102e30cf0b3b', key: 'device_max_values_Yglzib' },
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
export function useInterfaceData(config: InterfaceDataConfig, onData?: (data: any) => void) {
  const {
    ds = 'ai',
    op = { id: '67da8683f9f8102e30cf0b3b', key: 'device_max_values_Yglzib' },
    params = { value: {} },
    predata = false,
    interval = 0,
    submit = ''
  } = config

  const [dataset, setDataset] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const queryCallback = useRef<(() => void) | null>(null)
  const submitRef = useRef<string>()

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
      onData?.(filteredData)
    } catch (error) {
      console.error('获取接口数据失败:', error)
      setDataset(null)
    } finally {
      setLoading(false)
    }
  }, [op?.key, params, filterData, onData])

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
    fetchData
  }
}
