import React from "react"
import { C } from "xadmin-ui"
import { use } from "xadmin"

const FormInfoAIBtn = ({ setCode }) => {
  return <C
    envKey='scriptTableFormInfo'
    widgetKey='scriptTableFormInfo'
    shortcuts={[
      '显示当前时间',
      '显示一条灰色的线'
    ]}
    callback={(value => {
      let data = _.get(value, 'data.outputs.text')
      if (data && data?.indexOf('```javascript') >= 0) {
        data = data.replace('```javascript', '').replace('```', '')
      }
      if (data) setCode(data)
    })}
    is='AI.Button'
  />
}

export default FormInfoAIBtn
