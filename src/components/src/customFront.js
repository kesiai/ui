import { api, app } from 'xadmin'
import { C, lazy } from 'xadmin-ui'
import React from 'react'
import { Input } from 'antd'
import aiCards from './component/AI/cards'
import _ from 'lodash'
import { ifFieldRender } from './component/Editor/utils2'
import { context } from './dashboardWidgets'
import { idcardTest } from './component/Editor/validate'

import tableFieldCustom from './ai/tableFieldCustom'

const UploadAttachment = lazy(() => import('./fieldComponent/UploadAttachment'))
const ShowAttachment = lazy(() => import('./fieldComponent/ShowAttachment'))
const TextComponent = lazy(() => import('./fieldComponent/TextComponent'))
const NumberComponent = lazy(() => import('./fieldComponent/NumberComponent'))
const DateComponent = lazy(() => import('./fieldComponent/DateComponent'))
const DateRangeComponent = lazy(() => import('./fieldComponent/DateRangeComponent'))
const TimeComponent = lazy(() => import('./fieldComponent/TimeComponent'))
const SelectComponent = lazy(() => import('./fieldComponent/SelectComponent'))
const MapComponent = lazy(() => import('./fieldComponent/MapComponent'))
const RelateComponent = lazy(() => import('./fieldComponent/RelateComponent'))
const UserRoleComponent = lazy(() => import('./fieldComponent/UserRoleComponent'))
const FilterUserRole = lazy(() => import('./fieldComponent/UserRoleComponent').then(m => ({ default: m.FilterUserRole })))
const WarningComponent = lazy(() => import('./fieldComponent/WarningComponent'))
const EditableTable = lazy(() => import('./fieldComponent/EditableTable'))
const CheckboxComponent = lazy(() => import('./fieldComponent/CheckboxComponent'))
const ShowTable = lazy(() => import('./fieldComponent/ShowTable'))
const SerialNumberComponent = lazy(() => import('./fieldComponent/SerialNumberComponent'))
const AreaComponent = lazy(() => import('./fieldComponent/AreaComponent'))
const RateComponent = lazy(() => import('./fieldComponent/RateComponent'))
const TextEditorComponent = lazy(() => import('./fieldComponent/TextEditor'))
const LinkComponent = lazy(() => import('./fieldComponent/LinkComponent'))
const BytesArrayComponent = lazy(() => import('./fieldComponent/BytesArrayComponent'))
const FilterNumberRewrite = lazy(() => import('./fieldComponent/FilterNumberRewrite'))
const FilterInputSelect = lazy(() => import('./fieldComponent/FilterInputSelect'))
const ReferenceComponent = lazy(() => import('./fieldComponent/ReferenceComponent'))
const FormulaComponent = lazy(() => import('./fieldComponent/FormulaComponent'))
const FormInfoComponent = lazy(() => import('./fieldComponent/FormInfoComponent'))
const TblnameComponent = lazy(() => import('./fieldComponent/TblnameComponent'))
const FilterDate = lazy(() => import('./fieldComponent/FilterDate'))
const LanguageType = lazy(() => import('./component/Editor/component/LanguageType'))
const LanguageAndRegexInput = lazy(() => import('./component/Editor/component/LanguageAndRegexInput'))
const WidgetsSelect = lazy(() => import('./component/Editor/component/WidgetsSelect'))

const FieldRules = lazy(() => import('./component/FieldRules').then(m => ({ default: m.FieldRules })))
const FormLayout = lazy(() => import('./component/FieldRules/components').then(m => ({ default: m.FormLayout })))
const FieldGroup = lazy(() => import('./component/FieldRules/components').then(m => ({ default: m.FieldGroup })))
const TCProvider = lazy(() => import('./component/Editor/context').then(m => ({ default: m.TCProvider })))
const TableFieldRender = lazy(() => import('./TableFieldRender'))

const SchemaEditor = lazy(() => import('./component/Editor/SchemaEditor').then(m => ({ default: m.SchemaEditor2 })))

const custom = {
  name: 'iot.custom',
  items: {
    customWidgets: { type: 'array', description: _r('表扩展自定义控件') },
  },
  aiCards: {
    ...aiCards,
    tableFieldCustom,
  },
  context,
  components: {
    SchemaEditor,
    FieldRules,
    ShowAttachment,
    'Custom.Upload': UploadAttachment,
    'Custom.Map': MapComponent,
    'Custom.Relate': RelateComponent,
    'Custom.FieldGroup': FieldGroup,
    'Custom.FormLayout': FormLayout,
    'Custom.WidgetsSelect': WidgetsSelect,
    'Custom.LanguageType': LanguageType,
    'Custom.TCProvider': TCProvider,
    'Custom.FieldRender': TableFieldRender,
    'Custom.TextEditorComponent': TextEditorComponent
  },
  form_fields: {
    upload_attachment: { component: UploadAttachment },
    upload_attachments: { component: UploadAttachment },
    input: { component: TextComponent },
    input_number: { component: NumberComponent },
    date_picker: { component: DateComponent },
    date_range: { component: DateRangeComponent },
    time_picker: { component: TimeComponent },
    select_multiple: { component: SelectComponent },
    map_picker: { component: MapComponent },
    node_select: { component: (props) => <C is="NodeListSelect" {...props} /> },
    relate_select: { component: RelateComponent },
    edit_table: { component: EditableTable },
    show_Table: { component: ShowTable },
    checkbox_boolean: { component: CheckboxComponent },
    user_role_select: { component: UserRoleComponent },
    serial_number: { component: SerialNumberComponent },
    area: { component: AreaComponent },
    warning: { component: WarningComponent },
    rate: { component: RateComponent },
    text_editor: { component: TextEditorComponent },
    link: { component: LinkComponent },
    bytes_array: { component: BytesArrayComponent },
    filter_number_rewrite: { component: FilterNumberRewrite },
    filter_input_select: { component: FilterInputSelect },
    language_input: { component: LanguageType },
    language_and_regex_input: { component: LanguageAndRegexInput },
    input_disabled: { component: () => <Input disabled /> },
    reference: { component: ReferenceComponent },
    tbl_name: { component: TblnameComponent },
    formula: { component: FormulaComponent },
    filter_user_role2: { component: FilterUserRole },
    form_info: { component: FormInfoComponent },
    filter_single_date: { component: FilterDate }
  },
  schema_converter: [(f, schema, options) => {
    if (schema.type == 'object' && schema.fieldType == 'attachment') {
      f.type = 'upload_attachment'
      f.validate = (val) => {
        if (val === 'loading') return _t1('正在上传')
      }
    }
    if (schema.type == 'array' && schema.fieldType == 'attachments') {
      f.type = 'upload_attachments'
      f.validate = (val) => {
        if (val === 'loading') return _t1('正在上传')
      }
    }
    // 用户表、角色表、内置查询或字段脚本
    if (schema.config == '关联字段' && ['User', 'Role'].indexOf(schema.relateTo) > -1 || schema.config === '用户') {
      f.type = 'user_role_select'
      f.mode = schema.type == 'array' ? 'multiple' : 'single'
      f.insideFilter = schema.insideFilter
      f.relateSchema = schema
    }
    if ((schema.relateTo || schema.relate) && schema.disabled) { // 关联字段只读
      f.disabled = true
      f.type = 'relate_select'
      f.relateSchema = schema
    }
    if (schema.type == 'string' && schema.fieldType == 'input') {
      f.type = 'input'
      if (schema.vali || schema.valiFun) {
        f.validate = (val) => {
          let reg = new RegExp(schema.vali)
          if (val && schema.valiFun) {
            switch (schema.valiFun) {
              case 'idcardTest':
                return idcardTest(val)
              default:
                return null
            }
          } else if (val && !reg.test(val)) {
            return schema.valiMsg || _t1('格式不正确')
          }
        }
      } else if (schema.textContent === 'password') { // 密码不能包含空格或中文
        f.validate = (val) => {
          if ((val?.indexOf(' ') > -1 || /[\u4e00-\u9fff]/.test(val))) {
            return _t1(schema.title) + _t1('中不可包含空格或中文')
          }
        }
      }
    }
    if (schema.type == 'string' && schema.fieldType == 'password') {
      if (!schema.field?.validate && !f.validate) {
        f.validate = (val) => {
          if ((val?.indexOf(' ') > -1 || /[\u4e00-\u9fff]/.test(val))) {
            return _t1(schema.title) + _t1('中不可包含空格或中文')
          }
        }
      }
    }
    if (schema.enum1 && schema.enum1.length > 0) {
      f.type = 'select_multiple'
    }
    if (schema.type == 'number' && schema.fieldType == 'inputNumber') {
      f.type = 'input_number'
    }
    if (schema.type == 'string' && schema.fieldType == 'datePicker') {
      f.type = 'date_picker'
    }
    if (schema.type == 'string' && schema.fieldType == 'dateRange') {
      f.type = 'date_range'
    }
    if (schema.type == 'string' && schema.fieldType == 'timePicker') {
      f.type = 'time_picker'
    }
    if (schema.type == 'object' && schema.fieldType == 'map') { // 定位
      f.type = 'map_picker'
    }
    if (schema.type == 'boolean' && (schema.fieldType == 'checkbox' || schema.fieldType == 'boolean')) {
      f.type = 'checkbox_boolean'
    }
    if (schema.fieldType == 'editableTable') { // 表格
      f.batchOption = true
      f.type = schema.disabled ? 'show_Table' : 'edit_table'
    }
    if (schema.fieldType == 'serialNumber') { // 编号
      f.type = 'serial_number'
    }
    if (schema.fieldType == 'link') { // 链接
      f.type = 'link'
      if (schema.pattern) {
        f.validate = (val) => {
          let reg = new RegExp(schema.pattern)
          if (val && !reg.test(val)) {
            return _t1('请输入正确的链接格式')
          }
        }
      }
    }
    if (schema.fieldType == 'area') { // 区域
      f.type = 'area'
    }
    if (schema.relateTo == 'Warning') { // 关联报警
      f.type = 'warning'
      if (schema.relateShowFields) f.relateShowFields = schema.relateShowFields
      f.showField = schema.showField
      f.insideFilter = schema.insideFilter
    }
    if (schema.fieldType == 'rate') {
      f.type = 'rate'
    }
    if (schema.fieldType == 'textEditor') {
      f.type = 'text_editor'
    }
    if (schema.fieldType == 'bytesArray') {
      f.type = 'bytes_array'
    }
    if (schema.fieldType == 'languageInput') {
      f.type = 'language_input'
    }
    if (schema.fieldType == 'languageAndRegexInput') {
      f.type = 'language_and_regex_input'
    }
    if (schema.config == '关联字段' && !schema.relateTo) { // 关联字段未选择关联表时，走这个逻辑，不然走默认的Object组件，白屏
      f.type = 'input_disabled'
    }
    if (schema.config == '查找引用') {
      f.type = 'reference'
    }
    if (schema.textContent == 'logic' || schema.config === '公式') {
      f.type = 'formula'
    }
    if (schema.config === '表单信息') {
      f.type = 'form_info'
    }
    if (schema.config === '子表名') {
      f.type = 'tbl_name'
    }
    if (schema.allScript) { // 校验脚本
      let validateScript
      try {
        validateScript = new Function("value", "item", "api", "app", "return " + schema.allScript)()?.validateScript
      } catch (e) {
        console.error(`${schema.title}[${schema.key}]字段的校验脚本错误`)
      }
      if (validateScript) f.validate = (value, item) => {
        return validateScript(value, item, api, app)
      }
    }
    return f
  }],
  filter_converter: [(f, schema, options) => {
    f.filter = true // 过滤器标识字段
    if (schema.type == 'string' && schema.fieldType == 'datePicker') {
      f.type = schema.format == 'datetime' ? 'filter_datetime' : 'filter_date'
    }
    if (schema.enum1 && schema.enum1.length > 0) {
      f.type = 'select_multiple'
    }
    if ((schema.relateTo || schema.relate) && schema.filterByRes) { // 过滤器去重
      f.internalTable = schema.relateTo ? true : false
      f.type = 'relate_select'
    }
    if (schema.relateTo) { // 过滤器字段名称
      f.label = schema.title
    }
    if (schema.fieldType == 'area') { // 区域
      f.type = 'area'
    }
    if (schema.relateTo === 'Warning') { // 关联报警
      f.showField = schema.showField
      f.type = 'warning'
    }
    if (f.type == 'filter_number' && schema.type == 'number') { // 修改所有number类型filter组件
      f.type = 'filter_number_rewrite'
    }
    if (schema.type == 'string' && schema.filterType == 'select') { // 文本过滤器下拉选
      f.type = 'filter_input_select'
    }
    if (['User', 'Role'].indexOf(schema.relateTo) > -1) { // 关联用户，角色
      const models = app.get('models')
      const relateName = schema.relateTo
      if (models[relateName]) {
        const model = models[relateName]
        f.schema = model
      }
      f.type = 'filter_user_role2'
      f.insideFilter = schema.insideFilter
      f.relateSchema = schema
    }
    if (schema.type == 'string' && schema.format && (schema.filterMode == 'date' || schema.filterField?.filterMode == 'date')) {
      f.filterFormat = schema.filterField?.filterFormat || schema.filterFormat
      f.type = 'filter_single_date'
    }
    return f
  }],
  fieldRenders: app => (prev, schema) => {
    if (schema?.relateField) { // 关联字段多字段，显示到列表
      return props => {
        const { item, field } = props
        const keys = field?.split('$$$') || []
        let value = item?.[keys[0]]?.[keys[1]]
        try { // 数组类型的值，接口返回的是字符串，需要转一下
          value = JSON.parse(value)
        } catch (e) { }

        return <TableFieldRender {...props} value={value} prev={prev} schema={schema} app={app} />
      }
    } else if (ifFieldRender(schema)) {
      return props => <TableFieldRender {...props} prev={prev} schema={schema} app={app} />
    }
    return prev
  },
  start: () => {
    if (!Object.fromEntries) {
      Object.fromEntries = entries => {
        return entries.reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
      };
    }
  }
}

export default custom
