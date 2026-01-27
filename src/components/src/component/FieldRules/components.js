import React from 'react'
import { Form, Row, Col, Space, Button, Card, message, Tooltip, Input } from 'antd'
import { app, api, use } from 'xadmin'

const FieldGroup = ({ label, meta, input, field, tailLayout, children }) => {
  const attrs = field.attrs || {}
  const schema = field.relateSchema || field.schema || {}
  const size = (field.option && field.option.groupSize) ||
    attrs.groupSize || {
    labelCol: schema?.config === '表单信息' ? { span: 0 } : {
      xs: { span: 24 },
      sm: { span: 24 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 }
    }
  }
  let error = false
  // 附件/附件组/表格/关联字段，无法focus，无法touched，通过modified属性判断
  if (schema?.config == '表格') { // 表格字段不显示整体的报错信息，错误信息显示到表格中每个字段下
    error = false
  } else if (['附件', '附件组', '关联字段', '时间'].indexOf(schema?.config) > -1) {
    error = meta.modified && (meta.error || meta.submitError)
  } else {
    error = meta.touched && (meta.error || meta.submitError)
  }

  let groupProps = { ...size, required: field.required }

  if (schema && schema.descriptionType === 'tooltip') {
    groupProps.tooltip = field.description
  } else {
    groupProps.extra = field.description || field.help
  }

  if (error) {
    groupProps['validateStatus'] = 'error'

    groupProps['help'] = error
  }

  const lab = schema?.displayForm === 'switch' ? schema.title : label // 布尔值（开关）
  const controlComponent = children ? children : <Input {...input} {...attrs} />
  return (
    <Col span={schema.widthInForm ? Number(schema.widthInForm) || 12 : 24}>
      <Form.Item label={lab} {...groupProps}>
        {controlComponent}
      </Form.Item>
    </Col>
  )
}

const FormLayout = props => {
  const { children, invalid, handleSubmit, showCode, submitting, inModal, hideSubmitButton } = props
  const { _t } = app.context
  const groupProps = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
    }
  }
  return (
    <Card>
      <Form onSubmit={handleSubmit} layout='vertical'>
        <Row gutter={[30]}>{children}</Row>
        {
          !hideSubmitButton && <Form.Item {...groupProps} style={{ textAlign: inModal ? 'left' : 'center' }}>
            <Button
              type='primary'
              onClick={handleSubmit}
              loading={submitting}
              disabled={invalid}
            >
              {_t1('保存')}
            </Button>{' '}
            {!inModal ? <Button onClick={() => history.back()}>{_t1('取消')}</Button> : null}
          </Form.Item>
        }
      </Form>
    </Card>
  )
}

const NodeFormLayout = props => {
  const { children, invalid, handleSubmit, form, schema, onSubmitSuccess, inModal, submitting, errors, getErrorMessage } = props
  const [loading, setLoading] = React.useState({})
  const { id: isRecordId } = use('params')
  const { table } = schema
  const eN = table?.fieldRules?.errorNotice

  const isCurrentEdit = !!props.form.getState()?.values?._table

  const { _t } = app.context
  

  const groupProps = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
    }
  }

  const onSaveItem = __next => {

    if (!_.isEmpty(errors)) {
      message.error(_t1('表单校验失败,请检查表单是否填写错误'))
      return
    }
    const value = form.getState().values
    form.data = { ...form.data, __next }

    // isCurrentEdit是否在配置页面
    // 表记录资产表id需要自定义 修改form时使用默认Save使用PUT接口
    let method = isCurrentEdit ? 'PUT' : 'POST'
    const uri = method == 'POST' ? '' : '/' + value?.id

    // 字段规则，错误提示，页面上方弹窗提示 ------- 开始
    let result = []
    if (eN && eN.length > 0) {
      result = getErrorMessage(eN, value)
    }
    const editableTableErrorNotice = schema?.properties && _.map(schema.properties, p => p.fieldType == 'editableTable' && p.fieldRules?.errorNotice ? p : null)?.filter(Boolean)
    if (!_.isEmpty(editableTableErrorNotice)) {
      editableTableErrorNotice.forEach(item => {
        value?.[item.key] && value?.[item.key].forEach(val => {
          const error = getErrorMessage(item.fieldRules.errorNotice, val)
          result = _.isEmpty(error) ? result : [...result, ...error]
        })
      })
    }
    if (!_.isEmpty(result)) {
      message.error(result[0])
      return
    }
    // 字段规则，错误提示，页面上方弹窗提示 ------- 结束

    setLoading({ [__next]: true })
    return api({ name: schema.resource })
      .fetch(uri, { method, body: JSON.stringify(value) })
      .then(data => {
        if (data?.json?.InsertedID || data?.status == 200) {
          message.success(_t1('保存成功'))
          if (_.isFunction(schema?.formProps?.onSubmitSuccess)) {
            schema?.formProps?.onSubmitSuccess(value, form, data?.json, value)
          } else if (onSubmitSuccess && _.isFunction(onSubmitSuccess)) {
            onSubmitSuccess(data, form, data?.json, value)
          }
        }
      })
      .catch(e => {
        if (e.message) {
          // 修改接口，新增接口，异常返回格式不一样
          // const regex = /\[[a-zA-Z0-9\-]+\]/g
          // const str = e.message.match(regex)?.[0]
          // const key = str?.substring(1, str?.length - 1)
          // if (table?.schema?.properties?.[key]) {
          //   message.error('[' + table.schema.properties[key].title + '] 的值已被占用')
          // } else {
          //   message.error(e.message)
          // }
        } else {
          for (let key in e) {
            if (table?.schema?.properties?.[key]) {
              message.error(
                '[' + table.schema.properties[key].title + '] ' + _t1('的值已被占用')
              )
            } else {
              message.error(e[key])
            }
          }
        }
      })
      .finally(() => setLoading({}))
  }


  const loadingDisabled = (type) => JSON.stringify(loading) === '{}' ? false : Boolean(!loading[type])
  const errConvert = (errors) => {
    let errText = ''
    try {
      if (errors) {
        Object.keys(errors).forEach(key => {
          const fieldTitle = schema?.properties?.[key]?.title
          if (_.isString(errors[key])) {
            const content = errors[key].indexOf(fieldTitle) > -1 ? errors[key] : ((fieldTitle || '') + ' ' + errors[key])
            errText += `<span style="color:#ff4d4f">${content}<span><br/>`
          } else if (_.isArray(errors[key])) {
            errors[key].forEach((item, k) => {
              errText += errConvert({ [k]: item })
            })
          }
        })
      }
    }
    catch (err) {
      console.error('err', err)
    }
    return errText
  }

  const errInfo = errConvert(errors)

  const SaveBtn = props?.SaveBtn ? props.SaveBtn : (
    <Space>
      <Button type={invalid ? "default" : "primary"} onClick={() => onSaveItem('edit')} loading={Boolean(loading['edit'])} disabled={loadingDisabled('edit')} > {_t1('保存')} </Button>
      {!isRecordId && !inModal ? <>
        <Button type={invalid ? "default" : "primary"} onClick={() => onSaveItem('next')} loading={Boolean(loading['next'])} disabled={loadingDisabled('next')}>{_t1('保存并添加下一条')}</Button>
        <Button type={invalid ? "default" : "primary"} onClick={() => onSaveItem('list')} loading={Boolean(loading['list'])} disabled={loadingDisabled('list')}>{_t1('保存并返回列表')}</Button>
      </>
        : null}
    </Space>
  )

  return (
    <Card>
      <Form onSubmit={handleSubmit} layout='vertical'>
        <Row gutter={[30]}>{children}</Row>
        <Form.Item {...groupProps} style={{ textAlign: inModal ? 'left' : 'center' }}>
          <Space>
            {
              errInfo ?
                <Tooltip title={<div dangerouslySetInnerHTML={{ __html: errInfo }}></div>} >
                  {SaveBtn}
                </Tooltip>
                : SaveBtn
            }
            {!inModal ? <Button onClick={() => history.back()}>{_t1('取消')}</Button> : null}
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

const IntroductionTip = ({ title, content }) => {
  return (
    <div style={{ marginBottom: 10 }}>
      <span style={{ fontWeight: 'bold' }}>{title}</span>
      <br />
      <span style={{ fontSize: 12, color: '#777' }}>{content}</span>
    </div>
  )
}

// 字段规则配置中，过滤掉某些字段
const fieldFilter = (schema) => {
  const properties = {}
  Object.keys(schema.properties || {}).forEach(key => {
    properties[key] = {
      ...schema.properties[key],
      filterMethodFn: (methods = []) => {
        return [
          ...methods,
          { name: _r('值变化'), key: 'onchange', component: () => null }
        ]
      }
    }
  })
  return {
    ...schema,
    form: schema.form?.filter(key => {
      return !schema.properties[key]?.schemaHide && // 去掉隐藏字段
        schema.properties[key]?.createForm !== 'autoCreate' // 去掉日期【自动生成】
    }),
    properties
  }
}

export { IntroductionTip, FieldGroup, FormLayout, NodeFormLayout, fieldFilter }
