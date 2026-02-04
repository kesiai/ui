# InterfaceDataSource 接口数据源组件

## 简介

`InterfaceDataSource` 是一个接口数据源容器组件，用于调用系统内部定义的接口服务（Interface Service）获取数据。

- **纯容器组件**：不包含任何布局和样式
- **Context 集成**：内部集成 `ContextProvider`，子组件通过 `useContextProvider` 获取数据
- **自动数据管理**：数据自动存储到 Jotai atom，通过组件 ID 访问
- **接口服务调用**：通过 `ds/p/{key}` 路径调用系统接口
- **灵活的数据处理**：支持数据预处理为图表格式
- **定时轮询**：支持设置定时轮询间隔

## 适用场景

- 调用系统预定义的接口服务
- 需要复用已有的业务逻辑接口
- 调用需要复杂参数计算的接口
- 获取经过业务处理后的聚合数据

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | `string` | 否 | `'interface-data-source'` | 数据源唯一标识，用于存储和访问数据 |
| `op` | `object` | 是 | - | 接口操作对象 |
| `op.key` | `string` | 是 | - | 接口的调用 key，用于构建请求路径 `ds/p/{key}` |
| `params` | `object` | 否 | `{ value: {} }` | 接口参数对象，参数会作为 POST body 发送 |
| `params.value` | `Record<string, any>` | 否 | `{}` | 参数键值对对象 |
| `predata` | `boolean` | 否 | `false` | 是否预处理数据为图表格式（{ dimensions, source }） |
| `interval` | `number` | 否 | `0` | 轮询间隔（秒），0 表示不轮询 |
| `submit` | `string` | 否 | - | 提交触发器标识，值变化时触发数据刷新 |
| `children` | `ReactNode` | 否 | - | 子组件 |

### op 参数说明

`op` 对象定义了要调用的接口信息：

```typescript
{
  key: 'device_max_values_Yglzib'  // 接口调用 key，构建 URL: ds/p/device_max_values_Yglzib
}
```

### params 参数说明

`params` 定义了发送给接口的参数：

```typescript
{
  value: {
    deviceId: 'A001',
    startTime: '2026-01-01 00:00:00',
    endTime: '2026-01-31 23:59:59',
    // ... 其他参数
  }
}
```

这些参数会作为 POST 请求的 body 发送到接口。

### predata 参数说明

当 `predata = true` 时，返回的数据会被预处理为图表格式：

```typescript
// 原始数据
[
  { name: '设备1', value: 100, status: 'online' },
  { name: '设备2', value: 200, status: 'offline' }
]

// 预处理后
{
  dimensions: ['name', 'value', 'status'],
  source: [
    ['设备1', 100, 'online'],
    ['设备2', 200, 'offline']
  ]
}
```

## 基本用法

### 1. 调用简单接口

调用一个无需参数的接口：

```tsx
import { InterfaceDataSource } from '@/registry/blocks/data-source/interface-data-source'

function SimpleInterface() {
  return (
    <InterfaceDataSource
      id="simple-data"
      op={{
        key: 'get_system_status'
      }}
    >
      <StatusDisplay />
    </InterfaceDataSource>
  )
}
```

实际请求路径：`ds/p/get_system_status`
请求方法：`POST`
请求 body：`{}`

### 2. 带参数的接口调用

传递参数到接口：

```tsx
function InterfaceWithParams() {
  return (
    <InterfaceDataSource
      id="device-data"
      op={{
        key: 'device_max_values_Yglzib'
      }}
      params={{
        value: {
          deviceId: 'A001',
          startTime: '2026-01-01 00:00:00',
          endTime: '2026-01-31 23:59:59',
          limit: 10
        }
      }}
    >
      <DeviceChart />
    </InterfaceDataSource>
  )
}
```

实际请求路径：`ds/p/device_max_values_Yglzib`
请求方法：`POST`
请求 body：`{"deviceId":"A001","startTime":"2026-01-01 00:00:00","endTime":"2026-01-31 23:59:59","limit":10}`

### 3. 预处理数据为图表格式

```tsx
function PreprocessedInterface() {
  return (
    <InterfaceDataSource
      id="chart-data"
      op={{
        key: 'get_statistics'
      }}
      params={{
        value: {
          type: 'daily'
        }
      }}
      predata={true}
    >
      <StatisticsChart />
    </InterfaceDataSource>
  )
}
```

### 4. 定时刷新数据

每 30 秒自动刷新数据：

```tsx
function AutoRefreshInterface() {
  return (
    <InterfaceDataSource
      id="realtime-data"
      op={{
        key: 'get_realtime_data'
      }}
      interval={30}
    >
      <RealtimeDashboard />
    </InterfaceDataSource>
  )
}
```

### 5. 手动触发刷新

```tsx
import { useState } from 'react'

function ManualRefreshInterface() {
  const [trigger, setTrigger] = useState(0)

  const handleRefresh = () => {
    setTrigger(Date.now())
  }

  return (
    <>
      <button onClick={handleRefresh}>刷新数据</button>
      <InterfaceDataSource
        id="manual-data"
        op={{
          key: 'get_report_data'
        }}
        submit={trigger.toString()}
      >
        <ReportDisplay />
      </InterfaceDataSource>
    </>
  )
}
```

### 6. 子组件获取数据

```tsx
import { useContextProvider } from '@/registry/blocks/containers/context-provider'

function DataDisplay() {
  const { data, loading } = useContextProvider()[0]

  if (loading) return <div>加载中...</div>
  if (!data) return <div>无数据</div>

  return (
    <div>
      <h3>接口数据</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

## 完整示例

### 设备监控仪表板

```tsx
import { InterfaceDataSource } from '@/registry/blocks/data-source/interface-data-source'
import { useContextProvider } from '@/registry/blocks/containers/context-provider'

function DeviceMonitorDashboard() {
  const [selectedDevice, setSelectedDevice] = useState('A001')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <InterfaceDataSource
      id="device-monitor"
      op={{
        key: 'device_monitor_data'
      }}
      params={{
        value: {
          deviceId: selectedDevice,
          metrics: ['temperature', 'humidity', 'pressure'],
          startTime: new Date(Date.now() - 3600000).toISOString(),
          endTime: new Date().toISOString()
        }
      }}
      predata={true}
      interval={60}
      submit={refreshTrigger.toString()}
    >
      <DashboardContent
        onDeviceChange={setSelectedDevice}
        onRefresh={() => setRefreshTrigger(Date.now())}
      />
    </InterfaceDataSource>
  )
}

function DashboardContent({ onDeviceChange, onRefresh }) {
  const { data, loading } = useContextProvider()[0]

  if (loading) return <div>加载中...</div>

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <select onChange={(e) => onDeviceChange(e.target.value)}>
          <option value="A001">设备 A001</option>
          <option value="A002">设备 A002</option>
          <option value="A003">设备 A003</option>
        </select>
        <button onClick={onRefresh}>刷新</button>
      </div>

      {data && (
        <>
          <LineChart data={data} />
          <DataTable data={data} />
        </>
      )}
    </div>
  )
}
```

### 多接口组合使用

```tsx
function MultiInterfaceDashboard() {
  return (
    <div>
      {/* 接口 1: 设备状态 */}
      <InterfaceDataSource
        id="device-status"
        op={{
          key: 'get_device_status'
        }}
        params={{
          value: { deviceId: 'A001' }
        }}
      >
        <StatusCard />
      </InterfaceDataSource>

      {/* 接口 2: 设备历史数据 */}
      <InterfaceDataSource
        id="device-history"
        op={{
          key: 'get_device_history'
        }}
        params={{
          value: {
            deviceId: 'A001',
            hours: 24
          }
        }}
        predata={true}
      >
        <HistoryChart />
      </InterfaceDataSource>

      {/* 接口 3: 设备告警 */}
      <InterfaceDataSource
        id="device-alarms"
        op={{
          key: 'get_device_alarms'
        }}
        params={{
          value: {
            deviceId: 'A001',
            status: 'active'
          }
        }}
      >
        <AlarmList />
      </InterfaceDataSource>
    </div>
  )
}
```

## 数据结构说明

### 原始数据格式（predata = false）

接口返回的原始数据：

```typescript
{
  success: true,
  data: {
    deviceName: '1号设备',
    temperature: 25.5,
    humidity: 60.2,
    status: 'online'
  },
  timestamp: '2026-01-31T10:30:00Z'
}
```

### 预处理数据格式（predata = true）

数据被转换为图表格式：

```typescript
{
  dimensions: ['success', 'deviceName', 'temperature', 'humidity', 'status', 'timestamp'],
  source: [
    [true, '1号设备', 25.5, 60.2, 'online', '2026-01-31T10:30:00Z']
  ]
}
```

### 数组数据预处理

原始数组：
```typescript
[
  { name: '温度', value: 25.5, unit: '°C' },
  { name: '湿度', value: 60.2, unit: '%' },
  { name: '压力', value: 101.3, unit: 'kPa' }
]
```

预处理后：
```typescript
{
  dimensions: ['name', 'value', 'unit'],
  source: [
    ['温度', 25.5, '°C'],
    ['湿度', 60.2, '%'],
    ['压力', 101.3, 'kPa']
  ]
}
```

## 工作流程

```
1. 组件初始化
   ↓
2. 构建 URL: ds/p/{op.key}
   ↓
3. 发送 POST 请求
   - Body: params.value
   ↓
4. 接收响应数据
   ↓
5. 数据预处理（可选，predata = true）
   ↓
6. 更新状态和 Context
   ↓
7. 子组件通过 useContextProvider 获取数据
```

## 接口定义要求

接口需要满足以下要求：

1. **注册路径**：接口必须注册在 `ds/p/{key}` 路径下
2. **请求方法**：接受 POST 请求
3. **参数格式**：接受 JSON 格式的请求体
4. **响应格式**：返回 JSON 格式数据

### 示例接口定义

```typescript
// 系统中的接口定义示例
{
  "key": "device_max_values_Yglzib",
  "method": "POST",
  "path": "/ds/p/device_max_values_Yglzib",
  "params": {
    "deviceId": { "type": "string", "required": true },
    "startTime": { "type": "string", "required": false },
    "endTime": { "type": "string", "required": false }
  },
  "response": {
    "type": "object",
    "properties": {
      "maxValue": { "type": "number" },
      "maxTime": { "type": "string" }
    }
  }
}
```

## 参数关联关系

| 参数 | 关联参数 | 说明 |
|------|---------|------|
| `op.key` | - | 必需，用于构建请求路径 |
| `params.value` | `op.key` | 参数会传递给指定的接口 |
| `predata` | - | 独立配置，影响数据格式 |
| `interval` | - | 独立配置，控制轮询频率 |
| `submit` | - | 独立配置，控制手动刷新 |

## 与其他数据源的区别

| 特性 | InterfaceDataSource | ApiDataSource | HistoryDataSource |
|------|---------------------|---------------|-------------------|
| 用途 | 调用系统接口服务 | 调用 REST API | 查询历史数据 |
| 路径格式 | `ds/p/{key}` | 任意 URL | `core/data` |
| 请求方法 | POST | GET/POST/PUT/DELETE | POST |
| 参数传递 | Body JSON | Query/Body | 复杂对象 |
| 数据预处理 | 支持 | 支持 | 自动处理 |
| 适用场景 | 业务逻辑接口 | 通用 API | 时间序列数据 |

## 注意事项

1. **op.key 必需**：必须提供接口的 key，否则无法构建请求路径
2. **接口注册**：确保接口已在系统中正确注册
3. **参数格式**：`params.value` 必须是对象格式
4. **错误处理**：接口调用失败时，`dataset` 为 `null`，`loading` 为 `false`
5. **轮询间隔**：`interval` 单位为秒，建议不低于 10 秒
6. **数据格式**：确保接口返回的是有效的 JSON 格式
7. **性能优化**：频繁调用的接口建议设置合适的 `interval`
8. **参数变化**：`params` 变化会自动触发重新请求
9. **手动触发**：修改 `submit` 值可以手动触发请求
10. **内存管理**：组件卸载时会自动清除定时器

## 调试技巧

### 查看请求详情

```tsx
function DebugInterface() {
  const { data, loading, requestId } = useContextProvider()[0]

  useEffect(() => {
    if (requestId) {
      console.log('请求 ID:', requestId)
      console.log('数据:', data)
    }
  }, [requestId, data])

  return (
    <div>
      <p>状态: {loading ? '加载中' : '完成'}</p>
      <p>请求 ID: {requestId}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

### 错误处理

```tsx
function ErrorHandlingInterface() {
  const { data, loading } = useContextProvider()[0]

  if (loading) return <div>加载中...</div>
  if (!data) return <div>数据为空或请求失败</div>

  // 正常渲染数据
  return <DataDisplay data={data} />
}
```
