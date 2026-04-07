import React, { useState, useRef } from 'react'
import { CheckCircle, PlayCircle, AlertCircle, MinusCircle, Clock } from 'lucide-react'
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
} from 'react-flow-renderer'
import { createAPI } from '@airiot/client'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'
import isPlainObject from 'lodash/isPlainObject'
import { NodeTemplate, EndNode, FlowIteratorEndNode, GatewayEndNode, GatewayNode } from './node-card'
import { GatewayEdge, IteratorEdgeLoop, GatewayDefaultEdge } from './edges'
import flowNodes, { iconMap } from '@/registry/lib/flow-nodes'
import dayjs from 'dayjs'
import { getFlowData, uuid, getIsStartNode } from '@/registry/lib/flow-log-utils'
import { Table } from 'lucide-react'

// 类型定义
interface FlowElementData {
  name?: string
  eventRange?: string
  [key: string]: unknown
}

interface FlowElementStyle {
  strokeWidth?: number
  [key: string]: unknown
}

interface FlowElement {
  id: string
  type?: string
  position?: { x: number; y: number }
  data?: FlowElementData
  elementId?: string
  elementData?: any
  source?: string
  target?: string
  style?: FlowElementStyle
  animated?: boolean
  isLoop?: boolean
  iteratorNodeId?: string
  arrowHeadType?: string
  setting?: FlowElementSetting
  variables?: FlowVariables
  status?: string
  timestamp?: number
  startTimestamp?: number
  config?: string
  paramSchema?: Record<string, unknown>
  title?: string
  titleIcon?: string
  category?: string[]
  [key: string]: unknown
}

interface FlowElementSetting {
  branch?: BranchItem[]
  table?: { title?: string; name?: string; id?: string }
  tableName?: string
  commandType?: string
  command?: { name?: string }
  approveType?: string
  revertConfig?: { revertScope?: { id?: string; name?: string }[] }
  approvalReason?: string
  url?: string
  method?: string
  opKeyLabel?: string
  serverName?: string
  warning_type?: string
  majorType?: string
  dataPoint?: Array<{ tableData?: { name?: string; id?: string } }>
  cmdStatus?: string
  [key: string]: unknown
}

interface BranchItem {
  logic?: boolean
  conditionText?: string
  elementId?: string
  condition?: { value?: unknown[] }
  [key: string]: unknown
}

interface FlowVariables {
  agreeUser?: Array<{ id?: string; name?: string; ['#$user']?: { id?: string; name?: string } }>
  disagreeUser?: Array<{ id?: string; name?: string; ['#$user']?: { id?: string; name?: string } }>
  revertUser?: Array<{ id?: string; name?: string; ['#$user']?: { id?: string; name?: string } }>
  ccUser?: Array<{ ['#$user']?: { name?: string } }>
  assignees?: { ['#$user']?: { id?: string; name?: string } }
  tableDataIds?: string[]
  command?: { params?: Record<string, unknown>; name?: string; form?: { type?: string; select?: { enum?: unknown[]; enum_title?: unknown[] }; select2?: { enum?: unknown[]; enum_title?: unknown[] }; tableValue?: unknown }; formSchema?: { schema?: { properties?: { arr?: { items?: { schema?: unknown } } } } } }
  fields?: Array<{ key?: string; value?: unknown }>
  selectType?: string
  phone?: string
  email?: string
  users?: Array<{ ['#$user']?: { name?: string } }>
  title?: string
  code?: string
  content?: string
  revertScope?: string
  revertMessage?: string
  approvalStatus?: string
  desc?: string
  url?: string
  host?: string
  untilTime?: string
  interval?: string
  cmdName?: string
  extFlowType?: string
  creatorName?: string
  modifyUser?: { name?: string }
  fillinUser?: Array<{ name?: string } | string>
  approvalReasonList?: Array<{ id?: string; name?: string; approvalReason?: string; time?: string | number }>
  __mock__?: boolean
  ['#$table']?: { id?: string; title?: string }
  ['#$tableData']?: { id?: string; name?: string; _tableName?: string }
  ['#$user']?: { name?: string; id?: string }
  ['#startTimestamp']?: number
  [key: string]: unknown
}

interface FlowRecord {
  id: string
  type: string
  flowId?: string
  elementId: string
  status?: string
  variables?: FlowVariables
  startTimestamp?: number
  config?: string
  setting?: FlowElementSetting
  [key: string]: unknown
}

interface BpmnProcessId {
  id: string
  [key: string]: unknown
}

interface TaskVariables {
  '#startTimestamp'?: number
  [key: string]: unknown
}

interface TaskProps {
  jobKey: string
  bpmnProcessId: BpmnProcessId
  variables: TaskVariables
}

interface RecordViewProps {
  taskId?: string
  task?: TaskProps
  jobs?: FlowRecord[]
  logNodeRenderMap?: LogNodeRenderMap
}

interface GatewayPanelProps {
  selected?: boolean
  data?: GatewayData
  branch?: {
    logic?: boolean
    conditionText?: string
    condition?: {
      value?: ConditionValue[]
    }
  }
}

interface GatewayData {
  type?: string
  condition?: {
    value?: ConditionValue[]
  }
  logicalCondition?: {
    length?: number
  }
  [key: string]: unknown
}

type ConditionValue = string | { name?: string }

interface LogNodeRenderMap {
  [key: string]: string | React.ReactNode
}

const initEnd: FlowElement = {
  category: [],
  key: 'flowEnd',
  position: { x: 660, y: 670 },
  paramSchema: {},
  title: '结束',
  type: 'flowEnd',
  id: '',
}

const onVersion = (oldElements?: FlowElement[]): FlowElement[] => {
  if (!oldElements) return []

  let newElements: FlowElement[] = []
  let hasEnd = false

  oldElements.map((els) => {
    if (els.type == 'flowEnd') hasEnd = true
    if (els.type == '资产或模型事件') {
      const nels = { ...els, type: els?.data?.eventRange == 'model' ? '模型事件' : '资产事件' }
      newElements.push(nels)
    } else {
      newElements.push(els)
    }
  })

  if (!hasEnd) {
    newElements.push({ ...initEnd, id: uuid(8, 16) } as FlowElement)
  }

  return newElements
}

const formatEls = (els?: FlowElement[]): FlowElement[] => {
  const convertInitEls = onVersion(els)
  const initValue = convertInitEls && convertInitEls.length > 0 ? convertInitEls : [{ ...initEnd, id: uuid(8, 16) }] as FlowElement[]
  let newEls: FlowElement[] = []

  initValue?.map((el) => {
    if (el.type == 'defaultEdge') {
      newEls = newEls.concat({ ...el, style: { strokeWidth: 3 }, type: 'smoothstep', animated: true })
    } else if (el.type == 'flowIteratorEnd') {
      const edge: FlowElement = {
        source: el.id,
        target: el.id.slice(0, -4),
        id: `${el.id.slice(0, -4)}-${el.id}`,
        animated: true,
        isLoop: true,
        type: 'iteratorEdgeLoop',
        iteratorNodeId: el.id.slice(0, -4),
        arrowHeadType: 'arrowclosed'
      }
      newEls = newEls.concat([el, edge])
    } else if (el.type == 'gatewayEnd') {
      const edge: FlowElement = {
        source: el.id.slice(0, -4),
        target: el.id,
        id: `${el.id}-${el.id.slice(0, -4)}`,
        animated: true,
        type: 'gatewayDefaultEdge',
      }
      newEls = newEls.concat([el, edge])
    } else {
      newEls = newEls.concat(el)
    }
  })
  return newEls
}

const GatewayPanelRender: React.FC<GatewayPanelProps> = ({ selected, data, branch }) => {
  const condition = data?.condition
  let hasCondition = branch?.logic

  const cond = data?.type == 'logical' ? branch?.conditionText : condition?.value?.map((v: ConditionValue) => isPlainObject(v) ? (v as { name?: string }).name : v)?.join('') || ''

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`w-[100px] max-h-[76px] rounded-[5px] relative text-white text-center react-flow-card border p-[2px] overflow-hidden break-all ${hasCondition ? 'bg-[rgb(31_203_46)]' : 'bg-[#aaa]'} ${selected ? 'border-[#778899]' : 'border-transparent'} line-clamp-3 [-webkit-line-clamp:3] [-webkit-box-orient:vertical] [-webkit-box:vertical]`}>
            {cond || '条件'}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{cond || '无条件'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
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

interface FlowDataProps {
  record?: FlowRecord
  items?: FlowRecord[]
  logRender?: string | React.ReactNode
}

const FlowData: React.FC<FlowDataProps> = ({ record, items = [], logRender }) => {
  const item = items?.[0]
  const configs = (item?.config && JSON.parse(item.config)) || []
  const config = configs?.find((v: { id?: string }) => v.id == record?.elementId) || {}
  const setting = { ...(record?.setting || {}), taskFormSchema: config['taskFormSchema'] }
  return (
    <div className="break-words">
      {record && getFlowData({ ...record, setting }, items, logRender)}
    </div>
  )
}

const RecordView: React.FC<RecordViewProps> = ({ taskId, task, jobs, logNodeRenderMap }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [elements, setElements] = useState<FlowElement[]>([])
  const [jobData, setJobData] = useState<FlowRecord[]>([])
  const [loading, setLoading] = useState(false)

  const defaultZoom = 1

  React.useEffect(() => {
    (async () => {
      setLoading(true)
      let _jobs
      if (jobs?.length) {
        _jobs = jobs
      } else {
        const flowTaskApi = createAPI({ name: 'flow/flowTask' })
        const _task = !isEmpty(task) ? task : await flowTaskApi.get(taskId)
        _jobs = await fetchJobLogs(_task)
      }
      setJobData(_jobs)
      const jobEls = JSON.parse(_jobs?.[0]?.config || '[]') as FlowElement[]
      if (_jobs?.[0]?.variables?.__mock__ && jobEls?.some((j) => j.elementData)) {
        const initEls = jobEls?.map((el) => ({ ...omit(el, 'elementData'), ...el.elementData }))
        setElements(formatEls(initEls))
        setLoading(false)
      } else if (_jobs?.[0]?.flowId) {
        const flowDraftApi = createAPI({ name: 'flow/flowDraft' })
        flowDraftApi
          .query(
            { order: { createTime: 'DESC' }, limit: 1, filter: { flow: _jobs[0].flowId, createTime: { lte: _jobs[0].startTimestamp } } },
            {}
          )
          .then(({ items }: { items?: Array<{ flowDraft?: { elements?: FlowElement[] } }> }) => {
            const initEls = items?.[0]?.flowDraft?.elements?.filter((el: FlowElement) => jobEls?.find((f) => f.id == el.id))
            setElements(formatEls(initEls))
            setLoading(false)
          })
          .catch(() => setLoading(false))
      }
    })()
  }, [JSON.stringify({ task, jobs }), taskId])

interface LogCardProps {
  node: string
  data?: { name?: string }
  record: FlowRecord
  [key: string]: unknown
}

  const LogCard: React.FC<LogCardProps> = (props) => {
    const node = flowNodes[props.node]
    const isStart = getIsStartNode(node)
    const cardProps = { headStyle: { ...(node?.style || {}), color: '#FFF' } }
    const index = jobs?.findIndex((r) => r.id == props.record.id) || 0
    const Icon = iconMap[props.node] || Table

    return (
      <NodeTemplate
        {...props}
        id={props.record.id}
        nodeType={isStart ? 'input' : 'default'}
        title={props.data?.name || node?.title}
        cardProps={cardProps}
        icon={<Icon className='w-5 h-5' />}
      >
        <FlowData record={props.record} items={jobs?.slice(0, index)} logRender={logNodeRenderMap?.[props.node]} />
      </NodeTemplate>
    )
  }

  const StatusTag: React.FC<{ status: string }> = ({ status }) => {
    const statusConfig: Record<string, { icon: React.ReactNode; variant: string; label: string }> = {
      COMPLETED: {
        icon: <CheckCircle className="w-3 h-3" />,
        variant: 'success',
        label: '已完成'
      },
      CREATED: {
        icon: <PlayCircle className="w-3 h-3" />,
        variant: 'default',
        label: '进行中'
      },
      FAILED: {
        icon: <AlertCircle className="w-3 h-3" />,
        variant: 'destructive',
        label: '失败'
      },
      INTERRUPT: {
        icon: <MinusCircle className="w-3 h-3" />,
        variant: 'secondary',
        label: '已终止'
      },
      default: {
        icon: <Clock className="w-3 h-3" />,
        variant: 'secondary',
        label: '未处理'
      }
    }

    const config = statusConfig[status] || statusConfig.default

    return (
      <Badge variant={config.variant as 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'outline' | 'destructive'} size="sm" className="gap-1">
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const nodeTypes = React.useMemo(() => {
    const types: Record<string, any> = {}

    Object.keys(flowNodes).forEach((node) => {
      const nodeConfig = flowNodes[node]
      const paramSchema = {}
      const _node = flowNodes[node]
      const isStart = getIsStartNode(_node)
      const RenderEndNode = node == 'flowEnd' ? EndNode : node == 'flowIteratorEnd' ? FlowIteratorEndNode : node == 'gatewayEnd' ? GatewayEndNode : null
      const RenderNode = node == 'gateway' ? GatewayNode : RenderEndNode

      types[node] = (props: any) => {
        const record = jobData?.find((r) => r.elementId == props.id)

        const useLogCard =
          record &&
          record.status != 'CREATED' &&
          node != 'gateway' &&
          !['gatewayEnd', 'flowIteratorEnd', 'flowWhileEnd'].includes(node)

        const Type = () => (
          useLogCard ? null :
          <>
            <br />
            <span>节点类型: </span>
            <span>{_node?.title || ''}</span>
          </>
        )

        const extraChildren = React.createElement(
          React.Fragment,
          null,
          React.createElement('span', null, '状态: '),
          React.createElement(StatusTag, { status: record?.status || 'default' }),
          React.createElement(Type, null)
        )

        if (useLogCard) {
          return React.createElement(
            (RenderNode || LogCard) as React.ComponentType<any>,
            { ...props, node, editable: false, paramSchema, layout: 'horizontal', record, extraChildren }
          )
        }

        const headStyle = { ...(nodeConfig?.style || {}), color: '#FFF' }
        const Icon = iconMap[node]

        return React.createElement(
          RenderNode || NodeTemplate,
          {
            ...props,
            nodeType: isStart ? 'input' : node == 'flowEnd' ? 'output' : 'default',
            title: props.data?.name || nodeConfig?.title || node,
            titleIcon: nodeConfig?.title,
            cardProps: { headStyle },
            extraChildren,
            icon: <Icon className='w-5 h-5' />
          }
        )
      }
    })

    return types
  }, [jobData])

  const edgeTypes = {
    gatewayEdge: (props: React.ComponentProps<typeof GatewayEdge>) => {
      const isLoop = elements.find((el) => el.id == props.id)?.isLoop
      const branch = jobData?.find((el) => el.elementId == props.source)?.setting?.branch?.find((b) => b.elementId == props.target)
      return (
        <GatewayEdge
          {...props}
          animated={true}
          pathType='smoothStep'
          isLoop={isLoop}
          gatewayPanelRender={(p: GatewayPanelProps) => <GatewayPanelRender {...p} branch={branch as any} />}
        />
      )
    },
    iteratorEdgeLoop: (props: React.ComponentProps<typeof IteratorEdgeLoop>) => {
      return <IteratorEdgeLoop {...props} pathType='smoothStep' />
    },
    gatewayDefaultEdge: (props: React.ComponentProps<typeof GatewayDefaultEdge>) => {
      const logic = !jobs?.find((el) => el.elementId == props.source)?.setting?.branch?.some((b) => b.logic)
      return <GatewayDefaultEdge {...props} logic={logic} pathType='smoothStep' />
    },
  }

  // 将 elements 分离为 nodes 和 edges
  const nodes = elements.filter((el) => !el.source && !el.target) as any
  const edges = elements.filter((el) => el.source && el.target).map(el => el.type == 'iteratorEdgeLoop' ? { ...el, markerEnd: { type: 'arrowclosed' } } : { ...el, animated: true }) as any

  return (
    <ReactFlowProvider>
      <div className='h-full'>
        <div className="h-full flex flex-col relative">
          <div className="h-full w-full grow absolute z-[2]" ref={reactFlowWrapper}>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Spinner className="h-8 w-8" />
              </div>
            ) : (
              <ReactFlow
                defaultZoom={defaultZoom}
                fitView={true}
                nodes={nodes}
                edges={edges}
                snapToGrid
                nodesDraggable={false}
                nodesConnectable={false}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                deleteKeyCode={null}
              >
                <div className="translate-x-[10px]">
                  <Controls />
                </div>
                <Background color="#aaa" gap={16} />
              </ReactFlow>
            )}
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  )
}

export { RecordView, RecordView as FlowLogView }
