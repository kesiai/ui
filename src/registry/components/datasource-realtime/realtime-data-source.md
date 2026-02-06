# RealtimeDataSource 实时数据源组件

## 简介

`RealtimeDataSource` 是一个实时数据源容器组件，用于通过 WebSocket 订阅设备标签的实时数据更新。

- **纯容器组件**：不包含任何布局和样式
- **Context 集成**：内部集成 `ContextProvider`，子组件通过 `useContextProvider` 获取数据
- **自动数据管理**：数据自动存储到 Jotai atom，通过组件 ID 访问
- **WebSocket 实时更新**：自动订阅标签数据变化，实时推送到前端
- **历史数据加载**：初始加载时自动获取历史数据
- **自动数据维护**：WebSocket 数据到达时自动更新数据集

## 适用场景

- 实时监控设备状态
- 实时数据可视化
- 传感器数据实时显示
- 设备运行状态监控
- 实时仪表板

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | `string` | 否 | `'realtime-data-source'` | 数据源唯一标识，用于存储和访问数据 |
| `tags` | `Array<TagConfig>` | 是 | `[]` | 标签配置数组，定义要订阅的实时数据点 |
| `timeLine` | `TimeLineConfig` | 否 | `{ count: 5, unit: 'm' }` | 时间线配置，控制加载的历史数据范围 |
| `timeLine.count` | `number` | 否 | - | 时间数量 |
| `timeLine.unit` | `string` | 否 | - | 时间单位：`'s'`(秒)、`'m'`(分)、`'h'`(时)、`'d'`(天)、`'w'`(周) |
| `xFormat` | `string` | 否 | `'YYYY-MM-DD HH:mm:ss'` | 时间显示格式 |
| `submit` | `string` | 否 | - | 提交触发器标识，值变化时触发数据刷新 |
| `children` | `ReactNode` | 否 | - | 子组件 |

### tags 标签配置

`TagConfig` 用于配置要订阅的实时数据点，支持两种格式：

#### 格式 1：tableData 和 tag 分别配置（推荐）

```typescript
{
  tableData: {
    id: 'A001',
    name: '1号设备',
    table: { id: 'A', name: '设备表' }
  },
  tag: {
    id: 'temperature',
    name: '温度'
  },
  fixed?: 2,            // 保留小数位数
  title?: '1号设备温度'  // 显示标题
}
```

#### 格式 2：tag 包含 tableData（更简洁）

```typescript
{
  tag: {
    id: 'temperature',
    name: '温度',
    tableData: {
      id: 'A001',
      name: '1号设备',
      table: { id: 'A', name: '设备表' }
    }
  },
  fixed?: 2,
  title?: '1号设备温度'
}
```

### TagConfig 属性说明

| 属性 | 类型 | 说明 |
|------|------|------|
| `tableData` | `TableDataInfo` | 表数据信息（设备），包含 id、name、table（形式 1 必需） |
| `tag` | `TagInfo` | 标签信息（数据点），包含 id、name、tableData（形式 2 中 tableData 可配置在 tag 内） |
| `fixed` | `number` | 保留小数位数，默认 3 |
| `title` | `string` | 数据点显示标题，优先级最高 |

### timeLine 时间线配置

`TimeLineConfig` 定义加载历史数据的范围：

```typescript
{
  count?: number   // 时间数量
  unit?: string    // 时间单位：'s'(秒)、'm'(分)、'h'(时)、'd'(天)、'w'(周)
}
```

**配置示例：**

| 配置 | 说明 | 历史数据范围 |
|------|------|-------------|
| `{ count: 5, unit: 'm' }` | 最近 5 分钟 | 过去 5 分钟的数据 |
| `{ count: 1, unit: 'h' }` | 最近 1 小时 | 过去 1 小时的数据 |
| `{ count: 0, unit: '' }` | 仅最新值 | 只获取最新的一个数据点 |
| `{ count: 1, unit: 'd' }` | 最近 1 天 | 过去 1 天的数据 |

### xFormat 时间格式

使用 dayjs 格式化字符串，常用格式：

| 格式 | 说明 | 示例 |
|------|------|------|
| `'YYYY-MM-DD HH:mm:ss'` | 完整日期时间 | `2026-01-31 17:08:54` |
| `'YYYY-MM-DD HH:mm'` | 日期+分钟 | `2026-01-31 17:08` |
| `'MM-DD HH:mm:ss'` | 月日+时分秒 | `01-31 17:08:54` |
| `'HH:mm:ss'` | 时分秒 | `17:08:54` |
| `'HH:mm'` | 时分 | `17:08` |

## 工作原理

```
1. 组件初始化
   ↓
2. 加载历史数据
   - 根据 timeLine 范围查询历史数据
   - 初始化数据集
   ↓
3. 订阅 WebSocket
   - 向服务器注册要订阅的标签
   - 建立实时连接
   ↓
4. 接收实时更新
   - WebSocket 推送新数据
   - 自动更新数据集
   - 移除最旧的数据点，添加最新数据点
   ↓
5. 子组件渲染
   - 通过 useContextProvider 获取数据
   - 数据自动保持最新状态
```

## 基本用法

### 1. 查询单个标签的实时数据

```tsx
import { RealtimeDataSource } from '@/registry/components/datasource-realtime'

function SingleRealtimeTag() {
  return (
    <RealtimeDataSource
      id="single-realtime"
      tags={[{
        tableData: { id: 'A001', table: { id: 'A' } },
        tag: { id: 'temperature', name: '温度' },
        title: '1号设备温度'
      }]}
      timeLine={{ count: 5, unit: 'm' }}
    >
      <RealtimeChart />
    </RealtimeDataSource>
  )
}
```

**行为说明：**
- 初始加载最近 5 分钟的历史数据
- 订阅 `A001` 设备的 `temperature` 标签
- 收到新数据时，自动移除最旧点，添加最新点

### 2. 查询多个标签的实时数据

```tsx
function MultiRealtimeTags() {
  return (
    <RealtimeDataSource
      id="multi-realtime"
      tags={[
        {
          tableData: { id: 'A001', table: { id: 'A' } },
          tag: { id: 'temperature', name: '温度' },
          title: '1号设备温度',
          fixed: 1
        },
        {
          tableData: { id: 'A002', table: { id: 'A' } },
          tag: { id: 'temperature', name: '温度' },
          title: '2号设备温度',
          fixed: 1
        }
      ]}
      timeLine={{ count: 10, unit: 'm' }}
      xFormat="HH:mm:ss"
    >
      <MultiLineChart />
    </RealtimeDataSource>
  )
}
```

### 3. 使用形式 2（tag 包含 tableData）

```tsx
function CompactRealtime() {
  return (
    <RealtimeDataSource
      id="compact-realtime"
      tags={[{
        tag: {
          id: 'humidity',
          name: '湿度',
          tableData: {
            id: 'A001',
            table: { id: 'A' }
          }
        },
        fixed: 1
      }]}
      timeLine={{ count: 1, unit: 'h' }}
    >
      <HumidityGauge />
    </RealtimeDataSource>
  )
}
```

### 4. 仅获取最新值（不加载历史）

```tsx
function LatestValueOnly() {
  return (
    <RealtimeDataSource
      id="latest-value"
      tags={[{
        tableData: { id: 'A001', table: { id: 'A' } },
        tag: { id: 'pressure', name: '压力' }
      }]}
      timeLine={{ count: 0, unit: '' }}
    >
      <ValueDisplay />
    </RealtimeDataSource>
  )
}
```

**返回格式：**
```typescript
{
  dimensions: [
    { name: 'time', title: '时间', type: 'ordinal' },
    { name: 'value', title: '数据值', type: 'number' },
    { name: 'name', title: '名称', type: 'ordinal' },
    { name: 'key', title: '标识', type: 'ordinal' }
  ],
  source: [
    ['2026-01-31 17:08:54', 25.3, '1号设备-压力', 'A001-pressure']
  ]
}
```

### 5. 自定义时间格式

```tsx
function CustomTimeFormat() {
  return (
    <RealtimeDataSource
      id="custom-format"
      tags={[{
        tableData: { id: 'A001', table: { id: 'A' } },
        tag: { id: 'flow', name: '流量' }
      }]}
      timeLine={{ count: 30, unit: 's' }}
      xFormat="HH:mm:ss"  // 只显示时分秒
    >
      <FlowChart />
    </RealtimeDataSource>
  )
}
```

### 6. 手动触发刷新

```tsx
import { useState } from 'react'

function ManualRefreshRealtime() {
  const [trigger, setTrigger] = useState(0)

  return (
    <>
      <button onClick={() => setTrigger(Date.now())}>
        重载数据
      </button>
      <RealtimeDataSource
        id="manual-refresh"
        tags={[...]}
        submit={trigger.toString()}
      >
        <RealtimeDisplay />
      </RealtimeDataSource>
    </>
  )
}
```

### 7. 子组件获取数据

```tsx
import { useContextProvider } from '@/registry/components/container-context-provider'

function RealtimeDisplay() {
  const { data, loading } = useContextProvider()[0]

  if (loading) return <div>加载中...</div>
  if (!data || data.length === 0) return <div>无数据</div>

  return (
    <div>
      <h3>实时数据</h3>
      {data.map((dataset: any, index: number) => (
        <div key={index}>
          <h4>{dataset.title}</h4>
          <p>最新值: {dataset.source[dataset.source.length - 1][1]}</p>
        </div>
      ))}
    </div>
  )
}
```

## 完整示例

### 实时监控仪表板

```tsx
import { RealtimeDataSource } from '@/registry/components/datasource-realtime'
import { useContextProvider } from '@/registry/components/container-context-provider'

function RealtimeMonitorDashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 温度实时监控 */}
      <RealtimeDataSource
        id="temp-monitor"
        tags={[
          {
            tableData: { id: 'A001', name: '1号设备', table: { id: 'device' } },
            tag: { id: 'temperature', name: '温度' },
            title: '1号设备温度',
            fixed: 1
          },
          {
            tableData: { id: 'A002', name: '2号设备', table: { id: 'device' } },
            tag: { id: 'temperature', name: '温度' },
            title: '2号设备温度',
            fixed: 1
          }
        ]}
        timeLine={{ count: 10, unit: 'm' }}
        xFormat="HH:mm:ss"
      >
        <TempMonitorChart />
      </RealtimeDataSource>

      {/* 多指标监控 */}
      <RealtimeDataSource
        id="multi-metrics"
        tags={[
          {
            tableData: { id: 'A001', table: { id: 'A' } },
            tag: { id: 'humidity', name: '湿度' },
            title: '湿度',
            fixed: 1
          },
          {
            tableData: { id: 'A001', table: { id: 'A' } },
            tag: { id: 'pressure', name: '压力' },
            title: '压力',
            fixed: 2
          }
        ]}
        timeLine={{ count: 5, unit: 'm' }}
      >
        <MetricsGauge />
      </RealtimeDataSource>
    </div>
  )
}
```

### 实时数据表格

```tsx
function RealtimeDataTable() {
  return (
    <RealtimeDataSource
      id="realtime-table"
      tags={[
        {
          tableData: { id: 'A001', table: { id: 'A' } },
          tag: { id: 'status', name: '状态' }
        },
        {
          tableData: { id: 'A002', table: { id: 'A' } },
          tag: { id: 'status', name: '状态' }
        },
        {
          tableData: { id: 'A003', table: { id: 'A' } },
          tag: { id: 'status', name: '状态' }
        }
      ]}
      timeLine={{ count: 0, unit: '' }}
      xFormat="YYYY-MM-DD HH:mm:ss"
    >
      <StatusTable />
    </RealtimeDataSource>
  )
}
```

## 数据结构说明

### 历史数据格式（timeLine.count > 0）

返回多个数据集，每个标签一个：

```typescript
[
  {
    key: 'A001-temperature',
    title: '1号设备温度',
    dimensions: [
      { name: 'time', title: '时间', type: 'ordinal' },
      { name: '1号设备温度', type: 'number', tag: 'A001-temperature' }
    ],
    source: [
      ['2026-01-31 17:00:00', 25.1, 'A001'],
      ['2026-01-31 17:01:00', 25.3, 'A001'],
      ['2026-01-31 17:02:00', 25.2, 'A001'],
      // ... 更多数据点
    ]
  },
  {
    key: 'A002-temperature',
    title: '2号设备温度',
    dimensions: [
      { name: 'time', title: '时间', type: 'ordinal' },
      { name: '2号设备温度', type: 'number', tag: 'A002-temperature' }
    ],
    source: [
      ['2026-01-31 17:00:00', 24.8, 'A002'],
      ['2026-01-31 17:01:00', 24.9, 'A002'],
      ['2026-01-31 17:02:00', 25.0, 'A002'],
      // ... 更多数据点
    ]
  }
]
```

### 最新值格式（timeLine.count = 0）

返回单个数据集，包含所有标签的最新值：

```typescript
[
  {
    dimensions: [
      { name: 'time', title: '时间', type: 'ordinal' },
      { name: 'value', title: '数据值', type: 'number' },
      { name: 'name', title: '名称', type: 'ordinal' },
      { name: 'key', title: '标识', type: 'ordinal' }
    ],
    source: [
      ['2026-01-31 17:08:54', 25.3, '1号设备-温度', 'A001-temperature'],
      ['2026-01-31 17:08:55', 24.8, '2号设备-温度', 'A002-temperature'],
      ['2026-01-31 17:08:56', 101.3, '1号设备-压力', 'A001-pressure']
    ]
  }
]
```

### WebSocket 数据更新流程

当新数据通过 WebSocket 到达时：

1. **识别数据**：根据 `tableDataId` 和 `tagId` 识别数据归属
2. **更新数据集**：
   - 找到对应的数据集
   - 移除最旧的数据点（第一个）
   - 在末尾添加新的数据点
3. **保持排序**：按 tags 的配置顺序保持数据集顺序

## 数据更新机制

### 历史数据加载

组件初始化时，根据 `timeLine` 配置加载历史数据：

```typescript
// timeLine: { count: 5, unit: 'm' }
// 查询条件：time >= now() - 5m
// 按时间倒序排列
// 取最近的 N 个数据点
```

### 实时数据更新

WebSocket 推送新数据时：

```typescript
// WebSocket 推送的数据格式
{
  tableDataId: 'A001',
  time: '2026-01-31T17:08:55Z',
  fields: {
    temperature: 25.5,
    humidity: 60.2
  }
}

// 组件处理
// 1. 识别 tableDataId 和 tagId
// 2. 更新对应的数据集
// 3. 移除 source[0]，添加新点到 source 末尾
```

## 参数关联关系

| 参数 | 关联参数 | 说明 |
|------|---------|------|
| `tags` | - | 必需，定义要订阅的标签 |
| `timeLine` | - | 独立配置，控制历史数据范围 |
| `timeLine.count` | `timeLine.unit` | 一起使用，定义时间范围 |
| `xFormat` | - | 独立配置，影响时间显示格式 |
| `submit` | - | 独立配置，控制手动刷新 |

## 与 HistoryDataSource 的区别

| 特性 | RealtimeDataSource | HistoryDataSource |
|------|-------------------|-------------------|
| 数据获取方式 | WebSocket 实时推送 | HTTP 查询 |
| 初始数据 | 加载历史数据作为基础 | 查询历史数据 |
| 数据更新 | WebSocket 自动推送 | `interval` 轮询或 `submit` 触发 |
| 适用场景 | 实时监控、仪表板 | 历史趋势、数据分析 |
| 网络开销 | 低（只在数据变化时推送） | 高（需要轮询） |
| 实时性 | 高（毫秒级） | 低（取决于轮询间隔） |
| 数据量 | 通常较小（维护固定时间窗口） | 可大可小（灵活配置） |

## 注意事项

1. **tags 必需**：必须配置至少一个标签，否则无法订阅数据

2. **WebSocket 连接**：
   - 依赖系统的 WebSocket 服务
   - 确保 WebSocket 服务正常运行
   - 网络断开会自动重连

3. **timeLine 配置**：
   - `count: 0` 时只获取最新值
   - 设置较大的 `count` 会增加初始加载时间
   - 建议：实时监控使用较小的时间窗口（5-15 分钟）

4. **数据维护**：
   - 数据集保持固定大小（由 `timeLine` 决定）
   - 新数据到达时，自动移除最旧的数据点
   - 不会无限增长，避免内存泄漏

5. **标签顺序**：
   - 数据集按 `tags` 配置的顺序排列
   - 修改 `tags` 顺序会改变数据集顺序

6. **fixed 参数**：
   - 控制数据值的小数位数
   - 默认保留 3 位小数
   - 设置 `fixed: 0` 取整

7. **性能优化**：
   - 避免订阅过多标签（建议 < 20 个）
   - 合理设置 `timeLine`，避免加载过多历史数据
   - 使用 `xFormat` 减少字符串处理开销

8. **错误处理**：
   - WebSocket 连接失败时，数据保持为空
   - 历史数据加载失败时，会显示 toast 提示
   - 单个标签失败不影响其他标签

9. **调试技巧**：
   - 使用浏览器开发者工具查看 WebSocket 连接
   - 检查 Network 面板的 WS 标签
   - 查看控制台的错误日志

10. **组件卸载**：
    - 组件卸载时自动取消 WebSocket 订阅
    - 不会造成内存泄漏
    - 重新挂载时会重新建立连接
