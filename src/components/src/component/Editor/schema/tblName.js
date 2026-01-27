import { Input } from 'antd'
import { baseConfig, editConfig, commonFormEffect } from './common'
import _ from "lodash"

const TblNameSchema = {
  type: "object",
  name: _r("文本"),
  title: _r("文本"),
  icon: "inbox",
  key: "text",
  description: _r('可输入文本信息，文本信息类型可以是普通文本、密码、邮箱、电话、手机号、编号和身份证'),
  properties: {
    placeholder: {
      title: _r("引导文字"),
      type: "string",
      fieldType: 'languageInput'
    },
    ...baseConfig,
    ...editConfig
  },
  required: ["title", "key"],
  form: [{ key: 'key', component: ({ input }) => <Input disabled value={input.value} /> },
    'title', 'widthInForm', 'createShow', 'editShow', 'detailNotShow', 'placeholder',
    'description'],
  formEffect: form => {
    commonFormEffect(form)
  }
}

export default TblNameSchema