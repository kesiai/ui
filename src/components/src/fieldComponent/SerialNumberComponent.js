import React from 'react'
import { Input } from 'antd'
import moment from 'moment'

const getSerialNumber = (schema) => {
  let result = ''
  if (schema?.serialRules && schema.serialRules.length > 0) {
    schema.serialRules.forEach(item => {
      if (item.type === 'text') {
        result += item.text
      } else if (item.type === 'time') {
        result += moment().format(item.time)
      } else if (item.type === 'num') {
        let num = item.num
        if (num?.orderType === 'random') { // 随机序号
          let bitNum = num.bitNum?? 1
          result += Math.random().toString().substring(2, 2+bitNum)
        } else if (num?.orderType === 'linear') { // 线性序号
          let startNum = num.startNum?? 0
          let bitNum = num.bitNum?? 1
          result += startNum.toString().padStart(bitNum, '0')
        }
      }
    })
  }
  return result
}

const SerialNumberComponent = (props) => {
  const { input, field: { schema } } = props
  // const value = input.value ? input.value : getSerialNumber(schema) // 由后端生成

  return <Input value={input.value} disabled />
}

export default SerialNumberComponent