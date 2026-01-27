import React from "react"
import { Button, Modal, Form } from "antd"
import { PlusOutlined } from '@ant-design/icons';
import { api } from "xadmin";
import { SchemaForm } from "xadmin-form";
import { getErrorNotice, getMutualRules } from "../../component/FieldRules/getMutualRules";
import { C, Loading } from "xadmin-ui";
import { getFormValues } from "../../component/Editor/utils";
import { getDisabled } from "../tool";

const AddRecordBtn = (props) => {
  const { relateSchema, tableID, input, antdForm, meta } = props

  const f = Form.useForm()
  let values = getFormValues(relateSchema, antdForm || f)
  const disabled = _.isBoolean(meta?.data?.disabled) ? meta.data.disabled : getDisabled(props.relateSchema, values, true)
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [tableModel, setTableModel] = React.useState()

  React.useEffect(() => {
    if (tableID) {
      api({ name: 'core/t/schema' }).get(tableID).then((res) => {
        setLoading(false)
        setTableModel(res)
      })
    }
  }, [tableID])

  if (!relateSchema.allowAdd) return null
  const FormComponent = getErrorNotice(tableModel)
  return <>
    <Button disabled={disabled} onClick={() => setOpen(true)}><PlusOutlined />{_t1('新增记录')}</Button>
    <Modal destroyOnClose title={_t1('新增记录')} footer={null} open={open} width={'70%'} onCancel={() => setOpen(false)} >
      {
        loading ? <Loading /> : <FormComponent
          formKey={'relate-add-record'}
          schema={{
            ...tableModel.schema,
            resource: `core/t/${tableID}/d`,
            formEffect: getMutualRules(tableModel)
          }}
          onSubmitSuccess={(a, b, res, data) => {
            setOpen(false)
            const newItem = { ...data, id: res.InsertedID }

            if (relateSchema.selectType === 'multiple') {
              input.onChange([...(input.value || []), newItem])
            } else {
              input.onChange(newItem)
            }
          }}
          // component={FormLayout}
          group={C('Custom.FieldGroup')}
        />
      }
    </Modal>
  </>
}

export default AddRecordBtn
