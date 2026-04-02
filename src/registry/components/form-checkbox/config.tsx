import { FormCheckbox } from '@/registry/components/form-checkbox/form-checkbox'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from '@/registry/components/form-checkbox/form-checkbox.md?raw'

export const formCheckboxPropsConfig = [
  {
    name: 'options',
    label: '数据项',
    type: 'array' as const,
    default: [
      { label: 'A', value: '1', isDefault: false },
      { label: 'B', value: '2', isDefault: false }
    ],
    itemConfig: {
      label: {
        name: 'label',
        label: '文字',
        type: 'text' as const,
        default: ''
      },
      value: {
        name: 'value',
        label: '输出值',
        type: 'text' as const,
        default: ''
      },
      isDefault: {
        name: 'isDefault',
        label: '默认选项',
        type: 'boolean' as const,
        default: false
      }
    }
  },
  {
    name: 'disabled',
    label: '禁用状态',
    type: 'boolean' as const,
    default: false,
    path: 'config'
  },
  {
    name: 'isCheckAll',
    label: '全选',
    type: 'boolean' as const,
    default: false,
    path: 'config'
  },
  {
    name: 'checkAllSeparate',
    label: '全选单独一行',
    type: 'boolean' as const,
    default: false,
    path: 'config'
  }
]

export const formCheckboxDefaultProps = {
  options: [
    { label: 'A', value: '1', isDefault: false },
    { label: 'B', value: '2', isDefault: false }
  ],
  config: {
    disabled: false,
    isCheckAll: false,
    checkAllSeparate: false
  }
}

const renderFormCheckboxPreview = (props: Record<string, any>) => {
  const config = {
    disabled: props.disabled ?? false,
    isCheckAll: props.isCheckAll ?? false,
    checkAllSeparate: props.checkAllSeparate ?? false
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormCheckbox
          options={props.options}
          disabled={config.disabled}
          isCheckAll={config.isCheckAll}
          checkAllSeparate={config.checkAllSeparate}
        />
      </div>
    </div>
  )
}

const renderFormCheckboxCodePreview = (props: Record<string, any>) => {
  const optionsStr = JSON.stringify(props.options, null, 2).split('\n').join('\n  ')
  const configStr = JSON.stringify({
    disabled: props.disabled,
    isCheckAll: props.isCheckAll,
    checkAllSeparate: props.checkAllSeparate
  }, null, 2).split('\n').join('\n  ')

  return `<FormCheckbox
  options={${optionsStr}}
  config={${configStr}}
/>`
}

export const formCheckboxConfig: ComponentConfig = {
  id: 'form-checkbox',
  name: '多选框',
  propsConfig: formCheckboxPropsConfig,
  defaultProps: formCheckboxDefaultProps,
  renderPreview: renderFormCheckboxPreview,
  renderCodePreview: renderFormCheckboxCodePreview,
  documentation: documentationMd
}
