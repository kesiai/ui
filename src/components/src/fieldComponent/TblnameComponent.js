import React from 'react'
import _ from 'lodash'
import { Select, message, Button, Modal, Input } from 'antd'
import { app, api, use } from 'xadmin'
import { C, Loading } from 'xadmin-ui'
import { SwapOutlined } from '@ant-design/icons';

const TblnameComponent = (props) => {
  const { input, option, field } = props

  let form, originValue
  const originKey = 'tsSubTableSetting'
  try {
    form = use('form').form
    const tsVal = form.getState().values[originKey]
    originValue = _.isString(tsVal) ? JSON.parse(tsVal) : tsVal
  } catch (e) {}

  const [bind, setBind] = React.useState(originValue?.stringify === input.value)
  const tableSchemaP = option?.schema?.properties || {}
  let schema = {
    type: 'object',
    properties: {}
  }
  Object.keys(tableSchemaP).forEach(key => {
    if (['文本', '布尔值', '数字'].indexOf(tableSchemaP[key].config) > -1) {
      schema.properties[key] = tableSchemaP[key]
    }
  })

  const handleChange = val => {
    input.onChange(val?.stringify)
    form?.change(originKey, val)
  }

  return <>
    <div style={{ width: 'calc(100% - 45px)', display: 'inline-block', verticalAlign: 'middle' }}>
      {
        bind ? <C 
          is='CodeEditor.VariableEditor'
          schema={field?.tableSchema || schema || []}
          // placement="right"
          value={originValue}
          onChange={handleChange}
        /> : <Input {...input} />
      }
    </div>
    <div style={{ width: 45, display: 'inline-block', verticalAlign: 'middle' }}>
      <Button style={{ width: '100%' }} onClick={() => {
        input.onChange(null)
        form?.change(originKey, null)
        setBind(before => !before)
      }}><SwapOutlined /></Button>
    </div>
  </>
}

export default TblnameComponent
