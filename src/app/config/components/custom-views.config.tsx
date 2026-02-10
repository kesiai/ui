import { CustomViews, DrawLineItem } from '@/registry/components/gis-custom-layer/gis-custom-layer'
import { MapContainer } from '@/registry/components/gis-map-core/gis-map-core'
import { ComponentConfig } from '../types'

export const customViewsPropsConfig = [
  {
    name: 'drawLine',
    label: '绘制数据',
    type: 'text' as const,
    default: '',
    description: '要素数据'
  },
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

const defaultDrawStyleProps = {
  drawLine: [ 
    {
      location: { type: 'Point', coordinates: [116.391, 39.9042] },
      dirction: 23,
      style: { point: { 'snumber': true } }
    },
    {
      location: { type: 'LineString', coordinates: [ [117.116,40.363],[118.116,40.363] ] },
      style: { line: { color: '#ff0000', 'snumber': true } }
    },
    {
      location: { type: 'Polygon', coordinates: [ [ [ 115.77467929287283, 40.70296009092331 ], [ 116.64946001454, 40.36561363397837 ], [ 115.80078743704539, 39.864378506529334 ], [ 115.77467929287283, 40.70296009092331 ] ] ] },
      style: { line: { color: '#ff0000', 'snumber': true } }
    },
    {
      location: { type: 'Circle', coordinates: { center:[ 117.77061242001318,40.439482340800765 ], radius: 11800 } },
      style: { line: { color: '#ff0000', 'snumber': true } }
    }
  ],
  featureStyle: {
    point: {
      src: '',
      scale: 1
    },
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
  }
}

export const customViewsDefaultProps = {
  drawLine: JSON.stringify(defaultDrawStyleProps.drawLine),
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
  let customData: DrawLineItem[] = defaultDrawStyleProps.drawLine as DrawLineItem[]

  // 如果 drawLine 是字符串，尝试解析
  if (typeof props.drawLine === 'string') {
    try {
      customData = JSON.parse(props.drawLine) as DrawLineItem[]
    } catch {
      customData = []
    }
  } else if (Array.isArray(props.drawLine)) {
    customData = props.drawLine as DrawLineItem[]
  }
  return (
    <div className="flex flex-col">
      {/* 地图容器 */}
      <div className="rounded-lg overflow-hidden border border-slate-200">
        <MapContainer
          width="100%"
          height={300}
          viewOptions={{
            position: { center: [116.391, 39.9042] },
            zoom: 10
          }}
          cellKey="preview-map"
        >
          <CustomViews
            drawLine={customData}
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

export { defaultDrawStyleProps }
