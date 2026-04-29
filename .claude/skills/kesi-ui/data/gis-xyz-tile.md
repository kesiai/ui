> **安装命令**: `npx shadcn@latest add @kesi/gis-xyz-tile`

# xyz层

## 简介

`XYZ` 是一个 XYZ 瓦片图层组件，用于加载和显示标准的 XYZ 瓦片服务。

- **多坐标系支持**：支持 EPSG:3857、EPSG:4326、GCJ02、BD09 等多种坐标系
- **强大的滤镜功能**：支持灰度、反色、褐色、色相旋转等多种 Canvas 滤镜效果
- **灵活图层控制**：可配置透明度、层级、缩放范围等图层属性
- **缓存清除机制**：内置缓存清除参数，确保瓦片及时更新
- **自动坐标转换**：智能处理不同坐标系之间的转换

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `source` | `string` | 否 | `'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'` | XYZ 瓦片服务地址，支持 `{x}`、`{y}`、`{z}` 占位符 |
| `coordinateType` | `string` | 否 | `'EPSG:3857'` | 坐标系类型，支持 'EPSG:3857'、'EPSG:4326'、'GCJ02'、'BD09' |
| `coorDefs` | `CoorDefs` | 否 | `{}` | 自定义坐标系注册配置，用于非标准坐标系 |
| `canvasFilter` | `boolean` | 否 | `false` | 是否启用 Canvas 滤镜效果 |
| `canvasSetting` | `CanvasSetting \| CanvasSetting[]` | 否 | - | Canvas 滤镜配置，包含灰度、反色、褐色等参数 |
| `layerBase` | `LayerBase` | 否 | - | 图层基础配置（透明度、层级等） |
| `display` | `boolean` | 否 | `true` | 是否显示图层 |
| `className` | `string` | 否 | - | 自定义 CSS 类名 |
| `cellKey` | `string` | 否 | - | 单元格唯一标识 |
| `map` | `Map` | 否 | - | 地图实例（通常从 Context 获取） |

### CoorDefs

自定义坐标系注册配置。

```typescript
interface CoorDefs {
  defs?: string          // Proj4js 定义字符串
  extent?: number[]      // 坐标系范围
  unit?: 'degrees' | 'ft' | 'm' | 'pixels' | 'tile-pixels' | 'us-ft'  // 单位
  dataProjection?: string  // 数据投影
}
```

### CanvasSetting

Canvas 滤镜配置对象。

```typescript
interface CanvasSetting {
  grayscale?: number      // 灰度 (0-100)，默认 98
  invert?: number         // 反色 (0-100)，默认 100
  sepia?: number          // 褐色 (0-100)，默认 20
  'hue-rotate'?: number   // 色相旋转 (0-360)，默认 180
  saturate?: number       // 饱和度 (0-3000)，默认 1600
  brightness?: number     // 亮度 (0-500)，默认 80
  contrast?: number       // 对比度 (0-500)，默认 90
}
```

### LayerBase

图层基础配置。

```typescript
interface LayerBase {
  opacity?: number        // 透明度 (0-1)，默认 1
  zIndex?: number         // 图层层级，默认 0
  maxResolution?: number  // 最大分辨率
  minResolution?: number  // 最小分辨率
  maxZoom?: number        // 最大缩放级别，默认 18
  minZoom?: number        // 最小缩放级别，默认 0
}
```

## 基本用法

### 1. 高德地图瓦片

加载高德地图瓦片作为底图。

```tsx
import { GisMapCore } from '@/components/kesi/gis-map-core'
import { XYZ } from '@/components/kesi/gis-xyz-tile'

function AmapLayer() {
  return (
    <GisMapCore>
      <XYZ
        source="http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
        coordinateType="EPSG:3857"
        cellKey="amap-layer"
      />
    </GisMapCore>
  )
}
```

### 2. 天地图瓦片

加载天地图服务。

```tsx
function TiandituLayer() {
  return (
    <GisMapCore>
      <XYZ
        source="https://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}"
        coordinateType="EPSG:3857"
        layerBase={{
          opacity: 1,
          zIndex: 0
        }}
        cellKey="tianditu-layer"
      />
    </GisMapCore>
  )
}
```

### 3. 灰度滤镜地图

使用 Canvas 滤镜创建灰度地图效果。

```tsx
function GrayscaleMap() {
  return (
    <GisMapCore>
      <XYZ
        source="http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
        canvasFilter={true}
        canvasSetting={{
          grayscale: 100,
          invert: 0,
          sepia: 0
        }}
        cellKey="grayscale-layer"
      />
    </GisMapCore>
  )
}
```

### 4. 反色地图

创建反色效果的地图。

```tsx
function InvertedMap() {
  return (
    <GisMapCore>
      <XYZ
        source="http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
        canvasFilter={true}
        canvasSetting={{
          grayscale: 98,
          invert: 100,
          sepia: 20,
          'hue-rotate': 180,
          saturate: 1600,
          brightness: 80,
          contrast: 90
        }}
        cellKey="inverted-layer"
      />
    </GisMapCore>
  )
}
```

### 5. 自定义透明度

设置图层透明度实现半透明效果。

```tsx
function TransparentMap() {
  return (
    <GisMapCore>
      <XYZ
        source="http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
        layerBase={{
          opacity: 0.6,
          zIndex: 0
        }}
        cellKey="transparent-layer"
      />
    </GisMapCore>
  )
}
```

### 6. 限制缩放范围

设置图层的最小和最大缩放级别。

```tsx
function LimitedZoomMap() {
  return (
    <GisMapCore>
      <XYZ
        source="http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
        layerBase={{
          minZoom: 5,
          maxZoom: 15
        }}
        cellKey="limited-zoom-layer"
      />
    </GisMapCore>
  )
}
```

### 7. 多坐标系支持

使用不同的坐标系加载瓦片。

```tsx
function GCJ02Map() {
  return (
    <GisMapCore>
      <XYZ
        source="https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
        coordinateType="GCJ02"
        cellKey="gcj02-layer"
      />
    </GisMapCore>
  )
}
```

## 完整示例

### 多图层叠加

叠加多个 XYZ 瓦片图层，实现丰富的地图效果。

```tsx
import { GisMapCore } from '@/components/kesi/gis-map-core'
import { XYZ } from '@/components/kesi/gis-xyz-tile'

function MultiLayerMap() {
  return (
    <GisMapCore
      width="100%"
      height="600px"
      viewOptions={{
        position: { center: [116.391, 39.9042] },
        zoom: 10
      }}
    >
      {/* 底层：高德地图 */}
      <XYZ
        source="http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
        coordinateType="EPSG:3857"
        layerBase={{
          opacity: 1,
          zIndex: 0,
          minZoom: 0,
          maxZoom: 18
        }}
        cellKey="base-layer"
      />

      {/* 顶层：灰度滤镜图层 */}
      <XYZ
        source="http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
        coordinateType="EPSG:3857"
        canvasFilter={true}
        canvasSetting={{
          grayscale: 100
        }}
        layerBase={{
          opacity: 0.5,
          zIndex: 1
        }}
        display={true}
        cellKey="overlay-layer"
      />
    </GisMapCore>
  )
}
```

### 自定义滤镜效果

创建具有特殊视觉效果的地图。

```tsx
function CustomFilterMap() {
  return (
    <GisMapCore
      width="100%"
      height="500px"
      viewOptions={{
        position: { center: [116.391, 39.9042] },
        zoom: 12
      }}
    >
      <XYZ
        source="http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
        canvasFilter={true}
        canvasSetting={{
          grayscale: 98,
          invert: 100,
          sepia: 20,
          'hue-rotate': 180,
          saturate: 1600,
          brightness: 80,
          contrast: 90
        }}
        layerBase={{
          opacity: 1,
          zIndex: 0
        }}
        display={true}
        cellKey="custom-filter-layer"
      />
    </GisMapCore>
  )
}
```

### 图层动态切换

根据条件动态切换不同的瓦片图层。

```tsx
function DynamicMap() {
  const [useSatellite, setUseSatellite] = React.useState(false)

  return (
    <div>
      <button onClick={() => setUseSatellite(!useSatellite)}>
        切换到{useSatellite ? '矢量' : '卫星'}地图
      </button>

      <GisMapCore
        width="100%"
        height="500px"
        viewOptions={{
          position: { center: [116.391, 39.9042] },
          zoom: 10
        }}
      >
        {/* 矢量地图 */}
        <XYZ
          source="http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}"
          display={!useSatellite}
          layerBase={{ zIndex: 0 }}
          cellKey="vector-layer"
        />

        {/* 卫星地图 */}
        <XYZ
          source="http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}"
          display={useSatellite}
          layerBase={{ zIndex: 0 }}
          cellKey="satellite-layer"
        />
      </GisMapCore>
    </div>
  )
}
```

## 注意事项

1. **瓦片 URL 必须包含占位符**：source 参数必须包含 `{x}`、`{y}`、`{z}` 占位符，部分服务支持 `{1-4}` 等服务器负载均衡占位符

2. **Canvas 滤镜影响性能**：启用 `canvasFilter` 会通过 Canvas 处理每个瓦片，可能影响加载速度和渲染性能，建议仅在需要时使用

3. **坐标系必须与瓦片服务匹配**：`coordinateType` 必须与瓦片服务的实际坐标系一致，否则会出现位置偏移

4. **缓存清除机制**：组件自动添加 `_v` 参数实现缓存清除，当 source、coordinateType 或 canvasSetting 变化时会自动刷新

5. **图层层级控制**：使用 `zIndex` 控制多个图层的叠加顺序，值越大图层越靠上

6. **自定义坐标系需要注册**：使用非标准坐标系时，需要通过 `coorDefs` 提供 Proj4js 定义

7. **滤镜参数范围**：Canvas 滤镜各参数都有有效范围，超出范围可能不会产生预期效果

8. **跨域问题**：瓦片服务必须支持 CORS 或配置为同源，否则无法加载
