# DatasourceTable 表数据源组件

## 简介

`DatasourceTable` 是一个表数据源容器组件，用于查询系统表（Table）中的数据记录。

- **纯容器组件**：不包含任何布局和样式
- **Context 集成**：内部集成 `ContextProvider`，子组件通过 `useContextProvider` 获取数据
- **自动数据管理**：数据自动存储到 Jotai atom，通过组件 ID 访问
- **双数据源支持**：支持普通表（table）和数据集（dataset）两种数据源
- **分组聚合**：支持按字段分组并进行聚合统计
- **字段格式化**：支持对字段进行格式化显示
- **定时轮询**：支持设置定时轮询间隔

## 适用场景

- 查询设备表数据
- 查询业务数据表
- 数据统计和分析
- 数据报表展示
- 分组聚合统计

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | `string` | 否 | `'table-data-source'` | 数据源唯一标识，用于存储和访问数据 |
| `selectType` | `'table' \| 'dataset'` | 否 | `'table'` | 数据源选择类型 |
| `table` | `TableInfo` | 是 | - | 表信息对象，包含 id、name 等 |
| `initFilter` | `Record<string, any>` | 否 | `{}` | 初始过滤条件，支持 MongoDB 风格的查询语法 |
| `isGroup` | `boolean` | 否 | `false` | 是否开启分组聚合查询 |
| `showInnerField` | `boolean` | 否 | `false` | 是否显示内部字段（如 _department、editPermission 等） |
| `statsBySingle` | `boolean` | 否 | `null` | 统计方式：true 为单条统计，false 或 null 为批量统计 |
| `feildFormat` | `Array<FieldFormat>` | 否 | `[]` | 字段格式化配置 |
| `queryFields` | `string[]` | 否 | `[]` | 指定要查询的字段列表 |
| `fieldOrder` | `Array<SortItem>` | 否 | `[]` | 字段排序配置 |
| `group` | `Array<GroupItem>` | 否 | `[]` | 分组配置 |
| `columns` | `Array<ColumnItem>` | 否 | `[]` | 聚合列配置 |
| `limit` | `number` | 否 | `1000` | 返回结果最大条数 |
| `skip` | `number` | 否 | - | 跳过的记录数 |
| `interval` | `number` | 否 | `0` | 轮询间隔（秒），0 表示不轮询 |
| `submit` | `string` | 否 | - | 提交触发器标识，值变化时触发数据刷新 |
| `children` | `ReactNode` | 否 | - | 子组件 |

### selectType 数据源类型

| 值 | 说明 | 资源路径 |
|------|------|---------|
| `'table'` | 普通表 | `core/t/{tableId}/d` |
| `'dataset'` | 数据集 | `ds/dataset/jst/data/{tableId}` |

### table 表信息配置

```typescript
{
  id: string           // 表 ID（必需）
  name?: string         // 表名称
  key?: string         // 表键值（dataset 类型使用）
  value?: string       // 表值（dataset 类型使用）
  tableMajorType?: string  // 表类型
  [key: string]: any    // 其他属性
}
```

### initFilter 过滤条件

支持 MongoDB 风格的查询语法：

```typescript
{
  initFilter: {
    name: '设备A',
    status: 'online',
    age: { $gte: 18 }
  }
}
```

**支持的查询操作符：**
- `$gte`：大于等于
- `$lte`：小于等于
- `$gt`：大于
- `$lt`：小于
- `$ne`：不等于
- `$in`：包含于
- `$nin`：不包含于

### group 分组配置

```typescript
{
  field?: string | FieldConfig           // 分组字段
  dateOperator?: '天' | '周' | '月' | '年' |  // 日期操作符
  [key: string]: any
}
```

**日期操作符说明：**

| 操作符 | 说明 | MongoDB 操作 |
|--------|------|---------------|
| `天` | 按天分组 | `$dateToString: { format: '%Y-%m-%d' }` |
| `周` | 按周分组 | `$dateToString: { format: '%Y-%V' }` |
| `月` | 按月分组 | `$dateToString: { format: '%Y-%m' }` |
| `年` | 按年分组 | `$year` |
| `一小时内的分钟数` | 按分钟分组 | `$minute` |
| `一天内的小时数` | 按小时分组 | `$hour` |
| `一周内的天数` | 按星期几分组 | `$dayOfWeek` |
| `一月内的天数` | 按日期分组 | `$dayOfMonth` |
| `一年内的天数` | 按一年中的第几天分组 | `$dayOfYear` |
| `一年内的星期数` | 按第几周分组 | `$week` |
| `一年内的月数` | 按月份分组 | `$month` |

### columns 聚合列配置

```typescript
{
  name?: string                           // 聚合列名称
  field?: string | FieldConfig                // 字段配置
  accumulator?: '$count' | '$avg' | '$first' | '$last' | '$max' | '$min' | '$sum'
  expression?: any                            // 自定义聚合表达式
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

### feildFormat 字段格式化

```typescript
{
  field: FieldConfig | {              // 字段配置
    id?: string                         // 字段 ID
    key?: string                        // 字段键
    title?: string                       // 字段标题
    type?: string                        // 字段类型
    propertyType?: string                // 属性类型（string/number）
  }
  format: string | {                     // 格式化配置
    type?: string                        // 格式类型
    format?: string                       // 格式字符串
  }
}
```

**格式化类型说明：**

| type 值 | 说明 | format 示例 |
|---------|------|-------------|
| `'string'` | 字符串类型 | `'YYYY-MM-DD HH:mm:ss'` |
| `'date'` | 日期类型 | `'YYYY-MM-DD HH:mm:ss'` |
| `'number'` | 数字类型 | `'percentPoint'`（百分位）、`'0.00'`（两位小数） |

## 基本用法

### 1. 简单表数据查询

```tsx
import { DatasourceTable } from '@/components/airiot/datasource-table'

function SimpleTableQuery() {
  return (
    <DatasourceTable
      id="table-data"
      table={{ id: 'A', name: '设备表' }}
      limit={10}
    >
      <DataTable />
    </DatasourceTable>
  )
}
```

### 2. 带过滤条件的查询

```tsx
function FilteredTableQuery() {
  return (
    <DatasourceTable
      id="filtered-table"
      table={{ id: 'A', name: '设备表' }}
      initFilter={{
        status: 'online',
        temperature: { $gte: 25 }
      }}
      fieldOrder={[{ value: 'createTime', order: 'DESC' }]}
      limit={20}
    >
      <FilteredDataTable />
    </DatasourceTable>
  )
}
```

### 3. 分组聚合查询

```tsx
function GroupedTableQuery() {
  return (
    <DatasourceTable
      id="grouped-table"
      table={{ id: 'A', name: '设备表' }}
      isGroup={true}
      group={[
        {
          field: 'department'
        }
      ]}
      columns={[
        {
          name: '设备数量',
          accumulator: '$count'
        }
      ]}
    >
      <DepartmentStats />
    </DatasourceTable>
  )
}
```

### 4. 按日期分组统计

```tsx
function DailyStatsQuery() {
  return (
    <DatasourceTable
      id="daily-stats"
      table={{ id: 'A', name: '设备表' }}
      isGroup={true}
      group={[
        {
          field: 'createTime',
          dateOperator: '天'
        }
      ]}
      columns={[
        {
          name: '平均温度',
          field: { id: 'temperature', name: '温度' },
          accumulator: '$avg'
        }
      ]}
      fieldOrder={[{ value: '平均温度', order: 'DESC' }]}
    >
      <DailyReport />
    </DatasourceTable>
  )
}
```

### 5. 查询指定字段

```tsx
function SpecificFieldsQuery() {
  return (
    <DatasourceTable
      id="specific-fields"
      table={{ id: 'A', name: '设备表' }}
      queryFields={['name', 'status', 'temperature', 'pressure']}
      limit={50}
    >
      <DeviceTable />
    </DatasourceTable>
  )
}
```

### 6. 字段格式化

```tsx
function FormattedTableQuery() {
  return (
    <DatasourceTable
      id="formatted-table"
      table={{ id: 'A', name: '设备表' }}
      feildFormat={[
        {
          field: { id: 'createTime', name: '创建时间' },
          format: {
            type: 'date',
            format: 'YYYY-MM-DD HH:mm:ss'
          }
        },
        {
          field: { id: 'temperature', name: '温度' },
          format: {
            format: '0.00'
          }
        }
      ]}
    >
      <FormattedDataTable />
    </DatasourceTable>
  )
}
```

### 7. 使用数据集（dataset）类型

```tsx
function DatasetQuery() {
  return (
    <DatasourceTable
      id="dataset-data"
      selectType="dataset"
      table={{ id: 'my-dataset', name: '我的数据集' }}
      limit={100}
    >
      <DatasetTable />
    </DatasourceTable>
  )
}
```

### 8. 定时刷新

```tsx
function AutoRefreshTable() {
  return (
    <DatasourceTable
      id="auto-refresh-table"
      table={{ id: 'A', name: '设备表' }}
      initFilter={{ status: 'alarm' }}
      interval={30}
    >
      <AlarmTable />
    </DatasourceTable>
  )
}
```

### 9. 手动触发刷新

```tsx
import { useState } from 'react'

function ManualRefreshTable() {
  const [trigger, setTrigger] = useState(0)

  return (
    <>
      <button onClick={() => setTrigger(Date.now())}>
        刷新数据
      </button>
      <DatasourceTable
        id="manual-refresh"
        table={{ id: 'A', name: '设备表' }}
        submit={trigger.toString()}
      >
        <RefreshableTable />
      </DatasourceTable>
    </>
  )
}
```

### 10. 子组件获取数据

```tsx
import { useContextProvider } from '@/components/airiot/container-context-provider'

function TableDisplay() {
  const { data, loading } = useContextProvider()[0]

  if (loading) return <div>加载中...</div>
  if (!data || data.length === 0) return <div>无数据</div>

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>名称</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item: any, index: number) => (
          <tr key={index}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## 完整示例

### 设备管理仪表板

```tsx
import { DatasourceTable } from '@/components/airiot/datasource-table'
import { useContextProvider } from '@/components/airiot/container-context-provider'

function DeviceManagementDashboard() {
  const [department, setDepartment] = useState('all')

  return (
    <div className="space-y-4">
      {/* 设备列表 */}
      <DatasourceTable
        id="device-list"
        table={{ id: 'A', name: '设备表' }}
        initFilter={department !== 'all' ? { department: { $in: ['tech', 'ops'] } } : {}}
        fieldOrder={[{ value: 'createTime', order: 'DESC' }]}
        feildFormat={[
          {
            field: { id: 'createTime', name: '创建时间' },
            format: { type: 'date', format: 'YYYY-MM-DD HH:mm:ss' }
          }
        ]}
        limit={50}
      >
        <DeviceTable />
      </DatasourceTable>

      {/* 部门统计 */}
      <DatasourceTable
        id="department-stats"
        table={{ id: 'A', name: '设备表' }}
        isGroup={true}
        group={[
          { field: 'department' }
        ]}
        columns={[
          { name: '设备总数', accumulator: '$count' }
        ]}
      >
        <DepartmentChart />
      </DatasourceTable>
    </div>
  )
}
```

### 数据分析报表

```tsx
function DataAnalysisReport() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* 设备状态统计 */}
      <DatasourceTable
        id="status-stats"
        table={{ id: 'A', name: '设备表' }}
        isGroup={true}
        group={[
          { field: 'status' }
        ]}
        columns={[
          { name: '数量', accumulator: '$count' }
        ]}
      >
        <StatusPieChart />
      </DatasourceTable>

      {/* 温度统计 */}
      <DatasourceTable
        id="temp-stats"
        table={{ id: 'A', name: '设备表' }}
        isGroup={true}
        group={[
          { field: 'temperature' }
        ]}
        columns={[
          { name: '平均温度', field: { id: 'temperature', name: '温度' }, accumulator: '$avg' }
        ]}
      >
        <TempBarChart />
      </DatasourceTable>

      {/* 按日期统计 */}
      <DatasourceTable
        id="daily-stats"
        table={{ id: 'A', name: '设备表' }}
        isGroup={true}
        group={[
          { field: 'createTime', dateOperator: '天' }
        ]}
        columns={[
          { name: '设备数量', accumulator: '$count' }
        ]}
        fieldOrder={[{ value: '设备数量', order: 'DESC' }]}
        limit={30}
      >
        <DailyTrendChart />
      </DatasourceTable>
    </div>
  )
}
```

### 动态过滤查询

```tsx
function DynamicFilterTable() {
  const [status, setStatus] = useState('all')
  const [minTemp, setMinTemp] = useState(0)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const getFilter = () => {
    const filter: Record<string, any> = {}
    if (status !== 'all') {
      filter.status = status
    }
    if (minTemp > 0) {
      filter.temperature = { $gte: minTemp }
    }
    return filter
  }

  return (
    <>
      <div className="mb-4 space-x-2">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">全部状态</option>
          <option value="online">在线</option>
          <option value="offline">离线</option>
          <option value="alarm">告警</option>
        </select>
        <input
          type="number"
          placeholder="最低温度"
          value={minTemp}
          onChange={(e) => setMinTemp(Number(e.target.value))}
        />
        <button onClick={() => setRefreshTrigger(Date.now())}>
          刷新
        </button>
      </div>

      <DatasourceTable
        id="dynamic-filter-table"
        table={{ id: 'A', name: '设备表' }}
        initFilter={getFilter()}
        fieldOrder={[{ value: 'createTime', order: 'DESC' }]}
        limit={20}
        submit={refreshTrigger.toString()}
      >
        <DeviceTable />
      </DatasourceTable>
    </>
  )
}
```

## 数据结构说明

### 普通查询返回格式

```typescript
[
  {
    id: 'A001',
    name: '1号设备',
    status: 'online',
    temperature: 25.3,
    createTime: '2026-01-31 17:08:54'
  },
  {
    id: 'A002',
    name: '2号设备',
    status: 'offline',
    temperature: 24.8,
    createTime: '2026-01-31 17:07:32:15'
  }
]
```

### 分组查询返回格式

```typescript
[
  {
    '部门': '技术部',
    '设备数量': 15
  },
  {
    '部门': '运维部',
    '设备数量': 8
  }
]
```

### 多列分组返回格式

```typescript
[
  {
    '创建时间': '2026-01-31',
    '平均温度': 25.3,
    '最大温度': 28.5,
    '最小温度': 22.1
  },
  {
    '创建时间': '2026-02-01',
    '平均温度': 24.8,
    '最大温度': 27.9,
    '最小温度': 21.5
  }
]
```

## 特殊资源

| 资源 ID | 说明 | 实际路径 |
|---------|------|-----------|
| `'_#$airiot_log'` | 日志表 | `core/log` |
| `'_#$airiot_warning'` | 告警表 | `warning/warning` |

## 内置字段

以下字段默认不显示（`showInnerField=false`）：

| 字段名 | 说明 |
|--------|------|
| `_department` | 部门信息 |
| `_departmentInfo` | 部门详细信息 |
| `_deptTableAndField` | 部门表和字段 |
| `_parent` | 父级信息 |
| `deletePermission` | 删除权限 |
| `editPermission` | 编辑权限 |

## 参数关联关系

| 参数 | 关联参数 | 说明 |
|------|---------|------|
| `selectType` | `table` | 决定查询路径 |
| `table` | - | 必需，定义要查询的表 |
| `isGroup` | `group`, `columns` | 开启分组时必须配置 |
| `group` | `isGroup` | 只在 `isGroup=true` 时生效 |
| `columns` | `isGroup` | 只在 `isGroup=true` 时生效 |
| `queryFields` | - | 独立配置，指定要查询的字段 |
| `projectAll` | - | 独立配置，为 true 时查询所有字段 |
| `fieldOrder` | - | 独立配置，控制排序 |
| `limit` | - | 独立配置，控制返回条数 |
| `skip` | - | 独立配置，用于分页 |
| `feildFormat` | - | 独立配置，格式化字段显示 |
| `extraSchema` | - | 独立配置，额外的表定义 |
| `showInnerField` | - | 独立配置，控制内部字段显示 |
| `statsBySingle` | - | 独立配置，控制统计方式 |
| `interval` | - | 独立配置，控制轮询频率 |
| `submit` | - | 独立配置，控制手动刷新 |

## 查询模式

### 模式 1：普通查询（默认）

```tsx
<DatasourceTable
  table={{ id: 'A', name: '设备表' }}
  limit={10}
/>
```

- 返回原始数据记录
- 支持字段过滤、排序、格式化

### 模式 2：分组聚合查询

```tsx
<DatasourceTable
  table={{ id: 'A', name: '设备表' }}
  isGroup={true}
  group={[{ field: 'department' }]}
  columns={[{ name: '数量', accumulator: '$count' }]}
/>
```

- 返回聚合后的统计结果
- 支持多级分组、多种聚合操作

## 参数详解

### queryFields 字段查询

```tsx
// 只查询指定字段
<DatasourceTable
  table={{ id: 'A', name: '设备表' }}
  queryFields={['name', 'status', 'temperature']}
/>
```

**优点：**
- 减少网络传输数据量
- 提高查询性能
- 只获取需要的字段

### fieldOrder 字段排序

```tsx
<DatasourceTable
  table={{ id: 'A', name: '设备表' }}
  fieldOrder={[
    { value: 'temperature', order: 'DESC' },     // 温度降序
    { value: 'createTime', order: 'ASC' }      // 时间升序
  ]}
/>
```

### showInnerField 内部字段显示

```tsx
// 显示内部字段
<DatasourceTable
  table={{ id: 'A', name: '设备表' }}
  showInnerField={true}
/>
```

**包含的内部字段：**
- `_department` - 部门信息
- `_departmentInfo` - 部门详细信息
- `_deptTableAndField` - 部门表和字段
- `_parent` - 父级信息
- `deletePermission` - 删除权限
- `editPermission` - 编辑权限

### statsBySingle 统计方式

```tsx
// 单条统计（默认）
<DatasourceTable
  table={{ id: 'A', name: '设备表' }}
  statsBySingle={false}
/>

// 批量统计
<DatasourceTable
  table={{ id: 'A', name: '设备表' }}
  statsBySingle={true}
/>
```

**区别说明：**
- `false` 或 `null`：批量统计，一次请求返回所有数据
- `true`：单条统计，每条记录单独查询

## 与其他数据源的区别

| 特性 | DatasourceTable | DatasourceHistory | DatasourceMessage |
|------|---------------|------------------|------------------|
| 数据来源 | 表/数据集 | 历史数据点 | 系统消息 |
| 数据类型 | 记录列表 | 时间序列数据 | 消息列表 |
| 查询方式 | 表查询 API | 历史数据 API | 消息查询 API |
| 分组支持 | 支持 | 支持 | 支持 |
| 聚合支持 | 支持 | 支持 | 支持 |
| 字段格式化 | 支持 | 不支持 | 支持 |
| 实时更新 | interval 轮询 | 不支持 | 不支持 |

## 注意事项

1. **table 必需**：必须配置 `table` 参数，否则无法查询数据

2. **selectType 选择**：
   - `table`：查询普通表
   - `dataset`：查询数据集

3. **isGroup 与 group/columns 的关系**：
   - `isGroup=true` 时，必须配置 `group` 和 `columns`
   - `isGroup=false` 时，`group` 和 `columns` 会被忽略

4. **字段顺序**：
   - 使用 `fieldOrder` 控制返回结果的排序
   - 分组查询时，按 `group` 配置的字段排序

5. **性能优化**：
   - 使用 `queryFields` 只查询需要的字段
   - 合理设置 `limit` 限制返回条数
   - 大数据量查询建议使用分组聚合

6. **内部字段**：
   - 默认不显示内部字段（`showInnerField=false`）
   - 需要时可设置 `showInnerField=true` 显示

7. **查询性能**：
   - 避免查询过多的字段
   - 大表建议添加过滤条件
   - 合理使用 `limit` 控制返回数据量

8. **格式化配置**：
   - 在 `feildFormat` 中配置字段格式化规则
   - 支持 `type: 'date'` 和 `type: 'number'` 两种格式类型
   - 日期格式使用 dayjs 格式化字符串

9. **特殊资源**：
   - 支持 `log` 和 `warning` 两个特殊资源
   - 使用 `table.id` 而非 `table.value`

10. **轮询间隔**：
    - `interval` 单位为秒
    - 建议不低于 10 秒，避免频繁请求
    - 组件卸载时自动清除定时器
