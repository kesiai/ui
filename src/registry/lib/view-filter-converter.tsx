import { FilterArea } from "@/registry/components/filter-area/filter-area"
import { FilterText } from '@/registry/components/filter-text/filter-text'
import { FilterNumber } from '@/registry/components/filter-number/filter-number'
import { FilterDate } from '@/registry/components/filter-date/filter-date'
import { FilterBool } from '@/registry/components/filter-bool/filter-bool'
import { FilterEnum } from '@/registry/components/filter-enum/filter-enum'
import { FilterRelateSelect } from '@/registry/components/filter-relate-select/filter-relate-select'
// import { FilterDatetime } from '@/registry/components/filter-datetime/filter-datetime'
// import { FilterInputSelect } from '@/registry/components/filter-input-select/filter-input-select'
// import { FilterRelateUnique } from '@/registry/components/filter-relate-unique/filter-relate-unique'
// import { FilterUserRole } from '@/registry/components/filter-user-role/filter-user-role'
// import { FilterSingleDate } from '@/registry/components/filter-single-date/filter-single-date'
// import { FilterWarningType } from '@/registry/components/filter-warning-type/filter-warning-type'
// import { FilterLogType } from '@/registry/components/filter-log-type/filter-log-type'
// import { FilterTextBoolean } from '@/registry/components/filter-text-boolean/filter-text-boolean'

const filterConverter = (schema: any, filterSchema: any) => {
  const controlType = filterSchema?.controlType || schema?.controlType
  if (!controlType) {
    const type = schema.type
    switch (type) {
      case 'string':
        return FilterText
      case 'number':
        return FilterNumber
      case 'boolean':
        return FilterBool
      default:
        return FilterText
    }
  } else {
    switch (controlType) {
      case 'text':
      case 'link':
      case 'serial-number':
        return FilterText
      case 'area':
        return FilterArea
      case 'boolean':
        return FilterBool
      case 'date':
        return FilterDate
      case 'number':
        return FilterNumber
      case 'relate':
      case 'relate-multiple':
        return FilterRelateSelect
      case 'select-string':
      case 'select-number':
      case 'select-array-string':
      case 'select-array-number':
        return FilterEnum
      default:
        return () => 'The filter component is defined'
    }
  }
}

export { filterConverter }
