import { MessageDataSource } from './message-data-source'
import { DataSourcePreview } from '../components/DataSourcePreview'
import { ComponentConfig } from '@/app/config/types'

export const messageDataSourcePropsConfig = [
  {
    name: 'id',
    label: '数据源ID',
    type: 'input' as const,
    default: 'message-data-source',
    description: '数据源唯一标识，用于存储和获取数据'
  },
  {
    name: 'initFilter',
    label: '过滤条件',
    type: 'object' as const,
    default: {},
    description: '设置消息查询的过滤条件'
  },
  {
    name: 'isGroup',
    label: '开启聚合',
    type: 'boolean' as const,
    default: false,
    description: '是否开启分组聚合查询'
  },
  {
    name: 'group',
    label: '分组',
    type: 'array' as const,
    default: [],
    description: '设置分组的字段，可以进行多个分组，设置分组后，将根据分组分别进行聚合计算'
  },
  {
    name: 'columns',
    label: '数据列',
    type: 'array' as const,
    default: [],
    description: '配置聚合计算的数据列'
  },
  {
    name: 'fieldOrder',
    label: '排序',
    type: 'array' as const,
    default: [],
    description: '字段排序配置'
  },
  {
    name: 'limit',
    label: '查询条数',
    type: 'number' as const,
    default: 3,
    min: 1,
    description: '返回结果最大条数，不设置默认最多查询1000条'
  },
  {
    name: 'interval',
    label: '轮询时间',
    type: 'number' as const,
    default: 0,
    min: 1,
    description: '数据更新间隔时间，不填写数据不更新，单位（秒）'
  },
  {
    name: 'feildFormat',
    label: '格式化',
    type: 'array' as const,
    default: [],
    description: '字段格式化配置'
  },
  {
    name: 'submit',
    label: '提交',
    type: 'input' as const,
    default: '',
    description: '数据更新标识，修改此值触发数据刷新'
  }
]

export const messageDataSourceDefaultProps = {
  id: 'message-data-source',
  initFilter: {},
  isGroup: false,
  group: [],
  columns: [],
  fieldOrder: [],
  limit: 3,
  interval: 0,
  feildFormat: [],
  submit: ''
}

const renderMessageDataSourcePreview = (props: Record<string, any>) => {
  const { id } = props
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <MessageDataSource {...props}>
          <DataSourcePreview dataSourceId={id} />
        </MessageDataSource>
      </div>
    </div>
  )
}

const renderMessageDataSourceCodePreview = (props: Record<string, any>) => {
  const {
    initFilter = {},
    isGroup = false,
    group = [],
    columns = [],
    fieldOrder = [],
    limit = 1000,
    interval = 0,
    feildFormat = []
  } = props

  const propsString = [
    initFilter && Object.keys(initFilter).length > 0 ? `initFilter={${JSON.stringify(initFilter)}}` : '',
    isGroup ? `isGroup={${isGroup}}` : '',
    group.length > 0 ? `group={${JSON.stringify(group)}}` : '',
    columns.length > 0 ? `columns={${JSON.stringify(columns)}}` : '',
    fieldOrder.length > 0 ? `fieldOrder={${JSON.stringify(fieldOrder)}}` : '',
    limit !== 1000 ? `limit={${limit}}` : '',
    interval > 0 ? `interval={${interval}}` : '',
    feildFormat.length > 0 ? `feildFormat={${JSON.stringify(feildFormat)}}` : ''
  ].filter(Boolean).join('\n  ')

  return `<MessageDataSource\n  ${propsString || '/* 配置消息参数 */'}\n/>`
}

export const messageDataSourceConfig: ComponentConfig = {
  id: 'message-data-source',
  name: '消息数据源',
  propsConfig: messageDataSourcePropsConfig,
  defaultProps: messageDataSourceDefaultProps,
  renderPreview: renderMessageDataSourcePreview,
  renderCodePreview: renderMessageDataSourceCodePreview
}
