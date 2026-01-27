import { use } from 'xadmin'
import React, { useState } from 'react'
import { Input, InputNumber, Button, Modal, Checkbox, Form, Select } from 'antd'
import { SettingOutlined } from '@ant-design/icons';
import { C } from 'xadmin-ui'
import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput, metricStore } from './common'
import _ from "lodash"
import { LogicInput } from './formula';
import TextComponent from '../../../fieldComponent/TextComponent'
import DVContainer from '../component/DefaultValContainer'

const NumRange = ({ input }) => {
  const [value1, setValue1] = React.useState(input.value ? input.value.split('-')[0] : '')
  const [value2, setValue2] = React.useState(input.value ? input.value.split('-')[1] : '')
  

  const handleChange = (val, name) => {
    let val1 = val ?? ''
    if (name === 'value1') {
      setValue1(val1)
      input.onChange(val1 + '-' + value2)
    } else {
      setValue2(val1)
      input.onChange(value1 + '-' + val1)
    }
  }

  return (
    <Form>
      <Form.Item style={{ marginBottom: 0 }} validateStatus={parseInt(value1) > parseInt(value2) ? 'error' : ''}
        help={parseInt(value1) > parseInt(value2) ? _t1('最小值不可大于最大值') : null} >
        <Input.Group compact>
          <InputNumber value={value1} onChange={val => handleChange(val, 'value1')} style={{ width: '45%', textAlign: 'center' }} placeholder={_t1("最小值")} />
          <div style={{
            width: '10%',
            textAlign: 'center',
            display: 'inline-block',
            lineHeight: '30px'
          }}>~</div>
          <InputNumber value={value2} onChange={val => handleChange(val, 'value2')} style={{ width: '45%', textAlign: 'center', }} placeholder={_t1("最大值")} />
        </Input.Group>
      </Form.Item>
    </Form>
  )
}

const LanguageType = (props) => {
  const { input } = props
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { settings } = use('get.settings')
  const xi18n = settings?.i18n?.lanageManage
  const languagetypes = xi18n?.filter(item => item?.contentlanguage == true)

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onCheckChange = (e) => {
    const value = e.target.checked;
    input.onChange({ checked: value })
  }

  const onLanguageChange = (val) => {
    input?.onChange({
      ...input?.value,
      languages: val
    });
  }

  const options = languagetypes?.map(l => ({ value: l.code, label: l.name })) || []
  return <div>
    <Checkbox checked={input?.value?.checked} onChange={onCheckChange}>{_t1('启用')}</Checkbox>
    <Button onClick={showModal} disabled={!input?.value?.checked}><SettingOutlined /></Button>
    <Modal title={_t1("语言配置")} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
      okText={_t1("确定")} cancelText={_t1("取消")}>
      {
        !_.isEmpty(languagetypes) ? <Checkbox.Group
          options={options}
          defaultValue={input?.value?.languages}
          onChange={onLanguageChange}
        /> : <C is='NoData' />
      }
    </Modal>
  </div>
}

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

const TextFieldFormat = props => {
  const { input: { value, onChange } } = props

  const onChangeType = (type) => {
    onChange({ ...(value || {}), type })
  }
  const onChangeFormat = (format) => {
    onChange({ ...(value || {}), format })
  }

  const options = [
    { value: 'date', label: _t1('时间') },
    { value: 'number', label: _t1('数字') }
  ]

  const formatInput = { value: value.format, onChange: onChangeFormat }
  
  return (
    <>
      <Select
        options={options}
        value={value.type}
        onChange={onChangeType}
        allowClear
        placeholder={_t1('格式化类型')}
        style={{ margin: '5px 0' }}
      />
      {value.type == 'number' && <C is='Common.NumberFormat' input={formatInput} placeholder={_t1('列表中显示格式')} />}
      {value.type == 'date' && <C is='Common.DateFormat' input={formatInput} placeholder={_t1('列表中显示格式')} />}
    </>
  )
}

const TextSchema = {
  type: "object",
  name: _r("文本"),
  title: _r("文本"),
  icon: "inbox",
  key: "text",
  description: _r('可输入文本信息，文本信息类型可以是普通文本、密码、邮箱、电话、手机号、编号和身份证'),
  properties: {
    textContent: {
      title: _r("内容"),
      type: "string",
      enum: ['text', 'password', 'email', 'tel', 'mobile', 'id', 'logic', 'identityID'],
      enum_title: [_r('普通文本'), _r('密码'), _r('邮箱'), _r('电话'), _r('手机号'), _r('编号'), _r('公式计算'), _r('身份证号')],
      field: {
        effect: ({ value }, form) => {
          setTimeout(() => {
            const display = value === 'logic'
            form.setFieldData('jsLogic', { display })
            form.setFieldData('numRange', { display: !display })
            form.setFieldData('defaultVal', { display: !display })
            form.setFieldData('delBlank', { display: !display })
            form.setFieldData('editableFields', { display: !display })
            form.setFieldData('batchChangeFields', { display: !display })
            // form.setFieldData('disabled', { display: !display })
            if (['identityID', 'tel', 'mobile']?.indexOf(value) > -1) {
              form.setFieldData('numRange', { display: false })
            }
          })
        }
      }
    },
    jsLogic: {
      title: _r('公式'),
      type: 'string',
      permissionType: 'script',
      field: {
        component: LogicInput
      }
    },
    textType: {
      title: _r("类型"),
      type: "string",
      enum1: ['input', 'textArea'],
      enum_title1: [_r('单行'), _r('多行')],
      selectFace: "flatten",
      selectType: 'single'
    },
    filterType: {
      title: _r("过滤形式"),
      type: "string",
      enum1: ['select', 'input'],
      enum_title1: [_r('下拉'), _r('模糊搜索')],
      selectFace: "flatten",
      selectType: 'single'
    },
    numRange: {
      title: _r("字数限制"),
      type: "string",
    },
    filedFormat: {
      title: _t1('格式化'),
      type: 'object',
      properties: {},
      field: {
        component: TextFieldFormat,
      }
    },
    defaultVal: {
      title: _r("默认值"),
      type: "string",
      field: {
        keyName: 'defaultVal',
        component: (props) => <DVContainer><DefaultText {...props} /></DVContainer>
      }
    },
    delBlank: {
      title: _r("清除首尾空格"),
      type: 'boolean'
    },
    placeholder: {
      title: _r("引导文字"),
      type: "string",
      fieldType: 'languageInput'
    },
    metricStore,
    languageType: {
      type: 'object',
      title: _r('国际化'),
      field: {
        component: LanguageType
      }
    },
    ...baseConfig,
    ...editConfig
  },
  required: ["title", "key"],
  form: [keyForm, "title", "textContent", "jsLogic", "textType", "filterType", 'metricStore',
    { key: 'numRange', component: NumRange }, "defaultVal", '*', 'tableFixed'],
  formEffect: form => {
    form.useField('textContent', state => {
      form.setFieldData('textType', { display: state.value == 'text' })
      if (state.value != 'text') {
        form.change('textType', 'input')
      }
    })
    form.useField('filterFields', state => {
      form.setFieldData('filterType', { display: !!state.value })
    })
    commonFormEffect(form)
  }
}

export { NumRange }
export default TextSchema