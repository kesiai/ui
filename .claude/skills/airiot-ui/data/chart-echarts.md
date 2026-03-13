# ChartEcharts echarts图表

## 简介

`ChartEcharts` 是一个基于 ECharts 5 的强大图表组件，支持多种图表类型和数据绑定，通过 JSON 配置或自定义代码实现复杂的图表展示。

- **多种图表类型**：支持折线图、柱状图、饼图、散点图等数十种图表类型
- **数据绑定**：支持直接数据绑定和 dataset 格式数据源
- **自定义代码**：可通过 chartCode 实现动态图表配置和数据处理
- **响应式设计**：自动适应容器大小变化
- **事件支持**：支持图表交互事件回调

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `title` | `string` | 否 | `"echarts图表"` | 图表标题 |
| `option` | `object` | 是 | 见下方默认配置 | ECharts 配置对象，完整的图表配置 |
| `chartCode` | `string` | 否 | `""` | 自定义图表代码，用于动态生成图表配置 |
| `chartData` | `object` | 否 | `undefined` | 数据源对象，支持 dimensions 格式 |
| `seriesOption` | `object` | 否 | `undefined` | 系列配置，与 chartData 配合使用 |
| `cellKey` | `string` | 是 | - | 图表实例的唯一标识 |
| `size` | `{width?, height?}` | 否 | `width: '100%', height: '100%'` | 图表尺寸 |
| `theme` | `string` | 否 | `undefined` | 主题配置 |
| `className` | `string` | 否 | `undefined` | CSS 类名 |
| `style` | `object` | 否 | `undefined` | 内联样式 |
| `onEvents` | `object` | 否 | `undefined` | 事件回调对象 |
| `onChartReady` | `function` | 否 | `undefined` | 图表初始化完成回调 |

### option 配置说明

`option` 是 ECharts 的完整配置对象，支持所有 ECharts 5 的配置项：

```typescript
option = {
  title: {
    text: '标题'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [120, 200, 150],
    type: 'line'
  }]
}
```

### chartCode 配置说明

`chartCode` 是一个 JavaScript 代码字符串，可以访问 `myChart`、`dataset` 和 `props` 变量：

```javascript
// 示例：根据数据动态计算
if (dataset && dataset.dimensions) {
  const data = dataset.source;
  option = {
    ...option,
    series: data.slice(1).map((col, idx) => ({
      name: col,
      type: 'line',
      data: data.slice(1).map(row => row[idx + 1])
    }))
  };
}

// 示例：添加交互
codeOption = {
  series: [{
    type: 'line',
    markPoint: {
      data: [
        { type: 'max', name: '最大值' },
        { type: 'min', name: '最小值' }
      ]
    }
  }]
}
```

## 基本用法

### 1. 基础折线图

创建一个简单的折线图，展示一周的数据趋势。

```tsx
import { ChartEcharts } from '@/components/airiot/chart-echarts'

function BasicLineChart() {
  return (
    <ChartEcharts
      title="一周销量趋势"
      cellKey="basic-chart"
      option={{
        title: {
          text: '一周销量趋势'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'line',
          smooth: true
        }]
      }}
    />
  )
}
```

### 2. 柱状图示例

创建一个分组柱状图，展示不同类别的数据对比。

```tsx
import { ChartEcharts } from '@/components/airiot/chart-echarts'

function BarChartExample() {
  return (
    <ChartEcharts
      title="产品销量对比"
      cellKey="bar-chart"
      option={{
        title: {
          text: '产品销量对比'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['2023年', '2024年']
        },
        xAxis: {
          type: 'category',
          data: ['产品A', '产品B', '产品C', '产品D']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '2023年',
            type: 'bar',
            data: [120, 200, 150, 80]
          },
          {
            name: '2024年',
            type: 'bar',
            data: [150, 180, 200, 120]
          }
        ]
      }}
    />
  )
}
```

### 3. 使用 chartCode 动态配置

通过 chartCode 实现动态数据处理和图表配置。

```tsx
import { ChartEcharts } from '@/components/airiot/chart-echarts'

function DynamicChart() {
  const chartCode = `
    // 动态计算平均值线
    const avgValue = dataset.source.reduce((sum: number, item: any[]) => sum + item[1], 0) / dataset.source.length;

    option = {
      ...option,
      series: [{
        ...option.series[0],
        markLine: {
          data: [
            { type: 'average', name: '平均值' }
          ]
        }
      }],
      graphic: [{
        type: 'text',
        left: 'center',
        bottom: 10,
        style: {
          text: '平均值: ' + avgValue.toFixed(2),
          fontSize: 14
        }
      }]
    };
  `

  return (
    <ChartEcharts
      title="动态计算图表"
      cellKey="dynamic-chart"
      option={{
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110],
          type: 'line'
        }]
      }}
      chartCode={chartCode}
    />
  )
}
```

### 4. 使用数据源绑定

使用 dataset 格式绑定数据，支持时间序列数据。

```tsx
import { ChartEcharts } from '@/components/airiot/chart-echarts'

function DatasetChart() {
  const chartData = {
    dimensions: [
      { name: 'date', type: 'time' },
      { name: 'value1' },
      { name: 'value2' }
    ],
    source: [
      ['2024-01-01', 100, 200],
      ['2024-01-02', 150, 180],
      ['2024-01-03', 120, 220],
      ['2024-01-04', 180, 150]
    ]
  }

  return (
    <ChartEcharts
      title="时间序列数据"
      cellKey="dataset-chart"
      option={{
        title: {
          text: '时间序列数据'
        },
        tooltip: {
          trigger: 'axis'
        },
        dataset: chartData,
        xAxis: {
          type: 'time'
        },
        yAxis: {},
        series: [
          {
            type: 'line',
            encode: {
              x: 'date',
              y: 'value1'
            }
          },
          {
            type: 'line',
            encode: {
              x: 'date',
              y: 'value2'
            }
          }
        ]
      }}
    />
  )
}
```

## 完整示例

### 1. 仪表盘综合展示

创建一个包含多种图表类型的仪表盘，展示业务数据概览。

```tsx
import { ChartEcharts } from '@/components/airiot/chart-echarts'

function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* 销售趋势图 */}
      <ChartEcharts
        title="月度销售趋势"
        cellKey="sales-trend"
        option={{
          title: {
            text: '月度销售趋势',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月'],
            axisLabel: {
              rotate: 45
            }
          },
          yAxis: {
            type: 'value',
            name: '销售额（万元）'
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330],
            type: 'line',
            smooth: true,
            areaStyle: {
              opacity: 0.3
            },
            itemStyle: {
              color: '#3b82f6'
            }
          }]
        }}
        size={{ height: '300px' }}
      />

      {/* 产品分类饼图 */}
      <ChartEcharts
        title="产品分类占比"
        cellKey="category-pie"
        option={{
          title: {
            text: '产品分类占比',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [{
            name: '销售占比',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 335, name: '电子产品' },
              { value: 310, name: '服装' },
              { value: 234, name: '食品' },
              { value: 135, name: '家居' },
              { value: 148, name: '其他' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        }}
        size={{ height: '300px' }}
      />
    </div>
  )
}
```

### 2. 实时数据监控

实现一个实时更新的监控图表，模拟数据流。

```tsx
import { ChartEcharts } from '@/components/airiot/chart-echarts'
import { useState, useEffect } from 'react'

function RealTimeMonitor() {
  const [data, setData] = useState([])

  useEffect(() => {
    // 模拟实时数据
    const interval = setInterval(() => {
      const newValue = Math.floor(Math.random() * 100)
      const time = new Date().toLocaleTimeString()

      setData(prev => {
        const newData = [...prev, [time, newValue]]
        // 只保留最近20个数据点
        return newData.slice(-20)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const chartCode = `
    // 添加滚动效果
    if (dataset && dataset.source.length > 10) {
      option.dataZoom = [{
        type: 'inside',
        start: 50,
        end: 100
      }]
    }
  `

  return (
    <ChartEcharts
      title="实时数据监控"
      cellKey="realtime-monitor"
      option={{
        title: {
          text: '实时数据监控',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            params = params[0]
            return params.name + ': ' + params.value[1]
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.map(item => item[0])
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, 0.1]
        },
        series: [{
          name: '实时数据',
          type: 'line',
          data: data.map(item => item[1]),
          smooth: true,
          areaStyle: {
            color: 'rgba(59, 130, 246, 0.3)'
          }
        }]
      }}
      chartCode={chartCode}
      size={{ height: '400px' }}
    />
  )
}
```

## 注意事项

1. **cellKey 唯一性**：每个图表实例必须有唯一的 cellKey，避免图表实例冲突

2. **性能优化**：大数据集时建议使用 dataZoom 组件和渐进式渲染

3. **内存管理**：组件卸载时会自动销毁图表实例，避免内存泄漏

4. **错误处理**：chartCode 中的错误会在图表上显示红色提示，请确保代码语法正确

5. **响应式适配**：图表会自动适应容器大小，但建议为容器设置明确的高度

6. **主题配置**：可以通过 theme 参数使用 ECharts 内置主题，或自定义主题文件

7. **事件绑定**：onEvents 支持所有 ECharts 事件，注意在组件卸载时清理事件监听

8. **数据格式**：使用 dataset 时，确保数据格式符合 ECharts 要求，dimensions 数组必须与数据源对应