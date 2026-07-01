import React from 'react'
import { X } from 'lucide-react'
import {
  getBezierPath,
  getEdgeCenter,
  EdgeProps,
  MarkerType,
  Position,
} from '@xyflow/react'

// Helper function to calculate smooth step path (replaces getSmoothStepPath)
const getSmoothStepPathString = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourcePosition: Position = Position.Bottom,
  targetPosition: Position = Position.Top,
  _borderRadius = 0
): string => {
  const [width, height] = [Math.abs(targetX - sourceX), Math.abs(targetY - sourceY)]
  const sourceGoto = sourcePosition === Position.Bottom || sourcePosition === Position.Top ? [0, height / 2] : [width / 2, 0]
  const targetGoto = targetPosition === Position.Bottom || targetPosition === Position.Top ? [0, -height / 2] : [-width / 2, 0]

  const [sourceControlX, sourceControlY] = [sourceX + sourceGoto[0], sourceY + sourceGoto[1]]
  const [targetControlX, targetControlY] = [targetX + targetGoto[0], targetY + targetGoto[1]]

  const d = [
    `M${sourceX},${sourceY}`,
    `L${sourceControlX},${sourceControlY}`,
    `L${targetControlX},${targetControlY}`,
    `L${targetX},${targetY}`
  ]

  return d.join(' ')
}

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

  const offsetX = sourceX + 260

  const edgePath = pathType == 'smoothStep'
    ? getSmoothStepPathString(sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition)
    : getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })[0]
  const edgePath1 = pathType == 'smoothStep'
    ? getSmoothStepPathString(sourceX, sourceY, offsetX, sourceY, sourcePosition, targetPosition)
    : getBezierPath({ sourceX, sourceY, sourcePosition, targetX: offsetX, targetY: sourceY, targetPosition })[0]
  const edgePath2 = pathType == 'smoothStep'
    ? getSmoothStepPathString(offsetX, sourceY, offsetX, targetY, sourcePosition, targetPosition)
    : getBezierPath({ sourceX: offsetX, sourceY, sourcePosition, targetX: offsetX, targetY, targetPosition })[0]
  const edgePath3 = pathType == 'smoothStep'
    ? getSmoothStepPathString(offsetX, targetY, targetX, targetY, sourcePosition, targetPosition)
    : getBezierPath({ sourceX: offsetX, sourceY: targetY, sourcePosition, targetX, targetY, targetPosition })[0]

  const markerEnd = arrowHeadType ? (markerEndId ? `url(#${markerEndId})` : `url(#${arrowHeadType})`) : undefined
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

  const sY = sourceY - 30
  const sx = sourceX - 240
  const tY = targetY + 60

  const edgePath4 = pathType == 'smoothStep'
    ? getSmoothStepPathString(sourceX - 50, sY, sx, sY, sourcePosition, targetPosition)
    : getBezierPath({ sourceX, sourceY: sY, sourcePosition, targetX: sx, targetY: sY, targetPosition })[0]
  const edgePath5 = pathType == 'smoothStep'
    ? getSmoothStepPathString(sx, sY, sx, tY, sourcePosition, targetPosition)
    : getBezierPath({ sourceX: sx, sourceY: sY, sourcePosition, targetX: sx, targetY: tY, targetPosition })[0]
  const edgePath6 = pathType == 'smoothStep'
    ? getSmoothStepPathString(sx, tY, targetX - 105, tY, sourcePosition, targetPosition)
    : getBezierPath({ sourceX: sx, sourceY: tY, sourcePosition, targetX: targetX - 105, targetY: tY, targetPosition })[0]

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

  const sY = sourceY - 42
  const sx = sourceX - 240
  const tY = targetY + 35

  const edgePath4 = pathType == 'smoothStep'
    ? getSmoothStepPathString(sourceX - 28, sY, sx, sY, sourcePosition, targetPosition)
    : getBezierPath({ sourceX: sourceX - 28, sourceY: sY, sourcePosition, targetX: sx, targetY: sY, targetPosition })[0]
  const edgePath5 = pathType == 'smoothStep'
    ? getSmoothStepPathString(sx, sY, sx, tY, sourcePosition, targetPosition)
    : getBezierPath({ sourceX: sx, sourceY: sY, sourcePosition, targetX: sx, targetY: tY, targetPosition })[0]
  const edgePath6 = pathType == 'smoothStep'
    ? getSmoothStepPathString(sx, tY, targetX - 50, tY, sourcePosition, targetPosition)
    : getBezierPath({ sourceX: sx, sourceY: tY, sourcePosition, targetX: targetX - 50, targetY: tY, targetPosition })[0]

  const d = edgePath4 + edgePath5.replace('M', 'L') + edgePath6.replace('M', 'L')
  const markerEnd = arrowHeadType ? (markerEndId ? `url(#${markerEndId})` : `url(#${arrowHeadType})`) : undefined
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
