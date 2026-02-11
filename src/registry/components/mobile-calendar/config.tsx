import { MobileCalendar } from '@/registry/components/mobile-calendar/mobile-calendar'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './mobile-calendar.md?raw'

export const mobileCalendarPropsConfig = [
  {
    name: 'mode',
    label: '模式',
    type: 'select' as const,
    default: 'picker',
    options: [
      { value: 'picker', label: '选择器' },
      { value: 'calendar', label: '日历' }
    ]
  },
  {
    name: 'selectionMode',
    label: '类型',
    type: 'select' as const,
    default: 'single',
    options: [
      { value: 'single', label: '单日' },
      { value: 'range', label: '日期区间' }
    ]
  },
  {
    name: 'min',
    label: '最小日期',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'max',
    label: '最大日期',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'allowClear',
    label: '允许清除',
    type: 'boolean' as const,
    default: true,
    description: '是否允许再次点击后清除'
  },
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '请选择'
  },
  {
    name: 'disabled',
    label: '禁用状态',
    type: 'boolean' as const,
    default: false
  }
]

export const mobileCalendarDefaultProps = {
  mode: 'picker' as 'picker' | 'calendar',
  selectionMode: 'single' as 'single' | 'range',
  allowClear: true,
  placeholder: '请选择',
  disabled: false,
  min: '',
  max: ''
}

const renderMobileCalendarPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8 bg-slate-100">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <MobileCalendar
          mode={props.mode}
          selectionMode={props.selectionMode}
          allowClear={props.allowClear}
          placeholder={props.placeholder}
          disabled={props.disabled}
          min={props.min}
          max={props.max}
          value="2024-01-15"
        />
      </div>
    </div>
  )
}

const renderMobileCalendarCodePreview = (props: Record<string, any>) => {
  return `<MobileCalendar
  mode="${props.mode}"
  selectionMode="${props.selectionMode}"
  ${props.allowClear ? 'allowClear' : ''}
  placeholder="${props.placeholder}"
  ${props.disabled ? 'disabled' : ''}
  ${props.min ? `min="${props.min}"` : ''}
  ${props.max ? `max="${props.max}"` : ''}
  value="2024-01-15"
/>`
}

export const mobileCalendarConfig: ComponentConfig = {
  id: 'mobile-calendar',
  name: 'MobileCalendar 日历',
  propsConfig: mobileCalendarPropsConfig,
  defaultProps: mobileCalendarDefaultProps,
  renderPreview: renderMobileCalendarPreview,
  renderCodePreview: renderMobileCalendarCodePreview,
  documentation: documentationMd
}
