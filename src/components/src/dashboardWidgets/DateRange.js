import React from 'react'
import { lazy } from 'xadmin-ui'

const FormWidget = lazy(() => import('./common').then(mod => ({ default: mod.FormWidget })))
const DateRangeComponent = lazy(() => import('../fieldComponent/DateRangeComponent'))

const DateRangeWidget = (props) => {
  const { cellKey } = props
  return <FormWidget
    {...props}
    extraProps={{ cellKey }}
    Component={DateRangeComponent}
  />
}

const paramSchema = {
  type: 'object',
  properties: {
    config: {
      title: _r('配置项'),
      type: 'object',
      properties: {        dateFormat: {
          title: _r("格式"),
          type: "string",
          enum1: ['date', 'datetime'],
          enum_title1: [_r('年月日'), _r('年月日-时分秒')]
        },
        disabled: {
          type: 'boolean',
          title: _r('禁用状态')
        }
      }
    }
  }
}

const desc = ``
const shortcuts = [
  '只要年月日，标题是有效日期'
]

const DateRange = {
  title: _r('日期范围'),
  category: [_r('基础表单'), _r('数据表组件')],
  icon: require('./icons/日期范围.svg'),
  component: DateRangeWidget,
  initLayout: { width: 300, height: 34 },
  initParam: {
    labelLayout: 'horizontal',
    config: { dateFormat: "datetime", disabled: false }
  },
  paramSchema,
  desc,
  shortcuts,
  theme: [
    { selector: '.widget-input .ant-input', title: _r('输入框样式') }
  ]
}

export default DateRange