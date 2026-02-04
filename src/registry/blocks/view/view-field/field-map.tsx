import React from 'react'
import dayjs from 'dayjs'

const Text = ({ value }: { value: any }) => value

const ArrayData = ({ value }: { value: any }) => {
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return '-'
}

const Textarea = ({ value }: { value: any }) => (
  <div className="whitespace-pre-wrap">{value}</div>
)

const Number = ({ value }: { value: any }) => value

const Select = ({ value, options }: { value: any, options?: any[] }) => {
  const selected = options?.find((opt: any) => opt.value === value)
  return selected ? selected.label : value
}

const Checkbox = ({ value }: { value: any }) => (
  <span>{value ? '✓' : '✗'}</span>
)

const Radio = ({ value, options }: { value: any, options?: any[] }) => {
  const selected = options?.find((opt: any) => opt.value === value)
  return selected ? selected.label : value
}

const Switch = ({ value }: { value: any }) => (
  <span className={value ? 'text-green-600' : 'text-gray-400'}>
    {value ? '开' : '关'}
  </span>
)

const Slider = ({ value, min, max }: { value: any, min?: number, max?: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-2 bg-gray-200 rounded-full">
      <div
        className="h-2 bg-blue-500 rounded-full"
        style={{ width: `${((value - (min || 0)) / ((max || 100) - (min || 0))) * 100}%` }}
      />
    </div>
    <span className="text-sm text-gray-600">{value}</span>
  </div>
)

const Date = ({ value, format }: { value: any, format?: string }) => {
  if (!value) return '-'
  return dayjs(value).format(format || 'YYYY-MM-DD')
}

const Rate = ({ value, max }: { value: any, max?: number }) => {
  const maxStars = max || 5
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }).map((_, i) => (
        <span
          key={i}
          className={i < value ? 'text-yellow-400' : 'text-gray-300'}
        >
          ★
        </span>
      ))}
    </div>
  )
}

const fieldMap: { [key: string]: React.ComponentType<any> } = {
  'text': Text,
  'array': ArrayData,
  'textarea': Textarea,
  'number': Number,
  'select': Select,
  'checkbox': Checkbox,
  'radio': Radio,
  'switch': Switch,
  'slider': Slider,
  'date': Date,
  'rate': Rate
}

export default fieldMap
