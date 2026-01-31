import { FormDate } from '@/registry/blocks/form/form-date/form-date'
import { ComponentConfig } from '@/app/config/types'

export const formDatePropsConfig = [
  {
    name: 'allowClear',
    label: '清除按钮',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'autoFocus',
    label: '自动获取焦点',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'bordered',
    label: '是否有边框',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'picker',
    label: '选择器类型',
    type: 'select' as const,
    default: 'date',
    options: [
      { value: 'time', label: '时间' },
      { value: 'date', label: '日期' },
      { value: 'dateTime', label: '日期时间' },
      { value: 'week', label: '周' },
      { value: 'month', label: '月' },
      { value: 'quarter', label: '季度' },
      { value: 'year', label: '年' }
    ]
  },
  {
    name: 'isCalendar',
    label: '日历展开',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'placeholder',
    label: '提示文字',
    type: 'text' as const,
    default: '请选择日期'
  },
  {
    name: 'size',
    label: '尺寸',
    type: 'select' as const,
    default: 'medium',
    options: [
      { value: 'large', label: '大' },
      { value: 'medium', label: '标准' },
      { value: 'small', label: '小' }
    ]
  },
  {
    name: 'use12Hours',
    label: '12小时制',
    type: 'boolean' as const,
    default: false
  }
]

export const formDateDefaultProps = {
  allowClear: true,
  autoFocus: false,
  bordered: true,
  disabled: false,
  picker: 'date' as 'time' | 'date' | 'dateTime' | 'week' | 'month' | 'quarter' | 'year',
  isCalendar: false,
  placeholder: '请选择日期',
  size: 'medium' as 'large' | 'medium' | 'small',
  use12Hours: false
}

const renderFormDatePreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormDate
          allowClear={props.allowClear}
          autoFocus={props.autoFocus}
          bordered={props.bordered}
          disabled={props.disabled}
          picker={props.picker}
          isCalendar={props.isCalendar}
          placeholder={props.placeholder}
          size={props.size}
          use12Hours={props.use12Hours}
        />
      </div>
    </div>
  )
}

const renderFormDateCodePreview = (props: Record<string, any>) => {
  return `<FormDate
  ${props.allowClear ? 'allowClear' : ''}
  ${props.autoFocus ? 'autoFocus' : ''}
  ${props.bordered ? 'bordered' : 'bordered={false}'}
  ${props.disabled ? 'disabled' : ''}
  picker="${props.picker}"
  ${props.isCalendar ? 'isCalendar' : ''}
  placeholder="${props.placeholder}"
  size="${props.size}"
  ${props.use12Hours ? 'use12Hours' : ''}
  defaultValue="2024-01-15"
/>`
}

export const formDateConfig: ComponentConfig = {
  id: 'form-date',
  name: 'Form.Date 日期选择器',
  propsConfig: formDatePropsConfig,
  defaultProps: formDateDefaultProps,
  renderPreview: renderFormDatePreview,
  renderCodePreview: renderFormDateCodePreview
}
