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

// 导入 table-field 组件
import { TableFieldText } from '@/registry/blocks/table-field/table-field-text/table-field-text'
import { TableFieldNumber } from '@/registry/blocks/table-field/table-field-number/table-field-number'
import { TableFieldSelect } from '@/registry/blocks/table-field/table-field-select/table-field-select'
import { TableFieldCheckbox } from '@/registry/blocks/table-field/table-field-checkbox/table-field-checkbox'
import { TableFieldDate } from '@/registry/blocks/table-field/table-field-date/table-field-date'
import { TableFieldDateRange } from '@/registry/blocks/table-field/table-field-date-range/table-field-date-range'
import { TableFieldTime } from '@/registry/blocks/table-field/table-field-time/table-field-time'
import { TableFieldRate } from '@/registry/blocks/table-field/table-field-rate/table-field-rate'
import { TableFieldRichText } from '@/registry/blocks/table-field/table-field-rich-text/table-field-rich-text'
import { TableFieldMap } from '@/registry/blocks/table-field/table-field-map/table-field-map'
import { TableFieldUpload } from '@/registry/blocks/table-field/table-field-upload/table-field-upload'
import { TableFieldLink } from '@/registry/blocks/table-field/table-field-link/table-field-link'
import { TableFieldSerialNumber } from '@/registry/blocks/table-field/table-field-serial-number/table-field-serial-number'
import { TableFieldUserRole } from '@/registry/blocks/table-field/table-field-user-role/table-field-user-role'
import { TableFieldBytesArray } from '@/registry/blocks/table-field/table-field-bytes-array/table-field-bytes-array'
import { TableFieldReference } from '@/registry/blocks/table-field/table-field-reference/table-field-reference'
import { TableFieldFormInfo } from '@/registry/blocks/table-field/table-field-form-info/table-field-form-info'
import { TableFieldEditableTable } from '@/registry/blocks/table-field/table-field-editable-table/table-field-editable-table'
import { TableFieldRelatePlus } from '@/registry/blocks/table-field/table-field-relate-plus/table-field-relate-plus'
import { TableFieldRelate as TableFieldRelate } from '@/registry/blocks/table-field/table-field-relate'
import { FilterText } from '@/registry/components/filter-text/filter-text'
import { FilterEnum } from '@/registry/components/filter-enum/filter-enum'
import { FilterNumber } from '@/registry/components/filter-number/filter-number'
import { FilterDate } from '@/registry/components/filter-date/filter-date'
import { FilterBool } from '@/registry/components/filter-bool/filter-bool'
import { FilterDateRange } from '@/registry/components/filter-datetime/filter-datetime'

// 将 table-field 组件包装为 FormField 可用的组件
const wrapTableFieldComponent = (Component: React.ComponentType<any>, defaultFieldSchema: any = {}) => {
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

  // TableField 组件（带前缀，避免冲突）
  'table-text': wrapTableFieldComponent(TableFieldText, { textType: 'text', textContent: 'text' }),
  'table-textarea': wrapTableFieldComponent(TableFieldText, { textType: 'textArea', textContent: 'text' }),
  'table-number': wrapTableFieldComponent(TableFieldNumber),
  'table-select': wrapTableFieldComponent(TableFieldSelect),
  'table-checkbox': wrapTableFieldComponent(TableFieldCheckbox),
  'table-date': wrapTableFieldComponent(TableFieldDate),
  'table-date-range': wrapTableFieldComponent(TableFieldDateRange),
  'table-time': wrapTableFieldComponent(TableFieldTime),
  'table-rate': wrapTableFieldComponent(TableFieldRate),
  'table-rich-text': wrapTableFieldComponent(TableFieldRichText),
  'table-map': wrapTableFieldComponent(TableFieldMap),
  'table-upload': wrapTableFieldComponent(TableFieldUpload),
  'table-link': wrapTableFieldComponent(TableFieldLink),
  'table-serial-number': wrapTableFieldComponent(TableFieldSerialNumber),
  'table-user-role': wrapTableFieldComponent(TableFieldUserRole),
  'table-bytes-array': wrapTableFieldComponent(TableFieldBytesArray),
  'table-reference': wrapTableFieldComponent(TableFieldReference),
  'table-form-info': wrapTableFieldComponent(TableFieldFormInfo),
  'table-editable-table': wrapTableFieldComponent(TableFieldEditableTable),
  'table-relate-plus': wrapTableFieldComponent(TableFieldRelatePlus),
  'table-relate': wrapTableFieldComponent(TableFieldRelate),

  // filter组件
  'filter_text': FilterText,
  'filter_enum': FilterEnum,
  'filter_number': FilterNumber,
  'filter_bool': FilterBool,
  'filter_date': FilterDate,
  'filter_datetime': FilterDateRange
}

export default fieldMap
