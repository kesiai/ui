import React from 'react'
import _ from 'lodash'
import { use, app } from 'xadmin'
import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput } from './common'
import { RelateShowFields, InsideFilter, TableSelect, ShowField } from '../component/relateComponents'
import RecordDetail from '../component/RecordDetail'
import { TypeSelect } from './select'
import UserRoleComponent from '../../../fieldComponent/UserRoleComponent'
import { Input, Radio } from 'antd'
import { RelateModelSelect, RelateMultiSelect, RelateSelect } from '../../../relate'
import { forSchema } from '../utils'

const DefaultRelate = (props) => {
  const { form } = use('form')
  const [schema, setSch] = React.useState(form.getState()?.values)

  React.useEffect(() => {
    form.useEffect(({ values }) => {
      setSch(before => {
        const result = forSchema(values)
        if (
          JSON.stringify(before.relate) !== JSON.stringify(result.relate) ||
          JSON.stringify(before.relateShowFields) !== JSON.stringify(result.relateShowFields) ||
          before.selectType !== result.selectType
        ) {
          props.input?.onChange(null)
        }
        return result
      })
    })
  }, [])
  
  let Comp, others
  
  if (['User', 'Role'].indexOf(schema.relateTo) > -1) { // 用户表、角色表、内置查询或字段脚本
    const model = app.get('models')?.[schema.relateTo]
    Comp = UserRoleComponent
    others = {
      mode: schema.type == 'array' ? 'multiple' : 'single',
      insideFilte: schema.insideFilter,
      relateSchema: schema,
      schema: model
    }
  } else if (['object', 'array'].indexOf(schema.type) > -1 && schema.relate?.id) { // 外部工作表
    const relate = schema && schema.relate
    const relateShowFields = schema && schema.relateShowFields
    const id = relate && relate.id
    const fieldSchema = relate.fields && relate.fields[0] && relate.fields[0].fieldSchema

    Comp = schema.selectType === 'multiple' ? RelateMultiSelect : RelateSelect
    others = {
      schema: { name: `core/t/${id}/d` },
      fieldSchema: fieldSchema,
      relateSchema: schema,
      tableID: relate.id,
      displayField: relate.fields?.[0]?.key || 'name',
      relateTableName: id,
      insideFilter: schema.insideFilter
    }

    if (relateShowFields && relateShowFields.length > 0) { // 多字段
      Comp = RelateModelSelect
      others.selectType = schema.selectType
      others.relateShowFields = relateShowFields
    }
  } else {
    Comp = () => <Input disabled />
    others = {}
  }

  return <Comp
    {...props}
    input={{
      value: props.input.value,
      onChange: v => {
        props.input.onChange(_.isUndefined(v) ? null : v)
      }
    }}
    field={{
      ...props.field,
      schema: _.omit(schema, ['disabled', 'createDisabled', 'editDisabled']),
      ...others
    }}
    {...others}
  />
}

const ShowType = ({ input }) => {
  const { selectType } = use('form', state => ({ selectType: state.values?.selectType }))

  React.useEffect(() => {
    if (selectType !== 'multiple' && input.value === 'table') {
      input.onChange('select')
    }
  }, [selectType])

  const ops = selectType === 'multiple' ? [
    { value: 'select', label: _t('下拉') },
    { value: 'card', label: _t('卡片') },
    { value: 'table', label: _t('表格') }
  ] : [
    { value: 'select', label: _t('下拉') },
    { value: 'card', label: _t('卡片') }
  ]

  return <Radio.Group options={ops} {...input} />
}

const RelateTable = {
  type: 'object',
  name: _r('关联字段'),
  title: _r('关联字段'),
  description:_r("关联相关数据表，可以从中引用或创建记录，如：订单关联商品"),
  icon: 'inbox',
  key: 'relate-table',
  properties: {
    ...baseConfig,
    relate: {
      title: _r('表名'),
      type: 'object',
      field: {
        effect: (f, form, field) => {
          const value = f.value
          if (value && value.tableType === 'table' && value.fields && value.fields.length > 0) {
            form.setFieldData('relateShowFields', { table: value })
            form.setFieldData('relateShowFields', { display: true })
            form.setFieldData('selectType', { display: true })
            form.setFieldData('recordDetail', { display: true })
          } else if (value && value.id === 'Warning') { // 报警
            form.setFieldData('relateShowFields', { display: true })
            form.setFieldData('selectType', { display: false })
            form.setFieldData('recordDetail', { display: false })
          } else {
            form.setFieldData('relateShowFields', { display: false })
            form.setFieldData('selectType', { display: true })
            form.setFieldData('recordDetail', { display: false })
          }
          setTimeout(() => {
            if (value && value.tableType === 'table') { // 外部表
              form.setFieldData('showField', { display: false })
              form.setFieldData('allowAdd', { display: true })
            } else {
              form.setFieldData('showField', { display: true })
              form.setFieldData('allowAdd', { display: false })
            }
          })
        }
      },
      description: _r('非内部表需选择关联字段'),
      properties: {}
    },
    showField: {
      title: _r('显示字段'),
      type: 'string',
    },
    relateShowFields: {
      title: _r('多字段'),
      type: 'array',
      items: {
        type: 'object',
        properties: {}
      }
    },
    insideFilter: {
      title: _r('内置查询'),
      type: 'array',
      items: {}
    },
    selectType: {
      title: _r('类型'),
      type: 'string',
      field: {
        effect: (f, form) => {
          const value = f.value
          if (value === 'multiple') {
            form.setFieldData('unique', { display: false })
            form.change('unique', false)
          } else {
            form.setFieldData('unique', { display: true })
          }
        },
        component: TypeSelect
      }
    },
    recordSelectType: {
      title: _r('记录选择形式'),
      type: 'string',
      enum1: ['select', 'modal'],
      enum_title1: [_r('下拉'), _r('弹窗')],
      selectFace: "flatten",
      selectType: 'single'
    },
    showType: {
      title: _r('显示形式'),
      type: 'string',
      field: {
        component: ShowType
      }
    },
    allowSelectOld: {
      title: _r('允许选择已有记录'),
      type: 'boolean',
      field: {
        defaultValue: true
      }
    },
    allowAdd: {
      title: _r('允许新增记录'),
      type: 'boolean'
    },
    treeMark: {
      title: _r('树形条件'),
      type: 'boolean',
      description:_r('勾选后，才可建立层级关系')
    },
    recordDetail: {
      title: _r('记录详情'),
      type: 'object',
      properties: {}
    },
    defaultVal: {
      title: _r("默认值"),
      type: "object",
      properties: {},
      field: {
        component: DefaultRelate,
        hideError: true
      }
    },
    ..._.omit(editConfig, ['canOrder'])
  },
  required: ['title', 'key', 'relate'],
  form: [keyForm, 'title',
    {
      key: 'relate',
      component: props => React.useMemo(() => <TableSelect {...props} />, []),
      validate: value => {
        if (value && value.tableType == 'table') {
          if (value.fields && value.fields.length > 0) {
            return null
          } else {
            return _t1('非内部表需选择关联字段')
          }
        } else if (JSON.stringify(value) === '{}') { // 必填初始化报错
          return _t1('表名不能为空')
        } else {
          return null
        }
      }
    },
    { key: 'showField', component: ShowField },
    { key: 'relateShowFields', component: RelateShowFields },
    { key: 'insideFilter', component: InsideFilter },
    'selectType',
    'allScript',
    { key: 'recordDetail', component: RecordDetail },
    '*'
  ],
  formEffect: (form) => {
    let initialValues = form.getState().initialValues
    if (initialValues.relate?.id === 'Warning') { // 报警
      // 显示字段，多字段都有
      form.setFieldData('selectType', { display: false })
      form.change('selectType', 'single')
      form.setFieldData('recordDetail', { display: false })
    } else if (!(initialValues.relate && initialValues.relate.tableType === 'table' && initialValues.relate.fields)) { // 内部表
      form.setFieldData('relateShowFields', { display: false })
      form.setFieldData('recordDetail', { display: false })
    } else { // 外部表
      form.setFieldData('showField', { display: false })
    }
    let { selectType } = form.getState().values
    if (selectType === 'multiple') { // 如果是多选，不可作为过滤条件，新增多选可以过滤了
      form.setFieldData('unique', { display: false })
      form.change('unique', false)
    } else {
      form.setFieldData('unique', { display: true })
    }
    form.useField('filterFields', state => {
      form.setFieldData('filterByRes', { display: !!state.value })
    })
    form.useField('relate', state => {
      if (initialValues.relate?.id !== state.value?.id) {
        form.change('insideFilter', [])
      }
    })
    commonFormEffect(form)
  }
}

const tableSchema = {
  ...RelateTable,
  properties: {
    ..._.omit(RelateTable.properties, 'relate')
  },
  required: RelateTable.required.filter(k => k != 'relate'),
  form: RelateTable.form.filter(k => k?.key != 'relate'),
}
const tableDataSchema = tableSchema
export { RelateTable, tableSchema, tableDataSchema }
