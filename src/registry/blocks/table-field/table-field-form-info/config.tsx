import * as React from 'react'
import { TableFieldFormInfo } from '@/registry/blocks/table-field/table-field-form-info/table-field-form-info'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldFormInfoPropsConfig = [
  {
    name: 'widgetContent',
    label: '组件代码',
    type: 'text' as const,
    default: '',
    description: '动态组件代码（待实现 Babel 转换）'
  }
]

export const tableFieldFormInfoDefaultProps = {
  widgetContent: ''
}

const renderTableFieldFormInfoPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldFormInfo
          schema={{
            widgetContent: props.widgetContent
          }}
        />
      </div>
    </div>
  )
}

const renderTableFieldFormInfoCodePreview = (props: Record<string, any>) => {
  return `<TableFieldFormInfo
  schema={{
    widgetContent: "${props.widgetContent}"
  }}
/>`
}

export const tableFieldFormInfoConfig: ComponentConfig = {
  id: 'table-field-form-info',
  name: 'TableField.FormInfo 表单信息',
  propsConfig: tableFieldFormInfoPropsConfig,
  defaultProps: tableFieldFormInfoDefaultProps,
  renderPreview: renderTableFieldFormInfoPreview,
  renderCodePreview: renderTableFieldFormInfoCodePreview
}

export default tableFieldFormInfoConfig
