import * as React from "react"
import Area from '@/registry/blocks/form/form-area/form-area.tsx'
import { ComponentConfig } from '@/app/config/types'

export const AreaPreview: React.FC<{ props: Record<string, any> }> = ({ props }) => {
  const [value, setValue] = React.useState<string>('')

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full" style={{ maxWidth: `${props.width || 100}%` }}>
        <Area
          areaType={props.areaType}
          // disabled={props.disabled}
          // placeholder={props.placeholder}
          input={{ value, onChange: setValue }}
          // cellKey="preview"
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
  return `<Area
  areaType="${props.areaType}"
  disabled={${props.disabled}}
  placeholder="${props.placeholder}"
  input="${props.input}"
  cellKey="your-cell-key"
/>`
}

export const areaConfig: ComponentConfig = {
  id: 'form-area',
  name: 'Area 区域',
  propsConfig: areaPropsConfig,
  defaultProps: areaDefaultProps,
  renderPreview: renderAreaPreview,
  renderCodePreview: renderAreaCodePreview
}