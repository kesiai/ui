# MobilePicker 移动端选择器

## 简介

`MobilePicker` 是一个功能强大的移动端选择器组件，支持单选、多选和级联选择等多种模式。

- **多种模式**：支持普通选择、表格选择和表记录级联选择
- **单选多选**：可切换单选和多选模式
- **级联导航**：支持多层级联选择，可自定义导航逻辑
- **加载状态**：支持显示数据加载状态
- **移动优化**：专为移动端设计的底部弹出交互

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `options` | `PickerOption[]` | 否 | `[]` | 选项列表（normal 或 table 模式） |
| `treeData` | `PickerOption[]` | 否 | `[]` | 树形数据（tableData 级联模式） |
| `input` | `{ value?: any; onChange?: (value: any) => void }` | 否 | - | 输入对象，用于控制选中值 |
| `selectModel` | `'normal' \| 'table' \| 'tableData'` | 否 | `'normal'` | 选择模式 |
| `multiple` | `boolean` | 否 | `false` | 是否多选 |
| `placeholder` | `string` | 否 | `'请选择'` | 占位符 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `loading` | `boolean` | 否 | `false` | 加载状态 |
| `dashboardMode` | `boolean` | 否 | `false` | 仪表盘模式（禁用点击） |
| `onCascadeSelect` | `(item: PickerOption) => void` | 否 | - | 级联选择回调 |
| `onCascadeBack` | `() => void` | 否 | - | 返回上一级回调 |
| `cascadeLevel` | `number` | 否 | `0` | 当前级联层级 |
| `cascadePath` | `string[]` | 否 | `[]` | 当前级联路径 |

### PickerOption 类型

```typescript
interface PickerOption {
  id?: string
  pId?: string | null
  label?: string
  title?: string
  value: string | number
  children?: PickerOption[]
  child?: PickerOption[]
  isLeaf?: boolean
}
```

## 基本用法

### 1. 普通单选

最简单的单选示例。

```tsx
import { MobilePicker } from '@/registry/components/airiot/mobile-picker'
import { useState } from 'react'

function Example() {
  const [value, setValue] = useState('')

  const options = [
    { label: '选项 1', value: '1' },
    { label: '选项 2', value: '2' },
    { label: '选项 3', value: '3' }
  ]

  return (
    <MobilePicker
      input={{ value, onChange: setValue }}
      options={options}
      placeholder="请选择"
    />
  )
}
```

### 2. 普通多选

启用多选模式。

```tsx
function Example() {
  const [value, setValue] = useState([])

  const options = [
    { label: '苹果', value: 'apple' },
    { label: '香蕉', value: 'banana' },
    { label: '橙子', value: 'orange' }
  ]

  return (
    <MobilePicker
      input={{ value, onChange: setValue }}
      options={options}
      multiple
      placeholder="请选择水果"
    />
  )
}
```

### 3. 级联选择

使用 treeData 实现级联选择。

```tsx
function Example() {
  const [value, setValue] = useState('')

  const treeData = [
    {
      label: '北京市',
      value: 'beijing',
      children: [
        { label: '朝阳区', value: 'chaoyang' },
        { label: '海淀区', value: 'haidian' }
      ]
    },
    {
      label: '上海市',
      value: 'shanghai',
      children: [
        { label: '浦东新区', value: 'pudong' },
        { label: '黄浦区', value: 'huangpu' }
      ]
    }
  ]

  return (
    <MobilePicker
      input={{ value, onChange: setValue }}
      treeData={treeData}
      selectModel="tableData"
      placeholder="请选择地区"
    />
  )
}
```

### 4. 自定义级联控制

通过回调自定义级联逻辑。

```tsx
function Example() {
  const [value, setValue] = useState('')
  const [currentData, setCurrentData] = useState([])
  const [level, setLevel] = useState(0)
  const [path, setPath] = useState([])

  const handleCascadeSelect = (item) => {
    // 模拟异步加载下一级数据
    const nextData = item.children || []
    setCurrentData(nextData)
    setLevel(level + 1)
    setPath([...path, item.value])
  }

  const handleCascadeBack = () => {
    // 返回上一级
    if (level > 0) {
      setLevel(level - 1)
      setPath(path.slice(0, -1))
    }
  }

  return (
    <MobilePicker
      input={{ value, onChange: setValue }}
      treeData={currentData}
      selectModel="tableData"
      onCascadeSelect={handleCascadeSelect}
      onCascadeBack={handleCascadeBack}
      cascadeLevel={level}
      cascadePath={path}
    />
  )
}
```

### 5. 加载状态

显示数据加载状态。

```tsx
function Example() {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <MobilePicker
      input={{ value, onChange: setValue }}
      options={[]}
      loading={loading}
      placeholder="加载中..."
    />
  )
}
```

### 6. 禁用状态

禁用选择器。

```tsx
function Example() {
  return (
    <MobilePicker
      input={{ value: '1', onChange: () => {} }}
      options={[
        { label: '选项 1', value: '1' },
        { label: '选项 2', value: '2' }
      ]}
      disabled
      placeholder="已禁用"
    />
  )
}
```

## 完整示例

### 城市级联选择

创建一个完整的城市级联选择器。

```tsx
import { MobilePicker } from '@/registry/components/airiot/mobile-picker'
import { useState } from 'react'

function CityPicker() {
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const [currentData, setCurrentData] = useState(provinces)
  const [level, setLevel] = useState(0)

  const provinces = [
    {
      label: '北京市',
      value: 'beijing',
      children: [
        { label: '朝阳区', value: 'chaoyang' },
        { label: '海淀区', value: 'haidian' },
        { label: '东城区', value: 'dongcheng' }
      ]
    },
    {
      label: '广东省',
      value: 'guangdong',
      children: [
        { label: '广州市', value: 'guangzhou' },
        { label: '深圳市', value: 'shenzhen' },
        { label: '珠海市', value: 'zhuhai' }
      ]
    }
  ]

  const handleSelect = (item) => {
    if (level === 0) {
      setProvince(item.label)
      setCurrentData(item.children)
      setLevel(1)
    } else {
      setCity(item.label)
    }
  }

  const handleBack = () => {
    if (level === 1) {
      setCity('')
      setCurrentData(provinces)
      setLevel(0)
    }
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        选择城市
      </h3>
      <MobilePicker
        input={{
          value: city || province,
          onChange: () => {}
        }}
        treeData={currentData}
        selectModel="tableData"
        onCascadeSelect={handleSelect}
        onCascadeBack={handleBack}
        cascadeLevel={level}
        placeholder={level === 0 ? '请选择省份' : '请选择城市'}
      />
    </div>
  )
}
```

## 注意事项

1. **选项数据**：`options` 和 `treeData` 必须包含 `value` 字段，`label` 或 `title` 用于显示。

2. **级联模式**：`selectModel="tableData"` 时必须使用 `treeData` 提供层级数据。

3. **多选返回**：多选模式下，`onChange` 返回的是字符串数组。

4. **自定义级联**：使用 `onCascadeSelect` 和 `onCascadeBack` 实现自定义级联逻辑。

5. **仪表盘模式**：`dashboardMode={true}` 时禁用点击，通常用于在仪表盘单元格中预览。

6. **容器 DOM**：可通过 `containerDOM` 指定弹出层的容器，用于处理层级问题。

7. **叶子节点**：`isLeaf={true}` 标记的节点不会显示进入下一级的箭头。

8. **children vs child**：组件同时支持 `children` 和 `child` 属性存储子节点数据。
