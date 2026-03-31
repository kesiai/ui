> **安装命令**: `npx shadcn@latest add @kesi/iframe`

# Iframe 嵌入

## 简介

`Iframe` 是一个用于嵌入外部网页内容的组件，支持自动添加用户认证令牌。

- **简单易用**：只需提供 URL 即可嵌入任意网页
- **Token 认证**：支持自动将用户 token 添加到 URL 参数中，方便权限验证
- **安全隔离**：iframe 提供的沙箱环境，安全隔离外部内容
- **响应式设计**：自动适应父容器尺寸
- **友好的占位提示**：未配置 URL 时显示友好的提示信息

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `iframeSrc` | `string` | 否 | `''` | 要嵌入的网页地址 |
| `hasToken` | `boolean` | 否 | `false` | 是否在 URL 中自动添加 token 参数 |
| `className` | `string` | 否 | - | 自定义样式类名 |
| ...其他 | `React.IframeHTMLAttributes<HTMLIFrameElement>` | 否 | - | 所有原生 iframe 属性 |

## 基本用法

### 1. 基本嵌入

最简单的用法，嵌入一个外部网页。

```tsx
import { Iframe } from '@/components/kesi/iframe'

function Example() {
  return (
    <Iframe
      iframeSrc="https://example.com"
    />
  )
}
```

### 2. 携带 Token 认证

自动在 URL 中添加当前用户的 token。

```tsx
function Example() {
  return (
    <Iframe
      iframeSrc="https://example.com"
      hasToken={true}
    />
  )
}
```

最终 URL 会变成：`https://example.com?token=xxx`

### 3. 自定义样式

添加自定义样式类。

```tsx
function Example() {
  return (
    <Iframe
      iframeSrc="https://example.com"
      className="rounded-lg shadow-lg"
    />
  )
}
```

### 4. 使用原生 iframe 属性

支持所有原生 iframe 属性。

```tsx
function Example() {
  return (
    <Iframe
      iframeSrc="https://example.com"
      hasToken={true}
      title="嵌入页面"
      loading="lazy"
      sandbox="allow-same-origin allow-scripts"
    />
  )
}
```

### 5. 嵌入带参数的 URL

如果 URL 已经包含参数，token 会正确追加。

```tsx
function Example() {
  return (
    <Iframe
      iframeSrc="https://example.com?param1=value1&param2=value2"
      hasToken={true}
    />
  )
}
```

最终 URL：`https://example.com?param1=value1&param2=value2&token=xxx`

### 6. 未配置 URL 时的占位

未提供 URL 时显示友好的提示。

```tsx
function Example() {
  return (
    <div className="h-96">
      <Iframe
        iframeSrc=""
        className="border-2"
      />
    </div>
  )
}
```

### 7. 条件渲染 URL

根据条件动态加载不同的 URL。

```tsx
import { useState } from 'react'

function Example() {
  const [mode, setMode] = useState('dashboard')

  const urls = {
    dashboard: 'https://example.com/dashboard',
    report: 'https://example.com/report',
    settings: 'https://example.com/settings'
  }

  return (
    <div>
      <div className="mb-4 space-x-2">
        <button onClick={() => setMode('dashboard')}>仪表板</button>
        <button onClick={() => setMode('report')}>报表</button>
        <button onClick={() => setMode('settings')}>设置</button>
      </div>
      <Iframe iframeSrc={urls[mode]} hasToken={true} />
    </div>
  )
}
```

## 完整示例

### 嵌入外部报表系统

嵌入一个需要认证的外部报表系统。

```tsx
import { Iframe } from '@/components/kesi/iframe'

function ReportViewer() {
  return (
    <div className="h-screen p-6">
      <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">数据报表</h2>
          <p className="text-sm text-gray-600">
            来自外部报表系统的实时数据
          </p>
        </div>
        <div className="p-4" style={{ height: 'calc(100% - 80px)' }}>
          <Iframe
            iframeSrc="https://reports.example.com/dashboard"
            hasToken={true}
            className="w-full h-full"
            title="数据报表"
          />
        </div>
      </div>
    </div>
  )
}
```

### 多标签页嵌入系统

使用标签页切换不同的嵌入页面。

```tsx
import { Iframe } from '@/components/kesi/iframe'
import { useState } from 'react'

function EmbeddedSystemTabs() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: '总览', url: 'https://system.example.com/overview' },
    { id: 'analytics', label: '分析', url: 'https://system.example.com/analytics' },
    { id: 'settings', label: '设置', url: 'https://system.example.com/settings' }
  ]

  return (
    <div className="h-screen flex flex-col">
      {/* 标签页导航 */}
      <div className="bg-white border-b">
        <div className="flex space-x-8 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 p-6">
        <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
          <Iframe
            key={activeTab}
            iframeSrc={tabs.find(t => t.id === activeTab)?.url}
            hasToken={true}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}
```

### 嵌入帮助文档

嵌入在线帮助文档系统。

```tsx
import { Iframe } from '@/components/kesi/iframe'

function HelpDocumentation() {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="h-full w-full max-w-6xl mx-auto bg-white">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">帮助文档</h2>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            关闭
          </button>
        </div>

        {/* 文档内容 */}
        <div className="h-[calc(100%-60px)]">
          <Iframe
            iframeSrc="https://docs.example.com"
            hasToken={true}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}
```

### 响应式嵌入布局

创建一个响应式的嵌入内容布局。

```tsx
import { Iframe } from '@/components/kesi/iframe'

function ResponsiveEmbed() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-screen">
      {/* 左侧：嵌入内容 */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">主系统</h3>
        </div>
        <div className="p-4" style={{ height: 'calc(100% - 60px)' }}>
          <Iframe
            iframeSrc="https://main-system.example.com"
            hasToken={true}
          />
        </div>
      </div>

      {/* 右侧：嵌入内容 */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">辅助系统</h3>
        </div>
        <div className="p-4" style={{ height: 'calc(100% - 60px)' }}>
          <Iframe
            iframeSrc="https://aux-system.example.com"
            hasToken={true}
          />
        </div>
      </div>
    </div>
  )
}
```

## 注意事项

1. **同源策略**：iframe 受浏览器同源策略限制。如果嵌入的页面与父页面不同源，无法进行 JavaScript 通信。

2. **URL 协议**：确保 `iframeSrc` 包含完整的协议（`http://` 或 `https://`），否则无法正确加载。

3. **Token 安全性**：启用 `hasToken` 后，token 会以明文形式出现在 URL 中。对于敏感操作，建议使用其他认证方式（如 POST 请求）。

4. **跨域限制**：某些网站通过 `X-Frame-Options` 或 `CSP` 禁止被 iframe 嵌入。这种情况下需要联系目标站点管理员。

5. **性能考虑**：嵌入大量 iframe 会影响页面性能。建议：
   - 使用 `loading="lazy"` 延迟加载
   - 及时卸载不需要的 iframe
   - 控制同时加载的 iframe 数量

6. **用户体验**：嵌入的页面可能不适合在小屏幕上显示。建议：
   - 在移动端提供替代方案
   - 或者提示用户在新窗口中打开

7. **Token 参数冲突**：如果 URL 中已经包含名为 `token` 的参数，组件的 token 会覆盖它。确保目标站点正确处理这种情况。

8. **用户登录状态**：`hasToken` 依赖 `useUser()` hook 获取用户信息。如果用户未登录或 token 无效，可能无法正确访问受保护的内容。

9. **HTTPS 混合内容**：如果父页面是 HTTPS，嵌入的页面也必须是 HTTPS，否则会被浏览器阻止。

10. **Sandbox 属性**：出于安全考虑，可以使用 `sandbox` 属性限制 iframe 的能力。例如：
    ```tsx
    <Iframe
      iframeSrc="https://example.com"
      sandbox="allow-same-origin allow-scripts allow-forms"
    />
    ```
