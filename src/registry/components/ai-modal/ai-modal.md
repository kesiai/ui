# AI 弹窗助手 (AI Modal)

## 简介

`AIModal` 是一个基于 `@assistant-ui/react` 的 AI 助手弹窗组件，提供浮动触发按钮和可展开的对话窗口。

- **浮动触发器**：屏幕四角可定位的浮动按钮
- **可展开设计**：支持从小弹窗展开为全屏 Dialog
- **状态继承**：大小窗口间完全共享对话状态
- **位置灵活**：支持四种触发按钮位置
- **自定义样式**：支持自定义弹窗样式和触发按钮样式

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `runtime` | `AssistantRuntime` | 是 | - | AI 助手运行时实例，来自 @assistant-ui/react |
| `title` | `string` | 否 | `'AI Assistant'` | AI 助手的标题（显示在弹窗头部和侧边栏） |
| `modalSize` | `{ width: string; height: string }` | 否 | `{ width: '400px', height: '500px' }` | 小弹窗的尺寸 |
| `modalClassName` | `string` | 否 | - | 小弹窗的自定义类名 |
| `triggerPosition` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | 否 | `'bottom-right'` | 浮动触发按钮的位置 |
| `triggerClassName` | `string` | 否 | - | 触发按钮的自定义类名 |
| `showExpandButton` | `boolean` | 否 | `true` | 是否显示放大按钮 |
| `expandPosition` | `'fullscreen' \| 'large'` | 否 | `'fullscreen'` | 展开模式：全屏或大窗口 |

### triggerPosition

控制浮动触发按钮在屏幕上的位置。

| 值 | 说明 |
|---|---|
| `bottom-right` | 右下角（默认） |
| `bottom-left` | 左下角 |
| `top-right` | 右上角 |
| `top-left` | 左上角 |

### expandPosition

控制点击放大按钮后的展开模式。

| 值 | 说明 |
|---|---|
| `fullscreen` | 全屏模式（默认） |
| `large` | 大窗口模式 (90vw x 90vh) |

## 基本用法

### 1. 基础使用

创建一个默认的 AI 弹窗助手。

```tsx
import { AIModal } from '@/registry/components/ai-modal/ai-modal'
import { useOpenCodeRuntime } from "@assistant-ui/react-opencode"

function MyAIModal() {
  const runtime = useOpenCodeRuntime({
    baseUrl: "http://localhost:4096",
  })

  return <AIModal runtime={runtime} />
}
```

### 2. 自定义标题

```tsx
function MyAIModal() {
  const runtime = useOpenCodeRuntime({
    baseUrl: "http://localhost:4096",
  })

  return (
    <AIModal
      runtime={runtime}
      title="智能客服"
    />
  )
}
```

### 3. 自定义弹窗尺寸

```tsx
function MyAIModal() {
  const runtime = useOpenCodeRuntime({
    baseUrl: "http://localhost:4096",
  })

  return (
    <AIModal
      runtime={runtime}
      modalSize={{ width: '500px', height: '600px' }}
    />
  )
}
```

### 4. 自定义触发位置

```tsx
function MyAIModal() {
  const runtime = useOpenCodeRuntime({
    baseUrl: "http://localhost:4096",
  })

  return (
    <AIModal
      runtime={runtime}
      triggerPosition="bottom-left"
    />
  )
}
```

### 5. 大窗口展开模式

```tsx
function MyAIModal() {
  const runtime = useOpenCodeRuntime({
    baseUrl: "http://localhost:4096",
  })

  return (
    <AIModal
      runtime={runtime}
      expandPosition="large"
    />
  )
}
```

### 6. 自定义样式

```tsx
function MyAIModal() {
  const runtime = useOpenCodeRuntime({
    baseUrl: "http://localhost:4096",
  })

  return (
    <AIModal
      runtime={runtime}
      modalClassName="bg-blue-50 border-blue-200"
      triggerClassName="bg-gradient-to-r from-blue-500 to-purple-500"
    />
  )
}
```

### 7. 隐藏放大按钮

```tsx
function MyAIModal() {
  const runtime = useOpenCodeRuntime({
    baseUrl: "http://localhost:4096",
  })

  return (
    <AIModal
      runtime={runtime}
      showExpandButton={false}
    />
  )
}
```

## 状态继承机制

AIModal 通过共享同一个 `AssistantRuntime` 实例实现状态继承：

1. **小弹窗和全屏 Dialog 共享 runtime**
2. **对话历史在两个窗口间完全同步**
3. **消息发送和接收状态一致**
4. **无需手动管理状态传递**

```tsx
// runtime 在组件顶部创建一次
const runtime = useOpenCodeRuntime({ baseUrl: "..." })

// 小弹窗和全屏 Dialog 都使用同一个 runtime
<AIModal runtime={runtime} />
```

## 组件结构

```
AIModal
├── AssistantRuntimeProvider (Runtime 上下文)
│   ├── AssistantModalPrimitive.Root (小弹窗)
│   │   ├── AssistantModalPrimitive.Anchor (浮动按钮定位)
│   │   │   └── Trigger (浮动触发按钮)
│   │   └── AssistantModalPrimitive.Content (小弹窗内容)
│   │       ├── Header (标题栏 + 放大/关闭按钮)
│   │       └── Thread (对话内容)
│   └── Dialog (全屏展开)
│       └── DialogContent
│           └── Assistant (完整 AI 助手界面)
│               ├── Sidebar (对话历史)
│               └── Thread (对话内容，与小弹窗共享状态)
```

## 样式定制

### 触发按钮样式

通过 `triggerClassName` 自定义触发按钮。

```tsx
<AIModal
  runtime={runtime}
  triggerClassName="bg-gradient-to-r from-blue-500 to-purple-500 shadow-xl"
/>
```

### 弹窗样式

通过 `modalClassName` 自定义弹窗样式。

```tsx
<AIModal
  runtime={runtime}
  modalClassName="bg-blue-50 border-blue-200 rounded-2xl"
/>
```

## 依赖项

此组件依赖以下包：

```json
{
  "dependencies": {
    "@assistant-ui/react": "^0.12.28",
    "@assistant-ui/react-opencode": "^latest",
    "@radix-ui/react-dialog": "^latest",
    "lucide-react": "^latest"
  }
}
```

## 注意事项

1. **Runtime 共享**：确保整个应用中只创建一个 runtime 实例，并在需要的地方共享它

2. **状态管理**：所有对话状态由 runtime 管理，大小窗口会自动同步

3. **性能考虑**：Thread 组件使用了虚拟滚动，支持大量消息

4. **响应式设计**：组件已内置响应式支持，在移动设备上也能正常使用

5. **Z-Index 管理**：浮动按钮的 z-index 为 50，弹窗内容为 60

6. **全屏模式**：全屏 Dialog 使用 `h-screen` 确保占满整个视口高度

## 完整示例

### 带自定义样式的 AI Modal

```tsx
import { AIModal } from '@/registry/components/ai-modal/ai-modal'
import { useOpenCodeRuntime } from "@assistant-ui/react-opencode"

function CustomAIModal() {
  const runtime = useOpenCodeRuntime({
    baseUrl: "http://localhost:4096",
  })

  return (
    <AIModal
      runtime={runtime}
      title="编程助手"
      modalSize={{ width: '450px', height: '550px' }}
      modalClassName="bg-gradient-to-br from-slate-50 to-blue-50"
      triggerPosition="bottom-right"
      showExpandButton={true}
      expandPosition="fullscreen"
      triggerClassName="bg-blue-600 hover:bg-blue-700"
    />
  )
}
```

### 多 Runtime 实例

如果需要多个独立的 AI Modal，每个都需要自己的 runtime：

```tsx
function MultiAIModal() {
  const assistantRuntime = useOpenCodeRuntime({
    baseUrl: "http://localhost:4096/assistant",
  })

  const coderRuntime = useOpenCodeRuntime({
    baseUrl: "http://localhost:4096/coder",
  })

  return (
    <>
      <AIModal
        runtime={assistantRuntime}
        title="助手"
        triggerPosition="bottom-left"
      />
      <AIModal
        runtime={coderRuntime}
        title="编程助手"
        triggerPosition="bottom-right"
      />
    </>
  )
}
```
