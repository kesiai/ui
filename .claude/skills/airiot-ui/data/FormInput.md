# FormInput 输入框

## 导入路径

```tsx
import { FormInput } from '@/components/airiot/form/form-input'
```

## 基础用法

```tsx
import { FormInput } from '@/components/airiot/form/form-input'

function InputExample() {
  const [value, setValue] = useState('')

  return (
    <FormInput
      label="用户名"
      placeholder="请输入用户名"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      required
    />
  )
}
```

## 受控用法

```tsx
import { FormInput } from '@/components/airiot/form/form-input'
import { Form } from '@/components/airiot/form/form'

function ControlledInputExample() {
  const form = Form.useForm({
    initialValues: {
      username: ''
    }
  })

  return (
    <Form form={form}>
      <FormInput
        name="username"
        label="用户名"
        placeholder="请输入用户名"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 3, message: '用户名至少3个字符' }
        ]}
      />
    </Form>
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
| required | boolean | false | 是否必填 |
| disabled | boolean | false | 是否禁用 |
| readOnly | boolean | false | 是否只读 |
| maxLength | number | - | 最大长度 |
| minLength | number | - | 最小长度 |
| type | 'text' \| 'password' \| 'email' \| 'number' \| 'tel' | 'text' | 输入类型 |
| rules | Rule[] | [] | 验证规则 |
| error | string | - | 错误信息 |
| helperText | string | - | 帮助文本 |

## 验证规则

```tsx
type Rule = {
  required?: boolean
  message?: string
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (value: any) => Promise<void>
}
```

## 示例

### 带验证的输入框

```tsx
import { FormInput } from '@/components/airiot/form/form-input'
import { useState } from 'react'

function ValidatedInput() {
  const [value, setValue] = useState('')

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const rules = [
    { required: true, message: '请输入邮箱地址' },
    {
      validator: (_, value) => {
        if (value && !validateEmail(value)) {
          return Promise.reject('请输入有效的邮箱地址')
        }
        return Promise.resolve()
      }
    }
  ]

  return (
    <FormInput
      label="邮箱"
      placeholder="请输入邮箱地址"
      value={value}
      onChange={setValue}
      rules={rules}
      type="email"
    />
  )
}
```

### 数字输入框

```tsx
import { FormInput } from '@/components/airiot/form/form-input'

function NumberInputExample() {
  const [value, setValue] = useState(0)

  return (
    <FormInput
      label="年龄"
      placeholder="请输入年龄"
      value={value}
      onChange={(v) => setValue(Number(v))}
      type="number"
      min={0}
      max={150}
    />
  )
}
```

### 密码输入框

```tsx
import { FormInput } from '@/components/airiot/form/form-input'

function PasswordInputExample() {
  const [value, setValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div>
      <FormInput
        label="密码"
        placeholder="请输入密码"
        value={value}
        onChange={setValue}
        type={showPassword ? 'text' : 'password'}
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少6个字符' }
        ]}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? '隐藏密码' : '显示密码'}
      </button>
    </div>
  )
}
```

## 注意事项

- 使用 FormInput 时，建议配合 Form 组件使用以获得更好的表单管理
- 验证规则会在失去焦点时触发
- 对于复杂验证，可以使用自定义 validator
- 数字类型的输入框需要将值转换为数字