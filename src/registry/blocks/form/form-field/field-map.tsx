import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { FormInputNumber } from '@/registry/blocks/form/form-input-number/form-input-number'
import { FormInput } from '@/registry/blocks/form/form-input/form-input'
import { FormSelect } from '@/registry/blocks/form/form-select/form-select'

const fieldMap: { [key: string]: React.ComponentType<any> } = {
  'text': FormInput,
  'select': FormSelect,
  'textarea': Textarea,
  'number': FormInputNumber
}
export default fieldMap