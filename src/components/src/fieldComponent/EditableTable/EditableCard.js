import React, { useEffect, useMemo, useState } from 'react';
import { Form, Card, Row, Col, Input, Tooltip } from 'antd';
import { C } from 'xadmin-ui'
import Icon from '../../component/Editor/component/Icon';
import _ from 'lodash';
import { SchemaForm } from 'xadmin-form'
import { use, app } from 'xadmin'
import { TC2Provider } from '../../component/Editor/context';

const CardForm = ({ schema, initialValues = {}, handleFormChange, setErrors, submitFailed, outValues, fieldKey }) => {

  const FormLayout = ({ errors, handleSubmit, children, pristine }) => {
    useEffect(() => {
      setErrors({ errors, pristine })
      if (submitFailed) handleSubmit()
    }, [errors, submitFailed])
    return <Form onSubmit={handleSubmit} layout='vertical'><Row gutter={[30]}>{children}</Row></Form>
  }

  return <TC2Provider editingSchema={outValues}>
    {
      useMemo(() => <SchemaForm
        onChange={values => setTimeout(() => handleFormChange(values, initialValues.key), 0)}
        onSubmit={() => null}
        key={initialValues.key}
        initialValues={initialValues}
        schema={schema}
        component={FormLayout}
        group={C('Custom.FieldGroup')}
      />, [initialValues.key, submitFailed, JSON.stringify(schema), JSON.stringify(_.omit(outValues, [fieldKey]))])
    }
  </TC2Provider>
}

const EditableCard = ({ input: { value = [], onChange, name }, columns, showDelBtn, setDataSource, meta, setErrors, option, ...props }) => {

  const { submitFailed } = meta || {}
  const { fieldRules: { fieldRules } = {}, cardLayout, minCount } = props.schema // fieldRules多了一层
  const { getMutualRules, getOneError } = app.get('fieldRules')
  // 外部表单的值，关联字段内置查询中使用
  let outValues
  try {
    outValues = use('form', state => ({ outValues: state.values }))?.outValues
  } catch (e) {}

  const dataRef = React.useRef(value)

  const btnStyle = { width: 18, margin: 'auto', pointerEvents: minCount && value?.length <= minCount ? 'none' : null }
  
  useEffect(() => {
    dataRef.current = value
  }, [value])
  
  const handleDelete = (key, i) => {
    setErrors({ path: name, isDelete: true, deleteIndex: i })
    const data = dataRef.current ? dataRef.current.filter((item) => item?.key !== key) : []
    setDataSource(data)
    dataRef.current = data
    onChange && onChange(data.length ? data : null)
  }

  const handleFormChange = (values, key) => {
    const newValue = dataRef.current ? dataRef.current.map(d => d?.key == key ? { ...values, key } : d) : null
    setDataSource(newValue)
    dataRef.current = newValue
    onChange && onChange(newValue)
  }

  const getErrors = (val) => {
    let errors = {}
    if (fieldRules?.errorNotice && fieldRules?.errorNotice.length > 0) {
      let redTextNotice = fieldRules.errorNotice.filter(item => !item.noticeType || item.noticeType === 'redText')
      redTextNotice.forEach(item => {
        errors = getOneError(item, val, errors)
      })
    }
    return errors
  }

  const formProperties = columns.reduce((prve, curr) => {
    const schema = curr.schema
    schema.title = schema.title || ' '
    schema.field = {
      ...(schema.field || {}),
      attrs: {
        ...(schema.field?.attrs || {}),
        groupSize: {
          labelCol: { span: 24 },
          wrapperCol: { span: 24 }
        }
      }
    }
    if (!_.isEmpty(fieldRules)) {
      const validate = (val, vals) => {
        // const values = form?.getState().values?.[fieldKey]
        // if (val && values?.find(v => v?.key != vals?.key && v?.[curr.key] && (JSON.stringify(val) == JSON.stringify(v[curr.key]) || (val.id && val.id == v[curr.key].id)))) {
        //   return '该字段不允许重复'
        // }
        const errors = getErrors(vals)
        if (errors?.[curr.key]) {
          return errors[curr.key]
        }
      }
      schema.field = { ...schema.field, validate }
    }
    return { ...prve, [curr.key]: schema }
  }, {})
  const required = _.filter(formProperties, f => f.need).map(f => f.key)
  const schema = { type: 'object', properties: formProperties, required }
  if (fieldRules?.mutualRules) {
    schema.formEffect = getMutualRules({ fieldRules, schema }) // fieldRules多了一层
  }

  const handleErrors = ({ errors, pristine }, i) => {
    setErrors({ errors, path: `${name}.${i}` })
    if (onChange && pristine) {
      setTimeout(() => onChange(_.cloneDeep(value)), 0)
    }
  }

  return (
    _.isEmpty(columns) ? <C is="NoData" description={_t1("卡片没有配置任何字段，请先配置字段")} /> :
      !_.isEmpty(value) ? <Row gutter={[16, 16]} className='editable-card' >
        {value.map((d, i) => {
          return (
            <Col span={cardLayout && (cardLayout == '1' ? 24 : cardLayout == '2' ? 12 : 8)} >
              <Card
                hoverable
                style={{ borderRadius: 5, minWidth: cardLayout ? null : 400, overflowX: 'hidden', border: '1px solid #f0f0f0' }}
                actions={showDelBtn && [
                  <Tooltip title={minCount && value?.length <= minCount ? _t1('当前记录数小于等于最小记录数，不能删除数据') : null}>
                    <span style={{ cursor: minCount && value?.length <= minCount ? 'not-allowed' : null }}>
                      <Icon type='delete' onClick={() => handleDelete(d.key, i)} style={btnStyle} />
                    </span>
                  </Tooltip>
                ]}
              >
                <CardForm
                  initialValues={d}
                  fieldKey={name}
                  schema={schema}
                  handleFormChange={handleFormChange}
                  setErrors={v => handleErrors(v, i)}
                  submitFailed={submitFailed}
                  outValues={outValues}
                />
              </Card>
            </Col>
          )
        })}
      </Row> : <C is="NoData" description={_t1("暂无数据")} />
  )
}

export default EditableCard