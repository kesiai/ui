import React from 'react';
import { Modal, Button } from 'antd';
import { C } from 'xadmin-ui';
import Icon from '../../Editor/component/Icon';
import _ from 'lodash'
import TableRulesAIBtn from '../../AI/TableRulesAIBtn';

const originExtraLibs = [
  {
    content: `
      const aa = { bb: 'cc' }
      const form = {
        batch: function batch (e) {},
        blur: function blur (e) {},
        change: function change (fieldKey, value) {},
        data: {},
        destroyOnUnregister: false,
        focus: function focus (fieldKey) {},
        getFieldState: function getFieldState (fieldKey) {},
        getRegisteredFields: function getRegisteredFields () {},
        getState: function getState () {},
        initialize: function initialize (e) {},
        isValidationPaused: function isValidationPaused () {},
        mutators: {},
        pauseValidation: function pauseValidation () {},
        registerField: function registerField (e, a, t, s) {},
        reset: function reset (fieldKey) {},
        resetFieldState: function resetFieldState (fieldKey) {},
        restart: function restart (e) {},
        resumeValidation: function resumeValidation () {},
        setConfig: function setConfig (e, s) {},
        setFieldData: function setFieldData (fieldKey, data) {},
        submit: function submit () {},
        subscribe: function subscribe (e, a) {},
        useEffect: function useEffect (fieldKey) {},
        useField: function useField (fieldKey, r) {},
      }
    `,
    filePath: "fieldRules.d.ts"
  }
]

const ScriptInput = ({ value, onChange, schema }) => {
  const initStr = `// const values = form.getState().values // Get the entire form value (获取整个表单值)
// const val = form.getFieldState('text-309E').value // Get the value of a certain field (获取某个字段的值)
// form.setFieldData('text-CB55', { display: false }) // Hide field (隐藏字段)
// form.change('text-CB55', '1122') // Modify field values (修改字段值)`
  
  const [ visible, setVisible ] = React.useState(false)
  const [ code, setCode ] = React.useState(value || initStr)

  const options = {
    roundedSelection: false,
    readOnly: false,
    minimap: { enabled: false },
    cursorStyle: 'line',
    automaticLayout: false
  }

  return (
    <>
      <Button type="default" size="small" onClick={e => setVisible(true)} style={{ width: 110, height: 32 }}>
        <Icon type="code" />{_t1('编辑脚本')}
      </Button>
      <Modal
        title={_t1('执行脚本')}
        visible={visible}
        maskClosable={false}
        width="80%"
        onOk={() => {
          onChange(code)
          setVisible(false)
        }}
        onCancel={() => setVisible(false)}
      >
        <div><TableRulesAIBtn schema={schema} setCode={setCode} /></div>
        <C is="CodeEditor"
          language={'javascript'}
          value={code}
          width="100%"
          height="600"
          options={options}
          onChange={setCode}
          originExtraLibs={originExtraLibs}
          docUrl="https://docs.airiot.cn/development-manual/%E5%89%8D%E7%AB%AF%E6%96%87%E6%A1%A3/%E5%B9%B3%E5%8F%B0%E8%84%9A%E6%9C%AC%E4%BB%8B%E7%BB%8D/#%E5%9B%9B%E5%AD%97%E6%AE%B5%E8%A7%84%E5%88%99-%E4%BA%A4%E4%BA%92%E8%A7%84%E5%88%99-%E6%89%A7%E8%A1%8C%E8%84%9A%E6%9C%AC"
        />
      </Modal>
    </>
  )
}

export default ScriptInput
