import * as React from 'react'
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import { AsyncSelect } from '@/registry/components/form-relate-async-select/form-relate-async-select'

export interface FormRelateProps {
  input?: {
    value?: any
    onChange?: (value: any) => void
  }
  field?: {
    schema?: Record<string, any> | undefined
    filter?: any
    meta?: any
    key?: string | undefined
    displayField?: string | undefined
    tableID?: string | undefined
    relateShowFields?: any
    option?: any
    internalTable?: boolean
  }
  meta?: any
  record?: any
  disabled?: boolean
  /**
   * 外部传入的过滤器对象
   * 组件变为纯组件后，由父组件负责构建 filterObj
   */
  filterObj?: Record<string, any>
}

/**
 * FormRelate - 简单关联字段组件（纯组件版本）
 * 用于内部表关联（同一个表内的字段关联）
 *
 * 这是一个纯组件，不依赖 useFormContext 或 Table2Context
 * filterObj 由父组件传入
 */
const FormRelate: React.FC<FormRelateProps> = (props) => {
  const { onChange, value, field = {}, meta, record, disabled: propsDisabled, filterObj, displayField = 'name', schema, internalTable = true } = props

  const disabled = propsDisabled || meta?.data?.disabled || false

  // 格式化显示值
  const formatDisplayValue = (val: any): string => {
    if (!val) return ''
    if (isObject(val) && !isArray(val)) {
      return (val as any)[displayField] || (val as any).name || ''
    }
    if (isArray(val)) {
      return val.map((v) => (isObject(v) ? (v as any)[displayField] || (v as any).name : v)).join(', ')
    }
    return String(val)
  }

  // 处理值变化
  const handleChange = (val: any) => {
    if (!val || isEmpty(val)) {
      onChange?.(null)
    } else if (internalTable) {
      onChange?.(val)
    } else {
      onChange?.({ in: val })
    }
  }

  // 格式化当前值
  const currentValue = React.useMemo(() => {
    if (!value) return undefined
    if ((value as any).ne) return undefined
    if (disabled) {
      if (isArray(value)) {
        return value.map((v: any) => (v as any)[displayField])
      }
      return (value as any)[displayField]
    }
    if ((value as any).in || (value as any).nin) {
      return (value as any).in || (value as any).nin
    }
    return value
  }, [value, disabled, displayField])

  return (
    <AsyncSelect
      value={
        currentValue
          ? isArray(currentValue)
            ? currentValue.map((v: any) => ({
                key: isObject(v) ? (v as any).id || (v as any).value : v,
                label: isObject(v) ? (v as any).label || (v as any).name : v,
                item: v,
              }))
            : {
                key: isObject(currentValue) ? (currentValue as any).id || (currentValue as any).value : currentValue,
                label: formatDisplayValue(currentValue),
                item: currentValue,
              }
          : null
      }
      onChange={(option) => {
        if (!option || (isArray(option) && option.length === 0)) {
          onChange?.(null)
        } else if (isArray(option)) {
          handleChange(option.map((o: any) => o.value || o.key))
        } else {
          handleChange((option as any).value || (option as any).key)
        }
      }}
      field={field}
      schema={schema}
      label={`请选择${(schema as any)?.title || '关联字段'}`}
      disabled={disabled}
      mode={internalTable ? undefined : 'multiple'}
      meta={meta}
      record={record}
      filterObj={filterObj}
    />
  )
}

export { FormRelate }
