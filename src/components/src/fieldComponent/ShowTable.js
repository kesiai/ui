import React, { useState } from 'react'
import { Button, Table, Modal, Card, Row, Col, Form } from 'antd'
import { C } from 'xadmin-ui'
import Icon from '../component/Editor/component/Icon'
import { app, use } from 'xadmin'
import _ from 'lodash'
import { sortFn } from './EditableTable/EditableTable'

const convert = (schema) => {
  return app.get('fieldRenders').reduce((prev, render) => {
    return render(prev, schema, {})
  }, null)
}

const defaultCom = ({ value }) => {
  return value || <></>
}
const newWrap = ({ children }) => {
  return <>{children}</>
}

const CardComponent = ({ schema: { tableFields, defaultVal, cardLayout }, input: { value } }) => {
  const cardValue = value || defaultVal

  const columns = val => tableFields?.form && _.map(tableFields.form, key => {
    const item = tableFields.properties[key]

    const RenderCom = convert(item) || defaultCom

    return (
      <Form.Item label={item.title}>
        <RenderCom value={val?.[key]} wrap={newWrap}></RenderCom>
      </Form.Item>
    )
  })
  return (
    !_.isEmpty(value) || !_.isEmpty(defaultVal) ? 
    <Row gutter={[16, 16]} >
      {cardValue && cardValue.map(d => {
        return (
          <Col span={cardLayout && (cardLayout == '1' ? 24 : cardLayout == '2' ? 12 : 8)} >
            <Card
              hoverable
              style={{ borderRadius: 5, minWidth: cardLayout ? null : 400, overflowX: 'hidden' }}
            >
              {columns(d)}
            </Card>
          </Col>
        )
      })}
    </Row> : <C is="NoData" description={_t1("暂无数据")} /> 
  )
}

const TableComponent = ({ schema: { tableFields, showPagination }, input: { value } }) => {

  const showTotal = (total) => _t1('共{{total}}条', { total })
  const pagination = showPagination ? { total: value?.length, showTotal, showSizeChanger: true, showQuickJumper: true } : false

  const columns = tableFields?.form && _.map(tableFields.form, key => {

    const item = tableFields.properties[key]

    const RenderCom = convert(item) || defaultCom

    const col = {
      title: item.title,
      dataIndex: item.key,
      key: item.key,
      width: 150,
      render: (val, record) => <RenderCom value={val} wrap={newWrap} inList={true}></RenderCom>
    }

    if (item.canOrder) {
      col.sorter = (a, b) => sortFn(item, a, b)
    }
    
    return col
  })

  return <Table
      bordered
      dataSource={value}
      columns={columns}
      pagination={pagination}
      scroll={{ x: 700, y: 400 }}
      locale={{ emptyText: <C is="NoData" /> }}
    />
}

const ShowTable = (props) => {
  const { schema: { editableFields, tableFields, title, defaultVal, displayForm }, inList } = props
  const [visible, set] = useState()
  const setTableWsStop = use('table.ws.stop')
  let value = props.value
  try {
    if (_.isString(value)) value = JSON.parse(value)
  } catch (e) {
    console.error('表格数据格式问题', value)
  }

  const setVisible = v => {
    set(v)
    setTableWsStop(v)
  }
  return (inList ?
    <>
      <Icon type='table' onClick={() => !editableFields && setVisible(true)}></Icon>
      <span style={{ marginLeft: 5 }}>{value?.length || ''}</span>
      <Modal title={title}
        visible={visible}
        onCancel={() => setVisible(false)}
        width={1000}
        destroyOnClose
        footer={[<Button type='primary' onClick={() => setVisible(false)}>{_t1('确定')}</Button>]}
      >
        {
          displayForm == 'card' ?
            <CardComponent {...props} input={{ value }} /> :
            <TableComponent {...props} input={{ value }} />
        }
      </Modal>
    </> :
    displayForm == 'card' ?
    <CardComponent {...props} input={props.input || { value }} /> :
    <TableComponent {...props} input={props.input || { value }} />
  )
}

export default ShowTable