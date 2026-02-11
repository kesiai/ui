import ViewModel from '../view-model/view-model'
import React from 'react'
import ViewDataTableAggregate from './view-data-aggregate'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './view-data-aggregate.md?raw'

export const viewDataAggregatePropsConfig = [
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
    default: 'device',
    description: '数据表格的唯一标识符'
  },
  {
    name: 'aggregateTypes',
    label: '聚合类型',
    type: 'array' as const,
    default: ['count', 'sum', 'avg'],
    description: '启用的聚合类型（count/sum/avg/min/max）'
  },
  {
    name: 'groupBy',
    label: '分组字段',
    type: 'text' as const,
    default: '',
    description: '分组统计的字段名，为空则不分组'
  },
  {
    name: 'showChange',
    label: '显示变化',
    type: 'boolean' as const,
    default: true,
    description: '是否显示数值变化趋势'
  },
  {
    name: 'showChart',
    label: '显示图表',
    type: 'boolean' as const,
    default: false,
    description: '是否显示图表可视化'
  },
  {
    name: 'layout',
    label: '布局方式',
    type: 'select' as const,
    default: 'grid',
    options: [
      { value: 'grid', label: '网格' },
      { value: 'list', label: '列表' },
      { value: 'compact', label: '紧凑' }
    ],
    description: '统计卡片的布局方式'
  },
  {
    name: 'refreshInterval',
    label: '刷新间隔',
    type: 'number' as const,
    default: 0,
    min: 0,
    max: 60000,
    step: 1000,
    description: '自动刷新间隔（毫秒），0 表示不刷新'
  },
  {
    name: 'showExample',
    label: '显示示例',
    type: 'boolean' as const,
    default: true,
    description: '是否在预览中显示示例'
  }
]

export const viewDataAggregateDefaultProps = {
  modelName: null,
  tableId: 'device',
  aggregateTypes: ['count', 'sum', 'avg'],
  groupBy: '',
  showChange: true,
  showChart: false,
  layout: 'grid',
  refreshInterval: 0,
  showExample: true
}

const renderViewDataAggregatePreview = (props: Record<string, any>) => {
  const mockFields = [
    { name: 'temperature', label: '温度', type: 'number' as const },
    { name: 'humidity', label: '湿度', type: 'number' as const },
    { name: 'status', label: '状态', type: 'string' as const },
    { name: 'energy', label: '能耗', type: 'number' as const }
  ]

  const layoutMap: Record<string, string> = {
    grid: '网格',
    list: '列表',
    compact: '紧凑'
  }

  const typeMap: Record<string, string> = {
    count: '计数',
    sum: '总和',
    avg: '平均',
    min: '最小值',
    max: '最大值'
  }

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-5xl">
        <h3 className="text-lg font-semibold mb-4 text-center">ViewDataAggregate 数据统计组件</h3>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          {props.showExample ? (
            <div className="space-y-6">
              {/* 配置展示 */}
              <div className="text-sm text-slate-600">
                <p className="font-semibold mb-2">📋 当前配置：</p>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex gap-6">
                    <p><strong>表格ID：</strong><code className="ml-2 px-2 py-1 bg-white rounded text-xs">{props.tableId}</code></p>
                    <p><strong>模型名称：</strong><code className="ml-2 px-2 py-1 bg-white rounded text-xs">{props.modelName || '-'}</code></p>
                    <p><strong>布局方式：</strong>{layoutMap[props.layout] || props.layout}</p>
                    <p><strong>分组字段：</strong>{props.groupBy || '无'}</p>
                  </div>
                  <div className="flex gap-6">
                    <p><strong>显示变化：</strong>{props.showChange ? '✓ 是' : '✗ 否'}</p>
                    <p><strong>显示图表：</strong>{props.showChart ? '✓ 是' : '✗ 否'}</p>
                    <p><strong>刷新间隔：</strong>{props.refreshInterval > 0 ? `${props.refreshInterval / 1000} 秒` : '不刷新'}</p>
                  </div>
                  <p><strong>聚合类型：</strong>
                    <code className="ml-2 px-2 py-1 bg-white rounded text-xs">
                      {Array.isArray(props.aggregateTypes) && props.aggregateTypes.length > 0
                        ? props.aggregateTypes.map((t: string) => typeMap[t] || t).join(', ')
                        : 'count, sum, avg'}
                    </code>
                  </p>
                </div>
              </div>

              {/* 功能说明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>💡 ViewDataAggregate 说明</strong>
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>多种聚合</strong>：支持计数、总和、平均、最小、最大等聚合类型</li>
                  <li>• <strong>分组统计</strong>：支持按字段分组统计</li>
                  <li>• <strong>灵活布局</strong>：网格、列表、紧凑三种布局方式</li>
                  <li>• <strong>自动刷新</strong>：支持定时自动刷新统计数据</li>
                  <li>• <strong>交互点击</strong>：支持点击卡片触发回调</li>
                  <li>• 使用 useModelList、useModelGetItems hooks</li>
                  <li>• 支持多种数据类型（数值、字符串、日期）</li>
                  <li>• 实时计算和格式化显示</li>
                </ul>
              </div>

              {/* 组件预览 */}
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600 mb-4">组件预览：</p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <ViewModel tableId={props.tableId} modelName={props.modelName}>
                    <ViewDataTableAggregate
                      modelId={props.tableId}
                      fields={mockFields}
                      aggregateTypes={props.aggregateTypes}
                      groupBy={props.groupBy || undefined}
                      showChange={props.showChange}
                      showChart={props.showChart}
                      layout={props.layout}
                      refreshInterval={props.refreshInterval}
                      onRefresh={() => console.log('刷新统计')}
                    />
                  </ViewModel>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              ViewDataAggregate 数据统计组件（已隐藏示例）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const renderViewDataAggregateCodePreview = (props: Record<string, any>) => {
  const aggregateTypesStr = JSON.stringify(props.aggregateTypes || ['count', 'sum', 'avg'])

  return `import { ViewDataAggregate } from '@/registry/components/view-data-aggregate/view-data-aggregate'

const MyDataAggregate = () => {
  const fields = [
    { name: 'temperature', label: '温度', type: 'number' as const },
    { name: 'humidity', label: '湿度', type: 'number' as const },
    { name: 'status', label: '状态', type: 'string' as const }
  ]

  const handleFieldClick = (field: string, value: any) => {
    console.log(\`字段 \${field} 被点击，值: \${value}\`)
  }

  const handleRefresh = () => {
    console.log('刷新统计数据')
  }

  return (
                    <ViewDataAggregate
      modelId="${props.tableId}"
      fields={fields}
      aggregateTypes={${aggregateTypesStr}}
      layout="${props.layout}"
      showChange={${props.showChange}}
      showChart={${props.showChart}}
      refreshInterval={${props.refreshInterval}}
      onRefresh={handleRefresh}
      onFieldClick={handleFieldClick}
    />
  )
}`
}

export const viewDataAggregateConfig: ComponentConfig = {
  id: 'view-data-aggregate',
  name: 'ViewDataAggregate 数据统计组件',
  propsConfig: viewDataAggregatePropsConfig,
  defaultProps: viewDataAggregateDefaultProps,
  renderPreview: renderViewDataAggregatePreview,
  renderCodePreview: renderViewDataAggregateCodePreview,
  documentation: documentationMd
}
