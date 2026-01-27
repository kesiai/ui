import React from 'react'
import _ from 'lodash'
import { use } from 'xadmin'
import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput } from './common'
import { TableFieldSelect, InsideFilter } from '../component/referenceComponents'
import { Select } from 'antd'

const ComputeMethod = ({ input }) => {
  const { form } = use('form')
  const [ops, setOps] = React.useState([])
  React.useEffect(() => {
    form.useField('searchRelate', ({ value }) => {
      let config = value?.field?.fieldSchema?.config
      if (config === '数字' || (config === '选择器' && value?.field?.fieldSchema?.dataType === 'number')) {
        setOps([
          { value: '', label: _t1('原值') },
          { value: 'sum', label: _t1('求和') },
          { value: 'count', label: _t1('计数') },
          { value: 'distinct', label: _t1('去重') },
          { value: 'distinctCount', label: _t1('去重计数') },
          { value: 'mean', label: _t1('平均值') },
          { value: 'max', label: _t1('最大值') },
          { value: 'min', label: _t1('最小值') }
        ])
      } else if (['附件', '附件组', '表格', '星级评价', '富文本'].indexOf(config) > -1) {
        setOps([
          { value: '', label: _t1('原值') },
          { value: 'count', label: _t1('计数') }
        ])
      } else {
        setOps([
          { value: '', label: _t1('原值') },
          { value: 'count', label: _t1('计数') },
          { value: 'distinct', label: _t1('去重') },
          { value: 'distinctCount', label: _t1('去重计数') }
        ])
      }
    })
  }, [])
  return <Select {...input} options={ops} />
}

const NumberFormat = ({ input }) => {
  const { form } = use('form')
  const [ops, setOps] = React.useState([])
  React.useEffect(() => {
    form.useField('searchRelate', ({ value }) => {
      let config = value?.field?.fieldSchema?.config
      if (config === '数字' || (config === '选择器' && value?.field?.fieldSchema?.dataType === 'number')) {
        setOps([
          { value: 'int', label: _t1('整数') },
          { value: 'float1', label: _t1('保留1位小数') },
          { value: 'float2', label: _t1('保留2位小数') },
          { value: '%', label: _t1('百分比') },
          { value: '%2', label: _t1('百分比（小数点）') },
          { value: 'YYYY/MM/DD', label: '2023/6/30' },
          { value: 'YYYY/MM/DD HH:mm', label: '2023/6/30 14:00' },
          { value: 'YYYY-MM-DD', label: '2023-6-30' },
          { value: 'YYYY-MM-DD HH:mm', label: '2023-6-30 14:00' },
          { value: 'MM-DD', label: '6-30' },
          { value: 'MM/DD/YYYY', label: '6/30/2023' },
          { value: 'DD/MM/YYYY', label: '30/6/2023' }
        ])
      } else if (['时间', '时间2', '日期范围'].indexOf(config) > -1) {
        setOps([
          { value: 'YYYY/MM/DD', label: '2023/6/30' },
          { value: 'YYYY/MM/DD HH:mm', label: '2023/6/30 14:00' },
          { value: 'YYYY-MM-DD', label: '2023-6-30' },
          { value: 'YYYY-MM-DD HH:mm', label: '2023-6-30 14:00' },
          { value: 'MM-DD', label: '6-30' },
          { value: 'MM/DD/YYYY', label: '6/30/2023' },
          { value: 'DD/MM/YYYY', label: '30/6/2023' }
        ])
      }
    })
  }, [])
  return <Select {...input} options={ops} />
}

// 查找引用使用queryEditor，后端解析逻辑和前端不同，特殊处理
const schemaFormat = (schema) => {
  let result = _.cloneDeep(schema)
  Object.keys(schema?.properties || {}).forEach(key => {
    let p = result.properties[key]
    if (p.config === '关联字段' && p.type === 'array') { // 关联字段多选
      p.filterMethodFn = (methods = []) => {
        return [
          {name: _t1('包含'), key: 'in', type: 'multipleSelect'},
          {name: _t1('不包含'), key: 'nin', type: 'multipleSelect'},
          methods[2],
          methods[3]
        ]
      }
    }
  })
  return result
}

const ReferenceSchema = {
  type: 'object',
  name: _r('查找引用'),
  title: _r('查找引用'),
  description:_r("在数据表中查找数据，并在其他表中引用这些数据，以便进行跨数据表的查询、筛选和统计分析"),
  icon: 'inbox',
  key: 'relate-table',
  properties: {
    ...baseConfig,
    searchRelate: {
      title: _r('引用字段'),
      type: 'object',
      properties: {},
      field: {
        effect: (f, form) => {
          const fschema = f.value?.field?.fieldSchema
          setTimeout(() => {
            if (['数字', '时间', '时间2', '日期范围'].indexOf(fschema?.config) > -1 ||
            (fschema?.config === '选择器' && fschema?.dataType === 'number')) {
            form.setFieldData('numberFormat', { display: true })
          } else {
            form.setFieldData('numberFormat', { display: false })
            form.change('numberFormat', null)
          }
          })
        }
      }
    },
    searchCondition: {
      title: _r('查询条件'),
      type: 'array',
      items: {}
    },
    computeMethod: {
      title: _r('计算方式'),
      type: 'string',
      field: {
        component: ComputeMethod
      }
    },
    numberFormat: {
      title: _r('数字格式'),
      type: 'string',
      field: {
        component: NumberFormat
      },
      enum: ['int', 'float1', 'float2', '%', '%2', 'YYYY/MM/DD', 'YYYY/MM/DD HH:mm', 'YYYY-MM-DD',
        'YYYY-MM-DD HH:mm', 'MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY' ],
      enum_title: ['整数', '保留1位小数', '保留2位小数', '百分比', '百分比（小数点）', '2023/6/30',
        '2023/6/30 14:00', '2023-6-30', '2023-6-30 14:00', '6-30', '6/30/2023', '30/6/2023']
    },
    numberLimit: {
      title: _r('显示条数'),
      type: 'number',
    },
    sort: {
      title: _r('排序'),
      type: 'string',
      enum: ['asc', 'desc', 'none'],
      enum_title: [_r('正序'), _r('倒序'), _r('无')]
    },
    ...editConfig
  },
  required: ['title', 'key', 'searchRelate'],
  form: [keyForm, 'title',
    {
      key: 'searchRelate',
      component: props => React.useMemo(() => <TableFieldSelect {...props} />, []),
      validate: value => {
        if (JSON.stringify(value) === '{}') { // 必填初始化报错
          return _t1('表名不能为空')
        } else if (_.isEmpty(value?.field)) {
          return _t1('字段不能为空')
        } else {
          return null
        }
      }
    },
    { key: 'searchCondition', component: props => <InsideFilter {...props} schemaFormat={schemaFormat} /> },
    'computeMethod', 'numberFormat',
    'numberLimit', 'sort', 'widthInForm', 'listFields', 'createShow', 'editShow', 'detailNotShow'
  ],
  formEffect: (form) => {
    let initialValues = form.getState().initialValues
    // form.useField('filterFields', state => {
    //   form.setFieldData('filterByRes', { display: !!state.value })
    // })
    form.useField('searchRelate', state => {
      if (initialValues.searchRelate?.id !== state.value?.id) {
        form.change('searchCondition', [])
      }
      form.setFieldData('numberFormat', { display: state.value?.field?.fieldSchema?.config === '数字' })
      const canSort = ['文本', '数字', '时间', '时间2', '选择器', '星级评价'].indexOf(state.value?.field?.fieldSchema?.config) > -1
      form.setFieldData('sort', { display: canSort })
    })
    commonFormEffect(form)
  }
}

export default ReferenceSchema
