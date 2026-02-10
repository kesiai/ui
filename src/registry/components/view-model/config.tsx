import React, { use } from 'react'
import ViewModel from './view-model'
import { ComponentConfig } from '@/app/config/types'
import { useModel } from '@airiot/client'
import documentationMd from './view-model.md?raw'

export const viewModelPropsConfig = [
  {
    name: 'modelName',
    label: '内置模型',
    type: 'model-name' as const,
    default: null,
    description: '内置模型的选择'
  },
  {
    name: 'tableId',
    label: '表格ID',
    type: 'table-id' as const,
    default: 'task_def',
    description: '数据表格的唯一标识符'
  },
  {
    name: 'initQuery',
    label: '初始化查询',
    type: 'boolean' as const,
    default: false,
    description: '是否在视图显示时就查询一次数据，false 则由内部表格组件发起查询'
  },
  {
    name: 'queryFields',
    label: '查询字段',
    type: 'array' as const,
    default: [],
    description: '指定要查询的字段列表，为空则查询所有字段'
  },
  {
    name: 'projectAll',
    label: '查询所有字段',
    type: 'boolean' as const,
    default: false,
    description: '是否查询所有字段（包括嵌套字段）'
  },
  {
    name: 'limit',
    label: '数据限制',
    type: 'number' as const,
    default: 10,
    min: 1,
    max: 1000,
    step: 10,
    description: '限制返回的数据条数'
  },
  {
    name: 'tableFilters',
    label: '表格筛选',
    type: 'json' as const,
    default: '[]',
    description: '表格筛选条件（JSON 数组格式）'
  },
  {
    name: 'fieldOrder',
    label: '字段排序',
    type: 'json' as const,
    default: '{}',
    description: '字段排序规则（JSON 对象格式，例如: {"createTime": "desc"}）'
  },
  {
    name: 'interval',
    label: '刷新间隔',
    type: 'number' as const,
    default: 0,
    min: 0,
    max: 60000,
    step: 1000,
    description: '数据自动刷新间隔（毫秒），0 表示不刷新'
  },
  {
    name: 'showExample',
    label: '显示示例数据',
    type: 'boolean' as const,
    default: true,
    description: '是否在预览中显示示例配置'
  }
]

export const viewModelDefaultProps = {
  tableId: 'task_def',
  initQuery: false,
  queryFields: [],
  projectAll: false,
  limit: 10,
  tableFilters: [],
  fieldOrder: {},
  interval: 0,
  showExample: true
}

const renderViewModelPreview = (props: Record<string, any>) => {
  // 解析 tableFilters
  let tableFilters = props.tableFilters || []
  try {
    tableFilters = typeof props.tableFilters === 'string'
      ? JSON.parse(props.tableFilters)
      : props.tableFilters
  } catch (e) {
    tableFilters = []
  }

  // 解析 fieldOrder
  let fieldOrder = props.fieldOrder || {}
  try {
    fieldOrder = typeof props.fieldOrder === 'string'
      ? JSON.parse(props.fieldOrder)
      : props.fieldOrder
  } catch (e) {
    fieldOrder = {}
  }

  // 解析 queryFields
  let queryFields = props.queryFields || []
  try {
    queryFields = typeof props.queryFields === 'string'
      ? JSON.parse(props.queryFields)
      : props.queryFields
  } catch (e) {
    queryFields = []
  }

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-4xl">
        <h3 className="text-lg font-semibold mb-4 text-center">ViewModel 数据表格</h3>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          {props.showExample ? (
            <div className="space-y-4">
              {/* 配置展示 */}
              <div className="text-sm text-slate-600">
                <p className="font-semibold mb-2">📋 当前配置：</p>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <p><strong>表格ID：</strong><code className="ml-2 px-2 py-1 bg-white rounded text-xs">{props.tableId}</code></p>
                  <p><strong>初始化查询：</strong>{props.initQuery ? '✓ 立即查询' : '✗ 由内部组件查询'}</p>
                  <p><strong>查询字段：</strong>
                    {queryFields.length > 0 ? (
                      <code className="ml-2 px-2 py-1 bg-white rounded text-xs">
                        {Array.isArray(queryFields) ? queryFields.join(', ') : JSON.stringify(queryFields)}
                      </code>
                    ) : (
                      <span className="ml-2 text-slate-500">全部字段</span>
                    )}
                  </p>
                  <p><strong>查询所有字段：</strong>{props.projectAll ? '✓ 是' : '✗ 否'}</p>
                  <p><strong>数据限制：</strong>{props.limit} 条</p>
                  <p><strong>刷新间隔：</strong>{props.interval > 0 ? `${props.interval / 1000} 秒` : '不刷新'}</p>
                  {Object.keys(fieldOrder).length > 0 && (
                    <p><strong>字段排序：</strong>
                      <code className="ml-2 px-2 py-1 bg-white rounded text-xs">
                        {JSON.stringify(fieldOrder)}
                      </code>
                    </p>
                  )}
                  {tableFilters.length > 0 && (
                    <p><strong>筛选条件：</strong>
                      <code className="ml-2 px-2 py-1 bg-white rounded text-xs">
                        {JSON.stringify(tableFilters)}
                      </code>
                    </p>
                  )}
                </div>
              </div>

              {/* 组件预览 */}
              <div>
                <ViewModel
                  tableId={props.tableId}
                  modelName={props.modelName}
                  initQuery={props.initQuery}
                  queryFields={queryFields.length > 0 ? queryFields : undefined}
                  projectAll={props.projectAll}
                  limit={props.limit}
                  tableFilters={tableFilters.length > 0 ? tableFilters : undefined}
                  fieldOrder={Object.keys(fieldOrder).length > 0 ? Object.entries(fieldOrder).map(([k, v]) => ({ [k]: v as 'asc' | 'desc' })) as any : undefined}
                  interval={props.interval}
                >
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>💡 ViewModel 说明</strong>
                      </p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• <strong>tableId</strong>：数据表的唯一标识符</li>
                        <li>• <strong>initQuery</strong>：是否在视图显示时就查询一次数据</li>
                        <li>• <strong>queryFields</strong>：指定要查询的字段，为空则查询所有</li>
                        <li>• <strong>projectAll</strong>：是否查询所有字段（包括嵌套字段）</li>
                        <li>• <strong>limit</strong>：限制返回的数据条数</li>
                        <li>• <strong>tableFilters</strong>：表格筛选条件</li>
                        <li>• <strong>fieldOrder</strong>：字段排序规则</li>
                        <li>• <strong>interval</strong>：数据自动刷新间隔（毫秒）</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>💡 ViewModel Schema</strong>
                      </p>
                      {React.createElement(() => {
                        const { model } = useModel()
                        return <pre>{JSON.stringify(model, null, 2)}</pre>
                      })}
                    </div>
                  </div>
                </ViewModel>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              ViewModel 表格容器（已隐藏示例）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const renderViewModelCodePreview = (props: Record<string, any>) => {
  const initQueryStr = props.initQuery ? `\n  initQuery: true,` : ''

  const queryFieldsStr = props.queryFields && props.queryFields.length > 0
    ? `\n  queryFields: ${JSON.stringify(props.queryFields)},`
    : ''

  const projectAllStr = props.projectAll ? `\n  projectAll: true,` : ''

  const tableFiltersStr = props.tableFilters && props.tableFilters.length > 0
    ? `\n  tableFilters: ${JSON.stringify(props.tableFilters)},`
    : ''

  const fieldOrderStr = props.fieldOrder && Object.keys(props.fieldOrder).length > 0
    ? `\n  fieldOrder: ${JSON.stringify(props.fieldOrder)},`
    : ''

  const intervalStr = props.interval > 0
    ? `\n  interval: ${props.interval},`
    : ''

  return `import { ViewModel } from '@/registry/components/view-model/view-model'

const MyViewModel = () => {
  return (
    <ViewModel
      tableId="${props.tableId}"${initQueryStr}${queryFieldsStr}${projectAllStr}
      limit={${props.limit}}${tableFiltersStr}${fieldOrderStr}${intervalStr}
    >
      {/* 自定义内容 */}
    </ViewModel>
  )
}`
}

export const viewModelConfig: ComponentConfig = {
  id: 'view-model',
  name: 'ViewModel 模型视图容器',
  propsConfig: viewModelPropsConfig,
  defaultProps: viewModelDefaultProps,
  renderPreview: renderViewModelPreview,
  renderCodePreview: renderViewModelCodePreview,
  documentation: documentationMd
}
