import React from "react";
import _ from 'lodash'
import { _t } from 'xadmin-i18n'
import { Select, Spin, Empty, Modal, Button, Card, Form } from 'antd'
import { app, api, use } from 'xadmin'
import { C, Icon } from 'xadmin-ui'
import { useScriptVal, dealFilter } from '../component/Editor/utils2'
import { getFormValues } from '../component/Editor/utils'
import { dealSchema } from "./tool";

const useOpts = (props) => {
  const { field } = props
  const [loading, setLoadig] = React.useState(true)
  const [options, setOptions] = React.useState([])
  const itemsRef = React.useRef([])

  const currentPageRef = React.useRef(0)
  const { getQueryFilter } = use('queryEditor.methods')
  let getFormState = () => { }
  try {
    getFormState = use('form')?.getFormState
  } catch (e) { }

  const loadOptions = React.useCallback((inputValue, page = 0,) => {
    if (currentPageRef.current >= page) {
      if (page !== 0) {
        return
      } else {
        itemsRef.current = []
      }
    }
    currentPageRef.current = page
    const displayField = field.displayField || 'name'
    let filterObj = inputValue ? { search: { [displayField]: { like: inputValue } } } : { search: {} }
    setLoadig(true)
    dealFilter(filterObj, field, getQueryFilter, getFormState)

    // 显示字段
    const showField = field.showField
    const fields = showField ? ['id', displayField, showField] : ['id', displayField]

    // schema 里的 users 要改为 usersId
    for (let key in filterObj.search) {
      if (key === 'users') {
        filterObj.search.usersId = filterObj.search.users
        delete filterObj.search.users
      }
    }

    return api(field.schema?.name ? field.schema : { name: 'User' })
      .query({ limit: 50, skip: page * 50, fields }, filterObj)
      .then(({ items }) => {
        const vList = props.value || []
        itemsRef.current = [
          ...itemsRef.current,
          ...items.map(item => {
            return { value: item.id, label: item[displayField], item }
          }).filter(item => !(field.relateSchema?.ignoreAdmin && item.value === 'admin'))
        ]

        if (vList[0]?.key && !vList[0]?.label && !items.find(item => item.id === vList[0].key)) {
          // 作为过滤条件，默认值只有key，没有label，只查询50条时，没有这一条会显示ID，需要重新查一次
          api(field.schema?.name ? field.schema : { name: 'User' })
            .query({ limit: 1, fields }, {
              search: { id: vList[0]?.key },
              noMessage: true
            }).then(({ items }) => {
              setLoadig(false)
              setOptions([
                { value: items?.[0]?.id, label: items?.[0]?.[displayField], item: items?.[0] },
                ...itemsRef.current
              ].filter(item => !(field.relateSchema?.ignoreAdmin && item.value === 'admin')))
              // setIsDel(false)
            })
        } else {
          setLoadig(false)
          setOptions(itemsRef.current.filter(item => !(field.relateSchema?.ignoreAdmin && item.value === 'admin')))
        }
        return items.length

      }).catch(e => setLoadig(false))

  }, [JSON.stringify(field)])

  React.useEffect(() => {
    loadOptions()
  }, [field?.schema?.name])

  return { ...props, loadOptions, loading, options }
}

const AsyncSelect = props => {
  const { field, loadOptions, loading, options, value, isOptionSelected, label, onChange, style, ...extraProps } = useOpts(props)
  const [page, setPage] = React.useState(0)
  const [count, setCount] = React.useState(50)
  const searchRef = React.useRef(null)

  // 查询过滤时，缓存全部 options，提供给 onChange 时获取单条数据
  const [allOptions, setAllOptions] = React.useState(options)
  React.useEffect(() => {
    setAllOptions(before => {
      return _.unionWith(before, options, _.isEqual) // 数组合并去重
    })
  }, [options])

  // 关联字段下拉字段处理
  const fieldSchema = field && field.fieldSchema
  const getData = React.useCallback(() => options.reduce((prev, opt) => {
    if (fieldSchema && fieldSchema.enum && fieldSchema.enum.indexOf(opt.label) >= 0) {
      const i = fieldSchema.enum.indexOf(opt.label)
      const label = fieldSchema.enum_title[i] || opt.label
      prev[opt.value] = { ...opt, key: opt.value, label }
    } else if (fieldSchema && fieldSchema.enum1 && fieldSchema.enum1.indexOf(opt.label) >= 0) {
      const i = fieldSchema.enum1.indexOf(opt.label)
      const label = fieldSchema.enum_title1[i] || opt.label
      prev[opt.value] = { ...opt, key: opt.value, label }
    } else {
      prev[opt.value] = { key: opt.value, ...opt }
    }
    return prev
  }, {}), [options, fieldSchema])

  const data = getData()

  const onItemChange = (selectOpt) => {
    if (!selectOpt) {
      onChange({})
    } else {
      const value = _.isArray(selectOpt) ?
        selectOpt.map(({ key }) => {
          let result = allOptions.filter(item => item.value === key)
          return result[0] || _.find(value, v => v.key == key) || null
        }).filter(Boolean)
        : data[selectOpt.key]
      onChange(value)
    }
  }

  const getOptions = React.useCallback(() => {
    let options = Object.values(data)
    if (extraProps.mode == 'multiple' && value) {
      const selected = value.map(v => v.key)
      options = options.filter(opt => selected.indexOf(opt.key) == -1)
    }
    return (options || []).filter(f => !_.isNil(f.label))
  }, [data, extraProps.mode, value])

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight) {
      // if (count === 50) {
      setPage((prevPage) => prevPage + 1);
      // }
    }
  };

  const onSearch = async (value, precise) => {
    searchRef.current = value
    const _count = await loadOptions(value, 0, precise)  // 修改这里，直接传入value而不是searchRef.current
    setCount(_count)
    setPage(0)
  }
  const onDropdownVisibleChange = (visiable) => {
    if (visiable) {
      loadOptions()
      setPage(0)
    }
  }

  React.useEffect(() => {
    (async () => {
      if (page >= 1) {
        const _count = await loadOptions(searchRef.current, page)
        setCount(_count)
      }
    })()
  }, [page])

  const useOptions = getOptions()

  let defaultValue = null
  if (extraProps.mode == 'multiple') {
    defaultValue = loading ? [] :
      value && _.isArray(value) && value.map(v => data[v.key] || v) || []
  } else {
    defaultValue = loading ? null :
      (value && _.isObject(value)) ? ({ ...value, value: value.key }) : null
  }

  return (
    <Select
      showSearch
      labelInValue
      allowClear
      loading={loading}
      value={defaultValue ? defaultValue : (isOptionSelected ? Object.values(data).filter(isOptionSelected) : undefined)}
      notFoundContent={<C is="NoData" />}
      // dropdownRender={menu => loading ? <div style={{ margin: '2px', textAlign: 'center' }}><Spin size="small" /></div> : menu}
      // onSearch={loadOptions}
      // onDropdownVisibleChange={onDropdownVisibleChange}
      onChange={onItemChange}
      filterOption={false}
      placeholder={_t1(label)}
      style={{ minWidth: 150, ...style }}
      size={field.relateSchema?.size}
      onSearch={onSearch}
      dropdownRender={(menu) => (
        <>
          {menu}
          {loading && page !== 0 ? <div style={{ textAlign: 'center', padding: '4px', color: '#bfbfbf' }}>加载中 <Icon type="loading"></Icon></div> : null}
          {(!loading && count < 50) ? <div style={{ textAlign: 'center', padding: '4px', color: '#bfbfbf' }}>已加载全部</div> : null}
        </>
      )}
      onPopupScroll={handleScroll}
      {...extraProps}
    >
      {useOptions.map(d => <Select.Option key={d.key}>{d?.label?.toString()}</Select.Option>)}
    </Select>
  )
}

const UserRoleComponent = props => {
  const { input: { value: item, onChange }, label, field, relateSchema: schema = {}, antdForm, meta } = props
  const displayField = field.displayField || 'name'

  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)
  const { disabled } = dealSchema(props.relateSchema, values, meta)

  // 默认值生效
  React.useEffect(() => {
    const defaultVal = schema?.defaultVal
    setTimeout(() => { // 必须用setTimeout，否则会被拦截
      !item && defaultVal && onChange && onChange(defaultVal)
    })
  }, [])

  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({
        schema,
        value: item,
        values,
        record: props.record,
        onChange
      })
    }
  }, [JSON.stringify(values)])

  return field.mode === 'multiple' ? (
    <AsyncSelect mode="multiple"
      value={!_.isEmpty(item) && _.isArray(item) ? item.map(item => ({ key: item?.id, item, label: item?.[displayField] })) : null}
      onChange={(options) => {
        onChange(options.map(opt => opt.item))
      }}
      field={field}
      label={label}
      disabled={disabled}
    />
  ) : (
    <AsyncSelect
      value={item && _.isObject(item) ? { item, label: item[displayField], key: item.id } : null}
      onChange={(option) => {
        option && option.length > 0 ? onChange(option.map(item => item.item)) : onChange(option.item)
      }}
      field={field}
      label={label}
      disabled={disabled}
    />
  )
}

const FilterUserRole = props => {
  const { input: { value, onChange, name }, label, field, relateSchema } = props
  const multi = relateSchema?.selectType === 'multiple'

  let defaultValue
  if (multi) {
    defaultValue = value?.or?.map(v => ({ key: v?.[name]?.$regex })) || []
  } else {
    defaultValue = value?.in?.map(v => ({ key: v })) || []
  }
  return <AsyncSelect mode="multiple"
    value={defaultValue}
    onChange={(options) => {
      const ids = options.map(opt => opt?.item?.id)
      if (multi) {
        onChange({
          or: ids.map(id => {
            return { [name]: { $regex: id } }
          })
        })
      } else {
        onChange({ in: ids })
      }
    }}
    field={field}
    label={label}
  />
}

export { FilterUserRole }
export default UserRoleComponent
