
import { Kmz } from '@/registry/blocks/gis/kmz/kmz'
import { MapContainer } from '../map-container/map-container'
import { ComponentConfig } from '@/app/config/types'

export const kmzPropsConfig = [
    {
        name: 'source',
        label: 'KMZ URL',
        type: 'text' as const,
        default: '',
        placeholder: 'KMZ 数据地址',
        description: '远程 KMZ 文件地址'
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

export const kmzDefaultProps = {
    source: '',
    coordinateType: 'EPSG:4326',
    display: true,
    opacity: 1,
    zIndex: 0
}

const renderKmzPreview = (props: Record<string, any>) => {
    return (
        <div className="w-full h-[300px] border border-gray-200 rounded overflow-hidden relative">
            <MapContainer>
                <Kmz
                    source={props.source}
                    coordinateType={props.coordinateType}
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

const renderKmzCodePreview = (props: Record<string, any>) => {
    return `<Kmz
  source="${props.source}"
  coordinateType="${props.coordinateType}"
  display={${props.display}}
  layerBase={{
    opacity: ${props.opacity},
    zIndex: ${props.zIndex}
  }}
  cellKey="your-cell-key"
/>`
}

export const kmzConfig: ComponentConfig = {
    id: 'kmz-layer',
    name: 'kmz层',
    propsConfig: kmzPropsConfig,
    defaultProps: kmzDefaultProps,
    renderPreview: renderKmzPreview,
    renderCodePreview: renderKmzCodePreview
}
