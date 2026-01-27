import React from 'react'
import { lazy } from 'xadmin-ui'
import { TableField } from './common'

const WidgetComponent = lazy(() => import('./WidgetComponent'))

const paramSchema = {
  type: 'object',
  properties: {
    tableField: {
      title: _r('继承字段'),
      type: 'string',
      field: {
        component: TableField
      }
    }
  }
}

const desc = ``
const shortcuts = [
  '标题叫关联字段'
]

const Widget = {
  title: _r('表字段映射'),
  category: [_r('基础表单'), _r('数据表组件')],
  icon: require('./icons/表字段映射.svg'),
  component: WidgetComponent,
  initLayout: { width: 220, height: 220 },
  initParam: { labelLayout: 'horizontal' },
  paramSchema,
  desc,
  shortcuts
  // theme: [
  //   { selector: '.widget-input .ant-input', title: _r('输入框样式') }
  // ]
}

export default Widget
