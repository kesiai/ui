import React from 'react'
import { TableModel, Model } from '@airiot/client'

interface TableFilter {
  [key: string]: any
}

interface TableRef {
  id: string | number
  [key: string]: any
}

type TableViewProps = {
  tableId?: string
  modelName?: string
  loadingComponent?: React.ReactNode, 
  initQuery?: boolean, 
  children?: React.ReactNode
  table?: TableRef

  queryFields?: string[]
  projectAll?: boolean
  limit?: number
  tableFilters?: TableFilter[]
  fieldOrder?: Record<string, 'asc' | 'desc'>[]
  interval?: number
}

const TableView = ({ tableId, modelName, children, initQuery, loadingComponent,
  queryFields, projectAll,
  limit,
  tableFilters,
  fieldOrder,
  interval
 }: TableViewProps) => {
  const [ initialValues, setInitialValues ] = React.useState<any | null>(null)

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
      values['order'] = fieldOrder
    }
    setInitialValues(values)
  }, [queryFields, projectAll, limit, tableFilters, fieldOrder, interval])

  if(initialValues === null) {
    return null
  } else if (modelName) {
    return (
      <Model name={modelName} key={`table-model-view-${modelName}`} initialValues={initialValues}>
        {children}
      </Model>
    )
  } else if (tableId) {
    return (
      <TableModel tableId={tableId} key={`table-model-view-${tableId}`} loadingComponent={loadingComponent} initQuery={initQuery} initialValues={initialValues}>
        {children}
      </TableModel>
    )
  } else {
    return null
  }
}

export default TableView
