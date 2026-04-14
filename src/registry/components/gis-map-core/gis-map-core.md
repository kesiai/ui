> **安装命令**: `npx shadcn@latest add @kesi/gis-map-core`

# 2D地图

## 简介

`MapContainer` 是一个基于 OpenLayers 的二维地图容器组件，用于构建 GIS 地图应用。

- **OpenLayers 集成**：基于成熟的 OpenLayers 地图库，提供稳定可靠的地图渲染能力
- **灵活视图控制**：支持中心位置、缩放级别、旋转角度等多种视图参数配置
- **丰富控件**：内置缩放控件和比例尺，可自定义显示和样式
- **边界限制**：支持拖拽边界范围设置，限制用户地图操作范围
- **Context 传递**：通过 React Context 向子组件传递地图实例，实现图层组件化

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `width` | `string \| number` | 否 | `'100%'` | 地图容器宽度，支持百分比或像素值 |
| `height` | `string \| number` | 否 | `'400px'` | 地图容器高度，支持百分比或像素值 |
| `viewOptions` | `ViewOptions` | 否 | `{position: {center: [116.391, 39.9042]}, zoom: 10, maxZoom: 18, minZoom: 3, rotation: 0, animation: true, duration: 1000}` | 视图配置对象，包含中心点、缩放级别、旋转等参数 |
| `zoomOption` | `ZoomOption` | 否 | `{show: true, zoomInTipLabel: '放大', zoomOutTipLabel: '缩小', minZoom: 3, maxZoom: 18}` | 缩放控件配置 |
| `scaleLine` | `ScaleLineOption` | 否 | `{show: true, bar: false, text: false}` | 比例尺配置 |
| `extentOption` | `ExtentOption` | 否 | `{}` | 拖拽边界范围配置，限制地图可视范围 |
| `className` | `string` | 否 | - | 自定义 CSS 类名 |
| `children` | `ReactNode` | 否 | - | 子组件，通常为图层组件 |

### ViewOptions

视图配置对象，控制地图的显示状态。

```typescript
interface ViewOptions {
  position?: {
    center?: [number, number]  // 中心点坐标 [经度, 纬度]，默认 [116.391, 39.9042] (北京)
    pick?: boolean
  }
  zoom?: number              // 缩放级别，默认 10
  maxZoom?: number           // 最大缩放级别，默认 18
  minZoom?: number           // 最小缩放级别，默认 3
  rotation?: number          // 旋转角度（度），默认 0
  animation?: boolean        // 是否启用动画，默认 true
  duration?: number          // 动画持续时间（毫秒），默认 1000
}
```

### ZoomOption

缩放控件配置。

```typescript
interface ZoomOption {
  show?: boolean             // 是否显示缩放控件，默认 true
  zoomInTipLabel?: string    // 放大按钮提示文本，默认 '放大'
  zoomOutTipLabel?: string   // 缩小按钮提示文本，默认 '缩小'
  minZoom?: number           // 最小缩放级别
  maxZoom?: number           // 最大缩放级别
}
```

### ScaleLineOption

比例尺控件配置。

```typescript
interface ScaleLineOption {
  show?: boolean             // 是否显示比例尺，默认 true
  minWidth?: number          // 最小宽度（像素）
  units?: 'metric' | 'us' | 'nautical' | 'degrees'  // 单位类型，默认 'metric'
  steps?: number             // 步数
  bar?: boolean              // 是否显示为条形比例尺，默认 false
  text?: boolean             // 是否显示文本比例尺，默认 false
}
```

### ExtentOption

拖拽边界范围配置，限制用户拖拽地图的可视范围。

```typescript
interface ExtentOption {
  westLon?: number   // 西边界经度
  southLat?: number  // 南边界纬度
  eastLon?: number   // 东边界经度
  northLat?: number  // 北边界纬度
}
```

## 基本用法

### 1. 基础地图

创建一个基本的地图容器，使用默认配置。

```tsx
import { MapContainer } from '@/components/kesi/gis-map-core'

function BasicMap() {
  return (
    <MapContainer
      width="100%"
      height="400px"
    />
  )
}
```

### 2. 自定义视图

设置地图中心点、缩放级别和旋转角度。

```tsx
function CustomViewMap() {
  return (
    <MapContainer
      width="100%"
      height="400px"
      viewOptions={{
        position: {
          center: [121.4737, 31.2304],  // 上海
        },
        zoom: 12,
        rotation: 45,
        animation: true,
        duration: 1500
      }}
    />
  )
}
```

### 3. 限制拖拽范围

设置地图的拖拽边界，防止用户拖出指定范围。

```tsx
function BoundedMap() {
  return (
    <MapContainer
      width="100%"
      height="400px"
      extentOption={{
        westLon: 115.0,
        southLat: 39.0,
        eastLon: 118.0,
        northLat: 41.0
      }}
    />
  )
}
```

### 4. 自定义控件

配置缩放控件和比例尺的显示样式。

```tsx
function CustomControlsMap() {
  return (
    <MapContainer
      width="100%"
      height="400px"
      zoomOption={{
        show: true,
        zoomInTipLabel: '放大地图',
        zoomOutTipLabel: '缩小地图'
      }}
      scaleLine={{
        show: true,
        units: 'metric',
        bar: true,
        text: true
      }}
    />
  )
}
```

### 5. 禁用控件

隐藏所有默认控件，实现纯净地图显示。

```tsx
function CleanMap() {
  return (
    <MapContainer
      width="100%"
      height="400px"
      zoomOption={{ show: false }}
      scaleLine={{ show: false }}
    />
  )
}
```

### 6. 响应式尺寸

使用百分比实现响应式地图。

```tsx
function ResponsiveMap() {
  return (
    <MapContainer
      width="100%"
      height="100vh"
    />
  )
}
```

## 完整示例

### 城市地图应用

创建一个以北京市为中心的地图应用，配置合理的缩放范围和控件。

```tsx
import { MapContainer } from '@/components/kesi/gis-map-core'

function BeijingMap() {
  return (
    <MapContainer
      width="100%"
      height="600px"
      viewOptions={{
        position: {
          center: [116.391, 39.9042],  // 北京天安门
        },
        zoom: 10,
        maxZoom: 18,
        minZoom: 5,
        rotation: 0,
        animation: true,
        duration: 1000
      }}
      zoomOption={{
        show: true,
        zoomInTipLabel: '放大',
        zoomOutTipLabel: '缩小'
      }}
      scaleLine={{
        show: true,
        units: 'metric',
        bar: true
      }}
      extentOption={{
        westLon: 115.0,
        southLat: 39.0,
        eastLon: 118.0,
        northLat: 41.0
      }}
    />
  )
}
```

### 嵌入图层组件

在地图容器中添加子图层组件。

```tsx
import { MapContainer } from '@/components/kesi/gis-map-core'
import { XYZ } from '@/components/kesi/gis-xyz-tile'

function MapWithLayers() {
  return (
    <MapContainer
      width="100%"
      height="500px"
      viewOptions={{
        position: { center: [116.391, 39.9042] },
        zoom: 10
      }}
    >
      <XYZ
        source="http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
      />
    </MapContainer>
  )
}
```

## 注意事项

1. **坐标系默认为 EPSG:3857**：组件内部使用 Web Mercator 投影，中心点坐标应使用经纬度格式 [经度, 纬度]，组件会自动转换为 EPSG:3857

2. **默认底图为高德地图**：组件内置高德地图瓦片作为底图，如需更换底图，建议通过子组件添加其他瓦片图层

3. **子组件需在地图就绪后渲染**：子图层组件会在地图实例创建完成后自动渲染，无需手动等待

4. **边界范围需要完整配置**：使用 `extentOption` 时，必须同时提供 `westLon`、`southLat`、`eastLon`、`northLat` 四个参数

5. **旋转角度以度为单位**：`rotation` 参数使用角度而非弧度，内部会自动转换为弧度

6. **动画仅影响视图变化**：动画参数 (`animation` 和 `duration`) 只影响通过 props 更新视图时的效果，不影响用户手动操作

7. **通过 Context 获取地图实例**：子组件可以使用 `useMap()` Hook 获取地图实例，无需通过 props 传递
