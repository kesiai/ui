# HistoryDataSource 历史数据源组件

## 简介

`HistoryDataSource` 是一个历史数据查询容器组件，用于从系统中查询设备/表的历史数据并提供给子组件使用。

- **纯容器组件**：不包含任何布局和样式
- **Context 集成**：内部集成 `ContextProvider`，子组件通过 `useContextProvider` 获取数据
- **自动数据管理**：数据自动存储到 Jotai atom，通过组件 ID 访问
- **灵活的查询配置**：支持时间范围、分组、聚合等多种查询方式
- **多数据源支持**：支持标签（tags）和列（columns）两种数据配置方式

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | `string` | 否 | `'history-data-source'` | 数据源唯一标识，用于存储和访问数据 |
| `timeRange` | `TimeRangeConfig` | 否 | - | 时间范围配置 |
| `group` | `GroupConfig` | 否 | - | 分组配置，用于按时间段或分组字段聚合数据 |
| `tags` | `Array<TagConfig>` | 否 | `[]` | 标签配置数组，用于查询设备标签数据 |
| `columns` | `Array<ColumnConfig>` | 否 | `[]` | 列配置数组，用于查询表字段数据 |
| `interval` | `number` | 否 | `0` | 轮询间隔（秒），0 表示不轮询 |
| `xFormat` | `string` | 否 | `'YYYY-MM-DD HH:mm:ss'` | 时间轴格式化字符串 |
| `submit` | `string` | 否 | - | 提交触发器标识，值变化时触发数据刷新 |
| `children` | `ReactNode` | 否 | - | 子组件 |

### timeRange 时间范围配置

`TimeRangeConfig` 定义查询的时间范围，支持 3 种类型：

```typescript
interface TimeRangeConfig {
  type?: 'forward' | 'backward' | 'custom'
  range?: {
    radioType?: number              // 1: 固定范围, 2: 班次范围
    gte?: string                    // 开始时间，格式: 'YYYY-MM-DD HH:mm:ss'
    lte?: string                    // 结束时间，格式: 'YYYY-MM-DD HH:mm:ss'
    date?: string                   // 班次日期，格式: 'YYYY-MM-DD'（radioType=2 时使用）
    record?: {                      // 班次记录（radioType=2 时使用）
      table?: { id?: string }       // 班次表
      id?: string                   // 班次记录ID
    }
  }
  unit?: string                     // 时间单位: 's'(秒), 'm'(分), 'h'(小时), 'd'(天), 'w'(周), 'fm'(财务月)
  count?: number                    // 时间数量
  fromNow?: boolean                 // 是否从现在开始计算
}
```

#### type 类型说明

| type 值 | 说明 | 使用场景 |
|---------|------|---------|
| `'forward'` | 向前推算 | 查询"过去N小时"的数据 |
| `'backward'` | 向后推算 | 查询"未来N小时"的数据 |
| `'custom'` | 自定义范围 | 使用 range.gte 和 range.lte 指定具体范围 |

#### 时间单位（unit）说明

| unit 值 | 说明 | 示例 |
|---------|------|------|
| `'s'` | 秒 | `count: 60, unit: 's'` = 60秒 |
| `'m'` | 分钟 | `count: 30, unit: 'm'` = 30分钟 |
| `'h'` | 小时 | `count: 2, unit: 'h'` = 2小时 |
| `'d'` | 天 | `count: 7, unit: 'd'` = 7天 |
| `'w'` | 周 | `count: 1, unit: 'w'` = 1周 |
| `'fm'` | 财务月 | `count: 1, unit: 'fm'` = 1个财务月 |

#### radioType 说明

| radioType 值 | 说明 | 必需参数 |
|--------------|------|---------|
| `1` 或 `undefined` | 固定时间范围 | `gte`, `lte` |
| `2` | 班次时间范围 | `date`, `record.table.id`, `record.id` |

### group 分组配置

`GroupConfig` 用于将数据按时间段或字段分组聚合：

```typescript
interface GroupConfig {
  count?: number              // 分组数量
  unit?: string               // 分组单位，支持时间单位: 's', 'm', 'h', 'd', 'w', 'fm'
  fill?: {                    // 空值填充配置
    value: string             // 填充值，通常为 'null' 或 '0'
  }
  isClassMode?: boolean       // 是否班次模式
  table?: any                 // 班次表（isClassMode=true 时使用）
  record?: any                // 班次记录（isClassMode=true 时使用）
}
```

#### 分组示例

| 配置 | 说明 |
|------|------|
| `{ count: 5, unit: 'm', fill: { value: 'null' } }` | 每 5 分钟一个数据点 |
| `{ count: 1, unit: 'h', fill: { value: '0' } }` | 每 1 小时一个数据点，空值填 0 |
| `{ count: 0, unit: '' }` | 不分组（原始数据） |

### tags 标签配置

`TagConfig` 用于配置设备标签数据点，支持两种格式：

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
  func: 'mean',        // 聚合函数: 'mean'(平均), 'max'(最大), 'min'(最小), 'sum'(求和), 'count'(计数)
  fixed: 2,            // 保留小数位数
  title: '1号设备温度'  // 显示标题
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
  func: 'mean',
  fixed: 2,
  title: '1号设备温度'
}
```

#### TagConfig 属性说明

| 属性 | 类型 | 说明 |
|------|------|------|
| `tableData` | `TableDataInfo` | 表数据信息（设备），包含 id、name、table（形式 1 必需） |
| `tag` | `TagInfo` | 标签信息（数据点），包含 id、name、tableData（形式 2 中 tableData 可配置在 tag 内） |
| `func` | `string` | 聚合函数，在分组时使用：`mean`、`max`、`min`、`sum`、`count`、`first`、`last` |
| `fixed` | `number` | 保留小数位数，默认 3 |
| `title` | `string` | 数据点显示标题，优先级最高 |
| `groupType` | `'id' \| 'department' \| 'other'` | 分组类型：按 ID、部门、或其他字段分组 |
| `group` | `string` | 自定义分组字段名（groupType='other' 时使用） |
| `query` | `array` | 其他查询条件，二维数组格式 |

### columns 列配置

`ColumnConfig` 用于配置表字段数据查询：

```typescript
{
  field: 'COUNT("a")',  // 字段表达式，支持聚合函数: MEAN, MAX, MIN, SUM, COUNT
  table: {
    id: 'A',
    name: '设备表',
    tableMajorType: 'device'
  },
  tableData: {
    id: 'A001',
    name: '1号设备',
    table: { id: 'A' }
  },
  groupType: 'id'       // 分组类型（可选）
}
```

#### ColumnConfig 属性说明

| 属性 | 类型 | 说明 |
|------|------|------|
| `field` | `string` | 字段表达式，如 `'temperature'` 或 `'MEAN("temperature")'` |
| `table` | `TableInfo` | 表信息 |
| `tableData` | `TableDataInfo` | 表数据信息（设备），可省略表示查询全部 |
| `groupType` | `'id' \| 'department' \| 'other'` | 分组类型 |

### xFormat 时间格式

使用 dayjs 格式化字符串，常用格式：

| 格式 | 说明 | 示例 |
|------|------|------|
| `'YYYY-MM-DD HH:mm:ss'` | 完整日期时间 | `2026-01-31 17:08:54` |
| `'YYYY-MM-DD HH:mm'` | 日期+分钟 | `2026-01-31 17:08` |
| `'MM-DD HH:mm'` | 月日+时分 | `01-31 17:08` |
| `'HH:mm:ss'` | 时分秒 | `17:08:54` |
| `'YYYY/MM/DD'` | 斜杠分隔 | `2026/01/31` |

## 基本用法

### 1. 查询单个标签的历史数据

查询设备 A001 的温度数据，最近 1 小时：

```tsx
import { HistoryDataSource } from '@/registry/components/datasource-history'

function TemperatureChart() {
  return (
    <HistoryDataSource
      id="temperature-history"
      timeRange={{
        type: 'forward',
        count: 1,
        unit: 'h',
        fromNow: true
      }}
      tags={[{
        tableData: { id: 'A001', name: '1号设备', table: { id: 'A', name: '设备表' } },
        tag: { id: 'temperature', name: '温度' },
        title: '1号设备温度'
      }]}
    >
      <LineChart />
    </HistoryDataSource>
  )
}
```

### 2. 查询多个标签并分组

查询多个设备的温度，每 5 分钟一个数据点：

```tsx
function MultiDeviceChart() {
  return (
    <HistoryDataSource
      timeRange={{
        type: 'custom',
        range: {
          gte: '2026-01-01 00:00:00',
          lte: '2026-01-31 23:59:59'
        }
      }}
      group={{
        count: 5,
        unit: 'm',
        fill: { value: 'null' }
      }}
      tags={[
        {
          tableData: { id: 'A001', table: { id: 'A' } },
          tag: { id: 'temperature', name: '温度' },
          func: 'mean',
          title: '设备1温度'
        },
        {
          tableData: { id: 'A002', table: { id: 'A' } },
          tag: { id: 'temperature', name: '温度' },
          func: 'mean',
          title: '设备2温度'
        }
      ]}
    >
      <MultiLineChart />
    </HistoryDataSource>
  )
}
```

### 3. 使用形式 2（tag 包含 tableData）

```tsx
function CompactFormat() {
  return (
    <HistoryDataSource
      timeRange={{
        type: 'forward',
        count: 1,
        unit: 'd',
        fromNow: true
      }}
      tags={[{
        tag: {
          id: 'temperature',
          name: '温度',
          tableData: {
            id: 'A001',
            name: '1号设备',
            table: { id: 'A', name: '设备表' }
          }
        },
        func: 'mean',
        fixed: 2
      }]}
    >
      <DataDisplay />
    </HistoryDataSource>
  )
}
```

### 4. 使用 columns 查询字段数据

```tsx
function FieldQuery() {
  return (
    <HistoryDataSource
      timeRange={{
        type: 'forward',
        count: 7,
        unit: 'd',
        fromNow: true
      }}
      columns={[{
        field: 'MEAN("value")',
        table: { id: 'A', name: '设备表', tableMajorType: 'device' },
        tableData: { id: 'A001', name: '1号设备', table: { id: 'A' } }
      }]}
    >
      <StatisticsChart />
    </HistoryDataSource>
  )
}
```

### 5. 按设备 ID 分组

```tsx
function GroupByDevice() {
  return (
    <HistoryDataSource
      timeRange={{
        type: 'custom',
        range: {
          gte: '2026-01-01 00:00:00',
          lte: '2026-01-01 23:59:59'
        }
      }}
      group={{
        count: 1,
        unit: 'h'
      }}
      tags={[{
        tag: {
          id: 'temperature',
          name: '温度'
        },
        func: 'mean',
        groupType: 'id',  // 按设备 ID 分组
        title: '各设备平均温度'
      }]}
    >
      <GroupedBarChart />
    </HistoryDataSource>
  )
}
```

### 6. 使用班次时间范围

```tsx
function ClassScheduleQuery() {
  return (
    <HistoryDataSource
      timeRange={{
        type: 'custom',
        range: {
          radioType: 2,
          date: '2026-01-31',
          record: {
            table: { id: 'class_schedule' },
            id: 'morning_shift_id'
          }
        }
      }}
      tags={[{
        tableData: { id: 'A001', table: { id: 'A' } },
        tag: { id: 'production_count', name: '产量' },
        title: '早班产量'
      }]}
    >
      <ProductionChart />
    </HistoryDataSource>
  )
}
```

### 7. 定时刷新数据

每 30 秒自动刷新数据：

```tsx
function RealtimeHistory() {
  return (
    <HistoryDataSource
      timeRange={{
        type: 'forward',
        count: 5,
        unit: 'm',
        fromNow: true
      }}
      interval={30}
      tags={[{
        tag: {
          id: 'temperature',
          name: '温度',
          tableData: {
            id: 'A001',
            table: { id: 'A' }
          }
        }
      }]}
    >
      <RealtimeChart />
    </HistoryDataSource>
  )
}
```

### 8. 子组件获取数据

```tsx
import { useContextProvider } from '@/registry/components/container-context-provider'

function DataDisplay() {
  const { data, loading } = useContextProvider()[0]

  if (loading) return <div>加载中...</div>
  if (!data) return <div>无数据</div>

  // 数据格式
  // data.dimensions: 列定义
  // data.source: 数据数组，每个元素是一行的值

  return (
    <div>
      <h3>查询结果</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

### 9. 触发手动刷新

```tsx
function ManualRefresh() {
  const [trigger, setTrigger] = useState(0)

  const handleRefresh = () => {
    setTrigger(Date.now())
  }

  return (
    <>
      <button onClick={handleRefresh}>刷新数据</button>
      <HistoryDataSource
        submit={trigger.toString()}
        timeRange={{
          type: 'forward',
          count: 1,
          unit: 'h'
        }}
        tags={[...]}
      >
        <Chart />
      </HistoryDataSource>
    </>
  )
}
```

## 完整示例

### 多设备温度监控仪表板

```tsx
import { HistoryDataSource } from '@/registry/components/datasource-history'
import { useContextProvider } from '@/registry/components/container-context-provider'

function TemperatureDashboard() {
  return (
    <HistoryDataSource
      id="temperature-dashboard"
      timeRange={{
        type: 'forward',
        count: 24,
        unit: 'h',
        fromNow: true
      }}
      group={{
        count: 10,
        unit: 'm',
        fill: { value: 'null' }
      }}
      tags={[
        {
          tableData: { id: 'device_001', name: '1号设备', table: { id: 'device_table', name: '设备表' } },
          tag: { id: 'temp', name: '温度' },
          func: 'mean',
          fixed: 1,
          title: '1号设备'
        },
        {
          tableData: { id: 'device_002', name: '2号设备', table: { id: 'device_table', name: '设备表' } },
          tag: { id: 'temp', name: '温度' },
          func: 'mean',
          fixed: 1,
          title: '2号设备'
        },
        {
          tableData: { id: 'device_003', name: '3号设备', table: { id: 'device_table', name: '设备表' } },
          tag: { id: 'temp', name: '温度' },
          func: 'mean',
          fixed: 1,
          title: '3号设备'
        }
      ]}
      xFormat="MM-DD HH:mm"
      interval={60}
    >
      <DashboardLayout />
    </HistoryDataSource>
  )
}

function DashboardLayout() {
  const { data, loading } = useContextProvider()[0]

  if (loading) return <div>加载中...</div>

  return (
    <div>
      <LineChart data={data} />
      <DataTable data={data} />
    </div>
  )
}
```

## 数据结构说明

### 查询返回数据格式

#### 无分组时（单个标签）

```typescript
{
  dimensions: [
    { name: 'time', title: '时间', type: 'time' },
    { name: '1号设备温度', type: 'number', tag: 'A-A001-temperature' }
  ],
  source: [
    [new Date('2026-01-31T10:00:00'), 25.3],
    [new Date('2026-01-31T10:05:00'), 26.1],
    [new Date('2026-01-31T10:10:00'), 25.8]
  ]
}
```

#### 有分组时（多个标签）

```typescript
{
  dimensions: [
    { name: 'time', title: '时间', type: 'time' },
    { name: '1号设备温度', type: 'number', tag: 'A-A001-temp' },
    { name: '2号设备温度', type: 'number', tag: 'A-A002-temp' }
  ],
  source: [
    [new Date('2026-01-31T10:00:00'), 25.3, 24.8],
    [new Date('2026-01-31T10:05:00'), 26.1, 25.2],
    [new Date('2026-01-31T10:10:00'), 25.8, 24.9]
  ]
}
```

#### 按 groupType 分组

```typescript
{
  dimensions: [
    { name: 'id', title: '设备编号', type: 'string' },
    { name: 'time', title: '时间', type: 'time' },
    { name: '平均温度', type: 'number', tag: 'avg-temp' }
  ],
  source: [
    ['device_001', new Date('2026-01-31T10:00:00'), 25.3],
    ['device_001', new Date('2026-01-31T10:05:00'), 26.1],
    ['device_002', new Date('2026-01-31T10:00:00'), 24.8],
    ['device_002', new Date('2026-01-31T10:05:00'), 25.2]
  ]
}
```

#### 无时间维度（统计数据）

```typescript
{
  dimensions: [
    { name: 'name', title: '数据项', type: 'ordinal' },
    { name: 'value', title: '数据值', type: 'number' },
    { name: 'key', title: '数据ID', type: 'ordinal' }
  ],
  source: [
    ['1号设备温度', 25.5, 'A-A001-temperature'],
    ['2号设备温度', 24.8, 'A-A002-temperature']
  ]
}
```

## 参数关联关系

### 核心参数关系

```
timeRange (时间范围)
    ↓
tags / columns (数据源)
    ↓
group (分组聚合)
    ↓
result (查询结果)
```

### 参数组合建议

| 场景 | timeRange | group | tags/columns | 说明 |
|------|-----------|-------|--------------|------|
| 原始历史曲线 | 固定范围 | 不设置 | tags | 查询原始数据点 |
| 分组曲线图 | 固定范围 | 设置 | tags | 按时间聚合 |
| 多设备对比 | 固定范围 | 设置 | tags(多设备) | 多条曲线对比 |
| 统计报表 | 固定范围 | 不设置 | tags+groupType | 按设备/部门统计 |
| 班次数据 | 班次范围 | 可选 | tags | 按班次时间段查询 |

### group 与 tags 的配合

1. **有 group，无 groupType**：所有数据按时间合并到一条曲线
2. **有 group，有 groupType='id'**：按设备 ID 分组，多条曲线
3. **无 group**：返回原始数据，不聚合

## 注意事项

1. **timeRange 必需**：必须配置时间范围，否则无法查询数据
2. **tags 或 columns**：至少配置一个，两个都配置时会合并查询
3. **分组单位的合理选择**：
   - 数据密集时建议分组（如 `count: 5, unit: 'm'`）
   - 数据稀疏时可以不分组，获取原始数据
4. **性能优化**：
   - 大时间范围建议配合分组使用
   - 减少同时查询的标签数量
5. **时间格式**：确保时间范围使用正确格式 `'YYYY-MM-DD HH:mm:ss'`
6. **班次查询**：使用 `radioType=2` 时，必须提供完整的 `date` 和 `record` 信息
7. **聚合函数**：在配置 `group` 时，建议在 tags 中指定 `func`，默认为 `'mean'`
8. **小数位数**：通过 `fixed` 控制小数位数，默认保留 3 位
