> **安装命令**: `npx shadcn@latest add @kesi/gis-geoserver-wms`

# geoserver-wms层

## 简介

`GisGeoserverWms` 是一个 GeoServer WMS 服务图层组件，用于加载和显示 GeoServer 发布的 WMS 地图服务。

- **标准 WMS 支持**：完整支持 WMS 1.1.0、1.1.1、1.3.0 等多个版本
- **灵活投影配置**：支持 EPSG:4326、EPSG:3857 等多种投影类型
- **图层属性控制**：可配置透明度、层级、缩放范围等图层属性
- **动态刷新机制**：支持参数变化时自动刷新图层
- **GeoServer 优化**：针对 GeoServer 服务进行了优化配置

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `source` | `string` | 否 | `'http://localhost:8080/geoserver/wms'` | GeoServer WMS 服务地址 URL |
| `VERSION` | `string` | 否 | `'1.1.0'` | WMS 服务版本号，支持 '1.1.0'、'1.1.1'、'1.3.0' |
| `layers` | `string` | 否 | `'workspace:layer'` | WMS 图层名称，格式为 'workspace:layer' |
| `coordinateType` | `string` | 否 | `'EPSG:4326'` | 投影类型，支持 'EPSG:4326'、'EPSG:3857'、'WGS84'、'WGS1984'、'EPSG:900913'、'EPSG:102100'、'WebMercator' |
| `title` | `string` | 否 | `'geoserver-wms'` | 图层标题 |
| `layerBase` | `LayerBase` | 否 | - | 图层基础配置（透明度、层级等） |
| `display` | `boolean` | 否 | `true` | 是否显示图层 |
| `className` | `string` | 否 | - | 自定义 CSS 类名 |
| `cellKey` | `string` | 否 | - | 单元格唯一标识 |
| `map` | `Map` | 否 | - | 地图实例（通常从 Context 获取） |

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

### 1. 基础 WMS 图层

加载 GeoServer 发布的 WMS 图层。

```tsx
import { GisMapCore } from '@/components/kesi/gis-map-core'
import { GisGeoserverWms } from '@/components/kesi/gis-geoserver-wms'

function BasicWMSLayer() {
  return (
    <GisMapCore>
      <GisGeoserverWms
        source="http://localhost:8080/geoserver/wms"
        layers="workspace:layer_name"
        VERSION="1.1.0"
        coordinateType="EPSG:4326"
        cellKey="wms-layer"
      />
    </GisMapCore>
  )
}
```

### 2. 自定义投影

使用不同的投影类型加载 WMS 图层。

```tsx
function CustomProjectionWMS() {
  return (
    <GisMapCore>
      <GisGeoserverWms
        source="http://localhost:8080/geoserver/wms"
        layers="workspace:layer_name"
        VERSION="1.1.0"
        coordinateType="EPSG:3857"
        cellKey="wms-3857-layer"
      />
    </GisMapCore>
  )
}
```

### 3. 设置透明度

配置图层的透明度。

```tsx
function TransparentWMS() {
  return (
    <GisMapCore>
      <GisGeoserverWms
        source="http://localhost:8080/geoserver/wms"
        layers="workspace:layer_name"
        VERSION="1.1.0"
        coordinateType="EPSG:4326"
        layerBase={{
          opacity: 0.7,
          zIndex: 1
        }}
        cellKey="transparent-wms-layer"
      />
    </GisMapCore>
  )
}
```

### 4. 限制缩放范围

设置图层的最小和最大缩放级别。

```tsx
function LimitedZoomWMS() {
  return (
    <GisMapCore>
      <GisGeoserverWms
        source="http://localhost:8080/geoserver/wms"
        layers="workspace:layer_name"
        VERSION="1.1.0"
        coordinateType="EPSG:4326"
        layerBase={{
          minZoom: 8,
          maxZoom: 15
        }}
        cellKey="limited-zoom-wms-layer"
      />
    </GisMapCore>
  )
}
```

### 5. WMS 1.3.0 版本

使用 WMS 1.3.0 协议版本。

```tsx
function WMS130Version() {
  return (
    <GisMapCore>
      <GisGeoserverWms
        source="http://localhost:8080/geoserver/wms"
        layers="workspace:layer_name"
        VERSION="1.3.0"
        coordinateType="EPSG:4326"
        cellKey="wms130-layer"
      />
    </GisMapCore>
  )
}
```

### 6. 多图层叠加

叠加多个 WMS 图层。

```tsx
function MultiWMSLayers() {
  return (
    <GisMapCore
      width="100%"
      height="600px"
      viewOptions={{
        position: { center: [116.391, 39.9042] },
        zoom: 10
      }}
    >
      {/* 底层：基础图层 */}
      <GisGeoserverWms
        source="http://localhost:8080/geoserver/wms"
        layers="workspace:base_layer"
        VERSION="1.1.0"
        coordinateType="EPSG:4326"
        layerBase={{
          opacity: 1,
          zIndex: 0
        }}
        cellKey="base-wms-layer"
      />

      {/* 顶层：叠加图层 */}
      <GisGeoserverWms
        source="http://localhost:8080/geoserver/wms"
        layers="workspace:overlay_layer"
        VERSION="1.1.0"
        coordinateType="EPSG:4326"
        layerBase={{
          opacity: 0.8,
          zIndex: 1
        }}
        cellKey="overlay-wms-layer"
      />
    </GisMapCore>
  )
}
```

### 7. 动态切换图层

根据条件动态切换不同的 WMS 图层。

```tsx
function DynamicWMSLayer() {
  const [layerName, setLayerName] = React.useState('layer_a')

  return (
    <div>
      <button onClick={() => setLayerName('layer_a')}>图层 A</button>
      <button onClick={() => setLayerName('layer_b')}>图层 B</button>

      <GisMapCore>
        <GisGeoserverWms
          source="http://localhost:8080/geoserver/wms"
          layers={`workspace:${layerName}`}
          VERSION="1.1.0"
          coordinateType="EPSG:4326"
          cellKey="dynamic-wms-layer"
        />
      </GisMapCore>
    </div>
  )
}
```

## 完整示例

### 带控制面板的 WMS 应用

创建一个完整的 WMS 图层应用，包含透明度控制和图层切换。

```tsx
import { GisMapCore } from '@/components/kesi/gis-map-core'
import { GisGeoserverWms } from '@/components/kesi/gis-geoserver-wms'

function WMSApplication() {
  const [opacity, setOpacity] = React.useState(1)
  const [currentLayer, setCurrentLayer] = React.useState('roads')
  const [display, setDisplay] = React.useState(true)

  const layers = [
    { id: 'roads', name: '道路层' },
    { id: 'buildings', name: '建筑层' },
    { id: 'vegetation', name: '植被层' }
  ]

  return (
    <div className="flex h-screen">
      {/* 控制面板 */}
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-lg font-bold mb-4">图层控制</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">选择图层</label>
          <select
            value={currentLayer}
            onChange={(e) => setCurrentLayer(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {layers.map(layer => (
              <option key={layer.id} value={layer.id}>
                {layer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            透明度: {opacity}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={display}
              onChange={(e) => setDisplay(e.target.checked)}
              className="mr-2"
            />
            显示图层
          </label>
        </div>
      </div>

      {/* 地图 */}
      <div className="flex-1">
        <GisMapCore
          width="100%"
          height="100%"
          viewOptions={{
            position: { center: [116.391, 39.9042] },
            zoom: 12
          }}
        >
          <GisGeoserverWms
            source="http://localhost:8080/geoserver/wms"
            layers={`workspace:${currentLayer}`}
            VERSION="1.1.0"
            coordinateType="EPSG:4326"
            layerBase={{
              opacity,
              zIndex: 1
            }}
            display={display}
            cellKey="app-wms-layer"
          />
        </GisMapCore>
      </div>
    </div>
  )
}
```

### 多版本 WMS 对比

同时展示不同 WMS 版本的图层进行对比。

```tsx
function WMSVersionComparison() {
  return (
    <GisMapCore
      width="100%"
      height="600px"
      viewOptions={{
        position: { center: [116.391, 39.9042] },
        zoom: 10
      }}
    >
      {/* WMS 1.1.0 */}
      <GisGeoserverWms
        source="http://localhost:8080/geoserver/wms"
        layers="workspace:layer_name"
        VERSION="1.1.0"
        coordinateType="EPSG:4326"
        layerBase={{
          opacity: 0.5,
          zIndex: 0
        }}
        title="WMS 1.1.0"
        cellKey="wms110-layer"
      />

      {/* WMS 1.3.0 */}
      <GisGeoserverWms
        source="http://localhost:8080/geoserver/wms"
        layers="workspace:layer_name"
        VERSION="1.3.0"
        coordinateType="EPSG:4326"
        layerBase={{
          opacity: 0.5,
          zIndex: 1
        }}
        title="WMS 1.3.0"
        cellKey="wms130-layer"
      />
    </GisMapCore>
  )
}
```

### 动态更新 WMS 参数

演示如何动态更新 WMS 图层的参数。

```tsx
function DynamicWMSParams() {
  const [wmsParams, setWmsParams] = React.useState({
    layers: 'workspace:layer_a',
    version: '1.1.0',
    opacity: 1
  })

  const updateLayer = (layerName: string) => {
    setWmsParams(prev => ({ ...prev, layers: `workspace:${layerName}` }))
  }

  const updateVersion = (version: string) => {
    setWmsParams(prev => ({ ...prev, version }))
  }

  return (
    <div>
      <div className="mb-4 space-x-2">
        <button onClick={() => updateLayer('layer_a')}>图层 A</button>
        <button onClick={() => updateLayer('layer_b')}>图层 B</button>
        <button onClick={() => updateVersion('1.1.0')}>1.1.0</button>
        <button onClick={() => updateVersion('1.3.0')}>1.3.0</button>
      </div>

      <GisMapCore
        width="100%"
        height="500px"
        viewOptions={{
          position: { center: [116.391, 39.9042] },
          zoom: 10
        }}
      >
        <GisGeoserverWms
          source="http://localhost:8080/geoserver/wms"
          layers={wmsParams.layers}
          VERSION={wmsParams.version}
          coordinateType="EPSG:4326"
          layerBase={{
            opacity: wmsParams.opacity
          }}
          cellKey="dynamic-params-wms-layer"
        />
      </GisMapCore>
    </div>
  )
}
```

## 注意事项

1. **图层名称格式**：`layers` 参数必须使用 'workspace:layer' 格式，确保 workspace 和 layer name 正确

2. **投影类型匹配**：`coordinateType` 必须与 GeoServer 发布的图层投影一致，否则会导致坐标系错误

3. **WMS 版本选择**：不同版本的 WMS 协议参数略有差异，建议根据 GeoServer 配置选择合适的版本

4. **跨域问题**：确保 GeoServer 配置了 CORS，否则需要通过代理访问

5. **图层刷新**：当 `layers`、`VERSION`、`display` 参数变化时，组件会自动刷新图层

6. **透明度叠加**：多个 WMS 图层叠加时，注意调整 `zIndex` 和 `opacity` 以获得最佳视觉效果

7. **性能优化**：WMS 图层每次缩放都会请求服务器，建议合理设置 `minZoom` 和 `maxZoom` 避免不必要的请求

8. **服务可用性**：使用前确保 GeoServer 服务正常运行，图层已正确发布

9. **认证配置**：如果 GeoServer 需要认证，需在 source URL 中包含认证信息或配置代理

10. **参数更新频率**：频繁更新 WMS 参数可能导致大量请求，建议使用防抖或节流控制更新频率
