import React from 'react'
import { use } from 'xadmin'
import { C } from 'xadmin-ui'
import DateRangeComponent from '../../../fieldComponent/DateRangeComponent'
import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput } from './common'
import DVContainer from '../component/DefaultValContainer'

const DefaultDateRange = (props) => {
  const { form } = use('form')
  const [sch, setSch] = React.useState({})

  React.useEffect(() => {
    form.useEffect(({ values }) => {
      setSch(values)
    })
  }, [])

  return <DateRangeComponent {...props} field={{ ...props.field, schema: _.omit(sch, ['disabled', 'createDisabled', 'editDisabled']) }} />
}

const DateRangeSchema = {
  type: "object",
  name: _r("日期范围"),
  title: _r("日期范围"),
  description: _r('可选择日期范围'),
  icon: "inbox",
  key: "dateRange",
  properties: {
    ...baseConfig,
    dateFormat: {
      title: _r("格式"),
      type: "string",
      enum1: ['date', 'datetime', 'time'],
      enum_title1: [_r('年月日'), _r('年月日-时分秒'), _r('时分秒')],
      selectFace: "flatten",
      selectType: 'single'
    },
    filedFormat: {
      title: _t1('格式化'),
      type: 'string',
      field: {
        component: props => <C is='Common.DateFormat' {...props} placeholder={_t1('列表中显示格式')} />,
      }
    },
    NullShow: {
      title: _t1('时段终点'),
      type: 'string',
      enum1: ['forever', 'toNow'],
      enum_title1: [_r('长期'), _r('至今')],
      selectFace: "flatten",
      selectType: 'single',
      description: _r('定义结束日期为空时的终止状态。至今：开始日期到当前时刻；长期：开始日期到永久持续')
    },
    defaultVal: {
      title: _r("默认值"),
      type: "string",
      field: {
        component: (props) => <DVContainer><DefaultDateRange {...props} /></DVContainer>
      }
    },
    ...editConfig
  },
  required: ["title", "key", "dateFormat"],
  form: [keyForm, "title", "dateFormat", '*'],
  formEffect: form => {
    form.setFieldData('filterFields', { display: false })
    commonFormEffect(form)
  }
}

export default DateRangeSchema