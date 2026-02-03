import * as React from 'react'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import { createAPI } from '@airiot/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { fieldRender } from '@/components/tableField/components/relate/utils'

export interface DataShowProps {
  relateSchema: {
    showType?: 'select' | 'card' | 'table'
    relateShowFields?: Array<{
      key: string
      title: string
      fieldSchema?: any
    }>
    showField?: string
    relate?: {
      id?: string
    }
    relateTo?: string
  } & Record<string, any>
  input?: {
    value?: any
  }
  field?: {
    displayField?: string
    relateShowFields?: Array<{
      key: string
      title: string
      fieldSchema?: any
    }>
  }
  schema?: {
    name?: string
  }
  val?: any
}

// Parse JSON strings in nested data
function parseJsonStrings(data: any): any {
  if (!data) return data

  const processValue = (value: any): any => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)
        if (typeof parsed === 'object' && parsed !== null) {
          return processValue(parsed)
        }
        return value
      } catch {
        return value
      }
    }

    if (isArray(value)) {
      return value.map(item => processValue(item))
    }

    if (isObject(value)) {
      Object.keys(value).forEach(key => {
        ;(value as Record<string, any>)[key] = processValue((value as Record<string, any>)[key])
      })
      return value
    }

    return value
  }

  return processValue(JSON.parse(JSON.stringify(data)))
}

// Single item display in card format
const ItemShow: React.FC<{
  relateSchema: DataShowProps['relateSchema']
  val: any
  field?: DataShowProps['field']
  detailPage?: boolean
}> = ({ relateSchema, val, field, detailPage }) => {
  const displayField = field?.displayField || relateSchema.showField || 'name'
  const showFields = relateSchema.relateShowFields || []

  if (detailPage) {
    return (
      <Card className="inline-block w-[500px] mr-[5px] mt-[5px] bg-muted/50 rounded-md">
        <CardContent className="p-4">
          <div className="grid grid-cols-[5fr_19fr] gap-2 text-sm">
            <div className="text-muted-foreground">记录编号：</div>
            <div>{val.id}</div>
            {showFields.map((f) => (
              <React.Fragment key={f.key}>
                <div className="text-muted-foreground">{f.title}：</div>
                <div>
                  {fieldRender(val[f.key], f.fieldSchema)}
                </div>
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (showFields.length > 0) {
    return (
      <Card className="inline-block w-[calc(50%-5px)] mr-[5px] mt-[5px] bg-muted/50 rounded-md">
        <CardContent className="p-3">
          <div className="mb-2">{val[displayField]}</div>
          {showFields.map((f) => (
            <div key={f.key} className="text-xs text-muted-foreground grid grid-cols-[4fr_18fr] gap-1">
              <span>{f.title}：</span>
              <span>
                {fieldRender(val[f.key], f.fieldSchema)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground mr-1 mt-1">
      {val[displayField]}
    </span>
  )
}

// Table display format
const TableShow: React.FC<DataShowProps> = (props) => {
  const { relateSchema, field, val } = props
  const tableID = relateSchema?.relate?.id

  const [loading, setLoading] = React.useState(true)
  const [tableSchema, setTableSchema] = React.useState<any>(null)

  React.useEffect(() => {
    if (tableID) {
      const schemaAPI = createAPI({
        resource: 'core/t/schema',
        name: 'schema'
      })

      schemaAPI.get(tableID)
        .then(({ schema }: any) => {
          setTableSchema(schema)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [tableID])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!tableSchema) {
    return null
  }

  if (!tableSchema?.fields?.length) {
    return <div className="text-sm text-muted-foreground py-2">请从右侧属性配置中选择显示字段</div>
  }

  const displayField = field?.displayField || relateSchema.showField || 'name'
  const showFields = field?.relateShowFields || relateSchema.relateShowFields || []
  const columns = [displayField, relateSchema.showField, ...showFields.map((f: any) => f.key)]
    .filter(Boolean)

  return (
    <div className="w-full mt-2">
      <div className="border rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((col: string) => (
                <th key={col} className="px-3 py-2 text-left font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {val?.map((item: any, index: number) => (
              <tr key={item.id || index} className="border-t">
                {columns.map((col: string) => (
                  <td key={col} className="px-3 py-2">
                    {fieldRender(item[col], tableSchema.fields.find((f: any) => f.key === col))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Main DataShow component
const DataShow: React.FC<DataShowProps> = (props) => {
  const { relateSchema, input } = props
  const [expand, setExpand] = React.useState(false)

  if (relateSchema.showType === 'select') {
    return null
  }

  if (relateSchema.showType === 'card') {
    const value = input?.value
    const parsedValue = parseJsonStrings(value)

    if (isArray(parsedValue)) {
      const items = parsedValue.length > 6 && !expand ? parsedValue.slice(0, 6) : parsedValue

      return (
        <div className="mt-2 space-y-1">
          {items?.map((v) => (
            <ItemShow key={v.id} {...props} val={v} />
          ))}
          {parsedValue?.length > 6 && !expand && (
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => setExpand(true)}
              className="text-primary"
            >
              展开更多（共{parsedValue.length}条）
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          )}
          {parsedValue?.length > 6 && expand && (
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => setExpand(false)}
              className="text-primary"
            >
              收起（共{parsedValue.length}条）
              <ChevronUp className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      )
    }

    if (parsedValue) {
      return (
        <div className="mt-2">
          <ItemShow {...props} val={parsedValue} />
        </div>
      )
    }

    return null
  }

  if (relateSchema.showType === 'table') {
    return <TableShow {...props} val={parseJsonStrings(input?.value)} />
  }

  return null
}

export default DataShow
