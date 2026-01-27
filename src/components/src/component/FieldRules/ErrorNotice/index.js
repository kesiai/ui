import React from 'react'
import { Collapse, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import OneNotice from './OneNotice';
import { IntroductionTip } from '../components';

const { Panel } = Collapse;

const ErrorNotice = props => {
  const { item, saveItem, id } = props
  
  const [ errorNotice, setErrorNotice ] = React.useState([])
  const [activeKey, setActiveKey] = React.useState(['1'])
  const [loading, setLoading] = React.useState(false)
  

  React.useEffect(() => {
    if (!_.isEqual(item.fieldRules?.errorNotice, errorNotice)) {
      setErrorNotice(item.fieldRules?.errorNotice || [])
    }
  }, [JSON.stringify(item.fieldRules?.errorNotice)])

  const addRule = () => {
    let result = [...errorNotice]
    const key = Math.random()
    result.push({ name: _t1('提示') + (errorNotice.length + 1), key: key, condition: [], noticeList: [] })
    setErrorNotice(result)
    setActiveKey([key])
  }

  const delRule = (e, index) => {
    e.stopPropagation()
    setErrorNotice(before => {
      let result = [...before]
      result.splice(index, 1)
      return result
    })

  }

  // 保存一条错误提示
  const saveOneNotice =  (val, type, index) => {
    setErrorNotice(before => {
      let result = [...before]
      result[index][type] = val
      return result
    })
  }

  const saveRule = () => {
    let hasError
    errorNotice?.forEach(err => {
      if (_.isEmpty(err.condition) || (err.condition && _.flatten(err.condition).find(v => !v?.field || !v?.method))) {
        hasError = true
        err.error = _t1(`触发条件为空或填写不完整`)
      } else if (!err.noticeType) {
        hasError = true
        err.error = _t1(`提示方式为空`)
      }  else if (err.noticeType == 'redText' && err.noticeList?.find(n => !n.field)) {
        hasError = true
        err.error = _t1(`提示字段存在空项`)
      } else if (err.noticeType == 'redText' && err.noticeList?.find(n => !n.message)) {
        hasError = true
        err.error = _t1(`提示内容存在空项`)
      } else {
        delete err.error
      }
    })
    if (hasError) {
      setErrorNotice([ ...errorNotice ])
    } else {
      setLoading(true)
      saveItem({
        id,
        fieldRules: {
          ...(item.fieldRules || {}),
          errorNotice
        }
      }).then(() => {
        setLoading(false)
      })
    }
  }

  return (<div style={{ display: 'flex' }}>
    <div style={{ padding: '20px 20px 20px 0', flexGrow: 1, height: 670, overflowY: 'auto' }}>
      <IntroductionTip title={_t1('错误提示')} content={_t1('通过错误提示实现记录录入的校验。当条件满足时，进行错误提示。')} />
      <Button onClick={addRule} style={{ width: 100, marginBottom: 10 }} >{_t1('添加提示')}</Button>
      <div style={{height: 500, overflowY: 'auto'}}>
        {
          !_.isEmpty(errorNotice) && <Collapse activeKey={activeKey} onChange={val => setActiveKey(val)}>
            {
              errorNotice.map((rule, index) => (
                <Panel
                  header={<>{rule.name}<span style={{ marginLeft: 10, color: '#ff4d4f' }}>{rule.error||''}</span></>}
                  extra={
                    <Button onClick={(e) => delRule(e, index)} type="small"><DeleteOutlined /></Button>
                  }
                  key={rule.key}
                >
                  <OneNotice
                    id={id}
                    schema={item.schema}
                    oneItem={rule}
                    saveOneNotice={(val, type) => saveOneNotice(val, type, index)}
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

export default ErrorNotice
