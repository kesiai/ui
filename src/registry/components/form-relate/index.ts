/**
 * 关联字段组件导出
 * 支持多种关联方式：
 * - FormRelate: 内部表关联
 * - RelateSelect: 外部工作表单选
 * - RelateMultiSelect: 外部工作表多选
 * - RelateModelSelect: 弹窗表格选择（支持多字段展示）
 * - AsyncSelect: 异步选择器基础组件
 * - DetailShow: 详情展示组件
 */

// 基础组件
export { default as AsyncSelect } from './AsyncSelect'
export { default as FormRelate } from './RelateComponent'
export { default as RelateSelect } from './RelateSelect'
export { default as RelateMultiSelect } from './RelateMultiSelect'
export { default as RelateModelSelect } from './RelateModelSelect'
export { default as DetailShow } from './DetailShow'

// 向后兼容的导出（旧名称）
export { default as RelateComponent } from './RelateComponent'

// 工具函数 - 同时导入和导出
import {
  findRelateKeyInTableSchema,
  findTreeNode,
  getQueryFilter,
  dealFilter,
  fieldRender,
  getFormState,
  getFormValues,
} from './utils'

export {
  findRelateKeyInTableSchema,
  findTreeNode,
  getQueryFilter,
  dealFilter,
  fieldRender,
  getFormState,
  getFormValues,
}

// 类型定义
export type {
  RelateFieldProps,
  AsyncSelectProps,
  RelateFieldOption,
} from './types'

// 字段类型映射 - 用于 form-widget
export const relateFieldTypeMapping = {
  // 外部表，无多字段，多选
  relate_multi_select: {
    component: 'RelateMultiSelect',
  },
  // 外部表，无多字段，单选
  relate_fkselect: {
    component: 'RelateSelect',
  },
  // 外部表，多字段
  relate_list_fkselect: {
    component: 'RelateModelSelect',
  },
}

/**
 * Schema 转换器
 * 将关联字段的 schema 转换为组件可用的格式
 */
export const schemaConverter = (
  schema: any,
  options?: { tableSchema?: any }
): {
  type: string
  schema: { name: string }
  fieldSchema?: any
  relateSchema: any
  tableID: string
  displayField: string
  relateTableName: string
  insideFilter?: any
  relateShowFields?: any[]
  selectType?: 'single' | 'multiple'
  key?: string
} | null => {
  if (
    !['object', 'array'].includes(schema.type) ||
    !schema.relate?.id ||
    schema.recordSelectType
  ) {
    return null
  }

  const relate = schema.relate
  const relateShowFields = schema.relateShowFields
  const id = relate.id
  const fieldSchema = relate.fields?.[0]?.fieldSchema

  const result: any = {
    type: schema.selectType === 'multiple' ? 'relate_multi_select' : 'relate_fkselect',
    schema: { name: `core/t/${id}/d` },
    fieldSchema,
    relateSchema: schema,
    tableID: id,
    displayField: relate.fields?.[0]?.key || 'name',
    relateTableName: id,
    insideFilter: schema.insideFilter,
  }

  // 使用 findRelateKeyInTableSchema 查找关联键
  if (options?.tableSchema) {
    const relateKey = findRelateKeyInTableSchema(options.tableSchema, relate.id)
    if (relateKey) {
      result.key = relateKey
    }
  }

  // 多字段
  if (relateShowFields && relateShowFields.length > 0) {
    result.type = 'relate_list_fkselect'
    result.relateShowFields = relateShowFields
    result.selectType = schema.selectType
  }

  return result
}
