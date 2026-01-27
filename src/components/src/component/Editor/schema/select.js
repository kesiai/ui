import React, { useState } from 'react'
import _ from 'lodash'
import { Input, Button, Select, Switch, Radio, message, Popover } from 'antd'
import { SwapOutlined } from '@ant-design/icons';
import { SketchPicker } from 'react-color'
import { baseConfig, editConfig, keyForm, commonFormEffect, FieldScriptInput, metricStore } from './common'
import { NumRange } from './text'
import { use, api } from 'xadmin'
import Icon from '../component/Icon'
import { TableContext } from '../context'
import LanguageType from '../component/LanguageType'
import FormPanelSerial from '../dropTool/FormPanel2'

const { Option } = Select

const NewSelectConfig = (props) => {
  const { tableInfo } = React.useContext(TableContext)
  const language = tableInfo?.languageType?.languages
  // 当key用
  const [keys, setKeys] = React.useState(Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000)))

  const { input: { value, onChange, onFocus, onBlur } } = props

  const state = {
    vs: value && value.value || [],
    ls: value && value.label || [],
    cl: value && value.color || [],
    lls: !_.isEmpty(value.language) ? value.language : language?.reduce((prev, l) => {
      if (_.isString(prev)) {
        return {
          [prev]: new Array(value?.value?.length || 0).fill(''),
          [l]: new Array(value?.value?.length || 0).fill('')
        }
      } else {
        return { ...prev, [l]: new Array(value?.value?.length || 0).fill('') }
      }
    }) || {} // 
  }
  const [ifColor, setIfColor] = React.useState(value.color && value.color.length > 0)
  
  const updata = (value, label, color, language) => {
    let result = value && value.length > 0 ? { value, label, language } : null
    if (value && value.length > 0 && ifColor) {
      result.color = color
    } else if (value && value.length > 0 && !ifColor) {
      delete result.color
    }
    onChange(result)
    onBlur()
  }

  React.useEffect(() => updata(state.vs, state.ls, state.cl, state.lls), [ifColor])

  const AddOption = () => {
    let newValues = [...state.vs, '']
    let newLabels = [...state.ls, '']
    let newColors = [...state.cl, '']
    let newLanguage = _.cloneDeep(state.lls)
    Object.keys(newLanguage).forEach(key => {
      newLanguage[key] = [...newLanguage[key], '']
    })
    updata(newValues, newLabels, newColors, newLanguage)
  }
  const deleteOption = index => {
    let nvs = [...state.vs]
    let nls = [...state.ls]
    let ncl = [...state.cl]
    let nlls = _.cloneDeep(state.lls)
    nvs.splice(index, 1)
    nls.splice(index, 1)
    ncl.splice(index, 1)
    Object.keys(nlls).forEach(key => {
      nlls[key].splice(index, 1)
    })
    updata(nvs, nls, ncl)
  }
  const changeOption = ({ index, value, label, color, language }) => {
    let nvs = [...state.vs]
    let nls = [...state.ls]
    let ncl = [...state.cl]
    let lang = _.cloneDeep(state.lls)
    if (!_.isNil(value)) nvs[index] = value
    if (!_.isNil(label)) nls[index] = label
    if (!_.isNil(color)) ncl[index] = color
    if (!_.isNil(language?.val) && language.name) {
      const n = 'enum_title1_' + language.name
      if (!lang[n]) lang[n] = []
      lang[n][index] = language.val
    }
    updata(nvs, nls, ncl, lang)
  }

  const moveCard = (dragIndex, hoverIndex) => {
    const turn = (i, j, array = []) => {
      let result = _.cloneDeep(array)
      result[i] = array[j]
      result[j] = array[i]
      return result
    }
    let result = {
      label: turn(dragIndex, hoverIndex, value.label),
      value: turn(dragIndex, hoverIndex, value.value)
    }
    if (value.color) {
      result.color = turn(dragIndex, hoverIndex, value.color)
    }
    if (!_.isEmpty(value.language)) {
      result.language = {}
      Object.keys(value.language).forEach(key => {
        result.language[key] = turn(dragIndex, hoverIndex, value.language[key])
      })
    }
    onChange(result)
  }

  return (
    <div style={{ width: '100%' }} id="select-option">
      <Button onClick={AddOption} type="primary" style={{ width: 40, marginRight: 5 }} size={'small'}><Icon type="plus" /></Button>
      <Switch checked={ifColor} onChange={setIfColor} checkedChildren={_t1("彩色")} unCheckedChildren={_t1("无色")} />
      {state?.vs?.map((value, i) => {
        return <FormPanelSerial key={keys[i]} index={i} id={keys[i]} name="select-option" moveCard={moveCard}>
          <SelectOption
            key={i}
            index={i}
            value={value}
            ifColor={ifColor}
            {...props}
            label={state.ls[i]}
            color={state.cl[i]}
            changeOption={changeOption}
            deleteOption={deleteOption}
          />
        </FormPanelSerial>
      })}
    </div>
  )
}

const initLabel = `LabelComponent = (props) => { // props为表单内容
  return <span style={{ color: 'red' }}>TEXT</span>
}`

const SelectOption = props => {
  const { index, label, value, color, deleteOption, changeOption, ifColor } = props
  const { form, formState } = use('form')
  
  const [dataType, setDataType] = React.useState('string')
  const type = label?.indexOf('LabelComponent') > -1 ? 'script': 'string'
  React.useEffect(() => {
    form.useField('dataType', ({ value }) => setDataType(value))
  }, [])

  const colorList = ['#f5222d', '#fadb14', '#52c41a', '#1890ff', '#722ed1', '#eb2f96']

  const onChangeValue = e => {
    let v = dataType === 'number' ? parseFloat(e.target.value) : e.target.value
    changeOption({ index, value: v })
  }
  const onChangeLable = e => {
    changeOption({ index, label: e.target.value })
  }
  const onChangeColor = val => {
    changeOption({ index, color: val || '' })
  }
  const onChangeLang = (val, name) => {
    changeOption({ index, language: { val, name } })
  }
  const onChangeType = () => {
    if (type === 'script') {
      changeOption({ index, label: '' })
    } else {
      changeOption({ index, label: initLabel })
    }
  }

  const fv = formState?.values || {}
  let languageValue = {}
  Object.keys(fv).filter(key => key.indexOf('enum_title1_') > -1).forEach(key => {
    languageValue[key.substring(12)] = fv[key][index]
  })
  return (
    <Input.Group compact style={{ margin: '4px 0' }} >
      <Input
        key={ifColor ? 'aaa' : 'bbb'} // 不写的话，antd会加伸缩动画
        type={dataType}
        placeholder={_t1("值")}
        style={{ width: 'calc(100% - 42px)' }}
        defaultValue={value}
        value={value}
        onChange={onChangeValue}
      />
      <Button onClick={() => deleteOption(index)} style={{ width: 42, height: 32 }} size={'small'} ><Icon type="minus" /></Button>
      {
        ifColor && <Select
          value={color && colorList.indexOf(color) === -1 ? 'add' : color}
          onChange={onChangeColor}
          style={{ width: color && colorList.indexOf(color) === -1 ? 'calc(100% - 40px)' : '100%' }}
          allowClear
        >
          {colorList.map(item => (<Option value={item}>
            <div style={{ backgroundColor: item, width: 26, height: 16, borderRadius: 4, margin: '7px auto' }}></div>
          </Option>))}
          <Option value={'add'}>
            <div style={{ textAlign: 'center', width: '100%' }} >
              {_t1("自定义")}
            </div>
          </Option>
        </Select>
      }
      {
        ifColor && color && colorList.indexOf(color) === -1 && <Popover overlayClassName="color-picker-swatch"
          content={<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}  >
            <SketchPicker color={color || 'rgb(170,170,170)'} onChange={(v) => onChangeColor(v?.hex)} />
          </div>} trigger="click">
          <div className="select-color-picker" style={{ backgroundColor: color }} >
            {color ? '' : <Button type="dashed" block>{_t1('选择颜色')}</Button>}
          </div>
        </Popover>
      }
      <div style={{ display: "flex" }}>
        {
          type === 'script' ? <FieldScriptInput
            btnStyle={{ width: 'calc(100% - 44px)' }}
            input={{
              value: label,
              onChange: val => changeOption({ index, label: val })
            }}
          /> : <LanguageType field={{
            style: { width: 'calc(100% - 44px)' },
            placeholder: _t1("名称"),
            value: label,
            onChange: onChangeLable,
            languageValue,
            languageChange: onChangeLang
          }} />
        }
        <Button onClick={onChangeType}><SwapOutlined /></Button>
      </div>
    </Input.Group>
  )
}

const DefaultVal = props => {
  const { input: { value, onChange } } = props
  const { select, selectType, dataType } = use('form', state => ({
    select: state.values.select || {},
    selectType: state.values.selectType,
    dataType: state.values.dataType
  }))
  const [val, setVal] = React.useState(() => {
    if (selectType === 'multiple') {
      if (value && value.split(',').length > 0) {
        return dataType === 'number' ? value.split(',').map(parseFloat) : value.split(',')
      } else {
        return []
      }
    } else {
      return dataType === 'number' ? parseFloat(value || '') : value
    }
  })

  React.useEffect(() => {
    if (selectType === 'multiple' && !_.isArray(val)) {
      setVal([])
      onChange(null)
    } else if (selectType !== 'multiple' && _.isArray(val)) {
      setVal(null)
      onChange(null)
    }
  }, [selectType])

  const handleChange = value1 => {
    if (_.isUndefined(value1)) value1 = null
    if (selectType === 'multiple') {
      setVal(value1)
      onChange(value1.join(','))
    } else {
      setVal(value1)
      onChange(dataType === 'number' ? value1?.toString() : value1)
    }
  }

  return <Select mode={selectType ?? null} value={val}
    options={select.label ? select.label.map((item, index) => ({ label: item, value: select.value[index] })) : []}
    onChange={handleChange} style={{ width: '100%' }} allowClear>
  </Select>
}

const TypeSelect = ({ input }) => {
  const { list } = React.useContext(TableContext)
  // const { form } = use('form')
  // const [ifDep, setIfDep] = React.useState(false)

  // 关联部门表只能多选
  // React.useEffect(() => {
  //   form.useField('relate', ({ value }) => {
  //     if (value?.tt === 'department') {
  //       setIfDep(true)
  //       form.change('selectType', 'multiple')
  //     } else {
  //       setIfDep(false)
  //     }
  //   })
  // }, [])

  return <Radio.Group
    value={input.value}
    options={[
      { value: 'single', label: _t1('单选') },
      { value: 'multiple', label: _t1('多选') }
    ]}
    onChange={e => {
      if (list?.length > 0) message.warning(_t1('表已有数据，切换单多选可能引起数据异常'))
      input.onChange(e.target.value)
    }}
  />
}

const SelectFace = ({ input }) => {
  const { selectType } = use('form', state => ({ selectType: state.values?.selectType }))
  let options = [
    { value: 'select', label: _t1('下拉') },
    { value: 'flatten', label: _t1('平铺') }
  ]
  if (selectType == 'single') options.push({ value: 'button', label: _t1('按钮') })

  return <Radio.Group
    value={input.value}
    options={options}
    onChange={e => {
      input.onChange(e.target.value)
    }}
  />
}

const SelectSchema = {
  type: 'object',
  name: _r('选择器'),
  title: _r('选择器'),
  description: _r('可从预设的选项中选择一项或多项'),
  icon: 'inbox',
  key: 'select',
  properties: {
    ...baseConfig,
    selectType: {
      title: _r('类型'),
      type: 'string',
      field: {
        effect: (f, form) => {
          const value = f.value
          if (value === 'multiple') {
            form.setFieldData('filterFields', { display: false })
            form.setFieldData('numRange', { display: true })
            form.change('filterFields', false)
            form.change('selectFace', 'select')
          } else {
            form.setFieldData('filterFields', { display: true })
            form.setFieldData('numRange', { display: false })
            form.change('numRange', null)
          }
        },
        component: TypeSelect
      }
    },
    selectFace: {
      title: _r('显示形式'),
      type: 'string',
      field: {
        component: SelectFace
      }
    },
    dataType: {
      title: _r('数据类型'),
      type: 'string',
      enum1: ['string', 'number'],
      enum_title1: [_r('字符串'), _r('数字')],
      selectFace: "flatten",
      selectType: 'single',
      field: {
        effect: (f, form) => {
          const value = f.value
          if (value === 'number') {
            form.change('select', {
              label: [_t1('选项1'), _t1('选项2'), _t1('选项3')],
              value: [1, 2, 3]
            })
          } else {
            form.change('select', {
              label: [_t1('选项1'), _t1('选项2'), _t1('选项3')],
              value: ['1', '2', '3']
            })
          }
        }
      }
    },
    select: {
      title: _r('选项'),
      type: 'object',
      properties: {},
      field: {
        validate: (v) => {
          if (v && v.value) {
            if ((new Set(v.value)).size < v.value.length) {
              return _t1('选项值不能重复')
            }
          }
          return null
        }
      }
    },
    numRange: {
      title: _r("可选项数"),
      type: "string",
    },
    defaultVal: {
      title: _r("默认选项"),
      type: "string",
    },
    metricStore,
    ...editConfig
  },
  required: ['title', 'key', 'select'],
  form: [
    keyForm,
    'title', 'selectType', 'selectFace', 'dataType', 'metricStore',
    { key: 'select', component: NewSelectConfig },
    { key: 'numRange', component: NumRange },
    { key: 'defaultVal', component: DefaultVal },
    '*'
  ],
  formEffect: (form) => {
    let { selectType } = form.getState().values
    if (selectType === 'multiple') { // 如果是选择器多选
      form.setFieldData('filterFields', { display: false })
      form.setFieldData('numRange', { display: true })
      form.change('filterFields', false)
    } else {
      form.setFieldData('filterFields', { display: true })
      form.setFieldData('numRange', { display: false })
      form.change('numRange', null)
    }
    form.useField('dataType', state => {
      form.setFieldData('metricStore', { display: state.value === 'number' })
      if (state.value === 'string') form.change('metricStore', false)
    })
    commonFormEffect(form)
  }
}

export default SelectSchema
export { TypeSelect }
