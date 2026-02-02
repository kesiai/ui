import * as React from 'react'
import DataSelect from './DataSelect'
import AddRecordBtn from './AddRecordBtn'
import DataShow from './DataShow'

export interface RelateComponentPlusProps {
  relateSchema: {
    relateTo?: string
    relate?: {
      id?: string
    }
    recordSelectType?: 'select' | 'modal'
    selectType?: 'single' | 'multiple'
    showType?: 'select' | 'card' | 'table'
    showField?: string
    allowAdd?: boolean
    editDisabled?: boolean
    createDisabled?: boolean
    relateShowFields?: Array<{
      key: string
      title: string
      fieldSchema?: any
    }>
  } & Record<string, any>
  tableID?: string
  input?: {
    value?: any
    onChange?: (value: any) => void
  }
  field?: {
    schema?: Record<string, any>
    displayField?: string
    relateShowFields?: Array<{
      key: string
      title: string
      fieldSchema?: any
    }>
  }
  meta?: {
    data?: {
      disabled?: boolean
    }
  }
  schema?: {
    name?: string
  }
}

const RelateComponentPlus: React.FC<RelateComponentPlusProps> = (props) => {
  // 只传递需要的属性给子组件
  const dataSelectProps: any = {
    relateSchema: props.relateSchema,
    tableID: props.tableID,
    input: props.input,
    field: props.field,
    meta: props.meta,
  }

  const addRecordBtnProps = {
    relateSchema: props.relateSchema,
    tableID: props.tableID,
    input: props.input,
    meta: props.meta,
  }

  const dataShowProps = {
    relateSchema: props.relateSchema,
    input: props.input,
    field: props.field,
    schema: props.schema,
  }

  return (
    <div className="flex flex-col items-stretch w-full gap-2">
      <div className="flex flex-row gap-2">
        <DataSelect {...dataSelectProps} />
        <AddRecordBtn {...addRecordBtnProps} />
      </div>
      <DataShow {...dataShowProps} />
    </div>
  )
}

export default RelateComponentPlus
