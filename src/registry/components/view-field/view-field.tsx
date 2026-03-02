import {
  Field,
  FieldDescription,
  FieldLabel
} from "@/components/ui/field"
import type { ReactNode } from 'react'
import React, { cloneElement } from 'react'
import fieldMap from '@/registry/components/view-field/field-map'
import { ViewFieldRender } from '@/registry/components/view-field/field-map'

type ViewFieldProps = {
  name: string
  value: any
  item: any
  type?: string
  schema?: any
  label?: ReactNode | string
  description?: ReactNode | string
  children?: ReactNode | ((props: any) => ReactNode)
  [key: string]: any
}

// const Text = ({ value }: { value: any }) => value
const Text = ({ value }: { value: any }) => {
  // 处理对象类型的值（如 {id, name}）
  if (value && typeof value === 'object') {
    // 优先显示 name，其次显示 id，最后显示 JSON
    if ('name' in value) return value.name
    if ('id' in value) return value.id
    return JSON.stringify(value)
  }
  return value
}

const ViewField = ({ name, label, type, description, children, value, item, schema, ...restProps }: ViewFieldProps) => {
  // 优先使用 schema.fieldType，其次使用 type 参数
  const fieldType = type || schema?.fieldType

  // 如果有 schema，使用统一的 ViewFieldRender 组件
  if (schema) {
    const fieldValue = (
      children ? ( typeof children === 'function' ? children({
        name, value, item, schema,
        ...restProps
      }) : cloneElement(children as React.ReactElement<any>, {
        name,
        value, item, schema,
        ...restProps
      }) ) : (
        <ViewFieldRender
          type={fieldType}
          value={value}
          schema={schema}
          item={item}
          {...restProps}
        />
      )
    )

    return (label || description) ?(
      <Field>
        {label && <FieldLabel>
          {label}
        </FieldLabel>}
        {fieldValue}
        {description && (
          <FieldDescription>
            {description}
          </FieldDescription>
        )}
      </Field>
    ) : fieldValue
  }

  // 如果没有 schema，使用旧的逻辑（向后兼容）
  const ValueComponent = (fieldType && fieldMap[fieldType] || Text) as React.ComponentType<any>

  const fieldValue = (
    children ? ( typeof children === 'function' ? children({
      name, value, item,
      ...restProps
    }) : cloneElement(children as React.ReactElement<any>, {
      name,
      value, item,
      ...restProps
    }) ) : (
      <ValueComponent
        name={name}
        value={value}
        item={item}
        {...restProps}
      />
    )
  )

  return (label || description) ?(
    <Field>
      {label && <FieldLabel>
        {label}
      </FieldLabel>}
      {fieldValue}
      {description && (
        <FieldDescription>
          {description}
        </FieldDescription>
      )}
    </Field>
  ) : fieldValue
}

export default ViewField