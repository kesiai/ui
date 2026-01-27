import React from 'react'
import { lazy } from 'xadmin-ui'
import { baseConfig, editConfig, keyForm, commonFormEffect } from './common'

const PcaSelect = lazy(() => import('../../../fieldComponent/AreaComponent'))
const DVContainer = lazy(() => import('../component/DefaultValContainer'))

const AreaSchema = {
  type: "object",
  name: _r("区域"),
  title: _r("区域"),
  description:_r('用于选择区域，可具体到省市县'),
  icon: "inbox",
  key: "area",
  properties: {
    areaType: {
      title: _r("区域类型"),
      type: "string",
      enum: ['p', 'pc', 'pca'],
      enum_title: [_r('省'), _r('省-市'), _r('省-市-县')]
    },
    defaultVal: {
      title: _r("默认值"),
      type: "string",
      field: {
        component: (props) => <DVContainer><PcaSelect {...props} /></DVContainer> 
      }
    },
    placeholder: {
      title: _r("引导文字"),
      type: "string",
      fieldType: 'languageInput'
    },
    ...baseConfig,
    ...editConfig
  },
  required: ["title", "key"],
  form: [
    keyForm, "title", "areaType", 'defaultVal',
    'allScript', 'placeholder', 'description', 'descriptionType', 'need', 'listFields',
    'editableFields', 'batchChangeFields', 'filterFields', 'widthInForm', 'tableFixed',
    'createShow', 'editShow', 'detailNotShow', 'size'
  ],
  formEffect: form => {
    form.useField('areaType', ({ value }, b) => {
      if (value.length !== form.getState().values?.defaultVal?.split('-').length) {
        form.change('defaultVal', null)
      }
    })
    commonFormEffect(form)
  }
}

export default AreaSchema
