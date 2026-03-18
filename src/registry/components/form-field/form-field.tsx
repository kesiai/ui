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

import { cn } from '@/lib/utils'

import { FormInputNumber } from '@/registry/components/form-input-number/form-input-number'
import { FormInput } from '@/registry/components/form-input/form-input'
import { FormSelect } from '@/registry/components/form-select/form-select'
import { FormCheckbox } from '@/registry/components/form-checkbox/form-checkbox'
import { FormRadio } from '@/registry/components/form-radio/form-radio'
import { FormSwitch } from '@/registry/components/form-switch/form-switch'
import { FormSlider } from '@/registry/components/form-slider/form-slider'
import { FormDate } from '@/registry/components/form-date/form-date'
import Rate from '@/registry/components/form-rate/form-rate'

// 导入迁移后的组件
import { FormDateRange } from '@/registry/components/form-date-range/form-date-range'
import { FormTime } from '@/registry/components/form-time/form-time'
import { FormRichText } from '@/registry/components/form-rich-text/form-rich-text'
import { FormMap } from '@/registry/components/form-map/form-map'
import { FormUpload } from '@/registry/components/form-upload/form-upload'
import { FormLink } from '@/registry/components/form-link/form-link'
import { FormSerialNumber } from '@/registry/components/form-serial-number/form-serial-number'
import { FormUserRole } from '@/registry/components/form-user-role/form-user-role'
import { FormBytesArray } from '@/registry/components/form-bytes-array/form-bytes-array'
import { FormReference } from '@/registry/components/form-reference/form-reference'
import { FormFormInfo } from '@/registry/components/form-form-info/form-form-info'
import { FormEditableTable } from '@/registry/components/form-editable-table/form-editable-table'
import { FormRelatePlus } from '@/registry/components/form-relate-plus/form-relate-plus'
import FormArea from '@/registry/components/form-area/form-area'
import { FilterArea } from "../filter-area/filter-area"
import { FilterText } from '@/registry/components/filter-text/filter-text'
import { FilterEnum } from '@/registry/components/filter-enum/filter-enum'
import { FilterNumber } from '@/registry/components/filter-number/filter-number'
import { FilterDate } from '@/registry/components/filter-date/filter-date'
import { FilterBool } from '@/registry/components/filter-bool/filter-bool'
import { FilterDatetime } from '@/registry/components/filter-datetime/filter-datetime'
import { FilterInputSelect } from '@/registry/components/filter-input-select/filter-input-select'
import { FilterRelateUnique } from '@/registry/components/filter-relate-unique/filter-relate-unique'
import { FilterUserRole } from '@/registry/components/filter-user-role/filter-user-role'
import { FilterSingleDate } from '@/registry/components/filter-single-date/filter-single-date'
import { FilterWarningType } from '@/registry/components/filter-warning-type/filter-warning-type'
import { FilterLogType } from '@/registry/components/filter-log-type/filter-log-type'
import { FilterTextBoolean } from '@/registry/components/filter-text-boolean/filter-text-boolean'
import { FilterRelateSelect } from '@/registry/components/filter-relate-select/filter-relate-select'
import { TableSelect } from '@/registry/components/table-select/table-select'
import TableDataSelect from '@/registry/components/table-data-select/table-data-select'

// 将 table-field 组件包装为 FormField 可用的组件
const wrapFormComponent = (Component: React.ComponentType<any>, defaultFieldSchema: any = {}) => {
  return ({ schema = {}, key: _key, ...rest }: any) => {
    return <Component field={rest} {...defaultFieldSchema} {...rest} {...schema} />
  }
}

const fieldMap: { [key: string]: React.ComponentType<any> } = {
  // 原有的基础表单组件
  'radio': FormRadio,
  'switch': FormSwitch,
  'slider': FormSlider,

  // Form 组件
  'text': wrapFormComponent(FormInput, { textType: 'text', textContent: 'text' }),
  'textarea': wrapFormComponent(FormInput, { textType: 'textarea', textContent: 'text' }),
  'number': wrapFormComponent(FormInputNumber),
  'select': wrapFormComponent(FormSelect),
  'checkbox': wrapFormComponent(FormCheckbox),
  'boolean': wrapFormComponent(FormCheckbox),
  'date': wrapFormComponent(FormDate),
  'date-range': wrapFormComponent(FormDateRange),
  'time': wrapFormComponent(FormTime),
  'rate': wrapFormComponent(Rate),
  'rich-text': wrapFormComponent(FormRichText),
  'map': wrapFormComponent(FormMap),
  'upload': wrapFormComponent(FormUpload),
  'link': wrapFormComponent(FormLink),
  'serial-number': wrapFormComponent(FormSerialNumber),
  'user-role': wrapFormComponent(FormUserRole),
  'bytes-array': wrapFormComponent(FormBytesArray),
  'reference': wrapFormComponent(FormReference),
  'form-info': wrapFormComponent(FormFormInfo),
  'editable-table': wrapFormComponent(FormEditableTable),
  'relate': wrapFormComponent(FormRelatePlus),
  'relate-plus': wrapFormComponent(FormRelatePlus),
  'area': wrapFormComponent(FormArea),

  // filter组件
  'filter_area': wrapFormComponent(FilterArea),
  'filter_text': FilterText,
  'filter_enum': FilterEnum,
  'filter_number': FilterNumber,
  'filter_bool': FilterBool,
  'filter_date': FilterDate,
  'filter_datetime': FilterDatetime,
  'filter_relate_unique': FilterRelateUnique,
  'filter_input_select': FilterInputSelect,
  'filter_user_role': FilterUserRole,
  'filter_single_date': FilterSingleDate,
  'filter_warning_type': FilterWarningType,
  'filter_log_type': FilterLogType,
  'filter_text_boolean': FilterTextBoolean,
  'filter_relate_select': FilterRelateSelect,

  'tableselect': TableSelect,
  'tableData': TableDataSelect
}

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
  relateSchema?: any
  uploadType?: any
  forms?: any
  [key: string]: any
}

type FormContextReturnType = ReturnType<typeof useFormContext> & {
  classNames?: Record<'form' | 'field' | 'label' | 'input' | 'description' | 'error', string>
}

const FormField =
  ({ name, label, description, children, required, rules, className, classNames, ...restProps }: FormFieldProps) => {
    let methods = null
    const type = restProps.fieldType
    try {
      methods = useFormContext() as FormContextReturnType
    } catch {
      return <Button variant={"destructive"}>FormField must be used within a Form.</Button>
    }

    const ui = useFieldUIStateValue(name)
    const ContorlComponent = type && fieldMap[type] || Input
    const fieldId = `form-rhf-${name}` + (Math.random().toString(36).substring(2, 9))
    const formClassNames = methods?.classNames
    let fieldProps = { label, description, required, ...restProps, ...restProps.schema }

    // 关联字段组件需要relateSchema属性
    if (type == 'relate-plus') {
      fieldProps['relateSchema'] = { ...fieldProps, ...restProps.schema }
    } else if (type == 'upload') {
      // 上传附件使用相同组件 区分单和多
      fieldProps['uploadType'] = fieldProps.type == 'object' ? 'upload_attachment' : 'upload_attachment_group'
    }

    // 将表格内部字段的 need 属性转换为外层的验证规则
    const editableTableValidate = React.useMemo(() => {
      const forms = fieldProps?.forms
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
    }, [type, fieldProps?.forms])

    const controllerRules = { required, ...rules, validate: editableTableValidate }

    return ui.visible ? (
      <Controller
        name={name}
        control={methods?.control}
        rules={controllerRules}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}
            className={cn(className, formClassNames?.field, classNames?.field)}>
            {label && <FieldLabel htmlFor={fieldId} className={cn(formClassNames?.label, classNames?.label)}>
              {label}{required && <span className="text-red-500">*</span>}
            </FieldLabel>}
            {
              children ? (typeof children === 'function' ? children({
                id: fieldId,
                ...field,
                ...fieldProps,
                className: cn(formClassNames?.input, classNames?.input),
                'aria-invalid': fieldState.invalid
              }) : cloneElement(children as React.ReactElement<any>, {
                id: fieldId,
                ...field,
                ...fieldProps,
                className: cn(formClassNames?.input, classNames?.input),
                'aria-invalid': fieldState.invalid
              })) : (
                <ContorlComponent
                  id={fieldId}
                  {...field}
                  {...fieldProps}
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