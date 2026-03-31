import * as React from 'react'
import { FormUserRole } from '@/registry/components/form-user-role/form-user-role'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-user-role.md?raw'

export const formUserRolePropsConfig = [
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

export const formUserRoleDefaultProps = {
  mode: 'single' as 'single' | 'multiple',
  disabled: false
}

const renderFormUserRolePreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState({ id: 'user1', name: '张三' })

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormUserRole
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

const renderFormUserRoleCodePreview = (props: Record<string, any>) => {
  return `<FormUserRole
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

export const formUserRoleConfig: ComponentConfig = {
  id: 'form-user-role',
  name: '用户角色',
  propsConfig: formUserRolePropsConfig,
  defaultProps: formUserRoleDefaultProps,
  renderPreview: renderFormUserRolePreview,
  renderCodePreview: renderFormUserRoleCodePreview,
  documentation: documentationMd
}

export default formUserRoleConfig
