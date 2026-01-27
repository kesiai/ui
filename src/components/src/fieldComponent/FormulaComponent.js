import React from "react";
import { api, use, app } from 'xadmin'
import { FormulaRender } from "../TableFieldRender";

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
    const tableId = model?.key
    if (_.isEmpty(data) && schema?.config === '时间') return // 日期类型为空时，不查询，会显示 invalid date
    if (tableId) {
      setLoading(true)
      api({ name: `computerecord/computerecord/formulasearch` }).fetch('', {
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

  if (loading) return '计算中...'
  return <FormulaRender value={val?.[field?.key]} />
}

export default Reference
