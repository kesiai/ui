import {
  FieldGroup
} from "@/components/ui/field"
import { FormProvider, useForm, useFilterSchema, type UseFormPropsExtended, type UseFormSchemaProps } from '@airiot/client'
import type { ReactNode } from 'react'
import _ from "lodash"
import FormField from "@/registry/components/form-field/form-field"

type SchemaFormProps = UseFormPropsExtended & UseFormSchemaProps & {
  formId: string
  onSubmit: (data: any) => void
  children?: ReactNode | ((props: any) => ReactNode)
  classNames?: Record<'form' | 'group' | 'field' | 'label' | 'input' | 'description' | 'error', string>
}

const FilterSchemaForm = ({ schema, formSchema, onSubmit, formId, children, classNames, ...props }: SchemaFormProps) => {
  
  const { fields } = useFilterSchema({ schema, formSchema })
  const methods = useForm(props)

  return (
    <FormProvider {...methods} classNames={classNames}>
      <form id={formId} onSubmit={methods.handleSubmit(onSubmit)} className={classNames?.form}>
        <FieldGroup className={classNames?.group}>
          {fields.map(field => (
            <FormField {...field} name={field.key || ''} key={field.key} />
          ))}
        </FieldGroup>
        {children ? ( typeof children === 'function' ? children({
          ...methods
        }) : children ) : null}
      </form>
    </FormProvider>
  )
}

export default FilterSchemaForm