import React from 'react'
import { use, api } from 'xadmin'
import { C, Loading } from 'xadmin-ui'
import ShowAttachment from './fieldComponent/ShowAttachment'
import ShowTable from './fieldComponent/ShowTable'
import RateComponent from './fieldComponent/RateComponent'
import TextEditorComponent from './fieldComponent/TextEditor'
import pcaData from './fieldComponent/tool/pca'
import moment from 'moment'
import { DetailShow } from './relate'
import { isPromise } from './component/Editor/utils2'
import _ from 'lodash'
import { Modal, Tooltip } from 'antd'
import FormInfoComponent from './fieldComponent/FormInfoComponent'
import { AreaShow } from './fieldComponent/AreaComponent'
import { ifFieldRender, ifRenderScript } from './component/Editor/utils2'
import { Model } from 'xadmin-model'
import Icon from './component/Editor/component/Icon'
import DataShow from './fieldComponent/RelateComponentPlus/DataShow'

const style = {
  border: '1px solid #ccc',
  display: 'inline-block',
  borderRadius: 5,
  margin: 1,
  padding: '1px 4px',
  maxWidth: '100%',
}

const ReferenceRender = ({ value, schema, WrapComponent, inList, app, item }) => {
  let model, wsData
  try {
    model = use('model')?.model
    const id = model?.key + '#%' + item?.id + '#%' + schema?.key
    wsData = use('table.reference.value', id)
  } catch (e) { }
  const fieldKey = schema?.searchRelate?.field?.key

  let val = _.isEmpty(wsData) ? value : wsData // ws推送的数据为主
  // 排序配置
  if (['asc', 'desc'].indexOf(schema?.sort) > -1 && _.isArray(val)) {
    val = val.sort((a, b) => {
      if (schema.sort === 'asc') return a[fieldKey] > b[fieldKey] ? 1 : -1
      return a[fieldKey] < b[fieldKey] ? 1 : -1
    })
  }
  // 条数限制配置
  if (schema?.numberLimit > 0 && _.isArray(val)) {
    val = val.slice(0, schema.numberLimit)
  }
  const result = val === 'computing' ? '计算中...' :
    _.isArray(val) ? val.map(v => {
      const nf = schema?.numberFormat
      const fSchema = schema?.searchRelate?.field?.fieldSchema
      if (schema?.computeMethod === 'count') { // 计数情况直接显示数字
        return <div style={style} >{v[fieldKey]}</div>
      } else if (nf && _.isNumber(v[fieldKey])) { // 数字类型，前端做【数字格式处理】
        if (nf === 'int') return Math.round(v[fieldKey])
        if (nf === 'float1') return v[fieldKey].toFixed(1)
        if (nf === 'float2') return v[fieldKey].toFixed(2)
        if (nf === '%') return Math.round(v[fieldKey] * 100) + '%'
        if (nf === '%2') return (v[fieldKey] * 100) + '%'
        // 剩下是日期格式化
        return <div style={style} >{moment(v[fieldKey]).format(nf)}</div>
      } else if (nf) { // 日期类型，前端做【数字格式处理】
        return <div style={style} >{moment(v[fieldKey]).format(nf)}</div>
      } else if (fSchema?.type === 'boolean') { // 布尔
        return <div style={style} >
          <C is="Model.BooleanIcon" value={v[fieldKey]} schema={fSchema} />
        </div>
      } else if (ifFieldRender(fSchema)) {
        return !_.isUndefined(v[fieldKey]) ? <div style={style} >
          <TableFieldRender
            value={v[fieldKey]}
            wrap={WrapComponent}
            inList={inList}
            schema={fSchema}
            app={app}
            item={item}
          />
        </div> : null
      } else {
        return <div style={style} >{v[fieldKey]}</div>
      }
    }) : val
  return <WrapComponent>{result || <span style={{ color: '#bbb' }}>{_t1('空')}</span>}</WrapComponent>
}

const ScriptRender = ({ value, schema, WrapComponent, app, item }) => {
  const [content, setContent] = React.useState('')

  React.useEffect(() => {
    let renderVal
    let result = ''
    try {
      if (schema.fieldRenderScript) {
        renderVal = new Function('{ value, item, api, app }', 'let renderVal;' + schema.fieldRenderScript + ';return renderVal')({ value, item, api, app });
      }
      if (schema.allScript) {
        const frs = new Function('{ value, item, api, app }', "return " + schema.allScript)({ value, item, api, app })?.renderVal
        if (frs) renderVal = frs
      }
      if (renderVal && _.isFunction(renderVal)) result = renderVal({ value, item, api, app })
      if (isPromise(result)) {
        result?.then(val => setContent(val))
      } else {
        setContent(result)
      }
    } catch (e) { console.error('字段渲染脚本报错', e) }
  }, [value, JSON.stringify(item || {})])

  if (_.isString(content)) {
    return <WrapComponent>
      <span dangerouslySetInnerHTML={{ __html: content }}></span>
    </WrapComponent>
  } else if (_.isUndefined(content)) {
    return null
  } else {
    return <span style={{ color: 'red' }}>{_t1('字段渲染脚本错误')}</span>
  }
}

const FormulaRender = ({ value }) => {
  if (_.isString(value) || _.isNumber(value)) {
    return value
  } else if (_.isArray(value) && (_.isString(value[0]) || _.isNumber(value[0]))) {
    return value.join(',')
  } else if (_.isArray(value) || _.isObject(value)) {
    let str = JSON.stringify(value)
    return str.length > 50 ? <Tooltip title={str} >
      {str.substring(0, 50) + '...'}
    </Tooltip> : str
  } else {
    return ''
  }
}

const RelateShowTable = (props) => {
  const { value, schema, inList } = props
  const tableID = schema?.relate?.id

  const [loading, setLoading] = React.useState(true)
  const [state, setState] = React.useState(null)
  const [open, setOpen] = React.useState(false)

  const getModel = () => {
    if (tableID) {
      api({ name: 'core/t/schema' }).get(tableID).then(({ schema }) => {
        setLoading(false)
        setState(schema)
      })
    } else {
      setLoading(false)
    }
  }
  
  const modelSchema = {
    ...state,
    name: `core/t/${tableID}/d`,
    batchActions: null,
    listFields: [schema?.relate?.fields?.[0]?.key, ...(schema?.relateShowFields || []).map(item => item.key)].filter(k => !!k)
  }
  const modelKey = tableID + modelSchema.listFields.join(',')  // 用于 Model 刷新

  React.useEffect(() => {
    if (!inList) getModel()
  }, [inList])

  if (!inList) {
    return loading ? <Loading /> : <Model
      modelKey={modelKey}
      key={modelKey}
      schema={modelSchema}
    >
      <C is="Model.DataTable" items={value || []} />
    </Model>
  }

  return <>
    <Icon type='table' onClick={() => { getModel(); setOpen(true) }}></Icon>
    <span style={{ marginLeft: 5 }}>{value?.length || ''}</span>
    <Modal title={_t1('内容详情')}
      open={open}
      onCancel={() => setOpen(false)}
      width={1000}
      destroyOnClose
      footer={null}
    >
      {
        loading ? <Loading /> : <Model
          modelKey={modelKey}
          key={modelKey}
          schema={modelSchema}
        >
          <C is="Model.DataTable" items={value || []} />
        </Model>
      }
    </Modal>
  </>
}

const TableFieldRender = ({ value, wrap: WrapComponent, inList, prev, schema = {}, app, item }) => {
  if (ifRenderScript(schema)) { // 配置了渲染脚本
    return <ScriptRender value={value} schema={schema} WrapComponent={WrapComponent} app={app} item={item} />
  }
  if (schema.textContent === 'logic' || schema.config === '公式') { // 公式
    return <WrapComponent><FormulaRender value={value} /></WrapComponent>
  }
  if (schema.fieldType == 'attachment' || schema.fieldType == 'attachments') {
    return React.useMemo(() => (
      <WrapComponent>
        <ShowAttachment schema={schema} value={value} item={item} inList={inList} ></ShowAttachment>
      </WrapComponent>
    ), [value])
  }
  if (schema.fieldType == "input" && schema.config == '文本') {
    const type = schema?.filedFormat?.type
    const format = schema?.filedFormat?.format
    if (!value) {
      return <WrapComponent> {value} </WrapComponent>
    }
    if (type && format) {
      let newValue = value
      if (type == 'date') {
        const dateFormat = use('common.DateFormat')
        newValue = dateFormat(format, value)
      }
      if (type == 'number') {
        const numberFormat = use('common.NumberFormat')
        newValue = numberFormat(format, Number(value))
      }
      return <WrapComponent> {newValue}</WrapComponent>
    } else {
      return <WrapComponent> {value} </WrapComponent>
    }
  }
  if (schema.fieldType == 'datePicker') {
    if (!value) {
      return <WrapComponent> {value} </WrapComponent>
    }
    if (schema.filedFormat) {
      const numberFormat = use('common.DateFormat')
      return <WrapComponent>
        {(value && _.isFunction(numberFormat)) ? numberFormat(schema.filedFormat, value) : ''}
      </WrapComponent>
    } else {
      const f = {
        'ym': 'YYYY-MM',
        'date': 'YYYY-MM-DD',
        'datetime': 'YYYY-MM-DD HH:mm:ss',
        'ymdh': 'YYYY-MM-DD HH',
      }
      const format = f[schema.format2] || f[schema.format]
      return <WrapComponent>
        {format ? moment(value).format(format) : ''}
      </WrapComponent>
    }
  }
  if (schema.fieldType == 'dateRange') {
    if (schema.filedFormat) {
      const dateFormat = use('common.DateFormat')
      if (!dateFormat || !value) {
        return <WrapComponent> {value} </WrapComponent>
      }
      const [startDateString, endDateString] = value.split(' - ');
      const endShow = endDateString ? dateFormat(schema.filedFormat, endDateString)
        : (schema.NullShow === 'forever' ? _t1('长期') : _t1('至今'))
      const newValue = dateFormat(schema.filedFormat, startDateString) + ' - ' + endShow
      return <WrapComponent>{newValue}</WrapComponent>
    } else {
      if (!value) return <WrapComponent></WrapComponent>
      const [startDateString, endDateString] = value.split(' - ');
      const endShow = endDateString || (schema.NullShow === 'forever' ? _t1('长期') : _t1('至今'))
      const newValue = startDateString + ' - ' + endShow
      return <WrapComponent>{newValue}</WrapComponent>
    }
  }
  if (schema.fieldType === 'select') { // 选择器
    let result = ''
    let style = {
      display: 'inline-block',
      padding: '2px 12px',
      borderRadius: 12,
      marginRight: 2,
      color: 'white'
    }
    if (_.isArray(value)) { // 数组，多选
      if (schema.enum_color1 && schema.enum1) { // 设置色块
        result = []
        value.forEach(item => {
          let color = schema.enum_color1[schema.enum1.indexOf(item)]
          let text = schema.enum_title1[schema.enum1.indexOf(item)] ?? item
          if (_.isString(text) && text.indexOf('LabelComponent') > -1) { // React组件
            text = <FormInfoComponent schema={{ widgetContent: text }} />
          }
          result.push(<div style={{
            ...style,
            backgroundColor: color === '' ? 'gray' : color
          }}>{text}</div>)
        })
      } else if (schema.enum1) {
        value.forEach(item => {
          let r = schema.enum_title1[schema.enum1.indexOf(item)]
          if (_.isString(r) && r.indexOf('LabelComponent') > -1) { // React组件
            r = <FormInfoComponent schema={{ widgetContent: r }} />
          }
          result += r + ','
        })
        result = result.substring(0, result.length - 1)
      } else {
        result = value.join(',')
      }
    } else if (typeof value === 'string' || typeof value === 'number') { // 字符串或数字，单选
      if (schema.enum_color1 && schema.enum1) { // 设置色块
        let color = schema.enum_color1[schema.enum1.indexOf(value)]
        let text = schema.enum_title1[schema.enum1.indexOf(value)] ?? value
        if (_.isString(text) && text.indexOf('LabelComponent') > -1) { // React组件
          text = <FormInfoComponent schema={{ widgetContent: text }} />
        }
        result = (
          <div style={{
            ...style,
            backgroundColor: color === '' ? 'gray' : color
          }}>{text}</div>
        )
      } else if (schema.enum1) {
        result = schema.enum_title1[schema.enum1.indexOf(value)] ?? value
        if (_.isString(result) && result.indexOf('LabelComponent') > -1) { // React组件
          result = <FormInfoComponent schema={{ widgetContent: result }} />
        }
      } else {
        result = value
      }
    } else {
      result = <span class="text-muted">{_t1("空")}</span>
    }
    return (
      <WrapComponent>
        {result}
      </WrapComponent>
    )
  }
  if (schema.textContent === 'password') { // 密码
    return <WrapComponent>······</WrapComponent>
  }
  if (schema.fieldType === 'inputNumber') { // 数字
    const numberFormat = use('common.NumberFormat')
    if (!numberFormat || !value) {
      return <WrapComponent> {value} </WrapComponent>
    }
    let computeResult = value
    if (value && schema.decimal && _.isNumber(value)) {
      computeResult = value.toFixed(schema.decimal)
    }
    if (schema.bitNum && numberFormat) {
      computeResult = numberFormat(schema.bitNum, computeResult)
    }
    return <WrapComponent>{computeResult}</WrapComponent>
  }
  if (schema.fieldType === 'editableTable') { // 表格
    return <WrapComponent>
      <ShowTable value={value} schema={schema} inList={inList}></ShowTable>
    </WrapComponent>
  }
  if (['User', 'Role', 'Department'].indexOf(schema.relateTo) > -1) { // 内部表
    const render = (v) => {
      let showField = schema.showField || 'name'
      let r = v?.[showField] ?? ''
      if (/^[0-9\-]+T[0-9\:]+\+08:00$/.test(r)) { // 日期时间
        r = moment(r).format('YYYY-MM-DD HH:mm:ss')
      } else if (schema.showField === "kind") { // 资产类型
        const { settings: { nodeconfig } } = app.context.store.getState()
        r = nodeconfig?.nodekind?.find(item => item.id === r)?.name
      } else if (schema.showField === "password") { // 用户密码
        r = r ? '*******' : ''
      }
      return r
    }
    let result = ''
    if (_.isArray(value)) { // 多选
      result = value.map(item => render(item)).join('，')
    } else {
      result = render(value)
    }
    return <WrapComponent>{result}</WrapComponent>
  }
  if (schema.fieldType === 'link') { // 链接
    const handleClick = () => {
      if (schema.linkType === 'in') {
        app.go(value)
      } else {
        window.open(value)
      }
    }
    return <WrapComponent>
      <a href="javaScript:void(0);" onClick={handleClick}>{value}</a>
    </WrapComponent>
  }
  if (schema.fieldType === 'map') { // 定位
    let v = value
    if (_.isString(value)) { // WS传过来的是字符串
      try {
        v = JSON.parse(value)
      } catch (e) {}
    }
    return <WrapComponent>{_.isEmpty(v) ? '' : `${(v.name || '')}(${v.lng},${v.lat})`}</WrapComponent>
  }
  if (schema.fieldType === 'area') { // 区域
    return <AreaShow value={value} WrapComponent={WrapComponent} />
  }
  if (schema.fieldType === 'rate') { // 星级评价
    return <WrapComponent>
      <RateComponent input={{ value }} field={{ schema: { ...schema, disabled: true, inList } }}></RateComponent>
    </WrapComponent>
  }
  if (schema.fieldType === 'textEditor') { // 富文本
    return <WrapComponent>
      <TextEditorComponent input={{ value }} field={{ schema: { ...schema, disabled: true, inList } }}></TextEditorComponent>
    </WrapComponent>
  }
  if (schema.relateTo === 'Warning') { // 关联报警
    value = value || {}
    let sf = schema.showField || 'name'
    let fieldRender = app.apps.find(item => item.name === 'iot.warning')?.models?.Warning?.fieldRender
    let fieldVal = value?.[sf]
    let result = _.isObject(fieldVal) ? fieldVal.name : fieldVal
    try { // react报多hook或者少hook的错
      delete fieldRender.remark // 不要报警处理字段的 fieldRender
      if (fieldRender && fieldRender[sf]) {
        result = fieldRender[sf]({ value: fieldVal, item: value, wrap: 'span' })
      }
    } catch (e) { }
    if (sf === 'time') { // 报警时间
      result = fieldVal ? moment(fieldVal).format('YYYY-MM-DD HH:mm:ss') : ''
    }

    return <WrapComponent>{result}</WrapComponent>
  }
  if (schema.fieldType == 'user') { // 用户
    return <WrapComponent>{value?.name || ''}</WrapComponent>
  }
  if (schema.fieldType == 'boolean') { // 布尔值
    return <WrapComponent style={{ textAlign: 'center' }}>
      <C is="Model.BooleanIcon" value={value} schema={schema} />
    </WrapComponent>
  }
  if (schema.config == '查找引用') { // 查找引用
    return <ReferenceRender value={value} schema={schema} WrapComponent={WrapComponent}
      inList={inList} app={app} item={item} />
  }
  if (schema.type == 'object' && schema.relate && schema.relate.tableType == 'table') { // 数据表单选
    const field = schema.relate.fields && schema.relate.fields[0]
    const fieldSchema = field && field.fieldSchema
    let fieldRender = app.apps.find(item => item.name === 'iot.custom')?.fieldRenders
    let v = value
    if (_.isString(value)) { // WS传过来的是字符串
      try {
        v = JSON.parse(value)
      } catch (e) {}
    }
    let val = v?.[field.key]
    try {
      val = JSON.parse(v?.[field.key])
    } catch (e) {}
    let result = ['input', 'serialNumber', 'timePicker', 'dateRange'].indexOf(fieldSchema?.fieldType) > -1 ? value?.[field.key]
      : fieldRender(app)(prev, fieldSchema)({ value: val, wrap: 'span' })
    return <WrapComponent>
      <DetailShow schema={schema} value={v} fieldRender={fieldRender} inList={inList}>
        {result}
      </DetailShow>
    </WrapComponent>
  } else if (schema.type == 'array' && schema.relate && schema.relate.tableType == 'table') { // 数据表多选
    const field = schema.relate.fields && schema.relate.fields[0]
    const fieldSchema = field && field.fieldSchema
    let compList = []
    let v = value
    if (_.isString(value)) { // WS传过来的是字符串
      try {
        v = JSON.parse(value)
      } catch (e) {}
    }
    if (schema.showType === "table") {
      return <WrapComponent><RelateShowTable value={v} schema={schema} inList={inList} /></WrapComponent>
    } else if (schema.showType === "card" && schema.relateShowFields?.length > 0 && !inList) {
      return <WrapComponent><DataShow relateSchema={schema} input={{ value: v }} detailPage /></WrapComponent>
    }
    _.isArray(v) && v.forEach(item => {
      let fieldRender = app.apps.find(item => item.name === 'iot.custom')?.fieldRenders
      let val = item?.[field.key]
      try {
        val = JSON.parse(item?.[field.key])
      } catch (e) {}
      let result = ['input', 'serialNumber', 'timePicker'].indexOf(fieldSchema?.fieldType) > -1 ? item?.[field.key]
        : fieldRender(app)(prev, fieldSchema)({ value: val, wrap: 'span' })

      compList.push(<DetailShow schema={schema} value={item} fieldRender={fieldRender} inList={inList}>
        {result}
      </DetailShow>)
      compList.push(',')
    })
    return <WrapComponent>{compList.slice(0, compList.length - 1)}</WrapComponent>
  }if (schema.config == '表单信息') {
    return <WrapComponent>
      <FormInfoComponent schema={schema} outProps={{ inList, viewPage: true }}/>
    </WrapComponent>
  }
  return value
}

export { ReferenceRender, FormulaRender }
export default TableFieldRender
