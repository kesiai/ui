
import * as React from "react"
import { cn } from "@/lib/utils"
// @ts-ignore
import { Tile as TileLayer } from 'ol/layer'
// @ts-ignore
import { XYZ as XYZSource } from 'ol/source'
// @ts-ignore
import * as style from 'ol/style'
import type Map from 'ol/Map'
import { useMap } from '../gis-map-core/gis-map-core'
import _ from 'lodash'
import { getProjection, getMapCoordinateType } from './utils'


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
  source?: string
  coordinateType?: string
  coorDefs?: CoorDefs
  canvasFilter?: boolean
  canvasSetting?: CanvasSetting | CanvasSetting[]
  layerBase?: LayerBase
  display?: boolean
  className?: string
  cellKey?: string
  map?: Map | null
}

const XYZ = React.forwardRef<HTMLDivElement, XYZProps>(
  (props, ref) => {
    const {
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
      ...otherProps
    } = props

    const contextMap = useMap()
    const map = mapProp || contextMap
    const layerRef = React.useRef<any>(null)
    const refreshKeyRef = React.useRef(0)

    const { opacity, zIndex, maxResolution, minResolution, maxZoom, minZoom } = layerBase || {}

    // Cache Busting
    const appendCacheBust = React.useCallback((url: string | undefined, key: number) => {
      if (!url) return url
      const join = url.indexOf('?') >= 0 ? '&' : '?'
      return `${url}${join}_v=${key}`
    }, [])

    // Tile Load Function
    const tileLoadFunction = React.useCallback((imageTile: any, src: string) => {
      const tileImg = imageTile.getImage() as HTMLImageElement

      // 未启用滤镜时，走默认加载逻辑
      if (!canvasFilter || !canvasSetting) {
        tileImg.src = src
        return
      }

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

          // Handle array vs object for canvasSetting
          let initValue: CanvasSetting | undefined
          if (Array.isArray(canvasSetting) && !_.isEmpty(canvasSetting)) {
            initValue = canvasSetting[0]
          } else if (_.isPlainObject(canvasSetting) && !_.isEmpty(canvasSetting)) {
            initValue = canvasSetting as CanvasSetting
          }

          if (context && initValue) {
            const { grayscale = 0, invert = 0, sepia = 0, saturate = 100, brightness = 100, contrast = 100 } = initValue
            const hueRotate = initValue['hue-rotate'] || 0

            context.filter = `grayscale(${grayscale}%) invert(${invert}%) sepia(${sepia}%) hue-rotate(${hueRotate}deg) saturate(${saturate}%) brightness(${brightness}%) contrast(${contrast}%)`
          }

          if (context) {
            context.drawImage(img, 0, 0, w, h, 0, 0, w, h)
            try {
              tileImg.src = canvas.toDataURL('image/png')
            } catch (e) {
              fallbackToSrc(true)
            }
          } else {
            fallbackToSrc()
          }
        } catch (e) {
          fallbackToSrc(true)
        }
      }

      img.src = src
    }, [JSON.stringify({ canvasFilter, canvasSetting })])

    // Create Layer
    React.useEffect(() => {
      if (!map) return

      const mapCoordinateType = getMapCoordinateType(map)
      const initUrl = appendCacheBust(sourceUrl, refreshKeyRef.current)

      // Projection Logic
      const projection = getProjection(coorDefs, coordinateType, mapCoordinateType)

      const geoSource = new XYZSource({
        cacheSize: 0,
        url: initUrl,
        crossOrigin: 'anonymous',
        projection: projection,
        tileLoadFunction
      } as any)

      const layer = new TileLayer({
        opacity,
        zIndex,
        maxResolution,
        minResolution,
        maxZoom,
        minZoom,
        source: geoSource,
        // rotation: 76,
        changeSelect: true,
        style: (_feature: any, _type: any) => new style.Style({ image: new style.Icon({ src: '' }) }),
        properties: { layerType: 'xyz', cellKey } // Preserve custom props
      } as any)

      layerRef.current = layer
      map.addLayer(layer)

      return () => {
        if (map && layer) {
          map.removeLayer(layer)
        }
      }
    }, [map, sourceUrl, coordinateType, JSON.stringify(coorDefs), tileLoadFunction]) // Removed props dependencies that are handled by updates

    // Update Layer Source/Refresh
    React.useEffect(() => {
      const layer = layerRef.current
      if (!layer) return
      const src = layer.getSource()
      if (!src) return

      if (!display) return

      refreshKeyRef.current += 1
      if (src.setUrl && sourceUrl) {
        src.setUrl(appendCacheBust(sourceUrl, refreshKeyRef.current))
      }
      if (src.clear) src.clear()
      if (src.refresh) src.refresh()

    }, [appendCacheBust, display, sourceUrl, JSON.stringify({ canvasFilter, canvasSetting }), coordinateType, JSON.stringify(coorDefs)])

    // Update Layer Properties (useLayerProperties logic equivalent)
    React.useEffect(() => {
      const layer = layerRef.current
      if (!layer) return

      if (opacity !== undefined) layer.setOpacity(opacity)
      if (zIndex !== undefined) layer.setZIndex(zIndex)
      if (maxResolution !== undefined) layer.setMaxResolution(maxResolution)
      if (minResolution !== undefined) layer.setMinResolution(minResolution)
      if (maxZoom !== undefined) layer.setMaxZoom(maxZoom)
      if (minZoom !== undefined) layer.setMinZoom(minZoom)

      // Visibility
      if (display !== undefined) layer.setVisible(display)

    }, [opacity, zIndex, maxResolution, minResolution, maxZoom, minZoom, display])


    return (
      <div
        ref={ref}
        className={cn("xyz-layer", className)}
        style={{ display: 'none' }}
        data-cell-key={cellKey}
        {...otherProps}
      />
    )
  }
)

XYZ.displayName = "XYZ"

export { XYZ }
