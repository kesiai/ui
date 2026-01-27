import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Button, Dropdown, Menu, Modal } from 'antd'
import { FieldRules } from '../../FieldRules'

const TableFieldRules = (props) => {
  const { input, option } = props
  const [ visible, setVisible ] = useState()
  
  const formValues = option.form.getState().values
  const item = { ...input.value, schema: formValues?.tableFields }
  const saveItem = val => {
    input.onChange && input.onChange({ ...input.value, ..._.omit(val, 'id') })
    setVisible(false)
  }
  return (
    <>
      <Button onClick={() => setVisible(true)} >{_t1('字段规则')}</Button>
      <Modal
        title={_t1("表格字段规则")}
        width={'80%'}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[]}
        destroyOnClose>
        <FieldRules item={item} saveItem={saveItem} hiddenMutualRules={formValues?.displayForm != 'card'} />
      </Modal>
    </>
  )
}

export default TableFieldRules