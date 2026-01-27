import React from "react"
import { Select, message, Button, Modal, Tooltip } from 'antd'
import { SwapOutlined } from '@ant-design/icons';
import { use } from "xadmin";
import { LogicInput } from "../schema/formula";

const DefaultValContainer = ({ children }) => {
  const { defaultValType, form, __name__ } = use('form', state => ({
    __name__: state.values?.__name__,
    defaultValType: state.values?.defaultValType
  }))

  if (__name__) { // 画面中的数据表组件
    return children
  }

  return <>
    <div style={{ width: '80%', display: 'inline-block' }}>
      {
        defaultValType === 'logic' ? <LogicInput
          key1="defaultVal"
          key2="defaultValOrigin"
          btnStyle={{ width: '100%' }}
          type="defaultVal"
        /> : children
      }
    </div>
    <div style={{ width: '20%', display: children ? 'inline-block' : 'none', verticalAlign: 'top' }}>
      <Tooltip title={defaultValType === 'logic' ? _t1('切换指定默认值') : _t1('切换公式绑定')} >
        <Button onClick={() => {
          form.change('defaultValType', defaultValType === 'logic' ? 'value' : 'logic')
          form.change('defaultVal', null)
        }}><SwapOutlined /></Button>
      </Tooltip>
    </div>
  </>
}

export default DefaultValContainer
