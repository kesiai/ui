import { Select } from "antd";
import React from "react";
import { api, use, app } from 'xadmin'
import { ReferenceRender } from "../TableFieldRender";

const Reference = (props) => {
  const { schema, field } = props
  let form, model
  try {
    form = use('form')?.form
    model = use('model')?.model
  } catch (error) {}
  const [data, setData] = React.useState({})
  const setD = _.debounce((v) => setData(v), 800)
  const [val, setVal] = React.useState()
  const [loading, setLoading] = React.useState(false)
  
  React.useEffect(() => {
    form && form.useEffect(({ values }) => {
      setD(values)
    })
  }, [])
  
  React.useEffect(() => {
    const tableId = model?.table?.id || props.option?.schema?.name?.split('/')?.[2] // core/t/表ID/d
    if (tableId) {
      setLoading(true)
      api({ name: `computerecord/computerecord/search` }).fetch('', {
        method: 'POST',
        body: JSON.stringify({
          tableId,
          // tableDataId: data?.id,
          data: data || {}
        })
      }).then(({ json }) => {
        !_.isEmpty(json) && setVal(json)
      }).finally(() => setLoading(false))
    }
  }, [data])

  return loading ? '计算中...' : <ReferenceRender
    value={val?.[field?.key]}
    schema={schema}
    WrapComponent={'span'}
    app={app}
  />
}

export default Reference
