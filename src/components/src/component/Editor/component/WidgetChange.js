import React from "react";
import { use } from "xadmin";
import getWidgets from '../wigets'
import { Select, Tooltip } from "antd";
import { addDefaultVal } from "../utils";
import { getWidgetSchema } from "./PropertiesForm";
import { QuestionCircleOutlined } from '@ant-design/icons';

const getInherit = (field = {}, config) => {
  const { baseSchema } = getWidgetSchema(config, field?.fixedField) || {}
  const keys = baseSchema?.form?.indexOf('*') > -1 ? Object.keys(baseSchema?.properties || {}) :
    baseSchema?.form?.map(f => (_.isObject(f) ? f.key : f))
  const keys2 = keys.filter(k => ['textContent'].indexOf(k) === -1)
  return _.pick(field, [...keys2, 'rowKey'])
}

const WidgetChange = ({ schema, selected, setSchema }) => {
  if (!selected) return null
  const { hideScript } = use('i18n.permission')
  const widgets = getWidgets(_t1, hideScript)
  const field = schema?.properties?.[selected]
  const { baseSchema } = getWidgetSchema(field?.config, field?.fixedField) || {}
  const des = baseSchema.description

  const handleChange = (val) => {
    const card = widgets.find(w => w.config === val)
    const defaultV = addDefaultVal(card, _t1)
    const result = {
      ...schema,
      properties: {
        ...schema.properties,
        [selected]: { ...defaultV, ...getInherit(field, val) }
      }
    }
    setSchema(result)
  }

  // 固定字段，用户字段，日期字段自动生成，不可修改
  const disabled = field?.fixedField || field?.config === '用户' || field?.createForm === "autoCreate"

  return <div className='config-descrip'>
    <Select
      value={field?.config}
      options={widgets.map(w => ({ value: w.config, label: w.title }))}
      className="widget-change-select"
      style={{ height: 24, width: 100 }}
      onChange={handleChange}
      disabled={disabled}
    />
    <Tooltip title={<>
        {`${_t1(field?.config)}：${_t1(des)}`}<br/>
        {_t1('可修改控件类型，内置字段不可切换类型。已存储数据的控件一旦更改类型，可能会导致数据结构不一致。为避免这种情况，请谨慎操作，确保数据结构的一致性。')}
      </>}>
      <QuestionCircleOutlined style={{ margin: 0 }} />
    </Tooltip>
  </div>
}

const TableWidgetChange = ({ field, setField, onFormChange }) => {
  const { hideScript } = use('i18n.permission')
  const widgets = getWidgets(_t1, hideScript).filter(item => !item.hiddenInTable)
  const { baseSchema } = getWidgetSchema(field.config, field?.fixedField) || {}
  const des = baseSchema.description

  const handleChange = (val) => {
    const card = widgets.find(w => w.config === val)
    const defaultV = addDefaultVal(card, _t1)
    const result = { ...defaultV, ...getInherit(field, val) }
    setField(result)
    onFormChange(result)
  }

  return <div className='config-descrip'>
    <Select
      value={field?.config}
      className="widget-change-select"
      options={widgets.map(w => ({ value: w.config, label: w.title }))}
      style={{ height: 24, width: 100 }}
      onChange={handleChange}
    />
    <Tooltip title={<>
        {`${_t1(field.config)}：${_t1(des)}`}<br/>
        {_t1('可修改控件类型，内置字段不可切换类型。已存储数据的控件一旦更改类型，可能会导致数据结构不一致。为避免这种情况，请谨慎操作，确保数据结构的一致性。')}
      </>}>
      <QuestionCircleOutlined style={{ margin: 0 }} />
    </Tooltip>
  </div>
}

export { TableWidgetChange }
export default WidgetChange
