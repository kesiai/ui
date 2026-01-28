import React, { createContext, useContext, useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { api, use } from 'xadmin'
import { C, Loading } from 'xadmin-ui'
import _ from 'lodash'

// Types
interface TableSchema {
  id: string | number
  schema?: {
    _dashboard_widget_type?: string
    [key: string]: any
  }
  [key: string]: any
}

interface TableFilter {
  [key: string]: any
}

interface TableRef {
  id: string | number
  [key: string]: any
}

// Props interfaces
interface TableViewProps {
  dashboardMode?: boolean
  children?: React.ReactNode
  cellKey?: string
  table?: TableRef
  queryFields?: string[]
  projectAll?: boolean
  limit?: number
  tableFilters?: TableFilter[]
  fieldOrder?: string[]
  subscribe?: boolean
  output?: boolean
  interval?: number
  layoutType?: string
  flex?: any
  grid?: any
  free?: any
}

interface TableParams {
  initQuery?: boolean
  mk?: string | number
  initialValues?: TableFilter[]
  limit?: number
  queryFields?: string[]
  projectAll?: boolean
  fieldOrder?: string[]
}

interface TableData extends TableSchema {
  name: string
  table_params: TableParams
  cacheFields?: any
}

interface State {
  data: TableSchema | null
  tags: any[]
  loading: boolean
}

interface MountedListener {
  [key: string]: boolean
}

// Contexts
interface TableParamsContextValue {
  tableFilters?: TableFilter[]
}

interface DataViewContextValue {
  setFields: React.Dispatch<React.SetStateAction<any[] | null>>
  setCacheFields: React.Dispatch<React.SetStateAction<any>>
  setMountedListener: (cellKey: string) => void
}

// Placeholder for external dependencies (these should be properly imported from xadmin packages)
interface ViewMountEventsProps { cellKey?: string }
interface ViewUpdateVarProps { cellKey?: string }
interface IntervalUploadViewProps { interval?: number }
interface TableRecordsubscribeProps { table: TableData }
interface WidgetDescriptionProps { description: string }
interface DataContextProviderProps { cellKey?: string; ctxTable?: TableRef; children: React.ReactNode }

// These components would be imported from their respective files
// TODO: Replace with actual imports when available
const ViewMountEvents: React.FC<ViewMountEventsProps> = () => null
const ViewUpdateVar: React.FC<ViewUpdateVarProps> = () => null
const WidgetDescription: React.FC<WidgetDescriptionProps> = ({ description }) => React.createElement('div', null, description)
const IntervalUploadView: React.FC<IntervalUploadViewProps> = () => null
const TableRecordsubscribe: React.FC<TableRecordsubscribeProps> = () => null
const DataContextProvider: React.FC<DataContextProviderProps> = ({ children }) => React.createElement(React.Fragment, null, children)
const DataViewContext = createContext<DataViewContextValue | null>(null)

// Translation placeholder
const _t1 = (text: string) => text

// ============================================================================
// TableView - Fetches table schema and manages loading state
// ============================================================================
const TableView: React.FC<TableViewProps> = (props) => {
  const {
    dashboardMode,
    children,
    cellKey,
    table,
    queryFields,
    projectAll,
    limit,
    tableFilters,
    fieldOrder,
    subscribe,
    output,
    interval,
    layoutType,
    flex,
    grid,
    free,
  } = props

  const id = table?.id
  const renderStr = JSON.stringify({ layoutType, flex, grid, free })
  const [{ data, tags, loading }, setState] = useState<State>(() => ({ data: null, tags: [], loading: true }))
  const childrenCells = use('cell.structure.value', `${cellKey}.children`) || []
  const setDataForForm = use('cell.context.set', `${cellKey}.tableModel`)

  // Fetch table schema and tags
  const fetchTableSchemaAndTags = useCallback(async (id: string | number) => {
    setState({ data: null, tags: [], loading: true })
    try {
      const [tableSchema, tagResponse] = await Promise.all([
        api({ name: 'core/t/schema' }).get(id).then((payload: any) => payload),
        api({ name: `/core/t/schema/tag/${id}` }).fetch('')
      ])
      if (tableSchema) {
        _.set(tableSchema, 'schema._dashboard_widget_type', 'view_model')
      }
      const { json } = tagResponse
      setState({ data: tableSchema, tags: json?.tags || [], loading: false })
    } catch (error) {
      console.error('Failed to fetch table schema:', error)
      setState({ data: null, tags: [], loading: false })
    }
  }, [])

  useEffect(() => {
    if (id && data?.id !== id) {
      fetchTableSchemaAndTags(id)
    }
  }, [id, data?.id, fetchTableSchemaAndTags])

  // Build table params - 精简: 使用 Object.assign 简化条件赋值
  const table_params: TableParams = useMemo(() => {
    const params: TableParams = { initQuery: true, mk: data?.id }
    if (tableFilters?.length) params.initialValues = tableFilters
    if (limit) params.limit = limit
    if (queryFields?.length) params.queryFields = queryFields
    if (projectAll) params.projectAll = projectAll
    if (fieldOrder) params.fieldOrder = fieldOrder
    return params
  }, [data?.id, tableFilters, limit, queryFields, projectAll, fieldOrder])

  const tableData: TableData = useMemo(() => ({
    ...data,
    name: `${cellKey}-${data?.id}`,
    table_params
  }), [data, cellKey, table_params])

  // Update form data when available - 精简: 使用可选链简化判断
  useEffect(() => {
    data?.id && dashboardMode && setDataForForm?.(data)
  }, [data, dashboardMode, setDataForForm])

  // Empty state for dashboard mode - 精简: 提取为独立函数
  const getEmptyDescription = useCallback(() => {
    const noChildren = _.isEmpty(childrenCells)
    const noTable = _.isEmpty(table)
    if (noChildren && noTable) return _t1('请选择数据表并添加表数据组件及元素组件')
    if (noTable) return _t1('请选择数据表')
    return _t1('请添加表数据组件及元素组件')
  }, [childrenCells, table])

  if (dashboardMode && (_.isEmpty(childrenCells) || _.isEmpty(table))) {
    return React.createElement(WidgetDescription, { description: getEmptyDescription() })
  }

  const emptyTable = id ? React.createElement(Loading) : null

  return (loading || data == null) ? emptyTable : React.createElement(
    TableModel,
    { dashboardMode, cellKey, tags, ctxTable: table, subscribe, tableFilters, data: tableData, output, renderStr, interval },
    children
  )
}

// ============================================================================
// TableParamsContext - Provides table filters to children
// ============================================================================
const TableParamsContext = createContext<TableParamsContextValue | null>(null)

// ============================================================================
// TableParamslistener - Listens to table params changes and updates filters
// ============================================================================
interface TableParamslistenerProps {
  table?: TableData
}

const TableParamslistener: React.FC<TableParamslistenerProps> = ({ table }) => {
  const tableFilters = useContext(TableParamsContext)
  const cacheRef = useRef<string | null>(null)
  const setFilters = use('model.setter', 'where', 'filters')
  const { getQueryFilter } = use('queryEditor.methods')

  // 精简: 移除 useMemo，直接使用计算值
  const where = getQueryFilter?.(tableFilters, table?.schema || {}) || {}

  // Cache initial where state
  useEffect(() => {
    cacheRef.current = JSON.stringify(where)
  }, [where])

  // 精简: 使用 useCallback 包装 clearWhere 逻辑
  const clearWhere = use('model.callback', useCallback((get: any, set: any, atoms: any, clearKeys: string[]) => {
    const oldWhere = get(atoms.wheres)
    const initFilters = oldWhere?.initFilters || {}
    set(atoms.wheres, { ...oldWhere, initFilters: _.omit(initFilters, clearKeys) })
  }, []), [])

  useEffect(() => {
    const currentWhereStr = JSON.stringify(where)
    if (currentWhereStr === cacheRef.current) return

    // Clear old filters if cache exists
    if (cacheRef.current != null) {
      try {
        const cacheWhere = JSON.parse(cacheRef.current)
        const clearKeys = Object.keys(cacheWhere)
        if (clearKeys.length > 0) {
          clearWhere(clearKeys)
        }
      } catch {
        // Ignore parse errors
      }
    }

    setFilters?.(where)
    cacheRef.current = null
  }, [where, setFilters, clearWhere])

  return null
}

// ============================================================================
// TableModel - Wraps children with data context and manages field state
// ============================================================================
interface TableModelProps {
  data: TableData
  tags?: any[]
  tableFilters?: TableFilter[]
  children?: React.ReactNode
  output?: boolean
  subscribe?: boolean
  ctxTable?: TableRef
  cellKey?: string
  dashboardMode?: boolean
  interval?: number
  renderStr?: string
}

const TableModel: React.FC<TableModelProps> = ({
  data,
  tags = [],
  tableFilters,
  children,
  output,
  subscribe,
  ctxTable,
  cellKey,
  dashboardMode = false,
  interval,
  renderStr = ''
}) => {
  const getChildrenCells = use('cell.structure.children.get')

  const [fields, setFields] = useState<any[] | null>(null)
  const [cacheFields, setCacheFields] = useState<any>(null)
  const [childrenMountedListener, setChildrenMountedListener] = useState<MountedListener>({})

  // Enable cache fields for model
  data.cacheFields = cacheFields

  const table_params = data?.table_params

  // 精简: 使用 useMemo 缓存子组件
  const subComponents = useMemo(() => ({
    up: React.createElement(ViewUpdateVar, { cellKey }),
    evs: React.createElement(ViewMountEvents, { cellKey }),
    intervalUpload: interval ? React.createElement(IntervalUploadView, { interval }) : null
  }), [cellKey, interval])

  const paramsString = useMemo(
    () => dashboardMode ? JSON.stringify(table_params) : null,
    [dashboardMode, table_params]
  )

  // Set mounted listener callback - 精简: 简化 setState 逻辑
  const setMountedListener = useCallback((key: string) => {
    setChildrenMountedListener(prev => ({ ...prev, [key]: true }))
  }, [])

  // Initialize mounted listeners for child data table components
  useEffect(() => {
    const DATA_TABLE_TYPE = 'View.DataTable'
    if (typeof getChildrenCells !== 'function') return

    getChildrenCells(cellKey).then((res: any[]) => {
      const mountedListener: MountedListener = {}
      res?.forEach((f: any) => {
        if (f.type === DATA_TABLE_TYPE) {
          mountedListener[f.cellKey] = false
        }
      })
      setChildrenMountedListener(mountedListener)
    })
  }, [cellKey, getChildrenCells])

  // 精简: 简化 fieldIds 计算
  const fieldIds = useMemo(
    () => [
      fields?.map(f => f._id).join('-'),
      JSON.stringify(table_params),
      renderStr,
      output ? 'output' : ''
    ].join('|'),
    [fields, table_params, renderStr, output]
  )

  // 精简: 合并计算逻辑
  const { modelChildrenReady, qrender } = useMemo(() => ({
    modelChildrenReady: Object.values(childrenMountedListener).every(v => v === true),
    qrender: (cellKey?.indexOf('_r') ?? -1) > 0
  }), [childrenMountedListener, cellKey])

  // Memoize the model component
  const memoModel = useMemo(() => {
    return React.createElement(
      C,
      { is: 'Table.ParamsModel', key: fieldIds, table: data, tags, fields: fields || [] },
      React.createElement(DataContextProvider, { cellKey, ctxTable, children }),
      output && subComponents.up,
      subComponents.evs,
      subComponents.intervalUpload,
      React.createElement(TableParamslistener, { table: data }),
      subscribe && React.createElement(TableRecordsubscribe, { table: data })
    )
  }, [paramsString, output, subscribe, ctxTable?.id, interval, fieldIds, JSON.stringify(fields), cacheFields, data, tags, fields, cellKey, ctxTable, children, subComponents, subscribe])

  // Context value - 精简: 移除不必要的 useMemo (setters 是稳定的)
  const contextValue = { setFields, setCacheFields, setMountedListener }

  // Rendered content - 精简: 简化条件渲染
  const renderedContent = (dashboardMode || modelChildrenReady || qrender)
    ? memoModel
    : React.createElement('div', { style: { opacity: 0 } }, children)

  return React.createElement(
    TableParamsContext.Provider,
    { value: { tableFilters: tableFilters } }, // 精简: 直接传递对象而不是条件判断
    React.createElement(DataViewContext.Provider, { value: contextValue }, renderedContent)
  )
}

export default TableView
