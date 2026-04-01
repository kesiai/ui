import { TableSelect } from './table-data-select'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './table-data-select.md?raw'

// 翻译函数占位符
const _r = (str: string) => str

export const tableSelectPropsConfig = [
  {
    name: 'tables',
    label: _r('表选择'),
    type: 'array' as const,
    default: [],
    description: _r('选择表后，表记录选择器只显示对应表的表记录'),
    fieldType: 'table'
  },
  {
    name: 'placeholder',
    label: _r('提示文字'),
    type: 'text' as const,
    default: _r('请选择表记录'),
    fieldType: 'languageInput',
    description: _r('选择器中的提示文本信息')
  },
  {
    name: 'displayConfig',
    label: _r('显示配置'),
    type: 'object' as const,
    default: {},
    description: _r('配置需要显示的表记录，可以控制哪些记录在列表中出现')
  }
]

export const tableSelectDefaultProps = {
  tables: [],
  placeholder: _r('请选择表记录'),
  displayConfig: {}
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
  const { tables, placeholder, displayConfig } = props

  const propsString = [
    tables.length > 0 ? `tables={${JSON.stringify(tables)}}` : null,
    placeholder !== _r('请选择表记录') ? `placeholder="${placeholder}"` : null,
    Object.keys(displayConfig).length > 0 ? `displayConfig={${JSON.stringify(displayConfig)}}` : null
  ].filter(Boolean).join('\n  ')

  return `<TableSelect\n  ${propsString}\n/>`
}

export const tableSelectConfig: ComponentConfig = {
  id: 'table-data-select',
  name: '表记录选择器',
  propsConfig: tableSelectPropsConfig,
  defaultProps: tableSelectDefaultProps,
  renderPreview: renderTableSelectPreview,
  renderCodePreview: renderTableSelectCodePreview,
  documentation: documentationMd
}