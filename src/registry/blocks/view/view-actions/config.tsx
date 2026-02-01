import ViewModel from '../view-model/view-model'
import React from 'react'
import ViewActions from './view-actions'
import { ComponentConfig } from '@/app/config/types'

export const viewActionsPropsConfig = [
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
    name: 'itemId',
    label: '数据ID',
    type: 'text' as const,
    default: '1',
    description: '要操作的数据ID'
  },
  {
    name: 'actions',
    label: '操作项',
    type: 'array' as const,
    default: ['view', 'edit', 'delete'],
    description: '启用的操作（可多选）'
  },
  {
    name: 'triggerVariant',
    label: '触发器类型',
    type: 'select' as const,
    default: 'dropdown',
    options: [
      { value: 'dropdown', label: '下拉菜单' },
      { value: 'button', label: '按钮组' }
    ],
    description: '操作按钮的展示方式'
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false,
    description: '是否禁用所有操作'
  },
  {
    name: 'showExample',
    label: '显示示例',
    type: 'boolean' as const,
    default: true,
    description: '是否在预览中显示示例'
  }
]

export const viewActionsDefaultProps = {
  modelName: null,
  tableId: 'user',
  itemId: '1',
  actions: ['view', 'edit', 'delete'],
  triggerVariant: 'dropdown',
  disabled: false,
  showExample: true
}

const renderViewActionsPreview = (props: Record<string, any>) => {
  const triggerVariantMap: Record<string, string> = {
    dropdown: '下拉菜单',
    button: '按钮组'
  }

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-3xl">
        <h3 className="text-lg font-semibold mb-4 text-center">ViewActions 操作组件</h3>
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
                    <p><strong>数据ID：</strong><code className="ml-2 px-2 py-1 bg-white rounded text-xs">{props.itemId}</code></p>
                    <p><strong>触发器类型：</strong>{triggerVariantMap[props.triggerVariant] || props.triggerVariant}</p>
                    <p><strong>禁用：</strong>{props.disabled ? '✓ 是' : '✗ 否'}</p>
                  </div>
                  <p><strong>操作项：</strong>
                    <code className="ml-2 px-2 py-1 bg-white rounded text-xs">
                      {Array.isArray(props.actions) ? props.actions.join(', ') : 'view, edit, delete'}
                    </code>
                  </p>
                </div>
              </div>

              {/* 功能说明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>💡 ViewActions 说明</strong>
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>view</strong>：查看详情</li>
                  <li>• <strong>edit</strong>：编辑数据（需要权限）</li>
                  <li>• <strong>delete</strong>：删除数据（需要权限）</li>
                  <li>• <strong>export</strong>：导出数据</li>
                  <li>• <strong>copy</strong>：复制数据</li>
                  <li>• 使用 useModelPermission 检查权限</li>
                  <li>• 支持下拉菜单和按钮组两种展示方式</li>
                  <li>• 支持自定义操作项</li>
                </ul>
              </div>

              {/* 组件预览 */}
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600 mb-4">组件预览：</p>
                <div className="bg-slate-50 rounded-lg p-6 flex items-center justify-center">
                  <ViewModel tableId={props.tableId} modelName={props.modelName}>
                    <ViewActions
                      modelId={props.tableId}
                      itemId={props.itemId}
                      actions={props.actions}
                      triggerVariant={props.triggerVariant}
                      disabled={props.disabled}
                    />
                  </ViewModel>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              ViewActions 操作组件（已隐藏示例）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const renderViewActionsCodePreview = (props: Record<string, any>) => {
  const actionsStr = JSON.stringify(props.actions || ['view', 'edit', 'delete'])

  return `import { ViewActions } from '@/registry/blocks/view/view-actions/view-actions'

const MyActions = ({ itemId }: { itemId: string }) => {
  const handleAction = (action: string, id: string) => {
    console.log(\`操作: \${action}, 数据ID: \${id}\`)
  }

  return (
                    <ViewActions
      modelId="${props.tableId}"
      itemId={itemId}
      actions={${actionsStr}}
      triggerVariant="${props.triggerVariant}"
      onAction={handleAction}
    />
  )
}`
}

export const viewActionsConfig: ComponentConfig = {
  id: 'view-actions',
  name: 'ViewActions 操作组件',
  propsConfig: viewActionsPropsConfig,
  defaultProps: viewActionsDefaultProps,
  renderPreview: renderViewActionsPreview,
  renderCodePreview: renderViewActionsCodePreview
}
