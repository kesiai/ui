import { MobileNavBar } from '@/registry/blocks/mobile/mobile-nav-bar/mobile-nav-bar'
import { ComponentConfig } from '../types'
import { TimePicker } from '@/components/ui/time-picker'

export const mobileNavBarPropsConfig = [
  {
    name: 'title',
    label: '标题',
    type: 'text' as const,
    default: '标题栏'
  },
  {
    name: 'back',
    label: '返回区域文字',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'backArrow',
    label: '显示返回箭头',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'icon',
    label: '左侧图标 URL',
    type: 'text' as const,
    default: '',
    placeholder: 'https://example.com/icon.png'
  },
  {
    name: 'disableBack',
    label: '禁用返回功能',
    type: 'boolean' as const,
    default: false
  }
]

export const mobileNavBarDefaultProps = {
  title: '标题栏',
  back: '',
  backArrow: true,
  icon: '',
  disableBack: false
}

const renderMobileNavBarPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm">
        <MobileNavBar
          title={props.title}
          back={props.back}
          backArrow={props.backArrow}
          icon={props.icon}
          disableBack={props.disableBack}
        />
        <div className="p-8 text-center text-slate-500">
          页面内容区域
        </div>
      </div>
    </div>
  )
}

const renderMobileNavBarCodePreview = (props: Record<string, any>) => {
  return `<MobileNavBar
  title="${props.title}"
  ${props.back ? `back="${props.back}"` : ''}
  ${!props.backArrow ? 'backArrow={false}' : ''}
  ${props.icon ? `icon="${props.icon}"` : ''}
  ${props.disableBack ? 'disableBack' : ''}
/>`
}

export const mobileNavBarConfig: ComponentConfig = {
  id: 'mobile-nav-bar',
  name: 'MobileNavBar 标题栏',
  propsConfig: mobileNavBarPropsConfig,
  defaultProps: mobileNavBarDefaultProps,
  renderPreview: renderMobileNavBarPreview,
  renderCodePreview: renderMobileNavBarCodePreview
}
