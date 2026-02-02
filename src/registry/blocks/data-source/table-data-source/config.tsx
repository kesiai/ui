import { TableDataSource } from './table-data-source'
import { ComponentConfig } from '@/app/config/types'
import type { FieldFormatConfig } from '../types'

// 默认配置
const defaultTableConfig = {
  selectType: 'table' as const,
  table: {
    id: 'A',
    name: 'A'
  },
  isGroup: false,
  showInnerField: false,
  statsBySingle: null,
  feildFormat: [
    {
      field: {
        title: '通信时间（connectTime）',
        value: 'connectTime',
        type: 'schema',
        id: 'connectTime',
        name: '通信时间',
        propertyType: 'string'
      },
      format: {
        type: 'date',
        format: 'YYYY-MM-DD hh:mm:ss'
      }
    }
  ] as FieldFormatConfig[]
}

export const tableDataSourcePropsConfig = [
  {
    name: 'selectType',
    label: '选择类型',
    type: 'select' as const,
    default: defaultTableConfig.selectType,
    options: [
      { label: '表', value: 'table' },
      { label: '数据集', value: 'dataset' }
    ],
    description: '数据源选择类型'
  },
  {
    name: 'table',
    label: '数据表',
    type: 'object' as const,
    default: defaultTableConfig.table,
    description: '数据表信息（id, name 等）'
  },
  {
    name: 'isGroup',
    label: '是否分组',
    type: 'boolean' as const,
    default: defaultTableConfig.isGroup,
    description: '是否进行分组查询'
  },
  {
    name: 'feildFormat',
    label: '字段格式',
    type: 'array' as const,
    default: defaultTableConfig.feildFormat,
    description: '字段格式化配置'
  }
]

export const tableDataSourceDefaultProps = {
  selectType: defaultTableConfig.selectType,
  table: defaultTableConfig.table,
  isGroup: defaultTableConfig.isGroup,
  feildFormat: defaultTableConfig.feildFormat
}

const renderTableDataSourcePreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <TableDataSource {...props} />
      </div>
    </div>
  )
}

const renderTableDataSourceCodePreview = (props: Record<string, any>) => {
  const { selectType = 'table', table = defaultTableConfig.table, isGroup = false, feildFormat = defaultTableConfig.feildFormat } = props

  const propsString = [
    `selectType="${selectType}"`,
    `table={${JSON.stringify(table)}}`,
    `isGroup={${isGroup}}`,
    `feildFormat={${JSON.stringify(feildFormat)}}`
  ].join('\n  ')

  return `<TableDataSource\n  ${propsString}\n/>`
}

export const tableDataSourceConfig: ComponentConfig = {
  id: 'table-data-source',
  name: '表数据源',
  propsConfig: tableDataSourcePropsConfig,
  defaultProps: tableDataSourceDefaultProps,
  renderPreview: renderTableDataSourcePreview,
  renderCodePreview: renderTableDataSourceCodePreview
}
