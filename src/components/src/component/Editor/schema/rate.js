import { use } from 'xadmin'
import { lazy } from 'xadmin-ui'
import React from 'react'
import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput } from './common'

const RateComponent = lazy(() => import('../../../fieldComponent/RateComponent'))
const DVContainer = lazy(() => import('../component/DefaultValContainer'))

const DefaultRate = (props) => {
  const { form } = use('form')
  const [sch, setSch] = React.useState({})

  React.useEffect(() => {
    form.useEffect(({ values }) => {
        setSch(values)
    })
  }, [])
  
  return <RateComponent {...props} field={{ ...props.field, schema: _.omit(sch, ['disabled', 'createDisabled', 'editDisabled']) }} />
}

const RateSchema = {
  type: "object",
  name: _r("星级评价"),
  title: _r("星级评价"),
  description:_r("可按照1-5颗星或1-10级进行评价"),
  key: "rate",
  properties: {
    count: {
      title: _r("数量"),
      type: "string",
      enum1: ['5', '10'],
      enum_title1: [_r('1-5颗星'), _r('1-10级')],
      selectFace: "flatten",
      selectType: 'single'
    },
    defaultVal: {
      title: _r("默认值"),
      type: "number",
      minimum: 0,
      field: {
        component: (props) => <DVContainer><DefaultRate {...props} /></DVContainer>,
        hideError: true,
        validate: (defaultVal, values) => {
          if (defaultVal && values.count && defaultVal > values.count) return _r('默认值超出数量限制')
        }
      }
    },
    ...baseConfig,
    ...editConfig
  },
  required: ["title", "key"],
  form: [keyForm, "title", "count", "defaultVal", 'need', 'listFields', 'editableFields', 'batchChangeFields', 
        'canOrder', 'allScript', 'description', 'descriptionType',
        'widthInForm', 'tableFixed', 'createShow', 'editShow', 'detailNotShow' ],
  formEffect: form => {
    commonFormEffect(form)
  }
}

export default RateSchema