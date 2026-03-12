## GisCustomLayer - GIS自定义图层组件

### 导入路径
```tsx
import { GisCustomLayer } from '@/components/airiot/gis-custom-layer/gis-custom-layer'
```

### 基础用法
```tsx
import { GisCustomLayer, GisMapCore } from '@/components/airiot'

function CustomLayerExample() {
  return (
    <GisMapCore>
      <GisCustomLayer
        type="polygon"
        data={customData}
        style={{
          fillColor: 'blue',
          fillOpacity: 0.5,
          strokeColor: 'darkblue',
          strokeWidth: 2
        }}
      />
    </GisMapCore>
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | 'point' \| 'line' \| 'polygon' \| 'marker' | 'point' | 图层类型 |
| data | Array | [] | 地理数据 |
| style | object | {} | 样式配置 |
| onClick | (feature) => void | - | 点击事件 |

### 示例
```tsx
import { GisCustomLayer, GisMapCore, Card } from '@/components/airiot'

function SalesMap() {
  const salesData = [
    {
      id: 1,
      name: '北京',
      coordinates: [116.40, 39.90],
      value: 1500000
    },
    {
      id: 2,
      name: '上海',
      coordinates: [121.47, 31.23],
      value: 2000000
    },
    {
      id: 3,
      name: '广州',
      coordinates: [113.23, 23.16],
      value: 1200000
    }
  ]

  return (
    <Card cardTitle="销售分布图">
      <GisMapCore
        center={[116.40, 39.90]}
        zoom={5}
        style={{ height: 500 }}
      >
        <GisCustomLayer
          type="point"
          data={salesData}
          style={{
            radius: (feature) => Math.sqrt(feature.value) / 1000,
            fillColor: (feature) => {
              if (feature.value > 1800000) return 'red'
              if (feature.value > 1300000) return 'orange'
              return 'green'
            },
            fillOpacity: 0.7
          }}
          onClick={(feature) => {
            console.log('点击了:', feature.name, feature.value)
          }}
        />
      </GisMapCore>
    </Card>
  )
}
```

### 数据格式
```typescript
interface GeoFeature {
  id: string | number
  name: string
  coordinates: [number, number] // [经度, 纬度]
  [key: string]: any // 其他自定义属性
}
```

### 支持的样式
- point: radius, fillColor, fillOpacity
- line: strokeColor, strokeWidth, strokeOpacity
- polygon: fillColor, strokeColor, strokeWidth

### 注意事项
- 坐标系使用 WGS84
- 支持动态数据更新
- 可以结合其他图层使用