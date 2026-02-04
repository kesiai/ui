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
import { cn } from '@/lib/utils'

type FormFieldProps = {
  name: string
  label?: ReactNode
  type?: string
  description?: ReactNode
  children?: ReactNode | ((props: any) => ReactNode)
  required?: boolean
  rules?: any
  className?: string
  classNames?: Record<'field' | 'label' | 'input' | 'description' | 'error', string>
  [key: string]: any
}

type FormContextReturnType = ReturnType<typeof useFormContext> & {
  classNames?: Record<'form' | 'field' | 'label' | 'input' | 'description' | 'error', string>
}

const FormField = 
  ({ name, label, type, description, children, required, rules, className, classNames, ...restProps }: FormFieldProps) => {
  let methods = null
  try {
    methods = useFormContext() as FormContextReturnType
  } catch {
    return <Button variant={"destructive"}>FormField must be used within a Form.</Button>
  }

  const ui = useFieldUIStateValue(name)
  const ContorlComponent = type && fieldMap[type] || Input
  const fieldId = `form-rhf-${name}` + (Math.random().toString(36).substring(2, 9))
  const formClassNames = methods?.classNames
  console.log('FormField render', formClassNames, classNames)
  return ui.visible ? (
    <Controller
        name={name}
        control={methods?.control}
        rules={{ required, ...rules }}
        render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} 
          className={cn(className, formClassNames?.field, classNames?.field)}>
          { label && <FieldLabel htmlFor={fieldId} className={cn(formClassNames?.label, classNames?.label)}>
            {label}{required && <span className="text-red-500">*</span>}
          </FieldLabel>}
          {
            children ? ( typeof children === 'function' ? children({
              id: fieldId,
              ...field,
              ...restProps,
              className: cn(formClassNames?.input, classNames?.input),
              'aria-invalid': fieldState.invalid
            }) : cloneElement(children as React.ReactElement<any>, {
              id: fieldId,
              ...field,
              ...restProps,
              className: cn(formClassNames?.input, classNames?.input),
              'aria-invalid': fieldState.invalid
            }) ) : (
              <ContorlComponent
                id={fieldId}
                {...field}
                {...restProps}
                className={cn(formClassNames?.input, classNames?.input)}
                aria-invalid={fieldState.invalid}
              />
            )
          }
          {description && (
            <FieldDescription className={cn(formClassNames?.description, classNames?.description)}>
              {description}
            </FieldDescription>
          )}
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} className={cn(formClassNames?.error, classNames?.error)} />
          )}
        </Field>
      )}
    />
  ) : null
}

export default FormField