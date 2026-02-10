# 连线

## 简介

`ConnectWidget` 是一个功能强大的可视化连线组件，用于创建和编辑各种类型的连接线。

- **多种连线类型**：支持直线、折弯线和贝塞尔曲线三种连线方式
- **丰富的箭头样式**：提供9种箭头样式，包括实心/空心箭头、菱形、圆形和方形
- **动画效果**：支持虚线流动动画，可自定义速度和方向
- **交互式编辑**：可视化拖拽编辑模式，支持添加、移动和合并节点
- **高度可定制**：线条颜色、宽度、圆弧大小等参数均可灵活配置

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `pathValue` | `LineSegment[]` | 否 | `[{ startPoint: { x: 50, y: 150 }, endPoint: { x: 350, y: 150 } }]` | 线段数据数组，定义连线的路径 |
| `onPathValueChange` | `(pathValue: LineSegment[]) => void` | 否 | - | 线段数据改变时的回调函数 |
| `shape` | `'line' \| 'narrow-s' \| 'bezier'` | 否 | `'line'` | 连线类型：直线/折弯线/贝塞尔曲线 |
| `stroke` | `string` | 否 | `'#000000'` | 线条颜色 |
| `strokeWidth` | `number` | 否 | `2` | 线条宽度，范围 1-20 |
| `startArrow` | `ArrowType` | 否 | `'none'` | 起点箭头样式 |
| `startArrowSize` | `number` | 否 | `2` | 起点箭头大小，范围 1-10 |
| `endArrow` | `ArrowType` | 否 | `'none'` | 终点箭头样式 |
| `endArrowSize` | `number` | 否 | `2` | 终点箭头大小，范围 1-10 |
| `radiusQ` | `number` | 否 | `6` | 折弯线圆弧大小，范围 0-50 |
| `animation` | `AnimationConfig` | 否 | - | 动画配置对象 |
| `editMode` | `boolean` | 否 | `true` | 是否启用编辑模式 |
| `width` | `number` | 否 | `400` | 画布宽度，范围 100-1000 |
| `height` | `number` | 否 | `300` | 画布高度，范围 100-800 |

### LineSegment

线段数据结构，定义连线中的一段：

```typescript
interface LineSegment {
  startPoint: Point  // 起点坐标
  endPoint: Point    // 终点坐标
  p1?: Point         // 贝塞尔曲线控制点1（仅贝塞尔曲线）
  p2?: Point         // 贝塞尔曲线控制点2（仅贝塞尔曲线）
}

interface Point {
  x: number
  y: number
}
```

### ArrowType

箭头类型枚举：

- `'none'` - 无箭头
- `'arrow'` - 实心箭头
- `'arrowOpen'` - 空心箭头
- `'diamond'` - 实心菱形
- `'diamondOpen'` - 空心菱形
- `'circle'` - 实心圆形
- `'circleOpen'` - 空心圆形
- `'square'` - 实心方形
- `'squareOpen'` - 空心方形

### AnimationConfig

动画配置对象：

```typescript
interface AnimationConfig {
  show: boolean                              // 是否开启动画
  duration?: number                          // 动画时长（秒）
  timing?: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'  // 缓动函数
  orientation?: 'forward' | 'reverse'        // 动画方向
  strokeDasharray?: string                   // 虚线间隔，如 "10, 10"
  strokeLinejoin?: 'round' | 'miter' | 'bevel'  // 线条连接处样式
}
```

## 基本用法

### 1. 直线连接

最简单的直线连接，适合简单的两点连接场景。

```tsx
import { ConnectWidget } from '@/registry/components/connect-widget'

function Example() {
  return (
    <ConnectWidget
      shape="line"
      stroke="#3b82f6"
      strokeWidth={3}
      startArrow="arrow"
      endArrow="arrow"
    />
  )
}
```

### 2. 折弯线连接

使用折弯线创建正交连线，自动添加圆角过渡。

```tsx
function Example() {
  return (
    <ConnectWidget
      shape="narrow-s"
      stroke="#10b981"
      strokeWidth={2}
      radiusQ={10}
      startArrow="diamond"
      endArrow="arrow"
    />
  )
}
```

### 3. 贝塞尔曲线

使用平滑的贝塞尔曲线连接两点。

```tsx
function Example() {
  return (
    <ConnectWidget
      shape="bezier"
      stroke="#f59e0b"
      strokeWidth={3}
      startArrow="circle"
      endArrow="arrowOpen"
    />
  )
}
```

### 4. 带动画的连线

添加虚线流动动画效果，适合数据流向指示。

```tsx
function Example() {
  return (
    <ConnectWidget
      shape="line"
      stroke="#8b5cf6"
      strokeWidth={2}
      animation={{
        show: true,
        duration: 2,
        strokeDasharray: "10, 10",
        timing: "linear",
        orientation: "forward"
      }}
    />
  )
}
```

### 5. 禁用编辑模式

在只读模式下使用连线，禁止用户编辑。

```tsx
function Example() {
  return (
    <ConnectWidget
      shape="line"
      stroke="#64748b"
      strokeWidth={2}
      editMode={false}
      width={600}
      height={400}
    />
  )
}
```

### 6. 多段折弯线

创建复杂的多段折弯线路径。

```tsx
function Example() {
  const [pathValue, setPathValue] = useState([
    { startPoint: { x: 50, y: 100 }, endPoint: { x: 200, y: 100 } },
    { startPoint: { x: 200, y: 100 }, endPoint: { x: 200, y: 250 } },
    { startPoint: { x: 200, y: 250 }, endPoint: { x: 400, y: 250 } }
  ])

  return (
    <ConnectWidget
      shape="narrow-s"
      pathValue={pathValue}
      onPathValueChange={setPathValue}
      stroke="#ef4444"
      strokeWidth={3}
      radiusQ={8}
    />
  )
}
```

### 7. 自定义尺寸

自定义画布尺寸以适应不同的布局需求。

```tsx
function Example() {
  return (
    <ConnectWidget
      shape="line"
      stroke="#0ea5e9"
      strokeWidth={4}
      startArrow="square"
      startArrowSize={3}
      endArrow="diamond"
      endArrowSize={3}
      width={800}
      height={600}
    />
  )
}
```

## 完整示例

### 流程图连线系统

实现一个流程图的连线系统，支持多种箭头组合和动画效果。

```tsx
import { ConnectWidget } from '@/registry/components/connect-widget'
import { useState } from 'react'

function FlowchartExample() {
  const [connections, setConnections] = useState([
    {
      id: 1,
      pathValue: [{ startPoint: { x: 100, y: 50 }, endPoint: { x: 300, y: 50 } }],
      shape: 'line' as const,
      startArrow: 'none' as const,
      endArrow: 'arrow' as const
    },
    {
      id: 2,
      pathValue: [{ startPoint: { x: 300, y: 100 }, endPoint: { x: 300, y: 200 } }],
      shape: 'narrow-s' as const,
      startArrow: 'none' as const,
      endArrow: 'arrow' as const
    }
  ])

  return (
    <div className="space-y-4">
      {connections.map((conn) => (
        <ConnectWidget
          key={conn.id}
          pathValue={conn.pathValue}
          shape={conn.shape}
          stroke="#3b82f6"
          strokeWidth={2}
          startArrow={conn.startArrow}
          endArrow={conn.endArrow}
          animation={{
            show: true,
            duration: 3,
            strokeDasharray: "8, 8",
            timing: "linear"
          }}
        />
      ))}
    </div>
  )
}
```

### 数据流向可视化

展示数据从多个源流向单一目标的场景。

```tsx
import { ConnectWidget } from '@/registry/components/connect-widget'

function DataFlowExample() {
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* 左侧数据源到中心 */}
      <ConnectWidget
        pathValue={[{ startPoint: { x: 0, y: 75 }, endPoint: { x: 150, y: 75 } }]}
        shape="bezier"
        stroke="#10b981"
        strokeWidth={2}
        startArrow="circle"
        endArrow="arrow"
        animation={{
          show: true,
          duration: 2,
          strokeDasharray: "6, 6",
          timing: "linear"
        }}
        width={200}
        height={150}
      />

      {/* 中心到右侧目标 */}
      <ConnectWidget
        pathValue={[{ startPoint: { x: 50, y: 75 }, endPoint: { x: 200, y: 75 } }]}
        shape="bezier"
        stroke="#f59e0b"
        strokeWidth={2}
        startArrow="none"
        endArrow="diamond"
        animation={{
          show: true,
          duration: 2.5,
          strokeDasharray: "8, 8",
          timing: "ease-in-out"
        }}
        width={250}
        height={150}
      />
    </div>
  )
}
```

### 交互式连线编辑器

一个完整的连线编辑器，支持实时编辑和预览。

```tsx
import { ConnectWidget } from '@/registry/components/connect-widget'
import { useState } from 'react'

function InteractiveEditor() {
  const [pathValue, setPathValue] = useState([
    { startPoint: { x: 50, y: 100 }, endPoint: { x: 350, y: 100 } }
  ])

  const [config, setConfig] = useState({
    shape: 'narrow-s' as const,
    stroke: '#3b82f6',
    strokeWidth: 3,
    startArrow: 'none' as const,
    endArrow: 'arrow' as const,
    radiusQ: 10,
    animation: {
      show: false,
      duration: 2,
      strokeDasharray: "10, 10",
      timing: 'linear' as const,
      orientation: 'forward' as const
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
        <label>
          连线类型:
          <select
            value={config.shape}
            onChange={(e) => setConfig({ ...config, shape: e.target.value as any })}
            className="ml-2"
          >
            <option value="line">直线</option>
            <option value="narrow-s">折弯线</option>
            <option value="bezier">贝塞尔曲线</option>
          </select>
        </label>

        <label>
          颜色:
          <input
            type="color"
            value={config.stroke}
            onChange={(e) => setConfig({ ...config, stroke: e.target.value })}
            className="ml-2"
          />
        </label>

        <label>
          线宽:
          <input
            type="number"
            value={config.strokeWidth}
            onChange={(e) => setConfig({ ...config, strokeWidth: Number(e.target.value) })}
            className="ml-2 w-16"
            min={1}
            max={20}
          />
        </label>

        <label>
          动画:
          <input
            type="checkbox"
            checked={config.animation.show}
            onChange={(e) => setConfig({
              ...config,
              animation: { ...config.animation, show: e.target.checked }
            })}
            className="ml-2"
          />
        </label>
      </div>

      <ConnectWidget
        pathValue={pathValue}
        onPathValueChange={setPathValue}
        {...config}
      />
    </div>
  )
}
```

## 注意事项

1. **编辑模式的使用**：`editMode=true` 时，用户可以拖拽节点编辑连线；设置为 `false` 可用于展示只读连线。在编辑模式下，悬停在线段中点会显示添加新节点的提示。

2. **折弯线的特殊行为**：当 `shape="narrow-s"` 且只有一条线段时，组件会自动生成水平→垂直的折弯路径。如果起点和终点在同一水平或垂直线上，则不会折弯。

3. **动画性能**：动画效果使用 CSS animation 实现，对于大量连线组件，建议根据实际性能考虑是否启用动画。虚线间隔格式为 "实线长度, 间隙长度"，如 "10, 10" 表示 10px 实线和 10px 间隙。

4. **节点合并与拆分**：在编辑模式下拖动中间点时，如果点移动到其连接的两条线段形成的直线上，会自动合并。离开直线后会自动重新拆分。这提供了流畅的编辑体验。

5. **箭头大小与线宽关系**：箭头实际大小由 `startArrowSize/endArrowSize` 和 `strokeWidth` 共同决定。公式为 `scale = arrowSize * strokeWidth`，调整时建议保持比例协调。

6. **折弯线的圆弧半径**：`radiusQ` 参数控制折弯处的圆弧大小。中间线段的圆弧是两端线段的 2 倍。值越大，圆弧越平缓；值为 0 时为直角。

7. **受控与非受控模式**：组件支持两种模式。传入 `pathValue` 和 `onPathValueChange` 为受控模式；仅传入 `pathValue` 或不传为非受控模式，组件内部管理状态。

8. **贝塞尔曲线控制点**：当 `shape="bezier"` 时，每条线段可以包含 `p1` 和 `p2` 控制点。如果不提供，组件会自动生成默认控制点位置。
