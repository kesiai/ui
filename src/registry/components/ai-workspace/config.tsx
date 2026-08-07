import { AgentWorkspace } from '@/registry/components/ai-workspace/ai-workspace'
import { ComponentConfig } from '@/app/config/types'

export const aiWorkspacePropsConfig = [
  {
    name: 'mode',
    label: '模式',
    type: 'select' as const,
    default: 'agent',
    options: [
      { label: '智能体工作区', value: 'agent' },
      { label: '任务工作区', value: 'task' },
    ],
    description: 'agent 走 /eap/agents，task 走 /eap/tasks'
  },
  {
    name: 'agentId',
    label: '智能体',
    type: 'agent-id' as const,
    default: '',
    description: '选择智能体（模式为"智能体工作区"时生效）'
  },
  {
    name: 'taskId',
    label: '任务',
    type: 'task-id' as const,
    default: '',
    description: '选择任务（模式为"任务工作区"时生效）'
  },
]

export const aiWorkspaceDefaultProps = {
  mode: 'agent' as const,
  agentId: '',
  taskId: '',
}

const renderPreview = (props: Record<string, any>) => {
  const id = props.mode === 'task' ? props.taskId : props.agentId
  if (!id) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center gap-2">
        <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">AI 工作区</h3>
        <p className="text-sm text-slate-600 mb-4 max-w-md">
          请选择<strong>模式</strong>并<strong>{props.mode === 'task' ? '选择任务' : '选择智能体'}</strong>以查看工作区文件。
        </p>
      </div>
    )
  }

  return (
    <div className="h-120 w-full">
      <AgentWorkspace id={id} mode={props.mode || 'agent'} className="h-full" />
    </div>
  )
}

const renderCodePreview = (props: Record<string, any>) => {
  const id = props.mode === 'task' ? props.taskId : props.agentId
  return `import { AgentWorkspace } from '@/registry/components/ai-workspace/ai-workspace'

const MyWorkspace = () => {
  return (
    <AgentWorkspace
      id="${id || 'your-id'}"
      mode="${props.mode || 'agent'}"
    />
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
