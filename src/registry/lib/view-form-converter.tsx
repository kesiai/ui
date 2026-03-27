import { FormArea } from '@/registry/components/form-area/form-area'
import { FormSwitch } from '@/registry/components/form-switch/form-switch'
import { FormUserRole } from '@/registry/components/form-user-role/form-user-role'
import { FormDate } from '@/registry/components/form-date/form-date'
import { FormDateRange } from '@/registry/components/form-date-range/form-date-range'
import { FormLink } from '@/registry/components/form-link/form-link'
import { FormMap } from '@/registry/components/form-map/form-map'
import { FormInputNumber } from '@/registry/components/form-input-number/form-input-number'
import { Rate } from '@/registry/components/form-rate/form-rate'
import { FormRelate } from '@/registry/components/form-relate/form-relate'
import { FormSelect } from '@/registry/components/form-select/form-select'
import { FormSerialNumber } from '@/registry/components/form-serial-number/form-serial-number'
import { FormEditableTable } from '@/registry/components/form-editable-table/form-editable-table'
import { FormInput } from '@/registry/components/form-input/form-input'
import { FormTime } from '@/registry/components/form-time/form-time'
import { FormUpload } from '@/registry/components/form-upload/form-upload'
import { FormRichText } from '@/registry/components/form-rich-text/form-rich-text'
import { FormBytesArray } from '@/registry/components/form-bytes-array/form-bytes-array'
import { FormRadio } from '@/registry/components/form-radio/form-radio'
import { FormSlider } from '@/registry/components/form-slider/form-slider'
import { TableSelect } from '@/registry/components/table-select/table-select'
import { TableSelect as TableDataSelect } from '@/registry/components/table-data-select/table-data-select'
import { FormArray } from '@/registry/components/form-array/form-array'
import { FormObject } from '@/registry/components/form-object/form-object'

const formConverter = (schema: any, formSchema: any) => {
  const controlType = formSchema?.controlType || schema?.controlType
  if (!controlType) {
    const type = schema.type
    switch (type) {
      case 'string':
        return FormInput
      case 'number':
        return FormInputNumber
      case 'boolean':
        return FormSwitch
      case 'array':
        return FormArray
      case 'object':
        return FormObject
      default:
        return FormInput
    }
  } else {
    switch (controlType) {
      case 'area':
        return FormArea
      case 'boolean':
      case 'switch':
        return FormSwitch
      case 'user-role':
        return FormUserRole
      case 'date':
        return FormDate
      case 'date-range':
        return FormDateRange
      case 'link':
        return FormLink
      case 'map':
        return FormMap
      case 'number':
        return FormInputNumber
      case 'rate':
        return Rate
      case 'relate':
      case 'relate-multiple':
        return FormRelate
      case 'select-string':
      case 'select-number':
      case 'select-array-string':
      case 'select-array-number':
        return FormSelect
      case 'serial-number':
        return FormSerialNumber
      case 'editable-table':
        return FormEditableTable
      case 'text':
        return FormInput
      case 'time':
        return FormTime
      case 'upload':
        return FormUpload
      case 'upload-group':
        return FormUpload
      case 'rich-text':
        return FormRichText
      case 'bytes-array':
        return FormBytesArray
      case 'radio':
        return FormRadio
      case 'slider':
        return FormSlider
      case 'table-select':
        return TableSelect
      case 'table-data':
        return TableDataSelect
      case 'array':
        return FormArray
      case 'object':
        return FormObject

      default:
        return () => 'The form field component is defined'
    }
  }
}

export { formConverter }
