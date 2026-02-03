import * as React from 'react'
import { TableFieldUserRole } from '@/registry/blocks/table-field/table-field-user-role/table-field-user-role'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldUserRolePropsConfig = [
  {
    name: 'mode',
    label: '选择模式',
    type: 'select' as const,
    default: 'single',
    options: [
      { value: 'single', label: '单选' },
      { value: 'multiple', label: '多选' }
    ]
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  }
]

export const tableFieldUserRoleDefaultProps = {
  mode: 'single' as 'single' | 'multiple',
  disabled: false
}

const renderTableFieldUserRolePreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState({ id: 'user1', name: '张三' })

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldUserRole
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              name: 'core/user'
            },
            displayField: 'name'
          }}
          label="用户"
          mode={props.mode}
          disabled={props.disabled}
        />
      </div>
    </div>
  )
}

const renderTableFieldUserRoleCodePreview = (props: Record<string, any>) => {
  return `<TableFieldUserRole
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      name: 'core/user'
    },
    displayField: 'name'
  }}
  label="用户"
  mode="${props.mode}"
  disabled={props.disabled}
/>`
}

export const tableFieldUserRoleConfig: ComponentConfig = {
  id: 'table-field-user-role',
  name: 'TableField.UserRole 用户角色',
  propsConfig: tableFieldUserRolePropsConfig,
  defaultProps: tableFieldUserRoleDefaultProps,
  renderPreview: renderTableFieldUserRolePreview,
  renderCodePreview: renderTableFieldUserRoleCodePreview
}

export default tableFieldUserRoleConfig
