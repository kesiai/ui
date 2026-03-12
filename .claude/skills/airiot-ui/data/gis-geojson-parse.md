# GeoJSON 层

## 简介

`GeoJson` 是一个 GeoJSON 数据加载和渲染组件，用于在地图上显示 GeoJSON 格式的矢量数据。

- **多数据源支持**：支持远程 URL 和本地文件路径两种数据源
- **多坐标系转换**：支持 EPSG:4326、EPSG:3857、GCJ02、BD09 等坐标系
- **丰富样式配置**：支持线条颜色、宽度、填充颜色、文本标签等样式
- **动态属性样式**：根据 Feature 属性自动应用样式
- **灵活图层控制**：可配置透明度、层级、缩放范围等图层属性

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `source` | `string` | 否 | `''` | GeoJSON 数据的远程 URL |
| `geoJsonFile` | `string` | 否 | - | GeoJSON 文件的本地路径（与 source 二选一） |
| `coordinateType` | `string` | 否 | `'EPSG:4326'` | 数据的坐标系类型 |
| `lineStyle` | `LineStyle` | 否 | - | 线条样式配置 |
| `title` | `string` | 否 | `'geojson'` | 图层标题 |
| `layerBase` | `LayerBase` | 否 | - | 图层基础配置（透明度、层级等） |
| `display` | `boolean` | 否 | `true` | 是否显示图层 |
| `className` | `string` | 否 | - | 自定义 CSS 类名 |
| `cellKey` | `string` | 否 | - | 单元格唯一标识 |
| `map` | `Map` | 否 | - | 地图实例（通常从 Context 获取） |

### LineStyle

线条样式配置。

```typescript
interface LineStyle {
  color?: string           // 线条颜色，默认 'rgba(255, 0, 0, 1)'
  width?: number          // 线条宽度，默认 2
  background?: string     // 填充颜色，默认 'rgba(255, 255, 255, 0.2)'
  text?: {                // 文本标签配置
    font?: string         // 字体大小和字体族
    // 其他 OpenLayers Text 样式属性
  }
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
  maxZoom?: number        // 最大缩放级别
  minZoom?: number        // 最小缩放级别
}
```

### Feature 属性样式

GeoJSON Feature 的属性会影响样式，支持的属性包括：

- `stroke` / `strokeColor` / `color`：线条颜色
- `stroke-width` / `strokeWidth` / `width`：线条宽度
- `fill` / `background`：填充颜色
- `fill-opacity` / `fillOpacity`：填充透明度
- `stroke-opacity` / `strokeOpacity`：线条透明度
- `name`：文本标签内容
- `textFont`：文本字体

## 基本用法

### 1. 加载远程 GeoJSON 数据

从远程 URL 加载 GeoJSON 数据。

```tsx
import { MapContainer } from '@/registry/components/airiot/gis-map-core'
import { GeoJson } from '@/registry/components/airiot/gis-geojson-parse'

function RemoteGeoJsonLayer() {
  return (
    <MapContainer>
      <GeoJson
        source="https://example.com/data/geojson.json"
        coordinateType="EPSG:4326"
        cellKey="remote-geojson"
      />
    </MapContainer>
  )
}
```

### 2. 加载本地 GeoJSON 文件

从项目本地路径加载 GeoJSON 文件。

```tsx
function LocalGeoJsonLayer() {
  return (
    <MapContainer>
      <GeoJson
        geoJsonFile="/data/areas.geojson"
        coordinateType="EPSG:4326"
        cellKey="local-geojson"
      />
    </MapContainer>
  )
}
```

### 3. 自定义线条样式

配置线条的颜色、宽度和填充颜色。

```tsx
function StyledGeoJsonLayer() {
  return (
    <MapContainer>
      <GeoJson
        source="/data/boundaries.geojson"
        coordinateType="EPSG:4326"
        lineStyle={{
          color: 'rgba(255, 0, 0, 1)',
          width: 3,
          background: 'rgba(255, 255, 255, 0.2)'
        }}
        cellKey="styled-geojson"
      />
    </MapContainer>
  )
}
```

### 4. 设置透明度

通过 layerBase 配置图层透明度。

```tsx
function TransparentGeoJsonLayer() {
  return (
    <MapContainer>
      <GeoJson
        source="/data/regions.geojson"
        coordinateType="EPSG:4326"
        lineStyle={{
          color: 'blue',
          width: 2,
          background: 'rgba(0, 0, 255, 0.3)'
        }}
        layerBase={{
          opacity: 0.6,
          zIndex: 10
        }}
        cellKey="transparent-geojson"
      />
    </MapContainer>
  )
}
```

### 5. 多坐标系支持

使用不同的坐标系加载数据。

```tsx
function GCJ02GeoJsonLayer() {
  return (
    <MapContainer>
      <GeoJson
        source="/data/china-areas.geojson"
        coordinateType="GCJ02"
        lineStyle={{
          color: 'green',
          width: 2,
          background: 'rgba(0, 255, 0, 0.1)'
        }}
        cellKey="gcj02-geojson"
      />
    </MapContainer>
  )
}
```

### 6. 限制显示范围

设置图层的最小和最大缩放级别。

```tsx
function LimitedZoomGeoJsonLayer() {
  return (
    <MapContainer>
      <GeoJson
        source="/data/cities.geojson"
        coordinateType="EPSG:4326"
        lineStyle={{
          color: 'purple',
          width: 2
        }}
        layerBase={{
          minZoom: 8,
          maxZoom: 15,
          zIndex: 5
        }}
        cellKey="limited-geojson"
      />
    </MapContainer>
  )
}
```

### 7. 动态控制图层显示

通过 display 属性控制图层的显示和隐藏。

```tsx
function DynamicGeoJsonLayer() {
  const [visible, setVisible] = React.useState(true)

  return (
    <div>
      <button onClick={() => setVisible(!visible)}>
        {visible ? '隐藏' : '显示'}图层
      </button>

      <MapContainer>
        <GeoJson
          source="/data/polygons.geojson"
          coordinateType="EPSG:4326"
          display={visible}
          cellKey="dynamic-geojson"
        />
      </MapContainer>
    </div>
  )
}
```

## 完整示例

### 多 GeoJSON 图层叠加

叠加多个 GeoJSON 图层，展示不同类型的地理数据。

```tsx
import { MapContainer } from '@/registry/components/airiot/gis-map-core'
import { GeoJson } from '@/registry/components/airiot/gis-geojson-parse'

function MultiGeoJsonMap() {
  return (
    <MapContainer
      width="100%"
      height="600px"
      viewOptions={{
        position: { center: [116.391, 39.9042] },
        zoom: 10
      }}
    >
      {/* 省界图层 */}
      <GeoJson
        source="/data/provinces.geojson"
        coordinateType="EPSG:4326"
        title="省界"
        lineStyle={{
          color: 'rgba(0, 0, 255, 1)',
          width: 3,
          background: 'rgba(0, 0, 255, 0.1)'
        }}
        layerBase={{
          opacity: 1,
          zIndex: 1,
          minZoom: 0,
          maxZoom: 10
        }}
        display={true}
        cellKey="province-layer"
      />

      {/* 市界图层 */}
      <GeoJson
        source="/data/cities.geojson"
        coordinateType="EPSG:4326"
        title="市界"
        lineStyle={{
          color: 'rgba(255, 0, 0, 1)',
          width: 2,
          background: 'rgba(255, 0, 0, 0.1)'
        }}
        layerBase={{
          opacity: 1,
          zIndex: 2,
          minZoom: 8,
          maxZoom: 18
        }}
        display={true}
        cellKey="city-layer"
      />

      {/* 区域填充图层 */}
      <GeoJson
        source="/data/areas.geojson"
        coordinateType="EPSG:4326"
        title="区域"
        lineStyle={{
          color: 'rgba(0, 255, 0, 1)',
          width: 1,
          background: 'rgba(0, 255, 0, 0.2)'
        }}
        layerBase={{
          opacity: 0.7,
          zIndex: 0
        }}
        display={true}
        cellKey="area-layer"
      />
    </MapContainer>
  )
}
```

### 使用 Feature 属性样式

GeoJSON 数据中的 Feature 属性会影响样式。

```tsx
function FeaturePropertyStyles() {
  // GeoJSON 数据示例
  const geojsonData = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "name": "区域A",
          "stroke": "#FF0000",
          "stroke-width": 3,
          "fill": "#FF0000",
          "fill-opacity": 0.2
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[...]]]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "name": "区域B",
          "stroke": "#00FF00",
          "strokeWidth": 2,
          "background": "#00FF00",
          "fillOpacity": 0.3
        },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[...]]]
        }
      }
    ]
  }

  return (
    <MapContainer>
      <GeoJson
        source="/data/styled-features.geojson"
        coordinateType="EPSG:4326"
        lineStyle={{
          // 默认样式，会被 Feature 属性覆盖
          color: 'rgba(128, 128, 128, 1)',
          width: 1,
          background: 'rgba(128, 128, 128, 0.1)'
        }}
        cellKey="feature-styles"
      />
    </MapContainer>
  )
}
```

### 带文本标签的 GeoJSON

在地图上显示 Feature 的名称标签。

```tsx
function LabeledGeoJsonLayer() {
  return (
    <MapContainer>
      <GeoJson
        source="/data/labeled-areas.geojson"
        coordinateType="EPSG:4326"
        lineStyle={{
          color: 'rgba(0, 100, 255, 1)',
          width: 2,
          background: 'rgba(0, 100, 255, 0.1)',
          text: {
            font: '14px Calibri,sans-serif'
          }
        }}
        cellKey="labeled-geojson"
      />
    </MapContainer>
  )
}
```

### 动态切换 GeoJSON 数据源

根据用户选择动态加载不同的 GeoJSON 数据。

```tsx
function DynamicGeoJsonSource() {
  const [dataSource, setDataSource] = React.useState('provinces')

  const dataSources = {
    provinces: '/data/provinces.geojson',
    cities: '/data/cities.geojson',
    districts: '/data/districts.geojson'
  }

  return (
    <div>
      <select value={dataSource} onChange={(e) => setDataSource(e.target.value)}>
        <option value="provinces">省界</option>
        <option value="cities">市界</option>
        <option value="districts">区县界</option>
      </select>

      <MapContainer>
        <GeoJson
          source={dataSources[dataSource]}
          coordinateType="EPSG:4326"
          lineStyle={{
            color: 'rgba(0, 0, 255, 1)',
            width: 2
          }}
          key={dataSource} // key 变化时重新创建组件
          cellKey="dynamic-source"
        />
      </MapContainer>
    </div>
  )
}
```

### 响应式样式配置

根据地图缩放级别动态调整样式。

```tsx
function ResponsiveStyleGeoJson() {
  const [zoom, setZoom] = React.useState(10)

  const lineStyle = React.useMemo(() => {
    if (zoom < 8) {
      return {
        color: 'rgba(0, 0, 255, 1)',
        width: 1,
        background: 'rgba(0, 0, 255, 0.05)'
      }
    } else if (zoom < 12) {
      return {
        color: 'rgba(0, 100, 255, 1)',
        width: 2,
        background: 'rgba(0, 100, 255, 0.1)'
      }
    } else {
      return {
        color: 'rgba(255, 0, 0, 1)',
        width: 3,
        background: 'rgba(255, 0, 0, 0.2)',
        text: {
          font: '14px Calibri,sans-serif'
        }
      }
    }
  }, [zoom])

  return (
    <MapContainer
      onZoomChange={(newZoom) => setZoom(newZoom)}
    >
      <GeoJson
        source="/data/multi-level.geojson"
        coordinateType="EPSG:4326"
        lineStyle={lineStyle}
        layerBase={{
          minZoom: 0,
          maxZoom: 18,
          zIndex: 10
        }}
        cellKey="responsive-geojson"
      />
    </MapContainer>
  )
}
```

## 注意事项

1. **数据源二选一**：`source` 和 `geoJsonFile` 两个参数只能使用一个，优先使用 `geoJsonFile`

2. **URL 自动处理**：非 http 开头的相对路径会自动拼接 `window.location.origin`

3. **坐标系匹配**：`coordinateType` 必须与 GeoJSON 数据的实际坐标系一致，否则会出现位置偏移

4. **样式优先级**：Feature 属性中的样式会覆盖 `lineStyle` 配置的默认样式

5. **性能考虑**：大型 GeoJSON 文件可能影响加载性能，建议：
   - 使用简化算法减少顶点数量
   - 设置合适的 `minZoom` 和 `maxZoom` 控制显示范围
   - 考虑使用矢量瓦片替代

6. **文本标签性能**：大量 Feature 同时显示文本标签会影响性能，建议在特定缩放级别才显示

7. **透明度设置**：`layerBase.opacity` 控制整个图层的透明度，`lineStyle.background` 中的 alpha 值控制填充透明度

8. **图层更新**：样式变化时会更新图层样式而不重新创建，但数据源变化会重新创建图层

9. **cellKey 唯一性**：确保 `cellKey` 在同一地图中唯一，否则可能导致图层冲突

10. **跨域问题**：远程 GeoJSON 文件必须支持 CORS 或配置为同源，否则无法加载

11. **Feature 属性解析**：组件会自动解析多种命名格式的属性（如 `stroke-width` 和 `strokeWidth`）

12. **坐标转换**：组件会自动将数据坐标转换为地图坐标系，无需手动转换
