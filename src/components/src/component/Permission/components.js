import React from "react";
import { app, use } from "xadmin";
import { C } from 'xadmin-ui'
import { SwapOutlined } from '@ant-design/icons';
import { PermissionContext } from "./context";
import { Button, Select } from "antd";

const UserFilter = ({ input }) => {
  const { form, userF } = use('form', state => ({
    userF: state.values?.userF
  }))
  const { getQueryFilter } = use('queryEditor.methods')
  const UserP = app.get('models').User?.properties || {}
  const { transI18n } = use('model.transI18n', {})

  let schema = { properties: { department: { // 组织字段额外加
    type: 'array',
    title: _r('所属组织'),
    fieldType: 'tableData',
    field: {
      func: 'dataAuth',
      // component: DepartmentSelect,
      style: {
        minWidth: 200
      },
      placeholder: _r('选择组织')
    },
    items: {}
  } } }
  Object.keys(UserP).forEach(u => {
    const f = UserP[u]
    if (['用户名', '用户角色', '邮箱', '电话', '备注', '用户状态'].indexOf(f.title) > -1 ||
      ['文本', '数字', '布尔', '选择器', '时间2', '日期范围', '时间', '附件', '附件组',
      '定位', '区域', '星级评价'].indexOf(f.config) > -1) {
        schema.properties[u] = f
      }
  })

  const handleChange = (v) => {
    let filter = getQueryFilter(v, schema)
    form.change('userF', v)
    // 部门特殊处理，接口需要的数据结构不同
    // BUG:数据表，(hh a111111)登录点击权限表，提示错误信息（后端备注需要的格式）
    v?.forEach(v2 => {
      v2?.forEach(v3 => {
        if (v3.field === 'department') {
          let val = v3.value
          _.isArray(val) && val.forEach(vv => {
            const tableID = vv.table?.id
            if (!tableID) return
            
          })
          if (filter['$or']?.length > 0) {
            filter['$or'].forEach((item, index) => {
              if (item.department) {
                const tableID = val?.find(v => v.id === item.department['$regex'])?.table?.id
                if (tableID) {
                  filter['$or'][index] = {
                    [tableID + 'Id']: item.department
                  }
                }
              }
            })
          }
        }
      })
    })
    // 角色特殊处理，不用 roles，用 rolesId
    filter?.['$or']?.forEach(f => {
      if (f.roles) {
        f.rolesId = f.roles
        delete f.roles
      }
    })
    input.onChange(filter)
  }

  return <C is="QueryEditor"
    schema={transI18n(schema)}
    input={{ value: userF, onChange: handleChange }}
    unbind={true}
    // DataWrap={BindField}
    btnName={_t1("添加筛选条件")}
    fieldPlaceholder={_t1("用户范围筛选")}
  />
}

const BindField = props => {
  
  const { input, children, field } = props
  const [bind, setBind] = React.useState(_.isString(input?.value) && input?.value?.indexOf('{{#$') > -1)

  if ((field?.config === '关联字段' && field?.relateTo === 'User') || field?.config === '用户') {
    const ops = [
      { value: '{{#$currentUser}}', label: '当前用户' }
    ]
    return <>
      <div style={{ width: '80%', display: 'inline-block' }}>
        {
          bind ? <Select
            style={{ width: '100%' }}
            options={ops}
            placeholder={_t1('绑定')}
            {...input}
          /> : children
        }
      </div>
      <div style={{ width: '20%', display: 'inline-block' }}>
        <Button onClick={() => {
          input.onChange(null)
          setBind(before => !before)
        }}><SwapOutlined /></Button>
      </div>
    </>
  } else {
    return children
  }
}

const TableDataFilter = ({ input }) => {
  const { form, tableDataF } = use('form', state => ({
    tableDataF: state.values?.tableDataF
  }))
  const { getQueryFilter } = use('queryEditor.methods')
  const { tableItem } = React.useContext(PermissionContext)
  const schema = { properties: tableItem?.schema?.properties || {} }
  Object.keys(schema.properties || {}).forEach(key => { // 过滤掉不需要的字段
    const f = schema.properties[key]
    if (['表单信息', '子表名'].indexOf(f.config) > -1) {
      delete schema.properties[key]
    }
  })

  const handleChange = (v) => {
    const filter = getQueryFilter(v, schema)
    form.change('tableDataF', v)
    input.onChange(filter)
  }

  return <C is="QueryEditor"
    schema={schema}
    input={{ value: tableDataF, onChange: handleChange }}
    
    DataWrap={BindField}
    btnName={_t1("添加筛选条件")}
    fieldPlaceholder={_t1("记录范围筛选")}
  />
}

export { UserFilter, TableDataFilter }
