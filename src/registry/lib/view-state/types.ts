/**
 * ViewModel 视图状态持久化 - 类型定义
 *
 * 缓存范围：过滤器状态 / 分页（limit+skip）/ 排序 / 列显示 / 列宽
 * 存储通道：local（浏览器 localStorage）| remote（数据库，二选一）
 * 快照为 delta 语义：未调整过的段落不写入，回退到建表配置默认值
 */

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
