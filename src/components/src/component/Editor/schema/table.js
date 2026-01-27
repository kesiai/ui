import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput } from './common'
import TableDefault from '../component/TableDefault'
import TableFields from '../component/TableFields'
import HighTableFields from '../component/HighTableFields'
import FieldSelect from '../component/TableFieldsSelect'
import TableFieldRules from '../component/TableFieldRules'
import EditTablePermissions from '../component/EditTablePermissions'

const TableSchema = {
  type: "object",
  name: _r("表格"),
  title: _r("表格"),
  description:_r('可在表记录中以表格的形式呈现数据'),
  key: "table",
  properties: {
    tableFields: {
      title: _r("表格字段"),
      type: "object",
      properties: {},
      description: _r('点击字段进行编辑'),
      field: {
        component: TableFields,
        validate: (value) => {
          const item = _.find(value?.properties, p => p.error)
          if (_.isEmpty(value?.properties)) return _t1('表格字段不能为空')
          if (!_.isEmpty(item)) return `[${item.config}]${item.error}`
          return null
        }
      }
    },
    highTableFields: {
      title: _r('高级编辑'),
      type: "object",
      properties: {},
      description: _r('表格卡片形式时，可以定义格式'),
      field: {
        component: HighTableFields
      }
    },
    minCount: {
      title: _r("最小记录数"),
      type: "number",
      minimum: 1,
      description: _r('输入记录的最少数量限制，设置后，表格字段为必填项')
    },
    maxCount: {
      title: _r("最大记录数"),
      type: "number",
      minimum: 1,
      description: _r('输入记录的最多数量限制'),
      field: {
        validate: (value, { minCount }) => value < minCount ? _t1('最大记录数不能小于最小记录数') : null
      }
    },
    defaultVal: {
      title: _r("默认值"),
      type: "array",
      items: {},
      properties: {},
      description: _r('设置默认内容后，默认值会显示在该模块的输入框中，填写者若不做修改，默认值将会作为填写者的数据提交'),
      field: {
        component: TableDefault
      }
    },
    btnText: {
      title: _r("按钮文字"),
      type: "object",
      properties: {
        add: {
          title: _r("添加"),
          type: "string",
          fieldType: 'languageInput'
        },
        delete: {
          title: _r("删除"),
          type: "string",
          fieldType: 'languageInput'
        }
      },
    },
    displayForm: {
      title: _r("展示形式"),
      type: "string",
      enum1: ['grid', 'card'],
      enum_title1: [_r('表格'), _r('卡片')],
      selectFace: "flatten",
      selectType: 'single'
    },
    cardLayout: {
      title: _r("布局"),
      type: "string",
      enum1: ['1', '2', '3'],
      enum_title1: [_r('一行一个'), _r('一行两个'), _r('一行三个')]
    },
    ...baseConfig,
    ...editConfig,
    showPagination: {
      title: _r('显示分页'),
      type: 'boolean',
    },
    uniqueRow: {
      title: _r("不允许重复"),
      type: "boolean",
      description: _r('表格内不允许存在已选字段均相同的行')
    },
    uniqueFields: {
      title: _r("不允许重复行"),
      type: "array",
      items: {},
      properties: {},
      field: {
        component: FieldSelect
      }
    },
    fieldRules: {
      title: _r("字段规则"),
      type: "object",
      properties: {},
      field: {
        component: TableFieldRules
      }
    },
    createAddBtn: {
      title: _r("创建时显示添加按钮"),
      type: "object",
      properties: {},
      field: {
        component: EditTablePermissions,
        initialValue: {
          show: true,
          userRange: 'all'
        }
      }
    },
    editAddBtn: {
      title: _r("修改时显示添加按钮"),
      type: "object",
      properties: {},
      field: {
        component: EditTablePermissions,
        initialValue: {
          show: true,
          userRange: 'all'
        }
      }
    },
    createDelBtn: {
      title: _r("创建时显示删除按钮"),
      type: "object",
      properties: {},
      field: {
        component: EditTablePermissions,
        initialValue: {
          show: true,
          userRange: 'all'
        }
      }
    },
    editDelBtn: {
      title: _r("修改时显示删除按钮"),
      type: "object",
      properties: {},
      field: {
        component: EditTablePermissions,
        initialValue: {
          show: true,
          userRange: 'all'
        }
      }
    }
  },
  required: ["title", "key", 'tableFields'],
  form: [keyForm, "title", "displayForm", "cardLayout", "tableFields", "highTableFields", 'minCount', 'maxCount',
    "defaultVal", "btnText", 'showPagination', 'createDisabled', 'editDisabled', "listFields", "editableFields", "uniqueRow", "uniqueFields",
    'allScript', "fieldRules", "description", "descriptionType", 'tableFixed', 'createShow', 'editShow', 'detailNotShow',
    'createAddBtn', 'editAddBtn', 'createDelBtn', 'editDelBtn'],
  formEffect: form => {
    form.useField('uniqueRow', state => {
      form.setFieldData('uniqueFields', { display: !!state.value })
    })
    form.useField('displayForm', state => {
      form.setFieldData('cardLayout', { display: state.value == 'card' })
      form.setFieldData('highTableFields', { display: state.value == 'card' })
      form.setFieldData('showPagination', { display: state.value !== 'card' })
    })
    commonFormEffect(form)
  }
}

export default TableSchema