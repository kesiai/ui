
import Map from 'ol/Map'
import * as proj from 'ol/proj'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'

// 注册 proj4 到 OpenLayers
register(proj4)

// 坐标系映射表（兼容多种别名）
const COORD_SYSTEM_MAP: Record<string, string> = {
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

export const getProjectionCode = (coordinateType: string) => {
    return COORD_SYSTEM_MAP[coordinateType] || coordinateType
}

// 获取地图坐标系类型
export const getMapCoordinateType = (map: Map | null) => {
    if (!map || !map.getView) {
        // 默认返回 EPSG:3857
        return 'EPSG:3857'
    }
    const view = map.getView();
    const projection = view.getProjection();
    const code = projection.getCode()
    return code
}

// 获取 Projection 对象
export const getProjection = (coorDefs: any, tileCoordinateType: string | undefined, mapCoordinateSystem: string) => {
    const dataProjection = coorDefs?.dataProjection
    // 如果没有提供坐标系定义，使用默认的地图坐标系（或 tileCoordinateType）
    const tileProjectionCode = dataProjection || tileCoordinateType || mapCoordinateSystem

    // 1. 标准坐标系处理
    if (['EPSG:4326', 'EPSG:3857'].includes(tileProjectionCode)) {
        return proj.get(tileProjectionCode);
    }

    // 2. 自定义坐标系处理 (Proj4)
    if (dataProjection && coorDefs?.defs) {
        // 注册自定义坐标系
        try {
            proj4.defs(dataProjection, coorDefs.defs)
            register(proj4)

            const projection_ = new proj.Projection({
                code: dataProjection,
                units: coorDefs?.unit || 'm',
                axisOrientation: 'neu',
                //   extent: coorDefs?.extent?.length ? coorDefs.extent.map(Number) : null // options conflict in types?
            })
            if (coorDefs?.extent?.length) {
                projection_.setExtent(coorDefs.extent.map(Number))
            }

            // 如果已经在 OL 中注册（通过 register(proj4)），可能不需要手动 addProjection，但为了保险
            // proj4.defs 注册后，OL 的 proj4 插件会自动识别

            return projection_ // 或者 use proj.get(dataProjection)

        } catch (e) {
            console.error('Proj4 registration failed', e)
        }
    }

    // Fallback to getting by code (allows things like 'EPSG:xxx' if already known by proj4 or OL)
    // 如果 tileProjectionCode 是 'GCJ02' 或 'BD09' 等如果未定义会返回 null
    return proj.get(tileProjectionCode)
}
