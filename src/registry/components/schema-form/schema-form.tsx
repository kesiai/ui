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

  
  // 手动验证 editable-table 类型的字段
  const validateEditableTableFields = (data: any): string | true => {
    for (const field of fields) {
      if (field.type === 'editable-table' && field.forms) {
        const fieldName = field.name || field.key
        const value = data?.[fieldName]

        const forms = field.forms
        const properties = forms.properties || {}
        const formKeys = forms.form || []

        // 找出所有必填字段 (need: true)
        const requiredFields: Array<{ key: string; title: string }> = []
        formKeys.forEach((key: string) => {
          const fieldSchema = properties[key]
          if (fieldSchema?.need === true) {
            requiredFields.push({
              key: fieldSchema.key || key,
              title: fieldSchema.title || key
            })
          }
        })

        // 空数组验证
        if (!Array.isArray(value) || value.length === 0) {
          const error = `请至少添加一条数据`
          methods.setError(fieldName, { type: 'manual', message: error })
          return error
        }

        // 检查每一行的必填字段
        for (let i = 0; i < value.length; i++) {
          const row = value[i]
          for (const reqField of requiredFields) {
            const fieldValue = row?.[reqField.key]
            if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
              const error = `第 ${i + 1} 行的「${reqField.title}」不能为空`
              methods.setError(fieldName, { type: 'manual', message: error })
              return error
            }
          }
        }

        // 清除该字段的错误（如果验证通过）
        methods.clearErrors(fieldName)
      }
    }

    return true
  }

  // 手动处理提交，确保所有字段（包括editable-table）都被验证
  const handleFormSubmit = async (data: any) => {
    // 首先运行 resolver 验证
    const resolverValid = await methods.trigger()
    if (!resolverValid) {
      return
    }

    // 然后手动验证 editable-table 字段
    const editableTableValid = validateEditableTableFields(data)
    if (editableTableValid !== true) {
      return
    }

    onSubmit(data)
  }

  return (
    <FormProvider {...methods} classNames={classNames}>
      <form id={formId} onSubmit={methods.handleSubmit(handleFormSubmit)} className={classNames?.form}>
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