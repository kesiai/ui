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

interface FieldProperty {
  title: string
  type: string
  key: string
  controlType: string
  need?: boolean
  size?: string
  defaultVal?: any
  dbType?: string
  decimal?: number | null
  textContent?: string
  pattern?: string
  properties?: Record<string, any>
  items?: any
  enum?: any[]
  enumNames?: any[]
  metricStore?: boolean
  relateTo?: string
  userType?: string
  relate?: any
  relateShowFields?: any
  showField?: any
  insideFilter?: any[]
  formSchema?: any[]
  accept?: string
  sort?: string
  styleType?: string
  uploadPosition?: string
  listFields?: boolean
  canOrder?: boolean
  [key: string]: any
}

interface FormSchemaItem {
  key: string
  widthInForm?: string | number
  areaType?: string
  displayForm?: string
  filterMode?: string
  format?: string
  dateFormat?: string
  linkType?: string
  showType?: string
  canEdit?: boolean
  selectFace?: string
  selectType?: string
  treeMark?: boolean
  allowAdd?: boolean
  allowSelectOld?: boolean
  count?: string
  timeFormat?: string
  showType?: string
  btnText?: Record<string, string>
  createAddBtn?: { show: boolean; userRange: string }
  createDelBtn?: { show: boolean; userRange: string }
  editAddBtn?: { show: boolean; userRange: string }
  editDelBtn?: { show: boolean; userRange: string }
  [key: string]: any
}

interface TableSchemaItem {
  key: string
  canOrder?: boolean
  listFields?: boolean
  lngLat?: boolean
  positionName?: boolean
  NullShow?: string
  listShow?: string
  [key: string]: any
}

interface FilterSchemaItem {
  key: string
  [key: string]: any
}

interface ModelRef {
  atoms: Record<string, any>
  type?: string
  title?: string
  key?: string
  properties?: Record<string, FieldProperty>
  required?: string[]
  formSchema?: FormSchemaItem[]
  tableSchema?: TableSchemaItem[]
  filterSchema?: FilterSchemaItem[]
  [key: string]: any
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

  const schemaTransform = (model: ModelRef) => {
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
      <Model name={modelName} schemaTransform={isSchemaTransform ? schemaTransform : undefined} key={`table-model-view-${modelName}`} initialValues={initialValues}>
        {children}
      </Model>
    )
  } else if (tableId) {
    return (
      <TableModel tableId={tableId} key={`table-model-view-${tableId}`} schemaTransform={isSchemaTransform ? schemaTransform : undefined} loadingComponent={loadingComponent} initQuery={initQuery} initialValues={initialValues}>
        {children}
      </TableModel>
    )
  } else {
    return null
  }
}

export { ViewModel }
