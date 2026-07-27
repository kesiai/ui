import { AgentWorkspace } from '@/registry/components/ai-workspace/ai-workspace'
import { ComponentConfig } from '@/app/config/types'

export const aiWorkspacePropsConfig = [
  {
    name: 'agentId',
    label: 'Agent ID',
    type: 'agent-id' as const,
    default: '',
    description: '智能体 ID，用于加载对应的工作区文件'
  },
]

export const aiWorkspaceDefaultProps = {
  agentId: '',
}

const renderPreview = (props: Record<string, any>) => {
  if (!props.agentId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center gap-2">
        <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Agent Workspace</h3>
        <p className="text-sm text-slate-600 mb-4 max-w-md">
          请在属性配置中填入有效的 <strong>Agent ID</strong> 以查看工作区文件。
        </p>
      </div>
    )
  }

  return (
    <div className="h-120 w-full">
      <AgentWorkspace agentId={props.agentId} className="h-full" />
    </div>
  )
}

const renderCodePreview = (props: Record<string, any>) => {
  return `import { AgentWorkspace } from '@/registry/components/ai-workspace/ai-workspace'

const MyWorkspace = () => {
  return (
    <AgentWorkspace agentId="${props.agentId || 'your-agent-id'}" />
  )
}`
}

export const aiWorkspaceConfig: ComponentConfig = {
  id: 'ai-workspace',
  name: 'AI 工作区',
  propsConfig: aiWorkspacePropsConfig,
  defaultProps: aiWorkspaceDefaultProps,
  renderPreview,
  renderCodePreview,
}
