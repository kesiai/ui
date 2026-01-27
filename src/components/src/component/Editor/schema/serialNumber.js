import React from 'react'
import { baseConfig, editConfig, keyForm } from './common'
import { Input, Select, Button, Dropdown, Menu, Modal, InputNumber, Tooltip, Radio } from 'antd'
import { SchemaForm } from 'xadmin-form'
import { use } from 'xadmin'
import Icon from '../component/Icon'
import { DeleteOutlined } from '@ant-design/icons';
import FormPanelSerial from '../dropTool/FormPanel2'
import _ from 'lodash'
const RulesComponent = ({ input }) => {
  

  const addRule = (type) => {
    let obj = { type, key: Math.random() }
    if (type === 'num') obj.num = { orderType: 'random', bitNum: 4 } // 序号默认随机，4位
    input.onChange([ ...input.value, obj ])
  }

  const delRule = (val) => {
    let result = []
    input.value.forEach(item => {
      if (item.key !== val.key) {
        result.push(item)
      }
    })
    input.onChange(result)
  }

  const changeOneRule = (val) => {
    let result = []
    input.value.forEach(item => {
      if (item.key === val.key) {
        result.push(val)
      } else {
        result.push(item)
      }
    })
    input.onChange(result)
  }

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <div onClick={() => addRule('num')}>{_t1('序号')}</div>
      </Menu.Item>
      <Menu.Item key="1">
        <div onClick={() => addRule('text')}>{_t1('固定内容')}</div>
      </Menu.Item>
      <Menu.Item key="2">
        <div onClick={() => addRule('time')}>{_t1('创建时间')}</div>
      </Menu.Item>
    </Menu>
  )

  const moveCard = (dragIndex, hoverIndex) => {
    if (input.value?.length > 0) {
      const result = [...input.value]
      result[dragIndex] = input.value[hoverIndex]
      result[hoverIndex] = input.value[dragIndex]
      input.onChange(result)
    }
  }

  return (<>
    <Dropdown overlay={menu} trigger={['click']}>
      <Button >{_t1('添加规则')}</Button>
    </Dropdown>
    <div id="serial-number">
      {
        input.value?.length > 0 ? 
        input.value.map((item, i) => (
          <FormPanelSerial key={item.key} index={i} id={item.key} name="serial-number" moveCard={moveCard}>
            <OneRule input={{ value: item, onChange: changeOneRule }} />
            <DeleteOutlined onClick={() => delRule(item)} style={{ marginLeft: 5, cursor: 'pointer' }} />
          </FormPanelSerial>
        ))
        : null
      }
    </div>
  </>)
}

const OneRule = ({ input }) => {
  
  const [text, setText] = React.useState(input.value?.text)

  const handleChange = (name, value) => {
    input.onChange(({ ...input.value, [name]: value }))
  }

  const optionList = [
    { label: _t1('年月日-时分秒'), value: 'YYYYMMDD-HHmmss' },
    { label: _t1('年月日'), value: 'YYYYMMDD' },
    { label: _t1('年月'), value: 'YYYYMM' },
    { label: _t1('年'), value: 'YYYY' },
    { label: _t1('月日'), value: 'MMDD' },
    { label: _t1('月'), value: 'MM' },
    { label: _t1('日'), value: 'DD' }
  ]

  return input.value?.type === 'num' ? 
  (<div className="num-div">
    <span className="num-label">{_t1('序号')}</span>
    <OrderNum input={{ value: input.value?.num, onChange: value => handleChange('num', value) }} />
  </div>)
  : input.value?.type === 'text' ? 
  (<div className="num-div">
    <span className="num-label">{_t1('固定内容')}</span>
    <Input value={text} onChange={e => setText(e.target.value)} onBlur={e => handleChange('text', text)} />
  </div>)
  : input.value?.type === 'time' ? 
  (<div className="num-div">
    <span className="num-label">{_t1('创建时间')}</span>
    <Select options={optionList} value={input.value?.time} onChange={val => handleChange('time', val)} />
  </div>)
  : null
}

const schema = {
  type: 'object',
  name: _r('序号设置'),
  properties: {
    orderType: {
      title: _r("编号方式"),
      type: "string",
      enum1: ['random', 'linear'],
      enum_title1: [_r('随机'), _r('线性')],
      selectFace: "flatten",
      selectType: 'single'
    },
    bitNum: {
      title: _r('位数'),
      type: 'number'
    },
    notPatchNum: {
      title: _r('补齐位数'),
      type: 'boolean'
    },
    startNum: {
      title: _r('起始序号'),
      type: 'number'
    },
    stepNum: {
      title: _r('步长'),
      type: 'number'
    }
  },
  form: [
    'orderType',
    {
      key: 'bitNum',
      component: ({ input }) => {
        return <InputNumber max={10} min={1} style={{ width: '90%' }} {...input} />
      }
    },
    {
      key: 'notPatchNum',
      component: ({ input }) => {
        
        const handleChange = e => {
          input.onChange(e.target.value)
        }
        return (
          <Radio.Group value={input.value} onChange={handleChange}>
            <Radio value={false}>{_t1('是')}</Radio>
            <Radio value={true}>{_t1('否')}</Radio>
          </Radio.Group>
        )
      }
    }, 'startNum', 'stepNum'
  ],
  formEffect: (form) => {
    form.useField('orderType', state => {
      if (state.value === 'random') {
        form.setFieldData('startNum', { display: false, required: false })
        form.setFieldData('stepNum', { display: false, required: false })
        form.setFieldData('notPatchNum', { display: false })
        form.change('startNum', null)
        form.change('stepNum', null)
      } else {
        form.setFieldData('startNum', { display: true, required: true })
        form.setFieldData('stepNum', { display: true, required: true })
        form.setFieldData('notPatchNum', { display: true })
      }
    })
  }
}

const OrderNum = ({ input }) => {
  const [visiable, setVisiable] = React.useState(false)
  const { transI18n } = use('model.transI18n')
  

  const valueFormat = () => {
    let str = ''
    str += input.value?.orderType === 'linear' ? _t1('线性') + '，' : _t1('随机') + '，'
    str += input.value?.bitNum + _t1('位')
    return str
  }
  
  return (<>
    <Input value={valueFormat()} onClick={() => setVisiable(true)} />
    <Modal width={450} title={_t1("序号设置")} visible={visiable} footer={null} onCancel={() => setVisiable(false)}>
      {React.useMemo(() => (<SchemaForm formKey={'num-setting'} schema={transI18n(schema)}
        onSubmit={val => {
          input.onChange(val)
          setVisiable(false)
        }}
        initialValues={input.value}
      />), [])}
    </Modal>
  </>)
}

const SerialNumberSchema = {
  type: "object",
  name: _r("编号"),
  title: _r("编号"),
  description:_r('可在创建表记录时自动显示编号，编号规则可以是序号、固定内容和创建时间'),
  icon: "inbox",
  key: "text",
  properties: {
    serialRules: {
      title: _r("编号规则"),
      type: "array",
      items: {}
    },
    placeholder: {
      title: _r("引导文字"),
      type: "string",
      fieldType: 'languageInput'
    },
    ...baseConfig,
    ..._.omit(editConfig, ['allScript'])
  },
  required: ["title", "key"],
  form: [keyForm, "title",
    { key: "serialRules", component: RulesComponent },
    "placeholder", 'listFields', 'filterFields', 'canOrder',
    'description', 'descriptionType', 'unique', 'widthInForm', 'tableFixed'
  ],
  formEffect: form => {
    // form.useField('textContent', state => {})
  }
}

export default SerialNumberSchema