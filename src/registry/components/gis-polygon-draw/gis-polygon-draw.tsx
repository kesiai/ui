import * as React from "react"
import { cn } from "@/lib/utils"
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import Feature from 'ol/Feature'
import * as geom from 'ol/geom'
import * as style from 'ol/style'
import { fromLonLat } from 'ol/proj'
import type Map from 'ol/Map'
import { useMap } from '../gis-map-core/gis-map-core'

export type DrawType = 'Point' | 'LineString' | 'Polygon' | 'Circle' | 'Semicircle' | null

export interface PolygonStyle {
  icon?: {
    src?: string
    scale?: number
    displacementX?: number
    displacementY?: number
  }
  line?: {
    color?: string
    width?: number
    snumber?: boolean
  }
  polygon?: {
    color?: string
    width?: number
    fillColor?: string
    snumber?: boolean
  }
  circle?: {
    color?: string
    width?: number
    fillColor?: string
  }
  semicircle?: {
    color?: string
    width?: number
    fillColor?: string
  }
}

export interface PolygonData {
  id: string
  type: DrawType
  coordinates: number[] | number[][] | number[][][] | { center: number[]; radius: number }
  style?: PolygonStyle
}

export interface PolygonViewsProps {
  /**
   * 区域数据列表
   */
  data?: PolygonData[]
  /**
   * 默认样式配置
   */
  defaultStyle?: PolygonStyle
  /**
   * 当前绘制类型
   */
  drawType?: DrawType
  /**
   * 绘制类型变化回调
   */
  onDrawTypeChange?: (type: DrawType) => void
  /**
   * 数据变化回调
   */
  onDataChange?: (data: PolygonData[]) => void
  /**
   * 是否显示绘制工具栏
   */
  showToolbar?: boolean
  /**
   * 是否只读
   */
  readonly?: boolean
  /**
   * 是否显示
   */
  display?: boolean
  /**
   * CSS 类名
   */
  className?: string
  /**
   * 单元格唯一标识
   */
  cellKey?: string
  /**
   * 地图实例（由父组件传入）
   */
  map?: Map | null
}

// 默认点图标
const DEFAULT_POINT_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNlNzRjM2MiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTBjMCA3LTkgMTMtOSAxM3MtOS02LTktMTNhOSA5IDAgMCAxIDE4IDB6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIvPjwvc3ZnPg=='

const PolygonViews = React.forwardRef<HTMLDivElement, PolygonViewsProps>(
  (
    {
      className,
      data = [],
      defaultStyle = {},
      drawType,
      onDrawTypeChange,
      onDataChange,
      showToolbar = false,
      readonly = false,
      display = true,
      cellKey,
      map: mapProp,
      ...props
    },
    ref
  ) => {
    const contextMap = useMap()
    const map = mapProp || contextMap
    const layerRef = React.useRef<VectorLayer<VectorSource> | null>(null)

    // 统一计算图层是否应该显示
    const shouldShow = React.useMemo(() => {
      return display == null || display
    }, [display])

    // 坐标转换函数
    const transformTo3857 = React.useCallback((coord: number[]) => {
      return fromLonLat(coord)
    }, [])

    // 创建序号标签样式
    const createNumberLabelStyles = React.useCallback((
      geometry: geom.Geometry,
      baseStyle: style.Style
    ): style.Style[] => {
      const geoType = geometry.getType()
      let coordinates: number[][] = []

      if (geoType === 'LineString') {
        coordinates = (geometry as geom.LineString).getCoordinates() || []
      } else if (geoType === 'Polygon') {
        const rings = (geometry as geom.Polygon).getCoordinates() || []
        if (rings.length > 0) {
          coordinates = rings[0] || []
        }
      }

      if (!coordinates || coordinates.length === 0) {
        return [baseStyle]
      }

      // 如果是闭合多边形，去掉最后一个重复的点
      if (coordinates.length > 1) {
        const first = coordinates[0]
        const last = coordinates[coordinates.length - 1]
        if (first && last && first[0] === last[0] && first[1] === last[1]) {
          coordinates = coordinates.slice(0, coordinates.length - 1)
        }
      }

      // 创建序号标签样式
      const labelStyles = coordinates.map((coord, index) => new style.Style({
        geometry: new geom.Point(coord),
        text: new style.Text({
          text: String(index + 1),
          font: '12px Calibri,sans-serif',
          fill: new style.Fill({ color: '#000000' }),
          stroke: new style.Stroke({ color: '#ffffff', width: 2 }),
          offsetY: -12,
        })
      }))

      return [baseStyle, ...labelStyles]
    }, [])

    // 根据 data 绘制图层
    React.useEffect(() => {
      if (!map) return

      // 先移除旧图层
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }

      if (!data || !Array.isArray(data) || !data.length) return

      const features: Feature[] = []

      data.forEach((item) => {
        if (!item.type || !item.coordinates) return

        let featureGeom: geom.Geometry | null = null

        if (item.type === 'Point') {
          const coord = item.coordinates as number[]
          if (!coord || coord.length < 2) return
          featureGeom = new geom.Point(transformTo3857(coord))
        } else if (item.type === 'LineString') {
          const coords = (item.coordinates || []) as number[][]
          if (!coords.length) return
          featureGeom = new geom.LineString(coords.map(c => transformTo3857(c)))
        } else if (item.type === 'Polygon') {
          const rings = (item.coordinates || []) as number[][][]
          if (!rings.length) return
          const transformed = rings.map(r => r.map(c => transformTo3857(c)))
          featureGeom = new geom.Polygon(transformed)
        } else if (item.type === 'Circle') {
          const circleCoords = item.coordinates as { center: number[]; radius: number }
          const center = circleCoords?.center
          const radius = circleCoords?.radius
          if (!center || !radius) return
          featureGeom = new geom.Circle(transformTo3857(center), radius)
        }

        if (!featureGeom) return

        const f = new Feature({
          geometry: featureGeom,
          polygonId: item.id,
          polygonType: item.type,
          polygonStyle: item.style,
          cellKey,
        })
        features.push(f)
      })

      if (!features.length) return

      const source = new VectorSource({ features })
      const layer = new VectorLayer({
        source,
        properties: { layerType: 'polygon', cellKey },
        zIndex: 50,
      })

      // 样式函数
      layer.setStyle((feature) => {
        const geometry = feature.getGeometry()
        if (!geometry) return undefined

        const geomType = geometry.getType()
        const featureStyle = feature.get('polygonStyle') || {}

        // 根据几何类型获取样式
        const styleKey = geomType === 'Point' ? 'icon' 
          : geomType === 'LineString' ? 'line'
          : geomType === 'Polygon' ? 'polygon'
          : geomType === 'Circle' ? 'circle'
          : 'polygon'

        const mergedStyle = { ...defaultStyle[styleKey as keyof PolygonStyle], ...featureStyle[styleKey] }

        if (geomType === 'Point') {
          const iconStyle = mergedStyle as PolygonStyle['icon']
          return new style.Style({
            image: new style.Icon({
              src: iconStyle?.src || DEFAULT_POINT_ICON,
              scale: iconStyle?.scale || 1,
              anchor: [0.5, 1],
              displacement: [iconStyle?.displacementX || 0, iconStyle?.displacementY || 0],
            }),
          })
        }

        // 线、面、圆
        const lineStyle = mergedStyle as { color?: string; width?: number; fillColor?: string; snumber?: boolean }
        const strokeColor = lineStyle?.color || 'rgba(255, 0, 0, 0.8)'
        const strokeWidth = lineStyle?.width || 2
        const fillColor = lineStyle?.fillColor || 'rgba(255, 0, 0, 0.2)'

        const baseStyle = new style.Style({
          stroke: new style.Stroke({
            color: strokeColor,
            width: strokeWidth,
          }),
          fill: new style.Fill({
            color: fillColor,
          }),
        })

        // 检查是否需要绘制序号
        if (lineStyle?.snumber && (geomType === 'LineString' || geomType === 'Polygon')) {
          return createNumberLabelStyles(geometry as geom.Geometry, baseStyle)
        }

        return baseStyle
      })

      layer.setVisible(shouldShow)
      map.addLayer(layer)
      layerRef.current = layer

      return () => {
        if (layerRef.current && map) {
          map.removeLayer(layerRef.current)
          layerRef.current = null
        }
      }
    }, [map, JSON.stringify(data), JSON.stringify(defaultStyle), cellKey, transformTo3857, createNumberLabelStyles])

    // display 变化时，仅更新图层可见性
    React.useEffect(() => {
      if (!map || !layerRef.current) return
      layerRef.current.setVisible(shouldShow)
    }, [map, shouldShow])

    // 绘制工具栏
    const renderToolbar = () => {
      if (!showToolbar || readonly) return null

      const tools: { type: DrawType; label: string; icon: string }[] = [
        { type: 'Point', label: '点', icon: '📍' },
        { type: 'LineString', label: '线段', icon: '📏' },
        { type: 'Polygon', label: '多边形', icon: '⬡' },
        { type: 'Circle', label: '圆', icon: '⭕' },
      ]

      return (
        <div className="absolute top-2 left-2 z-20 flex gap-1 bg-white rounded-lg shadow-md p-1">
          {tools.map((tool) => (
            <button
              key={tool.type}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded transition-colors",
                drawType === tool.type 
                  ? "bg-blue-500 text-white" 
                  : "hover:bg-gray-100"
              )}
              title={tool.label}
              onClick={() => onDrawTypeChange?.(drawType === tool.type ? null : tool.type)}
            >
              {tool.icon}
            </button>
          ))}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn("polygon-views relative", className)}
        data-cell-key={cellKey}
        {...props}
      >
        {renderToolbar()}
      </div>
    )
  }
)

PolygonViews.displayName = "PolygonViews"

export { PolygonViews }
