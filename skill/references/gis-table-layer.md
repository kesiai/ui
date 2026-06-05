> **安装命令**: `npx shadcn@latest add @kesi/gis-table-layer`

# 数据表层

## 简介

`GisTableLayer` 是一个强大的数据表图层组件，用于将数据库表中的地理信息数据可视化到地图上。

- **多数据源支持**：支持通过表 ID 或直接传入表数据两种方式加载数据
- **实时数据更新**：通过 WebSocket 实现实时数据推送和更新
- **丰富样式配置**：支持图标、线、面、圆等多种几何类型的样式自定义
- **热力图功能**：内置热力图渲染功能，适合数据密度分析
- **聚合显示**：支持点聚合功能，优化大量数据点的显示效果
- **交互弹窗**：支持点击、悬停等多种弹窗交互方式

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `table` | `object` | 否 | - | 数据表配置，格式为 `{id: '表ID', title: '表名'}` |
| `tableData` | `array` | 否 | `[]` | 表记录数据，如果提供则不查询 API |
| `marker` | `object` | 否 | - | 标记样式配置，包含 icon、line、polygon、circle、semicircle、text 等 |
| `highlightMarker` | `object` | 否 | - | 高亮标记样式配置 |
| `department` | `array` | 否 | `[]` | 部门过滤配置 |
| `tableFilters` | `object` | 否 | `{}` | 数据过滤条件 |
| `modalConfig` | `array` | 否 | `[{showType: 'click', content: 'default'}]` | 弹窗配置 |
| `selectConfig` | `object` | 否 | `{}` | 选中配置 |
| `coordinateType` | `string` | 否 | `'EPSG:4326'` | 坐标系类型，支持 'EPSG:4326'、'EPSG:3857'、'GCJ02'、'BD09' |
| `layerBase` | `LayerBase` | 否 | - | 图层基础配置（透明度、层级等） |
| `heatmap` | `object` | 否 | `{show: false, radius: 8, blur: 15, gradient: [...]}` | 热力图配置 |
| `cluster` | `object` | 否 | `{show: false, distance: 20, ...}` | 聚合配置 |
| `markerScale` | `array` | 否 | `[{from: 1, to: 5, scale: 0.8}, ...]` | 标记缩放配置数组 |
| `tableTags` | `array` | 否 | `[]` | 表数据点（额外订阅的字段） |
| `getQueryFilter` | `function` | 否 | - | 自定义查询过滤器函数 |
| `display` | `boolean` | 否 | `true` | 是否显示图层 |
| `className` | `string` | 否 | - | 自定义 CSS 类名 |
| `cellKey` | `string` | 否 | - | 单元格唯一标识 |
| `map` | `Map` | 否 | - | 地图实例（通常从 Context 获取） |

### LayerBase

图层基础配置。

```typescript
interface LayerBase {
  opacity?: number        // 透明度 (0-1)
  zIndex?: number         // 图层层级
  maxResolution?: number  // 最大分辨率
  minResolution?: number  // 最小分辨率
  maxZoom?: number        // 最大缩放级别，默认 22
  minZoom?: number        // 最小缩放级别，默认 0
}
```

### Heatmap

热力图配置。

```typescript
interface Heatmap {
  show?: boolean           // 是否显示热力图，默认 false
  radius?: number          // 热力图半径，默认 8
  blur?: number            // 模糊程度，默认 15
  gradient?: string[]      // 渐变色数组，默认 ['#00f', '#0ff', '#0f0', '#ff0', '#f00']
}
```

### Cluster

聚合配置。

```typescript
interface Cluster {
  show?: boolean           // 是否启用聚合，默认 false
  distance?: number        // 聚合距离，默认 20
  minDistance?: number     // 最小距离，默认 10
  radius?: number          // 聚合圆半径，默认 30
  text?: string            // 聚合文本模板
  font?: number            // 字体大小，默认 14
  color?: string           // 文字颜色，默认 '#ffffff'
  background?: string      // 背景色，默认 'rgba(0,0,0,0.6)'
}
```

## 基本用法

### 1. 使用表 ID 加载数据

通过表 ID 从服务器加载地理信息数据。

```tsx
import { GisMapCore } from '@/components/kesi/gis-map-core'
import { GisTableLayer } from '@/components/kesi/gis-table-layer'

function TableByID() {
  return (
    <GisMapCore>
      <GisTableLayer
        table={{ id: '地理信息', title: '地理信息' }}
        coordinateType="EPSG:4326"
        cellKey="table-layer"
      />
    </GisMapCore>
  )
}
```

### 2. 直接传入表数据

直接提供表数据，不查询 API。

```tsx
function DirectTableData() {
  const tableData = [
    {
      id: '1',
      name: '点位1',
      _table: '地理信息',
      lat: 39.9042,
      lon: 116.391
    },
    {
      id: '2',
      name: '点位2',
      _table: '地理信息',
      lat: 40.363,
      lon: 117.116
    }
  ]

  return (
    <GisMapCore>
      <GisTableLayer
        tableData={tableData}
        coordinateType="EPSG:4326"
        cellKey="direct-data-layer"
      />
    </GisMapCore>
  )
}
```

### 3. 自定义标记样式

配置自定义的图标、线条等样式。

```tsx
function CustomMarkerStyle() {
  return (
    <GisMapCore>
      <GisTableLayer
        table={{ id: '地理信息', title: '地理信息' }}
        coordinateType="EPSG:4326"
        marker={{
          icon: {
            iconSrc: '/path/to/icon.png',
            scale: 1.2,
            anchor: [0.5, 0.5]
          },
          line: {
            color: 'rgba(255, 0, 0, 0.8)',
            width: 3,
            snumber: true
          },
          polygon: {
            color: 'rgba(0, 255, 0, 0.8)',
            width: 2,
            fillColor: 'rgba(0, 255, 0, 0.2)',
            snumber: true
          }
        }}
        cellKey="custom-marker-layer"
      />
    </GisMapCore>
  )
}
```

### 4. 启用热力图

将数据点渲染为热力图效果。

```tsx
function HeatmapExample() {
  return (
    <GisMapCore>
      <GisTableLayer
        table={{ id: '地理信息', title: '地理信息' }}
        coordinateType="EPSG:4326"
        heatmap={{
          show: true,
          radius: 12,
          blur: 20,
          gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00']
        }}
        cellKey="heatmap-layer"
      />
    </GisMapCore>
  )
}
```

### 5. 启用点聚合

对密集的数据点进行聚合显示。

```tsx
function ClusterExample() {
  return (
    <GisMapCore>
      <GisTableLayer
        table={{ id: '地理信息', title: '地理信息' }}
        coordinateType="EPSG:4326"
        cluster={{
          show: true,
          distance: 40,
          minDistance: 20,
          radius: 35,
          font: 16,
          color: '#ffffff',
          background: 'rgba(0,0,0,0.7)'
        }}
        cellKey="cluster-layer"
      />
    </GisMapCore>
  )
}
```

### 6. 配置弹窗

设置点击标记时显示的弹窗。

```tsx
function ModalExample() {
  return (
    <GisMapCore>
      <GisTableLayer
        table={{ id: '地理信息', title: '地理信息' }}
        coordinateType="EPSG:4326"
        modalConfig={[
          {
            showType: 'click',  // 点击时显示
            offsetX: 10,
            offsetY: 10,
            positioning: 'top-left',
            multi: false,
            content: 'default'
          }
        ]}
        cellKey="modal-layer"
      />
    </GisMapCore>
  )
}
```

### 7. 数据过滤

使用部门过滤和查询过滤器。

```tsx
function FilterExample() {
  return (
    <GisMapCore>
      <GisTableLayer
        table={{ id: '地理信息', title: '地理信息' }}
        coordinateType="EPSG:4326"
        department={[
          { id: 'dept-1' },
          { id: 'dept-2' }
        ]}
        tableFilters={{
          status: 'active',
          type: 'sensor'
        }}
        cellKey="filter-layer"
      />
    </GisMapCore>
  )
}
```

### 8. 标记缩放配置

根据缩放级别自动调整标记大小。

```tsx
function MarkerScaleExample() {
  return (
    <GisMapCore>
      <GisTableLayer
        table={{ id: '地理信息', title: '地理信息' }}
        coordinateType="EPSG:4326"
        markerScale={[
          { from: 1, to: 5, scale: 0.6 },
          { from: 6, to: 10, scale: 0.8 },
          { from: 11, to: 18, scale: 1.0 }
        ]}
        cellKey="scale-layer"
      />
    </GisMapCore>
  )
}
```

## 完整示例

### 设备监控系统

创建一个完整的设备监控应用，展示设备位置、状态和实时数据。

```tsx
import { GisMapCore } from '@/components/kesi/gis-map-core'
import { GisTableLayer } from '@/components/kesi/gis-table-layer'

function DeviceMonitoringApp() {
  const [selectedStatus, setSelectedStatus] = React.useState('all')
  const [showHeatmap, setShowHeatmap] = React.useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'rgba(0, 255, 0, 0.8)'
      case 'offline': return 'rgba(128, 128, 128, 0.8)'
      case 'warning': return 'rgba(255, 165, 0, 0.8)'
      case 'error': return 'rgba(255, 0, 0, 0.8)'
      default: return 'rgba(0, 0, 255, 0.8)'
    }
  }

  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <div className="w-80 bg-white shadow-lg p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">设备监控</h2>

        {/* 状态筛选 */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">状态筛选</h3>
          <div className="space-y-2">
            {['all', 'online', 'offline', 'warning', 'error'].map(status => (
              <label key={status} className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={selectedStatus === status}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="mr-2"
                />
                <span className="capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 显示模式 */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">显示模式</h3>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className="mr-2"
            />
            热力图模式
          </label>
        </div>

        {/* 统计信息 */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">设备统计</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>在线设备:</span>
              <span className="font-semibold text-green-600">128</span>
            </div>
            <div className="flex justify-between">
              <span>离线设备:</span>
              <span className="font-semibold text-gray-600">12</span>
            </div>
            <div className="flex justify-between">
              <span>告警设备:</span>
              <span className="font-semibold text-orange-600">5</span>
            </div>
            <div className="flex justify-between">
              <span>故障设备:</span>
              <span className="font-semibold text-red-600">2</span>
            </div>
          </div>
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
          <GisTableLayer
            table={{ id: '设备信息', title: '设备信息' }}
            coordinateType="EPSG:4326"
            tableFilters={selectedStatus !== 'all' ? { status: selectedStatus } : {}}
            marker={{
              icon: {
                iconSrc: '/device-icon.png',
                scale: 1
              }
            }}
            highlightMarker={{
              icon: {
                scale: 1.3
              }
            }}
            modalConfig={[
              {
                showType: 'click',
                content: 'default',
                positioning: 'top-right',
                offsetX: 10,
                offsetY: 10
              }
            ]}
            heatmap={{
              show: showHeatmap,
              radius: 15,
              blur: 25,
              gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00']
            }}
            layerBase={{
              opacity: 1,
              zIndex: 10,
              minZoom: 0,
              maxZoom: 18
            }}
            cellKey="device-monitoring-layer"
          />
        </GisMapCore>
      </div>
    </div>
  )
}
```

### 车辆轨迹追踪

展示车辆位置和行驶轨迹的应用。

```tsx
function VehicleTrackingApp() {
  const [selectedVehicle, setSelectedVehicle] = React.useState(null)

  return (
    <div className="h-screen">
      <GisMapCore
        width="100%"
        height="100%"
        viewOptions={{
          position: { center: [116.391, 39.9042] },
          zoom: 13
        }}
      >
        <GisTableLayer
          table={{ id: '车辆位置', title: '车辆位置' }}
          coordinateType="EPSG:4326"
          marker={{
            icon: {
              iconSrc: '/vehicle-icon.png',
              scale: 1
            },
            line: {
              color: 'rgba(0, 100, 255, 0.8)',
              width: 3,
              snumber: false
            }
          }}
          highlightMarker={{
            icon: {
              scale: 1.5
            },
            line: {
              color: 'rgba(255, 0, 0, 1)',
              width: 5
            }
          }}
          modalConfig={[
            {
              showType: 'click',
              content: 'default',
              positioning: 'bottom-center',
              offsetX: 0,
              offsetY: -10
            }
          ]}
          selectConfig={{
            mode: 'single',
            onSelect: (feature) => {
              setSelectedVehicle(feature?.getId())
            }
          }}
          markerScale={[
            { from: 1, to: 8, scale: 0.7 },
            { from: 9, to: 14, scale: 1.0 },
            { from: 15, to: 18, scale: 1.3 }
          ]}
          tableTags={['speed', 'direction', 'status']}
          layerBase={{
            opacity: 1,
            zIndex: 20,
            minZoom: 5,
            maxZoom: 18
          }}
          cellKey="vehicle-tracking-layer"
        />
      </GisMapCore>
    </div>
  )
}
```

### 多图层数据对比

同时展示多个数据源，进行数据对比分析。

```tsx
function MultiLayerComparison() {
  return (
    <GisMapCore
      width="100%"
      height="600px"
      viewOptions={{
        position: { center: [116.391, 39.9042] },
        zoom: 11
      }}
    >
      {/* 图层 1: 设备 A */}
      <GisTableLayer
        table={{ id: '设备A', title: '设备A' }}
        coordinateType="EPSG:4326"
        marker={{
          icon: {
            iconSrc: '/device-a-icon.png',
            scale: 1
          }
        }}
        layerBase={{
          opacity: 1,
          zIndex: 10
        }}
        modalConfig={[{ showType: 'click', content: 'default' }]}
        cellKey="device-a-layer"
      />

      {/* 图层 2: 设备 B */}
      <GisTableLayer
        table={{ id: '设备B', title: '设备B' }}
        coordinateType="EPSG:4326"
        marker={{
          icon: {
            iconSrc: '/device-b-icon.png',
            scale: 1
          }
        }}
        layerBase={{
          opacity: 0.7,
          zIndex: 11
        }}
        modalConfig={[{ showType: 'click', content: 'default' }]}
        cellKey="device-b-layer"
      />

      {/* 图层 3: 热力图 */}
      <GisTableLayer
        table={{ id: '所有设备', title: '所有设备' }}
        coordinateType="EPSG:4326"
        heatmap={{
          show: true,
          radius: 20,
          blur: 30
        }}
        layerBase={{
          opacity: 0.6,
          zIndex: 5
        }}
        cellKey="heatmap-overlay-layer"
      />
    </GisMapCore>
  )
}
```

## 注意事项

1. **数据源选择**：`table` 和 `tableData` 两个参数互斥，同时提供时优先使用 `tableData`

2. **坐标系匹配**：`coordinateType` 必须与数据实际的坐标系一致，否则会出现位置偏移

3. **WebSocket 集成**：组件使用 WebSocket 实现实时数据更新，确保项目已正确配置 `@airiot/client`

4. **热力图与聚合互斥**：热力图和聚合功能不应同时启用，两者会产生冲突

5. **性能优化**：
   - 大量数据点（>1000）建议启用聚合功能
   - 合理设置 `minZoom` 和 `maxZoom` 避免不必要的数据加载
   - 使用 `tableFilters` 过滤数据，减少前端渲染压力

6. **弹窗配置**：`modalConfig` 支持数组形式，可以配置多个弹窗行为

7. **标记样式**：`marker` 配置中的 `icon`、`line`、`polygon`、`circle` 对应不同的几何类型

8. **标记缩放**：`markerScale` 数组应按 `from` 值升序排列，确保缩放区间正确

9. **部门过滤**：`department` 参数格式为数组，每个元素为 `{id: '部门ID'}`

10. **tableTags 额外订阅**：通过 `tableTags` 可以订阅额外的数据点字段，用于实时监控

11. **高亮样式**：`highlightMarker` 用于选中或悬停时的高亮效果

12. **图层层级**：使用 `zIndex` 控制多图层叠加顺序

13. **内存管理**：大量数据时注意及时清理不再使用的图层，避免内存泄漏

14. **错误处理**：数据格式不正确或 GIS 配置缺失会导致标记无法显示，请检查数据完整性

15. **自定义查询**：复杂的过滤逻辑可以通过 `getQueryFilter` 函数实现
