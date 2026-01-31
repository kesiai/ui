import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { FormInputNumber } from '@/registry/blocks/form/form-input-number/form-input-number'
import { FormInput } from '@/registry/blocks/form/form-input/form-input'
import { FormSelect } from '@/registry/blocks/form/form-select/form-select'
import { FormCheckbox } from '@/registry/blocks/form/form-checkbox/form-checkbox'
import { FormRadio } from '@/registry/blocks/form/form-radio/form-radio'
import { FormSwitch } from '@/registry/blocks/form/form-switch/form-switch'
import { FormSlider } from '@/registry/blocks/form/form-slider/form-slider'
import { FormDate } from '@/registry/blocks/form/form-date/form-date'
import Rate from '@/registry/blocks/form/form-rate/form-rate'

const fieldMap: { [key: string]: React.ComponentType<any> } = {
  'text': FormInput,
  'select': FormSelect,
  'textarea': Textarea,
  'number': FormInputNumber,
  'checkbox': FormCheckbox,
  'radio': FormRadio,
  'switch': FormSwitch,
  'slider': FormSlider,
  'date': FormDate,
  'rate': Rate
}
export default fieldMap
