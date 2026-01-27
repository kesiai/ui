import React, { useState, useEffect } from 'react';
import { Button, Tooltip, Form } from 'antd';
import Icon from '../../component/Editor/component/Icon';
import _ from 'lodash';
import { getFormValues } from '../../component/Editor/utils'
import { useScriptVal } from '../../component/Editor/utils2'
import EditableCard from './EditableCard';
import EditableTable from './EditableTable';
import { FormContext } from '../../component/FieldRules/getMutualRules';
import './EditableCard.css'
import { dealSchema } from '../tool';
import { use, app } from 'xadmin'

const EditableComponent = props => {
  const { input, input: { onChange, name }, schema, batchOption, inline, option, antdForm } = props

  const f = Form.useForm()
  let values = getFormValues(schema, antdForm || f)

  const { tableFields, defaultVal, disabled, btnText, displayForm, minCount, maxCount, createAddBtn, editAddBtn, createDelBtn, editDelBtn } = dealSchema(schema, values)
  const [columns, setColumns] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [dataSource, setDataSource] = useState(input.value || defaultVal || [])
  const { setTableErrors } = React.useContext(FormContext)

  const formValues = option?.form?.getState()?.values
  const value = input.value
  const { user } = use('auth.user')

  const validateBtn = (obj) => {
    const { show, userRange, users, roles } = obj || {}
    let showBtn = show
    if (show && userRange && userRange != 'all') {
      showBtn = userRange == 'user' ? users?.some(u => u.id == user.userId) : roles?.some(r => user.roles?.indexOf(r.id) > -1)
    }
    return showBtn
  }

  let showAddBtn, showDelBtn  
  if (user.isAdmin || !batchOption) { // admin不受限
    showAddBtn = true
    showDelBtn = true
  } else {
    // 兼容旧数据（旧表格默认有添加、删除的权限）
    if (_.isNil(values?.id)) {
      showAddBtn = createAddBtn ? validateBtn(createAddBtn) : true
      showDelBtn = createDelBtn ? validateBtn(createDelBtn) : true
    } else {
      showAddBtn = editAddBtn ? validateBtn(editAddBtn) : true
      showDelBtn = editDelBtn ? validateBtn(editDelBtn) : true
    }
  }
  
  // 字段脚本部分
  React.useEffect(() => {
    if (values) {
      useScriptVal({ schema, value, values, record: {}, onChange: v => {
        onChange(v || [])
        setDataSource(v || [])
      } })
    }
  }, [JSON.stringify(values)])

  useEffect(() => {
    // !input.value && defaultVal && onChange && onChange(defaultVal)
    setDataSource(input.value || defaultVal || [])
  }, [defaultVal])

  // 问题场景：数据表编辑视图，绑定后刚打开页面，表单是空值，数据查询回来后再赋值
  // 再赋值时 input.value 有值了，但是用的 dataSource，dataSource 并没有更新，导致字段回显不了
  // 项目着急用，加了一个临时解决的办法，后续有问题再说
  useEffect(() => {
    if (input.value?.length > 0 && input.value?.length !== dataSource?.length) {
      setDataSource(input.value)
    }
  }, [input.value?.length])

  const handleDelete = (key) => {
    setDataSource(state => {
      const data = state ? state.filter((item) => item?.key !== key) : []
      onChange && onChange(data?.length ? data : null)
      return data
    })
  };

  useEffect(() => {
    if (!tableFields) return
    const formArr = formValues?.id ?
      tableFields.form?.filter(f => tableFields.properties?.[f]?.editShow !== false) :
      option?.form && batchOption ? tableFields.form?.filter(f => tableFields.properties?.[f]?.createShow !== false) : tableFields.form
    let col = formArr && _.map(formArr, key => {
      const item = tableFields.properties[key]
      const title = (
        <>
          {item.need && <span style={{ color: '#ff4d4f', fontFamily: 'SimSun, sans-serif', marginRight: 4 }}>*</span>}
          {item.title}
        </>
      )
      return {
        ...item,
        title: title,
        dataIndex: item.key,
        width: item.fieldType == 'attachments' ? 270 : 200,
        editable: true,
        schema: item
      }
    }) || []

    col = batchOption ? col : col.concat({
      dataIndex: 'ops',
      width: 50,
      render: (_, record) => { 
        return <Icon type='delete' onClick={() => handleDelete(record.key)}></Icon>
      }
    })
    setColumns(col)
  }, [JSON.stringify({ tableFields })])

  const setErrors = ({ errors, path, isDelete, deleteIndex }) => {
    setTableErrors && setTableErrors({ errors, path, isDelete, deleteIndex })
  }

  const handleBatchDelete = () => {
    const data = _.differenceBy(value, selectedRows, 'key')
    selectedRows.forEach(row => {
      const deleteIndex = value?.findIndex(v => v?.key == row?.key)
      setErrors({ path: name, isDelete: true, deleteIndex })
    })
    setDataSource(data)
    setSelectedRows([])
    onChange && onChange(data?.length ? data : null)
  };
  const handleAdd = () => {
    const newData = { key: Date.now() }
    setDataSource(d => {
      onChange && onChange([...(d || []), newData])
      return [...(d || []), newData]
    })
  };

  const params = {
    ...props,
    input: { ...input, value: dataSource },
    columns,
    selectedRows,
    setErrors,
    setSelectedRows,
    setDataSource
  }
  const language = app.context.language
  let addBtnKey = language && language !== 'zh_Hans' ? 'add_' + language : 'add'
  let deleteBtnKey = language && language !== 'zh_Hans' ? 'delete_' + language : 'delete'

  return (
    <div id={'EditTable-' + schema?.key} style={{ width: inline ? 600 : 'auto' }}>
      {
        !(dataSource.length >= maxCount) && showAddBtn && <Button
            onClick={handleAdd}
            type="primary"
            style={{
              marginRight: 10
            }}
          >
            {btnText?.[addBtnKey] || _t1('添加新行')}
          </Button>
      }
      {
        batchOption && displayForm != 'card' && showDelBtn ? 
          <Tooltip title={minCount && dataSource.length <= minCount ? _t1('当前记录数小于等于最小记录数，不能删除数据') : null}>
            <Button onClick={handleBatchDelete} style={{ marginBottom: 16 }} disabled={disabled || (minCount && dataSource.length <= minCount)}>
              {btnText?.[deleteBtnKey] || _t1('删除')}
            </Button>
          </Tooltip> : null
      }
      {
        displayForm == 'card' ?
          <EditableCard {...params} showDelBtn={showDelBtn} />
          :
          <EditableTable {...params} />
      }
    </div>
  );
}


export default EditableComponent