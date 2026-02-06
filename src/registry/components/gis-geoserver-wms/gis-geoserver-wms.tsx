
import * as React from "react"
import { cn } from "@/lib/utils"
// @ts-ignore
import { Image as ImageLayer } from 'ol/layer'
// @ts-ignore
import { ImageWMS } from 'ol/source'
import type Map from 'ol/Map'
import { useMap } from '../gis-map-core/gis-map-core'

export interface LayerBase {
  opacity?: number
  zIndex?: number
  maxResolution?: number
  minResolution?: number
  maxZoom?: number
  minZoom?: number
}

export interface GeoserverWmsProps {
  source?: string
  coordinateType?: string
  VERSION?: string
  layers?: string
  title?: string
  layerBase?: LayerBase
  display?: boolean
  className?: string
  cellKey?: string
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
    const layerRef = React.useRef<any>(null)

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
        id: cellKey,
        title,
        type: 'geoserver-wms', // Matches source logic of passing custom props in options
        opacity: opacity || 1,
        zIndex,
        maxResolution,
        minResolution,
        maxZoom,
        minZoom,
        source: wmsSource,
        properties: { // Also keep in properties for safety
          id: cellKey,
          title,
          layerType: 'geoserver-wms',
          type: 'geoserver-wms',
          cellKey
        }
      } as any)

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
