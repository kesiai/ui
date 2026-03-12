# FormSelect 选择器

## 导入路径

```tsx
import { FormSelect } from '@/components/airiot/form/form-select'
```

## 基础用法

```tsx
import { FormSelect } from '@/components/airiot/form/form-select'

function SelectExample() {
  const [value, setValue] = useState('')

  const options = [
    { value: 'option1', label: '选项1' },
    { value: 'option2', label: '选项2' },
    { value: 'option3', label: '选项3' }
  ]

  return (
    <FormSelect
      label="选择选项"
      placeholder="请选择"
      value={value}
      onChange={(v) => setValue(v)}
      options={options}
      required
    />
  )
}
```

## 异步选项

```tsx
import { FormSelect } from '@/components/airiot/form/form-select'
import { useState, useEffect } from 'react'

function AsyncSelectExample() {
  const [value, setValue] = useState('')
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/options')
        const data = await response.json()
        setOptions(data)
      } catch (error) {
        console.error('获取选项失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [])

  return (
    <FormSelect
      label="异步选项"
      placeholder="请选择"
      value={value}
      onChange={setValue}
      options={options}
      loading={loading}
    />
  )
}
```

## 级联选择器

```tsx
import { FormSelect } from '@/components/airiot/form/form-select'
import { useState, useEffect } from 'react'

function CascadeSelectExample() {
  const [provinceValue, setProvinceValue] = useState('')
  const [cityValue, setCityValue] = useState('')
  const [cities, setCities] = useState([])

  const provinces = [
    { value: 'zhejiang', label: '浙江省' },
    { value: 'jiangsu', label: '江苏省' }
  ]

  useEffect(() => {
    if (provinceValue) {
      // 根据省份获取城市
      const fetchCities = async () => {
        const response = await fetch(`/api/cities?province=${provinceValue}`)
        const data = await response.json()
        setCities(data)
        setCityValue('')
      }
      fetchCities()
    } else {
      setCities([])
      setCityValue('')
    }
  }, [provinceValue])

  return (
    <div>
      <FormSelect
        label="省份"
        placeholder="请选择省份"
        value={provinceValue}
        onChange={setProvinceValue}
        options={provinces}
      />
      <FormSelect
        label="城市"
        placeholder="请选择城市"
        value={cityValue}
        onChange={setCityValue}
        options={cities}
        disabled={!provinceValue}
      />
    </div>
  )
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| name | string | - | 字段名 |
| label | string | - | 标签文本 |
| placeholder | string | - | 占位符 |
| value | string \| number | - | 值 |
| onChange | (value: string \| number) => void | - | 变化事件 |
| options | Option[] | [] | 选项列表 |
| required | boolean | false | 是否必填 |
| disabled | boolean | false | 是否禁用 |
| loading | boolean | false | 是否加载中 |
| searchable | boolean | false | 是否可搜索 |
| multiple | boolean | false | 是否多选 |
| allowClear | boolean | true | 是否可清除 |
| showSearch | boolean | true | 显示搜索框 |
| filterOption | (input: string, option: Option) => boolean | - | 自定义过滤 |
| defaultValue | string \| number \| string[] | - | 默认值 |

## Option 类型

```tsx
interface Option {
  value: string \| number
  label: string
  disabled?: boolean
  group?: string
}
```

## 示例

### 带分组的下拉框

```tsx
import { FormSelect } from '@/components/airiot/form/form-select'

function GroupedSelectExample() {
  const options = [
    {
      group: '水果',
      options: [
        { value: 'apple', label: '苹果' },
        { value: 'banana', label: '香蕉' }
      ]
    },
    {
      group: '蔬菜',
      options: [
        { value: 'carrot', label: '胡萝卜' },
        { value: 'potato', label: '土豆' }
      ]
    }
  ]

  const [value, setValue] = useState('')

  return (
    <FormSelect
      label="选择食物"
      placeholder="请选择"
      value={value}
      onChange={setValue}
      options={options}
    />
  )
}
```

### 多选选择器

```tsx
import { FormSelect } from '@/components/airiot/form/form-select'

function MultipleSelectExample() {
  const [values, setValues] = useState([])

  const options = [
    { value: 'apple', label: '苹果' },
    { value: 'banana', label: '香蕉' },
    { value: 'orange', label: '橙子' },
    { value: 'grape', label: '葡萄' }
  ]

  return (
    <FormSelect
      label="喜欢的水果"
      placeholder="请选择"
      value={values}
      onChange={setValues}
      options={options}
      multiple
    />
  )
}
```

### 带搜索的选择器

```tsx
import { FormSelect } from '@/components/airiot/form/form-select'

function SearchableSelectExample() {
  const [value, setValue] = useState('')

  const options = [
    { value: 'beijing', label: '北京' },
    { value: 'shanghai', label: '上海' },
    { value: 'guangzhou', label: '广州' },
    { value: 'shenzhen', label: '深圳' }
  ]

  // 自定义过滤函数
  const filterOption = (input, option) => {
    return option.label.toLowerCase().includes(input.toLowerCase())
  }

  return (
    <FormSelect
      label="搜索城市"
      placeholder="搜索城市..."
      value={value}
      onChange={setValue}
      options={options}
      searchable
      filterOption={filterOption}
    />
  )
}
```

## 注意事项

- 多选模式下，value 是数组类型
- 异步加载选项时，建议显示 loading 状态
- 级联选择器需要手动处理选项的更新
- 大数据量时，建议开启搜索功能以提高用户体验