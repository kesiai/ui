> **安装命令**: `npx shadcn@latest add @kesi/view-data-aggregate`

# ViewDataAggregate 数据统计组件

## 简介

`ViewDataAggregate` 是一个功能强大的数据统计和聚合组件，支持多种聚合类型和灵活的布局方式。

- **多种聚合类型**：支持计数、总和、平均、最小值、最大值等多种聚合计算
- **分组统计**：支持按字段分组进行统计，便于对比分析
- **灵活布局**：提供网格、列表、紧凑三种布局方式适应不同场景
- **自动刷新**：支持定时自动刷新统计数据，保持数据实时性
- **交互反馈**：支持点击卡片触发回调函数，实现数据联动

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `modelId` | `string` | 否 | - | 模型标识符 |
| `fields` | `AggregateField[]` | 否 | `[]` | 要统计的字段定义数组 |
| `aggregateTypes` | `AggregateType[]` | 否 | `['count', 'sum', 'avg']` | 启用的聚合类型 |
| `groupBy` | `string` | 否 | - | 分组统计的字段名，为空则不分组 |
| `showChange` | `boolean` | 否 | `true` | 是否显示数值变化趋势 |
| `showChart` | `boolean` | 否 | `false` | 是否显示图表可视化 |
| `layout` | `'grid' \| 'list' \| 'compact'` | 否 | `'grid'` | 统计卡片的布局方式 |
| `refreshInterval` | `number` | 否 | `0` | 自动刷新间隔（毫秒），0 表示不刷新 |
| `className` | `string` | 否 | - | 自定义样式类名 |
| `onRefresh` | `() => void` | 否 | - | 刷新统计数据时的回调函数 |
| `onFieldClick` | `(field: string, value: any) => void` | 否 | - | 点击统计卡片时的回调函数 |

### AggregateField 接口

统计字段定义接口：

```typescript
interface AggregateField {
  name: string                              // 字段名称
  label: string                             // 字段显示标签
  type: 'number' | 'string' | 'date'        // 字段数据类型
  aggregate?: AggregateType[]               // 该字段支持的聚合类型
}
```

### AggregateType 类型

聚合类型：`'count' | 'sum' | 'avg' | 'min' | 'max' | 'group'`

## 基本用法

### 1. 基础统计

最简单的方式是定义字段和聚合类型，系统会自动计算统计数据。

```tsx
import { ViewDataAggregate } from '@/components/kesi/view-data-aggregate/view-data-aggregate'

function Dashboard() {
  const fields = [
    { name: 'temperature', label: '温度', type: 'number' as const },
    { name: 'humidity', label: '湿度', type: 'number' as const },
    { name: 'status', label: '状态', type: 'string' as const }
  ]

  return (
    <ViewDataAggregate
      modelId="sensor"
      fields={fields}
      aggregateTypes={['count', 'sum', 'avg']}
    />
  )
}
```

### 2. 网格布局

使用网格布局展示统计卡片，适合仪表板场景。

```tsx
import { ViewDataAggregate } from '@/components/kesi/view-data-aggregate/view-data-aggregate'

function StatisticsGrid() {
  const fields = [
    { name: 'revenue', label: '收入', type: 'number' as const },
    { name: 'orders', label: '订单数', type: 'number' as const },
    { name: 'customers', label: '客户数', type: 'number' as const }
  ]

  return (
    <ViewDataAggregate
      modelId="sales"
      fields={fields}
      aggregateTypes={['sum', 'count', 'avg']}
      layout="grid"
    />
  )
}
```

### 3. 列表布局

使用列表布局展示统计数据，更适合详细查看。

```tsx
import { ViewDataAggregate } from '@/components/kesi/view-data-aggregate/view-data-aggregate'

function StatisticsList() {
  const fields = [
    { name: 'production', label: '产量', type: 'number' as const },
    { name: 'energy', label: '能耗', type: 'number' as const }
  ]

  return (
    <ViewDataAggregate
      modelId="factory"
      fields={fields}
      aggregateTypes={['sum', 'avg']}
      layout="list"
    />
  )
}
```

### 4. 紧凑布局

使用紧凑布局以 Badge 形式展示，适合空间有限的场景。

```tsx
import { ViewDataAggregate } from '@/components/kesi/view-data-aggregate/view-data-aggregate'

function CompactStats() {
  const fields = [
    { name: 'tasks', label: '任务', type: 'number' as const },
    { name: 'completed', label: '已完成', type: 'number' as const }
  ]

  return (
    <ViewDataAggregate
      modelId="project"
      fields={fields}
      aggregateTypes={['count', 'sum']}
      layout="compact"
    />
  )
}
```

### 5. 分组统计

按字段进行分组统计，对比不同组别的数据。

```tsx
import { ViewDataAggregate } from '@/components/kesi/view-data-aggregate/view-data-aggregate'

function GroupStatistics() {
  const fields = [
    { name: 'amount', label: '金额', type: 'number' as const },
    { name: 'quantity', label: '数量', type: 'number' as const }
  ]

  return (
    <ViewDataAggregate
      modelId="orders"
      fields={fields}
      aggregateTypes={['sum', 'avg']}
      groupBy="category"
    />
  )
}
```

### 6. 自动刷新

设置定时自动刷新统计数据。

```tsx
import { ViewDataAggregate } from '@/components/kesi/view-data-aggregate/view-data-aggregate'

function RealtimeStats() {
  const fields = [
    { name: 'temperature', label: '温度', type: 'number' as const },
    { name: 'pressure', label: '压力', type: 'number' as const }
  ]

  return (
    <ViewDataAggregate
      modelId="monitor"
      fields={fields}
      aggregateTypes={['avg', 'max']}
      refreshInterval={5000}  // 每5秒刷新一次
    />
  )
}
```

### 7. 点击交互

为统计卡片添加点击事件，实现数据联动。

```tsx
import { ViewDataAggregate } from '@/components/kesi/view-data-aggregate/view-data-aggregate'

function InteractiveStats() {
  const fields = [
    { name: 'sales', label: '销售额', type: 'number' as const },
    { name: 'profit', label: '利润', type: 'number' as const }
  ]

  const handleFieldClick = (field: string, value: any) => {
    console.log(`字段 ${field} 被点击，值: ${value}`)
    // 可以在这里触发筛选、导航等操作
  }

  return (
    <ViewDataAggregate
      modelId="finance"
      fields={fields}
      aggregateTypes={['sum', 'avg']}
      onFieldClick={handleFieldClick}
    />
  )
}
```

## 完整示例

### 设备监控仪表板

完整的设备监控仪表板，展示各种设备数据的统计信息。

```tsx
import { ViewDataAggregate, AggregateField } from '@/components/kesi/view-data-aggregate/view-data-aggregate'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useModelList } from '@airiot/client'

function DeviceMonitorDashboard() {
  const { items } = useModelList()

  const deviceFields: AggregateField[] = [
    {
      name: 'temperature',
      label: '温度',
      type: 'number',
      aggregate: ['avg', 'max', 'min']
    },
    {
      name: 'humidity',
      label: '湿度',
      type: 'number',
      aggregate: ['avg', 'max', 'min']
    },
    {
      name: 'pressure',
      label: '压力',
      type: 'number',
      aggregate: ['avg', 'max']
    },
    {
      name: 'energy',
      label: '能耗',
      type: 'number',
      aggregate: ['sum', 'avg']
    },
    {
      name: 'status',
      label: '状态',
      type: 'string',
      aggregate: ['count']
    }
  ]

  const handleRefresh = () => {
    console.log('刷新设备统计数据')
    // 可以在这里添加额外的刷新逻辑
  }

  const handleFieldClick = (field: string, value: any) => {
    console.log(`查看字段 ${field} 的详细数据: ${value}`)
    // 可以在这里导航到详情页面或触发筛选
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>设备监控统计</CardTitle>
        </CardHeader>
        <CardContent>
          <ViewDataAggregate
            modelId="device"
            fields={deviceFields}
            aggregateTypes={['count', 'sum', 'avg', 'max', 'min']}
            layout="grid"
            showChange={true}
            refreshInterval={10000}
            onRefresh={handleRefresh}
            onFieldClick={handleFieldClick}
          />
        </CardContent>
      </Card>

      {/* 设备总数 */}
      <div className="text-sm text-slate-600">
        当前监控设备总数：<span className="font-bold">{items?.length || 0}</span> 台
      </div>
    </div>
  )
}
```

### 销售数据分析

销售数据分析仪表板，包含分组统计和多种聚合类型。

```tsx
import { ViewDataAggregate } from '@/components/kesi/view-data-aggregate/view-data-aggregate'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

function SalesAnalytics() {
  const [groupBy, setGroupBy] = useState<string | undefined>()

  const salesFields = [
    { name: 'revenue', label: '收入', type: 'number' as const },
    { name: 'orders', label: '订单数', type: 'number' as const },
    { name: 'profit', label: '利润', type: 'number' as const },
    { name: 'customers', label: '客户数', type: 'number' as const }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">销售数据分析</h2>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="by-category">按分类</TabsTrigger>
            <TabsTrigger value="by-region">按地区</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <ViewDataAggregate
              modelId="sales"
              fields={salesFields}
              aggregateTypes={['sum', 'avg']}
              layout="grid"
            />
          </TabsContent>

          <TabsContent value="by-category" className="space-y-4">
            <ViewDataAggregate
              modelId="sales"
              fields={salesFields}
              aggregateTypes={['sum', 'avg', 'count']}
              groupBy="category"
              layout="grid"
            />
          </TabsContent>

          <TabsContent value="by-region" className="space-y-4">
            <ViewDataAggregate
              modelId="sales"
              fields={salesFields}
              aggregateTypes={['sum', 'avg', 'count']}
              groupBy="region"
              layout="grid"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
```

### 生产数据统计

生产数据实时统计系统，包含自动刷新和列表布局。

```tsx
import { ViewDataAggregate } from '@/components/kesi/view-data-aggregate/view-data-aggregate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

function ProductionStatistics() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const productionFields = [
    { name: 'output', label: '产量', type: 'number' as const },
    { name: 'defects', label: '缺陷数', type: 'number' as const },
    { name: 'energy', label: '能耗', type: 'number' as const },
    { name: 'efficiency', label: '效率', type: 'number' as const },
    { name: 'uptime', label: '运行时间', type: 'number' as const }
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleFieldClick = (field: string, value: any) => {
    alert(`查看 ${field} 的详细数据: ${value}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">生产统计</h2>
          <Badge variant="secondary">实时</Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? '刷新中...' : '立即刷新'}
        </Button>
      </div>

      {/* 主要统计 */}
      <ViewDataAggregate
        modelId="production"
        fields={productionFields}
        aggregateTypes={['sum', 'avg', 'count']}
        layout="grid"
        showChange={true}
        refreshInterval={30000}
        onRefresh={handleRefresh}
        onFieldClick={handleFieldClick}
      />

      {/* 详细统计列表 */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">详细统计</h3>
        <ViewDataAggregate
          modelId="production"
          fields={productionFields}
          aggregateTypes={['sum', 'avg', 'min', 'max']}
          layout="list"
        />
      </div>
    </div>
  )
}
```

## 注意事项

1. **数据类型限制**：sum、avg、min、max 聚合类型只支持 number 类型字段，count 支持所有类型

2. **分组字段**：groupBy 指定的字段必须存在于数据中，否则分组将不生效

3. **数据加载**：组件内部使用 getItems 加载数据，默认限制为 1000 条，大量数据需要后端支持聚合

4. **自动刷新**：refreshInterval 设置后会在组件挂载时启动定时器，组件卸载时自动清理

5. **内存管理**：分组统计时会在内存中构建 Map 结构，数据量过大时需要考虑性能

6. **数值格式化**：统计结果会使用 toLocaleString 进行本地化格式化，最多保留 2 位小数

7. **空值处理**：计算时会自动过滤 null 和 undefined 值

8. **布局切换**：layout 参数只影响视觉展示，不影响数据计算

9. **点击事件**：onFieldClick 只在 layout 为 grid 时生效

10. **聚合类型配置**：可以在 AggregateField.aggregate 中指定特定字段支持的聚合类型，未指定则使用 aggregateTypes 全局配置
