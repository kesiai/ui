import { useState, useEffect, useRef, useCallback } from 'react'
import _ from 'lodash'
import { api } from '@airiot/client'
import { numberFormat, dateFormat } from '../utils'
import { getQueryFilter } from '../../utils/query'

// ==================== Types ====================

/**
 * 分组配置项
 */
export interface GroupItemConfig {
  field?: string
  dateOperator?: '天' | '周' | '月' | '年' | '一小时内的分钟数' | '一天内的小时数' | '一周内的天数' | '一月内的天数' | '一年内的天数' | '一年内的星期数' | '一年内的月数'
}

/**
 * 列配置项
 */
export interface ColumnItemConfig {
  name?: string
  field?: string
  accumulator?: '$count' | '$avg' | '$first' | '$last' | '$max' | '$min' | '$sum'
  expression?: any
}

/**
 * 排序配置项
 */
export interface SortItemConfig {
  value: string
  order?: 'ASC' | 'DESC'
}

/**
 * 字段格式化配置
 */
export interface FieldFormatConfig {
  field: string
  format: string
}

/**
 * 消息数据源配置
 */
export interface MessageDataConfig {
  initFilter?: Record<string, any>
  isGroup?: boolean
  group?: GroupItemConfig[]
  columns?: ColumnItemConfig[]
  fieldOrder?: SortItemConfig[]
  limit?: number
  interval?: number
  feildFormat?: FieldFormatConfig[]
  submit?: string
}

// 默认配置
export const defaultMessageConfig: MessageDataConfig = {
  initFilter: {},
  isGroup: false,
  group: [],
  columns: [],
  fieldOrder: [],
  limit: 3,
  interval: 0,
  feildFormat: []
}

// 消息字段列表
const messageList = [
  { label: '消息类型', value: 'messageType', type: 'string' },
  { label: '创建时间', value: 'createTime', type: 'time' },
  { label: '操作', value: 'optType', type: 'string' }
]

// ==================== Utility Functions ====================

/**
 * 生成日期操作
 */
const makeDateOperation = ({ dateOperator, field }: GroupItemConfig): any => {
  const fieldId = _.isObject(field) ? (field as any).id : field
  if (!fieldId) return null

  const $field = '$' + fieldId

  switch (dateOperator) {
    case '天':
      return { $dateToString: { format: '%Y-%m-%d', date: $field } }
    case '周':
      return { $dateToString: { format: '%Y-%V', date: $field } }
    case '月':
      return { $dateToString: { format: '%Y-%m', date: $field } }
    case '年':
      return { $year: $field }
    case '一小时内的分钟数':
      return { $minute: $field }
    case '一天内的小时数':
      return { $hour: $field }
    case '一周内的天数':
      return { $dayOfWeek: $field }
    case '一月内的天数':
      return { $dayOfMonth: $field }
    case '一年内的天数':
      return { $dayOfYear: $field }
    case '一年内的星期数':
      return { $week: $field }
    case '一年内的月数':
      return { $month: $field }
    default:
      return $field
  }
}

/**
 * 构建查询对象
 */
const makeQuery = (
  group: GroupItemConfig[] = [],
  columns: ColumnItemConfig[] = []
): { groupBy: Record<string, any>; groupFields: Record<string, any> } => {
  const groupBy: Record<string, any> = {}
  const groupFields: Record<string, any> = {}

  // 构建分组
  group.forEach(g => {
    if (!g.field) return

    const name = messageList?.find(m => m.value === g.field)?.label || g.field

    if (g.dateOperator) {
      groupBy[name] = makeDateOperation(g)
    } else {
      groupBy[name] = `$${g.field}`
    }
  })

  // 构建聚合字段
  columns.forEach(column => {
    const name = column.name || '个数'

    if (column.accumulator === '$count') {
      groupFields[name] = { $sum: 1 }
    }
  })

  return { groupBy, groupFields }
}

/**
 * 格式化字段
 */
const formatField = (
  field: string,
  value: any,
  feildFormat?: FieldFormatConfig[]
): any => {
  if (!feildFormat) return value

  const format = feildFormat.find(f => f.field === field)
  if (!format) return value

  const { field: fieldName, format: fieldFormat } = format

  if (fieldName === 'createTime' && fieldFormat) {
    return dateFormat(fieldFormat, value)
  } else {
    return numberFormat(fieldFormat, value)
  }
}

/**
 * 过滤和格式化数据
 */
const filterData = (
  data: any[],
  feildFormat?: FieldFormatConfig[]
): any[] => {
  return data.map(item => {
    const transformedData: Record<string, any> = {}

    Object.entries(item).forEach(([key, value]) => {
      transformedData[key] = formatField(key, value, feildFormat)
    })

    return transformedData
  })
}

// ==================== Main Hook ====================

/**
 * 消息数据源 Hook
 */
export function useMessageData(config: MessageDataConfig) {
  const {
    initFilter = {},
    isGroup = false,
    group = [],
    columns = [],
    fieldOrder = [],
    limit = 1000,
    interval = 0,
    feildFormat = [],
    submit = ''
  } = config

  const [dataset, setDataset] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const queryCallback = useRef<(() => void) | null>(null)

  /**
   * 查询数据
   */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)

      const filter = getQueryFilter(initFilter)

      let query: any = {
        project: {
          isDelete: 1,
          data: 1,
          messageType: 1,
          optType: 1,
          record: 1,
          createTime: 1
        },
        filter,
        sorts: fieldOrder?.map(order => ({ [order.value]: order.order === 'ASC' ? 1 : -1 }))
      }

      // 分组查询
      if (isGroup && group && group.length > 0) {
        const { groupBy, groupFields } = makeQuery(group, columns)
        query.groupBy = groupBy
        query.groupFields = groupFields
      }

      // 设置分页
      query.limit = limit || 1000

      // 执行查询
      const queryString = encodeURIComponent(JSON.stringify(query))
      const { json } = await api({ name: 'core/message' }).fetch(`?query=${queryString}`)

      // 格式化数据
      const data = filterData(json || [], feildFormat)
      setDataset(data)
    } catch (error) {
      console.error('查询消息数据失败:', error)
      setDataset([])
    } finally {
      setLoading(false)
    }
  }, [initFilter, isGroup, group, columns, fieldOrder, limit, feildFormat])

  // 保存到 ref
  queryCallback.current = fetchData

  // 提交时触发查询
  useEffect(() => {
    if (submit) {
      fetchData()
    }
  }, [submit, fetchData])

  // 初始加载
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify({ initFilter, fieldOrder, feildFormat })])

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
    loading
  }
}
