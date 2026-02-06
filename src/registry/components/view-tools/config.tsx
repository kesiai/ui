import ViewModel from '../view-model/view-model'
import React from 'react'
import Tools from './view-tools'
import { ComponentConfig } from '@/app/config/types'

export const viewToolsPropsConfig = [
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
    name: 'tools',
    label: '工具项',
    type: 'array' as const,
    default: ['count', 'pageSize', 'columns'],
    options: [
      { value: 'count', label: '记录数' },
      { value: 'pageSize', label: '每页条数' },
      { value: 'columns', label: '列显示' }
    ],
    description: '启用的工具（可多选）'
  },
  {
    name: 'showExample',
    label: '显示示例',
    type: 'boolean' as const,
    default: true,
    description: '是否在预览中显示示例'
  }
]

export const viewToolsDefaultProps = {
  modelName: null,
  tableId: 'task_def',
  tools: ['count', 'pageSize', 'columns'],
  showExample: true
}

const renderViewToolsPreview = (props: Record<string, any>) => {
  const toolMap: Record<string, string> = {
    count: '记录数',
    pageSize: '每页条数',
    columns: '列显示'
  }

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-3xl">
        <h3 className="text-lg font-semibold mb-4 text-center">ViewTools 工具组件集合</h3>
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
                  </div>
                  <p><strong>工具项：</strong>
                    <code className="ml-2 px-2 py-1 bg-white rounded text-xs">
                      {Array.isArray(props.tools) && props.tools.length > 0
                        ? props.tools.map((tool: string) => toolMap[tool] || tool).join(', ')
                        : 'count, pageSize, columns'}
                    </code>
                  </p>
                </div>
              </div>

              {/* 功能说明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>💡 ViewTools 说明</strong>
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>3个独立Tool组件</strong>：CountTool、PageSizeTool、ColumnsTool</li>
                  <li>• <strong>CountTool</strong>：显示当前数据的总记录数</li>
                  <li>• <strong>PageSizeTool</strong>：设置每页显示的条数，支持预设选项和自定义输入</li>
                  <li>• <strong>ColumnsTool</strong>：控制表格列的显示与隐藏，通过复选框切换</li>
                  <li>• <strong>灵活配置</strong>：可自定义启用的工具项</li>
                  <li>• <strong>响应式布局</strong>：列显示工具会根据字段数量自动调整布局</li>
                </ul>
              </div>

              {/* 组件预览 */}
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600 mb-4">组件预览：</p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <ViewModel tableId={props.tableId} modelName={props.modelName}>
                    <Tools tools={props.tools} />
                  </ViewModel>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              ViewTools 工具组件集合（已隐藏示例）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const renderViewToolsCodePreview = (props: Record<string, any>) => {
  const toolsStr = JSON.stringify(props.tools || ['count', 'pageSize', 'columns'])

  return `import { Tools } from '@/registry/components/view-tools/view-tools'
import { CountTool, PageSizeTool, ColumnsTool } from '@/registry/components/view-tools/view-tools'

const MyTools = () => {
  // 使用 Tools 容器组件（推荐）
  return (
    <Tools
      tools={${toolsStr}}
    />
  )

  // 或者单独使用各个 Tool 组件
  // return (
  //   <div className="flex items-center gap-2">
  //     <CountTool />
  //     <PageSizeTool />
  //     <ColumnsTool />
  //   </div>
  // )
}`
}

export const viewToolsConfig: ComponentConfig = {
  id: 'view-tools',
  name: 'ViewTools 工具组件集合',
  propsConfig: viewToolsPropsConfig,
  defaultProps: viewToolsDefaultProps,
  renderPreview: renderViewToolsPreview,
  renderCodePreview: renderViewToolsCodePreview
}
