import { ViewModel } from '../view-model/view-model'
import React from 'react'
import { Subscribe } from '@kesi/client'
import { ComponentConfig } from '@/app/config/types'
import { ViewDataTable, TableColumn } from '../view-data-table/view-data-table'
import { ViewPagination } from '../view-pagination/view-pagination'
import { Actions, CreateAction } from '../view-actions/view-actions'
import { ViewFilter } from '../view-filter/view-filter'
import { Tools } from '../view-tools/view-tools'
import { BatchActions } from '../view-batch/view-batch'
import documentationMd from './view-demo.md?raw'

export const viewDemoPropsConfig = [
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
    name: 'persistEnabled',
    label: '状态持久化',
    type: 'boolean' as const,
    default: true,
    description: '缓存筛选/分页/排序/列显示/列宽（关掉即恢复即弃模式）'
  },
  {
    name: 'persistChannel',
    label: '缓存通道',
    type: 'select' as const,
    default: 'local',
    options: [
      { label: '浏览器 localStorage', value: 'local' },
      { label: '数据库（KESI 配置表）', value: 'remote' }
    ],
    description: 'local 存浏览器；remote 需下方配置表名'
  },
  {
    name: 'persistRemoteTableId',
    label: '远端配置表ID',
    type: 'text' as const,
    default: '',
    description: 'channel=remote 时使用；期望记录结构 { user, viewKey, state }，表需先在平台建好'
  }
]

export const viewDemoDefaultProps = {
  modelName: null,
  tableId: 'asset_lifecycle_log',
  persistEnabled: true,
  persistChannel: 'local',
  persistRemoteTableId: ''
}

const renderViewDemoPreview = (props: Record<string, any>) => {
  const statePersistence = props.persistEnabled === false ? undefined : {
    channel: (props.persistChannel || 'local') as 'local' | 'remote',
    ...(props.persistChannel === 'remote' && props.persistRemoteTableId
      ? { remote: { tableId: props.persistRemoteTableId } }
      : {})
  }

  return (
    <div className="h-full flex items-center justify-center p-6 overflow-auto">
      <div className="w-full max-w-5xl">
        <h3 className="text-lg font-semibold mb-4 text-center">viewDemo 综合演示</h3>
        <Subscribe>
          <ViewModel
            key={`view-demo-${props.tableId}-${props.persistChannel}-${props.persistRemoteTableId || ''}`}
            tableId={props.tableId}
            modelName={props.modelName}
            isSchemaTransform={true}
            statePersistence={statePersistence}
          >
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
              <ViewFilter />
              <div className="flex items-center justify-between">
                <CreateAction />
                <Tools tools={['count', 'pageSize']} />
              </div>
              <ViewDataTable showColumnSettings>
                <TableColumn name="__actions__" title=" " width={65} enableSorting={false} enableHiding={false} enableResizing={false}>
                  <Actions actions={props.actions || ['view', 'edit', 'delete']} />
                </TableColumn>
              </ViewDataTable>
              <div className="flex items-center justify-between">
                <BatchActions actions={['batch-change', 'batch-delete']} />
                <ViewPagination />
              </div>
            </div>
          </ViewModel>
        </Subscribe>
      </div>
    </div>
  )
}

const renderViewDemoCodePreview = (props: Record<string, any>) => {
  const actionsStr = JSON.stringify(props.actions || ['view', 'edit', 'delete'])

  return `import { viewDemo } from '@/registry/components/view-actions/view-actions'

const MyActions = ({ itemId }: { itemId: string }) => {
  const handleAction = (action: string, id: string) => {
    console.log(\`操作: \${action}, 数据ID: \${id}\`)
  }

  return (
                    <viewDemo
      modelId="${props.tableId}"
      itemId={itemId}
      actions={${actionsStr}}
      triggerVariant="${props.triggerVariant}"
      onAction={handleAction}
    />
  )
}`
}

export const viewDemoConfig: ComponentConfig = {
  id: 'view-demo',
  name: "综合演示",
  propsConfig: viewDemoPropsConfig,
  defaultProps: viewDemoDefaultProps,
  renderPreview: renderViewDemoPreview,
  renderCodePreview: renderViewDemoCodePreview,
  documentation: documentationMd
}
