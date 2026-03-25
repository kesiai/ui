import {
  FieldGroup
} from "@/components/ui/field"
import { FormProvider, useForm, type UseFormPropsExtended } from '@airiot/client'
import type { ReactNode } from 'react'
import _ from "lodash"
import FormField from "@/registry/components/form-field/form-field"
import { filterConverter } from '@/registry/lib/view-filter-converter'

type SchemaFormProps = UseFormPropsExtended & {
  filterSchema: Array
  onSubmit: (data: any) => void
  children?: ReactNode | ((props: any) => ReactNode)
  classNames?: Record<'form' | 'group' | 'field' | 'label' | 'input' | 'description' | 'error', string>
}

const FilterForm = ({ schema, filterSchema, onSubmit, children, classNames, ...props }: SchemaFormProps) => {
  const methods = useForm(props)
  const properties = schema.properties
  return (
    <FormProvider {...methods} classNames={classNames}>
      <form id={schema.name || schema.key} onSubmit={methods.handleSubmit(onSubmit)} className={classNames?.form}>
        <FieldGroup className={classNames?.group}>
          {(filterSchema || []).map(field => {
            const baseSchema = properties?.[field.key]
            const FieldController = filterConverter(baseSchema, field)
            const megerSchema = { ...baseSchema, ...field }
            return (
              <FormField label={baseSchema.title} name={field.key} schema={megerSchema}>
                <FieldController />
              </FormField>
            )
          })}
        </FieldGroup>
        {children ? (typeof children === 'function' ? children({
          ...methods
        }) : children) : null}
      </form>
    </FormProvider>
  )
}

export default FilterForm