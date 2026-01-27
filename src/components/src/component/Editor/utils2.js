/**
 * 原utils提出部分工具函数，用来压缩前端front.js体积
 */
import React from 'react'
import _ from 'lodash'
import { app, api } from 'xadmin'
import './style.css'

const isPromise = obj =>
  !!obj &&
  (typeof obj === 'object' || typeof obj === 'function') &&
  typeof obj.then === 'function'


const useScriptVal = ({ schema, value, values, record = {}, onChange = () => {} }) => {
  let getScriptVal
  if (schema.allScript) {
    try {
      const gsv = new Function('{ values, record, api, app }', "return " + schema.allScript)({ values, record, api, app })?.getScriptVal
      if (gsv) getScriptVal = gsv
    } catch (e) {console.error(e)}
  } else if (schema.fieldScript) { // 兼容历史数据
    try {
      getScriptVal = new Function('{ values, record, api, app }', 'let getScriptVal;' + schema.fieldRenderScript + ';return getScriptVal')({ values, record, api, app });
    } catch (e) {console.error(e)}
  } else {
    return
  }
  
  let result = value
  if (getScriptVal) result = getScriptVal({ values, record, api, app })
  if (isPromise(result)) {
    result?.then(onChange)
  } else {
    onChange(result)
  }
}

function replaceFieldPlaceholders(a, allValues) {
  if (typeof a === 'string') {
    if (a.startsWith('[field]:')) {
      const key = a.substring(8);
      return allValues[key] !== undefined ? allValues[key] : a;
    }
    if (a.startsWith('[field][table]:')) {
      const key = a.substring(15);
      return allValues[key] !== undefined ? allValues[key] : a;
    }
    return a;
  }
  
  if (Array.isArray(a)) {
    return a.map(item => replaceFieldPlaceholders(item, allValues));
  }
  
  if (typeof a === 'object' && a !== null) {
    const result = {};
    for (const [key, value] of Object.entries(a)) {
      result[key] = replaceFieldPlaceholders(value, allValues);
    }
    return result;
  }
  
  return a;
}

// 处理内置查询绑定
const dealFilter = (filterObj, field, getQueryFilter, getFormState, outTable) => {
  const ifQueryEditor = !field.option // 在queryEditor中使用时，内置查询不生效
  // 在过滤器中，内置查询不生效
  // 客户提出，原因是想查询加【内置查询】前新增的历史数据
  // BUG地址：https://r8ja3mlg7i.feishu.cn/record/RKmBr2TWSe3GuwcDQupcLsZunph
  const ifFilter = field.filter
  // 设置了内置查询
  if (field.insideFilter && !ifQueryEditor && !ifFilter) {
    const inFilter = getQueryFilter(field.insideFilter, field.schema)
    const allValues = { ...(outTable?.editingSchema || {}), ...(getFormState()?.values || {}) }
    for (let key in inFilter) {
      let insideVal = inFilter[key]

      filterObj.search[key] = replaceFieldPlaceholders(insideVal, allValues)
    }
  }
}

// 是否配置了【渲染脚本】
const ifRenderScript = (schema) => {
  if (schema.fieldRenderScript) return true
  let renderScript
  try {
    if (schema.allScript) renderScript = new Function('{ values, record, api, app }', "return " + schema.allScript)({})?.renderVal
  } catch (e) { console.error(e) }
  return !!renderScript
}

// 能走到逻辑的fieldRender
const ifFieldRender = (schema = {}) => {
  if (['attachment', 'attachments', 'datePicker', 'select', 'inputNumber', 'editableTable', 'link', 'map', 'dateRange',
    'area', 'rate', 'textEditor', 'user'].indexOf(schema.fieldType) > -1) {
    return true
  } else if ((schema.config == '日期范围' || schema.config == '文本') && schema.filedFormat) {
    return true
  } else if (schema.textContent === 'password') {
    return true
  } else if (['User', 'Role', 'Department', 'Warning'].indexOf(schema.relateTo) > -1) {
    return true
  } else if (schema.config == '查找引用' || schema.config == '公式' || schema.config == '表单信息') {
    return true
  } else if (['object', 'array'].indexOf(schema.type) > -1 && schema.relate && schema.relate.tableType == 'table') {
    return true
  } else if (ifRenderScript(schema)) { // 配置了渲染脚本
    return true
  }
}

export { useScriptVal, dealFilter, ifFieldRender, ifRenderScript, isPromise }
