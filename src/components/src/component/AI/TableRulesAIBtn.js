import React from "react"
import { C } from "xadmin-ui"
import { getFields } from "./TableFieldAIBtn"

const TableRulesAIBtn = ({ schema, setCode }) => {
  const [fields, titles] = getFields(schema)

  return <C
    env='table.rules'
    envKey='scriptTableRules'
    widgetKey='scriptTableRules'
    shortcuts={[
      `隐藏${titles[0]}`,
      `把${titles[1] || titles[0]}改成88`
    ]}
    inputs={{ fields }}
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

export default TableRulesAIBtn
