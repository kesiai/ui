# AI 助手 (AI Agent)

## 简介

`Assistant` 是一个基于 `@assistant-ui/react` 的 AI 助手界面组件，提供完整的对话界面体验。

- **对话历史**：内置侧边栏显示历史对话列表
- **响应式布局**：支持侧边栏展开/收起，适配不同屏幕尺寸
- **完整界面**：包含顶部导航栏和主对话区域
- **易于集成**：只需传入 runtime 实例即可使用

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `runtime` | `AssistantRuntime` | 否 | - | AI 助手运行时实例，来自 @assistant-ui/react。不传时只渲染 UI 外壳 |
| `title` | `string` | 否 | `''` | 侧边栏顶部标题，留空不显示 |
| `avatar` | `AvatarSettings` | 否 | - | 头像设置 `{ user?, agent? }`。**配置 user 或 agent 任一个即开启头像模式**；开启后助手回复也会像用户输入一样放进气泡框，未配置的一方显示默认文字头像（用户 U / 助手 A） |
| `preamble` | `string` | 否 | - | 预计输入内容（前言）。首次发送消息时注入到用户文本前，用于给 AI 预设上下文 |
| `renderRegistry` | `RenderRegistry` | 否 | - | 自定义显示组件注册表，详见自定义渲染文档 |
| `readOnly` | `boolean` | 否 | `false` | 只读模式，隐藏侧边栏/输入框，仅展示历史 |
| `className` | `string` | 否 | - | 外层容器类名 |

### AvatarSettings / AvatarConfig 头像配置

`avatar` 是一个对象 `{ user?, agent? }`，**配置 user 或 agent 任一个即开启头像模式**：

```ts
interface AvatarSettings {
  user?: AvatarConfig;   // 用户头像
  agent?: AvatarConfig;  // 助手头像
}

type AvatarConfig =
  | string                                 // 字符串：自动识别图片/文字
  | { type: "text"; text: string }         // 显式文字
  | { type: "image"; src: string; alt?: string } // 显式图片
```

- 传 **字符串** 时自动识别：以 `http(s)://`、`data:`、`/`、`./`、`../`、`blob:` 开头，或以 `.png/.jpg/.jpeg/.gif/.webp/.svg/.bmp/.avif/.ico` 结尾的，按**图片**渲染；否则按**文字**渲染。
- 开启头像模式后，**未配置的一方回退为默认文字头像**：用户 `U`、助手 `A`。

### preamble 预计输入内容（重要）

`preamble` 的**首条消息注入**发生在 `useAgentRuntime` 里，与 `renderRegistry` 走的是同一条「双路径」模式：

- 在 `<Assistant>` 上传 `preamble` —— 仅作为组件配置透传；
- 在 `useAgentRuntime(agentId, { preamble })` 上传 `preamble` —— **真正在首条消息发送时注入到 userText 前**。

二者需同时传递（和 `renderRegistry` 完全一致）。注入格式为 `{## <preamble> ##}`，与工具列表、渲染协议提示词并列，仅在新会话的首条消息上携带。

### AssistantRuntime

`AssistantRuntime` 是 `@assistant-ui/react` 库的核心类型，负责管理：
- 对话状态
- 消息发送和接收
- 流式响应处理
- 对话历史管理

## 基本用法

### 1. 基础使用

创建一个 AI 助手界面。

```tsx
import { Assistant } from '@/registry/components/ai-agent/ai-agent'
import { useChatModelRuntime } from '@assistant-ui/react'

function AIAssistant() {
  const runtime = useChatModelRuntime({
    api: '/api/chat',
    model: 'gpt-4'
  })

  return <Assistant runtime={runtime} />
}
```

### 2. 自定义 Runtime

使用自定义配置创建 runtime。

```tsx
import { Assistant } from '@/registry/components/ai-agent/ai-agent'
import { createVerdkRuntime } from '@assistant-ui/react'

function AIAssistant() {
  const runtime = createVerdkRuntime({
    initialState: {
      messages: [
        {
          role: 'system',
          content: '你是一个有用的AI助手。'
        }
      ]
    }
  })

  return <Assistant runtime={runtime} />
}
```

### 3. 带错误处理

添加错误处理和加载状态。

```tsx
import { Assistant } from '@/registry/components/ai-agent/ai-agent'
import { useState } from 'react'

function AIAssistant() {
  const [error, setError] = useState<string | null>(null)

  const runtime = createYourRuntime({
    onError: (err) => {
      setError(err.message)
    }
  })

  if (error) {
    return <div>Error: {error}</div>
  }

  return <Assistant runtime={runtime} />
}
```

### 4. 配置头像（图片 / 文字）

`avatar` 配置 user 或 agent 任一个即开启头像模式；开启后助手回复也会像用户输入一样放进气泡框，未配置的一方显示默认头像（U / A）。

```tsx
import { Assistant } from '@/registry/components/ai-agent/ai-agent'

function AIAssistant() {
  return (
    <Assistant
      runtime={runtime}
      avatar={{
        // 图片 URL —— 自动识别为图片头像
        user: 'https://example.com/me.png',
        // 文字 —— 渲染为文字头像
        agent: 'AI',
      }}
    />
  )
}
```

只配置一方也行：`avatar={{ agent: 'AI' }}`，此时用户侧自动显示默认头像 `U`。
也支持显式写法：`avatar={{ agent: { type: 'image', src: '/logo.svg', alt: '助手' } }}`。

### 5. 配置预计输入内容（preamble）

首次发送消息时，把预设上下文注入到用户文本前（与 `renderRegistry` 同路径）。
**注意：需同时传给 `useAgentRuntime` 才会真正注入。**

```tsx
import { Assistant } from '@/registry/components/ai-agent/ai-agent'
import { useAgentRuntime } from '@/registry/components/ai-agent/runtime'

const preamble = '当前用户是管理员，回答时请给出可操作的建议。'

function AIAssistant({ agentId }: { agentId: string }) {
  // 关键：preamble 传入 hook，首条消息才会注入
  const runtime = useAgentRuntime(agentId, { preamble })

  return (
    <Assistant
      runtime={runtime}
      avatar={{ user: '我', agent: 'AI' }}
      preamble={preamble}
    />
  )
}
```

## 组件结构

Assistant 组件包含以下子组件：

```
Assistant
├── AssistantRuntimeProvider (Runtime 上下文)
├── SidebarProvider (侧边栏布局)
│   ├── ThreadListSidebar (对话历史侧边栏)
│   └── SidebarInset (主内容区域)
│       ├── Header (顶部导航栏)
│       │   ├── SidebarTrigger (侧边栏切换按钮)
│       │   ├── Separator (分隔线)
│       │   └── Breadcrumb (面包屑导航)
│       └── Thread (主对话区域)
```

## 样式定制

组件使用 Tailwind CSS 进行样式设置，你可以通过覆盖样式类来自定义外观：

```css
/* 自定义侧边栏宽度 */
.ai-sidebar {
  width: 320px;
}

/* 自定义对话气泡 */
.ai-message-user {
  background-color: your-color;
}
```

## 依赖项

此组件依赖以下包：

```json
{
  "dependencies": {
    "@assistant-ui/react": "^latest",
    "@radix-ui/react-dialog": "^latest",
    "@radix-ui/react-slot": "^latest"
  }
}
```

## 注意事项

1. **Runtime 必需**：必须传入有效的 `AssistantRuntime` 实例，组件才能正常工作

2. **API 配置**：确保正确配置 AI 服务的 API 端点和认证信息

3. **状态管理**：所有对话状态由 runtime 管理，不需要额外维护

4. **响应式设计**：组件已内置响应式支持，在移动设备上会自动调整布局

5. **类型安全**：推荐使用 TypeScript 以获得完整的类型提示
