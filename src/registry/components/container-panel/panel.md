# Panel 折叠面板组件

## 简介

`Panel` 是一个折叠面板容器组件，用于管理可折叠的内容区域。

- **手风琴模式**：支持手风琴模式，同时只能展开一个面板
- **多开模式**：支持多开模式，可以同时展开多个面板
- **折叠控制**：可配置是否允许全部折叠
- **灵活配置**：支持配置化数组和 children 两种使用方式
- **性能优化**：支持强制渲染，优化面板内容的性能
- **平滑动画**：内置展开/折叠的平滑过渡动画

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `accordion` | `boolean` | 否 | `true` | 是否手风琴模式（只允许一个面板展开） |
| `collapsible` | `boolean` | 否 | `false` | 是否允许全部折叠（仅在手风琴模式下有效） |
| `panels` | `PanelConfig[]` | 否 | - | 面板配置数组 |
| `defaultValue` | `number \| number[]` | 否 | `0` | 默认展开的面板索引（从 0 开始） |
| `value` | `string \| string[]` | 否 | - | 受控模式：当前展开的面板值 |
| `onValueChange` | `(value: string \| string[]) => void` | 否 | - | 展开状态变化回调 |
| `children` | `ReactNode` | 否 | - | 子组件（如果提供 panels，则忽略 children） |
| `className` | `string` | 否 | - | 自定义类名 |

### PanelConfig 类型定义

```typescript
interface PanelConfig {
  title: string              // 面板标题
  forceRender?: boolean     // 强制渲染（即使未展开也渲染 DOM）
}
```

## 基本用法

### 1. 基础折叠面板

最简单的使用方式，创建三个面板：

```tsx
import { Panel } from '@/registry/components/container-panel/panel'

function App() {
  const panels = [
    { title: '面板 1' },
    { title: '面板 2' },
    { title: '面板 3' }
  ]

  return (
    <Panel panels={panels}>
      <div className="p-4">内容 1</div>
      <div className="p-4">内容 2</div>
      <div className="p-4">内容 3</div>
    </Panel>
  )
}
```

### 2. 多开模式

允许同时展开多个面板：

```tsx
<Panel
  accordion={false}
  panels={[
    { title: '面板 1' },
    { title: '面板 2' },
    { title: '面板 3' }
  ]}
>
  <div className="p-4">内容 1</div>
  <div className="p-4">内容 2</div>
  <div className="p-4">内容 3</div>
</Panel>
```

### 3. 允许全部折叠

在手风琴模式下允许所有面板都折叠：

```tsx
<Panel
  collapsible={true}
  panels={[
    { title: '面板 1' },
    { title: '面板 2' }
  ]}
>
  <div className="p-4">内容 1</div>
  <div className="p-4">内容 2</div>
</Panel>
```

### 4. 受控模式

使用 state 控制展开的面板：

```tsx
import { Panel } from '@/registry/components/container-panel/panel'
import { useState } from 'react'

function App() {
  const [value, setValue] = useState('panel-0')
  const panels = [
    { title: '用户管理' },
    { title: '角色管理' },
    { title: '权限管理' }
  ]

  return (
    <Panel
      panels={panels}
      value={value}
      onValueChange={setValue}
    >
      <div className="p-4">用户管理内容</div>
      <div className="p-4">角色管理内容</div>
      <div className="p-4">权限管理内容</div>
    </Panel>
  )
}
```

## 完整示例

### FAQ 问答面板

```tsx
import { Panel } from '@/registry/components/container-panel/panel'

function FAQ() {
  const faqs = [
    {
      title: '如何使用这个组件？',
      content: '这是一个折叠面板组件，可以用于展示 FAQ、文档目录等内容。'
    },
    {
      title: '支持哪些功能？',
      content: '支持手风琴模式、多开模式、受控/非受控模式等多种功能。'
    },
    {
      title: '如何自定义样式？',
      content: '可以通过 className prop 来自定义样式，也可以通过 CSS 覆盖默认样式。'
    }
  ]

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">常见问题</h2>
      <Panel
        panels={faqs.map(faq => ({ title: faq.title }))}
        collapsible={true}
      >
        {faqs.map((faq, index) => (
          <div key={index} className="p-4 text-slate-700">
            {faq.content}
          </div>
        ))}
      </Panel>
    </div>
  )
}
```

### 文档目录

```tsx
import { Panel } from '@/registry/components/container-panel/panel'

function DocNavigation() {
  const sections = [
    {
      title: '快速开始',
      content: (
        <div className="space-y-2">
          <a href="#" className="block p-2 hover:bg-slate-100 rounded">安装指南</a>
          <a href="#" className="block p-2 hover:bg-slate-100 rounded">基础配置</a>
          <a href="#" className="block p-2 hover:bg-slate-100 rounded">第一个项目</a>
        </div>
      )
    },
    {
      title: '核心概念',
      content: (
        <div className="space-y-2">
          <a href="#" className="block p-2 hover:bg-slate-100 rounded">组件通信</a>
          <a href="#" className="block p-2 hover:bg-slate-100 rounded">状态管理</a>
          <a href="#" className="block p-2 hover:bg-slate-100 rounded">路由配置</a>
        </div>
      )
    },
    {
      title: '高级用法',
      content: (
        <div className="space-y-2">
          <a href="#" className="block p-2 hover:bg-slate-100 rounded">性能优化</a>
          <a href="#" className="block p-2 hover:bg-slate-100 rounded">插件开发</a>
          <a href="#" className="block p-2 hover:bg-slate-100 rounded">部署上线</a>
        </div>
      )
    }
  ]

  return (
    <Panel
      panels={sections.map(s => ({ title: s.title }))}
      defaultValue={0}
    >
      {sections.map((section, index) => (
        <div key={index}>
          {section.content}
        </div>
      ))}
    </Panel>
  )
}
```

### 多开模式示例

```tsx
import { Panel } from '@/registry/components/container-panel/panel'

function MultiOpenPanel() {
  const tasks = [
    {
      title: '待办事项',
      items: ['完成文档编写', '代码审查', '修复 bug']
    },
    {
      title: '进行中',
      items: ['开发新功能', '性能优化']
    },
    {
      title: '已完成',
      items: ['需求分析', '原型设计', '技术选型']
    }
  ]

  return (
    <Panel
      panels={tasks.map(task => ({ title: task.title }))}
      accordion={false}
      defaultValue={[0, 1]}
    >
      {tasks.map((task, index) => (
        <div key={index} className="p-4">
          <ul className="space-y-2">
            {task.items.map((item, i) => (
              <li key={i} className="flex items-center p-2 bg-slate-50 rounded">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Panel>
  )
}
```

### 表单分组

```tsx
import { Panel } from '@/registry/components/container-panel/panel'
import { useState } from 'react'

function FormGroups() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  })

  const formGroups = [
    {
      title: '基本信息',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">用户名</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">邮箱</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      )
    },
    {
      title: '联系方式',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">电话</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">地址</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      )
    },
    {
      title: '其他信息',
      content: (
        <div>
          <label className="block text-sm font-medium mb-2">个人简介</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            rows={4}
          />
        </div>
      )
    }
  ]

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">用户信息</h2>
      <Panel
        panels={formGroups.map(g => ({ title: g.title }))}
        collapsible={true}
      >
        {formGroups.map((group, index) => (
          <div key={index} className="p-4">
            {group.content}
          </div>
        ))}
      </Panel>
    </div>
  )
}
```

## 注意事项

1. **面板值格式**：每个面板的值自动生成为 `panel-0`、`panel-1`、`panel-2` 等格式，与 `panels` 数组的索引对应

2. **默认值注意**：在手风琴模式下，`defaultValue` 是一个数字（如 `0`）；在多开模式下，`defaultValue` 是一个数字数组（如 `[0, 1]`）

3. **受控模式**：使用受控模式时，手风琴模式的 `value` 是字符串，多开模式的 `value` 是字符串数组

4. **全部折叠**：`collapsible` 属性只在手风琴模式下有效，设置为 `true` 后可以点击已展开的面板来折叠它

5. **子组件数量**：使用 `panels` 配置时，`children` 的数量应该与 `panels` 数组的长度一致

6. **强制渲染**：在单个面板配置中设置 `forceRender: true` 可以让该面板即使未展开也渲染 DOM，适合需要保持状态的场景

7. **性能考虑**：对于包含大量内容或复杂组件的面板，建议使用 `forceRender: false`（默认值）来优化性能

8. **嵌套使用**：不建议在面板内容中嵌套另一个 Panel 组件，可能会导致交互问题
