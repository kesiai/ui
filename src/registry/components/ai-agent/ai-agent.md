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
| `runtime` | `AssistantRuntime` | 是 | - | AI 助手运行时实例，来自 @assistant-ui/react |

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
