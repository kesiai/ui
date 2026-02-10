import React from 'react'
import ViewDataTable from './view-data-table'
import ViewModel from '../view-model/view-model'
import { ComponentConfig } from '@/app/config/types'

export const viewDataTablePropsConfig = [
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
    name: 'enableSort',
    label: '启用排序',
    type: 'boolean' as const,
    default: true,
    description: '是否启用列排序功能'
  },
  {
    name: 'enableFilter',
    label: '启用筛选',
    type: 'boolean' as const,
    default: true,
    description: '是否启用数据筛选功能'
  },
  {
    name: 'showDemoData',
    label: '显示演示数据',
    type: 'boolean' as const,
    default: true,
    description: '是否使用内置演示数据（用于展示）'
  },
  // Table Layout Props
  {
    name: 'dense',
    label: '密集模式',
    type: 'boolean' as const,
    default: false,
    description: '表格是否使用密集（更紧凑）的布局'
  },
  {
    name: 'border',
    label: '表格框',
    type: 'boolean' as const,
    default: true,
    description: '是否显示表格边框'
  },
  {
    name: 'cellBorder',
    label: '单元格边框',
    type: 'boolean' as const,
    default: false,
    description: '是否显示单元格边框'
  },
  {
    name: 'rowBorder',
    label: '行边框',
    type: 'boolean' as const,
    default: true,
    description: '是否显示行边框'
  },
  {
    name: 'rowRounded',
    label: '行圆角',
    type: 'boolean' as const,
    default: false,
    description: '是否使用圆角行'
  },
  {
    name: 'stripped',
    label: '斑马纹',
    type: 'boolean' as const,
    default: false,
    description: '是否使用斑马纹样式'
  },
  {
    name: 'headerBackground',
    label: '表头背景',
    type: 'boolean' as const,
    default: true,
    description: '是否显示表头背景色'
  },
  {
    name: 'headerBorder',
    label: '表头边框',
    type: 'boolean' as const,
    default: true,
    description: '是否显示表头边框'
  },
  {
    name: 'headerSticky',
    label: '表头固定',
    type: 'boolean' as const,
    default: true,
    description: '是否固定表头（滚动时保持可见）'
  },
  {
    name: 'width',
    label: '列宽模式',
    type: 'select' as const,
    default: 'fixed',
    options: [
      { value: 'auto', label: '自动' },
      { value: 'fixed', label: '固定' }
    ],
    description: '列宽的调整模式'
  },
  {
    name: 'layout',
    label: '表格布局',
    type: 'select' as const,
    default: 'fixed',
    options: [
      { value: 'auto', label: '自动' },
      { value: 'fixed', label: '固定' }
    ],
    description: '表格布局算法'
  },
  {
    name: 'columnsVisibility',
    label: '列可见性',
    type: 'boolean' as const,
    default: false,
    description: '是否启用列显示/隐藏功能'
  },
  {
    name: 'columnsResizable',
    label: '列可调整大小',
    type: 'boolean' as const,
    default: true,
    description: '是否允许调整列宽'
  },
  {
    name: 'columnsPinnable',
    label: '列可固定',
    type: 'boolean' as const,
    default: true,
    description: '是否允许固定列到左侧或右侧'
  },
  {
    name: 'columnsMovable',
    label: '列可移动',
    type: 'boolean' as const,
    default: false,
    description: '是否允许拖动移动列'
  },
  {
    name: 'columnsDraggable',
    label: '列可拖拽',
    type: 'boolean' as const,
    default: false,
    description: '是否允许拖拽列（拖拽到其他位置）'
  },
  {
    name: 'rowsDraggable',
    label: '行可拖拽',
    type: 'boolean' as const,
    default: false,
    description: '是否允许拖拽行进行重新排序'
  }
]

export const viewDataTableDefaultProps = {
  modelName: null,
  tableId: 'task_def',
  pageSize: 10,
  enableSort: true,
  enableFilter: true,
  enablePagination: true,
  showDemoData: true,
  dense: false,
  border: true,
  cellBorder: false,
  rowBorder: true,
  rowRounded: false,
  stripped: false,
  headerBackground: true,
  headerBorder: true,
  headerSticky: true,
  width: 'fixed' as const,
  layout: 'fixed' as const,
  columnsVisibility: false,
  columnsResizable: true,
  columnsPinnable: true,
  columnsMovable: false,
  columnsDraggable: false,
  rowsDraggable: false
}

const renderViewDataTablePreview = (props: Record<string, any>) => {
  // 构建 tableLayout 对象
  const tableLayout = {
    border: props.border,
    dense: props.dense,
    cellBorder: props.cellBorder,
    rowBorder: props.rowBorder,
    rowRounded: props.rowRounded,
    stripped: props.stripped,
    headerBackground: props.headerBackground,
    headerBorder: props.headerBorder,
    headerSticky: props.headerSticky,
    width: props.width,
    layout: props.layout,
    columnsVisibility: props.columnsVisibility,
    columnsResizable: props.columnsResizable,
    columnsPinnable: props.columnsPinnable,
    columnsMovable: props.columnsMovable,
    columnsDraggable: props.columnsDraggable,
    rowsDraggable: props.rowsDraggable,
  }

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-6xl">
        <h3 className="text-lg font-semibold mb-4 text-center">ViewDataTable 数据表格</h3>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          {/* 配置展示 */}
          <div className="text-sm text-slate-600 mb-6">
            <p className="font-semibold mb-2">📋 当前配置：</p>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="mt-2"><strong>演示数据：</strong>{props.showDemoData ? '✓ 使用演示数据' : '✗ 使用真实数据'}</p>

              {/* Table Layout 配置 */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="font-semibold mb-2">🎨 表格布局：</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <span>密集: {props.dense ? '✓' : '✗'}</span>
                  <span>单元格边框: {props.cellBorder ? '✓' : '✗'}</span>
                  <span>行边框: {props.rowBorder ? '✓' : '✗'}</span>
                  <span>行圆角: {props.rowRounded ? '✓' : '✗'}</span>
                  <span>斑马纹: {props.stripped ? '✓' : '✗'}</span>
                  <span>表头背景: {props.headerBackground ? '✓' : '✗'}</span>
                  <span>表头边框: {props.headerBorder ? '✓' : '✗'}</span>
                  <span>表头固定: {props.headerSticky ? '✓' : '✗'}</span>
                  <span>列可调: {props.columnsResizable ? '✓' : '✗'}</span>
                  <span>列可固定: {props.columnsPinnable ? '✓' : '✗'}</span>
                  <span>列可移动: {props.columnsMovable ? '✓' : '✗'}</span>
                  <span>列可拖拽: {props.columnsDraggable ? '✓' : '✗'}</span>
                  <span>行可拖拽: {props.rowsDraggable ? '✓' : '✗'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 组件预览 */}
          <div>
            <ViewModel tableId={props.tableId} modelName={props.modelName}>
              <ViewDataTable tableLayout={tableLayout} />
            </ViewModel>
          </div>

          {/* 功能说明 */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>💡 ViewDataTable 说明</strong>
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• <strong>modelId</strong>：数据模型的唯一标识符，用于获取真实数据</li>
                <li>• <strong>pageSize</strong>：每页显示的数据条数</li>
                <li>• <strong>enableSort</strong>：是否启用列的排序功能</li>
                <li>• <strong>enableFilter</strong>：是否启用数据的筛选功能</li>
                <li>• <strong>enablePagination</strong>：是否启用分页功能</li>
                <li>• <strong>tableLayout</strong>：表格布局配置，支持密集模式、边框、斑马纹、表头固定等多种样式</li>
                <li>• 基于 TanStack Table 和 DataGrid 组件</li>
                <li>• 支持响应式布局和横向滚动</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const renderViewDataTableCodePreview = (props: Record<string, any>) => {
  const tableLayoutCode = `{
  dense: ${props.dense},
  cellBorder: ${props.cellBorder},
  rowBorder: ${props.rowBorder},
  rowRounded: ${props.rowRounded},
  stripped: ${props.stripped},
  headerBackground: ${props.headerBackground},
  headerBorder: ${props.headerBorder},
  headerSticky: ${props.headerSticky},
  width: '${props.width}',
  layout: '${props.layout}',
  columnsVisibility: ${props.columnsVisibility},
  columnsResizable: ${props.columnsResizable},
  columnsPinnable: ${props.columnsPinnable},
  columnsMovable: ${props.columnsMovable},
  columnsDraggable: ${props.columnsDraggable},
  rowsDraggable: ${props.rowsDraggable},
}`

  return `import { ViewDataTable } from '@/registry/components/view-data-table/view-data-table'

const MyDataTable = () => {
  const tableLayout = ${tableLayoutCode}

  return (
    <ViewDataTable tableLayout={tableLayout} />
  )
}

// 当前组件使用演示数据，如需连接真实数据：
// 1. 取消注释组件内部的 useModelList、useModel 等 hooks
// 2. 将 demoData 替换为从 model 获取的真实数据
// 3. 配置正确的 modelId 属性`
}

export const viewDataTableConfig: ComponentConfig = {
  id: 'view-data-table',
  name: 'ViewDataTable 数据表格',
  propsConfig: viewDataTablePropsConfig,
  defaultProps: viewDataTableDefaultProps,
  renderPreview: renderViewDataTablePreview,
  renderCodePreview: renderViewDataTableCodePreview
}
