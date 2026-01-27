import React from 'react'
import { use } from 'xadmin'
import { C } from 'xadmin-ui'
import { Input } from 'antd'
import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput } from './common'
import { LogicInput } from './formula'
import { uuid } from '../utils3'
import DateComponent from '../../../fieldComponent/DateComponent'
import DVContainer from '../component/DefaultValContainer'

const KeyComponent = ({ input }) => {
  const [val, setVal] = React.useState(input.value)
  const [disabled, setDisabled] = React.useState(false)
  const { form } = use('form')
  React.useEffect(() => {
    form.useField('dateType', ({ value }) => {
      if (value) {
        setDisabled(true)
        input.onChange(value)
      } else {
        setDisabled(false)
        if (['createTime', 'modifyTime'].indexOf(input.value) > -1) {
          input.onChange('date-' + uuid(4, 16))
        }
      }
    })
  }, [])
  return <Input value={val} disabled={disabled} onChange={e => setVal(e.target.value)} onBlur={() => input.onChange(val)} />
}

const DefaultDate = (props) => {
  const { form } = use('form')
  const [sch, setSch] = React.useState({})

  React.useEffect(() => {
    form.useEffect(({ values }) => {
      setSch(values)
    })
  }, [])

  return <DateComponent {...props} style={{ width: '100%' }} field={{ ...props.field, schema: _.omit(sch, ['disabled', 'createDisabled', 'editDisabled']) }} />
}

const filterObj = {
  filterMode: {
    title: _r('过滤模式'),
    type: "string",
    enum: ['date', 'dateRange'],
    enum_title: [_r('日期'), _r('日期范围')],
    description: _r('用于设置日期过滤器是按单个日期筛选，还是按一个日期区间范围进行筛选')
  },
  filterFormat: {
    title: _r('格式'),
    type: "string",
    enum1: ['ym', 'date', 'datetime', 'ymdh'],
    enum_title1: [_r('年月'), _r('年月日'), _r('年月日-时分秒'), _r('年月日-时')],
    field: {
      allowClear: false
    }
  }
}
const commonProperties = _.reduce(editConfig, (p, c, k) => {
  if (k == 'filterByRes') {
    return { ...p, ...filterObj, [k]: c }
  }
  return { ...p, [k]: c }
}, {})

const DateSchema = {
  type: "object",
  name: _r("日期"),
  title: _r("日期"),
  description: _r('选择日期时间，可定义日期格式'),
  icon: "inbox",
  key: "date",
  properties: {
    ...baseConfig,
    textContent: {
      title: _r("内容"),
      type: "string",
      enum: ['origin', 'logic'],
      enum_title: [_r('日期'), _r('公式计算')],
      field: {
        effect: ({ value }, form) => {
          setTimeout(() => {
            const display = value === 'logic'
            form.setFieldData('jsLogic', { display })
            form.setFieldData('createForm', { display: !display })
            form.setFieldData('format', { display: !display })
            form.setFieldData('editableFields', { display: !display })
            form.setFieldData('batchChangeFields', { display: !display })
            // form.setFieldData('disabled', { display: !display })
          })
        }
      }
    },
    jsLogic: {
      title: _r('公式'),
      type: 'string',
      permissionType: 'script',
      field: {
        component: LogicInput
      }
    },
    createForm: {
      title: _r("添加形式"),
      type: "string",
      enum1: ['create', 'autoCreate'],
      enum_title1: [_r('添加时间'), _r('自动生成')],
      selectFace: "flatten",
      selectType: 'single'
    },
    dateType: {
      title: _r("类型"),
      type: "string",
      enum1: ['createTime', 'modifyTime'],
      enum_title1: [_r('创建时间'), _r('修改时间')],
      selectFace: "flatten",
      selectType: 'single'
    },
    format: { // 此字段名不可改，后端接口会用
      title: _r("格式"),
      type: "string",
      enum1: ['ym', 'date', 'datetime', 'ymdh'],
      enum_title1: [_r('年月'), _r('年月日'), _r('年月日-时分秒'), _r('年月日-时')],
      field: {
        allowClear: false
      }
    },
    filedFormat: {
      title: _t1('格式化'),
      type: 'string',
      field: {
        component: props => <C is='Common.DateFormat' {...props} placeholder={_t1('列表中显示格式')} />,
      }
    },
    defaultVal: {
      title: _r("默认值"),
      type: "string",
      field: {
        component: (props) => <DVContainer><DefaultDate {...props} /></DVContainer>
      }
    },
    afterNow: {
      title: _r('晚于当前时间'),
      type: "boolean"
    },
    ...commonProperties
  },
  required: ["title", "key"],
  form: [
    { ...keyForm, component: KeyComponent },
    "title", "textContent", "jsLogic", 'createForm', "dateType", "format", 'filedFormat', 'defaultVal', 'afterNow', '*'
  ],
  formEffect: form => {
    form.useField('createForm', (state) => {
      form.setFieldData('format', { display: state.value !== 'autoCreate' }),
        form.setFieldData('need', { display: state.value !== 'autoCreate' }),
        form.setFieldData('editableFields', { display: state.value !== 'autoCreate' })
      form.setFieldData('batchChangeFields', { display: state.value !== 'autoCreate' })
      // form.setFieldData('disabled', { display: state.value !== 'autoCreate' })
      form.setFieldData('dateType', { display: state.value === 'autoCreate' })
      if (!form.getState().dirty) return
      if (state.value == 'autoCreate') {
        form.change('format', 'datetime')
        form.change('need', false)
        form.change('editableFields', false)
        form.change('batchChangeFields', false)
        // form.change('disabled', true)
        form.change('createShow', false)
        form.change('editShow', false)
        if (!form.getFieldState('dateType').value) {
          form.change('dateType', 'createTime')
        }
      } else {
        // form.change('disabled', false)
        form.change('dateType', null)
        form.change('createShow', true)
        form.change('editShow', true)
      }
    })
    form.useField('filterFields', state => {
      const filterMode = form.getState().values?.filterMode
      form.setFieldData('filterMode', { display: !!state.value })
      form.setFieldData('filterFormat', { display: !!state.value && filterMode == 'date' })
    })
    form.useField('filterMode', state => {
      form.setFieldData('filterFormat', { display: state.value == 'date' })
    })
    commonFormEffect(form)
  }
}

export default DateSchema