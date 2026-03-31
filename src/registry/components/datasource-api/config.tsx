import { DatasourceApi } from './datasource-api'
import { DataSourcePreview } from '@/app/components/DataSourcePreview'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './datasource-api.md?raw'

// 默认配置
const defaultApiConfig = {
  url: 'core/t/{table}/d',
  method: 'GET' as const,
  headers: [] as Array<{ name: string; value: string }>,
  body: [] as Array<{ name: string; value: string }>,
  predata: false,
  table: {
    id: '子',
    title: '子表'
  },
  appkey: undefined as string | undefined,
  appsecret: undefined as string | undefined
}

export const apiDataSourcePropsConfig = [
  {
    name: 'id',
    label: '数据源ID',
    type: 'input' as const,
    default: 'datasource-api',
    description: '数据源唯一标识，用于存储和获取数据'
  },
  {
    name: 'url',
    label: '接口地址',
    type: 'input' as const,
    default: defaultApiConfig.url,
    description: 'API 接口的 URL 地址'
  },
  {
    name: 'method',
    label: '请求方法',
    type: 'select' as const,
    default: defaultApiConfig.method,
    options: [
      { label: 'GET', value: 'GET' },
      { label: 'POST', value: 'POST' },
      { label: 'PUT', value: 'PUT' },
      { label: 'PATCH', value: 'PATCH' },
      { label: 'DELETE', value: 'DELETE' }
    ],
    description: 'HTTP 请求方法'
  },
  {
    name: 'headers',
    label: '请求头',
    type: 'array' as const,
    default: defaultApiConfig.headers,
    description: 'HTTP 请求头数组（格式: [{ name: string, value: string }]）'
  },
  {
    name: 'body',
    label: '请求体',
    type: 'array' as const,
    default: defaultApiConfig.body,
    description: 'HTTP 请求体数组（格式: [{ name: string, value: string }]）'
  },
  {
    name: 'predata',
    label: '预处理数据',
    type: 'boolean' as const,
    default: defaultApiConfig.predata,
    description: '是否预处理数据'
  },
  {
    name: 'table',
    label: '数据表',
    type: 'object' as const,
    default: defaultApiConfig.table,
    description: '数据表信息（用于 URL 中的 {table} 占位符）'
  },
  {
    name: 'appkey',
    label: 'AppKey',
    type: 'input' as const,
    default: defaultApiConfig.appkey,
    description: '应用 AppKey'
  },
  {
    name: 'appsecret',
    label: 'AppSecret',
    type: 'input' as const,
    default: defaultApiConfig.appsecret,
    description: '应用 AppSecret'
  },
  {
    name: 'submit',
    label: '提交',
    type: 'input' as const,
    default: '',
    description: '数据更新标识，修改此值触发数据刷新'
  }
]

export const apiDataSourceDefaultProps = {
  id: 'datasource-api',
  url: defaultApiConfig.url,
  method: defaultApiConfig.method,
  headers: defaultApiConfig.headers,
  body: defaultApiConfig.body,
  predata: defaultApiConfig.predata,
  table: defaultApiConfig.table,
  appkey: defaultApiConfig.appkey,
  appsecret: defaultApiConfig.appsecret,
  submit: ''
}

const renderDatasourceApiPreview = (props: Record<string, any>) => {
  const { id } = props
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <DatasourceApi {...props}>
          <DataSourcePreview dataSourceId={id} />
        </DatasourceApi>
      </div>
    </div>
  )
}

const renderDatasourceApiCodePreview = (props: Record<string, any>) => {
  const {
    url = defaultApiConfig.url,
    method = defaultApiConfig.method,
    headers = defaultApiConfig.headers,
    body = defaultApiConfig.body,
    predata = defaultApiConfig.predata,
    table = defaultApiConfig.table
  } = props

  const propsString = [
    `url="${url}"`,
    method !== 'GET' ? `method="${method}"` : '',
    headers && headers.length > 0 ? `headers={${JSON.stringify(headers)}}` : '',
    body && body.length > 0 ? `body={${JSON.stringify(body)}}` : '',
    predata && `predata={${predata}}`,
    table && `table={${JSON.stringify(table)}}`
  ].filter(Boolean).join('\n  ')

  return `<DatasourceApi\n  ${propsString}\n/>`
}

export const apiDataSourceConfig: ComponentConfig = {
  id: 'datasource-api',
  name: 'DatasourceApi API 数据源组件',
  propsConfig: apiDataSourcePropsConfig,
  defaultProps: apiDataSourceDefaultProps,
  renderPreview: renderDatasourceApiPreview,
  renderCodePreview: renderDatasourceApiCodePreview,
  documentation: documentationMd
}
