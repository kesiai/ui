import { GeoserverWms, LayerBase } from '@/registry/components/gis-geoserver-wms/gis-geoserver-wms'
import { MapContainer } from '@/registry/components/gis-map-core/gis-map-core'
import { ComponentConfig } from '../types'

// 默认配置
const defaultGeoserverwmsProps = {
  source: 'http://localhost:8080/geoserver/wms',
  coordinateType: 'EPSG:3857',
  VERSION: '1.1.0',
  layers: 'workspace:layer',
  layerBase: {
    opacity: 1,
    zIndex: 0,
    minZoom: 0,
    maxZoom: 28
  },
  display: true
}

export const GeoserverWmsPropsConfig = [
  {
    name: 'source',
    label: 'WMS服务地址',
    type: 'text' as const,
    default: defaultGeoserverwmsProps.source,
    description: 'GeoServer WMS服务地址'
  },
  {
    name: 'VERSION',
    label: 'WMS版本',
    type: 'text' as const,
    default: defaultGeoserverwmsProps.VERSION,
    description: 'WMS服务版本号，如1.1.0、1.3.0'
  },
  {
    name: 'layers',
    label: '图层名称',
    type: 'text' as const,
    default: defaultGeoserverwmsProps.layers,
    description: 'WMS图层名称，格式：workspace:layer'
  },
  {
    name: 'title',
    label: '图层标题',
    type: 'text' as const,
    default: 'geoserver-wms',
    description: '图层显示标题'
  },
  {
    name: 'coordinateType',
    label: '坐标系',
    type: 'text' as const,
    default: defaultGeoserverwmsProps.coordinateType,
    options: [
      { label: 'WGS84', value: 'WGS84' },
      { label: 'WGS1984', value: 'WGS1984' },
      { label: 'EPSG:4326', value: 'EPSG:4326' },
      { label: 'EPSG:3857', value: 'EPSG:3857' },
      { label: 'EPSG:900913', value: 'EPSG:900913' },
      { label: 'EPSG:102100', value: 'EPSG:102100' },
      { label: 'WebMercator', value: 'WebMercator' },
      { label: 'WM', value: 'WM' }
    ]
  },
  {
    name: 'layerBase.opacity',
    label: '透明度',
    type: 'number' as const,
    default: defaultGeoserverwmsProps.layerBase.opacity,
    min: 0,
    max: 1,
    step: 0.1
  },
  {
    name: 'layerBase.zIndex',
    label: '层级',
    type: 'number' as const,
    default: defaultGeoserverwmsProps.layerBase.zIndex,
    min: 0,
    max: 1000,
    step: 1
  },
  {
    name: 'layerBase.minZoom',
    label: '最小缩放',
    type: 'number' as const,
    default: defaultGeoserverwmsProps.layerBase.minZoom,
    min: 0,
    max: 28,
    step: 1
  },
  {
    name: 'layerBase.maxZoom',
    label: '最大缩放',
    type: 'number' as const,
    default: defaultGeoserverwmsProps.layerBase.maxZoom,
    min: 0,
    max: 28,
    step: 1
  },
  {
    name: 'display',
    label: '显示',
    type: 'boolean' as const,
    default: defaultGeoserverwmsProps.display
  }
]

export const GeoserverWmsDefaultProps = {
  source: defaultGeoserverwmsProps.source,
  VERSION: defaultGeoserverwmsProps.VERSION,
  layers: defaultGeoserverwmsProps.layers,
  title: 'geoserver-wms',
  coordinateType: defaultGeoserverwmsProps.coordinateType,
  'layerBase.opacity': defaultGeoserverwmsProps.layerBase.opacity,
  'layerBase.zIndex': defaultGeoserverwmsProps.layerBase.zIndex,
  'layerBase.minZoom': defaultGeoserverwmsProps.layerBase.minZoom,
  'layerBase.maxZoom': defaultGeoserverwmsProps.layerBase.maxZoom,
  display: defaultGeoserverwmsProps.display
}

const renderGeoserverWmsPreview = (props: Record<string, unknown>) => {

  // 构建 layerBase 对象
  const layerBase: LayerBase = {
    opacity: props['layerBase.opacity'] as number ?? defaultGeoserverwmsProps.layerBase.opacity,
    zIndex: props['layerBase.zIndex'] as number ?? defaultGeoserverwmsProps.layerBase.zIndex,
    minZoom: props['layerBase.minZoom'] as number ?? defaultGeoserverwmsProps.layerBase.minZoom,
    maxZoom: props['layerBase.maxZoom'] as number ?? defaultGeoserverwmsProps.layerBase.maxZoom
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
          <GeoserverWms
            source={props?.source as string || GeoserverWmsDefaultProps?.source}
            VERSION={props?.VERSION as string || GeoserverWmsDefaultProps?.VERSION}
            layers={props?.layers as string || GeoserverWmsDefaultProps?.layers}
            title={props?.title as string || GeoserverWmsDefaultProps?.title}
            coordinateType={props?.coordinateType as string || GeoserverWmsDefaultProps?.coordinateType}
            layerBase={layerBase}
            display={props.display as boolean ?? GeoserverWmsDefaultProps.display}
            cellKey="preview"
          />
        </MapContainer>
      </div>
    </div>
  )
}

const renderGeoserverWmsCodePreview = (props: Record<string, unknown>) => {
  return `<GeoserverWms
  source="${props.source || GeoserverWmsDefaultProps.source}"
  VERSION="${props.VERSION || GeoserverWmsDefaultProps.VERSION}"
  layers="${props.layers || GeoserverWmsDefaultProps.layers}"
  title="${props.title || GeoserverWmsDefaultProps.title}"
  coordinateType="${props.coordinateType || GeoserverWmsDefaultProps.coordinateType}"
  layerBase={{
    opacity: ${props['layerBase.opacity'] ?? 1},
    zIndex: ${props['layerBase.zIndex'] ?? 0},
    minZoom: ${props['layerBase.minZoom'] ?? 0},
    maxZoom: ${props['layerBase.maxZoom'] ?? 28}
  }}
  display={${props.display ?? true}}
  cellKey="your-cell-key"
  map={mapInstance}
/>`
}

export const geoserverWmsConfig: ComponentConfig = {
  id: 'geoserver-wms',
  name: 'geoserver-wms',
  propsConfig: GeoserverWmsPropsConfig,
  defaultProps: GeoserverWmsDefaultProps,
  renderPreview: renderGeoserverWmsPreview,
  renderCodePreview: renderGeoserverWmsCodePreview
}
