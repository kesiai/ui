import * as React from 'react'
import { ChartEcharts } from '@/registry/components/data-view-chart/data-view-chart'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './data-view-chart.md?raw'

export const dataViewChartPropsConfig = [
  {
    name: 'view',
    label: '数据视图',
    type: 'object' as const,
    description: '数据视图配置，包含 id、name、datasetId、config 等属性'
  },
  {
    name: 'echartOption',
    label: 'ECharts 配置',
    type: 'object' as const,
    description: 'ECharts 图表配置'
  },
  {
    name: 'chartCode',
    label: '图表代码',
    type: 'code' as const,
    description: '图表类型代码'
  }
]

export const dataViewChartDefaultProps = {
  view: {
    "id": "87532fb5-037c-41a1-8332-06f3a861a4ec",
    "datasetId": "c806173d-00ed-4ea5-af2e-342055cc88c5",
    "name": "EE数据视图",
  },
  chartCode: ''
}

const renderDataViewChartPreview = (props: Record<string, any>) => {

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full h-full min-h-80 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <ChartEcharts
          view={props.view || dataViewChartDefaultProps.view}
          echartOption={props.echartOption || dataViewChartDefaultProps.echartOption}
          chartCode={props.chartCode}
          cellKey="preview"
        />
      </div>
    </div>
  )
}

const renderDataViewChartCodePreview = (props: Record<string, any>) => {
  const echartOptionStr = JSON.stringify(props.echartOption || dataViewChartDefaultProps.echartOption, null, 2)

  return `import { ChartEcharts } from '@/registry/components/data-view-chart/data-view-chart'

<ChartEcharts
  view={{
    id: 'view-id',
    name: '数据视图',
    datasetId: 'dataset-id',
    config: {}
  }}
  echartOption={${echartOptionStr}}
  chartCode={${JSON.stringify(props.chartCode || '')}}
/>`
}

export const dataViewChartConfig: ComponentConfig = {
  id: 'data-view-chart',
  name: 'DataViewChart 数据视图展示图表',
  propsConfig: dataViewChartPropsConfig,
  defaultProps: dataViewChartDefaultProps,
  renderPreview: renderDataViewChartPreview,
  renderCodePreview: renderDataViewChartCodePreview,
  documentation: documentationMd
}

export default dataViewChartConfig
