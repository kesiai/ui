import React from 'react'
import { TableModel, Model } from '@kesi/client'
import trans from '@/registry/lib/schema-trans'
import type { ModelSchema } from '@/registry/lib/model-types'
import {
  DEFAULT_PERSIST_SEGMENTS,
  ViewStateProvider,
  ViewStateSaver,
  composeViewStateKey,
  resolveViewStateStorage,
  resolveViewStateUserId,
  validateSnapshot,
  withRestoreTimeout,
  type ViewStatePersistenceConfig,
  type ViewStateSnapshot,
  type ViewStateStorage
} from '@/registry/lib/view-state'

interface TableFilter {
  [key: string]: any
}

interface TableRef {
  id: string | number
  [key: string]: any
}

type ViewModelProps = {
  tableId?: string
  modelName?: string
  loadingComponent?: React.ReactNode,
  initQuery?: boolean,
  children?: React.ReactNode
  table?: TableRef
  isSchemaTransform?: boolean

  queryFields?: string[]
  projectAll?: boolean
  limit?: number
  /** mongo 风格排序（1 升 / -1 降），与 fieldOrder 等价，后设置者生效 */
  sort?: Record<string, 1 | -1>
  tableFilters?: TableFilter
  fieldOrder?: Record<string, 'asc' | 'desc'>[]
  interval?: number
  /**
   * 视图状态持久化：缓存过滤器/分页(limit+skip)/排序/列显示/列宽。
   * channel 'local'（浏览器）| 'remote'（数据库）二选一；快照为 delta，
   * 未调整的段落回退到建表配置默认值。
   */
  statePersistence?: ViewStatePersistenceConfig
}

const ViewModel = ({ tableId, modelName, children, initQuery, loadingComponent,
  queryFields, projectAll,
  limit, sort,
  tableFilters,
  fieldOrder,
  interval,
  isSchemaTransform,
  statePersistence,
}: ViewModelProps) => {
  const [initialValues, setInitialValues] = React.useState<any | null>(null)
  const [restored, setRestored] = React.useState<ViewStateSnapshot | null>(null)
  const restoredRef = React.useRef<string | null>(null)

  const persistenceConfig = statePersistence && statePersistence.enabled !== false ? statePersistence : null

  // 存储适配器：按稳定签名解析，避免内联配置对象导致的重建
  const storageSignature = persistenceConfig
    ? [
        persistenceConfig.channel ?? 'local',
        persistenceConfig.storage ? 'custom' : '',
        persistenceConfig.remote?.tableId ?? '',
        persistenceConfig.remote?.loader ? 'l' : '',
        persistenceConfig.remote?.saver ? 's' : ''
      ].join('|')
    : ''
  const storage = React.useMemo<ViewStateStorage | null>(
    () => (persistenceConfig ? resolveViewStateStorage(persistenceConfig) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storageSignature]
  )

  const viewKeyBase = persistenceConfig?.viewKey || tableId || modelName || ''
  const viewKey = React.useMemo(
    () => (viewKeyBase ? composeViewStateKey(viewKeyBase, resolveViewStateUserId(persistenceConfig?.userId)) : ''),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewKeyBase, persistenceConfig?.userId]
  )
  const persistKey = persistenceConfig?.persist?.join(',') ?? ''

  React.useEffect(() => {
    let cancelled = false

    const buildValues = () => {
      const values = {} as any
      if (queryFields && queryFields.length > 0) {
        values['fields'] = queryFields
      }
      if (projectAll) {
        values['projectAll'] = true
      }
      if (limit) {
        values['limit'] = limit
      }
      if (sort) {
        const orderObj: Record<string, 'ASC' | 'DESC'> = {}
        Object.entries(sort).forEach(([key, val]) => {
          orderObj[key] = val === -1 ? 'DESC' : 'ASC'
        })
        values['order'] = orderObj
      }
      if (tableFilters) {
        values['wheres'] = { tableFilters }
      }
      if (fieldOrder && fieldOrder.length > 0) {
        const orderObj: Record<string, 'ASC' | 'DESC'> = {}
        fieldOrder.forEach(obj => {
          Object.entries(obj).forEach(([key, val]) => {
            orderObj[key] = val.toUpperCase() as 'ASC' | 'DESC'
          })
        })
        values['order'] = orderObj
      }
      return values
    }

    // 合并快照到 props 默认值（快照优先；列状态列在 ViewDataTable 内二次校验后应用）
    const apply = (snapshot: ViewStateSnapshot | null, isRestore: boolean) => {
      const values = buildValues()
      const persist = persistenceConfig?.persist ?? DEFAULT_PERSIST_SEGMENTS
      if (snapshot) {
        if (persist.includes('filter') && snapshot.filter) {
          values['wheres'] = { ...(values['wheres'] || {}), filter: snapshot.filter }
        }
        if (persist.includes('pagination') && snapshot.pagination) {
          values['limit'] = snapshot.pagination.limit
          values['skip'] = snapshot.pagination.skip
        }
        if (persist.includes('order') && snapshot.order) {
          values['order'] = { ...(values['order'] || {}), ...snapshot.order }
        }
      }
      if (isRestore) {
        restoredRef.current = viewKey
        setRestored(snapshot)
        persistenceConfig?.onRestored?.(snapshot)
      }
      setInitialValues(values)
    }

    if (!storage || !viewKey || restoredRef.current === viewKey) {
      apply(null, false)
      return
    }

    withRestoreTimeout(
      storage.load(viewKey),
      persistenceConfig?.restoreTimeout ?? 2000,
      null
    ).then(raw => {
      if (cancelled) return
      apply(validateSnapshot(raw), true)
    })

    return () => { cancelled = true }
  }, [queryFields, projectAll, limit, sort, tableFilters, fieldOrder, interval, storage, viewKey, persistKey])

  const schemaTransform = (model: ModelSchema) => {
    const { schema, formSchema, tableSchema, filterSchema } = trans(model as any)

    return {
      atoms: model.atoms,
      ...schema,
      formSchema,
      tableSchema,
      filterSchema
    }
  }

  if (initialValues === null) {
    return null
  }

  // 持久化上下文：向下传递配置/恢复值，Saver 订阅 atoms 防抖写回
  const persistEnabled = Boolean(storage && viewKey)
  const withPersistence = (children: React.ReactNode) => persistEnabled ? (
    <ViewStateProvider value={{ config: persistenceConfig!, storage: storage!, viewKey, restored }}>
      {children}
      <ViewStateSaver />
    </ViewStateProvider>
  ) : children

  if (modelName) {
    return (
      <Model name={modelName} schemaTransform={isSchemaTransform ? schemaTransform : undefined} key={`table-model-view-${modelName}`} initialValues={initialValues}>
        {withPersistence(children)}
      </Model>
    )
  } else if (tableId) {
    return (
      <TableModel tableId={tableId} key={`table-model-view-${tableId}`} schemaTransform={isSchemaTransform ? schemaTransform : undefined} loadingComponent={loadingComponent} initQuery={initQuery} initialValues={initialValues}>
        {withPersistence(children)}
      </TableModel>
    )
  } else {
    return null
  }
}

export { ViewModel }
