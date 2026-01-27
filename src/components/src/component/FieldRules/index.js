import React from 'react';
import { use } from 'xadmin';
import MutualRules from './MutualRules';
import ErrorNotice from './ErrorNotice';
import { Tabs } from 'antd';
import './index.css'
import { getMutualRules, getErrorNotice, getOneError, getErrorNotice2, FormContext } from './getMutualRules'
import FieldRulesAIBtn from '../AI/FieldRulesAIBtn';
const { TabPane } = Tabs;

const FieldRules = (props) => {
  const [item, setItem] = React.useState(props.item)
  const saveItem = v => {
    setItem(before => ({
      ...(before || {}),
      ...(v || {})
    }))
    return props.saveItem(v)
  }
  const { hiddenMutualRules } = props
  const w = document.body.clientWidth
  return (
    <div className="field-rule-content">
      <div style={{ position: 'absolute', top: 100, left: '4%', zIndex: 99 }}>
        <FieldRulesAIBtn setItem={setItem} schema={item.schema} />
      </div>
      <Tabs className='old-tab' tabPosition="left" style={{ flexGrow: 2 }}
        tabBarStyle={{ width: w < 1400 ? 150 : 250 }} >
          {!hiddenMutualRules && <TabPane tab={_t1("交互规则")} key="1">
            <MutualRules {...props} item={item} saveItem={saveItem} />
          </TabPane>}
          <TabPane tab={_t1("错误提示")} key="2">
            <ErrorNotice {...props} item={item} saveItem={saveItem} />
          </TabPane>
        </Tabs>
    </div>
  )
}

export default {
  name: 'airiot.plugin.fieldRules',
  plugins: {
    name: _r('字段规则'),
    key: 'fieldRules',
    pluginGroup: _r('通用表功能'),
    useSetting: ({ data }) => {
      const { saveItem } = use('model.save')
      return { element: <FieldRules item={data} saveItem={saveItem} id={data.id} /> }
    },
    description: {
      content: _r(`【字段规则】表功能应用后，可实现当前表中的字段规则设置，包括字段的显示与隐藏、字段错误提示规则。应用后表的配置TAB会相应的增加一个，创建表记录时，表记录会自动适用此规则`),
      config: [
        {
          name: _r('交互规则'),
          info: _r('通过交互规则实现记录录入的校验。当条件满足时，显示或者隐藏部分字段')
        },
        {
          name: _r('错误提示'),
          info: _r('通过错误提示实现记录录入的校验。当条件满足时进行错误提示')
        }
      ]
    }
  },
  items: {
    fieldRules: { type: 'map' }
  },
  fieldRules: {
    getMutualRules, getErrorNotice, getOneError, getErrorNotice2
  },
  hooks: {
    // 表数据表单上下文
    'table.form.context': () => {
      const context = React.useContext(FormContext)
      return { FormContext, context }
    }
  }
}
export { FieldRules }
