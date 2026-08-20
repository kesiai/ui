import type { ViewStateSnapshot, ViewStateStorage } from './types'

interface LocalViewStorageOptions {
  /** 存储命名空间前缀，默认 'kesi.view-state' */
  prefix?: string
  /** 过期时间（ms），按快照 savedAt 判断，过期即清除 */
  ttl?: number
}

/**
 * 浏览器 localStorage 适配器（channel='local' 的默认实现）
 * 读失败/版本不符/过期一律返回 null，调用方回退到默认值
 */
export const createLocalViewStorage = (options: LocalViewStorageOptions = {}): ViewStateStorage => {
  const { prefix = 'kesi.view-state', ttl } = options

  const fullKey = (key: string) => `${prefix}.${key}`

  return {
    load: async (key) => {
      try {
        const raw = localStorage.getItem(fullKey(key))
        if (!raw) return null
        const snapshot: ViewStateSnapshot = JSON.parse(raw)
        if (!snapshot || snapshot.version !== 1) return null
        if (ttl && snapshot.savedAt && Date.now() - snapshot.savedAt > ttl) {
          localStorage.removeItem(fullKey(key))
          return null
        }
        return snapshot
      } catch {
        return null
      }
    },
    save: async (key, state) => {
      try {
        localStorage.setItem(fullKey(key), JSON.stringify(state))
      } catch {
        // 写入失败（隐私模式/超限）静默丢弃，不影响交互
      }
    },
    clear: async (key) => {
      try {
        localStorage.removeItem(fullKey(key))
      } catch {
        // 同上
      }
    }
  }
}
