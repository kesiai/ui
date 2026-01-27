import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput, metricStore } from './common'

const BooleanSchema = {
  type: "object",
  name: _r("布尔值"),
  title: _r("布尔值"),
  description:_r("用于标识某个状态或操作的开启或关闭"),
  key: "boolean",
  properties: {
    ...baseConfig,
    displayForm: {
      title: _r("展示形式"),
      type: "string",
      enum1: ['checkBox', 'switch'],
      enum_title1: [_r('勾选'), _r('开关')],
      selectFace: "flatten",
      selectType: 'single'
    },
    manualChange: {
      title: _r("在线状态手动更改"),
      type: 'boolean',
      description: _r('勾选后自动更新程序不再生效，只能手动更新')
    },
    checkedChildren: {
      title: _r("选中文字"),
      type: "string",
    },
    unCheckedChildren: {
      title: _r("未选中文字"),
      type: "string",
    },
    defaultVal: {
      title: _r("默认值"),
      type: "boolean",
    },
    metricStore,
    ...editConfig
  },
  required: ["title", "key"],
  form: [
    keyForm, 'metricStore', 'allScript', 'title', 'description',
    'descriptionType', 'createDisabled', 'editDisabled', 'unique', 'listFields', 'editableFields', 'batchChangeFields',
    'filterFields', 'displayForm', 'checkedChildren', 'unCheckedChildren', 'defaultVal', 'widthInForm',
    'tableFixed', 'createShow', 'editShow', 'detailNotShow'
  ],
  formEffect: form => {
    commonFormEffect(form)
    form.useField('displayForm', ({ value }) => {
      form.setFieldData('checkedChildren', { display: value == 'switch' })
      form.setFieldData('unCheckedChildren', { display: value == 'switch' })
    })
  }
}

export default BooleanSchema