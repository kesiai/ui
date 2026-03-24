import React from 'react'
import { X } from 'lucide-react'
import {
  getBezierPath,
  getSmoothStepPath,
  getEdgeCenter,
  getMarkerEnd,
  EdgeProps,
  MarkerType,
} from 'react-flow-renderer'

const foreignObjectSize = 100

interface Condition {
  value?: any[]
  [key: string]: any
}

interface LogicalCondition {
  length?: number
  [key: string]: any
}

interface GatewayData {
  condition?: Condition
  type?: string
  logicalCondition?: LogicalCondition
  [key: string]: any
}

interface NewGatewayPanelProps {
  id: string
  onElementsRemove: (elements: any[]) => void
  selected?: boolean
  data?: GatewayData
}

const NewGatewayPanel: React.FC<NewGatewayPanelProps> = ({ id, onElementsRemove, selected, data }) => {
  const condition = data?.condition
  let hasCondition = false

  if (data?.type == 'logical') {
    hasCondition = !!data?.logicalCondition?.length
  } else if (condition) {
    hasCondition = true
  }

  return (
    <div className={`w-10 h-10 rounded relative text-white text-center leading-[39px] react-flow-card border ${selected ? 'border-[#778899]' : 'border-transparent'} ${hasCondition ? 'bg-[rgb(31_203_46)]' : 'bg-[#aaa]'}`}>
      <div
        className='text-[lightslategrey] translate-x-[18px] card-remove-button'
        onClick={() => onElementsRemove([{ id }])}
      >
        <X className="w-4 h-4" />
      </div>
      {'条件'}
    </div>
  )
}

interface GatewayEdgeProps extends EdgeProps {
  data?: GatewayData
  arrowHeadType?: MarkerType
  markerEndId?: string
  selected?: boolean
  onElementsRemove?: (elements: any[]) => void
  pathType?: string
  gatewayPanelRender?: React.FC<NewGatewayPanelProps>
  isLoop?: boolean
  editable?: boolean
}

const GatewayEdge: React.FC<GatewayEdgeProps> = (props) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    arrowHeadType,
    markerEndId,
    selected,
    onElementsRemove = () => {},
    pathType,
    gatewayPanelRender,
    isLoop
  } = props

  const pathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  }

  const offsetX = sourceX + 260
  const p1 = {
    ...pathParams,
    targetX: offsetX,
    targetY: sourceY,
  }
  const p2 = {
    ...pathParams,
    sourceX: offsetX,
    targetX: offsetX,
  }
  const p3 = {
    ...pathParams,
    sourceX: offsetX,
    sourceY: targetY,
  }

  const edgePath = pathType == 'smoothStep' ? getSmoothStepPath(pathParams) : getBezierPath(pathParams)
  const edgePath1 = pathType == 'smoothStep' ? getSmoothStepPath(p1) : getBezierPath(p1)
  const edgePath2 = pathType == 'smoothStep' ? getSmoothStepPath(p2) : getBezierPath(p2)
  const edgePath3 = pathType == 'smoothStep' ? getSmoothStepPath(p3) : getBezierPath(p3)

  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId)
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX: isLoop ? offsetX : sourceX,
    sourceY,
    targetX: isLoop ? offsetX : targetX,
    targetY,
  })
  const GatewayPanelCom = gatewayPanelRender || NewGatewayPanel

  return (
    <>
      <path
        id={id}
        style={{
          strokeWidth: "3px"
        }}
        className="react-flow__edge-path"
        d={!isLoop ? edgePath : edgePath1 + edgePath2.replace('M', 'L') + edgePath3.replace('M', 'L')}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={260}
        height={foreignObjectSize}
        x={edgeCenterX - 130}
        y={edgeCenterY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="w-full h-full select-none flex items-center justify-center">
          <GatewayPanelCom id={id} selected={selected} onElementsRemove={onElementsRemove} data={data} />
        </div>
      </foreignObject>
    </>
  )
}

interface IteratorEdgeLoopProps extends EdgeProps {
  arrowHeadType?: MarkerType
  markerEndId?: string
  pathType?: string
  markerEnd?: any
}

const IteratorEdgeLoop: React.FC<IteratorEdgeLoopProps> = (props) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    pathType,
    markerEnd
  } = props

  const pathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  }

  const sY = sourceY - 30
  const sx = sourceX - 240
  const tY = targetY + 60
  const p4 = {
    ...pathParams,
    sourceX: sourceX - 50,
    sourceY: sY,
    targetX: sx,
    targetY: sY,
  }
  const p5 = {
    ...pathParams,
    sourceX: sx,
    sourceY: sY,
    targetX: sx,
    targetY: tY,
  }
  const p6 = {
    ...pathParams,
    sourceX: sx,
    sourceY: tY,
    targetX: targetX - 105,
    targetY: tY,
  }

  const edgePath4 = pathType == 'smoothStep' ? getSmoothStepPath(p4) : getBezierPath(p4)
  const edgePath5 = pathType == 'smoothStep' ? getSmoothStepPath(p5) : getBezierPath(p5)
  const edgePath6 = pathType == 'smoothStep' ? getSmoothStepPath(p6) : getBezierPath(p6)

  const d = edgePath4 + edgePath5.replace('M', 'L') + edgePath6.replace('M', 'L')

  return (
    <path
      id={id}
      style={{
          strokeWidth: "3px"
        }}
      className="react-flow__edge-path"
      d={d}
      markerEnd={markerEnd}
    />
  )
}

interface GatewayDefaultEdgeProps extends EdgeProps {
  arrowHeadType?: MarkerType
  markerEndId?: string
  pathType?: string
  logic?: boolean
}

const GatewayDefaultEdge: React.FC<GatewayDefaultEdgeProps> = (props) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    arrowHeadType,
    markerEndId,
    pathType,
    logic,
  } = props

  const pathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  }

  const sY = sourceY - 42
  const sx = sourceX - 240
  const tY = targetY + 35
  const p4 = {
    ...pathParams,
    sourceX: sourceX - 28,
    sourceY: sY,
    targetX: sx,
    targetY: sY,
  }
  const p5 = {
    ...pathParams,
    sourceX: sx,
    sourceY: sY,
    targetX: sx,
    targetY: tY,
  }
  const p6 = {
    ...pathParams,
    sourceX: sx,
    sourceY: tY,
    targetX: targetX - 50,
    targetY: tY,
  }

  const edgePath4 = pathType == 'smoothStep' ? getSmoothStepPath(p4) : getBezierPath(p4)
  const edgePath5 = pathType == 'smoothStep' ? getSmoothStepPath(p5) : getBezierPath(p5)
  const edgePath6 = pathType == 'smoothStep' ? getSmoothStepPath(p6) : getBezierPath(p6)

  const d = edgePath4 + edgePath5.replace('M', 'L') + edgePath6.replace('M', 'L')
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId)
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX: sx,
    sourceY,
    targetX: sx,
    targetY,
  })

  return (
    <>
      <path
        id={id}
        style={{
          strokeWidth: "3px"
        }}
        className="react-flow__edge-path pointer-events-none"
        d={d}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={100}
        height={100}
        x={edgeCenterX - 50}
        y={edgeCenterY - 50}
        className="edgebutton-foreignobject pointer-events-none"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="w-full h-full select-none flex items-center justify-center">
          <div className={`w-10 h-10 rounded relative text-white text-center leading-[39px] react-flow-card border border-transparent ${logic ? 'bg-[rgb(31_203_46)]' : 'bg-[#aaa]'}`}>
            {'默认'}
          </div>
        </div>
      </foreignObject>
    </>
  )
}

export { GatewayEdge, IteratorEdgeLoop, GatewayDefaultEdge }
export type { GatewayData, GatewayEdgeProps, IteratorEdgeLoopProps, GatewayDefaultEdgeProps }
