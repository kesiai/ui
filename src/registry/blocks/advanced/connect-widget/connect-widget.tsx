"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// 点类型
export interface Point {
  x: number
  y: number
}

// 线段类型
export interface LineSegment {
  startPoint: Point
  endPoint: Point
  p1?: Point // 贝塞尔曲线控制点1
  p2?: Point // 贝塞尔曲线控制点2
}

// 箭头类型
export type ArrowType = 'none' | 'arrow' | 'arrowOpen' | 'diamond' | 'diamondOpen' | 'circle' | 'circleOpen' | 'square' | 'squareOpen'

// 连线类型
export type LineShape = 'line' | 'narrow-s' | 'bezier'

// 动画配置
export interface AnimationConfig {
  show: boolean
  duration?: number
  timing?: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
  orientation?: 'forward' | 'reverse'
  strokeDasharray?: string
  strokeLinejoin?: 'round' | 'miter' | 'bevel'
}

export interface ConnectWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  // 线段数据
  pathValue?: LineSegment[]
  // 线段数据改变回调
  onPathValueChange?: (pathValue: LineSegment[]) => void
  // 连线类型
  shape?: LineShape
  // 线条颜色
  stroke?: string
  // 线条宽度
  strokeWidth?: number
  // 起点箭头
  startArrow?: ArrowType
  // 终点箭头
  endArrow?: ArrowType
  // 起点箭头大小
  startArrowSize?: number
  // 终点箭头大小
  endArrowSize?: number
  // 动画配置
  animation?: AnimationConfig
  // 圆弧大小（折弯线）
  radiusQ?: number
  // 是否编辑模式
  editMode?: boolean
  // 宽度
  width?: number
  // 高度
  height?: number
}

// 判断点是否在线段上（允许一定误差）
const isPointOnLine = (start: Point, end: Point, point: Point, tolerance = 8): boolean => {
  const d1 = Math.sqrt((point.x - start.x) ** 2 + (point.y - start.y) ** 2)
  const d2 = Math.sqrt((point.x - end.x) ** 2 + (point.y - end.y) ** 2)
  const lineLen = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2)
  return Math.abs(d1 + d2 - lineLen) < tolerance
}


// 生成箭头标记定义
const getArrowMarkerDefs = (
  color: string,
  strokeWidth: number,
  startArrowSize: number,
  endArrowSize: number,
  id: string,
  startArrow: ArrowType,
  endArrow: ArrowType
) => {
  const markers: React.ReactNode[] = []

  const createArrowMarker = (type: ArrowType, isStart: boolean, size: number) => {
    const markerId = `${id}-${isStart ? 'start' : 'end'}-${type}`
    const scale = size * strokeWidth

    switch (type) {
      case 'arrow':
        return (
          <marker
            key={markerId}
            id={markerId}
            markerWidth={scale * 3}
            markerHeight={scale * 3}
            refX={isStart ? 0 : scale * 3}
            refY={scale * 1.5}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path
              d={isStart
                ? `M ${scale * 3} 0 L 0 ${scale * 1.5} L ${scale * 3} ${scale * 3} Z`
                : `M 0 0 L ${scale * 3} ${scale * 1.5} L 0 ${scale * 3} Z`}
              fill={color}
            />
          </marker>
        )
      case 'arrowOpen':
        return (
          <marker
            key={markerId}
            id={markerId}
            markerWidth={scale * 3}
            markerHeight={scale * 3}
            refX={isStart ? 0 : scale * 3}
            refY={scale * 1.5}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path
              d={isStart
                ? `M ${scale * 3} 0 L 0 ${scale * 1.5} L ${scale * 3} ${scale * 3}`
                : `M 0 0 L ${scale * 3} ${scale * 1.5} L 0 ${scale * 3}`}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
            />
          </marker>
        )
      case 'circle':
        return (
          <marker
            key={markerId}
            id={markerId}
            markerWidth={scale * 2}
            markerHeight={scale * 2}
            refX={scale}
            refY={scale}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <circle cx={scale} cy={scale} r={scale * 0.8} fill={color} />
          </marker>
        )
      case 'circleOpen':
        return (
          <marker
            key={markerId}
            id={markerId}
            markerWidth={scale * 2}
            markerHeight={scale * 2}
            refX={scale}
            refY={scale}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <circle cx={scale} cy={scale} r={scale * 0.8} fill="none" stroke={color} strokeWidth={strokeWidth} />
          </marker>
        )
      case 'diamond':
        return (
          <marker
            key={markerId}
            id={markerId}
            markerWidth={scale * 2}
            markerHeight={scale * 2}
            refX={scale}
            refY={scale}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path
              d={`M ${scale} 0 L ${scale * 2} ${scale} L ${scale} ${scale * 2} L 0 ${scale} Z`}
              fill={color}
            />
          </marker>
        )
      case 'diamondOpen':
        return (
          <marker
            key={markerId}
            id={markerId}
            markerWidth={scale * 2}
            markerHeight={scale * 2}
            refX={scale}
            refY={scale}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path
              d={`M ${scale} 0 L ${scale * 2} ${scale} L ${scale} ${scale * 2} L 0 ${scale} Z`}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
            />
          </marker>
        )
      case 'square':
        return (
          <marker
            key={markerId}
            id={markerId}
            markerWidth={scale * 2}
            markerHeight={scale * 2}
            refX={scale}
            refY={scale}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <rect x={scale * 0.2} y={scale * 0.2} width={scale * 1.6} height={scale * 1.6} fill={color} />
          </marker>
        )
      case 'squareOpen':
        return (
          <marker
            key={markerId}
            id={markerId}
            markerWidth={scale * 2}
            markerHeight={scale * 2}
            refX={scale}
            refY={scale}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <rect x={scale * 0.2} y={scale * 0.2} width={scale * 1.6} height={scale * 1.6} fill="none" stroke={color} strokeWidth={strokeWidth} />
          </marker>
        )
      default:
        return null
    }
  }

  if (startArrow !== 'none') {
    markers.push(createArrowMarker(startArrow, true, startArrowSize))
  }
  if (endArrow !== 'none') {
    markers.push(createArrowMarker(endArrow, false, endArrowSize))
  }

  return <defs>{markers}</defs>
}

const ConnectWidget = React.forwardRef<HTMLDivElement, ConnectWidgetProps>(
  (
    {
      className,
      pathValue: propPathValue,
      onPathValueChange,
      shape = 'line',
      stroke = '#000000',
      strokeWidth = 2,
      startArrow = 'none',
      endArrow = 'none',
      startArrowSize = 2,
      endArrowSize = 2,
      animation,
      editMode = true,
      width = 400,
      height = 300,
      ...props
    },
    ref
  ) => {
    const id = React.useId()
    const svgRef = React.useRef<SVGSVGElement>(null)
    const wrapperRef = React.useRef<HTMLDivElement | null>(null)
    const pathRef = React.useRef<SVGPathElement>(null)

    // 默认线段
    const defaultPathValue: LineSegment[] = [
      { startPoint: { x: 50, y: 150 }, endPoint: { x: 350, y: 150 } }
    ]

    // 支持受控和非受控模式
    const isControlled = propPathValue !== undefined
    const [internalPathValue, setInternalPathValue] = React.useState<LineSegment[]>(
      propPathValue || defaultPathValue
    )
    
    // 使用外部值或内部值
    const pathValue = isControlled ? propPathValue : internalPathValue
    const setPathValue = React.useCallback((newValue: LineSegment[]) => {
      if (!isControlled) {
        setInternalPathValue(newValue)
      }
      // 无论受控还是非受控，都通知外部
      onPathValueChange?.(newValue)
    }, [isControlled, onPathValueChange])
    
    const pathValueRef = React.useRef<LineSegment[]>(pathValue) // 用于拖拽时获取最新值
    
    // 同步 pathValueRef
    React.useEffect(() => {
      pathValueRef.current = pathValue
    }, [pathValue])
    const [pathLength, setPathLength] = React.useState(0)
    
    // 拖拽状态
    const [dragState, setDragState] = React.useState<{
      isDragging: boolean
      type: 'start' | 'end' | 'move' | 'add' | null
      index: number
      isNewPoint: boolean
    }>({ isDragging: false, type: null, index: -1, isNewPoint: false })
    const dragStateRef = React.useRef(dragState) // 用于拖拽时获取最新值
    
    // 鼠标悬停状态
    const [hoverState, setHoverState] = React.useState<{
      segmentIndex: number | null
      point: Point | null
    }>({ segmentIndex: null, point: null })

    // 记录新添加点的索引（用于拖拽过程中判断是否合并）
    const newPointIndexRef = React.useRef<number | null>(null)
    
    // 添加点拖拽状态（完全独立管理）
    const addDragRef = React.useRef<{
      isDragging: boolean
      segmentIndex: number
      pathValue: LineSegment[]
      startCoord: Point
      hasLeftLine: boolean  // 是否已经离开过原线段
      isMerged: boolean     // 当前是否处于合并状态
    } | null>(null)

    // 计算路径长度（动画用）
    React.useEffect(() => {
      if (pathRef.current) {
        setPathLength(pathRef.current.getTotalLength())
      }
    }, [pathValue, animation?.show])

    // 更新路径值
    const updatePathValue = React.useCallback((newValue: LineSegment[]) => {
      pathValueRef.current = newValue // 同步更新 ref
      setPathValue(newValue)
    }, [setPathValue])

    // 获取 SVG 坐标
    const getSvgCoords = React.useCallback((clientX: number, clientY: number): Point => {
      if (!wrapperRef.current) return { x: 0, y: 0 }
      const rect = wrapperRef.current.getBoundingClientRect()
      return {
        x: Math.round(clientX - rect.left),
        y: Math.round(clientY - rect.top)
      }
    }, [])

    // 生成直线路径
    const getLinePath = (): string => {
      return pathValue
        .map((item, index) => {
          const sx = item.startPoint.x
          const sy = item.startPoint.y
          const ex = item.endPoint.x
          const ey = item.endPoint.y
          if (index === 0) {
            return `M ${sx} ${sy} L ${ex} ${ey}`
          }
          return `L ${ex} ${ey}`
        })
        .join(' ')
    }

    // 生成贝塞尔曲线路径
    const getBezierPath = (): string => {
      return pathValue
        .map((item, index) => {
          const sx = item.startPoint.x
          const sy = item.startPoint.y
          const ex = item.endPoint.x
          const ey = item.endPoint.y
          const p1 = item.p1 || { x: sx + (ex - sx) / 3, y: sy }
          const p2 = item.p2 || { x: ex - (ex - sx) / 3, y: ey }

          if (index === 0) {
            return `M ${sx} ${sy} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${ex} ${ey}`
          }
          return `C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${ex} ${ey}`
        })
        .join(' ')
    }

    // 当只有起点和终点时，自动生成折弯点（水平→垂直）
    const getFirstPoint = (item: LineSegment): LineSegment[] => {
      return [
        { 
          startPoint: { x: item.startPoint.x, y: item.startPoint.y }, 
          endPoint: { x: item.endPoint.x, y: item.startPoint.y } 
        },
        { 
          startPoint: { x: item.endPoint.x, y: item.startPoint.y }, 
          endPoint: { x: item.endPoint.x, y: item.endPoint.y } 
        }
      ]
    }

    // 获取水平或垂直线段的路径命令
    const getHOrV = (item: LineSegment, index: number, arr: LineSegment[], radius: number): string => {
      let num = radius
      if (index === 0 || index === arr.length - 1) {
        num = radius
      } else {
        num = radius * 2
      }

      // 垂直线（x坐标相等）
      if (Math.abs(item.startPoint.x - item.endPoint.x) < 1) {
        const diff = item.endPoint.y - item.startPoint.y
        if (diff < 0) num = -num
        return `v ${diff - num}`
      }
      // 水平线（y坐标相等）
      if (Math.abs(item.startPoint.y - item.endPoint.y) < 1) {
        const diff = item.endPoint.x - item.startPoint.x
        if (diff < 0) num = -num
        return `h ${diff - num}`
      }
      // 非水平非垂直，返回直线
      return `L ${item.endPoint.x} ${item.endPoint.y}`
    }

    // 获取圆弧过渡路径命令
    const getSvgA = (prev: LineSegment, current: LineSegment, radius: number): string => {
      const r = radius
      // 前一段是水平线，当前是垂直线
      if (Math.abs(prev.startPoint.y - prev.endPoint.y) < 1 && Math.abs(current.startPoint.x - current.endPoint.x) < 1) {
        const goingDown = current.endPoint.y - current.startPoint.y >= 0
        const goingRight = prev.endPoint.x - prev.startPoint.x >= 0
        if (goingDown) {
          return goingRight 
            ? `a ${r} ${r} 0 0 1 ${r} ${r}` 
            : `a ${r} ${r} 0 0 0 ${-r} ${r}`
        } else {
          return goingRight 
            ? `a ${r} ${r} 0 0 0 ${r} ${-r}` 
            : `a ${r} ${r} 0 0 1 ${-r} ${-r}`
        }
      }
      // 前一段是垂直线，当前是水平线
      if (Math.abs(prev.startPoint.x - prev.endPoint.x) < 1 && Math.abs(current.startPoint.y - current.endPoint.y) < 1) {
        const goingRight = current.endPoint.x - current.startPoint.x >= 0
        const goingDown = prev.endPoint.y - prev.startPoint.y >= 0
        if (goingRight) {
          return goingDown 
            ? `a ${r} ${r} 0 0 0 ${r} ${r}` 
            : `a ${r} ${r} 0 0 1 ${r} ${-r}`
        } else {
          return goingDown 
            ? `a ${r} ${r} 0 0 1 ${-r} ${r}` 
            : `a ${r} ${r} 0 0 0 ${-r} ${-r}`
        }
      }
      return ''
    }

    // 生成折弯线路径
    const getNarrowSPath = (): string => {
      // 如果只有一条线段，自动生成折弯点
      const segments = pathValue.length === 1 ? getFirstPoint(pathValue[0]) : pathValue
      const radius = 6 // radiusQ

      let path = ''
      segments.forEach((item, index) => {
        if (index === 0) {
          path = `M ${item.startPoint.x} ${item.startPoint.y} ${getHOrV(item, index, segments, radius)}`
        } else {
          const arc = getSvgA(segments[index - 1], item, radius)
          path += ` ${arc} ${getHOrV(item, index, segments, radius)}`
        }
      })
      return path
    }

    // 获取路径字符串
    const getPath = (): string => {
      switch (shape) {
        case 'bezier':
          return getBezierPath()
        case 'narrow-s':
          return getNarrowSPath()
        default:
          return getLinePath()
      }
    }

    // 通用拖拽处理函数 - 在 mousedown 时立即添加事件监听器
    const startDrag = React.useCallback((type: 'start' | 'end' | 'move', index: number, isNewPoint: boolean) => {
      // 防止重复调用
      if (dragStateRef.current.isDragging) {
        console.log('[ConnectWidget] startDrag BLOCKED - already dragging, current type:', dragStateRef.current.type)
        return
      }
      console.log('[ConnectWidget] startDrag called - type:', type)
      // console.log('[ConnectWidget] startDrag called - type:', type, 'index:', index, 'isNewPoint:', isNewPoint, 'pathValueRef.length:', pathValueRef.current.length)
      const newDragState = { isDragging: true, type, index, isNewPoint }
      dragStateRef.current = newDragState
      setDragState(newDragState)

      const handleMouseMove = (e: MouseEvent) => {
        const coord = getSvgCoords(e.clientX, e.clientY)
        const newValue = [...pathValueRef.current]
        const currentDragState = dragStateRef.current

        // console.log('[ConnectWidget] handleMouseMove - type:', currentDragState.type, 'index:', currentDragState.index, 'pathValue.length:', newValue.length)

        if (currentDragState.type === 'start') {
          newValue[0] = { ...newValue[0], startPoint: coord }
        } else if (currentDragState.type === 'end') {
          const lastIndex = newValue.length - 1
          // console.log('[ConnectWidget] Moving END point, lastIndex:', lastIndex)
          newValue[lastIndex] = { ...newValue[lastIndex], endPoint: coord }
        } else if (currentDragState.type === 'move') {
          // 只处理 move，add 由 handleAddMouseDown 自己管理
          const idx = currentDragState.index
          
          // 检查当前索引是否有效
          if (idx >= newValue.length - 1) {
            // 索引无效（可能是合并后），检查是否需要重新拆分
            // 找到包含当前坐标的线段
            for (let i = 0; i < newValue.length; i++) {
              const seg = newValue[i]
              const isOnSeg = isPointOnLine(seg.startPoint, seg.endPoint, coord, 15)
              if (!isOnSeg) continue
              
              // 如果不在线上，在这个位置拆分
              const newSeg1 = { startPoint: seg.startPoint, endPoint: coord }
              const newSeg2 = { startPoint: coord, endPoint: seg.endPoint }
              newValue.splice(i, 1, newSeg1, newSeg2)
              
              // 更新拖拽索引
              dragStateRef.current = { ...currentDragState, index: i }
              break
            }
          } else {
            // 正常情况：更新中间点位置
            newValue[idx] = { ...newValue[idx], endPoint: coord }
            if (idx + 1 < newValue.length) {
              newValue[idx + 1] = { ...newValue[idx + 1], startPoint: coord }
            }

            // 检查是否可以合并（当中间点移动到其关联的两条线段形成的直线上时）
            const startPoint = newValue[idx].startPoint
            const endPoint = newValue[idx + 1].endPoint
            const isOnLine = isPointOnLine(startPoint, endPoint, coord, 10)
            if (isOnLine) {
              // 合并：将两条线段合并为一条
              newValue[idx] = {
                startPoint: startPoint,
                endPoint: endPoint
              }
              newValue.splice(idx + 1, 1)
              // 不结束拖拽，继续允许拖拽
              // 下一次 mousemove 时，如果离开直线，会自动重新拆分
            }
          }
        } else if (currentDragState.type === 'add') {
          // add 类型由 handleAddMouseDown 自己的事件监听器处理，这里不做任何事
          return
        }

        updatePathValue(newValue)
      }

      const handleMouseUp = () => {
        const endDragState: typeof dragState = { isDragging: false, type: null, index: -1, isNewPoint: false }
        dragStateRef.current = endDragState
        setDragState(endDragState)
        newPointIndexRef.current = null
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }, [getSvgCoords, updatePathValue])

    // 处理鼠标按下 - 起点
    const handleStartMouseDown = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      startDrag('start', 0, false)
    }

    // 处理鼠标按下 - 终点
    const handleEndMouseDown = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      startDrag('end', pathValue.length - 1, false)
    }

    // 处理鼠标按下 - 中间点（已存在的顶点）
    const handleMoveMouseDown = (e: React.MouseEvent, index: number) => {
      e.preventDefault()
      e.stopPropagation()
      startDrag('move', index, false)
    }

    // 全局事件处理函数（用于添加点拖拽）
    React.useEffect(() => {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!addDragRef.current?.isDragging) return
        
        const coord = getSvgCoords(e.clientX, e.clientY)
        const { segmentIndex, isMerged } = addDragRef.current
        let dragPath = [...addDragRef.current.pathValue]
        
        let idx = segmentIndex
        
        // 如果当前处于合并状态，检查是否需要重新拆分
        if (isMerged && idx < dragPath.length) {
          const seg = dragPath[idx]
          const startPoint = seg.startPoint
          const endPoint = seg.endPoint
          
          // 使用更大的容差来判断是否离开直线（防止闪烁）
          const isOnLine = isPointOnLine(startPoint, endPoint, coord, 20)
          
          if (!isOnLine) {
            // 离开直线，重新拆分
            const newSeg1 = { startPoint: startPoint, endPoint: coord }
            const newSeg2 = { startPoint: coord, endPoint: endPoint }
            dragPath.splice(idx, 1, newSeg1, newSeg2)
            
            addDragRef.current.isMerged = false
            addDragRef.current.hasLeftLine = true
          }
        } else if (!isMerged && idx < dragPath.length - 1) {
          // 正常拖拽状态：更新中间点位置
          dragPath[idx] = { ...dragPath[idx], endPoint: coord }
          dragPath[idx + 1] = { ...dragPath[idx + 1], startPoint: coord }
          
          // 检查当前点是否在原线段上（起点到终点的直线）
          const startPoint = dragPath[idx].startPoint
          const endPoint = dragPath[idx + 1].endPoint
          // 使用较小的容差来判断是否在直线上（合并条件更严格）
          const isOnLine = isPointOnLine(startPoint, endPoint, coord, 8)
          
          // 如果当前不在线上，标记为已离开
          if (!isOnLine) {
            addDragRef.current.hasLeftLine = true
          }
          
          // 只有离开过原线段后再回来才合并
          if (addDragRef.current.hasLeftLine && isOnLine) {
            dragPath[idx] = {
              startPoint: startPoint,
              endPoint: endPoint
            }
            dragPath.splice(idx + 1, 1)
            
            // 标记为合并状态
            addDragRef.current.isMerged = true
            addDragRef.current.hasLeftLine = false
          }
        }
        
        // 更新状态
        addDragRef.current.pathValue = dragPath
        pathValueRef.current = dragPath
        setPathValue([...dragPath])
      }
      
      const handleGlobalMouseUp = () => {
        if (!addDragRef.current?.isDragging) return
        
        // 重置状态
        addDragRef.current = null
        const endState: typeof dragState = { isDragging: false, type: null, index: -1, isNewPoint: false }
        dragStateRef.current = endState
        setDragState(endState)
        newPointIndexRef.current = null
      }
      
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove)
        document.removeEventListener('mouseup', handleGlobalMouseUp)
      }
    }, [getSvgCoords])
    
    // 处理鼠标按下 - 添加点（线段中点）
    const handleAddMouseDown = (e: React.MouseEvent, segmentIndex: number) => {
      e.preventDefault()
      e.stopPropagation()
      
      const currentPath = pathValueRef.current
      console.log('[ConnectWidget] handleAddMouseDown - segmentIndex:', segmentIndex, 'current length:', currentPath.length)
      
      if (segmentIndex < 0 || segmentIndex >= currentPath.length) {
        return
      }
      
      // 使用线段中点作为新点位置
      const segment = currentPath[segmentIndex]
      const midPoint = {
        x: (segment.startPoint.x + segment.endPoint.x) / 2,
        y: (segment.startPoint.y + segment.endPoint.y) / 2
      }
      
      // 创建新的路径数组：在 segmentIndex 位置拆分线段
      const newValue: LineSegment[] = []
      for (let i = 0; i < currentPath.length; i++) {
        if (i === segmentIndex) {
          newValue.push({
            startPoint: currentPath[i].startPoint,
            endPoint: midPoint
          })
          newValue.push({
            startPoint: midPoint,
            endPoint: currentPath[i].endPoint
          })
        } else {
          newValue.push({ ...currentPath[i] })
        }
      }
      
      console.log('[ConnectWidget] After split - newValue:', newValue.length, 'segments')
      
      // 设置添加点拖拽状态
      addDragRef.current = {
        isDragging: true,
        segmentIndex,
        pathValue: newValue,
        startCoord: midPoint,
        hasLeftLine: false,
        isMerged: false
      }
      console.log('[ConnectWidget] addDragRef set:', addDragRef.current)
      
      // 设置拖拽状态
      const newDragState = { isDragging: true, type: 'add' as const, index: segmentIndex, isNewPoint: true }
      dragStateRef.current = newDragState
      setDragState(newDragState)
      
      // 更新路径状态
      pathValueRef.current = newValue
      newPointIndexRef.current = segmentIndex
      setPathValue(newValue)
    }

    // 处理鼠标在 SVG 上移动（显示添加点提示）
    const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
      if (!editMode || dragState.isDragging) return

      const coord = getSvgCoords(e.clientX, e.clientY)

      // 检查鼠标是否在某个线段上
      for (let i = 0; i < pathValue.length; i++) {
        const segment = pathValue[i]
        if (isPointOnLine(segment.startPoint, segment.endPoint, coord, 15)) {
          // 计算线段中点
          const midPoint = {
            x: (segment.startPoint.x + segment.endPoint.x) / 2,
            y: (segment.startPoint.y + segment.endPoint.y) / 2
          }
          setHoverState({ segmentIndex: i, point: midPoint })
          return
        }
      }
      setHoverState({ segmentIndex: null, point: null })
    }

    // 动画样式
    const animationStyle: React.CSSProperties = animation?.show
      ? {
          strokeDasharray: animation.strokeDasharray || '10, 10',
          strokeDashoffset: pathLength,
          animation: `dash ${animation.duration || 2}s ${animation.timing || 'linear'} infinite ${
            animation.orientation === 'reverse' ? 'reverse' : 'normal'
          }`
        }
      : {}

    // 箭头属性
    const markerStart = startArrow !== 'none' ? `url(#${id}-start-${startArrow})` : undefined
    const markerEnd = endArrow !== 'none' ? `url(#${id}-end-${endArrow})` : undefined

    const path = getPath()
    const handleRadius = 6

    // 合并 refs
    const setRefs = React.useCallback((node: HTMLDivElement | null) => {
      (wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }
    }, [ref])

    return (
      <div ref={setRefs} className={cn("relative", className)} {...props}>
        <style>
          {`
            @keyframes dash {
              to {
                stroke-dashoffset: 0;
              }
            }
          `}
        </style>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          style={{ display: 'block', overflow: 'visible', cursor: dragState.isDragging ? 'grabbing' : 'default' }}
          onMouseMove={handleSvgMouseMove}
          onMouseLeave={() => setHoverState({ segmentIndex: null, point: null })}
        >
          {getArrowMarkerDefs(stroke, strokeWidth, startArrowSize, endArrowSize, id, startArrow, endArrow)}

          {/* 主路径 */}
          <path
            ref={pathRef}
            d={path}
            stroke={stroke}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinejoin={animation?.strokeLinejoin || 'round'}
            strokeLinecap="round"
            style={{ ...animationStyle, pointerEvents: 'none' }}
            markerStart={markerStart}
            markerEnd={markerEnd}
          />

          {/* 透明宽线条用于捕获鼠标事件 */}
          {editMode && (
            <path
              d={path}
              stroke="transparent"
              strokeWidth={Math.max(20, strokeWidth + 10)}
              fill="none"
              strokeLinecap="round"
              style={{ cursor: 'pointer' }}
              onMouseMove={(e) => {
                if (dragState.isDragging) return
                const coord = getSvgCoords(e.clientX, e.clientY)
                // 检查鼠标是否在某个线段上
                for (let i = 0; i < pathValueRef.current.length; i++) {
                  const segment = pathValueRef.current[i]
                  if (isPointOnLine(segment.startPoint, segment.endPoint, coord, 20)) {
                    const midPoint = {
                      x: (segment.startPoint.x + segment.endPoint.x) / 2,
                      y: (segment.startPoint.y + segment.endPoint.y) / 2
                    }
                    // console.log('[ConnectWidget] Hover detected on segment:', i, 'midPoint:', midPoint)
                    setHoverState({ segmentIndex: i, point: midPoint })
                    return
                  }
                }
                setHoverState({ segmentIndex: null, point: null })
              }}
              onMouseLeave={() => setHoverState({ segmentIndex: null, point: null })}
            />
          )}

          {/* 编辑模式下的控制点 */}
          {editMode && (
            <g>
              {/* 起点手柄 */}
              <circle
                cx={pathValue[0].startPoint.x}
                cy={pathValue[0].startPoint.y}
                r={dragState.isDragging && dragState.type === 'start' ? handleRadius * 1.5 : handleRadius}
                fill="#10b981"
                stroke="white"
                strokeWidth={2}
                style={{ cursor: 'grab' }}
                onMouseDown={handleStartMouseDown}
              />

              {/* 中间点手柄（已存在的顶点） */}
              {pathValue.map((segment, index) => {
                if (index === pathValue.length - 1) return null
                const isActive = dragState.isDragging && dragState.type === 'move' && dragState.index === index
                return (
                  <circle
                    key={`vertex-${index}`}
                    cx={segment.endPoint.x}
                    cy={segment.endPoint.y}
                    r={isActive ? handleRadius * 1.5 : handleRadius}
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth={2}
                    style={{ cursor: 'grab' }}
                    onMouseDown={(e) => handleMoveMouseDown(e, index)}
                  />
                )
              })}

              {/* 终点手柄 */}
              <circle
                cx={pathValue[pathValue.length - 1].endPoint.x}
                cy={pathValue[pathValue.length - 1].endPoint.y}
                r={dragState.isDragging && dragState.type === 'end' ? handleRadius * 1.5 : handleRadius}
                fill="#ef4444"
                stroke="white"
                strokeWidth={2}
                style={{ cursor: 'grab' }}
                onMouseDown={handleEndMouseDown}
              />

              {/* 悬停时显示的中点（用于添加新点） */}
              {hoverState.segmentIndex !== null && hoverState.point && !dragState.isDragging && (
                <circle
                  cx={hoverState.point.x}
                  cy={hoverState.point.y}
                  r={handleRadius + 4}
                  fill="rgba(100, 149, 237, 0.9)"
                  stroke="white"
                  strokeWidth={2}
                  style={{ cursor: 'grab' }}
                  onMouseDown={(e) => {
                    const segIdx = hoverState.segmentIndex!
                    console.log('[ConnectWidget] Hover point clicked, segmentIndex:', segIdx)
                    setHoverState({ segmentIndex: null, point: null })
                    handleAddMouseDown(e, segIdx)
                  }}
                />
              )}
            </g>
          )}
        </svg>

        {/* 编辑模式提示 */}
        {editMode && (
          <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1" /> 起点
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mx-1 ml-3" /> 中间点
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mx-1 ml-3" /> 终点
            <span className="ml-3">悬停线段可添加点，拖回直线可合并</span>
          </div>
        )}
      </div>
    )
  }
)

ConnectWidget.displayName = "ConnectWidget"

export { ConnectWidget }
