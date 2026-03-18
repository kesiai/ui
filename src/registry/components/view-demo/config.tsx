import ViewModel from '../view-model/view-model'
import React from 'react'
import { ComponentConfig } from '@/app/config/types'
import ViewDataTable, { TableColumn } from '../view-data-table/view-data-table'
import ViewPagination from '../view-pagination/view-pagination'
import Actions, { CreateAction } from '../view-actions/view-actions'
import Tools from '../view-tools/view-tools'
import BatchActions from '../view-batch/view-batch'
import documentationMd from './view-demo.md?raw'
import trans from './trans'

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
  }
]

export const viewDemoDefaultProps = {
  modelName: null,
  tableId: '主表'
}

const renderViewDemoPreview = (props: Record<string, any>) => {

  return (
    <div className="h-full flex items-center justify-center p-6 overflow-auto">
      <div className="w-full max-w-5xl">
        <h3 className="text-lg font-semibold mb-4 text-center">viewDemo 综合演示</h3>
        <ViewModel tableId={props.tableId} modelName={props.modelName} schemaTransform={model => {
          const { schema, formSchema, tableSchema } = trans(model)
          console.log(model, schema, formSchema, tableSchema)
          return {
            atoms: model.atoms,
            ...schema,
            formSchema,
            tableSchema
          }
        }}>
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <CreateAction />
              <Tools tools={['count', 'pageSize', 'columns']} />
            </div>
            <ViewDataTable>
              <TableColumn name="text-2D6E" title="姓名" width={180} />
              <TableColumn name="select-BAE0" title="年级" />
              <TableColumn name="relate-table-2E3C" title="所属表" />
              <TableColumn name="__actions__" title=" " width={65} enableSorting={false} enableHiding={false} enableResizing={false}>
                <Actions variant="dropdown" actions={props.actions || ['view', 'edit', 'delete']} />
              </TableColumn>
            </ViewDataTable>
            <div className="flex items-center justify-between">
              <BatchActions actions={['batch-change', 'batch-delete']} />
              <ViewPagination />
            </div>
          </div>
        </ViewModel>
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
  name: "ViewDemo 综合演示",
  propsConfig: viewDemoPropsConfig,
  defaultProps: viewDemoDefaultProps,
  renderPreview: renderViewDemoPreview,
  renderCodePreview: renderViewDemoCodePreview,
  documentation: documentationMd
}
