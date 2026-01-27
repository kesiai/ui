import React from "react"
import { DatePicker } from 'antd'

const getDateRange = (date, format) => {

  const start = moment(date, 'YYYY-MM-DD HH:mm:ss');
  
  // 检查日期是否有效
  if (!start.isValid()) {
    throw new Error('无效的日期格式');
  }
  const params = {
    'ym': 'month',
    'date': 'date',
    'ymdh': 'hour'
  }
  // 获取第一天的00:00:00
  const startOfMonth = start.startOf(params[format]).format('YYYY-MM-DD HH:mm:ss');
  
  // 获取最后一天的23:59:59
  const endOfMonth = start.endOf(params[format]).format('YYYY-MM-DD HH:mm:ss');
  
  return { gte: startOfMonth, lte: endOfMonth }
}

const FilterDate = ({ input: { value, onChange }, schema, ...props }) => {

  const filterFormat = props.filterFormat || schema.format2  || schema.format

  const gte = (filterFormat == 'datetime' || filterFormat == 'date-time') ? value : value?.gte
  const data = gte ? moment(gte, "YYYY-MM-DD HH:mm:ss") : null
  
  const pickerProp = {
    'ym': { picker: 'month' },
    'date': { picker: 'date' },
    'datetime': { picker: 'date', showTime: true },
    'date-time': { picker: 'date', showTime: true },
    'ymdh': { picker: 'date', showTime: true, format: "YYYY-MM-DD HH" }
  }

  const handleChange = v => {
    if (!v) {
      onChange(null)
    } else if (filterFormat == 'datetime' || filterFormat == 'date-time') {
      onChange(moment(v).format('YYYY-MM-DD HH:mm:ss'))
    } else {   
      onChange(getDateRange(v, filterFormat))
    }
  }

  return <DatePicker {...pickerProp[filterFormat]} value={data} onChange={handleChange} />
}

export default FilterDate