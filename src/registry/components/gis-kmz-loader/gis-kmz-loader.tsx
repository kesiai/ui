
import * as React from "react"
import { cn } from "@/lib/utils"
// @ts-ignore
import { Vector as VectorLayer } from 'ol/layer'
// @ts-ignore
import { Vector as VectorSource } from 'ol/source'
// @ts-ignore
import { KML } from 'ol/format'
import type Map from 'ol/Map'
import { useMap } from '../gis-map-core/gis-map-core'
import JSZip from 'jszip'
import { getMapCoordinateType } from '../gis-shared-utils/gis-shared-utils'

// Helper to load KMZ (ported from source)
const loadRemoteKMZ = async (kmzUrl: string) => {
    try {
        const response = await fetch(kmzUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const arrayBuffer = await response.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        const kmlFile = Object.keys(zip.files).find(name => name.endsWith('.kml'));
        if (!kmlFile) throw new Error('KMZ中未找到KML文件');

        const kmlContent = await zip.file(kmlFile)?.async('text');
        return kmlContent;
    } catch (error) {
        console.error('加载KMZ失败:', error);
        throw error;
    }
};

export interface LayerBase {
    opacity?: number
    zIndex?: number
    maxResolution?: number
    minResolution?: number
    maxZoom?: number
    minZoom?: number
}

export interface KmzProps {
    source?: string
    coordinateType?: string
    kmzFile?: string
    title?: string
    layerBase?: LayerBase
    display?: boolean
    className?: string
    map?: Map | null
}

const Kmz = React.forwardRef<HTMLDivElement, KmzProps>(
    (
        {
            className,
            source: sourceUrl,
            kmzFile,
            coordinateType,
            title = 'kmz',
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

        // Load and Create Layer
        React.useEffect(() => {
            if (!map) return

            let isCancelled = false;

            const loadAndAddLayer = async () => {
                try {
                    const rawUrl = kmzFile || sourceUrl
                    if (!rawUrl) return

                    let kmzUrl = rawUrl
                    if (!rawUrl.startsWith('http') && typeof window !== 'undefined') {
                        kmzUrl = window.location.origin + (rawUrl.startsWith('/') ? '' : '/') + rawUrl
                    }

                    const mapCoordinateType = getMapCoordinateType(map)

                    // Load KML content from KMZ
                    const kmlContent = await loadRemoteKMZ(kmzUrl)

                    if (isCancelled) return

                    // Create Layer
                    const source = new VectorSource({
                        format: new KML({
                            extractStyles: true,
                            showPointNames: false,
                            dataProjection: coordinateType,
                            featureProjection: mapCoordinateType
                        }),
                        // Use features read from content
                        features: new KML().readFeatures(kmlContent, {
                            dataProjection: coordinateType,
                            featureProjection: mapCoordinateType
                        })
                    })

                    const layer = new VectorLayer({
                        title,
                        source: source,
                        opacity: opacity || 1,
                        zIndex,
                        maxResolution,
                        minResolution,
                        maxZoom, // Logic from source doesn't strictly pass all these to constructor in kmz.js but uses useLayerProperties. I'll add them here for initial state.
                        minZoom,
                        properties: {
                            layerType: 'kmz',
                            title
                        }
                    } as any)

                    if (layerRef.current) {
                        map.removeLayer(layerRef.current)
                    }

                    layerRef.current = layer
                    layer.setVisible(display)
                    map.addLayer(layer)

                } catch (error: any) {
                    console.error('加载KMZ图层失败:', error)
                    // alert('加载KMZ文件失败: ' + error?.message) // Optional: replicate alert
                }
            }

            loadAndAddLayer()

            return () => {
                isCancelled = true
                if (layerRef.current && map) {
                    map.removeLayer(layerRef.current)
                }
            }
        }, [map, sourceUrl, kmzFile, coordinateType, title]) // Re-load if source changes

        // Update Visibility and Properties (Dynamic updates)
        React.useEffect(() => {
            const layer = layerRef.current
            if (!layer) return

            layer.setVisible(display)
            if (opacity !== undefined) layer.setOpacity(opacity)
            if (zIndex !== undefined) layer.setZIndex(zIndex)
            if (maxResolution !== undefined) layer.setMaxResolution(maxResolution)
            if (minResolution !== undefined) layer.setMinResolution(minResolution)
            if (maxZoom !== undefined) layer.setMaxZoom(maxZoom)
            if (minZoom !== undefined) layer.setMinZoom(minZoom)

        }, [display, opacity, zIndex, maxResolution, minResolution, maxZoom, minZoom])

        return (
            <div
                ref={ref}
                className={cn("kmz-layer", className)}
                style={{ display: 'none' }}
                {...props}
            />
        )
    }
)

Kmz.displayName = "Kmz"

export { Kmz }
