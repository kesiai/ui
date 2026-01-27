
const dealSchema = (schema, values, meta, add) => {
  if(!schema) return {}
  // 字段规则设置只读
  if (_.isBoolean(meta?.data?.disabled)) {
    schema.disabled = meta.data.disabled
    return schema
  }
  let s = _.cloneDeep(schema)
  // 只读改成创建时只读和编辑时只读
  if (s?.allowSelectOld === false && !add) {
    s.disabled = true
  } else if (values?.id && s?.editDisabled) {
    s.disabled = true
  } else if (!values?.id && s?.createDisabled) {
    s.disabled = true
  } else {
    s.disabled = false
  }
  return s
}
const getDisabled = (schema, values, add) => {
  if (schema?.allowSelectOld === false && !add) {
    return true
  } else if (values?.id && schema?.editDisabled) {
    return true
  } else if (!values?.id && schema?.createDisabled) {
    return true
  }
}

// 把新增的记录加到options里
const addNewItem = (options, newItem, field) => {
  if (newItem && !options?.find(o => o.value === newItem.value)) {
    return [
      { value: newItem.value, label: newItem.item?.[field.displayField || 'name'] },
      ...(options || [])
    ]
  } else {
    return options
  }
}

export { dealSchema, getDisabled, addNewItem }
