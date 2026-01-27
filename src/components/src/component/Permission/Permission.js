import React from 'react'
import { Input, Checkbox, Form, message, Button, Row, Col, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';
import { use, api } from 'xadmin';
import { C, Icon } from 'xadmin-ui';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PermissionProvider, PermissionContext } from './context';
import './style.css'
import { UserFilter, TableDataFilter } from './components';
import PermissionAIBtn from '../AI/PermissionAIBtn';
import FormPanelSerial from '../Editor/dropTool/FormPanel2';

const limitComponent = (props) => {
  const { input } = props
  
  // 必填项，默认公开全部记录
  const [value, setValue] = React.useState(input.value)
  // 添加权限和查看管理不同
  const optionList = [
    { value: 'public', label: _t1('全部记录') },
    { value: 'self', label: _t1('仅自己创建的记录') },
    { value: 'sameDepartment', label: _t1('仅用户同部门人员创建的记录') },
    { value: 'cascadeDepartment', label: _t1('仅用户同部门及其子部门人员创建的记录') },
    { value: 'sameRole', label: _t1('仅用户同角色人员创建的记录') }
  ]
  const handleChange = (val) => {
    let result = []
    // 实现公开选项和其他选项的联动效果
    if (val.indexOf('public') > -1) {
      result = value.indexOf('public') > -1 ? val.filter(item => item !== 'public') : ['public']
    } else {
      result = val
    }
    setValue(result)
    input.onChange(result)
  }

  return (<Checkbox.Group
    className='permission-limit'
    style={{ marginTop: 5 }}
    {...input}
    value={value}
    options={optionList}
    onChange={handleChange}
  />)
}

const FieldGroup = ({ label, meta, input, field, tailLayout, children }) => {
  const attrs = field.attrs || {}
  const error = meta.touched && (meta.error || meta.submitError)
  const size = (field.option && field.option.groupSize) || attrs.groupSize || {
    labelCol: { xs: { span: 24 }, sm: { span: 3 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 21 } }
  }

  let groupProps = { ...size, required: field.required, tooltip: field.description }

  if (error) {
    groupProps['validateStatus'] = 'error'

    groupProps['help'] = error
  }

  const controlComponent = children ? children : (<Input {...input} {...attrs} />)
  return (
    <Form.Item label={label} {...groupProps}>
      {controlComponent}
    </Form.Item>
  )
}

const DepartmentSelect = (props) => {
  const { departmentList, form } = use('form', state => ({
    departmentList: state.values?.departmentList
  }))
  const input = {
    value: departmentList,
    onChange: (v) => {
      form.change('departmentList', v)
      let res = {}
      _.isArray(v) && v.forEach(vv => {
        const tableID = vv.table?.id
        if (!tableID) return
        if (res[tableID]) {
          res[tableID].push(vv.id)
        } else {
          res[tableID] = [vv.id]
        }
      })
      props.input.onChange(res)
    }
  }
  return <C is="SelectTableRecordField" {...props} input={input} multiple={true} />
}

const schema = {
  type: 'object',
  properties: {
    rangeType: {
      title: _r('用户范围'),
      type: 'string',
      enum1: ['all', 'filter'],
      enum_title1: ['全部用户', '范围筛选'],
      selectFace: "flatten",
      selectType: 'single',
      field: {
        effect: (f, form) => {
          setTimeout(() => {
            form.setFieldData('userFilter', { display: f.value === 'filter' })
          })
        }
      }
    },
    userFilter: {
      title: ' ',
      type: 'object',
      properties: {},
      field: {
        component: UserFilter,
        attrs: {
          groupSize: {
            labelCol: { span: 0 },
            wrapperCol: { span: 21, offset: 3 }
          }
        }
      }
    },
    recordRangeType: {
      title: _r('记录范围'),
      type: 'string',
      enum1: ['specify', 'filter'],
      enum_title1: [_r('指定记录'), _r('高级筛选')],
      selectFace: "flatten",
      selectType: 'single',
      field: {
        effect: (f, form) => {
          setTimeout(() => {
            form.setFieldData('permissionLimit', { display: f.value === 'specify' })
            form.setFieldData('tableDataFilter', { display: f.value === 'filter' })
          })
        }
      }
    },
    permissionLimit: {
      type: 'array',
      title: _r('权限限定'),
      items: {},
      field: {
        component: limitComponent,
        attrs: {
          groupSize: {
            labelCol: { span: 0 },
            wrapperCol: { span: 21, offset: 3 }
          }
        }
      }
    },
    tableDataFilter: {
      title: ' ',
      type: 'object',
      properties: {},
      field: {
        component: TableDataFilter,
        attrs: {
          groupSize: {
            labelCol: { span: 0 },
            wrapperCol: { span: 21, offset: 3 }
          }
        }
      }
    },
    permissionType: {
      title: _r('操作权限'),
      type: 'array',
      items: {},
      enum1: ['view', 'edit', 'delete'],
      enum_title1: [_r('查看记录'), _r('修改记录'), _r('删除记录')],
      selectFace: "flatten",
      selectType: 'multiple'
    }
  },
  required: ['rangeType', 'recordRangeType', 'permissionType']
}

// 兼容1.0版本的历史记录
const historyDeal = (list, getQueryFilter) => {
  return list?.map(p => {
    let res = _.cloneDeep(p)
    if (p.rangeType === 'user') { // 指定用户
      res.rangeType = 'filter'
      let userF = res.users?.map(u => [{ field: "name", method: "eq", value: u.name }])
      res.userF = userF
      res.userFilter = getQueryFilter(userF)
    } else if (p.rangeType === 'role') { // 指定角色
      res.rangeType = 'filter'
      let userF = [[{
        field: "roles",
        method: "arrayIn",
        value: res.roles?.map(u => ({ id: u.id, name: u.name })) || []
      }]]
      res.userF = userF
      // res.userFilter = getQueryFilter(userF)
      res.userFilter = {$or: [{ rolesId: { '$in': res.roles?.map(u => u.id) || [] } }] }
    } else if (p.rangeType === 'department') { // 指定部门
      res.rangeType = 'filter'
      let userF = [[{
        field: "department",
        method: "arrayIn",
        value: res.departmentList || []
      }]]
      res.userF = userF
      let userFilter = {}
      _.isArray(res.departmentList) && res.departmentList.forEach(vv => {
        const tableID = vv.table?.id
        if (!tableID) return
        if (userFilter[tableID]?.['$in']) {
          userFilter[tableID]['$in'].push(vv.id)
        } else {
          userFilter[tableID] = { '$in': [vv.id] }
        }
      })
      res.userFilter = userFilter
    }
    if (p.permissionLimit?.length > 0 && !p.recordRangeType) {
      res.recordRangeType = "specify"
    }
    return res
  })
}

const PermissonCard = ({ permission, index, setState, refDrag }) => {
  const { err } = React.useContext(PermissionContext)

  const handleChange = (v) => {
    setState(before => {
      let res = [...before]
      res[index] = { ...res[index], ...v }
      return res
    })
  }

  const deleteItem = () => {
    setState(before => {
      let res = [...before]
      res.splice(index, 1)
      return res
    })
  }

  const error = err?.[index]
  return <div className='permission-card' style={{ borderColor: error ? 'red' : '#ddd' }}>
    {
      React.useMemo(() => <Row>
        <Col span={21}>
          <C is="I18nSchemaForm"
            onChange={handleChange}
            formKey={'table-permisson-' + permission.key + index}
            initialValues={permission}
            schema={schema}
            group={FieldGroup}
            component={props => props.children}
          />
        </Col>
        <Col span={3}>
          <Popconfirm
            title={_t1("删除当前配置后，限制将会失效，请谨慎操作，确认删除吗？")}
            onConfirm={deleteItem}
            okText={_t1("确认")}
            cancelText={_t1("取消")}
          >
            <DeleteOutlined style={{ fontSize: 20, float: 'right' }} />
          </Popconfirm>
        </Col>
      </Row>, [index])
    }
    { error && <span className='error-text'>{error.join('，') + ' ' + _t1('不可以为空')}</span> }
  </div>
}

const checkErr = (state) => {
  let err = {}
  state?.forEach((s, index) => {
    let list = []
    if (s.rangeType === 'filter' && _.isEmpty(s.userFilter)) list.push(_t1("用户范围"))
    if (!s.recordRangeType) list.push(_t1("记录范围"))
    if (s.recordRangeType === 'specify' && _.isEmpty(s.permissionLimit)) list.push(_t1("记录范围"))
    if (s.recordRangeType === 'filter' && _.isEmpty(s.tableDataFilter)) list.push(_t1("记录范围"))
    if (_.isEmpty(s.permissionType)) list.push(_t1("操作权限"))
    if (list.length > 0) err[index] = list
  })
  return err
}

const Permission = (props) => {
  const { saveItem } = use('model.save')
  const { data: item, data: { id } } = props
  // const { input: { value, onChange } } = props
  const value = item.permissions?.map(p => ({ ...p, __id__: p.__id__ || p.key || Math.random() }))
  const { getQueryFilter } = use('queryEditor.methods')
  const [state, setState] = React.useState(historyDeal(value || [], getQueryFilter))
  const [loading, setLoading] = React.useState(false)
  const [importLoading, setImportLoading] = React.useState(false)
  const [err, setErr] = React.useState({})
  

  React.useEffect(() => {
    const error = checkErr(state)
    if (JSON.stringify(error) !== JSON.stringify(err)) {
      setErr(error)
    }
  }, [JSON.stringify(state)])

  const onSubmit = () => {
    setLoading(true)
    saveItem({ id, permissions: state }).finally(() => setLoading(false))
  }

  const add = () => {
    const key = Math.random()
    setState(before => [...before, {
      key,
      __id__: key,
      rangeType: 'all',
      recordRangeType: 'specify',
      permissionLimit: ['public']
    }])
  }

  // 导入
  const importJson = async (e) => {
    setImportLoading(true)
    const roles = await api('Role').query({}, {}).then(res => res?.items)
    const organs = await api({ name: 'core/t/schema' }).query({}, {
      wheres: { function: { '$regex': 'dataAuth' } }
    }).then(res => res?.items)
    const fields = Object.keys(item.schema?.properties || {})
    setImportLoading(false)

    const file = e.target.files[0];
    const fr = new FileReader();
    fr.readAsText(file);
    let fileContent = null;
    fr.onload = () => {
      fileContent = fr.result;
      try {
        let fileObj = JSON.parse(fileContent)
        if (!_.isArray(fileObj)) {
          message.error(_t1('文件格式错误'))
          return
        }
        let err
        fileObj.forEach(f => {
          f.userF?.forEach(fu => {
            fu?.forEach(fu2 => {
              if (fu2.field === 'department') {
                let cannotFind = fu2.value?.find(fu2v => !organs.find(o => o.id === fu2v.table?.id))
                if (cannotFind) err = _t1('导入文件中有不存在的【所属组织】，请手动修改')
              } else if (fu2.field === 'roles') {
                let cannotFind = fu2.value?.find(fu2v => !roles.find(o => o.id === fu2v.id))
                if (cannotFind) err = _t1('导入文件中有不存在的【用户角色】，请手动修改')
              }
            })
          })
          f.tableDataF?.forEach(ft => {
            ft?.forEach(ft2 => {
              let cannotFind = fields.indexOf(ft2.field) === -1
              if (cannotFind) err = _t1('导入文件中有不存在的【表字段】，请手动修改')
            })
          })
        })
        setState(fileObj)
        if (err) {
          message.error(err)
        } else {
          message.success(_t1('导入成功'))
        }
      } catch (e) {
        message.error(e, e?.detail || e?.json?.detail)
        message.error(_t1('文件格式错误'))
      }
    };
  }
  // 导出
  const exportJson = () => {
    const content = JSON.stringify(state);
    const blob = new Blob([content]);
    const fileName = `${props.data?.title + '-' + _t1('记录权限')}.json`;
    const selfURL = window[window.webkitURL ? 'webkitURL' : 'URL'];
    let elink = document.createElement('a');
    if ('download' in elink) {
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = selfURL['createObjectURL'](blob);
      document.body.appendChild(elink);

      // 触发链接
      elink.click();
      selfURL.revokeObjectURL(elink.href);
      document.body.removeChild(elink)
    } else {
      navigator.msSaveBlob(blob, fileName);
    }
  }

  const moveCard = (dragIndex, hoverIndex) => {
    if (state?.length > 0) {
      const result = [...state]
      result[dragIndex] = state[hoverIndex]
      result[hoverIndex] = state[dragIndex]
      setState(result)
    }
  }

  return (
    <>
      <Row className='table-permission'>
        <Col span={4}>
          <span className='permission-title'>{_t1('：')}</span>
          <Tooltip title={_t1('可通过拖拽调整记录权限设定的执行顺序。当创建多个记录权限配置时，按照从上到下的顺序依次查询用户及设定权限')} >
            <QuestionCircleOutlined style={{ float: 'right', lineHeight: '34px', display: 'inline-block' }} />
          </Tooltip>
          <span className='permission-title'>{_t1('记录权限')}</span>
        </Col>
        <Col span={16}>
          <Button
            type='primary'
            style={{ width: 80, marginRight: 5 }}
            onClick={add}
          >{_t1('添加')}</Button>
          <Button loading={importLoading} onClick={() => document.getElementById('jsonImport').click()}>
            <Tooltip title={_t1("导入")}><ImportOutlined /></Tooltip>
          </Button>
          <input id='jsonImport' style={{ display: 'none' }} type="file" accept=".json" onChange={importJson} />
          <Button onClick={exportJson} style={{ marginLeft: 5 }} >
            <Tooltip title={_t1("导出")}><ExportOutlined /></Tooltip>
            </Button>
          {/* <PermissionAIBtn setState={setState} /> */}
          <PermissionProvider tableItem={item} err={err}>
            <DndProvider backend={HTML5Backend}>
              <div id="permission-card" className='permission-container'>
                {
                  state?.map((item, index) => {
                    return <FormPanelSerial
                      key={item.key}
                      index={index}
                      id={item.key}
                      name="permission-card"
                      moveCard={moveCard}
                      colNum={1}
                      iconStyle={{ height: '100%', lineHeight: '30px' }}
                    >
                      <PermissonCard
                        key={item.key}
                        index={index}
                        permission={item}
                        setState={setState}
                      />
                    </FormPanelSerial>
                  })
                }
              </div>
            </DndProvider>
          </PermissionProvider>
        </Col>
      </Row>
      <Button
        type="primary"
        loading={loading}
        onClick={onSubmit}
        disabled={!_.isEmpty(err)}
        style={{ margin: '10px auto', display: 'block' }}
      >{_t1('保存')}</Button>
    </>
  )
}

export default Permission