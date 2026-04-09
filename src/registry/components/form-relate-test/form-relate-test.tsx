import * as React from 'react'
import { FormRelate } from '@/registry/components/form-relate/form-relate'
import { FormRelatePlusAddRecordBtn } from '@/registry/components/form-relate-plus-add-record-btn/form-relate-plus-add-record-btn'
import { FormRelatePlusDataShow } from '@/registry/components/form-relate-plus-data-show/form-relate-plus-data-show'

export interface FormRelateTestProps {
  schema: {
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
}

const FormRelateTest: React.FC<FormRelateTestProps> = (props) => {

  if (!props.schema) {
    return <div className="text-sm text-red-500">关联字段配置错误：缺少 schema</div>
  }
  return (
    <div className="flex flex-col items-stretch w-full gap-2">
      <div className="flex flex-row gap-2">
        <FormRelate {...props} />
        <FormRelatePlusAddRecordBtn {...props} />
      </div>
      <FormRelatePlusDataShow {...props} />
    </div>
  )
}

export { FormRelateTest }
