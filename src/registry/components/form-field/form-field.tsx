import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Controller, useFieldUIStateValue, useFormContext } from '@airiot/client'
import type { ReactNode } from 'react'
import { Input } from "@/components/ui/input"
import React, { cloneElement } from 'react'

import { cn } from '@/lib/utils'

type FormFieldProps = {
  name: string
  label?: ReactNode
  description?: ReactNode
  children?: ReactNode | ((props: any) => ReactNode)
  required?: boolean
  rules?: any
  className?: string
  classNames?: Record<'field' | 'label' | 'input' | 'description' | 'error', string>
  validate?: any
  [key: string]: any
}

type FormContextReturnType = ReturnType<typeof useFormContext> & {
  classNames?: Record<'form' | 'field' | 'label' | 'input' | 'description' | 'error', string>
}

const FormField =
  ({ name, label, description, children, required, rules, validate, className, classNames, schema }: FormFieldProps) => {
    let methods = null
    try {
      methods = useFormContext() as FormContextReturnType
    } catch {
      return <Button variant={"destructive"}>FormField must be used within a Form.</Button>
    }

    const ui = useFieldUIStateValue(name)
    const fieldId = `form-rhf-${name}` + (Math.random().toString(36).substring(2, 9))
    const formClassNames = methods?.classNames
    const fieldProps = { label, description, required, schema, ...schema }
    const controllerRules = { required, ...rules, validate }

    return ui.visible ? (
      <Controller
        name={name}
        control={methods?.control}
        rules={controllerRules}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}
            className={cn(className, formClassNames?.field, classNames?.field, schema?.classNames?.field)}>
            {label && <FieldLabel htmlFor={fieldId} className={cn(formClassNames?.label, classNames?.label, schema?.classNames?.label)}>
              {label} : {required && <span className="text-red-500">*</span>}
            </FieldLabel>}
            {
              children ? (typeof children === 'function' ? children({
                id: fieldId,
                ...field,
                ...fieldProps,
                className: cn(formClassNames?.input, classNames?.input, schema.classNames?.input),
                'aria-invalid': fieldState.invalid
              }) : cloneElement(children as React.ReactElement<any>, {
                id: fieldId,
                ...field,
                ...fieldProps,
                className: cn(formClassNames?.input, classNames?.input, schema.classNames?.input),
                'aria-invalid': fieldState.invalid
              })) : <Input className={cn(formClassNames?.input, classNames?.input, schema?.classNames?.input)} />
            }
            {description && (
              <FieldDescription className={cn(formClassNames?.description, classNames?.description, schema?.classNames?.description)}>
                {description}
              </FieldDescription>
            )}
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} className={cn(formClassNames?.error, classNames?.error, schema?.classNames?.error)} />
            )}
          </Field>
        )}
      />
    ) : null
  }

export { FormField }