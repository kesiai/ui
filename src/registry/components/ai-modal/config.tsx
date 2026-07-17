import React from 'react'
import { AIModal } from '@/registry/components/ai-modal/ai-modal'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './ai-modal.md?raw'
import { useOpenCodeRuntime } from "@assistant-ui/react-opencode"
import type { AssistantRuntime } from "@assistant-ui/react"
import { useAgentRuntime } from "@/registry/components/ai-agent/runtime"


// Runtime 预设类型定义
export type RuntimePreset = 'opencode' | 'agent' | 'agent-interactable' | 'openai' | 'vercel' | 'custom'

// Runtime 预设代码模板
export const runtimePresetCodes: Record<RuntimePreset, string> = {
  opencode: `import { useOpenCodeRuntime } from "@assistant-ui/react-opencode"

const runtime = useOpenCodeRuntime({
  baseUrl: "http://localhost:4096",
})`,
  openai: `import { useChatModelRuntime } from "@assistant-ui/react"

const runtime = useChatModelRuntime({
  initialMessages: [
    {
      role: "system",
      content: "You are a helpful AI assistant."
    }
  ],
  streamOptions: {
    api: "/api/chat/openai"
  }
})`,
  vercel: `import { useChatRuntime } from "@assistant-ui/react"
import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

const runtime = useChatRuntime({
  streamOptions: async (messages) => {
    const result = await streamText({
      model: createOpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })("gpt-4-turbo"),
      messages
    })
    return result.toDataStream()
  }
})`,
  custom: `import { createCustomRuntime } from "@assistant-ui/react"

const runtime = createCustomRuntime({
  initialState: {
    messages: [
      {
        role: "system",
        content: "You are a helpful AI assistant."
      }
    ]
  },
  onSendMessage: async (messages) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    })
    return response.body
  }
})`,
  agent: `import { useAgentRuntime } from "@/registry/components/ai-agent/runtime"


const runtime = useAgentRuntime()`,
  "agent-interactable": `import { useAgentRuntime } from "@/registry/components/ai-agent/runtime"


const runtime = useAgentRuntime()`

}

export const aiModalPropsConfig = [
  {
    name: 'runtimePreset',
    label: 'Runtime 类型',
    type: 'select' as const,
    default: 'opencode' as RuntimePreset,
    required: true,
    description: '选择 AI 助手运行时类型',
    options: [
      { value: 'opencode', label: 'OpenCode Runtime' },
      { value: 'agent', label: 'Agent Runtime' },
      { value: 'agent-interactable', label: 'Agent + 可交互工具' },
      { value: 'openai', label: 'OpenAI Runtime' },
      { value: 'vercel', label: 'Vercel AI SDK' },
      { value: 'custom', label: '自定义 Runtime' }
    ]
  },
  {
    name: 'agentId',
    label: 'Agent',
    type: 'agent-id' as const,
    default: '6a3a22aeecf2e81476c84246',
    placeholder: 'your-agent-id',
    description: 'Agent Runtime 的 agent ID'
  },
  {
    name: 'title',
    label: '标题',
    type: 'text' as const,
    default: 'AI Assistant',
    placeholder: 'AI Assistant',
    description: 'AI 助手的标题（显示在弹窗头部和侧边栏）'
  },
  {
    name: 'modalSize',
    label: '弹窗尺寸',
    type: 'json' as const,
    default: '{"width": "400px", "height": "500px"}',
    description: '小弹窗的宽度和高度（JSON 格式：{"width": "400px", "height": "500px"}）'
  },
  {
    name: 'triggerPosition',
    label: '触发按钮位置',
    type: 'select' as const,
    default: 'bottom-right' as const,
    description: '浮动触发按钮的位置',
    options: [
      { value: 'bottom-right', label: '右下角' },
      { value: 'bottom-left', label: '左下角' },
      { value: 'top-right', label: '右上角' },
      { value: 'top-left', label: '左上角' }
    ]
  },
  {
    name: 'showExpandButton',
    label: '显示放大按钮',
    type: 'boolean' as const,
    default: true,
    description: '是否在弹窗标题栏显示放大按钮'
  },
  {
    name: 'showAgentSelect',
    label: '显示 Agent 选择器',
    type: 'boolean' as const,
    default: false,
    description: '在弹窗标题栏显示 Agent 切换下拉列表'
  }
]

export const aiModalDefaultProps = {
  runtimePreset: 'opencode' as RuntimePreset,
  title: 'AI Assistant',
  modalSize: { width: '500px', height: '600px' },
  triggerPosition: 'bottom-right' as const,
  showExpandButton: true,
  showAgentSelect: false
}

const renderAIModalPreview = (props: Record<string, any>) => {
  const runtimePreset = props.runtimePreset || 'opencode'
  

  // 内部组件：在 AgentUIProvider 内调用 hooks
  const AIModalContent: React.FC = () => {
    // 始终无条件调用所有 hooks
    const opencodeRuntime = useOpenCodeRuntime({
      baseUrl: props.baseUrl || 'http://localhost:4096',
    })
    // useAgentRuntime 从 AgentUIContext 读取 agentId
    const agentRuntime = useAgentRuntime()

    let runtime: AssistantRuntime | null = null
    switch (runtimePreset) {
      case 'opencode':
        runtime = opencodeRuntime
        break
      case 'agent':
      case 'agent-interactable':
        runtime = agentRuntime
        break
    }

    // 解析 modalSize JSON
    let modalSize = { width: '400px', height: '500px' }
    if (props.modalSize) {
      try {
        modalSize = typeof props.modalSize === 'string'
          ? JSON.parse(props.modalSize)
          : props.modalSize
      } catch (e) {
        modalSize = { width: '400px', height: '500px' }
      }
    }

    if (!runtime) {
      return (
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-md bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">需要配置 Runtime</h3>
            <p className="text-sm text-slate-600 mb-4">
              当前选择的 Runtime 类型需要手动配置，请选择 OpenCode Runtime 以查看预览。
            </p>
            <div className="bg-slate-50 rounded-lg p-4 text-left">
              <p className="text-xs font-medium text-slate-700 mb-1">当前选择：</p>
              <p className="text-sm text-slate-800">{runtimePreset}</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <AIModal
        runtime={runtime}
        showAgentSelect={props.showAgentSelect}
        title={props.title || 'AI Assistant'}
        modalSize={modalSize}
        triggerPosition={props.triggerPosition || 'bottom-right'}
        showExpandButton={props.showExpandButton !== false}
      />
    )
  }

  return (
    
      <AIModalContent />
    
  )
}

const renderAIModalCodePreview = (props: Record<string, any>) => {
  const runtimePreset = props.runtimePreset || 'opencode'

  let runtimeCode = ''

  switch (runtimePreset) {
    case 'opencode':
      runtimeCode = `import { useOpenCodeRuntime } from "@assistant-ui/react-opencode"

const runtime = useOpenCodeRuntime({
  baseUrl: "http://localhost:4096",
})`
      break
    case 'openai':
      runtimeCode = `import { useChatModelRuntime } from "@assistant-ui/react"

const runtime = useChatModelRuntime({
  initialMessages: [
    {
      role: "system",
      content: "You are a helpful AI assistant."
    }
  ],
  streamOptions: {
    api: "/api/chat/openai"
  }
})`
      break
    case 'vercel':
      runtimeCode = `import { useChatRuntime } from "@assistant-ui/react"
import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

const runtime = useChatRuntime({
  streamOptions: async (messages) => {
    const result = await streamText({
      model: createOpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })("gpt-4-turbo"),
      messages
    })
    return result.toDataStream()
  }
})`
      break
    case 'custom':
      runtimeCode = `import { createCustomRuntime } from "@assistant-ui/react"

const runtime = createCustomRuntime({
  initialState: {
    messages: [
      {
        role: "system",
        content: "You are a helpful AI assistant."
      }
    ]
  },
  onSendMessage: async (messages) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    })
    return response.body
  }
})`
      break
  }

  // 解析 modalSize
  let modalSizeCode = ''
  if (props.modalSize && props.modalSize !== '{"width": "400px", "height": "500px"}') {
    try {
      const size = typeof props.modalSize === 'string' ? JSON.parse(props.modalSize) : props.modalSize
      modalSizeCode = `\n  modalSize={{ width: "${size.width}", height: "${size.height}" }}`
    } catch (e) {}
  }

  const additionalProps = []
  if (props.title && props.title !== 'AI Assistant') {
    additionalProps.push(`title="${props.title}"`)
  }
  if (props.triggerPosition !== 'bottom-right') {
    additionalProps.push(`triggerPosition="${props.triggerPosition}"`)
  }
  if (!props.showExpandButton) {
    additionalProps.push(`showExpandButton={false}`)
  }

  const propsStr = additionalProps.length > 0
    ? '\n  ' + additionalProps.join('\n  ')
    : ''

  // 对于 agent preset，添加 AgentUIProvider 包装
  const wrapperCode = (runtimePreset === 'agent' || runtimePreset === 'agent-interactable')
    ? `\n\n\n`
    : ''

  const providerWrap = (runtimePreset === 'agent' || runtimePreset === 'agent-interactable')
    ? `\n  `
    : ''

  const providerClose = (runtimePreset === 'agent' || runtimePreset === 'agent-interactable')
    ? `\n`
    : ''

  return `import { AIModal } from '@/registry/components/ai-modal/ai-modal'
${wrapperCode}${runtimeCode}

const MyAIModal = () => {
  return (
${providerWrap}<AIModal runtime={runtime}${propsStr}${modalSizeCode} />
${providerClose}
  )
}`
}

const renderAIModalCustomForm = (props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
  const runtimePreset = props.runtimePreset || 'opencode'

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-slate-700 mb-2">
          💡 Runtime 类型说明
        </p>
        <div className="text-sm text-slate-600 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2 rounded">
              <p className="font-medium">OpenCode Runtime</p>
              <p className="text-slate-500">使用 OpenCode 服务，适合代码生成场景</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="font-medium">OpenAI Runtime</p>
              <p className="text-slate-500">直接调用 OpenAI API</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="font-medium">Vercel AI SDK</p>
              <p className="text-slate-500">使用 Vercel AI SDK 集成</p>
            </div>
            <div className="bg-white p-2 rounded">
              <p className="font-medium">自定义 Runtime</p>
              <p className="text-slate-500">完全自定义的 runtime 实现</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm font-medium text-green-800 mb-2">
          🎯 状态继承说明
        </p>
        <p className="text-xs text-green-700">
          点击放大按钮打开全屏 Dialog 时，会完全继承小弹窗的对话状态和交互信息。
          这是通过共享同一个 <code className="px-1 bg-white rounded">AssistantRuntime</code> 实例实现的。
        </p>
      </div>

      {runtimePreset === 'opencode' && (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm font-medium text-amber-800 mb-2">
            ⚠️ OpenCode Runtime 注意事项
          </p>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• 确保 OpenCode 服务正在运行</li>
            <li>• 默认端口为 4096</li>
            <li>• baseUrl 应指向 OpenCode 服务的地址</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export const aiModalConfig: ComponentConfig = {
  id: 'ai-modal',
  name: 'AI 弹窗助手',
  propsConfig: aiModalPropsConfig,
  defaultProps: aiModalDefaultProps,
  renderPreview: renderAIModalPreview,
  renderCodePreview: renderAIModalCodePreview,
  renderCustomForm: renderAIModalCustomForm,
  documentation: documentationMd
}
