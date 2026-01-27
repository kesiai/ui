import React from 'react'
import _ from 'lodash'
import { use, api } from 'xadmin'
import { C, Icon } from 'xadmin-ui'
import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput } from './common'
import { TableFieldSelect, InsideFilter } from '../component/referenceComponents'
import { Button } from 'antd'
import { TableContext } from '../context'

const lodashList = Object.keys(_)

const LogicInput = ({ key1 = 'jsLogic', key2 = 'jsLogicOrigin', btnStyle = {}, type }) => {
  const [visible, setVisible] = React.useState(false)
  const [tables, setTables] = React.useState([])
  const { editingSchema = {} } = React.useContext(TableContext)
  const { form } = use('form')
  const origin = form.getState()?.values?.[key2]
  const fieldKey = form.getState()?.values?.key
  const fieldType = form.getState()?.values?.type

  const onClickPanel = () => {
    setVisible(true)
  }

  React.useEffect(() => {
    const fields = ['id', 'title', 'schema']
    api({ name: 'core/t/schema' }).query({ fields }, {}).then(({ items = [] }) => {
      setTables(items)
    })
  }, [])

  const lodashSchema = {
    id: '_',
    title: _t1('工具函数'),
    type: 'object',
    insert: false,
    properties: {},
    description: _t1('Lodash 是一个一致性、模块化、高性能的 JavaScript 实用工具库。')
  }
  for (let name of lodashList) {
    lodashSchema.properties[`_.${name}`] = {
      title: `${name}`,
      type: 'string',
      nodeType: 'function',
      // description: createDescription(doc, 'lodash', name)
    } 
  }

  const momentSchema = {
    id: 'moment',
    title: _t1('日期函数'),
    type: 'object',
    insert: false,
    properties: {
      moment: {
        title: 'moment',
        type: 'string',
        nodeType: 'function'
      }
    },
    description: _t1('JavaScript内置日期函数')
  }

  let tablesSchema = {}
  tables.forEach((table) => {
    if (table.schema) {
      tablesSchema[table.id+'_@table'] = {
        type: 'array',
        items: {
          type: 'object',
          properties: table.schema.properties
        },
        title: `[${_t1('数据表')}]` + table.title,
        nodeType: 'table'
      }
    }
  })
  let editingProps = {}
  Object.keys(editingSchema?.properties || {}).filter(key => {
    if (key === fieldKey) return false
    if (type === 'defaultVal') { // 默认值公式，过滤掉一部分字段
      const f = editingSchema.properties[key]
      if (!f.createShow || f.schemaHide || (_.isString(f.defaultVal) && f.defaultVal.indexOf(fieldKey) > -1)) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }).forEach(key => {
    editingProps[key] = {
      ...editingSchema.properties[key],
      title: `[${_t1('字段引用')}]` + editingSchema.properties[key].title
    }
  })

  return <>
    <C
      is='CodeEditor.VariableEditor'
      isModal={true}
      modalVisible={visible}
      onModalCancel={() => setVisible(false)}
      schema={{
        ...editingSchema,
        properties: {
          ...editingProps,
          ...tablesSchema
        }
      }}
      placement="right"
      panelWidth={500}
      value={origin}
      isFormula={true}
      expectType={fieldType}
      functionSchemas={[
        // {
        //   type: 'object',
        //   title: '列表函数',
        //   properties:  {
        //     FILTER: { type: 'string', title: '筛选出符合条件的记录（需指定目标字段）', nodeType: 'function' }
        //   }
        // },
        momentSchema,
        lodashSchema
      ]}
      onChange={(v) => {
        form.change(key1, v?.stringify)
        form.change(key2, v)
      }}
      // notfocusedShow={true}
    />
    <Button style={{ minWidth: 100, ...btnStyle }} onClick={onClickPanel} >
      {_t1('公式编辑')}
      {/* <Icon svg={require('../svg/绑定.svg')} /> */}
    </Button>
  </>
}

const FormulaSchema = {
  type: 'object',
  name: _r('公式'),
  title: _r('公式'),
  properties: {
    ...baseConfig,
    jsLogic: {
      title: _r('公式'),
      type: 'string',
      permissionType: 'script',
      field: {
        component: LogicInput
      }
    },
    ...editConfig
  },
  required: ['title', 'key', 'jsLogic'],
  form: [keyForm, 'title', 'jsLogic', 'widthInForm', 'listFields', 'createShow', 'editShow', 'detailNotShow']
}

export { LogicInput }
export default FormulaSchema
