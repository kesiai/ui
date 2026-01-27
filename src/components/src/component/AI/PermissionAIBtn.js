import React from "react"
import { C } from "xadmin-ui"
import { use } from "xadmin"

const PermissionAIBtn = ({ setState }) => {
  return <C
    env='table.permission'
    envKey='tablePluginsPermission'
    widgetKey='tablePluginsPermission'
    shortcuts={[
      '用户名是对对的用户，都能编辑这个表里面，自己创建的记录',
      '所有邮箱包含@qq.com的用户，都能查看这个表里面，自己仅用户同部门及其子部门人员创建的记录'
    ]}
    callback={(value => {
      if (value) setState(before => [ ...before, value ])
    })}
    is='AI.Button'
  />
}

export default PermissionAIBtn
