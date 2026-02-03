import { InterfaceDataSource } from './interface-data-source'
import { ComponentConfig } from '@/app/config/types'

export const interfaceDataSourcePropsConfig = [
  {
    name: 'id',
    label: '数据源ID',
    type: 'input' as const,
    default: 'interface-data-source',
    description: '数据源唯一标识符'
  },
  {
    name: 'ds',
    label: '分组',
    type: 'input' as const,
    default: 'ai',
    description: '选择数据接口中创建的数据分组'
  },
  {
    name: 'op',
    label: '接口',
    type: 'object' as const,
    default: { id: '67da8683f9f8102e30cf0b3b', key: 'device_max_values_Yglzib' },
    description: '选择分组下的具体数据接口（包含 id、key 和 name）'
  },
  {
    name: 'params',
    label: '参数',
    type: 'object' as const,
    default: { value: {} },
    description: '接口请求参数（格式: { value: { key: value } }）'
  },
  {
    name: 'predata',
    label: '预处理数据',
    type: 'boolean' as const,
    default: false,
    description: '只有接口返回数据为数组格式时，支持预处理数据，否则依然返回原数据'
  },
  {
    name: 'interval',
    label: '轮询时间',
    type: 'number' as const,
    default: 0,
    min: 0,
    description: '数据更新间隔时间，不填写数据不更新，单位（秒）'
  },
  {
    name: 'submit',
    label: '提交标识',
    type: 'input' as const,
    default: '',
    description: '用于触发数据刷新的标识符'
  }
]

export const interfaceDataSourceDefaultProps = {
  id: 'interface-data-source',
  ds: 'ai',
  op: { id: '67da8683f9f8102e30cf0b3b', key: 'device_max_values_Yglzib' },
  params: { value: {} },
  predata: false,
  interval: 0,
  submit: ''
}

const renderInterfaceDataSourcePreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <InterfaceDataSource {...props} />
      </div>
    </div>
  )
}

const renderInterfaceDataSourceCodePreview = (props: Record<string, any>) => {
  const {
    ds = 'ai',
    op = { id: '67da8683f9f8102e30cf0b3b', key: 'device_max_values_Yglzib' },
    params = { value: {} },
    predata = false,
    interval = 0
  } = props

  const propsString = [
    ds ? `ds="${ds}"` : '',
    op?.key ? `op={{ key: "${op.key}"${op?.name ? `, name: "${op.name}"` : ''} }}` : '',
    params?.value && Object.keys(params.value).length > 0 ? `params={{ value: ${JSON.stringify(params.value)} }}` : '',
    predata ? `predata={${predata}}` : '',
    interval > 0 ? `interval={${interval}}` : ''
  ].filter(Boolean).join('\n  ')

  return `<InterfaceDataSource\n  ${propsString || '/* 配置接口参数 */'}\n/>`
}

export const interfaceDataSourceConfig: ComponentConfig = {
  id: 'interface-data-source',
  name: '接口数据源',
  propsConfig: interfaceDataSourcePropsConfig,
  defaultProps: interfaceDataSourceDefaultProps,
  renderPreview: renderInterfaceDataSourcePreview,
  renderCodePreview: renderInterfaceDataSourceCodePreview
}
