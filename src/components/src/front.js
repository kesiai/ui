import React from 'react'
import app from 'xadmin'
import customFront from './customFront'
import relate from './relate'
import { getMutualRules, getErrorNotice, getOneError, getErrorNotice2, FormContext } from './component/FieldRules/getMutualRules'

export default app
.use(customFront)
.use(relate)
.use({
  name: 'airiot.plugin.fieldRules',
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
})