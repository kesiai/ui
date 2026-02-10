# Form.BytesArray 字节数组

## 简介

`FormBytesArray` 是一个用于处理字节数组数据的表单输入组件，适用于存储和显示二进制数据或字节数组信息。

- **简单易用**：提供基础的文本输入界面，操作直观
- **灵活配置**：支持占位符、默认值、禁用状态等多种配置
- **表单集成**：通过 input 和 field 属性与表单状态无缝集成
- **状态同步**：自动处理值的变更和同步
- **禁用控制**：支持组件级别的禁用状态控制

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `input` | `object` | 否 | - | 输入对象，包含 value 和 onChange |
| `input.value` | `string` | 否 | - | 当前输入值 |
| `input.onChange` | `(value: string) => void` | 否 | - | 值变化回调函数 |
| `field` | `object` | 否 | - | 字段配置对象 |
| `field.schema` | `object` | 否 | - | 字段的 schema 配置 |
| `field.schema.placeholder` | `string` | 否 | `'请输入内容'` | 输入框占位符 |
| `field.schema.defaultVal` | `string` | 否 | - | 默认值 |
| `field.schema.disabled` | `boolean` | 否 | - | schema 级别的禁用状态 |
| `disabled` | `boolean` | 否 | `false` | 组件级别的禁用状态 |
| `meta` | `any` | 否 | - | 元数据对象 |
| `record` | `any` | 否 | - | 记录数据对象 |

### input 对象

input 对象用于连接表单状态，包含以下属性：

```tsx
input={{
  value: string,        // 当前值
  onChange: (value: string) => void  // 变化回调
}}
```

### field 对象

field 对象用于配置字段行为和显示：

```tsx
field={{
  schema: {
    placeholder: string,    // 占位符文本
    defaultVal: string,     // 默认值
    disabled: boolean       // 是否禁用
  },
  filter: any             // 过滤器配置
}}
```

## 基本用法

### 1. 基础文本输入

最简单的用法，提供一个基础的文本输入框。

```tsx
import { FormBytesArray } from '@/registry/components/form-bytes-array/form-bytes-array'
import { useState } from 'react'

function Example() {
  const [value, setValue] = useState('')

  return (
    <FormBytesArray
      input={{
        value,
        onChange: setValue
      }}
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
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: {
          placeholder: '请输入字节数组数据'
        }
      }}
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
      input={{
        value,
        onChange: setValue
      }}
      disabled
    />
  )
}
```

### 4. 设置默认值

通过 schema 配置默认值。

```tsx
function Example() {
  const [value, setValue] = useState('')

  return (
    <FormBytesArray
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: {
          defaultVal: '默认字节数据',
          placeholder: '请输入内容'
        }
      }}
    />
  )
}
```

### 5. 使用 schema 控制禁用

通过 schema.disabled 属性控制禁用状态。

```tsx
function Example() {
  const [value, setValue] = useState('数据内容')

  return (
    <FormBytesArray
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: {
          placeholder: '已禁用的输入框',
          disabled: true
        }
      }}
    />
  )
}
```

### 6. 禁用优先级示例

演示组件级 disabled 和 schema.disabled 的优先级。

```tsx
function Example() {
  const [value, setValue] = useState('测试数据')

  // schema.disabled 为 true，但组件 disabled 为 false
  // 结果：启用（组件级别优先级更高）
  return (
    <FormBytesArray
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: {
          disabled: true
        }
      }}
      disabled={false}
    />
  )
}
```

### 7. 在表单中使用

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
        input={{
          value: formData.bytesField,
          onChange: (value) => setFormData({ ...formData, bytesField: value })
        }}
        field={{
          schema: {
            placeholder: '请输入字节数组'
          }
        }}
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
import { FormBytesArray } from '@/registry/components/form-bytes-array/form-bytes-array'
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
          input={{
            value: formData.primaryKey,
            onChange: (value) => handleChange('primaryKey', value)
          }}
          field={{
            schema: {
              placeholder: '请输入主键字节数据',
              defaultVal: ''
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">次键数据</label>
        <FormBytesArray
          input={{
            value: formData.secondaryKey,
            onChange: (value) => handleChange('secondaryKey', value)
          }}
          field={{
            schema: {
              placeholder: '请输入次键字节数据'
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">元数据（只读）</label>
        <FormBytesArray
          input={{
            value: formData.metadata,
            onChange: (value) => handleChange('metadata', value)
          }}
          field={{
            schema: {
              placeholder: '自动生成的元数据',
              disabled: true
            }
          }}
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
import { FormBytesArray } from '@/registry/components/form-bytes-array/form-bytes-array'
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
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              placeholder: useCustomPlaceholder
                ? '请输入十六进制字节数据 (例如: 0x1A2B3C)'
                : '请输入内容',
              defaultVal: ''
            }
          }}
          disabled={isDisabled}
        />
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm">
          <strong>当前配置：</strong>
        </p>
        <ul className="text-xs mt-2 space-y-1">
          <li>• 禁用状态: {isDisabled ? '是' : '否'}</li>
          <li>• 自定义占位符: {useCustomPlaceholder ? '是' : '否'}</li>
          <li>• 当前值长度: {value.length} 字符</li>
        </ul>
      </div>
    </div>
  )
}
```

## 注意事项

1. **禁用状态优先级**：组件的 `disabled` 属性优先级高于 `field.schema.disabled`，当两者同时存在时，以组件的 `disabled` 为准。

2. **值类型**：该组件处理的是字符串类型的值，如果需要处理二进制数据，需要在业务层进行编码/解码（如 Base64、Hex 等）。

3. **受控组件**：组件是受控组件，必须通过 `input.value` 和 `input.onChange` 来管理值，不要尝试直接修改值。

4. **占位符默认值**：如果不配置 `field.schema.placeholder`，组件会使用默认值 `'请输入内容'`。

5. **空值处理**：当 `input.value` 为空或 `undefined` 时，输入框会显示为空，这是正常行为。

6. **onChange 回调**：`onChange` 回调接收的是字符串类型的值，确保接收方正确处理字符串类型。

7. **field 对象可选**：`field` 参数是可选的，如果不提供，组件会使用默认配置。

8. **meta 和 record**：这两个参数用于高级场景，通常在表单上下文中自动传递，手动使用时可以忽略。
