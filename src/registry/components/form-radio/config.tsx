import { FormRadio } from '@/registry/components/form-radio/form-radio'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from '@/registry/components/form-radio/form-radio.md?raw'

export const formRadioPropsConfig = [
  {
    name: 'options',
    label: '选项列表',
    type: 'array' as const,
    default: [
      { label: '选项A', value: '1' },
      { label: '选项B', value: '2' }
    ],
    itemConfig: {
      type: 'object' as const,
      properties: [
        {
          name: 'label',
          label: '显示文本',
          type: 'text' as const,
          required: true
        },
        {
          name: 'value',
          label: '值',
          type: 'text' as const,
          required: true
        }
      ]
    }
  },
  {
    name: 'value',
    label: '选中值',
    type: 'text' as const,
    default: '',
    description: '当前选中的值'
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'readOnly',
    label: '只读',
    type: 'boolean' as const,
    default: false
  }
]

export const formRadioDefaultProps = {
  options: [
    { label: '选项A', value: '1' },
    { label: '选项B', value: '2' }
  ],
  disabled: false,
  readOnly: false
}

const renderFormRadioPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormRadio
          options={props.options}
          value={props.value}
          disabled={props.disabled}
          readOnly={props.readOnly}
        />
      </div>
    </div>
  )
}

const renderFormRadioCodePreview = (props: Record<string, any>) => {
  return `<FormRadio
  options={${JSON.stringify(props.options, null, 2)}}
  ${props.value ? `value="${props.value}"` : ''}
  ${props.disabled ? 'disabled' : ''}
  ${props.readOnly ? 'readOnly' : ''}
/>`
}

export const formRadioConfig: ComponentConfig = {
  id: 'form-radio',
  name: 'Form.Radio 单选框组件',
  propsConfig: formRadioPropsConfig,
  defaultProps: formRadioDefaultProps,
  renderPreview: renderFormRadioPreview,
  renderCodePreview: renderFormRadioCodePreview,
  documentation: documentationMd
}