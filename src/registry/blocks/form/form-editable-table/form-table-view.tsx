import * as React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldComponentSelector } from '@/registry/components/form-widget/form-widget'

export interface FormTableViewColumn {
  key: string
  dataIndex: string
  title: React.ReactNode
  schema: any
  editable: boolean
  width?: number
  render?: (value: any, record: any) => React.ReactNode
}

export interface FormTableViewProps {
  input?: {
    value?: any[]
    onChange?: (value: any[]) => void
    name?: string
  }
  schema?: any
  columns?: FormTableViewColumn[]
  selectedRows?: any[]
  setSelectedRows?: (rows: any[]) => void
  setDataSource?: (data: any[]) => void
  setErrors?: (errors: any) => void
  meta?: any
}

const FormTableView: React.FC<FormTableViewProps> = (props) => {
  const { input, schema, columns, selectedRows, setSelectedRows } = props
  const { value = [] } = input || {}

  const handleSave = (row: any) => {
    const newValue = value.map((d: any) => (d?.key === row?.key ? row : d))
    input?.onChange?.(newValue)
  }

  const handleSelectRow = (row: any, checked: boolean) => {
    const currentSelected = selectedRows || []
    if (checked) {
      setSelectedRows?.([...currentSelected, row])
    } else {
      setSelectedRows?.(currentSelected.filter((r: any) => r?.key !== row?.key))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows?.([...value])
    } else {
      setSelectedRows?.([])
    }
  }

  const isAllSelected = value.length > 0 && (selectedRows?.length || 0) === value.length

  if (!columns || columns.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 border rounded-md">
        暂无数据
      </div>
    )
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-muted/50">
          <tr>
            {/* 总是显示复选框列 */}
            <th className="w-[50px] px-4 py-2 text-left border-b">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                disabled={schema?.disabled}
              />
            </th>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 text-left border-b" style={{ width: col.width }}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {value.length === 0 ? (
            <tr>
              <td className="px-4 py-8 text-center text-muted-foreground" colSpan={columns.length + 1}>
                暂无数据
              </td>
            </tr>
          ) : (
            value.map((record: any, rowIndex: number) => (
              <tr key={record?.key || rowIndex} className="border-b hover:bg-muted/30">
                {/* 总是显示复选框 */}
                <td className="px-4 py-2">
                  <Checkbox
                    checked={(selectedRows || []).some((r: any) => r?.key === record?.key)}
                    onCheckedChange={(checked) => handleSelectRow(record, checked as boolean)}
                    disabled={schema?.disabled}
                  />
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2">
                    {col.editable ? (
                      <EditableCell
                        schema={col.schema}
                        record={record}
                        onSave={handleSave}
                        disabled={schema?.disabled}
                      />
                    ) : (
                      <span>{record[col.dataIndex]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// 可编辑单元格
const EditableCell: React.FC<{
  schema: any
  record: any
  onSave: (row: any) => void
  disabled?: boolean
}> = ({ schema, record, onSave, disabled }) => {
  const value = record[schema.key]

  const handleChange = (newValue: any) => {
    const updatedRecord = { ...record, [schema.key]: newValue }
    onSave(updatedRecord)
  }

  return (
    <FieldComponentSelector
      schema={disabled ? { ...schema, disabled: true } : schema}
      input={{ value, onChange: handleChange }}
      meta={{}}
      record={record}
    />
  )
}

export { FormTableView }
export default FormTableView
