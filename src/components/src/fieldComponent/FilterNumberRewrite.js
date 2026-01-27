import React from 'react'
import _ from 'lodash'
import app from 'xadmin'
import { InputNumber } from 'antd'

const NumberFilter = props => {
  const { input: { name, value={}, onBlur, onChange, ...inputProps }, field } = props
  const { _t } = app.context
  

  const gte = !_.isNil(value?.gte) ? value.gte : ''
  const lte = !_.isNil(value?.lte) ? value.lte : ''

  const inputChange = (v, k) => {
    onChange(_.pickBy({ ...value, [k]: v }, _.isNumber))
  }

  return (
    <div style={{ display: 'inline-flex' }}>
      <InputNumber {...inputProps} {...field.attrs} style={{ width: 'auto', ...field.style }} value={gte}
        placeholder={field.minimum ? `${_t1('最小值')}(${field.minimum})` : _t1('无限制')}
        onChange={v => inputChange(v, 'gte')} />
      <span style={{ textAlign: 'center', width: '2rem', lineHeight: '30px' }}>~</span>
      <InputNumber {...inputProps} {...field.attrs} style={{ width: 'auto', ...field.style }} value={lte}
        placeholder={field.maximum ? `${_t1('最大值')}(${field.maximum})` : _t1('无限制')}
        onChange={v => inputChange(v, 'lte')} />
    </div>
  )
}

export default NumberFilter
