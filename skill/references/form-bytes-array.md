> **安装命令**: `npx shadcn@latest add @kesi/form-bytes-array`

# Form.BytesArray 字节数组

## 简介

`FormBytesArray` 是一个用于处理字节数组数据的表单输入组件，适用于存储和显示二进制数据或字节数组信息。

- **简单易用**：提供基础的文本输入界面，操作直观
- **灵活配置**：支持占位符、默认值、禁用状态等多种配置
- **表单集成**：支持 react-hook-form 等表单库无缝集成
- **状态同步**：自动处理值的变更和同步
- **禁用控制**：支持组件级别的禁用状态控制

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `string` | 否 | - | 当前值 |
| `onChange` | `(value: string) => void` | 否 | - | 值变化回调函数 |
| `placeholder` | `string` | 否 | `'请输入内容'` | 输入框占位符 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `onBlur` | `() => void` | 否 | - | 失焦回调（react-hook-form） |
| `name` | `string` | 否 | - | 字段名（react-hook-form） |
| `ref` | `Ref<any>` | 否 | - | ref 引用（react-hook-form） |
| `id` | `string` | 否 | - | 字段 ID（FormField 生成） |
| `schema` | `Record<string, any>` | 否 | - | 表单 schema |
| `record` | `any` | 否 | - | 表单记录数据 |

## 基本用法

### 1. 基础文本输入

最简单的用法，提供一个基础的文本输入框。

```tsx
import { FormBytesArray } from '@/components/kesi/form-bytes-array/form-bytes-array'
import { useState } from 'react'

function Example() {
  const [value, setValue] = useState('')

  return (
    <FormBytesArray
      value={value}
      onChange={setValue}
    />
  )
}
```

### 2. 带占位符的输入框

配置自定义占位符文本。

```tsx
function Example() {
  const [value, setValue] = useState('')

  return (
    <FormBytesArray
      value={value}
      onChange={setValue}
      placeholder="请输入字节数组数据"
    />
  )
}
```

### 3. 禁用状态的输入框

设置禁用状态，禁止用户输入。

```tsx
function Example() {
  const [value, setValue] = useState('初始数据')

  return (
    <FormBytesArray
      value={value}
      onChange={setValue}
      disabled
    />
  )
}
```

### 4. 设置默认值

通过 useState 初始值设置默认值。

```tsx
function Example() {
  const [value, setValue] = useState('默认字节数据')

  return (
    <FormBytesArray
      value={value}
      onChange={setValue}
      placeholder="请输入内容"
    />
  )
}
```

### 5. 在表单中使用

配合表单组件使用，处理表单提交。

```tsx
function Example() {
  const [formData, setFormData] = useState({
    bytesField: ''
  })

  const handleSubmit = () => {
    console.log('表单数据:', formData)
  }

  return (
    <div>
      <FormBytesArray
        value={formData.bytesField}
        onChange={(value) => setFormData({ ...formData, bytesField: value })}
        placeholder="请输入字节数组"
      />
      <button onClick={handleSubmit}>提交</button>
    </div>
  )
}
```

## 完整示例

### 字节数组数据录入表单

创建一个完整的字节数据录入场景，包含多个配置选项和状态管理。

```tsx
import { FormBytesArray } from '@/components/kesi/form-bytes-array/form-bytes-array'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

function BytesArrayForm() {
  const [formData, setFormData] = useState({
    primaryKey: '',
    secondaryKey: '',
    metadata: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('提交的字节数据:', formData)
    setIsSubmitting(false)
  }

  const handleReset = () => {
    setFormData({
      primaryKey: '',
      secondaryKey: '',
      metadata: ''
    })
  }

  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <h2 className="text-xl font-semibold">字节数组数据录入</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium">主键数据</label>
        <FormBytesArray
          value={formData.primaryKey}
          onChange={(value) => handleChange('primaryKey', value)}
          placeholder="请输入主键字节数据"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">次键数据</label>
        <FormBytesArray
          value={formData.secondaryKey}
          onChange={(value) => handleChange('secondaryKey', value)}
          placeholder="请输入次键字节数据"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">元数据（只读）</label>
        <FormBytesArray
          value={formData.metadata}
          onChange={(value) => handleChange('metadata', value)}
          placeholder="自动生成的元数据"
          disabled
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.primaryKey}
        >
          {isSubmitting ? '提交中...' : '提交数据'}
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          重置
        </Button>
      </div>

      <div className="mt-4 p-4 bg-slate-50 rounded">
        <h3 className="text-sm font-medium mb-2">当前数据预览：</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  )
}
```

### 动态配置的字节数组编辑器

支持动态切换配置的字节数组编辑器。

```tsx
import { FormBytesArray } from '@/components/kesi/form-bytes-array/form-bytes-array'
import { useState } from 'react'
import { Switch } from '@/components/ui/switch'

function DynamicBytesEditor() {
  const [value, setValue] = useState('初始数据')
  const [isDisabled, setIsDisabled] = useState(false)
  const [useCustomPlaceholder, setUseCustomPlaceholder] = useState(false)

  return (
    <div className="space-y-6 p-6 border rounded-lg">
      <h2 className="text-xl font-semibold">动态配置字节数组编辑器</h2>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={isDisabled}
            onCheckedChange={setIsDisabled}
          />
          <label className="text-sm">禁用状态</label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={useCustomPlaceholder}
            onCheckedChange={setUseCustomPlaceholder}
          />
          <label className="text-sm">自定义占位符</label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">字节数组内容</label>
        <FormBytesArray
          value={value}
          onChange={setValue}
          placeholder={useCustomPlaceholder
            ? '请输入十六进制字节数据 (例如: 0x1A2B3C)'
            : '请输入内容'}
          disabled={isDisabled}
        />
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm">
          <strong>当前配置：</strong>
        </p>
        <ul className="text-xs mt-2 space-y-1">
          <li>禁用状态: {isDisabled ? '是' : '否'}</li>
          <li>自定义占位符: {useCustomPlaceholder ? '是' : '否'}</li>
          <li>当前值长度: {value.length} 字符</li>
        </ul>
      </div>
    </div>
  )
}
```

## 注意事项

1. **值类型**：该组件处理的是字符串类型的值，如果需要处理二进制数据，需要在业务层进行编码/解码（如 Base64、Hex 等）。

2. **受控组件**：组件是受控组件，必须通过 `value` 和 `onChange` 来管理值，不要尝试直接修改值。

3. **占位符默认值**：如果不配置 `placeholder`，组件会使用默认值 `'请输入内容'`。

4. **空值处理**：当 `value` 为空或 `undefined` 时，输入框会显示为空，这是正常行为。

5. **onChange 回调**：`onChange` 回调接收的是字符串类型的值，确保接收方正确处理字符串类型。

6. **react-hook-form 集成**：`onBlur`、`name`、`ref` 等属性用于 react-hook-form 集成，手动使用时通常不需要传递这些属性。
