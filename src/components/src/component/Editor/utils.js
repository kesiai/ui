import React from 'react'
import _ from 'lodash'
import { message, Card, Form, Row, Col, Input, Button, Modal } from 'antd'
import { app, use, api } from 'xadmin'
import Source from './dropTool/Source'
import getWidgets from './wigets'
import { isInnerTables } from './utils3.js'
import fieldValidate from './validate'
import { uuid } from './utils3.js'
import './style.css'

const AddPanel = ({ category, widgetList }) => {
  
  const { hideScript } = use('i18n.permission')
  return React.useMemo(() => {
    return getWidgets(_t1, hideScript).filter(w => {
      return widgetList ? widgetList.find(a => a === w.config) : true
    }).filter(i => !i.hideWidgets).map((item, i) => {
      return (category == item.category ? <Card.Grid
        key={item.name + i}
        hoverable={false}
        style={{
          width: '30%',
          minWidth: 70,
          margin: '1.5%',
          padding: 0,
          // backgroundColor: '#f4f6fa',
          borderRadius: 3,
          float: 'left'
        }}
      >
        <Source
          title={item.title}
          type={item.type}
          icon={item.icon}
          name={item.name}
          config={item.config}
          onlyOne={item.onlyOne}
        />
      </Card.Grid > : null)
    })
  }, [getWidgets(_t1, hideScript)])
}

const FormLayout = props => {
  const { children, invalid, handleSubmit, showCode, submitting } = props;
  return (
    <Form onSubmit={handleSubmit} layout='vertical'>
      <Row gutter={[30]} >
        {children}
      </Row>
    </Form>
  );
}

// 获取编辑表单属性转换为schema
const forSchema = (values) => {
  let data = { ...values }
  // 选择器属性转换
  if (values && values.select) {
    const label = values.select.label || []
    const value = values.select.value || []
    const color = values.select.color || [] // 新增选择器色块
    let enums = {}
    // 不用enum属性，用enum1属性，因为formschema会识别enum属性，认为是string类型
    if (label && label.length > 0) enums.enum_title1 = [...label]
    if (value && value.length > 0) enums.enum1 = [...value]
    if (color && color.length > 0) {
      enums.enum_color1 = [...color]
    } else {
      delete values.enum_color1
    }
    if (values.select.language) {
      let la = values.select.language
      Object.keys(la).forEach(key => {
        if (key.indexOf('enum_title1_') === -1) {
          enums['enum_title1_'+key] = la[key]
        } else {
          enums[key] = la[key]
        }
      })
    }
    // 选择器数据类型
    let dataType = values.dataType || 'string'
    // 选择器是多选时，type是array，array类型必须有items字段
    let extra = values.selectType !== 'multiple' ? { type: dataType } : {
      type: 'array',
      items: { type: dataType }
    }
    data = { ..._.omit(values, ['select']), ...enums, ...extra }
  }
  // 字段类型补全属性
  if (values && values.type && values.type == 'object') {
    data = {
      ...values,
      properties: {}
    }
  }
  // 关联属性转换
  if (values && values.relate) {
    if (isInnerTables(values.relate.id)) {
      data = {
        ...values,
        relateTo: values.relate.id
      }
      delete data.relate
    } else {
      delete data.relateTo
    }
    // 关联字段是多选时，type是array，array类型必须有items字段
    let extra = values.selectType !== 'multiple' ? { type: 'object' } : {
      type: 'array',
      items: { type: 'object', properties: {}, relateTo: data.relateTo } // 内部表多选时，需要在 items 里加 relateTo
    }
    data = { ...data, ...extra }
  }
  return data
}

const schemaFormat = (val, config) => {
  if (config === '文本') {
    val['fieldType'] = 'input'
  } else if (config === '数字') {
    val['fieldType'] = 'inputNumber'
  } else if (config === '时间') {
    val['fieldType'] = 'datePicker'
    if (val.format === 'ym') { // 特殊处理
      val.format2 = val.format
      val.format = 'date'
    } else if (val.format === 'ymdh') {
      val.format2 = val.format
      val.format = 'datetime'
    }
  } else if (config === '时间2') {
    val['fieldType'] = 'timePicker'
  } else if (config === '日期范围') {
    val['fieldType'] = 'dateRange'
  } else if (config === '选择器') {
    val['fieldType'] = 'select'
  } else if (config === '布尔值') {
    val['fieldType'] = 'boolean'
  } else if (config === '定位') {
    val['fieldType'] = 'map'
  } else if (config === '表格') {
    val['fieldType'] = 'editableTable'
  } else if (config === '编号') {
    val['fieldType'] = 'serialNumber'
  } else if (config === '链接') {
    val['fieldType'] = 'link'
  } else if (config === '区域') {
    val['fieldType'] = 'area'
  } else if (config === '星级评价') {
    val['fieldType'] = 'rate'
  } else if (config === '富文本') {
    val['fieldType'] = 'textEditor'
  } else if (config === '用户') {
    val['fieldType'] = 'user'
  } else if (config === '字节数组') {
    val['fieldType'] = 'bytesArray'
    val['type'] = 'string'
    // val['pattern'] = '^\[[[01]+\,]*[01]+\]$'
  }

  // 可扩展控件
  const other = app.get('customWidgets')
  const w = other.find(item => item.config === config)
  if (w) val['fieldType'] = w.name

  val.description = val.description || undefined
  let result = fieldValidate(val)
  return result
}

// 修改一条表单项属性
const updateSchemaProperties = (key, values, schema) => {
  // const { values } = state
  let newSchema = _.cloneDeep(schema)
  const editKey = values && values.key
  const config = newSchema.properties[editKey]?.config
  // select 字段补全
  const editValues = { ...forSchema(values) }
  // 宽度发生变化更新同行其他控件的宽度
  if (values.widthInForm != schema.properties[key]?.widthInForm && values.rowKey) {
    const rowItems = _.compact(_.filter(schema.properties, (p, k) => p.rowKey == values.rowKey && k != key))
    if (!_.isEmpty(rowItems)) {
      rowItems.forEach(item => {
        newSchema.properties[item.key]['widthInForm'] = _.toString((24 - Number(values.widthInForm)) / rowItems.length)
      })
    }
  }

  // 是否修改key
  if (key != editKey) {
    if (!editKey) return
    // 判断editKey是否已存在
    const isEditKey = !!(_.indexOf(Object.keys(newSchema.properties), editKey) >= 0)
    if (isEditKey) {
      // key已存在
      message.error('key值已存在！')
      return
    } else {
      // 删除properties旧属性
      const newProperties = _.omit(newSchema.properties, [key])
      // 新属性替换旧属性，排序不变
      const oldKeyIndex = _.indexOf(newSchema.form, key)
      const newForm = [
        ...newSchema.form.slice(0, oldKeyIndex),
        editKey,
        ...newSchema.form.slice(oldKeyIndex + 1, newSchema.form.length)
      ]
      // 修改的key是否为必填，是必填替换editKey，否则什么都不做
      const isHaveRequired = !!(_.indexOf(newSchema.required, key) >= 0)
      // 删除旧属性
      const newRequired = _.difference(newSchema.required, [key])
      // 添加properties新属性，并且继承未修改属性
      newSchema.properties = {
        ...newProperties,
        [editKey]: {
          type: newSchema.properties[key].type,
          config: newSchema.properties[key].config,
          listFields: newSchema.properties[key].listFields,
          properties: newSchema.properties[key].properties,
          items: newSchema.properties[key].items,
          fieldType: newSchema.properties[key].fieldType,
          ...editValues
        }
      }
      newSchema.required = isHaveRequired ? _.compact([...(newRequired || []), editKey]) : _.compact([...(newSchema.required || [])])
      newSchema.form = newForm
      newSchema['listFields'] = newSchema.listFields?.map(k => k === key ? editKey : k)
    }
  } else {
    const isRequired = editValues.need
    const isHaveRequired = !!(_.indexOf(newSchema.required, key) >= 0)

    newSchema.properties[key] = schemaFormat({
      type: newSchema.properties[key].type,
      config: newSchema.properties[key].config,
      listFields: newSchema.properties[key].listFields,
      properties: newSchema.properties[key].properties,
      items: newSchema.properties[key].items,
      fieldType: newSchema.properties[key].fieldType,
      ...editValues,
      field: newSchema.properties[key].field,
    }, editValues?.config || config)

    const newSchemaRequired = newSchema.required || []
    if (isRequired && !isHaveRequired) newSchema.required = _.compact([...newSchemaRequired, key])

    if (!isRequired && isHaveRequired) newSchema.required = _.difference([...newSchemaRequired], [key])

    // 没有修改标识时，字段增加显示到列表，删除显示到列表
    if (values && !values.listFields) {
      newSchema['listFields'] = newSchema['listFields'].filter(k => k != key)
    } else if (values?.listFields && newSchema['listFields']?.indexOf(key) === -1) (
      newSchema['listFields'].push(key)
    )
  }
  
  return newSchema
}

const getFormValues = (schema, antdForm) => {
  let result1, result2
  try {
    result1 = use('form', state => {
      let vals = {}
      // 如果控件在表格中，会涉及到删除深层的字段
      for (let key in state.values) {
        if (key !== schema?.key) {
          if (state.values[key]?.[0] && _.isObject(state.values[key]?.[0])) {
            vals[key] = state.values[key].map(item => _.omit(item, [schema.key, 'hasError']))
          } else {
            vals[key] = state.values[key]
          }
        } else {
          vals[key] = state.values[key]
        }
      }
      return { values: vals }
    }).values
  } catch (e) {}
  try {
    let form = antdForm
    result2 = form?.getState()?.values
  } catch (e) {}
  return result1 || result2
}

// 为新增字段配置格式化，增加默认值
const addDefaultVal = (card, _t1) => {
  let result = {
    key: card.key,
    type: card.type,
    title: card.title,
    config: card.config,
    createShow: true,
    editShow: true,
    rowKey: card.rowKey,
    widthInForm: card.widthInForm,
    listFields: true,
    descriptionType: 'tooltip',
    canOrder: false
  }
  if (card.type === 'object') result.properties = {}
  if (card.type === 'array') result.items = {}

  if (card.config === '文本') {
    result.fieldType = 'input'
    result.textType = 'input'
    result.textContent = 'text'
  }
  if (card.config === '数字') {
    result.fieldType = 'inputNumber'
    result.dbType = 'Int32'
    result.textContent = 'origin'
  }
  if (card.config === '选择器') {
    result.fieldType = 'select'
    result.selectType = 'single'
    result.dataType = 'string'
    result.selectFace = 'select'
    result.enum1 = ['1', '2', '3']
    result.enum_title1 = [_t1('选项1'), _t1('选项2'), _t1('选项3')]
  }
  if (card.config === '时间') {
    result.fieldType = 'datePicker'
    result.createForm = 'create'
    result.format = 'date'
    result.textContent = 'origin'
    result.filterMode = 'dateRange'
  }
  if (card.config === '时间2') {
    result.fieldType = 'timePicker'
    result.timeFormat = 'HH:mm:ss'
    result.textContent = 'origin'
  }
  if (card.config === '日期范围') {
    result.fieldType = 'dateRange'
    result.dateFormat = 'date'
    result.NullShow = 'toNow'
  }
  if (card.config === '布尔值') {
    result.fieldType = 'boolean'
    result.displayForm = 'checkBox'
  }
  if (card.config === '关联字段') {
    result.selectType = 'single'
    result.recordSelectType = 'select'
    result.showType = 'select'
  }
  if (card.config === '附件') {
    result.fieldType = 'attachment'
    result.styleType = 'picture-card'
    result.showType = 'card'
    result.uploadPosition = 'both'
    result.accept = 'image/*'
  }
  if (card.config === '附件组') {
    result.fieldType = 'attachments'
    result.styleType = 'picture-card'
    result.showType = 'card'
    result.sort = 'asc'
    result.listShow = 'flatten'
    result.uploadPosition = 'both'
    result.accept = 'image/*'
  }
  if (card.config === '定位') {
    result.fieldType = 'map'
    result.canEdit = true
    result.lngLat = true
    result.positionName = true
  }
  if (card.config === '表格') {
    const fieldId = uuid(4, 16)
    result.fieldType = 'editableTable'
    result.tableFields = {
      'type': 'object',
      'name': 'tableProperties',
      'title': _t1('表格属性'),
      'key': 'tableProperties',
      'properties': {
        [`text-${fieldId}`]: {
          canOrder: false,
          config: "文本",
          descriptionType: "tooltip",
          fieldType: "input",
          key: `text-${fieldId}`,
          createShow: true,
          editShow: true,
          listFields: true,
          textContent: "text",
          textType: "input",
          title: _t1("文本"),
          type: "string"
        }
      }, 
      'form': [`text-${fieldId}`]
    }
    // result.defaultVal = [{ key: Date.now() }]
    result.btnText = { add: _t1('添加新行'), delete: _t1('删除') }
    result.displayForm = 'grid'
    result.createAddBtn = { show: true, userRange: 'all' }
    result.editAddBtn = { show: true, userRange: 'all' }
    result.createDelBtn = { show: true, userRange: 'all' }
    result.editDelBtn = { show: true, userRange: 'all' }
  }
  if (card.config === '编号') {
    result.fieldType = 'serialNumber'
  }
  if (card.config === '链接') {
    result.fieldType = 'link'
    result.linkType = 'out'
    result.pattern = '^http[s]?://[\\S]+$'
  }
  if (card.config === '区域') {
    result.fieldType = 'area'
    result.areaType = 'pca'
  }
  if (card.config === '星级评价') {
    result.count = '5'
    result.fieldType = 'rate'
  }
  if (card.config === '富文本') {
    result.fieldType = 'textEditor'
  }
  if (card.config === '用户') {
    result.fieldType = 'user'
    result.userType = 'creator'
    result.relateTo = 'User'
    result.createShow = false
    result.editShow = false
  }
  if (card.config === '字节数组') {
    result.fieldType = 'bytesArray'
    result.type = 'string'
    result.createShow = false
    result.editShow = false
    result.disabled = true
    // result.pattern = '^\\[([01]+\\,)*[01]+\\]$'
  }
  if (card.config === '查找引用') {
    result.sort = 'none'
  }
  if (card.config === '表单信息') {
    result.listFields = false
    result.showInList = false
    result.field = {
      attrs: {
        groupSize: {
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        }
      }
    }
  }

  // 可扩展控件
  const other = app.get('customWidgets')
  const w = other.find(item => item.config === card.config)
  if (w) {
    result.fieldType = w.name
    if (w.paramSchema?.defaultValue) {
      result = { ...result, ...w.paramSchema.defaultValue }
    }
  }

  return result
}

const ifNull = (v) => {
  return _.isNull(v) || v === ''
}

const MappingBtn = ({ functions, tableId, set, oldSchema }) => {
  const [loading, setLoading] = React.useState(false)
  const [vis, setVis] = React.useState(false)
  const [mapSchema, setMapSchema] = React.useState()
  // 配置了【映射表】表功能，才有配置同步按钮
  if (!functions?.find(f => f === 'tableMapping')) return null

  const handleClick = () => {
    setLoading(true)
    api({ name: 'core/t/schema/mapping' }).get(tableId).then((res) => {
      setLoading(false)
      const cannotMap = oldSchema?.form?.length > -1 && !_.isEqual(res?.form, oldSchema?.form)
      if (cannotMap) {
        setVis(true)
        setMapSchema(res)
      } else {
        set(res)
      }
    })
  }

  return <>
    <Button type="primary" onClick={handleClick} loading={loading} >{_t1('配置同步')}</Button>
    <Modal
      title={_t1("提示")}
      width={'40%'}
      visible={vis}
      onCancel={() => setVis(false)}
      onOk={() => {
        setVis(false)
        set(mapSchema)
      }}
      okText={_t1('确认同步')}
    >
      <div>{_t1('数据同步异常，当前表中的字段与数据库表中存在部分不匹配字段，确认同步后会将下列不匹配字段进行删除，请谨慎操作！')}</div>
      <Row className='map-fields-show'>
        <Col className='fields-table'>
          <div className='field-head'>{_t1('原表字段')}</div>
          {oldSchema?.form?.map(f => <div className='field-cell'>{f}</div>)}
        </Col>
        <Col className='fields-table'>
          <div className='field-head'>{_t1('数据库字段')}</div>
          {mapSchema?.form?.map(f => <div className='field-cell'>{f}</div>)}
        </Col>
      </Row>
    </Modal>
  </>
}

// 生成内容国际化新字段
const addLanguageField = (schema, settings) => {
  const xi18n = settings?.i18n?.lanageManage
  const languagetypes = xi18n?.filter(item => item?.contentlanguage == true)
  let languageField = {}
  let delField = []
  Object.keys(schema?.properties || {}).forEach(key => {
    const p = schema.properties[key]
    if (p.schemaHide) {
      languagetypes?.forEach(ll => {
        if (key.endsWith('_' + ll.code)) delField.push(key)
      })
    }
    if (p.languageType?.checked && p.languageType?.languages?.length > 0) {
      p.languageType.languages.forEach(lan => {
        languageField[key + '_' + lan] = {
          ..._.omit(p, ['languageType']),
          schemaHide: true,
          createShow: false,
          editShow: false,
          listFields: false,
          need: false,
        }
      })
    }
  })
  return {
    ...schema,
    properties: {
      ..._.omit(schema.properties || {}, delField),
      ...languageField
    }
  }
}

// 表定义预览国际化
const previewLang = (sch) => {
  let result = _.cloneDeep(sch)
  let p = sch.properties || {}
  const lang = app.context.language
  if (lang && lang !== 'zh_Hans') {
    Object.keys(p).forEach(key => {
      result.properties[key] = {
        ...p[key],
        title: p[key]?.['title_' + lang]
      }
    })
  }
    
  return result
  
}

export { AddPanel, FormLayout, updateSchemaProperties, previewLang,
  getFormValues, addDefaultVal, ifNull, MappingBtn, addLanguageField,
  forSchema }
