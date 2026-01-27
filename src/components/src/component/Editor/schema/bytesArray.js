import React from 'react'
import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput, metricStore } from './common'

const BytesArraySchema = {
  type: "object",
  name: _r("字节数组"),
  title: _r("字节数组"),
  description:_r('用于处理二进制数据'),
  icon: "inbox",
  key: "text",
  properties: {
    metricStore,
    ...baseConfig,
    ...editConfig
  },
  required: ["title", "key"],
  form: [keyForm, "title", 'metricStore', 'allScript',
    'widthInForm', 'listFields', 'description', 'descriptionType'],
  formEffect: form => {
    commonFormEffect(form)
  }
}

export default BytesArraySchema