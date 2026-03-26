import React from 'react'
import { ViewAdvancedFilter } from './view-advanced-filter'
import { ViewModel } from '../view-model/view-model'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './view-advanced-filter.md?raw'

export const viewAdvancedFilterPropsConfig = [
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
    default: 'user',
    description: '数据表格的唯一标识符'
  },
  {
    name: 'title',
    label: '按钮文字',
    type: 'text' as const,
    default: '高级筛选',
    description: '按钮文字'
  }
]

export const viewAdvancedFilterDefaultProps = {
  modelName: null,
  tableId: 'product',
  title: '高级筛选'
}

const renderViewAdvancedFilterPreview = (props: Record<string, any>) => {

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-4xl">
        <h3 className="text-lg font-semibold mb-4 text-center">ViewAdvancedFilter 高级筛选组件</h3>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="space-y-6">
            {/* 配置展示 */}
            <div className="text-sm text-slate-600">
              <p className="font-semibold mb-2">📋 当前配置：</p>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex gap-6">
                  <p><strong>表格ID：</strong><code className="ml-2 px-2 py-1 bg-white rounded text-xs">{props.tableId}</code></p>
                  <p><strong>模型名称：</strong><code className="ml-2 px-2 py-1 bg-white rounded text-xs">{props.modelName || '-'}</code></p>
                  <p><strong>按钮文字：</strong><code className="ml-2 px-2 py-1 bg-white rounded text-xs">{props.title}</code></p>
                </div>
              </div>
            </div>

            {/* 功能说明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>💡 ViewAdvancedFilter 说明</strong>
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• <strong>多条件组合</strong>：支持多个筛选规则的 AND/OR 逻辑组合</li>
                <li>• <strong>多种字段类型</strong>：支持文本、数字、选择、日期、日期范围</li>
                <li>• <strong>丰富操作符</strong>：包含、不包含、等于、大于、小于、介于等</li>
                <li>• <strong>动态规则</strong>：可动态添加/删除筛选规则</li>
                <li>• <strong>折叠功能</strong>：支持折叠以节省空间</li>
                <li>• <strong>规则计数</strong>：实时显示当前规则数量</li>
                <li>• 使用 useModelQuery hook 进行数据筛选</li>
                <li>• 可从模型自动加载字段定义</li>
              </ul>
            </div>

            {/* 组件预览 */}
            <div className="border-t border-slate-200 pt-6">
              <p className="text-sm text-slate-600 mb-4">组件预览：</p>
              <div className="bg-slate-50 rounded-lg p-6">
                <ViewModel tableId={props.tableId} modelName={props.modelName}>
                  <ViewAdvancedFilter title={props.title} />
                </ViewModel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const renderViewAdvancedFilterCodePreview = (props: Record<string, any>) => {
  return `import { ViewAdvancedFilter } from '@/registry/components/view-advanced-filter/view-advanced-filter'

const MyAdvancedFilter = () => {
  const handleFilterChange = (rules: any[], logicOperator: 'AND' | 'OR') => {
    console.log('筛选规则:', rules)
    console.log('逻辑操作符:', logicOperator)
  }

  const fields = [
    { name: 'name', label: '姓名', type: 'text' as const },
    { name: 'status', label: '状态', type: 'select' as const, options: [
      { value: 'active', label: '激活' },
      { value: 'inactive', label: '未激活' }
    ]},
    { name: 'age', label: '年龄', type: 'number' as const },
    { name: 'createTime', label: '创建时间', type: 'date' as const }
  ]

  return (
    <ViewAdvancedFilter
      modelId="${props.tableId}"
      fields={fields}
      maxRules={${props.maxRules}}
      collapsible={${props.collapsible}}
      defaultCollapsed={${props.defaultCollapsed}}
      showFieldSelector={${props.showFieldSelector}}
      onFilterChange={handleFilterChange}
    />
  )
}`
}

export const viewAdvancedFilterConfig: ComponentConfig = {
  id: 'view-advanced-filter',
  name: 'ViewAdvancedFilter 高级筛选组件',
  propsConfig: viewAdvancedFilterPropsConfig,
  defaultProps: viewAdvancedFilterDefaultProps,
  renderPreview: renderViewAdvancedFilterPreview,
  renderCodePreview: renderViewAdvancedFilterCodePreview,
  documentation: documentationMd
}
