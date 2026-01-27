import React from 'react'
import _ from 'lodash'
import FormPanel from '../dropTool/FormPanel'
import { Row, Col, Popconfirm, Tooltip, Form, Input } from 'antd'
import Icon from './Icon'
import { app } from 'xadmin'
import { uuid, FieldGroup } from '../utils3'
import { BlockOutlined } from '@ant-design/icons';

const convert = (schema, options) => {
  const opts = options || {}
  if (opts.path === undefined) {
    opts.path = []
  }
  if (opts.lookup === undefined) {
    opts.lookup = {}
  }
  return app.get('schema_converter').reduce((prve, converter) => {
    return converter(prve, schema, opts)
  }, opts.global && opts.global.formDefaults ? _.cloneDeep(opts.global.formDefaults) : {})
}

const InputNode = ({ schema }) => {
  const convertSchema = convert(schema)
  convertSchema.required = schema.need
  const type = convertSchema.type
  const formFields = app.get('form_fields')
  const Node = formFields[type]?.component
  const field = {...convertSchema, option: { groupSize: {
    labelCol: {
      xs: { span: 24 }
    },
    labelAlign: 'left',
    colon: false,
    wrapperCol: {
      xs: { span: 24 }    }
  }}}
  let value = schema.defaultVal
  if (schema.fieldType === 'select') { // 选择器
    if (schema.selectType === "multiple") { // 多选
      if (schema.dataType === 'number') { // 数字
        value = _.isString(value) ? value.split(',').map(_.parseInt) : value
      } else { // 字符串
        value = _.isString(value) ? value.split(',') : value
      }
    } else { // 单选
      value = schema.dataType === 'number' ? _.parseInt(value || '') : value
    }
  }
  const title = schema.config === '表单信息' ? ' ' : (schema.title || ' ')
  return <FieldGroup label={title} meta={{}} field={field} >
    <Node {...convertSchema} input={{ value }} meta={{}} field={{ ...convertSchema, notForm: true }} group={(props) => props.children} preview></Node>
  </FieldGroup>

}

const RelateFieldShow = ({ data, properties, setItemSelected }) => {
  
  const mappedRelateField = Object.values(properties)?.find(f => {
    return f.relateShowFields?.find(rsf => rsf.mapField === data.key)
  })

  const handleClick = (e) => {
    e.stopPropagation()
    setItemSelected(mappedRelateField.key)

    // 获取容器、按钮和所有列表项
    const container = document.getElementsByClassName('custom-editor-container-list')?.[0]
    const fieldDom = container.querySelectorAll('.' + mappedRelateField.key)?.[0]?.parentNode?.parentNode
    // 自动滚动到对应字段位置
    container.scrollTop = fieldDom.offsetTop;
  }
  
  return mappedRelateField ? <div className='relate-field-show' onClick={handleClick}>
    <BlockOutlined />
    {mappedRelateField.title}
  </div> : null
}

// 单条表单数据
class ListItem extends React.Component {
  cancel = () => { }
  render() {
    const { schema: { properties }, propertiesKey, deleteCard, onSelect, itemSelected, setItemSelected,
      copyItem, dragArea, formInvalid={}, showField } = this.props
    const data = properties && properties[propertiesKey]
    // 配置 fixedField 的字段为固定字段，不可复制删除
    const fixed = data?.fixedField

    const customAction = <>
      <Tooltip title={_t1("复制")}>
        <Icon style={{ marginRight: 8 }} type="copy" onClick={(e) => copyItem({ ...properties[propertiesKey], key: propertiesKey }, e)} />
      </Tooltip>
      <Tooltip title={_t1("删除")}>
        <Popconfirm
          title={_t1("确定删除此项吗?")}
          onConfirm={e => { e.stopPropagation(); deleteCard(propertiesKey) }}
          onCancel={this.cancel}
          style={{ cursor: 'pointer' }}
          okText={_t1("确定")}
          cancelText={_t1("取消")}>
          <Icon type="delete" onClick={e => e.stopPropagation()} />
        </Popconfirm>
      </Tooltip>
    </>

    const fieldInvalid = formInvalid[propertiesKey] && propertiesKey !== itemSelected
    return data ? (
      dragArea == 'right' ?
        <div style={{ lineHeight: '30px', height: 30, border: '1px solid rgba(0, 0, 0, 0.1)', textAlign: 'center', marginBottom: 5 }} onClick={() => onSelect(propertiesKey)}>
          <Tooltip placement="top" title={_t1('拖拽调整顺序')}>
            <Icon type="drag" style={{ position: 'absolute', left: 5, lineHeight: '30px', display: 'inline-block' }} />
          </Tooltip>
          {data && data.title || ''}
          <Icon type="delete" onClick={e => { e.stopPropagation(); deleteCard(propertiesKey) }} style={{ position: 'absolute', right: 5, lineHeight: '30px', display: 'inline-block' }} />
        </div> :
        <div className={(itemSelected == propertiesKey ? 'custom-form-item-selected' : 'custom-form-item') + ' ' + propertiesKey}
        style={{
          padding: '0 10px 5px',
          border: fieldInvalid ? '1px solid red' : 0, cursor: 'move',
        }} onClick={() => onSelect(propertiesKey)} >
          <RelateFieldShow data={data} properties={properties} setItemSelected={setItemSelected} />
          <div className='custom-action' style={{ display: itemSelected == propertiesKey && 'block' }}>
            { showField === propertiesKey && <span style={{ fontSize: 14, marginRight: 10 }}>{_t1('显示字段')}</span> }
            { !fixed && customAction }
          </div>
          <div style={{ pointerEvents: 'none' }}>
            <InputNode schema={_.omit(data, ['defaultVal'])}></InputNode>
          </div>
          {
            fieldInvalid && <div style={{ color:'red', fontSize: 12, marginTop: -20 }}>
              {formInvalid[propertiesKey]}
            </div>
          }
        </div>
    ) : <div style={{ width: '100%', height: 74, border: '1px dashed gray' }}></div>
  }
}

// 表单列表  =>>
class FormList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setTimeout(() => {
      const containerHeight = document.getElementsByClassName('custom-editor-container-list')?.[0]?.clientHeight
      const height = document.getElementById('custom-form-drop-target')?.clientHeight || 0
      containerHeight && this.setState({ height, containerHeight })
    })
  }

  /**
   *  新增
   *  newItem 控件内容
   *  hoverIndex hover组件的index
   *  dropInRow 是否拖拽到行内
   *  isAhead 是否放置在当前hover控件的前面
   * */
  add = (newItem, hoverIndex, dropInRow, isAhead) => {
    const { schema: { form=[], properties={} }, addCard } = this.props
    const hKey = form[hoverIndex]
    const hRowKey = properties[hKey]?.rowKey
    
    let index = hoverIndex
    // 向下拖动 计算覆盖行中有几个控件 计算form中插入元素的index
    if (hRowKey && !dropInRow) {
      const first = form.findIndex(f => properties[f]?.rowKey == hRowKey)
      const last = form.findLastIndex(f => properties[f]?.rowKey == hRowKey)
      index = !isAhead ? last + 1 : first
    } else if (!isAhead) {
      index = index + 1
    }
    if (dropInRow) {
      let w = '12'
      if (hRowKey) {
        const count = _.compact(_.filter(properties, (item, key) => item.rowKey == hRowKey))?.length
        w = count && _.toString(24 / (count + 1))
      }
      const rowKey = hRowKey ? hRowKey : uuid(4, 16)
      _.forEach(properties, (item, key) => {
        if (hRowKey) {
          if (hRowKey == item.rowKey) properties[key] = { ...item, widthInForm: w, rowKey }
        } else if (key == hKey) {
          properties[key] = { ...item, widthInForm: w, rowKey }
        }
      })
      newItem = { ...newItem, widthInForm: w, rowKey }
    }
    addCard(newItem, index)
    this.getAddHeight()
  }

  // 更新控件宽度
  updateWidth = (dragKey, hoverKey) => {
    const { schema: { form, properties } } = this.props
    const hRowKey = properties[hoverKey]?.rowKey
    const dRowKey = properties[dragKey]?.rowKey
    if (dRowKey && hRowKey == dRowKey) return // 行内拖动只改变位置，不改变宽度

    const hCount = hRowKey && _.compact(_.filter(properties, (item, key) => item.rowKey == hRowKey))?.length
    const dCount = dRowKey && _.compact(_.filter(properties, (item, key) => item.rowKey == dRowKey))?.length
    
    const hw = hRowKey && hCount ? _.toString(24 / (hCount + 1)) : '12' // 目标行控件宽度
    const dw = dRowKey && dCount ? _.toString(24 / (dCount - 1)) : properties[dragKey]?.widthInForm // 拖拽控件所在行控件宽度
    const width = { hwidthInForm: hw, dWidthInForm: dw } 
    const rowKey = hRowKey ? hRowKey : uuid(4, 16)
    _.forEach(properties, (item, key) => {
      // 目标行控件宽度更新
      if (hRowKey) {
        if (hRowKey == item.rowKey || key == dragKey) properties[key] = { ...item, widthInForm: width?.hwidthInForm, rowKey }
      } else if (key == dragKey || key == hoverKey) {
        properties[key] = { ...item, widthInForm: width?.hwidthInForm, rowKey }
      }
      // 拖拽控件所在行控件宽度更新
      if (dRowKey) {
        if (dRowKey == item.rowKey && key != dragKey) properties[key] = { ...item, widthInForm: width?.dWidthInForm }
      }
    })
  }

  /**
   *  移动
   *  dragIndex 拖动组件的index
   *  hoverIndex hover组件的index
   *  dropInRow 是否拖拽到行内
   *  movePos 拖放位置(left\right)
   * */ 
  move = (dragIndex, hoverIndex, dropInRow, movePos) => {
    const { schema: { form, properties }, moveCard } = this.props
    if (dragIndex != undefined && hoverIndex != undefined) { // 中间面板拖动元素（修改）
      const dKey = form[dragIndex]
      const hKey = form[hoverIndex]
      const dRowKey = properties[dKey]?.rowKey
      const hRowKey = properties[hKey]?.rowKey
      
      let index = hoverIndex
      // 计算覆盖行中有几个控件 计算form中插入元素的index （解决一行多个 向上向下拖动hoverIndex不一定是一行中的最后一个的问题）
      if (hRowKey && !dropInRow) {
        const first = form.findIndex(f => properties[f]?.rowKey == hRowKey)
        const last = form.findLastIndex(f => properties[f]?.rowKey == hRowKey)
        index = hoverIndex > dragIndex ? last + 1 : first
      } else if ((movePos != 'left' && hoverIndex > dragIndex) || (movePos == 'right' && hoverIndex < dragIndex)) {
        index = index + 1
      }
      const changeOrder = !(movePos && Math.abs(hoverIndex - dragIndex) == 1) // 是否改变控件顺序
      if (dragIndex !== hoverIndex && changeOrder) {
        const index1 = index > dragIndex ? dragIndex : dragIndex + 1
        form.splice(index, 0, dKey);
        form.splice(index1, 1);
      }
      // 重新计算宽度和rowKey
      if (dropInRow) {
        this.updateWidth(dKey, hKey)
      } else {
        properties[dKey] = _.omit(properties[dKey], ['widthInForm', 'rowKey'])
        dRowKey && _.forEach(properties, (item, key) => {
          const count = _.compact(_.filter(properties, (item, key) => item.rowKey == dRowKey))?.length
          const widthInForm = _.toString(24 / count)
          // 仅剩一个元素时 去掉宽度和rowKey
          if (dRowKey == item.rowKey) properties[key] = widthInForm == '24' ? _.omit(item, ['widthInForm', 'rowKey']) : { ...item, widthInForm }
        })
      }
      moveCard(_.uniq(form))
      this.getAddHeight()
    }
  }

  // 移动目标位置(用于显示拖放目标位置的蓝线)
  movePos = (overPos) => {
    this.setState({ overPos })
  }

  // 复制控件，一行多个时，复制的新控件显示在当前行下面
  copy = (cardItem, e) => {
    const { schema: { form, properties }, copyItem } = this.props
    let index = form.indexOf(cardItem.key)
    if (cardItem.rowKey) {
      index = form.findLastIndex(item => properties[item]?.rowKey == cardItem.rowKey) + 1
      cardItem = _.omit(cardItem, 'rowKey')
    }
    copyItem(cardItem, index, e)
    this.getAddHeight()
  }

  // 删除控件
  delete = (itemKey) => {
    const { schema: { properties }, deleteCard } = this.props
    const rowKey = properties[itemKey]?.rowKey
    if (rowKey) {
      const count = _.compact(_.filter(properties, (item, key) => item.rowKey == rowKey && item.key != itemKey))?.length
      const w = count && _.toString(24 / count)
      _.forEach(properties, (item, key) => {
        if (rowKey == item.rowKey) properties[key] = count < 2 ?  _.omit({ ...item, widthInForm: w }, 'rowKey') : { ...item, widthInForm: w }
      })
    }
    deleteCard(itemKey)
    this.getAddHeight()
  }

  // 计算控件下方空余位置高度
  getAddHeight = () => {
    const height = document.getElementById('custom-form-drop-target')?.clientHeight || 0
    if (this.state.containerHeight && height != this.state.height) {
      this.setState({ height })
    }
  }

  render() {
    const { schema, onSelect, deleteCard, itemSelected, setItemSelected, copyItem, dragArea, formInvalid, showField, notInRow } = this.props
    const form = schema && schema.form || []

    // 下方新增框高度
    const height = this.state.height ? this.state.containerHeight - this.state.height : this.state.containerHeight

    // schema 增加配置项 schemaHide，false 时不在表定义中显示
    return (
    <>
      <Row id='custom-form-drop-target'>
        {
          form && _.isArray(form) && form.length > 0 ? form.map((key, i) => (
            <FormPanel
              hide={schema?.properties?.[key]?.schemaHide}
              key={key} 
              index={i} 
              id={key} 
              overPos={this.state.overPos} 
              moveCard={this.move} 
              movePos={this.movePos} 
              addCard={this.add} 
              schema={dragArea == 'right' ? _.omit(schema?.properties?.[key], ['widthInForm']) : schema?.properties?.[key]}
              dragDirection={dragArea == 'right' ? 'vertical' : null}
              notInRow={notInRow}
            >
              <ListItem
                schema={schema}
                itemSelected={itemSelected}
                setItemSelected={setItemSelected}
                onSelect={onSelect}
                propertiesKey={key}
                deleteCard={this.delete}
                copyItem={this.copy}
                dragArea={dragArea}
                formInvalid={formInvalid}
                showField={showField}
                notInRow={notInRow}
              />
            </FormPanel>
          )) : null
        }
      </Row>
      <FormPanel
        id='virtualSpace'
        index={form ? form.filter(item => item !== 'virtual').length : 0}
        moveCard={this.move}
        addCard={this.add} 
        movePos={this.movePos} 
        overPos={this.state.overPos} 
        dragDirection={dragArea == 'right' ? 'vertical' : null}
        disableDragging={true}
      >
        {dragArea == 'right' ? null : <div style={{ width: '100%', height }}></div>}
      </FormPanel>
    </>
    )
  }
}

export default FormList