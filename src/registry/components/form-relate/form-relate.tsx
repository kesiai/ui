import * as React from 'react'
import { FormRelate as FormRelateComponent } from '@/registry/components/form-relate-component/form-relate-component'
import RelateSelect from '@/registry/components/form-relate-select/form-relate-select'
import RelateMultiSelect from '@/registry/components/form-relate-multi-select/form-relate-multi-select'
import RelateModelSelect from '@/registry/components/form-relate-model-select/form-relate-model-select'
import type { RelateFieldProps } from '@/registry/lib/form-relate-types'

/**
 * FormRelate - 关联字段容器组件
 * 根据 field.schema 配置自动分发到对应的子组件：
 * - FormRelateComponent: 内部表关联 (internalTable=true)
 * - RelateSelect: 外部工作表单选 (默认单选)
 * - RelateMultiSelect: 外部工作表多选 (selectType='multiple')
 * - RelateModelSelect: 弹窗表格选择 (有 relateShowFields)
 */
const FormRelate: React.FC<RelateFieldProps> = (props) => {
  const { field = {}, schema, value, onChange, meta, record, disabled, label } = props

  const input = { value, onChange }

  // 判断是否为内部表关联
  const isInternalTable = schema.internalTable !== false

  // 获取选择类型
  const selectType = schema.selectType || 'single'

  // 判断是否有多个展示字段（使用弹窗表格选择器）
  const hasMultiFields = schema.relateShowFields && schema.relateShowFields.length > 0

  // 判断是否为详情展示模式
  const isDetailShow = schema.recordSelectType === 'show'

  // ==================== 分发逻辑 ====================

  // 1. 详情展示模式
  if (isDetailShow) {
    // TODO: 如果需要支持 DetailShow，可以在这里处理
    // 目前返回 null，由调用方处理
    return null
  }

  // 2. 内部表关联 - 使用 FormRelateComponent
  if (isInternalTable) {
    return (
      <FormRelateComponent
        input={input}
        field={field}
        meta={meta}
        record={record}
        disabled={disabled}
      />
    )
  }

  // 3. 外部表关联 - 根据是否有多字段和选择类型分发

  // 3.1 有多个展示字段 - 使用弹窗表格选择器
  if (hasMultiFields) {
    // 构建完整的 field 对象传给 RelateModelSelect
    const modelSelectField = {
      ...field,
      schema: {
        ...schema,
        name: schema.relate?.id ? `core/t/${schema.relate.id}/d` : undefined,
      },
      displayField: field.displayField || schema.relate?.fields?.[0]?.key || 'name',
    }

    return (
      <RelateModelSelect
        input={input}
        field={modelSelectField}
        meta={meta}
        record={record}
        disabled={disabled}
        label={label || schema.title}
        selectType={selectType}
        inputType={schema.inputType || 'select'}
        allFieldReturn={schema.allFieldReturn || false}
        insideFilter={schema.insideFilter}
      />
    )
  }

  // 3.2 多选模式 - 使用 RelateMultiSelect
  if (selectType === 'multiple') {
    const multiSelectField = {
      ...field,
      displayField: field.displayField || schema.relate?.fields?.[0]?.key || 'name',
      schema: {
        ...schema,
        name: schema.relate?.id ? `core/t/${schema.relate.id}/d` : undefined,
      },
    }

    return (
      <RelateMultiSelect
        input={input}
        field={multiSelectField}
        meta={meta}
        record={record}
        disabled={disabled}
        label={label || schema.title}
      />
    )
  }

  // 3.3 默认单选模式 - 使用 RelateSelect
  const selectField = {
    ...field,
    displayField: field.displayField || schema.relate?.fields?.[0]?.key || 'name',
    schema: {
      ...schema,
      name: schema.relate?.id ? `core/t/${schema.relate.id}/d` : undefined,
    },
  }

  return (
    <RelateSelect
      input={input}
      field={selectField}
      meta={meta}
      record={record}
      disabled={disabled}
      label={label || schema.title}
    />
  )
}

export { FormRelate }