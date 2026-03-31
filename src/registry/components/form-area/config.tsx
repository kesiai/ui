import * as React from "react"
import { FormArea } from '@/registry/components/form-area/form-area'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-area.md?raw'

export const AreaPreview: React.FC<{ props: Record<string, any> }> = ({ props }) => {
  const [value, setValue] = React.useState<string>('')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full" style={{ maxWidth: `${props.width || 100}%` }}>
        <FormArea
          value={value}
          onChange={setValue}
          config={{
            areaType: props.areaType,
          }}
          cellKey="preview"
        />
      </div>
    </div>
  )
}

export const areaPropsConfig = [
  {
    name: 'areaType',
    label: '区域类型',
    type: 'select' as const,
    default: 'pca',
    options: [
      { value: 'p', label: '省' },
      { value: 'pc', label: '省市' },
      { value: 'pca', label: '省市区' }
    ]
  },
]

export const areaDefaultProps = {
  areaType: 'pca'
}

const renderAreaPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <AreaPreview props={props} />
      </div>
    </div>
  )
}

const renderAreaCodePreview = (props: Record<string, any>) => {
  return `<FormArea
  value={value}
  onChange={setValue}
  config={{
    areaType: "${props.areaType}"
  }}
  cellKey="your-cell-key"
/>`
}

export const areaConfig: ComponentConfig = {
  id: 'form-area',
  name: '区域',
  propsConfig: areaPropsConfig,
  defaultProps: areaDefaultProps,
  renderPreview: renderAreaPreview,
  renderCodePreview: renderAreaCodePreview,
  documentation: documentationMd
}
