import { TableSelect } from './table-select'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './table-select.md?raw'

// 翻译函数占位符
const _r = (str: string) => str
const _t1 = (str: string) => str

export const tableSelectPropsConfig = [
  {
    name: 'multiple',
    label: _r('多选'),
    type: 'boolean' as const,
    default: false,
    description: _r('选中“是”后，每次可选择多个数据表，默认为否')
  },
  {
    name: 'placeholder',
    label: _r('提示文字'),
    type: 'text' as const,
    default: _r('请选择表'),
    description: _r('选择器中的提示文本信息')
  },
  {
    name: 'tree',
    label: _r('树形展示'),
    type: 'boolean' as const,
    default: false,
    description: _r('选中后，选择器中的表按照层级树形展示')
  },
  {
    name: 'excludeDevice',
    label: _r('排除设备表'),
    type: 'boolean' as const,
    default: false,
    description: _r('选中后，选择器中不显示设备表')
  }
]

export const tableSelectDefaultProps = {
  multiple: false,
  placeholder: _r('请选择表'),
  tree: false,
  excludeDevice: false
}

const renderTableSelectPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableSelect
          cellKey="preview"
          input={{ value: undefined, onChange: () => {} }}
          {...props}
        />
      </div>
    </div>
  )
}

const renderTableSelectCodePreview = (props: Record<string, any>) => {
  const { multiple, placeholder, tree, excludeDevice } = props

  const propsString = [
    multiple ? `multiple` : null,
    placeholder !== _r('请选择表') ? `placeholder="${placeholder}"` : null,
    tree ? `tree` : null,
    excludeDevice ? `excludeDevice` : null
  ].filter(Boolean).join('\n  ')

  return `<TableSelect\n  ${propsString}\n/>`
}

export const tableSelectConfig: ComponentConfig = {
  id: 'table-select',
  name: '表选择器',
  propsConfig: tableSelectPropsConfig,
  defaultProps: tableSelectDefaultProps,
  renderPreview: renderTableSelectPreview,
  renderCodePreview: renderTableSelectCodePreview,
  documentation: documentationMd
}