import { ViewModel } from '../view-model/view-model'
import React from 'react'
import { BatchActions } from './view-batch'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './view-batch.md?raw'

export const viewBatchOperationPropsConfig = [
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
    name: 'actions',
    label: '操作项',
    type: 'array' as const,
    default: ['batch-delete', 'batch-change'],
    options: [
      { value: 'batch-delete', label: '批量删除' },
      { value: 'batch-change', label: '批量修改' }
    ],
    description: '启用的批量操作（可多选）'
  },
  {
    name: 'variant',
    label: '显示形式',
    type: 'select' as const,
    default: 'dropdown',
    options: [
      { value: 'buttons', label: '按钮组' },
      { value: 'dropdown', label: '下拉菜单' }
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

export const viewBatchOperationDefaultProps = {
  modelName: null,
  tableId: 'device',
  actions: ['batch-delete', 'batch-change'],
  variant: 'dropdown',
  disabled: false,
  showExample: true
}

const renderViewBatchOperationPreview = (props: Record<string, any>) => {
  const variantMap: Record<string, string> = {
    buttons: '按钮组',
    dropdown: '下拉菜单'
  }

  const actionMap: Record<string, string> = {
    'batch-delete': '批量删除',
    'batch-change': '批量修改'
  }

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-3xl">
        <h3 className="text-lg font-semibold mb-4 text-center">BatchActions 批量操作组件</h3>
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
                    <p><strong>显示形式：</strong>{variantMap[props.variant] || props.variant}</p>
                    <p><strong>禁用：</strong>{props.disabled ? '✓ 是' : '✗ 否'}</p>
                  </div>
                  <p><strong>操作项：</strong>
                    <code className="ml-2 px-2 py-1 bg-white rounded text-xs">
                      {Array.isArray(props.actions) && props.actions.length > 0
                        ? props.actions.map((action: string) => actionMap[action] || action).join(', ')
                        : 'batch-delete, batch-change'}
                    </code>
                  </p>
                </div>
              </div>

              {/* 功能说明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>💡 BatchActions 说明</strong>
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>2个批量操作</strong>：BatchDeleteAction、BatchChangeAction</li>
                  <li>• <strong>BatchDeleteAction</strong>：批量删除选中数据，需要确认</li>
                  <li>• <strong>BatchChangeAction</strong>：批量修改选中数据，使用 SchemaForm 表单</li>
                  <li>• <strong>事件内部处理</strong>：所有操作事件都在组件内部处理</li>
                  <li>• <strong>自动获取选中项</strong>：使用 useModelSelect hook 获取选中数据</li>
                  <li>• <strong>自动刷新</strong>：操作成功后自动刷新列表数据</li>
                  <li>• <strong>两种显示形式</strong>：buttons（按钮组）和dropdown（下拉菜单）</li>
                </ul>
              </div>

              {/* 组件预览 */}
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600 mb-4">组件预览：</p>
                <div className="bg-slate-50 rounded-lg p-6 flex items-center justify-center">
                  <ViewModel tableId={props.tableId} modelName={props.modelName}>
                    <BatchActions
                      actions={props.actions}
                      variant={props.variant}
                      disabled={props.disabled}
                    />
                  </ViewModel>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              BatchActions 批量操作组件（已隐藏示例）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const renderViewBatchOperationCodePreview = (props: Record<string, any>) => {
  const actionsStr = JSON.stringify(props.actions || ['batch-delete', 'batch-change'])

  return `import { BatchActions } from '@/registry/components/view-batch/view-batch'
import { BatchDeleteAction, BatchChangeAction } from '@/registry/components/view-batch/view-batch'

const MyBatchOperation = () => {
  // 使用 BatchActions 容器组件（推荐）
  return (
    <BatchActions
      actions={${actionsStr}}
      variant="${props.variant}"
    />
  )

  // 或者单独使用各个 Action 组件
  // return (
  //   <div className="flex items-center gap-2">
  //     <BatchDeleteAction />
  //     <BatchChangeAction />
  //   </div>
  // )
}`
}

export const viewBatchOperationConfig: ComponentConfig = {
  id: 'view-batch',
  name: 'BatchActions 批量操作组件',
  propsConfig: viewBatchOperationPropsConfig,
  defaultProps: viewBatchOperationDefaultProps,
  renderPreview: renderViewBatchOperationPreview,
  renderCodePreview: renderViewBatchOperationCodePreview,
  documentation: documentationMd
}
