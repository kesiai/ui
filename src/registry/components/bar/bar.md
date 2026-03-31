> **安装命令**: `npx shadcn@latest add @kesi/bar`

# Bar 进度条

## 简介

`Bar` 是一个可自定义的进度条组件，支持水平和垂直两种方向，可以显示当前进度值。

- **双向支持**：支持水平和垂直两种方向的进度条显示
- **颜色映射**：支持根据数值自动切换填充颜色
- **灵活定位**：支持从起始位置或末端位置开始填充
- **可定制样式**：支持自定义填充颜色和边框颜色
- **平滑过渡**：内置 300ms 的平滑过渡动画效果

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `number` | 否 | `50` | 当前进度值，范围 0-maxValue |
| `maxValue` | `number` | 否 | `100` | 最大值，用于计算进度百分比 |
| `color` | `string` | 否 | `'#3b82f6'` | 进度条填充颜色（CSS 颜色值） |
| `borderColor` | `string` | 否 | `''` | 边框颜色（CSS 颜色值） |
| `direction` | `'horizontal' \| 'vertical'` | 否 | `'horizontal'` | 进度条方向 |
| `position` | `'start' \| 'end'` | 否 | `'start'` | 填充起始位置 |
| `visualMap` | `boolean` | 否 | `false` | 是否启用颜色映射功能 |

### visualMap 颜色映射

当启用颜色映射时，进度条会根据当前值自动选择对应的颜色。需要通过 `visualMap` 属性传入映射数组，数组中每一项包含：

- **data**: 数值阈值
- **color**: 对应的颜色

组件会自动匹配小于等于当前值的最大阈值对应的颜色。

**示例映射：**
```tsx
const visualMap = [
  { data: 30, color: '#22c55e' },  // 值 >= 30 时显示绿色
  { data: 60, color: '#eab308' },  // 值 >= 60 时显示黄色
  { data: 90, color: '#ef4444' }   // 值 >= 90 时显示红色
]
```

## 基本用法

### 1. 水平进度条

最简单的水平进度条，显示默认进度：

```tsx
import { Bar } from '@/components/kesi/bar/bar'

function Example() {
  return (
    <Bar
      value={50}
      maxValue={100}
    />
  )
}
```

### 2. 垂直进度条

显示垂直方向的进度条：

```tsx
function Example() {
  return (
    <Bar
      value={75}
      maxValue={100}
      direction="vertical"
    />
  )
}
```

### 3. 自定义颜色

设置进度条的填充颜色和边框颜色：

```tsx
function Example() {
  return (
    <Bar
      value={60}
      maxValue={100}
      color="#10b981"
      borderColor="#059669"
    />
  )
}
```

### 4. 从末端填充

设置进度条从末端位置开始填充：

```tsx
function Example() {
  return (
    <Bar
      value={30}
      maxValue={100}
      position="end"
    />
  )
}
```

### 5. 带颜色映射

启用颜色映射功能，根据数值自动切换颜色：

```tsx
function Example() {
  const visualMap = [
    { data: 30, color: '#22c55e' },
    { data: 60, color: '#eab308' },
    { data: 90, color: '#ef4444' }
  ]

  return (
    <Bar
      value={75}
      maxValue={100}
      visualMap={visualMap}
    />
  )
}
```

### 6. 实时更新

通过状态更新进度值：

```tsx
import { useState, useEffect } from 'react'

function Example() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100))
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <Bar
      value={progress}
      maxValue={100}
      color="#3b82f6"
    />
  )
}
```

## 完整示例

### 文件上传进度

模拟文件上传场景，显示上传进度：

```tsx
import { useState } from 'react'
import { Bar } from '@/components/kesi/bar/bar'

function FileUploadProgress() {
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleUpload = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  return (
    <div className="space-y-4">
      <Bar
        value={uploadProgress}
        maxValue={100}
        color="#3b82f6"
      />
      <button onClick={handleUpload}>
        开始上传
      </button>
      <p>上传进度: {uploadProgress}%</p>
    </div>
  )
}
```

### 数据仪表盘

显示多个指标的进度条，使用颜色区分状态：

```tsx
import { Bar } from '@/components/kesi/bar/bar'

function Dashboard() {
  const metrics = [
    { name: 'CPU 使用率', value: 65, maxValue: 100 },
    { name: '内存使用率', value: 82, maxValue: 100 },
    { name: '磁盘使用率', value: 45, maxValue: 100 }
  ]

  const visualMap = [
    { data: 60, color: '#22c55e' },
    { data: 80, color: '#eab308' },
    { data: 90, color: '#ef4444' }
  ]

  return (
    <div className="space-y-6">
      {metrics.map((metric) => (
        <div key={metric.name} className="space-y-2">
          <div className="flex justify-between">
            <span>{metric.name}</span>
            <span>{metric.value}%</span>
          </div>
          <Bar
            value={metric.value}
            maxValue={metric.maxValue}
            visualMap={visualMap}
          />
        </div>
      ))}
    </div>
  )
}
```

### 垂直进度条组

多个垂直进度条，用于显示对比数据：

```tsx
import { Bar } from '@/components/kesi/bar/bar'

function VerticalBars() {
  const data = [
    { label: '一月', value: 45 },
    { label: '二月', value: 72 },
    { label: '三月', value: 58 },
    { label: '四月', value: 91 }
  ]

  const visualMap = [
    { data: 50, color: '#3b82f6' },
    { data: 75, color: '#8b5cf6' },
    { data: 90, color: '#ec4899' }
  ]

  return (
    <div className="flex items-end gap-4 h-64">
      {data.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-2">
          <Bar
            value={item.value}
            maxValue={100}
            direction="vertical"
            visualMap={visualMap}
            className="w-8"
          />
          <span className="text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
```

## 注意事项

1. **value 和 maxValue 的关系**：确保 `value` 不超过 `maxValue`，组件会自动将百分比限制在 0-100 范围内

2. **颜色映射排序**：`visualMap` 数组会自动按 `data` 值升序排序，无需手动排序

3. **颜色映射优先级**：当启用颜色映射时，组件会使用映射颜色而非 `color` 属性指定的颜色

4. **过渡动画**：进度变化时会有 300ms 的平滑过渡，可通过 CSS 自定义覆盖

5. **尺寸设置**：组件默认填满父容器，建议通过父容器的宽高来控制进度条尺寸

6. **样式覆盖**：支持通过 `className` 和 `style` props 自定义样式，样式会与默认样式合并
