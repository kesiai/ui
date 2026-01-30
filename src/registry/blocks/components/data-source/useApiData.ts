import { useState, useEffect, useRef, useCallback } from 'react'

export interface ApiDataConfig {
  url?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Array<{ name: string; value: string }>
  body?: Array<{ name: string; value: string }>
  predata?: boolean
  interval?: number
  table?: any
  appkey?: string
  appsecret?: string
  submit?: string
}

// 默认配置（包含示例数据用于调试）
export const defaultApiConfig: ApiDataConfig = {
  url: 'core/t/{table}/d',
  method: 'GET',
  headers: [],
  body: [],
  predata: false,
  interval: 0,
  table: {
    id: '子',
    title: '子表'
  },
  appkey: undefined,
  appsecret: undefined,
  submit: ''
}

// 对象转 URL 参数
function objToUrlParams(obj: Record<string, any>, url: string): string {
  try {
    if (!url || typeof url !== 'string') {
      return ''
    }
    let params = ''
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (Array.isArray(obj[key])) {
          let arrayParams = ''
          for (let i = 0; i < obj[key].length; i++) {
            arrayParams += `${key}=${obj[key][i].toString()}&`
          }
          params += arrayParams.slice(0, -1) // remove last "&"
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          const nestedParams = objToUrlParams(obj[key], url)
          params += `${key}=${nestedParams}&`
        } else {
          params += `${key}=${obj[key].toString()}&`
        }
      }
    }
    params = params.slice(0, -1) // remove last "&"
    const separator = url.includes('?') ? '&' : '?'
    return url + separator + params
  } catch {
    return ''
  }
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

// 检查是否是 HTTP(S) URL
function checkHttp(url: string): boolean {
  if (!url) return false
  const regex = /^(https?:\/\/)/i
  return regex.test(url)
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

// API 数据 Hook
export function useApiData(config: ApiDataConfig, onData: (data: any) => void) {
  const {
    url = '',
    method = 'GET',
    headers = [],
    body = [],
    predata = false,
    interval = 0,
    table,
    appkey,
    appsecret,
    submit = ''
  } = config

  const [dataset, setDataset] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const queryCallback = useRef<(() => void) | null>(null)

  // 过滤数据
  const filterData = useCallback((data: any) => {
    if (predata) {
      return filterResult(data)
    }
    return data
  }, [predata])

  // 获取数据
  const fetchData = useCallback(async () => {
    if (!url) {
      console.warn('URL 为空，无法获取数据')
      return
    }

    setLoading(true)

    try {
      let responseData: any

      if (checkHttp(url)) {
        // HTTP 请求
        const requestOptions: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...arrayToKv(headers)
          }
        }

        if (method !== 'GET' && body.length > 0) {
          requestOptions.body = JSON.stringify(arrayToKv(body))
        }

        const requestUrl = method === 'GET' && body.length > 0
          ? objToUrlParams(arrayToKv(body), url)
          : url

        const response = await fetch(requestUrl, requestOptions)
        responseData = await response.json()
      } else {
        // 内部 API 调用 (使用 @airiot/client)
        const { api } = await import('@airiot/client')

        // 构建路径
        let path = url
        if (table?.id) {
          path = url.replace('{table}', table.id)
        } else if (appkey || appsecret) {
          path = url
            .replace('{appkey}', appkey || '')
            .replace('{appsecret}', appsecret || '')
        }

        // 添加查询参数（GET 请求）
        if (method === 'GET' && body.length > 0) {
          path = objToUrlParams(arrayToKv(body), path)
        }

        // 使用 @airiot/client 的 API
        const bodyStr = method !== 'GET' && body.length > 0 ? JSON.stringify(arrayToKv(body)) : undefined

        // 调试：检查用户信息
        try {
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            console.log('🔍 用户信息:', parsedUser)
            console.log('🔍 Token 位置:', {
              token: parsedUser.token,
              accessToken: parsedUser.accessToken,
              authorization: parsedUser.authorization
            })
          }
        } catch (e) {
          console.warn('读取用户信息失败:', e)
        }

        const apiRet = api({
          name: path,
        })

        const response = await apiRet.fetch('', {
          method,
          headers: arrayToKv(headers),
          body: bodyStr,
        })

        responseData = response.json
      }

      // 处理数据
      const processedData = filterData(responseData)
      setDataset(processedData)
      onData?.(processedData)
    } catch (error) {
      console.error('获取数据失败:', error)
      setDataset(null)
    } finally {
      setLoading(false)
    }
  }, [url, method, headers, body, predata, table, appkey, appsecret, filterData, onData])

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
