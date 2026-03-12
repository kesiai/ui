# GisMapCore 地图容器

## 导入路径

```tsx
import {
  GisMapCore,
  GisCustomLayer,
  GisPolygonDraw,
  GisTableLayer,
  GisGeojsonParse,
  GisWarnLayer,
  GisXyzTile,
  GisGeoserverWms
} from '@/components/airiot/gis'
```

## 完整使用示例

```tsx
import {
  GisMapCore,
  GisCustomLayer,
  GisPolygonDraw,
  GisTableLayer,
  GisGeojsonParse,
  GisWarnLayer,
  GisXyzTile,
  GisGeoserverWms
} from '@/components/airiot/gis'
import { Button } from '@/components/airiot/button'
import { Text } from '@/components/airiot/text'

function GisMapExample() {
  // 地图配置
  const mapConfig = {
    center: [116.397428, 39.90923], // 北京坐标
    zoom: 11,
    style: {
      width: '100%',
      height: '600px'
    }
  }

  // 图层数据
  const geojsonData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[[116.3, 39.8], [116.5, 39.8], [116.5, 40.0], [116.3, 40.0], [116.3, 39.8]]]
        },
        properties: {
          name: '示例区域'
        }
      }
    ]
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Text variant="title">GIS地图示例</Text>
        <div className="space-x-2">
          <Button onClick={() => console.log('重置视图')}>重置视图</Button>
          <Button onClick={() => console.log('添加图层')}>添加图层</Button>
        </div>
      </div>

      <GisMapCore {...mapConfig}>
        {/* 底图 */}
        <GisXyzTile
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* GeoJSON图层 */}
        <GisGeojsonParse
          data={geojsonData}
          style={{
            fillColor: '#3388ff',
            fillOpacity: 0.3,
            color: '#3388ff',
            weight: 2
          }}
        />

        {/* 自定义图层 */}
        <GisCustomLayer
          id="custom-layer"
          render={(map, view) => {
            // 自定义渲染逻辑
            return null
          }}
        />

        {/* 警告图层 */}
        <GisWarnLayer
          data={[
            { id: 1, coordinates: [116.4, 39.9], type: 'warning' },
            { id: 2, coordinates: [116.5, 39.9], type: 'error' }
          ]}
          onFeatureClick={(feature) => {
            console.log('点击了警告点:', feature)
          }}
        />

        {/* 表格数据图层 */}
        <GisTableLayer
          api="/api/points"
          onFeatureClick={(feature) => {
            console.log('点击了表格数据点:', feature)
          }}
        />

        {/* 绘制工具 */}
        <GisPolygonDraw
          onCreate={(polygon) => {
            console.log('创建了多边形:', polygon)
          }}
          onEdit={(polygon) => {
            console.log('编辑了多边形:', polygon)
          }}
          onDelete={(polygon) => {
            console.log('删除了多边形:', polygon)
          }}
        />
      </GisMapCore>
    </div>
  )
}
```

## Props

### GisMapCore

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| center | [number, number] | - | 地图中心坐标 [lng, lat] |
| zoom | number | 10 | 缩放级别 |
| style | React.CSSProperties | - | 地图容器样式 |
| minZoom | number | 1 | 最小缩放级别 |
| maxZoom | number | 20 | 最大缩放级别 |

### GisGeojsonParse

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | GeoJSON | - | GeoJSON数据 |
| style | GeoJSON.Style | - | 样式配置 |
| popup | boolean | true | 是否显示弹窗 |

### GisCustomLayer

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| id | string | - | 图层ID |
| render | (map: any, view: any) => ReactNode | - | 自定义渲染函数 |

### GisTableLayer

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| api | string | - | 数据API |
| coordinateField | string | 'coordinates' | 坐标字段名 |
| onFeatureClick | (feature: any) => void | - | 点击事件 |

### GisWarnLayer

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | Array | - | 警告数据数组 |
| onFeatureClick | (feature: any) => void | - | 点击事件 |

### GisXyzTile

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| url | string | - | 瓦片服务URL |
| attribution | string | - | 版权信息 |

### GisGeoserverWms

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| url | string | - | GeoServer WMS URL |
| layers | string | - | 图层名称 |
| styles | string | - | 样式名称 |

### GisPolygonDraw

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| onCreate | (polygon: GeoJSON) => void | - | 创建事件 |
| onEdit | (polygon: GeoJSON) => void | - | 编辑事件 |
| onDelete | (polygon: GeoJSON) => void | - | 删除事件 |

## 注意事项

- GisMapCore 是地图容器，必须作为最外层组件
- 其他GIS组件必须作为 GisMapCore 的子组件使用
- 多个图层会按顺序渲染，后面的图层会覆盖前面的图层
- 使用自定义图层时，需要在组件卸载时清理资源