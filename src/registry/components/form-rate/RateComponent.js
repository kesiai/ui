import React from 'react'
import { Rate, Form } from 'antd'
import { getFormValues } from '../component/Editor/utils'
import { useScriptVal } from '../component/Editor/utils2'
import _ from 'lodash'
import { LineOutlined } from '@ant-design/icons'
import './RateComponent.css'
import { dealSchema } from './tool'

const RateComponent = ({ input: { value, onChange }, field: { schema }, record, antdForm, meta }) => {

  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)

  const { count, disabled, defaultVal, inList, defaultValType } = dealSchema(schema, values, meta)
  

  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema, value, values, record, onChange })
    }
  }, [JSON.stringify(values)])

  React.useEffect(() => {
    setTimeout(() => {
      !value && defaultVal && defaultValType !== 'logic' && onChange && onChange(defaultVal)
    })
  }, [])

  const character = count > 5 && { character: <LineOutlined style={{ fontSize: inList ? 19 : 38 }} /> }
  const currentValue = _.isNil(value) || value === '' ? defaultVal : value
  const className = currentValue ? (currentValue < 5 ? 'custom-rate-danger' : currentValue < 8 ? 'custom-rate-warn' : 'custom-rate-success') : 'custom-rate-null'

  return (
    <span style={{ display: 'block' }} className={count > 5 ? 'custom-rate custom-rate-line' : 'custom-rate'}>
      {!_.isNil(value) && count > 5 &&
        <span style={{ marginRight: 5, display: 'inline-block', width: inList ? 30 : 40 }}>{inList ? value + _t1('级') : (currentValue || 0) + '/' + count}</span>}
      {!value && inList ? null :
        <Rate
          allowClear
          onChange={onChange}
          value={value === '' ? undefined : value}
          defaultValue={defaultVal}
          count={count}
          disabled={disabled}
          className={count > 5 && className}
          {...character}
        />}
    </span>
  )
}

export default RateComponent