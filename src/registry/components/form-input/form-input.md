# Form.Input 输入框组件

## 简介

`FormInput` 是一个功能丰富的输入框组件,支持单行输入和多行文本域。

- **多种输入类型**：支持单行输入框和多行文本域
- **内容类型**：支持文本、密码、邮箱、网址、电话等多种内容格式
- **样式变体**：提供默认、边框、填充、幽灵四种样式
- **尺寸可调**：支持小、中、大三种尺寸
- **功能丰富**：支持前缀/后缀、前后置标签、清除按钮、字数统计、自动去除空格等功能
- **受控/非受控**：支持受控和非受控两种模式

## 适用场景

- 表单数据输入
- 搜索框
- 密码输入
- 多行文本编辑
- 带单位的数值输入
- 需要字数限制的文本输入

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `inputType` | `'input' \| 'textarea'` | 否 | `'input'` | 输入框类型 |
| `textContent` | `'text' \| 'password' \| 'email' \| 'url' \| 'tel'` | 否 | `'text'` | 内容类型（HTML type 属性） |
| `value` | `string` | 否 | - | 当前值（受控模式） |
| `defaultValue` | `string` | 否 | `''` | 默认值（非受控模式） |
| `placeholder` | `string` | 否 | `'请输入内容'` | 占位提示文字 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `readOnly` | `boolean` | 否 | `false` | 是否只读 |
| `allowClear` | `boolean` | 否 | `false` | 是否显示清除按钮 |
| `bordered` | `boolean` | 否 | `true` | 是否显示边框 |
| `maxLength` | `number` | 否 | - | 最大长度 |
| `prefix` | `ReactNode` | 否 | - | 前缀内容 |
| `suffix` | `ReactNode` | 否 | - | 后缀内容 |
| `addonBefore` | `ReactNode` | 否 | - | 前置标签 |
| `addonAfter` | `ReactNode` | 否 | - | 后置标签 |
| `showCount` | `boolean` | 否 | `false` | 是否显示字数统计 |
| `delBlank` | `boolean` | 否 | `false` | 是否去除空格（失焦时自动去除首尾空格） |
| `autoFocus` | `boolean` | 否 | `false` | 自动聚焦 |
| `variant` | `'default' \| 'outline' \| 'filled' \| 'ghost'` | 否 | `'default'` | 样式变体 |
| `size` | `'sm' \| 'md' \| 'lg'` | 否 | `'md'` | 尺寸 |
| `onChange` | `(value: string, event: ChangeEvent) => void` | 否 | - | 值变化回调 |
| `onPressEnter` | `(event: KeyboardEvent) => void` | 否 | - | 回车回调 |
| `onBlur` | `(event: FocusEvent) => void` | 否 | - | 失焦回调 |
| `onFocus` | `(event: FocusEvent) => void` | 否 | - | 聚焦回调 |
| `onInput` | `(event: ChangeEvent) => void` | 否 | - | 输入回调 |

## 样式变体

| 变体 | 说明 |
|------|------|
| `default` | 默认样式，标准边框和背景 |
| `outline` | 双层边框样式 |
| `filled` | 淡色填充背景 |
| `ghost` | 透明边框，悬停时显示背景 |

## 尺寸规格

| 尺寸 | 高度 | 字号 |
|------|------|------|
| `sm` | 32px | 小号文本 |
| `md` | 40px | 标准文本 |
| `lg` | 48px | 大号文本 |

## 基本用法

### 1. 基础输入框

```tsx
import { FormInput } from '@/registry/components/form-input/form-input'

function BasicInput() {
  return <FormInput placeholder="请输入内容" />
}
```

### 2. 多行文本域

```tsx
function TextareaExample() {
  return (
    <FormInput
      inputType="textarea"
      placeholder="请输入多行文本"
      showCount
      maxLength={200}
    />
  )
}
```

### 3. 密码输入框

```tsx
function PasswordInput() {
  return (
    <FormInput
      textContent="password"
      placeholder="请输入密码"
    />
  )
}
```

### 4. 带前后缀的输入框

```tsx
function InputWithAddons() {
  return (
    <FormInput
      placeholder="https://example.com"
      prefix={<span className="text-muted-foreground">https://</span>}
      suffix={<span className="text-muted-foreground">.com</span>}
    />
  )
}
```

### 5. 带前后置标签

```tsx
function InputWithLabels() {
  return (
    <FormInput
      placeholder="请输入用户名"
      addonBefore={<span className="text-muted-foreground">@</span>}
      addonAfter={<span className="text-muted-foreground">用户</span>}
    />
  )
}
```

### 6. 可清除的输入框

```tsx
function ClearableInput() {
  return (
    <FormInput
      placeholder="输入内容后可清除"
      allowClear
      defaultValue="可清除的内容"
    />
  )
}
```

### 7. 带字数统计

```tsx
function InputWithCount() {
  return (
    <FormInput
      inputType="textarea"
      placeholder="限制最多 100 字"
      showCount
      maxLength={100}
    />
  )
}
```

### 8. 自动去除空格

```tsx
function InputWithTrim() {
  return (
    <FormInput
      placeholder="失焦时自动去除首尾空格"
      delBlank
    />
  )
}
```

### 9. 不同样式变体

```tsx
function VariantInputs() {
  return (
    <div className="space-y-4">
      <FormInput variant="default" placeholder="默认样式" />
      <FormInput variant="outline" placeholder="双层边框" />
      <FormInput variant="filled" placeholder="填充样式" />
      <FormInput variant="ghost" placeholder="幽灵样式" />
    </div>
  )
}
```

### 10. 不同尺寸

```tsx
function SizeInputs() {
  return (
    <div className="space-y-4">
      <FormInput size="sm" placeholder="小尺寸输入框" />
      <FormInput size="md" placeholder="中尺寸输入框" />
      <FormInput size="lg" placeholder="大尺寸输入框" />
    </div>
  )
}
```

### 11. 受控模式

```tsx
import { useState } from 'react'

function ControlledInput() {
  const [value, setValue] = useState('')

  return (
    <FormInput
      value={value}
      onChange={setValue}
      placeholder="受控输入框"
    />
  )
}
```

### 12. 限制最大长度

```tsx
function LimitedInput() {
  return (
    <FormInput
      placeholder="最多输入 20 个字符"
      maxLength={20}
      showCount
    />
  )
}
```

## 完整示例

### 登录表单

```tsx
import { FormInput } from '@/registry/components/form-input/form-input'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ username, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium mb-2">
          用户名
        </label>
        <FormInput
          value={username}
          onChange={setUsername}
          placeholder="请输入用户名"
          prefix={<span className="text-muted-foreground">@</span>}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          密码
        </label>
        <FormInput
          value={password}
          onChange={setPassword}
          textContent="password"
          placeholder="请输入密码"
          maxLength={20}
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        登录
      </button>
    </form>
  )
}
```

### 留言表单

```tsx
import { FormInput } from '@/registry/components/form-input/form-input'

function MessageForm() {
  return (
    <div className="space-y-4 w-full max-w-2xl">
      <FormInput
        placeholder="您的姓名"
        addonBefore={<span className="text-muted-foreground">姓名:</span>}
      />

      <FormInput
        textContent="email"
        placeholder="您的邮箱"
        addonBefore={<span className="text-muted-foreground">邮箱:</span>}
      />

      <FormInput
        inputType="textarea"
        placeholder="请输入留言内容"
        showCount
        maxLength={500}
        delBlank
        style={{ minHeight: '120px' }}
      />
    </div>
  )
}
```

### 搜索框

```tsx
import { FormInput } from '@/registry/components/form-input/form-input'
import { useState } from 'react'

function SearchBox() {
  const [keyword, setKeyword] = useState('')

  const handleSearch = () => {
    console.log('搜索:', keyword)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="flex gap-2">
      <FormInput
        value={keyword}
        onChange={setKeyword}
        onPressEnter={handleKeyPress}
        placeholder="搜索关键词"
        allowClear
        className="flex-1"
      />
      <button
        onClick={handleSearch}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        搜索
      </button>
    </div>
  )
}
```

### 网址输入

```tsx
import { FormInput } from '@/registry/components/form-input/form-input'

function UrlInput() {
  return (
    <FormInput
      textContent="url"
      placeholder="example.com"
      prefix={<span className="text-muted-foreground">https://</span>}
      suffix={<span className="text-muted-foreground">.com</span>}
    />
  )
}
```

## 注意事项

1. **受控与非受控模式**：
   - 提供 `value` 属性时为受控模式，必须通过 `onChange` 更新值
   - 提供 `defaultValue` 属性时为非受控模式，组件内部管理状态

2. **字数统计显示**：
   - `showCount` 在多行文本域时显示在右下角
   - 单行输入框在达到最大长度时显示

3. **清除按钮**：
   - 只有在输入框有值且非禁用、非只读时才显示
   - 点击清除会将值设为空字符串

4. **去除空格**：
   - `delBlank` 只在失焦时生效
   - 自动去除字符串首尾的空格

5. **前后缀和前置标签的区别**：
   - `prefix`/`suffix`：显示在输入框内部的前后缀
   - `addonBefore`/`addonAfter`：显示在输入框外部的标签

6. **最大长度限制**：
   - `maxLength` 限制输入字符数量
   - 达到最大长度时会显示提示

7. **尺寸选择**：
   - 根据表单布局选择合适的尺寸
   - 建议在紧凑表单中使用 `sm` 尺寸
