import React from 'react'
import { Input, TreeSelect, message, Form } from 'antd'
import { C } from 'xadmin-ui'
import { app } from 'xadmin'
import _ from 'lodash'
import reduce from 'async/reduce';
import { getFormValues } from '../component/Editor/utils'
import { useScriptVal } from '../component/Editor/utils2'
import { dealSchema } from './tool'

const findTree = (ts, value) => {
  for (let i = 0; i < ts.length; i++) {
    const t = ts[i]
    if (t.value == value) {
      return t
    } else if (t.children) {
      const t1 = findTree(t.children, value)
      if (t1) {
        return t1
      }
    }
  }
  return null
}

const travelTree = ts => {
  return ts ? ts.map(t => ({
    selectable: Boolean(t.url),
    ...t,
    ...(t.children ? { children: travelTree(t.children) } : {}),
    value: t.value || t.key || t.url || t.title,
  })) : null
}

const MenuItemSelect = (props) => {
  const { input, defaultValue, placeholder, disabled, size } = props
  const [ treeData, setTreeData] = React.useState([])
  const [ loading, setLoading] = React.useState(false)
  

  React.useEffect(() => {
    setLoading(true)
    reduce(app.get('frontMenuItems'), [], (prev, item, cb) => {
      if (_.isFunction(item)) {
        item(prev, cb)
      } else if (_.isArray(item)) {
        cb(null, [ ...prev, ...item ])
      } else {
        cb(null, [ ...prev, item ])
      }
    }, (err, treeData) => {
      if (err) {
        message.error(_t1('读取系统内置菜单项错误'),err?.detail || err?.json?.detail)
      } else {
        setTreeData(travelTree(treeData))
        setLoading(false)
      }
    })
  }, [])
  
  return (
    <TreeSelect
      value={input.value ? input.value : undefined}
      onChange={input.onChange}
      allowClear
      loading={loading}
      defaultValue={defaultValue}
      disabled={disabled}
      size={size}
      showSearch
      filterTreeNode
      treeDefaultExpandAll
      notFoundContent={<C is="NoData" />}
      treeNodeFilterProp="title"
      treeData={treeData}
      placeholder={placeholder || _t1("选择系统内置的菜单项")}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    />
  )
}

const LinkComponent = props => {
  const { input, field: { schema, filter }, antdForm, meta } = props
  const { onChange, value } = input

  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)

  const { placeholder, defaultVal, disabled, linkType, defaultValType } = dealSchema(schema, values, meta)

  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema, value, values, record: props.record, onChange })
    }
  }, [JSON.stringify(values)])

  const defaultValue = filter ? undefined : defaultVal

  React.useEffect(() => {
    setTimeout(() => { // 必须用setTimeout，否则会被拦截
      !value && defaultValue && defaultValType !== 'logic' && onChange && onChange(defaultValue)
    })
  }, [])

  const handleChange = val => {
    onChange(val.target.value)
  }

  return (
    linkType === 'in' ? 
      <MenuItemSelect
        input={input}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        size={schema.size}
      /> :
      <Input
        {...input}
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder={placeholder || _t1('请输入链接')}
        disabled={disabled}
        size={schema.size}
      />
  )
}

export default LinkComponent
