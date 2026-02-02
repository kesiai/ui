import ViewModel from '../view-model/view-model'
import React from 'react'
import { Button } from '@/components/ui/button'
import ViewDetail from './view-detail'
import { ComponentConfig } from '@/app/config/types'

export const viewDetailPropsConfig = [
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
    default: 'task_def',
    description: '数据表格的唯一标识符'
  },
  {
    name: 'itemId',
    label: '数据ID',
    type: 'text' as const,
    default: '692004b03b11710131077e3e',
    description: '要查看详情的数据ID'
  },
  {
    name: 'size',
    label: '弹窗大小',
    type: 'select' as const,
    default: 'lg',
    options: [
      { value: 'sm', label: '小' },
      { value: 'md', label: '中' },
      { value: 'lg', label: '大' },
      { value: 'xl', label: '超大' },
      { value: 'full', label: '全屏' }
    ],
    description: '详情弹窗的大小'
  },
  {
    name: 'readonly',
    label: '只读模式',
    type: 'boolean' as const,
    default: true,
    description: '是否为只读模式'
  },
  {
    name: 'showExample',
    label: '显示示例',
    type: 'boolean' as const,
    default: true,
    description: '是否在预览中显示示例'
  }
]

export const viewDetailDefaultProps = {
  modelName: null,
  tableId: 'task_def',
  itemId: '692004b03b11710131077e3e',
  size: 'lg',
  readonly: true,
  showExample: true
}

const renderViewDetailPreview = (props: Record<string, any>) => {
  const sizeMap: Record<string, string> = {
    sm: '小',
    md: '中',
    lg: '大',
    xl: '超大',
    full: '全屏'
  }

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-3xl">
        <h3 className="text-lg font-semibold mb-4 text-center">ViewDetail 详情组件</h3>
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
                    <p><strong>弹窗大小：</strong>{sizeMap[props.size] || props.size}</p>
                    <p><strong>只读模式：</strong>{props.readonly ? '✓ 是' : '✗ 否'}</p>
                  </div>
                </div>
              </div>

              {/* 示例说明 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>📖 使用说明</strong>
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• 点击按钮打开详情弹窗</li>
                  <li>• 支持多种字段类型的自动渲染</li>
                  <li>• 可自定义字段值的渲染方式</li>
                  <li>• 使用 useModelItem 和 useModelGet hooks</li>
                  <li>• 支持触发器模式和受控模式</li>
                </ul>
              </div>

              {/* 组件预览 */}
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600 mb-4">组件预览：</p>
                <ViewModel tableId={props.tableId} modelName={props.modelName}>
                  <ViewDetail
                    itemId={props.itemId || '1'}
                    size={props.size}
                    readonly={props.readonly}
                    trigger={
                      <Button variant="outline" className="w-full">
                        查看详情
                      </Button>
                    }
                  />
                </ViewModel>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              ViewDetail 详情组件（已隐藏示例）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const renderViewDetailCodePreview = (props: Record<string, any>) => {
  return `import { ViewDetail } from '@/registry/blocks/view/view-detail/view-detail'

const MyDetail = ({ itemId }: { itemId: string }) => {
  const fields = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '名称' },
    { key: 'email', label: '邮箱' }
  ]

  return (
    <ViewDetail
      tableId="${props.tableId}"
      modelName="${props.modelName}"
      itemId={itemId}
      size="${props.size}"
      fields={fields}
      trigger={<Button>查看详情</Button>}
    />
  )
}`
}

export const viewDetailConfig: ComponentConfig = {
  id: 'view-detail',
  name: 'ViewDetail 详情组件',
  propsConfig: viewDetailPropsConfig,
  defaultProps: viewDetailDefaultProps,
  renderPreview: renderViewDetailPreview,
  renderCodePreview: renderViewDetailCodePreview
}
