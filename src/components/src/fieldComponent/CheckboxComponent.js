import React from 'react'
import { app, api, use } from 'xadmin'
import { Checkbox, Switch, Form } from 'antd'
import { getFormValues } from '../component/Editor/utils'
import { useScriptVal } from '../component/Editor/utils2'
import { dealSchema } from './tool'

const CheckboxComponent = ({ input, label, field, meta, group: FieldGroup, schema, record, antdForm }) => {

  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)

  const { defaultVal, disabled, displayForm, checkedChildren, unCheckedChildren } = dealSchema(schema, values, meta)

  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({
        schema,
        value: input.value,
        values,
        record,
        onChange: input.onChange
      })
    }
  }, [JSON.stringify(values)])

  React.useEffect(() => {
    if (_.isNil(input.value) || input.value === '') {
      input.onChange && input.onChange(!!defaultVal)
    }
  }, [])

  const checked = input.value === '' ? defaultVal : !!input.value
  
  const TempComponent = () => displayForm == 'switch' ?
    <Switch checked={checked} defaultChecked={defaultVal} checkedChildren={checkedChildren} unCheckedChildren={unCheckedChildren} onChange={input.onChange} disabled={disabled} {...field.attrs} /> :
    <Checkbox checked={checked} defaultChecked={defaultVal} onChange={(arg) => { input.onChange(arg?.target?.checked) }} disabled={disabled} {...field.attrs}>{label || field?.label}</Checkbox>
  return FieldGroup ? <FieldGroup meta={meta} input={input} field={field} tailLayout={true}>
    <TempComponent />
  </FieldGroup> : <TempComponent />
}
CheckboxComponent.useGroup = false

export default CheckboxComponent
