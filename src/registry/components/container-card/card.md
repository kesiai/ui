# Card 卡片容器组件

## 简介

`Card` 是一个卡片容器组件，用于将内容包装在带有标题和边框的卡片中。

- **简洁设计**：基于 shadcn/ui Card 组件，风格简洁美观
- **可选标题**：支持显示或隐藏卡片标题
- **可配置边框**：可以控制是否显示边框
- **可调内边距**：支持自定义内容区域内边距
- **自适应高度**：内容区域自动计算高度，减去标题栏高度

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `cardTitle` | `string` | 否 | `''` | 卡片标题 |
| `cardBordered` | `boolean` | 否 | `true` | 是否显示边框 |
| `cardPadding` | `number` | 否 | `24` | 内边距（像素） |
| `children` | `ReactNode` | 否 | - | 子组件 |
| `className` | `string` | 否 | - | 自定义类名 |
| `style` | `CSSProperties` | 否 | - | 自定义样式 |

## 基本用法

### 1. 基础卡片

最简单的使用方式，只设置标题：

```tsx
import { Card } from '@/registry/components/container-card/card'

function App() {
  return (
    <Card cardTitle="卡片标题">
      <p>这是卡片内容</p>
    </Card>
  )
}
```

### 2. 无边框卡片

隐藏边框的卡片：

```tsx
<Card
  cardTitle="无边框卡片"
  cardBordered={false}
>
  <p>这个卡片没有边框</p>
</Card>
```

### 3. 自定义内边距

调整内容区域的内边距：

```tsx
<Card
  cardTitle="自定义内边距"
  cardPadding={16}
>
  <p>内容区域内边距为 16px</p>
</Card>
```

### 4. 无标题卡片

不显示标题栏的卡片：

```tsx
<Card cardPadding={32}>
  <p>没有标题的卡片</p>
</Card>
```

## 完整示例

### 数据展示卡片

```tsx
import { Card } from '@/registry/components/container-card/card'

function DataCard() {
  const stats = [
    { label: '总用户', value: '10,234' },
    { label: '活跃用户', value: '8,567' },
    { label: '新增用户', value: '1,234' }
  ]

  return (
    <Card
      cardTitle="用户统计"
      cardPadding={32}
    >
      <div className="space-y-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex justify-between items-center p-4 bg-slate-50 rounded-lg"
          >
            <span className="text-slate-600">{stat.label}</span>
            <span className="text-2xl font-bold text-slate-900">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
```

### 表单卡片

```tsx
import { Card } from '@/registry/components/container-card/card'
import { Button } from '@/registry/components/button/button'

function FormCard() {
  return (
    <Card
      cardTitle="用户信息"
      cardBordered={true}
      cardPadding={24}
    >
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            用户名
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="请输入用户名"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            邮箱
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="请输入邮箱"
          />
        </div>
        <Button type="submit" className="w-full">
          提交
        </Button>
      </form>
    </Card>
  )
}
```

### 图表卡片

```tsx
import { Card } from '@/registry/components/container-card/card'

function ChartCard() {
  return (
    <Card
      cardTitle="销售趋势"
      cardPadding={16}
    >
      <div className="w-full h-80 flex items-center justify-center bg-slate-50 rounded">
        <p className="text-slate-400">图表区域</p>
      </div>
    </Card>
  )
}
```

### 多卡片布局

```tsx
import { Card } from '@/registry/components/container-card/card'

function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Card cardTitle="卡片 1" cardPadding={20}>
        <p className="text-slate-600">第一个卡片的内容</p>
      </Card>
      <Card cardTitle="卡片 2" cardPadding={20}>
        <p className="text-slate-600">第二个卡片的内容</p>
      </Card>
      <Card cardTitle="卡片 3" cardPadding={20}>
        <p className="text-slate-600">第三个卡片的内容</p>
      </Card>
      <Card cardTitle="卡片 4" cardPadding={20}>
        <p className="text-slate-600">第四个卡片的内容</p>
      </Card>
    </div>
  )
}
```

## 注意事项

1. **标题处理**：标题必须是字符串类型，非字符串值会被转换为 JSON 字符串

2. **高度计算**：内容区域高度会自动减去标题栏高度（约 73px），确保内容充满整个卡片

3. **内边距范围**：`cardPadding` 的建议范围是 0-100 像素

4. **样式覆盖**：可以通过 `className` 和 `style` props 来自定义卡片样式

5. **内容溢出**：内容区域设置了 `overflow: auto`，内容过多时会自动显示滚动条

6. **响应式**：卡片宽度默认为 100%，会自动适应父容器大小
