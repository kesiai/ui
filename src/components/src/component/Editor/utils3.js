import React from 'react'
import _ from 'lodash'
import { Form, Input } from 'antd'
import './style.css'

const innerTables = [
  { id: 'User', name: _r('用户') },
  { id: 'Role', name: _r('角色') }
]

const isInnerTables = (tableValue) => {
  for (let item of innerTables) {
    if (item.id === tableValue) {
      return true
    }
  }
  return false
}

const getInnerTables = (tableValue) => {
  for (let item of innerTables) {
    if (item.id === tableValue) {
      return item
    }
  }
  return null
}

const FieldGroup = ({ label, meta, input, field, tailLayout, children }) => {
  const attrs = field.attrs || {}
  const error = meta.touched && (meta.error || meta.submitError)
  const size = (field.option && field.option.groupSize) || attrs.groupSize || {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 19, offset: tailLayout ? 5 : 0 }
    }
  }

  let groupProps = { ...size, required: field.required }
  const schema = field.relateSchema || field.schema || {}

  if (schema && schema.descriptionType === 'tooltip') {
    groupProps.tooltip = field.description
  } else {
    groupProps.extra = field.description || field.help
  }

  if (error) {
    groupProps['validateStatus'] = 'error'

    groupProps['help'] = error
  }

  const controlComponent = children ? children : (<Input {...input} {...attrs} />)
  return (
    <Form.Item label={label} {...groupProps}>
      {controlComponent}
    </Form.Item>
  )
}

const uuid = (len, radix) => {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data. At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('')
}

export { FieldGroup, uuid, innerTables, isInnerTables, getInnerTables }
