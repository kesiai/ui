import { Button, message, Modal } from "antd";
import React from "react";
import { use } from "xadmin";
import { C } from "xadmin-ui";
import { TC2Provider } from "../context";

const HighTableFields = () => {
  const [vis, setVis] = React.useState(false)
  const { form, tableFields } = use('form', state => ({ tableFields: state.values?.tableFields }))

  const onChange = (value) => {
    form.change('tableFields', value)
    setVis(false)
    message.success(_t1('保存成功'))
  }

  return <>
    <Button onClick={() => setVis(true)}>{_t1('编辑字段')}</Button>
    <Modal
      title={_t1("编辑字段")}
      width={'90%'}
      open={vis}
      onCancel={() => setVis(false)}
      footer={[]}
      destroyOnClose
    >
      <C
        is="SchemaEditor"
        // editorType="device"
        ignoreConfig={['unique', 'listFields', 'editableFields', 'batchChangeFields', 'filterFields', 'canOrder', 'tableFixed', 'jsLogic']}
        widgetList={['文本', '数字', '选择器', '时间', '日期范围', '时间2', '布尔值', '附件', '附件组', '定位', '链接', '区域', '关联字段', '星级评价', '富文本', '字节数组', '表单信息']}
        schema={_.cloneDeep(tableFields)}
        input={{ onChange }}
        ContextProvider={TC2Provider}
        noRefresh
      />
    </Modal>
  </>
}

export default HighTableFields
