import { MobileLocation } from '@/registry/components/mobile-location/mobile-location'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './mobile-location.md?raw'

export const mobileLocationPropsConfig = [
  {
    name: 'ak',
    label: '百度地图 API Key',
    type: 'text' as const,
    default: '',
    description: '用于调用百度地图定位服务'
  },
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '定位中...'
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'size',
    label: '尺寸',
    type: 'select' as const,
    default: 'md',
    options: [
      { value: 'sm', label: '小' },
      { value: 'md', label: '中' },
      { value: 'lg', label: '大' }
    ]
  }
]

export const mobileLocationDefaultProps = {
  ak: '',
  placeholder: '定位中...',
  disabled: false,
  size: 'md' as 'sm' | 'md' | 'lg'
}

const renderMobileLocationPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <MobileLocation
          ak={props.ak}
          placeholder={props.placeholder}
          disabled={props.disabled}
          size={props.size}
        />
        <p className="mt-4 text-xs text-slate-500">
          注：请配置百度地图 API Key 后才能正常使用定位功能
        </p>
      </div>
    </div>
  )
}

const renderMobileLocationCodePreview = (props: Record<string, any>) => {
  return `<MobileLocation
  ${props.ak ? `ak="${props.ak}"` : ''}
  placeholder="${props.placeholder}"
  ${props.disabled ? 'disabled' : ''}
  size="${props.size}"
/>`
}

export const mobileLocationConfig: ComponentConfig = {
  id: 'mobile-location',
  name: 'MobileLocation 定位',
  propsConfig: mobileLocationPropsConfig,
  defaultProps: mobileLocationDefaultProps,
  renderPreview: renderMobileLocationPreview,
  renderCodePreview: renderMobileLocationCodePreview,
  documentation: documentationMd
}
