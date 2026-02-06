
import Feature from 'ol/Feature'
import * as geom from 'ol/geom'
import * as style from 'ol/style'
import { fromLonLat } from 'ol/proj'
import _ from 'lodash'

// 简化的 mapMaxResolution
const mapMaxResolution = 156543.03392804097;

export const getMapZoomforResolution = (resolution: number) => {
    return Math.log(mapMaxResolution / resolution) / Math.LN2;
}

export const getMarkerId = (record: any) => {
    return (record?.table || record?._table || record.tableId) + '|' + record?.id
}

// 简单的坐标转换，默认 EPSG:4326 -> EPSG:3857
export const getTransformTo3857 = (coordinateType?: string) => {
    // 暂时忽略 coordinateType 的复杂判断，假设输入是 WGS84，输出 3857
    // 如果需要支持其他坐标系，这里需要 proj4
    return (coordinate: number[]) => fromLonLat(coordinate)
}

export const generateHalfCircle = (center: number[], radius: number, startAngle: number, endAngle: number) => {
    const angleStep = Math.PI / 180;
    const offset = 180
    let points = [];
    for (let angle = Math.PI * ((startAngle - offset) / (180)); angle <= Math.PI * ((endAngle - offset) / 180); angle += angleStep) {
        points.push([
            center[0] + Math.cos(angle) * radius,
            center[1] - Math.sin(angle) * radius  // Y 轴向下移动
        ])
    }
    return points
}

export const createFeature = ({ type, record, style: styleConfig, coordinate, coordinateType, markerTags, cellKey, tableGisConfig }: any) => {
    const transform = getTransformTo3857(coordinateType)
    let feature = new Feature({})

    if (!coordinate) return feature;

    if (type == 'Point') {
        feature = new Feature({
            geometry: new geom.Point(transform(coordinate)),
        });
    } else if (type == 'LineString') {
        feature = new Feature({
            geometry: new geom.LineString(coordinate.map((coord: number[]) => transform(coord)))
        })
    } else if (type == 'Polygon') {
        feature = new Feature({
            geometry: new geom.Polygon(coordinate.map((coord: number[][]) => coord.map(c => transform(c))))
        })
    } else if (type == 'Circle') {
        if (!coordinate?.center || !coordinate?.radius) return feature
        feature = new Feature({
            geometry: new geom.Circle(transform(coordinate.center), coordinate.radius),
        })
    } else if (type == 'Semicircle') {
        const { center, radius } = coordinate
        const { isClose, startAngle = 0, endAngle = 180 } = styleConfig || {}
        const transCenter = transform(center)
        const geo = generateHalfCircle(transCenter, radius, startAngle, endAngle)
        let geometry: geom.Geometry = new geom.LineString(geo)
        if (isClose) {
            geo.push(transCenter)
            geo.push(geo[0])
            geometry = new geom.Polygon([geo])
        }
        feature = new Feature({ geometry });
    }

    feature.setId(getMarkerId(record))
    feature.setProperties({
        markerRecord: record,
        markerType: type,
        markerInitStyle: styleConfig,
        markerTags: markerTags,
        markerLabel: record._label,
        cellKey,
        tableGisConfig
    }, true)
    return feature
}

export const createEmptyFeature = (record: any) => {
    let feature = new Feature({})
    feature.setId(getMarkerId(record))
    feature.setProperties({
        markerRecord: record,
        markerLabel: record._label,
    }, true)
    return feature
}

export function isInRange(current: number, min: number | null, max: number | null) {
    if (min === null && max === null) {
        return false;
    }
    const minValid = min === null || current >= min;
    const maxValid = max === null || current <= max;
    return minValid && maxValid;
}

export function clusterStyle(cluster: any, size: number) {
    return new style.Style({
        image: new style.Circle({
            radius: cluster?.radius || 18,
            fill: new style.Fill({
                color: cluster?.background || 'rgba(0, 0, 255, 0.6)'
            })
        }),
        text: new style.Text({
            font: `${cluster.font || 15}px sans-serif`,
            text: cluster?.text ? cluster?.text.indexOf('XX') > -1 ? cluster?.text?.replace('XX', size?.toString()) : cluster?.text : size?.toString(),
            fill: new style.Fill({
                color: cluster?.color || '#fff'
            })
        })
    })
}

export function parseIconScript({ iconScript, record, tags, style }: any) {
    if (!iconScript || typeof iconScript !== 'string') {
        return null;
    }
    try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const scriptFn = new Function('record', 'tags', 'style', `
      try {
        const userFn = ${iconScript};
        return typeof userFn === 'function' ? userFn(record, tags, style) : null;
      } catch (e) {
        return null;
      }
    `);
        let result = scriptFn(record, tags, style)
        if (_.isString(result)) {
            // 假设 /rest 开头是相对路径，否则补上前缀（这里简化处理，直接返回）
            // result = result.startsWith('/rest') ? result : config('mediaUrl') + result
        }
        return result
    } catch (error) {
        console.error('图标脚本解析失败:', error);
        return null;
    }
}

export const createNumberLabelStyles = ({ geometry, baseStyle, textStyle = {} }: any) => {
    if (!geometry) {
        return baseStyle
    }

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
        return baseStyle
    }

    // 如果是闭合多边形，去掉最后一个重复的点
    if (coordinates.length > 1) {
        const first = coordinates[0]
        const last = coordinates[coordinates.length - 1]
        if (first && last && first[0] === last[0] && first[1] === last[1]) {
            coordinates = coordinates.slice(0, coordinates.length - 1)
        }
    }

    // 默认文本样式
    const defaultTextStyle = {
        font: '12px Calibri,sans-serif',
        fillColor: '#000000',
        strokeColor: '#ffffff',
        strokeWidth: 2,
        offsetY: -12,
        ...textStyle
    }

    // 创建序号标签样式
    const labelStyles = coordinates.map((coord, index) => new style.Style({
        geometry: new geom.Point(coord),
        text: new style.Text({
            text: String(index + 1),
            font: defaultTextStyle.font,
            fill: new style.Fill({ color: defaultTextStyle.fillColor }),
            stroke: new style.Stroke({ color: defaultTextStyle.strokeColor, width: defaultTextStyle.strokeWidth }),
            offsetY: defaultTextStyle.offsetY,
        })
    }))

    return [baseStyle, ...labelStyles]
};


// 样式创建相关
const defaultIcon = 'https://ui.shadcn.com/avatars/01.png' // 临时默认图标

export const createIconClass = ({ iconSrc, color, offsetX, offsetY, scale, rotation, displacementX, displacementY, rotateWithView }: any, zoomScale: any) => {

    const baseScale = scale ? scale : 1
    let normalizedSrc = iconSrc
    if (typeof normalizedSrc === 'string' && normalizedSrc) {
        try {
            normalizedSrc = encodeURI(normalizedSrc)
        } catch (e) {
            normalizedSrc = iconSrc
        }
    }

    const iconOptions: any = {
        src: normalizedSrc || defaultIcon,
        offset: [offsetX || 0, offsetY || 0],
        scale: zoomScale ? zoomScale * baseScale : baseScale,
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        rotation: rotation || 0,
        rotateWithView: rotateWithView !== undefined ? rotateWithView : true,
        displacement: [displacementX || 0, displacementY || 0]
    }

    if (color) {
        iconOptions.color = color
    }

    return new style.Icon(iconOptions)
}

export const createTextClass = ({ text, font, fill, stroke, scale, rotation, offsetX, offsetY, backgroundFill }: any, zoomScale?: any) => {

    const baseScale = scale ? scale : 1

    return new style.Text({
        text: text || '',
        font: font || `12px Calibri,sans-serif`,
        fill: new style.Fill({ color: fill || 'rgba(0,0,0,1)' }),
        stroke: new style.Stroke({ color: stroke || 'rgba(255,255,255,1)', width: 2 }),
        scale: zoomScale ? zoomScale * baseScale : baseScale,
        rotation: rotation || 0,
        offsetX: offsetX || 0,
        offsetY: offsetY || 0,
        backgroundFill
    })
}

export const createStyleClass = ({
    markerType,
    style: markerStyle,
    zIndex,
    zoomScale
}: any) => {

    const {
        icon, line, polygon, circle, semicircle, text,
        textSetting, iconUrl, iconSetting, backgroundFill
    } = markerStyle || {}

    let iconStyle = icon || {}
    let textStyle = text || {}

    if (textSetting) { textStyle = _.merge(textSetting, textStyle) }
    if (backgroundFill && !textStyle.fill) { textStyle['fill'] = backgroundFill }

    if (markerType == 'Point') {
        if (iconUrl && !iconStyle?.iconSrc) {
            iconStyle.iconSrc = iconUrl || {}
        }
        if (iconSetting) {
            iconStyle = _.merge(iconSetting, iconStyle || {})
        }
        return new style.Style({
            image: createIconClass(iconStyle || {}, zoomScale),
            text: createTextClass(textStyle || {}, zoomScale),
            zIndex: zIndex || 0,
        })
    } else {
        // 简化处理线面圆的样式获取
        let typeStyle: any = {}
        if (markerType === 'LineString') typeStyle = line
        if (markerType === 'Polygon') typeStyle = polygon
        if (markerType === 'Circle') typeStyle = circle
        if (markerType === 'Semicircle') typeStyle = semicircle

        const { fill, color, width, lineDash } = typeStyle || {}

        let fillColor = fill
        let strokeColor = color
        let strokeWidth = width || 2
        let strokeLineDash = lineDash

        if (!fillColor) fillColor = markerStyle?.fillColor
        if (!strokeColor) strokeColor = markerStyle?.color
        if (!strokeWidth) strokeWidth = markerStyle?.width

        return new style.Style({
            text: createTextClass(textStyle || {}),
            zIndex: zIndex || 0,
            fill: fillColor && new style.Fill({ color: fillColor }),
            stroke: new style.Stroke({
                color: strokeColor,
                width: strokeWidth,
                lineDash: (strokeLineDash == "dashed" || strokeLineDash == 'dash') ? [10, 10] : null
            }),
        })
    }
}

export function getGeometryCenter(geometry: geom.Geometry) {
    const type = geometry.getType();

    switch (type) {
        case 'Point':
            return (geometry as geom.Point).getCoordinates();

        case 'LineString':
            const lineCoords = (geometry as geom.LineString).getCoordinates();
            const midIndex = Math.floor(lineCoords.length / 2);
            return lineCoords[midIndex];

        case 'Polygon':
            const interiorPoint = (geometry as geom.Polygon).getInteriorPoint().getCoordinates()
            return interiorPoint.slice(0, 2)

        case 'Circle':
            return (geometry as geom.Circle).getCenter();

        default:
            return null;
    }
}
