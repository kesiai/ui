import React, { useState } from 'react'
import { Input, Button, Modal, Radio, Checkbox, Select, message } from 'antd'
import { C } from 'xadmin-ui'
import { use, app, api } from 'xadmin'
import LanguageType from '../component/LanguageType'
import TableFieldAIBtn from '../../AI/TableFieldAIBtn'
import { TableContext } from '../context'
import FormInfoAIBtn from '../../AI/FormInfoAIBtn'

const temp = _r(`
// 表单提交事件
// values: 表单提交值，取值通过组件ID（标识），例如：values['text-8AE6']
// record: （表格专用）表格内控件所在行，单条数据，例如：record['text-8AE6']
// api: 接口调用方法
// app: xadmin实例
getScriptVal = ({ values, record, }) => {
  return '该字段脚本计算值'
}
// 异步
// getScriptVal = async ({ values, record }) => {
//   let a = await api({}).then(() => {
//     return '该字段脚本计算值'
//   })
//   return a
// }
`)

const scriptTemp = `
  // 【Field Script】(字段脚本)
  // values: The form submission value is determined by the component ID (identifier), for example: values['text-8AE6'] (表单提交值，取值通过组件ID（标识）)
  // record: (Table specific) The row where the control is located in the table contains a single piece of data, for example: record['text-8AE6'] (（表格专用）表格内控件所在行，单条数据)
  // api: Interface calling method (接口调用方法)
  // app: xadmin instance (xadmin实例)
  // getScriptVal: ({ values, record }) => {
  //   return 'This field script calculates the value'
  // },
  // 【Field Script】async (【字段脚本】异步)
  // getScriptVal: async ({ values, record }) => {
  //   let a = await api({}).then(() => {
  //     return 'This field script calculates the value'
  //   })
  //   return a
  // },
`
const scriptTemp2 = `
  // 【Render Script】 (【渲染脚本】)
  // value: Actual value of current field (当前字段实际值)
  // item: The current entire data value (当前整条数据值)
  // api: Interface calling method (接口调用方法)
  // app: xadmin instance (xadmin实例)
  // renderVal: ({ value, item }) => {
  //   return 'This field renders content'
  // },
  // 【Render Script】async (【渲染脚本】异步)
  // renderVal: async ({ value, item }) => {
  //   let a = await api({}).then(() => {
  //     return 'This field renders content'
  //   })
  //   return a
  // },
`

const scriptTemp3 = `
  // 【Validate Script】 (【校验脚本】)
  // validateScript: (value, item) => {
  //   if (value === 'aa') return 'This field cannot be aa'
  //   return null
  // }
})
`

// 多行文本国际化
const _t1Plus = (str, _t1) => {
  let result = ''
  str.split('\n').forEach(s => {
    result += _t1(s.trim()) + '\n'
  })

  return result
}

const FieldScriptInput = ({ input, init, btnStyle }) => {
  const [scriptShow, setScriptShow] = useState(false)
  
  const [code, setCode] = useState(input.value || _t1(init) || _t1(temp))

  const options = {
    roundedSelection: false,
    readOnly: false,
    minimap: { enabled: false },
    cursorStyle: 'line',
    automaticLayout: false,
  }

  const changeScript = val => {
    input.onChange(val)
  }

  const handleOK = () => {
    changeScript(code)
    setScriptShow(false)
  }

  return (<>
    <Button style={btnStyle} onClick={() => setScriptShow(true)} >{_t1('编辑脚本')}</Button>
    <Modal maskClosable={false}
      title={_t1("控件内容")}
      visible={scriptShow}
      onOk={handleOK}
      onCancel={() => setScriptShow(false)}
      width="1200px" >
      <div><FormInfoAIBtn setCode={setCode} /></div>
      <C is="CodeEditor"
        language={'javascript'}
        width="100%"
        height="600"
        options={options}
        value={code}
        docUrl="https://docs.airiot.cn/development-manual/%E5%89%8D%E7%AB%AF%E6%96%87%E6%A1%A3/%E5%B9%B3%E5%8F%B0%E8%84%9A%E6%9C%AC%E4%BB%8B%E7%BB%8D/#%E4%BA%8C%E8%A1%A8%E5%AE%9A%E4%B9%89-%E8%A1%A8%E5%8D%95%E4%BF%A1%E6%81%AF%E6%8E%A7%E4%BB%B6-%E6%8E%A7%E4%BB%B6%E5%86%85%E5%AE%B9"
        onChange={setCode} />
    </Modal>
  </>)
}

const AllScriptInput = ({ input }) => {
  const [scriptShow, setScriptShow] = useState(false)
  
  const { form } = use('form')
  const { tableInfo } = React.useContext(TableContext)

  // 历史数据兼容
  let v
  if (input.value) {
    v = input.value
  } else {
    const formValues = form.getState()?.values
    let v1 = formValues?.fieldScript?.replaceAll('getScriptVal =', 'getScriptVal:') || _t1Plus(scriptTemp, _t1)
    let v2 = formValues?.fieldRenderScript?.replaceAll('renderVal =', 'renderVal:') || _t1Plus(scriptTemp2, _t1)
    v = '({ ' + v1 + v2 + _t1Plus(scriptTemp3, _t1)
  }
  const [code, setCode] = useState(v)

  const options = {
    roundedSelection: false,
    readOnly: false,
    minimap: { enabled: false },
    cursorStyle: 'line',
    automaticLayout: false,
  }

  const changeScript = val => {
    input.onChange(val)
  }

  const handleOK = () => {
    changeScript(code)
    setScriptShow(false)
  }

  return (<>
    <Button onClick={() => setScriptShow(true)} style={input?.value ? {background: '#6F87EE', color: '#fff'} : {}} >
      {input?.value ? _t1('修改脚本'):_t1('编辑脚本')}
    </Button>
    <Modal maskClosable={false}
      title={_t1("默认值脚本")}
      visible={scriptShow}
      onOk={handleOK}
      onCancel={() => setScriptShow(false)}
      width="1200px" >
      <div><TableFieldAIBtn schema={tableInfo?.schema} setCode={setCode} /></div>
      <C is="CodeEditor"
        language={'javascript'}
        width="100%"
        height="600"
        options={options}
        value={code}
        onChange={setCode}
        xadminLibs={true}
        docUrl="https://docs.airiot.cn/development-manual/%E5%89%8D%E7%AB%AF%E6%96%87%E6%A1%A3/%E5%B9%B3%E5%8F%B0%E8%84%9A%E6%9C%AC%E4%BB%8B%E7%BB%8D/#%E4%B8%80%E8%A1%A8%E5%AE%9A%E4%B9%89-%E5%AD%97%E6%AE%B5%E9%AB%98%E7%BA%A7%E9%85%8D%E7%BD%AE-%E8%84%9A%E6%9C%AC%E7%BC%96%E8%BE%91"
      />
    </Modal>
  </>)
}

const WidthSelect = props => {
  const { field, option: { form }, input: { value, onChange }, schema: { enum1, enum_title1 } } = props
  const values = form.getState().values
  // 一行多个时，宽度设置受限
  const disabled = enum1.map(item => {
    if (values.rowKey && item == '24') {
      return true
    } else if (values.rowKey && values.rowKeyCount == 3 && ['6', '16', '18', '24'].indexOf(item) > -1) {
      return true
    } else if (values.rowKey && values.rowKeyCount == 4) {
      return true
    }
    return false
  })
  return (
    <Radio.Group value={value} onChange={onChange}>
      {enum1.map((item, i) => <Radio value={item} disabled={disabled[i]} >{enum_title1[i]}</Radio>)}
    </Radio.Group>
  )
}

const baseConfig = {
  key: {
    title: _r("标识"),
    type: "string",
    description: _r(`标识为存在数据库中唯一标识信息，首位不可为中文、数字,以及特殊字段'model'、'dashboard'`) // 这是简化后的内容，为了国际化能匹配，真实内容在i8n包中
  },
  title: {
    title: _r("标题"),
    type: "string",
    maxLength: 256,
    description: _r('字段在平台中的名称信息'),
    // fieldType: 'languageInput',
    field: {
      component: LanguageType,
      validate: value => {
        if (value && value.trim() === '') return '标题不能为空格'
      }
    },
  },
  description: {
    title: _r("字段说明"),
    type: "string",
    fieldType: 'languageInput'
  },
  descriptionType: {
    title: _r("说明形式"),
    type: "string",
    enum1: ['tooltip', 'below'],
    enum_title1: [_r('图标悬停显示'), _r('控件下方')],
    selectFace: "flatten",
    selectType: 'single'
  },
  need: {
    title: _r("必填"),
    type: "boolean"
  },
  createDisabled: {
    type: 'boolean',
    title: _r('创建时只读')
  },
  editDisabled: {
    type: 'boolean',
    title: _r('修改时只读')
  }
}

const editConfig = {
  unique: {
    title: _r("不允许重复"),
    type: "boolean"
  },
  createShow: {
    title: _r("创建时显示"),
    type: "boolean"
  },
  editShow: {
    title: _r("修改时显示"),
    type: "boolean"
  },
  detailNotShow: {
    title: _r("查看时不显示"),
    type: "boolean"
  },
  listFields: {
    title: _r("列表中显示"),
    type: "boolean"
  },
  editableFields: {
    title: _r("列表中可编辑"),
    type: "boolean"
  },
  batchChangeFields: {
    title: _r("列表页可批量编辑"),
    type: "boolean"
  },
  filterFields: {
    title: _r("过滤查询中显示"),
    type: "boolean"
  },
  filterByRes: {
    title: _r("过滤项筛选去重"),
    type: "boolean",
    description: _r('开启后当前字段作为过滤条件时，下拉列表的内容去重显示记录列表中已有的字段值'),
    field: {
      data: { display: false }
    }
  },
  canOrder: {
    title: _r("开启排序"),
    type: "boolean"
  },
  allScript: {
    title: _r('脚本编辑'),
    type: 'string',
    permissionType: 'script',
    field: {
      component: AllScriptInput
    }
  },
  widthInForm: {
    type: 'string',
    title: _r('宽度'),
    enum1: ['6', '8', '12', '16', '18', '24'],
    enum_title1: ['1/4', '1/3', '1/2', '2/3', '3/4', '1'],
    field: {
      initialValue: '24',
      component: WidthSelect
    }
  },
  size: {
    type: 'string',
    title: _r('尺寸'),
    enum1: ['large', 'middle', 'small'],
    enum_title1: ['大', '中', '小'],
    selectFace: "flatten",
    selectType: 'single',
    field: {
      initialValue: 'middle'
    }
  },
  tableFixed: {
    title: _r("列固定"),
    type: "boolean"
  }
}

const validate = (value, field) => {
  const str = value && value.substr(value.length - 2)
  const firstStr = value && value.slice(0, 1)
  if (!str) {
    return _r('标识不能为空')
  } else if (str == 'Id') {
    return _r('标识最后两位不可为字母Id')
  } else if (/[0-9\_\$]/.test(firstStr)) {
    return _r('首位不可为数字_$')
  } else if (/[\u4e00-\u9fa5]/.test(firstStr)) {
    return _r('首位不可为中文')
  } else if (value.indexOf(' ') > -1) {
    return _r('标识不可存在空格')
  } else if (/^[0-9]+$/.test(value)) {
    return _r('标识不可为纯数字')
  } else if (['ID', 'iD', 'Id'].indexOf(value) > -1) {
    return _r('标识不可为ID,iD,Id')
  } else if (value === 'id' && field?.config !== '文本') {
    return _r('只有文本的标识可为id')
  } else if (['.', '$', '@', '%', '^', '&', '*', '(', ')', '=', '+', '{', '}'].find(c => value.indexOf(c) > -1)) {
    return _r('标识不可存在.$@%^&*()=+{}字符')
  } else if (['[', ']', ':', ';', `'`, '"', '<', '>', ',', '?', '/', '|', '\\'].find(c => value.indexOf(c) > -1)) {
    return _r(`标识不可存在[]:;'"<>,?/|\\字符`)
  } else {
    return null
  }
}

const keyForm = {
  key: 'key',
  validate: validate,
  component: ({ input }) => {
    const [val, setVal] = React.useState(input.value)
    if (validate(val)) input.onChange(val)
    return <Input value={val} onChange={e => setVal(e.target.value)} onBlur={() => input.onChange(val)} />
  }
}

const commonFormEffect = form => {
  const v = form.getState().values
  setTimeout(() => {
    form.setFieldData('batchChangeFields', { display: !(v?.disabled || v?.unique) })
  })
  form.useField('disabled', state => {
    form.setFieldData('editableFields', { display: !state.value })
    form.setFieldData('batchChangeFields', { display: !state.value })
    state.value && form.change('editableFields', false)
    state.value && form.change('batchChangeFields', false)
  })
  form.useField('unique', state => {
    form.setFieldData('batchChangeFields', { display: !state.value })
    state.value && form.change('batchChangeFields', false)
  })
}

const metricStore = {
  title: _r("存储历史数据"),
  type: "boolean",
  field: {
    effect: ({ value }, form) => {
      if (value) {
        const fieldKey = form.getFieldState('key')?.value
        const tableId = window.location.hash.split('table/')?.[1]?.split('/edit')?.[0]
        api({ name: 'core/t/schema' }).get(tableId).then(res => {
          const p = res?.schema?.properties || {} // 表定义中字段生成的数据点
          const schemaTags = Object.keys(p)?.filter(key => p[key]?.metricStore)

          api({ name: 'core/t/schema/tag' }).get(tableId).then(({ tags = [] }) => {
            if (tags.find(tag => tag.id === fieldKey) && schemaTags.indexOf(fieldKey) === -1) { // 字段标识和数据点标识重复时，不可以配置存储历史数据，后端会死循环
              message.warning(_t1('该字段和数据点标识重复，不可设置存储历史数据'))
              form.change('metricStore', false)
            }
          })
        })
      }
    }
  }
}

export {
  baseConfig,
  editConfig,
  keyForm,
  metricStore,
  validate,
  commonFormEffect,
  FieldScriptInput
}