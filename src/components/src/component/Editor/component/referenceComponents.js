import React from 'react'
import _ from 'lodash'
import { Select, message, Button, Modal } from 'antd'
import { app, api, use } from 'xadmin'
import { C, Loading } from 'xadmin-ui'
import { SwapOutlined } from '@ant-design/icons';
import { TableContext } from '../context';
import { innerTables, isInnerTables, getInnerTables } from '../utils3'
import async from 'async'

const { OptGroup, Option } = Select;

// 未完成字段类型暂不可用进行过滤处理
const filterFields = fields => {
  const allowRelate = ['数字', '选择器', '文本', '区域', '时间', '时间2', '布尔值', '附件', '附件组', '富文本',
    '字节数组', '定位', '链接', '日期范围', '星级评价', '编号', '用户']
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

const TableFieldSelect = props => {
  const { input: { value, onChange }, option } = props

  const [tables, setTables] = React.useState([])
  const [fields, setFields] = React.useState([])
  const [loading, setloading] = React.useState(false)
  const [loading2, setLoading2] = React.useState(true)

  const [tableValue, setTableValue] = React.useState(value ? value.id : null)
  const [fieldValue, setFieldValue] = React.useState(value?.field?.key)
  const { form } = use('form')
  
  const { transI18n } = use('model.transI18n')

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
      list.push({ id: 'User', title: '用户', tableType: 'table' })
      list.push({ id: 'Role', title: '角色', tableType: 'table' })
      setTables(list)
    }).catch((err) => message.error(err))
  }

  const getFieldsData = id => {
    if (id === 'User' || id === 'Role') {
      getModelSchema({ name: id }).then(schema => {
        const transSchema = transI18n(schema)
        const fields = schema && schema.properties && Object.keys(schema.properties).map(item => {
          let field = transSchema.properties[item]
          return {
            title: field.title,
            key: item,
            fieldSchema: { ...field, config: field.type === 'string' ? '文本' : null }
          }
        })
        setFields(fields)
      })
    } else if (id) {
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
        message.error(err)
      })
    } else {
      setFields([])
    }
  }

  React.useEffect(() => {
    // 请求所有表数据
    getTableData()
    if (tableValue) getFieldsData(tableValue)
  }, [])

  const onTableChange = selected => {
    // 切换表名时，清空显示字段和多字段，内置查询
    form.change('showField', null)
    form.change('insideFilter', null)

    setTableValue(selected)
    setFieldValue()
    let db = null
    if (isInnerTables(selected)) {
      db = getInnerTables(selected)
    } else {
      db = tables.filter(t => t.id == selected)[0]
    }
    onChange(db)
  }

  const onFieldChange = selected => {
    setFieldValue(selected)
    const db = tables.filter(t => t.id == tableValue)[0]
    onChange({ ...db, field: fields.find(f => f.key === selected) })
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
        return loading2 ? <Select
          defaultValue={tableValue}
          loading={loading2}
          notFoundContent={loading2 ? <Loading /> : <C is="NoData" />}
        /> : (
          <Select
            style={style}
            key={valid + tableValue}
            defaultValue={(!valid && tableValue && !loading2) ? _t1(`该表已被删除,请重新选择`) : tableValue}
            onChange={onTableChange}
            showSearch
            filterOption={(input, option) => (
              option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            )}
            placeholder={_t1("选择引用表")}
            allowClear
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
      }, [tables, loading2])}
      {React.useMemo(() => {
        return (
          <Select
            style={{ ...style, marginTop: '3px' }}
            value={fieldValue}
            onChange={onFieldChange}
            onDropdownVisibleChange={onDropdownVisibleChange}
            placeholder={_t1("选择引用字段")}
            allowClear
            loading={loading}
            notFoundContent={loading ? <Loading /> : <C is="NoData" />}
          >
            {ffields && ffields.map(field => <Option key={field.key}>{field.title}</Option>)}
          </Select>
        )
      }, [loading, fieldValue, ffields])}
    </div>
  )
}

const BindField = props => {
  const { input, children } = props
  const [bind, setBind] = React.useState(_.isString(input?.value) && input?.value?.indexOf('[field]:') > -1)
  const { editingSchema = {} } = React.useContext(TableContext)
  const { key } = use('form', state => ({
    key: state.values && state.values.key
  }))

  const ops = editingSchema.form?.filter(k => k !== key)?.map(k => {
    return {
      value: '[field]:' + k,
      label: editingSchema.properties?.[k]?.title
    }
  })
  return <>
    <div style={{ width: '80%', display: 'inline-block' }}>
      {
        bind ? <Select
          style={{ width: '100%' }}
          options={ops}
          placeholder={_t1('当前表中的字段')}
          {...input}
        /> : children
      }
    </div>
    <div style={{ width: '20%', display: 'inline-block' }}>
      <Button onClick={() => {
        input.onChange(null)
        setBind(before => !before)
      }}><SwapOutlined /></Button>
    </div>
  </>
}

// 给schema增加ID
const addID = (schema) => {
  return {
    ...schema,
    form: _.uniq(['id', ...(schema?.form || [])]),
    properties: {
      id: {
        type: 'string',
        title: 'ID'
      },
      ...(schema?.properties || {})
    }
  }
}

const InsideFilter = ({ input, schemaFormat }) => {
  const [visible, setVisible] = React.useState(false)
  const [schema, setSchema] = React.useState({ properties: {} })
  const [loading, setLoading] = React.useState(false)
  const { tableInfo } = React.useContext(TableContext)
  const { searchRelate, form } = use('form', state => ({
    searchRelate: state.values && state.values.searchRelate
  }))
  const relateTableId = searchRelate && searchRelate.id
  
  
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
                component: props => <RoleSelect { ...props } />
              },
              department: {
                ...schema.properties.department,
                canIn: true,
                component: props => <C is="DepartmentSelectField" { ...props } />
              }
            }
          }
        }
        setSchema(addID(schema))
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
      api({ name: 'core/t/schema' }).get(relateTableId).then(({ schema = {} }) => {
        setSchema(addID(schema))
        setLoading(false)
      }).catch((err) => {
        message.error(err)
        setLoading(false)
      })
    } else {
      setSchema({ properties: {} })
    }
  }

  const handleChange = (val) => {
    let result = []
    let list = []
    if (val?.length > 1) { // 或
      list = val?.map(v => v?.[0]) || []
      form.change('conditionType', 'any')
    } else { // 且
      form.change('conditionType', 'all')
      list = val?.[0] || []
    }
    
    list.forEach(v => {
      let matchValue = {}
      if (_.isString(v.value) && v.value?.indexOf('[field]:') > -1) {
        let fieldId = v.value.substring(8)
        matchValue.field = {
          id: fieldId,
          name: "",
          table: {
            id: tableInfo?.id,
            title: tableInfo?.title
          }
        }
      } else {
        matchValue.value = v.value?.like ? v.value.like : v.value // 去掉like，因为区域类型过滤器，会加like
      }
      result.push({
        field: {
          id: v.field,
          name: schema?.properties?.[v.field]?.title,
          table: {
            id: relateTableId,
            title: _t1("数据表名称")
          }
        },
        method: v.method === 'notNull' ? 'isNotNull' : v.method, // 后端不为空和queryEditor不统一
        matchValue
      })
    })
    input.onChange(result)
  }

  const getValue = (val) => {
    let result = []
    if (!_.isEmpty(val)) {
      result.push(val?.map(v => {
        let vm = v.matchValue
        let value = vm?.value || (vm?.field?.id ? ('[field]:' + vm.field.id) : null)
        return {
          value,
          method: v.method === 'isNotNull' ? 'notNull' : v.method, // 后端不为空和queryEditor不统一
          field: v.field?.id
        }
      }))
    }
    return result
  }
  const [val, setVal] = React.useState(getValue(input.value))

  return (<>
    <Button onClick={() => {getFieldsData();setVisible(true)}} >{_t1('点击配置')}</Button>
    <Modal title={_t1("查询条件")} visible={visible}
      onCancel={() => setVisible(false)}
      onOk={() => { handleChange(val); setVisible(false) }}
    >
      {
        loading ? <Loading /> :
        <C is="QueryEditor"
          onlyOneType
          schema={schemaFormat(schema) || { properties: {} }}
          input={{ value: val, onChange: setVal }}
          DataWrap={BindField}
          btnName={_t1("添加查询条件")}
          fieldPlaceholder={_t1("引用表中的字段")}
        />
      }
    </Modal>
  </>)
}

const RoleSelect = props => {
  const { input: { onChange, value } } = props
  const [ data, setData ] = React.useState(null)

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

export { InsideFilter, TableFieldSelect }
