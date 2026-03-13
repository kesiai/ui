# Panel 折叠面板

## 简介

`Panel` 是一个可折叠的面板容器组件，用于组织和展示可展开/收起的内容区域。

- **双模式支持**：支持手风琴模式（单开）和多开模式（多面板同时展开）
- **灵活配置**：通过配置数组或子组件两种方式定义面板
- **默认展开**：可配置默认展开的面板索引
- **全部折叠**：手风琴模式下支持允许全部折叠
- **性能优化**：支持强制渲染模式，保持面板状态

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `accordion` | `boolean` | 否 | `true` | 是否启用手风琴模式（只允许一个面板展开） |
| `collapsible` | `boolean` | 否 | `false` | 是否允许全部折叠（仅手风琴模式有效） |
| `panels` | `PanelConfig[]` | 否 | - | 面板配置数组 |
| `defaultValue` | `number \| number[]` | 否 | `0` | 默认展开的面板索引 |
| `value` | `string \| string[]` | 否 | - | 受控模式：当前展开的面板值 |
| `onValueChange` | `(value: string \| string[]) => void` | 否 | - | 展开状态变化回调 |
| `children` | `ReactNode` | 否 | - | 面板内容子元素 |

### PanelConfig

单个面板的配置对象。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `title` | `string` | 是 | - | 面板标题 |
| `forceRender` | `boolean` | 否 | `false` | 是否强制渲染（即使未展开也渲染） |

### accordion 和 collapsible

- `accordion`: 启用手风琴模式时，同时只能展开一个面板；关闭后可同时展开多个面板
- `collapsible`: 仅在手风琴模式下有效，启用后允许点击已展开的面板将其折叠

**示例：**
```tsx
<Panel
  accordion={true}
  collapsible={true}
  panels={[{ title: '面板1' }, { title: '面板2' }]}
>
  {/* 内容 */}
</Panel>
```

## 基本用法

### 1. 基础手风琴

创建一个手风琴模式的面板，同时只能展开一个。

```tsx
import { Panel } from '@/components/airiot/container-panel'

function Example() {
  return (
    <Panel
      panels={[
        { title: '什么是 React？' },
        { title: '什么是 Vue？' },
        { title: '什么是 Angular？' }
      ]}
      defaultValue={0}
    >
      <div className="p-4">
        React 是一个用于构建用户界面的 JavaScript 库。
      </div>
      <div className="p-4">
        Vue 是一个渐进式 JavaScript 框架。
      </div>
      <div className="p-4">
        Angular 是一个平台，用于构建移动和桌面 Web 应用。
      </div>
    </Panel>
  )
}
```

### 2. 可折叠手风琴

启用手风琴模式并允许全部折叠。

```tsx
function Example() {
  return (
    <Panel
      accordion={true}
      collapsible={true}
      panels={[
        { title: '问题 1' },
        { title: '问题 2' },
        { title: '问题 3' }
      ]}
    >
      <div className="p-4">答案 1</div>
      <div className="p-4">答案 2</div>
      <div className="p-4">答案 3</div>
    </Panel>
  )
}
```

### 3. 多开模式

关闭手风琴模式，允许同时展开多个面板。

```tsx
function Example() {
  return (
    <Panel
      accordion={false}
      panels={[
        { title: '章节 1：基础入门' },
        { title: '章节 2：进阶技巧' },
        { title: '章节 3：实战案例' }
      ]}
      defaultValue={[0, 1]}
    >
      <div className="p-4">基础入门内容</div>
      <div className="p-4">进阶技巧内容</div>
      <div className="p-4">实战案例内容</div>
    </Panel>
  )
}
```

### 4. 强制渲染

强制渲染未展开的面板内容，保持状态。

```tsx
function Example() {
  return (
    <Panel
      panels={[
        { title: '输入框示例', forceRender: true },
        { title: '选择器示例', forceRender: true }
      ]}
      defaultValue={0}
    >
      <div className="p-4">
        <input type="text" placeholder="输入一些内容" />
      </div>
      <div className="p-4">
        <select>
          <option>选项 1</option>
          <option>选项 2</option>
        </select>
      </div>
    </Panel>
  )
}
```

### 5. 受控模式

完全控制面板的展开状态。

```tsx
import { useState } from 'react'

function Example() {
  const [value, setValue] = useState('panel-0')

  return (
    <Panel
      panels={[
        { title: '面板 1' },
        { title: '面板 2' },
        { title: '面板 3' }
      ]}
      value={value}
      onValueChange={setValue}
    >
      <div className="p-4">当前展开：面板 1</div>
      <div className="p-4">当前展开：面板 2</div>
      <div className="p-4">当前展开：面板 3</div>
    </Panel>
  )
}
```

### 6. 多开受控模式

在多开模式下使用受控模式。

```tsx
import { useState } from 'react'

function Example() {
  const [value, setValue] = useState(['panel-0', 'panel-1'])

  return (
    <Panel
      accordion={false}
      panels={[
        { title: '面板 A' },
        { title: '面板 B' },
        { title: '面板 C' }
      ]}
      value={value}
      onValueChange={setValue}
    >
      <div className="p-4">面板 A 内容</div>
      <div className="p-4">面板 B 内容</div>
      <div className="p-4">面板 C 内容</div>
    </Panel>
  )
}
```

## 完整示例

### FAQ 常见问题

创建一个常见问题解答页面。

```tsx
import { Panel } from '@/components/airiot/container-panel'

function FAQPage() {
  const faqs = [
    {
      question: '如何注册账号？',
      answer: '点击页面右上角的"注册"按钮，填写用户名、邮箱和密码，完成验证后即可注册成功。'
    },
    {
      question: '忘记密码怎么办？',
      answer: '点击登录页面的"忘记密码"链接，输入注册时的邮箱，我们会发送重置密码的链接到您的邮箱。'
    },
    {
      question: '如何修改个人资料？',
      answer: '登录后进入"个人中心"，点击"编辑资料"按钮，即可修改个人信息。修改后记得保存。'
    },
    {
      question: '如何联系客服？',
      answer: '您可以通过以下方式联系我们：1. 在线客服（工作日 9:00-18:00）；2. 发送邮件至 support@example.com；3. 拨打客服电话 400-123-4567。'
    },
    {
      question: '支持哪些支付方式？',
      answer: '我们支持支付宝、微信支付、银行卡等多种支付方式，具体以结算页面显示为准。'
    }
  ]

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">常见问题</h1>
      <Panel
        accordion={true}
        collapsible={true}
        panels={faqs.map(faq => ({ title: faq.question }))}
      >
        {faqs.map((faq, index) => (
          <div key={index} className="p-4 text-gray-700">
            {faq.answer}
          </div>
        ))}
      </Panel>
    </div>
  )
}
```

### 课程目录

创建一个课程目录的折叠面板。

```tsx
import { Panel } from '@/components/airiot/container-panel'

function CourseOutline() {
  const chapters = [
    {
      title: '第1章：课程介绍',
      content: (
        <div className="space-y-2">
          <p>1.1 课程概览</p>
          <p>1.2 学习目标</p>
          <p>1.3 准备工作</p>
        </div>
      )
    },
    {
      title: '第2章：基础知识',
      content: (
        <div className="space-y-2">
          <p>2.1 核心概念</p>
          <p>2.2 基本语法</p>
          <p>2.3 数据类型</p>
          <p>2.4 运算符</p>
        </div>
      )
    },
    {
      title: '第3章：进阶技巧',
      content: (
        <div className="space-y-2">
          <p>3.1 高级特性</p>
          <p>3.2 性能优化</p>
          <p>3.3 设计模式</p>
        </div>
      )
    },
    {
      title: '第4章：实战项目',
      content: (
        <div className="space-y-2">
          <p>4.1 项目需求分析</p>
          <p>4.2 架构设计</p>
          <p>4.3 编码实现</p>
          <p>4.4 测试与部署</p>
        </div>
      )
    }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">课程目录</h1>
      <Panel
        accordion={false}
        panels={chapters.map(chapter => ({ title: chapter.title }))}
        defaultValue={[0, 1]}
      >
        {chapters.map((chapter, index) => (
          <div key={index} className="p-4">
            {chapter.content}
          </div>
        ))}
      </Panel>
    </div>
  )
}
```

### 系统设置

创建一个分类的系统设置页面。

```tsx
import { Panel } from '@/components/airiot/container-panel'
import { useState } from 'react'

function SystemSettings() {
  const [settings, setSettings] = useState({
    general: { notify: true, language: 'zh-CN' },
    security: { twoFactor: false, loginAlert: true },
    privacy: { profileVisible: true, showOnline: true }
  })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">系统设置</h1>
      <Panel
        accordion={false}
        panels={[
          { title: '通用设置' },
          { title: '安全设置' },
          { title: '隐私设置' }
        ]}
        defaultValue={[0]}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">启用通知</div>
              <div className="text-sm text-gray-500">接收系统通知</div>
            </div>
            <input
              type="checkbox"
              checked={settings.general.notify}
              onChange={(e) => setSettings({
                ...settings,
                general: { ...settings.general, notify: e.target.checked }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">语言</label>
            <select
              className="w-full px-3 py-2 border rounded"
              value={settings.general.language}
              onChange={(e) => setSettings({
                ...settings,
                general: { ...settings.general, language: e.target.value }
              })}
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
              <option value="ja-JP">日本語</option>
            </select>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">两步验证</div>
              <div className="text-sm text-gray-500">增强账户安全性</div>
            </div>
            <input
              type="checkbox"
              checked={settings.security.twoFactor}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, twoFactor: e.target.checked }
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">登录提醒</div>
              <div className="text-sm text-gray-500">异地登录时发送提醒</div>
            </div>
            <input
              type="checkbox"
              checked={settings.security.loginAlert}
              onChange={(e) => setSettings({
                ...settings,
                security: { ...settings.security, loginAlert: e.target.checked }
              })}
            />
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">公开资料</div>
              <div className="text-sm text-gray-500">允许其他用户查看您的资料</div>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.profileVisible}
              onChange={(e) => setSettings({
                ...settings,
                privacy: { ...settings.privacy, profileVisible: e.target.checked }
              })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">显示在线状态</div>
              <div className="text-sm text-gray-500">让其他用户看到您的在线状态</div>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.showOnline}
              onChange={(e) => setSettings({
                ...settings,
                privacy: { ...settings.privacy, showOnline: e.target.checked }
              })}
            />
          </div>
        </div>
      </Panel>
    </div>
  )
}
```

## 注意事项

1. **面板值格式**：面板值自动格式为 `panel-{index}`（从0开始），在受控模式的 `value` 和 `onValueChange` 中使用此格式

2. **手风琴模式**：默认启用手风琴模式，同一时间只能展开一个面板；关闭后可同时展开多个面板

3. **全部折叠**：`collapsible` 仅在手风琴模式下有效，启用后可以点击已展开的面板将其折叠，实现所有面板都折叠的状态

4. **默认值类型**：手风琴模式下 `defaultValue` 是 `number` 类型（单个索引），多开模式下是 `number[]` 类型（索引数组）

5. **强制渲染**：设置 `forceRender: true` 可以让面板内容即使未展开也保留在 DOM 中，适合需要保持输入状态或避免重新渲染的场景

6. **内容顺序**：使用 `panels` 配置时，`children` 中的内容元素顺序必须与 `panels` 数组顺序一一对应

7. **性能考虑**：如果面板内容包含复杂组件（如图表），建议使用 `forceRender` 或多开模式，避免频繁创建和销毁组件
