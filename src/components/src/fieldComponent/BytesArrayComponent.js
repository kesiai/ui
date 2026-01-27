import React from 'react'
import { Input, Form } from 'antd'
import { app, api } from 'xadmin'
import _ from 'lodash'
import { getFormValues } from '../component/Editor/utils'
import { useScriptVal } from '../component/Editor/utils2'
import { dealSchema } from './tool'

const BytesArrayComponent = props => {
  const { input, field: { schema, filter }, antdForm } = props
  const { onChange, value } = input

  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)

  const { placeholder, defaultVal, disabled } = dealSchema(schema, values)
  

  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema, value, values, record: props.record, onChange })
    }
  }, [JSON.stringify(values)])

  const defaultValue = filter ? undefined : defaultVal

  React.useEffect(() => {
    !value && defaultValue && onChange && onChange(defaultValue)
  }, [])

  const handleChange = val => {
    onChange(val.target.value)
  }

  const str = placeholder || _t1('请输入内容')

  return <Input
    {...input}
    defaultValue={defaultValue}
    onChange={handleChange}
    placeholder={str} 
    disabled={disabled}
  />
}

export default BytesArrayComponent
