import { TaskDetailPanel } from '@/registry/components/ai-task-panel/task-detail-panel'
import { ComponentConfig } from '@/app/config/types'

export const aiTaskPanelPropsConfig = [
  {
    name: 'showTaskDetail',
    label: '显示任务面板',
    type: 'boolean' as const,
    default: true,
    description: '是否显示任务详情面板（实际使用中由父组件决定）'
  },
  {
    name: 'taskId',
    label: '任务 ID',
    type: 'task-id' as const,
    default: '',
    description: '预览时直接指定任务；实际使用中由 assistant-ui 运行时（线程 id）提供'
  },
]

export const aiTaskPanelDefaultProps = {
  showTaskDetail: true,
  taskId: '',
}

export const aiTaskPanelConfig: ComponentConfig = {
  id: 'ai-task-panel',
  name: 'AI 任务面板',
  propsConfig: aiTaskPanelPropsConfig,
  defaultProps: aiTaskPanelDefaultProps,
  renderPreview: (props: Record<string, any>) => {
    if (!props.showTaskDetail) {
      return (
        <div className="h-120 flex items-center justify-center text-slate-400 text-sm">
          showTaskDetail=false，面板不渲染
        </div>
      )
    }

    if (!props.taskId) {
      return (
        <div className="h-120 w-full flex flex-col items-center justify-center p-8 text-center gap-2">
          <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">AI 任务面板</h3>
          <p className="text-sm text-slate-600 mb-4 max-w-md">
            请选择一个<strong>任务</strong>以查看任务详情。
          </p>
        </div>
      )
    }

    return (
      <div className="h-120 w-full border-l bg-background overflow-hidden">
        <TaskDetailPanel taskId={props.taskId} />
      </div>
    )
  },
  renderCodePreview: (props: Record<string, any>) => {
    return `import { TaskPanel } from '@/registry/components/ai-task-panel/ai-task-panel'

// 需在 assistant-ui 的 AssistantRuntimeProvider 内使用，
// taskId 由线程状态自动读取，无需手动传入。
const MyPage = () => {
  return (
    <div className="flex h-full">
      <main className="flex-1">内容区</main>
      <TaskPanel showTaskDetail={${props.showTaskDetail}} />
    </div>
  )
}`
  },
}

export default aiTaskPanelConfig
