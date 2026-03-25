# DatasourceView 视图数据源组件

## 简介

`DatasourceView` 是一个视图数据源容器组件，用于查询系统视图（View）中的预配置数据。

- **纯容器组件**：不包含任何布局和样式
- **Context 集成**：内部集成 `ContextProvider`，子组件通过 `useContextProvider` 获取数据
- **自动数据管理**：数据自动存储到 Jotai atom，通过组件 ID 访问
- **视图配置**：使用预定义的视图配置，无需手动构建查询
- **维度度量**：支持灵活的维度和度量配置
- **图表格式**：自动将数据转换为图表友好格式
- **定时轮询**：支持设置定时轮询间隔

## 适用场景

- 使用预定义的视图进行数据查询
- 数据可视化和图表展示
- 需要维度和度量的灵活组合
- 动态仪表板和报表
- 实时数据监控

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | `string` | 否 | `'view-data-source'` | 数据源唯一标识，用于存储和访问数据 |
| `view` | `ViewConfig` | 是 | `{}` | 视图配置对象 |
| `dimension` | `Array<DimensionItem>` | 是 | `[]` | 维度配置数组 |
| `measure` | `Array<MeasureItem>` | 是 | `[]` | 度量配置数组 |
| `interval` | `number` | 否 | `0` | 轮询间隔（秒），0 表示不轮询 |
| `submit` | `string` | 否 | - | 提交触发器标识，值变化时触发数据刷新 |
| `children` | `ReactNode` | 否 | - | 子组件 |

### view 视图配置

```typescript
{
  id: string              // 视图 ID（必需）
  name?: string           // 视图名称
  datasetId?: string      // 数据集 ID
  config?: {
    fields?: Array<{
      name: string
      alias?: string
      option?: {
        aggregator: string  // 聚合器：count、avg、sum、max、min 等
      }
    }>
    group?: string[]       // 分组字段 ID 数组
    noGroupBy?: boolean    // 是否禁用分组
    echartType?: string    // 图表类型：line、bar、pie 等
    stack?: string | null  // 堆叠配置
    where?: any[]          // 过滤条件
    groupAlias?: string[]  // 分组别名数组
  }
  style?: any             // 样式配置
}
```

### dimension 维度配置

```typescript
{
  id: string              // 维度 ID（必需）
  name?: string           // 维度名称
  alias?: string          // 维度别名（用于显示）
}
```

**维度说明：**
- 维度用于定义数据的分组和分类方式
- 通常对应数据表中的分类字段（如时间、部门、类型等）
- 支持多维度组合

### measure 度量配置

```typescript
{
  id: string              // 度量 ID（必需）
  name?: string           // 度量名称
  group?: string          // 聚合方式：count、avg、sum、max、min、first、last
  alias?: string          // 度量别名（用于显示）
  isMeasure?: boolean     // 是否为度量字段
  isDefaultMeasure?: boolean  // 是否为默认度量
  onlyCount?: boolean     // 是否仅计数
  filter?: any            // 过滤条件
}
```

**聚合方式说明：**

| group 值 | 说明 | 适用字段类型 |
|---------|------|-------------|
| `count` | 计数 | 所有类型 |
| `avg` | 平均值 | 数值型 |
| `sum` | 求和 | 数值型 |
| `max` | 最大值 | 数值型 |
| `min` | 最小值 | 数值型 |
| `first` | 第一个值 | 所有类型 |
| `last` | 最后一个值 | 所有类型 |

## 工作原理

```
1. 组件初始化
   ↓
2. 构建视图查询请求
   - 从 view、dimension、measure 构建请求体
   ↓
3. 调用视图预览 API
   - 路径：ds/view/preview?id={viewId}&mode=live
   - 方法：POST
   ↓
4. 数据转换
   - 将返回数据转换为图表格式
   - { dimensions: [], source: [] }
   ↓
5. 子组件渲染
   - 通过 useContextProvider 获取数据
   - 数据自动保持最新状态
```

## 基本用法

### 1. 简单视图查询（计数统计）

```tsx
import { DatasourceView } from '@/registry/components/kesi/datasource-view'

function SimpleViewQuery() {
  return (
    <DatasourceView
      id="simple-view"
      view={{
        id: 'view-001',
        name: '设备统计视图',
        datasetId: 'dataset-001'
      }}
      dimension={[
        { id: 'status', name: '设备状态' }
      ]}
      measure={[
        {
          id: '*',
          name: '记录数',
          group: 'count',
          isMeasure: true,
          onlyCount: true
        }
      ]}
    >
      <StatusChart />
    </DatasourceView>
  )
}
```

**行为说明：**
- 按设备状态分组
- 统计每个状态的设备数量
- 返回图表格式数据

### 2. 多维度统计

```tsx
function MultiDimensionView() {
  return (
    <DatasourceView
      id="multi-dimension-view"
      view={{
        id: 'view-002',
        name: '部门设备统计',
        datasetId: 'dataset-002',
        config: {
          echartType: 'bar'
        }
      }}
      dimension={[
        { id: 'department', name: '部门', alias: '部门' },
        { id: 'deviceType', name: '设备类型', alias: '设备类型' }
      ]}
      measure={[
        {
          id: 'temperature',
          name: '平均温度',
          group: 'avg',
          isMeasure: true,
          alias: '平均温度(℃)'
        }
      ]}
    >
      <DepartmentTempChart />
    </DatasourceView>
  )
}
```

### 3. 多度量统计

```tsx
function MultiMeasureView() {
  return (
    <DatasourceView
      id="multi-measure-view"
      view={{
        id: 'view-003',
        name: '设备指标统计',
        datasetId: 'dataset-003',
        config: {
          echartType: 'line',
          stack: null
        }
      }}
      dimension={[
        { id: 'createTime', name: '创建时间' }
      ]}
      measure={[
        {
          id: 'temperature',
          name: '温度',
          group: 'avg',
          isMeasure: true,
          alias: '平均温度'
        },
        {
          id: 'humidity',
          name: '湿度',
          group: 'avg',
          isMeasure: true,
          alias: '平均湿度'
        },
        {
          id: 'pressure',
          name: '压力',
          group: 'max',
          isMeasure: true,
          alias: '最大压力'
        }
      ]}
    >
      <MetricsLineChart />
    </DatasourceView>
  )
}
```

### 4. 带过滤条件的视图

```tsx
function FilteredViewQuery() {
  return (
    <DatasourceView
      id="filtered-view"
      view={{
        id: 'view-004',
        name: '告警设备统计',
        datasetId: 'dataset-004',
        config: {
          where: [
            { field: 'status', op: 'eq', value: 'alarm' }
          ],
          echartType: 'pie'
        }
      }}
      dimension={[
        { id: 'alarmType', name: '告警类型' }
      ]}
      measure={[
        {
          id: '*',
          name: '告警数量',
          group: 'count',
          isMeasure: true,
          onlyCount: true
        }
      ]}
    >
      <AlarmPieChart />
    </DatasourceView>
  )
}
```

### 5. 禁用分组的原始数据查询

```tsx
function NoGroupByView() {
  return (
    <DatasourceView
      id="no-group-view"
      view={{
        id: 'view-005',
        name: '设备原始数据',
        datasetId: 'dataset-005',
        config: {
          noGroupBy: true
        }
      }}
      measure={[
        {
          id: 'deviceName',
          name: '设备名称',
          isMeasure: false
        },
        {
          id: 'temperature',
          name: '温度',
          isMeasure: true
        },
        {
          id: 'status',
          name: '状态',
          isMeasure: false
        }
      ]}
    >
      <DeviceTable />
    </DatasourceView>
  )
}
```

**说明：**
- `noGroupBy: true` 表示不进行分组聚合
- 返回原始数据记录
- 适用于表格展示

### 6. 定时刷新视图

```tsx
function AutoRefreshView() {
  return (
    <DatasourceView
      id="auto-refresh-view"
      view={{
        id: 'view-006',
        name: '实时监控视图',
        datasetId: 'dataset-006'
      }}
      dimension={[
        { id: 'region', name: '区域' }
      ]}
      measure={[
        {
          id: 'activeCount',
          name: '活跃设备数',
          group: 'count',
          isMeasure: true
        }
      ]}
      interval={30}  // 每 30 秒刷新一次
    >
      <RealtimeMonitorChart />
    </DatasourceView>
  )
}
```

### 7. 手动触发刷新

```tsx
import { useState } from 'react'

function ManualRefreshView() {
  const [trigger, setTrigger] = useState(0)

  return (
    <>
      <button onClick={() => setTrigger(Date.now())}>
        刷新数据
      </button>
      <DatasourceView
        id="manual-refresh-view"
        view={{
          id: 'view-007',
          name: '设备统计',
          datasetId: 'dataset-007'
        }}
        dimension={[{ id: 'status', name: '状态' }]}
        measure={[{
          id: '*',
          name: '数量',
          group: 'count',
          isMeasure: true
        }]}
        submit={trigger.toString()}
      >
        <StatusChart />
      </DatasourceView>
    </>
  )
}
```

### 8. 使用别名显示

```tsx
function AliasedView() {
  return (
    <DatasourceView
      id="aliased-view"
      view={{
        id: 'view-008',
        name: '生产统计',
        datasetId: 'dataset-008',
        config: {
          echartType: 'bar'
        }
      }}
      dimension={[
        {
          id: 'product_line',
          name: '生产线',
          alias: '产线名称'  // 图表中显示的名称
        }
      ]}
      measure={[
        {
          id: 'output',
          name: '产量',
          group: 'sum',
          isMeasure: true,
          alias: '总产量(吨)'  // 图表中显示的名称
        }
      ]}
    >
      <ProductionChart />
    </DatasourceView>
  )
}
```

### 9. 堆叠图表配置

```tsx
function StackedView() {
  return (
    <DatasourceView
      id="stacked-view"
      view={{
        id: 'view-009',
        name: '月度销售统计',
        datasetId: 'dataset-009',
        config: {
          echartType: 'bar',
          stack: 'product'  // 按产品堆叠
        }
      }}
      dimension={[
        { id: 'month', name: '月份' },
        { id: 'product', name: '产品' }
      ]}
      measure={[
        {
          id: 'sales',
          name: '销售额',
          group: 'sum',
          isMeasure: true
        }
      ]}
    >
      <StackedBarChart />
    </DatasourceView>
  )
}
```

### 10. 子组件获取数据

```tsx
import { useContextProvider } from '@/registry/components/kesi/container-context-provider'

function ViewDataDisplay() {
  const { data, loading } = useContextProvider()[0]

  if (loading) return <div>加载中...</div>
  if (!data) return <div>无数据</div>

  // data 格式：{ dimensions: [], source: [] }
  const { dimensions, source } = data

  return (
    <div>
      <h3>视图数据</h3>
      <table>
        <thead>
          <tr>
            {dimensions.map((dim: any, index: number) => (
              <th key={index}>{dim.title || dim.name || `字段${index}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {source.map((row: any, rowIndex: number) => (
            <tr key={rowIndex}>
              {row.map((cell: any, cellIndex: number) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

## 完整示例

### 设备监控仪表板

```tsx
import { DatasourceView } from '@/registry/components/kesi/datasource-view'

function DeviceMonitorDashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 设备状态分布 */}
      <DatasourceView
        id="status-distribution"
        view={{
          id: 'view-status-dist',
          name: '设备状态分布',
          datasetId: 'device-dataset',
          config: {
            echartType: 'pie'
          }
        }}
        dimension={[
          { id: 'status', name: '设备状态', alias: '状态' }
        ]}
        measure={[
          {
            id: '*',
            name: '设备数量',
            group: 'count',
            isMeasure: true,
            onlyCount: true,
            alias: '数量'
          }
        ]}
      >
        <StatusPieChart />
      </DatasourceView>

      {/* 按部门统计 */}
      <DatasourceView
        id="department-stats"
        view={{
          id: 'view-dept-stats',
          name: '部门设备统计',
          datasetId: 'device-dataset',
          config: {
            echartType: 'bar'
          }
        }}
        dimension={[
          { id: 'department', name: '部门', alias: '部门名称' }
        ]}
        measure={[
          {
            id: '*',
            name: '设备总数',
            group: 'count',
            isMeasure: true,
            alias: '设备数'
          }
        ]}
      >
        <DepartmentBarChart />
      </DatasourceView>

      {/* 温度趋势 */}
      <DatasourceView
        id="temp-trend"
        view={{
          id: 'view-temp-trend',
          name: '温度趋势',
          datasetId: 'device-dataset',
          config: {
            echartType: 'line'
          }
        }}
        dimension={[
          { id: 'createTime', name: '时间', alias: '记录时间' }
        ]}
        measure={[
          {
            id: 'temperature',
            name: '温度',
            group: 'avg',
            isMeasure: true,
            alias: '平均温度(℃)'
          },
          {
            id: 'temperature',
            name: '温度',
            group: 'max',
            isMeasure: true,
            alias: '最高温度(℃)'
          }
        ]}
      >
        <TempTrendChart />
      </DatasourceView>

      {/* 告警统计 */}
      <DatasourceView
        id="alarm-stats"
        view={{
          id: 'view-alarm-stats',
          name: '告警统计',
          datasetId: 'device-dataset',
          config: {
            where: [
              { field: 'hasAlarm', op: 'eq', value: true }
            ],
            echartType: 'bar'
          }
        }}
        dimension={[
          { id: 'alarmLevel', name: '告警级别', alias: '级别' }
        ]}
        measure={[
          {
            id: '*',
            name: '告警数量',
            group: 'count',
            isMeasure: true,
            alias: '告警数'
          }
        ]}
      >
        <AlarmBarChart />
      </DatasourceView>
    </div>
  )
}
```

### 生产分析报表

```tsx
function ProductionAnalysisReport() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">生产数据分析</h2>
        <button
          onClick={() => setRefreshTrigger(Date.now())}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          刷新数据
        </button>
      </div>

      {/* 产量统计 */}
      <DatasourceView
        id="production-stats"
        view={{
          id: 'view-prod-stats',
          name: '产量统计',
          datasetId: 'production-dataset',
          config: {
            echartType: 'bar',
            stack: null
          }
        }}
        dimension={[
          { id: 'productLine', name: '产线', alias: '生产线' },
          { id: 'shift', name: '班次', alias: '班次' }
        ]}
        measure={[
          {
            id: 'output',
            name: '产量',
            group: 'sum',
            isMeasure: true,
            alias: '总产量(件)'
          }
        ]}
        submit={refreshTrigger.toString()}
      >
        <ProductionBarChart />
      </DatasourceView>

      {/* 质量指标 */}
      <DatasourceView
        id="quality-metrics"
        view={{
          id: 'view-quality',
          name: '质量指标',
          datasetId: 'production-dataset',
          config: {
            echartType: 'line'
          }
        }}
        dimension={[
          { id: 'date', name: '日期', alias: '生产日期' }
        ]}
        measure={[
          {
            id: 'passRate',
            name: '合格率',
            group: 'avg',
            isMeasure: true,
            alias: '平均合格率(%)'
          },
          {
            id: 'defectCount',
            name: '缺陷数',
            group: 'sum',
            isMeasure: true,
            alias: '缺陷总数'
          }
        ]}
        submit={refreshTrigger.toString()}
      >
        <QualityLineChart />
      </DatasourceView>
    </div>
  )
}
```

## 数据结构说明

### 返回数据格式（图表格式）

```typescript
{
  dimensions: [
    { name: 'status', title: '设备状态' },
    { name: 'count', title: '设备数量' }
  ],
  source: [
    ['online', 120],
    ['offline', 15],
    ['alarm', 5]
  ]
}
```

**说明：**
- `dimensions`: 维度数组，定义数据列
- `source`: 数据源数组，每行是一条记录
- 格式与 ECharts 等图表库兼容

### 无分组时的原始数据格式

```typescript
{
  dimensions: [
    { name: 'deviceName', title: '设备名称' },
    { name: 'temperature', title: '温度' },
    { name: 'status', title: '状态' }
  ],
  source: [
    ['设备A', 25.3, 'online'],
    ['设备B', 24.8, 'offline'],
    ['设备C', 26.1, 'online']
  ]
}
```

## API 请求说明

### 请求路径

```
POST ds/view/preview?id={viewId}&mode=live
```

### 请求体

```json
{
  "config": {
    "noGroupBy": false,
    "fields": [
      {
        "name": "temperature",
        "alias": "平均温度",
        "group": "avg",
        "isMeasure": true,
        "isDefaultMeasure": false,
        "onlyCount": false,
        "option": {
          "aggregator": "avg"
        }
      }
    ],
    "group": ["status", "department"],
    "groupAlias": ["状态", "部门"],
    "echartType": "bar",
    "stack": null,
    "where": []
  },
  "datasetId": "dataset-001",
  "name": "设备统计视图",
  "style": {
    "dimension": [...],
    "measure": [...]
  }
}
```

## 参数关联关系

| 参数 | 关联参数 | 说明 |
|------|---------|------|
| `view` | - | 必需，定义视图配置 |
| `view.id` | - | 必需，视图唯一标识 |
| `view.datasetId` | - | 数据集 ID |
| `view.config.noGroupBy` | `measure` | true 时忽略度量聚合 |
| `dimension` | `view.config.group` | 维度数组映射到 config.group |
| `measure` | `view.config.fields` | 度量数组映射到 config.fields |
| `measure.group` | - | 定义聚合方式 |
| `interval` | - | 独立配置，控制轮询频率 |
| `submit` | - | 独立配置，控制手动刷新 |

## 视图配置模式

### 模式 1：分组聚合查询（默认）

```tsx
<DatasourceView
  view={{
    config: {
      noGroupBy: false  // 或不设置
    }
  }}
  dimension={[{ id: 'status' }]}
  measure={[{ id: '*', group: 'count' }]}
/>
```

- 返回聚合后的统计数据
- 支持图表展示
- 需要配置 dimension 和 measure

### 模式 2：原始数据查询

```tsx
<DatasourceView
  view={{
    config: {
      noGroupBy: true
    }
  }}
  measure={[
    { id: 'name', isMeasure: false },
    { id: 'temperature', isMeasure: true }
  ]}
/>
```

- 返回原始数据记录
- 不进行分组聚合
- 适用于表格展示

## 与其他数据源的区别

| 特性 | DatasourceView | DatasourceTable | DatasourceHistory |
|------|---------------|-----------------|------------------|
| 数据来源 | 预定义视图 | 表/数据集 | 历史数据点 |
| 配置方式 | 视图配置 + 维度度量 | 表配置 + 查询条件 | 标签配置 + 时间范围 |
| 数据格式 | 图表格式 | 记录列表 | 时间序列 |
| 分组支持 | 支持 | 支持 | 不支持 |
| 聚合支持 | 支持（通过 measure） | 支持（通过 columns） | 不支持 |
| 适用场景 | BI 分析、可视化 | 数据管理、CRUD | 趋势分析、监控 |

## 注意事项

1. **view.id 必需**：必须提供视图 ID，否则无法查询数据

2. **dimension 和 measure 必需**：
   - 分组查询时必须配置 dimension 和 measure
   - 原始数据查询时只需要配置 measure

3. **聚合方式选择**：
   - `count`：统计记录数量
   - `avg`：计算平均值（数值型字段）
   - `sum`：求和（数值型字段）
   - `max/min`：最大值/最小值（数值型字段）
   - `first/last`：首尾值（所有类型）

4. **图表类型配置**：
   - 通过 `view.config.echartType` 指定
   - 常用类型：line（折线图）、bar（柱状图）、pie（饼图）

5. **堆叠配置**：
   - 通过 `view.config.stack` 设置堆叠分组
   - null 表示不堆叠
   - 适合多系列对比

6. **过滤条件**：
   - 通过 `view.config.where` 配置
   - 支持复杂的过滤表达式

7. **别名显示**：
   - 使用 `alias` 配置显示名称
   - 优先级：alias > name

8. **轮询间隔**：
   - `interval` 单位为秒
   - 建议不低于 10 秒，避免频繁请求
   - 组件卸载时自动清除定时器

9. **性能优化**：
   - 合理设置 dimension 和 measure 数量
   - 避免过多的分组维度
   - 大数据量时使用 where 过滤

10. **错误处理**：
    - 视图 ID 不存在时返回空数据
    - 查询失败时会在控制台输出错误
    - 不会中断应用运行

11. **视图预览模式**：
    - 使用 `mode=live` 参数
    - 获取实时数据快照
    - 不受视图缓存影响
