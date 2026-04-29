import { GisPolygonDraw, PolygonData } from '@/registry/components/gis-polygon-draw/gis-polygon-draw'
import { GisMapCore } from '../gis-map-core/gis-map-core'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './gis-polygon-draw.md?raw'

export const polygonViewsPropsConfig = [
    {
        name: 'data',
        label: '绘制数据',
        type: 'text' as const,
        default: '',
        description: '要素数据'
    },
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
        name: 'display',
        label: '显示',
        type: 'boolean' as const,
        default: true
    }
]

const defaultPolygonData: PolygonData[] = [
    {
        id: '1',
        type: 'LineString',
        coordinates: [[117.116, 40.363], [118.116, 40.363]]
    },
    {
        id: '2',
        type: 'Polygon',
        coordinates: [[[115.77467929287283, 40.70296009092331], [116.64946001454, 40.36561363397837], [115.80078743704539, 39.864378506529334], [115.77467929287283, 40.70296009092331]]]
    },
    {
        id: '3',
        type: 'Circle',
        coordinates: { center: [117.77061242001318, 40.439482340800765], radius: 11800 }
    }
]

export const polygonViewsDefaultProps = {
    data: JSON.stringify(defaultPolygonData),
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
    display: true
}

const renderGisPolygonDrawPreview = (props: Record<string, unknown>) => {
    let polygonData: PolygonData[] = defaultPolygonData

    if (typeof props.data === 'string') {
        try {
            polygonData = JSON.parse(props.data) as PolygonData[]
        } catch {
            polygonData = []
        }
    } else if (Array.isArray(props.data)) {
        polygonData = props.data as PolygonData[]
    }
    return (
        <div className="flex flex-col">
            {/* 地图容器 */}
            <div className="rounded-lg overflow-hidden border border-slate-200">
                <GisMapCore
                    width="100%"
                    height={400}
                    viewOptions={{
                        position: { center: [116.391, 39.9042] },
                        zoom: 10
                    }}
                >
                    <GisPolygonDraw
                        data={polygonData}
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
                        display={props.display as boolean}
                    />
                </GisMapCore>
            </div>
        </div>
    )
}

const renderGisPolygonDrawCodePreview = (props: Record<string, unknown>) => {
    return `<GisPolygonDraw
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
  display={${props.display}}
  map={mapInstance}
/>`
}

export const polygonViewsConfig: ComponentConfig = {
    id: 'gis-polygon-draw',
    name: '区域层', // Updated name to match reference if needed, but keeping registry ID consistent
    propsConfig: polygonViewsPropsConfig,
    defaultProps: polygonViewsDefaultProps,
    renderPreview: renderGisPolygonDrawPreview,
    renderCodePreview: renderGisPolygonDrawCodePreview,
    documentation: documentationMd
}
