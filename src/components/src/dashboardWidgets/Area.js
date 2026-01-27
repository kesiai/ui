import React from 'react'
import { lazy } from 'xadmin-ui'
import AreaSchema from '../component/Editor/schema/area'

const FormWidget = lazy(() => import('./common').then(mod => ({ default: mod.FormWidget })))
const AreaComponent = lazy(() => import('../fieldComponent/AreaComponent'))

const AreaWidget = (props) => {
  const { cellKey } = props
  return <FormWidget
    {...props}
    extraProps={{ cellKey }}
    Component={AreaComponent}
  />
}

const configList = ['areaType', 'defaultVal']

const paramSchema = {
  type: 'object',
  properties: {
    config: {
      title: _r('配置项'),
      type: 'object',
      properties: {
        ..._.pick(AreaSchema.properties, configList),
        disabled: {
          type: 'boolean',
          title: _r('禁用状态')
        }
      },
      formEffect: AreaSchema.formEffect
    }
  }
}

const desc = ``
const shortcuts = [
  '只能选到市'
]

const Area = {
  title: _r('区域'),
  category: [_r('基础表单'), _r('数据表组件')],
  icon: require('./icons/区域.svg'),
  component: AreaWidget,
  initLayout: { width: 220, height: 40 },
  initParam: {
    labelLayout: 'horizontal',
    autoHeight: false,    config: {
      areaType: 'pca',
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

export default Area
