# GIS 系统完整使用指南

## 简介

GIS 系统是一组协同工作的组件，用于地理信息展示和交互。所有 GIS 组件都必须以 `GisMapCore` 为核心地图容器，配合各种图层和工具使用。

## 系统架构

```
GisMapCore (核心地图)
├── GisCustomLayer (自定义图层)
├── GisPolygonDraw (多边形绘制)
├── GisTableLayer (表格图层)
├── GisWarnLayer (警告图层)
├── GisXyzTile (XYZ瓦片)
├── GisGeojsonParse (GeoJSON解析)
├── GisGeoserverWMS (GeoServer WMS)
└── GisKmzLoader (KMZ加载器)
```

## 基础使用

### 最小可用组合

```tsx
import { GisMapCore } from '@/registry/components/airiot/gis-map-core/gis-map-core';

function SimpleMap() {
  return (
    <GisMapCore
      center={[116.404, 39.915]}  // 北京坐标
      zoom={10}
      style={{ height: '500px' }}
    />
  );
}
```

### 完整功能组合

```tsx
import {
  GisMapCore
} from '@/registry/components/airiot/gis-map-core/gis-map-core';
import {
  GisCustomLayer
} from '@/registry/components/airiot/gis-custom-layer/gis-custom-layer';
import {
  GisPolygonDraw
} from '@/registry/components/airiot/gis-polygon-draw/gis-polygon-draw';
import {
  GisTableLayer
} from '@/registry/components/airiot/gis-table-layer/gis-table-layer';
import {
  GisWarnLayer
} from '@/registry/components/airiot/gis-warn-layer/gis-warn-layer';
import {
  GisXyzTile
} from '@/registry/components/airiot/gis-xyz-tile/gis-xyz-tile';
import {
  GisGeojsonParse
} from '@/registry/components/airiot/gis-geojson-parse/gis-geojson-parse';
import {
  GisGeoserverWMS
} from '@/registry/components/airiot/gis-geoserver-wms/gis-geoserver-wms';

function CompleteGISSystem() {
  const [drawingMode, setDrawingMode] = useState(false);

  return (
    <div className="gis-container">
      {/* 核心地图 */}
      <GisMapCore
        center={[116.404, 39.915]}
        zoom={12}
        style={{ height: '600px', width: '100%' }}
        onMapClick={handleMapClick}
        onZoomChange={handleZoomChange}
      >
        {/* XYZ瓦片底图 */}
        <GisXyzTile
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* GeoJSON数据图层 */}
        <GisGeojsonParse
          data={geojsonData}
          style={{
            color: '#ff7800',
            weight: 5,
            opacity: 0.65
          }}
          onFeatureClick={handleFeatureClick}
        />

        {/* 自定义图层 */}
        <GisCustomLayer
          render={(map) => {
            // 自定义渲染逻辑
            new maplibregl.Marker()
              .setLngLat([116.404, 39.915])
              .addTo(map);
          }}
        />

        {/* WMS服务图层 */}
        <GisGeoserverWMS
          url="https://geoserver.example.com/geoserver/wms"
          layers="cities"
          styles="default"
        />

        {/* 多边形绘制工具 */}
        {drawingMode && (
          <GisPolygonDraw
            onDrawComplete={(polygon) => {
              console.log('绘制完成:', polygon);
              setDrawingMode(false);
            }}
          />
        )}

        {/* 警告图层 */}
        <GisWarnLayer
          warnings={[
            {
              position: [116.404, 39.915],
              level: 'high',
              message: '高风险区域'
            },
            {
              position: [116.414, 39.925],
              level: 'medium',
              message: '中风险区域'
            }
          ]}
        />
      </GisMapCore>

      {/* 地图控制 */}
      <div className="gis-controls">
        <button onClick={() => setDrawingMode(!drawingMode)}>
          {drawingMode ? '停止绘制' : '绘制多边形'}
        </button>
        <button onClick={handleClearLayers}>清除图层</button>
        <button onClick={handleLocateUser}>定位</button>
      </div>
    </div>
  );
}
```

## 组件详解

### GisMapCore (核心地图)

**必须作为核心容器**，提供地图基础功能。

**关键 Props**:
```tsx
interface GisMapCoreProps {
  center: [number, number];      // 地图中心坐标 [lng, lat]
  zoom: number;                   // 缩放级别
  style?: React.CSSProperties;   // 样式
  onMapClick?: (event: any) => void;
  onZoomChange?: (zoom: number) => void;
  children?: React.ReactNode;     // 子图层组件
}
```

### GisXyzTile (XYZ瓦片)

标准 XYZ 瓦片图层，用于显示底图。

### GisGeojsonParse (GeoJSON解析)

解析并显示 GeoJSON 格式的地理数据。

### GisCustomLayer (自定义图层)

提供自定义图层渲染能力。

### GisPolygonDraw (多边形绘制)

支持在地图上绘制多边形。

### GisTableLayer (表格图层)

将表格数据映射到地图上。

### GisWarnLayer (警告图层)

显示警告信息图层。

### GisGeoserverWMS (GeoServer WMS)

集成 GeoServer WMS 服务。

### GisKmzLoader (KMZ加载器)

加载 KMZ 格式文件。

## 常见模式

### 1. 简单地图

```tsx
<GisMapCore
  center={[116.404, 39.915]}
  zoom={10}
  style={{ height: '400px' }}
/>
```

### 2. 带标记的地图

```tsx
function MapWithMarkers() {
  return (
    <GisMapCore center={[116.404, 39.915]}>
      <GisCustomLayer
        render={(map) => {
          const markers = [
            { pos: [116.404, 39.915], name: "北京" },
            { pos: [121.474, 31.230], name: "上海" }
          ];

          markers.forEach(marker => {
            new maplibregl.Marker()
              .setLngLat(marker.pos)
              .setPopup(new maplibregl.Popup().setText(marker.name))
              .addTo(map);
          });
        }}
      />
    </GisMapCore>
  );
}
```

### 3. 绘图工具

```tsx
function DrawingMap() {
  const [drawing, setDrawing] = useState(false);
  const [polygons, setPolygons] = useState([]);

  return (
    <GisMapCore center={[116.404, 39.915]}>
      {drawing && (
        <GisPolygonDraw
          onDrawComplete={(polygon) => {
            setPolygons([...polygons, polygon]);
            setDrawing(false);
          }}
        />
      )}

      {/* 显示已绘制的多边形 */}
      {polygons.map((polygon, index) => (
        <GisGeojsonParse
          key={index}
          data={{
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [polygon]
            }
          }}
          style={{
            color: 'blue',
            fillColor: 'rgba(0, 0, 255, 0.1)',
            fillOpacity: 0.5
          }}
        />
      ))}
    </GisMapCore>
  );
}
```

### 4. 实时数据监控

```tsx
function RealTimeMonitoring() {
  const [deviceLocations, setDeviceLocations] = useState([]);

  useEffect(() => {
    // 模拟实时数据
    const interval = setInterval(() => {
      setDeviceLocations(prev => {
        const updated = prev.map(device => ({
          ...device,
          position: [
            device.position[0] + (Math.random() - 0.5) * 0.01,
            device.position[1] + (Math.random() - 0.5) * 0.01
          ]
        }));
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GisMapCore center={[116.404, 39.915]} zoom={13}>
      <GisXyzTile url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <GisCustomLayer
        render={(map) => {
          deviceLocations.forEach(device => {
            new maplibregl.Marker({ color: 'red' })
              .setLngLat(device.position)
              .addTo(map);
          });
        }}
      />
    </GisMapCore>
  );
}
```

## 高级功能

### 1. 图层管理

```tsx
function LayerManager() {
  const [visibleLayers, setVisibleLayers] = useState({
    base: true,
    markers: true,
    heat: false
  });

  return (
    <GisMapCore center={[116.404, 39.915]}>
      {visibleLayers.base && <GisXyzTile url="..." />}
      {visibleLayers.markers && <MarkerLayer />}
      {visibleLayers.heat && <HeatmapLayer />}
    </GisMapCore>
  );
}
```

### 2. 交互式查询

```tsx
function InteractiveQuery() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <GisMapCore center={[116.404, 39.915]}>
      <GisGeojsonParse
        data={geoData}
        onFeatureClick={(feature) => {
          setSelectedFeature(feature);
        }}
      />

      {selectedFeature && (
        <Popup
          position={selectedFeature.geometry.coordinates}
          content={`名称: ${selectedFeature.properties.name}`}
        />
      )}
    </GisMapCore>
  );
}
```

## 注意事项

1. **必须使用 GisMapCore**：作为地图系统的核心容器
2. **坐标系**：确保所有坐标使用相同的坐标系（WGS84）
3. **性能优化**：大数据量时使用图层聚合和简化
4. **依赖加载**：确保地图库（如 maplibregl）正确加载

## 最佳实践

1. **模块化**：将不同功能封装为独立的图层组件
2. **数据缓存**：缓存地理数据，避免重复加载
3. **事件处理**：合理处理地图事件，避免过度渲染
4. **响应式设计**：确保地图容器适应不同屏幕尺寸