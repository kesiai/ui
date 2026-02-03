import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { TableFieldTableView } from './table-field-table-view'
import type { TableFieldTableViewColumn } from './table-field-table-view'
import TableFieldEditableCard from './table-field-editable-card'

export interface TableFieldEditableTableProps {
  input?: {
    value?: any[]
    onChange?: (value: any[] | null) => void
    name?: string
  }
  schema?: {
    key?: string
    disabled?: boolean
    minCount?: number
    maxCount?: number
    tableFields?: {
      form?: string[]
      properties?: Record<string, any>
    }
    defaultVal?: any[]
    displayForm?: 'grid' | 'card'
    uniqueFields?: string[]
    uniqueRow?: boolean
    fieldRules?: {
      errorNotice?: any[]
    }
    showPagination?: boolean
    btnText?: Record<string, string>
    // 权限控制
    createAddBtn?: {
      show?: boolean
      userRange?: string
      users?: any[]
      roles?: any[]
    }
    editAddBtn?: {
      show?: boolean
      userRange?: string
      users?: any[]
      roles?: any[]
    }
    createDelBtn?: {
      show?: boolean
      userRange?: string
      users?: any[]
      roles?: any[]
    }
    editDelBtn?: {
      show?: boolean
      userRange?: string
      users?: any[]
      roles?: any[]
    }
    cardLayout?: '1' | '2' | '3'
  }
  batchOption?: boolean
  inline?: boolean
  option?: {
    form?: {
      getState?: () => {
        values?: any
      }
    }
  }
  meta?: {
    submitFailed?: boolean
  }
  record?: any
  antdForm?: any
}

const TableFieldEditableTable: React.FC<TableFieldEditableTableProps> = (props) => {
  const { input, schema, meta } = props
  const { onChange, value = [] } = input || {}
  const [dataSource, setDataSource] = React.useState<any[]>(value || schema?.defaultVal || [])
  const [selectedRows, setSelectedRows] = React.useState<any[]>([])

  // 同步外部 value 变化
  React.useEffect(() => {
    if (input?.value !== undefined) {
      setDataSource(input.value || [])
    }
  }, [input?.value])

  // 批量删除
  const handleBatchDelete = () => {
    const data = dataSource.filter((item) => !selectedRows.some(row => row?.key === item?.key))
    setDataSource(data)
    setSelectedRows([])
    onChange?.(data.length ? data : null)
  }

  // 添加新行
  const handleAdd = () => {
    const newData = { key: Date.now() }
    const newDataArray = [...dataSource, newData]
    setDataSource(newDataArray)
    onChange?.(newDataArray)
  }

  // 构建列配置
  const columns: TableFieldTableViewColumn[] = React.useMemo(() => {
    const tableFields = schema?.tableFields
    if (!tableFields?.form) return []

    const form = tableFields.form
    const properties = tableFields.properties || {}

    return form.map((key: string) => {
      const item = properties[key] || {}
      return {
        key: item.key || key,
        dataIndex: item.key || key,
        title: (
          <span>
            {item.need && <span className="text-destructive mr-1">*</span>}
            {item.title || key}
          </span>
        ),
        schema: item,
        editable: true,
        width: item.fieldType === 'attachments' ? 270 : 200,
      }
    })
  }, [schema?.tableFields])

  if (!columns || columns.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4">
        表格没有配置任何字段，请先配置字段
      </div>
    )
  }

  const displayForm = schema?.displayForm || 'grid'
  const canAdd = !schema?.maxCount || dataSource.length < schema.maxCount
  const canDelete = !schema?.minCount || dataSource.length > schema.minCount

  const tableProps = {
    input: { value: dataSource, onChange, name: input?.name },
    schema,
    columns,
    selectedRows,
    setSelectedRows,
    setDataSource,
    setErrors: () => {}, // TODO: 实现错误处理
    meta,
    record: props.record,
  }

  return (
    <div id={`EditTable-${schema?.key}`} className="w-full">
      {/* 添加按钮 */}
      {canAdd && (
        <Button
          onClick={handleAdd}
          type="button"
          variant="default"
          size="sm"
          disabled={schema?.disabled}
          className="mb-2"
        >
          <Plus className="h-4 w-4 mr-1" />
          {schema?.btnText?.add || '添加新行'}
        </Button>
      )}

      {/* 批量删除按钮 */}
      {displayForm === 'grid' && canDelete && (
        <Button
          onClick={handleBatchDelete}
          variant="outline"
          size="sm"
          disabled={schema?.disabled || selectedRows.length === 0}
          className="mb-2 ml-2"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          删除
        </Button>
      )}

      {/* 表格或卡片显示 */}
      {displayForm === 'card' ? (
        <TableFieldEditableCard {...tableProps} />
      ) : (
        <TableFieldTableView {...tableProps} />
      )}
    </div>
  )
}

export { TableFieldEditableTable }
export default TableFieldEditableTable
