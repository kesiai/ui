import React from "react";
import { C } from "xadmin-ui";
import { Button, Tooltip, Modal, message } from "antd";
import { CodeOutlined } from '@ant-design/icons';

const options = {
  selectOnLineNumbers: true,
  roundedSelection: false,
  readOnly: false,
  cursorStyle: 'line',
  automaticLayout: false
}

const CodeEdit = ({ schema, setSchema }) => {
  const [vis, setVis] = React.useState(false)
  const [code, setCode] = React.useState()

  React.useEffect(() => {
    setCode(JSON.stringify(schema, 2, 2))
  }, [JSON.stringify(schema)])

  const onOk = () => {
    let sch
    try {
      sch = JSON.parse(code)
      setSchema(sch)
      setVis(false)
    } catch (e) {
      message.error('代码格式不正确')
    }
  }

  return <>
    <Button onClick={() => setVis(true)}>
      <Tooltip title={_t1("代码编辑")}><CodeOutlined /></Tooltip>
    </Button>
    <Modal
      width={'60%'}
      title={_t1('代码编辑')}
      open={vis}
      onCancel={() => setVis(false)}
      onOk={onOk}
    >
      <C is="CodeEditor"
        width="100%"
        height={'65vh'}
        language={"json"}
        value={code}
        onChange={setCode}
        options={options}
      />
    </Modal>
  </>
}

export default CodeEdit
