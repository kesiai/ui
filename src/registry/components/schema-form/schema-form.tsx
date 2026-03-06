import {
  FieldGroup
} from "@/components/ui/field"
import { FormProvider, useForm, useFormSchema, type UseFormPropsExtended, type UseFormSchemaProps } from '@airiot/client'
import type { ReactNode } from 'react'

import FormField from "@/registry/components/form-field/form-field"

type SchemaFormProps = UseFormPropsExtended & UseFormSchemaProps & {
  formId: string
  onSubmit: (data: any) => void
  children?: ReactNode | ((props: any) => ReactNode)
  classNames?: Record<'form' | 'group' | 'field' | 'label' | 'input' | 'description' | 'error', string>
}

const SchemaForm = ({ schema, formSchema, onSubmit, formId, children, classNames, ...props }: SchemaFormProps) => {
  const { fields, resolver } = useFormSchema({ schema, formSchema })

  const methods = useForm({
    resolver: resolver, ...props
  } as any)

  return (
    <FormProvider {...methods} classNames={classNames}>
      <form id={formId} onSubmit={methods.handleSubmit(onSubmit)} className={classNames?.form}>
        <FieldGroup className={classNames?.group}>
          {fields.map(field => (
            <FormField {...field} key={field.key} />
          ))}
        </FieldGroup>
        {children ? ( typeof children === 'function' ? children({
          ...methods
        }) : children ) : null}
      </form>
    </FormProvider>
  )
}

export default SchemaForm