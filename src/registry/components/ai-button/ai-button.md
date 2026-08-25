# AI 按钮 (AIButton)

一个「按钮 + 任务模式 AI 对话弹窗」组件。点击按钮后在**页面中心**弹出任务对话，属于 **任务模式（Task）**。

## 简介

`AIButton` 底层复用 `ai-agent` 的完整能力（`useAgentRuntime` / `Assistant` / `AgentSelect` / `Thread`），不重复实现任何运行时、会话、渲染逻辑。主要用于需要**用户点一个按钮触发一次 AI 任务对话**的场景。

## 与 ai-modal 的区别

| 维度 | ai-button | ai-modal |
|------|-----------|----------|
| 触发 | 普通 Button（文案可自定义） | 右下角浮动球 |
| 弹出位置 | 页面中心（标准 Dialog） | 右下角浮动容器 |
| 运行模式 | **任务模式**（创建 Task） | 默认 agent 模式 |
| 智能体选择 | 弹窗内 AgentSelect | 弹窗内 AgentSelect（可选开启） |
| 自定义系统提示词 | 支持（preamble） | 不支持传 |

## Props

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `label` | `ReactNode` | 否 | `AI 助手` | 按钮文案 |
| `variant` | `ButtonProps["variant"]` | 否 | `default` | 按钮变体 |
| `size` | `ButtonProps["size"]` | 否 | `default` | 按钮尺寸 |
| `icon` | `ReactNode` | 否 | `BotIcon` | 按钮图标（label 左侧） |
| `className` | `string` | 否 | - | 按钮扩展类名 |
| `title` | `ReactNode` | 否 | `AI 助手` | 弹窗标题 |
| `preamble` | `string` | 否 | - | **自定义系统提示词**。首条消息注入，定义助手行为/角色 |
| `renderRegistry` | `RenderRegistry` | 否 | - | 自定义显示组件注册表（透传 ai-agent） |
| `avatar` | `AvatarSettings` | 否 | - | 头像配置（透传 ai-agent） |
| `dialogWidth` | `string` | 否 | `min(48rem, 92vw)` | 弹窗宽度 |
| `dialogHeight` | `string` | 否 | `min(36rem, 85vh)` | 弹窗高度 |
| `readOnly` | `boolean` | 否 | `false` | 只读（隐藏输入框） |
| `open` / `onOpenChange` | `boolean` / fn | 否 | - | 受控打开状态 |

## 基本用法

```tsx
import { AIButton } from "@/registry/components/ai-button/ai-button"

function Page() {
  return (
    <AIButton
      label="开始 AI 任务"
      title="任务对话"
      preamble="你是一个精通物联网平台的助手，请给出可操作的建议。"
    />
  )
}
```

## 行为说明

1. **点击按钮** → 弹出页面中心 Dialog
2. **弹窗内选择智能体**（AgentSelect，运行时选择，非配置写死）
3. 输入消息发送 → **创建一个任务（Task）**，走 `/eap/tasks` 接口
4. 产出显示在右侧纯对话区（隐藏任务详情侧栏，见 ai-agent 的 `hideTaskPanel`）

> 智能体需在弹窗内先选择再发消息；系统提示词通过 `preamble` 在首条消息注入。

## 依赖项

- `@assistant-ui/react`（底层 runtime）
- `@kesi/client`（API）
- 复用 `@/registry/components/ai-agent/*`（runtime、Assistant、AgentSelect、Thread）
