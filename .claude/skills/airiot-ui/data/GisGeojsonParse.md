## GisGeojsonParse - GeoJSON解析组件

### 导入路径
```tsx
import { GisGeojsonParse } from '@/components/airiot/gis-geojson-parse/gis-geojson-parse'
```

### 基础用法
```tsx
import { GisGeojsonParse } from '@/components/airiot/gis-geojson-parse/gis-geojson-parse'

function GeojsonParseExample() {
  const geojsonText = `{
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [116.40, 39.90]
        },
        "properties": {
          "name": "北京"
        }
      }
    ]
  }`

  return (
    <GisGeojsonParse
      geojson={geojsonText}
      onError={handleError}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| geojson | string \| object | - | GeoJSON数据 |
| onError | (error) => void | - | 错误回调 |
| validate | boolean | true | 是否验证格式 |

### 示例
```tsx
import { GisGeojsonParse, GisMapCore, Button, Card } from '@/components/airiot'

function GeojsonViewer() {
  const [geojsonInput, setGeojsonInput] = useState('')
  const [geojsonData, setGeojsonData] = useState(null)

  const loadGeojson = () => {
    try {
      const parsed = JSON.parse(geojsonInput)
      setGeojsonData(parsed)
    } catch (error) {
      console.error('GeoJSON格式错误:', error)
    }
  }

  return (
    <Card cardTitle="GeoJSON查看器">
      <div style={{ marginBottom: 16 }}>
        <textarea
          value={geojsonInput}
          onChange={(e) => setGeojsonInput(e.target.value)}
          style={{
            width: '100%',
            height: 200,
            fontFamily: 'monospace'
          }}
          placeholder="粘贴GeoJSON数据..."
        />
      </div>

      <Button type="primary" onClick={loadGeojson}>
        加载GeoJSON
      </Button>

      {geojsonData && (
        <div style={{ marginTop: 16 }}>
          <GisMapCore
            center={[116.40, 39.90]}
            zoom={5}
            style={{ height: 400 }}
          >
            <GisGeojsonParse
              geojson={geojsonData}
              onError={(error) => console.error(error)}
            />
          </GisMapCore>
        </div>
      )}
    </Card>
  )
}
```

### 支持的GeoJSON类型
- FeatureCollection
- Feature
- Point
- LineString
- Polygon
- MultiPoint
- MultiLineString
- MultiPolygon

### 注意事项
- 自动解析坐标系统
- 支持缩放到数据范围
- 可以自定义样式渲染