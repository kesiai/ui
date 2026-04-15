import React from 'react'
import dayjs from 'dayjs'
import isEmpty from 'lodash/isEmpty'
import { createAPI } from '@airiot/client'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Table } from 'lucide-react'
import { getNodeData, getFlowData, flowTypeMap } from '@/registry/lib/flow-log-utils'
import { iconMap } from '@/registry/lib/flow-nodes'

interface BpmnProcessId {
  id: string
  [key: string]: any
}

interface TaskVariables {
  startTimestamp?: number
  [key: string]: any
}

interface TaskProps {
  id: string
  jobKey: string
  bpmnProcessId: BpmnProcessId
  variables: TaskVariables
}

interface FlowRecord {
  id: string
  type: string
  flowId?: string
  elementId: string
  status?: string
  variables?: any
  startTimestamp?: number
  config?: string
  setting?: any
  [key: string]: any
}

interface LogNodeRenderMap {
  [key: string]: string | React.ReactNode
}

interface FlowLogProps {
  task?: TaskProps
  taskId?: string
  jobs?: FlowRecord[]
  logNodeRenderMap?: LogNodeRenderMap
}

const fetchJobLogs = async ({ jobKey, bpmnProcessId, variables }: TaskProps) => {
  try {
    const startTimestamp = variables['#startTimestamp']
    const filter = {
      flowJob: jobKey,
      flowid: bpmnProcessId.id,
      timestamp: {
        '$gte': startTimestamp ? dayjs(startTimestamp).format('YYYY-MM-DD HH:mm:ss') : null
      }
    }
    const jobLogApi = createAPI({ name: 'engine/log/job' })
    const { items = [] } = await jobLogApi.query({}, { filter })
    return items
  } catch (error) {
    return []
  }
}

const FlowLog: React.FC<FlowLogProps> = ({ task, taskId, jobs, logNodeRenderMap }) => {

  const [taskData, setTaskData] = React.useState<Record<string, any>>({})
  const [loading, setLoading] = React.useState(false)
  const [elements, setElements] = React.useState<FlowRecord[]>(jobs || [])

  React.useEffect(() => {
    (async () => {
      if (!isEmpty(task)) {
        setTaskData(task)
        setLoading(true)
        const els = jobs?.length ? jobs : await fetchJobLogs(task)
        setElements(els)
        setLoading(false)
      } else if (taskId) {
        setLoading(true)
        const flowTaskApi = createAPI({ name: 'flow/flowTask' })
        const task = await flowTaskApi.get(taskId)
        setTaskData(task)
        const els = jobs?.length ? jobs : await fetchJobLogs(task)
        setElements(els)
        setLoading(false)
      }
    })()
  }, [task?.id, taskId])

  const isValEmpty = (value: any) => value === null || value === undefined || Object.keys(value).length === 0

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <Spinner className="h-6 w-6" />
        </div>
      ) : isValEmpty(elements) ? (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          执行日志已被清除！
        </div>
      ) : (
        <div className="space-y-4">
          {elements && elements.map((el, i) => {
            const config = (elements?.[0]?.config && JSON.parse(elements[0].config)) || []
            const _setting = elements?.[i]?.setting
            const setting = !isValEmpty(_setting) ? _setting : config?.find((v: any) => v.id == el.elementId)?.['_config']
            const nodeInfo = getNodeData({ ...el, setting }, taskData, logNodeRenderMap?.[el.type]) || {}
            const content = ['flowUserFillin', 'flowUserApprove', 'flowUserCC'].includes(el.type)
              ? nodeInfo.content
              : getFlowData({ ...el, variables: { ...el.variables, __mock__: false }, setting }, undefined, logNodeRenderMap?.[el.type])

            const isCurrent = el?.job == taskData?.elementJob
            const currentIndex = elements.findIndex((item: any) => item?.job == taskData?.elementJob)
            const type = flowTypeMap[el.type] || el.type
            const TitleIcon = iconMap[type] || Table

            return (
              <div
                key={i}
                className={`relative ${i < currentIndex ? 'opacity-100' : i === currentIndex ? 'opacity-100' : 'opacity-50'}`}
              >
                {/* Timeline line */}
                {i < elements.length - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-border" />
                )}

                <div className="flex gap-4">
                  {/* Status icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : i < currentIndex
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground'
                      }`}>
                      {i < currentIndex ? '✓' : i + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{nodeInfo.title}</span>
                      {el.variables?.__mock__ && (
                        <Badge variant="warning" size="sm" className="ml-2">调试</Badge>
                      )}
                    </div>
                    <Card className="p-4 max-h-40 overflow-y-auto">
                      <div className="flex gap-3">
                        <TitleIcon className='w-5 h-5' />
                        <div className="flex-1 space-y-1">
                          {!taskData?.data?.approvalReasonList?.length && nodeInfo.user && (
                            <div className="text-sm">{nodeInfo.user}</div>
                          )}
                          {el.status !== 'CREATED' && !taskData?.data?.approvalReasonList?.length && (
                            <div className="text-sm text-muted-foreground">
                              于{dayjs(el.leaveTimestamp || el.timestamp).format('YYYY-MM-DD HH:mm:ss')}{nodeInfo.operation}
                            </div>
                          )}
                          <div className="text-sm">{content}</div>
                          {el.type === 'flowUserApprove' && el.variables?.approvalReason && !taskData?.data?.approvalReasonList?.length && (
                            <div className="text-sm text-muted-foreground mt-1">
                              审批原因: {el.variables.approvalReason}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export { FlowLog }
