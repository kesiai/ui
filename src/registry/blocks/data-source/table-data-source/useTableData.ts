import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import _ from 'lodash'
import { api } from '@airiot/client'
import moment from 'moment'
import { toast } from '@/hooks/use-toast'
import type { TableInfo } from '../types'

// ==================== Types ====================

/**
 * 字段配置
 */
export interface FieldConfig {
  id?: string
  key?: string
  type?: string
  title?: string
  name?: string
  propertyType?: string
  tableName?: string
  transform?: (value: any) => any
  config?: string
  enum1?: any[]
  enum_title1?: any[]
  [key: string]: any
}

/**
 * Schema 结构
 */
export interface Schema {
  name?: string
  properties?: Record<string, FieldConfig>
  [key: string]: any
}

/**
 * 分组配置
 */
export interface GroupItemConfig {
  field?: string | FieldConfig
  dateOperator?: '天' | '周' | '月' | '年' | '一小时内的分钟数' | '一天内的小时数' | '一周内的天数' | '一月内的天数' | '一年内的天数' | '一年内的星期数' | '一年内的月数'
  [key: string]: any
}

/**
 * 列配置
 */
export interface ColumnItemConfig {
  name?: string
  field?: string | FieldConfig
  accumulator?: '$count' | '$avg' | '$first' | '$last' | '$max' | '$min' | '$sum'
  expression?: any
  [key: string]: any
}

/**
 * 字段格式化配置
 */
export interface FieldFormatConfig {
  field: FieldConfig | { id?: string; key?: string; title?: string; type?: string; propertyType?: string; value?: string; name?: string }
  format?: string | { format?: string; type?: string }
}

/**
 * 表数据查询配置
 */
export interface TableDataConfig {
  // 数据源选择类型
  selectType?: 'table' | 'dataset'
  // 表信息
  table?: TableInfo & { value?: string; id?: string; key?: string }
  // 初始过滤条件
  initFilter?: Record<string, any>
  // 是否分组查询
  isGroup?: boolean
  // 查询字段
  queryFields?: string[]
  // 是否查询所有字段
  projectAll?: boolean
  // 字段排序
  fieldOrder?: Array<{ value: string; order?: 'ASC' | 'DESC' }>
  // 分组配置
  group?: GroupItemConfig[]
  // 列配置
  columns?: ColumnItemConfig[]
  // 统计方式
  statsBySingle?: boolean | null
  // 限制返回数量
  limit?: number
  // 跳过数量
  skip?: number
  // 刷新间隔（秒）
  interval?: number
  // 是否显示内部字段
  showInnerField?: boolean
  // 字段格式化
  feildFormat?: FieldFormatConfig[]
  // 额外查询表定义配置
  extraSchema?: any
  // 提交标识（用于触发刷新）
  submit?: string
}

// 默认配置
export const defaultTableConfig: TableDataConfig = {
  selectType: 'table',
  table: {
    id: 'A',
    name: 'A'
  },
  initFilter: undefined,
  isGroup: false,
  showInnerField: false,
  statsBySingle: null,
  feildFormat: [
    {
      field: {
        title: '通信时间（connectTime）',
        value: 'connectTime',
        type: 'schema',
        id: 'connectTime',
        name: '通信时间',
        propertyType: 'string'
      },
      format: {
        type: 'date',
        format: 'YYYY-MM-DD hh:mm:ss'
      }
    },
    {
      field: {
        title: '日期（date-D523）',
        value: 'date-D523',
        type: 'schema',
        id: 'date-D523',
        name: '日期',
        propertyType: 'string'
      },
      format: {
        type: 'date',
        format: 'YYYY-MM-DD HH:mm:ss.SSS'
      }
    },
    {
      field: {
        title: '数字（number-92D2）',
        value: 'number-92D2',
        type: 'schema',
        id: 'number-92D2',
        name: '数字',
        propertyType: 'number'
      },
      format: {
        format: 'percentPoint'
      }
    }
  ],
  fieldOrder: undefined,
  group: undefined,
  columns: [
    {
      field: {
        title: '名称（name）',
        value: 'name',
        type: 'schema',
        id: 'name',
        name: '名称',
        propertyType: 'string'
      },
      name: '名称'
    }
  ],
  limit: undefined,
  skip: undefined,
  interval: undefined,
  projectAll: undefined,
  queryFields: ['connectTime', 'id', 'name', 'date-D523', 'time-C0CE', 'number-92D2'],
  extraSchema: undefined,
  submit: undefined
}

// ==================== Constants ====================

/**
 * 聚合函数名称映射
 */
const ACCUMULATOR_LABELS: Record<string, string> = {
  '$count': '个数',
  '$avg': '平均值',
  '$first': '首位值',
  '$last': '末尾值',
  '$max': '最大值',
  '$min': '最小值',
  '$sum': '总和'
}

/**
 * 内置字段列表
 */
const INNER_FIELDS = [
  '_department',
  '_departmentInfo',
  '_deptTableAndField',
  '_parent',
  'deletePermission',
  'editPermission'
]

/**
 * 特殊资源ID映射
 */
const SPECIAL_RESOURCE_IDS: Record<string, string> = {
  '_#$airiot_log': 'core/log',
  '_#$airiot_warning': 'warning/warning'
}

// ==================== Utility Functions ====================

/**
 * 获取 Schema
 */
const fetchSchema = async ({ id, selectType }: { id?: string; selectType?: string }): Promise<Schema | null> => {
  if (!id) return null

  try {
    if (selectType === 'dataset') {
      const { json } = await api({ name: `ds/dataset/jst/schema/${id}` }).fetch('')
      const schema = _.cloneDeep(json?.schema || {})

      // 为有 tableName 的字段添加后缀
      for (const key of _.keys(schema.properties)) {
        const item = schema.properties[key]
        if (item?.tableName) {
          item.title = `${item.title}(${item.tableName})`
        }
      }

      return schema
    } else {
      // 处理特殊资源
      if (id in SPECIAL_RESOURCE_IDS) {
        // TODO: 从 app.get('models') 获取特殊资源的 schema
        // const schema = app.get('models')[id === '_#$airiot_log' ? 'Log' : 'Warning']
        return null
      }

      const { json } = await api({ name: `core/t/schema/${id}` }).fetch('')
      return json?.schema || {}
    }
  } catch (error) {
    console.error('获取 Schema 失败:', error)
    return null
  }
}

/**
 * 处理额外 Schema 查询
 */
const dealExtraSchema = async (
  list: any[],
  extraSchema: any,
  table: TableDataConfig['table']
): Promise<any[]> => {
  if (!list?.length || !extraSchema || !table?.key) {
    return list
  }

  try {
    const { json } = await api({ name: `core/t/schema/${table.key}` }).fetch('')
    const tableSchemaProperties = json?.schema?.properties

    if (!tableSchemaProperties) {
      return list
    }

    return list.map(item => {
      const res: Record<string, any> = {}

      Object.keys(item).forEach(key => {
        res[key] = item[key]

        // 处理选择器字段，添加标签
        if (tableSchemaProperties[key]?.config === '选择器') {
          const num = tableSchemaProperties[key].enum1?.indexOf(item[key])
          const label = tableSchemaProperties[key].enum_title1?.[num]
          if (label !== undefined) {
            res[key + '-label'] = label
          }
        }
      })

      return res
    })
  } catch (error) {
    console.error('处理额外 Schema 失败:', error)
    return list
  }
}

/**
 * 生成日期操作
 */
const makeDateOperation = ({ dateOperator, field }: GroupItemConfig): any => {
  const fieldId = _.isObject(field) ? (field as FieldConfig).id : field
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
const buildQuery = (
  group: GroupItemConfig[] = [],
  columns: ColumnItemConfig[] = [],
  schema: Schema | null
): { groupBy: Record<string, any>; groupFields: Record<string, any> } => {
  const groupBy: Record<string, any> = {}
  const groupFields: Record<string, any> = {}

  // 构建分组
  group.forEach(g => {
    if (!g.field) return

    const field = _.isPlainObject(g.field)
      ? (g.field as FieldConfig).type === 'tag'
        ? 'param-' + (g.field as FieldConfig).id
        : (g.field as FieldConfig).id || (g.field as FieldConfig).key
      : g.field

    if (!field) return

    let key = field
    const properties = schema?.properties || {}

    // 处理嵌套字段
    if (key && typeof key === 'string' && key.indexOf('.') > 0) {
      key = key.split('.').join('.properties.')
    }

    const fieldTitle = _.get(properties, `${field}.title`)
    const name = field === 'fields.id' ? '数据点标识' : (typeof fieldTitle === 'string' ? fieldTitle : fieldTitle?.title) || '未命名'

    if (g.dateOperator) {
      groupBy[String(name)] = makeDateOperation(g)
    } else {
      const $key = '$' + (key === 'tableDataId' ? 'tableData' : key)
      groupBy[String(name)] = $key
    }
  })

  // 构建聚合字段
  columns.forEach(column => {
    const name = column.name || ACCUMULATOR_LABELS[column.accumulator || '']

    if (!column.accumulator) return

    if (column.accumulator === '$count') {
      groupFields[String(name)] = { $sum: 1 }
    } else if (column.field || column.expression) {
      const field = _.isPlainObject(column.field)
        ? (column.field as FieldConfig).type === 'tag'
          ? 'param-' + (column.field as FieldConfig).id
          : (column.field as FieldConfig).id
        : column.field

      const $field = field ? '$' + field : column.expression
      groupFields[String(name)] = { [column.accumulator]: $field }
    }
  })

  return { groupBy, groupFields }
}

/**
 * 按键顺序排序对象数组
 */
const sortObjectsByKeyOrder = (
  arrayOfObjects: Record<string, any>[],
  keyOrder: string[]
): Record<string, any>[] => {
  return arrayOfObjects.map(obj => {
    const entries = Object.entries(obj)

    entries.sort(([keyA], [keyB]) => {
      const indexA = keyOrder.indexOf(keyA)
      const indexB = keyOrder.indexOf(keyB)

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      } else if (indexA !== -1) {
        return -1
      } else if (indexB !== -1) {
        return 1
      }
      return 0
    })

    return Object.fromEntries(entries)
  })
}

/**
 * 获取列字段映射
 */
const getColumnFieldMapping = (columns: ColumnItemConfig[] = []): Map<string, string> => {
  const mapping = new Map<string, string>()

  columns.forEach(column => {
    const displayName = column.name || ACCUMULATOR_LABELS[column.accumulator || '']
    if (displayName && column.field && typeof column.field !== 'string' && column.field.id) {
      mapping.set(displayName, column.field.id)
    }
  })

  return mapping
}

/**
 * 检查是否为内置字段
 */
const isInnerField = (key: string): boolean => {
  return INNER_FIELDS.includes(key)
}

/**
 * 数字格式化
 */
const numberFormat = (format: string, value: any): any => {
  const num = Number(value)
  if (isNaN(num)) {
    return null
  }

  let result: any = num
  const regex = /^[0-9]$/

  if (format && !regex.test(format)) {
    // 预定义格式
    switch (format) {
      case 'percent':
        result = _.isNumber(result) ? (_.round(result * 100) + '%') : (result || 'n/a')
        break
      case 'percentPoint':
        result = _.isNumber(result) ? (_.round(result * 100, 2) + '%') : (result || 'n/a')
        break
      case 'thousandth':
        result = _.isNumber(result) ? _.round(result).toLocaleString() : (result || 'n/a')
        break
      case 'thousandthPoint':
        result = _.isNumber(result) ? _.round(result, 2).toLocaleString() : (result || 'n/a')
        break
      default:
        break
    }
  } else {
    // 保留 X 位小数
    result = result.toFixed(parseInt(format) || 0)
  }

  if (_.isNaN(result) || result === 'NaN') {
    result = null
  }

  return result
}

/**
 * 日期格式化
 */
const dateFormat = (format: string, value: any): any => {
  if (!value) {
    return null
  }

  const t = moment(value)
  let time: any = t

  switch (format) {
    case '秒级时间戳':
      time = t.unix().toString()
      break
    case '毫秒级时间戳':
      time = t.valueOf().toString()
      break
    case '历史数据时间':
      time = t.format('UTCYYYY-MM-DDTHH:mm:ss.SSSZ')
      break
    default:
      time = t.format(format)
      break
  }

  if (time === 'Invalid date') {
    time = null
  }

  return time
}

// ==================== Main Hook ====================

/**
 * 表数据查询 Hook
 */
export function useTableData(config: TableDataConfig) {
  const {
    selectType = 'table',
    table,
    initFilter = {},
    isGroup = false,
    queryFields = [],
    projectAll = false,
    fieldOrder = [],
    group = [],
    columns = [],
    statsBySingle = null,
    limit = 1000,
    skip = 0,
    interval = 0,
    showInnerField = false,
    feildFormat = [],
    extraSchema,
    submit
  } = config

  const [schema, setSchema] = useState<Schema | null>(null)
  const [dataset, setDataset] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const queryCallback = useRef<(() => void) | null>(null)
  const lastSubmitRef = useRef<string>()
  const hasInitializedRef = useRef(false)

  // 使用 ref 存储最新的配置值，避免依赖项过多
  const configRef = useRef({
    table,
    selectType,
    schema,
    initFilter,
    isGroup,
    queryFields,
    projectAll,
    fieldOrder,
    group,
    columns,
    statsBySingle,
    limit,
    skip,
    feildFormat,
    extraSchema,
    showInnerField
  })

  // 更新 ref
  useEffect(() => {
    configRef.current = {
      table,
      selectType,
      schema,
      initFilter,
      isGroup,
      queryFields,
      projectAll,
      fieldOrder,
      group,
      columns,
      statsBySingle,
      limit,
      skip,
      feildFormat,
      extraSchema,
      showInnerField
    }
  })

  // 构建字段转换映射
  const fieldTransform = useMemo(() => {
    const transforms: Record<string, (value: any) => any> = {}

    if (Array.isArray(group)) {
      group.forEach(g => {
        const key = _.isString(g?.field) ? g.field : g?.field?.id
        if (!key) return

        let normalizedKey = key
        if (normalizedKey.indexOf('.') > 0) {
          normalizedKey = normalizedKey.split('.').join('.properties.')
        }

        const field = _.get(schema?.properties, normalizedKey)
        if (field?.transform && _.isFunction(field.transform)) {
          transforms[field.title || ''] = field.transform
        }
      })
    }

    return transforms
  }, [schema, group])

  /**
   * 查询数据
   */
  const queryData = useCallback(async () => {
    const {
      table,
      selectType,
      schema,
      initFilter,
      isGroup,
      queryFields,
      projectAll,
      fieldOrder,
      group,
      columns,
      statsBySingle,
      limit,
      skip,
      feildFormat,
      extraSchema,
      showInnerField
    } = configRef.current

    const tableId = table?.value || table?.id
    if (!tableId || !schema) {
      return
    }

    try {
      setLoading(true)

      // 构建资源路径
      let resource = `core/t/${tableId}/d`

      if (selectType === 'dataset') {
        resource = `ds/dataset/jst/data/${tableId}`
      } else if (tableId in SPECIAL_RESOURCE_IDS) {
        resource = SPECIAL_RESOURCE_IDS[tableId]
      }

      // 构建查询对象
      const query: any = {
        filter: initFilter
      }

      let groupKeys: string[] = []

      if (isGroup || _.isUndefined(isGroup)) {
        // 分组查询
        const { groupBy, groupFields } = buildQuery(group, columns, schema)
        groupKeys = _.keys(groupBy)

        if (_.isEmpty(groupFields)) {
          setDataset([])
          return
        }

        query.groupBy = groupBy
        query.groupFields = groupFields
      } else {
        // 普通查询
        if (projectAll) {
          query.projectAll = true
        } else if (queryFields.length > 0) {
          query.project = {}
          queryFields.forEach(field => {
            query.project[field] = 1
          })
        }

        if (fieldOrder.length > 0) {
          query.sorts = fieldOrder.map(order => ({
            [order.value]: order?.order === 'ASC' ? 1 : -1
          }))
        }
      }

      // 设置分页
      query.limit = limit || 1000
      if (skip) {
        query.skip = skip
      }

      // 设置统计方式
      if (!_.isNull(statsBySingle)) {
        query.statsBySingle = statsBySingle
      }

      // 执行查询
      const queryString = encodeURIComponent(JSON.stringify(query))
      const { json } = await api({ name: resource }).fetch(`?query=${queryString}`)

      // 处理额外 Schema
      const resultList = await dealExtraSchema(json || [], extraSchema, table)

      // 获取列字段映射
      const columnFieldMapping = getColumnFieldMapping(columns)

      // 排序数据
      const sortedData = groupKeys.length > 0
        ? sortObjectsByKeyOrder(resultList, groupKeys)
        : resultList

      // 转换数据
      const transformedData = sortedData.map(item => {
        const transformedItem: Record<string, any> = {}

        Object.entries(item).forEach(([k, v]) => {
          // 查找列映射
          const mappedFieldId = columnFieldMapping.get(k)
          const actualKey = mappedFieldId || k

          // 处理内置字段
          if (isInnerField(actualKey) && !showInnerField) {
            return
          }

          // 应用字段转换
          if (fieldTransform[k]) {
            transformedItem[k] = fieldTransform[k](v)
          } else {
            // 应用格式化
            let formatted = false

            for (const fieldFormat of feildFormat || []) {
              const fieldId = fieldFormat?.field?.id || fieldFormat?.field?.key
              const fieldTitle = fieldFormat?.field?.title

              if (fieldId === actualKey || fieldTitle === actualKey) {
                const fieldType = fieldFormat?.field?.propertyType || fieldFormat?.field?.type
                const formatValue = typeof fieldFormat?.format === 'string'
                  ? fieldFormat.format
                  : fieldFormat?.format?.format || ''

                if (fieldType === 'string') {
                  transformedItem[k] = dateFormat(formatValue, v)
                } else {
                  transformedItem[k] = numberFormat(formatValue, v)
                }

                formatted = true
                break
              }
            }

            if (!formatted) {
              transformedItem[k] = v
            }
          }
        })

        return transformedItem
      })

      setDataset(transformedData)
    } catch (error) {
      console.error('查询表数据失败:', error)
      toast({
        variant: 'destructive',
        title: '数据查询出现错误，请检查数据'
      })
      setDataset([])
    } finally {
      setLoading(false)
    }
  }, []) // 依赖项为空数组，使用 ref 获取最新配置

  // 保存到 ref
  queryCallback.current = queryData

  // 获取 Schema
  useEffect(() => {
    const tableId = table?.value || table?.id
    if (!tableId) {
      return
    }

    // 重置初始化状态（当 table 变化时）
    hasInitializedRef.current = false
    lastSubmitRef.current = undefined

    fetchSchema({ id: tableId, selectType })
      .then(setSchema)
      .catch(err => {
        console.error('获取 Schema 失败:', err)
        setSchema(null)
      })
  }, [table?.value, table?.id, selectType])

  // 提交时触发查询
  useEffect(() => {
    const tableId = table?.value || table?.id

    if (!tableId || !schema?.name) {
      return
    }

    // 如果已经初始化过且 submit 没有变化，则跳过
    if (hasInitializedRef.current && lastSubmitRef.current === submit) {
      return
    }

    hasInitializedRef.current = true
    lastSubmitRef.current = submit

    queryData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submit, schema?.name]) // 移除 queryData 依赖，使用 ref 调用最新函数

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
