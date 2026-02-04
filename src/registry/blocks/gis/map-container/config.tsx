
import { MapContainer } from '@/registry/blocks/gis/map-container/map-container'
import { ComponentConfig } from '@/app/config/types'
import { ZoomOption, ScaleLineOption } from '@/registry/blocks/gis/map-container/map-container'

export const mapContainerPropsConfig = [
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
        name: 'zoom',
        label: '缩放级别',
        type: 'number' as const,
        default: 10,
        min: 0,
        max: 22,
        step: 1
    },
    {
        name: 'longitude',
        label: '中心经度',
        type: 'number' as const,
        default: 116.391,
        min: -180,
        max: 180,
        step: 0.0001
    },
    {
        name: 'latitude',
        label: '中心纬度',
        type: 'number' as const,
        default: 39.9042,
        min: -90,
        max: 90,
        step: 0.0001
    },
    {
        name: 'maxZoom',
        label: '最大缩放',
        type: 'number' as const,
        default: 18,
        min: 0,
        max: 22
    },
    {
        name: 'minZoom',
        label: '最小缩放',
        type: 'number' as const,
        default: 3,
        min: 0,
        max: 22
    },
    {
        name: 'showZoomControl',
        label: '显示缩放控件',
        type: 'boolean' as const,
        default: true
    },
    {
        name: 'showScaleLine',
        label: '显示比例尺',
        type: 'boolean' as const,
        default: true
    }
]

export const mapContainerDefaultProps = {
    width: '100%',
    height: '400px',
    zoom: 10,
    longitude: 116.391,
    latitude: 39.9042,
    maxZoom: 18,
    minZoom: 3,
    showZoomControl: true,
    showScaleLine: true
}

const renderMapContainerPreview = (props: Record<string, any>) => {
    const viewOptions = {
        position: {
            center: [props.longitude, props.latitude] as [number, number],
            pick: false
        },
        zoom: props.zoom,
        maxZoom: props.maxZoom,
        minZoom: props.minZoom
    }

    const zoomOption: ZoomOption = {
        show: props.showZoomControl,
        zoomInTipLabel: '放大',
        zoomOutTipLabel: '缩小',
        minZoom: props.minZoom,
        maxZoom: props.maxZoom
    }

    const scaleLine: ScaleLineOption = {
        show: props.showScaleLine,
        bar: false,
        text: false
    }

    return (
        <div className="w-full flex items-center justify-center p-4">
            <MapContainer
                width={props.width}
                height={props.height}
                viewOptions={viewOptions}
                zoomOption={zoomOption}
                scaleLine={scaleLine}
                cellKey="preview"
            />
        </div>
    )
}

const renderMapContainerCodePreview = (props: Record<string, any>) => {
    return `<MapContainer
  width="${props.width}"
  height="${props.height}"
  viewOptions={{
    position: {
      center: [${props.longitude}, ${props.latitude}],
      pick: false
    },
    zoom: ${props.zoom},
    maxZoom: ${props.maxZoom},
    minZoom: ${props.minZoom}
  }}
  zoomOption={{
    show: ${props.showZoomControl},
    zoomInTipLabel: '放大',
    zoomOutTipLabel: '缩小',
    minZoom: ${props.minZoom},
    maxZoom: ${props.maxZoom}
  }}
  scaleLine={{
    show: ${props.showScaleLine},
    bar: false,
    text: false
  }}
  cellKey="your-cell-key"
/>`
}

export const mapContainerConfig: ComponentConfig = {
    id: 'map-container',
    name: '2D地图',
    propsConfig: mapContainerPropsConfig,
    defaultProps: mapContainerDefaultProps,
    renderPreview: renderMapContainerPreview,
    renderCodePreview: renderMapContainerCodePreview
}
