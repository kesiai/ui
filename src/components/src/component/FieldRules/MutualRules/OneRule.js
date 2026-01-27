import React from 'react'
import { api, use } from 'xadmin'
import { C } from 'xadmin-ui'
import { Tag, Input, Checkbox, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import FieldShowHide from './FieldShowHide'
import { fieldFilter } from '../components'
import BindField from './BindField'
import { SchemaContext } from './BindField'


const OneRule = props => {
  const { schema = { properties: {} }, oneItem, saveOneName, saveOneCondition, saveOneAction, saveOneDisabled, id } = props
  const [ name, setName ] = React.useState(oneItem.name)
  const { hideScript } = use('i18n.permission')

  return (<div style={{ maxHeight: 400, overflowY: 'scroll' }} >
    <Input
      value={name}
      onChange={e => setName(e.target.value)}
      onBlur={e => saveOneName(e.target.value)}
      style={{ marginBottom: 10 }}
    />
    <div style={{ marginBottom: 10 }}>
      {_t1('触发条件')}：
      <SchemaContext.Provider value={{ schema }}>
        <C
          is="QueryEditor"
          style={{ marginTop: 10 }}
          DataWrap={hideScript ? null : BindField}
          schema={fieldFilter(schema || { properties: {} })}
          input={{ value: oneItem.condition, onChange: saveOneCondition }}
        />
      </SchemaContext.Provider>
    </div>
    <div>
      {_t1('执行动作')}：
      <FieldShowHide schema={fieldFilter(schema)} id={id} item={oneItem} input={{ value: oneItem.action, onChange: saveOneAction }} />
    </div>
    <div>
      <Checkbox checked={oneItem.disabled} onChange={e => saveOneDisabled(e.target.checked)}>
        {_t1('禁用')}
        <Tooltip title={_t1('禁用后当前字段规则不生效')}>
          <QuestionCircleOutlined style={{ marginLeft: 8 }} />
        </Tooltip>
      </Checkbox>
    </div>
  </div>)
}


export default OneRule
