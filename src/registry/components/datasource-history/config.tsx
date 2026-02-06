import { HistoryDataSource } from './history-data-source'
import { DataSourcePreview } from '@/app/components/DataSourcePreview'
import { ComponentConfig } from '@/app/config/types'
import type { TimeRangeConfig, GroupConfig } from '@/registry/lib/datasource-types'
import documentationMd from './history-data-source.md?raw'

// 默认配置
const defaultHistoryConfig = {
  timeRange: {
    type: 'forward',
    range: {
      gte: '2026-01-28 17:08:54',
      lte: '2026-01-31 17:08:58'
    },
    unit: 'd',
    count: 1,
    fromNow: true
  } as TimeRangeConfig,
  group: {
    count: 0,
    unit: '',
    fill: { value: 'null' }
  } as GroupConfig,
  tags: [],
  columns: [{
    table: {
      id: 'A',
      name: 'A',
      tableMajorType: 'device'
    },
    tableData: {
      id: 'A001',
      name: 'A001',
      table: {
        id: 'A',
        name: 'A',
        tableMajorType: 'device'
      }
    },
    field: 'COUNT(\"a\")'
  }],
  xFormat: 'YYYY-MM-DD HH:mm:ss'
}

export const historyDataSourcePropsConfig = [
  {
    name: 'id',
    label: '数据源ID',
    type: 'input' as const,
    default: 'history-data-source',
    description: '数据源唯一标识，用于存储和获取数据'
  },
  {
    name: 'timeRange',
    label: '时间范围',
    type: 'object' as const,
    default: defaultHistoryConfig.timeRange,
    description: '时间范围配置（type, range, unit, count, fromNow）'
  },
  {
    name: 'group',
    label: '分组配置',
    type: 'object' as const,
    default: defaultHistoryConfig.group,
    description: '分组配置（count, unit, fill）'
  },
  {
    name: 'tags',
    label: '标签配置',
    type: 'array' as const,
    default: defaultHistoryConfig.tags,
    description: '数据标签配置数组'
  },
  {
    name: 'columns',
    label: '列配置',
    type: 'array' as const,
    default: defaultHistoryConfig.columns,
    description: '数据列配置数组'
  },
  {
    name: 'xFormat',
    label: '时间格式',
    type: 'input' as const,
    default: 'YYYY-MM-DD HH:mm:ss',
    description: '时间显示格式'
  },
  {
    name: 'submit',
    label: '提交',
    type: 'input' as const,
    default: '',
    description: '数据更新标识，修改此值触发数据刷新'
  }
]

export const historyDataSourceDefaultProps = {
  id: 'history-data-source',
  timeRange: defaultHistoryConfig.timeRange,
  group: defaultHistoryConfig.group,
  tags: defaultHistoryConfig.tags,
  columns: defaultHistoryConfig.columns,
  xFormat: defaultHistoryConfig.xFormat,
  submit: ''
}

const renderHistoryDataSourcePreview = (props: Record<string, any>) => {
  const { id } = props
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <HistoryDataSource {...props}>
          <DataSourcePreview dataSourceId={id} />
        </HistoryDataSource>
      </div>
    </div>
  )
}

const renderHistoryDataSourceCodePreview = (props: Record<string, any>) => {
  const { timeRange = defaultHistoryConfig.timeRange, group = defaultHistoryConfig.group, tags = defaultHistoryConfig.tags, columns = defaultHistoryConfig.columns, xFormat = 'YYYY-MM-DD HH:mm:ss' } = props

  const propsString = [
    `timeRange={${JSON.stringify(timeRange)}}`,
    `group={${JSON.stringify(group)}}`,
    `tags={${JSON.stringify(tags)}}`,
    `columns={${JSON.stringify(columns)}}`,
    `xFormat="${xFormat}"`
  ].join('\n  ')

  return `<HistoryDataSource\n  ${propsString}\n/>`
}

export const historyDataSourceConfig: ComponentConfig = {
  id: 'datasource-history',
  name: '历史数据源',
  propsConfig: historyDataSourcePropsConfig,
  defaultProps: historyDataSourceDefaultProps,
  renderPreview: renderHistoryDataSourcePreview,
  renderCodePreview: renderHistoryDataSourceCodePreview,
  documentation: documentationMd
}
