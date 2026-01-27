import React from 'react'
import { app, api, use } from 'xadmin'
import { DatePicker, TimePicker, Form } from 'antd'
import moment from 'moment'
import { getFormValues } from '../component/Editor/utils'
import { useScriptVal } from '../component/Editor/utils2'
import { dealSchema } from './tool'

const DateComponent = props => {

  const { input, meta, field: { schema }, antdForm, style } = props
  const { value, onChange } = input

  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)

  const { format, format2, disabled, defaultVal, defaultValType, afterNow } = dealSchema(schema, values, meta)

  const timeFormat = format === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'

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
  const dateFormat = val => {
    if (!val) return null
    let time
    if (val.includes && val.includes(' - ')) {
      time = null
    } else {
      time = moment(val, timeFormat)
    }
    return time
  }

  const onDateChange = e => {
    if (!e) {
      onChange(null)
      return
    }
    onChange(moment(e).format(timeFormat))
  }

  const disabledDate = (current) => {
    return afterNow && current && current < moment().subtract(1, 'days');
  }

  const pickerProp = {
    'ym': { picker: 'month' },
    'date': { picker: 'date' },
    'datetime': { picker: 'date', showTime: true },
    'ymdh': { picker: 'date', showTime: true, format: "YYYY-MM-DD HH" }
  }

  return <DatePicker
    {...input}
    {...pickerProp[format2] || pickerProp[format] || {}}
    style={style}
    value={dateFormat(value)}
    onChange={onDateChange}
    disabled={disabled}
    size={schema.size}
    disabledDate={disabledDate}
    onBlur={e => { onDateChange(e.target.value) }}
  />
}

export default DateComponent
