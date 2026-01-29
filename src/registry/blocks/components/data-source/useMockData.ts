import { useState, useEffect, useRef, useCallback } from 'react'

export interface MockDataConfig {
  random?: boolean
  timer?: number
  script?: string
}

// 模拟数据 Hook
export function useMockData(config: MockDataConfig, onData: (data: any) => void) {
  const { random = false, timer = 5, script } = config
  const mockRef = useRef<any>(null)
  const [mockLoaded, setMockLoaded] = useState(false)

  // 动态加载 mockjs
  useEffect(() => {
    import('mockjs').then(module => {
      mockRef.current = module.mock
      setMockLoaded(true)
    }).catch(() => {
      console.warn('mockjs 未安装，使用基础模拟数据')
      setMockLoaded(true)
    })
  }, [])

  // 生成模拟数据
  const generateMockData = useCallback(() => {
    try {
      // 如果有自定义脚本，使用脚本生成数据
      if (script && mockRef.current) {
        const templateFn = new Function(`return ${script}`)()
        if (typeof templateFn === 'function') {
          return templateFn(mockRef.current)
        }
      }

      // 基础模拟数据（当 mockjs 不可用时）
      return {
        dimensions: [null, "A", "B"],
        source: [
          ["周一", Math.floor(Math.random() * 9000) + 6000, Math.floor(Math.random() * 900) + 600],
          ["周二", Math.floor(Math.random() * 9000) + 6000, Math.floor(Math.random() * 900) + 600],
          ["周三", Math.floor(Math.random() * 9000) + 6000, Math.floor(Math.random() * 900) + 600],
          ["周四", Math.floor(Math.random() * 9000) + 6000, Math.floor(Math.random() * 900) + 600],
          ["周五", Math.floor(Math.random() * 9000) + 6000, Math.floor(Math.random() * 900) + 600],
          ["周六", Math.floor(Math.random() * 9000) + 6000, Math.floor(Math.random() * 900) + 600],
          ["周日", Math.floor(Math.random() * 9000) + 6000, Math.floor(Math.random() * 900) + 600]
        ]
      }
    } catch (err) {
      console.warn('生成模拟数据失败:', err)
      return {
        dimensions: [null, "A", "B"],
        source: []
      }
    }
  }, [script, mockLoaded])

  // 定时更新
  useEffect(() => {
    if (!random) return

    const interval = setInterval(() => {
      const data = generateMockData()
      if (data) {
        onData({ data })
      }
    }, timer * 1000)

    return () => clearInterval(interval)
  }, [random, timer, generateMockData, onData])

  // 初始生成
  useEffect(() => {
    if (!mockLoaded) return

    const data = generateMockData()
    if (data) {
      onData({ data })
    }
  }, [mockLoaded, generateMockData, onData])

  return null
}
