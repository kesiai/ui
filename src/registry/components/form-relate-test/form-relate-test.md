> **安装命令**: `npx shadcn@latest add @kesi/form-relate-test`

# FormRelateTest 关联字段（测试版本）

## 简介

`FormRelateTest` 是关联字段的测试版本，不依赖表单上下文（`useFormContext`）或表格上下文（`Table2Context`）。所有需要的数据都通过 props 传入，使其可以在任何场景下独立使用。

- **测试设计**：不依赖外部上下文，可独立使用
- **外部过滤器**：`filterObj` 由父组件传入，提供更好的灵活性
- **Props 平铺**：所有参数平铺传递，不使用 `input`/`field` 包装结构
- **单选/多选**：支持单选和多选两种选择模式
- **异步加载**：支持异步加载关联数据
- **智能格式化**：自动格式化显示值和存储值

## 与 FormRelateOld 的区别

| 特性 | FormRelate（测试） | FormRelateOld（旧版） |
|------|---------------------|---------------------|
| 上下文依赖 | 无 | 需要 useFormContext 和 Table2Context |
| filterObj | 外部传入 | 内部构建 |
| 使用场景 | 任何场景（包括表单外） | 仅在表单内 |
| Props 结构 | 平铺 | 平铺 |

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any` | 否 | - | 当前值（可以是对象或数组） |
| `onChange` | `(value: any) => void` | 否 | - | 值变化回调 |
| `schema` | `object` | 否 | - | 字段 schema 配置 |
| `field` | `object` | 否 | - | 字段配置对象（包含 filter, meta, relateShowFields 等） |
| `displayField` | `string` | 否 | `'name'` | 显示字段名称 |
| `internalTable` | `boolean` | 否 | `true` | 是否为内部表关联 |
| `filterObj` | `Record<string, any>` | 否 | `{}` | **过滤器对象**（由父组件构建并传入） |
| `meta` | `any` | 否 | - | 元数据对象 |
| `record` | `any` | 否 | - | 记录数据对象 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |

## 基本用法

### 1. 基础用法（测试）

最简单的用法，在表单外独立使用。

```tsx
import { FormRelateTest } from '@/registry/components/form-relate-test/form-relate-test'
import { useState } from 'react'

function Example() {
  const [value, setValue] = useState(null)

  return (
    <FormRelateTest
      value={value}
      onChange={setValue}
      schema={{
        title: '关联字段',
        relate: { id: 'product-table' }
      }}
      displayField="name"
      filterObj={{}}
    />
  )
}
```

### 2. 带过滤条件的用法

父组件构建 `filterObj` 并传入。

```tsx
import { FormRelateTest } from '@/registry/components/form-relate-test/form-relate-test'
import { useState, useMemo } from 'react'

function Example() {
  const [value, setValue] = useState(null)
  const [category, setCategory] = useState('electronics')

  // 构建过滤器对象
  const filterObj = useMemo(() => ({
    search: {
      category: category
    }
  }), [category])

  return (
    <div>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="electronics">电子产品</option>
        <option value="clothing">服装</option>
      </select>

      <FormRelateTest
        value={value}
        onChange={setValue}
        schema={{
          title: '选择产品',
          relate: { id: 'product-table' }
        }}
        filterObj={filterObj}
      />
    </div>
  )
}
```

### 3. 多选模式

```tsx
function Example() {
  const [value, setValue] = useState([])

  return (
    <FormRelateTest
      value={value}
      onChange={setValue}
      schema={{
        title: '选择标签',
        selectType: 'multiple',
        relate: { id: 'tag-table' }
      }}
      internalTable={false}
      filterObj={{}}
    />
  )
}
```

### 4. 禁用状态

```tsx
function Example() {
  const [value] = useState({ id: 1, name: '已选项' })

  return (
    <FormRelateTest
      value={value}
      onChange={() => {}}
      schema={{ title: '只读关联' }}
      disabled
      filterObj={{}}
    />
  )
}
```

## filterObj 构建指南

`filterObj` 的结构取决于后端 API 的要求。常见格式：

```typescript
// 无过滤条件
const filterObj = {}

// 简单搜索
const filterObj = {
  search: {
    status: 'active'
  }
}

// 复杂过滤
const filterObj = {
  search: {
    status: 'active',
    category: 'electronics'
  },
  $and: [
    { price: { $gte: 100 } },
    { price: { $lte: 1000 } }
  ]
}
```

## 完整示例

### 产品选择器（带动态过滤）

```tsx
import { FormRelateTest } from '@/registry/components/form-relate-test/form-relate-test'
import { useState, useMemo } from 'react'

function ProductSelector() {
  const [value, setValue] = useState(null)
  const [status, setStatus] = useState('active')
  const [minPrice, setMinPrice] = useState(0)

  // 动态构建过滤器
  const filterObj = useMemo(() => {
    const result: Record<string, any> = {}

    if (status) {
      result.search = { status }
    }

    if (minPrice > 0) {
      result.search = {
        ...result.search,
        price: { $gte: minPrice }
      }
    }

    return result
  }, [status, minPrice])

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="active">上架</option>
          <option value="inactive">下架</option>
        </select>

        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          placeholder="最低价格"
          className="border rounded px-3 py-2"
        />
      </div>

      <FormRelateTest
        value={value}
        onChange={setValue}
        schema={{
          title: '选择产品',
          relate: { id: 'product-table' }
        }}
        filterObj={filterObj}
      />

      {value && (
        <div className="p-3 bg-blue-50 rounded">
          已选择: {value.name || value.id}
        </div>
      )}
    </div>
  )
}
```

## 注意事项

1. **测试特性**：不使用任何 React Context，可以在任何地方使用。

2. **filterObj 必传**：虽然设置了默认值 `{}`，但实际使用时应根据需求构建合适的过滤器。

3. **值格式**：单选时值为对象，多选时值为数组。

4. **onChange 格式**：
   - `internalTable: true` → 直接返回值
   - `internalTable: false` → 返回 `{ in: value }` 格式

5. **与容器组件配合**：
   - 在表单内使用时，建议配合 `FormRelate` 或 `FormRelateOld` 容器组件
   - 在表单外使用时，直接使用此测试并传入 `filterObj`

6. **性能优化**：使用 `useMemo` 缓存 `filterObj`，避免不必要的重新渲染。
