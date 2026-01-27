import React from "react"
import { Button, message } from 'antd'
import { api, use } from 'xadmin'

const tableFieldCustom = props => {

  const outputs = props?.data?.data?.outputs
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (outputs?.code == 200) {
      try {
        const data = JSON.parse(outputs?.data)
        setData(data)
        props?.callback?.(data)

      } catch (error) {
        console.error('error', error)
      }
    } else {
      message.error('出错了')
    }
  }, [outputs])

  return <div>
    <div>数据生成成功 ✅ </div>
    {/* <Button size="small" onClick={onClick}>详情</Button> */}
    {/* <Button size="small" loading={loading} onClick={onClick}>创建</Button> */}
  </div>
}

export default tableFieldCustom