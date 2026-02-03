import * as React from 'react'
import { TableFieldCheckbox } from '@/registry/blocks/table-field/table-field-checkbox/table-field-checkbox'
import { ComponentConfig } from '@/app/config/types'

export const tableFieldCheckboxPropsConfig = [
  {
    name: 'displayForm',
    label: '显示形式',
    type: 'select' as const,
    default: 'checkbox',
    options: [
      { value: 'checkbox', label: '复选框' },
      { value: 'switch', label: '开关' }
    ]
  },
  {
    name: 'defaultVal',
    label: '默认值',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'checkedChildren',
    label: '选中时文字',
    type: 'text' as const,
    default: '是',
    description: '仅开关模式有效'
  },
  {
    name: 'unCheckedChildren',
    label: '未选中时文字',
    type: 'text' as const,
    default: '否',
    description: '仅开关模式有效'
  },
  {
    name: 'label',
    label: '标签文字',
    type: 'text' as const,
    default: '',
    description: '仅复选框模式有效'
  }
]

export const tableFieldCheckboxDefaultProps = {
  displayForm: 'checkbox' as 'checkbox' | 'switch',
  defaultVal: false,
  disabled: false,
  checkedChildren: '是',
  unCheckedChildren: '否',
  label: ''
}

const renderTableFieldCheckboxPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(props.defaultVal || false)

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <TableFieldCheckbox
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              displayForm: props.displayForm,
              defaultVal: props.defaultVal,
              disabled: props.disabled,
              checkedChildren: props.checkedChildren,
              unCheckedChildren: props.unCheckedChildren,
              label: props.label
            }
          }}
        />
      </div>
    </div>
  )
}

const renderTableFieldCheckboxCodePreview = (props: Record<string, any>) => {
  return `<TableFieldCheckbox
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      displayForm: "${props.displayForm}",
      defaultVal: ${props.defaultVal},
      disabled: ${props.disabled},
      checkedChildren: "${props.checkedChildren}",
      unCheckedChildren: "${props.unCheckedChildren}",
      label: "${props.label}"
    }
  }}
/>`
}

export const tableFieldCheckboxConfig: ComponentConfig = {
  id: 'table-field-checkbox',
  name: 'TableField.Checkbox 复选框',
  propsConfig: tableFieldCheckboxPropsConfig,
  defaultProps: tableFieldCheckboxDefaultProps,
  renderPreview: renderTableFieldCheckboxPreview,
  renderCodePreview: renderTableFieldCheckboxCodePreview
}

export default tableFieldCheckboxConfig
