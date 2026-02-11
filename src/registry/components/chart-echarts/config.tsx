import ChartEcharts from '@/registry/components/chart-echarts/chart-echarts'
import { ComponentConfig } from '@/app/config/types'

export const chartEchartsPropsConfig = [
  {
    name: 'title',
    label: '标题',
    type: 'text' as const,
    default: 'echarts图表',
    placeholder: '请输入图表标题'
  },
  {
    name: 'chartCode',
    label: '图表代码',
    type: 'code' as const,
    default: ''
  }
]

export const chartEchartsDefaultProps = {
  title: 'echarts图表',
  option: {
    title: {
      text: 'echarts图表示例'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
        smooth: true
      }
    ]
  }
}

const renderChartEchartsPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full h-48 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
        <div className="w-full h-full" style={{ width: '100%', height: '100%' }}>
          <ChartEcharts
            option={props.option}
            chartCode={props.chartCode}
            cellKey="preview"
            size={{
              width: `${props.width || 100}%`,
              height: `${props.height || 100}%`
            }}
          />
        </div>
      </div>
    </div>
  )
}

const renderChartEchartsCodePreview = (props: Record<string, any>) => {
  return `<ChartEcharts
  title="${props.title}"
  option={${JSON.stringify(props.option, null, 2)}}
  cellKey="your-cell-key"
/>`
}

export const chartEchartsConfig: ComponentConfig = {
  id: 'chart-echarts',
  name: 'ChartEcharts echarts图表',
  propsConfig: chartEchartsPropsConfig,
  defaultProps: chartEchartsDefaultProps,
  renderPreview: renderChartEchartsPreview,
  renderCodePreview: renderChartEchartsCodePreview
}
