import React from 'react'
import { api } from 'xadmin';
import { Button, Select, Row, Col, Form, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'
import { fieldFilter } from '../components';
import LanguageType from '../../Editor/component/LanguageType';

const NoticeContent1 = props => {
  const { id, input } = props
  const [ loading, setLoading ] = React.useState(false)
  const [ schema, setSchema ] = React.useState(props.schema)
  

  const addNotice = () => {
    let result = [...input.value]
    result.push({})
    input.onChange(result)
  }

  const changeNotice = (val, p, index) => {
    let result = [...input.value]
    result[index][p] = val
    input.onChange(result)
  }

  const delNotice = (index) => {
    let result = [...input.value]
    result.splice(index, 1)
    input.onChange(result)
  }

  const getOptions = schema => {
    let result = []
    if (schema && schema.form && schema.properties) {
      schema.form.forEach(item => {
        schema.properties[item] && result.push({ label: schema.properties[item].title, value: item })
      })
    }
    return result
  }

  // 每次下拉时重新获取 schema
  const getNewSchema = state => {
    if (state) {
      setLoading(true)
      api({ name: 'core/t/schema/' }).get(id).then(table => {
        setSchema(table.schema)
      }).finally(() => setLoading(false))
    }
  }

  return (<div class='notice-card'>
    <Button onClick={addNotice} style={{ margin: '10px 0' }} >{_t1('添加提示')}</Button>
    {
      input.value.map((item, index) => {
        // 内容国际化
        let languageValue = {}
        Object.keys(item).filter(key => key.indexOf('message_') > -1).forEach(key => {
          languageValue[key.substring(8)] = item[key]
        })

        return <Row key={index} style={{ marginBottom: 10 }}>
          <Col span={3}>
            <Select
              value={item.field}
              onChange={val => changeNotice(val, 'field', index)}
              onDropdownVisibleChange={id && getNewSchema}
              options={getOptions(fieldFilter(schema))}
              loading={loading}
              style={{ width: '98%' }}
            />
          </Col>
          <Col span={21}>
            <LanguageType outStyle={{ display: 'inline-block', width: '98%' }} field={{
              value: item.message,
              onChange: e => changeNotice(e.target.value, 'message', index),
              languageValue,
              languageChange: (val, name) => changeNotice(val, 'message_' + name, index)
            }} />
            <DeleteOutlined onClick={() => delNotice(index)} style={{ width: '2%' }} />
          </Col>
        </Row>
      })
    }
  </div>)
}

const NoticeContent2 = ({ item, saveOneNotice }) => {

  const [value, setValue] = React.useState(item?.messageInfo)
  

  // 内容国际化
  let languageValue = {}
  Object.keys(item || {}).filter(key => key.indexOf('messageInfo_') > -1).forEach(key => {
    languageValue[key.substring(12)] = item[key]
  })

  return (
    <LanguageType outStyle={{ marginTop: 10 }} field={{
      value,
      onChange: e => setValue(e.target.value),
      onBlur: () => saveOneNotice(value, 'messageInfo'),
      placeholder: _t1('提示内容'),
      languageValue,
      languageChange: (val, name) => saveOneNotice(val, 'messageInfo_' + name)
    }} />
  )
}

export { NoticeContent1, NoticeContent2 }