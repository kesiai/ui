# DataPoint 数据点

## 简介

`DataPoint` 是一个实时数据点展示组件，用于显示和监控物联网设备或传感器的实时数据。

- **实时数据展示**：通过 WebSocket 实时获取和显示数据点的最新值
- **数字动画效果**：支持数值变化时的平滑动画过渡
- **智能状态识别**：自动识别超时、离线、告警等异常状态并使用不同颜色标识
- **详情弹窗**：点击数据点可查看详细信息，包括最新值、更新时间、距现时间等
- **灵活格式化**：支持自定义格式化函数和配置，适配不同类型的数据展示需求

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `tableId` | `string` | 是 | `'device'` | 数据表ID，标识数据来源表 |
| `tableDataId` | `string` | 是 | `'device-001'` | 数据行ID，标识具体的数据记录 |
| `tableDataName` | `string` | 否 | - | 显示名称，用于弹窗标题 |
| `tagId` | `string` | 是 | `'temperature'` | 标签ID，标识具体的测点 |
| `initVisible` | `boolean` | 否 | `false` | 初始状态是否显示详情弹窗 |
| `format` | `(value: any) => any` | 否 | - | 自定义格式化函数 |
| `colors` | `object` | 否 | - | 自定义状态颜色配置 |
| `colors.timeout` | `string` | 否 | - | 超时状态颜色 |
| `colors.offline` | `string` | 否 | - | 离线状态颜色 |
| `colors.warning1` | `string` | 否 | - | 低级告警颜色 |
| `colors.warning2` | `string` | 否 | - | 中级告警颜色 |
| `colors.warning3` | `string` | 否 | - | 高级告警颜色 |
| `colors.warning4` | `string` | 否 | - | 恢复状态颜色 |
| `animated` | `boolean` | 否 | `true` | 是否启用数字动画效果 |
| `timeoutColor` | `string` | 否 | - | 超时状态颜色（优先于 colors.timeout） |
| `offlineColor` | `string` | 否 | - | 离线状态颜色（优先于 colors.offline） |
| `warningColor` | `string` | 否 | - | 告警状态颜色 |
| `warningLevelColor` | `object` | 否 | - | 按告警级别配置颜色 |
| `warningLevelColor.低` | `string` | 否 | - | 低级告警颜色 |
| `warningLevelColor.中` | `string` | 否 | - | 中级告警颜色 |
| `warningLevelColor.高` | `string` | 否 | - | 高级告警颜色 |
| `tagClassName` | `string` | 否 | `''` | 数据点显示的额外类名 |
| `config` | `DataPointConfig` | 否 | - | 数据点配置对象 |

### DataPointConfig

数据点配置对象，控制数据的格式化和显示行为：

```typescript
interface DataPointConfig {
  fixed?: number              // 小数位数，默认 2
  unit?: string               // 单位
  multiplier?: number         // 倍率，用于数据转换
  offset?: number             // 偏移量
  separator?: string          // 千分位分隔符
  enum?: Array<{              // 枚举值配置
    label: string
    value: any
  }>
  errview?: string            // 错误视图：'不显示当前值' | 其他
  interval?: number           // 采集周期（秒）
}
```

### colors 对象

自定义不同状态的颜色配置：

```typescript
{
  timeout?: string      // 超时状态背景色
  offline?: string      // 离线状态背景色
  warning1?: string     // 低级告警颜色
  warning2?: string     // 中级告警颜色
  warning3?: string     // 高级告警颜色
  warning4?: string     // 恢复状态颜色
}
```

## 基本用法

### 1. 基本数据点展示

显示最简单的实时数据点。

```tsx
import { DataPoint } from '@/registry/components/data-point'

function Example() {
  return (
    <DataPoint
      tableId="device"
      tableDataId="device-001"
      tagId="temperature"
    />
  )
}
```

### 2. 带显示名称的数据点

添加显示名称，在详情弹窗中展示。

```tsx
function Example() {
  return (
    <DataPoint
      tableId="device"
      tableDataId="sensor-001"
      tableDataName="温度传感器"
      tagId="temperature"
    />
  )
}
```

### 3. 配置小数位数和单位

通过 config 配置数据的显示格式。

```tsx
function Example() {
  return (
    <DataPoint
      tableId="device"
      tableDataId="device-001"
      tableDataName="温度传感器"
      tagId="temperature"
      config={{
        fixed: 1,
        unit: '°C'
      }}
    />
  )
}
```

### 4. 自定义状态颜色

为不同状态配置自定义颜色。

```tsx
function Example() {
  return (
    <DataPoint
      tableId="device"
      tableDataId="device-001"
      tableDataName="温度传感器"
      tagId="temperature"
      colors={{
        timeout: '#fef3c7',
        offline: '#fee2e2',
        warning1: '#fef3c7',
        warning2: '#fed7aa',
        warning3: '#fecaca'
      }}
      warningLevelColor={{
        '低': '#eab308',
        '中': '#f97316',
        '高': '#ef4444'
      }}
    />
  )
}
```

### 5. 禁用数字动画

关闭数字变化时的动画效果。

```tsx
function Example() {
  return (
    <DataPoint
      tableId="device"
      tableDataId="device-001"
      tagId="temperature"
      animated={false}
    />
  )
}
```

### 6. 自定义格式化函数

使用自定义函数格式化数据值。

```tsx
function Example() {
  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-'
    return `${(value * 100).toFixed(2)}%`
  }

  return (
    <DataPoint
      tableId="device"
      tableDataId="device-001"
      tableDataName="湿度传感器"
      tagId="humidity"
      format={formatValue}
      config={{
        fixed: 2
      }}
    />
  )
}
```

### 7. 枚举类型数据点

显示枚举类型的数据，如开关状态。

```tsx
function Example() {
  return (
    <DataPoint
      tableId="device"
      tableDataId="device-001"
      tableDataName="设备状态"
      tagId="status"
      config={{
        enum: [
          { label: '关闭', value: 0 },
          { label: '开启', value: 1 },
          { label: '故障', value: 2 }
        ]
      }}
    />
  )
}
```

## 完整示例

### 设备监控面板

创建一个完整的设备监控面板，显示多个数据点。

```tsx
import { DataPoint } from '@/registry/components/data-point'

function DeviceMonitorPanel() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">设备监控面板</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* 温度监控 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">温度</label>
          <DataPoint
            tableId="device"
            tableDataId="device-001"
            tableDataName="温度传感器"
            tagId="temperature"
            config={{ fixed: 1, unit: '°C' }}
            colors={{
              timeout: '#fef3c7',
              warning1: '#fef3c7',
              warning2: '#fed7aa',
              warning3: '#fecaca'
            }}
          />
        </div>

        {/* 湿度监控 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">湿度</label>
          <DataPoint
            tableId="device"
            tableDataId="device-001"
            tableDataName="湿度传感器"
            tagId="humidity"
            config={{ fixed: 1, unit: '%' }}
          />
        </div>

        {/* 压力监控 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">压力</label>
          <DataPoint
            tableId="device"
            tableDataId="device-001"
            tableDataName="压力传感器"
            tagId="pressure"
            config={{ fixed: 2, unit: 'MPa' }}
          />
        </div>

        {/* 设备状态 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">运行状态</label>
          <DataPoint
            tableId="device"
            tableDataId="device-001"
            tableDataName="设备状态"
            tagId="status"
            config={{
              enum: [
                { label: '停止', value: 0 },
                { label: '运行', value: 1 },
                { label: '故障', value: 2 }
              ]
            }}
          />
        </div>
      </div>
    </div>
  )
}
```

### 数据转换和格式化

展示数据转换功能，将原始数据转换为工程单位。

```tsx
import { DataPoint } from '@/registry/components/data-point'

function DataConversionExample() {
  return (
    <div className="space-y-4 p-4">
      {/* 电压转换：mV 转 V */}
      <div>
        <label className="text-sm font-medium">电压 (V)</label>
        <div className="mt-1">
          <DataPoint
            tableId="sensor"
            tableDataId="sensor-001"
            tableDataName="电压传感器"
            tagId="voltage"
            config={{
              fixed: 2,
              unit: 'V',
              multiplier: 0.001,  // mV 转 V
              offset: 0
            }}
          />
        </div>
      </div>

      {/* 温度转换：模拟量转温度 */}
      <div>
        <label className="text-sm font-medium">温度 (°C)</label>
        <div className="mt-1">
          <DataPoint
            tableId="sensor"
            tableDataId="sensor-002"
            tableDataName="温度传感器"
            tagId="temp_raw"
            format={(value) => {
              // 4-20mA 对应 0-100°C
              if (value == null) return '-'
              const temp = ((value - 4) / 16) * 100
              return `${temp.toFixed(1)}°C`
            }}
          />
        </div>
      </div>

      {/* 流量显示 */}
      <div>
        <label className="text-sm font-medium">流量 (m³/h)</label>
        <div className="mt-1">
          <DataPoint
            tableId="sensor"
            tableDataId="sensor-003"
            tableDataName="流量计"
            tagId="flow_rate"
            config={{
              fixed: 2,
              unit: 'm³/h',
              separator: ','
            }}
          />
        </div>
      </div>
    </div>
  )
}
```

### 告警监控面板

创建一个带告警状态指示的监控面板。

```tsx
import { DataPoint } from '@/registry/components/data-point'

function AlarmMonitorPanel() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">告警监控面板</h2>

      <div className="space-y-4">
        {/* 关键参数 - 带三级告警 */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">关键参数</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500">温度</label>
              <DataPoint
                tableId="device"
                tableDataId="device-001"
                tableDataName="温度告警"
                tagId="temp_alarm"
                config={{ fixed: 1, unit: '°C' }}
                colors={{
                  warning1: '#fef3c7',
                  warning2: '#fed7aa',
                  warning3: '#fecaca',
                  warning4: '#bbf7d0'
                }}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">压力</label>
              <DataPoint
                tableId="device"
                tableDataId="device-001"
                tableDataName="压力告警"
                tagId="pressure_alarm"
                config={{ fixed: 2, unit: 'MPa' }}
                colors={{
                  warning1: '#fef3c7',
                  warning2: '#fed7aa',
                  warning3: '#fecaca'
                }}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">液位</label>
              <DataPoint
                tableId="device"
                tableDataId="device-001"
                tableDataName="液位告警"
                tagId="level_alarm"
                config={{ fixed: 2, unit: 'm' }}
                colors={{
                  warning1: '#fef3c7',
                  warning2: '#fed7aa',
                  warning3: '#fecaca'
                }}
              />
            </div>
          </div>
        </div>

        {/* 设备状态 - 带超时和离线指示 */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">设备状态</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">通信状态</label>
              <DataPoint
                tableId="device"
                tableDataId="device-001"
                tableDataName="通信状态"
                tagId="comm_status"
                config={{
                  enum: [
                    { label: '离线', value: 0 },
                    { label: '在线', value: 1 }
                  ]
                }}
                colors={{
                  offline: '#fee2e2',
                  timeout: '#fef3c7'
                }}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">心跳时间</label>
              <DataPoint
                tableId="device"
                tableDataId="device-001"
                tableDataName="心跳时间"
                tagId="heartbeat"
                colors={{
                  timeout: '#fef3c7'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 注意事项

1. **用户登录状态**：组件需要用户登录才能获取实时数据。如果用户未登录，会显示"请先登录以查看数据点"的提示。数据获取依赖于 `useUser` hook 和 `useDataTag` hook。

2. **实时数据订阅**：组件通过 `useDataTag` hook 订阅实时数据。数据会自动更新，无需手动刷新。更新频率由服务端推送决定。

3. **超时和离线判断**：组件会根据数据的时间戳自动判断是否超时或离线。超时时间和离线判断逻辑由服务端配置决定。

4. **告警状态优先级**：当同时存在多种告警状态时，优先级为：恢复 > 高级告警 > 中级告警 > 低级告警 > 正常。颜色会根据最高优先级显示。

5. **格式化函数优先级**：如果同时提供 `format` 函数和 `config` 配置，`format` 函数优先级更高。建议根据实际需求选择使用方式。

6. **数字动画性能**：数字动画在数据频繁更新时可能影响性能。在高频数据场景下，建议设置 `animated={false}` 禁用动画。

7. **错误显示配置**：通过 `config.errview` 可以控制超时时的显示行为。设置为 `'不显示当前值'` 时，超时状态显示为 `-`，否则显示最后的有效值。

8. **枚举值匹配**：使用 `config.enum` 配置枚举时，确保 `value` 与实际数据值类型一致（数字、字符串等）。

9. **千分位分隔符**：`config.separator` 仅对数字类型有效，可用于添加千分位分隔符（如 `,` 或 ` `）。

10. **初始弹窗状态**：`initVisible=true` 时，组件挂载后会自动显示详情弹窗。适合用于首次加载时引导用户查看详细信息。
