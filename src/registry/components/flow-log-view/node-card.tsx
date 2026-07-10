import React, { useEffect, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Card } from '@/components/ui/card'
import { Trash2, Copy } from 'lucide-react'
import flowNodes from '@/registry/lib/flow-nodes'

type NodeType = 'default' | 'input' | 'output'

interface HeadStyle {
  background?: string
  color?: string
  [key: string]: any
}

interface CardProps {
  headStyle?: HeadStyle
  style?: React.CSSProperties
  [key: string]: any
}

interface UpdateSelectedElements {
  (elements: any[]): void
  [key: string]: any
}

interface FlowContextType {
  updateSelectedElements: UpdateSelectedElements
  [key: string]: any
}

interface NodeTemplateProps {
  id: string
  title?: string
  nodeType?: NodeType
  selected?: boolean
  onElementsRemove?: (elements: any[]) => void
  onElementsCopy?: (props: NodeTemplateProps, updateSelectedElements: UpdateSelectedElements) => void
  cardProps?: CardProps
  type?: string
  titleIcon?: string
  extraChildren?: React.ReactNode
  children?: React.ReactNode
  icon?: React.ReactNode
}

const getClassName = (category: string[] | string | undefined): string | undefined => {
  if (category === undefined || (Array.isArray(category) && category.length === 0)) return

  let c: string
  if (Array.isArray(category)) {
    c = category[category.length - 1]
    if (category[0] == '高级节点') c = category[0]
  } else {
    c = category
  }

  switch (c) {
    case '系统操作节点':
      return 'systemOpt'
    case '业务数据节点':
      return 'businessData'
    case '起始高级节点':
      return 'start-high-level'
    case '表处理节点':
      return 'exTableRecord'
    case '媒体库处理节点':
      return 'exTableRecord'
    case '读取缓存数据':
      return 'exTableRecord'
    case '全局变量处理节点':
      return 'systemVariable'
    case '资产属性处理节点':
      return 'nodeAttribute'
    case '数据节点':
      return 'data'
    case '其他节点':
      return 'other'
    case '人工节点':
      return 'artificial'
    case '高级节点':
      return 'high-level'
    case '网关':
      return 'gateway'
    case '通知':
      return 'notification'
    default:
      return 'systemOpt'
  }
}

interface NodeTemplateComponentProps extends NodeTemplateProps {
  flowContext?: FlowContextType
}

const NodeTemplate: React.FC<NodeTemplateComponentProps> = (props) => {
  const {
    id,
    title,
    nodeType = 'default',
    selected,
    cardProps,
    type,
    extraChildren,
    icon,
    onElementsRemove,
    onElementsCopy,
    flowContext
  } = props

  const [isHovered, setIsHovered] = useState(false)

  const category = flowNodes[type || '']?.category
  const headStyle = cardProps?.headStyle || {}

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onElementsRemove) {
      onElementsRemove([{ id }])
    }
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onElementsCopy && flowContext) {
      onElementsCopy(props, flowContext.updateSelectedElements)
    }
  }

  const titleRender = (
    <div className="flex items-center gap-2 react-flow-card-title">
      {icon}
      <span className='m-r-2'>{title}</span>
    </div>
  )

  useEffect(() => {
    const cardContainer = document.querySelector(`.card-content-${id}`)
    const handleMouseWheel = (e: Event) => {
      e.stopPropagation()
    }
    cardContainer?.addEventListener('wheel', handleMouseWheel)
    return () => {
      cardContainer?.removeEventListener('wheel', handleMouseWheel)
    }
  }, [id])

  return (
    <div
      className="react-flow-card-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`react-flow-card react-flow-card-${getClassName(category)} hover:shadow-md rounded max-w-78 py-0 gap-0 rounded-t-lg`}
        style={{
          ...(cardProps?.style || {}),
          ...(selected ? { boxShadow: `0 0 3px 3px ${headStyle?.background || '#4971E0'}` } : {}),
        }}
      >
        {/* Card Header */}
        <div
          className="px-3 py-2 flex justify-between items-center rounded-t-lg border-0 relative"
          style={headStyle}
        >
          <div className="text-sm font-medium">{titleRender}</div>
          {(isHovered || selected) && (
            <div className="flex gap-1 pointer-events-none">
              {onElementsCopy && (
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-white/20 rounded transition-colors pointer-events-auto"
                  title="复制节点"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
              {onElementsRemove && (
                <button
                  onClick={handleRemove}
                  className="p-1 hover:bg-white/20 rounded transition-colors pointer-events-auto"
                  title="删除节点"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Card Body */}
        <div
          className={`react-flow-card-content card-content-${id} max-w-78 min-w-50 min-h-12 max-h-30 overflow-auto p-3`}
        >
          {extraChildren ? (
            <>
              {extraChildren}
              <br />
            </>
          ) : null}
          {props.children}
        </div>

      {/* Handles */}
      <div className="flow-gateway-rhombus">
        {nodeType == 'default' || nodeType == 'output' ? (
          <Handle type="target" position={Position.Top} className="!w-4 !h-4 rounded-6 !bg-[rgb(31_203_46)] !-top-2" />
        ) : null}

        {nodeType == 'default' || nodeType == 'input' ? (
          <Handle type="source" position={Position.Bottom} className="!w-4 !h-4 rounded-6 !bg-[#6991FF] !-bottom-2" />
        ) : null}
      </div>
    </Card>
    </div>
  )
}

const EndNode: React.FC<NodeTemplateComponentProps> = (props) => {
  return (
    <div className="flow-gateway-rhombus w-50 h-20 bg-[rgb(170_170_170)] rounded text-3 text-white flex justify-center items-center relative">
      <Handle type="target" position={Position.Top} className="!w-4 !h-4 rounded-[25px] !bg-[rgb(31_203_46)] !-top-2" />
      结束
    </div>
  )
}

const FlowIteratorEndNode: React.FC<NodeTemplateComponentProps> = (props) => {
  return (
    <div className="w-[100px] h-[46px] border border-[rgb(170_170_170)] rounded-[5px] text-[18px] text-[rgb(170_170_170)] flex justify-center items-center relative flow-gateway-rhombus">
      <Handle type="target" position={Position.Top} className="!w-4 !h-4 rounded-[25px] !bg-[rgb(31_203_46)] !-top-2" />
      迭代结束
      <Handle type="source" position={Position.Bottom} className="!w-4 !h-4 rounded-[25px] !bg-[#6991FF] !-bottom-2" />
    </div>
  )
}

const GatewayEndNode: React.FC<NodeTemplateComponentProps> = (props) => {
  return (
    <div className="w-[100px] h-[46px] border border-[rgb(170_170_170)] rounded-[5px] text-[18px] text-[rgb(170_170_170)] flex justify-center items-center relative flow-gateway-rhombus">
      <Handle type="target" position={Position.Top} className="!w-4 !h-4 rounded-[25px] !bg-[rgb(31_203_46)] !-top-2" />
      分支结束
      <Handle type="source" position={Position.Bottom} className="!w-4 !h-4 rounded-[25px] !bg-[#6991FF] !-bottom-2" />
    </div>
  )
}


const GatewayNode = ({ id }: { id: string }) => {

  return (
    <div className="w-13 h-13 rotate-45 bg-lightslategrey flex items-center justify-center text-[#faebd7] bg-[#789]">
      <div className="w-full h-full rotate-315 flex items-center justify-center !text-[38px]">
        <Handle type="target" position={Position.Top} className="!w-4 !h-4 rounded-[25px] !bg-[rgb(31_203_46)] !-top-4 z-5" />
        +
        <Handle type="source" position={Position.Bottom} className="!w-4 !h-4 rounded-[25px] !bg-[#6991FF] !-bottom-3" />
      </div>
    </div>
  )
}


export { NodeTemplate, EndNode, FlowIteratorEndNode, GatewayEndNode, GatewayNode }
export type { NodeTemplateProps, FlowContextType }
