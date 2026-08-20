/**
 * ViewModel 视图状态持久化 - 持久化运行时
 *
 * 组成：
 * 1. uiState 扩展 atom（经 modelRegistry.addModelAtoms 注册，kesi-client 零改动）
 *    桥接 TanStack 的 columnVisibility / columnSizing 到 model atoms，使持久化层单点订阅
 * 2. ViewStateContext：ViewModel 向 ViewDataTable / ViewFilter / Saver 传递配置与恢复值
 * 3. ViewStateSaver：订阅 atoms（wheres/option/uiState）→ 防抖 → storage.save
 */
import React from 'react'
import { atom } from 'jotai'
import isEmpty from 'lodash/isEmpty'
import isPlainObject from 'lodash/isPlainObject'
import { getConfig, modelRegistry, useModel, useModelValue } from '@kesi/client'
import { createLocalViewStorage } from './storage-local'
import { createRemoteViewStorage } from './storage-remote'
import { validateColumns } from './validate'
import {
  DEFAULT_PERSIST_SEGMENTS,
  EMPTY_UI_STATE,
  type ViewStateContextValue,
  type ViewStatePersistenceConfig,
  type ViewStateSegment,
  type ViewStateSnapshot,
  type ViewStateStorage,
  type ViewStateUiState
} from './types'

// ---------------------------------------------------------------------------
// uiState 扩展 atom：key 固定为 'uiState'，随 model key 命名空间隔离
// ---------------------------------------------------------------------------

let uiStateRegistered = false

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

// ---------------------------------------------------------------------------
// ViewStateContext
// ---------------------------------------------------------------------------

const ViewStateContext = React.createContext<ViewStateContextValue | null>(null)

export const ViewStateProvider = ViewStateContext.Provider

/** 供 ViewDataTable / ViewFilter 消费；无持久化配置时返回 null */
export const useViewState = (): ViewStateContextValue | null => React.useContext(ViewStateContext)

// ---------------------------------------------------------------------------
// 存储解析 / key 组装 / 恢复工具
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 快照组装与保存
// ---------------------------------------------------------------------------

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
