import React from 'react'
import { lazy } from 'xadmin-ui'

const FormWidget = lazy(() => import('./common').then(mod => ({ default: mod.FormWidget })))
const MapComponent = lazy(() => import('../fieldComponent/MapComponent'))
const MapSchema = lazy(() => import('../component/Editor/schema/map'))

const MapWidget = (props) => {
  return <FormWidget
    {...props}
    Component={MapComponent}
  />
}

const configList = ['lngLat', 'canEdit', 'canHand' ]

const paramSchema = {
  type: 'object',
  properties: {
    config: {
      title: _r('配置项'),
      type: 'object',
      properties: _.pick(MapSchema.properties, configList),
      formEffect: MapSchema.formEffect
    }
  }
}

const desc = ``
const shortcuts = [
  '不显示经纬度',
  '可以手动输入'
]

const Map = {
  title: _r('定位'),
  category: [_r('基础表单'), _r('数据表组件')],
  icon: require('./icons/定位.svg'),
  component: MapWidget,
  initLayout: { width: 220, height: 40 },
  initParam: {
    labelLayout: 'horizontal',
    autoHeight:false,
    config: {
      canEdit: true,
      lngLat: true,
      canHand: false
    }
  },
  paramSchema,
  desc,
  shortcuts,
  theme: [
    { selector: '.widget-input .ant-input', title: _r('输入框样式') }
  ]
}

export default Map