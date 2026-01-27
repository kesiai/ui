import React from 'react'
import _ from 'lodash'
import { _t } from 'xadmin-i18n'
import { Select, Spin, Empty, Modal, Button, Card, Popover, Row, Col, message, Form, Tooltip, TreeSelect } from 'antd'
import { PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { api, use, app } from 'xadmin'
import { Model, ModelBlock } from 'xadmin-model'
import { C, Loading, Icon } from 'xadmin-ui'
import { useScriptVal, dealFilter } from './component/Editor/utils2'
import { Table2Context } from './component/Editor/context'
import { getDisabled, addNewItem } from './fieldComponent/tool'
import TableFieldRender from './TableFieldRender';
// import Icon from './component/Editor/component/Icon';

const Option = Select.Option

// 在 tableSchema 中查找 value?.relate?.id 等于 tableID 的对应 key
const findRelateKeyInTableSchema = (tableSchema, tableID) => {
  if (!tableSchema || !tableSchema.properties) {
    return null
  }
  
  for (const [key, property] of Object.entries(tableSchema.properties)) {
    // 检查属性值中的 value?.relate?.id 是否等于 tableID
    if (property?.relate?.id === tableID) {
      return key
    }
  }
  
  return null
}

// 在树形数据中查找节点
const findTreeNode = (treeData, value) => {
  for (const node of treeData) {
    if (node.value === value) {
      return node
    }
    if (node.children && node.children.length > 0) {
      const found = findTreeNode(node.children, value)
      if (found) return found
    }
  }
  return null
}

const useOpts = (props) => {
  const { field, antdForm } = props
  const [loading, setLoadig] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const itemsRef = React.useRef([])
  const [isDel, setIsDel] = React.useState(false)
  const currentPageRef = React.useRef(0)
  const { getQueryFilter } = use('queryEditor.methods')
  const outTable = React.useContext(Table2Context)
  let getFormState = () => { }
  try {
    getFormState = use('form')?.getFormState
    if (antdForm?.getState) {
      getFormState = antdForm?.getState
    }
  } catch (e) {}
  try { // 画面中【表单容器】内【表字段映射】用法
    const { form } = React.useContext(C('Dashboard.FormContainer.FormContext'))
    getFormState = form.getState
  } catch (e) {}

  const fieldSchema = field && field.fieldSchema
  // 判断是否为自关联表
  const isSelfRelate = field.tableID === field?.relateSchema?.relate?.id
  const getOptionsData = () => options.reduce((prev, opt) => {
    // Skip if the option is not in current items (i.e. has been deleted)
    if (!itemsRef.current.find(item => item.value === opt.value)) {
      return prev;
    }

    let fieldRender = app.apps.find(item => item.name === 'iot.custom')?.fieldRenders
    if (_.isFunction(fieldRender) && _.isFunction(fieldRender(app))
      && _.isFunction(fieldRender(app)(null, fieldSchema))) {
      let label = fieldRender(app)(null, fieldSchema)({ value: opt.label, wrap: '' })?.props?.children
      if (_.isString(label)) {
        prev[opt.value] = { ...opt, key: opt.value, label }
      } else if (label?.props?.children) { // React元素
        prev[opt.value] = { ...opt, key: opt.value, label: label.props.children }
      } else {
        prev[opt.value] = { ...opt, key: opt.value, label: _.isObject(opt.label) ? opt.label.name : opt.label }
      }
    } else {
      prev[opt.value] = { ...opt, key: opt.value, label: _.isObject(opt.label) ? opt.label.name : opt.label }
    }
    return prev
  }, {})

  const loadOptions = React.useCallback(async (inputValue, page=0, precise=false) => {
    if (currentPageRef.current >= page) {
      if (page !== 0) {
        return
      } else {
        itemsRef.current = []
      }
    }
    currentPageRef.current = page
    const displayField = field.displayField || 'name'
    let filterObj = { search: {} }
    if (inputValue) {
      // 精确搜索使用完全匹配,模糊搜索使用like
      filterObj = precise ?
        { search: { [displayField]: inputValue } } :  // 精确匹配
        { search: { [displayField]: { like: inputValue } } }  // 模糊匹配
    }
    setLoadig(true)
    dealFilter(filterObj, field, getQueryFilter, getFormState, outTable)
    const tableID = field.tableID
    const { json: tableSchema } = await api({ name: `core/t/schema/${tableID}` }).fetch('')
    // 在 loadOptions 中使用 findRelateKeyInTableSchema 的返回值
    const relateKey = findRelateKeyInTableSchema(tableSchema?.schema, tableID)
    
    let extraFields = field?.relateShowFields?.map(f => f.key) || [] // 多字段的字段也要查回来
    const { items } = await api(field.schema)
      .query({ limit: 50, skip: page*50, fields: ['id', displayField, relateKey, ...extraFields].filter(k => k) }, {
        ...(filterObj || {}),
        noMessage: true
      })
    itemsRef.current = [
      ...itemsRef.current,
      ...items.map(item => {
        return { value: item.id, label: item[displayField], item }
      })
    ]
    const vList = props.value || []
    if (vList[0]?.key && !vList[0]?.label && !itemsRef.current.find(item => item.id === vList[0].key)) {
      // 作为过滤条件，默认值只有key，没有label，只查询50条时，没有这一条会显示ID，需要重新查一次
      const { items: items2 } = await api(field.schema).query({ limit: 1, fields: ['id', displayField, field.key],  }, {
        search: { id: vList[0]?.key },
        noMessage: true
      })
      setLoadig(false)
      setOptions([
        { value: items2?.[0]?.id, label: items2?.[0]?.[displayField], item: items2?.[0] },
        ...itemsRef.current
      ])
      setIsDel(false)
    } else {
      setLoadig(false)
      setOptions(itemsRef.current)
      setIsDel(false)
    }
    return items?.length
  }, [JSON.stringify(field)])


  React.useEffect(() => {
    loadOptions()
  }, [JSON.stringify(fieldSchema)])
  let data = getOptionsData(options)
  
  // 构建树形结构数据
  const buildTreeData = () => {
    if (!isSelfRelate || !options.length) return []
    
    const treeMap = new Map()
    const rootNodes = []
    
    // 首先创建所有节点
    options.forEach(option => {
      const node = {
        title: data[option.value]?.label || option.label,
        value: option.value,
        key: option.value,
        item: option.item,
        children: []
      }
      treeMap.set(option.value, node)
    })
    
    // 构建层级关系
    options.forEach(option => {
      const node = treeMap.get(option.value)
      const parentInfo = option.item?._parent
      
      if (parentInfo && Array.isArray(parentInfo) && parentInfo[0]) {
        const [parentFieldId, parentRecordId] = parentInfo[0].split('|')
        const parentNode = treeMap.get(parentRecordId)
        
        if (parentNode) {
          parentNode.children.push(node)
        } else {
          // 如果父节点不存在，仍然作为根节点
          rootNodes.push(node)
        }
      } else {
        // 没有父节点信息，作为根节点
        rootNodes.push(node)
      }
    })
    
    return rootNodes
  }
  
  const treeData = buildTreeData()

  return { ...props, loadOptions, loading, options, data, isDel, isSelfRelate, treeData }
}

const useModalOpts = (props) => {
  let getFormState = () => { }
  let form
  try {
    getFormState = use('form')?.getFormState
    form = use('form')?.form
    if (props.antdForm?.getState) {
      getFormState = props.antdForm.getState
    }
  } catch (e) {  }
  return {...props, getFormState, form}
}

// 工作表字段脚本部分
const getFormValues = (schema) => {
  let result = null
  try {
    result = use('form', state => {
      let vals = {}
      // 如果控件在表格中，会涉及到删除深层的字段
      for (let key in state.values) {
        if (key !== schema.key) {
          if (state.values[key]?.[0] && _.isObject(state.values[key]?.[0])) {
            vals[key] = state.values[key].map(item => _.omit(item, schema.key))
          } else {
            vals[key] = state.values[key]
          }
        }
      }
      return { values: vals }
    }).values
  } catch (e) { }
  return result
}

const AsyncSelect = props => {
  const { field, loadOptions, loading, options, data, value, isOptionSelected, label, onChange,
    style, isDel, isSelfRelate, treeData, disabled, ...extraProps } = useOpts(props)
  // 查询过滤时，缓存全部 options，提供给 onChange 时获取单条数据
  const [allOptions, setAllOptions] = React.useState(options)
  const [ page, setPage ] = React.useState(0)
  const [ count, setCount ] = React.useState(50)
  const [pageLoading, setPageLoading] = React.useState(false);
  const [precise, setPrecise] = React.useState(false);
  const searchRef = React.useRef(null)
  React.useEffect(() => {
    setAllOptions(before => {
      return _.unionWith(before, options, _.isEqual) // 数组合并去重
    })
  }, [options])

  // 多字段联动表单其他字段
  React.useEffect(() => {
    field?.relateShowFields?.forEach(rsf => {
      if (rsf.mapToCurrent && rsf.mapField && value?.item?.[rsf.key]) {
        field?.option?.form?.change(rsf.mapField, value.item[rsf.key])
      }
    })
  }, [JSON.stringify(value || {})])

  const onItemChange = (selectOpt) => {
    if (!selectOpt) {
      onChange({})
    } else {
      const value = _.isArray(selectOpt) ?
        selectOpt.map(({ key }) => {
          let result = allOptions.filter(item => item.value === key)
          return result[0] || _.find(value, v => v.key == key) || null
        }).filter(Boolean)
        : data[selectOpt.key]
      onChange(value)
    }
  }

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && !pageLoading) {
      if (count === 50) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  const onSearch = async (value, precise) => {
    searchRef.current = value
    const _count = await loadOptions(value, 0, precise)  // 修改这里，直接传入value而不是searchRef.current
    setCount(_count)
    setPage(0)
  }

  const onDropdownVisibleChange = (visible) => {
    if (visible && count === 50) {
      loadOptions()
    } 
  }

  const onPrecise = (e) => {
    e.stopPropagation()
    setPrecise(value => {
      if (!value) {
        loadOptions()
      }
      const _precise = !value
      onSearch(null, _precise)
      return _precise
    })
  }

  React.useEffect(() => {
    (async () => {
      if (page >=1) {
        const _count = await loadOptions(searchRef.current, page, precise)
        setCount(_count)
      }
    })()
  }, [ page ])

  let ops = Object.keys(data || {})?.map(k => ({ value: k, label: data[k].label }))

  let defaultValue = null
  if (extraProps.mode == 'multiple') {
    defaultValue = value && _.isArray(value) && value.map(v => data[v.key] || v) || []
  } else {
    defaultValue = (value && _.isObject(value)) ? ({ ...value, value: value.key }) : null
    defaultValue = {
      ...defaultValue,
      label: data?.[defaultValue?.key]?.label
    }
  }
  // 如果是自关联表且有多级数据，使用 TreeSelect
  if (isSelfRelate) {
    const isMultiple = extraProps.mode === 'multiple'
    
    return (
      <TreeSelect
        showSearch
        allowClear
        treeData={treeData}
        value={isMultiple ?
          (defaultValue || []).map(item => item.key) :
          defaultValue?.key
        }
        onChange={(selectedValue) => {
          if (!selectedValue) {
            onChange(isMultiple ? [] : {})
          } else if (isMultiple) {
            const selectedNodes = Array.isArray(selectedValue) ?
              selectedValue.map(value => findTreeNode(treeData, value)).filter(Boolean) :
              [findTreeNode(treeData, selectedValue)].filter(Boolean)
            onChange(selectedNodes.map(node => ({ key: node.value, label: node.title, item: node.item })))
          } else {
            const selectedNode = findTreeNode(treeData, selectedValue)
            onChange(selectedNode ? { key: selectedNode.value, label: selectedNode.title, item: selectedNode.item } : {})
          }
        }}
        onDropdownVisibleChange={onDropdownVisibleChange}
        placeholder={isDel ? _t1('该表已被删除,请重新选择') : label}
        disabled={isDel || disabled}
        style={{ minWidth: 150, ...style }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        filterTreeNode={(input, treeNode) =>
          (treeNode.title?.toString() || '').toLowerCase().includes(input.toLowerCase())
        }
        multiple={isMultiple}
        showCheckedStrategy={TreeSelect.SHOW_ALL}
      />
    )
  }
  // defaultValue = {
  //   ...defaultValue,
  //   label: data?.[defaultValue?.key]?.label
  // }

  return <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
    <Select
      showSearch
      labelInValue
      allowClear
      value={defaultValue ? defaultValue : (isOptionSelected ? Object.values(data).filter(isOptionSelected) : undefined)}
      notFoundContent={null}
      onDropdownVisibleChange={onDropdownVisibleChange}
      onChange={onItemChange}
      filterOption={(input, option) => (option?.label ?? '').includes(input)}
      placeholder={isDel ? _t1('该表已被删除,请重新选择') : label}
      disabled={isDel || disabled}
      style={{ minWidth: 150, ...style }}
      loading={loading && page === 0}
      {...extraProps}
      onSearch={(value) => onSearch(value, precise)}
      options={addNewItem(ops, defaultValue, field)}
      size={field.relateSchema?.size}
      dropdownRender={(menu) => (
        <>
          {menu}
          {loading && page !== 0 ? <div style={{ textAlign: 'center', padding: '4px', color: '#bfbfbf' }}>加载中 <Icon type="loading"></Icon></div> : null}
          {(!loading && count < 50) ? <div style={{ textAlign: 'center', padding: '4px', color: '#bfbfbf' }}>已加载全部</div> : null}
        </>
      )}
      onPopupScroll={handleScroll}
    />
    <Tooltip title={_t1("精确搜索")} placement="top">
      <Icon
        style={{position: 'absolute', right: 26, top: 9, cursor: 'pointer', color: precise ? 'green' : null}}
        type="aim"
        onClick={onPrecise}
      />
    </Tooltip>
  </div>
}

// 已加载全部数据

const RelateSelect = props => {
  const { input: { value: item, onChange }, label, field, relateSchema = {}, antdForm } = props
  const displayField = field.displayField || 'name'

  const f = Form.useForm()
  let values = getFormValues(relateSchema, antdForm || f)
  const disabled = getDisabled(relateSchema, values) || props.disabled

  // 默认值生效
  React.useEffect(() => {
    const defaultVal = relateSchema?.defaultVal
    setTimeout(() => { // 必须用setTimeout，否则会被拦截
      !item && defaultVal && onChange && onChange(defaultVal)
    })
  }, [])

  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema: relateSchema, value: item, values, record: props.record, onChange })
    }
  }, [JSON.stringify(values)])

  return (
    <AsyncSelect
      value={item ? { item, label: item[displayField], key: item.id } : null}
      onChange={(option) => {
        option && option.length > 0 ? onChange(option.map(item => item.item)) : onChange(option.item)
      }}
      field={field}
      label={label}
      disabled={disabled}
      antdForm={antdForm}
    />
  )
}

const ConfirmBtn = ({ selectMany, value }) => {
  const { loading, items } = use('model.list')
  const { selected } = use('model.select')
  const setSelected = use('model.setter', 'selected')

  React.useEffect(() => {
    if (value && value.length > 0 && !loading && items?.length > 0) {
      setSelected(value)
    }
  }, [loading])

  const handleClick = () => {
    selectMany(selected)
  }

  return <Button type="primary" onClick={handleClick}>确认</Button>
}

const RelateModelSelect = props => {
  const { input: { value, onChange }, displayField, insideFilter, fieldSchema, label, schema, form, inputType,
    tableID, field, selectType, relateSchema = {}, allFieldReturn, antdForm, getFormState } = useModalOpts(props)

  const f = Form.useForm()
  let values = getFormValues(relateSchema, antdForm || f)
  const disabled = getDisabled(relateSchema, values) || props.disabled
  const outTable = React.useContext(Table2Context)

  const [state, setState] = React.useState(null)
  const [visible, setVisible] = React.useState(false)
  const { getQueryFilter } = use('queryEditor.methods')
  const modelKey = Math.floor(Math.random() * 10000000000) // 用于 Model 刷新
  const ifRSF = field && field.relateShowFields && field.relateShowFields.length > 0 // 工作表关联字段，多字段
  const getSchema = () => {
    if (schema.name === 'core/user' || schema.name === 'core/role') { // 关联用户/角色
      const o = { 'core/user': 'User', 'core/role': 'Role' }
      setState({
        ...(app.get('models')[o[schema.name]] || {}),
        listFields: [...new Set(['name', field?.displayField])].filter(k => k), // 去重
        components: {
          DataEmpty: props => <Card><C is="NoData" description={_t1("暂无数据")} /></Card>
        }
      })
    } else {
      api({ name: 'core/t/schema' }).get(tableID).then(({ schema }) => {
        setState({
          ...schema,
          listFields: [field?.displayField, ...(field?.relateShowFields || []).map(item => item.key)],
          components: {
            DataEmpty: props => <Card><C is="NoData" description={_t1("暂无数据")} /></Card>
          }
        })
      })
    }
  }

  // 多字段联动表单其他字段
  React.useEffect(() => {
    props.relateShowFields?.forEach(rsf => {
      if (rsf.mapToCurrent && rsf.mapField && value?.[rsf.key]) {
        form?.change(rsf.mapField, value[rsf.key])
      }
    })
  }, [JSON.stringify(value || {})])

  // 默认值生效
  React.useEffect(() => {
    const defaultVal = relateSchema?.defaultVal
    setTimeout(() => { // 必须用setTimeout，否则会被拦截
      !value && defaultVal && onChange && onChange(defaultVal)
    })
  }, [])

  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema: relateSchema, value: value, values, record: props.record, onChange })
    }
  }, [JSON.stringify(values)])

  React.useEffect(() => {
    getSchema()
  }, [])

  if (!state) return null

  let insideF = { search: {} }
  dealFilter(insideF, field, getQueryFilter, getFormState, outTable)
  let filters = {
    submenu: []
  }
  if (ifRSF) {
    if (insideF?.[field.displayField]) { // 展示字段设置了内置查询，因为内置查询里的查询条件和filter里的对不上，所以换其他字段
      if (field.relateShowFields?.[0]) {
        filters.submenu = [field.relateShowFields[0].key]
      }
    } else {
      const rsfFilter = field.relateShowFields.filter(f => f.fieldSchema?.filterFields).map(f => f.key)
      filters.submenu = rsfFilter.length > 0 ? rsfFilter : [field.displayField]
    }
  } else if (field?.displayField) {
    filters.submenu = [field?.displayField]
  }

  // 单选确认
  const selectOne = value => {
    setVisible(false)
    if (allFieldReturn) {
      let val = { ...value }
      delete val.deletePermission
      delete val.editPermission
      onChange(val)
      return
    }
    const v = value[displayField]
    let r = v ? {
      id: value.id,
      [displayField]: v,
      ..._.pick(value, field?.relateShowFields?.map(s => s.key) || [])
    } : null
    if (v && fieldSchema && fieldSchema.enum) {
      const i = fieldSchema.enum.indexOf(v)
      const label = fieldSchema.enum_title[i]
      if (label) r.name = label
    }
    if (field?.displayField) {
      r[field.displayField] = value[field.displayField]
    }
    v && onChange(r)
  }

  // 多选确认
  const selectMany = (list) => {
    setVisible(false)
    let resultList = []
    if (list && list.length > 0) {
      list.forEach(item => {
        if (allFieldReturn) {
          let val = { ...item }
          delete val.deletePermission
          delete val.editPermission
          resultList.push(val)
          return
        }
        const v = item[displayField]
        let r = v ? {
          id: item.id,
          [displayField]: v,
          ..._.pick(item, field?.relateShowFields?.map(s => s.key) || [])
        } : null
        if (v && fieldSchema && fieldSchema.enum) {
          const i = fieldSchema.enum.indexOf(v)
          const label = fieldSchema.enum_title[i]
          if (label) r.name = label
        }
        if (field?.displayField) {
          r[field.displayField] = item[field.displayField]
        }
        v && resultList.push(r)
      })
    }
    onChange(resultList)
  }

  const handleCancel = e => {
    setVisible(false)
  }
  const onSeletedChange = e => {
    if (e && e.length > 0) {
      let restList = value.filter(item => e.indexOf(item[displayField]) > -1)
      onChange(restList)
    } else {
      onChange(null)
    }
  }
  const itemActions = selectType === 'multiple' ? null : [
    ({ item }) => <Button onClick={() => selectOne(item)}>选择</Button>
  ]
  const initialValues = insideF ? {
    wheres: {
      filters: insideF.search
    }
  } : {}

  let initValue = []
  if (_.isArray(value) && value.length > 0) { // 多选
    value.forEach(item => {
      item && _.isPlainObject(item) && initValue.push(item[displayField])
    })
  } else { // 单选
    initValue = value && _.isPlainObject(value) ? value[displayField] : undefined
  }

  const BtnIcon = initValue ? <SwapOutlined /> : <PlusOutlined />
  return (
    <>
      {
        inputType === 'button' ? <Button
          disabled={disabled}
          onClick={() => !disabled && setVisible(true)}
        >{BtnIcon}{_t1('记录')}</Button> : <Select
          allowClear
          style={{ width: '100%' }}
          dropdownRender={null}
          notFoundContent={null}
          onChange={onSeletedChange}
          disabled={disabled}
          onClick={() => !disabled && setVisible(true)}
          value={initValue}
          placeholder={label}
          mode={selectType}
          size={relateSchema.size}
        />
      }
      <Model modelKey={modelKey} key={modelKey}
        schema={{
          ...state,
          name: schema.name,
          filters, itemActions, initialValues,
          batchActions: selectType === 'multiple' ? undefined : null,
          dataTableProps: (columns) => ({
            scroll: { x: '100%' },
            columns: columns.map(c => ({ ...c, width: c.key === '__action__' ? 100 : c.width || 150 }))
          }),
        }}>
        <Modal
          title={label}
          width='70%'
          visible={visible}
          onOk={selectMany}
          zIndex={1040}
          onCancel={handleCancel}
          footer={selectType === 'multiple' ? [
            <Button onClick={handleCancel}>取消</Button>,
            <ConfirmBtn selectMany={selectMany} value={value} />
          ] : null}
        >
          <ModelBlock name="model.list.submenu" />
          <C is="Model.DataTable" />
          <div style={{ marginTop: '.5rem' }}><C is="Model.Pagination" /></div>
        </Modal>
      </Model>
    </>
  )
}

const RelateMultiSelect = props => {
  const { input: { value: items, onChange }, label, field, relateSchema = {}, antdForm } = props
  const displayField = field.displayField || 'name'

  const f = Form.useForm()
  let values = getFormValues(relateSchema, antdForm || f)
  const disabled = getDisabled(relateSchema, values) || props.disabled

  // 默认值生效
  React.useEffect(() => {
    const defaultVal = relateSchema?.defaultVal
    setTimeout(() => { // 必须用setTimeout，否则会被拦截
      !items && defaultVal && onChange && onChange(defaultVal)
    })
  }, [])

  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema: relateSchema, value: items, values, record: props.record, onChange })
    }
  }, [JSON.stringify(values)])

  return (
    <AsyncSelect mode="multiple"
      value={items && !_.isEmpty(items) && _.isArray(items) ? items?.map(item => ({ key: item.id, item, label: item[displayField] })) : []}
      onChange={(options) => {
        onChange(options.map(opt => opt.item))
      }}
      field={field}
      label={label}
      disabled={disabled}
      antdForm={antdForm}
    />
  )
}

const FilterRelateSelect = props => {
  const { input: { value, onChange, name }, label, field, originSchema } = props
  const multi = originSchema?.selectType === 'multiple'
  let defaultValue
  if (multi) {
    defaultValue = value?.or?.map(v => ({ key: v?.[name]?.$regex })) || []
  } else {
    defaultValue = value?.in?.map(v => ({ key: v })) || []
  }
  return (
    <AsyncSelect mode="multiple"
      value={defaultValue}
      onChange={(options) => {
        const ids = options.map(opt => opt?.item?.id)
        if (multi) {
          onChange({
            or: ids.map(id => {
              return { [name]: { $regex: id } }
            })
          })
        } else {
          onChange({ in: ids })
        }
      }}
      field={field}
      label={label}
    />
  )
}


const schema_converter = [
  (f, schema, options) => {
    if (['object', 'array'].indexOf(schema.type) > -1 && schema.relate?.id && !schema.recordSelectType) { // 外部工作表
      const relate = schema && schema.relate
      const relateShowFields = schema && schema.relateShowFields
      const id = relate && relate.id
      const fieldSchema = relate.fields && relate.fields[0] && relate.fields[0].fieldSchema
      f.type = schema.selectType === 'multiple' ? 'relate_multi_select' : 'relate_fkselect'
      f.schema = { name: `core/t/${id}/d` }
      f.fieldSchema = fieldSchema
      f.relateSchema = schema
      f.tableID = relate.id
      f.displayField = relate.fields?.[0]?.key || 'name'
      f.relateTableName = id
      f.insideFilter = schema.insideFilter
      
      // 在 schema_converter 中使用 findRelateKeyInTableSchema 的返回值
      if (options?.tableSchema) {
        const relateKey = findRelateKeyInTableSchema(options.tableSchema, relate.id)
        if (relateKey) {
          f.key = relateKey
        }
      }
      
      if (relateShowFields && relateShowFields.length > 0) { // 多字段
        f.selectType = schema.selectType
        f.type = 'relate_list_fkselect'
        f.relateShowFields = relateShowFields
      }
    }
    return f
  }
]

const filter_converter = [
  (f, schema, options) => {
    if (schema.relate && schema.relate.tableType == 'table') {
      const relate = schema && schema.relate
      const id = relate && relate.id
      const fieldSchema = relate.fields && relate.fields[0] && relate.fields[0].fieldSchema
      f.type = 'filter_relate_select'
      f.originSchema = schema
      f.schema = { name: `core/t/${id}/d` }
      f.fieldSchema = fieldSchema
      f.tableID = relate.id
      f.displayField = relate.fields?.[0]?.key || 'name'
      f.relateTableName = id
      f.insideFilter = schema.insideFilter
      
      // 在 filter_converter 中使用 findRelateKeyInTableSchema 的返回值
      if (options?.tableSchema) {
        const relateKey = findRelateKeyInTableSchema(options.tableSchema, relate.id)
        if (relateKey) {
          f.key = relateKey
        }
      }
    }
    return f
  }
]

const form_fields = {
  // 外部表，无多字段，多选
  relate_multi_select: {
    component: RelateMultiSelect
  },
  // 外部表，无多字段，单选
  relate_fkselect: {
    component: RelateSelect
  },
  // 外部表，多字段
  relate_list_fkselect: {
    component: RelateModelSelect
  },
  // 过滤器
  filter_relate_select: {
    component: FilterRelateSelect
  }
}

const DetailCard = ({ children, value, schema, inList }) => {

  const content = <Card style={{ backgroundColor: "#f0f1f3", borderRadius: 5, width: 500, margin: "5px 5px 0 0", display: 'inline-block' }}>
    <Row>
      <Col span={5}>{_t1('记录编号')}：</Col>
      <Col span={19}>{value.id}</Col>
    </Row>
    {
      schema.relateShowFields.map(f => <Row>
        <Col span={5}>{f.title}：</Col>
        <Col span={19}>
          <TableFieldRender value={value[f.key]} schema={f.fieldSchema} item={value} wrap="span" />
        </Col>
      </Row>)
    }
  </Card>
  if (inList) {
    return <Popover content={content}>{children}</Popover>
  } else {
    return content
  }
}

// 展示关联数据详情
const DetailShow = ({ children, schema, value, fieldRender, inList }) => {
  const [visiable, setVisiable] = React.useState(false)
  const [detailData, setDetailData] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const getDetailData = () => {
    setLoading(true)
    api({ name: 'core/t/schema' }).get(schema?.relate?.id).then(relateTable => {
      if (!relateTable.schema) {
        message.error(_t1('该表已被删除'))
        setLoading(false)
        return
      }
      api({ name: `core/t/${schema?.relate?.id}/d/` }).get(value?.id).then(data => {
        setLoading(false)
        if (_.isEmpty(data)) {
          message.error(_t1('该条数据已被删除'))
          return
        }
        let result = []
        schema.recordDetail.showField.forEach(key => {
          let s = relateTable.schema.properties[key]
          let value = null
          if (s.fieldType === 'attachment' || s.fieldType === 'attachments') { // 附件不能用 fieldRender，因为有 useMemo
            value = <C is="ShowAttachment" schema={s} value={data?.[key]} item={data} />
            // let url = data?.[key]?.url || '/rest' + data?.[key]?.response?.url
            // value = data?.[key] ? <img style={{ width: 50, height: 50 }} src={url} /> : null
          } else {
            value = fieldRender(app)(null, s) ?
              fieldRender(app)(null, s)({ value: data?.[key], wrap: 'span' }) :
              _.isObject(data?.[key]) ? data?.[key].name : data?.[key]
          }
          let title = s?.title
          result.push({ title, value })
        })
        setDetailData(result)
      }).catch(e => message.error(_t1('获取数据失败'), e?.detail))
    }).catch(e => message.error(_t1('获取表失败'), e?.detail))
  }

  if (!value?.id) {
    return children || ''
  } else if (schema.recordDetail?.showType === 'popover') { // 直接展示
    const content = loading ? <div style={{ width: '100%', textAlign: 'center' }}><Spin /></div> :
      detailData.map((item, index) => <Row key={index} style={{ width: 500, minHeight: 35 }}>
        <Col span={6}>{item.title}：</Col>
        <Col span={18}>{item.value}</Col>
      </Row>)
    return (<Popover content={content} trigger="click" overlayStyle={{ maxHeight: 500, overflowY: 'scroll' }}>
      <span onClick={getDetailData} className='detail-span'>{children}</span>
    </Popover>)
  } else if (schema.recordDetail?.showType === 'modal') { // 弹窗
    return <>
      <span className='detail-span' onClick={() => {
        getDetailData()
        setVisiable(true)
      }}>
        {children}
      </span>
      <Modal title={_t1("记录详情")} visible={visiable} onCancel={() => setVisiable(false)} width="800px" footer={null}>
        {
          loading ? <div style={{ width: '100%', textAlign: 'center' }}><Spin /></div> :
            detailData.map((item, index) => <Row key={index} style={{ minHeight: 35 }}>
              <Col span={3} offset={2}>{item.title}：</Col>
              <Col span={17}>{item.value}</Col>
            </Row>)
        }
      </Modal>
    </>
  } else if (schema.recordDetail?.showType === 'page') { // 跳转页面
    return (
      <span
        className='detail-span'
        onClick={() => app.go(`/app/table/${schema?.relate?.id}/${value?.id}/detail`)}
      >
        {children}
      </span>
    )
  } else if (schema.relateShowFields?.length > 0 && schema.showType === 'card') {
    return <DetailCard value={value} schema={schema} inList={inList}>{children || ''}</DetailCard>
  } else {
    return children || ''
  }
}

export { RelateModelSelect, RelateMultiSelect, RelateSelect, DetailShow, findRelateKeyInTableSchema }

export default {
  name: 'table.relate',
  form_fields,
  schema_converter,
  filter_converter,
}
