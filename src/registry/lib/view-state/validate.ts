import isEmpty from 'lodash/isEmpty'
import isFinite from 'lodash/isFinite'
import isNumber from 'lodash/isNumber'
import isPlainObject from 'lodash/isPlainObject'
import type { ViewStateColumns, ViewStateSnapshot } from './types'

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
