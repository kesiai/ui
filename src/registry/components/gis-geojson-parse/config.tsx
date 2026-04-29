
import { GisGeoJsonParse } from '@/registry/components/gis-geojson-parse/gis-geojson-parse'
import { GisMapCore } from '../gis-map-core/gis-map-core'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './gis-geojson-parse.md?raw'

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

const renderGisGeoJsonParsePreview = (props: Record<string, any>) => {
    return (
        <div className="w-full h-100 border border-gray-200 rounded overflow-hidden relative">
            <GisMapCore>
                <GisGeoJsonParse
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
                />
            </GisMapCore>
        </div>
    )
}

const renderGisGeoJsonParseCodePreview = (props: Record<string, any>) => {
    return `<GisGeoJsonParse
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
/>`
}

export const geoJsonConfig: ComponentConfig = {
    id: 'gis-geojson-parse',
    name: 'GeoJSON层',
    propsConfig: geoJsonPropsConfig,
    defaultProps: geoJsonDefaultProps,
    renderPreview: renderGisGeoJsonParsePreview,
    renderCodePreview: renderGisGeoJsonParseCodePreview,
    documentation: documentationMd
}
