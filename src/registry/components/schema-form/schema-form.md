> **安装命令**: `npx shadcn@latest add @kesi/schema-form`

# SchemaForm JSON Schema 表单

## 简介

`SchemaForm` 是一个基于 JSON Schema 自动生成表单的组件，支持通过配置定义表单结构和验证规则。

- **Schema 驱动**：通过 JSON Schema 自动生成表单字段
- **自动验证**：根据 Schema 自动生成验证规则
- **灵活配置**：支持 formSchema 自定义字段 UI 展示
- **布局系统**：继承 Form 组件的 7 种预设布局
- **类型安全**：基于 TypeScript 的完整类型支持

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `schema` | `JSONSchema7` | 是 | - | JSON Schema 定义，描述数据结构和验证规则 |
| `formSchema` | `FormSchemaConfig` | 否 | - | 表单字段 UI 配置，定义字段的展示方式 |
| `formId` | `string` | 是 | - | 表单的唯一标识符 |
| `onSubmit` | `(data: any) => void` | 是 | - | 表单提交回调函数 |
| `classNames` | `ClassNamesConfig` | 否 | - | 自定义表单各元素的样式类名 |
| `mode` | `'onSubmit' \| 'onBlur' \| 'onChange' \| 'all'` | 否 | `'onSubmit'` | 表单验证的触发时机 |
| `reValidateMode` | `'onChange' \| 'onBlur' \| 'onSubmit'` | 否 | `'onChange'` | 错误状态下的重新验证时机 |
| `children` | `ReactNode \| ((props: any) => ReactNode)` | 否 | - | 子组件或渲染函数 |

### JSON Schema

JSON Schema 用于定义数据结构和验证规则：

```typescript
interface JSONSchema7 {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  properties?: Record<string, JSONSchema7>
  required?: string[]
  title?: string
  description?: string
  format?: string  // 如 'email', 'uri', 'date' 等
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  enum?: any[]
  // ... 更多字段
}
```

### FormSchemaConfig

表单字段 UI 配置，定义字段的展示方式：

```typescript
interface FormSchemaConfig {
  [fieldName: string]: {
    type?: 'text' | 'number' | 'textarea' | 'checkbox' | 'select' | 'rate' // UI 类型
    placeholder?: string
    description?: string
    label?: string
    options?: Array<{ label: string; value: any }>
    // ... 更多 UI 配置
  }
}
```

## 基本用法

### 1. 基本表单

使用 JSON Schema 自动生成简单表单。

```tsx
import { SchemaForm } from '@airiot/client'

function Example() {
  const handleSubmit = (data: any) => {
    console.log('提交数据:', data)
  }

  const schema = {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        title: '用户名'
      },
      email: {
        type: 'string',
        title: '邮箱',
        format: 'email'
      }
    },
    required: ['username', 'email']
  }

  return (
    <SchemaForm
      formId="basic-form"
      schema={schema}
      onSubmit={handleSubmit}
    >
      <button type="submit">提交</button>
    </SchemaForm>
  )
}
```

### 2. 自定义字段 UI

使用 formSchema 自定义字段的展示方式。

```tsx
function Example() {
  const schema = {
    type: 'object',
    properties: {
      bio: { type: 'string', title: '个人简介' },
      age: { type: 'number', title: '年龄' },
      subscribe: { type: 'boolean', title: '订阅邮件' }
    }
  }

  const formSchema = {
    bio: {
      type: 'textarea',
      placeholder: '请输入个人简介',
      description: '最多 200 个字符'
    },
    age: {
      type: 'number',
      placeholder: '请输入年龄',
      description: '必须大于 18 岁'
    },
    subscribe: {
      type: 'checkbox',
      description: '是否订阅邮件通知'
    }
  }

  return (
    <SchemaForm
      formId="custom-form"
      schema={schema}
      formSchema={formSchema}
      onSubmit={(data) => console.log(data)}
    >
      <button type="submit">提交</button>
    </SchemaForm>
  )
}
```

### 3. 布局样式

使用预设布局或自定义样式。

```tsx
function Example() {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      phone: { type: 'string' }
    }
  }

  return (
    <SchemaForm
      formId="layout-form"
      schema={schema}
      classNames={{
        group: 'grid grid-cols-2 gap-4',
        field: 'space-y-2',
        label: 'text-sm font-medium'
      }}
      onSubmit={(data) => console.log(data)}
    >
      <button type="submit" className="col-span-2">提交</button>
    </SchemaForm>
  )
}
```

### 4. 动态表单

使用 children 作为渲染函数访问表单方法。

```tsx
function Example() {
  const schema = {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['username', 'password']
  }

  return (
    <SchemaForm
      formId="dynamic-form"
      schema={schema}
      onSubmit={(data) => console.log(data)}
    >
      {(methods) => (
        <div className="space-y-4">
          <button type="submit">提交</button>
          <button type="button" onClick={() => methods.reset()}>
            重置
          </button>
          <button type="button" onClick={() => methods.trigger()}>
            验证
          </button>
        </div>
      )}
    </SchemaForm>
  )
}
```

### 5. 选择字段

使用 enum 定义选项字段。

```tsx
function Example() {
  const schema = {
    type: 'object',
    properties: {
      role: {
        type: 'string',
        title: '角色',
        enum: ['admin', 'user', 'guest']
      },
      status: {
        type: 'string',
        title: '状态',
        enum: ['active', 'inactive', 'pending']
      }
    }
  }

  return (
    <SchemaForm
      formId="select-form"
      schema={schema}
      onSubmit={(data) => console.log(data)}
    >
      <button type="submit">提交</button>
    </SchemaForm>
  )
}
```

### 6. 嵌套对象

定义嵌套的数据结构。

```tsx
function Example() {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string', title: '姓名' },
      address: {
        type: 'object',
        title: '地址',
        properties: {
          street: { type: 'string', title: '街道' },
          city: { type: 'string', title: '城市' },
          zipCode: { type: 'string', title: '邮编' }
        }
      }
    }
  }

  return (
    <SchemaForm
      formId="nested-form"
      schema={schema}
      onSubmit={(data) => console.log(data)}
    >
      <button type="submit">提交</button>
    </SchemaForm>
  )
}
```

### 7. 数组字段

定义数组类型的字段。

```tsx
function Example() {
  const schema = {
    type: 'object',
    properties: {
      tags: {
        type: 'array',
        title: '标签',
        items: {
          type: 'string'
        }
      },
      scores: {
        type: 'array',
        title: '分数',
        items: {
          type: 'number',
          minimum: 0,
          maximum: 100
        }
      }
    }
  }

  return (
    <SchemaForm
      formId="array-form"
      schema={schema}
      onSubmit={(data) => console.log(data)}
    >
      <button type="submit">提交</button>
    </SchemaForm>
  )
}
```

## 注意事项

1. **Schema 格式**：确保使用符合 JSON Schema Draft 7 规范的格式。
2. **formSchema 可选**：如果不提供 formSchema，组件会根据 schema 自动选择合适的 UI 类型。
3. **类型映射**：schema 中的 `type` 会自动映射到对应的表单组件：
   - `string` → `<input type="text">` 或 `<textarea>`
   - `number` → `<input type="number">`
   - `boolean` → `<input type="checkbox">`
   - `enum` → `<select>`
4. **必填字段**：`required` 数组中的字段会自动添加必填验证。
5. **格式验证**：`format` 字段支持 `email`、`uri`、`date`、`time` 等常见格式。
6. **嵌套限制**：深层嵌套的对象和数组可能需要额外的 UI 配置。
7. **验证规则**：除了 schema 定义的规则，还可以通过 formSchema 添加额外的验证逻辑。
8. **国际化**：`title` 和 `description` 支持多语言配置。
