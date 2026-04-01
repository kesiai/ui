import { MobileDatePicker } from "@/registry/components/mobile-date-picker/mobile-date-picker"
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './mobile-date-picker.md?raw'

export const mobileDatePickerPropsConfig = [
  {
    name: 'precision',
    label: '精度',
    type: 'select' as const,
    default: 'day',
    options: [
      { value: 'year', label: '年' },
      { value: 'month', label: '月' },
      { value: 'week', label: '周' },
      { value: 'week-day', label: '周-日' },
      { value: 'day', label: '日' },
      { value: 'hour', label: '时' },
      { value: 'minute', label: '分' },
      { value: 'second', label: '秒' }
    ]
  },
  {
    name: 'defaultValue',
    label: '默认值',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'disabled',
    label: '禁用状态',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'minDate',
    label: '最小日期 (用于日/周-日)',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'maxDate',
    label: '最大日期 (用于日/周-日)',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'minDateTime',
    label: '最小时间 (用于时/分/秒)',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'maxDateTime',
    label: '最大时间 (用于时/分/秒)',
    type: 'text' as const,
    default: ''
  }
]

export const mobileDatePickerDefaultProps = {
  precision: 'day' as 'year' | 'month' | 'week' | 'week-day' | 'day' | 'hour' | 'minute' | 'second',
  disabled: false
}

const renderMobileDatePickerPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-4">
        <MobileDatePicker
          precision={props.precision}
          defaultValue={props.defaultValue}
          disabled={props.disabled}
          minDate={props.minDate}
          maxDate={props.maxDate}
          minDateTime={props.minDateTime}
          maxDateTime={props.maxDateTime}
        />
      </div>
    </div>
  )
}

const renderMobileDatePickerCodePreview = (props: Record<string, any>) => {
  const propsArray = [
    props.precision !== 'day' ? `precision="${props.precision}"` : '',
    props.disabled ? 'disabled' : '',
    props.minDate ? `minDate="${props.minDate}"` : '',
    props.maxDate ? `maxDate="${props.maxDate}"` : '',
    props.minDateTime ? `minDateTime="${props.minDateTime}"` : '',
    props.maxDateTime ? `maxDateTime="${props.maxDateTime}"` : '',
    props.defaultValue ? `defaultValue="${props.defaultValue}"` : ''
  ].filter(Boolean)

  return `<MobileDatePicker ${propsArray.join(' ')} />`
}

export const mobileDatePickerConfig: ComponentConfig = {
  id: 'mobile-date-picker',
  name: '时间',
  propsConfig: mobileDatePickerPropsConfig,
  defaultProps: mobileDatePickerDefaultProps,
  renderPreview: renderMobileDatePickerPreview,
  renderCodePreview: renderMobileDatePickerCodePreview,
  documentation: documentationMd
}