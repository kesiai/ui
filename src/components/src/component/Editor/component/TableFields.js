import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Button, Dropdown, Menu, Drawer } from 'antd'
import getWidgets from '../wigets'
import { use } from 'xadmin'
import Icon from './Icon'
import { PropertiesForm, getWidgetSchema } from './PropertiesForm'
import _ from 'lodash'
import FormList from './FormList'
import { uuid } from '../utils3'
import { updateSchemaProperties, addDefaultVal } from '../utils'
import { TableWidgetChange } from './WidgetChange'

const TableFields = (props) => {
  const { input: { value, onChange } } = props
  
  const { hideScript } = use('i18n.permission')
  const schema = value ? value : {
    'type': 'object',
    'name': 'tableProperties',
    'title': _r('表格属性'),
    'key': 'tableProperties',
    'properties': {}
  }
  const [visible, setVisible] = useState()
  const fieldRef = useRef()  
  const { displayForm } = use('form', state => ({ displayForm: state.values.displayForm }))
  
  const onClick = (e) => {
    const initVal = _.omit(_.find(getWidgets(_t1, hideScript), v => v.config == e.key), 'icon')
    initVal.name = initVal.name + '-' + uuid(4, 16)
    let nowForm = [..._.compact(schema && schema.form), initVal.name]
    let defaultVal = addDefaultVal(initVal, _t1)
    if (e.key == '选择器') {
      defaultVal.select = { value: defaultVal.enum1, label: defaultVal.enum_title1 }
    }

    let nowSchema = {
      ...schema,
      properties: {
        ...(schema && schema.properties),
        [initVal.name]: { ...defaultVal, key: initVal.name },
      },
      listFields: nowForm,
      form: nowForm
    }
    
    onChange(nowSchema)
  }

  const onFieldClick = (key) => {
    setVisible(true)
    fieldRef.current = schema.properties[key]
  }

  const onFieldDelete = (key) => {
    let nowSchema = {}
    if (key) {
      nowSchema = {
        ...schema,
        properties: {
          ..._.omit(schema.properties, [key])
        },
        listFields: _.difference(schema.form, [key]),
        form: _.difference(schema.form, [key]),
        required: _.difference(schema.required, [key])
      }
    }
    onChange(nowSchema)
  }

  const onFormChange = (val) => {
    const key = fieldRef.current.key
    const values = _.omit(val, ['relateTo', 'enum1', 'enum_title1', 'enum_color1'])
    let newSchema = updateSchemaProperties(key, values, _.cloneDeep(schema))?.properties[val.key]
    if (!newSchema) return
    newSchema.relateTo = newSchema?.relate ? null : newSchema.relateTo
    newSchema = { ..._.omit(values, ['relate']), ...newSchema}
    value.properties[val.key] = newSchema
    if (key !== val.key) {
      value.properties = _.omit(value.properties, key)
      value.form?.splice(value.form.indexOf(key), 1, val.key)
      value.listFields.indexOf(key) > -1 && value.listFields?.splice(value.listFields.indexOf(key), 1, val.key)
      fieldRef.current.key = val.key
    }    
    if (newSchema.relateTo || newSchema.relate || newSchema.config != '关联字段') {
      onChange(_.cloneDeep(value))
    }
  }

  const moveCard = (form) => {
    onChange({...schema, form, listFields: form})
  }

  const setError = (key, error) => {
    const newSchema = _.cloneDeep(value)
    if (newSchema.properties[key]) {
      newSchema.properties[key].error = error
    }
    onChange(newSchema)
  }

  const FieldEdit = () => {
    const pValue = fieldRef.current?.key && value.properties[fieldRef.current.key]
    const [field, setField] = React.useState(pValue) // 这个state用与切换字段类型更新表单
    
    if (pValue && pValue.relateTo && !pValue.relate) {
      pValue.relate = { id: pValue.relateTo }
    }
    let baseSchema = {}
    if (field?.config) {
      baseSchema = _.cloneDeep(getWidgetSchema(field.config)?.baseSchema)
      // 表格字段去掉部分权限配置
      const omitKeys = ['widthInForm', 'unique', 'listFields', 'editableFields', 'batchChangeFields', 'filterFields', 'tableFixed', 'jsLogic', 'createForm']
      if (displayForm == 'card') omitKeys.push('canOrder') // 卡片形式 字段配置无排序功能
      baseSchema.properties = _.omit(baseSchema.properties, omitKeys)
      baseSchema.form = _.difference(baseSchema.form, omitKeys)
      // 文本类型配置，去掉公式计算
      let tc = baseSchema.properties.textContent
      if (tc) {
        baseSchema.properties.textContent = {
          ...tc,
          enum: tc.enum.filter(key => key !== 'logic'),
          enum_title: tc.enum_title.filter(key => key !== '公式计算')
        }
      }
    }
    
    return <Drawer
      title={<>
        <Icon type='left' onClick={() => setVisible(false)} />
        {_t1('表格-') + (field?.title || field?.config)}
        <TableWidgetChange
          field={field}
          setField={setField}
          onFormChange={onFormChange}
        />
      </>}
      closable={false}
      onClose={() => setVisible(false)}
      visible={visible}
      getContainer={document.getElementById('schema-form')}
      style={{ position: 'absolute' }}
      bodyStyle={{ padding: '0 4px' }}
      width="100%"
      className="table-custom-drawer"
    >
      {field?.config && <PropertiesForm
        onChange={onFormChange} value={field} baseSchema={baseSchema} formKey={field?.key} setError={setError}>
      </PropertiesForm>}
    </Drawer>
  }

  const menu = (
    <Menu onClick={onClick} style={{ maxHeight: 260, overflowY: 'auto' }} >
      {getWidgets(_t1, hideScript).filter(item => !item.hiddenInTable).map(item => {
        return <Menu.Item key={item.config}>{item.title}</Menu.Item>
      })}
    </Menu>
  )

  return <div style={{ display: 'grid' }}>
    <FormList
      schema={schema}
      onSelect={onFieldClick}
      deleteCard={onFieldDelete}
      moveCard={moveCard}
      dragArea='right'
    />
    <Dropdown overlay={menu} trigger='click'>
      <Button>{_t1('添加字段')}</Button>
    </Dropdown>
    {useMemo(() => <FieldEdit></FieldEdit>, [visible])}
  </div>
}

export default TableFields