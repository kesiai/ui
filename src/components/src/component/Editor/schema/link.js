import React from 'react'
import { use } from 'xadmin'
import { baseConfig, editConfig, keyForm, FieldScriptInput } from './common'
import LinkComponent from '../../../fieldComponent/LinkComponent'
import DVContainer from '../component/DefaultValContainer'

const DefaultLink = (props) => {
  const { form } = use('form')
  const [sch, setSch] = React.useState({})

  React.useEffect(() => {
    form.useEffect(({ values }) => {
      setSch(values)
    })
  }, [])
  
  return <LinkComponent {...props} field={{ ...props.field, schema: _.omit(sch, ['disabled', 'createDisabled', 'editDisabled']) }} />
}

const LinkSchema = {
  type: "object",
  name: _r("链接"),
  title: _r("链接"),
  description:_r('可通过链接访问内部或外部资源'),
  icon: "inbox",
  key: "text",
  properties: {
    defaultVal: {
      title: _r("默认值"),
      type: "string",
      field: {
        component: (props) => <DVContainer><DefaultLink {...props} /></DVContainer> 
      }
    },
    placeholder: {
      title: _r("引导文字"),
      type: "string",
      fieldType: 'languageInput'
    },
    linkType: {
      title: _r("类型"),
      type: "string",
      enum1: ['out', 'in'],
      enum_title1: [_r('外链接'), _r('内链接')],
      selectFace: "flatten",
      selectType: 'single'
    },
    pattern: {
      title: _r("校验"),
      type: 'string'
    },
    ...baseConfig,
    ...editConfig
  },
  required: ["title", "key"],
  form: [keyForm, "title", "defaultVal", '*'],
  formEffect: form => {
    form.useField('linkType', state => {
      form.setFieldData('pattern', { display: state.value === 'out' })
      form.change('pattern', state.value === 'out' ? '^http[s]?://[\\S]+$' : '')
    })
  }
}

export default LinkSchema