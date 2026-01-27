import React from "react"
import { C } from "xadmin-ui"
import { use } from "xadmin"

const getFields = (schema) => {
  let temp = '该表的字段有：'
  let titles = []
  if (!_.isEmpty(schema?.properties)) {
    Object.keys(schema.properties).forEach(key => {
      temp = temp + schema.properties[key]?.title + '(' + key + ')，'
      titles.push(schema.properties[key]?.title)
    })
  }
  return [temp, titles]
}

const TableFieldAIBtn = ({ schema, setCode }) => {
  const [fields, titles] = getFields(schema)

  return <C
    env='table.field'
    envKey='scriptTableField'
    widgetKey='scriptTableField'
    shortcuts={[
      `该字段值是${titles[0]}字段后面拼接哈哈`,
      '把字段渲染成绿色背景',
      '该字段长度不能大于3'
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

export { getFields }
export default TableFieldAIBtn
