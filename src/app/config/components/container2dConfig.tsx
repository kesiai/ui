import { MapContainer } from '@/registry/blocks/gis/map-container/map-container'
import { ComponentConfig } from '../types'

export const Container2dPropsConfig = [
  {
    name: 'viewOptions.position.center',
    label: '中心位置',
    type: 'text' as const,
    default: '[116.391, 39.9042]',
    description: '地图中心点坐标 [经度, 纬度]'
  },
  {
    name: 'viewOptions.zoom',
    label: '缩放级别',
    type: 'number' as const,
    default: 10,
    min: 3,
    max: 18,
    step: 1
  },
  {
    name: 'viewOptions.minZoom',
    label: '最小缩放',
    type: 'number' as const,
    default: 3,
    min: 1,
    max: 18,
    step: 1
  },
  {
    name: 'viewOptions.maxZoom',
    label: '最大缩放',
    type: 'number' as const,
    default: 18,
    min: 3,
    max: 22,
    step: 1
  },
  {
    name: 'viewOptions.rotation',
    label: '旋转角度',
    type: 'number' as const,
    default: 0,
    min: 0,
    max: 360,
    step: 1
  },
  {
    name: 'viewOptions.recordRotationActive',
    label: '图标不跟随旋转',
    type: 'boolean' as const,
    default: false,
    description: '开启后，记录图标方向不跟随地图旋转'
  },
  {
    name: 'viewOptions.animation',
    label: '启用动画',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'viewOptions.duration',
    label: '动画时长(ms)',
    type: 'number' as const,
    default: 1000,
    min: 0,
    max: 5000,
    step: 100
  },
  {
    name: 'zoomOption.show',
    label: '显示缩放控件',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'scaleLine.show',
    label: '显示比例尺',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'scaleLine.units',
    label: '比例尺单位',
    type: 'select' as const,
    default: 'metric',
    options: [
      { value: 'metric', label: '公制(千米)' },
      { value: 'us', label: '美制' },
      { value: 'nautical', label: '海里' },
      { value: 'imperial', label: '英制' },
      { value: 'degrees', label: '度分秒' }
    ]
  },
  {
    name: 'scaleLine.bar',
    label: '比例尺柱状显示',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'width',
    label: '宽度',
    type: 'text' as const,
    default: '100%'
  },
  {
    name: 'height',
    label: '高度',
    type: 'text' as const,
    default: '400px'
  },
  {
    name: 'extentOption.westLon',
    label: '最小经度',
    type: 'number' as const,
    default: undefined,
    min: -180,
    max: 180,
    step: 0.1,
    description: '拖拽边界范围 -180~180'
  },
  {
    name: 'extentOption.eastLon',
    label: '最大经度',
    type: 'number' as const,
    default: undefined,
    min: -180,
    max: 180,
    step: 0.1
  },
  {
    name: 'extentOption.southLat',
    label: '最小纬度',
    type: 'number' as const,
    default: undefined,
    min: -90,
    max: 90,
    step: 0.1,
    description: '拖拽边界范围 -90~90'
  },
  {
    name: 'extentOption.northLat',
    label: '最大纬度',
    type: 'number' as const,
    default: undefined,
    min: -90,
    max: 90,
    step: 0.1
  }
]

export const Container2dDefaultProps = {
  viewOptions: {
    position: {
      center: [116.391, 39.9042] as [number, number],
      pick: false
    },
    zoom: 10,
    maxZoom: 18,
    minZoom: 3,
    rotation: 0,
    recordRotationActive: false,
    animation: true,
    duration: 1000
  },
  zoomOption: {
    show: true,
    zoomInTipLabel: '放大',
    zoomOutTipLabel: '缩小',
    minZoom: 3,
    maxZoom: 18
  },
  scaleLine: {
    show: true,
    bar: false,
    text: false,
    units: 'metric' as const
  },
  width: '100%',
  height: '400px'
}

const renderMapContainerPreview = (props: Record<string, any>) => {
  // 解析嵌套属性
  const viewOptions = {
    position: {
      center: props['viewOptions.position.center'] 
        ? (typeof props['viewOptions.position.center'] === 'string' 
            ? JSON.parse(props['viewOptions.position.center']) 
            : props['viewOptions.position.center'])
        : [116.391, 39.9042],
      pick: false
    },
    zoom: props['viewOptions.zoom'] ?? 10,
    maxZoom: props['viewOptions.maxZoom'] ?? 18,
    minZoom: props['viewOptions.minZoom'] ?? 3,
    rotation: props['viewOptions.rotation'] ?? 0,
    recordRotationActive: props['viewOptions.recordRotationActive'] ?? false,
    animation: props['viewOptions.animation'] ?? true,
    duration: props['viewOptions.duration'] ?? 1000
  }

  const zoomOption = {
    show: props['zoomOption.show'] ?? true
  }

  const scaleLine = {
    show: props['scaleLine.show'] ?? true,
    units: props['scaleLine.units'] ?? 'metric',
    bar: props['scaleLine.bar'] ?? false
  }

  const extentOption = {
    westLon: props['extentOption.westLon'],
    eastLon: props['extentOption.eastLon'],
    southLat: props['extentOption.southLat'],
    northLat: props['extentOption.northLat']
  }

  return (
    <div className="h-full flex items-center justify-center p-4">
      <MapContainer
        viewOptions={viewOptions}
        zoomOption={zoomOption}
        scaleLine={scaleLine}
        extentOption={extentOption}
        width={props.width || '100%'}
        height={props.height || '400px'}
        cellKey="preview"
      />
    </div>
  )
}

const renderMapContainerCodePreview = (props: Record<string, any>) => {
  const center = props['viewOptions.position.center'] || '[116.391, 39.9042]'
  const zoom = props['viewOptions.zoom'] ?? 10
  const minZoom = props['viewOptions.minZoom'] ?? 3
  const maxZoom = props['viewOptions.maxZoom'] ?? 18
  const rotation = props['viewOptions.rotation'] ?? 0
  const animation = props['viewOptions.animation'] ?? true
  const duration = props['viewOptions.duration'] ?? 1000
  const showZoom = props['zoomOption.show'] ?? true
  const showScale = props['scaleLine.show'] ?? true
  const scaleUnits = props['scaleLine.units'] ?? 'metric'

  return `<MapContainer
  viewOptions={{
    position: {
      center: ${center},
      pick: false
    },
    zoom: ${zoom},
    minZoom: ${minZoom},
    maxZoom: ${maxZoom},
    rotation: ${rotation},
    animation: ${animation},
    duration: ${duration}
  }}
  zoomOption={{
    show: ${showZoom}
  }}
  scaleLine={{
    show: ${showScale},
    units: "${scaleUnits}"
  }}
  width="${props.width || '100%'}"
  height="${props.height || '400px'}"
  cellKey="your-cell-key"
/>`
}

export const Container2dConfig: ComponentConfig = {
  id: 'container2d',
  name: '2D容器',
  propsConfig: Container2dPropsConfig,
  defaultProps: Container2dDefaultProps,
  renderPreview: renderMapContainerPreview,
  renderCodePreview: renderMapContainerCodePreview
}
