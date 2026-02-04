
import Map from 'ol/Map'
import gcoord from 'gcoord'
import { Vector as VectorSource } from 'ol/source'

// 坐标系映射表
export const COORD_SYSTEM_MAP: Record<string, string> = {
    // WGS84系列
    WGS84: 'EPSG:4326',
    WGS1984: 'EPSG:4326',
    EPSG4326: 'EPSG:4326',
    'EPSG:4326': 'EPSG:4326',

    // 火星坐标系
    GCJ02: 'GCJ02',
    AMap: 'GCJ02',

    // 百度坐标系
    BD09: 'BD09',
    BD09LL: 'BD09',
    Baidu: 'BD09',
    BMap: 'BD09',
    BD09MC: 'BD09MC',
    BD09Meter: 'BD09MC',

    // Web墨卡托
    EPSG3857: 'EPSG:3857',
    'EPSG:3857': 'EPSG:3857',
    EPSG900913: 'EPSG:3857',
    EPSG102100: 'EPSG:3857',
    WebMercator: 'EPSG:3857',
    WM: 'EPSG:3857'
}

// 递归转换GeoJSON坐标
export const transformGeoJSON = (geojson: any, from: string, to: string) => {
    const clone = JSON.parse(JSON.stringify(geojson))
    const transform = (coords: any): any => {
        if (!Array.isArray(coords)) return coords
        if (typeof coords[0] === 'number') {
            // @ts-ignore
            return gcoord.transform(coords, gcoord[from], gcoord[to])
        }
        return coords.map(transform)
    }

    clone.features?.forEach((f: any) => {
        if (f.geometry?.coordinates) {
            f.geometry.coordinates = transform(f.geometry.coordinates)
        }
    })
    return clone
}

// 获取地图坐标系类型
export const getMapCoordinateType = (map: Map | null) => {
    if (!map || !map.getView) {
        return 'EPSG:3857'
    }
    const view = map.getView()
    const projection = view.getProjection()
    return projection.getCode()
}

/**
 * 创建矢量数据源（智能坐标系转换，复刻 legacy 逻辑）
 */
export const createVectorSource = (
    dataProjection: string | undefined, // 用户配置的坐标系 (e.g. GCJ02)
    format: any,
    url: string,
    map: Map | null
) => {
    const mapProjection = getMapCoordinateType(map)
    const normalizedDataProj = COORD_SYSTEM_MAP[dataProjection || ''] || dataProjection
    const normalizedMapProj = COORD_SYSTEM_MAP[mapProjection] || mapProjection

    return new VectorSource({
        format,
        url,
        loader: async function (this: VectorSource, _extent, _resolution, _projection, success, failure) {
            try {
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} ${response.statusText}`)
                }
                const geojson = await response.json()

                let finalData = geojson
                let finalDataProjection = normalizedDataProj

                // 加密坐标系 -> WGS84
                if (normalizedDataProj && ['GCJ02', 'BD09', 'BD09MC'].includes(normalizedDataProj)) {
                    finalData = transformGeoJSON(geojson, normalizedDataProj, 'WGS84')
                    finalDataProjection = 'EPSG:4326' // WGS84 is 4326
                }

                // OpenLayers自动转换到目标坐标系
                const features = format.readFeatures(finalData, {
                    dataProjection: finalDataProjection || 'EPSG:4326', // Default to 4326 if not specified
                    featureProjection: normalizedMapProj
                })

                this.addFeatures(features)
                if (success) success(features)
            } catch (error) {
                console.error('数据加载失败:', error)
                if (failure) failure()
            }
        }
    })
}

// Helper to convert hex to rgba
export const hexToRgba = (hex: string, opacity: number | undefined) => {
    if (!hex) return hex;
    let c: string[];
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        const val = parseInt(c.join(''), 16);
        return 'rgba(' + [(val >> 16) & 255, (val >> 8) & 255, val & 255].join(',') + ',' + (opacity === undefined ? 1 : opacity) + ')';
    }
    return hex;
}
