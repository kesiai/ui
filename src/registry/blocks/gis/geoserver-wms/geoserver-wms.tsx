import * as React from "react"
import { cn } from "@/lib/utils"
import { Image as ImageLayer } from 'ol/layer'
import { ImageWMS } from 'ol/source'
import type Map from 'ol/Map'
import { useMap } from '../map-container/map-container'

export interface LayerBase {
  opacity?: number
  zIndex?: number
  maxResolution?: number
  minResolution?: number
  maxZoom?: number
  minZoom?: number
}

export interface GeoserverWmsProps {
  /**
   * WMS 服务地址
   */
  source?: string
  /**
   * 坐标系类型
   */
  coordinateType?: string
  /**
   * WMS 版本号
   */
  VERSION?: string
  /**
   * 图层名
   */
  layers?: string
  /**
   * 图层标题
   */
  title?: string
  /**
   * 图层基础配置
   */
  layerBase?: LayerBase
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

const GeoserverWms = React.forwardRef<HTMLDivElement, GeoserverWmsProps>(
  (
    {
      className,
      cellKey,
      VERSION,
      layers,
      source: sourceUrl,
      coordinateType,
      title = 'geoserver-wms',
      layerBase,
      display = true,
      map: mapProp,
      ...props
    },
    ref
  ) => {
    const contextMap = useMap()
    const map = mapProp || contextMap
    const layerRef = React.useRef<ImageLayer<ImageWMS> | null>(null)

    const { opacity, zIndex, maxResolution, minResolution, maxZoom, minZoom } = layerBase || {}

    // 创建图层
    React.useEffect(() => {
      if (!map || !sourceUrl) return

      // 先移除旧图层
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }

      // 创建 WMS 配置
      const wmsConfig: any = {
        url: sourceUrl,
        params: {
          VERSION: VERSION || '1.1.0',
          LAYERS: layers,
          serverType: 'geoserver',
          service: 'WMS'
        },
        // ratio: 1
      }

      // 设置坐标系类型
      if (coordinateType) {
        wmsConfig.projection = coordinateType
      }

      const wmsSource = new ImageWMS(wmsConfig)

      const layer = new ImageLayer({
        source: wmsSource,
        opacity: opacity || 1,
        zIndex,
        maxResolution,
        minResolution,
        maxZoom,
        minZoom,
        properties: {
          id: cellKey,
          title,
          layerType: 'geoserver-wms',
          type: 'geoserver-wms',
          cellKey
        }
      })

      layer.setVisible(display)
      map.addLayer(layer)
      layerRef.current = layer

      return () => {
        if (layerRef.current && map) {
          map.removeLayer(layerRef.current)
          layerRef.current = null
        }
      }
    }, [map, sourceUrl, coordinateType, layers, VERSION, title, cellKey])

    // 刷新图层
    React.useEffect(() => {
      const layer = layerRef.current
      if (!layer || !display) return

      const src = layer.getSource()
      if (!src) return

      // 更新 WMS 参数
      if (layers || VERSION) {
        src.updateParams({
          VERSION: VERSION || '1.1.0',
          LAYERS: layers,
        })
      }

      src.refresh()
    }, [display, layers, VERSION])

    // display 变化时更新可见性
    React.useEffect(() => {
      if (!layerRef.current) return
      layerRef.current.setVisible(display)
    }, [display])

    // 更新图层属性
    React.useEffect(() => {
      const layer = layerRef.current
      if (!layer) return

      if (opacity !== undefined) layer.setOpacity(opacity)
      if (zIndex !== undefined) layer.setZIndex(zIndex)
      if (maxResolution !== undefined) layer.setMaxResolution(maxResolution)
      if (minResolution !== undefined) layer.setMinResolution(minResolution)
      if (maxZoom !== undefined) layer.setMaxZoom(maxZoom)
      if (minZoom !== undefined) layer.setMinZoom(minZoom)
    }, [opacity, zIndex, maxResolution, minResolution, maxZoom, minZoom])

    return (
      <div
        ref={ref}
        className={cn("geoserver-wms-layer", className)}
        style={{ display: 'none' }}
        data-cell-key={cellKey}
        {...props}
      />
    )
  }
)

GeoserverWms.displayName = "GeoserverWms"

export { GeoserverWms }
