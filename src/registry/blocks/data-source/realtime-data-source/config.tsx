import { RealtimeDataSource } from './realtime-data-source'
import { DataSourcePreview } from '../components/DataSourcePreview'
import { ComponentConfig } from '@/app/config/types'
import type { TagConfig, TimeLineConfig } from '../types'

// 默认配置
const defaultRealtimeConfig = {
  tags: [{
    tableDataTag: {
      value: {
        tableId: 'A',
        tableDataId: '6912cc842e0f29806c78bce5',
        tagId: 'a'
      },
      name: '记录数据点:测试a.a'
    }
  }] as TagConfig[],
  timeLine: { count: 5, unit: 'm' } as TimeLineConfig,
  xFormat: 'YYYY-MM-DD HH:mm:ss'
}

export const realtimeDataSourcePropsConfig = [
  {
    name: 'id',
    label: '数据源ID',
    type: 'input' as const,
    default: 'realtime-data-source',
    description: '数据源唯一标识符'
  },
  {
    name: 'tags',
    label: '标签配置',
    type: 'array' as const,
    default: defaultRealtimeConfig.tags,
    description: '实时数据标签配置（tableDataTag 格式）'
  },
  {
    name: 'timeLine',
    label: '时间范围',
    type: 'object' as const,
    default: defaultRealtimeConfig.timeLine,
    description: '时间范围配置（count 和 unit）'
  },
  {
    name: 'xFormat',
    label: '时间格式',
    type: 'input' as const,
    default: defaultRealtimeConfig.xFormat,
    description: '时间显示格式，如 YYYY-MM-DD HH:mm:ss'
  },
  {
    name: 'submit',
    label: '提交标识',
    type: 'input' as const,
    default: '',
    description: '用于触发数据刷新的标识符'
  }
]

export const realtimeDataSourceDefaultProps = {
  id: 'realtime-data-source',
  tags: defaultRealtimeConfig.tags,
  timeLine: defaultRealtimeConfig.timeLine,
  xFormat: defaultRealtimeConfig.xFormat,
  submit: ''
}

const renderRealtimeDataSourcePreview = (props: Record<string, any>) => {
  const { id } = props
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <RealtimeDataSource {...props}>
          <DataSourcePreview dataSourceId={id} />
        </RealtimeDataSource>
      </div>
    </div>
  )
}

const renderRealtimeDataSourceCodePreview = (props: Record<string, any>) => {
  const { tags = defaultRealtimeConfig.tags, timeLine = defaultRealtimeConfig.timeLine, xFormat = defaultRealtimeConfig.xFormat } = props

  const propsString = [
    `tags={${JSON.stringify(tags)}}`,
    `timeLine={${JSON.stringify(timeLine)}}`,
    `xFormat="${xFormat}"`
  ].join('\n  ')

  return `<RealtimeDataSource\n  ${propsString}\n/>`
}

export const realtimeDataSourceConfig: ComponentConfig = {
  id: 'realtime-data-source',
  name: '实时数据源',
  propsConfig: realtimeDataSourcePropsConfig,
  defaultProps: realtimeDataSourceDefaultProps,
  renderPreview: renderRealtimeDataSourcePreview,
  renderCodePreview: renderRealtimeDataSourceCodePreview
}
