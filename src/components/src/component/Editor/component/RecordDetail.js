import React from 'react'
import { Button, Modal, message } from 'antd'
import { use, api } from 'xadmin'
import { C } from 'xadmin-ui'
import { FieldGroup } from '../utils3'
import _ from 'lodash'

let recordSchema = {
  type: 'object',
  name: _r('记录详情设置'),
  title: _r('记录详情设置'),
  key: 'record-detail',
  properties: {
    showType: {
      title: _r('展示详情形式'),
      type: 'string',
      enum: ['modal', 'popover', 'page', 'none'],
      enum_title: [_r('弹窗'), _r('直接展示'), _r('跳转页面'), _r('不展示')]
    },
    showField: {
      title: _r("展示详情字段"),
      type: 'array',
      items: {},
      selectType: 'multiple'
    }
  },
  formEffect: form => {
    form.useField('showType', ({ value }) => {
      form.setFieldData('showField', { display: value === 'modal' || value === 'popover' })
    })
  }
}

const RecordDetail = ({ input }) => {
  const [visiable, setVisiable] = React.useState(false)
  const [schema, setSchema] = React.useState({})
  
  const { formKey, relate } = use('form', state => ({
    formKey: state.values.key,
    relate: state.values.relate || {}
  }))

  React.useEffect(() => {
    api({ name: 'core/t/schema' }).get(relate.id).then(({ schema }) => {
      let schemaTemp = _.cloneDeep(recordSchema)
      schemaTemp.properties.showField.enum1 = []
      schemaTemp.properties.showField.enum_title1 = []

      let fieldList = schema?.form?? Object.keys(schema?.properties?? {})
      fieldList.forEach(item => {
        let field = schema.properties[item]
        schemaTemp.properties.showField.enum1.push(item)
        schemaTemp.properties.showField.enum_title1.push(field.title)
      })
      setSchema(schemaTemp)
    }).catch((err) => {
      message.error(err,err?.detail||err?.json?.detail)
    })
  }, [relate.id])

  return <>
    <Button onClick={() => setVisiable(true)}>{_t1('详情设置')}</Button>
    <Modal
      maskClosable={false}
      title={_t1("记录详情设置")}
      visible={visiable}
      onCancel={() => setVisiable(false)}
      width="800px"
      footer={null}>
      <C is="I18nSchemaForm"
        onChange={values => input.onChange(values)}
        formKey={formKey}
        initialValues={input.value || { showType: 'none' }}
        schema={schema}
        group={FieldGroup}
        component={({ children }) => children}
      />
    </Modal>
  </>
}

export default RecordDetail
