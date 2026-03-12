# Form.Relate 关联字段

## 简介

`FormRelate` 是一个关联字段组件，用于建立表与表之间的关联关系，支持单选和多选模式。

- **内部表关联**：专为内部表关联设计，支持同一表内的字段关联
- **单选/多选**：支持单选和多选两种选择模式
- **灵活配置**：可配置显示字段、过滤条件等
- **异步加载**：支持异步加载关联数据
- **智能格式化**：自动格式化显示值和存储值

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `input` | `object` | 否 | - | 输入对象 |
| `input.value` | `any` | 否 | - | 当前值（可以是对象或数组） |
| `input.onChange` | `(value: any) => void` | 否 | - | 值变化回调 |
| `field` | `object` | 否 | - | 字段配置对象 |
| `field.schema` | `object` | 否 | - | 字段 schema 配置 |
| `field.filter` | `any` | 否 | - | 过滤条件 |
| `field.displayField` | `string` | 否 | `'name'` | 显示字段名称 |
| `field.tableID` | `string` | 否 | - | 关联表ID |
| `field.relateShowFields` | `any` | 否 | - | 关联显示字段配置 |
| `field.option` | `object` | 否 | - | 选项配置 |
| `field.key` | `string` | 否 | - | 字段key |
| `field.internalTable` | `boolean` | 否 | `true` | 是否为内部表关联 |
| `meta` | `any` | 否 | - | 元数据对象 |
| `record` | `any` | 否 | - | 记录数据对象 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |

## 基本用法

### 1. 基础内部表关联

最简单的用法，创建一个内部表关联字段。

```tsx
import { FormRelate } from '@/registry/components/airiot/form-relate'
import { useState } from 'react'

function Example() {
  const [value, setValue] = useState(null)

  return (
    <FormRelate
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: {
          title: '关联字段'
        },
        internalTable: true,
        displayField: 'name'
      }}
    />
  )
}
```

### 2. 单选模式

默认的单选模式。

```tsx
function Example() {
  const [value, setValue] = useState(null)

  return (
    <FormRelate
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: {
          title: '选择产品',
          relate: {
            id: 'product-table'
          }
        },
        internalTable: true,
        displayField: 'name'
      }}
    />
  )
}
```

### 3. 多选模式

配置为多选模式。

```tsx
function Example() {
  const [value, setValue] = useState([])

  return (
    <FormRelate
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: {
          title: '选择标签',
          selectType: 'multiple'
        },
        internalTable: false,  // 多选使用外部表模式
        displayField: 'name'
      }}
    />
  )
}
```

### 4. 自定义显示字段

指定用于显示的字段。

```tsx
function Example() {
  const [value, setValue] = useState(null)

  return (
    <FormRelate
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: {
          title: '选择用户'
        },
        displayField: 'username'  // 使用 username 字段显示
      }}
    />
  )
}
```

### 5. 禁用状态

设置关联字段为禁用。

```tsx
function Example() {
  const [value] = useState({ id: 1, name: '已选项' })

  return (
    <FormRelate
      input={{
        value,
        onChange: () => {}
      }}
      field={{
        schema: {
          title: '只读关联'
        }
      }}
      disabled
    />
  )
}
```

### 6. 带过滤条件

添加过滤条件限制可选项。

```tsx
function Example() {
  const [value, setValue] = useState(null)

  return (
    <FormRelate
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: {
          title: '活跃用户'
        },
        filter: {
          status: 'active'  // 只显示状态为 active 的记录
        },
        displayField: 'name'
      }}
    />
  )
}
```

### 7. 设置默认值

设置关联字段的默认值。

```tsx
function Example() {
  const [value, setValue] = useState({
    id: 'default-1',
    name: '默认选项'
  })

  return (
    <FormRelate
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: {
          title: '默认值示例'
        },
        displayField: 'name'
      }}
    />
  )
}
```

## 完整示例

### 产品分类选择器

创建一个产品分类选择器，支持单选和多选。

```tsx
import { FormRelate } from '@/registry/components/airiot/form-relate'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

function ProductCategorySelector() {
  const [singleSelect, setSingleSelect] = useState(null)
  const [multiSelect, setMultiSelect] = useState([])
  const [selectionMode, setSelectionMode] = useState('single')

  const handleSubmit = () => {
    const data = selectionMode === 'single'
      ? { singleSelect }
      : { multiSelect }

    console.log('提交数据:', data)
    alert('选择已保存！')
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">产品分类选择</h2>

      <div className="mb-4 flex gap-2">
        <Button
          variant={selectionMode === 'single' ? 'default' : 'outline'}
          onClick={() => setSelectionMode('single')}
        >
          单选模式
        </Button>
        <Button
          variant={selectionMode === 'multiple' ? 'default' : 'outline'}
          onClick={() => setSelectionMode('multiple')}
        >
          多选模式
        </Button>
      </div>

      {selectionMode === 'single' ? (
        <div className="space-y-4">
          <FormRelate
            input={{
              value: singleSelect,
              onChange: setSingleSelect
            }}
            field={{
              schema: {
                title: '选择主分类',
                relate: {
                  id: 'category-table'
                }
              },
              internalTable: true,
              displayField: 'name'
            }}
          />
          {singleSelect && (
            <div className="p-3 bg-blue-50 rounded">
              <p className="text-sm">
                已选择: <strong>{singleSelect.name || singleSelect.id}</strong>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <FormRelate
            input={{
              value: multiSelect,
              onChange: setMultiSelect
            }}
            field={{
              schema: {
                title: '选择多个分类',
                selectType: 'multiple',
                relate: {
                  id: 'category-table'
                }
              },
              internalTable: false,
              displayField: 'name'
            }}
          />
          {multiSelect.length > 0 && (
            <div className="p-3 bg-blue-50 rounded">
              <p className="text-sm mb-2">已选择 {multiSelect.length} 项:</p>
              <ul className="text-sm space-y-1">
                {multiSelect.map((item: any, index: number) => (
                  <li key={index}>
                    {item.name || item.id}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <Button onClick={handleSubmit} className="mt-6">
        保存选择
      </Button>
    </Card>
  )
}
```

## 注意事项

1. **内部表关联**：`internalTable: true` 表示关联同一表内的数据，`false` 表示关联外部表。

2. **值格式**：单选时值为对象，多选时值为数组。组件会自动处理格式转换。

3. **显示字段**：`displayField` 指定用于显示的字段名，默认为 'name'。

4. **异步加载**：组件使用 AsyncSelect 进行异步数据加载，确保配置正确的数据源。

5. **onChange 格式**：根据 `internalTable` 的值，onChange 返回的格式不同：
   - `internalTable: true` → 直接返回值
   - `internalTable: false` → 返回 `{ in: value }` 格式

6. **禁用状态**：禁用时字段变为只读，显示当前值但不允许修改。

7. **空值处理**：值为空或 undefined 时，选择器显示为空。

8. **关联配置**：确保 `field.schema.relate.id` 配置正确，指向有效的关联表。

9. **多选模式**：多选仅在 `internalTable: false` 时支持。

10. **数据同步**：组件是受控组件，必须通过 input.value 和 input.onChange 管理状态。
