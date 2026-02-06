import ViewModel from '../view-model/view-model'
import React from 'react'
import ViewPagination from './view-pagination'
import { ComponentConfig } from '@/app/config/types'
import { useModelGetItems } from '@airiot/client'
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export const viewPaginationPropsConfig = [
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
    name: 'showSizeChanger',
    label: '显示每页条数选择器',
    type: 'boolean' as const,
    default: true,
    description: '是否显示每页条数选择器'
  },
  {
    name: 'showQuickJumper',
    label: '显示快速跳转',
    type: 'boolean' as const,
    default: false,
    description: '是否显示快速跳转到指定页'
  },
  {
    name: 'showTotal',
    label: '显示总数',
    type: 'boolean' as const,
    default: true,
    description: '是否显示数据总数'
  },
  {
    name: 'pageSizeOptions',
    label: '每页条数选项',
    type: 'json' as const,
    default: '[10, 20, 50, 100]',
    description: '每页条数选择器的选项（JSON 数组格式）'
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false,
    description: '是否禁用分页组件'
  },
  {
    name: 'showExample',
    label: '显示示例',
    type: 'boolean' as const,
    default: true,
    description: '是否在预览中显示示例'
  }
]

export const viewPaginationDefaultProps = {
  showSizeChanger: true,
  showQuickJumper: false,
  showTotal: true,
  pageSizeOptions: [10, 20, 50, 100],
  disabled: false,
  showExample: true,
  modelName: null,
  tableId: 'task_def'
}

const RenderViewPaginationPreview = (props: Record<string, any>) => {
  const { getItems } = useModelGetItems()
  // 解析 pageSizeOptions
  let pageSizeOptions = props.pageSizeOptions || [10, 20, 50, 100]
  try {
    pageSizeOptions = typeof props.pageSizeOptions === 'string'
      ? JSON.parse(props.pageSizeOptions)
      : props.pageSizeOptions
  } catch (e) {
    pageSizeOptions = [10, 20, 50, 100]
  }

  React.useEffect(() => {
    getItems()
  }, [props.pageSizeOptions])

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-auto">
      <div className="w-full max-w-4xl">
        <h3 className="text-lg font-semibold mb-4 text-center">ViewPagination 分页组件</h3>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          {props.showExample ? (
            <div className="space-y-6">
              {/* 配置展示 */}
              <div className="text-sm text-slate-600">
                <p className="font-semibold mb-2">📋 当前配置：</p>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex gap-6">
                    <p><strong>显示总数：</strong>{props.showTotal ? '✓ 是' : '✗ 否'}</p>
                    <p><strong>每页条数选择器：</strong>{props.showSizeChanger ? '✓ 是' : '✗ 否'}</p>
                    <p><strong>快速跳转：</strong>{props.showQuickJumper ? '✓ 是' : '✗ 否'}</p>
                    <p><strong>禁用：</strong>{props.disabled ? '✓ 是' : '✗ 否'}</p>
                  </div>
                  <p><strong>每页条数选项：</strong>
                    <code className="ml-2 px-2 py-1 bg-white rounded text-xs">
                      {pageSizeOptions.join(', ')}
                    </code>
                  </p>
                </div>
              </div>

              {/* 组件预览 */}
              <div className="border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600 mb-4">分页组件预览：</p>
                <div className="bg-slate-50 rounded-lg p-6">
                    <ViewPagination
                      showSizeChanger={props.showSizeChanger}
                      showQuickJumper={props.showQuickJumper}
                      showTotal={props.showTotal}
                      pageSizeOptions={pageSizeOptions}
                      disabled={props.disabled}
                    />
                </div>
              </div>

              {/* 功能说明 */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>💡 ViewPagination 说明</strong>
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• <strong>showSizeChanger</strong>：显示每页条数选择器</li>
                    <li>• <strong>showQuickJumper</strong>：显示快速跳转到指定页功能</li>
                    <li>• <strong>showTotal</strong>：显示数据总数统计</li>
                    <li>• <strong>pageSizeOptions</strong>：每页条数的可选值</li>
                    <li>• 使用 useModelPagination hook 获取分页状态</li>
                    <li>• 支持页码点击和快速跳转</li>
                    <li>• 自动隐藏总页数为1的情况</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm p-4 border border-dashed border-slate-300 rounded-md">
              ViewPagination 分页组件（已隐藏示例）
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const renderViewPaginationPreviewWrap = (props: Record<string, any>) => {
  return (
      <ViewModel tableId={props.tableId} modelName={props.modelName} loadingComponent={(
        <div className="w-full flex p-10 justify-center"><Button disabled variant="ghost">
          <Spinner data-icon="inline-start" />
            加载中...
          </Button>
        </div>)}>
        <RenderViewPaginationPreview {...props} />
      </ViewModel>
  )
}

const renderViewPaginationCodePreview = (props: Record<string, any>) => {
  const pageSizeOptionsStr = JSON.stringify(props.pageSizeOptions || [10, 20, 50, 100])

  return `import { ViewPagination } from '@/registry/components/view-pagination/view-pagination'

const MyPagination = () => {
  return (
                    <ViewPagination
      showSizeChanger={${props.showSizeChanger}}
      showQuickJumper={${props.showQuickJumper}}
      showTotal={${props.showTotal}}
      pageSizeOptions={${pageSizeOptionsStr}}
      disabled={${props.disabled}}
    />
  )
}`
}

export const viewPaginationConfig: ComponentConfig = {
  id: 'view-pagination',
  name: 'ViewPagination 分页组件',
  propsConfig: viewPaginationPropsConfig,
  defaultProps: viewPaginationDefaultProps,
  renderPreview:  renderViewPaginationPreviewWrap,
  renderCodePreview: renderViewPaginationCodePreview
}
