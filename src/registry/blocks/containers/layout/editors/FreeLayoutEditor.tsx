'use client'

import React, { useState, useRef, useEffect, ReactNode } from 'react'
import type { FreeItemLayout, FreeLayoutSettings } from '../layout'

interface FreeLayoutEditorProps {
  children: ReactNode
  layout: Record<string, FreeItemLayout>
  settings: FreeLayoutSettings
  onLayoutChange: (layout: Record<string, FreeItemLayout>) => void
  containerStyle?: React.CSSProperties
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null

export function FreeLayoutEditor({
  children,
  layout,
  settings,
  onLayoutChange,
  containerStyle
}: FreeLayoutEditorProps) {
  const [draggingKey, setDraggingKey] = useState<string | null>(null)
  const [resizingKey, setResizingKey] = useState<string | null>(null)
  const [resizeDirection, setResizeDirection] = useState<ResizeDirection>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const childrenArray = React.Children.toArray(children)

  // 处理鼠标按下（拖拽移动）
  const handleMouseDown = (e: React.MouseEvent, key: string) => {
    e.preventDefault()
    e.stopPropagation()

    const childElement = e.currentTarget as HTMLElement
    const rect = childElement.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect()

    if (!containerRect) return

    // 计算鼠标相对于元素的偏移
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }

    setDraggingKey(key)
  }

  // 处理调整大小
  const handleResizeStart = (e: React.MouseEvent, key: string, direction: ResizeDirection) => {
    e.preventDefault()
    e.stopPropagation()

    const childElement = e.currentTarget.parentElement as HTMLElement
    const rect = childElement.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect()

    if (!containerRect) return

    // 记录初始位置和尺寸
    dragOffset.current = {
      x: e.clientX,
      y: e.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      startWidth: rect.width,
      startHeight: rect.height
    } as any

    setResizingKey(key)
    setResizeDirection(direction)
  }

  // 处理鼠标移动
  useEffect(() => {
    if ((!draggingKey && !resizingKey) || !containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const containerRect = containerRef.current?.getBoundingClientRect()
      if (!containerRect) return

      if (draggingKey) {
        // 拖拽移动
        const newX = e.clientX - containerRect.left - dragOffset.current.x
        const newY = e.clientY - containerRect.top - dragOffset.current.y

        // 应用拖拽网格
        const snappedX = Math.round(newX / settings.dragGrid.x) * settings.dragGrid.x
        const snappedY = Math.round(newY / settings.dragGrid.y) * settings.dragGrid.y

        // 更新布局
        onLayoutChange({
          ...layout,
          [draggingKey]: {
            ...layout[draggingKey],
            x: Math.max(0, snappedX),
            y: Math.max(0, snappedY)
          }
        })
      } else if (resizingKey && resizeDirection) {
        // 调整大小
        const offset = dragOffset.current as any
        const deltaX = e.clientX - offset.x
        const deltaY = e.clientY - offset.y

        let newX = offset.startLeft - containerRect.left
        let newY = offset.startTop - containerRect.top
        let newWidth = offset.startWidth
        let newHeight = offset.startHeight

        // 根据方向调整
        if (resizeDirection.includes('e')) {
          newWidth = offset.startWidth + deltaX
        }
        if (resizeDirection.includes('w')) {
          newWidth = offset.startWidth - deltaX
          newX = offset.startLeft - containerRect.left + deltaX
        }
        if (resizeDirection.includes('s')) {
          newHeight = offset.startHeight + deltaY
        }
        if (resizeDirection.includes('n')) {
          newHeight = offset.startHeight - deltaY
          newY = offset.startTop - containerRect.top + deltaY
        }

        // 应用调整网格
        const snappedWidth = Math.round(newWidth / settings.resizeGrid.x) * settings.resizeGrid.x
        const snappedHeight = Math.round(newHeight / settings.resizeGrid.y) * settings.resizeGrid.y
        const snappedX = Math.round(newX / settings.dragGrid.x) * settings.dragGrid.x
        const snappedY = Math.round(newY / settings.dragGrid.y) * settings.dragGrid.y

        // 计算最终的位置和尺寸
        let finalX = snappedX
        let finalY = snappedY
        let finalWidth = snappedWidth
        let finalHeight = snappedHeight

        // 如果是从左边或上边调整，需要调整位置
        if (resizeDirection.includes('w')) {
          finalX = (offset.startLeft - containerRect.left) + (offset.startWidth - snappedWidth)
        }
        if (resizeDirection.includes('n')) {
          finalY = (offset.startTop - containerRect.top) + (offset.startHeight - snappedHeight)
        }

        // 更新布局
        onLayoutChange({
          ...layout,
          [resizingKey]: {
            ...layout[resizingKey],
            x: Math.max(0, finalX),
            y: Math.max(0, finalY),
            width: Math.max(settings.resizeGrid.x, finalWidth),
            height: Math.max(settings.resizeGrid.y, finalHeight)
          }
        })
      }
    }

    const handleMouseUp = () => {
      setDraggingKey(null)
      setResizingKey(null)
      setResizeDirection(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggingKey, resizingKey, resizeDirection, layout, settings, onLayoutChange])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${(draggingKey || resizingKey) ? 'is-dragging' : ''}`}
      style={{
        ...containerStyle,
        position: 'relative',
        cursor: 'default'
      }}
    >
      {childrenArray.map((child, index) => {
        const childElement = child as React.ReactElement
        // 清理 React 内部添加的 key 前缀：.$, ./, 等
        const key = (childElement.key || `child-${index}`).replace(/^\.?\$?\//, '').replace(/^\.\$/, '')
        const itemLayout = layout[key]

        if (!itemLayout) {
          return (
            <div key={childElement.key || index} className="absolute" style={{ left: 0, top: index * 50 }}>
              {child}
            </div>
          )
        }

        const isDragging = draggingKey === key || resizingKey === key
        const isAnyDragging = draggingKey || resizingKey

        return (
          <div
            key={childElement.key || index}
            className={`absolute group${!isAnyDragging ? ' allow-hover' : ''}`}
            style={{
              left: `${itemLayout.x}px`,
              top: `${itemLayout.y}px`,
              width: `${itemLayout.width}px`,
              height: `${itemLayout.height}px`,
              cursor: draggingKey === key ? 'grabbing' : 'grab'
            }}
            onMouseDown={(e) => handleMouseDown(e, key)}
          >
            {/* 编辑模式下显示的边框和手柄 */}
            <div className="relative w-full h-full">
              {child}

              {/* 编辑模式覆盖层 */}
              <div className={`absolute inset-0 border-2 border-blue-500 border-dashed opacity-0 transition-opacity${!isAnyDragging ? ' group-hover:opacity-100' : ''} ${isDragging ? 'opacity-100' : ''} pointer-events-none`} />

              {/* 8个调整大小控制点 */}
              {/* 角落控制点 */}
              <div
                className={`absolute -top-0.5 -left-0.5 w-2 h-2 bg-blue-500 rounded-full transition-opacity cursor-nw-resize hover:scale-125 ${!isAnyDragging ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'} ${isDragging ? 'opacity-100' : ''}`}
                onMouseDown={(e) => handleResizeStart(e, key, 'nw')}
              />
              <div
                className={`absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full transition-opacity cursor-ne-resize hover:scale-125 ${!isAnyDragging ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'} ${isDragging ? 'opacity-100' : ''}`}
                onMouseDown={(e) => handleResizeStart(e, key, 'ne')}
              />
              <div
                className={`absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-blue-500 rounded-full transition-opacity cursor-sw-resize hover:scale-125 ${!isAnyDragging ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'} ${isDragging ? 'opacity-100' : ''}`}
                onMouseDown={(e) => handleResizeStart(e, key, 'sw')}
              />
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full transition-opacity cursor-se-resize hover:scale-125 ${!isAnyDragging ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'} ${isDragging ? 'opacity-100' : ''}`}
                onMouseDown={(e) => handleResizeStart(e, key, 'se')}
              />

              {/* 边缘中间控制点 */}
              <div
                className={`absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full transition-opacity cursor-n-resize hover:scale-125 ${!isAnyDragging ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'} ${isDragging ? 'opacity-100' : ''}`}
                onMouseDown={(e) => handleResizeStart(e, key, 'n')}
              />
              <div
                className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full transition-opacity cursor-s-resize hover:scale-125 ${!isAnyDragging ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'} ${isDragging ? 'opacity-100' : ''}`}
                onMouseDown={(e) => handleResizeStart(e, key, 's')}
              />
              <div
                className={`absolute -left-0.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full transition-opacity cursor-w-resize hover:scale-125 ${!isAnyDragging ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'} ${isDragging ? 'opacity-100' : ''}`}
                onMouseDown={(e) => handleResizeStart(e, key, 'w')}
              />
              <div
                className={`absolute -right-0.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full transition-opacity cursor-e-resize hover:scale-125 ${!isAnyDragging ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'} ${isDragging ? 'opacity-100' : ''}`}
                onMouseDown={(e) => handleResizeStart(e, key, 'e')}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
