# 报警层

## 简介

`WarnViews` 是一个实时报警可视化组件，用于在地图上显示闪烁动画标记的报警位置。

- **实时报警推送**：通过 WebSocket 订阅报警推送，实时更新报警状态
- **历史报警查询**：支持查询未确认的历史报警数据
- **多维度过滤**：支持按数据表、表记录、部门、报警类别、级别等条件过滤
- **闪烁动画**：在报警点位显示动态闪烁圆圈，吸引注意力
- **点位同步**：实时从地图 feature 获取坐标，确保与数据表层 marker 位置同步
- **层级控制**：支持根据地图缩放级别自动显示或隐藏报警层

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `table` | `array` | 否 | `[]` | 数据表过滤条件，格式：`[{id: "表ID", title: "表名"}]` |
| `tableData` | `array` | 否 | `[]` | 表记录过滤条件，格式：`[{id: "记录ID", _table: "表ID"}]` |
| `department` | `array` | 否 | `[]` | 部门过滤条件，格式：`[{id: "部门ID"}]` |
| `dataType` | `boolean` | 否 | `false` | 是否初始查询历史报警（未确认的报警） |
| `type` | `string` | 否 | `''` | 报警类别过滤 |
| `level` | `string` | 否 | `''` | 报警级别过滤（'低'、'中'、'高'） |
| `duration` | `number` | 否 | `0.4` | 动画速度（数值越大越快） |
| `radius` | `number` | 否 | `20` | 闪烁动画的最大半径 |
| `background` | `string` | 否 | `'rgba(255, 0, 0, 0.5)'` | 闪烁动画颜色 |
| `overrunHide` | `object` | 否 | - | 层级隐藏配置 `{overmax, overmin}` |
| `display` | `boolean` | 否 | `true` | 是否显示报警层 |
| `className` | `string` | 否 | - | 自定义 CSS 类名 |
| `cellKey` | `string` | 否 | `'warn-layer'` | 单元格唯一标识 |
| `map` | `Map` | 否 | - | 地图实例（通常从 Context 获取） |

### overrunHide

层级隐藏配置。

```typescript
interface OverrunHide {
  overmax?: number  // 当地图层级 >= 该值时隐藏
  overmin?: number  // 当地图层级 <= 该值时隐藏
}
```

## 基本用法

### 1. 基本报警层

显示所有实时报警。

```tsx
import { MapContainer } from '@/registry/components/kesi/gis-map-core'
import { WarnViews } from '@/registry/components/kesi/gis-warn-layer'
import { TableViews } from '@/registry/components/kesi/gis-table-layer'

function BasicWarnLayer() {
  return (
    <MapContainer>
      {/* 必须先添加数据表层 */}
      <TableViews
        table={[{ id: 'table1', title: '设备表' }]}
        cellKey="table-layer"
      />

      {/* 报警层 */}
      <WarnViews
        dataType={true}
        cellKey="warn-layer"
      />
    </MapContainer>
  )
}
```

### 2. 过滤特定数据表的报警

只显示特定数据表的报警。

```tsx
function FilteredByTableWarn() {
  return (
    <MapContainer>
      <TableViews
        table={[{ id: 'sensor-table', title: '传感器表' }]}
        cellKey="table-layer"
      />

      <WarnViews
        table={[{ id: 'sensor-table', title: '传感器表' }]}
        dataType={true}
        cellKey="warn-layer"
      />
    </MapContainer>
  )
}
```

### 3. 过滤特定记录的报警

只显示特定表记录的报警。

```tsx
function FilteredByRecordWarn() {
  return (
    <MapContainer>
      <TableViews
        tableData={[
          { id: 'record1', _table: 'table1' },
          { id: 'record2', _table: 'table1' }
        ]}
        cellKey="table-layer"
      />

      <WarnViews
        tableData={[
          { id: 'record1', _table: 'table1' },
          { id: 'record2', _table: 'table1' }
        ]}
        dataType={true}
        cellKey="warn-layer"
      />
    </MapContainer>
  )
}
```

### 4. 按报警级别过滤

只显示特定级别的报警。

```tsx
function FilteredByLevelWarn() {
  return (
    <MapContainer>
      <TableViews
        table={[{ id: 'device-table', title: '设备表' }]}
        cellKey="table-layer"
      />

      <WarnViews
        table={[{ id: 'device-table', title: '设备表' }]}
        level="高"
        dataType={true}
        cellKey="warn-layer"
      />
    </MapContainer>
  )
}
```

### 5. 按报警类别过滤

只显示特定类别的报警。

```tsx
function FilteredByTypeWarn() {
  return (
    <MapContainer>
      <TableViews
        table={[{ id: 'device-table', title: '设备表' }]}
        cellKey="table-layer"
      />

      <WarnViews
        table={[{ id: 'device-table', title: '设备表' }]}
        type="温度报警"
        dataType={true}
        cellKey="warn-layer"
      />
    </MapContainer>
  )
}
```

### 6. 自定义闪烁动画

自定义报警闪烁动画的颜色、速度和半径。

```tsx
function CustomAnimationWarn() {
  return (
    <MapContainer>
      <TableViews
        table={[{ id: 'sensor-table', title: '传感器表' }]}
        cellKey="table-layer"
      />

      <WarnViews
        table={[{ id: 'sensor-table', title: '传感器表' }]}
        background="rgba(255, 165, 0, 0.6)"  // 橙色
        duration={0.6}                         // 较慢的动画
        radius={30}                            // 更大的半径
        dataType={true}
        cellKey="warn-layer"
      />
    </MapContainer>
  )
}
```

### 7. 层级控制

根据地图缩放级别自动显示或隐藏报警层。

```tsx
function ZoomControlledWarn() {
  return (
    <MapContainer>
      <TableViews
        table={[{ id: 'device-table', title: '设备表' }]}
        cellKey="table-layer"
      />

      <WarnViews
        table={[{ id: 'device-table', title: '设备表' }]}
        overrunHide={{
          overmax: 15  // 缩放级别 >= 15 时隐藏
        }}
        dataType={true}
        cellKey="warn-layer"
      />
    </MapContainer>
  )
}
```

### 8. 动态控制显示

通过按钮控制报警层的显示和隐藏。

```tsx
function DynamicDisplayWarn() {
  const [visible, setVisible] = React.useState(true)

  return (
    <div>
      <button onClick={() => setVisible(!visible)}>
        {visible ? '隐藏' : '显示'}报警
      </button>

      <MapContainer>
        <TableViews
          table={[{ id: 'device-table', title: '设备表' }]}
          cellKey="table-layer"
        />

        <WarnViews
          table={[{ id: 'device-table', title: '设备表' }]}
          display={visible}
          dataType={true}
          cellKey="warn-layer"
        />
      </MapContainer>
    </div>
  )
}
```

## 完整示例

### 多条件过滤报警

组合多个过滤条件，精确控制显示的报警。

```tsx
import { MapContainer } from '@/registry/components/kesi/gis-map-core'
import { WarnViews } from '@/registry/components/kesi/gis-warn-layer'
import { TableViews } from '@/registry/components/kesi/gis-table-layer'

function MultiFilterWarn() {
  return (
    <MapContainer
      width="100%"
      height="600px"
      viewOptions={{
        position: { center: [116.391, 39.9042] },
        zoom: 12
      }}
    >
      {/* 数据表层 */}
      <TableViews
        table={[
          { id: 'sensor-table', title: '传感器表' },
          { id: 'device-table', title: '设备表' }
        ]}
        cellKey="table-layer"
      />

      {/* 报警层：多条件过滤 */}
      <WarnViews
        table={[{ id: 'sensor-table', title: '传感器表' }]}
        level="高"
        type="温度报警"
        dataType={true}
        duration={0.5}
        radius={25}
        background="rgba(255, 0, 0, 0.6)"
        overrunHide={{
          overmax: 16
        }}
        display={true}
        cellKey="warn-layer"
      />
    </MapContainer>
  )
}
```

### 不同级别的报警样式

根据报警级别显示不同样式的闪烁动画。

```tsx
function MultiLevelWarnStyles() {
  return (
    <MapContainer
      width="100%"
      height="600px"
      viewOptions={{
        position: { center: [116.391, 39.9042] },
        zoom: 12
      }}
    >
      {/* 数据表层 */}
      <TableViews
        table={[{ id: 'device-table', title: '设备表' }]}
        cellKey="table-layer"
      />

      {/* 高级报警：红色，快速闪烁 */}
      <WarnViews
        table={[{ id: 'device-table', title: '设备表' }]}
        level="高"
        background="rgba(255, 0, 0, 0.7)"
        duration={0.6}
        radius={30}
        dataType={true}
        cellKey="high-warn-layer"
      />

      {/* 中级报警：橙色，中速闪烁 */}
      <WarnViews
        table={[{ id: 'device-table', title: '设备表' }]}
        level="中"
        background="rgba(255, 165, 0, 0.6)"
        duration={0.4}
        radius={25}
        dataType={true}
        cellKey="medium-warn-layer"
      />

      {/* 低级报警：黄色，慢速闪烁 */}
      <WarnViews
        table={[{ id: 'device-table', title: '设备表' }]}
        level="低"
        background="rgba(255, 255, 0, 0.5)"
        duration={0.3}
        radius={20}
        dataType={true}
        cellKey="low-warn-layer"
      />
    </MapContainer>
  )
}
```

### 部门过滤报警

只显示特定部门的报警。

```tsx
function DepartmentFilteredWarn() {
  return (
    <MapContainer>
      {/* 数据表层：包含部门信息 */}
      <TableViews
        table={[{ id: 'production-table', title: '生产设备表' }]}
        cellKey="table-layer"
      />

      {/* 报警层：只显示生产部门的报警 */}
      <WarnViews
        table={[{ id: 'production-table', title: '生产设备表' }]}
        department={[
          { id: 'dept-001', title: '生产部' },
          { id: 'dept-002', title: '制造部' }
        ]}
        dataType={true}
        cellKey="warn-layer"
      />
    </MapContainer>
  )
}
```

### 动态切换过滤条件

根据用户选择动态切换报警过滤条件。

```tsx
function DynamicFilterWarn() {
  const [selectedLevel, setSelectedLevel] = React.useState('')
  const [selectedType, setSelectedType] = React.useState('')

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          报警级别：
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="">全部</option>
            <option value="高">高</option>
            <option value="中">中</option>
            <option value="低">低</option>
          </select>
        </label>

        <label style={{ marginLeft: '20px' }}>
          报警类别：
          <input
            type="text"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            placeholder="输入报警类别"
          />
        </label>
      </div>

      <MapContainer>
        <TableViews
          table={[{ id: 'device-table', title: '设备表' }]}
          cellKey="table-layer"
        />

        <WarnViews
          table={[{ id: 'device-table', title: '设备表' }]}
          level={selectedLevel}
          type={selectedType}
          dataType={true}
          key={`${selectedLevel}-${selectedType}`} // key 变化时重新创建
          cellKey="warn-layer"
        />
      </MapContainer>
    </div>
  )
}
```

### 报警统计面板

结合报警层显示统计信息。

```tsx
function WarnStatisticsPanel() {
  const [warnCount, setWarnCount] = React.useState(0)
  const [highWarnCount, setHighWarnCount] = React.useState(0)

  return (
    <div>
      {/* 统计面板 */}
      <div style={{
        padding: '10px',
        backgroundColor: '#f0f0f0',
        marginBottom: '10px',
        borderRadius: '4px'
      }}>
        <p>总报警数：<strong>{warnCount}</strong></p>
        <p>高级报警：<strong style={{ color: 'red' }}>{highWarnCount}</strong></p>
      </div>

      <MapContainer>
        <TableViews
          table={[{ id: 'sensor-table', title: '传感器表' }]}
          cellKey="table-layer"
        />

        <WarnViews
          table={[{ id: 'sensor-table', title: '传感器表' }]}
          dataType={true}
          cellKey="warn-layer"
        />
      </MapContainer>
    </div>
  )
}
```

### 响应式层级控制

根据地图缩放级别动态调整报警显示。

```tsx
function ResponsiveZoomWarn() {
  const [currentZoom, setCurrentZoom] = React.useState(10)

  return (
    <div>
      <p>当前缩放级别：{currentZoom}</p>

      <MapContainer
        onZoomChange={(zoom) => setCurrentZoom(Math.round(zoom))}
      >
        <TableViews
          table={[{ id: 'device-table', title: '设备表' }]}
          cellKey="table-layer"
        />

        <WarnViews
          table={[{ id: 'device-table', title: '设备表' }]}
          overrunHide={{
            overmax: currentZoom > 12 ? 15 : 18  // 动态调整隐藏层级
          }}
          dataType={true}
          cellKey="warn-layer"
        />
      </MapContainer>
    </div>
  )
}
```

## 报警数据格式

报警推送的数据格式：

```typescript
interface WarningData {
  id: string                  // 报警唯一标识
  tableId: string            // 关联的数据表 ID
  tableDataId: string        // 关联的表记录 ID
  table?: {                  // 数据表信息
    id: string
    title: string
  }
  tableData?: {              // 表记录信息
    id: string
    _table: string
  }
  department?: Array<{       // 部门信息
    id: string
    title: string
  }>
  type: string               // 报警类别
  level: string              // 报警级别（'低'、'中'、'高'）
  status: string             // 报警状态（'未确认'、'已确认'）
  processed: string          // 处理状态（'已处理'）
  time: Date                 // 报警时间
  recoveryTime?: Date        // 恢复时间（如果已恢复）
}
```

## 注意事项

1. **必须配合数据表层使用**：报警层需要与 `TableViews` 组件配合使用，数据表层会将 `pointSource` 注册到地图上

2. **点位同步机制**：报警层会实时从数据表层的 `pointSource` 中获取 feature 坐标，确保报警动画与 marker 位置同步

3. **WebSocket 订阅**：组件自动订阅报警推送，无需手动配置 WebSocket 连接

4. **报警移除条件**：以下情况会移除报警动画：
   - 报警恢复（`recoveryTime` 存在）
   - 报警状态为"已确认"
   - 报警处理状态为"已处理"

5. **历史报警查询**：只有 `dataType=true` 时才会查询历史报警，否则只显示实时推送的报警

6. **过滤条件优先级**：多个过滤条件是 AND 关系，必须同时满足所有条件才显示报警

7. **点位数据加载**：组件会监听数据表层的 `pointSource`，只有在 feature 加载完成后才显示报警

8. **性能考虑**：
   - 大量报警同时显示可能影响性能
   - 建议通过 `overrunHide` 控制在特定缩放级别显示
   - 使用过滤条件减少显示的报警数量

9. **动画性能**：闪烁动画通过 `postrender` 事件实现，每帧都会重绘，注意性能影响

10. **cellKey 唯一性**：确保 `cellKey` 在同一地图中唯一

11. **参数 JSON 格式**：`table`、`tableData`、`department` 参数支持 JSON 字符串格式

12. **点位 source 注册**：数据表层会将 `pointSource` 注册到 map 上，key 格式为 `gisv2.record.pointSource:${cellKey}`

13. **坐标系一致性**：确保报警层与数据表层使用相同的坐标系

14. **多报警层叠加**：可以添加多个报警层（不同级别、不同样式），通过 `zIndex` 控制叠加顺序

15. **取消监听**：组件卸载时会自动取消所有事件监听和 WebSocket 订阅

16. **错误处理**：查询历史报警失败会在控制台输出错误，不会中断应用运行
