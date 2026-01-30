import { useEffect, useRef } from 'react'
import { DataSource } from '@/registry/blocks/components/data-source/data-source'
import { defaultApiConfig } from '@/registry/blocks/components/data-source/useApiData'
import { defaultHistoryConfig } from '@/registry/blocks/components/data-source/useHistoryData'
import { ComponentConfig } from '../types'

// 各数据源类型的默认配置
export const defaultConfigs: Record<string, any> = {
  api: defaultApiConfig,
  history: defaultHistoryConfig,
  realtime: {
    tags: [],
    xFormat: ''
  },
  table: {
    selectType: 'table',
    table: '',
    isGroup: false,
    queryFields: [],
    fieldOrder: {},
    limit: 100,
    interval: 0
  },
  view: {
    view: '',
    dimension: [],
    measure: [],
    where: [],
    interval: 0
  },
  message: {
    initFilter: {},
    isGroup: false,
    group: [],
    columns: [],
    limit: 100,
    interval: 0
  }
}

export const dataSourcePropsConfig = [
  {
    name: 'type',
    label: '数据源类型',
    type: 'select' as const,
    default: 'api',
    options: [
      { label: '平台接口', value: 'api' },
      { label: '混合数据', value: 'hybrid' },
      { label: '报表数据', value: 'report' },
      { label: '数据接口', value: 'interface' },
      { label: '历史数据', value: 'history' },
      { label: '实时数据', value: 'realtime' },
      { label: '表数据', value: 'table' },
      { label: '视图数据', value: 'view' },
      { label: '消息数据', value: 'message' }
    ],
    description: '选择数据源的类型'
  },
  {
    name: 'config',
    label: '数据源配置',
    type: 'array' as const,
    default: defaultConfigs.api,
    description: '配置数据源的具体参数（JSON格式）'
  }
]

export const dataSourceDefaultProps = {
  type: 'api',
  config: defaultConfigs.api
}

const renderDataSourcePreview = (props: Record<string, any>) => {
  const type = props.type || dataSourceDefaultProps.type
  let config = props.config || dataSourceDefaultProps.config

  // 如果 config 是字符串，尝试解析
  if (typeof config === 'string') {
    try {
      config = JSON.parse(config)
    } catch {
      config = {}
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <DataSource
          type={type}
          config={config}
        />
      </div>
    </div>
  )
}

const renderDataSourceCodePreview = (props: Record<string, any>) => {
  const type = props.type || dataSourceDefaultProps.type
  let config = props.config || dataSourceDefaultProps.config

  // 如果 config 是字符串，尝试解析
  if (typeof config === 'string') {
    try {
      config = JSON.parse(config)
    } catch {
      config = {}
    }
  }

  const configString = JSON.stringify(config, null, 2)

  let code = `<DataSource\n  type="${type}"`

  if (Object.keys(config).length > 0) {
    code += `\n  config={${configString}}`
  }

  code += `\n/>`

  return code
}

// 自定义表单：当 type 变化时自动更新 config
const renderDataSourceCustomForm = (props: Record<string, any>, onChange: (name: string, value: any) => void) => {
  const { type } = props
  const prevTypeRef = useRef<string | undefined>(type)

  useEffect(() => {
    // 只在 type 真正变化时才更新 config
    if (type && type !== prevTypeRef.current && defaultConfigs[type]) {
      prevTypeRef.current = type
      onChange('config', defaultConfigs[type])
    }
  }, [type, onChange])

  return null // 不需要渲染额外的表单
}

export const dataSourceConfig: ComponentConfig = {
  id: 'data-source',
  name: 'DataSource 数据源',
  propsConfig: dataSourcePropsConfig,
  defaultProps: dataSourceDefaultProps,
  renderPreview: renderDataSourcePreview,
  renderCodePreview: renderDataSourceCodePreview,
  renderCustomForm: renderDataSourceCustomForm
}
