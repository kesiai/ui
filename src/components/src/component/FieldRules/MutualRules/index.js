import React from 'react'
import { Collapse, Button } from 'antd';
import { api } from 'xadmin'
import { DeleteOutlined } from '@ant-design/icons';
import OneRule from './OneRule';
import { IntroductionTip } from '../components';
import _ from 'lodash'

const { Panel } = Collapse;

const MutualRules = props => {
  const { item, saveItem, id } = props
  
  const [ mutualRules, setMutualRules ] = React.useState([])
  const [activeKey, setActiveKey] = React.useState(['1'])
  const [loading, setLoading] = React.useState(false)
  

  React.useEffect(() => {
    if (!_.isEqual(item.fieldRules?.mutualRules, mutualRules)) {
      setMutualRules(item.fieldRules?.mutualRules || [])
    }
  }, [JSON.stringify(item.fieldRules?.mutualRules || [])])

  const addRule = () => {
    let result = [...mutualRules]
    const key = Math.random()
    result.push({ name: _t1('规则') + (mutualRules.length + 1), key: key, condition: [], action: [] })
    setMutualRules(result)
    setActiveKey([key])
  }

  const delRule = (e, index) => {
    e.stopPropagation()
    setMutualRules(before => {
      let result = _.cloneDeep(before)
      result.splice(index, 1)
      return result
    })
  }

  // 保存规则名称
  const saveOneName = (val, index) => {
    setMutualRules(before => {
      let result = [...before]
      result[index]['name'] = val
      return result
    })
  }

  // 保存触发条件
  const saveOneCondition =  (val, index) => {
    setMutualRules(before => {
      let result = [...before]
      result[index]['condition'] = val
      return result
    })
  }

  // 保存执行动作
  const saveOneAction =  (val, index) => {
    setMutualRules(before => {
      let result = [...before]
      result[index]['action'] = val
      return result
    })
  }

  // 保存禁用配置
  const saveOneDisabled =  (val, index) => {
    setMutualRules(before => {
      let result = [...before]
      result[index]['disabled'] = val
      return result
    })
  }

  const saveRule = () => {
    let hasError
    mutualRules?.forEach(err => {
      if (_.isEmpty(err.condition) || (err.condition && _.flatten(err.condition).find(v => !v?.field || !v?.method))) {
        hasError = true
        err.error = _t1(`触发条件为空或填写不完整`)
      } else if (_.isEmpty(err.action) || err.action?.find(a => !a.field && !a.script)) {
        hasError = true
        err.error = _t1(`执行动作字段存在空项`)
      } else if (err.condition.find(cond => cond.filter(cond2 => cond2.method === 'onchange')?.length > 1)) {
        hasError = true
        err.error = _t1(`触发条件存在多个值变化通过【且】连接`)
      } else {
        delete err.error
      }
    })
    if (hasError) {
      setMutualRules([ ...mutualRules ])
    } else {
      setLoading(true)
      saveItem({
        id,
        fieldRules: {
          ...(item.fieldRules || {}),
          mutualRules
        }
      }).then(() => {
        setLoading(false)
      })
    }
  }
  const [theme, setTheme] = React.useState()
  
  React.useEffect(() => {
    const projectId = api({ name: '' }).getHeaders()['x-request-project']
    const key = projectId ? `airIotTheme/${projectId}` : 'airIotTheme'
    let airIotTheme  = localStorage.getItem(key) || localStorage.getItem('airIotTheme')
    setTheme(airIotTheme)

  }, [theme]);
  const w = document.body.clientWidth
  return (<div style={{ display: 'flex' }}>
    <div style={{ padding: '20px 20px 20px 0', flexGrow: 1, height: 670 }}>
      <IntroductionTip title={_t1('交互规则')} content={_t1('字段内容符合定义的规则后，显示或者隐藏其他字段。')} />
      <Button onClick={addRule} style={{ width: 100, marginBottom: 10 }} >{_t1('添加规则')}</Button>
      <div style={{height: 500, overflowY: 'auto'}}>
        {
          !_.isEmpty(mutualRules) && <Collapse activeKey={activeKey} onChange={val => setActiveKey(val)}>
            {
              mutualRules.map((rule, index) => (
                <Panel
                  header={<>
                    <span style={{ color: rule.disabled ? '#bbb' : theme === 'antdDarkTheme' ? '#fff' : '#333' }} >{rule.name}</span>
                    <span style={{ marginLeft: 10, color: '#ff4d4f' }}>{rule.error||''}</span>
                  </>}
                  extra={
                    <Button onClick={(e) => delRule(e, index)} type="small"><DeleteOutlined /></Button>
                  }
                  key={rule.key}
                >
                  <OneRule
                    id={id}
                    key={index + 1}
                    schema={item.schema}
                    oneItem={rule}
                    saveOneName={val => saveOneName(val, index)}
                    saveOneCondition={val => saveOneCondition(val, index)}
                    saveOneAction={val => saveOneAction(val, index)}
                    saveOneDisabled={val => saveOneDisabled(val, index)}
                  />
                </Panel>
              ))
            }
          </Collapse>
        }
      </div>
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Button type="primary" onClick={saveRule} style={{ marginTop: 10 }} loading={loading} >{_t1('保存')}</Button>
      </div>
    </div>
  </div>)
}

export default MutualRules