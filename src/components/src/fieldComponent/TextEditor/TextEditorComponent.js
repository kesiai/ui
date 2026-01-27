import React from 'react'
import { getFormValues } from '../../component/Editor/utils'
import { useScriptVal } from '../../component/Editor/utils2'
import MyUploadAdapterPlugin from './UploadAdapter';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { fontBackgroundColor, fontColor, fontFamily } from './TextEditorConfig.js'
import { Modal, Form } from 'antd'
import Icon from '../../component/Editor/component/Icon';
import { app } from 'xadmin'
import './TextEditor.css'

const Preview = ({ value, inList, title, editableFields }) => {
  const [visible, setVisible] = React.useState(false)
  const content = <div dangerouslySetInnerHTML={{ __html: value?.replace(/<a/g, '<a target="_Blank"') }} className='ck-content'></div>
  const el = document.createElement('span')
  el.innerHTML = value
  
  return (
    inList && value ?
      <>
        <span style={{ cursor: 'pointer' }} onClick={() => setVisible(!editableFields)} >
          <Icon type='Profile' style={{ marginRight: 5, fontSize: 16 }}></Icon>
          <a>{_t1('查看内容')}</a>
        </span>
        <Modal title={title} width='50%' bodyStyle={{}} visible={visible} footer={null} onCancel={() => setVisible(false)}>
          { content }
        </Modal>
      </> :
      content
  )
}

const TextEditorComponent = ({ input: { value, onChange }, field: { schema }, record, antdForm, toolbar }) => {

  const { placeholder, disabled, defaultVal, defaultValType, inList, key, title, editableFields } = schema
  const lang = app.context?.language
  const language = lang == 'zh_Hans' || !lang ? 'zh-cn' : lang
  // 字段脚本部分
  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema, value, values, record: record, onChange })
    }
  }, [JSON.stringify(values)])

  React.useEffect(() => {
    if (lang == 'zh_Hans') {
      const dictionary = {
        'In line': '嵌入行内',
        'Wrap text': '图片侧边显示',
        'Break text': '图片对齐方式',
        'Toggle caption on': '图片解释说明',
        'List properties': '列表属性',
        'Start at': '开始于',
        'Reversed order': '倒叙'
      }
      window.CKEDITOR_TRANSLATIONS['zh-cn'].dictionary = { ...window.CKEDITOR_TRANSLATIONS['zh-cn'].dictionary, ...dictionary }
    }
  }, [lang])

  return (
    disabled ?
      <Preview value={value} inList={inList} title={title} editableFields={editableFields} /> :
      <div className='custom-text-editor'>
        <CKEditor
          id={key}
          onReady={editor => {
            if (editor) {
              !inList && !value && defaultVal && defaultValType !== 'logic' && editor.setData(defaultVal)
              editor.isReadOnly = disabled
              editor.ui.getEditableElement().parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
              );
            }
          }}
          onChange={(event, editor) => onChange && onChange(editor.getData())}
          editor={DecoupledEditor}
          data={value || '<p></p>'}
          config={{
            language, extraPlugins: [MyUploadAdapterPlugin], placeholder: placeholder || _t1('编辑富文本'),
            toolbar: !_.isEmpty(toolbar)? toolbar:{
              shouldNotGroupWhenFull: true
            },
            fontFamily,
            fontBackgroundColor,
            fontColor,
          }}
        />
      </div>
  )
}

export default TextEditorComponent