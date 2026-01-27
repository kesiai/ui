import React from 'react'
import { TimePicker, Form } from 'antd'
import moment from 'moment'
import { getFormValues } from '../component/Editor/utils'
import { useScriptVal } from '../component/Editor/utils2'
import { dealSchema } from './tool'

const TimeComponent = props => {

  const { input, field: { schema }, antdForm, style, meta } = props
  const { value, onChange } = input

  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)

  const { timeFormat, disabled, defaultVal, defaultValType } = dealSchema(schema, values, meta)

  // 默认值生效
  React.useEffect(() => {
    setTimeout(() => { // 必须用setTimeout，否则会被拦截
      !value && defaultVal && defaultValType !== 'logic' && onChange && onChange(defaultVal)
    })
  }, [])
  
  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema, value, values, record: props.record, onChange })
    }
  }, [JSON.stringify(values)])

  // 时间格式化
  const tFormat = val => {
    if (!val) return null
    let time
    if (val.includes && val.includes(' - ')) {
      time = null
    } else {
      time = moment(val, timeFormat)
    }
    return time
  }

  const onTimeChange = e => {
    if (!e) {
      onChange(null)
      return
    }
    onChange(moment(e).format(timeFormat))
  }

  return (
    <TimePicker
      {...input}
      style={style}
      format={timeFormat}
      value={tFormat(value)}
      onChange={onTimeChange}
      disabled={disabled}
      size={schema.size}
    />
  )
}

export default TimeComponent
