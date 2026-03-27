import {
  FieldGroup
} from "@/components/ui/field"
import { FormProvider, useForm, type UseFormPropsExtended, } from '@airiot/client'
import React, { type ReactNode } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Resolver } from 'react-hook-form'
import { z } from 'zod'
import { FormField } from "@/registry/components/form-field/form-field"
import { formConverter } from '@/registry/lib/view-form-converter'

export interface ModelSchema {
  name?: string
  key?: string
  title?: string
  icon?: string
  properties?: Record<string, any>
  [key: string]: any
}
export type FormSchemaItem = {
  key: string,
  controlType?: string
  [key: string]: any
} | '*'

type SchemaFormProps = UseFormPropsExtended & {
  formId: string
  schema: ModelSchema,
  formSchema: FormSchemaItem[],
  schameConvert?: (schema: any, field: object) => void,
  onSubmit?: (data: any) => void
  isValid?: boolean
  children?: ReactNode | ((props: any) => ReactNode)
  classNames?: Record<'form' | 'group' | 'field' | 'label' | 'input' | 'description' | 'error', string>
}

const SchemaForm = ({ schema, formSchema, onSubmit, formId, children, isValid = true, classNames, schameConvert, ...props }: SchemaFormProps) => {

  // 处理 formSchema，展开 '*' 通配符
  const processedFormSchema = React.useMemo(() => {
    const allPropertyKeys = Object.keys(schema?.properties || {})
    const result: Array<{ key: string, controlType?: string, [key: string]: any }> = []
    const explicitKeys = new Set<string>()

    for (const item of formSchema || []) {
      if (item === '*') {
        // 展开通配符：添加所有未显式指定的字段
        const remainingKeys = allPropertyKeys.filter(key => !explicitKeys.has(key))
        for (const key of remainingKeys) {
          result.push({ key })
        }
      } else {
        // 普通字段项
        result.push(item)
        explicitKeys.add(item.key)
      }
    }

    return result
  }, [schema, formSchema])

  const fields = processedFormSchema

  const zodSchema = React.useMemo(() => {
    try {
      return z.fromJSONSchema(schema as any)
    } catch (e) {
      console.error('Failed to convert schema to Zod:', e)
      return z.object({})
    }
  }, [schema])

  const resolver = React.useMemo<Resolver<any, any>>(() => {
    return zodResolver(zodSchema as any)
  }, [zodSchema])
  
  const methods = useForm({
    resolver: isValid ? resolver : null,
    ...props
  } as any)

  // 手动验证 editable-table 类型的字段
  const validateEditableTableFields = (data: any): string | true => {
    for (const field of fields) {
      if (field.type === 'editable-table' && field.items) {
        const fieldName = field.name || field.key
        const value = data?.[fieldName]

        const forms = field.items
        const properties = forms.properties || {}
        const formKeys = forms.formSchema || []

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

    onSubmit?.(data)
  }

  return (
    <FormProvider {...methods} classNames={classNames}>
      <form id={formId} onSubmit={methods.handleSubmit(handleFormSubmit)} className={classNames?.form}>
        <FieldGroup className={classNames?.group}>
          {processedFormSchema.map(field => {
            const fieldKey = typeof field === 'string' ? field : field.key
            const fieldSchame = typeof field === 'string' ? { key: field } : field
            const baseSchema = schema?.properties?.[fieldKey as string]
            const type = field?.controlType || baseSchema?.controlType
            // 将表格内部字段的 need 属性转换为外层的验证规则
            const editableTableValidate = React.useMemo(() => {
              const forms = baseSchema?.items
              const hasEditableTableForms = forms?.form && forms?.properties

              // 检查是否为 editable-table 类型（通过 type 或 forms 属性判断）
              const isEditableTable = type === 'editable-table' || hasEditableTableForms

              if (!isEditableTable) {
                return undefined
              }

              if (!hasEditableTableForms) {
                return undefined
              }

              // 找出所有必填字段 (need: true)
              const requiredFields: Array<{ key: string; title: string }> = []
              forms.form.forEach((key: string) => {
                const fieldSchema = forms.properties[key]
                if (fieldSchema?.need === true) {
                  requiredFields.push({
                    key: fieldSchema.key || key,
                    title: fieldSchema.title || key
                  })
                }
              })

              // 如果没有必填字段，不需要特殊验证
              if (requiredFields.length === 0) {
                return undefined
              }

              // 返回验证函数
              const validateFn = (value: any) => {
                // 空数组验证
                if (!Array.isArray(value) || value.length === 0) {
                  return `请至少添加一条数据`
                }

                // 检查每一行的必填字段
                for (let i = 0; i < value.length; i++) {
                  const row = value[i]
                  for (const field of requiredFields) {
                    const fieldValue = row?.[field.key]
                    // 检查值是否为空 (null, undefined, 或空字符串)
                    if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
                      return `第 ${i + 1} 行的「${field.title}」不能为空`
                    }
                  }
                }

                return undefined // 验证通过
              }

              return validateFn
            }, [type, baseSchema?.items])
            const FieldController = (schameConvert ? schameConvert(baseSchema, field) : formConverter(baseSchema, field)) as React.ComponentType
            const megerSchema = { ...baseSchema, ...fieldSchame }
            return (
              <FormField name={field.key} label={baseSchema?.title} schema={megerSchema} validate={editableTableValidate}>
                <FieldController />
              </FormField>
            )
          })}
        </FieldGroup>
        {
          children ? (typeof children === 'function' ? children({
            ...methods
          }) : children) : null
        }
      </form>
    </FormProvider>
  )
}

export { SchemaForm }