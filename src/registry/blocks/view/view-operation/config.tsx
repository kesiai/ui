import ViewModel from '../view-model/view-model'
import React from 'react'
import ViewOperation from './view-operation'
import { ComponentConfig } from '@/app/config/types'

export const viewOperationPropsConfig = [
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
    name: 'operations',
    label: '操作项',
    type: 'array' as const,
    default: ['batch-delete', 'batch-export', 'batch-copy', 'refresh'],
    description: '启用的批量操作（可多选）'
  },
  {
    name: 'variant',
    label: '展示模式',
    type: 'select' as const,
    default: 'toolbar',
    options: [
      { value: 'toolbar', label: '工具栏' },
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

export const viewOperationDefaultProps = {
  modelName: null,
  tableId: 'user',
  operations: ['batch-delete', 'batch-export', 'batch-copy', 'refresh'],
  variant: 'toolbar',
  disabled: false,
  showExample: true
}

const renderViewOperationPreview = (props: Record<string, any>) => {
  const variantMap: Record<string, string> = {
    toolbar: '工具栏',
    dropdown: '下拉菜单'
  }

  // 模拟选中的ID
  const mockSelectedIds = ['1', '2', '3']

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-4xl">
        <h3 className="text-lg font-semibold mb-4 text-center">ViewOperation 批量操作组件</h3>
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
                    <p><strong>展示模式：</strong>{variantMap[props.variant] || props.variant}</p>
                    <p><strong>禁用：</strong>{props.disabled ? '✓ 是' : '✗ 否'}</p>
                  </div>
                  <p><strong>操作项：</strong>
                    <code className="ml-2 px-2 py-1 bg-white rounded text-xs">
                      {Array.isArray(props.operations) ? props.operations.join(', ') : 'batch-delete, batch-export, batch-copy, refresh'}
                    </code>
                  </p>
                </div>
              </div>

              {/* 功能说明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>💡 ViewOperation 说明</strong>
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>batch-delete</strong>：批量删除（需确认）</li>
                  <li>• <strong>batch-export</strong>：批量导出数据</li>
                  <li>• <strong>batch-copy</strong>：批量复制数据</li>
                  <li>• <strong>refresh</strong>：刷新数据列表</li>
                  <li>• 使用 useModelList、useModelDelete、useModelSave hooks</li>
                  <li>• 支持全选/取消全选功能</li>
                  <li>• 工具栏模式显示选择状态</li>
                  <li>• 危险操作需要二次确认</li>
                </ul>
              </div>

              {/* 组件预览 */}
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600 mb-4">组件预览：</p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <ViewModel tableId={props.tableId} modelName={props.modelName}>
                    <ViewOperation
                      modelId={props.tableId}
                      operations={props.operations}
                      variant={props.variant}
                      selectedIds={mockSelectedIds}
                      onSelectionChange={() => console.log('选择变化')}
                      onOperationComplete={(op, result) => console.log('操作完成:', op, result)}
                    />
                  </ViewModel>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              ViewOperation 批量操作组件（已隐藏示例）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const renderViewOperationCodePreview = (props: Record<string, any>) => {
  const operationsStr = JSON.stringify(props.operations || ['batch-delete', 'batch-export', 'batch-copy', 'refresh'])

  return `import { ViewOperation } from '@/registry/blocks/view/view-operation/view-operation'

const MyOperations = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids)
  }

  const handleOperationComplete = (operation: string, result: any) => {
    console.log(\`操作 \${operation} 完成:\`, result)
    // 刷新数据或更新状态
  }

  return (
                    <ViewOperation
      modelId="${props.tableId}"
      operations={${operationsStr}}
      variant="${props.variant}"
      selectedIds={selectedIds}
      onSelectionChange={handleSelectionChange}
      onOperationComplete={handleOperationComplete}
    />
  )
}`
}

export const viewOperationConfig: ComponentConfig = {
  id: 'view-operation',
  name: 'ViewOperation 批量操作组件',
  propsConfig: viewOperationPropsConfig,
  defaultProps: viewOperationDefaultProps,
  renderPreview: renderViewOperationPreview,
  renderCodePreview: renderViewOperationCodePreview
}
