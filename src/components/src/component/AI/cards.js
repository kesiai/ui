import { Button } from "antd"
import { use } from 'xadmin'

const TablePluginsPermission = props => {
  const callbackFns = use('ai.callback.value')

  let data = _.get(props, 'data.data.outputs.text')
  if (!data) {
    return '☹️ 失败'
  }
  if (data && data?.indexOf('```json') >= 0) {
    data = data.slice(7, -3)
  }

  const parseData = JSON.parse(data)

  const onClick = () => {
    const setConfig = callbackFns['tablePluginsPermission']
    setConfig && setConfig(parseData)
  }

  return (<div>
    <div> 成功 ✅ </div>
    <Button size="small" onClick={onClick}>应用</Button>
  </div>)
}

const ScriptTableField = props => {
  const callbackFns = use('ai.callback.value')

  let data = _.get(props, 'data.data.outputs.text')
  
  if (!data) {
    return '☹️ 失败'
  }
  if (data && data?.indexOf('```javascript') >= 0) {
    data = data.replace('```javascript', '').replace('```', '')
  }

  const onClick = () => {
    const setConfig = callbackFns['scriptTableField']
    setConfig && setConfig(data)
  }

  return (<div>
    <div> 成功 ✅ </div>
    <Button size="small" onClick={onClick}>应用</Button>
  </div>)
}

export default {
  'tablePluginsPermission': TablePluginsPermission,
  'scriptTableField': ScriptTableField
}
