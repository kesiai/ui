import { Text } from '@/registry/components/view-field-text/view-field-text'
import { Textarea } from '@/registry/components/view-field-textarea/view-field-textarea'
import { Number } from '@/registry/components/view-field-number/view-field-number'
import { Password } from '@/registry/components/view-field-password/view-field-password'
import { Select } from '@/registry/components/view-field-select/view-field-select'
import { BooleanIcon } from '@/registry/components/view-field-boolean/view-field-boolean'
import { Slider } from '@/registry/components/view-field-slider/view-field-slider'
import { DateField } from '@/registry/components/view-field-date/view-field-date'
import { DateRange } from '@/registry/components/view-field-date-range/view-field-date-range'
import { TimeField } from '@/registry/components/view-field-time/view-field-time'
import { Rate } from '@/registry/components/view-field-rate/view-field-rate'
import { RichText } from '@/registry/components/view-field-rich-text/view-field-rich-text'
import { Map } from '@/registry/components/view-field-map/view-field-map'
import { Link } from '@/registry/components/view-field-link/view-field-link'
import { SerialNumber } from '@/registry/components/view-field-serial-number/view-field-serial-number'
import { UserRole } from '@/registry/components/view-field-user-role/view-field-user-role'
import { BytesArray } from '@/registry/components/view-field-bytes-array/view-field-bytes-array'
import { FormInfo } from '@/registry/components/view-field-form-info/view-field-form-info'
import { EditableTable } from '@/registry/components/view-field-editable-table/view-field-editable-table'
import { Formula } from '@/registry/components/view-field-formula/view-field-formula'
import { Reference } from '@/registry/components/view-field-reference/view-field-reference'
import { Attachment } from '@/registry/components/view-field-attachment/view-field-attachment'
import { Relate } from '@/registry/components/view-field-relate/view-field-relate'

const tableConverter = (schema: any, tableSchame: any) => {
  const controlType = tableSchame?.controlType || schema?.controlType

  switch (controlType) {
    case 'text':
      return Text
    case 'textarea':
      return Textarea
    case 'number':
      return Number
    case 'password':
      return Password
    case 'radio':
    case 'select-string':
    case 'select-number':
    case 'select-array-string':
    case 'select-array-number':
      return Select
    case 'checkbox':
    case 'switch':
    case 'boolean':
      return BooleanIcon
    case 'slider':
      return Slider
    case 'date':
      return DateField
    case 'date-range':
      return DateRange
    case 'time':
      return TimeField
    case 'rate':
      return Rate
    case 'rich-text':
      return RichText
    case 'map':
      return Map
    case 'upload':
    case 'upload-group':
      return Attachment
    case 'link':
      return Link
    case 'serial-number':
      return SerialNumber
    case 'user-role':
      return UserRole
    case 'bytes-array':
      return BytesArray
    case 'form-info':
      return FormInfo
    case 'editable-table':
      return EditableTable
    case 'formula':
      return Formula
    case 'reference':
      return Reference
    case 'relate':
      return Relate
    case 'relate-multiple':
      return Relate
    default:
      return Text
  }
}

export { tableConverter }
