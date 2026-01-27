import React from 'react'
import { use } from 'xadmin'
import MapComponent from '../../../fieldComponent/MapComponent'
import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput } from './common'

const DefaultMap = (props) => {
  const { form } = use('form')
  const [sch, setSch] = React.useState({})

  React.useEffect(() => {
    form.useEffect(({ values }) => {
      setSch(values)
    })
  }, [])
  
  return <MapComponent {...props} field={{ ...props.field, schema: { ..._.omit(sch, ['disabled', 'createDisabled', 'editDisabled']), showType: 'text' } }} />
}

const MapSchema = {
  type: "object",
  name: _r("定位"),
  title: _r("定位"),
  description:_r("用于确认位置信息"),
  key: "map",
  properties: {
    ...baseConfig,
    ...editConfig,
    showType: {
      type: 'string',
      title: _r('展示形式'),
      enum: ['text', 'map'],
      enum_title: [_r('文本模式'), _r('地图模式')],
      field: {
        defaultValue: 'text',
        effect: ({ value }, form) => {
          setTimeout(() => {
            form.setFieldData('lngLat', { display: value !== 'map' })
            form.setFieldData('positionName', { display: value !== 'map' })
            form.setFieldData('canHand', { display: value !== 'map' })
          })
        }
      }
    },
    lngLat: {
      type: 'boolean',
      title: _r('显示经纬度')
    },
    positionName: {
      type: 'boolean',
      title: _r('显示位置名称'),
      field: {
        defaultValue: true
      }
    },
    canEdit: {
      type: 'boolean',
      title: _r('允许修改')
    },
    canHand: {
      type: 'boolean',
      title: _r('允许手动输入')
    },
    defaultVal: {
      title: _r("默认值"),
      type: "object",
      properties: {},
      field: {
        component: DefaultMap
      }
    }
  },
  required: ["title", "key"],
  form: [keyForm, "title", "need", "showType", "lngLat", "positionName", "canEdit", "canHand", "listFields", "editableFields", "batchChangeFields",
    'allScript', "description", "descriptionType", "defaultVal", "widthInForm", 'tableFixed',
    'createShow', 'editShow', 'detailNotShow'],
  formEffect: form => {
    commonFormEffect(form)
  }
}

export default MapSchema