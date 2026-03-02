import { FormSelect } from '@/registry/components/form-select/form-select'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-select.md?raw'

export const formSelectPropsConfig = [
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '请选择'
  },
  {
    name: 'options',
    label: '选项列表',
    type: 'array' as const,
    default: [
      { value: 'option1', label: '选项1' },
      { value: 'option2', label: '选项2' },
      { value: 'option3', label: '选项3' }
    ],
    description: '选项数组，格式：[{value: "value", label: "显示文本"}]'
  },
  {
    name: 'selectFace',
    label: '选择器外观',
    type: 'select' as const,
    default: 'select',
    options: [
      { value: 'select', label: '下拉框' },
      { value: 'flat', label: '平铺' },
      { value: 'button', label: '按钮组' }
    ],
    description: '选择器显示方式（兼容 table-field）'
  },
  {
    name: 'selectType',
    label: '选择类型',
    type: 'select' as const,
    default: 'single',
    options: [
      { value: 'single', label: '单选' },
      { value: 'multiple', label: '多选' }
    ],
    description: '单选或多选（兼容 table-field）'
  },
  {
    name: 'dataType',
    label: '数据类型',
    type: 'select' as const,
    default: 'string',
    options: [
      { value: 'string', label: '字符串' },
      { value: 'number', label: '数字' }
    ],
    description: '值的数据类型（兼容 table-field）'
  },
  {
    name: 'defaultVal',
    label: '默认值',
    type: 'text' as const,
    default: '',
    description: '默认值（兼容 table-field）'
  },
  {
    name: 'size',
    label: '尺寸',
    type: 'select' as const,
    default: 'default',
    options: [
      { value: 'sm', label: '小' },
      { value: 'default', label: '标准' }
    ]
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
  },
  {
    name: 'bordered',
    label: '显示边框',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'allowClear',
    label: '显示清除按钮',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'showSearch',
    label: '支持搜索',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'autoFocus',
    label: '自动获取焦点',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'defaultOpen',
    label: '默认展开',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'dropdownMatchSelectWidth',
    label: '下拉菜单和选择器同宽',
    type: 'boolean' as const,
    default: true
  }
]

export const formSelectDefaultProps = {
  placeholder: '请选择',
  options: [
    { value: 'option1', label: '选项1' },
    { value: 'option2', label: '选项2' },
    { value: 'option3', label: '选项3' }
  ],
  selectFace: 'select' as 'select' | 'flat' | 'button',
  selectType: 'single' as 'single' | 'multiple',
  dataType: 'string' as 'string' | 'number',
  defaultVal: '',
  size: 'default' as 'sm' | 'default',
  disabled: false,
  readOnly: false,
  bordered: true,
  allowClear: false,
  showSearch: false,
  autoFocus: false,
  defaultOpen: false,
  dropdownMatchSelectWidth: true
}

const renderFormSelectPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormSelect
          placeholder={props.placeholder}
          options={props.options}
          size={props.size}
          disabled={props.disabled}
          readOnly={props.readOnly}
          bordered={props.bordered}
          allowClear={props.allowClear}
          showSearch={props.showSearch}
          autoFocus={props.autoFocus}
          defaultOpen={props.defaultOpen}
          dropdownMatchSelectWidth={props.dropdownMatchSelectWidth}
        />
      </div>
    </div>
  )
}

const renderFormSelectCodePreview = (props: Record<string, any>) => {
  const optionsStr = JSON.stringify(props.options, null, 2)
  return `<FormSelect
  placeholder="${props.placeholder}"
  options={${optionsStr}}
  size="${props.size}"
  ${props.disabled ? 'disabled' : ''}
  ${props.readOnly ? 'readOnly' : ''}
  ${props.bordered ? 'bordered' : 'bordered={false}'}
  ${props.allowClear ? 'allowClear' : ''}
  ${props.showSearch ? 'showSearch' : ''}
  ${props.autoFocus ? 'autoFocus' : ''}
  ${props.defaultOpen ? 'defaultOpen' : ''}
  ${props.dropdownMatchSelectWidth ? 'dropdownMatchSelectWidth' : 'dropdownMatchSelectWidth={false}'}
/>`
}

export const formSelectConfig: ComponentConfig = {
  id: 'form-select',
  name: 'Form.Select 下拉框',
  propsConfig: formSelectPropsConfig,
  defaultProps: formSelectDefaultProps,
  renderPreview: renderFormSelectPreview,
  renderCodePreview: renderFormSelectCodePreview,
  documentation: documentationMd
}