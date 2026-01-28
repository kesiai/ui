'use client'

import React, { ReactNode, useRef } from 'react'
import { useContainerWidth, Responsive } from 'react-grid-layout'
import type { Layout } from 'react-grid-layout'
import type { GridItemLayout, GridLayoutSettings } from '../layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

interface GridLayoutEditorProps {
  children: ReactNode
  layout: GridItemLayout[]
  settings: GridLayoutSettings
  onLayoutChange: (layout: GridItemLayout[]) => void
  containerStyle?: React.CSSProperties
}

export function GridLayoutEditor({
  children,
  layout,
  settings,
  onLayoutChange,
  containerStyle
}: GridLayoutEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, mounted } = useContainerWidth()

  const childrenArray = React.Children.toArray(children)

  // 转换 layout 为 v2 格式
  const layouts: Record<string, Layout> = {
    lg: layout,
    md: layout,
    sm: layout,
    xs: layout,
    xxs: layout
  }

  const handleLayoutChange = (currentLayout: Layout) => {
    console.log('Grid布局变化:', currentLayout)
    onLayoutChange(currentLayout as GridItemLayout[])
  }

  if (!mounted) {
    return (
      <div style={containerStyle} className="p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-blue-800">⏳ 正在加载Grid编辑器...</p>
      </div>
    )
  }

  // 创建 breakpoints 和 cols 配置
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
  const cols = { lg: settings.cols, md: settings.cols, sm: settings.cols, xs: settings.cols, xxs: settings.cols }

  return (
    <div ref={containerRef} style={containerStyle}>
      <Responsive
        width={width}
        breakpoints={breakpoints}
        cols={cols}
        layouts={layouts}
        rowHeight={settings.yheight}
        margin={[settings.margin, settings.margin]}
        containerPadding={[settings.gridMargin, settings.gridMargin]}
        onLayoutChange={handleLayoutChange}
      >
        {childrenArray.map((child) => {
          const childElement = child as React.ReactElement
          return (
            <div key={childElement.key}>
              {child}
            </div>
          )
        })}
      </Responsive>
    </div>
  )
}
