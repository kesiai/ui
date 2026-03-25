# TableDataSelect 表记录选择器

## 简介

`TableDataSelect` (table-data-select) 是一个表记录选择器组件，用于从指定表中选择数据记录。

- **多表支持**：可同时从多个表中选择记录
- **显示配置**：灵活控制哪些记录显示
- **自动加载**：自动获取表的记录数据
- **受控模式**：支持受控和非受控使用方式

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `tables` | `Array<{ id?: string; title?: string; name?: string }>` | 否 | `[]` | 表列表 |
| `placeholder` | `string` | 否 | `'请选择表记录'` | 占位符文本 |
| `displayConfig` | `object` | 否 | `{}` | 显示配置，控制哪些记录显示 |
| `displayConfig.noShow` | `Array<{ tableId?: string; id?: string }>` | 否 | - | 需要隐藏的记录列表 |
| `input` | `object` | 否 | - | 受控输入值和回调 |
| `input.value` | `any` | 否 | - | 当前值 |
| `input.onChange` | `(value) => void` | 否 | - | 值变化回调 |

## 基本用法

### 1. 基本使用

选择单个表的记录。

```tsx
import { TableSelect } from '@/registry/components/kesi/table-data-select'

function Example() {
  return (
    <TableSelect
      tables={[{ id: 'device', title: '设备表' }]}
    />
  )
}
```

### 2. 多表选择

从多个表中选择记录。

```tsx
function Example() {
  return (
    <TableSelect
      tables={[
        { id: 'device', title: '设备表' },
        { id: 'sensor', title: '传感器表' }
      ]}
    />
  )
}
```

### 3. 排除特定记录

使用显示配置隐藏特定记录。

```tsx
function Example() {
  return (
    <TableSelect
      tables={[{ id: 'device', title: '设备表' }]}
      displayConfig={{
        noShow: [
          { tableId: 'device', id: 'device-001' }
        ]
      }}
    />
  )
}
```

### 4. 受控模式

```tsx
function Example() {
  const [selectedRecord, setSelectedRecord] = useState(null)

  return (
    <TableSelect
      tables={[{ id: 'device', title: '设备表' }]}
      input={{
        value: selectedRecord,
        onChange: setSelectedRecord
      }}
    />
  )
}
```

## 注意事项

1. **表权限**：确保用户有权限访问指定的表。
2. **记录格式**：返回值包含 `{ id, name, _label, __type__, table }` 结构。
3. **显示字段**：使用 `_label` 字段作为显示文本，如果不存在则使用 `id`。
4. **加载性能**：从多个表加载记录时可能较慢，建议使用 `displayConfig.noShow` 过滤不需要的记录。
