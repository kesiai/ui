# Statuses 状态指示器组

## 简介

`Statuses` 是一个批量状态指示器组件，用于展示多个设备的多个数据点状态。

- **批量展示**：同时展示多个设备的多个数据点状态
- **灵活布局**：支持水平和垂直等多种布局方式
- **数据绑定**：结合 ViewModel 组件自动获取设备数据
- **状态复用**：支持全局状态配置，覆盖单个数据点状态
- **交互支持**：支持点击事件回调

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `nodes` | `DeviceConfig[]` | 否 | `[]` | 设备列表 |
| `tags` | `DataPointConfig[]` | 否 | `[]` | 数据点配置数组 |
| `dataPointStatus` | `DataPointStatusCondition[]` | 否 | `[]` | 全局数据点状态配置 |
| `blinkOnStateChange` | `boolean` | 否 | `false` | 状态切换时是否闪烁 |
| `flex` | `FlexConfig` | 否 | - | 布局配置 |
| `width` | `number` | 否 | `100` | 每个状态组件的宽度 |
| `height` | `number` | 否 | `100` | 每个状态组件的高度 |
| `deviceValues` | `Record<string, Record<string, any>>` | 否 | `{}` | 设备数据值 |
| `onClick` | `(node, dataPoints) => void` | 否 | - | 点击事件回调 |

## 基本用法

### 1. 基本使用

展示多个设备的多个数据点状态。

```tsx
import { Statuses } from '@/registry/components/statuses'

function Example() {
  const nodes = [
    { id: 'device1', name: '设备1' },
    { id: 'device2', name: '设备2' }
  ]

  const tags = [
    { tags: { id: 'temp', name: '温度' }, status: [
      { activeType: 'activeKey', activeKey: 'normal', text: '正常', bgColor: '#22c55e', color: '#fff' }
    ]}
  ]

  const deviceValues = {
    device1: { temp: { value: 'normal' } },
    device2: { temp: { value: 'normal' } }
  }

  return (
    <Statuses
      nodes={nodes}
      tags={tags}
      deviceValues={deviceValues}
      width={100}
      height={60}
    />
  )
}
```

### 2. 结合 ViewModel

自动从设备表获取数据。

```tsx
import { ViewModel } from '@/registry/components/view-model'
import { Statuses } from '@/registry/components/statuses'

function Example() {
  return (
    <ViewModel tableId="device">
      <Statuses
        tags={[{ tags: { id: 'status', name: '状态' } }]}
        width={80}
        height={50}
      />
    </ViewModel>
  )
}
```

### 3. 自定义布局

使用 Flexbox 自定义布局。

```tsx
function Example() {
  const flex = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  }

  return (
    <Statuses
      nodes={nodes}
      tags={tags}
      deviceValues={deviceValues}
      flex={flex}
      width={120}
      height={80}
    />
  )
}
```

## 注意事项

1. **组件数量**：总状态数 = 设备数 × 数据点数
2. **数据格式**：`deviceValues` 结构为 `{ [deviceId]: { [tagId]: { value, time } } }`
3. **状态合并**：`dataPointStatus` 会与每个 `tag.status` 合并，前者优先级更高
4. **数据更新**：`deviceValues` 需要从外部实时更新，通常通过 WebSocket 或 API
5. **点击事件**：点击设备时，`onClick` 回调会返回设备信息和关联的数据点数组
