# DataViewChart 数据视图图表组件

## 简介

`DataViewChart` 是一个基于 ECharts 的数据视图图表组件，用于展示来自系统数据视图的预配置数据。

- **ECharts 集成**：基于 `BaseChart` 组件实现丰富的图表类型
- **数据视图支持**：通过 `view.id` 获取预定义的视图数据
- **自动数据处理**：支持堆叠柱状图、饼图、散点图等多种图表类型
- **字符串转函数**：支持通过字符串配置回调函数（如 `itemStyle: 'params => params.value'`）
- **国际化支持**：自动根据语言设置显示字段别名
- **时间格式化**：支持时间类型字段的自定义格式化

## 适用场景

- 数据可视化展示
- BI 分析报表
- 实时数据监控
- 趋势分析图表
- 统计数据展示

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `view` | `View` | 是 | `{}` | 数据视图配置对象 |
| `echartOption` | `any` | 否 | `{}` | ECharts 图表配置选项（会与自动生成的配置合并） |
| `chartCode` | `string` | 否 | - | 图表类型代码 |

### View 数据视图配置

```typescript
{
  id: string              // 视图 ID（必需）
  name: string           // 视图名称
  datasetId: string      // 数据集 ID
}
```

## 工作原理

```
1. 组件初始化
   ↓
2. 根据 view.id 获取视图数据
   - 调用 ds/view/preview API
   - POST 请求传递 view 配置
   ↓
3. 数据处理
   - 根据 stat.stacked 判断是否为堆叠图
   - 堆叠图：调用 getStackBarOption
   - 普通图：调用 getCommonOption
   ↓
4. 配置合并
   - 自动生成的配置与 echartOption 合并
   - 字符串函数转换为可执行函数
   ↓
5. 渲染图表
   - 传递处理后的 option 到 BaseChart
   - ECharts 渲染最终图表
```

## 图表类型

组件根据 `view.style.echartType` 和数据特征自动选择图表类型：

| echartType | 图表类型 | 说明 |
|------------|----------|------|
| `bar` | 柱状图 | 分类数据对比 |
| `line` | 折线图 | 趋势变化展示 |
| `scatter` | 散点图 | 数据分布分析 |
| `pie` | 饼图 | 占比展示 |

## 基本用法

### 1. 简单折线图

```tsx
import { ChartEcharts } from '@/registry/components/kesi/data-view-chart/data-view-chart'

function LineChart() {
  return (
    <ChartEcharts
      view={{
        id: 'view-001',
        name: '温度趋势',
        datasetId: 'temp-dataset'
      }}
    />
  )
}
```

### 2. 柱状图

```tsx
function BarChart() {
  return (
    <ChartEcharts
      view={{
        id: 'view-002',
        name: '设备统计',
        datasetId: 'device-dataset'
      }}
      echartOption={{
        series: [{ type: 'bar' }]
      }}
    />
  )
}
```

### 3. 饼图

```tsx
function PieChart() {
  return (
    <ChartEcharts
      view={{
        id: 'view-003',
        name: '状态分布',
        datasetId: 'status-dataset'
      }}
      echartOption={{
        series: [{
          type: 'pie',
          radius: '60%'
        }]
      }}
    />
  )
}
```

### 4. 自定义 ECharts 配置

```tsx
function CustomChart() {
  return (
    <ChartEcharts
      view={{
        id: 'view-004',
        name: '自定义图表',
        datasetId: 'custom-dataset'
      }}
      echartOption={{
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value', name: '数值' },
        series: [{
          type: 'bar',
          itemStyle: {
            color: 'params => params.dataIndex % 2 === 0 ? "#5470c6" : "#91cc75"'
          }
        }],
        tooltip: {
          formatter: 'params => `${params.name}: ${params.value}`
        }
      }}
    />
  )
}
```

**说明：**
- 组件会自动将包含 `=>` 的字符串转换为函数
- 支持嵌套对象的递归转换
- 转换失败时保留原字符串并输出错误

### 5. 堆叠柱状图

当视图数据包含堆叠配置时（`stat.stacked === true`），组件会自动生成堆叠柱状图：

```tsx
function StackedBarChart() {
  return (
    <ChartEcharts
      view={{
        id: 'view-stacked',
        name: '堆叠统计',
        datasetId: 'stacked-dataset'
      }}
    />
  )
}
```

## 数据格式说明

### API 返回数据格式

```typescript
{
  fields: [
    { name: 'category', alias: '类别', biType: 'string' },
    { name: 'value', alias: '数值', biType: 'number' }
  ],
  data: [
    ['类别A', 120],
    ['类别B', 200],
    ['类别C', 150]
  ],
  stat: {
    stacked: false,
    nCategories: 1,
    nStacks: 0,
    nValues: 1,
    grouped: true
  },
  style: {
    echartType: 'bar',
    dimension: [...],
    measure: [...],
    baseValue: {
      option: { /* 默认图表配置 */ }
    }
  }
}
```

### 统计字段说明

| 字段 | 说明 |
|------|------|
| `stacked` | 是否为堆叠图 |
| `nCategories` | 分类维度数量 |
| `nStacks` | 堆叠维度数量 |
| `nValues` | 值维度数量 |
| `grouped` | 是否分组 |

## API 说明

### 数据获取接口

```
POST ds/view/preview?id={viewId}
Content-Type: application/json

Body: {
  "id": "view-id",
  "name": "视图名称",
  "datasetId": "dataset-id"
}
```

### 响应格式

```json
{
  "fields": [...],
  "data": [...],
  "stat": {...},
  "style": {...}
}
```

## 注意事项

1. **view.id 必需**：必须提供有效的视图 ID，否则组件返回 null

2. **数据异步加载**：数据通过 API 异步获取，首次渲染时可能为空

3. **字符串函数格式**：
   - 必须包含 `=>` 箭头函数语法
   - 建议使用单引号包裹字符串
   - 转换失败时保留原字符串

4. **配置合并顺序**：
   - 自动生成的基础配置
   - 与 `echartOption` 合并
   - `echartOption` 优先级更高

5. **图表类型自动识别**：
   - 通过 `view.style.echartType` 指定
   - 支持类型：bar、line、scatter、pie

6. **时间格式化**：
   - 字段 `biType === 'time'` 时自动格式化
   - 使用维度配置中的 `timeFormat`
   - 基于 dayjs 实现

7. **国际化**：
   - 通过 `alias_{语言}` 支持多语言
   - 例如：`alias_en` 对应英文

8. **错误处理**：
   - API 请求失败时在控制台输出错误
   - 不会中断应用运行

## 完整示例

### 仪表板布局

```tsx
function DashboardLayout() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 设备状态分布 */}
      <div className="bg-white p-4 rounded">
        <h3 className="text-lg font-bold mb-4">设备状态分布</h3>
        <ChartEcharts
          view={{
            id: 'view-status',
            name: '状态分布',
            datasetId: 'device-dataset'
          }}
        />
      </div>

      {/* 温度趋势 */}
      <div className="bg-white p-4 rounded">
        <h3 className="text-lg font-bold mb-4">温度趋势</h3>
        <ChartEcharts
          view={{
            id: 'view-temp',
            name: '温度趋势',
            datasetId: 'temp-dataset'
          }}
          echartOption={{
            series: [{
              type: 'line',
              smooth: true
            }]
          }}
        />
      </div>
    </div>
  )
}
```

### 带自定义配置的图表

```tsx
function CustomStyledChart() {
  return (
    <ChartEcharts
      view={{
        id: 'view-custom',
        name: '自定义图表',
        datasetId: 'custom-dataset'
      }}
      echartOption={{
        backgroundColor: '#f5f5f5',
        title: {
          text: '自定义标题',
          left: 'center'
        },
        legend: {
          top: 30,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          name: '数量'
        },
        series: [{
          type: 'bar',
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#83bff6' },
                { offset: 1, color: '#188df0' }
              ]
            }
          }
        }]
      }}
    />
  )
}
```
