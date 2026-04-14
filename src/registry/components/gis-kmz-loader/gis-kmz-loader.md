> **安装命令**: `npx shadcn@latest add @kesi/gis-kmz-loader`

# KMZ 层

## 简介

`Kmz` 是一个 KMZ 压缩文件加载和渲染组件，用于在地图上显示 KMZ 格式的地理数据。

- **KMZ 文件支持**：自动解压 KMZ 文件并提取其中的 KML 内容
- **多坐标系转换**：支持 EPSG:4326、EPSG:3857、GCJ02、BD09 等坐标系
- **保留原始样式**：默认提取 KML 中的样式信息
- **灵活图层控制**：可配置透明度、层级、缩放范围等图层属性
- **异步加载**：使用异步加载机制，不阻塞主线程

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `source` | `string` | 否 | `''` | KMZ 文件的远程 URL |
| `kmzFile` | `string` | 否 | - | KMZ 文件的本地路径（与 source 二选一） |
| `coordinateType` | `string` | 否 | `'EPSG:4326'` | 数据的坐标系类型 |
| `title` | `string` | 否 | `'kmz'` | 图层标题 |
| `layerBase` | `LayerBase` | 否 | - | 图层基础配置（透明度、层级等） |
| `display` | `boolean` | 否 | `true` | 是否显示图层 |
| `className` | `string` | 否 | - | 自定义 CSS 类名 |
| `map` | `Map` | 否 | - | 地图实例（通常从 Context 获取） |

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

## 基本用法

### 1. 加载远程 KMZ 文件

从远程 URL 加载 KMZ 文件。

```tsx
import { MapContainer } from '@/components/kesi/gis-map-core'
import { Kmz } from '@/components/kesi/gis-kmz-loader'

function RemoteKmzLayer() {
  return (
    <MapContainer>
      <Kmz
        source="https://example.com/data/areas.kmz"
        coordinateType="EPSG:4326"
      />
    </MapContainer>
  )
}
```

### 2. 加载本地 KMZ 文件

从项目本地路径加载 KMZ 文件。

```tsx
function LocalKmzLayer() {
  return (
    <MapContainer>
      <Kmz
        kmzFile="/data/regions.kmz"
        coordinateType="EPSG:4326"
      />
    </MapContainer>
  )
}
```

### 3. 设置透明度

通过 layerBase 配置图层透明度。

```tsx
function TransparentKmzLayer() {
  return (
    <MapContainer>
      <Kmz
        kmzFile="/data/polygons.kmz"
        coordinateType="EPSG:4326"
        layerBase={{
          opacity: 0.7,
          zIndex: 10
        }}
      />
    </MapContainer>
  )
}
```

### 4. 多坐标系支持

使用不同的坐标系加载数据。

```tsx
function GCJ02KmzLayer() {
  return (
    <MapContainer>
      <Kmz
        kmzFile="/data/china-areas.kmz"
        coordinateType="GCJ02"
        layerBase={{
          zIndex: 5
        }}
      />
    </MapContainer>
  )
}
```

### 5. 限制显示范围

设置图层的最小和最大缩放级别。

```tsx
function LimitedZoomKmzLayer() {
  return (
    <MapContainer>
      <Kmz
        source="/data/cities.kmz"
        coordinateType="EPSG:4326"
        layerBase={{
          minZoom: 8,
          maxZoom: 15,
          zIndex: 5
        }}
      />
    </MapContainer>
  )
}
```

### 6. 动态控制图层显示

通过 display 属性控制图层的显示和隐藏。

```tsx
function DynamicKmzLayer() {
  const [visible, setVisible] = React.useState(true)

  return (
    <div>
      <button onClick={() => setVisible(!visible)}>
        {visible ? '隐藏' : '显示'}图层
      </button>

      <MapContainer>
        <Kmz
          source="/data/areas.kmz"
          coordinateType="EPSG:4326"
          display={visible}
        />
      </MapContainer>
    </div>
  )
}
```

### 7. 动态更新图层属性

动态更新图层的透明度、层级等属性。

```tsx
function DynamicPropsKmzLayer() {
  const [opacity, setOpacity] = React.useState(1)
  const [zIndex, setZIndex] = React.useState(5)

  return (
    <div>
      <label>
        透明度：
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
        />
        {opacity}
      </label>

      <label>
        层级：
        <input
          type="number"
          min="0"
          max="100"
          value={zIndex}
          onChange={(e) => setZIndex(parseInt(e.target.value))}
        />
      </label>

      <MapContainer>
        <Kmz
          source="/data/regions.kmz"
          coordinateType="EPSG:4326"
          layerBase={{
            opacity,
            zIndex
          }}
        />
      </MapContainer>
    </div>
  )
}
```

## 完整示例

### 多 KMZ 图层叠加

叠加多个 KMZ 图层，展示不同类型的地理数据。

```tsx
import { MapContainer } from '@/components/kesi/gis-map-core'
import { Kmz } from '@/components/kesi/gis-kmz-loader'

function MultiKmzMap() {
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
      <Kmz
        source="/data/provinces.kmz"
        coordinateType="EPSG:4326"
        title="省界"
        layerBase={{
          opacity: 1,
          zIndex: 1,
          minZoom: 0,
          maxZoom: 10
        }}
        display={true}
      />

      {/* 市界图层 */}
      <Kmz
        source="/data/cities.kmz"
        coordinateType="EPSG:4326"
        title="市界"
        layerBase={{
          opacity: 1,
          zIndex: 2,
          minZoom: 8,
          maxZoom: 18
        }}
        display={true}
      />

      {/* 区域标注图层 */}
      <Kmz
        source="/data/labels.kmz"
        coordinateType="EPSG:4326"
        title="标注"
        layerBase={{
          opacity: 0.8,
          zIndex: 3,
          minZoom: 12
        }}
        display={true}
      />
    </MapContainer>
  )
}
```

### 动态切换 KMZ 数据源

根据用户选择动态加载不同的 KMZ 文件。

```tsx
function DynamicKmzSource() {
  const [dataSource, setDataSource] = React.useState('provinces')

  const dataSources = {
    provinces: '/data/provinces.kmz',
    cities: '/data/cities.kmz',
    districts: '/data/districts.kmz'
  }

  return (
    <div>
      <select value={dataSource} onChange={(e) => setDataSource(e.target.value)}>
        <option value="provinces">省界</option>
        <option value="cities">市界</option>
        <option value="districts">区县界</option>
      </select>

      <MapContainer>
        <Kmz
          source={dataSources[dataSource]}
          coordinateType="EPSG:4326"
          layerBase={{
            zIndex: 10
          }}
          key={dataSource} // key 变化时重新创建组件
        />
      </MapContainer>
    </div>
  )
}
```

### 带加载状态的 KMZ 图层

显示加载状态，提升用户体验。

```tsx
function KmzLayerWithLoading() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleLoadStart = () => {
    setLoading(true)
    setError(null)
  }

  const handleLoadEnd = () => {
    setLoading(false)
  }

  const handleError = (err: Error) => {
    setLoading(false)
    setError(err.message)
  }

  return (
    <div>
      {loading && <p>正在加载 KMZ 文件...</p>}
      {error && <p style={{ color: 'red' }}>加载失败：{error}</p>}

      <MapContainer>
        <Kmz
          source="/data/large-file.kmz"
          coordinateType="EPSG:4326"
          layerBase={{
            zIndex: 5
          }}
        />
      </MapContainer>
    </div>
  )
}
```

### 分级显示 KMZ 图层

根据地图缩放级别显示不同详细程度的 KMZ 数据。

```tsx
function MultiLevelKmzMap() {
  return (
    <MapContainer
      width="100%"
      height="600px"
      viewOptions={{
        position: { center: [116.391, 39.9042] },
        zoom: 8
      }}
    >
      {/* 低缩放级别：显示省界 */}
      <Kmz
        source="/data/provinces.kmz"
        coordinateType="EPSG:4326"
        layerBase={{
          minZoom: 0,
          maxZoom: 10,
          zIndex: 1
        }}
        display={true}
      />

      {/* 中缩放级别：显示市界 */}
      <Kmz
        source="/data/cities.kmz"
        coordinateType="EPSG:4326"
        layerBase={{
          minZoom: 8,
          maxZoom: 14,
          zIndex: 2
        }}
        display={true}
      />

      {/* 高缩放级别：显示区县界 */}
      <Kmz
        source="/data/districts.kmz"
        coordinateType="EPSG:4326"
        layerBase={{
          minZoom: 12,
          maxZoom: 18,
          zIndex: 3
        }}
        display={true}
      />
    </MapContainer>
  )
}
```

### 响应式图层控制

根据地图状态动态调整图层属性。

```tsx
function ResponsiveKmzLayer() {
  const map = useMap()
  const [zoom, setZoom] = React.useState(10)

  React.useEffect(() => {
    if (!map) return

    const view = map.getView()
    const handleZoomChange = () => {
      setZoom(Math.round(view.getZoom()))
    }

    view.on('change:resolution', handleZoomChange)

    return () => {
      view.un('change:resolution', handleZoomChange)
    }
  }, [map])

  // 根据缩放级别调整透明度和层级
  const opacity = zoom < 8 ? 0.5 : zoom < 12 ? 0.7 : 1
  const zIndex = zoom < 8 ? 1 : zoom < 12 ? 2 : 3

  return (
    <MapContainer>
      <Kmz
        source="/data/adaptive.kmz"
        coordinateType="EPSG:4326"
        layerBase={{
          opacity,
          zIndex,
          minZoom: 0,
          maxZoom: 18
        }}
        display={true}
      />
    </MapContainer>
  )
}
```

## KMZ 文件格式说明

KMZ 文件是一个压缩的 ZIP 文件，包含以下内容：

```
example.kmz
├── doc.kml          # KML 文件（必需）
├── files/           # 附加资源文件夹（可选）
│   ├── image1.png
│   └── image2.jpg
└── ...
```

组件会自动：
1. 解压 KMZ 文件
2. 查找 `.kml` 文件
3. 解析 KML 内容
4. 创建矢量图层并添加到地图

## 注意事项

1. **数据源二选一**：`source` 和 `kmzFile` 两个参数只能使用一个，优先使用 `kmzFile`

2. **URL 自动处理**：非 http 开头的相对路径会自动拼接 `window.location.origin`

3. **坐标系匹配**：`coordinateType` 必须与 KMZ 文件的实际坐标系一致，否则会出现位置偏移

4. **KML 文件查找**：组件会自动查找 KMZ 文件中的第一个 `.kml` 文件

5. **异步加载**：KMZ 文件是异步加载的，加载过程中的错误会在控制台输出

6. **性能考虑**：
   - 大型 KMZ 文件可能影响加载性能
   - 建议设置合适的 `minZoom` 和 `maxZoom` 控制显示范围
   - 考虑使用矢量瓦片替代大型 KMZ 文件

7. **样式保留**：默认 `extractStyles: true` 会保留 KML 中的样式信息

8. **点名称显示**：默认 `showPointNames: false` 不显示点要素的名称

9. **图层更新**：
   - 数据源变化会重新创建图层
   - `layerBase` 属性变化会动态更新图层
   - `display` 变化只更新可见性

10. **跨域问题**：远程 KMZ 文件必须支持 CORS 或配置为同源，否则无法加载

11. **资源清理**：组件卸载时会自动清理图层资源，防止内存泄漏

12. **坐标转换**：组件会自动将数据坐标转换为地图坐标系，无需手动转换

13. **取消机制**：组件内部实现了取消机制，防止快速切换数据源时出现竞态条件

14. **JSZip 依赖**：组件依赖 `jszip` 库来解压 KMZ 文件，确保项目已安装该依赖
