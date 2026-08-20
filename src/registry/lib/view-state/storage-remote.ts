import { createAPI, getConfig } from '@kesi/client'
import type { RemoteViewStorageOptions, ViewStateSnapshot, ViewStateStorage } from './types'

const defaultGetUser = (): string => {
  const user = getConfig().user
  return user?.id || user?.user?.id || 'anonymous'
}

/**
 * 数据库适配器（channel='remote'），两种模式：
 *
 * 1. 自定义回调模式（推荐）：传 loader/saver，宿主决定存哪
 *    createRemoteViewStorage({
 *      loader: async (key) => myApi.load(key),
 *      saver: async (key, state) => myApi.save(key, state),
 *    })
 *
 * 2. KESI 配置表模式：传 tableId，适配器用 @kesi/client 自动读写。
 *    期望表记录结构：{ id, user, viewKey, state: JSON字符串 }
 *    表由 kesi-cli 建表阶段规划（如 user_view_config 模板）或宿主指定。
 *
 * 单存储源语义：load 读它、save 覆盖它（后写胜）。
 * 读失败/超时由 ViewModel 的 restoreTimeout 兜底降级到默认值。
 */
export const createRemoteViewStorage = (options: RemoteViewStorageOptions = {}): ViewStateStorage => {
  const { loader, saver, clearer, tableId, getUser = defaultGetUser } = options

  if (loader || saver) {
    return {
      load: async (key) => (loader ? await loader(key) : null),
      save: async (key, state) => {
        await saver?.(key, state)
      },
      clear: async (key) => {
        await clearer?.(key)
      }
    }
  }

  if (!tableId) {
    throw new Error('createRemoteViewStorage 需要 loader/saver（自定义模式）或 tableId（KESI 表模式）之一')
  }

  const api = createAPI({ resource: `core/t/${tableId}/d` })

  return {
    load: async (key) => {
      const { items } = await api.query(
        { limit: 1, fields: ['id', 'state'] },
        { where: { user: getUser(), viewKey: key } }
      )
      const record = items?.[0]
      if (!record?.state) return null
      try {
        const snapshot: ViewStateSnapshot = JSON.parse(record.state)
        return snapshot && snapshot.version === 1 ? snapshot : null
      } catch {
        return null
      }
    },
    save: async (key, state) => {
      const { items } = await api.query(
        { limit: 1, fields: ['id'] },
        { where: { user: getUser(), viewKey: key } }
      )
      const record = items?.[0]
      if (record?.id) {
        await api.save({ id: record.id, viewKey: key, state: JSON.stringify(state) }, true)
      } else {
        await api.save({ user: getUser(), viewKey: key, state: JSON.stringify(state) })
      }
    },
    clear: async (key) => {
      const { items } = await api.query(
        { limit: 1, fields: ['id'] },
        { where: { user: getUser(), viewKey: key } }
      )
      const record = items?.[0]
      if (record?.id) {
        await api.delete(record.id)
      }
    }
  }
}
