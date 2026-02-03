import { useState, useEffect, useRef, useCallback } from 'react'

export interface ViewDataConfig {
  view?: {
    id?: string
    name?: string
    config?: any
    datasetId?: string
    style?: any
  }
  dimension?: Array<any>
  measure?: Array<any>
  interval?: number
  submit?: string
}

// 默认配置
export const defaultViewConfig: ViewDataConfig = {
  view: {},
  dimension: [],
  measure: [],
  interval: 0,
  submit: ''
}

// 数组转键值对
function arrayToKv(arr: Array<{ name: string; value: any }>): Record<string, any> {
  const kv: Record<string, any> = {}
  if (arr?.length) {
    arr.forEach(item => {
      if (item && !isEmpty(item)) {
        kv[item.name] = item.value
      }
    })
  }
  return kv
}

function isEmpty(obj: any): boolean {
  if (obj == null) return true
  if (Array.isArray(obj)) return obj.length === 0
  if (typeof obj === 'object') return Object.keys(obj).length === 0
  return false
}

// 过滤结果为图表格式
function filterResult(json: any): { dimensions: any[]; source: any[] } {
  let _json = json
  let dimensions: any[] = []
  let source: any[] = []

  try {
    if (typeof _json === 'object' && !Array.isArray(_json)) {
      _json = [_json]
    } else if (!Array.isArray(_json)) {
      _json = [{ result: _json }]
    }

    _json.forEach((item: any) => {
      const keys = Object.keys(item)
      dimensions = [...new Set([...dimensions, ...keys])]
    })

    _json.forEach((item: any) => {
      const values: any[] = []
      dimensions.forEach(key => {
        values.push(item[key])
      })
      source.push(values)
    })
  } catch (err) {
    console.warn('过滤数据失败:', err)
  }

  return { dimensions, source }
}

// 视图数据 Hook
export function useViewData(config: ViewDataConfig, onData: (data: any) => void) {
  const {
    view = {},
    dimension = [],
    measure = [],
    interval = 0,
    submit = ''
  } = config

  const viewId = view?.id || ''
  const [dataset, setDataset] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const queryCallback = useRef<(() => void) | null>(null)

  // 获取数据
  const fetchData = useCallback(async () => {
    if (!viewId) {
      console.warn('视图ID为空，无法获取数据')
      return
    }

    setLoading(true)

    try {
      // 使用 @airiot/client 的 API
      const { api } = await import('@airiot/client')

      // 构建查询路径
      const path = `ds/view/preview`

      // 构建 fields - 从 measure 数组映射
      const fields = measure.map((m: any) => ({
        group: m.group,
        isDefaultMeasure: m.isDefaultMeasure,
        isMeasure: m.isMeasure,
        name: m.name || m.id,
        onlyCount: m.onlyCount,
        alias: m.alias,
        option: m.group ? {
          aggregator: m.group
        } : undefined
      }))

      // 构建 config 对象
      const config = {
        noGroupBy: view.config?.noGroupBy ?? false,
        fields,
        where: view.config?.where || [],
        group: dimension.map((d: any) => d.name || d.id),
        groupAlias: dimension.map((d: any) => d.alias || ''),
        echartType: view.config?.echartType || 'line',
        stack: view.config?.stack || null
      }

      // 构建完整的请求体
      const requestBody = {
        config,
        datasetId: view.datasetId,
        name: view.name,
        style: view.style
      }

      // 构建查询字符串
      const params = new URLSearchParams({ id: viewId, mode: 'live' })
      const fullPath = `${path}?${params.toString()}`

      // 调用 API
      const apiRet = api({
        name: fullPath,
      })

      const response = await apiRet.fetch('', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const responseData = response.json

      // 处理数据 - 转换为图表格式
      const processedData = filterResult(responseData)
      setDataset(processedData)
      onData?.(processedData)
    } catch (error) {
      console.error('获取视图数据失败:', error)
      setDataset(null)
    } finally {
      setLoading(false)
    }
  }, [viewId, view, dimension, measure, onData])

  // 保存到 ref
  queryCallback.current = fetchData

  // submit 变化时手动触发
  const prevSubmitRef = useRef<string>()

  useEffect(() => {
    if (submit && submit !== prevSubmitRef.current) {
      prevSubmitRef.current = submit
      queryCallback.current?.()
    }
  }, [submit])

  // 自动轮询
  useEffect(() => {
    if (!interval || interval <= 0) return

    const tick = () => {
      queryCallback.current?.()
    }

    const id = setInterval(tick, interval * 1000)
    return () => clearInterval(id)
  }, [interval])

  return { dataset, loading, fetchData }
}
