import React from 'react'
import { TableModel, Model } from '@airiot/client'
import trans from '@/registry/lib/schema-trans'
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
  tableFilters?: TableFilter[]
  fieldOrder?: Record<string, 'asc' | 'desc'>[]
  interval?: number
}

const ViewModel = ({ tableId, modelName, children, initQuery, loadingComponent,
  queryFields, projectAll,
  limit,
  tableFilters,
  fieldOrder,
  interval,
  isSchemaTransform,
}: ViewModelProps) => {
  const [initialValues, setInitialValues] = React.useState<any | null>(null)

  React.useEffect(() => {
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
    if (tableFilters && tableFilters.length > 0) {
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
    setInitialValues(values)
  }, [queryFields, projectAll, limit, tableFilters, fieldOrder, interval])

  const schemaTransform = (model) => {
    const { schema, formSchema, tableSchema, filterSchema } = trans(model)
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
  } else if (modelName) {
    return (
      <Model name={modelName} schemaTransform={isSchemaTransform ? schemaTransform : null} key={`table-model-view-${modelName}`} initialValues={initialValues}>
        {children}
      </Model>
    )
  } else if (tableId) {
    return (
      <TableModel tableId={tableId} key={`table-model-view-${tableId}`} schemaTransform={isSchemaTransform ? schemaTransform : null} loadingComponent={loadingComponent} initQuery={initQuery} initialValues={initialValues}>
        {children}
      </TableModel>
    )
  } else {
    return null
  }
}

export default ViewModel
