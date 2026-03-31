> **安装命令**: `npx shadcn@latest add @kesi/form-widget`

# FormWidget 表字段映射

## 简介

`FormWidget` 是一个智能表单字段映射组件，根据字段配置动态渲染对应的表单控件。

- **智能映射**：根据字段配置自动选择合适的表单组件
- **类型丰富**：支持30多种字段类型的自动识别和渲染
- **配置驱动**：通过 schema 配置即可实现复杂表单
- **灵活扩展**：支持自定义字段类型和组件
- **表单集成**：完美集成到表单系统中

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `config` | `Record<string, any>` | 否 | `{}` | 字段配置对象 |
| `value` | `any` | 否 | - | 字段值 |
| `input` | `object` | 否 | - | 输入对象 |
| `input.value` | `any` | 否 | - | 当前值 |
| `input.onChange` | `(value: any) => void` | 否 | - | 值变化回调 |
| `defaultValue` | `any` | 否 | - | 默认值 |
| `cellKey` | `string` | 否 | - | 单元格键值 |
| `fieldSchema` | `string` | 否 | - | 字段配置 JSON 字符串 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `label` | `string` | 否 | - | 字段标签 |
| `placeholder` | `string` | 否 | - | 占位符 |
| `required` | `boolean` | 否 | `false` | 是否必填 |
| `description` | `string` | 否 | - | 描述文本 |
| `error` | `string` | 否 | - | 错误提示 |
| `size` | `'small' \| 'middle' \| 'large'` | 否 | `'middle'` | 尺寸 |
| `meta` | `any` | 否 | - | 元数据 |
| `record` | `any` | 否 | - | 记录数据 |

## 支持的字段类型映射

### 基础类型
- `string` + `input` → FormInput
- `number` + `inputNumber` → FormInputNumber
- `boolean` + `checkbox` → FormCheckbox
- `string` + `enum1` → FormSelect
- `string` + `datePicker` → FormDate
- `string` + `dateRange` → FormDateRange
- `string` + `timePicker` → FormTime
- `object` + `map` → FormMap
- `object` + `attachment` → FormUpload
- `array` + `attachments` → FormUpload (附件组)
- `fieldType: rate` → Rate
- `fieldType: textEditor` → FormRichText
- `fieldType: bytesArray` → FormBytesArray
- `fieldType: serialNumber` → FormSerialNumber
- `fieldType: link` → FormLink
- `fieldType: area` → AreaComponent
- `fieldType: editableTable` → FormEditableTable

### 关联字段
- `relateTo` + `recordSelectType` → FormRelatePlus
- `relate?.id` (外部表) → RelateSelect/RelateMultiSelect/RelateModelSelect
- `internalTable` + `relate` → FormRelate
- `relateTo: 'User'` / `'Role'` → FormUserRole

### 特殊类型
- `config: '查找引用'` → FormReference
- `config: '表单信息'` → FormFormInfo

## 基本用法

### 1. 使用 config 属性

通过 config 对象配置字段。

```tsx
import { FormWidget } from '@/components/kesi/form-widget/form-widget'
import { useState } from 'react'

function Example() {
  const [value, setValue] = useState('')

  return (
    <FormWidget
      config={{
        type: 'string',
        fieldType: 'input',
        title: '用户名',
        placeholder: '请输入用户名'
      }}
      value={value}
      onChange={setValue}
      label="用户名"
    />
  )
}
```

### 2. 使用 fieldSchema 属性

通过 JSON 字符串配置字段。

```tsx
function Example() {
  const [value, setValue] = useState('')

  const schema = JSON.stringify({
    type: 'number',
    fieldType: 'inputNumber',
    title: '年龄',
    min: 0,
    max: 120
  })

  return (
    <FormWidget
      fieldSchema={schema}
      value={value}
      onChange={setValue}
      label="年龄"
    />
  )
}
```

### 3. 下拉选择字段

配置枚举选择器。

```tsx
function Example() {
  const [value, setValue] = useState('')

  return (
    <FormWidget
      config={{
        type: 'string',
        enum1: ['option1', 'option2', 'option3'],
        enum_title1: ['选项1', '选项2', '选项3'],
        title: '分类'
      }}
      value={value}
      onChange={setValue}
      label="产品分类"
      required
    />
  )
}
```

### 4. 日期选择器

配置日期字段。

```tsx
function Example() {
  const [value, setValue] = useState('')

  return (
    <FormWidget
      config={{
        type: 'string',
        fieldType: 'datePicker',
        title: '出生日期'
      }}
      value={value}
      onChange={setValue}
      label="出生日期"
    />
  )
}
```

### 5. 关联字段

配置关联字段。

```tsx
function Example() {
  const [value, setValue] = useState(null)

  return (
    <FormWidget
      config={{
        type: 'object',
        relateTo: 'Product',
        recordSelectType: 'select',
        showField: 'name',
        title: '产品'
      }}
      value={value}
      onChange={setValue}
      label="选择产品"
    />
  )
}
```

### 6. 禁用状态

设置字段为禁用。

```tsx
function Example() {
  const [value] = useState('固定值')

  return (
    <FormWidget
      config={{
        type: 'string',
        fieldType: 'input'
      }}
      value={value}
      onChange={() => {}}
      label="只读字段"
      disabled
    />
  )
}
```

### 7. 带描述和错误提示

完整的字段配置。

```tsx
function Example() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleChange = (newValue: string) => {
    setValue(newValue)
    if (newValue.length < 3) {
      setError('至少输入3个字符')
    } else {
      setError('')
    }
  }

  return (
    <FormWidget
      config={{
        type: 'string',
        fieldType: 'input'
      }}
      value={value}
      onChange={handleChange}
      label="用户名"
      placeholder="请输入用户名"
      description="3-20个字符"
      error={error}
      required
    />
  )
}
```

## 完整示例

### 动态表单生成器

创建一个动态表单，根据配置自动生成字段。

```tsx
import { FormWidget } from '@/components/kesi/form-widget/form-widget'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface FormConfig {
  [key: string]: {
    type: string
    fieldType?: string
    title: string
    placeholder?: string
    required?: boolean
    enum1?: string[]
    enum_title1?: string[]
  }
}

function DynamicFormGenerator() {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formConfig: FormConfig = {
    username: {
      type: 'string',
      fieldType: 'input',
      title: '用户名',
      placeholder: '请输入用户名',
      required: true
    },
    email: {
      type: 'string',
      fieldType: 'input',
      title: '邮箱',
      placeholder: '请输入邮箱',
      required: true
    },
    age: {
      type: 'number',
      fieldType: 'inputNumber',
      title: '年龄'
    },
    gender: {
      type: 'string',
      enum1: ['male', 'female', 'other'],
      enum_title1: ['男', '女', '其他'],
      title: '性别'
    },
    birthDate: {
      type: 'string',
      fieldType: 'datePicker',
      title: '出生日期'
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value })
    // 清除错误
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    Object.entries(formConfig).forEach(([key, config]) => {
      if (config.required && !formData[key]) {
        newErrors[key] = `${config.title}为必填项`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      console.log('表单数据:', formData)
      alert('提交成功！')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">动态表单生成器</h2>

      {Object.entries(formConfig).map(([key, config]) => (
        <FormWidget
          key={key}
          config={config}
          value={formData[key]}
          onChange={(value) => handleChange(key, value)}
          label={config.title}
          placeholder={config.placeholder}
          required={config.required}
          error={errors[key]}
        />
      ))}

      <Button onClick={handleSubmit} className="w-full">
        提交表单
      </Button>

      <div className="mt-4 p-4 bg-slate-50 rounded">
        <h3 className="font-medium mb-2">表单数据预览</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  )
}
```

## 注意事项

1. **配置优先级**：fieldSchema 和 config 同时存在时，优先使用 fieldSchema。

2. **空配置处理**：配置为空时，组件显示占位提示。

3. **类型匹配**：确保 type 和 fieldType 的组合是有效的，否则会显示未知类型提示。

4. **关联字段**：关联字段需要配置正确的 relateTo 或 relate.id，否则无法正常工作。

5. **值格式**：不同字段类型的值格式可能不同，确保传递正确的值类型。

6. **onChange 必需**：即使不处理值变化，也应提供 onChange 回调以保持接口一致性。

7. **受控组件**：FormWidget 是受控组件，必须通过 value 和 onChange 管理状态。

8. **字段映射**：组件内部通过 FieldComponentSelector 根据配置自动选择合适的子组件。

9. **扩展性**：如需支持新字段类型，需要在 FieldComponentSelector 中添加对应的映射逻辑。

10. **性能考虑**：大量字段时建议使用 React.memo 优化渲染性能。
