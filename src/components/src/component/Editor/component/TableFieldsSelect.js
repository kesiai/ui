import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { Col, Select } from 'antd'
import { use } from 'xadmin'

const { Option } = Select

const FieldSelect = props => {
  const { form } = use('form')
  const { input: { value, onChange } } = props
  const [fields, setFields] = useState([])

  useEffect(() => {
    form.useField('tableFields', (v) => {
      v.value?.properties && setFields(_.map(v.value.form, item => v.value.properties[item]))
    })
  }, [])

  return (
    <Col offset={5} style={{ marginBottom: 10 }}>
      <Select
        mode='multiple'
        placeholder={_t1("请选择字段")}
        showSearch
        value={value || []}
        optionFilterProp="children"
        onChange={onChange}
        filterOption={(input, option) =>
          option.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
        }
        style={{ width: '100%' }}
      >
        {fields.map(item => {
          return <Option value={item.key}>{item.title}</Option>
        })}
      </Select>
    </Col>
  )
}

FieldSelect.useGroup = false

export default FieldSelect