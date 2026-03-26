import { SchemaForm, type ModelSchema, type FormSchemaItem } from "@/registry/components/schema-form/schema-form"
import { filterConverter } from '@/registry/lib/view-filter-converter'

type SchemaFormProps = {
  schema: ModelSchema
  filterSchema: FormSchemaItem[]
  formId: string
  onSubmit: (data: any) => void
}

const FilterForm = ({ schema, filterSchema, formId, onSubmit, ...props }: SchemaFormProps) => {
  return (
    <SchemaForm
      formId={formId}
      schema={schema}
      onSubmit={onSubmit}
      isValid={false}
      formSchema={filterSchema}
      schameConvert={filterConverter}
      {...props}
    />
  )
}

export { FilterForm }