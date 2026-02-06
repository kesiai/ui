
import { XYZ } from '@/registry/blocks/gis/gis-xyz-tile/xyz'
import { MapContainer } from '../gis-map-core/map-container'
import { ComponentConfig } from '@/app/config/types'

export const xyzPropsConfig = [
    {
        name: 'source',
        label: '瓦片源地址',
        type: 'text' as const,
        default: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
        placeholder: '请输入 XYZ 瓦片服务地址'
    },
    {
        name: 'coordinateType',
        label: '坐标系',
        type: 'select' as const,
        default: 'EPSG:3857',
        options: [
            { value: 'EPSG:3857', label: 'Web Mercator (EPSG:3857)' },
            { value: 'EPSG:4326', label: 'WGS84 (EPSG:4326)' },
            { value: 'GCJ02', label: 'GCJ02 (火星坐标)' },
            { value: 'BD09', label: 'BD09 (百度坐标)' }
        ]
    },
    {
        name: 'coorDefs',
        label: '坐标系注册',
        type: 'text' as const,
        default: '{}',
        placeholder: '{"defs": "...", "extent": [], "dataProjection": "EPSG:..."}'
    },
    {
        name: 'display',
        label: '是否显示',
        type: 'boolean' as const,
        default: true
    },
    // Filter Settings
    {
        name: 'canvasFilter',
        label: '启用滤镜',
        type: 'boolean' as const,
        default: false
    },
    {
        name: 'grayscale',
        label: '灰度 (0-100)',
        type: 'number' as const,
        default: 98,
        min: 0, max: 100
    },
    {
        name: 'invert',
        label: '反色 (0-100)',
        type: 'number' as const,
        default: 100,
        min: 0, max: 100
    },
    {
        name: 'sepia',
        label: '褐色 (0-100)',
        type: 'number' as const,
        default: 20,
        min: 0, max: 100
    },
    {
        name: 'hueRotate',
        label: '色相旋转 (0-360)',
        type: 'number' as const,
        default: 180,
        min: 0, max: 360
    },
    {
        name: 'saturate',
        label: '饱和度 (0-3000)',
        type: 'number' as const,
        default: 1600,
        min: 0, max: 3000
    },
    {
        name: 'brightness',
        label: '亮度 (0-500)',
        type: 'number' as const,
        default: 80,
        min: 0, max: 500
    },
    {
        name: 'contrast',
        label: '对比度 (0-500)',
        type: 'number' as const,
        default: 90,
        min: 0, max: 500
    },
    // Layer Base
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

export const xyzDefaultProps = {
    source: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
    coordinateType: 'EPSG:3857',
    coorDefs: '{}',
    display: true,
    canvasFilter: false,
    grayscale: 98,
    invert: 100,
    sepia: 20,
    hueRotate: 180,
    saturate: 1600,
    brightness: 80,
    contrast: 90,
    opacity: 1,
    zIndex: 0,
    minZoom: 0,
    maxZoom: 18
}

const renderXYZPreview = (props: Record<string, any>) => {
    let coorDefs = {}
    try {
        coorDefs = typeof props.coorDefs === 'string' ? JSON.parse(props.coorDefs) : props.coorDefs
    } catch {
        coorDefs = {}
    }

    return (
        <div className="w-full h-[300px] border border-gray-200 rounded overflow-hidden relative">
            <MapContainer>
                <XYZ
                    source={props.source}
                    coordinateType={props.coordinateType}
                    coorDefs={coorDefs}
                    display={props.display}
                    canvasFilter={props.canvasFilter}
                    canvasSetting={{
                        grayscale: props.grayscale,
                        invert: props.invert,
                        sepia: props.sepia,
                        'hue-rotate': props.hueRotate,
                        saturate: props.saturate,
                        brightness: props.brightness,
                        contrast: props.contrast
                    }}
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

const renderXYZCodePreview = (props: Record<string, any>) => {
    let coorDefsString = "{}"
    try {
        coorDefsString = typeof props.coorDefs === 'string' ? props.coorDefs : JSON.stringify(props.coorDefs, null, 2)
    } catch {
        // ignore
    }

    return `<XYZ
  source="${props.source}"
  coordinateType="${props.coordinateType}"
  coorDefs={${coorDefsString}}
  display={${props.display}}
  canvasFilter={${props.canvasFilter}}
  canvasSetting={{
    grayscale: ${props.grayscale},
    invert: ${props.invert},
    sepia: ${props.sepia},
    'hue-rotate': ${props.hueRotate},
    saturate: ${props.saturate},
    brightness: ${props.brightness},
    contrast: ${props.contrast}
  }}
  layerBase={{
    opacity: ${props.opacity},
    zIndex: ${props.zIndex},
    minZoom: ${props.minZoom},
    maxZoom: ${props.maxZoom}
  }}
  cellKey="your-cell-key"
/>`
}

export const xyzConfig: ComponentConfig = {
    id: 'xyz-layer',
    name: 'xyz层',
    propsConfig: xyzPropsConfig,
    defaultProps: xyzDefaultProps,
    renderPreview: renderXYZPreview,
    renderCodePreview: renderXYZCodePreview
}
