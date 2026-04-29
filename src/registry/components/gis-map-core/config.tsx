import { GisMapCore, ViewOptions, ZoomOption, ScaleLineOption, ExtentOption } from '@/registry/components/gis-map-core/gis-map-core'
import { ComponentConfig, PropConfig } from '@/app/config/types'
import documentationMd from './gis-map-core.md?raw'

// 默认视图配置（对应原系统的 viewOptions）
const defaultViewOptions: ViewOptions = {
    position: {
        center: [116.391, 39.9042],
        pick: false
    },
    zoom: 10,
    maxZoom: 18,
    minZoom: 3,
    rotation: 0,
    recordRotationActive: false,
    animation: true,
    duration: 1000
}

// 默认缩放控件配置（对应原系统的 zoomOption）
const defaultZoomOption: ZoomOption = {
    show: true,
    zoomInTipLabel: '放大',
    zoomOutTipLabel: '缩小',
    minZoom: 3,
    maxZoom: 18
}

// 默认比例尺配置（对应原系统的 scaleLine）
const defaultScaleLine: ScaleLineOption = {
    show: true,
    bar: false,
    text: false
}

// 默认拖拽边界范围配置（对应原系统的 extentOption）
const defaultExtentOption: ExtentOption = {}

export const mapContainerPropsConfig: PropConfig[] = [
    {
        name: 'width',
        label: '宽度',
        type: 'text' as const,
        default: '100%',
        placeholder: '例如: 100%, 800px'
    },
    {
        name: 'height',
        label: '高度',
        type: 'text' as const,
        default: '400px',
        placeholder: '例如: 400px, 100vh'
    },
    {
        name: 'viewOptions',
        label: '视图配置 (viewOptions)',
        type: 'json' as const,
        default: JSON.stringify(defaultViewOptions, null, 2),
        description:
            '对应原配置中的 viewOptions，JSON 结构示例：{"position":{"center":[116.391,39.9042],"pick":false},"zoom":10,"maxZoom":18,"minZoom":3,"rotation":0,"recordRotationActive":false,"animation":true,"duration":1000}'
    },
    {
        name: 'zoomOption',
        label: '缩放控件配置 (zoomOption)',
        type: 'json' as const,
        default: JSON.stringify(defaultZoomOption, null, 2),
        description:
            '对应原配置中的 zoomOption，JSON 结构示例：{"show":true,"zoomInTipLabel":"放大","zoomOutTipLabel":"缩小","minZoom":3,"maxZoom":18}'
    },
    {
        name: 'scaleLine',
        label: '比例尺配置 (scaleLine)',
        type: 'json' as const,
        default: JSON.stringify(defaultScaleLine, null, 2),
        description:
            '对应原配置中的 scaleLine，JSON 结构示例：{"show":true,"minWidth":64,"units":"metric","steps":4,"bar":false,"text":false}'
    },
    {
        name: 'extentOption',
        label: '拖拽边界范围 (extentOption)',
        type: 'json' as const,
        default: JSON.stringify(defaultExtentOption, null, 2),
        description:
            '对应原配置中的 extentOption，JSON 结构示例：{"westLon":115.0,"southLat":39.0,"eastLon":118.0,"northLat":41.0}'
    }
]

export const mapContainerDefaultProps = {
    width: '100%',
    height: '400px',
    viewOptions: defaultViewOptions,
    zoomOption: defaultZoomOption,
    scaleLine: defaultScaleLine,
    extentOption: defaultExtentOption
}

const renderGisMapCorePreview = (props: Record<string, any>) => {
    const width = props.width ?? mapContainerDefaultProps.width
    const height = props.height ?? mapContainerDefaultProps.height
    // 解析 JSON 字符串或直接使用对象
    const parseJson = <T,>(value: any, fallback: T): T => {
        if (!value) return fallback
        if (typeof value === 'string') {
            try {
                return JSON.parse(value) as T
            } catch {
                return fallback
            }
        }
        return value as T
    }

    const viewOptions: ViewOptions = parseJson<ViewOptions>(props.viewOptions, mapContainerDefaultProps.viewOptions)
    const zoomOption: ZoomOption = parseJson<ZoomOption>(props.zoomOption, mapContainerDefaultProps.zoomOption)
    const scaleLine: ScaleLineOption = parseJson<ScaleLineOption>(props.scaleLine, mapContainerDefaultProps.scaleLine)
    const extentOption: ExtentOption | undefined =
        props.extentOption && Object.keys(props.extentOption).length > 0
            ? parseJson<ExtentOption>(props.extentOption, mapContainerDefaultProps.extentOption)
            : mapContainerDefaultProps.extentOption

    return (
        <div className="w-full flex items-center justify-center p-4">
            <GisMapCore
                width={width}
                height={height}
                viewOptions={viewOptions}
                zoomOption={zoomOption}
                scaleLine={scaleLine}
                extentOption={extentOption}
            />
        </div>
    )
}

const renderGisMapCoreCodePreview = (props: Record<string, any>) => {
    const width = props.width ?? mapContainerDefaultProps.width
    const height = props.height ?? mapContainerDefaultProps.height
    const parseJson = <T,>(value: any, fallback: T): T => {
        if (!value) return fallback
        if (typeof value === 'string') {
            try {
                return JSON.parse(value) as T
            } catch {
                return fallback
            }
        }
        return value as T
    }

    const viewOptions: ViewOptions = parseJson<ViewOptions>(props.viewOptions, mapContainerDefaultProps.viewOptions)
    const zoomOption: ZoomOption = parseJson<ZoomOption>(props.zoomOption, mapContainerDefaultProps.zoomOption)
    const scaleLine: ScaleLineOption = parseJson<ScaleLineOption>(props.scaleLine, mapContainerDefaultProps.scaleLine)
    const extentOption: ExtentOption | undefined =
        props.extentOption && Object.keys(props.extentOption).length > 0
            ? parseJson<ExtentOption>(props.extentOption, mapContainerDefaultProps.extentOption)
            : mapContainerDefaultProps.extentOption

    return `<GisMapCore
  width="${width}"
  height="${height}"
  viewOptions={${JSON.stringify(viewOptions)}}
  zoomOption={${JSON.stringify(zoomOption)}}
  scaleLine={${JSON.stringify(scaleLine)}}
  extentOption={${JSON.stringify(extentOption)}}
/>`
}

export const mapContainerConfig: ComponentConfig = {
    id: 'gis-map-core',
    name: '2D地图',
    propsConfig: mapContainerPropsConfig,
    defaultProps: mapContainerDefaultProps,
    renderPreview: renderGisMapCorePreview,
    renderCodePreview: renderGisMapCoreCodePreview,
    documentation: documentationMd
}
