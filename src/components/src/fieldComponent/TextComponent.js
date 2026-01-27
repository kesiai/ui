import React from 'react'
import { Input, Form } from 'antd'
import { use , app } from 'xadmin'
import _ from 'lodash'
import { getFormValues } from '../component/Editor/utils'
import { useScriptVal } from '../component/Editor/utils2'
import LanguageType from '../component/Editor/component/LanguageType'
import { dealSchema } from './tool'

const TextComponent = props => {
  const { input, field: { schema, filter }, antdForm, meta } = props
  const { onChange, value } = input
  const language = app?.context?.language 
  let model
  try {
    model = use('model')?.model
  } catch (e){}

  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)

  const { textType, textContent = 'text', placeholder, defaultVal, defaultValType, disabled, delBlank } = dealSchema(schema, values, meta)
  
  const langDef = schema?.[`defaultVal_${language}`];

  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema, value, values, record: props.record, onChange })
    }
  }, [JSON.stringify(values)])

  const defaultValue = filter ? undefined : language == 'zh_Hans' ? defaultVal : langDef 

  // 默认值生效
  React.useEffect(() => {
    setTimeout(() => { // 必须用setTimeout，否则会被拦截
      !value && defaultValue && defaultValType !== 'logic' && onChange && onChange(defaultValue)
    })
  }, [])

  const handleChange = val => {
    onChange(val.target.value || null)
  }

  const handleBlur = (e) => {
    if (delBlank && e.target.value) {
      onChange(e.target.value.trim())
    }
    input.onBlur && input.onBlur(e)
  }

  const str = placeholder || _t1('请输入文本内容')

  return (
    textType === 'textArea' ?
      <Input.TextArea {...input} defaultValue={defaultValue} onChange={handleChange} placeholder={str}
       type={textContent} disabled={disabled} onBlur={handleBlur} size={schema.size}></Input.TextArea> :
      (textContent === 'password' ? 
      <Input.Password {...input} defaultValue={defaultValue} onChange={handleChange} placeholder={str}
       type={textContent} disabled={disabled} size={schema.size}></Input.Password> :
      <>
      <LanguageType input={input} field={{
        ...(props.field || {}),
        value: input.value,
        onChange: handleChange,
        onBlur: handleBlur,
        type: textContent,
        disabled,
        placeholder: str,
        tableInfo: model?.table,
        size: schema.size
      }} />
      </>
      )
  )
}

export default TextComponent
