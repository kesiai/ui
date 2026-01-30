import { PolygonViews } from '@/registry/blocks/gis/polygon-views/polygon-views'
import { MapContainer } from '@/registry/blocks/gis/map-container/map-container'
import { ComponentConfig } from '../types'

export const polygonViewsPropsConfig = [
  {
    name: 'defaultStyle.line.color',
    label: '线颜色',
    type: 'color' as const,
    default: 'rgba(255, 0, 0, 0.8)'
  },
  {
    name: 'defaultStyle.line.width',
    label: '线宽',
    type: 'number' as const,
    default: 2,
    min: 1,
    max: 20,
    step: 1
  },
  {
    name: 'defaultStyle.line.snumber',
    label: '线显示序号',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'defaultStyle.polygon.color',
    label: '多边形边框颜色',
    type: 'color' as const,
    default: 'rgba(255, 0, 0, 0.8)'
  },
  {
    name: 'defaultStyle.polygon.width',
    label: '多边形边框宽度',
    type: 'number' as const,
    default: 2,
    min: 1,
    max: 20,
    step: 1
  },
  {
    name: 'defaultStyle.polygon.fillColor',
    label: '多边形填充颜色',
    type: 'color' as const,
    default: 'rgba(255, 0, 0, 0.2)'
  },
  {
    name: 'defaultStyle.polygon.snumber',
    label: '多边形显示序号',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'showToolbar',
    label: '显示工具栏',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'readonly',
    label: '只读',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'display',
    label: '显示',
    type: 'boolean' as const,
    default: true
  }
]

export const polygonViewsDefaultProps = {
  data: [],
  defaultStyle: {
    line: {
      color: 'rgba(255, 0, 0, 0.8)',
      width: 2,
      snumber: false
    },
    polygon: {
      color: 'rgba(255, 0, 0, 0.8)',
      width: 2,
      fillColor: 'rgba(255, 0, 0, 0.2)',
      snumber: false
    }
  },
  showToolbar: false,
  readonly: false,
  display: true
}

const renderPolygonViewsPreview = (props: Record<string, unknown>) => {
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
          <PolygonViews
            defaultStyle={{
              line: {
                color: props['defaultStyle.line.color'] as string,
                width: props['defaultStyle.line.width'] as number,
                snumber: props['defaultStyle.line.snumber'] as boolean
              },
              polygon: {
                color: props['defaultStyle.polygon.color'] as string,
                width: props['defaultStyle.polygon.width'] as number,
                fillColor: props['defaultStyle.polygon.fillColor'] as string,
                snumber: props['defaultStyle.polygon.snumber'] as boolean
              }
            }}
            showToolbar={props.showToolbar as boolean}
            readonly={props.readonly as boolean}
            display={props.display as boolean}
            cellKey="preview"
          />
        </MapContainer>
      </div>
      {/* 样式预览 */}
      <div className="mt-2 flex justify-center gap-4 p-2 bg-slate-50 rounded">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border-2" 
            style={{ 
              borderColor: (props['defaultStyle.polygon.color'] as string) || 'rgba(255, 0, 0, 0.8)',
              backgroundColor: (props['defaultStyle.polygon.fillColor'] as string) || 'rgba(255, 0, 0, 0.2)'
            }}
          />
          <span className="text-xs text-slate-500">多边形</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-1 rounded" 
            style={{ backgroundColor: (props['defaultStyle.line.color'] as string) || 'rgba(255, 0, 0, 0.8)' }}
          />
          <span className="text-xs text-slate-500">线段</span>
        </div>
        {Boolean(props.showToolbar) && (
          <span className="text-xs text-blue-500">工具栏已启用</span>
        )}
      </div>
    </div>
  )
}

const renderPolygonViewsCodePreview = (props: Record<string, unknown>) => {
  return `<PolygonViews
  data={polygonData}
  defaultStyle={{
    line: {
      color: "${props['defaultStyle.line.color'] || 'rgba(255, 0, 0, 0.8)'}",
      width: ${props['defaultStyle.line.width'] || 2},
      snumber: ${props['defaultStyle.line.snumber'] || false}
    },
    polygon: {
      color: "${props['defaultStyle.polygon.color'] || 'rgba(255, 0, 0, 0.8)'}",
      width: ${props['defaultStyle.polygon.width'] || 2},
      fillColor: "${props['defaultStyle.polygon.fillColor'] || 'rgba(255, 0, 0, 0.2)'}",
      snumber: ${props['defaultStyle.polygon.snumber'] || false}
    }
  }}
  showToolbar={${props.showToolbar || false}}
  readonly={${props.readonly || false}}
  display={${props.display}}
  cellKey="your-cell-key"
  map={mapInstance}
/>`
}

export const polygonViewsConfig: ComponentConfig = {
  id: 'polygonViews',
  name: '区域层',
  propsConfig: polygonViewsPropsConfig,
  defaultProps: polygonViewsDefaultProps,
  renderPreview: renderPolygonViewsPreview,
  renderCodePreview: renderPolygonViewsCodePreview
}
