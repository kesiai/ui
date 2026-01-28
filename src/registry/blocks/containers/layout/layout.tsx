'use client'

import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { FreeLayoutEditor, GridLayoutEditor } from './editors'

// Types
export type LayoutType = 'free' | 'grid' | 'flex' | 'cover'

export interface FreeLayoutSettings {
  resizeGrid: { x: number; y: number }
  dragGrid: { x: number; y: number }
  autoSize: boolean
  deformation: boolean
}

export interface FlexLayoutSettings {
  flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  flexWrap: 'wrap' | 'nowrap' | 'wrap-reverse'
  justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  alignItems: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  alignContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'stretch'
}

export interface GridLayoutSettings {
  cols: number
  yheight: number
  margin: number
  gridMargin: number
}

export interface LayoutSettings {
  free: FreeLayoutSettings
  flex: FlexLayoutSettings
  grid: GridLayoutSettings
}

export interface FreeItemLayout {
  width: number
  height: number
  x: number
  y: number
}

export interface FlexItemLayout {
  width: number
  height: number
}

export interface GridItemLayout {
  x: number
  y: number
  w: number
  h: number
  i: string
}

export interface ComponentLayout {
  free: Record<string, FreeItemLayout>
  flex: Record<string, FlexItemLayout>
  grid: GridItemLayout[]
}

export interface LayoutProps {
  children: ReactNode
  layoutType: LayoutType
  layoutSettings?: LayoutSettings
  componentLayout?: ComponentLayout
  className?: string
  style?: React.CSSProperties
  editable?: boolean
  onLayoutChange?: (layout: ComponentLayout) => void
}

// Free布局渲染器
function FreeLayout({
  children,
  itemLayouts,
  style
}: {
  children: ReactNode
  itemLayouts: Record<string, FreeItemLayout>
  style?: React.CSSProperties
}) {
  const childrenArray = React.Children.toArray(children)

  return (
    <div
      className="relative w-full h-full"
      style={{
        ...style,
        position: 'relative'
      }}
    >
      {childrenArray.map((child, index) => {
        const childElement = child as React.ReactElement
        // 清理 React 内部添加的 key 前缀：.$, ./, 等
        const key = (childElement.key || `child-${index}`).replace(/^\.?\$?\//, '').replace(/^\.\$/, '')
        const layout = itemLayouts[key]

        if (!layout) {
          console.log(`FreeLayout: 没有找到key为 "${key}" 的布局数据`, {
            availableKeys: Object.keys(itemLayouts),
            originalKey: childElement.key
          })
          return (
            <div key={childElement.key || index} className="absolute" style={{ left: 0, top: index * 50 }}>
              {child}
            </div>
          )
        }

        return (
          <div
            key={childElement.key || index}
            className="absolute"
            style={{
              left: `${layout.x}px`,
              top: `${layout.y}px`,
              width: `${layout.width}px`,
              height: `${layout.height}px`
            }}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}

// Flex布局渲染器
function FlexLayout({
  children,
  settings,
  itemLayouts,
  style
}: {
  children: ReactNode
  settings: FlexLayoutSettings
  itemLayouts: Record<string, FlexItemLayout>
  style?: React.CSSProperties
}) {
  const childrenArray = React.Children.toArray(children)

  return (
    <div
      className="flex w-full h-full"
      style={{
        ...style,
        flexDirection: settings.flexDirection,
        flexWrap: settings.flexWrap,
        justifyContent: settings.justifyContent,
        alignItems: settings.alignItems,
        alignContent: settings.alignContent
      }}
    >
      {childrenArray.map((child, index) => {
        const childElement = child as React.ReactElement
        // 清理 React 内部添加的 key 前缀：.$, ./, 等
        const key = (childElement.key || `child-${index}`).replace(/^\.?\$?\//, '').replace(/^\.\$/, '')
        const layout = itemLayouts[key]

        return (
          <div
            key={childElement.key || index}
            style={
              layout
                ? {
                    width: `${layout.width}px`,
                    height: `${layout.height}px`,
                    flexShrink: 0
                  }
                : undefined
            }
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}

// Grid布局渲染器
function GridLayout({
  children,
  settings,
  itemLayouts,
  style
}: {
  children: ReactNode
  settings: GridLayoutSettings
  itemLayouts: GridItemLayout[]
  style?: React.CSSProperties
}) {
  const childrenArray = React.Children.toArray(children)

  // 创建映射以便快速查找
  const layoutMap = new Map(itemLayouts.map(item => [item.i, item]))

  return (
    <div
      className="w-full h-full"
      style={{
        ...style,
        position: 'relative'
      }}
    >
      {childrenArray.map((child, index) => {
        const childElement = child as React.ReactElement
        // 清理 React 内部添加的 key 前缀：.$, ./, 等
        const key = (childElement.key || `child-${index}`).replace(/^\.?\$?\//, '').replace(/^\.\$/, '')
        const layout = layoutMap.get(key)

        if (!layout) {
          console.log(`GridLayout: 没有找到key为 "${key}" 的布局数据`, {
            availableIds: Array.from(layoutMap.keys()),
            originalKey: childElement.key
          })
          return <div key={childElement.key || index}>{child}</div>
        }

        // 计算位置和尺寸
        const left = layout.x * (settings.yheight + settings.margin)
        const top = layout.y * (settings.yheight + settings.margin)
        const width = layout.w * settings.yheight + (layout.w - 1) * settings.margin
        const height = layout.h * settings.yheight + (layout.h - 1) * settings.margin

        return (
          <div
            key={childElement.key || index}
            className="absolute flex items-center justify-center"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${width}px`,
              height: `${height}px`
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              {child}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Cover布局渲染器（叠加布局）
function CoverLayout({
  children,
  style
}: {
  children: ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      className="relative w-full h-full"
      style={style}
    >
      {React.Children.map(children, child => (
        <div className="absolute inset-0 w-full h-full">
          {child}
        </div>
      ))}
    </div>
  )
}

// 主布局组件
export function Layout({
  children,
  layoutType = 'flex',
  layoutSettings,
  componentLayout,
  className,
  style,
  editable = false,
  onLayoutChange
}: LayoutProps) {
  // 默认设置
  const defaultSettings: LayoutSettings = {
    free: {
      resizeGrid: { x: 1, y: 1 },
      dragGrid: { x: 1, y: 1 },
      autoSize: false,
      deformation: false
    },
    flex: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignContent: 'flex-start'
    },
    grid: {
      cols: 12,
      yheight: 30,
      margin: 10,
      gridMargin: 0
    }
  }

  const settings = layoutSettings || defaultSettings

  // 默认布局数据
  const defaultLayout: ComponentLayout = {
    free: {},
    flex: {},
    grid: []
  }

  const layout = componentLayout || defaultLayout

  // 处理布局变化（编辑模式）
  const handleLayoutChange = (newLayout: Partial<ComponentLayout>) => {
    if (editable && onLayoutChange) {
      onLayoutChange({
        ...layout,
        ...newLayout
      })
    }
  }

  // 根据布局类型渲染
  const renderLayout = () => {
    switch (layoutType) {
      case 'free':
        if (editable) {
          return (
            <FreeLayoutEditor
              layout={layout.free}
              settings={settings.free}
              onLayoutChange={(newFreeLayout) => handleLayoutChange({ free: newFreeLayout })}
              containerStyle={style}
            >
              {children}
            </FreeLayoutEditor>
          )
        }
        return (
          <FreeLayout
            itemLayouts={layout.free}
            style={style}
          >
            {children}
          </FreeLayout>
        )

      case 'flex':
        return (
          <FlexLayout
            settings={settings.flex}
            itemLayouts={layout.flex}
            style={style}
          >
            {children}
          </FlexLayout>
        )

      case 'grid':
        if (editable) {
          console.log('使用GridLayoutEditor, layout=', layout.grid)
          return (
            <GridLayoutEditor
              layout={layout.grid}
              settings={settings.grid}
              onLayoutChange={(newGridLayout) => handleLayoutChange({ grid: newGridLayout })}
              containerStyle={style}
            >
              {children}
            </GridLayoutEditor>
          )
        }
        console.log('使用普通GridLayout')
        return (
          <GridLayout
            settings={settings.grid}
            itemLayouts={layout.grid}
            style={style}
          >
            {children}
          </GridLayout>
        )

      case 'cover':
        return (
          <CoverLayout style={style}>
            {children}
          </CoverLayout>
        )

      default:
        return <div>{children}</div>
    }
  }

  return (
    <div className={cn('w-full h-full', className)}>
      {renderLayout()}
    </div>
  )
}
