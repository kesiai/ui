# TableSelect 表选择器

## 简介

`TableSelect` 是一个表选择器组件，用于从系统中选择数据表。

- **自动加载**：自动从系统获取表列表
- **过滤功能**：支持多种过滤条件，排除设备表等
- **树形展示**：可选的树形结构展示
- **单选/多选**：支持单选和多选模式
- **受控模式**：支持受控和非受控使用方式

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `placeholder` | `string` | 否 | `'请选择表'` | 占位符文本 |
| `multiple` | `boolean` | 否 | `false` | 是否多选 |
| `filter` | `object` | 否 | - | 过滤条件 |
| `tree` | `boolean` | 否 | `false` | 是否树形展示 |
| `excludeDevice` | `boolean` | 否 | `false` | 是否排除设备表 |
| `width` | `string \| number` | 否 | `'100%'` | 宽度 |
| `input` | `object` | 否 | - | 受控输入值和回调 |
| `input.value` | `any` | 否 | - | 当前值 |
| `input.onChange` | `(value) => void` | 否 | - | 值变化回调 |

## 基本用法

### 1. 基本使用

简单的表选择器。

```tsx
import { TableSelect } from '@/registry/components/table-select'

function Example() {
  return <TableSelect />
}
```

### 2. 受控模式

使用受控模式管理选择状态。

```tsx
function Example() {
  const [selectedTable, setSelectedTable] = useState(null)

  return (
    <TableSelect
      input={{
        value: selectedTable,
        onChange: setSelectedTable
      }}
    />
  )
}
```

### 3. 排除设备表

不显示设备表。

```tsx
function Example() {
  return <TableSelect excludeDevice />
}
```

### 4. 多选模式

支持选择多个表。

```tsx
function Example() {
  return <TableSelect multiple />
}
```

## 注意事项

1. **多选功能**：当前多选功能为简化实现，完全功能需要额外开发。
2. **树形展示**：`tree=true` 时，表按层级关系展示。
3. **过滤条件**：`filter` 对象会被转换为 API 查询条件。
4. **返回值格式**：返回 `{ id, title, name, isDevice }` 结构的表信息。
