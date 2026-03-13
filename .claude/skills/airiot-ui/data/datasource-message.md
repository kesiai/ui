# DatasourceMessage 消息数据源组件

## 简介

`DatasourceMessage` 是一个消息数据源容器组件，用于查询系统中的消息数据（如操作日志、系统消息等）。

- **纯容器组件**：不包含任何布局和样式
- **Context 集成**：内部集成 `ContextProvider`，子组件通过 `useContextProvider` 获取数据
- **自动数据管理**：数据自动存储到 Jotai atom，通过组件 ID 访问
- **灵活的查询配置**：支持过滤、分组、聚合、排序等功能
- **字段格式化**：支持对时间和数字字段进行格式化
- **定时轮询**：支持设置定时轮询间隔

## 适用场景

- 查询系统操作日志
- 统计消息数据
- 分析用户行为
- 审计日志查询
- 消息趋势分析

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | `string` | 否 | `'message-data-source'` | 数据源唯一标识，用于存储和访问数据 |
| `initFilter` | `Record<string, any>` | 否 | `{}` | 初始过滤条件 |
| `isGroup` | `boolean` | 否 | `false` | 是否开启分组聚合查询 |
| `group` | `Array<GroupItem>` | 否 | `[]` | 分组配置数组 |
| `columns` | `Array<ColumnItem>` | 否 | `[]` | 聚合列配置数组 |
| `fieldOrder` | `Array<SortItem>` | 否 | `[]` | 字段排序配置 |
| `limit` | `number` | 否 | `3` | 返回结果最大条数，默认最多 1000 条 |
| `interval` | `number` | 否 | `0` | 轮询间隔（秒），0 表示不轮询 |
| `feildFormat` | `Array<FieldFormat>` | 否 | `[]` | 字段格式化配置 |
| `submit` | `string` | 否 | - | 提交触发器标识，值变化时触发数据刷新 |
| `children` | `ReactNode` | 否 | - | 子组件 |

### initFilter 过滤条件

设置消息查询的初始过滤条件，支持 MongoDB 风格的查询语法：

```typescript
{
  initFilter: {
    messageType: 'device',
    optType: 'create',
    createTime: {
      $gte: '2026-01-01 00:00:00',
      $lte: '2026-01-31 23:59:59'
    }
  }
}
```

### group 分组配置

分组配置项，支持按字段或日期维度分组：

```typescript
{
  field?: string                                    // 分组字段
  dateOperator?: '天' | '周' | '月' | '年' |      // 日期操作符
    '一小时内的分钟数' | '一天内的小时数' |
    '一周内的天数' | '一月内的天数' |
    '一年内的天数' | '一年内的星期数' |
    '一年内的月数'
}
```

**可用的消息字段：**
- `messageType` - 消息类型
- `createTime` - 创建时间
- `optType` - 操作类型

### columns 聚合列配置

配置聚合计算的数据列：

```typescript
{
  name?: string                           // 聚合列名称
  field?: string                          // 字段名
  accumulator?: '$count' | '$avg' |      // 聚合操作符
    '$first' | '$last' | '$max' |
    '$min' | '$sum'
  expression?: any                        // 自定义表达式
}
```

**聚合操作符说明：**

| 操作符 | 说明 | 示例 |
|--------|------|------|
| `$count` | 计数 | 统计记录数量 |
| `$avg` | 平均值 | 计算数值平均值 |
| `$first` | 第一个值 | 获取分组的第一个值 |
| `$last` | 最后一个值 | 获取分组的最后一个值 |
| `$max` | 最大值 | 获取数值最大值 |
| `$min` | 最小值 | 获取数值最小值 |
| `$sum` | 求和 | 计算数值总和 |

### fieldOrder 排序配置

字段排序配置：

```typescript
{
  value: string          // 排序字段
  order?: 'ASC' | 'DESC' // 排序方向，默认 'ASC'
}
```

### feildFormat 字段格式化

字段格式化配置：

```typescript
{
  field: string    // 字段名
  format: string   // 格式化字符串
}
```

**支持的格式化：**

| 字段 | format 示例 | 说明 |
|------|-------------|------|
| `createTime` | `'YYYY-MM-DD HH:mm:ss'` | 日期时间格式化 |
| 数字字段 | `'0.00'` | 数字格式化，保留小数位 |

## 基本用法

### 1. 查询所有消息

```tsx
import { DatasourceMessage } from '@/components/airiot/datasource-message'

function AllMessages() {
  return (
    <DatasourceMessage
      id="all-messages"
      limit={10}
    >
      <MessageList />
    </DatasourceMessage>
  )
}
```

### 2. 带过滤条件的查询

```tsx
function FilteredMessages() {
  return (
    <DatasourceMessage
      id="filtered-messages"
      initFilter={{
        messageType: 'device',
        optType: 'create'
      }}
      fieldOrder={[{ value: 'createTime', order: 'DESC' }]}
      limit={20}
    >
      <DeviceCreateMessages />
    </DatasourceMessage>
  )
}
```

### 3. 按日期分组统计

按天统计消息数量：

```tsx
function DailyMessageStats() {
  return (
    <DatasourceMessage
      id="daily-stats"
      isGroup={true}
      group={[
        {
          field: 'createTime',
          dateOperator: '天'
        }
      ]}
      columns={[
        {
          name: '消息数量',
          accumulator: '$count'
        }
      ]}
      limit={30}
    >
      <DailyChart />
    </DatasourceMessage>
  )
}
```

### 4. 按消息类型分组

```tsx
function TypeMessageStats() {
  return (
    <DatasourceMessage
      id="type-stats"
      isGroup={true}
      group={[
        {
          field: 'messageType'
        }
      ]}
      columns={[
        {
          name: '数量',
          accumulator: '$count'
        }
      ]}
      fieldOrder={[{ value: '数量', order: 'DESC' }]}
    >
      <TypePieChart />
    </DatasourceMessage>
  )
}
```

### 5. 复杂分组统计

按消息类型和操作类型分组：

```tsx
function ComplexGroupStats() {
  return (
    <DatasourceMessage
      id="complex-stats"
      isGroup={true}
      group={[
        {
          field: 'messageType'
        },
        {
          field: 'optType'
        }
      ]}
      columns={[
        {
          name: '操作数量',
          accumulator: '$count'
        }
      ]}
      limit={100}
    >
      <StatsTable />
    </DatasourceMessage>
  )
}
```

### 6. 按小时统计

统计一天内每小时的的消息数量：

```tsx
function HourlyMessageStats() {
  return (
    <DatasourceMessage
      id="hourly-stats"
      initFilter={{
        createTime: {
          $gte: new Date().setHours(0, 0, 0, 0)
        }
      }}
      isGroup={true}
      group={[
        {
          field: 'createTime',
          dateOperator: '一天内的小时数'
        }
      ]}
      columns={[
        {
          name: '消息数',
          accumulator: '$count'
        }
      ]}
    >
      <HourlyBarChart />
    </DatasourceMessage>
  )
}
```

### 7. 字段格式化

```tsx
function FormattedMessages() {
  return (
    <DatasourceMessage
      id="formatted-messages"
      fieldOrder={[{ value: 'createTime', order: 'DESC' }]}
      feildFormat={[
        {
          field: 'createTime',
          format: 'YYYY-MM-DD HH:mm:ss'
        }
      ]}
      limit={50}
    >
      <FormattedMessageList />
    </DatasourceMessage>
  )
}
```

### 8. 定时刷新

每 30 秒自动刷新数据：

```tsx
function RealtimeMessages() {
  return (
    <DatasourceMessage
      id="realtime-messages"
      initFilter={{
        messageType: 'alert'
      }}
      fieldOrder={[{ value: 'createTime', order: 'DESC' }]}
      limit={10}
      interval={30}
    >
      <AlertList />
    </DatasourceMessage>
  )
}
```

### 9. 手动触发刷新

```tsx
import { useState } from 'react'

function ManualRefreshMessages() {
  const [trigger, setTrigger] = useState(0)

  const handleRefresh = () => {
    setTrigger(Date.now())
  }

  return (
    <>
      <button onClick={handleRefresh}>刷新消息</button>
      <DatasourceMessage
        id="manual-messages"
        submit={trigger.toString()}
        limit={20}
      >
        <MessageTable />
      </DatasourceMessage>
    </>
  )
}
```

### 10. 子组件获取数据

```tsx
import { useContextProvider } from '@/components/airiot/container-context-provider'

function MessageDisplay() {
  const { data, loading } = useContextProvider()[0]

  if (loading) return <div>加载中...</div>
  if (!data || data.length === 0) return <div>无消息数据</div>

  return (
    <div>
      <h3>系统消息</h3>
      <ul>
        {data.map((msg: any, index: number) => (
          <li key={index}>
            <p>类型: {msg.messageType}</p>
            <p>操作: {msg.optType}</p>
            <p>时间: {msg.createTime}</p>
            <p>数据: {JSON.stringify(msg.data)}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## 完整示例

### 消息统计仪表板

```tsx
import { DatasourceMessage } from '@/components/airiot/datasource-message'
import { useContextProvider } from '@/components/airiot/container-context-provider'

function MessageDashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 总消息数量统计 */}
      <DatasourceMessage
        id="total-count"
        isGroup={true}
        columns={[{ name: '总数', accumulator: '$count' }]}
      >
        <TotalCountCard />
      </DatasourceMessage>

      {/* 按类型分组统计 */}
      <DatasourceMessage
        id="type-distribution"
        isGroup={true}
        group={[{ field: 'messageType' }]}
        columns={[{ name: '数量', accumulator: '$count' }]}
      >
        <TypeDistributionChart />
      </DatasourceMessage>

      {/* 最近消息 */}
      <DatasourceMessage
        id="recent-messages"
        fieldOrder={[{ value: 'createTime', order: 'DESC' }]}
        feildFormat={[
          { field: 'createTime', format: 'MM-DD HH:mm' }
        ]}
        limit={10}
      >
        <RecentMessageList />
      </DatasourceMessage>

      {/* 每日消息趋势 */}
      <DatasourceMessage
        id="daily-trend"
        isGroup={true}
        group={[{ field: 'createTime', dateOperator: '天' }]}
        columns={[{ name: '消息数', accumulator: '$count' }]}
        fieldOrder={[{ value: '创建时间', order: 'ASC' }]}
        limit={30}
      >
        <DailyTrendChart />
      </DatasourceMessage>
    </div>
  )
}
```

### 操作日志查询

```tsx
function OperationLogQuery() {
  const [logType, setLogType] = useState('all')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const getFilter = () => {
    if (logType === 'all') return {}
    return { messageType: logType }
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <select value={logType} onChange={(e) => setLogType(e.target.value)}>
          <option value="all">全部</option>
          <option value="device">设备</option>
          <option value="user">用户</option>
          <option value="system">系统</option>
        </select>
        <button onClick={() => setRefreshTrigger(Date.now())}>
          刷新
        </button>
      </div>

      <DatasourceMessage
        id="operation-logs"
        initFilter={getFilter()}
        fieldOrder={[{ value: 'createTime', order: 'DESC' }]}
        feildFormat={[
          { field: 'createTime', format: 'YYYY-MM-DD HH:mm:ss' }
        ]}
        limit={50}
        submit={refreshTrigger.toString()}
      >
        <OperationLogTable />
      </DatasourceMessage>
    </div>
  )
}
```

## 数据结构说明

### 消息对象结构

```typescript
{
  _id: string,              // 消息唯一 ID
  messageType: string,      // 消息类型（device、user、system 等）
  optType: string,          // 操作类型（create、update、delete 等）
  createTime: string,       // 创建时间
  data: any,               // 消息数据
  record: any,             // 关联记录
  isDelete: boolean        // 是否删除
}
```

### 分组查询返回格式

```typescript
[
  {
    '消息类型': 'device',      // 分组字段
    '数量': 150                // 聚合结果
  },
  {
    '消息类型': 'user',
    '数量': 80
  }
]
```

### 时间分组返回格式

```typescript
[
  {
    '创建时间': '2026-01-01',  // 按天分组
    '消息数': 120
  },
  {
    '创建时间': '2026-01-02',
    '消息数': 135
  }
]
```

## 日期操作符说明

| 操作符 | 说明 | MongoDB 操作 | 示例结果 |
|--------|------|--------------|----------|
| `天` | 按天分组 | `$dateToString: { format: '%Y-%m-%d' }` | `2026-01-31` |
| `周` | 按周分组 | `$dateToString: { format: '%Y-%V' }` | `2026-05` |
| `月` | 按月分组 | `$dateToString: { format: '%Y-%m' }` | `2026-01` |
| `年` | 按年分组 | `$year` | `2026` |
| `一小时内的分钟数` | 按分钟分组（0-59） | `$minute` | `30` |
| `一天内的小时数` | 按小时分组（0-23） | `$hour` | `14` |
| `一周内的天数` | 按星期几分组（1-7） | `$dayOfWeek` | `3` |
| `一月内的天数` | 按日期分组（1-31） | `$dayOfMonth` | `15` |
| `一年内的天数` | 按一年中的第几天（1-366） | `$dayOfYear` | `45` |
| `一年内的星期数` | 按第几周分组（1-53） | `$week` | `5` |
| `一年内的月数` | 按月份分组（1-12） | `$month` | `1` |

## 消息字段说明

| 字段 | 类型 | 说明 | 可用操作 |
|------|------|------|---------|
| `messageType` | string | 消息类型 | 分组、过滤 |
| `createTime` | string | 创建时间 | 分组、过滤、排序、格式化 |
| `optType` | string | 操作类型 | 分组、过滤 |
| `data` | object | 消息数据 | - |
| `record` | object | 关联记录 | - |

## 参数关联关系

| 参数 | 关联参数 | 说明 |
|------|---------|------|
| `isGroup` | `group`, `columns` | 开启分组时，必须配置 `group` 和 `columns` |
| `group` | `isGroup` | 只有 `isGroup=true` 时才生效 |
| `columns` | `isGroup` | 只有 `isGroup=true` 时才生效 |
| `feildFormat` | - | 独立配置，对结果进行格式化 |
| `fieldOrder` | - | 独立配置，控制结果排序 |
| `initFilter` | - | 独立配置，控制查询范围 |
| `limit` | - | 独立配置，控制返回条数 |
| `interval` | - | 独立配置，控制轮询频率 |
| `submit` | - | 独立配置，控制手动刷新 |

## 查询模式

### 模式 1：简单查询（不分组）

```tsx
<DatasourceMessage
  initFilter={{ messageType: 'device' }}
  fieldOrder={[{ value: 'createTime', order: 'DESC' }]}
  limit={10}
>
```

返回原始消息记录列表。

### 模式 2：分组聚合查询

```tsx
<DatasourceMessage
  isGroup={true}
  group={[{ field: 'messageType' }]}
  columns={[{ name: '数量', accumulator: '$count' }]}
>
```

返回按分组聚合后的统计结果。

## 注意事项

1. **isGroup 与 group/columns 的关系**：
   - `isGroup=true` 时，必须配置 `group` 和 `columns`
   - `isGroup=false` 时，`group` 和 `columns` 会被忽略

2. **limit 限制**：
   - 不设置时默认最多返回 1000 条
   - 建议根据实际需求设置合理的 limit，避免数据量过大

3. **字段名称**：
   - 分组后的字段名会自动使用中文标签（如"消息类型"、"创建时间"）
   - 排序和格式化时需要使用原始字段名（如 `messageType`、`createTime`）

4. **时间字段格式化**：
   - `createTime` 字段支持多种日期格式化
   - 使用 dayjs 格式化字符串

5. **过滤条件**：
   - 支持 MongoDB 风格的查询操作符（`$gte`、`$lte`、`$ne` 等）
   - 字符串匹配默认区分大小写

6. **性能优化**：
   - 大数据量查询建议使用分组聚合
   - 合理设置 `limit` 避免返回过多数据
   - 避免过于复杂的分组组合

7. **轮询间隔**：
   - `interval` 单位为秒，建议不低于 10 秒
   - 频繁轮询可能增加服务器负载

8. **数据更新**：
   - `initFilter`、`fieldOrder`、`feildFormat` 变化会自动触发查询
   - `submit` 值变化会手动触发查询
