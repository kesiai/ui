import React from "react";
import { Button, Checkbox, Modal } from 'antd'
import { C } from "xadmin-ui";

const schema = {
  type: 'object',
  properties: {
    userRange: {
      title: _r('用户范围'),
      type: 'string',
      enum: ['all', 'role', 'user'],
      enum_title: [_r('全部用户'), _r('选择角色'), _r('选择用户')],
      field: {
        effect: ({ value }, form) => {
          setTimeout(() => {
            form.setFieldData('roles', { display: value == 'role', required: value == 'role' })
            form.setFieldData('users', { display: value == 'user', required: value == 'user' })
          })
        }
      }
    },
    roles: {
      title: _r('角色'),
      type: 'array',
      items: {
        type: 'object',
        properties: {},
        relateTo: 'Role'
      }
    },
    users: {
      title: _r('用户'),
      type: 'array',
      items: {
        type: 'object',
        properties: {},
        relateTo: 'User'
      }
    }
  },
  required: ['userRange']
}

const FormLayout = ({ children, label, open, handleSubmit, onCancel, invalid }) => {

  return <Modal
    open={open}
    destroyOnClose
    title={_t1('{{label}}详细权限设置', { label })}
    onOk={handleSubmit}
    onCancel={onCancel}
    okButtonProps={{ disabled: invalid }}
  >
    {children}
  </Modal>
}

const EditTablePermissions = ({ label, input, input: { value, onChange }, meta, field, group: FieldGroup }) => {

  const [open, setOpen] = React.useState()

  const handleCheck = e => {
    onChange({ ...value, show: e.target.checked })
  }

  const onSubmit = values => {
    onChange({ ...values, show: value?.show })
    setOpen(false)
  }

  return <FieldGroup meta={meta} input={input} field={field} tailLayout={true}>
    <Checkbox checked={value?.show} onChange={handleCheck}>{_t1(label)}</Checkbox>{' '}
    <Button disabled={!value?.show} onClick={() => setOpen(true)}>{_t1('详细权限')}</Button>
    <C
      is='I18nSchemaForm'
      schema={schema}
      initialValues={value || {}}
      open={open}
      onSubmit={onSubmit}
      label={label}
      onCancel={() => setOpen(false)}
      component={FormLayout}
    />
  </FieldGroup>
}

EditTablePermissions.useGroup = false

export default EditTablePermissions