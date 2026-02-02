import * as React from 'react'
import {
  RelateSelect,
  RelateMultiSelect,
  RelateModelSelect,
} from '@/components/tableField/components/relate'
import type { RelateFieldProps } from '@/components/tableField/components/relate/types'

export interface DataSelectProps extends RelateFieldProps {
  relateSchema: {
    relateTo?: string
    recordSelectType?: 'select' | 'modal'
    selectType?: 'single' | 'multiple'
    showType?: 'select' | 'card' | 'table'
    showField?: string
    allowAdd?: boolean
    editDisabled?: boolean
    createDisabled?: boolean
  } & Record<string, any>
  tableID?: string
}

const DataSelect: React.FC<DataSelectProps> = (props) => {
  const { relateSchema, tableID, meta, field, input } = props

  // Determine which select component to use
  let SelectComponent: any = RelateModelSelect
  let extraProps: Record<string, any> = {}

  // User/Role special handling would go here if needed
  // For now, we use RelateSelect/RelateMultiSelect/RelateModelSelect based on recordSelectType

  if (relateSchema.recordSelectType === 'select') {
    if (relateSchema.selectType === 'multiple') {
      SelectComponent = RelateMultiSelect
    } else {
      SelectComponent = RelateSelect
    }
  } else if (relateSchema.recordSelectType === 'modal') {
    SelectComponent = RelateModelSelect
    // Set input type to button for card/table show types
    if (['card', 'table'].includes(relateSchema.showType || '')) {
      extraProps.inputType = 'button'
    }
    extraProps.selectType = relateSchema.selectType
  }

  // Handle disabled state
  const isDisabled = meta?.data?.disabled ?? relateSchema.editDisabled ?? false

  if (isDisabled) {
    extraProps.disabled = true
    extraProps.relateSchema = {
      ...relateSchema,
      editDisabled: true,
      createDisabled: true,
    }
  }

  // 构建 field props，确保包含必要的 schema 信息
  const selectProps: any = {
    input,
    meta,
    field: {
      ...field,
      // 为 AsyncSelect 提供带 name 的 schema（与 schemaConverter 的格式一致）
      schema: tableID ? { name: `core/t/${tableID}/d` } : relateSchema,
      displayField: relateSchema.relate?.fields?.[0]?.key || relateSchema.showField || 'name',
      tableID,
      relateShowFields: relateSchema.relateShowFields,
    },
    ...extraProps,
  }

  return (
    <div className="flex flex-row w-full gap-2">
      <SelectComponent {...selectProps} />
    </div>
  )
}

export default DataSelect
