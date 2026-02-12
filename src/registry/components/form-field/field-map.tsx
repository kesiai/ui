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
import { FilterText } from '@/registry/components/filter-text/filter-text'
import { FilterEnum } from '@/registry/components/filter-enum/filter-enum'
import { FilterNumber } from '@/registry/components/filter-number/filter-number'
import { FilterDate } from '@/registry/components/filter-date/filter-date'
import { FilterBool } from '@/registry/components/filter-bool/filter-bool'
import { FilterDateRange } from '@/registry/components/filter-datetime/filter-datetime'

// 将 table-field 组件包装为 FormField 可用的组件
const wrapFormComponent = (Component: React.ComponentType<any>, defaultFieldSchema: any = {}) => {
  return ({ input, field, schema = {}, ...rest }: any) => {
    const combinedField = {
      ...field,
      ...defaultFieldSchema,
      ...field?.schema
    }
    return <Component input={input} {...combinedField} {...rest} {...schema} />
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
  'relate-plus': wrapFormComponent(FormRelatePlus),
  'relate': wrapFormComponent(FormRelate),

  // filter组件
  'filter_text': FilterText,
  'filter_enum': FilterEnum,
  'filter_number': FilterNumber,
  'filter_bool': FilterBool,
  'filter_date': FilterDate,
  'filter_datetime': FilterDateRange
}

export default fieldMap
