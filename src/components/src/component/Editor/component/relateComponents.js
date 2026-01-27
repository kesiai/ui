import React from 'react'
import _ from 'lodash'
import { Select, message, Button, Modal, Menu, Dropdown, Drawer } from 'antd'
import { SwapOutlined } from '@ant-design/icons';
import { app, api, use } from 'xadmin'
import { C, Loading } from 'xadmin-ui'
import { TableContext, Table2Context } from '../context';
import FormList from './FormList';
import Icon from './Icon'
import { getWidgetSchema, PropertiesForm } from './PropertiesForm';
import { innerTables, isInnerTables, getInnerTables } from '../utils3';
import async from 'async'

const { OptGroup, Option } = Select;

const warningFields = [
  { key: 'type', title: _r('报警类别') },
  { key: 'time', title: _r('报警时间') },
  { key: 'model', title: _r('模型') },
  { key: 'department', title: _r('所属部门') },
  { key: 'parent', title: _r('所属资产') },
  { key: 'node', title: _r('资产') },
  // 资产编号去掉，因为后台没有这个字段，取的是node字段的id，所以作为关联字段查询时，
  // 后端只会查id和nodeId，不会查node，所以一直是空
  { key: 'processed', title: _r('处理动作') },
  { key: 'status', title: _r('确认动作') },
  { key: 'desc', title: _r('报警描述') },
  { key: 'remark', title: _r('报警处理') },
  { key: 'level', title: _r('级别') },
  { key: 'confirmTime', title: _r('确认时间') },
  { key: 'confirmUser', title: _r('确认人') },
  { key: 'fields', title: _r('报警数值') }
]

// 未完成字段类型暂不可用进行过滤处理
const filterFields = fields => {
  const allowRelate = ['数字', '选择器', '文本', '区域', '时间', '时间2',
    '定位', '链接', '日期范围', '星级评价', '编号']
  const filter = []
  fields && _.isArray(fields) && fields.forEach(element => {
    const schema = element.fieldSchema
    const config = schema && schema.config
    if (allowRelate.indexOf(config) >= 0) {
      filter.push(element)
    }
  })
  return filter
}

const MapField = ({ input }) => {
  const { fieldSchema, key } = use('form', state => state.values)
  const { editingSchema = {} } = React.useContext(TableContext)
  const ep = editingSchema.properties || {}

  // 去掉已经被映射的字段
  let alreadyBeMapped = []
  Object.keys(ep).filter(k => ep[k].config === "关联字段").forEach(k => {
    ep[k].relateShowFields?.forEach(rsf => {
      if (rsf.key !== key && rsf.mapField) {
        alreadyBeMapped.push(rsf.mapField)
      }
    })
  })

  const options = Object.keys(ep).filter(k => {
    return ep[k].config === fieldSchema?.config && alreadyBeMapped.indexOf(k) === -1
  }).map(k => {
    return {
      value: k,
      label: ep[k]?.title
    }
  })

  return <Select
    {...input}
    options={options}
    placeholder={_t1('当前表中相同字段类型的字段')}
  />
}

const RelateShowFields = props => {
  const { input: { onChange } } = props
  const value = props.input.value || []
  
  let schema = {
    'type': 'object',
    'name': 'tableProperties',
    'title': _r('表格属性'),
    'key': 'tableProperties',
    'properties': {}
  }
  if (value?.length > 0) {
    schema.form = value.map(f => f.key)
    value.forEach(f => {
      schema.properties[f.key] = {
        canOrder: false,
        filter: false,
        listFields: true,
        tableFixed: false,
        ...f
      }
    })
  }

  const [visible, setVisible] = React.useState()
  const fieldRef = React.useRef()

  const [fields, setFields] = React.useState([])

  const { formState: { values } } = use('form')
  const relateTableId = values && values.relate && values.relate.id
  const relateFieldId = values && values.relate && values.relate.fields && values.relate.fields[0]

  const getFieldsData = (id, seletedField) => {
    if (id === 'Warning') { // 报警
      setFields(warningFields)
    } else if (id) {
      api({ name: 'core/t/schema' }).get(id).then(({ schema }) => {
        const fields = schema && schema.properties && Object.keys(schema.properties).map(item => {
          let field = schema.properties[item]
          return { title: field.title, key: item, fieldSchema: field }
        })
        if (seletedField) {
          setFields(fields.filter(item => item.key != seletedField.key))
        } else {
          setFields(fields)
        }
      }).catch((err) => {
        message.error(err, err?.detail || err?.json?.detail)
      })
    } else {
      setFields([])
    }
  }

  React.useEffect(() => {
    getFieldsData(relateTableId, relateFieldId)
  }, [relateTableId, relateFieldId])
  
  const onClick = (e) => {
    const newField = fields.find(f => f.key === e.key)
    onChange([...(value || []), newField])
  }

  const onFieldClick = (key) => {
    if (values?.selectType === 'multiple') {
      message.warning(_t1('只有单选状态下可进入高级配置'))
      return
    }
    setVisible(true)
    fieldRef.current = schema.properties[key]
  }

  const onFieldDelete = (key) => {
    onChange(value.filter(v => v.key !== key))
  }

  const onFormChange = (val) => {
    const key = fieldRef.current.key
    onChange(value?.map(v => v.key === key ? val : v))
  }

  const moveCard = (form) => {
    onChange(form.map(key => value.find(v => v.key === key)))
  }

  const FieldEdit = () => {
    const pValue = fieldRef.current?.key && value?.find(v => v.key === fieldRef.current.key)
    const [field, setField] = React.useState(pValue) // 这个state用与切换字段类型更新表单
    
    let baseSchema = {
      type: 'object',
      properties: {
        // canOrder: {
        //   title: _r("开启排序"),
        //   type: "boolean"
        // },
        filterFields: {
          title: _r("过滤查询中显示"),
          type: "boolean"
        },
        listFields: {
          title: _r("列表中显示"),
          type: "boolean"
        },
        tableFixed: {
          title: _r("列固定"),
          type: "boolean"
        }
      }
    }
    // 过滤掉当前控件本来就没有的配置
    const oldSchema = getWidgetSchema(field?.fieldSchema?.config)?.baseSchema
    let l = Object.keys(baseSchema.properties)
    if (oldSchema?.form?.indexOf('*') > -1) {
      l = l.filter(key => Object.keys(oldSchema?.properties).indexOf(key) > -1)
    } else {
      l = l.filter(key => oldSchema?.form?.indexOf(key) > -1)
    }
    baseSchema = {
      ...baseSchema,
      properties: _.pick(baseSchema.properties, l)
    }

    // 值映射到当前表配置
    baseSchema.properties.mapToCurrent = {
      title: _t1('值映射到当前表'),
      type: 'boolean',
      description: _r('通过当前配置，可以在创建/修改记录时，选定关联记录后，将关联记录中该字段的值映射显示到绑定字段中，可以在表单中进行修改，映射字段的修改不影响源数据。绑定映射字段时，字段类型需要保持一致。'),
      field: {
        effect: ({ value }, form) => {
          setTimeout(() => {
            form.setFieldData('mapField', { display: !!value })
            if (!value) form.change('mapField', null)
          })
        }
      }
    }
    baseSchema.properties.mapField = {
      title: _t1('映射字段'),
      type: 'string',
      field: {
        component: MapField
      }
    }

    if (field?.fieldSchema?.config === '关联字段') {
      baseSchema = { type: 'object', properties: {} }
    }
    
    return <Drawer
      title={<>
        <Icon type='left' onClick={() => setVisible(false)} />
        {_t1('多字段-') + field?.title}
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
      <PropertiesForm
        onChange={onFormChange} value={field} baseSchema={baseSchema} formKey={field?.key}>
      </PropertiesForm>
    </Drawer>
  }

  const menu = (
    <Menu onClick={onClick} style={{ maxHeight: 260, overflowY: 'auto' }} >
      {fields.filter(field => {
        return !value?.find(v => field.key === v.key)
      }).map(field => {
        return <Menu.Item key={field.key}>{field.title}</Menu.Item>
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
    {React.useMemo(() => <FieldEdit></FieldEdit>, [visible])}
  </div>
}

const TableSelect = props => {
  const { input: { value, onChange }, option } = props

  const [tables, setTables] = React.useState([])
  const [fields, setFields] = React.useState([])
  const [loading, setloading] = React.useState(false)
  const [loading2, setLoading2] = React.useState(false)

  const [tableValue, setTableValue] = React.useState(value ? value.id : null)
  const [feildValue, setFeildValue] = React.useState(value && value.fields ? value.fields.map(f => f.title) : [])
  const { form } = use('form')
  

  const getTableData = () => {
    setLoading2(true)
    api({ name: 'core/t/schema' }).query({ fields: ['title', 'name', 'function'] }).then(({ items }) => {
      let list = []
      setLoading2(false)
      if (items && items.length > 0) {
        items?.forEach(item => {
          if (item?.function?.indexOf('device') >= 0) {
            list.push({ ...item, tableType: 'table', tt: 'device' })
          } else if (item?.function?.indexOf('dataAuth') >= 0) {
            list.push({ ...item, tableType: 'table', tt: 'department' })
          } else {
            list.push({ ...item, tableType: 'table', tt: 'normal' })
          }
        })
      }
      setTables(list)
    }).catch((err) => message.error(err, err?.detail || err?.json?.detail))
  }

  const getFieldsData = id => {
    if (id) {
      setloading(true)
      api({ name: 'core/t/schema' }).get(id).then(({ schema }) => {
        const fields = schema && schema.properties && Object.keys(schema.properties).map(item => {
          let field = schema.properties[item]
          return { title: field.title, key: item, fieldSchema: field }
        })
        setFields(fields)
        setloading(false)
      }).catch((err) => {
        setloading(false)
        message.error(err, err?.detail || err?.json?.detail)
      })
    } else {
      setFields([])
    }
  }

  React.useEffect(() => {
    // 请求所有表数据
    getTableData()
  }, [])

  const onTableChange = selected => {
    // 切换表名时，清空显示字段和多字段，内置查询
    form.change('showField', null)
    form.change('relateShowFields', null)
    form.change('insideFilter', null)
    form.change('allowAdd', false)

    setTableValue(selected)
    setFeildValue([])
    let db = null
    if (isInnerTables(selected)) {
      db = getInnerTables(selected)
    } else {
      db = tables.filter(t => t.id == selected)[0]
    }
    onChange(db)
  }

  const onFieldChange = selected => {
    // 切换显示字段时，清空多字段
    form.change('relateShowFields', null)

    const arraySelected = [selected]
    setFeildValue(arraySelected)
    const db = tables.filter(t => t.id == tableValue)[0]
    const selectedConvert = arraySelected.map(s => ({ key: s }))
    onChange({ ...db, fields: _.intersectionBy(fields, selectedConvert, 'key') })
  }

  const onDropdownVisibleChange = info => {
    if (info) {
      tableValue && getFieldsData(tableValue)
    }
  }

  const style = { width: '100%' }

  const ffields = filterFields(fields)

  const valid = Boolean([...innerTables, ...tables].filter(ts => ts.id == tableValue)[0])

  return (
    <div>
      {React.useMemo(() => {
        return (
          <Select
            style={style}
            key={valid + tableValue}
            defaultValue={!valid && tableValue ? _t1(`该表已被删除,请重新选择`) : tableValue}
            onChange={onTableChange}
            showSearch
            filterOption={(input, option) => (
              option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            )}
            placeholder={_t1("选择表")}
            allowClear
            notFoundContent={loading2 ? <Loading /> : <C is="NoData" />}
            loading={loading2}
          >
            <OptGroup label={_t1("内部表")}>
              {innerTables.map(table => <Option key={table.id}>{_t1(table.name)}</Option>)}
            </OptGroup>
            <OptGroup label={_t1("部门表")}>
              {tables.filter(t => t.tt === 'department')
                .map(table => <Option key={table.id}>{_t1(table.title)}</Option>)}
            </OptGroup>
            <OptGroup label={_t1("设备表")}>
              {tables.filter(t => t.tt === 'device')
                .map(table => <Option key={table.id}>{_t1(table.title)}</Option>)}
            </OptGroup>
            <OptGroup label={_t1("普通表")}>
              {tables.filter(t => t.tt === 'normal')
                .map(table => <Option key={table.id}>{_t1(table.title)}</Option>)}
            </OptGroup>
          </Select>
        )
      }, [tables])}
      {React.useMemo(() => {
        return (
          <Select
            style={{ ...style, marginTop: '3px' }}
            value={feildValue}
            onChange={onFieldChange}
            onDropdownVisibleChange={onDropdownVisibleChange}
            placeholder={_t1("内部表(默认name)")}
            allowClear
            loading={loading}
            disabled={isInnerTables(tableValue)}
            notFoundContent={loading ? <Loading /> : <C is="NoData" />}
          >
            {ffields && ffields.map(field => <Option key={field.key}>{field.title}</Option>)}
          </Select>
        )
      }, [loading, feildValue, ffields])}
    </div>
  )
}

const getModelSchema = ({ name, schema: base, data, state }) => new Promise((resolve, reject) => {
  const baseSchema = base || app.get('models')[name]
  const schemas = app.load_list(`${_.lowerCase(baseSchema.name)}.schema`)
  async.map(schemas, (item, cb) => {
    if (_.isFunction(item)) {
      try {
        item({ model: baseSchema, data, state }, (err, schema) => {
          cb(null, schema);
        });
      } catch (e) {
        cb(null, undefined);
      }
    } else {
      cb(null, item);
    }
  }, (err, schemas) => {
    if (err) return
    const schema = schemas.filter(Boolean).reduce((prev, s) => {
      const key = s.name
      return {
        ...prev,
        properties: {
          ...prev.properties,
          [key]: s
        },
        listFields: [
          ...(prev.listFields || []),
          ...(s.listFields || []).map(f => `${key}.${f}`)
        ].filter(Boolean),
        editableFields: [
          ...(prev.editableFields || []),
          ...(s.editableFields || []).map(f => `${key}.${f}`)
        ].filter(Boolean),
        batchChangeFields: [
          ...(prev.batchChangeFields || []),
          ...(s.batchChangeFields || []).map(f => `${key}.${f}`)
        ].filter(Boolean),
        filters: {
          ...prev.filters,
          submenu: [
            ...(prev.filters && prev.filters.submenu || []),
            ...(s.filters && s.filters.submenu || []).map(f => {
              if (f && f.key) {
                return { ...f, key: `${key}.${f.key}` }
              }
              return `${key}.${f}`
            })
          ]
        }
      }
    }, baseSchema)
    resolve(schema)
  })
})

const BindField = props => {
  const { input, children } = props
  const [bind, setBind] = React.useState(_.isString(input?.value) && input?.value.indexOf('[field]') > -1)
  const { editingSchema = {} } = React.useContext(TableContext)
  const insideTable = React.useContext(Table2Context)
  const { key } = use('form', state => ({
    key: state.values && state.values.key
  }))

  let ops = editingSchema.form?.filter(k => k !== key)?.map(k => {
    return {
      value: '[field]:' + k,
      label: editingSchema.properties?.[k]?.title
    }
  })
  if (insideTable?.editingSchema) { // 表格在高级编辑中
    const ops2 = insideTable.editingSchema.form?.filter(k => k !== key)?.map(k => {
      return {
        value: '[field][table]:' + k,
        label: '[表格]' + insideTable.editingSchema.properties?.[k]?.title
      }
    }) || []
    ops.push(...ops2)
  } else {
    Object.values(editingSchema.properties || {}).forEach(v => {
      if (v.config === '表格' && v.tableFields?.properties?.[key]) {
        v.tableFields.form?.filter(k => k !== key)?.forEach(k => {
          ops.push({
            value: '[field][table]:' + k,
            label: '[表格]' + v.tableFields?.properties?.[k]?.title
          })
        })
      }
    })
  }
  return <>
    <div style={{ width: '80%', display: 'inline-block' }}>
      {
        bind ? <Select
          style={{ width: '100%' }}
          options={ops}
          {...input}
        /> : children
      }
    </div>
    <div style={{ width: '20%', display: children ? 'inline-block' : 'none' }}>
      <Button onClick={() => setBind(before => {
        input.onChange(null)
        return !before
      })}><SwapOutlined /></Button>
    </div>
  </>
}

const InsideFilter = ({ input }) => {
  const [visible, setVisible] = React.useState(false)
  const [schema, setSchema] = React.useState({ properties: {} })
  const [loading, setLoading] = React.useState(false)
  const { relate } = use('form', state => ({ relate: state.values && state.values.relate }))
  const relateTableId = relate && relate.id
  
  const { transI18n } = use('model.transI18n')
  // const { settings: { warning } } = use('settings')

  const getFieldsData = () => {
    if (['Department', 'User', 'Role'].indexOf(relateTableId) > -1) {
      setLoading(true)
      getModelSchema({ name: relateTableId }).then(schema => {
        if (relateTableId === 'User') { // 关联用户表，内置查询，用户/部门增加包含，去掉密码
          schema = {
            ...schema,
            form: schema.form.filter(item => ['password', 'startTime'].indexOf(item.key) === -1),
            properties: {
              ...schema.properties,
              roles: {
                ...schema.properties.roles,
                canIn: true,
                component: props => <RoleSelect {...props} />
              },
              department: {
                ...schema.properties.department,
                canIn: true,
                component: props => <C is="DepartmentSelectField" {...props} />
              }
            }
          }
        } else if (relateTableId === 'Role') { // 关联角色表，去掉用户列表，因为users要换成usersId，弹窗选择下，model里不好改，而且没有应用场景
          schema = {
            ...schema,
            form: schema.form.filter(item => item !== 'users')
          }
        }
        setSchema(transI18n(schema))
        setLoading(false)
      })
    } else if (relateTableId === 'Warning') { // 报警
      let warningSchema = app.apps.find(item => item.name === 'iot.warning')?.models?.Warning
      const typeList = [] // warning && warning.warningkind || []
      setSchema({
        properties: {
          ...warningSchema.properties,
          node: { type: 'object', title: _r('资产') },
          type: {
            type: 'string',
            title: _r('报警类别'),
            enum: typeList.map(item => item.id),
            enum_title: typeList.map(item => item.name)
          }
        },
        form: warningSchema.listFields
      })
    } else if (relateTableId) {
      setLoading(true)
      api({ name: 'core/t/schema' }).get(relateTableId).then(({ schema }) => {
        setSchema(transI18n({
          ...schema,
          properties: {
            ...schema.properties,
            tableDataSetting: {
              ...schema?.properties?.tableDataSetting,
              filterMethodFn: (methods) => {
                return methods.filter(item => item?.name !== '包含' && item?.name !== '不包含')
              },
            }
          }
        }))
        setLoading(false)
      }).catch((err) => {
        message.error(err, err?.detail || err?.json?.detail)
        setLoading(false)
      })
    } else {
      setSchema({ properties: {} })
    }
  }

  return (<>
    <Button onClick={() => { getFieldsData(); setVisible(true) }} >{_t1('点击配置')}</Button>
    <Modal title={_t1("内置查询")} visible={visible} onCancel={() => setVisible(false)} footer={null}>
      {
        loading ? <Loading /> :
          <C is="QueryEditor"
            schema={schema || { properties: {} }}
            input={{ value: input.value ? input.value : [], onChange: input.onChange }}
            relation='and'
            DataWrap={BindField}
          />
      }
    </Modal>
  </>)
}

const ShowField = ({ input }) => {
  const [loading, setLoading] = React.useState(false)
  const [propList, setPropList] = React.useState([])
  const { relate } = use('form', state => ({ relate: state.values && state.values.relate }))
  const relateTableId = relate && relate.id

  React.useEffect(() => {
    if (['Department', 'User', 'Role'].indexOf(relateTableId) > -1) {
      setLoading(true)
      getModelSchema({ name: relateTableId }).then(schema => {
        let list = []
        let p = schema.properties
        for (let key in p) {
          let k = key === 'uid' ? 'id' : key // 兼容部门编号字段
          if (p[key].type === 'string') list.push({ key: k, title: _t1(p[key].title) })
        }
        // 更换关联表，清空显示字段
        if (list.every(item => item.key !== input.value)) input.onChange(null)
        // 去掉密码和重复密码
        list = list.filter(item => ['password', 'password2'].indexOf(item.key) === -1)
        setPropList(list)
        setLoading(false)
      })
    } else if (relateTableId === 'Warning') { // 报警
      setPropList(warningFields)
    }
  }, [relateTableId])

  return <Select
    value={input.value}
    onChange={input.onChange}
    loading={loading}
    allowClear
    notFoundContent={<C is="NoData" />}
  >
    {propList.map(field => <Option key={field.key}>{field.title}</Option>)}
  </Select>
}

const RoleSelect = props => {
  const { input: { onChange, value } } = props
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    api({ name: 'core/role ' })
      .fetch('', {})
      .then(({ json }) => {
        setData(json)
      })
  }, [])

  return (
    <Select
      placeholder={_t1("请选择角色")}
      onChange={onChange}
      defaultValue={value || data || []}
      style={{ width: '100%' }}
    >
      {
        data && data.map(item => {
          return (<Option key={item.id}>{item.name}</Option>)
        })
      }
    </Select>
  )
}

export { RelateShowFields, InsideFilter, TableSelect, ShowField }
