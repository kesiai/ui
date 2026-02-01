import ViewModel from '../view-model/view-model'
import React from 'react'
import ViewBatchOperation from './view-batch-operation'
import { ComponentConfig } from '@/app/config/types'

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
    name: 'operations',
    label: '操作项',
    type: 'array' as const,
    default: ['batch-delete', 'batch-export', 'batch-copy'],
    description: '启用的批量操作（可多选）'
  },
  {
    name: 'selectedCount',
    label: '选中数量',
    type: 'number' as const,
    default: 3,
    min: 0,
    max: 100,
    step: 1,
    description: '模拟选中的数据数量（用于预览）'
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
    name: 'showProgress',
    label: '显示进度',
    type: 'boolean' as const,
    default: true,
    description: '是否显示操作进度条'
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
  operations: ['batch-delete', 'batch-export', 'batch-copy'],
  selectedCount: 3,
  variant: 'toolbar',
  showProgress: true,
  disabled: false,
  showExample: true
}

const renderViewBatchOperationPreview = (props: Record<string, any>) => {
  const mockSelectedIds = Array.from({ length: props.selectedCount }, (_, i) => String(i + 1))

  const variantMap: Record<string, string> = {
    toolbar: '工具栏',
    dropdown: '下拉菜单'
  }

  const operationMap: Record<string, string> = {
    'batch-delete': '批量删除',
    'batch-export': '批量导出',
    'batch-copy': '批量复制',
    'batch-move': '批量移动',
    'batch-update': '批量更新'
  }

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-4xl">
        <h3 className="text-lg font-semibold mb-4 text-center">ViewBatchOperation 高级批量操作组件</h3>
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
                    <p><strong>显示进度：</strong>{props.showProgress ? '✓ 是' : '✗ 否'}</p>
                    <p><strong>禁用：</strong>{props.disabled ? '✓ 是' : '✗ 否'}</p>
                  </div>
                  <p><strong>操作项：</strong>
                    <code className="ml-2 px-2 py-1 bg-white rounded text-xs">
                      {Array.isArray(props.operations) && props.operations.length > 0
                        ? props.operations.map((op: string) => operationMap[op] || op).join(', ')
                        : 'batch-delete, batch-export, batch-copy'}
                    </code>
                  </p>
                  <p><strong>选中数量：</strong>{props.selectedCount} 条</p>
                </div>
              </div>

              {/* 功能说明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>💡 ViewBatchOperation 说明</strong>
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>batch-delete</strong>：批量删除数据（需确认）</li>
                  <li>• <strong>batch-export</strong>：批量导出数据（支持格式选择）</li>
                  <li>• <strong>batch-copy</strong>：批量复制数据（可设置名称后缀）</li>
                  <li>• <strong>batch-move</strong>：批量移动数据到目标位置</li>
                  <li>• <strong>batch-update</strong>：批量更新字段值</li>
                  <li>• <strong>参数配置</strong>：支持自定义操作参数</li>
                  <li>• <strong>进度显示</strong>：实时显示操作进度和结果</li>
                  <li>• 使用 useModelList、useModelDelete、useModelSave hooks</li>
                  <li>• 支持工具栏和下拉菜单两种展示方式</li>
                </ul>
              </div>

              {/* 组件预览 */}
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600 mb-4">组件预览：</p>
                <div className="bg-slate-50 rounded-lg p-6">
                  <ViewModel tableId={props.tableId} modelName={props.modelName}>
                    <ViewBatchOperation
                      modelId={props.tableId}
                      operations={props.operations}
                      selectedIds={mockSelectedIds}
                      variant={props.variant}
                      showProgress={props.showProgress}
                      disabled={props.disabled}
                      onOperationComplete={(result) => console.log('操作完成:', result)}
                    />
                  </ViewModel>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              ViewBatchOperation 高级批量操作组件（已隐藏示例）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const renderViewBatchOperationCodePreview = (props: Record<string, any>) => {
  const operationsStr = JSON.stringify(props.operations || ['batch-delete', 'batch-export', 'batch-copy'])

  return `import { ViewBatchOperation } from '@/registry/blocks/view/view-batch-operation/view-batch-operation'

const MyBatchOperation = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleOperationComplete = (result: any) => {
    console.log(\`操作完成:\`, result)
    if (result.success) {
      // 刷新数据或更新状态
    }
  }

  return (
                    <ViewBatchOperation
      modelId="${props.tableId}"
      operations={${operationsStr}}
      selectedIds={selectedIds}
      variant="${props.variant}"
      showProgress={${props.showProgress}}
      onOperationComplete={handleOperationComplete}
    />
  )
}`
}

export const viewBatchOperationConfig: ComponentConfig = {
  id: 'view-batch-operation',
  name: 'ViewBatchOperation 高级批量操作组件',
  propsConfig: viewBatchOperationPropsConfig,
  defaultProps: viewBatchOperationDefaultProps,
  renderPreview: renderViewBatchOperationPreview,
  renderCodePreview: renderViewBatchOperationCodePreview
}
