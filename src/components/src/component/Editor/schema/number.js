import React from 'react'
import { use } from 'xadmin'
import { C } from 'xadmin-ui'
import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput, metricStore } from './common'
import { LogicInput } from './formula'
import NumberComponent from '../../../fieldComponent/NumberComponent'
import DVContainer from '../component/DefaultValContainer'

const DefaultNumber = (props) => {
  const { form } = use('form')
  const [sch, setSch] = React.useState({})

  React.useEffect(() => {
    form.useEffect(({ values }) => {
      setSch(values)
    })
  }, [])

  return <NumberComponent {...props} field={{
    ...props.field,
    schema: _.omit(sch, ['disabled', 'createDisabled', 'editDisabled'])
  }} />
}

const NumberSchema = {
  type: "object",
  name: _r("数字"),
  title: _r("数字"),
  icon: "inbox",
  key: "number",
  description: _r('支持In32、In64和Double类型数字'),
  properties: {
    textContent: {
      title: _r("内容"),
      type: "string",
      enum: ['origin', 'logic'],
      enum_title: [_r('数字'), _r('公式计算')],
      field: {
        effect: ({ value }, form) => {
          setTimeout(() => {
            const display = value === 'logic'
            form.setFieldData('jsLogic', { display })
            form.setFieldData('dbType', { display: !display })
            form.setFieldData('defaultVal', { display: !display })
            form.setFieldData('min', { display: !display })
            form.setFieldData('max', { display: !display })
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
    bitNum: {
      title: _t1('格式化'),
      type: 'string',
      field: {
        component: props => <C is='Common.NumberFormat' {...props} placeholder={_t1('列表中显示格式')}/>,
      }
    },
    unit: {
      title: _r("数值单位"),
      type: "string"
    },
    decimal: {
      title: _r("小数位数"),
      type: "number"
    },
    dbType: {
      title: _r("类型"),
      type: "string",
      enum1: ['Int32', 'Int64', 'Double'],
      enum_title1: ['Int32', 'Int64', 'Double'],
      selectFace: "flatten",
      selectType: 'single'
    },
    defaultVal: {
      title: _r("默认值"),
      type: "number",
      field: {
        component: (props) => <DVContainer><DefaultNumber {...props} /></DVContainer>,
        hideError: true
      }
    },
    min: {
      title: _r("最小值"),
      type: "number"
    },
    max: {
      title: _r("最大值"),
      type: "number"
    },
    placeholder: {
      title: _r("引导文字"),
      type: "string",
      fieldType: 'languageInput'
    },
    ...baseConfig,
    ...editConfig,
    metricStore
  },
  required: ["title", "key", "dbType"],
  form: [keyForm, "title", "textContent", "jsLogic", "dbType", "bitNum", "unit", "decimal", "min", "metricStore",
    {
      key: "max", validate: (max, values) => {
        if (max && values.min && max < values.min) return _r('最大值不可小于最小值')
      }
    }, "defaultVal", 'allScript', '*'],
  formEffect: form => {
    commonFormEffect(form)
    form.useField('dbType', ({ value }) => {
      form.setFieldData('decimal', { display: value === 'Double' })
      value !== 'Double' && form.change('decimal', null)
    })
  }
}

export default NumberSchema