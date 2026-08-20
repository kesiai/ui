/**
 * ViewModel 视图状态持久化
 *
 * 缓存范围：过滤器状态 / 分页（limit+skip）/ 排序 / 列显示 / 列宽
 * 存储通道：local（浏览器 localStorage）| remote（数据库，二选一）
 * 快照为 delta 语义：未调整过的段落不写入，回退到建表配置默认值
 *
 * 注意：本文件是 registry 分发单元（build:registry 按 lib 单文件内联），
 * 不拆子文件；结构依次为 类型 → 校验 → local 适配器 → remote 适配器 → 持久化运行时
 */
import React from 'react'
import { atom } from 'jotai'
import isEmpty from 'lodash/isEmpty'
import isFinite from 'lodash/isFinite'
import isNumber from 'lodash/isNumber'
import isPlainObject from 'lodash/isPlainObject'
import { createAPI, getConfig, modelRegistry, useModel, useModelValue } from '@kesi/client'

// ---------------------------------------------------------------------------
// 类型定义
// ---------------------------------------------------------------------------

/** 列相关状态（只存用户调整过的部分） */
export interface ViewStateColumns {
  /** 可见列 key 列表（含顺序）；Tools/ColumnsTool 改 fields atom 时产生，与 schema 默认不同才存 */
  fields?: string[]
  /** 列显示状态，key = 字段名，false = 隐藏（缺省可见）；showColumnSettings 下拉产生 */
  visibility?: Record<string, boolean>
  /** 列宽（px），key = 字段名，只存用户拖拽过的列 */
  sizing?: Record<string, number>
}

/** 视图状态快照（存储载体上的 payload） */
export interface ViewStateSnapshot {
  version: 1
  /** 用户筛选值（wheres.filter） */
  filter?: Record<string, any>
  /** 分页：每页条数 + 页码偏移（连页码一起恢复） */
  pagination?: { limit: number; skip: number }
  /** 排序 */
  order?: Record<string, 'ASC' | 'DESC'>
  /** 列状态 */
  columns?: ViewStateColumns
  /** 保存时间戳（ms） */
  savedAt?: number
}

/** 可持久化的状态段（白名单） */
export type ViewStateSegment = 'filter' | 'pagination' | 'order' | 'columns'

export const DEFAULT_PERSIST_SEGMENTS: ViewStateSegment[] = ['filter', 'pagination', 'order', 'columns']

/** 存储适配器：local / remote 两种内置实现，或宿主完全自定义 */
export interface ViewStateStorage {
  load(key: string): Promise<ViewStateSnapshot | null>
  save(key: string, state: ViewStateSnapshot): Promise<void>
  clear(key: string): Promise<void>
}

/** 数据库通道适配器配置（createRemoteViewStorage） */
export interface RemoteViewStorageOptions {
  /** 自定义读（与 saver 搭配使用，优先于 tableId 模式） */
  loader?: (key: string) => Promise<ViewStateSnapshot | null>
  /** 自定义写 */
  saver?: (key: string, state: ViewStateSnapshot) => Promise<void>
  /** 自定义清空 */
  clearer?: (key: string) => Promise<void>
  /**
   * KESI 配置表模式：指定一张表自动读写。
   * 期望记录结构：{ id, user, viewKey, state: JSON字符串 }
   * 表由 kesi-cli 建表阶段规划或宿主任意指定
   */
  tableId?: string
  /** 当前用户标识（tableId 模式区分用户），缺省从 @kesi/client 配置读取 */
  getUser?: () => string
}

/** ViewModel 的 statePersistence 配置 */
export interface ViewStatePersistenceConfig {
  /** 显式关闭（不传 statePersistence 即不启用） */
  enabled?: boolean
  /** 存储通道：'local'（默认）| 'remote'，二选一 */
  channel?: 'local' | 'remote'
  /** 视图标识，缺省用 tableId / modelName */
  viewKey?: string
  /** 完全自定义适配器（最高优先级，覆盖 channel） */
  storage?: ViewStateStorage
  /** channel='remote' 且未传 storage 时的适配器配置 */
  remote?: RemoteViewStorageOptions
  /** 持久化白名单，默认全部 */
  persist?: ViewStateSegment[]
  /** 保存防抖（ms），默认 500 */
  debounce?: number
  /** 用户标识（纳入存储 key，区分同浏览器多账号），缺省从 @kesi/client 配置读取 */
  userId?: string
  /** remote 加载超时（ms），超时降级到默认值，默认 2000 */
  restoreTimeout?: number
  /** 恢复完成回调 */
  onRestored?: (state: ViewStateSnapshot | null) => void
}

/** 桥接 TanStack 列状态的 model 扩展 atom 值 */
export interface ViewStateUiState {
  columnVisibility: Record<string, boolean>
  columnSizing: Record<string, number>
}

export const EMPTY_UI_STATE: ViewStateUiState = { columnVisibility: {}, columnSizing: {} }

/** ViewModel 向下（ViewDataTable / ViewFilter / Saver）传递的上下文 */
export interface ViewStateContextValue {
  config: ViewStatePersistenceConfig
  storage: ViewStateStorage | null
  /** 最终存储 key（含用户段） */
  viewKey: string
  /** 恢复出的快照（可能为 null） */
  restored: ViewStateSnapshot | null
}

// ---------------------------------------------------------------------------
// 快照校验
// ---------------------------------------------------------------------------

const MIN_COLUMN_WIDTH = 40
const MAX_COLUMN_WIDTH = 2000
const MAX_PAGE_SIZE = 500

/** 快照校验上下文（列 key 集合由消费方按当前 schema 提供） */
export interface ValidateContext {
  /** 当前合法列 id 集合（tableSchema keys，含 __tag_* 点位列） */
  columnIds?: string[]
}

const clampInt = (value: any, min: number, max: number): number | null => {
  const n = Number(value)
  if (!isFinite(n)) return null
  return Math.min(max, Math.max(min, Math.round(n)))
}

const normalizeOrderValue = (value: any): 'ASC' | 'DESC' | null => {
  if (typeof value !== 'string') return null
  const upper = value.toUpperCase()
  return upper === 'ASC' || upper === 'DESC' ? upper : null
}

/** 过滤对象中 key 不在白名单内的项（schema 演进后的脏数据防御） */
const pickKnownKeys = <T>(source: Record<string, T>, known?: Set<string>): Record<string, T> => {
  const out: Record<string, T> = {}
  Object.entries(source).forEach(([key, value]) => {
    if (!known || known.has(key)) {
      out[key] = value
    }
  })
  return out
}

/**
 * 校验并裁剪快照（delta 语义不变，只剔除非法/过期部分）。
 * 列相关的段落（visibility/sizing）可延后到 ViewDataTable 拿到实际列集合后
 * 再用 validateColumns 二次过滤；此处做结构级校验。
 */
export const validateSnapshot = (
  snapshot: any,
  ctx: ValidateContext = {}
): ViewStateSnapshot | null => {
  if (!isPlainObject(snapshot) || snapshot.version !== 1) return null

  const known = ctx.columnIds ? new Set(ctx.columnIds) : undefined
  const out: ViewStateSnapshot = { version: 1 }
  if (isNumber(snapshot.savedAt)) out.savedAt = snapshot.savedAt

  // 过滤器：结构级校验（filterSchema 形态复杂，键级校验交给 FilterForm 渲染时自然容错）
  if (isPlainObject(snapshot.filter) && !isEmpty(snapshot.filter)) {
    out.filter = snapshot.filter
  }

  // 分页：数值 clamp
  if (isPlainObject(snapshot.pagination)) {
    const limit = clampInt(snapshot.pagination.limit, 1, MAX_PAGE_SIZE)
    const skip = clampInt(snapshot.pagination.skip, 0, Number.MAX_SAFE_INTEGER)
    if (limit !== null) {
      out.pagination = { limit, skip: skip ?? 0 }
    }
  }

  // 排序：值归一 + key 白名单
  if (isPlainObject(snapshot.order) && !isEmpty(snapshot.order)) {
    const order: Record<string, 'ASC' | 'DESC'> = {}
    Object.entries(snapshot.order).forEach(([key, value]) => {
      const normalized = normalizeOrderValue(value)
      if (normalized && (!known || known.has(key))) {
        order[key] = normalized
      }
    })
    if (!isEmpty(order)) out.order = order
  }

  // 列状态：结构级 + key 白名单（若已提供 columnIds）
  if (isPlainObject(snapshot.columns) && !isEmpty(snapshot.columns)) {
    out.columns = validateColumns(snapshot.columns, ctx.columnIds)
  }

  return out
}

/** 列状态校验：key 必须在当前列集合内，宽度 clamp */
export const validateColumns = (
  columns: any,
  columnIds?: string[]
): ViewStateColumns | undefined => {
  if (!isPlainObject(columns)) return undefined
  const known = columnIds ? new Set(columnIds) : undefined
  const out: ViewStateColumns = {}

  if (isPlainObject(columns.visibility) && !isEmpty(columns.visibility)) {
    const visibility = pickKnownKeys(columns.visibility, known)
    // 只保留显式隐藏的列（delta 语义：可见是缺省）
    Object.entries(visibility).forEach(([key, value]) => {
      if (value === false) visibility[key] = false
    })
    const hidden = Object.fromEntries(Object.entries(visibility).filter(([, v]) => v === false))
    if (!isEmpty(hidden)) out.visibility = hidden as Record<string, boolean>
  }

  if (isPlainObject(columns.sizing) && !isEmpty(columns.sizing)) {
    const sizing: Record<string, number> = {}
    Object.entries(pickKnownKeys(columns.sizing, known)).forEach(([key, value]) => {
      const width = clampInt(value, MIN_COLUMN_WIDTH, MAX_COLUMN_WIDTH)
      if (width !== null) sizing[key] = width
    })
    if (!isEmpty(sizing)) out.sizing = sizing
  }

  return isEmpty(out) ? undefined : out
}

/** 宽度归一化：schema 里的 width 配置转 TanStack size（px 数字） */
export const normalizeColumnWidth = (width: any): number | undefined => {
  if (isNumber(width) && isFinite(width)) {
    return Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, Math.round(width)))
  }
  if (typeof width === 'string') {
    const px = width.trim().endsWith('px') ? parseFloat(width) : NaN
    if (isFinite(px)) {
      return Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, Math.round(px)))
    }
    // 百分比等无法在无容器上下文时解析的格式：忽略，走组件默认宽度
  }
  return undefined
}

// ---------------------------------------------------------------------------
// local 适配器（localStorage）
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// remote 适配器（数据库）
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 持久化运行时
//
// 1. uiState 扩展 atom（经 modelRegistry.addModelAtoms 注册，kesi-client 零改动）
//    桥接 TanStack 的 columnVisibility / columnSizing 到 model atoms，使持久化层单点订阅
// 2. ViewStateContext：ViewModel 向 ViewDataTable / ViewFilter / Saver 传递配置与恢复值
// 3. ViewStateSaver：订阅 atoms（wheres/option/uiState）→ 防抖 → storage.save
// ---------------------------------------------------------------------------

let uiStateRegistered = false

// 全局默认持久化配置：应用启动时设置一次，所有未显式传 statePersistence 的 ViewModel 生效；
// 单点显式传入 statePersistence（含 enabled:false 关闭）优先于全局默认
let globalPersistenceConfig: ViewStatePersistenceConfig | null = null

/** 设置全局默认视图状态持久化配置（传 null 清除） */
export const setDefaultViewStatePersistence = (config: ViewStatePersistenceConfig | null): void => {
  globalPersistenceConfig = config
}

/** 读取全局默认配置（内部供 ViewModel 回落使用） */
export const getDefaultViewStatePersistence = (): ViewStatePersistenceConfig | null => {
  return globalPersistenceConfig
}

/** 注册扩展 atom（模块导入即执行；重复调用幂等） */
export const registerUiStateAtom = () => {
  if (uiStateRegistered) return
  modelRegistry.addModelAtoms((() => ({
    uiState: atom<ViewStateUiState>({ columnVisibility: {}, columnSizing: {} })
  })) as any)
  uiStateRegistered = true
}

registerUiStateAtom()

/** 极端情况下（atoms 缓存早于扩展注册）兜底的共享 atom */
const fallbackUiStateAtom = atom<ViewStateUiState>({ ...EMPTY_UI_STATE })

/** 从 model atoms 取 uiState atom（缺省兜底，避免 undefined atom 崩溃） */
export const getUiStateAtom = (atoms: any): any => atoms?.uiState ?? fallbackUiStateAtom

const ViewStateContext = React.createContext<ViewStateContextValue | null>(null)

export const ViewStateProvider = ViewStateContext.Provider

/** 供 ViewDataTable / ViewFilter 消费；无持久化配置时返回 null */
export const useViewState = (): ViewStateContextValue | null => React.useContext(ViewStateContext)

/** 解析配置 → 存储适配器实例（enabled=false 或无配置返回 null） */
export const resolveViewStateStorage = (
  config: ViewStatePersistenceConfig
): ViewStateStorage | null => {
  if (config.enabled === false) return null
  if (config.storage) return config.storage
  if (config.channel === 'remote') {
    return createRemoteViewStorage(config.remote ?? {})
  }
  return createLocalViewStorage()
}

/** 当前用户标识（local key 隔离同浏览器多账号；remote tableId 模式记录归属） */
export const resolveViewStateUserId = (explicit?: string): string => {
  if (explicit) return explicit
  const user = getConfig().user
  return user?.id || user?.user?.id || 'anonymous'
}

/** 组装最终存储 key：`<viewKey>.<userId>` */
export const composeViewStateKey = (base: string, userId: string): string => `${base}.${userId}`

/** remote 加载超时兜底（出错/超时都降级到 fallback） */
export const withRestoreTimeout = async <T,>(p: Promise<T>, ms: number, fallback: T): Promise<T> => {
  return Promise.race([
    p.catch(() => fallback),
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ])
}

/** 用实际列集合过滤恢复出的列状态（schema 演进防御） */
export const mergeRestoredUiState = (
  restored: ViewStateSnapshot | null,
  columnIds: string[]
): ViewStateUiState => {
  const columns = restored?.columns
  if (!columns) return { columnVisibility: {}, columnSizing: {} }
  const validated = validateColumns(columns, columnIds) ?? {}
  return {
    columnVisibility: validated.visibility ?? {},
    columnSizing: validated.sizing ?? {}
  }
}

/**
 * 恢复 fields 通道（Tools/ColumnsTool 的列显隐机制）：
 * 把快照里的列 key 列表映射回当前 fields 项（保留 tableSchema 对象携带的 width/canOrder 等配置），
 * 按 schema 过滤已删除的列。返回 null 表示无需变更。
 */
export const mergeRestoredFields = (
  restored: ViewStateSnapshot | null,
  currentFields: any[]
): any[] | null => {
  const restoredKeys = restored?.columns?.fields
  if (!Array.isArray(restoredKeys) || restoredKeys.length === 0) return null

  const currentKeys = currentFields.map((f: any) => (typeof f === 'string' ? f : f?.key))
  const keySet = new Set(currentKeys.filter(Boolean))
  const fieldMap = new Map(currentFields.map((f: any) => [typeof f === 'string' ? f : f?.key, f]))

  const merged = restoredKeys
    .filter((key) => keySet.has(key))
    .map((key) => fieldMap.get(key) ?? key)

  if (merged.length === 0) return null
  // 与当前一致（顺序也相同）则不动，避免无谓的 option 变更触发重查
  const mergedKeys = merged.map((f: any) => (typeof f === 'string' ? f : f?.key))
  if (mergedKeys.length === currentKeys.length && mergedKeys.every((k: any, i: number) => k === currentKeys[i])) {
    return null
  }
  return merged
}

/** 从当前 atoms 值组装 delta 快照（只含白名单段） */
export const buildViewStateSnapshot = (
  wheres: any,
  option: any,
  uiState: ViewStateUiState | undefined,
  persist: ViewStateSegment[],
  /** schema 默认列 key 序列（与当前不同才存 fields，delta 语义） */
  defaultFieldKeys?: string[]
): ViewStateSnapshot => {
  const snapshot: any = { version: 1, savedAt: Date.now() }

  if (persist.includes('filter') && isPlainObject(wheres?.filter) && !isEmpty(wheres.filter)) {
    snapshot.filter = wheres.filter
  }
  if (persist.includes('pagination')) {
    snapshot.pagination = {
      limit: Number(option?.limit) || 15,
      skip: Math.max(0, Number(option?.skip) || 0)
    }
  }
  if (persist.includes('order') && isPlainObject(option?.order) && !isEmpty(option.order)) {
    snapshot.order = option.order
  }
  if (persist.includes('columns')) {
    const columns: any = {}
    if (uiState) {
      const hidden = Object.fromEntries(
        Object.entries(uiState.columnVisibility || {}).filter(([, v]) => v === false)
      )
      if (!isEmpty(hidden)) columns.visibility = hidden
      if (!isEmpty(uiState.columnSizing)) columns.sizing = uiState.columnSizing
    }
    // fields 通道（Tools/ColumnsTool 列显隐）：与 schema 默认序列不同才存
    const fieldKeys = (option?.fields || [])
      .map((f: any) => (typeof f === 'string' ? f : f?.key))
      .filter(Boolean)
    if (defaultFieldKeys && fieldKeys.length > 0
      && !(fieldKeys.length === defaultFieldKeys.length && fieldKeys.every((k: string, i: number) => k === defaultFieldKeys[i]))) {
      columns.fields = fieldKeys
    }
    if (!isEmpty(columns)) snapshot.columns = columns
  }

  return snapshot as ViewStateSnapshot
}

/**
 * 保存器：挂在 ViewModel children 中（ModelInitial 完成原子初始化之后才挂载），
 * 订阅 wheres / option / uiState，防抖写入存储。首帧跳过（避免把刚恢复的值原样回写）。
 */
export const ViewStateSaver: React.FC = () => {
  const ctx = React.useContext(ViewStateContext)
  const { model, atoms } = useModel()

  const wheres = useModelValue(atoms.wheres)
  const option = useModelValue(atoms.option)
  const uiState = useModelValue(getUiStateAtom(atoms))

  // schema 默认列 key 序列（fields delta 的比较基线）
  const defaultFieldKeys = React.useMemo(
    () => (model?.tableSchema || []).map((f: any) => (typeof f === 'string' ? f : f?.key)).filter(Boolean),
    [model?.tableSchema]
  )

  const skipFirst = React.useRef(true)

  React.useEffect(() => {
    const storage = ctx?.storage
    const viewKey = ctx?.viewKey
    const config = ctx?.config
    if (!storage || !viewKey) return
    if (skipFirst.current) {
      skipFirst.current = false
      return
    }
    const timer = setTimeout(() => {
      const persist = config?.persist ?? DEFAULT_PERSIST_SEGMENTS
      const snapshot = buildViewStateSnapshot(wheres, option, uiState, persist, defaultFieldKeys)
      Promise.resolve(storage.save(viewKey, snapshot)).catch(() => {
        // remote 写失败静默（下次变更重试），不阻断交互
      })
    }, config?.debounce ?? 500)
    return () => clearTimeout(timer)
  }, [ctx?.storage, ctx?.viewKey, wheres, option, uiState, defaultFieldKeys])

  return null
}
