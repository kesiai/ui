import React from 'react'
import { app, api, use } from 'xadmin'
import { InputNumber, Input, Form } from 'antd'
import { getFormValues, ifNull } from '../component/Editor/utils'
import { useScriptVal } from '../component/Editor/utils2'
import _ from 'lodash'
import { dealSchema } from './tool'

const NumberComponent = props => {

  const { input: { onChange }, input, field: { schema, filter }, meta, antdForm } = props

  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)

  const { unit, placeholder, decimal, defaultVal, disabled, max, min } = dealSchema(schema, values, meta)

  const value = _.isNumber(input.value) ? input.value : undefined
  const defaultValue = !filter && _.isNumber(defaultVal) ? defaultVal : undefined

  // 默认值生效
  React.useEffect(() => {
    setTimeout(() => { // 必须用setTimeout，否则会被拦截
      (ifNull(value) || _.isUndefined(value))
        && [null, undefined, ''].indexOf(defaultValue) === -1
        && onChange && onChange(defaultValue)
    })
  }, [])

  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema, value, values, record: props.record, onChange })
    }
  }, [JSON.stringify(values)])
  
  return <InputNumber
    {...input} value={value} defaultValue={defaultValue} onChange={onChange} precision={_.isNull(decimal) ? undefined : decimal} disabled={disabled}
    placeholder={placeholder||_t1('请输入数字')} addonAfter={_t1(unit)} style={{ width: '100%' }} size={schema.size} max={max} min={min}>
  </InputNumber>
}

export default NumberComponent
