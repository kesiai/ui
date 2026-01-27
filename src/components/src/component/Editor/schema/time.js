import React from 'react'
import { use } from 'xadmin'
import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput } from './common'
import { LogicInput } from './formula'
import TimeComponent from '../../../fieldComponent/TimeComponent'
import DVContainer from '../component/DefaultValContainer'

const DefaultTime = (props) => {
  const { form } = use('form')
  const [sch, setSch] = React.useState({})

  React.useEffect(() => {
    form.useEffect(({ values }) => {
      setSch(values)
    })
  }, [])
  
  return <TimeComponent {...props} style={{ width: '100%' }} field={{ ...props.field, schema: _.omit(sch, ['disabled', 'createDisabled', 'editDisabled']) }} />
}

const DateSchema = {
  type: "object",
  name: _r("时间"),
  title: _r("时间"),
  description:_r('可设为时分或时分秒'),
  icon: "inbox",
  key: "date",
  properties: {
    ...baseConfig,
    textContent: {
      title: _r("内容"),
      type: "string",
      enum: ['origin', 'logic'],
      enum_title: [_r('时间'), _r('公式计算')],
      field: {
        effect: ({ value }, form) => {
          setTimeout(() => {
            const display = value === 'logic'
            form.setFieldData('jsLogic', { display })
            form.setFieldData('timeFormat', { display: !display })
            form.setFieldData('editableFields', { display: !display })
            form.setFieldData('batchChangeFields', { display: !display })
            // form.setFieldData('disabled', { display: !display })
          })
        }
      }
    },
    jsLogic: {
      title: _r('公式'),
      type: 'string',
      permissionType: 'script',
      field: {
        component: LogicInput
      }
    },
    timeFormat: {
      title: _r("格式"),
      type: "string",
      enum1: ['HH:mm:ss', 'HH:mm', 'HH'],
      enum_title1: [_r('时分秒'), _r('时分'), _r('时')],
      selectFace: "flatten",
      selectType: 'single'
    },
    defaultVal: {
      title: _r("默认值"),
      type: "string",
      field: {
        component: (props) => <DVContainer><DefaultTime {...props} /></DVContainer>
      }
    },
    ...editConfig
  },
  required: ["title", "key", "timeFormat"],
  form: [
    keyForm, "title", "textContent", "jsLogic", "timeFormat", 'allScript',
    'description', 'descriptionType', 'need', 'createDisabled', 'editDisabled', 'unique', 'createShow', 'editShow',
    'listFields', 'editableFields', 'batchChangeFields', 'canOrder', 'tableFixed', 'detailNotShow',
    'widthInForm', 'size', 'defaultVal'
  ]
}

export default DateSchema