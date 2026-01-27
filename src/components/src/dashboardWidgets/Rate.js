import React from 'react'
import { lazy } from 'xadmin-ui'
import RateSchema from '../component/Editor/schema/rate'

const FormWidget = lazy(() => import('./common').then(mod => ({ default: mod.FormWidget })))
const RateComponent = lazy(() => import('../fieldComponent/RateComponent'))

const RateWidget = (props) => {
  return <FormWidget
    {...props}
    Component={RateComponent}
  />
}

const configList = ['count', 'defaultVal']

const paramSchema = {
  type: 'object',
  properties: {
    config: {
      title: _r('配置项'),
      type: 'object',
      properties: {
        ..._.pick(RateSchema.properties, configList),
        count: {
          title: _r("数量"),
          type: "string",
          enum1: ['5', '10'],
          enum_title1: [_r('1-5颗星'), _r('1-10级')]        },
        disabled: {
          type: 'boolean',
          title: _r('禁用状态')
        },
      },
      formEffect: RateSchema.formEffect
    }
  }
}

const desc = ``
const shortcuts = [
  '一共有10级，默认是6级'
]

const Rate = {
  title: _r('星级评价'),
  category: [_r('基础表单'), _r('数据表组件')],
  icon: require('./icons/星级评价.svg'),
  component: RateWidget,
  initLayout: { width: 220, height: 40 },
  initParam: {
    labelLayout: 'horizontal',
    autoHeight: false,    config: {
      count: '5',
      disabled: false
    }
  },
  paramSchema,
  desc,
  shortcuts,
  theme: [
    { selector: '.widget-input .ant-input', title: _r('输入框样式') }
  ]
}

export default Rate
