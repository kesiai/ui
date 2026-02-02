import * as React from "react"
import { cn } from "@/lib/utils"
import { Tile as TileLayer } from 'ol/layer'
import { XYZ as XYZSource } from 'ol/source'
import type Map from 'ol/Map'
import { useMap } from '../map-container/map-container'

export interface CanvasSetting {
  grayscale?: number
  invert?: number
  sepia?: number
  'hue-rotate'?: number
  saturate?: number
  brightness?: number
  contrast?: number
}

export interface CoorDefs {
  defs?: string
  extent?: number[]
  unit?: 'degrees' | 'ft' | 'm' | 'pixels' | 'tile-pixels' | 'us-ft'
  dataProjection?: string
}

export interface LayerBase {
  opacity?: number
  zIndex?: number
  maxResolution?: number
  minResolution?: number
  maxZoom?: number
  minZoom?: number
}

export interface XYZProps {
  /**
   * 瓦片图地址
   */
  source?: string
  /**
   * 坐标系类型
   */
  coordinateType?: string
  /**
   * 坐标系注册配置
   */
  coorDefs?: CoorDefs
  /**
   * 是否启用图层滤镜
   */
  canvasFilter?: boolean
  /**
   * 滤镜设置
   */
  canvasSetting?: CanvasSetting
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

const XYZ = React.forwardRef<HTMLDivElement, XYZProps>(
  (
    {
      className,
      cellKey,
      source: sourceUrl,
      coordinateType,
      coorDefs,
      canvasFilter,
      canvasSetting,
      layerBase,
      display = true,
      map: mapProp,
      ...props
    },
    ref
  ) => {
    const contextMap = useMap()
    const map = mapProp || contextMap
    const layerRef = React.useRef<TileLayer<XYZSource> | null>(null)
    const refreshKeyRef = React.useRef(0)

    const { opacity, zIndex, maxResolution, minResolution, maxZoom, minZoom } = layerBase || {}

    // 添加缓存破坏参数
    const appendCacheBust = React.useCallback((url: string | undefined, key: number) => {
      if (!url) return url
      const join = url.indexOf('?') >= 0 ? '&' : '?'
      return `${url}${join}_v=${key}`
    }, [])

    // 瓦片加载函数（支持滤镜）
    const tileLoadFunction = React.useCallback((imageTile: { getImage: () => HTMLImageElement }, src: string) => {
      const tileImg = imageTile.getImage()

      // 未启用滤镜时，走默认加载逻辑
      if (!canvasFilter || !canvasSetting) {
        tileImg.src = src
        return
      }

      // 使用滤镜处理
      const img = new Image()
      img.crossOrigin = 'anonymous'

      const fallbackToSrc = (retry = false) => {
        if (retry) {
          const join = src.indexOf('?') >= 0 ? '&' : '?'
          tileImg.src = `${src}${join}_rt=${Date.now()}`
        } else {
          tileImg.src = src
        }
      }

      img.onerror = function () {
        fallbackToSrc(true)
      }

      img.onload = function () {
        try {
          const canvas = document.createElement('canvas')
          const w = img.width
          const h = img.height
          canvas.width = w
          canvas.height = h
          const context = canvas.getContext('2d')

          if (context && canvasSetting) {
            const { grayscale = 0, invert = 0, sepia = 0, saturate = 100, brightness = 100, contrast = 100 } = canvasSetting
            const hueRotate = canvasSetting['hue-rotate'] || 0
            context.filter = `grayscale(${grayscale}%) invert(${invert}%) sepia(${sepia}%) hue-rotate(${hueRotate}deg) saturate(${saturate}%) brightness(${brightness}%) contrast(${contrast}%)`
            context.drawImage(img, 0, 0, w, h, 0, 0, w, h)

            try {
              tileImg.src = canvas.toDataURL('image/png')
            } catch {
              fallbackToSrc(true)
            }
          } else {
            fallbackToSrc()
          }
        } catch {
          fallbackToSrc(true)
        }
      }

      img.src = src
    }, [canvasFilter, canvasSetting])

    // 创建图层
    React.useEffect(() => {
      if (!map || !sourceUrl) return

      // 先移除旧图层
      if (layerRef.current) {
        map.removeLayer(layerRef.current)
        layerRef.current = null
      }

      const initUrl = appendCacheBust(sourceUrl, refreshKeyRef.current)

      const xyzSource = new XYZSource({
        url: initUrl,
        crossOrigin: 'anonymous',
        tileLoadFunction: tileLoadFunction as (tile: unknown, src: string) => void
      })

      const layer = new TileLayer({
        source: xyzSource,
        opacity,
        zIndex,
        maxResolution,
        minResolution,
        maxZoom,
        minZoom,
        properties: { layerType: 'xyz', cellKey }
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
    }, [map, sourceUrl, coordinateType, JSON.stringify(coorDefs), tileLoadFunction, appendCacheBust, opacity, zIndex, maxResolution, minResolution, maxZoom, minZoom, cellKey])

    // 刷新图层
    React.useEffect(() => {
      const layer = layerRef.current
      if (!layer) return
      const src = layer.getSource()
      if (!src) return

      if (!display) return

      refreshKeyRef.current += 1
      if (src.setUrl && sourceUrl) {
        src.setUrl(appendCacheBust(sourceUrl, refreshKeyRef.current) || '')
      }
      src.refresh()
    }, [appendCacheBust, display, sourceUrl, JSON.stringify({ canvasFilter, canvasSetting })])

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
        className={cn("xyz-layer", className)}
        style={{ display: 'none' }}
        data-cell-key={cellKey}
        {...props}
      />
    )
  }
)

XYZ.displayName = "XYZ"

export { XYZ }
