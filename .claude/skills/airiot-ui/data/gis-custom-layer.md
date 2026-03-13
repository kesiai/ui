### ⚠️ 组合使用说明

> **重要**: gis-custom-layer 是 GIS系统 的子组件，不能单独使用。
>
> 必须配合父组件 gis-map-core 使用。请查看 [GIS系统 完整指南](data/gis-system.md) 了解正确的使用方法。

# 自定义层

## 简介

`CustomViews` 是一个自定义矢量图层组件，用于在地图上绘制点、线、面、圆等几何图形。

- **多种几何类型**：支持 Point（点）、LineString（线）、Polygon（多边形）、Circle（圆）等多种几何类型
- **灵活样式配置**：支持自定义点图标、线颜色、填充色等样式，数据和图层样式可灵活合并
- **数据驱动渲染**：通过外部数据数组驱动图层渲染，适合动态数据场景
- **坐标自动转换**：自动将 WGS84 坐标转换为地图投影坐标系
- **样式优先级**：数据样式优先级高于图层样式，实现个性化展示

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `drawLine` | `DrawLineItem[]` | 否 | `[]` | 绘制数据数组，每个元素包含位置和样式信息 |
| `featureStyle` | `FeatureStyle` | 否 | `{}` | 图层默认样式配置，包含点和线的样式 |
| `display` | `boolean` | 否 | `true` | 是否显示图层 |
| `className` | `string` | 否 | - | 自定义 CSS 类名 |
| `cellKey` | `string` | 否 | - | 单元格唯一标识 |
| `map` | `Map` | 否 | - | 地图实例（通常从 Context 获取） |

### DrawLineItem

绘制数据项结构。

```typescript
interface DrawLineItem {
  location?: {
    type?: 'Point' | 'LineString' | 'Polygon' | 'Circle'  // 几何类型
    coordinates?: number[] | number[][] | number[][][] | { center: number[]; radius: number }  // 坐标数据
    data?: Array<{
      type: 'Point' | 'LineString' | 'Polygon' | 'Circle'
      coordinates: any
    }>  // 或使用 data 数组支持多个几何图形
    style?: {
      point?: PointStyle
      line?: LineStyle
    }
  }
  style?: {
    point?: PointStyle
    line?: LineStyle
  }
  [key: string]: unknown
}
```

### FeatureStyle

图层样式配置。

```typescript
interface FeatureStyle {
  point?: PointStyle
  line?: LineStyle
}
```

### PointStyle

点要素样式。

```typescript
interface PointStyle {
  src?: string    // 图标 URL（支持 SVG、PNG 等格式）
  scale?: number  // 图标缩放比例，默认 1
  color?: string  // 颜色（保留字段，当前版本未使用）
}
```

### LineStyle

线要素样式。

```typescript
interface LineStyle {
  color?: string      // 线条颜色，支持 rgba、hex 等格式，默认 'rgba(255, 0, 0, 0.8)'
  width?: number      // 线条宽度，默认 2
  fillColor?: string  // 填充颜色（多边形），默认 'rgba(255, 0, 0, 0.2)'
  snumber?: boolean   // 是否显示序号标签，默认 false
}
```

## 基本用法

### 1. 绘制点

在地图上绘制单个点标记。

```tsx
import { MapContainer } from '@/components/airiot/gis-map-core'
import { CustomViews } from '@/components/airiot/gis-custom-layer'

function PointLayer() {
  const data = [{
    location: {
      type: 'Point',
      coordinates: [116.391, 39.9042]  // 北京
    }
  }]

  return (
    <MapContainer>
      <CustomViews
        drawLine={data}
        cellKey="point-layer"
      />
    </MapContainer>
  )
}
```

### 2. 绘制线段

绘制一条线段。

```tsx
function LineLayer() {
  const data = [{
    location: {
      type: 'LineString',
      coordinates: [
        [116.391, 39.9042],
        [117.116, 40.363]
      ]
    }
  }]

  return (
    <MapContainer>
      <CustomViews
        drawLine={data}
        cellKey="line-layer"
      />
    </MapContainer>
  )
}
```

### 3. 绘制多边形

绘制一个多边形区域。

```tsx
function PolygonLayer() {
  const data = [{
    location: {
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
  }]

  return (
    <MapContainer>
      <CustomViews
        drawLine={data}
        cellKey="polygon-layer"
      />
    </MapContainer>
  )
}
```

### 4. 绘制圆形

绘制一个圆形区域。

```tsx
function CircleLayer() {
  const data = [{
    location: {
      type: 'Circle',
      coordinates: {
        center: [116.391, 39.9042],
        radius: 10000  // 半径（米）
      }
    }
  }]

  return (
    <MapContainer>
      <CustomViews
        drawLine={data}
        cellKey="circle-layer"
      />
    </MapContainer>
  )
}
```

### 5. 自定义样式

配置自定义的线条和填充样式。

```tsx
function CustomStyleLayer() {
  const data = [{
    location: {
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
  }]

  return (
    <MapContainer>
      <CustomViews
        drawLine={data}
        featureStyle={{
          line: {
            color: 'rgba(0, 255, 0, 0.8)',
            width: 3,
            fillColor: 'rgba(0, 255, 0, 0.3)'
          }
        }}
        cellKey="custom-style-layer"
      />
    </MapContainer>
  )
}
```

### 6. 自定义点图标

使用自定义图标绘制点。

```tsx
function CustomIconLayer() {
  const data = [{
    location: {
      type: 'Point',
      coordinates: [116.391, 39.9042]
    }
  }]

  return (
    <MapContainer>
      <CustomViews
        drawLine={data}
        featureStyle={{
          point: {
            src: '/path/to/icon.png',
            scale: 1.5
          }
        }}
        cellKey="custom-icon-layer"
      />
    </MapContainer>
  )
}
```

### 7. 多图形组合

在一个图层中绘制多个不同类型的图形。

```tsx
function MultiGeometryLayer() {
  const data = [
    {
      location: {
        type: 'Point',
        coordinates: [116.391, 39.9042]
      }
    },
    {
      location: {
        type: 'LineString',
        coordinates: [
          [116.391, 39.9042],
          [117.116, 40.363]
        ]
      }
    },
    {
      location: {
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
    }
  ]

  return (
    <MapContainer>
      <CustomViews
        drawLine={data}
        cellKey="multi-geometry-layer"
      />
    </MapContainer>
  )
}
```

## 完整示例

### 数据样式与图层样式合并

演示数据级样式如何覆盖图层默认样式。

```tsx
import { MapContainer } from '@/components/airiot/gis-map-core'
import { CustomViews } from '@/components/airiot/gis-custom-layer'

function StyleOverrideExample() {
  const data = [
    {
      location: {
        type: 'Polygon',
        coordinates: [
          [
            [115.774679, 40.702960],
            [116.649460, 40.365613],
            [115.800787, 39.864378],
            [115.774679, 40.702960]
          ]
        ],
        style: {
          line: {
            color: 'rgba(255, 0, 0, 1)',  // 数据样式：红色
            width: 4,
            fillColor: 'rgba(255, 0, 0, 0.5)'
          }
        }
      }
    },
    {
      location: {
        type: 'Polygon',
        coordinates: [
          [
            [116.5, 39.8],
            [117.0, 39.8],
            [117.0, 40.2],
            [116.5, 40.2],
            [116.5, 39.8]
          ]
        ]
        // 无样式，使用图层默认样式
      }
    }
  ]

  return (
    <MapContainer
      width="100%"
      height="600px"
      viewOptions={{
        position: { center: [116.391, 39.9042] },
        zoom: 9
      }}
    >
      <CustomViews
        drawLine={data}
        featureStyle={{
          line: {
            color: 'rgba(0, 255, 0, 0.8)',  // 图层默认样式：绿色
            width: 2,
            fillColor: 'rgba(0, 255, 0, 0.2)'
          }
        }}
        cellKey="style-override-layer"
      />
    </MapContainer>
  )
}
```

### 使用 data 数组绘制多个几何图形

演示如何在一个数据项中绘制多个几何图形。

```tsx
function MultipleGeometriesExample() {
  const data = [{
    location: {
      data: [
        {
          type: 'Point',
          coordinates: [116.391, 39.9042]
        },
        {
          type: 'Point',
          coordinates: [117.116, 40.363]
        },
        {
          type: 'LineString',
          coordinates: [
            [116.391, 39.9042],
            [117.116, 40.363]
          ]
        }
      ],
      style: {
        point: {
          src: '/marker-icon.png',
          scale: 1
        },
        line: {
          color: 'rgba(255, 0, 0, 0.8)',
          width: 2
        }
      }
    }
  }]

  return (
    <MapContainer
      width="100%"
      height="500px"
      viewOptions={{
        position: { center: [116.7, 40.1] },
        zoom: 9
      }}
    >
      <CustomViews
        drawLine={data}
        cellKey="multiple-geometries-layer"
      />
    </MapContainer>
  )
}
```

### 动态数据更新

演示如何动态更新图层数据。

```tsx
function DynamicUpdateExample() {
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setData([
        {
          location: {
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
        }
      ])
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <MapContainer
      width="100%"
      height="500px"
      viewOptions={{
        position: { center: [116.391, 39.9042] },
        zoom: 9
      }}
    >
      <CustomViews
        drawLine={data}
        display={true}
        cellKey="dynamic-update-layer"
      />
    </MapContainer>
  )
}
```

## 注意事项

1. **坐标格式**：所有坐标使用 [经度, 纬度] 格式（WGS84），组件会自动转换为地图投影坐标系

2. **多边形坐标闭合**：多边形的最后一个坐标点应与第一个坐标点相同，形成闭合区域

3. **数据样式优先级**：当数据项和图层都配置了样式时，数据样式（`location.style` 或 `item.style`）优先级更高

4. **location.data 与 location.type**：使用 `location.data` 数组可以绘制多个几何图形，使用 `location.type` 只能绘制单个图形

5. **点图标默认值**：未配置点图标时，使用默认的 SVG 图标（蓝色标记）

6. **圆形半径单位**：圆形的 radius 参数单位为米

7. **坐标转换**：组件内部使用 `fromLonLat` 进行坐标转换，确保与地图坐标系一致

8. **性能优化**：大量图形时建议使用数据表图层（gis-table-layer）而非自定义层，以获得更好的性能

9. **display 属性**：设置 `display={false}` 可以隐藏图层而不销毁，适合需要频繁切换显示的场景

10. **cellKey 唯一性**：同一地图上的多个图层应使用不同的 cellKey，以避免冲突
