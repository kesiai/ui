import React from 'react'
import { Assistant } from '@/registry/components/ai-agent/base'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './ai-agent.md?raw'
import { type AssistantRuntime } from "@assistant-ui/react";
import { useOpenCodeRuntime } from "@assistant-ui/react-opencode"
import { useAgentRuntime } from "./runtime";

// Runtime 预设类型定义
export type RuntimePreset = 'opencode' | 'openai' | 'vercel' | 'custom'

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
})`
}

export const aiAgentPropsConfig = [
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
      { value: 'openai', label: 'OpenAI Runtime' },
      { value: 'vercel', label: 'Vercel AI SDK' },
      { value: 'custom', label: '自定义 Runtime' }
    ]
  },
  {
    name: 'baseUrl',
    label: 'Base URL',
    type: 'text' as const,
    default: 'http://localhost:4096',
    placeholder: 'http://localhost:4096',
    description: 'OpenCode Runtime 的服务地址'
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
    name: 'systemPrompt',
    label: '系统提示词',
    type: 'text' as const,
    default: 'You are a helpful AI assistant.',
    description: 'AI 助手的系统提示词，用于定义助手的行为和角色'
  },
  {
    name: 'title',
    label: '侧边栏标题',
    type: 'text' as const,
    default: '',
    placeholder: 'Chat History',
    description: '侧边栏顶部的标题（留空则不显示）'
  },
  {
    name: 'showCodePreview',
    label: '显示代码预览',
    type: 'boolean' as const,
    default: true,
    description: '是否在配置中显示 runtime 代码预览'
  }
]

export const aiAgentDefaultProps = {
  runtimePreset: 'agent' as RuntimePreset,
  baseUrl: 'http://127.0.0.1:4096',
  agentId: '6a3a22aeecf2e81476c84246',
  systemPrompt: 'You are a helpful AI assistant.',
  title: '',
  showCodePreview: true
}

const renderAiAgentPreview = (props: Record<string, any>) => {
  const runtimePreset = props.runtimePreset || 'agent'

  // 始终无条件调用所有 hooks 以遵守 Rules of Hooks，
  // 然后根据 runtimePreset 选择使用哪个 runtime
  const opencodeRuntime = useOpenCodeRuntime({
    baseUrl: props.baseUrl || 'http://127.0.0.1:4096',
  })
  const agentRuntime = useAgentRuntime(props.agentId || 'your-agent-id')

  let runtime: AssistantRuntime | null = null
  switch (runtimePreset) {
    case 'opencode':
      runtime = opencodeRuntime
      break
    case 'agent':
      runtime = agentRuntime
      break
  }

  return (
    <div className="flex h-150 items-center justify-center p-4 bg-slate-50">
      <div className="w-full h-150 bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
        {runtime ? (
          <Assistant runtime={runtime} title={props.title || ''} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center overflow-auto">
            <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">AI Assistant 预览</h3>
            <p className="text-sm text-slate-600 mb-4 max-w-md">
              当前选择的 Runtime 类型: <strong>{runtimePreset}</strong>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl">
              <p className="text-sm font-medium text-blue-800 mb-2">📋 Runtime 配置代码：</p>
              <pre className="text-xs text-blue-700 bg-white p-3 rounded overflow-x-auto">
                {runtimePresetCodes[runtimePreset as RuntimePreset] || 'Unknown preset'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const renderAiAgentCodePreview = (props: Record<string, any>) => {
  const runtimePreset = props.runtimePreset || 'opencode'
  const baseUrl = props.baseUrl || 'http://localhost:4096'

  let runtimeCode = ''

  switch (runtimePreset) {
    case 'opencode':
      runtimeCode = `import { useOpenCodeRuntime } from "@assistant-ui/react-opencode"

const runtime = useOpenCodeRuntime({
  baseUrl: "${baseUrl}",
})`
      break
    case 'openai':
      runtimeCode = `import { useChatModelRuntime } from "@assistant-ui/react"

const runtime = useChatModelRuntime({
  initialMessages: [
    {
      role: "system",
      content: "${props.systemPrompt || 'You are a helpful AI assistant.'}"
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
      })("${props.model || 'gpt-4-turbo'}"),
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
        content: "${props.systemPrompt || 'You are a helpful AI assistant.'}"
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

  return `import { Assistant } from '@/registry/components/ai-agent/ai-agent'

${runtimeCode}

const MyAIAssistant = () => {
  return <Assistant runtime={runtime} ${props.title ? `title="${props.title}"` : ''} />
}`
}

const renderAiAgentCustomForm = (props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
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

      {props.showCodePreview && (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-2">
            📝 当前 Runtime 代码
          </p>
          <pre className="text-xs text-slate-700 bg-white p-3 rounded overflow-x-auto">
            {runtimePresetCodes[runtimePreset as RuntimePreset] || ''}
          </pre>
        </div>
      )}

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

export const aiAgentConfig: ComponentConfig = {
  id: 'ai-agent',
  name: 'AI 助手',
  propsConfig: aiAgentPropsConfig,
  defaultProps: aiAgentDefaultProps,
  renderPreview: renderAiAgentPreview,
  renderCodePreview: renderAiAgentCodePreview,
  renderCustomForm: renderAiAgentCustomForm,
  documentation: documentationMd
}
