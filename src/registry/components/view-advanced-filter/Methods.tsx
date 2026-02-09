import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { TimePicker } from '@/registry/ui/time-picker'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { FormDate } from '@/registry/components/form-date/form-date'
import _ from 'lodash'

// 时间格式化
const formatDate = (value: any, dateFormat: string) => {
  if (_.isPlainObject(value) && value['gte'] && value['lte']) {
    const fmt = dateFormat || 'YYYY-MM-DD HH:mm:ss'
    // 使用 date-fns 解析日期
    return [
      new Date(value['gte']),
      new Date(value['lte'])
    ]
  } else {
    return null
  }
}

const NullInput = () => null

// 文本输入组件（支持多标签）
const TextInput = ({ input }: { input: any }) => {
  const initialValue = Array.isArray(input.value) ? input.value : (input.value ? [input.value] : [])
  const [inputValue, setInputValue] = useState('')
  const [tags, setTags] = useState<string[]>(initialValue)
  const [showSuggestion, setShowSuggestion] = useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleChange = (newTags: string[]) => {
    setTags(newTags)
    input.onChange(newTags)
  }

  const addTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      handleChange([...tags, inputValue.trim()])
      setInputValue('')
      setShowSuggestion(false)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    handleChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setShowSuggestion(value.trim() !== '' && !tags.includes(value.trim()))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim() && !tags.includes(inputValue.trim())) {
      e.preventDefault()
      e.stopPropagation()
      addTag()
      // 失焦后重新聚焦
      setTimeout(() => {
        inputRef.current?.blur()
        inputRef.current?.focus()
      }, 50)
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      handleChange(tags.slice(0, -1))
    } else if (e.key === 'Escape') {
      setShowSuggestion(false)
    }
  }

  const handleBlur = () => {
    // 延迟处理以允许点击建议项
    setTimeout(() => {
      if (!wrapperRef.current?.contains(document.activeElement)) {
        setShowSuggestion(false)
      }
    }, 150)
  }

  return (
    <div ref={wrapperRef} className="relative w-full min-w-0">
      <div className="flex flex-wrap items-center gap-1 w-full min-w-0 border rounded-md px-2 py-1 bg-background">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:bg-destructive/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.trim() && !tags.includes(inputValue.trim())) {
              setShowSuggestion(true)
            }
          }}
          placeholder={input.placeholder || "请输入"}
          className="flex-1 min-w-[80px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-7"
        />
      </div>
      {showSuggestion && inputValue.trim() && !tags.includes(inputValue.trim()) && (
        <div
          className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md border p-2 cursor-pointer hover:bg-accent"
          onClick={addTag}
        >
          使用 "{inputValue}"
        </div>
      )}
    </div>
  )
}

// 数字输入组件
const NumberInput = ({ input }: { input: any }) => {
  return (
    <Input
      type="number"
      className="w-full"
      value={input.value ?? ''}
      onChange={(e) => input.onChange(e.target.value ? Number(e.target.value) : null)}
    />
  )
}

// 布尔输入组件
const BooleanInput = ({ input }: { input: any }) => {
  return (
    <RadioGroup
      value={input.value?.toString()}
      onValueChange={(v) => input.onChange(v === 'true')}
      className="flex gap-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="true" id="true" />
        <label htmlFor="true" className="text-sm cursor-pointer">{'真'}</label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="false" id="false" />
        <label htmlFor="false" className="text-sm cursor-pointer">{'假'}</label>
      </div>
    </RadioGroup>
  )
}

// 枚举输入组件
const EnumInput = (props: { input: any; field: { schema?: any }; mode?: string }) => {
  const { input, field: { schema = {} }, mode } = props
  const value = input.value?.['$in'] || input.value?.in || input.value

  const enum_title = schema.enum_title || schema.enum_title1 || []
  const enums = schema.enum || schema.enum1 || []
  return (
    <Select
      value={mode == 'multiple' ? (value?.[0] || '') : (value || '')}
      onValueChange={(v) => input.onChange(mode == 'multiple' ? [v] : v)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="请选择" />
      </SelectTrigger>
      <SelectContent>
        {enums?.map((item: any, index: number) => {
          return (
            <SelectItem key={item} value={item}>
              {enum_title[index] || item}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

// 范围输入组件
const RangeInput = ({ input }: { input: any }) => {
  const onChange = (val: string, type: 'gte' | 'lte') => {
    input.onChange({ ...input.value, [type]: val })
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={input.value?.gte ?? ''}
        onChange={(e) => onChange(e.target.value, 'gte')}
        placeholder="最小值"
        className="flex-1"
      />
      <span className="text-muted-foreground">~</span>
      <Input
        type="number"
        value={input.value?.lte ?? ''}
        onChange={(e) => onChange(e.target.value, 'lte')}
        placeholder="最大值"
        className="flex-1"
      />
    </div>
  )
}

// 日期范围选择器组件
const RangeTimeInput = ({ input, field: { schema } }: { input: any; field: { schema?: any } }) => {
  const fmt = schema?.format || schema?.formatType
  const timeFormat = schema?.timeFormat || (fmt == 'time' ? 'HH:mm:ss' : fmt == 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss')

  const [open, setOpen] = useState(false)
  const dateRange = input.value?.gte && input.value?.lte
    ? [new Date(input.value.gte), new Date(input.value.lte)]
    : undefined

  const onChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range || !range.from || !range.to) {
      input.onChange(null)
      return
    }
    const date = {
      'gte': format(range.from, timeFormat.replace('YYYY', 'yyyy').replace('DD', 'dd')),
      'lte': format(range.to, timeFormat.replace('YYYY', 'yyyy').replace('DD', 'dd'))
    }
    input.onChange(date)
  }

  // 纯时间范围（使用 TimePicker）
  if (fmt == 'time' || schema?.timeFormat) {
    return (
      <div className="flex items-center gap-2">
        <TimePicker
          value={input.value?.gte || undefined}
          onChange={(date) => input.onChange({ ...input.value, gte: date?.toISOString() })}
        />
        <span>~</span>
        <TimePicker
          value={input.value?.lte || undefined}
          onChange={(date) => input.onChange({ ...input.value, lte: date?.toISOString() })}
        />
      </div>
    )
  }

  // 日期时间范围（使用 FormDate dateTime picker）
  if (fmt == 'dateTime' || fmt == 'date-time') {
    return (
      <div className="flex items-center gap-2">
        <FormDate
          allowClear
          picker="dateTime"
          value={input.value?.gte || undefined}
          onChange={(d) => {
            if (d) {
              input.onChange({ ...input.value, gte: new Date(d).toISOString() })
            } else {
              input.onChange({ ...input.value, gte: null })
            }
          }}
        />
        <span>~</span>
        <FormDate
          allowClear
          picker="dateTime"
          value={input.value?.lte || undefined}
          onChange={(d) => {
            if (d) {
              input.onChange({ ...input.value, lte: new Date(d).toISOString() })
            } else {
              input.onChange({ ...input.value, lte: null })
            }
          }}
        />
      </div>
    )
  }

  // 纯日期范围（使用 Calendar）
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateRange && "text-muted-foreground"
          )}
        >
          {dateRange ? (
            `${format(dateRange[0], 'yyyy-MM-dd')} - ${format(dateRange[1], 'yyyy-MM-dd')}`
          ) : (
            "选择日期范围"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={{ from: dateRange?.[0], to: dateRange?.[1] }}
          onSelect={(range) => {
            onChange(range)
            if (range?.from && range?.to) {
              setOpen(false)
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}

// 变化范围时间输入组件
const VariateRangeTimeInput = ({ input: { value, onChange }, field: { schema } }: { input: { value?: any; onChange: any }; field: { schema?: any } }) => {
  const fmt = schema?.format || schema?.formatType
  const timeFormat = schema?.timeFormat || (fmt == 'time' ? 'HH:mm:ss' : fmt == 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss')
  const [type, setType] = useState(value?.type)
  const opts = [
    { key: '前', value: 'forward' },
    { key: '后', value: 'backward' },
    { key: '当前', value: 'now' }
  ]
  const list = [
    { key: '年', value: 'Y' },
    { key: '季度', value: 'Q' },
    { key: '月', value: 'M' },
    { key: '周', value: 'w' },
    { key: '天', value: 'd' },
    { key: '时', value: 'h' },
    { key: '分', value: 'm' },
    { key: '秒', value: 's' }
  ]
  const unitList = list.filter(item => {
    const arr = timeFormat == 'YYYY-MM-DD'
      ? ['Y', 'Q', 'M', 'w', 'd']
      : timeFormat == 'HH:mm:ss'
        ? ['h', 'm', 's']
        : timeFormat == 'HH:mm'
          ? ['h', 'm']
          : list.map(v => v.value)
    return arr.indexOf(item.value) > -1
  })

  const handleChange = (v: any) => {
    const timeRange = { ...value, ...v }
    const start = timeRange.fromNow ? 'now' : 'nowzero'
    const mid = timeRange.type == 'forward' ? ' - ' : timeRange.type == 'backward' ? ' + ' : ''
    const end = timeRange.unit && !_.isNil(timeRange.count) ? timeRange.count + timeRange.unit : ''
    const newTime = timeRange.unit
      ? (timeRange.type == 'now' ? 'now ' + timeRange.unit : (end && mid ? start + mid + end : null))
      : null
    onChange(timeRange, newTime)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select
          value={value?.type || ''}
          onValueChange={(v) => { setType(v); handleChange({ type: v }) }
          }
        >
          <SelectTrigger className="w-[30%]">
            <SelectValue placeholder="选择方向" />
          </SelectTrigger>
          <SelectContent>
            {opts.map(item => (
              <SelectItem key={item.value} value={item.value}>{item.key}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {type != 'now' && (
          <Input
            type="number"
            value={value?.count ?? ''}
            onChange={(e) => handleChange({ count: e.target.value ? Number(e.target.value) : null })}
            placeholder={"输入数值"}
            min={1}
            className="flex-1"
          />
        )}
        <Select
          value={value?.unit || ''}
          onValueChange={(v) => handleChange({ unit: v })}
        >
          <SelectTrigger className="w-[30%]">
            <SelectValue placeholder="单位" />
          </SelectTrigger>
          <SelectContent>
            {unitList.map(item => (
              <SelectItem key={item.value} value={item.value}>{item.key}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {type != 'now' && (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={value?.fromNow || false}
            onCheckedChange={(checked) => handleChange({ fromNow: checked === true })}
          />
          <label className="text-sm">{'从当前开始'}</label>
        </div>
      )}
    </div>
  )
}

// 时间输入组件
const TimeInput = ({ input, field: { schema } }: { input: any; field: { schema?: any } }) => {
  const fmt = schema?.format || schema?.formatType
  const timeFormat = schema?.timeFormat || (fmt == 'time' ? 'HH:mm:ss' : fmt == 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss')

  const onChange = (val: Date | undefined) => {
    input.onChange(val ? format(val, timeFormat.replace('YYYY', 'yyyy').replace('DD', 'dd')) : val)
  }

  if (fmt == 'time' || schema?.timeFormat) {
    return (
      <TimePicker
        value={input.value || undefined}
        onChange={onChange}
      />
    )
  }

  return (
    <FormDate
      allowClear
      picker={fmt == 'date' ? 'date' : 'dateTime'}
      value={input.value || undefined}
      onChange={d => onChange(d ? new Date(d) : undefined)}
    />
  )
}

// 导出方法和组件
const METHODS = {
  'string': [
    { name: '等于', key: 'eq', component: TextInput },
    { name: '不等于', key: 'ne', component: TextInput },
    { name: '包含其中一个', key: 'arrayIn', component: TextInput },
    { name: '同时包含', key: 'arrayInAll', component: TextInput },
    { name: '不包含任何一个', key: 'arrayNin', component: TextInput },
    { name: '开始是', key: 'startsWith', component: TextInput },
    { name: '结尾是', key: 'endsWith', component: TextInput },
    { name: '开始不是', key: 'notStartsWith', component: TextInput },
    { name: '结尾不是', key: 'notEndsWith', component: TextInput },
    { name: '为空', key: 'isNull', component: NullInput },
    { name: '不为空', key: 'notNull', component: NullInput },
  ],
  'number': [
    { name: '等于', key: 'eq', component: NumberInput },
    { name: '不等于', key: 'ne', component: NumberInput },
    { name: '大于', key: 'gt', component: NumberInput },
    { name: '小于', key: 'lt', component: NumberInput },
    { name: '大于等于', key: 'gte', component: NumberInput },
    { name: '小于等于', key: 'lte', component: NumberInput },
    { name: '在范围内', key: 'range', component: RangeInput },
    { name: '不在范围内', key: 'notRange', component: RangeInput },
    { name: '为空', key: 'isNull', component: NullInput },
    { name: '不为空', key: 'notNull', component: NullInput },
  ],
  'boolean': [
    { name: '等于', key: 'eq', component: BooleanInput },
    { name: '为空', key: 'isNull', component: NullInput },
    { name: '不为空', key: 'notNull', component: NullInput },
  ],
  'date': [
    { name: '等于', key: 'eq', component: TimeInput },
    { name: '早于', key: 'lt', component: TimeInput },
    { name: '晚于', key: 'gt', component: TimeInput },
    { name: '早于等于', key: 'lte', component: TimeInput },
    { name: '晚于等于', key: 'gte', component: TimeInput },
    { name: '在范围内', key: 'range', component: RangeTimeInput },
    { name: '不在范围内', key: 'notRange', component: RangeTimeInput },
    { name: '为空', key: 'isNull', component: NullInput },
    { name: '不为空', key: 'notNull', component: NullInput },
  ],
  'area': [
    { name: '等于', key: 'eq' },
    { name: '不等于', key: 'ne' },
    { name: '包含其中一个', key: 'in' },
    { name: '不包含任何一个', key: 'nin' },
    { name: '属于', key: 'belongsTo' },
    { name: '不属于', key: 'notBelongsTo' },
    { name: '下级包含', key: 'subin' },
    { name: '下级不包含', key: 'subNotIn' },
    { name: '为空', key: 'isNull' },
    { name: '不为空', key: 'notNull' },
  ],
  'enum': [
    { name: '等于', key: 'eq', component: EnumInput },
    { name: '不等于', key: 'ne', component: EnumInput },
    { name: '包含其中一个', key: 'in', type: 'multipleSelect', component: (props: any) => <EnumInput {...props} mode='multiple' /> },
    { name: '不包含任何一个', key: 'nin', type: 'multipleSelect', component: (props: any) => <EnumInput {...props} mode='multiple' /> },
    { name: '为空', key: 'isNull', component: NullInput },
    { name: '不为空', key: 'notNull', component: NullInput },
  ],
  'enums': [
    { name: '包含其中一个', key: 'arrayIn', component: EnumInput },
    { name: '同时包含', key: 'arrayInAll', component: EnumInput },
    { name: '不包含任何一个', key: 'arrayNin', component: EnumInput },
    { name: '为空', key: 'isNull', component: NullInput },
    { name: '不为空', key: 'notNull', component: NullInput },
  ],
  'relateArray': [
    { name: '包含', key: 'arrayIn', type: 'multipleSelect' },
    { name: '不包含', key: 'arrayNin', type: 'multipleSelect' },
    { name: '为空', key: 'isNull', component: NullInput },
    { name: '不为空', key: 'notNull', component: NullInput },
  ],
  'relate': [
    { name: '包含其中一个', key: 'in' },
    { name: '不包含任何一个', key: 'nin' },
    { name: '为空', key: 'isNull', component: NullInput },
    { name: '不为空', key: 'notNull', component: NullInput },
  ],
  'relateTo': [
    { name: '等于', key: 'eq' },
    { name: '不等于', key: 'ne' },
    { name: '包含其中一个', key: 'in', type: 'multipleSelect' },
    { name: '不包含任何一个', key: 'nin', type: 'multipleSelect' },
    { name: '为空', key: 'isNull', component: NullInput },
    { name: '不为空', key: 'notNull', component: NullInput },
  ],
  'other': [
    { name: '为空', key: 'isNull', component: NullInput },
    { name: '不为空', key: 'notNull', component: NullInput },
  ]
}

export default METHODS

export {
  NullInput,
  TextInput,
  VariateRangeTimeInput
}
