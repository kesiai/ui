import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput } from './common'

const init = `App = (props) => {
  // console.log('props', props)
  return <span style={{ color: 'red' }}>TEXT</span>
}`

const FormInfoSchema = {
  type: "object",
  name: _r("表单信息"),
  title: _r("表单信息"),
  icon: "inbox",
  key: "number",
  description:_r('用脚本编辑表的表单样式，比如分割线或者简单的html，数据库中不存储表单字段信息'),
  properties: {
    widgetContent: {
      title: _r('控件内容'),
      type: 'string',
      field: {
        component: props => <FieldScriptInput {...props} init={init} />
      }
    },
    ...baseConfig,
    ...editConfig
  },
  required: ["title", "key"],
  form: [keyForm, "title", 'widgetContent'],
  formEffect: form => {
    commonFormEffect(form)
  }
}

export default FormInfoSchema