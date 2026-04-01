import { ViewModel } from '../view-model/view-model'
import React from 'react'
import { Actions } from './view-actions'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './view-actions.md?raw'

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
    default: "692004b03b11710131077e40",
    description: '要操作的数据ID（view/edit/delete/export/copy 需要）'
  },
  {
    name: 'actions',
    label: '操作项',
    type: 'array' as const,
    default: ['create', 'view', 'edit', 'delete', 'export', 'copy'],
    options: [
      { value: 'create', label: '新建' },
      { value: 'view', label: '查看' },
      { value: 'edit', label: '编辑' },
      { value: 'delete', label: '删除' },
      { value: 'export', label: '导出' },
      { value: 'copy', label: '复制' }
    ],
    description: '启用的操作（可多选）'
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
    name: 'showExample',
    label: '显示示例',
    type: 'boolean' as const,
    default: true,
    description: '是否在预览中显示示例'
  }
]

export const viewActionsDefaultProps = {
  modelName: null,
  tableId: 'task_def',
  itemId: "692004b03b11710131077e40",
  actions: ['create', 'view', 'edit', 'delete', 'export', 'copy'],
  variant: 'dropdown',
  showExample: true
}

const renderViewActionsPreview = (props: Record<string, any>) => {
  const variantMap: Record<string, string> = {
    buttons: '按钮组',
    dropdown: '下拉菜单'
  }

  const actionMap: Record<string, string> = {
    create: '新建',
    view: '查看',
    edit: '编辑',
    delete: '删除',
    export: '导出',
    copy: '复制'
  }

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-3xl">
        <h3 className="text-lg font-semibold mb-4 text-center">ViewActions 操作组件集合</h3>
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
                  </div>
                  <p><strong>数据ID：</strong><code className="ml-2 px-2 py-1 bg-white rounded text-xs">{props.itemId || '-'}</code></p>
                  <p><strong>操作项：</strong>
                    <code className="ml-2 px-2 py-1 bg-white rounded text-xs">
                      {Array.isArray(props.actions) && props.actions.length > 0
                        ? props.actions.map((action: string) => actionMap[action] || action).join(', ')
                        : 'view, edit'}
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
                  <li>• <strong>6个独立Action组件</strong>：CreateAction、ViewAction、EditAction、DeleteAction、ExportAction、CopyAction</li>
                  <li>• <strong>CreateAction</strong>：新建数据，需要 modelId 参数，不加载现有数据</li>
                  <li>• <strong>事件内部处理</strong>：所有操作事件都在组件内部处理，无需回调函数</li>
                  <li>• <strong>Dialog交互</strong>：Create、View、Edit、Export、Copy使用弹窗，Delete使用确认弹窗</li>
                  <li>• <strong>两种显示形式</strong>：buttons（按钮组）和dropdown（下拉菜单）</li>
                  <li>• <strong>灵活配置</strong>：可自定义启用的操作项</li>
                  <li>• <strong>自动刷新</strong>：Edit 和 Create 操作成功后自动刷新列表数据</li>
                </ul>
              </div>

              {/* 组件预览 */}
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600 mb-4">组件预览：</p>
                <div className="bg-slate-50 rounded-lg p-6 flex items-center justify-center">
                  <ViewModel tableId={props.tableId} modelName={props.modelName}>
                    <Actions
                      modelId={props.tableId}
                      itemId={props.itemId}
                      actions={props.actions}
                      variant={props.variant}
                    />
                  </ViewModel>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              ViewActions 操作组件集合（已隐藏示例）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const renderViewActionsCodePreview = (props: Record<string, any>) => {
  const actionsStr = JSON.stringify(props.actions || ['view', 'edit'])

  return `import { Actions } from '@/registry/components/view-actions/view-actions'
import { CreateAction, ViewAction, EditAction, DeleteAction, ExportAction, CopyAction } from '@/registry/components/view-actions/view-actions'

const MyActions = ({ itemId, modelId }: { itemId?: string, modelId: string }) => {
  // 使用 Actions 容器组件（推荐）
  return (
    <Actions
      modelId={modelId}
      itemId={itemId}
      actions={${actionsStr}}
      variant="${props.variant}"
    />
  )

  // 或者单独使用各个 Action 组件
  // return (
  //   <div className="flex items-center gap-2">
  //     <CreateAction modelId={modelId} />
  //     {itemId && (
  //       <>
  //         <ViewAction itemId={itemId} />
  //         <EditAction itemId={itemId} />
  //         <DeleteAction itemId={itemId} />
  //         <ExportAction itemId={itemId} />
  //         <CopyAction itemId={itemId} />
  //       </>
  //     )}
  //   </div>
  // )
}`
}

export const viewActionsConfig: ComponentConfig = {
  id: 'view-actions',
  name: '操作集合',
  propsConfig: viewActionsPropsConfig,
  defaultProps: viewActionsDefaultProps,
  renderPreview: renderViewActionsPreview,
  renderCodePreview: renderViewActionsCodePreview,
  documentation: documentationMd
}
