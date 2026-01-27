import React from 'react'
import { use, api } from 'xadmin'
import { Select } from 'antd'

const FilterInputSelect = ({ field, input }) => {
  const { model } = use('model')
  const [filters, setFilters] = use('model.state', 'where', 'filters')
  const [ops, setOps] = React.useState([])

  React.useEffect(() => {
    const key = field?.key
    const groupBy = { [key]: `$${key}` }
    const filter = _.omit(filters, [field?.name])
    const queryStr = encodeURIComponent(JSON.stringify({ groupBy, filter, withCount: true }))
    model && api(model).fetch('?query=' + queryStr, {}).then(({ json = [] }) => {
      const options = json.filter(op => !!op[key]).map(op => {
        return {
          value: op[key],
          label: op[key]
        }
      })
      setOps(options)
    })
  }, [])

  return <Select
    {...input}
    // mode={internalTable ? null : 'multiple'}
    options={ops}
    filterOption={(input, option) => option.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    placeholder={_t1('请选择')}
    allowClear
    showSearch
  />
}

export default FilterInputSelect
