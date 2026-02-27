import * as React from 'react'
import FormRelatePlusDataSelect from './form-relate-plus-data-select'
import FormRelatePlusAddRecordBtn from './form-relate-plus-add-record-btn'
import FormRelatePlusDataShow from './form-relate-plus-data-show'

export interface FormRelatePlusProps {
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
  value?: any
  onChange?: (value: any) => void
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

const FormRelatePlus: React.FC<FormRelatePlusProps> = (props) => {
  const input = props.input || { value: props.value, onChange: props.onChange }
  // 只传递需要的属性给子组件
  const dataSelectProps: any = {
    relateSchema: props.relateSchema,
    tableID: props.tableID,
    input,
    field: props.field,
    meta: props.meta,
  }

  const addRecordBtnProps = {
    relateSchema: props.relateSchema,
    tableID: props.tableID,
    input: props,
    meta: props.meta,
  }

  const dataShowProps = {
    relateSchema: props.relateSchema,
    input: props,
    field: props.field,
    schema: props.schema,
  }

  if (!props.relateSchema) {
    return <div className="text-sm text-red-500">关联字段配置错误：缺少 relateSchema</div>
  }
  return (
    <div className="flex flex-col items-stretch w-full gap-2">
      <div className="flex flex-row gap-2">
        <FormRelatePlusDataSelect {...dataSelectProps} />
        <FormRelatePlusAddRecordBtn {...addRecordBtnProps} />
      </div>
      <FormRelatePlusDataShow {...dataShowProps} />
    </div>
  )
}

export { FormRelatePlus }
export default FormRelatePlus
