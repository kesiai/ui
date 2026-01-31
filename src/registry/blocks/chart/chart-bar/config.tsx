import ChartBar from '@/registry/blocks/chart/chart-bar/chart-bar'
import { ComponentConfig } from '@/app/config/types'

export const chartBarPropsConfig = [
  {
    name: 'title',
    label: '标题',
    type: 'text' as const,
    default: '柱状图',
    placeholder: '请输入图表标题'
  },
  {
    name: 'width',
    label: '宽度',
    type: 'range' as const,
    default: 100,
    min: 50,
    max: 100,
    step: 1
  },
  {
    name: 'height',
    label: '高度',
    type: 'range' as const,
    default: 100,
    min: 50,
    max: 100,
    step: 1
  },
  {
    name: 'chartCode',
    label: '图表代码',
    type: 'code' as const,
    default: ''
  }
]

export const chartBarDefaultProps = {
  title: '柱状图',
  option: {
    title: {
      text: '柱状图示例'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
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
        name: '直接访问',
        type: 'bar',
        data: [320, 332, 301, 334, 390, 330, 320]
      }
    ]
  }
}

const renderChartBarPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full h-48 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
        <div className="w-full h-full" style={{ width: '100%', height: '100%' }}>
          <ChartBar
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

const renderChartBarCodePreview = (props: Record<string, any>) => {
  return `<ChartBar
  title="${props.title}"
  option={${JSON.stringify(props.option, null, 2)}}
  size={{
    width: "${props.width}%",
    height: "${props.height}%"
  }}
  cellKey="your-cell-key"
/>`
}

export const chartBarConfig: ComponentConfig = {
  id: 'chart-bar',
  name: 'ChartBar 柱状图',
  propsConfig: chartBarPropsConfig,
  defaultProps: chartBarDefaultProps,
  renderPreview: renderChartBarPreview,
  renderCodePreview: renderChartBarCodePreview
}
