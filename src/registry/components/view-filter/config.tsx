import ViewModel from '@/registry/components/view-model/view-model'
import React from 'react'
import ViewFilter from './view-filter'
import { ComponentConfig } from '@/app/config/types'
import { layoutPresets } from '@/registry/components/form/config'

export const viewFilterPropsConfig = [
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
    name: 'filters',
    label: '筛选字段',
    type: 'json' as const,
    default: '[]',
    description: '筛选字段配置（JSON 数组格式）'
  },
  {
    name: 'layout',
    label: '布局样式',
    type: 'select' as const,
    default: 'default',
    options: Object.keys(layoutPresets).map(key => ({
      value: key,
      label: layoutPresets[key].name
    })),
    description: '选择表单的布局样式'
  },
  {
    name: 'classNames',
    label: '自定义样式类',
    type: 'json' as const,
    default: JSON.stringify(layoutPresets.default, null, 2),
    description: '自定义表单各元素的 className (JSON格式)'
  },
  {
    name: 'showExample',
    label: '显示示例',
    type: 'boolean' as const,
    default: true,
    description: '是否在预览中显示示例'
  }
]

export const viewFilterDefaultProps = {
  modelName: null,
  tableId: 'user',
  filters: [],
  layout: 'default' as keyof typeof layoutPresets,
  classNames: null,
  showExample: true
}

const renderViewFilterPreview = (props: Record<string, any>) => {
  // 解析 filters
  let filters = props.filters || []

  try {
    filters = typeof props.filters === 'string'
      ? JSON.parse(props.filters)
      : props.filters
  } catch (e) {
  }

  // 根据 layout 选择对应的预设样式
  const layoutStyles = layoutPresets[props.layout] || layoutPresets.default
  const classNames = props.classNames ||
  {
    group: layoutStyles.container,
    field: layoutStyles.field,
    label: layoutStyles.label,
    input: layoutStyles.input,
    description: layoutStyles.descriptionClass,
    error: layoutStyles.error
  }  

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-4xl">
        <h3 className="text-lg font-semibold mb-4 text-center">ViewFilter 筛选组件</h3>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          {props.showExample ? (
            <div className="space-y-6">
              {/* 配置展示 */}
              <div className="text-sm text-slate-600">
                <p className="font-semibold mb-2">📋 当前配置：</p>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <p><strong>筛选字段：</strong>
                    <code className="ml-2 px-2 py-1 bg-white rounded text-xs">
                      {filters.map((f: any) => f?.name || f).join(', ') || '未配置'}
                    </code>
                  </p>
                </div>
              </div>

              {/* 组件预览 */}
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600 mb-4">筛选组件预览：</p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <ViewModel tableId={props.tableId} modelName={props.modelName}>
                    <ViewFilter
                      filters={filters}
                      classNames={classNames}
                    />
                  </ViewModel>
                </div>
              </div>

              {/* 功能说明 */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>💡 ViewFilter 说明</strong>
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• <strong>fields</strong>：配置筛选字段及其类型</li>
                    <li>• 支持 text、number、select、date 等字段类型</li>
                    <li>• <strong>inline</strong>：横向排列筛选条件</li>
                    <li>• <strong>collapsible</strong>：可折叠的筛选面板</li>
                    <li>• 使用 useModelQuery hook 进行数据筛选</li>
                    <li>• 支持激活条件的标签展示和移除</li>
                    <li>• 提供查询和重置按钮</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              ViewFilter 筛选组件（已隐藏示例）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const renderViewFilterCodePreview = (props: Record<string, any>) => {
  const fieldsStr = JSON.stringify(props.fields || [], null, 2)

  return `import { ViewFilter } from '@/registry/components/view-filter/view-filter'

const MyFilter = () => {
  const fields = ${fieldsStr}

  return (
                    <ViewFilter
      fields={fields}
      inline={${props.inline}}
      collapsible={${props.collapsible}}
    />
  )
}`
}

export const viewFilterConfig: ComponentConfig = {
  id: 'view-filter',
  name: 'ViewFilter 筛选组件',
  propsConfig: viewFilterPropsConfig,
  defaultProps: viewFilterDefaultProps,
  renderPreview: renderViewFilterPreview,
  renderCodePreview: renderViewFilterCodePreview
}
