import * as React from 'react'
import { FormMap } from '@/registry/components/form-map/form-map'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-map.md?raw'

export const formMapPropsConfig = [
  {
    name: 'placeholder',
    label: '占位符',
    type: 'text' as const,
    default: '请选择位置'
  },
  {
    name: 'lngLat',
    label: '显示经纬度',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'positionName',
    label: '显示位置名称',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'canEdit',
    label: '可编辑',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'canHand',
    label: '可手动输入',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'showType',
    label: '展示方式',
    type: 'select' as const,
    default: 'modal',
    options: [
      { value: 'modal', label: '弹窗' },
      { value: 'map', label: '直接显示地图' }
    ]
  },
  {
    name: 'size',
    label: '尺寸',
    type: 'select' as const,
    default: 'middle',
    options: [
      { value: 'small', label: '小' },
      { value: 'middle', label: '中' },
      { value: 'large', label: '大' }
    ]
  }
]

export const formMapDefaultProps = {
  placeholder: '请选择位置',
  lngLat: true,
  positionName: true,
  canEdit: true,
  canHand: true,
  showType: 'modal' as 'modal' | 'map',
  size: 'middle' as 'small' | 'middle' | 'large'
}

const renderFormMapPreview = (props: Record<string, any>) => {
  const [value, setValue] = React.useState<{ name?: string; lng: number; lat: number } | null>(null)

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormMap
          input={{
            value,
            onChange: setValue
          }}
          field={{
            schema: {
              placeholder: props.placeholder,
              lngLat: props.lngLat,
              positionName: props.positionName,
              canEdit: props.canEdit,
              canHand: props.canHand,
              showType: props.showType,
              size: props.size
            }
          }}
        />
      </div>
    </div>
  )
}

const renderFormMapCodePreview = (props: Record<string, any>) => {
  return `<FormMap
  input={{
    value: value,
    onChange: (value) => setValue(value)
  }}
  field={{
    schema: {
      placeholder: "${props.placeholder}",
      lngLat: ${props.lngLat},
      positionName: ${props.positionName},
      canEdit: ${props.canEdit},
      canHand: ${props.canHand},
      showType: "${props.showType}",
      size: "${props.size}"
    }
  }}
/>`
}

export const formMapConfig: ComponentConfig = {
  id: 'form-map',
  name: '地图定位',
  propsConfig: formMapPropsConfig,
  defaultProps: formMapDefaultProps,
  renderPreview: renderFormMapPreview,
  renderCodePreview: renderFormMapCodePreview,
  documentation: documentationMd
}

export default formMapConfig
