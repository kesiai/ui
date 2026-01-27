import React from 'react'
import { app, api, use } from 'xadmin'
import { Select, Checkbox, Radio, Form } from 'antd'
import _ from 'lodash'
import { getFormValues } from '../component/Editor/utils'
import { useScriptVal } from '../component/Editor/utils2'

const RelateComponent = props => {
  const { input: { onChange }, input, field: { schema, internalTable }, displayField, relateSchema = {}, antdForm } = props
  const disabled = props.meta?.data?.disabled || props.disabled || false
  const { model } = use('model')
  const [ops, setOps] = React.useState([])
  const [value, setValue] = React.useState(() => {
    if (props.input.value) {
      if (props.input.value.ne) return 
      if (disabled) return _.isArray(props.input.value) ? props.input.value.map(v => v[displayField]) : props.input.value[displayField]
      return props.input.value.in || props.input.value.nin || props.input.value
    }
    return internalTable ? '' : []
  })

  // 字段脚本部分
  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)
  React.useEffect(() => {
    if (values) {
      useScriptVal({
        schema: relateSchema,
        value: input.value,
        values,
        record: props.record, 
        onChange: v => {
          onChange && onChange(v)
          setValue(_.isArray(v) ? v.map(v => v[displayField]) : v[displayField])
        }
      })
    }
  }, [JSON.stringify(values)])
  
  React.useEffect(() => {
    if (disabled) return
    const key = props.field?.key
    const fieldKey = props.field?.displayField
    model && api(model).query({ fields: [key] }, {}).then(({items}) => {
      const arr = items.filter(v => v[key] && !_.isEmpty(v[key]))
      const optionList = arr.reduce((prev,cur) => prev.map(v => v[key]?.id).includes(cur[key]?.id) ? prev : [...prev,cur],[])
      const options = optionList.map(op => {
        return {
          value: op[key]?.id,
          label: op[key] && (internalTable ? op[key].name : op[key][fieldKey])
        }
      })
      setOps(options)
    })
  }, [])

  const handleChange = val => {
    setValue(val)
    onChange(val && !_.isEmpty(val) ? internalTable ? val : {in: val} : null)
  }

  return (
    <Select
      {...input}
      mode={internalTable ? null : 'multiple'}
      value={value}
      options={ops}
      filterOption={(input, option) => option.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      onChange={handleChange}
      style={{ width: '100%' }}
      placeholder={`${_t1("请选择")}${schema.title||_t1('关联字段')}`}
      disabled={disabled}
      size={schema.size}
      allowClear
      showSearch
    />
  )
}

export default RelateComponent