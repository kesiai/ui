import * as React from "react"
import { cn } from "@/lib/utils"
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import Feature from 'ol/Feature'
import * as geom from 'ol/geom'
import * as style from 'ol/style'
import { fromLonLat } from 'ol/proj'
import type Map from 'ol/Map'
import { useMap } from '../map-container/map-container'

export interface LocationData {
  type: 'Point' | 'LineString' | 'Polygon' | 'Circle'
  coordinates: number[] | number[][] | number[][][] | { center: number[]; radius: number }
}

export interface DrawLineItem {
  location?: {
    data?: LocationData[]
    style?: {
      point?: PointStyle
      line?: LineStyle
    }
  } & LocationData
  style?: {
    point?: PointStyle
    line?: LineStyle
  }
  [key: string]: unknown
}

export interface PointStyle {
  src?: string
  scale?: number
  color?: string
}

export interface LineStyle {
  color?: string
  width?: number
  fillColor?: string
  snumber?: boolean
}

export interface FeatureStyle {
  point?: PointStyle
  line?: LineStyle
}

export interface CustomViewsProps {
  /**
   * 绑定的外部数据
   */
  drawLine?: DrawLineItem[]
  /**
   * 要素样式配置
   */
  featureStyle?: FeatureStyle
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

const CustomViews = React.forwardRef<HTMLDivElement, CustomViewsProps>(
  (
    {
      className,
      drawLine = [],
      featureStyle = {},
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

    // 根据 drawLine 外部数据去绘制图层
    React.useEffect(() => {
      if (!map) return

      // 先移除旧图层
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }

      if (!drawLine || !Array.isArray(drawLine) || !drawLine.length) return

      const features: Feature[] = []

      const buildFeatureFromGeom = (g: LocationData, index: number, item: DrawLineItem) => {
        if (!g || !g.type) return null
        let featureGeom: geom.Geometry | null = null

        if (g.type === 'Point') {
          const coord = g.coordinates as number[]
          if (!coord || coord.length < 2) return null
          featureGeom = new geom.Point(transformTo3857(coord))
        } else if (g.type === 'LineString') {
          const coords = (g.coordinates || []) as number[][]
          if (!coords.length) return null
          featureGeom = new geom.LineString(coords.map(c => transformTo3857(c)))
        } else if (g.type === 'Polygon') {
          const rings = (g.coordinates || []) as number[][][]
          if (!rings.length) return null
          const transformed = rings.map(r => r.map(c => transformTo3857(c)))
          featureGeom = new geom.Polygon(transformed)
        } else if (g.type === 'Circle') {
          const circleCoords = g.coordinates as { center: number[]; radius: number }
          const center = circleCoords?.center
          const radius = circleCoords?.radius
          if (!center || !radius) return null
          featureGeom = new geom.Circle(transformTo3857(center), radius)
        }

        if (!featureGeom) return null

        const f = new Feature({
          geometry: featureGeom,
          customIndex: index,
          customData: item,
          cellKey,
        })
        return f
      }

      drawLine.forEach((item, index) => {
        const loc = item?.location
        if (!loc) return

        // 支持 location.data 数组 或 单个 geometry 对象
        if (Array.isArray(loc.data)) {
          loc.data.forEach(g => {
            const f = buildFeatureFromGeom(g, index, item)
            if (f) features.push(f)
          })
        } else if (loc.type) {
          const f = buildFeatureFromGeom(loc as LocationData, index, item)
          if (f) features.push(f)
        }
      })

      if (!features.length) return

      const source = new VectorSource({ features })
      const layer = new VectorLayer({
        source,
        properties: { layerType: 'custom', cellKey },
        zIndex: 100,
      })

      // 样式函数
      layer.setStyle((feature) => {
        const geometry = feature.getGeometry()
        if (!geometry) return undefined

        const geomType = geometry.getType()
        const data = feature.get('customData') || {}
        const dataStyleRoot = data?.location?.style || data.style || {}

        // 根据几何类型获取样式
        let featureDataStyle: PointStyle | LineStyle = {}
        if (geomType === 'Point') {
          featureDataStyle = dataStyleRoot.point || {}
        } else {
          featureDataStyle = dataStyleRoot.line || {}
        }

        // 合并样式：数据样式 < 图层样式
        const mergedStyle = { ...featureDataStyle, ...featureStyle }

        if (geomType === 'Point') {
          const pointStyle = mergedStyle as PointStyle
          return new style.Style({
            image: new style.Icon({
              src: pointStyle.src || DEFAULT_POINT_ICON,
              scale: pointStyle.scale || 1,
              anchor: [0.5, 1],
            }),
          })
        }

        // 线、面、圆
        const lineStyle = mergedStyle as LineStyle
        const strokeColor = lineStyle.color || 'rgba(255, 0, 0, 0.8)'
        const strokeWidth = lineStyle.width || 2
        const fillColor = lineStyle.fillColor || 'rgba(255, 0, 0, 0.2)'

        return new style.Style({
          stroke: new style.Stroke({
            color: strokeColor,
            width: strokeWidth,
          }),
          fill: new style.Fill({
            color: fillColor,
          }),
        })
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
    }, [map, JSON.stringify(drawLine), JSON.stringify(featureStyle), cellKey, transformTo3857])

    // display 变化时，仅更新图层可见性
    React.useEffect(() => {
      if (!map || !layerRef.current) return
      layerRef.current.setVisible(shouldShow)
    }, [map, shouldShow])

    return (
      <div
        ref={ref}
        className={cn("custom-views", className)}
        style={{ display: 'none' }}
        data-cell-key={cellKey}
        {...props}
      />
    )
  }
)

CustomViews.displayName = "CustomViews"

export { CustomViews }
