import React from 'react'
import { app, api, use } from 'xadmin'
import { Select, Checkbox, Radio, Form } from 'antd'
import { getFormValues } from '../component/Editor/utils'
import { useScriptVal } from '../component/Editor/utils2'
import FormInfoComponent from './FormInfoComponent'
import { dealSchema } from './tool'

// 带全选的多选框
const CheckboxAll = props => {
  const { value, onChange, options } = props
  const [indeterminate, setIndeterminate] = React.useState(value?.length < options?.length && value?.length > 0);
  const [checkAll, setCheckAll] = React.useState(value?.length === options?.length);

  const handleChange = list => {
    onChange(list);
    setIndeterminate(!!list.length && list.length < options.length);
    setCheckAll(list.length === options.length);
  };

  const onCheckAllChange = e => {
    onChange(e.target.checked ? options.map(item => item.value) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return <>
    <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
      {_t1('全选')}
    </Checkbox>
    <Checkbox.Group {...props} onChange={handleChange} ></Checkbox.Group>
  </>
}

const getLabel = (val, values) => {
  if (val?.indexOf('LabelComponent') > -1) { // React组件
    return <FormInfoComponent schema={{ widgetContent: val }} outProps={values} />
  } else {
    return val
  }
}

const SelectComponent = props => {
  const { input: { onChange, value }, input, field: { schema, filter }, antdForm, allowClear = true, meta } = props

  // 字段脚本部分
  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema, value, values, record: props.record, onChange })
    }
  }, [JSON.stringify(values)])

  const { selectFace, selectType, defaultVal, disabled: dis, dataType } = dealSchema(schema, values, meta)
  const disabled = dis && !filter && !_.isEmpty(props.meta)

  const isNull = (v) => _.isNull(v) || _.isUndefined(v) || _.isNaN(v) || (_.isString(v) && _.isEmpty(v))

  const defaultValFormat = () => {
    if (selectType === 'multiple') {
      return dataType === 'number' ? defaultVal?.split(',').map(_.parseInt) : defaultVal?.split(',')
    } else {
      return dataType === 'number' ? _.parseInt(defaultVal || '') : defaultVal
    }
  }

  React.useEffect(() => {
    if (isNull(value) && !isNull(defaultVal) && !filter) {
      onChange && onChange(defaultValFormat())
    }
  }, [])

  const optionList = schema.enum1 ? schema.enum1.map((item, index) => {
    // 工作表特制
    return {
      value: item,
      label: schema.enum_color1 ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', transform: 'translateY(2px)' }}>
          <div style={{
            backgroundColor: schema.enum_color1[index],
            width: 16,
            height: 16,
            borderRadius: 3,
            marginRight: 4
          }}></div>
          <div>{getLabel(schema.enum_title1[index], values)}</div>
        </div>
      )
        : getLabel(schema.enum_title1[index], values),
      children: getLabel(schema.enum_title1[index], values)
    }
  }) : schema.enum ? schema.enum.map((item, index) => {
    // 普通
    return {
      value: item,
      label: schema.enum_title ? schema.enum_title[index] : item,
      children: getLabel(schema.enum_title1[index], values)
    }
  }) : []

  const handleChange = val => {
    onChange(_.isUndefined(val) ? null : val)
  }

  let val = (isNull(value) && !_.isNumber(value)) ? (selectType === 'multiple' ? [] : null) : value
  if (isNull(value) && !isNull(defaultVal) && !filter) {
    val = defaultValFormat()
  }
  return (
    selectFace === 'select' ? // 工作表特制下拉选
      <Select
        {...input}
        mode={selectType ?? null}
        value={val == 0 ? val : (val || undefined)}
        options={optionList}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        onChange={handleChange}
        style={{ width: '100%', minWidth: 120 }}
        placeholder={_t1("请选择")}
        disabled={disabled}
        size={schema.size}
        allowClear={allowClear}
        showSearch
      />
      : selectType === 'multiple' ? // 平铺多选
        <CheckboxAll {...input} value={val} options={optionList} onChange={handleChange} disabled={disabled} />
        : selectType === 'single' ? // 平铺单选
          <Radio.Group
            {...input}
            value={val}
            buttonStyle="solid"
            optionType={selectFace == 'button' ? 'button' : 'default'}
            options={optionList}
            onChange={e => handleChange(e.target.value)}
            disabled={disabled}
          ></Radio.Group>
          : // 普通下拉选
          <Select
            {...input}
            value={val == 0 ? val : (val || undefined)}
            options={optionList}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onChange={handleChange}
            style={{ width: '100%', minWidth: 120 }}
            placeholder={_t1("请选择")}
            disabled={disabled}
            size={schema.size}
            allowClear={allowClear}
            showSearch
          />
  )
}

export default SelectComponent