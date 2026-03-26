import React from 'react'
import { FlowLogView } from './flow-log-view'
import { ComponentConfig } from '@/app/config/types'

export const flowLogViewPropsConfig = [
  {
    name: 'taskId',
    label: '任务ID',
    type: 'text' as const,
    default: '69bd19c3bf3253cef853b366',
    description: '流程任务ID'
  },
  {
    name: 'jobs',
    label: '流程记录',
    type: 'array' as const,
    description: '流程执行记录数组，包含 config、status、variables 等信息'
  }
]

export const flowLogViewDefaultProps = {
  taskId: '69bd19c3bf3253cef853b366'
}

const renderFlowLogViewPreview = (props: Record<string, any>) => {
  const Log = ({variables}: any) => {
    return <>执行结果：{JSON.stringify(variables || {})}</>
  }
  return (
    <div className="h-full w-full p-4">
      <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 mb-4">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">⚡ FlowLogView 流程图视图</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            基于 ReactFlow 的流程执行状态可视化组件
          </p>
        </div>
      </div>

      <div className="w-full h-100">
        <FlowLogView
          taskId={props.taskId}
          logNodeRenderMap={{ script: Log }}
        />
      </div>

      <div className="mt-6 space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">📖 使用说明</p>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• 基于 ReactFlow 渲染流程图，展示节点和连线关系</li>
            <li>• 自动显示每个节点的执行状态（已完成、进行中、失败等）</li>
            <li>• 支持网关、迭代器、循环等复杂流程结构</li>
            <li>• 可通过 FlowData 组件自定义节点详细数据展示</li>
            <li>• 支持缩放、拖拽等交互操作（只读模式）</li>
            <li>• 自动从 flowDraft API 获取流程定义</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2">⚠️ 注意事项</p>
          <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
            <li>• jobs 必须包含 config 字段（流程元素 JSON 字符串）</li>
            <li>• 每条记录应包含 elementId、status、variables 等字段</li>
            <li>• FlowData 组件接收 record 和 items 两个 props</li>
            <li>• 流程图默认以 fitView 模式自适应显示</li>
            <li>• 组件为只读模式，不支持编辑流程定义</li>
          </ul>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">📊 数据格式</p>
          <div className="text-xs text-green-800 dark:text-green-200 space-y-2">
            <div>
              <p className="font-medium mb-1">jobs 数组项结构：</p>
              <pre className="bg-white dark:bg-slate-900 p-2 rounded text-xs overflow-x-auto">
{`{
  id: string              // 记录ID
  flowId: string          // 流程ID
  elementId: string       // 节点ID
  status: 'COMPLETED' | 'CREATED' | 'FAILED' | 'INTERRUPT'
  config: string          // 流程元素JSON字符串
  variables?: object      // 节点变量
  startTimestamp?: number // 开始时间戳
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const renderFlowLogViewCodePreview = (props: Record<string, any>) => {
  const hasCustomItem = props.item?.flow?.zoom !== 1
  const hasJobs = props.jobs && props.jobs.length > 0

  const itemCode = hasCustomItem
    ? `  const item = {
    flow: {
      zoom: ${props.item?.flow?.zoom || 1}
    }
  }`
    : `  const item = {
    flow: {
      zoom: 1
    }
  }`

  const jobsCode = hasJobs
    ? `  const jobs: JobRecord[] = [
    {
      id: 'job_1',
      flowId: 'flow_001',
      elementId: 'node_start',
      status: 'COMPLETED',
      config: JSON.stringify([
        { id: 'node_start', type: 'start', position: { x: 100, y: 100 } }
      ]),
      variables: { startTimestamp: Date.now() }
    }
  ]`
    : `  const jobs: JobRecord[] = [
    // 流程记录数据...
  ]`

  const code = `import { FlowLogView } from '@/registry/components/flow-log-view'

interface JobRecord {
  id: string
  flowId: string
  elementId: string
  status: 'COMPLETED' | 'CREATED' | 'FAILED' | 'INTERRUPT'
  config: string
  variables?: Record<string, any>
  startTimestamp?: number
}

export default function MyFlowLogView() {
  const taskId = '${props.taskId || 'example_task_001'}'
${itemCode}

${jobsCode}

  // 可选：自定义节点数据渲染组件
  const FlowData = ({ record }: { record: JobRecord }) => {
    return (
      <div>
        <p>节点ID: {record.elementId}</p>
        <p>状态: {record.status}</p>
      </div>
    )
  }

  return (
    <FlowLogView
      taskId={taskId}
      item={item}
      jobs={jobs}
      FlowData={FlowData}
    />
  )
}`

  return code
}

const renderFlowLogViewCustomForm = () => {
  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">
        FlowLogView 配置说明
      </p>
      <div className="space-y-3">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          <p className="font-medium mb-1">基础属性</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><code>taskId</code> - 流程任务ID，用于标识特定的流程实例</li>
            <li><code>item</code> - 流程配置对象，包含 flow.zoom 等配置</li>
            <li><code>jobs</code> - 流程记录数组，每条记录包含节点执行信息</li>
            <li><code>FlowData</code> - 可选的自定义组件，用于渲染节点详细数据</li>
          </ul>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-300">
          <p className="font-medium mb-1">节点状态</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> 已完成 (COMPLETED)</span></li>
            <li><span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 进行中 (CREATED)</span></li>
            <li><span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> 失败 (FAILED)</span></li>
            <li><span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-500"></span> 已终止 (INTERRUPT)</span></li>
          </ul>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-300">
          <p className="font-medium mb-1">FlowData 组件</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>接收两个 props：<code>record</code> (当前节点记录) 和 <code>items</code> (所有前置记录)</li>
            <li>可以在组件中访问 record.variables、record.status 等数据</li>
            <li>用于自定义节点卡片的详细内容显示</li>
          </ul>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-300">
          <p className="font-medium mb-1">支持的节点类型</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>起始节点、结束节点</li>
            <li>任务节点、系统操作节点</li>
            <li>网关节点（条件分支）</li>
            <li>迭代器节点（循环）</li>
            <li>子流程节点</li>
          </ul>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-300">
          <p className="font-medium mb-1">交互功能</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>缩放：使用鼠标滚轮或控制面板按钮</li>
            <li>拖拽：按住鼠标左键拖动画布</li>
            <li>自适应：点击控制面板的 "Fit" 按钮</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export const flowLogViewConfig: ComponentConfig = {
  id: 'flow-log-view',
  name: 'FlowLogView 流程图视图',
  propsConfig: flowLogViewPropsConfig,
  defaultProps: flowLogViewDefaultProps,
  renderPreview: renderFlowLogViewPreview,
  renderCodePreview: renderFlowLogViewCodePreview,
  renderCustomForm: renderFlowLogViewCustomForm,
}
