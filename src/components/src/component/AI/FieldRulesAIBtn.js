import React from "react"
import { app } from "xadmin"
import { C } from "xadmin-ui"
import { getFields } from "./TableFieldAIBtn"

const FieldRulesAIBtn = ({ setItem, schema }) => {
  const [fields, titles] = getFields(schema)
  const { yamlLoad } = app.get('ai')

  return <C
    env='table.fieldRules'
    envKey='tablePluginsFieldRules'
    widgetKey='tablePluginsFieldRules'
    shortcuts={[
      `如果${titles[0]}不是呵呵，就隐藏${titles[1] || titles[0]}`,
      `如果${titles[0]}包含9，就在组件下方提示错误`
    ]}
    inputs={{ fields }}
    callback={(value => {
      let data = _.get(value, 'data.outputs.text')
      const parseData = yamlLoad(data)

      if (!_.isEmpty(parseData)) setItem(before => ({ ...before, fieldRules: parseData }))
    })}
    is='AI.Button'
  />
}

export default FieldRulesAIBtn
