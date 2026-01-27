import React from 'react'
import { app, use } from 'xadmin'
import { C } from 'xadmin-ui'
import { Input } from 'antd'
import { TableField, FormWidget } from './common'
import AreaComponent from '../fieldComponent/AreaComponent'
import BytesArrayComponent from '../fieldComponent/BytesArrayComponent'
import CheckboxComponent from '../fieldComponent/CheckboxComponent'
import DateComponent from '../fieldComponent/DateComponent'
import DateRangeComponent from '../fieldComponent/DateRangeComponent'
import LinkComponent from '../fieldComponent/LinkComponent'
import MapComponent from '../fieldComponent/MapComponent'
import NumberComponent from '../fieldComponent/NumberComponent'
import RateComponent from '../fieldComponent/RateComponent'
import Reference from '../fieldComponent/ReferenceComponent'
import RelateComponent from '../fieldComponent/RelateComponent'
import RelateComponentPlus from '../fieldComponent/RelateComponentPlus'
import SelectComponent from '../fieldComponent/SelectComponent'
import SerialNumberComponent from '../fieldComponent/SerialNumberComponent'
import ShowTable from '../fieldComponent/ShowTable'
import EditableComponent from '../fieldComponent/EditableTable'
import TextComponent from '../fieldComponent/TextComponent'
import TimeComponent from '../fieldComponent/TimeComponent'
import UploadAttachment from '../fieldComponent/UploadAttachment'
import UserRoleComponent from '../fieldComponent/UserRoleComponent'
import WarningComponent from '../fieldComponent/WarningComponent'
import TextEditorComponent from '../fieldComponent/TextEditor'
import LanguageType from '../component/Editor/component/LanguageType'
import FormInfoComponent from '../fieldComponent/FormInfoComponent'
import { RelateMultiSelect, RelateSelect, RelateModelSelect } from '../relate'

// 国际化部分属性
const dealLanguage = (p) => {
  if(!p) return p
  const language = app.context.language
  let newItem = {}
  const originField = ['title', 'placeholder', 'description', 'enum_title1']
  originField.forEach(o => {
    if (p[o + '_' + language]) {
      newItem[o] = p[o + '_' + language]
      newItem[o + '_zh_Hans'] = p[o]
    }
  })
  if (p.tableFields) {
    let newProp = {}
    p.tableFields.form?.forEach(f => {
      const pp = p.tableFields.properties[f]
      newProp[f] = dealLanguage(pp)
    })
    newItem['tableFields'] = {
      ...p.tableFields,
      properties: {
        ...p.tableFields.properties,
        ...newProp
      }
    }
  }
  return {
    ...p,
    ...newItem
  }
}

const WidgetComponent = (props) => {
  const schema = props?.config || {}
  const { dashboardMode } = props

  let FieldComponent
  let extraField = {}
  let extraProps = { meta: props.meta }
  if ((schema.relateTo || schema.relate) && schema.recordSelectType) { // 新版关联字段
    FieldComponent = RelateComponentPlus
    extraField.relateSchema = schema
    extraField.insideFilter = schema.insideFilter
    extraField.option = {}
    if (['User', 'Role'].indexOf(schema.relateTo) > -1) {
      extraField.mode = schema.type == 'array' ? 'multiple' : 'single'
    } else {
      const relate = schema && schema.relate
      const relateShowFields = schema && schema.relateShowFields
      const id = relate && relate.id
      const fieldSchema = relate.fields && relate.fields[0] && relate.fields[0].fieldSchema
      extraField.schema = { name: `core/t/${id}/d` }
      extraField.fieldSchema = fieldSchema
      extraField.tableID = relate.id
      extraField.displayField = relate.fields?.[0]?.key || 'name'
      extraField.relateTableName = id
      if (relateShowFields && relateShowFields.length > 0) { // 多字段
        extraField.selectType = schema.selectType
        extraField.relateShowFields = relateShowFields
      }
    }
    extraProps = extraField
  } else if (['object', 'array'].indexOf(schema.type) > -1 && schema.relate?.id) { // 外部工作表
    const relate = schema && schema.relate
    const relateShowFields = schema && schema.relateShowFields
    const id = relate && relate.id
    const fieldSchema = relate.fields && relate.fields[0] && relate.fields[0].fieldSchema
    FieldComponent = schema.selectType === 'multiple' ? RelateMultiSelect : RelateSelect
    extraField.schema = { name: `core/t/${id}/d` }
    extraField.fieldSchema = fieldSchema
    extraField.relateSchema = schema
    extraField.tableID = relate.id
    extraField.displayField = relate.fields?.[0]?.key || 'name'
    extraField.relateTableName = id
    extraField.insideFilter = schema.insideFilter
    if (relateShowFields && relateShowFields.length > 0) { // 多字段
      extraField.selectType = schema.selectType
      FieldComponent = RelateModelSelect
      extraField.relateShowFields = relateShowFields
      extraProps = extraField
    }
  } else if (schema.type == 'object' && schema.fieldType == 'attachment') {
    FieldComponent = UploadAttachment
    extraField.type = 'upload_attachment' 
  } else if (schema.type == 'array' && schema.fieldType == 'attachments') {
    FieldComponent = UploadAttachment
  } else if (['User', 'Role'].indexOf(schema.relateTo) > -1) {
    FieldComponent = UserRoleComponent
    extraField.mode = schema.type == 'array' ? 'multiple' : 'single'
    extraField.insideFilter = schema.insideFilter
    extraField.relateSchema = schema
    const model = app.get('models')?.[schema.relateTo]
    if(model) extraField.schema = model
  // } else if (schema.type == 'object' && schema.relateTo == 'Department') { // 关联部门表单选
  //   FieldComponent = C('DepartmentSelectField')
  //   extraField.relateSchema = schema
  //   extraField.insideFilter = schema.insideFilter
  // } else if (schema.type == 'array' && schema.relateTo == 'Department') { // 关联部门表多选
  //   FieldComponent = C('DepartmentMultipleSelectField')
  //   extraField.relateSchema = schema
  //   extraField.insideFilter = schema.insideFilter
  } else if ((schema.relateTo || schema.relate) && schema.disabled) { // 关联字段只读
    FieldComponent = RelateComponent
    extraField.disabled = true
    extraField.relateSchema = schema
  } else if (schema.type == 'string' && schema.fieldType == 'input') {
    FieldComponent = TextComponent
  } else if (schema.enum1 && schema.enum1.length > 0) {
    FieldComponent = SelectComponent
  } else if (schema.type == 'number' && schema.fieldType == 'inputNumber') {
    FieldComponent = NumberComponent
  } else if (schema.type == 'string' && schema.fieldType == 'datePicker') {
    FieldComponent = DateComponent
  } else if (schema.type == 'string' && schema.fieldType == 'dateRange') {
    FieldComponent = DateRangeComponent
  } else if (schema.type == 'string' && schema.fieldType == 'timePicker') {
    FieldComponent = TimeComponent
  } else if (schema.type == 'object' && schema.fieldType == 'map') { // 定位
    FieldComponent = MapComponent
  } else if (schema.type == 'boolean' && (schema.fieldType == 'checkbox' || schema.fieldType == 'boolean')) {
    FieldComponent = CheckboxComponent
  } else if (schema.fieldType == 'editableTable') { // 表格
    FieldComponent = schema.disabled ? ShowTable : EditableComponent
    extraProps.batchOption = true
  } else if (schema.fieldType == 'serialNumber') { // 编号
    FieldComponent = SerialNumberComponent
  } else if (schema.fieldType == 'link') { // 链接
    FieldComponent = LinkComponent
  } else if (schema.fieldType == 'area') { // 区域
    FieldComponent = AreaComponent
  } else if (schema.relateTo == 'Warning') { // 关联报警
    FieldComponent = WarningComponent
    if (schema.relateShowFields) extraField.relateShowFields = schema.relateShowFields
    extraField.showField = schema.showField
    extraField.insideFilter = schema.insideFilter
  } else if (schema.fieldType == 'rate') {
    FieldComponent = RateComponent
  } else if (schema.fieldType == 'textEditor') {
    FieldComponent = TextEditorComponent
  } else if (schema.fieldType == 'bytesArray') {
    FieldComponent = BytesArrayComponent
  } else if (schema.fieldType == 'languageInput') {
    FieldComponent = LanguageType
  } else if (schema.config == '关联字段' && !schema.relateTo) { // 关联字段未选择关联表时，走这个逻辑，不然走默认的Object组件，白屏
    FieldComponent = () => <Input disabled />
  } else if (schema.config == '查找引用') {
    FieldComponent = Reference
  } else if (schema.config == '表单信息') {
    FieldComponent = FormInfoComponent
  }
  const style = { color: '#999', fontSize: 12, width: '100%', maxHeight: '100%' }
  const styleDiv = { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', minHeight: 130 }

  try {
    extraProps.antdForm = React.useContext(C('Dashboard.FormContainer.FormContext'))?.form
  } catch (e) {}

  return dashboardMode && _.isEmpty(schema) ? <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
    <div style={styleDiv}><C is="NoData" style={style} description={_t1('能够配置表定义中定义的所有字段')} /> </div>
  </div> : <FormWidget
    {...props}
    input={{
      value: props.bValue || props.input?.value, // 受控值
      onChange: props.input?.onChange
    }}
    config={dealLanguage(props?.config)}
    Component={FieldComponent}
    extraField={extraField}
    extraProps={extraProps}
  />
}

export default WidgetComponent
