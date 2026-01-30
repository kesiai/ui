import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import { Controller, useFieldUIStateValue, useFormContext } from '@airiot/client'
import type { ReactNode } from 'react'
import React, { cloneElement } from 'react'
import fieldMap from './field-map'

const FormField = ({ name, label, type, description, children, required, rules, ...restProps }: { name: string, label?: ReactNode, type?: string, description?: ReactNode, children?: ReactNode | ((props: any) => ReactNode), required?: boolean, rules?: any, [key: string]: any }) => {
  let methods = null
  try {
    methods = useFormContext()
  } catch {
    return <Button variant={"destructive"}>FormField must be used within a Form.</Button>
  }

  const ui = useFieldUIStateValue(name)
  const ContorlComponent = type && fieldMap[type] || Input
  const fieldId = `form-rhf-${name}` + (Math.random().toString(36).substr(2, 9))

  return ui.visible ? (
    <Controller
        name={name}
        control={methods?.control}
        rules={{ required, ...rules }}
        render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={fieldId}>
            {label || name}{required && <span className="text-red-500">*</span>}
          </FieldLabel>
          {
            children ? ( typeof children === 'function' ? children({
              id: fieldId,
              ...field,
              ...restProps,
              ref: null,
              'aria-invalid': fieldState.invalid
            }) : cloneElement(children as React.ReactElement, {
              id: fieldId,
              ...field,
              ...restProps,
              ref: null,
              'aria-invalid': fieldState.invalid
            }) ) : (
              <ContorlComponent
                id={fieldId}
                {...field}
                {...restProps}
                ref={null}
                aria-invalid={fieldState.invalid}
              />
            )
          }
          {description && (
            <FieldDescription>
              {description}
            </FieldDescription>
          )}
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  ) : null
}

export default FormField