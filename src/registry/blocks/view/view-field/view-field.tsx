import {
  Field,
  FieldDescription,
  FieldLabel
} from "@/components/ui/field"
import type { ReactNode } from 'react'
import React, { cloneElement } from 'react'
import fieldMap from './field-map'

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

const Text = ({ value }: { value: any }) => value

const ViewField = ({ name, label, type, description, children, value, item, ...restProps }: ViewFieldProps) => {
  const ValueComponent = (type && fieldMap[type] || Text) as React.ComponentType<any>

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