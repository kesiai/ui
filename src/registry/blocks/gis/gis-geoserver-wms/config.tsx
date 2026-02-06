
import { GeoserverWms } from '@/registry/blocks/gis/gis-geoserver-wms/geoserver-wms'
import { MapContainer } from '../gis-map-core/map-container'
import { ComponentConfig } from '@/app/config/types'

export const geoserverWmsPropsConfig = [
    {
        name: 'source',
        label: '服务地址',
        type: 'text' as const,
        default: 'http://localhost:8080/geoserver/wms',
        placeholder: 'WMS 服务地址 URL',
        description: 'GeoServer WMS服务地址'
    },
    {
        name: 'VERSION',
        label: 'WMS版本',
        type: 'select' as const,
        default: '1.1.0',
        options: [
            { value: '1.1.0', label: '1.1.0' },
            { value: '1.1.1', label: '1.1.1' },
            { value: '1.3.0', label: '1.3.0' }
        ],
        description: 'WMS服务版本号'
    },
    {
        name: 'layers',
        label: '图层名称',
        type: 'text' as const,
        default: 'workspace:layer',
        placeholder: 'WMS 图层名称(LAYERS)',
        description: 'WMS图层名称，格式：workspace:layer'
    },
    {
        name: 'coordinateType',
        label: '投影类型',
        type: 'select' as const,
        default: 'EPSG:4326',
        options: [
            { value: 'EPSG:4326', label: 'EPSG:4326 (经纬度)' },
            { value: 'EPSG:3857', label: 'EPSG:3857 (墨卡托)' },
            { value: 'WGS84', label: 'WGS84' },
            { value: 'WGS1984', label: 'WGS1984' },
            { value: 'EPSG:900913', label: 'EPSG:900913' },
            { value: 'EPSG:102100', label: 'EPSG:102100' },
            { value: 'WebMercator', label: 'WebMercator' }
        ],
        description: '地图投影类型'
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
    },
    {
        name: 'minZoom',
        label: '最小缩放',
        type: 'number' as const,
        default: 0
    },
    {
        name: 'maxZoom',
        label: '最大缩放',
        type: 'number' as const,
        default: 18
    }
]

export const geoserverWmsDefaultProps = {
    source: 'http://localhost:8080/geoserver/wms',
    VERSION: '1.1.0',
    layers: 'workspace:layer',
    coordinateType: 'EPSG:4326',
    display: true,
    opacity: 1,
    zIndex: 0,
    minZoom: 0,
    maxZoom: 18
}

const renderGeoserverWmsPreview = (props: Record<string, any>) => {
    return (
        <div className="w-full h-[400px] border border-gray-200 rounded overflow-hidden relative">
            <MapContainer>
                <GeoserverWms
                    source={props.source}
                    layers={props.layers}
                    VERSION={props.VERSION}
                    coordinateType={props.coordinateType}
                    display={props.display}
                    layerBase={{
                        opacity: props.opacity,
                        zIndex: props.zIndex,
                        minZoom: props.minZoom,
                        maxZoom: props.maxZoom
                    }}
                    cellKey="preview"
                />
            </MapContainer>
        </div>
    )
}

const renderGeoserverWmsCodePreview = (props: Record<string, any>) => {
    return `<GeoserverWms
  source="${props.source}"
  layers="${props.layers}"
  VERSION="${props.VERSION}"
  coordinateType="${props.coordinateType}"
  display={${props.display}}
  layerBase={{
    opacity: ${props.opacity},
    zIndex: ${props.zIndex},
    minZoom: ${props.minZoom},
    maxZoom: ${props.maxZoom}
  }}
  cellKey="your-cell-key"
/>`
}

export const geoserverWmsConfig: ComponentConfig = {
    id: 'geoserver-wms',
    name: 'geoserver-wms层',
    propsConfig: geoserverWmsPropsConfig,
    defaultProps: geoserverWmsDefaultProps,
    renderPreview: renderGeoserverWmsPreview,
    renderCodePreview: renderGeoserverWmsCodePreview
}
