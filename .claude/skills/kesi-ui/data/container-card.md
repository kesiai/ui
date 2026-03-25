# Card 卡片

## 简介

`Card` 是一个通用的内容容器组件，用于组织和展示相关内容。

- **灵活布局**：支持标题和内容区域的灵活布局，适应不同场景
- **可配置样式**：支持边框显示/隐藏和自定义内边距
- **自动滚动**：内容区域超出时自动显示滚动条
- **响应式设计**：自动适应父容器大小，保持100%宽高
- **简洁易用**：API 简单直观，快速上手使用

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `cardTitle` | `string` | 否 | `''` | 卡片标题，显示在卡片顶部 |
| `cardBordered` | `boolean` | 否 | `true` | 是否显示卡片边框 |
| `cardPadding` | `number` | 否 | `24` | 内容区域与边框的距离（像素） |
| `children` | `ReactNode` | 否 | - | 卡片内容区域子元素 |

### cardPadding

控制内容区域内边距，范围为 0-100 像素。较小的值适合紧凑布局，较大的值提供更舒适的视觉空间。

**示例：**
```tsx
<Card cardPadding={16}>
  <div>紧凑内容</div>
</Card>
```

## 基本用法

### 1. 基础卡片

创建一个带标题的基础卡片容器。

```tsx
import { Card } from '@/components/kesi/container-card'

function Example() {
  return (
    <Card cardTitle="用户信息" cardPadding={24}>
      <div>
        <p>姓名：张三</p>
        <p>年龄：28</p>
      </div>
    </Card>
  )
}
```

### 2. 无边框卡片

创建无边框的卡片，适合嵌入式场景。

```tsx
function Example() {
  return (
    <Card cardTitle="数据概览" cardBordered={false} cardPadding={16}>
      <div className="grid grid-cols-2 gap-4">
        <div>访问量：1,234</div>
        <div>用户数：567</div>
      </div>
    </Card>
  )
}
```

### 3. 自定义内边距

调整内容区域的内边距以适应不同内容密度。

```tsx
function Example() {
  return (
    <Card cardTitle="图表展示" cardPadding={0}>
      <div style={{ height: '300px' }}>
        {/* 图表组件 */}
      </div>
    </Card>
  )
}
```

### 4. 无标题卡片

不显示标题的卡片，作为纯容器使用。

```tsx
function Example() {
  return (
    <Card cardBordered={true} cardPadding={32}>
      <div className="text-center">
        <h2>欢迎使用</h2>
        <p>这是一个无标题的卡片容器</p>
      </div>
    </Card>
  )
}
```

### 5. 嵌套卡片

在一个卡片内嵌套另一个卡片。

```tsx
function Example() {
  return (
    <Card cardTitle="主卡片" cardPadding={24}>
      <div className="space-y-4">
        <p>主卡片内容</p>
        <Card cardTitle="子卡片" cardBordered={false} cardPadding={16}>
          <div>嵌套的内容区域</div>
        </Card>
      </div>
    </Card>
  )
}
```

### 6. 内容溢出处理

当内容超出容器高度时，自动显示滚动条。

```tsx
function Example() {
  const items = Array.from({ length: 50 }, (_, i) => `项目 ${i + 1}`)

  return (
    <Card cardTitle="长列表" cardPadding={16} style={{ height: '400px' }}>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item} className="p-2 bg-gray-50 rounded">
            {item}
          </div>
        ))}
      </div>
    </Card>
  )
}
```

## 完整示例

### 仪表盘卡片布局

创建一个典型的仪表盘数据卡片，包含标题、统计数据和图表区域。

```tsx
import { Card } from '@/components/kesi/container-card'

function DashboardCard() {
  return (
    <Card cardTitle="销售数据" cardPadding={24}>
      <div className="space-y-6">
        {/* 统计数据 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">1,234</div>
            <div className="text-sm text-gray-500">总订单</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+12%</div>
            <div className="text-sm text-gray-500">增长率</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">¥56,789</div>
            <div className="text-sm text-gray-500">销售额</div>
          </div>
        </div>

        {/* 图表区域 */}
        <div style={{ height: '200px' }} className="bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">图表区域</p>
        </div>
      </div>
    </Card>
  )
}
```

### 表单容器

使用卡片作为表单容器，提供清晰的视觉边界。

```tsx
import { Card } from '@/components/kesi/container-card'
import { Button } from '@/components/kesi/button'

function FormCard() {
  return (
    <Card cardTitle="用户注册" cardPadding={32}>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">用户名</label>
          <input type="text" className="w-full px-3 py-2 border rounded" placeholder="请输入用户名" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">邮箱</label>
          <input type="email" className="w-full px-3 py-2 border rounded" placeholder="请输入邮箱" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">密码</label>
          <input type="password" className="w-full px-3 py-2 border rounded" placeholder="请输入密码" />
        </div>
        <Button type="submit">注册</Button>
      </form>
    </Card>
  )
}
```

### 内容详情页

创建一个详情页面卡片，展示详细信息。

```tsx
import { Card } from '@/components/kesi/container-card'

function DetailCard() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card cardTitle="基本信息" cardPadding={24}>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-gray-500">产品名称</dt>
            <dd>智能手表 Pro</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">产品型号</dt>
            <dd>SW-2024-PRO</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">上市时间</dt>
            <dd>2024-01-15</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">库存状态</dt>
            <dd className="text-green-600">有货</dd>
          </div>
        </dl>
      </Card>

      <Card cardTitle="产品描述" cardPadding={24}>
        <div className="space-y-4 text-gray-600">
          <p>这是一款功能强大的智能手表，支持心率监测、睡眠追踪、运动模式等多种功能。</p>
          <p>采用先进的传感器技术，提供精准的健康数据分析，是您健康生活的理想伴侣。</p>
        </div>
      </Card>
    </div>
  )
}
```

## 注意事项

1. **高度计算**：组件内部会自动计算内容区域高度（总高度减去标题高度 73px），请确保父容器有明确的高度定义

2. **内边距范围**：`cardPadding` 建议值在 0-100 之间，过大的值可能导致内容区域过小

3. **内容溢出**：内容区域设置了 `overflow: auto`，超出高度的内容会自动显示滚动条，适合展示长列表或大量数据

4. **无边框模式**：当 `cardBordered` 设置为 `false` 时，卡片仍会占据空间，只是不显示边框，适合需要视觉隔离但不强调边界的场景

5. **标题处理**：标题支持字符串类型，非字符串值会被尝试转换为 JSON 字符串，建议始终传入字符串类型的标题

6. **响应式布局**：卡片默认宽高都是 100%，会自动适应父容器大小，建议在使用时明确父容器的尺寸
