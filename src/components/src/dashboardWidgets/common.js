import React from "react";
import { use, api } from "xadmin";
import { Loading, C } from "xadmin-ui";
import { Select } from "antd";

const TableField = ({ input }) => {
  const selected = use('editor.selected')
  const FormKey = use('cell.context.value', 'formCellKey')
  const formValue = use('cell.params.value', FormKey, 'base')
  const [ops, setOps] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const { form } = use('form')

  const tableid = formValue?.table?.id
  React.useEffect(() => {
    if (tableid) {
      setLoading(true)
      api({ name: `core/t/schema/` }).fetch(tableid).then(({ json }) => {
        setLoading(false)
        let jsp = json?.schema?.properties || {}
        setOps(Object.keys(jsp).filter(key => {
          return ['creator', 'modifyUser', 'createTime', 'modifyTime'].indexOf(key) === -1
        }).map(key => {
          return {
            value: key,
            label: jsp[key]?.title,
            obj: jsp[key]
          }
        }))
      })
    }
  }, [tableid])

  const handleChange = (val) => {
    input.onChange(val || null)
    const tableConfig = ops.find(o => o.value === val)?.obj
    if (tableConfig) {
      form.change('keyName', tableConfig?.key)
      form.change('config', tableConfig)
    } else {
      form.change('keyName', '')
      form.change('config', null)
    }
  }

  return <Select
    allowClear
    value={input.value}
    notFoundContent={loading ? <Loading /> : <C is="NoData" description={_t1('无可继承字段')} />}
    onChange={handleChange}
    loading={loading}
    options={loading ? [] : ops}
  />
}

const FormWidget = (props) => {
  const { defaultValue, input, config, value, bindValue, cellKey, script, Component, extraField = {}, extraProps = {}, doEvents } = props
  const [customVar, setCustomVar] = use('dashboard.customVar', bindValue?.name?.replace('画面变量:', ''))
  const [state, setState] = React.useState()
  const setFns = use('cell.functions.set', cellKey)
  const parent = use('cell.structure.value', props.cellKey)?.parent
  const antdForm = use('cell.form.value', parent)

  React.useEffect(() => {
    setState(value ?? input?.value ?? defaultValue)
  }, [defaultValue])

  const onChange = e => {
    script?.on('onChange')(e)
    input.onChange(e?.target?.value??e);
    doEvents && doEvents('valueChange', e)
    bindValue && setCustomVar(e?.target?.value??e)
    setState(e?.target?.value??e)
  }

  React.useEffect(() => {
    !_.isNil(value ?? input?.value) && onChange(value ?? input?.value)
  }, [value, input?.value])

  React.useEffect(() => {
    setFns({
      onChange: {
        fun: (e) => { onChange(e) },
        description: _t1('onChange')
      },
      getValue: {
        fun: (e) => state,
        description: _t1('获取输出值')
      }
    })
  }, [state])

  return Component && <Component
    cellKey={cellKey}
    input={{ value: state, onChange }}
    field={{ schema: config || {}, ...extraField }}
    schema={config || {}}
    antdForm={antdForm}
    {...extraProps}
  />
}

export { TableField, FormWidget }
