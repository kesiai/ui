import * as React from "react"
import { MobilePicker, PickerOption } from '@/registry/components/mobile-picker/mobile-picker'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './mobile-picker.md?raw'

export const MobilePickerPreview: React.FC<{ props: Record<string, any> }> = ({ props }) => {
  const [value, setValue] = React.useState<string | string[]>(props.multiple ? [] : '')
  const [visible, setVisible] = React.useState(false)

  // 示例数据
  const sampleOptions: PickerOption[] = [
    { label: '选项 1', value: '1' },
    { label: '选项 2', value: '2' },
    { label: '选项 3', value: '3' },
  ]

  const sampleTreeData: PickerOption[] = [
    {
      label: '省份 A',
      value: 'A',
      children: [
        { label: '城市 A1', value: 'A1' },
        { label: '城市 A2', value: 'A2' },
      ]
    },
    {
      label: '省份 B',
      value: 'B',
      children: [
        { label: '城市 B1', value: 'B1' },
        { label: '城市 B2', value: 'B2' },
      ]
    }
  ]

  const input = {
    value,
    onChange: setValue
  }

  const getDisplayData = () => {
    if (props.selectModel === 'tableData') {
      return sampleTreeData
    }
    return sampleOptions
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <MobilePicker
          input={input}
          options={getDisplayData()}
          treeData={getDisplayData()}
          placeholder={props.placeholder || '请选择'}
          disabled={props.disabled}
          selectModel={props.selectModel || 'normal'}
          multiple={props.multiple}
          loading={props.loading}
        />
        <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
          <p className="font-medium mb-2">当前选择: <span className="text-blue-600">
            {props.multiple
              ? (Array.isArray(value) ? JSON.stringify(value) : '无')
              : (value || '无')
            }
          </span></p>
          <p>选择模式: {props.selectModel === 'tableData' ? '级联选择' : '普通选择'} | {props.multiple ? '多选' : '单选'}</p>
        </div>
      </div>
    </div>
  )
}

export const mobilePickerPropsConfig = [
  {
    name: 'selectModel',
    label: '选择模式',
    type: 'select' as const,
    default: 'normal',
    options: [
      { value: 'normal', label: '普通选择' },
      { value: 'table', label: '表格选择' },
      { value: 'tableData', label: '表记录级联选择' }
    ]
  },
  {
    name: 'multiple',
    label: '多选',
    type: 'boolean' as const,
    default: false,
    description: '启用多选模式'
  },
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '请选择',
    placeholder: '请输入占位符'
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'loading',
    label: '加载中',
    type: 'boolean' as const,
    default: false,
    description: '显示加载状态'
  },
  {
    name: 'dashboardMode',
    label: '仪表盘模式',
    type: 'boolean' as const,
    default: false,
    description: '禁用点击事件'
  }
]

export const mobilePickerDefaultProps = {
  selectModel: 'normal',
  multiple: false,
  placeholder: '请选择',
  disabled: false,
  loading: false,
  dashboardMode: false
}

const renderMobilePickerPreview = (props: Record<string, any>) => {
  return <MobilePickerPreview props={props} />
}

const renderMobilePickerCodePreview = (props: Record<string, any>) => {
  let code = `<MobilePicker`
  if (props.selectModel !== 'normal') {
    code += `\n  selectModel="${props.selectModel}"`
  }
  if (props.multiple) {
    code += `\n  multiple`
  }
  if (props.placeholder !== '请选择') {
    code += `\n  placeholder="${props.placeholder}"`
  }
  if (props.disabled) {
    code += `\n  disabled`
  }
  code += `\n  input={{`
  code += `\n    value,`
  code += `\n    onChange: setValue`
  code += `\n  }}`
  code += `\n  options={options}`
  if (props.selectModel === 'tableData') {
    code += `\n  treeData={treeData}`
  }
  code += `\n/>`

  return code
}

const renderMobilePickerCustomForm = (props: Record<string, any>, onChange: (name: string, value: any) => void) => {
  if (props.selectModel === 'tableData') {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-slate-700 mb-2">
          级联选择模式说明
        </p>
        <div className="text-sm text-slate-600 space-y-2">
          <p>级联选择模式下，需要通过以下回调处理导航：</p>
          <ul className="list-disc list-inside space-y-1">
            <li><code className="px-1 py-0.5 bg-white rounded text-xs">onCascadeSelect</code> - 当用户选择非叶子节点时调用，由外部决定如何加载下一级数据</li>
            <li><code className="px-1 py-0.5 bg-white rounded text-xs">onCascadeBack</code> - 返回上一级时调用</li>
            <li><code className="px-1 py-0.5 bg-white rounded text-xs">cascadeLevel</code> - 当前级联层级</li>
            <li><code className="px-1 py-0.5 bg-white rounded text-xs">cascadePath</code> - 当前级联路径</li>
          </ul>
        </div>
      </div>
    )
  }
  return null
}

export const mobilePickerConfig: ComponentConfig = {
  id: 'mobile-picker',
  name: 'MobilePicker 移动端选择器',
  propsConfig: mobilePickerPropsConfig,
  defaultProps: mobilePickerDefaultProps,
  renderPreview: renderMobilePickerPreview,
  renderCodePreview: renderMobilePickerCodePreview,
  renderCustomForm: renderMobilePickerCustomForm,
  documentation: documentationMd
}
