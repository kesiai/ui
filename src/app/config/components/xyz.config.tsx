import { XYZ, CanvasSetting, CoorDefs, LayerBase } from '@/registry/blocks/gis/gis-xyz-tile/xyz'
import { MapContainer } from '@/registry/blocks/gis/gis-map-core/map-container'
import { ComponentConfig } from '../types'

// 默认配置
const defaultXYZProps = {
    source: 'http://t{0-6}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=f9ce575f14f5417faab8cd305f7b5a6a',
    coordinateType: 'EPSG3857',
    coorDefs: {
        defs: '',
        extent: [],
        unit: 'm',
        dataProjection: ''
    },
    canvasFilter: false,
    canvasSetting: {
      grayscale: 98,     
      invert: 100,        
      sepia: 20,          
      'hue-rotate': 180, 
      saturate: 1600,     
      brightness: 80,   
      contrast: 90   
    },
    layerBase: {
        opacity: 1,
        zIndex: 0,
        minZoom: 0,
        maxZoom: 28
    },
    display: true
}

export const XYZPropsConfig = [
    {
        name: 'source',
        label: '瓦片图地址',
        type: 'text' as const,
        default: defaultXYZProps.source,
        description: 'OpenLayers瓦片图地址'
    },
    {
        name: 'coordinateType',
        label: '坐标系',
        type: 'text' as const,
        default: defaultXYZProps.coordinateType,
        options: [
          { label: 'WGS84', value: 'WGS84' },
          { label: 'WGS1984', value: 'WGS1984' },
          { label: 'EPSG4326', value: 'EPSG4326' },
          { label: 'GCJ02*', value: 'GCJ02' },
          { label: 'AMap*', value: 'AMap' },
          { label: 'BD09*', value: 'BD09' },
          { label: 'BD09LL*', value: 'BD09LL' },
          { label: 'Baidu*', value: 'Baidu' },
          { label: 'BMap*', value: 'BMap' },
          { label: 'BD09MC*', value: 'BD09MC' },
          { label: 'BD09Meter*', value: 'BD09Meter' },
          { label: 'EPSG3857', value: 'EPSG3857' },
          { label: 'EPSG900913', value: 'EPSG900913' },
          { label: 'EPSG102100', value: 'EPSG102100' },
          { label: 'WebMercator', value: 'WebMercator' },
          { label: 'WM', value: 'WM' }
        ]
    },
    {
        name: 'coorDefs.defs',
        label: '坐标系参数',
        type: 'text' as const,
        default: defaultXYZProps.coorDefs.defs,
        description: '坐标系定义参数'
    },
    {
        name: 'coorDefs.extent',
        label: '坐标系区间',
        type: 'text' as const,
        default: defaultXYZProps.coorDefs.extent.join(','),
        description: '格式: [左上, 右上, 右下, 左下]'
    },
    {
        name: 'coorDefs.unit',
        label: '坐标系单位',
        type: 'select' as const,
        default: defaultXYZProps.coorDefs.unit,
        options: [
            { label: '度', value: 'degrees' },
            { label: '英尺', value: 'ft' },
            { label: '米', value: 'm' },
            { label: '像素', value: 'pixels' },
            { label: '平铺像素', value: 'tile-pixels' },
            { label: '美国英尺', value: 'us-ft' }
        ]
    },
    {
        name: 'coorDefs.dataProjection',
        label: '元数据投影坐标',
        type: 'text' as const,
        default: defaultXYZProps.coorDefs.dataProjection,
    },
    {
        name: 'canvasFilter',
        label: '启用图层滤镜',
        type: 'boolean' as const,
        default: defaultXYZProps.canvasFilter,
    },
    {
        name: 'canvasSetting.grayscale',
        label: '灰度',
        type: 'number' as const,
        default: defaultXYZProps.canvasSetting.grayscale,
        min: 0,
        max: 100,
        step: 1
    },
    {
        name: 'canvasSetting.invert',
        label: '反转',
        type: 'number' as const,
        default: defaultXYZProps.canvasSetting.invert,
        min: 0,
        max: 100,
        step: 1
    },
    {
        name: 'canvasSetting.sepia',
        label: '棕褐色',
        type: 'number' as const,
        default: defaultXYZProps.canvasSetting.sepia,
        min: 0,
        max: 100,
        step: 1
    },
    {
        name: 'canvasSetting.hue-rotate',
        label: '色相旋转',
        type: 'number' as const,
        default: defaultXYZProps.canvasSetting['hue-rotate'],
        min: 0,
        max: 360,
        step: 1
    },
    {
        name: 'canvasSetting.saturate',
        label: '饱和度',
        type: 'number' as const,
        default: defaultXYZProps.canvasSetting.saturate,
        min: 0,
        max: 200,
        step: 1
    },
    {
        name: 'canvasSetting.brightness',
        label: '亮度',
        type: 'number' as const,
        default: defaultXYZProps.canvasSetting.brightness,
        min: 0,
        max: 200,
        step: 1
    },
    {
        name: 'canvasSetting.contrast',
        label: '对比度',
        type: 'number' as const,
        default: defaultXYZProps.canvasSetting.contrast,
        min: 0,
        max: 200,
        step: 1
    },
    {
        name: 'layerBase.opacity',
        label: '透明度',
        type: 'number' as const,
        default: defaultXYZProps.layerBase.opacity,
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        name: 'layerBase.zIndex',
        label: '层级',
        type: 'number' as const,
        default: defaultXYZProps.layerBase.zIndex,
        min: 0,
        max: 1000,
        step: 1
    },
    {
        name: 'layerBase.minZoom',
        label: '最小缩放',
        type: 'number' as const,
        default: defaultXYZProps.layerBase.minZoom,
        min: 0,
        max: 28,
        step: 1
    },
    {
        name: 'layerBase.maxZoom',
        label: '最大缩放',
        type: 'number' as const,
        default: defaultXYZProps.layerBase.maxZoom,
        min: 0,
        max: 28,
        step: 1
    },
    {
        name: 'display',
        label: '显示',
        type: 'boolean' as const,
        default: defaultXYZProps.display
    }
]

export const XYZDefaultProps = {
    source: defaultXYZProps.source,
    coordinateType: defaultXYZProps.coordinateType,
    'coorDefs.defs': defaultXYZProps.coorDefs.defs,
    'coorDefs.extent': defaultXYZProps.coorDefs.extent.join(','),
    'coorDefs.unit': defaultXYZProps.coorDefs.unit,
    'coorDefs.dataProjection': defaultXYZProps.coorDefs.dataProjection,
    canvasFilter: defaultXYZProps.canvasFilter,
    'canvasSetting.grayscale': defaultXYZProps.canvasSetting.grayscale,
    'canvasSetting.invert': defaultXYZProps.canvasSetting.invert,
    'canvasSetting.sepia': defaultXYZProps.canvasSetting.sepia,
    'canvasSetting.hue-rotate': defaultXYZProps.canvasSetting['hue-rotate'],
    'canvasSetting.saturate': defaultXYZProps.canvasSetting.saturate,
    'canvasSetting.brightness': defaultXYZProps.canvasSetting.brightness,
    'canvasSetting.contrast': defaultXYZProps.canvasSetting.contrast,
    'layerBase.opacity': defaultXYZProps.layerBase.opacity,
    'layerBase.zIndex': defaultXYZProps.layerBase.zIndex,
    'layerBase.minZoom': defaultXYZProps.layerBase.minZoom,
    'layerBase.maxZoom': defaultXYZProps.layerBase.maxZoom,
    display: defaultXYZProps.display
}

const renderXYZPreview = (props: Record<string, unknown>) => {
  // 构建 canvasSetting 对象
  const canvasSetting: CanvasSetting = {
    grayscale: props['canvasSetting.grayscale'] as number ?? defaultXYZProps.canvasSetting.grayscale,
    invert: props['canvasSetting.invert'] as number ?? defaultXYZProps.canvasSetting.invert,
    sepia: props['canvasSetting.sepia'] as number ?? defaultXYZProps.canvasSetting.sepia,
    'hue-rotate': props['canvasSetting.hue-rotate'] as number ?? defaultXYZProps.canvasSetting['hue-rotate'],
    saturate: props['canvasSetting.saturate'] as number ?? defaultXYZProps.canvasSetting.saturate,
    brightness: props['canvasSetting.brightness'] as number ?? defaultXYZProps.canvasSetting.brightness,
    contrast: props['canvasSetting.contrast'] as number ?? defaultXYZProps.canvasSetting.contrast
  }

  // 构建 coorDefs 对象
  const coorDefs: CoorDefs = {
    defs: props['coorDefs.defs'] as string ?? defaultXYZProps.coorDefs.defs,
    extent: props['coorDefs.extent'] ? (props['coorDefs.extent'] as string).split(',').map(Number).filter(n => !isNaN(n)) : defaultXYZProps.coorDefs.extent,
    unit: (props['coorDefs.unit'] as CoorDefs['unit']) ?? (defaultXYZProps.coorDefs.unit as CoorDefs['unit']),
    dataProjection: props['coorDefs.dataProjection'] as string ?? defaultXYZProps.coorDefs.dataProjection
  }

  // 构建 layerBase 对象
  const layerBase: LayerBase = {
    opacity: props['layerBase.opacity'] as number ?? defaultXYZProps.layerBase.opacity,
    zIndex: props['layerBase.zIndex'] as number ?? defaultXYZProps.layerBase.zIndex,
    minZoom: props['layerBase.minZoom'] as number ?? defaultXYZProps.layerBase.minZoom,
    maxZoom: props['layerBase.maxZoom'] as number ?? defaultXYZProps.layerBase.maxZoom
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
          <XYZ
            source={props?.source as string || XYZDefaultProps?.source}
            coordinateType={props?.coordinateType as string || XYZDefaultProps?.coordinateType}
            coorDefs={coorDefs}
            canvasFilter={props?.canvasFilter as boolean ?? XYZDefaultProps.canvasFilter}
            canvasSetting={canvasSetting}
            layerBase={layerBase}
            display={props.display as boolean ?? XYZDefaultProps.display}
            cellKey="preview"
          />
        </MapContainer>
      </div>
    </div>
  )
}

const renderXYZCodePreview = (props: Record<string, unknown>) => {
  return `<XYZ
  source="${props.source || XYZDefaultProps.source}"
  coordinateType="${props.coordinateType || XYZDefaultProps.coordinateType}"
  coorDefs={{
    defs: "${props['coorDefs.defs'] || ''}",
    extent: [${props['coorDefs.extent'] || ''}],
    unit: "${props['coorDefs.unit'] || 'm'}",
    dataProjection: "${props['coorDefs.dataProjection'] || ''}"
  }}
  canvasFilter={${props.canvasFilter ?? false}}
  canvasSetting={{
    grayscale: ${props['canvasSetting.grayscale'] ?? 0},
    invert: ${props['canvasSetting.invert'] ?? 0},
    sepia: ${props['canvasSetting.sepia'] ?? 0},
    'hue-rotate': ${props['canvasSetting.hue-rotate'] ?? 0},
    saturate: ${props['canvasSetting.saturate'] ?? 100},
    brightness: ${props['canvasSetting.brightness'] ?? 100},
    contrast: ${props['canvasSetting.contrast'] ?? 100}
  }}
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

export const xyzConfig: ComponentConfig = {
  id: 'xyz',
  name: 'XYZ',
  propsConfig: XYZPropsConfig,
  defaultProps: XYZDefaultProps,
  renderPreview: renderXYZPreview,
  renderCodePreview: renderXYZCodePreview
}
