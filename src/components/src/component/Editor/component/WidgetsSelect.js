import React from "react"
import { use } from "xadmin"
import { Select } from "antd"
import { addDefaultVal } from "../utils"
import getWidgets from "../wigets"

const WidgetsSelect = ({ input }) => {
  const { hideScript } = use('i18n.permission')
  const [disabled, setDisabled] = React.useState(!!input.value)
  const widgets = getWidgets(_t1, hideScript) || []
  const options = widgets.filter(w => {
    return ['文本', '数字', '时间', '布尔值'].indexOf(w.config) > -1
  }).map(w => ({ label: w.config, value: w.config }))
  return <Select
    style={{ width: 200 }}
    options={options}
    value={input.value?.config}
    disabled={disabled}
    onChange={v => {
      let card = widgets.find(w => w.config === v)
      let result = {
        ...(addDefaultVal(card, _t1) || {}),
        "fixedField": true,
        "createShow": false,
        "editShow": false
      }
      // 数据点显示到列，数字默认double类型
      if (result.dbType === 'Int32') result.dbType = 'Double'
      input.onChange(result)
    }}
  />
}

export default WidgetsSelect
