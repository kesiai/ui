import { use } from 'xadmin'
import React from 'react'
import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput } from './common'
import TextComponent from '../../../fieldComponent/TextComponent'
import DVContainer from '../component/DefaultValContainer'

const DefaultText = (props) => {
  const { form } = use('form')
  const [sch, setSch] = React.useState({})

  React.useEffect(() => {
    form.useEffect(({ values }) => {
      setSch(values)
    })
  }, [])
  
  return <TextComponent {...props} field={{ ...props.field, schema: _.omit(sch, ['disabled', 'createDisabled', 'editDisabled']) }} />
}

const TextEditorSchema = {
  type: "object",
  name: _r("富文本"),
  title: _r("富文本"),
  description:_r("可控制文本样式，添加图附件等"),
  key: "textEditor",
  properties: {
    defaultVal: {
      title: _r("默认值"),
      type: "string",
      field: {
        component: (props) => <DVContainer><DefaultText {...props} /></DVContainer> 
      }
    },
    placeholder: {
      title: _r("引导文字"),
      type: "string",
      fieldType: 'languageInput'
    },
    ...baseConfig,
    ...editConfig
  },
  required: ["title", "key"],
  form: [keyForm, "title", "defaultVal", 'need', 'listFields', 'createShow', 'editShow', 'detailNotShow',
        'allScript', 'placeholder', 'description', 'descriptionType', 'tableFixed'],
  formEffect: form => {
    commonFormEffect(form)
  }
}

export default TextEditorSchema