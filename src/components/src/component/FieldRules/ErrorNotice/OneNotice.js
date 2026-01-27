import React from 'react'
import { api, use } from 'xadmin'
import { C } from 'xadmin-ui'
import { Tag, Input, Select } from 'antd'
import { NoticeContent1, NoticeContent2 } from './NoticeContent'
import { fieldFilter } from '../components'
import BindField from '../MutualRules/BindField'
import { SchemaContext } from '../MutualRules/BindField'

const OneNotice = props => {
  const { schema = { properties: {} }, oneItem, saveOneNotice, id } = props
  const [ name, setName ] = React.useState(oneItem.name)
  
  const typeOptions = [
    { value: 'redText', label: _t1('控件下方文本提示') },
    { value: 'message', label: _t1('上方弹窗3秒提示') }
  ]
  const { hideScript } = use('i18n.permission')

  // 每次下拉时重新获取 schema
  const getNewSchema = () => {
    return new Promise((resolve, reject) => {
      api({ name: 'core/t/schema/' }).get(id).then(table => {
        resolve(table.schema?? { properties: {} })
      }).catch(e => reject(e))
    })
  }

  return (<div style={{ maxHeight: 400, overflowY: 'scroll' }} >
    <Input
      value={name}
      onChange={e => setName(e.target.value)}
      onBlur={e => saveOneNotice(e.target.value, 'name')}
      style={{ marginBottom: 10 }}
    />
    <div style={{ marginBottom: 10 }}>
      {_t1('触发条件')}：
      <SchemaContext.Provider value={{ schema }}>
        <C
          is="QueryEditor"
          DataWrap={hideScript ? null : BindField}
          style={{ marginTop: 10 }}
          schema={fieldFilter(schema) || { properties: {} }}
          getNewSchema={id && getNewSchema}
          input={{ value: oneItem.condition, onChange: val => saveOneNotice(val, 'condition') }}
        />
      </SchemaContext.Provider>
    </div>
    <div>
      {_t1('错误提示')}：<br/>
      <Select
        value={oneItem.noticeType}
        onChange={val => saveOneNotice(val, 'noticeType')}
        options={typeOptions}
        placeholder={_t1('提示类型')}
        style={{ width: '20%' }}
      />
      {
        oneItem.noticeType === 'redText' ?
        <NoticeContent1 schema={schema} id={id} input={{ value: oneItem.noticeList, onChange: val => saveOneNotice(val, 'noticeList') }} />
        : oneItem.noticeType === 'message' ?
        <NoticeContent2 item={oneItem} saveOneNotice={saveOneNotice} />
        : null
      }
    </div>
  </div>)
}

export default OneNotice
