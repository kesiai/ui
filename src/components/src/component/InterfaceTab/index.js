import React from 'react'
import { api } from 'xadmin'
import { Select } from 'antd'

const OpSelector = ({ input }) => {
  const [opList, setOpList] = React.useState([])

  React.useEffect(() => {
    api({ name: `ds/interface` }).fetch('', {}).then(({ json }) => {
      if (json?.length > 0) {
        setOpList(json.map(item => ({ value: item.key, label: item.name })))
      }
    }).catch(err => { console.error(err.message) })
  }, [])

  return<Select options={ opList } {...input} allowClear />
}

export default  {
  name: 'airiot.plugin.dataSource',
  plugins: {
    name: _r('表接口'),
    key: 'dataSource',
    pluginGroup: _r('通用表功能'),
    useSetting: ({ data }) => {
      const schema = {
        name: 'dataSource',
        title: _r('表接口'),
        type: 'object',
        showInList: false,
        properties: {
          getMany: {
            type: 'string',
            title: _r('查询列表')
          },
          get: {
            type: 'string',
            title: _r('查询详情')
          },
          create: {
            type: 'string',
            title: _r('新增')
          },
          delete: {
            type: 'string',
            title: _r('删除')
          },
          replace: {
            type: 'string',
            title: _r('替换')
          },
          update: {
            type: 'string',
            title: _r('修改')
          },
          count: {
            type: 'string',
            title: _r('查询总数')
          }
        },
        form: [
          { key: 'getMany', component: OpSelector },
          { key: 'get', component: OpSelector },
          { key: 'create', component: OpSelector },
          { key: 'delete', component: OpSelector },
          { key: 'replace', component: OpSelector },
          { key: 'update', component: OpSelector },
          { key: 'count', component: OpSelector }
        ]
      }
      return { schema }
    },
    description: {
      content: _r(`【表接口】表功能应用后，可通过数据接口实现表记录的增删改查、替换和查询，需提前在表定义中定义表单字段，应用后表的配置TAB会相应的增加一个`)
    }
  }
}
