import { ReactNode } from 'react'
import { SchemaForm } from "@/registry/components/schema-form/schema-form"
import { filterConverter } from '@/registry/lib/view-filter-converter'
import type { ModelSchema, FormSchemaItem } from '@/registry/lib/model-types'
type SchemaFormProps = {
  schema: ModelSchema
  filterSchema: FormSchemaItem[]
  formId: string
  classNames?: Record<'form' | 'group' | 'field' | 'label' | 'input' | 'description' | 'error', string>
  onSubmit: (data: any) => void,
  children?: ReactNode | ((props: any) => ReactNode)
}

const FilterForm = ({ schema, filterSchema, formId, onSubmit, ...props }: SchemaFormProps) => {
  return (
    <SchemaForm
      formId={formId}
      schema={schema}
      onSubmit={onSubmit}
      isValid={false}
      showDescribe={false}
      formSchema={filterSchema}
      schameConvert={filterConverter}
      {...props}
    />
  )
}

export { FilterForm }