import React from 'react'
import { FlowLog } from './flow-log'
import { ComponentConfig } from '@/app/config/types'

export const flowLogPropsConfig = [
  {
    name: 'task',
    label: '任务对象',
    type: 'object' as const,
    description: '包含 jobKey、bpmnProcessId 和 variables 的任务对象'
  },
  {
    name: 'taskId',
    label: '任务ID',
    type: 'text' as const,
    default: '69bd19c3bf3253cef853b366',
    description: '流程任务ID，用于自动获取任务数据'
  },
  {
    name: 'jobs',
    label: '日志数据',
    type: 'array' as const,
    description: '流程执行日志数组'
  }
]

export const flowLogDefaultProps = {
  taskId: '69bd19c3bf3253cef853b366'
}

interface LogRender {
  variables: any
}

const renderFlowLogPreview = (props: Record<string, any>) => {
  const Log = ({variables}: LogRender) => {
    return <span>执行结果：{JSON.stringify(variables || {}, null, 2)}</span>
  }
  return (
    <div className="h-full flex items-center justify-center p-4 overflow-auto">
      <div className="w-full max-w-4xl">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <div className="space-y-6">
            {/* 标题 */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">FlowLog 流程日志组件</h3>
              <p className="text-sm text-muted-foreground">显示流程执行日志的时间线视图</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">📋 当前配置：</p>
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <strong>任务ID：</strong>
                  <code className="ml-2 px-2 py-1 bg-white dark:bg-slate-900 rounded">
                    {props.taskId || props.task?.jobKey || '-'}
                  </code>
                </div>
                <div>
                  <strong>流程ID：</strong>
                  <code className="ml-2 px-2 py-1 bg-white dark:bg-slate-900 rounded">
                    {props.task?.bpmnProcessId?.id || '-'}
                  </code>
                </div>
                <div>
                  <strong>日志数量：</strong>
                  <span className="ml-2">{props.jobs?.length || 0} 条</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                📖 使用说明
              </p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• 显示流程执行的时间线，包含各个节点的状态</li>
                <li>• 支持通过 task 对象或 taskId 传入任务信息</li>
                <li>• 可直接传入 jobs 数组显示日志，或通过 taskId 自动获取</li>
                <li>• 自动解析节点类型、操作人和操作内容</li>
                <li>• 支持显示审批、填写、触发等各类流程节点</li>
              </ul>
            </div>

            {/* 组件预览 */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">组件预览：</p>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900">
                <FlowLog
                  task={props.task}
                  taskId={props.taskId}
                  jobs={props.jobs}
                  logNodeRenderMap={{ script: Log }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const renderFlowLogCodePreview = (props: Record<string, any>) => {
  let code = `import { FlowLog } from '@/registry/components/flow-log/flow-log'

const MyFlowLog = () => {
  const task = {
    jobKey: '${props.task?.jobKey || 'job_001'}',
    bpmnProcessId: {
      id: '${props.task?.bpmnProcessId?.id || 'process_123'}'
    },
    variables: {
      startTimestamp: Date.now() - 86400000
    }
  }

  const jobs = [
    // 日志数据...
  ]

  return (
    <FlowLog
      task={task}
      jobs={jobs}
    />
  )
}`

  return code
}

export const flowLogConfig: ComponentConfig = {
  id: 'flow-log',
  name: '流程日志',
  category: 'view',
  propsConfig: flowLogPropsConfig,
  defaultProps: flowLogDefaultProps,
  renderPreview: renderFlowLogPreview,
  renderCodePreview: renderFlowLogCodePreview
}
