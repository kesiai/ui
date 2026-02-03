import {
  FieldGroup
} from "@/components/ui/field"
import { FormProvider, useForm, useFormSchema, type UseFormPropsExtended, type UseFormSchemaProps } from '@airiot/client'
import type { ReactNode } from 'react'

import FormField from "@/registry/blocks/form/form-field/form-field"

type SchemaFormProps = UseFormPropsExtended & UseFormSchemaProps & {
  formId: string
  onSubmit: (data: any) => void
  children?: ReactNode | ((props: any) => ReactNode)
}

const SchemaForm = ({ schema, formSchema, onSubmit, formId, children, ...props }: SchemaFormProps) => {
  const { fields, resolver } = useFormSchema({ schema, formSchema })
  const methods = useForm({
    resolver: resolver, ...props
  } as any)

  return (
    <FormProvider {...methods}>
      <form id={formId} onSubmit={methods.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-4">
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