import * as React from 'react'
import { FormRelatePlus } from '@/registry/components/form-relate-plus/form-relate-plus'
import { ComponentConfig } from '@/app/config/types'

export const formRelatePlusPropsConfig = [
  {
    name: 'selectType',
    label: '选择类型',
    type: 'select' as const,
    default: 'single',
    options: [
      { value: 'single', label: '单选' },
      { value: 'multiple', label: '多选' }
    ]
  },
  {
    name: 'showType',
    label: '显示方式',
    type: 'select' as const,
    default: 'select',
    options: [
      { value: 'select', label: '选择器' },
      { value: 'card', label: '卡片' },
      { value: 'table', label: '表格' }
    ]
  },
  {
    name: 'allowAdd',
    label: '允许新增',
    type: 'boolean' as const,
    default: false
  }
]

export const formRelatePlusDefaultProps = {
  selectType: 'single' as 'single' | 'multiple',
  showType: 'select' as 'select' | 'card' | 'table',
  allowAdd: false
}

const renderFormRelatePlusPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState(null)

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormRelatePlus
          relateSchema={{
            selectType: props.selectType,
            showType: props.showType,
            allowAdd: props.allowAdd
          }}
          input={{
            value,
            onChange: setValue
          }}
        />
      </div>
    </div>
  )
}

const renderFormRelatePlusCodePreview = (props: Record<string, any>) => {
  return `<FormRelatePlus
  relateSchema={{
    selectType: "${props.selectType}",
    showType: "${props.showType}",
    allowAdd: ${props.allowAdd}
  }}
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
/>`
}

export const formRelatePlusConfig: ComponentConfig = {
  id: 'form-relate-plus',
  name: 'Form.RelatePlus 关联字段Plus',
  propsConfig: formRelatePlusPropsConfig,
  defaultProps: formRelatePlusDefaultProps,
  renderPreview: renderFormRelatePlusPreview,
  renderCodePreview: renderFormRelatePlusCodePreview
}

export default formRelatePlusConfig
