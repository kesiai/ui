import { ViewDataSource } from './view-data-source'
import { DataSourcePreview } from '@/app/components/DataSourcePreview'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './view-data-source.md?raw'

const defaultView = {
  id: "05294f12-2845-4eeb-abae-154c6bdfe87c",
  name: "FF",
  config: {
    fields: [{
      name: "*",
      alias: "记录数",
      option: {
        aggregator: "count"
      }
    }],
    group: ["e798a6f2-91fc-436b-b34d-ae5002229d75"],
    echartType: "line",
    noGroupBy: false,
    groupAlias: [""]
  },
  datasetId: "f38cc289-25ef-42cb-8fb9-fac7fe09dbd5",
  style: {
    dimension: [{
      id: "e798a6f2-91fc-436b-b34d-ae5002229d75",
      name: "e798a6f2-91fc-436b-b34d-ae5002229d75"
    }],
    echartType: "line",
    groupBy: true,
    measure: [{
      filter: null,
      group: "count",
      id: "*",
      isDefaultMeasure: true,
      isMeasure: true,
      name: "*",
      onlyCount: true
    }],
    stack: null
  }
}

const defaultDimension = [{
  id: "e798a6f2-91fc-436b-b34d-ae5002229d75",
  name: "e798a6f2-91fc-436b-b34d-ae5002229d75"
}]

const defaultMeasure = [{
  filter: null,
  group: "count",
  id: "*",
  isDefaultMeasure: true,
  isMeasure: true,
  name: "*",
  onlyCount: true
}]

export const viewDataSourcePropsConfig = [
  {
    name: 'id',
    label: '数据源ID',
    type: 'input' as const,
    default: 'view-data-source',
    description: '数据源唯一标识符'
  },
  {
    name: 'view',
    label: '视图配置',
    type: 'object' as const,
    default: defaultView,
    description: '视图配置对象（包含 id、name、config、datasetId、style 等）'
  },
  {
    name: 'dimension',
    label: '维度',
    type: 'array' as const,
    default: defaultDimension,
    description: '维度配置数组'
  },
  {
    name: 'measure',
    label: '度量',
    type: 'array' as const,
    default: defaultMeasure,
    description: '度量配置数组'
  },
  {
    name: 'interval',
    label: '刷新间隔（秒）',
    type: 'number' as const,
    default: 0,
    description: '设置为 0 表示手动刷新'
  },
  {
    name: 'submit',
    label: '提交标识',
    type: 'input' as const,
    default: '',
    description: '用于触发数据刷新的标识符'
  }
]

export const viewDataSourceDefaultProps = {
  id: 'view-data-source',
  view: defaultView,
  dimension: defaultDimension,
  measure: defaultMeasure,
  interval: 0,
  submit: ''
}

const renderViewDataSourcePreview = (props: Record<string, any>) => {
  const { id } = props
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <ViewDataSource {...props}>
          <DataSourcePreview dataSourceId={id} />
        </ViewDataSource>
      </div>
    </div>
  )
}

const renderViewDataSourceCodePreview = (props: Record<string, any>) => {
  const { view = defaultView, dimension = defaultDimension, measure = defaultMeasure, interval = 0 } = props

  const viewObj = view && Object.keys(view).length > 0 ? view : defaultView
  const dimensionObj = dimension && dimension.length > 0 ? dimension : defaultDimension
  const measureObj = measure && measure.length > 0 ? measure : defaultMeasure

  const propsString = [
    `view={${JSON.stringify(viewObj)}}`,
    `dimension={${JSON.stringify(dimensionObj)}}`,
    `measure={${JSON.stringify(measureObj)}}`,
    `interval={${interval}}`
  ].join('\n  ')

  return `<ViewDataSource\n  ${propsString}\n/>`
}

export const viewDataSourceConfig: ComponentConfig = {
  id: 'datasource-view',
  name: '视图数据源',
  propsConfig: viewDataSourcePropsConfig,
  defaultProps: viewDataSourceDefaultProps,
  renderPreview: renderViewDataSourcePreview,
  renderCodePreview: renderViewDataSourceCodePreview,
  documentation: documentationMd
}
