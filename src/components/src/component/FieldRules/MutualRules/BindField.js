import React from 'react'
import _ from 'lodash'
import { Select, message, Button, Modal } from 'antd'
import { app, api, use } from 'xadmin'
import { C, Loading } from 'xadmin-ui'
import { SwapOutlined } from '@ant-design/icons';

const SchemaContext = React.createContext()

const BindField = props => {
  const { input, children } = props
  const [bind, setBind] = React.useState(input.value?.origin)
  const { schema } = React.useContext(SchemaContext)

  const handleChange = val => {
    input.onChange(val)
  }

  return <>
    <div style={{ width: '90%', display: 'inline-block', verticalAlign: 'middle' }}>
      {
        bind ? <C 
          is='CodeEditor.VariableEditor'
          schema={schema || []}
          // placement="right"
          value={input.value}
          onChange={handleChange}
        /> : children
      }
    </div>
    <div style={{ width: '10%', display: 'inline-block' }}>
      <Button onClick={() => {
        input.onChange(null)
        setBind(before => !before)
      }}><SwapOutlined /></Button>
    </div>
  </>
}

export { SchemaContext }
export default BindField
