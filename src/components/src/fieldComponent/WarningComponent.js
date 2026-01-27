import React from 'react'
import _ from 'lodash'
import { _t } from 'xadmin-i18n'
import { Select, Modal, Button, Form } from 'antd'
import { app, use, api } from 'xadmin'
import { Model, ModelBlock } from 'xadmin-model'
import { C } from 'xadmin-ui'
import { getFormValues } from '../component/Editor/utils'
import { useScriptVal } from '../component/Editor/utils2'
import moment from 'moment'

const WarningFilter = props => {
  const { model } = use('model')
  const [ops, setOps] = React.useState([])
  const [list, setList] = React.useState([])
  const { input: { value, onChange }, showField = 'desc', label, field, selectType, filter, initValue } = props
  
  React.useEffect(() => {
    const key = field?.key
    model && api(model).query({ fields: [key, "modifyUser"] }, {}).then(({items}) => {
      setList(items)
      const arr = items.filter(v => v[key]?.[showField] && !_.isEmpty(v[key]?.[showField]))
      const optionList = arr.reduce((prev,cur) => prev.map(v => v[key]?.id).includes(cur[key]?.id) ? prev : [...prev,cur],[])
      const options = optionList.map(op => {
        return {
          value: op[key].id,
          label: initValue(op[key])
        }
      })
      setOps(options)
    })
  }, [])
  
  let val = value ? value.in?.map(v => {
    return initValue(list.find(item => item[field?.key]?.id === v)?.[field?.key])
  }) : []

  return <Select
    allowClear
    mode="multiple"
    onChange={ (v) => onChange(_.isEmpty(v) ? null : { in: v }) }
    value={val}
    placeholder={label}
    options={ops}
  />
}

// 格式化内置查询
const filterFormat = (filter) => {
  let result = _.cloneDeep(filter)
  if (filter.confirmUser?.eq) {
    result.confirmUser = filter.confirmUser.eq
  }
  return result
}

const WarningComponent = props => {
  const { input: { value, onChange }, showField, label, field, selectType, filter, antdForm } = props
  let sf = showField?? 'desc'
  const [visible, setVisible] = React.useState(false)
  const warningSchema = app.apps.find(item => item.name === 'airiot.warning')?.models?.Warning
  // const { settings: { warning } } = use('settings')
  const typeList = [] // warning && warning.warningkind || []

  // 单选确认
  const selectOne = value => {
    setVisible(false)
    onChange(value)
  }
  
  let schema = {
    ...warningSchema,
    properties: {
      ...warningSchema.properties,
      type: {
        type: 'string',
        title: _r('报警类别'),
        enum: typeList.map(item => item.id),
        enum_title: typeList.map(item => item.name)
      }
    },
    filters: {
      submenu: [ sf ]
    },
    listFields: field.relateShowFields ?
      [ sf, ...field.relateShowFields.map(item => item.key) ] : [sf],
    itemActions: [
      ({ item }) => {
        
        return <Button onClick={() => selectOne(item)}>{_t1('选择')}</Button>
      }
    ],
    initialValues: {
      wheres: {
        filters: field.insideFilter ? filterFormat(field.insideFilter) : {}
      }
    },
    dataTableProps: (columns) => {
      return {
        scroll: { x: 900 },
        columns: columns.map(c => ({ ...c, width: c.key === '__action__' ? 100 : c.width || 200 }))
      }
    },
    batchActions: null
  }

  // 不加这句，node会自动变成nodeId，当为空不为空时，只能用node
  for (let key in field.insideFilter) {
    if (field.insideFilter[key]?.nin || field.insideFilter[key]?.in) 
      field.schema.properties[key].nullFilter = true
  }

  // 字段脚本部分
  const f = Form.useForm()
  let values = getFormValues(field.schema, antdForm || f)
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema: field.schema, value, values, onChange })
    }
  }, [JSON.stringify(values)])

  const toFixed = (Dight, How = 2) => {
    return Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How)
  }

  const toValue = (value, fixed) => {
    return _.isBoolean(value) ?
      (value ? 1 : 0) :
      (_.isNumber(value) ?
        toFixed(value, fixed !== undefined ? fixed : 3) :
        (value ? value.toString() : '-')
      )
  }

  const initValue = (val) => {
    let fieldVal = val?.[sf]
    if (sf === 'fields') { // 报警数值
      return fieldVal && fieldVal[0] ?
        (fieldVal[0].name + ':' + toValue(fieldVal[0].value, fieldVal[0].fixed) + `${fieldVal[0].unit || ''}`) : ''
    } else if (sf === 'type') { // 报警类别
      const types = typeList.filter(item => item.id == fieldVal) || []
      const v = types && types.length > 0 ? types[0]['name'] : fieldVal
      return v && v.indexOf('-') > 0 ? '' : v || ''
    } else if (sf === 'time') { // 报警时间
      return fieldVal ? moment(fieldVal).format('YYYY-MM-DD HH:mm:ss') : ''
    } else {
      return _.isObject(fieldVal) ? fieldVal.name : fieldVal
    }
    // 不用 warning 的 fieldRender, 因为报渲染了更多或更少的 hook，而且 catch 不到
  }
  
  // ] 和 [ 两个符号不能作为 modelKey，需要转换
  const modelKey = "custom-warning-" + field.key
    + (field.insideFilter ? JSON.stringify(field.insideFilter).replace(/\[|\]/g, 'a') : '')

  return filter ?
  <WarningFilter {...props} initValue={initValue} /> :
  (
    <>
      <Select
        allowClear
        dropdownRender={null}
        notFoundContent={null}
        onChange={() => onChange(null)}
        onClick={() => setVisible(true)}
        value={initValue(value)}
        placeholder={label}
        mode={selectType}
      />
      <Model schema={schema} modelKey={modelKey} key={modelKey} >
        <Modal
          title={label}
          width={1000}
          visible={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <ModelBlock name="model.list.submenu" />
          <C is="Model.DataTable" />
          <div style={{ marginTop: '.5rem' }}><C is="Model.Pagination" /></div>
        </Modal>
      </Model>
    </>
  )
}

export default WarningComponent