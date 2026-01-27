import React from 'react'
import { DatePicker, Form, TimePicker } from 'antd'
import moment from 'moment'
import { getFormValues } from '../component/Editor/utils'
import { useScriptVal } from '../component/Editor/utils2'
import _ from 'lodash'
import { dealSchema } from './tool'
const DateRangeComponent = props => {

  const { input, meta, field: { schema }, antdForm, cellKey } = props
  const { value, onChange } = input

  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)

  const { dateFormat, disabled, defaultVal, defaultValType } = dealSchema(schema, values, meta)

  const formats = {
    'date': 'YYYY-MM-DD',
    'datetime': 'YYYY-MM-DD HH:mm:ss',
    'time': 'HH:mm:ss'
  }
  const timeFormat = formats[dateFormat]
  const [state, setState] = React.useState(value || [])

  // 默认值生效
  React.useEffect(() => {
    setTimeout(() => { // 必须用setTimeout，否则会被拦截
      if (!value && defaultVal && onChange && defaultValType !== 'logic') {
        onChange(defaultVal)
        setState(defaultVal)
      }
    })
  }, [])

  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema, value, values, record: props.record, onChange })
    }
  }, [JSON.stringify(values)])

  // 时间格式化
  const formatter = val => {
    if (val && val.indexOf(' - ') > -1) {
      return val.split(' - ').map(v => v ? moment(v, timeFormat) : undefined)
    } else if (_.isArray(val)) {
      return val.map(v => !!v ? moment(v, timeFormat) : undefined)
    } else {
      return null
    }
  }

  const onDateChange = val => {
    if (!val || val.length !== 2 && !_.isString(val)) {
      onChange && onChange(null)
      return
    }
    if (_.isString(val) && val.indexOf(' - ') > -1) {
      onChange && onChange(val)
      return
    }
    if (_.isArray(val) && val.length <= 2 && val[0] && val[1]) {
      onChange && onChange(val.map(v => moment(v).format(timeFormat)).join(' - '))
      return
    }
    if (_.isArray(val) && val.length <= 2 && val[0] && !val[1]) {
      onChange && onChange(moment(val[0]).format(timeFormat) + ' - ')
      return
    }
    if (_.isArray(val) && val.length <= 2 && !val[0] && val[1]) {
      onChange && onChange(' - ' + moment(val[1]).format(timeFormat))
      return
    }
  }
  React.useEffect(() => {
    setState(value)
  }, [value])
  React.useEffect(() => {
    let _data = state
    if (_.isArray(state) && state.length === 2 && state[0] && state[1]) {
      _data = state?.map(v => moment(v).format(timeFormat)).join(' - ')
    } else if (_.isString(state)) {
      _data = state
    } else if (_.isArray(state) && state.length === 1) {
      _data = state[0] || state[1]
    }
    onDateChange(_data)
  }, [state])

  const RangePicker = dateFormat === 'time' ? TimePicker.RangePicker : DatePicker.RangePicker
  return (
    <div onBlur={e => {
      let arr = state && _.isArray(state) ? [...state] : []
      if (_.isString(state)) {
        arr = state.split(' - ').map(v => v ? moment(v, timeFormat) : undefined)
      }
      if (e?.target?.placeholder == '开始日期') {
        if (!state) {
          arr = !!e?.target?.value ? [moment(e?.target?.value)] : []
        } else {
          arr[0] = e?.target?.value ? moment(e?.target?.value) : undefined
        }
        setState(arr)
      }
      if (e?.target?.placeholder == '结束日期') {
        if (!state) {
          arr = !!e?.target?.value ? [undefined, moment(e?.target?.value)] : []
        } else {
          if (!arr[0] && e?.target?.value) {
            arr = [undefined, moment(e?.target?.value)]
          }
          if (arr[0] && e?.target?.value) {
            arr[1] = moment(e?.target?.value)
          }
        }
        setState(arr)
      }
    }}><RangePicker
        allowClear
        value={formatter(state)}
        onChange={value => {
          onDateChange(value);
          setState(value)
        }}
        showTime={dateFormat !== 'date'}
        disabled={disabled}
        allowEmpty={[false, true]}
        // onBlur={handelBlur}
        size={schema.size}
        popupClassName={cellKey ? `dropdown_${cellKey}` : null}
      /></div>

  )
}

export default DateRangeComponent
