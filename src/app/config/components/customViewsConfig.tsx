import { CustomViews } from '@/registry/blocks/gis/custom-views/custom-views'
import { MapContainer } from '@/registry/blocks/gis/map-container/map-container'
import { ComponentConfig } from '../types'

export const customViewsPropsConfig = [
  {
    name: 'featureStyle.point.src',
    label: '点图标',
    type: 'text' as const,
    default: '',
    description: '点要素的图标URL'
  },
  {
    name: 'featureStyle.point.scale',
    label: '点图标缩放',
    type: 'number' as const,
    default: 1,
    min: 0.1,
    max: 5,
    step: 0.1
  },
  {
    name: 'featureStyle.line.color',
    label: '线颜色',
    type: 'color' as const,
    default: 'rgba(255, 0, 0, 0.8)'
  },
  {
    name: 'featureStyle.line.width',
    label: '线宽',
    type: 'number' as const,
    default: 2,
    min: 1,
    max: 20,
    step: 1
  },
  {
    name: 'featureStyle.line.fillColor',
    label: '填充颜色',
    type: 'color' as const,
    default: 'rgba(255, 0, 0, 0.2)'
  },
  {
    name: 'display',
    label: '显示',
    type: 'boolean' as const,
    default: true
  }
]

export const customViewsDefaultProps = {
  drawLine: [],
  featureStyle: {
    point: {
      src: '',
      scale: 1
    },
    line: {
      color: 'rgba(255, 0, 0, 0.8)',
      width: 2,
      fillColor: 'rgba(255, 0, 0, 0.2)'
    }
  },
  display: true
}

const renderCustomViewsPreview = (props: Record<string, unknown>) => {
  return (
    <div className="h-full flex flex-col">
      {/* 地图容器 */}
      <div className="flex-1 min-h-[300px] rounded-lg overflow-hidden border border-slate-200">
        <MapContainer
          width="100%"
          height="100%"
          viewOptions={{
            position: { center: [116.391, 39.9042] },
            zoom: 10
          }}
          cellKey="preview-map"
        >
          <CustomViews
            featureStyle={{
              point: {
                src: props['featureStyle.point.src'] as string,
                scale: props['featureStyle.point.scale'] as number
              },
              line: {
                color: props['featureStyle.line.color'] as string,
                width: props['featureStyle.line.width'] as number,
                fillColor: props['featureStyle.line.fillColor'] as string
              }
            }}
            display={props.display as boolean}
            cellKey="preview"
          />
        </MapContainer>
      </div>
      {/* 样式预览 */}
      <div className="mt-2 flex justify-center gap-4 p-2 bg-slate-50 rounded">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: (props['featureStyle.line.color'] as string) || 'rgba(255, 0, 0, 0.8)' }}
          />
          <span className="text-xs text-slate-500">线颜色</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded" 
            style={{ backgroundColor: (props['featureStyle.line.fillColor'] as string) || 'rgba(255, 0, 0, 0.2)' }}
          />
          <span className="text-xs text-slate-500">填充色</span>
        </div>
      </div>
    </div>
  )
}

const renderCustomViewsCodePreview = (props: Record<string, unknown>) => {
  return `<CustomViews
  drawLine={bindData}
  featureStyle={{
    point: {
      src: "${props['featureStyle.point.src'] || ''}",
      scale: ${props['featureStyle.point.scale'] || 1}
    },
    line: {
      color: "${props['featureStyle.line.color'] || 'rgba(255, 0, 0, 0.8)'}",
      width: ${props['featureStyle.line.width'] || 2},
      fillColor: "${props['featureStyle.line.fillColor'] || 'rgba(255, 0, 0, 0.2)'}"
    }
  }}
  display={${props.display}}
  cellKey="your-cell-key"
  map={mapInstance}
/>`
}

export const customViewsConfig: ComponentConfig = {
  id: 'customViews',
  name: '自定义层',
  propsConfig: customViewsPropsConfig,
  defaultProps: customViewsDefaultProps,
  renderPreview: renderCustomViewsPreview,
  renderCodePreview: renderCustomViewsCodePreview
}
