
import { GeoJson } from '@/registry/blocks/gis/geojson/geojson'
import { MapContainer } from '../map-container/map-container'
import { ComponentConfig } from '@/app/config/types'

export const geoJsonPropsConfig = [
    {
        name: 'source',
        label: 'GeoJSON URL',
        type: 'text' as const,
        default: '',
        placeholder: 'GeoJSON 数据地址',
        description: 'GeoJSON 文件地址'
    },
    {
        name: 'coordinateType',
        label: '坐标系',
        type: 'select' as const,
        default: 'EPSG:4326',
        options: [
            { value: 'EPSG:4326', label: 'EPSG:4326 (WGS84)' },
            { value: 'EPSG:3857', label: 'EPSG:3857 (WebMercator)' },
            { value: 'GCJ02', label: 'GCJ02 (火星坐标)' },
            { value: 'BD09', label: 'BD09 (百度坐标)' }
        ]
    },
    // Line Style Group
    {
        name: 'lineStyle.color',
        label: '线条颜色',
        type: 'color' as const,
        default: 'rgba(255, 0, 0, 1)'
    },
    {
        name: 'lineStyle.width',
        label: '线条宽度',
        type: 'number' as const,
        default: 2,
        min: 1, max: 20
    },
    {
        name: 'lineStyle.background',
        label: '填充颜色',
        type: 'color' as const,
        default: 'rgba(255, 255, 255, 0.2)'
    },
    {
        name: 'display',
        label: '是否显示',
        type: 'boolean' as const,
        default: true
    },
    {
        name: 'opacity',
        label: '透明度',
        type: 'number' as const,
        default: 1,
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        name: 'zIndex',
        label: '层级',
        type: 'number' as const,
        default: 0
    }
]

export const geoJsonDefaultProps = {
    source: '',
    coordinateType: 'EPSG:4326',
    lineStyle: {
        color: 'rgba(255, 0, 0, 1)',
        width: 2,
        background: 'rgba(255, 255, 255, 0.2)'
    },
    display: true,
    opacity: 1,
    zIndex: 0
}

const renderGeoJsonPreview = (props: Record<string, any>) => {
    return (
        <div className="w-full h-[400px] border border-gray-200 rounded overflow-hidden relative">
            <MapContainer>
                <GeoJson
                    source={props.source}
                    coordinateType={props.coordinateType}
                    lineStyle={{
                        color: props['lineStyle.color'],
                        width: props['lineStyle.width'],
                        background: props['lineStyle.background']
                    }}
                    display={props.display}
                    layerBase={{
                        opacity: props.opacity,
                        zIndex: props.zIndex,
                    }}
                    cellKey="preview"
                />
            </MapContainer>
        </div>
    )
}

const renderGeoJsonCodePreview = (props: Record<string, any>) => {
    return `<GeoJson
  source="${props.source}"
  coordinateType="${props.coordinateType}"
  lineStyle={{
    color: "${props['lineStyle.color']}",
    width: ${props['lineStyle.width']},
    background: "${props['lineStyle.background']}"
  }}
  display={${props.display}}
  layerBase={{
    opacity: ${props.opacity},
    zIndex: ${props.zIndex}
  }}
  cellKey="your-cell-key"
/>`
}

export const geoJsonConfig: ComponentConfig = {
    id: 'geojson-layer',
    name: 'geojson层',
    propsConfig: geoJsonPropsConfig,
    defaultProps: geoJsonDefaultProps,
    renderPreview: renderGeoJsonPreview,
    renderCodePreview: renderGeoJsonCodePreview
}
