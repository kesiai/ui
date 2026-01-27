import React from 'react'
import { use } from 'xadmin';
import { Button, Select, Row, Col } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'
import ScriptInput from './ScriptInput';
import { Loading, C } from 'xadmin-ui';

// 同种类型的字段要过滤掉，比如不能同时设置显示字段1，和隐藏字段1
// 不同种类型的字段要留着，比如同时设置显示字段1，必填字段1
const isSameType = (item1, item2) => {
  if (item1.type === 'setRequire' && item2.type === 'setRequire') { // 同种
    return true
  } else if (item1.type !== 'setRequire' && item2.type !== 'setRequire') { // 同种
    return true
  } else { // 不同种
    return false
  }
}

const ValueComponent = ({ input, schema, field }) => {
  const handleChange = (val) => {
    input.onChange(val?.[field])
  }

  if (!field) return null
  return <div className='value-component'>
    <C is='I18nSchemaForm'
      formKey={`event-detail` + field}
      schema={{
        ...schema,
        type: 'object',
        properties: {
          [field]: {
            ...schema.properties[field],
            field: {
              ...(schema.properties[field].field || {}),
              attrs: {
                groupSize: {
                  labelCol: { span: 0 },
                  wrapperCol: { span: 24 }
                }
              }
            }
          }
        },
        form: field ? [field] : []
      }}
      initialValues={{ [field]: input.value }}
      component={({ children }) => children}
      onChange={handleChange}
    />
  </div>
}

const FieldAndValue = ({ item, schema, onChange }) => {

  let ops = []
  if (schema && schema.form && schema.properties) {
    schema.form.forEach(field => {
      schema.properties[field] && ops.push({ label: schema.properties[field].title, value: field })
    })
  }

  return <div style={{ width: '95%', display: 'inline-block' }}>
    <Select
      style={{ width: '100%' }}
      value={item.field}
      onChange={val => onChange(val, 'field')}
      options={ops}
    />
    {
      React.useMemo(() => <ValueComponent
        schema={schema}
        field={item.field}
        input={{
          value: item.value,
          onChange: val => onChange(val, 'value')
        }}
      />, [item.field])
    }
  </div>
}

const FieldShowHide = props => {
  const { id, input, item, schema } = props
  
  const { hideScript } = use('i18n.permission')

  const addAction = () => {
    let result = [...input.value]
    result.push({ type: 'show' })
    input.onChange(result)
  }

  const changeAction = (val, p, index) => {
    let result = [...input.value]
    if (p === 'type') {
      if (val === 'setAllDisabled') {
        result[index] = { type: val, field: schema.form?.filter(f => {
          return item.condition?.every(cond => {
            return !cond.some(c => c.field === f)
          })
        }) }
      } else {
        result[index] = { type: val }
      }
    } else {
      result[index][p] = val
    }
    input.onChange(result)
  }

  const delAction = (index) => {
    let result = [...input.value]
    result.splice(index, 1)
    input.onChange(result)
  }

  const getOptions = (schema, num) => {
    let result = []
    // 过滤掉已经选择的字段
    let existField = []
    input.value?.forEach((item, index) => {
      if (num === index) return // 不能过滤自己刚选的字段
      const st = isSameType(item, input.value[num])
      if (st) {
        _.isArray(item.field) ? existField.push(...item.field) : existField.push(item.field)
      }
    })
    // 过滤掉触发条件里选择的字段
    item?.condition?.forEach(i => {
      i?.forEach(t => existField.push(t?.field))
    })

    if (schema && schema.form && schema.properties) {
      schema.form.forEach(item => {
        if (existField.indexOf(item) > -1) return
        schema.properties[item] && result.push({ label: schema.properties[item].title, value: item })
      })
    }
    return result
  }

  const ops = hideScript ? [
    { label: _t1('显示'), value: 'show' },
    { label: _t1('隐藏'), value: 'hide' },
    { label: _t1('设为必填'), value: 'setRequire' },
    { label: _t1('可编辑'), value: 'canEdit' },
    { label: _t1('只读'), value: 'setDisabled' },
    { label: _t1('只读所有字段'), value: 'setAllDisabled' },
    { label: _t1('设置字段值'), value: 'setValue' }
  ] : [
    { label: _t1('显示'), value: 'show' },
    { label: _t1('隐藏'), value: 'hide' },
    { label: _t1('设为必填'), value: 'setRequire' },
    { label: _t1('可编辑'), value: 'canEdit' },
    { label: _t1('只读'), value: 'setDisabled' },
    { label: _t1('只读所有字段'), value: 'setAllDisabled' },
    { label: _t1('设置字段值'), value: 'setValue' },
    { label: _t1('执行脚本'), value: 'script' }
  ]

  return (<>
    <Button onClick={addAction} style={{ marginBottom: 10 }} >{_t1('添加动作')}</Button>
    {
      input.value.map((item, index) => (
        <Row key={index} style={{ marginBottom: 10 }}>
          <Col span={3}>
            <Select
              value={item.type}
              onChange={val => changeAction(val, 'type', index)}
              options={ops}
              defaultValue="show"
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={21}>
            {
              item.type === 'script' ? <div style={{ width: '95%', display: 'inline-block' }}>
                <ScriptInput value={item.script} schema={schema} onChange={v => changeAction(v, 'script', index)} />
              </div> :
              item.type === 'setAllDisabled' ? <div style={{ width: '95%', display: 'inline-block' }}></div> : 
              item.type === 'setValue' ? <FieldAndValue
                item={item}
                schema={schema}
                onChange={(val, key) => changeAction(val, key, index)}
              /> : <Select
                mode='multiple'
                value={_.isArray(item.field) ? item.field : item.field ? [item.field] : []}
                onChange={val => changeAction(val, 'field', index)}
                options={getOptions(props.schema, index)}
                style={{ width: '95%' }}
              />
            }
            <DeleteOutlined onClick={() => delAction(index)} style={{ marginLeft: 5 }} />
          </Col>
        </Row>
    ))
    }
    
  </>)
}

export default FieldShowHide