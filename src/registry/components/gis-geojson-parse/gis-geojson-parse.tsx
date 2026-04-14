
import * as React from "react"
import { cn } from "@/lib/utils"
// @ts-ignore
import { Vector as VectorLayer } from 'ol/layer'
// @ts-ignore
import { GeoJSON as GeoJSONFormat } from 'ol/format'
import * as style from 'ol/style'
import type Map from 'ol/Map'
import { useMap } from '../gis-map-core/gis-map-core'
import { createVectorSource, hexToRgba } from '../gis-shared-utils/gis-shared-utils'

export interface LineStyle {
    color?: string
    width?: number
    text?: any
    background?: string
}

export interface LayerBase {
    opacity?: number
    zIndex?: number
    maxResolution?: number
    minResolution?: number
    maxZoom?: number
    minZoom?: number
}

export interface GeoJsonProps {
    source?: string
    coordinateType?: string
    geoJsonFile?: string
    lineStyle?: LineStyle
    title?: string
    layerBase?: LayerBase
    display?: boolean
    className?: string
    map?: Map | null
}

const GeoJson = React.forwardRef<HTMLDivElement, GeoJsonProps>(
    (
        {
            className,
            source: sourceUrl, // source usually means remote URL
            geoJsonFile, // alternative file path
            coordinateType,
            lineStyle,
            title = 'geojson',
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

        // Style Function (Replicates source logic)
        const styleFunction = React.useCallback((feature: any) => {
            const properties = feature.getProperties();
            const width = properties?.width || properties?.['stroke-width'] || properties?.['strokeWidth'] || lineStyle?.width || 2
            const fillOpacity = properties?.['fill-opacity'] || properties?.['fillOpacity']
            const strokeOpacity = properties?.['stroke-opacity'] || properties?.['strokeOpacity']
            const color = properties?.stroke || properties?.strokeColor || properties?.color || lineStyle?.color || 'rgba(255, 0, 0, 1)'
            const fill = properties?.fill || properties?.background || lineStyle?.background || 'rgba(255, 255, 255, 0.2)'

            const strokeColor = hexToRgba(color, strokeOpacity)
            const fillColor = hexToRgba(fill, fillOpacity)
            const label = properties?.name

            return new style.Style({
                stroke: new style.Stroke({
                    color: strokeColor,
                    width
                }),
                fill: new style.Fill({
                    color: fillColor
                }),
                text: new style.Text({
                    text: typeof label === 'string' ? label : '',
                    font: `${properties?.['textFont'] || lineStyle?.text?.font || 12}px Calibri,sans-serif`,
                    fill: new style.Fill({
                        color: fillColor
                    }),
                    stroke: new style.Stroke({
                        color: strokeColor,
                        width
                    }),
                    ...lineStyle?.text
                })
            })
        }, [lineStyle]) // lineStyle dependency

        // Create Layer
        React.useEffect(() => {
            if (!map) return

            // Logic from source: const geoUrl = window.location.origin + (geoJsonFile || sourceUrl)
            // We should check if it's absolute URL first, otherwise prepend origin?
            // Actually source code blindly prepends origin. I'll follow that but be safer.
            const rawUrl = geoJsonFile || sourceUrl
            if (!rawUrl) return

            let geoUrl = rawUrl
            if (!rawUrl.startsWith('http') && typeof window !== 'undefined') {
                geoUrl = window.location.origin + (rawUrl.startsWith('/') ? '' : '/') + rawUrl
            }

            const geoFormat = new GeoJSONFormat()
            const geoSource = createVectorSource(coordinateType, geoFormat, geoUrl, map)

            // Remove old layer
            if (layerRef.current) {
                map.removeLayer(layerRef.current)
            }

            const layer = new VectorLayer({
                title,
                opacity: opacity || 1,
                zIndex,
                maxResolution,
                minResolution,
                maxZoom,
                minZoom,
                source: geoSource,
                style: styleFunction,
                properties: { // Preserve custom properties
                    title,
                    layerType: 'geojson',
                }
            } as any)

            layerRef.current = layer
            layer.setVisible(display)
            map.addLayer(layer)

            return () => {
                if (layerRef.current && map) {
                    map.removeLayer(layerRef.current)
                }
            }
        }, [map, sourceUrl, geoJsonFile, coordinateType, opacity, zIndex, maxResolution, minResolution, maxZoom, minZoom, title]) // Re-create if essential props change

        // Update Style independently to avoid reloading layer
        React.useEffect(() => {
            if (!layerRef.current) return
            layerRef.current.setStyle(styleFunction)
        }, [styleFunction])

        // Update Visibility
        React.useEffect(() => {
            if (!layerRef.current) return
            layerRef.current.setVisible(display)
        }, [display])

        return (
            <div
                ref={ref}
                className={cn("geojson-layer", className)}
                style={{ display: 'none' }}
                {...props}
            />
        )
    }
)

GeoJson.displayName = "GeoJson"

export { GeoJson }
