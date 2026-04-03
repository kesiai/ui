> **安装命令**: `npx shadcn@latest add @kesi/container-card`

# Card 卡片

## 简介

`Card` 是基于 shadcn Card 封装的通用内容容器组件，用于组织和展示相关内容。

- **简洁易用**：通过 `cardTitle` 快速添加标题，支持标题为空时自动隐藏头部
- **shadcn 生态**：基于 shadcn Card 组件封装，继承其样式和主题能力
- **完全兼容**：透传所有原生 `div` 属性，支持 `ref` 转发
- **灵活布局**：内部使用 `CardHeader` + `CardContent` 结构，布局清晰

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `cardTitle` | `string` | 否 | `''` | 卡片标题，为空时自动隐藏标题区域 |
| `children` | `ReactNode` | 否 | - | 卡片内容区域子元素 |
| `className` | `string` | 否 | - | 自定义类名，默认包含 `dashboard-container-card w-full max-w-sm` |

同时支持所有原生 `HTMLDivElement` 属性（如 `style`、`onClick` 等）。

## 关联的 shadcn Card 子组件

`Card` 基于 shadcn 的 `Card` 组件封装，以下 shadcn Card 子组件可配合使用：

| 子组件 | 说明 |
|--------|------|
| `CardHeader` | 卡片头部容器，通常包含 `CardTitle` 和 `CardDescription` |
| `CardTitle` | 卡片标题，`cardTitle` prop 内部即使用该组件渲染 |
| `CardDescription` | 卡片描述文本，通常放在 `CardHeader` 中标题下方 |
| `CardContent` | 卡片内容区域，`children` 默认渲染在该组件内 |
| `CardFooter` | 卡片底部区域，适合放置操作按钮等 |
| `CardAction` | 卡片头部操作区，通常放置在 `CardHeader` 内右侧 |

> 当使用 `cardTitle` prop 时，组件内部已自动渲染 `CardHeader` + `CardTitle`。如需更灵活的头部结构（如同时使用 `CardDescription` 或 `CardAction`），建议不传 `cardTitle`，改为在 `children` 中自行组合这些子组件。

```tsx
import { Card } from '@/registry/components/container-card/container-card'
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// 不使用 cardTitle，完全自定义头部结构
function AdvancedExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>高级卡片</CardTitle>
        <CardDescription>这是卡片的描述信息</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">设置</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>卡片正文内容</p>
      </CardContent>
      <CardFooter>
        <Button>确认</Button>
        <Button variant="ghost">取消</Button>
      </CardFooter>
    </Card>
  )
}
```

## 基本用法

### 1. 基础卡片

创建一个带标题的基础卡片容器。

```tsx
import { Card } from '@/registry/components/container-card/container-card'

function Example() {
  return (
    <Card cardTitle="用户信息">
      <div>
        <p>姓名：张三</p>
        <p>年龄：28</p>
      </div>
    </Card>
  )
}
```

### 2. 无标题卡片

不传入 `cardTitle` 时，标题区域自动隐藏，作为纯容器使用。

```tsx
function Example() {
  return (
    <Card>
      <div className="text-center">
        <h2>欢迎使用</h2>
        <p>这是一个无标题的卡片容器</p>
      </div>
    </Card>
  )
}
```

### 3. 自定义样式

通过 `className` 或 `style` 调整卡片外观。

```tsx
function Example() {
  return (
    <Card cardTitle="自定义宽度" className="max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>访问量：1,234</div>
        <div>用户数：567</div>
      </div>
    </Card>
  )
}
```

### 4. 嵌套卡片

在一个卡片内嵌套另一个卡片。

```tsx
function Example() {
  return (
    <Card cardTitle="主卡片">
      <div className="space-y-4">
        <p>主卡片内容</p>
        <Card cardTitle="子卡片" className="max-w-xs">
          <div>嵌套的内容区域</div>
        </Card>
      </div>
    </Card>
  )
}
```

## 完整示例

### 仪表盘卡片布局

创建一个典型的仪表盘数据卡片，包含标题、统计数据和图表区域。

```tsx
import { Card } from '@/registry/components/container-card/container-card'

function DashboardCard() {
  return (
    <Card cardTitle="销售数据">
      <div className="space-y-6">
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

        <div className="bg-gray-50 rounded-lg flex items-center justify-center h-[200px]">
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
import { Card } from '@/registry/components/container-card/container-card'

function FormCard() {
  return (
    <Card cardTitle="用户注册">
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">用户名</label>
          <input type="text" className="w-full px-3 py-2 border rounded" placeholder="请输入用户名" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">邮箱</label>
          <input type="email" className="w-full px-3 py-2 border rounded" placeholder="请输入邮箱" />
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded">注册</button>
      </form>
    </Card>
  )
}
```

### 内容详情页

创建一个详情页面卡片，展示详细信息。

```tsx
import { Card } from '@/registry/components/container-card/container-card'

function DetailCard() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card cardTitle="基本信息">
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
            <dt className="text-gray-500">库存状态</dt>
            <dd className="text-green-600">有货</dd>
          </div>
        </dl>
      </Card>

      <Card cardTitle="产品描述">
        <div className="space-y-4 text-gray-600">
          <p>这是一款功能强大的智能手表，支持心率监测、睡眠追踪、运动模式等多种功能。</p>
        </div>
      </Card>
    </div>
  )
}
```

## 注意事项

1. **默认宽度**：组件默认包含 `w-full max-w-sm` 类名，如需更大宽度可通过 `className` 覆盖 `max-w-sm`

2. **标题处理**：`cardTitle` 支持字符串类型，非字符串值会被尝试转换为 JSON 字符串，建议始终传入字符串

3. **标题隐藏**：当 `cardTitle` 为空字符串时，标题区域（CardHeader）不会渲染

4. **原生属性**：组件透传所有原生 `div` 属性，可通过 `style`、`className` 等自定义样式和行为
