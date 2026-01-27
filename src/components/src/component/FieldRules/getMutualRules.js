import React from 'react'
import { C } from 'xadmin-ui'
import { message } from 'antd';
import _ from 'lodash'
import { use, app } from 'xadmin'
import { FieldGroup, FormLayout, NodeFormLayout } from './components'

// 字段新增的创建时显示，编辑时显示功能生效
const createEditShow = (form, table) => {
  if (form.getState().values?.id) { // 编辑时
    for (let key in table.schema.properties) {
      const field = table.schema.properties[key]
      if (field?.config === '用户') { // 用户字段，admin用户登陆时，可以修改
        const ifAdmin = app.context?.user?.userId === 'admin'
        setTimeout(() => {
          form.setFieldData(key, { display: ifAdmin || field.editShow })
        }, 100)
        if (!ifAdmin && key === 'modifyUser')  {
          form.change(key, undefined)
        }
      } else {
        if (field.editShow === false) {
          form.setFieldData(key, { display: false, required: false })
        }
      }
    }
  } else { // 新建时
    for (let key in table.schema.properties) {
      const field = table.schema.properties[key]
      if (field?.config === '用户') { // 用户字段，admin用户登陆时，可以修改
        const ifAdmin = app.context?.user?.userId === 'admin'
        setTimeout(() => {
          form.setFieldData(key, { display: ifAdmin || field.createShow })
        }, 100)
        if (!ifAdmin && key === 'modifyUser')  {
          form.change(key, undefined)
        }
      } else if (field.createShow === false) {
        form.setFieldData(key, { display: false, required: false })
      }
    }
  }
}

// 值是公式编辑器，涉及到其他字段
const dealValue = (val, item) => {
  let str = val.stringify.replaceAll(/\{\{[^.$@%^&*()=+{}]+\}\}/g, val => {
    let field = val.substring(2, val.length - 2)
    let v = item?.[field]
    if (_.isString(v)) {
      return `"${v}"`
    } else if (_.isObject(v) || _.isArray(v)) {
      return '(' + JSON.stringify(v) + ')'
    } else if (_.isBoolean(v)) {
      return v ? 'true' : 'false'
    } else if (_.isNumber(v)) {
      return v.toString()
    } else {
      return v
    }
  })
  let result
  try {
    result = new Function(`return ${str};`)()
  } catch (e) {
    console.error('字段规则错误', e)
  }
  return result
}

const FormContext = React.createContext({})

const editorTableValidate = (tempVal, item, editTableErrors) => {
  // 校验表格数据
  let repeatField = []
  tempVal.length > 1 && item.uniqueRow && item.uniqueFields && _.map(item.uniqueFields, key => {
    const arr1 = _.filter(tempVal, v => v[key])?.map(v => ({ [key]: v[key]?.id || JSON.stringify(v[key]) }))
    const arr2 = _.unionBy(arr1, key)
    if (arr1.length != arr2.length) {
      repeatField = [...repeatField, item.tableFields?.properties[key]?.title]
    }
  })
  let errorList = []
  if (!_.isEmpty(repeatField)) {
    errorList.push(`${_t1('{{f}}中字段【{{repeatField}}】存在重复项', { f: item.title, repeatField: repeatField?.join('、') })}`)
  } 
  const error = editTableErrors?.[item.key]
  if (_.compact(error).length) {
    const tableErrs = _.compact(error.map((err, index) => {
      if (!err) return
      const msg = _.map(err, e => e)?.join('、')
      return `${_t1('{{f}}第{{index}}条记录中{{msg}}', { f: item.title, index: index + 1, msg })}`
    }))
    errorList = errorList.concat(tableErrs)
  }
  if (item.minCount && tempVal.length < item.minCount) {
    errorList.push(_t1('{{title}}当前记录数小于最小记录数', { title: item.title }))
  } else if (item.maxCount && tempVal.length > item.maxCount) {
    errorList.push(_t1('{{title}}当前记录数大于最大记录数', { title: item.title }))
  }
  return errorList
}

// 内容国际化生效
const getLang = (item, key) => {
  const lang = app.context.language
  if (lang && lang !== 'zh_Hans') {
    return item[key + '_' + lang] || item[key]
  } else {
    return item[key]
  }
}

// 解析条件3，返回true/false
const getOneResult = (oneC, val) => {
  let fieldVal = oneC.value
  if (oneC.value?.origin && oneC.value?.stringify) { // 值是公式编辑器，涉及到其他字段
    fieldVal = dealValue(oneC.value, val)
  }
  if (oneC.method === 'eq') {   // 是、等于
    if (_.isArray(fieldVal)) { // 新版文本
      return fieldVal.indexOf(val[oneC.field]) > -1
    } else {
      // 如果是对象（关联字段）
      let val1 = _.isObject(val[oneC.field]) ? val[oneC.field]?.id : val[oneC.field]
      let val2 = _.isObject(fieldVal) ? fieldVal?.id : fieldVal
      return val1 === val2
    }
  } else if (oneC.method === 'ne') {   // 不是、不等于
    // 如果是数组（文本）
    if (_.isArray(fieldVal)) {
      return fieldVal.indexOf(val[oneC.field]) === -1
    }
    // 如果是对象（关联字段）
    let val1 = _.isObject(val[oneC.field]) ? val[oneC.field]?.id : val[oneC.field]
    let val2 = _.isObject(fieldVal) ? fieldVal?.id : fieldVal
    return val1 !== val2
  } else if (oneC.method === 'isNull') {   // 为空
    return !val[oneC.field]
  } else if (oneC.method === 'notNull') {   // 不为空
    return !!val[oneC.field]
  } else if (oneC.method === 'in') {   // 包含（选择器/关联字段，单选）
    if (fieldVal?.in) { // 关联字段（组件返回值结构不同）
      return fieldVal.in.indexOf(val[oneC.field]?.id) > -1
    } else { // 选择器
      return fieldVal && fieldVal.indexOf(val[oneC.field]) > -1
    }
  } else if (oneC.method === 'nin') {   // 不包含（选择器/关联字段，单选）
    if (fieldVal?.in) { // 关联字段（组件返回值结构不同）
      return fieldVal.in.indexOf(val[oneC.field]?.id) === -1
    } else { // 选择器
      return fieldVal && fieldVal.indexOf(val[oneC.field]) === -1
    }
  } else if (oneC.method === 'range' && fieldVal) {   // 在范围内
    return (val[oneC.field] >= fieldVal.gte && val[oneC.field] <= fieldVal.lte)
  } else if (oneC.method === 'notRange' && fieldVal) {   // 不在范围内
    return !(val[oneC.field] >= fieldVal.gte && val[oneC.field] <= fieldVal.lte)
  } else if (oneC.method === 'gt') {   // 大于（仅数字类型）
    return val[oneC.field] > fieldVal
  } else if (oneC.method === 'lt') {   // 小于（仅数字类型）
    return val[oneC.field] < fieldVal
  } else if (oneC.method === 'gte') {   // 大于等于（仅数字类型）
    return val[oneC.field] >= fieldVal
  } else if (oneC.method === 'lte') {   // 小于等于（仅数字类型）
    return val[oneC.field] <= fieldVal
  } else if (oneC.method === 'contains') {   // 包含（字符串）
    return val[oneC.field] && val[oneC.field].indexOf(fieldVal) > -1
  } else if (oneC.method === 'notContains') {   // 不包含（字符串）
    return val[oneC.field] && val[oneC.field].indexOf(fieldVal) === -1
  } else if (oneC.method === 'startsWith') {   // 开始为（字符串）
    if (_.isArray(fieldVal)) { // 新版文本
      return !!fieldVal.find(str => val[oneC.field] && val[oneC.field].startsWith(str))
    } else {
      return val[oneC.field] && val[oneC.field].startsWith(fieldVal)
    }
  } else if (oneC.method === 'endsWith') {   // 结尾为（字符串）
    if (_.isArray(fieldVal)) { // 新版文本
      return !!fieldVal.find(str => val[oneC.field] && val[oneC.field].endsWith(str))
    } else {
      return val[oneC.field] && val[oneC.field].endsWith(fieldVal)
    }
  } else if (oneC.method === 'arrayIn') { // 包含任何一个（字符串）
    return !!fieldVal?.find(str => val[oneC.field] && val[oneC.field].indexOf(str) > -1)
  } else if (oneC.method === 'arrayNin') { // 不包含任何一个（字符串）
    return !fieldVal?.find(str => val[oneC.field] && val[oneC.field].indexOf(str) > -1)
  } else if (oneC.method === 'notStartsWith') { // 开始不是（字符串）
    return !fieldVal.find(str => val[oneC.field] && val[oneC.field].startsWith(str))
  } else if (oneC.method === 'notEndsWith') { // 结尾不是（字符串）
    return !fieldVal.find(str => val[oneC.field] && val[oneC.field].endsWith(str))
  }
}

// 解析条件2，返回true/false
const getResult = (condition, values) => {
  if (condition && condition.length > 0) { // 内围与逻辑
    return condition.map(item => getOneResult(item, values)).every(item => item === true)
  } else { // 值变化时，有可能会传入空条件
    return true
  }
}

// 解析条件1，返回true/false
const dealCondition = (condition, values) => {
  if (condition && condition.length > 0) { // 外围或逻辑
    return condition.map(item => getResult(item, values)).some(item => item === true)
  }
}

// 生成一条 action (字段下方提示红字)
const getOneError = (item, values, errors, path) => {
  let result = { ...errors }
  if (path && path.indexOf('[i]') > -1) { // path解析出数组，（指令用）
    let listVal = values?.[path.split('[i]')?.[0]]
    if (listVal) {
      listVal.forEach((val, index) => {
        if (dealCondition(item.condition, val)) {
          if (item.noticeList && item.noticeList.length > 0) {
            // validate 需要返回层级的error，如:{ arr: [{ text: '不能为空' }] }
            let name = path.split('[i]')[0]
            if (!result[name]) result[name] = []
            if (!result[name][index]) result[name][index] = {}
            item.noticeList.forEach(item2 => {
              result[name][index][item2.field] = getLang(item2, 'message')
            })
          }
        }
      })
    }
  } else {
    if (dealCondition(item.condition, values)) {
      if (item.noticeList && item.noticeList.length > 0) {
        item.noticeList.forEach(item2 => {
          result[item2.field] = getLang(item2, 'message')
        })
      }
    }
  }
  return result
}

const getErrorMessage = (error, val) => {
  let result = []
  let messageNotice = error.filter(item => item.noticeType === 'message')
  messageNotice.forEach(item => {
    const error = getOneError2(item, val)
    result = error ? [...result, error] : result
  })
  return result
}

/**
 * 工作表错误提示
 */
const getErrorNotice = (table) => (props) => {
  const eN = table.fieldRules?.errorNotice
  
  const editTableErrors = React.useRef({})

  // 字段下方提示红字
  const validate = async (values) => {
    let errors = {}
    if (eN && eN.length > 0) {
      let redTextNotice = eN.filter(item => !item.noticeType || item.noticeType === 'redText')
      redTextNotice.forEach(item => {
        errors = getOneError(item, values, errors)
      })
    }
    // 校验表格重复数据
    await new Promise((resolve) => setTimeout(resolve, 0)) // 延迟一点，validate触发时，dom还没隐藏
    table.schema?.properties && _.map(table.schema.properties, item => {
      const tempVal = values[item.key] || item.defaultVal || []
      if (item.fieldType == 'editableTable') {
        const ifHidden = !document.getElementById('EditTable-' + item.key) // 判断表格组件是否隐藏
        if (ifHidden) return
        const errorList = editorTableValidate(tempVal, item, editTableErrors.current)
        if (errorList.length) errors = { ...errors, [item.key]: errorList }
      }
    })
    return errors
  }

  const TableFormLayout = p => {
    const { inModal } = props?.inModal || use('table.modal.ctx')
    const { setTableErrors } = p

    const CustomFormLayout = props?.customFormLayout
    if(props?.customFormLayout) {
      return  <FormContext.Provider value={{ setTableErrors }} >
        {props.id ? <FormLayout {...p} inModal={inModal} /> : <CustomFormLayout {...props} {...p} inModal={inModal} />}
      </FormContext.Provider>
    }
    return (
      <FormContext.Provider value={{ setTableErrors }} >
        {props.id ? <FormLayout {...p} inModal={inModal} /> : <NodeFormLayout {...props} {...p} inModal={inModal} getErrorMessage={getErrorMessage} />}
      </FormContext.Provider>
    )
  }
  
  const setTableErrors = ({ errors, path, isDelete, deleteIndex }) => {
    if (isDelete) {
      _.remove(_.get(editTableErrors.current, path), (n, i) => i === deleteIndex)
    } else if (_.isEmpty(errors)) {
      _.set(editTableErrors.current, path, null)
    } else {
      _.set(editTableErrors.current, path, errors)
    }
  }

  return <C
    is="Model.DataForm"
    {...props}
    noGroups
    validate={validate}
    group={FieldGroup}
    component={props => <TableFormLayout {...props} setTableErrors={setTableErrors} />}
  />
}

// 生成一条 action (页面上方弹窗提示)
const getOneError2 = (item, values, path) => {
  let result = ''
  if (path && path.indexOf('[i]') > -1) { // path解析出数组，（指令用）
    let listVal = values?.[path.split('[i]')?.[0]]
    if (listVal) {
      listVal.forEach((val, index) => {
        if (dealCondition(item.condition, val)) {
          if (getLang(item, 'messageInfo')) {
            result = _t1('对象') + (index + 1) + _t1('的') + getLang(item, 'messageInfo')
          }
        }
      })
    }
  } else {
    if (dealCondition(item.condition, values)) {
      if (getLang(item, 'messageInfo')) {
        result = getLang(item, 'messageInfo')
      }
    }
  }
  return result
}

/**
 * 错误提示，仅返回校验函数，不返回 Form，（目前仅用于模型命令，dashboard 项目）
 */
const getErrorNotice2 = (table, path, editTableErrors) => {
  const eN = table.fieldRules?.errorNotice
  const validate = async (values) => {
    let errors = {}
    if (eN && eN.length > 0) {
      let redTextNotice = eN.filter(item => !item.noticeType || item.noticeType === 'redText')
      redTextNotice.forEach(item => {
        errors = getOneError(item, values, errors, path)
      })
    }
    // 校验表格重复数据
    await new Promise((resolve) => setTimeout(resolve, 0)) // 延迟一点，validate触发时，dom还没隐藏
    table.schema?.properties && _.map(table.schema.properties, item => {
      const tempVal = values[item.key] || item.defaultVal || []
      if (item.config == '表格') {
        const ifHidden = !document.getElementById('EditTable-' + item.key) // 判断表格组件是否隐藏
        if (ifHidden) return
        const errorList = editorTableValidate(tempVal, item, editTableErrors)
        if (errorList.length) errors = { ...errors, [item.key]: errorList }
      }
    })
    return errors
  }
  const getValidateResult = (val) => {
    let result = ''
    if (eN && eN.length > 0) {
      let messageNotice = eN.filter(item => item.noticeType === 'message')
      messageNotice.forEach(item => {
        result = getOneError2(item, val, path)
      })
    }
    if (result) {
      message.error(result)
      return
    }
    return true
  }
  return { validate, getValidateResult }
}

// 解析执行动作
const dealAction = (action, form, path = '', table) => {
  if (action && action.length > 0) {
    action.forEach(item => {
      if (item?.type === 'script') { // 执行脚本
        try {
          const f = new Function('form', 'table', 'path', 'action', item.script)
          f(form, table, path, action)
        } catch (e) {
          console.error(e)
        }
      } else if (item?.type === 'setRequire') { // 设为必填
        item?.field?.forEach(f => {
          form.setFieldData(path + f, { required: true })
        })
      } else if (item?.type === 'setDisabled' || item?.type === 'setAllDisabled') { // 设为只读
        item?.field?.forEach(f => {
          form.setFieldData(path + f, { disabled: true })
        })
      } else if (item?.type === 'canEdit') { // 设为可编辑
        item?.field?.forEach(f => {
          form.setFieldData(path + f, { disabled: false })
        })
      } else if (item?.type === 'setValue') { // 设置字段值
        form.change(path + item.field, item.value)
      } else if (_.isArray(item?.field)) { // 新版 field 数组
        item?.field?.forEach(f => {
          form.setFieldData(path + f, {
            display: item.type === 'show',
            required: item.type === 'show' ? table?.schema?.properties?.[item.field]?.need : false
          })
          if (item.type !== "show") {
            form.change(path + f, undefined)
          }
        })
      } else { // 旧数据
        form.setFieldData(path + item.field, {
          display: item.type === 'show',
          required: item.type === 'show' ? table?.schema?.properties?.[item.field]?.need : false
        })
        if (item.type !== "show") {
          form.change(path + item.field, undefined)
        }
      }
    })
  }
}

// 根据json，生成单条规则
const getOneRule = (item, form, values, path, table) => {
  if (path && path.indexOf('[i]') > -1) { // path解析出数组，（指令用）
    let listVal = values?.[path.split('[i]')?.[0]]
    if (listVal) {
      listVal.forEach((val, index) => {
        if (dealCondition(item.condition, val)) {
          dealAction(item.action, form, path.replace('[i]', `[${index}]`), table)
        }
      })
    }
  } else {
    if (dealCondition(item.condition, values)) {
      dealAction(item.action, form, '', table)
    }
  }
}

/**
 * 工作表字段规则处理逻辑
 */
const getMutualRules = (table, path) => (form, jump) => {
  // 为了实现【字段规则】动态控制字段的必填
  _.values(table.schema?.properties || {}).forEach(field => {
    if (field.need) {
      form.setFieldData((path || '') + field.key, { required: true })
    }
  })

  // jump 跳过表定义中配置的，创建时显示，编辑时显示逻辑
  !jump && createEditShow(form, table) // 字段新增的创建时显示，编辑时显示功能生效

  const mR = table.fieldRules?.mutualRules?.filter(m => !m.disabled)
  if (mR && mR.length > 0) {
    // 第一步：把所有的规则遍历一遍，并且通过【或】分割成若干部分，比如上面的例子，两个规则，分割成4个部分，
    // 第二步：再从这四个部分中去除涉及到值变化的部分，剩下不涉及到值变化的放到form.useEffect中
    // 第三步：涉及到值变化的，通过值变化的字段分组，比如：字段1值变化有1个，字段2值变化有3个
    // 第四步：分完组的分别放到对应字段的useField里，用forEach遍历执行
    let useFieldMR = {}, formEffectMR = []
    mR.forEach(mmR => { // 分拣
      if (mmR?.condition?.length > 0) {
        mmR.condition.forEach(mmmR => {
          let fieldKey = mmmR.find(mmmmR => mmmmR.method === 'onchange')?.field
          if (fieldKey) { // 如果涉及到值变化
            if (useFieldMR?.[fieldKey]) {
              useFieldMR[fieldKey].push({
                action: mmR.action,
                condition: [mmmR]
              })
            } else {
              useFieldMR[fieldKey] = [{
                action: mmR.action,
                condition: [mmmR]
              }]
            }
          } else {
            formEffectMR.push({
              action: mmR.action,
              condition: [mmmR]
            })
          }
        })
      }
    })
    // 涉及到值变化的，用 useField
    if (!_.isEmpty(useFieldMR)) {
      let fieldKeys = Object.keys(useFieldMR)
      fieldKeys.forEach(key => {
        form.useField(key, (state, a, b) => {
          if (!form.getFieldState(key)?.modified) return // 一上来不执行值变化，手动修改后再执行
          let values = form.getState().values
          useFieldMR[key].forEach(oneMR => {
            const delOnChange = {
              action: oneMR.action,
              condition: [oneMR.condition[0].filter(o => o.method !== 'onchange')]
            }
            getOneRule(delOnChange, form, values, path, table)
          })
        })
      })
    }
    // 没涉及到值变化的，用 useEffect
    if (!_.isEmpty(formEffectMR)) {
      form.useEffect(({ values }) => {
        formEffectMR.forEach(item => {
          getOneRule(item, form, values, path, table)
        })
      }, ['values'])
    }
  }
}

export { getMutualRules, getErrorNotice, getOneError, getErrorNotice2, getErrorMessage, FormContext }
