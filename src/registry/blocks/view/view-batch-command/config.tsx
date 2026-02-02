import ViewModel from '../view-model/view-model'
import React from 'react'
import ViewBatchCommand from './view-batch-command'
import { ComponentConfig } from '@/app/config/types'

export const viewBatchCommandPropsConfig = [
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
    name: 'triggerVariant',
    label: '触发器类型',
    type: 'select' as const,
    default: 'button',
    options: [
      { value: 'button', label: '按钮' },
      { value: 'dropdown', label: '下拉菜单' }
    ],
    description: '命令按钮的展示方式'
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false,
    description: '是否禁用命令执行'
  },
  {
    name: 'showExample',
    label: '显示示例',
    type: 'boolean' as const,
    default: true,
    description: '是否在预览中显示示例'
  }
]

export const viewBatchCommandDefaultProps = {
  modelName: null,
  tableId: 'device',
  selectedCount: 3,
  triggerVariant: 'button',
  disabled: false,
  showExample: true
}

const renderViewBatchCommandPreview = (props: Record<string, any>) => {
  const mockSelectedIds = Array.from({ length: props.selectedCount }, (_, i) => String(i + 1))

  const mockCommands = [
    {
      id: 'start',
      name: 'start',
      label: '启动设备',
      type: 'api' as const,
      description: '批量启动选中的设备',
      confirmRequired: false,
    },
    {
      id: 'stop',
      name: 'stop',
      label: '停止设备',
      type: 'api' as const,
      description: '批量停止选中的设备',
      confirmRequired: true,
      confirmMessage: '设备停止后将无法正常工作，确定要停止吗？',
    },
    {
      id: 'restart',
      name: 'restart',
      label: '重启设备',
      type: 'api' as const,
      description: '批量重启选中的设备',
      confirmRequired: true,
      confirmMessage: '设备重启期间将无法访问，确定要重启吗？',
    },
    {
      id: 'config',
      name: 'config',
      label: '下发配置',
      type: 'custom' as const,
      description: '批量下发配置参数',
      confirmRequired: true,
      confirmMessage: '确定要下发新配置吗？此操作将覆盖现有配置。',
      params: [
        { name: 'config', label: '配置内容', type: 'textarea' as const, required: true, placeholder: '请输入 JSON 配置' },
        { name: 'mode', label: '下发模式', type: 'select' as const, required: true, options: [
          { value: 'immediate', label: '立即生效' },
          { value: 'restart', label: '重启后生效' }
        ], defaultValue: 'immediate' }
      ]
    }
  ]

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-3xl">
        <h3 className="text-lg font-semibold mb-4 text-center">ViewBatchCommand 批量命令组件</h3>
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
                    <p><strong>选中数量：</strong>{props.selectedCount} 条</p>
                    <p><strong>触发器类型：</strong>{props.triggerVariant === 'button' ? '按钮' : '下拉菜单'}</p>
                  </div>
                  <p><strong>禁用：</strong>{props.disabled ? '✓ 是' : '✗ 否'}</p>
                </div>
              </div>

              {/* 功能说明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>💡 ViewBatchCommand 说明</strong>
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>批量命令</strong>：支持对多条数据执行自定义命令</li>
                  <li>• <strong>命令类型</strong>：支持脚本、API、自定义三种类型</li>
                  <li>• <strong>参数配置</strong>：支持文本、数字、选择、文本域等多种参数类型</li>
                  <li>• <strong>确认机制</strong>：危险操作可配置二次确认</li>
                  <li>• <strong>执行结果</strong>：实时显示命令执行结果和影响数量</li>
                  <li>• 使用 useModelList、useModelSave hooks</li>
                  <li>• 支持命令执行前后的回调事件</li>
                  <li>• 选中计数显示和禁用状态管理</li>
                </ul>
              </div>

              {/* 组件预览 */}
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600 mb-4">组件预览：</p>
                <div className="bg-slate-50 rounded-lg p-6 flex items-center justify-center">
                  <ViewModel tableId={props.tableId} modelName={props.modelName}>
                    <ViewBatchCommand
                      modelId={props.tableId}
                      commands={mockCommands}
                      selectedIds={mockSelectedIds}
                      triggerVariant={props.triggerVariant}
                      disabled={props.disabled}
                      onCommandStart={(cmd) => console.log('命令开始:', cmd)}
                      onCommandComplete={(result) => console.log('命令完成:', result)}
                    />
                  </ViewModel>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              ViewBatchCommand 批量命令组件（已隐藏示例）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const renderViewBatchCommandCodePreview = (props: Record<string, any>) => {
  return `import { ViewBatchCommand } from '@/registry/blocks/view/view-batch-command/view-batch-command'

const MyBatchCommand = ({ selectedIds }: { selectedIds: string[] }) => {
  const commands = [
    {
      id: 'start',
      name: 'start',
      label: '启动设备',
      type: 'api' as const,
      description: '批量启动选中的设备',
      confirmRequired: false,
    },
    {
      id: 'config',
      name: 'config',
      label: '下发配置',
      type: 'custom' as const,
      description: '批量下发配置参数',
      confirmRequired: true,
      params: [
        { name: 'config', label: '配置内容', type: 'textarea' as const, required: true },
        { name: 'mode', label: '下发模式', type: 'select' as const, options: [
          { value: 'immediate', label: '立即生效' },
          { value: 'restart', label: '重启后生效' }
        ]}
      ]
    }
  ]

  const handleCommandComplete = (result: any) => {
    console.log('命令执行完成:', result)
    // 刷新数据或更新状态
  }

  return (
    <ViewBatchCommand
      modelId="${props.tableId}"
      commands={commands}
      selectedIds={selectedIds}
      onCommandComplete={handleCommandComplete}
    />
  )
}`
}

export const viewBatchCommandConfig: ComponentConfig = {
  id: 'view-batch-command',
  name: 'ViewBatchCommand 批量命令组件',
  propsConfig: viewBatchCommandPropsConfig,
  defaultProps: viewBatchCommandDefaultProps,
  renderPreview: renderViewBatchCommandPreview,
  renderCodePreview: renderViewBatchCommandCodePreview
}
