import React from 'react'
import { C } from 'xadmin-ui'
import { message } from 'antd'

export default ({ setSchema }) => {
  const [data, setData] = React.useState({})
  const renderTipMessage = () => <div>{_t1('正在生成...')}</div>
  const end = (state) => {
    if (state == 'ok') {
      // 追加schema
      setSchema(schema => {
        try {
          const newSchema = data?.schema
          return {
            ...schema,
            properties: {
              ...schema?.properties || {},
              ...newSchema?.properties || {}
            },
            form: [...schema.form || [], ...newSchema?.form || []],
            listFields: [...schema.listFields || [], ...newSchema?.listFields || []],
          }
        } catch (error) {
          console.error('error', error)
        }
      })
    }
  }

  const onData = (data) => {
    const outputs = data?.data?.outputs
    if (outputs?.code == 200) {
      try {
        const data = JSON.parse(outputs?.data)
        setData(data)
      } catch (error) {
        console.error('error', error)
      }
    } else {
      message.error('出错了')
    }

  }

  return (
    <C
      modalAi
      is='AI.Button'
      env='tableFieldCustom'
      envKey={'tableFieldCustom'}
      widgetKey={'tableFieldCustom'}
      callback={onData}
      renderTipMessage={renderTipMessage}
      end={end}
    />
  )
}