import React from 'react'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import { Table as TableIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { tableConverter } from '@/registry/lib/view-table-converter'

// 卡片展示组件
const CardComponent = ({
  value,
  schema,
  tableSchema,
}: {
  value: any[]
  schema: any
  tableSchema: any
}) => {
  const { tableFields, cardLayout, defaultVal } = schema || {}
  const cardValue = value || defaultVal || []

  if (!isArray(cardValue) || cardValue.length === 0) {
    return <span className="text-muted-foreground">暂无数据</span>
  }

  const FieldComponent = tableConverter(schema, tableSchema)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cardValue.map((item: any, index: number) => (
        <div
          key={index}
          className={cardLayout === '1' ? 'col-span-full' : cardLayout === '2' ? 'col-span-1' : 'col-span-1'}
        >
          <div className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
            {tableFields?.form?.map((key: string) => {
              const fieldSchema = tableFields.properties?.[key]
              if (!fieldSchema) return null

              return (
                <div key={key} className="mb-2 last:mb-0">
                  <label className="text-sm font-medium text-muted-foreground">
                    {fieldSchema.title || key}
                  </label>
                  <div className="mt-1">
                    <FieldComponent
                      value={item?.[key]}
                      schema={fieldSchema}
                      inList={true}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// 表格展示组件
const TableComponent = ({
  value,
  schema,
  tableSchema,
}: {
  value: any[]
  schema: any
  tableSchema: any
}) => {
  const { tableFields } = schema || {}

  if (!isArray(value) || value.length === 0) {
    return <span className="text-muted-foreground">暂无数据</span>
  }
  const FieldComponent = tableConverter(schema, tableSchema)

  // 构建列配置
  const columns = tableFields?.form?.map((key: string) => {
    const fieldSchema = tableFields.properties?.[key]
    return {
      key: fieldSchema?.key || key,
      dataIndex: fieldSchema?.key || key,
      title: fieldSchema?.title || key,
      width: fieldSchema?.fieldType === 'attachments' ? 270 : 150,
      fieldType: fieldSchema?.fieldType,
      fieldSchema,
    }
  }) || []

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-slate-200 dark:border-slate-700">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800">
            {columns.map((col: { key: React.Key | null | undefined; width: any; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined }) => (
              <th
                key={col.key}
                className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-left text-sm font-medium"
                style={{ width: col.width }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {value.map((row: any, rowIndex: number) => (
            <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              {columns.map((col: {
              key: React.Key | null | undefined;
              dataIndex: string;
              title: string;
              width: number;
              fieldType?: string;
              fieldSchema?: any;
              }) => (
              <td
                key={col.key}
                className="border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm"
              >
                <FieldComponent
                value={row?.[col.dataIndex]}
                schema={col.fieldSchema}
                inList={true}
                />
              </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 可编辑表格展示（主组件）
const EditableTable = ({ value, schema, inList = true }: { value: any; schema?: any; inList?: boolean }) => {
  const [open, setOpen] = React.useState(false)

  // 解析 value（可能是 JSON 字符串）
  let tableValue = value
  if (isString(value)) {
    try {
      tableValue = JSON.parse(value)
    } catch (e) {
      console.error('表格数据格式问题', value)
      tableValue = []
    }
  }

  // 合并 defaultVal
  const displayValue = tableValue || schema?.defaultVal || []

  if (!isArray(displayValue) || displayValue.length === 0) {
    return <span className="text-muted-foreground">空</span>
  }

  const displayForm = schema?.displayForm || 'grid'
  const title = schema?.title || '表格内容'

  const tableSchema = {}

  // 列表中的展示（点击打开弹窗）
  if (inList) {
    return (
      <>
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
          onClick={() => setOpen(true)}
        >
          <TableIcon className="h-4 w-4" />
          <span>{displayValue.length}</span>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {displayForm === 'card' ? (
              <CardComponent value={displayValue} schema={schema} tableSchema={tableSchema} />
            ) : (
              <TableComponent value={displayValue} schema={schema} tableSchema={tableSchema} />
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // 直接展示
  return displayForm === 'card' ? (
    <CardComponent value={displayValue} schema={schema} tableSchema={undefined} />
  ) : (
    <TableComponent value={displayValue} schema={schema} tableSchema={undefined} />
  )
}

export { EditableTable }
