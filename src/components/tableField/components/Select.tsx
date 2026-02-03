import * as React from 'react'
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import isNull from 'lodash/isNull'
import isUndefined from 'lodash/isUndefined'
import isEmpty from 'lodash/isEmpty'
import isNaN from 'lodash/isNaN'
import isNumber from 'lodash/isNumber'

export interface SelectOption {
  value: string | number
  label: string | React.ReactNode
  disabled?: boolean
}

export interface SelectComponentProps {
  input: {
    value?: string | number | (string | number)[]
    onChange?: (value: string | number | (string | number)[] | null) => void
  }
  field?: {
    schema?: {
      selectFace?: 'select' | 'flat' | 'button'
      selectType?: 'single' | 'multiple'
      defaultVal?: string
      disabled?: boolean
      dataType?: 'string' | 'number'
      enum1?: string[]
      enum_title1?: string[]
      enumList?: string[]
      enumTitle?: string[]
      enum_color1?: string[]
      size?: 'small' | 'middle' | 'large'
      [key: string]: any
    }
    filter?: any
    meta?: any
  }
  allowClear?: boolean
  meta?: any
  record?: any
  [key: string]: any
}

// 带全选的多选框
const CheckboxAll: React.FC<{
  value?: (string | number)[]
  onChange: (value: (string | number)[]) => void
  options: SelectOption[]
  disabled?: boolean
}> = ({ value = [], onChange, options, disabled }) => {
  const [indeterminate, setIndeterminate] = React.useState(
    value.length < options.length && value.length > 0
  )
  const [checkAll, setCheckAll] = React.useState(value.length === options.length)

  const handleChange = (list: (string | number)[]) => {
    onChange(list)
    setIndeterminate(!!list.length && list.length < options.length)
    setCheckAll(list.length === options.length)
  }

  const onCheckAllChange = (checked: boolean) => {
    const list = checked ? options.map(item => item.value) : []
    handleChange(list)
    setIndeterminate(false)
    setCheckAll(checked)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="select-all"
          checked={checkAll}
          onCheckedChange={onCheckAllChange}
          disabled={disabled}
          aria-checked={indeterminate ? 'mixed' : checkAll}
        />
        <label
          htmlFor="select-all"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          全选
        </label>
      </div>
      <div className="space-y-1">
        {options.map(option => (
          <div key={String(option.value)} className="flex items-center space-x-2">
            <Checkbox
              id={`select-${option.value}`}
              checked={value.includes(option.value)}
              onCheckedChange={(checked) => {
                const newValue = checked
                  ? [...value, option.value]
                  : value.filter(v => v !== option.value)
                handleChange(newValue)
              }}
              disabled={disabled || option.disabled}
            />
            <label
              htmlFor={`select-${option.value}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

const SelectComponent = React.forwardRef<HTMLButtonElement, SelectComponentProps>(
  (props, ref) => {
    const { input, field, allowClear = true, meta } = props
    const { onChange, value } = input || {}
    const schema = field?.schema || {}
    const filter = field?.filter

    const selectFace = schema.selectFace ?? 'select'
    const selectType = schema.selectType
    const defaultVal = schema.defaultVal
    const dis = schema.disabled ?? false
    const dataType = schema.dataType ?? 'string'
    const enum1 = schema.enum1
    const enum_title1 = schema.enum_title1
    const enumList = schema.enumList || (schema as any)['enum']
    const enumTitle = schema.enumTitle || (schema as any)['enum_title']
    const enum_color1 = schema.enum_color1
    const size = schema.size ?? 'middle'

    const disabled = dis && !filter && !isEmpty(meta)

    const isNullValue = (v: any): boolean =>
      isNull(v) || isUndefined(v) || isNaN(v) || (typeof v === 'string' && isEmpty(v))

    const defaultValFormat = (): string | number | (string | number)[] | undefined => {
      if (!defaultVal) return undefined
      if (selectType === 'multiple') {
        return dataType === 'number'
          ? defaultVal.split(',').map((v: string) => parseInt(v))
          : defaultVal.split(',')
      } else {
        return dataType === 'number' ? parseInt(defaultVal || '') : defaultVal
      }
    }

    // 默认值生效
    React.useEffect(() => {
      if (isNullValue(value) && !isNullValue(defaultVal) && !filter) {
        onChange?.(defaultValFormat() as any)
      }
    }, [])

    // 生成选项列表
    const optionList: SelectOption[] = React.useMemo(() => {
      if (enum1 && enum1.length > 0) {
        // 工作表特制
        return enum1.map((item: string, index: number) => {
          const label = enum_title1?.[index] || item
          return {
            value: dataType === 'number' ? parseInt(item) : item,
            label: enum_color1 ? (
              <div className="flex items-center">
                <div
                  style={{
                    backgroundColor: enum_color1[index],
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    marginRight: 4
                  }}
                />
                <div>{label}</div>
              </div>
            ) : label
          }
        })
      } else if (enumList && enumList.length > 0) {
        // 普通
        return enumList.map((item: string, index: number) => ({
          value: dataType === 'number' ? parseInt(item as string) : item,
          label: enumTitle?.[index] || item
        }))
      }
      return []
    }, [enum1, enum_title1, enumList, enumTitle, enum_color1, dataType])

    const handleChange = (val: string) => {
      const parsedValue = dataType === 'number' ? parseInt(val) : val
      onChange?.(isUndefined(val) ? null : parsedValue)
    }

    const currentValue = isNullValue(value) && !isNumber(value)
      ? (selectType === 'multiple' ? [] : null)
      : value

    const sizeClasses = {
      small: 'h-8 px-2 py-1 text-sm',
      middle: 'h-10 px-3 py-2',
      large: 'h-12 px-4 py-3 text-lg'
    }

    // 工作表特制下拉选或普通下拉选
    if (selectFace === 'select' || selectFace !== 'flat') {
      return (
        <ShadcnSelect
          value={currentValue == 0 ? '0' : (currentValue ? String(currentValue) : undefined)}
          onValueChange={handleChange}
          disabled={disabled}
        >
          <SelectTrigger
            ref={ref}
            className={cn(sizeClasses[size as 'small' | 'middle' | 'large'], 'w-full')}
          >
            <SelectValue placeholder="请选择" />
          </SelectTrigger>
          <SelectContent>
            {allowClear && (
              <SelectItem value="__clear">清空</SelectItem>
            )}
            {optionList.map(option => (
              <SelectItem
                key={String(option.value)}
                value={String(option.value)}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </ShadcnSelect>
      )
    }

    // 平铺多选
    if (selectType === 'multiple') {
      return (
        <CheckboxAll
          value={currentValue as (string | number)[]}
          onChange={onChange as any}
          options={optionList}
          disabled={disabled}
        />
      )
    }

    // 平铺单选 - 使用 Select 替代 Radio.Group
    return (
      <ShadcnSelect
        value={currentValue == 0 ? '0' : (currentValue ? String(currentValue) : undefined)}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger
          ref={ref}
          className={cn(sizeClasses[size as 'small' | 'middle' | 'large'], 'w-full')}
        >
          <SelectValue placeholder="请选择" />
        </SelectTrigger>
        <SelectContent>
          {allowClear && (
            <SelectItem value="__clear">清空</SelectItem>
          )}
          {optionList.map(option => (
            <SelectItem
              key={String(option.value)}
              value={String(option.value)}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadcnSelect>
    )
  }
)

SelectComponent.displayName = 'SelectComponent'

export default SelectComponent
