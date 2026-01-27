import React from 'react'
import { app } from 'xadmin'
import { C } from 'xadmin-ui'
import Icon from './Icon'
import _, { sum } from 'lodash'
import { Form, Tooltip, Input } from 'antd'
import TextSchema from '../schema/text'
import SelectSchema from '../schema/select'
import DateSchema from '../schema/date'
import TimeSchema from '../schema/time'
import DateRangeSchema from '../schema/dateRange'
import BooleanSchema from '../schema/boolean'
import NumberSchema from '../schema/number'
import MapSchema from '../schema/map'
import SerialNumberSchema from '../schema/serialNumber'
import LinkSchema from '../schema/link'
import AreaSchema from '../schema/area'
import RateSchema from '../schema/rate'
import TblNameSchema from '../schema/tblName'
import TextEditorSchema from '../schema/textEditor'
import { baseConfig, editConfig, keyForm, FieldScriptInput, commonFormEffect, validate } from '../schema/common'
import UserSchema from '../schema/user'
import BytesArraySchema from '../schema/bytesArray'
import FormInfoSchema from '../schema/formInfo'
import "../style.css"
import ReferenceSchema from '../schema/reference'
import FormulaSchema from '../schema/formula'
import { getWSchema } from './Registry'

const FormTitle = props => {
  const content = _.isString(props.children) && props.children.length > 20 ? <Tooltip title={props.children} >
    {props.children.substring(0, 20) + '...'}
  </Tooltip> : props.children
  return <div className="right-sider-title" style={{ fontSize: 14, padding: '0 6px', margin: '0 -2px' }}>
    {content}
  </div>
}

const FormSubTitle = props => {
  return <div style={{ fontSize: 12, padding: '0 10px', margin: '0 -2px' }}>
    {props.children}
  </div>
}

const FormLayout = ({ children: ch, editorType, notInRow, ignoreConfig }) => {
  
  let children = notInRow ? ch.filter(item => item.key !== 'widthInForm') : ch
  if (ignoreConfig?.length > 0) children = children.filter(item => !ignoreConfig.includes(item.key))


  const validate = children.filter(item => ['need', 'unique', 'uniqueRow', 'uniqueFields'].includes(item.key))
  const auth = children.filter(item => ['createDisabled', 'editDisabled', 'createShow', 'editShow', 'listFields', 'editableFields',
    'batchChangeFields', 'filterFields', 'canOrder', 'filterByRes', 'filterMode', 'filterFormat', 'tableFixed', 'detailNotShow',
    'createAddBtn', 'editAddBtn', 'createDelBtn', 'editDelBtn'].includes(item.key))
  const auth1 = children.filter(item => ['createDisabled', 'editDisabled', 'createShow', 'editShow', 'detailNotShow'].includes(item.key))
  const auth2 = children.filter(item => ['listFields', 'editableFields', 'batchChangeFields', 'filterFields',
    'canOrder', 'filterByRes', 'filterMode', 'filterFormat', 'tableFixed'].includes(item.key))
  const auth3 = children.filter(item => ['createAddBtn', 'editAddBtn', 'createDelBtn', 'editDelBtn'].includes(item.key))
  const advance = children.filter(item => ['description', 'descriptionType', 'placeholder', 'allScript',
    'recordDetail', 'fieldRules', 'ftp', 'metricStore'].includes(item.key))
  const advance2 = children.filter(item => ['description', 'descriptionType', 'placeholder', 'ftp'].includes(item.key))
  const lanauage = children.filter(item => ['languageType'].includes(item.key))
  const uploadOperation = children.filter(item => ['uploadPosition', 'mediaDelete', 'autoName', 'addToken', 'canDownload'].includes(item.key))

  const operation = children.filter(item => ['mapToCurrent', 'mapField'].includes(item.key))
  const operateSetting = children.filter(item => ['allowSelectOld', 'allowAdd'].includes(item.key))
  if (editorType === 'device') {  // 指令部分使用
    return (
      <Form style={{ padding: '0 10px' }}>
        <FormTitle>{_t1('基础配置')}</FormTitle>
        {_.difference(children, [...validate, ...auth, ...advance, ...operateSetting])}
        {validate?.length > 0 && <FormTitle>{_t1('验证')}</FormTitle>}
        {validate}
        {advance2?.length > 0 && <FormTitle>{_t1('高级配置')}</FormTitle>}
        {advance2}
      </Form>
    )
  } else if (editorType == 'warning') {
    const isDate = auth?.[0]?.props?.option?.schema?.name == '日期范围'
    return (<Form style={{ padding: '0 10px' }}>
      <FormTitle>{_t1('基础配置')}</FormTitle>
      {_.difference(children, [...validate, ...auth, ...advance, ...operateSetting])}
      {validate?.length > 0 && <FormTitle>{_t1('验证')}</FormTitle>}
      {validate}
      {
        isDate ? null : (<>
          {auth?.length > 0 && <FormTitle>{_t1('权限')}</FormTitle>}
          {auth1?.length > 0 && <FormSubTitle>{_t1('显示配置')}</FormSubTitle>}
          {auth1}
          {auth2?.length > 0 && <FormSubTitle>{_t1('列表配置')}</FormSubTitle>}
          {auth2}
        </>
        )
      }
      {advance?.length > 0 && <FormTitle>{_t1('高级配置')}</FormTitle>}
      {advance}
    </Form>)
  } else {
    return (
      <Form style={{ padding: '0 10px' }}>
        <FormTitle>{_t1('基础配置')}</FormTitle>
        {_.difference(children, [...validate, ...auth, ...advance, ...lanauage, ...uploadOperation, ...operation, ...operateSetting])}
        {lanauage?.length > 0 && <FormTitle>{_t1('国际化配置')}</FormTitle>}
        {lanauage}
        {uploadOperation?.length > 0 && <FormTitle>{_t1('操作设置')}</FormTitle>}
        {uploadOperation}
        {operateSetting?.length > 0 && <FormTitle>{_t1('操作设置')}</FormTitle>}
        {operateSetting}
        {validate?.length > 0 && <FormTitle>{_t1('验证')}</FormTitle>}
        {validate}
        {auth?.length > 0 && <FormTitle>{_t1('权限')}</FormTitle>}
        {auth1?.length > 0 && <FormSubTitle>{_t1('显示配置')}</FormSubTitle>}
        {auth1}
        {auth2?.length > 0 && <FormSubTitle>{_t1('列表配置')}</FormSubTitle>}
        {auth2}
        {auth3?.length > 0 && <FormSubTitle>{_t1('操作按钮')}</FormSubTitle>}
        {auth3}
        {advance?.length > 0 && <FormTitle>{_t1('高级配置')}</FormTitle>}
        {advance}
        {operation?.length > 0 && <FormTitle>{_t1('操作')}</FormTitle>}
        {operation}
      </Form>
    )
  }
}

const FieldGroup = ({ label, meta, input, field, tailLayout, children }) => {
  const attrs = field.attrs || {}
  const error = meta.error || meta.submitError
  const tooltip = field.description
  const size = (field.option && field.option.groupSize) || attrs.groupSize || {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17, offset: tailLayout ? 5 : 0 }
    }
  }

  const groupProps = { tooltip, ...size, required: field.required }

  // 字段配置表单错误提示暂时取消，统一在中间文字显示，2024/1/29，还是改成显示，2024/1/30
  if (error && !field.hideError) {
    groupProps['validateStatus'] = 'error'

    groupProps['help'] = error
  }
  
  const controlComponent = children ? children : (<Input {...input} {...attrs} />)
  return (
    <Form.Item label={label} {...groupProps}>
      {controlComponent}
      {tailLayout && field.description ? <Tooltip placement="top" title={field.description} ><Icon type="question-circle" style={{ color: 'rgba(0, 0, 0, 0.45)' }}></Icon></Tooltip> : null}
    </Form.Item>
  )
}

const getBaseSchema = (widget = {}) => {
  const s = widget.paramSchema ?? {}
  let f = widget.insideForm ?? []
  if (f.indexOf('fieldScript') > -1) {
    f.splice(f.indexOf('fieldScript'), 1)
    f.unshift({ key: 'fieldScript', component: FieldScriptInput })
  }
  const kForm = s.form?.length && s.form.filter(v => v?.key)?.[0] || keyForm
  const sForm = s.form?.length && s.form.filter(v => !v?.key) || []

  let result = {
    ...s,
    properties: {
      ...s.properties ?? {},
      ...baseConfig,
      ...editConfig
    },
    required: ["title", "key", ...s.required ?? []],
    form: [
      kForm, "title",
      ...sForm ?? [],
      ...f
    ],
    formEffect: form => {
      s.formEffect && s.formEffect(form)
      commonFormEffect(form)
    }
  }
  return result
}

const getWidgetSchema = (config, fixed, isDevice) => {
  let baseSchema = {}
  let baseKey = null
  // 根据添加的组件定义的schema初始化form值
  switch (config) {
    case '文本':
      if (fixed) { // 固定字段（文本）
        baseSchema = {
          ...TextSchema,
          form: [
            { key: 'key', component: ({ input }) => <Input disabled value={input.value} /> },
            ...TextSchema.form.filter(item => (
              ['textContent', 'textType', 'metricStore', 'jsLogic'].indexOf(item) === -1 &&
              ['allScript', 'key'].indexOf(item.key) === -1
            ))
          ],
          properties: _.omit(TextSchema.properties, [
            'createDisabled', 'editDisabled', 'allScript', 'metricStore', 'jsLogic',
            'filterByRes', 'need', 'textContent', 'textType', 'unique'
          ])
        }
        baseKey = 'text'
      } else {
        baseSchema = TextSchema
        baseKey = 'text'
      }
      break;
    case '数字':
      if (fixed) { // 固定字段（数字）
        baseSchema = {
          ...NumberSchema,
          form: [
            { key: 'key', component: ({ input }) => <Input disabled value={input.value} /> },
            ...NumberSchema.form.filter(item => (
              ['allScript', 'key'].indexOf(item.key) === -1
            ))
          ]
        }
        baseKey = 'number'
      } else {
        baseSchema = NumberSchema
        baseKey = 'number'
      }

      break;
    case '时间':
      if (fixed) { // 固定字段（日期）
        baseSchema = {
          ...DateSchema,
          form: [
            { key: 'key', component: ({ input }) => <Input disabled value={input.value} /> },
            'title', 'widthInForm', 'filterFields', 'canOrder', 'batchChangeFields', 'createShow', 'editShow', 'listFields'
          ]
        }
        baseKey = 'date'
      } else {
        baseSchema = DateSchema
        baseKey = 'date'
      }
      break;
    case '时间2':
      if (fixed) { // 固定字段（时间）
        baseSchema = {
          ...TimeSchema,
          form: [
            { key: 'key', component: ({ input }) => <Input disabled value={input.value} /> },
            'title', 'widthInForm', 'filterFields', 'canOrder', 'batchChangeFields', 'createShow', 'editShow', 'listFields'
          ]
        }
        baseKey = 'time'
      } else {
        baseSchema = TimeSchema
        baseKey = 'time'
      }
      break;
    case '日期范围':
      baseSchema = DateRangeSchema
      baseKey = 'dateRange'
      break;
    case '选择器':
      if (fixed) { // 固定字段（选择器）
        baseSchema = {
          ...SelectSchema,
          form: [
            { key: 'key', component: ({ input }) => <Input disabled value={input.value} /> },
            ...SelectSchema.form.filter(item => (
              ['selectType', 'selectFace', 'dataType'].indexOf(item) === -1 &&
              ['select', 'key'].indexOf(item.key) === -1
            ))
          ],
          properties: _.omit(SelectSchema.properties, [
            'selectType', 'selectFace', 'dataType', 'select'
          ])
        }
        baseKey = 'select'
      } else {
        baseSchema = SelectSchema
        baseKey = 'select'
      }
      break;
    case '布尔值':
      if (fixed) { // 固定字段（布尔）
        baseSchema = {
          ...BooleanSchema,
          form: [
            {
              key: 'key',
              component: ({ input }) => <Input disabled value={input.value} />,
              effect: ({ value }, form) => {
                setTimeout(() => {
                  form.setFieldData('manualChange', { display: value === 'online' })
                })
              }
            },
            'title', {
              key: 'manualChange',
              effect: ({ value }, form) => {
                const key = form.getState()?.values?.key
                if (key === 'online') {
                  setTimeout(() => {
                    form.change('createShow', value)
                    form.change('editShow', value)
                    form.change('createDisabled', !value)
                    form.change('editDisabled', !value)
                  })
                }
              }
            }, 'displayForm', 'widthInForm', 'filterFields', 'batchChangeFields',
            'createShow', 'editShow', 'listFields'
          ]
        }
        baseKey = 'boolean'
      } else {
        baseSchema = BooleanSchema
        baseKey = 'boolean'
      }
      break;
    case '关联字段':
      baseSchema = getWSchema("RelateTable")
      baseKey = 'object'
      break;
    case '管理表记录':
      baseSchema = getWSchema("tableDataSchema")
      baseKey = 'object'
      break;
    case '管理表':
      baseSchema = getWSchema("tableSchema")
      baseKey = 'object'
      break;
    case '附件':
      baseSchema = getWSchema("SingleUpload")
      baseKey = 'object'
      break;
    case '附件组':
      baseSchema = getWSchema("MultipleUpload")
      baseKey = 'object'
      break;
    case '定位':
      baseSchema = MapSchema
      baseKey = 'object'
      break;
    case '表格':
      baseSchema = getWSchema("TableSchema")
      baseKey = 'object'
      break;
    case '编号':
      baseSchema = SerialNumberSchema
      baseKey = 'text'
      break;
    case '链接':
      baseSchema = LinkSchema
      baseKey = 'text'
      break;
    case '区域':
      baseSchema = AreaSchema
      baseKey = 'area'
      break;
    case '星级评价':
      baseSchema = RateSchema
      baseKey = 'rate'
      break;
    case '富文本':
      baseSchema = TextEditorSchema
      baseKey = 'textEditor'
      break;
    case '用户':
      baseSchema = UserSchema
      baseKey = 'user'
      break;
    case '字节数组':
      baseSchema = BytesArraySchema
      baseKey = 'bytesArray'
      break;
    case '查找引用':
      baseSchema = ReferenceSchema
      baseKey = 'reference'
      break;
    case '公式':
      baseSchema = FormulaSchema
      baseKey = 'formula'
      break;
    case '表单信息':
      baseSchema = FormInfoSchema
      baseKey = 'formInfo'
      break;
    case '子表名':
      baseSchema = TblNameSchema
      baseKey = 'tblName'
      break;
    default:
      break;
  }

  // 可扩展控件
  const other = app.get('customWidgets')
  const w = other.find(item => item.config === config)
  if (w?.paramSchema) {
    baseSchema = getBaseSchema(w)
    baseKey = w.name
  }

  // 单设备表
  if (isDevice && baseSchema.properties) {
    delete baseSchema.properties.unique
    delete baseSchema.properties.batchChangeFields
    baseSchema.form = baseSchema.form.filter(f => ['unique', 'batchChangeFields'].indexOf(f) === -1)
  }
  return { baseSchema, baseKey }
}

const NewPropertiesForm = props => {
  /* 根据不同的schema初始化values text || date || select  */
  const initialValues = (baseKey, baseSchema) => {
    const { formKey, schema } = props
    const { properties } = schema
    const values = _.cloneDeep(properties?.[formKey])
    const baseSchemaProperties = { ...baseSchema.properties, rowKey: { title: "行标识", type: "string" } }
    if (baseKey && baseSchemaProperties && _.isObject(baseSchemaProperties)) {
      const keys = Object.keys(baseSchemaProperties)
      if (keys && keys.length > 0) {
        keys.map(k => {
          if (k === 'relate') {
            values[k] = properties[formKey][k] || (
              properties[formKey]['relateTo'] ? { id: properties[formKey]['relateTo'] } : null
            )
          } else {
            values[k] = properties[formKey][k]
          }
        })
      }
      // values.
      values.key = formKey
      values.need = !!(_.indexOf(schema.required, formKey) >= 0)
      if (baseKey == 'select') {
        if (properties[formKey].enum1 && properties[formKey].enum1.length > 0) {
          values.select = {
            label: properties[formKey].enum_title1,
            value: properties[formKey].enum1,
            color: properties[formKey].enum_color1,
            language: {}
          }
          Object.keys(properties[formKey]).forEach(key => {
            if (key.indexOf('enum_title1_') > -1) {
              values.select.language[key] = properties[formKey][key]
            }
          })
        } else if (properties[formKey].enum && properties[formKey].enum.length > 0) {
          values.select = {
            label: properties[formKey].enum_title,
            value: properties[formKey].enum
          }
        } else {
          values.select = null
        }
      } else if (baseKey == 'date') {
        if (['ym', 'ymdh'].indexOf(properties[formKey].format2) > -1) {
          values.format = properties[formKey].format2
          delete values.format2
        }
      }
      // 如果有rowKey表示一行中有多个控件，计算控件个数 用于限制宽度选择范围
      if (values.rowKey) {
        values.rowKeyCount = _.compact(_.filter(properties, p => p.rowKey == values.rowKey))?.length
      }
      if (values.disabled) {
        values.createDisabled = true
        values.editDisabled = true
        delete values.disabled
      }
      return values
    }
  }

  const { formKey, schema, onConfirm, schemaConfig, setInvalid, customFieldConvrt, isDevice } = props
  const { properties } = schema

  const config = properties?.[formKey]?.config || schemaConfig

  // 模型表的id和name字段，只有部分配置项
  const { baseSchema, baseKey } = getWidgetSchema(config, properties?.[formKey]?.fixedField, isDevice) || {}

  const values = schemaConfig ? {} : initialValues(baseKey, baseSchema)  

  const onChange = submitValues => {
    delete submitValues.disabled
    _.forEach(values, (val, key) => {
      if (!_.keys(submitValues).includes(key)) submitValues[key] = val
    })
    onConfirm(formKey, { 'values': _.omit(submitValues, 'rowKeyCount') })
  }

  if (config && _.isEmpty(baseSchema)) return <span style={{ color: 'red' }}>{_t1('组件错误')}</span>
  const bSchema = _.isFunction(customFieldConvrt) ? customFieldConvrt(baseSchema) : baseSchema
  return formKey ? React.useMemo(() => {
    return <div id='schema-form' style={{ position: 'relative', height: '100%' }}>
      <C is="I18nSchemaForm"
        onChange={(values) => {
          const vali = bSchema?.form?.find(f => f.key === 'key')?.validate
          if (!_.isFunction(vali) || !vali(values?.key, properties?.[formKey])) { // 标识格式错误时，不保存
            onChange(values)
          }
        }}
        formKey={'field-prop' + formKey + config}
        initialValues={values}
        schema={bSchema}
        group={FieldGroup}
        component={props2 => {
          if (props2.invalid) {
            let invalidFields = []
            let values = props2.form.getState()?.values || {}
            props2.fields?.forEach(f => {
              if (f.required && !values[f.key]) invalidFields.push('【' + f.label + '】')
              if (f.key === 'folder' && values.folderType === 'folder' && !values.folder) {
                // 附件文件夹字段，动态必填，特殊处理
                invalidFields.push('【' + f.label + '】')
              }
            })
            if (invalidFields.length > 0) {
              setInvalid(formKey, `${_t1('字段')}${invalidFields.join('')}${_t1('未进行配置')}`)
            }
          } else {
            setInvalid(formKey, null)
          }
          props2.form && props2.form.change('invalid', props2.invalid)
          return <FormLayout {...props2} {...props} />
        }}
      />
    </div>
  }, [formKey, values?.rowKeyCount, config]) : null
}

const PropertiesForm = ({ value, onChange, formKey, baseSchema, setError }) => {
  return <C is='I18nSchemaForm'
    onChange={values => onChange(values)}
    formKey={formKey}
    initialValues={value}
    schema={baseSchema}
    group={FieldGroup}
    component={props => {
      setError && setError(value.key, props.errors && _.values(props.errors)?.[0])
      return <FormLayout {...props} />
    }}
  />
}

export { NewPropertiesForm, PropertiesForm, FormTitle, getWidgetSchema }
