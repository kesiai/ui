import ChartLine from '@/registry/components/chart-line/chart-line'
import { ComponentConfig } from '@/app/config/types'

export const chartLinePropsConfig = [
  {
    name: 'title',
    label: '标题',
    type: 'text' as const,
    default: '折线图',
    placeholder: '请输入图表标题'
  },
  {
    name: 'chartCode',
    label: '图表代码',
    type: 'code' as const,
    default: ''
  }
]

export const chartLineDefaultProps = {
  title: '折线图',
  option: {
    title: {
      text: '折线图示例'
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

const renderChartLinePreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full h-48 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
        <div className="w-full h-full" style={{ width: '100%', height: '100%' }}>
          <ChartLine
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

const renderChartLineCodePreview = (props: Record<string, any>) => {
  return `<ChartLine
  title="${props.title}"
  option={${JSON.stringify(props.option, null, 2)}}
  cellKey="your-cell-key"
/>`
}

export const chartLineConfig: ComponentConfig = {
  id: 'chart-line',
  name: 'ChartLine 折线图',
  propsConfig: chartLinePropsConfig,
  defaultProps: chartLineDefaultProps,
  renderPreview: renderChartLinePreview,
  renderCodePreview: renderChartLineCodePreview
}
