> **安装命令**: `npx shadcn@latest add @kesi/gis-polygon-draw`

# 区域层

## 简介

`GisPolygonDraw` 是一个区域绘制图层组件，用于在地图上绘制和管理点、线、面、圆等区域几何图形。

- **多种几何类型**：支持 Point、LineString、Polygon、Circle、Semicircle 等多种区域类型
- **灵活样式配置**：支持为不同几何类型配置独立的颜色、宽度、填充等样式
- **序号标签功能**：可在线和多边形上显示序号标签，便于标识顶点顺序
- **数据驱动渲染**：通过外部数据数组驱动图层渲染，适合动态区域数据场景
- **只读模式**：支持只读模式，隐藏绘制工具栏

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `data` | `PolygonData[]` | 否 | `[]` | 区域数据数组，每个元素代表一个几何图形 |
| `defaultStyle` | `PolygonStyle` | 否 | `{}` | 图层默认样式配置，包含图标、线、面、圆、半圆样式 |
| `drawType` | `DrawType` | 否 | `null` | 当前绘制的图形类型 |
| `onDrawTypeChange` | `(type: DrawType) => void` | 否 | - | 绘制类型变化回调函数 |
| `onDataChange` | `(data: PolygonData[]) => void` | 否 | - | 数据变化回调函数 |
| `showToolbar` | `boolean` | 否 | `false` | 是否显示绘制工具栏 |
| `readonly` | `boolean` | 否 | `false` | 是否只读模式 |
| `display` | `boolean` | 否 | `true` | 是否显示图层 |
| `className` | `string` | 否 | - | 自定义 CSS 类名 |
| `cellKey` | `string` | 否 | - | 单元格唯一标识 |
| `map` | `Map` | 否 | - | 地图实例（通常从 Context 获取） |

### PolygonData

区域数据项结构。

```typescript
interface PolygonData {
  id: string                    // 唯一标识
  type: DrawType                // 几何类型
  coordinates: number[] | number[][] | number[][][] | { center: number[]; radius: number }  // 坐标数据
  style?: PolygonStyle          // 单个图形的样式配置
}
```

### DrawType

绘制类型枚举。

```typescript
type DrawType = 'Point' | 'LineString' | 'Polygon' | 'Circle' | 'Semicircle' | null
```

### PolygonStyle

区域样式配置。

```typescript
interface PolygonStyle {
  icon?: {
    src?: string           // 图标 URL
    scale?: number         // 图标缩放比例，默认 1
    displacementX?: number // X 轴偏移
    displacementY?: number // Y 轴偏移
  }
  line?: {
    color?: string    // 线条颜色，默认 'rgba(255, 0, 0, 0.8)'
    width?: number    // 线条宽度，默认 2
    snumber?: boolean // 是否显示序号标签，默认 false
  }
  polygon?: {
    color?: string    // 边框颜色，默认 'rgba(255, 0, 0, 0.8)'
    width?: number    // 边框宽度，默认 2
    fillColor?: string // 填充颜色，默认 'rgba(255, 0, 0, 0.2)'
    snumber?: boolean // 是否显示序号标签，默认 false
  }
  circle?: {
    color?: string    // 边框颜色，默认 'rgba(255, 0, 0, 0.8)'
    width?: number    // 边框宽度，默认 2
    fillColor?: string // 填充颜色，默认 'rgba(255, 0, 0, 0.2)'
  }
  semicircle?: {
    color?: string    // 边框颜色
    width?: number    // 边框宽度
    fillColor?: string // 填充颜色
  }
}
```

## 基本用法

### 1. 绘制线段

在地图上绘制一条线段。

```tsx
import { GisMapCore } from '@/components/kesi/gis-map-core'
import { GisPolygonDraw } from '@/components/kesi/gis-polygon-draw'

function LineStringExample() {
  const data = [{
    id: '1',
    type: 'LineString',
    coordinates: [
      [116.391, 39.9042],
      [117.116, 40.363]
    ]
  }]

  return (
    <GisMapCore>
      <GisPolygonDraw
        data={data}
        cellKey="linestring-layer"
      />
    </GisMapCore>
  )
}
```

### 2. 绘制多边形

绘制一个多边形区域。

```tsx
function PolygonExample() {
  const data = [{
    id: '2',
    type: 'Polygon',
    coordinates: [
      [
        [115.774679, 40.702960],
        [116.649460, 40.365613],
        [115.800787, 39.864378],
        [115.774679, 40.702960]
      ]
    ]
  }]

  return (
    <GisMapCore>
      <GisPolygonDraw
        data={data}
        cellKey="polygon-layer"
      />
    </GisMapCore>
  )
}
```

### 3. 绘制圆形

绘制一个圆形区域。

```tsx
function CircleExample() {
  const data = [{
    id: '3',
    type: 'Circle',
    coordinates: {
      center: [116.391, 39.9042],
      radius: 10000
    }
  }]

  return (
    <GisMapCore>
      <GisPolygonDraw
        data={data}
        cellKey="circle-layer"
      />
    </GisMapCore>
  )
}
```

### 4. 自定义样式

配置自定义的线条和填充样式。

```tsx
function CustomStyleExample() {
  const data = [{
    id: '1',
    type: 'Polygon',
    coordinates: [
      [
        [115.774679, 40.702960],
        [116.649460, 40.365613],
        [115.800787, 39.864378],
        [115.774679, 40.702960]
      ]
    }
  }]

  return (
    <GisMapCore>
      <GisPolygonDraw
        data={data}
        defaultStyle={{
          polygon: {
            color: 'rgba(0, 255, 0, 0.8)',
            width: 3,
            fillColor: 'rgba(0, 255, 0, 0.3)'
          }
        }}
        cellKey="custom-style-layer"
      />
    </GisMapCore>
  )
}
```

### 5. 显示序号标签

在线段和多边形上显示顶点序号。

```tsx
function NumberLabelExample() {
  const data = [{
    id: '1',
    type: 'Polygon',
    coordinates: [
      [
        [115.774679, 40.702960],
        [116.649460, 40.365613],
        [115.800787, 39.864378],
        [115.774679, 40.702960]
      ]
    }
  }]

  return (
    <GisMapCore>
      <GisPolygonDraw
        data={data}
        defaultStyle={{
          polygon: {
            color: 'rgba(255, 0, 0, 0.8)',
            width: 2,
            fillColor: 'rgba(255, 0, 0, 0.2)',
            snumber: true  // 启用序号标签
          }
        }}
        cellKey="number-label-layer"
      />
    </GisMapCore>
  )
}
```

### 6. 多个区域组合

在一个图层中绘制多个不同类型的区域。

```tsx
function MultipleRegionsExample() {
  const data = [
    {
      id: '1',
      type: 'LineString',
      coordinates: [
        [116.391, 39.9042],
        [117.116, 40.363]
      ]
    },
    {
      id: '2',
      type: 'Polygon',
      coordinates: [
        [
          [115.774679, 40.702960],
          [116.649460, 40.365613],
          [115.800787, 39.864378],
          [115.774679, 40.702960]
        ]
      ]
    },
    {
      id: '3',
      type: 'Circle',
      coordinates: {
        center: [117.770612, 40.439482],
        radius: 11800
      }
    }
  ]

  return (
    <GisMapCore>
      <GisPolygonDraw
        data={data}
        cellKey="multiple-regions-layer"
      />
    </GisMapCore>
  )
}
```

### 7. 带工具栏的绘制模式

显示绘制工具栏（需要配合 onDrawTypeChange 和 onDataChange 使用）。

```tsx
function WithToolbarExample() {
  const [drawType, setDrawType] = React.useState(null)
  const [data, setData] = React.useState([])

  return (
    <GisMapCore>
      <GisPolygonDraw
        data={data}
        drawType={drawType}
        onDrawTypeChange={setDrawType}
        onDataChange={setData}
        showToolbar={true}
        cellKey="toolbar-layer"
      />
    </GisMapCore>
  )
}
```

## 完整示例

### 区域管理应用

创建一个完整的区域管理应用，支持区域显示、样式配置和切换。

```tsx
import { GisMapCore } from '@/components/kesi/gis-map-core'
import { GisPolygonDraw } from '@/components/kesi/gis-polygon-draw'

function RegionManagementApp() {
  const [regions, setRegions] = React.useState([
    {
      id: '1',
      type: 'Polygon',
      coordinates: [
        [
          [115.774679, 40.702960],
          [116.649460, 40.365613],
          [115.800787, 39.864378],
          [115.774679, 40.702960]
        ]
      ]
    },
    {
      id: '2',
      type: 'Circle',
      coordinates: {
        center: [117.770612, 40.439482],
        radius: 11800
      }
    }
  ])

  const [selectedRegion, setSelectedRegion] = React.useState(null)
  const [style, setStyle] = React.useState({
    line: {
      color: 'rgba(255, 0, 0, 0.8)',
      width: 2,
      snumber: false
    },
    polygon: {
      color: 'rgba(255, 0, 0, 0.8)',
      width: 2,
      fillColor: 'rgba(255, 0, 0, 0.2)',
      snumber: false
    }
  })

  const toggleRegion = (id: string) => {
    setRegions(prev =>
      prev.map(region =>
        region.id === id
          ? { ...region, style: { visible: !region.style?.visible } }
          : region
      )
    )
  }

  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <div className="w-80 bg-white shadow-lg p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">区域管理</h2>

        {/* 区域列表 */}
        <div className="space-y-2 mb-6">
          <h3 className="font-semibold text-gray-700">区域列表</h3>
          {regions.map(region => (
            <div
              key={region.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span className="text-sm">
                {region.type === 'Polygon' ? '多边形' : '圆形'} #{region.id}
              </span>
              <button
                onClick={() => toggleRegion(region.id)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                切换
              </button>
            </div>
          ))}
        </div>

        {/* 样式配置 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700">样式配置</h3>

          <div>
            <label className="block text-sm mb-1">线条颜色</label>
            <input
              type="color"
              value={style.polygon.color}
              onChange={(e) => setStyle({
                ...style,
                polygon: { ...style.polygon, color: e.target.value }
              })}
              className="w-full h-8"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">线条宽度</label>
            <input
              type="range"
              min="1"
              max="10"
              value={style.polygon.width}
              onChange={(e) => setStyle({
                ...style,
                polygon: { ...style.polygon, width: parseInt(e.target.value) }
              })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">填充颜色</label>
            <input
              type="color"
              value={style.polygon.fillColor}
              onChange={(e) => setStyle({
                ...style,
                polygon: { ...style.polygon, fillColor: e.target.value }
              })}
              className="w-full h-8"
            />
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={style.polygon.snumber}
              onChange={(e) => setStyle({
                ...style,
                polygon: { ...style.polygon, snumber: e.target.checked }
              })}
              className="mr-2"
            />
            显示序号标签
          </label>
        </div>
      </div>

      {/* 地图 */}
      <div className="flex-1">
        <GisMapCore
          width="100%"
          height="100%"
          viewOptions={{
            position: { center: [116.7, 40.2] },
            zoom: 9
          }}
        >
          <GisPolygonDraw
            data={regions}
            defaultStyle={style}
            cellKey="app-layer"
          />
        </GisMapCore>
      </div>
    </div>
  )
}
```

### 动态区域数据更新

演示如何动态更新区域数据。

```tsx
function DynamicRegionUpdate() {
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // 模拟异步加载区域数据
    const fetchData = async () => {
      setLoading(true)
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      setData([
        {
          id: '1',
          type: 'LineString',
          coordinates: [
            [116.391, 39.9042],
            [117.116, 40.363]
          ]
        },
        {
          id: '2',
          type: 'Polygon',
          coordinates: [
            [
              [115.774679, 40.702960],
              [116.649460, 40.365613],
              [115.800787, 39.864378],
              [115.774679, 40.702960]
            ]
          ]
        }
      ])
      setLoading(false)
    }

    fetchData()
  }, [])

  const addRegion = () => {
    const newRegion = {
      id: Date.now().toString(),
      type: 'Circle',
      coordinates: {
        center: [116.5 + Math.random() * 0.5, 39.8 + Math.random() * 0.3],
        radius: 5000 + Math.random() * 10000
      }
    }
    setData([...data, newRegion])
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={addRegion}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          添加随机圆形区域
        </button>
        <span className="ml-4">
          当前区域数量: {data.length}
        </span>
      </div>

      <GisMapCore
        width="100%"
        height="500px"
        viewOptions={{
          position: { center: [116.7, 40.2] },
          zoom: 9
        }}
      >
        <GisPolygonDraw
          data={data}
          defaultStyle={{
            line: {
              color: 'rgba(255, 0, 0, 0.8)',
              width: 2,
              snumber: false
            },
            polygon: {
              color: 'rgba(255, 0, 0, 0.8)',
              width: 2,
              fillColor: 'rgba(255, 0, 0, 0.2)',
              snumber: false
            }
          }}
          display={!loading}
          cellKey="dynamic-update-layer"
        />
      </GisMapCore>
    </div>
  )
}
```

### 只读模式与交互模式对比

演示只读模式和交互模式的区别。

```tsx
function ReadonlyComparison() {
  const data = [{
    id: '1',
    type: 'Polygon',
    coordinates: [
      [
        [115.774679, 40.702960],
        [116.649460, 40.365613],
        [115.800787, 39.864378],
        [115.774679, 40.702960]
      ]
    ]
  }]

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 只读模式 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">只读模式</h3>
        <GisMapCore
          width="100%"
          height="400px"
          viewOptions={{
            position: { center: [116.2, 40.2] },
            zoom: 9
          }}
        >
          <GisPolygonDraw
            data={data}
            readonly={true}
            cellKey="readonly-layer"
          />
        </GisMapCore>
      </div>

      {/* 交互模式 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">交互模式</h3>
        <GisMapCore
          width="100%"
          height="400px"
          viewOptions={{
            position: { center: [116.2, 40.2] },
            zoom: 9
          }}
        >
          <GisPolygonDraw
            data={data}
            showToolbar={true}
            cellKey="interactive-layer"
          />
        </GisMapCore>
      </div>
    </div>
  )
}
```

## 注意事项

1. **坐标格式**：所有坐标使用 [经度, 纬度] 格式（WGS84），组件会自动转换为地图投影坐标系

2. **多边形闭合**：多边形的最后一个坐标点应与第一个坐标点相同，形成闭合区域

3. **圆形半径单位**：圆形的 radius 参数单位为米

4. **样式优先级**：数据项的 `style` 属性优先级高于 `defaultStyle`，可以实现个性化样式

5. **序号标签**：序号标签仅对 LineString 和 Polygon 类型有效，会标注每个顶点的序号

6. **工具栏功能**：`showToolbar` 仅控制工具栏显示，实际的绘制功能需要配合 `onDrawTypeChange` 和 `onDataChange` 实现

7. **只读模式**：`readonly={true}` 时会隐藏工具栏，禁用编辑功能

8. **性能优化**：大量区域时建议设置合理的 `minZoom` 和 `maxZoom`，避免在小缩放级别渲染过多图形

9. **数据唯一性**：每个区域的 `id` 必须唯一，否则可能导致渲染问题

10. **display 属性**：设置 `display={false}` 可以隐藏图层而不销毁，适合需要频繁切换显示的场景
