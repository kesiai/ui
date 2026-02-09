import React from 'react'
import { Textarea } from '@/components/ui/textarea'
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
import { FormRelate as FormRelate } from '@/registry/components/form-relate'

// 将 table-field 组件包装为 FormField 可用的组件
const wrapFormComponent = (Component: React.ComponentType<any>, defaultFieldSchema: any = {}) => {
  return ({ input, field, ...rest }: any) => {
    const combinedField = {
      ...field,
      schema: {
        ...defaultFieldSchema,
        ...field?.schema
      }
    }
    return <Component input={input} field={combinedField} {...rest} />
  }
}

const fieldMap: { [key: string]: React.ComponentType<any> } = {
  // 原有的基础表单组件
  'text': FormInput,
  'select': FormSelect,
  'textarea': Textarea,
  'number': FormInputNumber,
  'checkbox': FormCheckbox,
  'radio': FormRadio,
  'switch': FormSwitch,
  'slider': FormSlider,
  'date': FormDate,
  'rate': Rate,

  // Form 组件（带前缀，避免冲突）
  'table-text': wrapFormComponent(FormInput, { textType: 'text', textContent: 'text' }),
  'table-textarea': wrapFormComponent(FormInput, { textType: 'textarea', textContent: 'text' }),
  'table-number': wrapFormComponent(FormInputNumber),
  'table-select': wrapFormComponent(FormSelect),
  'table-checkbox': wrapFormComponent(FormCheckbox),
  'table-date': wrapFormComponent(FormDate),
  'table-date-range': wrapFormComponent(FormDateRange),
  'table-time': wrapFormComponent(FormTime),
  'table-rate': wrapFormComponent(Rate),
  'table-rich-text': wrapFormComponent(FormRichText),
  'table-map': wrapFormComponent(FormMap),
  'table-upload': wrapFormComponent(FormUpload),
  'table-link': wrapFormComponent(FormLink),
  'table-serial-number': wrapFormComponent(FormSerialNumber),
  'table-user-role': wrapFormComponent(FormUserRole),
  'table-bytes-array': wrapFormComponent(FormBytesArray),
  'table-reference': wrapFormComponent(FormReference),
  'table-form-info': wrapFormComponent(FormFormInfo),
  'table-editable-table': wrapFormComponent(FormEditableTable),
  'table-relate-plus': wrapFormComponent(FormRelatePlus),
  'table-relate': wrapFormComponent(FormRelate),
}

export default fieldMap
