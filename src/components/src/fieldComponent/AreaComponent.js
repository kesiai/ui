import React from 'react'
import { Cascader, Form, TreeSelect } from 'antd'
import { getFormValues } from '../component/Editor/utils'
import { useScriptVal } from '../component/Editor/utils2'
import { loadPCAData } from './tool/pca'
import { use } from 'xadmin'
import _ from 'lodash'
import { dealSchema } from './tool'

const AreaComponent = props => {
  const { input: { onChange }, field: { schema, filter }, antdForm, meta, cellKey } = props
  const disabled = meta?.data?.disabled || false

  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)
  const { defaultVal, areaType, defaultValType, multiple = false } = dealSchema(schema, values)

  const value = props.input.value || props.input.value === 0 ? props.input.value : undefined
  const defaultValue = filter ? undefined : defaultVal
  
  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema, value, values, record: props.record, onChange })
    }
  }, [JSON.stringify(values)])

  React.useEffect(() => {
    setTimeout(() => { // 必须用setTimeout，否则会被拦截
      !props.input.value && defaultValue && defaultValType !== 'logic' && onChange && onChange(defaultValue)
    })
  }, [])

  return filter ?
    <PcaSelectFilter input={props.input} areaType={areaType} cellKey={cellKey} multiple={multiple} /> :
    <PcaSelect disabled={disabled} input={props.input} areaType={areaType} size={schema.size} cellKey={cellKey} multiple={multiple} />
}

const getData = (areaType, pcaData) => {
  let result
  if (areaType === 'p') { // 省
    result = pcaData.map(item => ({ value: item.label, label: item.label }))
  } else if (areaType === 'pc') { // 省市
    result = pcaData.map(item => ({
      value: item.label,
      label: item.label,
      children: item.children.map(item => ({ value: item.label, label: item.label }))
    }))
  } else { // 省市区
    result = pcaData.map(item => ({
      value: item.label,
      label: item.label,
      children: item.children.map(item => ({
        value: item.label,
        label: item.label,
        children: item.children.map(item => ({ value: item.label, label: item.label }))
      }))
    }))
  }
  return result
}

// 处理可能是单选格式的数据转换为多选格式的数组
const convertToMultipleFormat = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value]; // 如果是单个字符串值，转为数组作为多选的一项
}

// 将地区数据转换为TreeSelect格式，保持层级结构但支持独立选择
const getTreeDataWithHierarchy = (areaType, pcaData) => {
  let result = []
  
  if (areaType === 'p') { // 仅省
    result = pcaData.map(item => ({ 
      value: item.label, 
      title: item.label,
      key: item.label
    }))
  } else if (areaType === 'pc') { // 省市
    result = pcaData.map(province => ({
      value: province.label,
      title: province.label,
      key: province.label,
      children: province.children?.map(city => ({
        value: `${province.label}/${city.label}`,
        title: city.label,
        key: `${province.label}/${city.label}`
      })) || []
    }))
  } else { // 省市区
    result = pcaData.map(province => ({
      value: province.label,
      title: province.label,
      key: province.label,
      children: province.children?.map(city => ({
        value: `${province.label}/${city.label}`,
        title: city.label,
        key: `${province.label}/${city.label}`,
        children: city.children?.map(district => ({
          value: `${province.label}/${city.label}/${district.label}`,
          title: district.label,
          key: `${province.label}/${city.label}/${district.label}`
        })) || []
      })) || []
    }))
  }
  return result
}

// 处理单个地址数据
const dealOldData = (v, pcaData) => {
  let list = v?.split('-') || []
  if (list.length > 0) {
    let result = []
    let data1 = pcaData.find(p => p.value === list[0])
    if (data1) {
      result.push(data1.label)
      let data2 = data1.children?.find(p => p.value === list[1])
      if (data2) {
        result.push(data2.label)
        let data3 = data2.children?.find(p => p.value === list[2])
        if (data3) {
          result.push(data3.label)
        }
      }
    }
    return result.length > 0 ? result.join('/') : v
  } else {
    return v
  }
}

const PcaSelect = ({ input, areaType, defaultValue, size, multiple = false, disabled }) => {
  if (input.value && !_.isString(input.value)) {
    console.error('区域组件值类型错误：', input.value)
  }
  const [pcaData, setPcaData] = React.useState([])
  React.useEffect(() => {
    loadPCAData().then(res => {
      setPcaData(res)
    })
  }, [])
  if (!areaType) {
    const path = input.name?.substring(0, input.name?.lastIndexOf('.') + 1)
    areaType = use('form', state => ({
      areaType: _.get(state.values, path + 'areaType')
    })).areaType
  }
  
  // 多选模式使用TreeSelect，保持层级结构
  if (multiple) {
    const treeData = getTreeDataWithHierarchy(areaType, pcaData)
    const valueArray = convertToMultipleFormat(input.value)
    
    return <TreeSelect
      disabled={disabled}
      treeData={treeData}
      value={valueArray}
      onChange={values => {
        // 确保输出的是字符串数组，包含完整的层级路径
        const result = values ? values.map(value => {
          if (typeof value === 'object' && value.value) {
            return value.value; // 如果是对象，取其value属性
          }
          return value; // 如果已经是字符串，直接返回
        }) : []
        input.onChange(result)
      }}
      placeholder={_t1("请选择")}
      size={size}
      multiple
      treeCheckable
      showCheckedStrategy={TreeSelect.SHOW_ALL} // 显示所有选中项
      treeCheckStrictly // 关键属性：父子节点选中状态不再关联
      treeDefaultExpandAll={false}
      allowClear
      maxTagCount={3}
      style={{ width: '100%' }}
    />
  }
  
  // 单选模式保持原有逻辑
  let data = getData(areaType, pcaData)
  
  let val = dealOldData(input.value, pcaData) ?
    dealOldData(input.value, pcaData).split('/')
    : dealOldData(defaultValue, pcaData)?.split('/')
  
  return <Cascader
    disabled={disabled}
    options={data}
    value={val}
    onChange={val => {
      input.onChange(val?.join('/'))
    }}
    placeholder={_t1("请选择")}
    size={size}
    displayRender={(label, selectedOptions) => {
      return label.join('/')
    }}
  />
}

// 过滤器
const PcaSelectFilter = ({ input, areaType, cellKey, multiple = false }) => {
  const [pcaData, setPcaData] = React.useState([])
  React.useEffect(() => {
    loadPCAData().then(res => {
      setPcaData(res)
    })
  }, [])

  const handleChange = val => {
    if (!val || (Array.isArray(val) && val.length === 0)) {
      input.onChange(null)
      return
    }
    
    if (multiple) {
      // 多选模式下的处理 - 确保输出字符串数组格式
      const result = val.map(value => {
        if (typeof value === 'object' && value.value) {
          return value.value; // 如果是对象，取其value属性
        }
        return value; // 如果已经是字符串，直接返回
      })
      input.onChange({ "in": result });
    } else {
      // 原有单选模式处理
      let v = _.isArray(val) ? val.join('/') : null
      input.onChange({ "like" : v })
    }
  }
  
  // 多选模式使用TreeSelect，保持层级结构
  if (multiple) {
    const treeData = getTreeDataWithHierarchy(areaType, pcaData)
    const currentValue = input.value?.in || []
    
    return <TreeSelect
      treeData={treeData}
      value={currentValue}
      onChange={handleChange}
      placeholder={_t1("请选择")}
      multiple
      treeCheckable
      showCheckedStrategy={TreeSelect.SHOW_ALL}
      treeCheckStrictly // 关键属性：父子节点选中状态不再关联
      treeDefaultExpandAll={false}
      allowClear
      maxTagCount={3}
      style={{ width: '100%' }}
      dropdownClassName={cellKey ? `dropdown_${cellKey}` : null}
    />
  }
  
  // 单选模式保持原有逻辑
  let data = getData(areaType, pcaData)
  let value = input.value?.like?.split('/') || input.value?.split('/')
  
  return <Cascader
    options={data}
    value={value}
    onChange={val => {
      let v = _.isArray(val) ? val.join('/') : null
      input.onChange({ "like" : v })
    }}
    placeholder={_t1("请选择")}
    changeOnSelect
    dropdownClassName={cellKey ? `dropdown_${cellKey}` : null}
  />
}

const AreaShow = ({ value, WrapComponent }) => {
  const [pcaData, setPcaData] = React.useState([])
  React.useEffect(() => {
    loadPCAData().then(res => {
      setPcaData(res)
    })
  }, [])

  value = value || ''
  let result = []
  let l = []
  if (typeof value !== 'string') {
    // 流程插入数据格式不确定
  } else if (value.indexOf('-') > -1) {
    l = value.split('-')
  } else if (value.indexOf('/') > -1) { // 主要为了处理导入
    l = value.split('/')
  } else {
    l = [value]
  }

  const add = (list = [], num) => {
    if (l[num]) {
      let temp = list.find(item => item.value === l[num] || item.label === l[num]) || {}
      result.push(temp.label)
      add(temp.children, num + 1)
    }
  }
  add(pcaData, 0)

  return <WrapComponent>{result.join('/')}</WrapComponent>
}

export { PcaSelect, AreaShow }

export default AreaComponent
