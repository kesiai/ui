import React, { useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import { use, app } from 'xadmin'
import EditableTable from '../../../fieldComponent/EditableTable'

const TableDefault = props => {

  const { input: { value, onChange }, schema } = props
  const { form } = use('form')
  const [visible, setVisible] = useState()
  const [defaultVal, setDefault] = useState(value)
  const [tableFields, setFields] = useState()

  useEffect(() => {
    form.useField('tableFields', (v) => {
      v && setFields(v.value)
    })
  }, [])

  const onValChange = (val) => {
    setDefault(val)
  }

  const onOk = () => {
    onChange(defaultVal)
    setVisible(false)
  }

  const onCancel = () => {
    setVisible(false)
  }

  return (
    <>
      <Button onClick={() => setVisible(true)}>{_t1("设置默认内容")}</Button>
      <Modal title={_t1("默认内容")}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        width={1000}
        destroyOnClose
      >
        <EditableTable {...props} input={{ value: value, onChange: onValChange }} schema={{ ...schema, tableFields }} ></EditableTable>
      </Modal>
    </>
  )
}

export default TableDefault