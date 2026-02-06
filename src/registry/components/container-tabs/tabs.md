# Tabs 标签页组件

## 简介

`Tabs` 是一个标签页容器组件，用于在多个标签页之间切换显示不同内容。

- **灵活的布局**：支持上、下、左、右四种标签位置
- **多种样式**：提供下划线页签和卡片式页签两种样式
- **图标支持**：每个标签支持设置图标和选中状态图标
- **性能优化**：支持强制渲染和销毁未激活标签页，优化性能
- **受控/非受控模式**：支持受控和非受控两种使用方式
- **响应式设计**：自适应容器大小，提供流畅的切换体验

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `tabs` | `TabConfig[]` | 是 | `[]` | 标签配置数组 |
| `defaultValue` | `string` | 否 | `'tab-0'` | 默认激活的标签值 |
| `value` | `string` | 否 | - | 受控模式：当前激活的标签值 |
| `onValueChange` | `(value: string) => void` | 否 | - | 激活状态变化回调 |
| `orientation` | `'top' \| 'bottom' \| 'left' \| 'right'` | 否 | `'top'` | 标签位置 |
| `variant` | `'line' \| 'card'` | 否 | `'line'` | 标签样式 |
| `destroyInactiveTabPane` | `boolean` | 否 | `false` | 隐藏时销毁未激活的标签内容 |
| `children` | `ReactNode` | 否 | - | 子组件（对应每个标签页的内容） |
| `className` | `string` | 否 | - | 自定义类名 |

### TabConfig 类型定义

```typescript
interface TabConfig {
  title: string              // 标签标题
  icon?: string             // 标签图标 URL
  selectedIcon?: string     // 选中状态的图标 URL
  forceRender?: boolean     // 强制渲染（即使未展开也渲染 DOM）
}
```

## 基本用法

### 1. 基础标签页

最简单的使用方式，创建三个标签页：

```tsx
import { Tabs } from '@/registry/components/container-tabs/tabs'

function App() {
  const tabs = [
    { title: '标签 1' },
    { title: '标签 2' },
    { title: '标签 3' }
  ]

  return (
    <Tabs tabs={tabs}>
      <div>内容 1</div>
      <div>内容 2</div>
      <div>内容 3</div>
    </Tabs>
  )
}
```

### 2. 受控模式

使用 state 控制当前激活的标签：

```tsx
import { Tabs } from '@/registry/components/container-tabs/tabs'
import { useState } from 'react'

function App() {
  const [value, setValue] = useState('tab-0')
  const tabs = [
    { title: '首页' },
    { title: '产品' },
    { title: '关于' }
  ]

  return (
    <Tabs
      tabs={tabs}
      value={value}
      onValueChange={setValue}
    >
      <div>首页内容</div>
      <div>产品内容</div>
      <div>关于内容</div>
    </Tabs>
  )
}
```

### 3. 左侧标签布局

将标签放置在左侧：

```tsx
<Tabs
  tabs={[
    { title: '用户管理' },
    { title: '角色管理' },
    { title: '权限管理' }
  ]}
  orientation="left"
>
  <div>用户管理内容</div>
  <div>角色管理内容</div>
  <div>权限管理内容</div>
</Tabs>
```

### 4. 卡片样式

使用卡片式标签页：

```tsx
<Tabs
  tabs={[
    { title: 'Tab 1' },
    { title: 'Tab 2' },
    { title: 'Tab 3' }
  ]}
  variant="card"
>
  <div>内容 1</div>
  <div>内容 2</div>
  <div>内容 3</div>
</Tabs>
```

## 完整示例

### 带图标的标签页

```tsx
import { Tabs } from '@/registry/components/container-tabs/tabs'

function IconTabs() {
  const tabs = [
    {
      title: '仪表盘',
      icon: '/icons/dashboard.png',
      selectedIcon: '/icons/dashboard-active.png'
    },
    {
      title: '数据',
      icon: '/icons/data.png',
      selectedIcon: '/icons/data-active.png'
    },
    {
      title: '设置',
      icon: '/icons/settings.png',
      selectedIcon: '/icons/settings-active.png'
    }
  ]

  return (
    <Tabs tabs={tabs}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">仪表盘</h2>
        <p>这里是仪表盘内容</p>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">数据</h2>
        <p>这里是数据内容</p>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">设置</h2>
        <p>这里是设置内容</p>
      </div>
    </Tabs>
  )
}
```

### 图表标签页（销毁模式）

```tsx
import { Tabs } from '@/registry/components/container-tabs/tabs'

function ChartTabs() {
  const tabs = [
    { title: '折线图' },
    { title: '柱状图' },
    { title: '饼图' }
  ]

  return (
    <Tabs
      tabs={tabs}
      destroyInactiveTabPane={true}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">折线图</h3>
        <div className="h-80 bg-slate-50 rounded flex items-center justify-center">
          <p className="text-slate-400">折线图组件</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">柱状图</h3>
        <div className="h-80 bg-slate-50 rounded flex items-center justify-center">
          <p className="text-slate-400">柱状图组件</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">饼图</h3>
        <div className="h-80 bg-slate-50 rounded flex items-center justify-center">
          <p className="text-slate-400">饼图组件</p>
        </div>
      </div>
    </Tabs>
  )
}
```

### 表单标签页

```tsx
import { Tabs } from '@/registry/components/container-tabs/tabs'
import { useState } from 'react'

function FormTabs() {
  const [value, setValue] = useState('tab-0')
  const tabs = [
    { title: '基本信息' },
    { title: '联系方式' },
    { title: '其他信息' }
  ]

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  return (
    <Tabs
      tabs={tabs}
      value={value}
      onValueChange={setValue}
    >
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">基本信息</h3>
        <div>
          <label className="block text-sm font-medium mb-2">姓名</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">联系方式</h3>
        <div>
          <label className="block text-sm font-medium mb-2">邮箱</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">电话</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">其他信息</h3>
        <div>
          <label className="block text-sm font-medium mb-2">地址</label>
          <textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            rows={4}
          />
        </div>
      </div>
    </Tabs>
  )
}
```

### 底部标签页

```tsx
import { Tabs } from '@/registry/components/container-tabs/tabs'

function BottomTabs() {
  const tabs = [
    { title: '首页' },
    { title: '发现' },
    { title: '消息' },
    { title: '我的' }
  ]

  return (
    <div className="h-96">
      <Tabs
        tabs={tabs}
        orientation="bottom"
        className="h-full"
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-xl">首页内容</p>
        </div>
        <div className="flex items-center justify-center h-full">
          <p className="text-xl">发现内容</p>
        </div>
        <div className="flex items-center justify-center h-full">
          <p className="text-xl">消息内容</p>
        </div>
        <div className="flex items-center justify-center h-full">
          <p className="text-xl">我的内容</p>
        </div>
      </Tabs>
    </div>
  )
}
```

## 注意事项

1. **标签值格式**：每个标签的值自动生成为 `tab-0`、`tab-1`、`tab-2` 等格式，与 `tabs` 数组的索引对应

2. **子组件数量**：`children` 的数量应该与 `tabs` 数组的长度一致，多余的子组件会被忽略

3. **销毁模式**：当 `destroyInactiveTabPane` 为 `true` 时，未激活的标签页内容会被完全销毁，切换时会重新创建，适合包含图表等需要重新渲染的组件

4. **强制渲染**：在单个标签配置中设置 `forceRender: true` 可以让该标签页即使未激活也渲染 DOM，适合需要保持状态的场景

5. **布局注意**：使用 `left` 或 `right` 布局时，建议给容器设置固定高度，以确保标签和内容正确显示

6. **图标尺寸**：标签图标的默认尺寸为 14x14 像素，如需调整请通过 CSS 自定义

7. **性能优化**：对于包含大量数据或复杂组件的标签页，建议使用 `destroyInactiveTabPane` 来优化性能
