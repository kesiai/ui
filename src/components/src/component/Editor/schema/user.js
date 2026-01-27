import React from 'react'
import { use } from 'xadmin'
import { Input } from 'antd'
import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput } from './common'

const KeyComponent = ({ input }) => {
  const [val, setVal] = React.useState(input.value)
  const [disabled, setDisabled] = React.useState(false)
  const { form } = use('form')
  React.useEffect(() => {
    form.useField('userType', ({ value }) => {
      if (value) {
        setDisabled(true)
        input.onChange(value)
      } else {
        setDisabled(false)
      }
    })
  }, [])
  return <Input value={val} disabled={disabled} onChange={e => setVal(e.target.value)} onBlur={() => input.onChange(val)} />
}

const UserSchema = {
  type: "object",
  name: _r("用户"),
  title: _r("用户"),
  description:_r('用于显示用户，用户可以是创建人或修改人'),
  icon: "inbox",
  key: "date",
  properties: {
    ...baseConfig,
    userType: {
      title: _r("用户类型"),
      type: "string",
      enum1: ['creator', 'modifyUser'],
      enum_title1: [_r('创建人'), _r('修改人')],
      selectFace: "flatten",
      selectType: 'single'
    },
    relateTo: {
      title: "",
      type: "string",
    },
    ...editConfig
  },
  required: ["title", "key"],
  form: [
    { ...keyForm, component: KeyComponent }, "title", "userType", 'description',
    'descriptionType', 'listFields', 'widthInForm', 'tableFixed', 'createShow', 'editShow'
  ]
}

export default UserSchema
