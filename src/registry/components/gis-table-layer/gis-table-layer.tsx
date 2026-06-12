'use client'
import React from 'react'
import { useWS } from '@kesi/client'
import { cn } from '@/lib/utils'
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import VectorSource from 'ol/source/Vector'
import { Vector as VectorLayer, Heatmap } from 'ol/layer'
import Cluster from 'ol/source/Cluster'
import { createEmpty, extend } from 'ol/extent'
// @ts-ignore
import { useMap } from '@/registry/components/gis-map-core/gis-map-core'
import {
    getGISTable,
    getTableRecord,
    getTableRecordDataPoint,
    getTableDepartmentFilter,
    getReord
} from './methods'
import {
    createFeature,
    createEmptyFeature,
    createStyleClass,
    clusterStyle,
    parseIconScript,
    getTransformTo3857,
    createNumberLabelStyles
} from './utils'
import {
    createOverLayer,
    DefaultPanel,
    CustomPanel,
    ViewPanel,
    getGeometryCenter
} from './overlay-utils'
import isBoolean from 'lodash/isBoolean'
import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import isNumber from 'lodash/isNumber'
import debounce from 'lodash/debounce'
import keyBy from 'lodash/keyBy'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'
// @ts-ignore
import * as olStyle from 'ol/style'

// 默认标记图标（绿色图钉）- 没有配置图标时使用
const DEFAULT_MARKER_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDI0IDM2Ij48cGF0aCBmaWxsPSIjNENBRjUwIiBkPSJNMTIgMEMxOC42MjcgMCAyNC41MzczIDI0IDEyIDI0UzAgMjAuMjc0IDAgMTJDMCA1LjM3MyA1LjM3MyAwIDEyIDB6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNyIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg=='

export interface GisTableLayerProps {
    /**
     * 表ID（单个表对象，如 {id: '表ID', title: '表名'}，或JSON字符串）
     */
    table?: any
    /**
     * 表记录列表（如果提供，则不查询API）
     */
    tableData?: any

    /**
     * 标记样式
     */
    marker?: any
    /**
     * 高亮标记样式
     */
    highlightMarker?: any
    /**
     * 部门过滤
     */
    department?: any
    /**
     * 数据过滤
     */
    tableFilters?: any
    /**
     * 弹窗配置
     */
    modalConfig?: any
    /**
     * 选中配置
     */
    selectConfig?: any
    /**
     * 坐标系类型
     */
    coordinateType?: string
    /**
     * 图层基础配置
     */
    layerBase?: {
        opacity?: number
        zIndex?: number
        maxResolution?: number
        minResolution?: number
        maxZoom?: number
        minZoom?: number
    }
    /**
     * 热力图配置
     */
    heatmap?: {
        show?: boolean
        radius?: number
        blur?: number
        gradient?: string[]
    }
    /**
     * 聚合配置
     */
    cluster?: {
        show?: boolean
        distance?: number
        minDistance?: number
        radius?: number
        text?: string
        font?: number
        color?: string
        background?: string
    }
    /**
     * 是否显示
     */
    display?: boolean
    /**
     * CSS 类名
     */
    className?: string
    /**
     * 表数据点 (额外订阅的字段)
     */
    tableTags?: any
    /**
     * 查询过滤器函数 (可选，用于处理复杂的 tableFilters)
     */
    getQueryFilter?: any
    /**
     * 地图实例（由父组件传入）
     */
    map?: any
    /**
     * 标记缩放配置
     */
    markerScale?: any
}

const DEBOUNCE_DELAY = 300

// 辅助函数：创建热力图渐变色
const createHeatmapGradient = (gradient: string[]) => {
    return gradient?.length ? gradient?.length == 1 ? [...gradient.map(item => (item || '#0f0')), '#00f'] : gradient.map(item => (item || '#0f0')) : ['#00f', '#0ff', '#0f0', '#ff0', '#f00']
}

// JSON 解析辅助函数
const parseJsonProp = (val: any, defaultVal: any = null) => {
    if (val === null || val === undefined) {
        return defaultVal
    }
    if (typeof val === 'string') {
        try {
            return JSON.parse(val)
        } catch {
            return defaultVal
        }
    }
    return val
}

// getPointMarkerSubProps - 获取数据点标记需要订阅的数据点
const getPointMarkerSubProps = (record: any, tableGisConfig: any, tableTags?: any[], defaultTableId?: string) => {
    const { lat, lon, direction, course, velocity, rideHeight } = tableGisConfig || {}
    const tableId = defaultTableId || record?._table || record?.tableId || record?.table
    // 基础的经纬度
    const baseTags = [
        { tableId, id: record.id, tagId: lat, type: 'lat' },
        { tableId, id: record.id, tagId: lon, type: 'lon' },
    ]
    // 表配置的额外数据点
    const optionalTags = [
        direction && { tableId, id: record.id, tagId: direction, type: 'direction' },
        velocity && { tableId, id: record.id, tagId: velocity, type: 'velocity' },
        rideHeight && { tableId, id: record.id, tagId: rideHeight, type: 'rideHeight' },
        course && { tableId, id: record.id, tagId: course, type: 'course' }
    ].filter(Boolean)
    // 图层选择额外订阅的数据
    const tableSelectTags = tableTags?.map((tagId: any) => {
        const hassub = [lat, lon, direction, course, velocity, rideHeight].indexOf(tagId) >= 0
        if (hassub) {
            return null
        } else {
            return { tableId, id: record.id, tagId }
        }
    }).filter(Boolean)
    return [...baseTags, ...optionalTags, ...(tableSelectTags || [])]
}

const GisTableLayer = React.forwardRef<HTMLDivElement, GisTableLayerProps>(
    (
        {
            className,
            table: tableProp,
            tableData: tableDataProp,
            tableFilters: tableFiltersProp,
            department: departmentProp,
            getQueryFilter: getQueryFilterProp,
            tableTags: tableTagsProp,
            coordinateType,
            layerBase,
            heatmap,
            cluster,
            display = true,
            map: mapProp,
            marker: markerProp,
            highlightMarker: highlightMarkerProp,
            markerScale: markerScaleProp,
            modalConfig: modalConfigProp,
            ...props
        },
        ref
    ) => {
        const contextMap = useMap()
        const map = mapProp || contextMap

        // WebSocket Hooks
        const { onData: onPointData, subscribe: subscribePoint } = useWS()
        const { onData: onRecordData, subscribe: subscribeRecord } = useWS()
        const { onData: onTableData, subscribe: subscribeTable } = useWS()

        // 订阅引用
        const wsRef = React.useRef<any>({})
        // 存储当前所有表的GIS配置
        const tableRecordsRef = React.useRef<any[]>([])
        // 当前层所有的表的gis配置,为ws推送的增删改数据提供更新方式
        const tableRef = React.useRef<any>({})
        // 缓存防抖期间内的数据
        const wsDataRef = React.useRef<any>({
            pendingUpdates: {},
            updaters: {}
        })
        // 坐标类型引用
        const coordinateTypeRef = React.useRef(coordinateType)
        React.useEffect(() => { coordinateTypeRef.current = coordinateType }, [coordinateType])
        // subDataPointAndRecord 引用
        const subDataPointAndRecordRef = React.useRef<any>(null)
        // ===== 数据解析和转换 =====
        // 解析 JSON 字符串参数
        const table = React.useMemo(() => parseJsonProp(tableProp, null), [tableProp])
        const tableData = React.useMemo(() => parseJsonProp(tableDataProp, []), [tableDataProp])
        const tableFilters = React.useMemo(() => parseJsonProp(tableFiltersProp, {}), [tableFiltersProp])
        const department = React.useMemo(() => parseJsonProp(departmentProp, null), [departmentProp])
        const getQueryFilter = React.useMemo(() => parseJsonProp(getQueryFilterProp, null), [getQueryFilterProp])
        const tableTags = React.useMemo(() => parseJsonProp(tableTagsProp, null), [tableTagsProp])
        const marker = React.useMemo(() => parseJsonProp(markerProp, {}), [markerProp])
        const highlightMarker = React.useMemo(() => parseJsonProp(highlightMarkerProp, {}), [highlightMarkerProp])
        const modalConfig = React.useMemo(() => parseJsonProp(modalConfigProp, []), [modalConfigProp])
        // tableTags 引用（需要在 tableTags 声明后）
        const tableTagsRef = React.useRef(tableTags)
        React.useEffect(() => { tableTagsRef.current = tableTags }, [tableTags])
        const markerScale = React.useMemo(() => parseJsonProp(markerScaleProp, null), [markerScaleProp])

        // 判断数据源类型 - 完全对应 record.js 的逻辑
        const hasRecord = tableData?.length > 0  // 有表记录
        const hasTable = !!table?.id  // 有指定表（注意：table 是单个对象，不是数组）

        // 图层引用
        const layerRef = React.useRef<any[]>([])
        const sourceRef = React.useRef<any>(null)
        const pointSourceRef = React.useRef<any>(null)

        // 标记样式配置缓存
        const markerScaleRef = React.useRef<any>(null)
        const highlightRef = React.useRef<any>(null)

        // Request tracker for cancelling stale requests
        const requestTracker = React.useRef<any>(null)

        // 弹窗配置引用
        const modalConfigRef = React.useRef<any>(null)

        // 更新弹窗配置缓存
        React.useEffect(() => {
            modalConfigRef.current = modalConfig
        }, [modalConfig])

        // 创建弹窗的回调函数
        const createRecordOverlay = React.useCallback(({ feature, record, modalConfig }: any) => {
            const {
                showType,
                offsetX,
                offsetY,
                positioning,
                multi = false,
                content = 'default',
                view,
                customCode
            } = modalConfig || {}

            const hidenCloseBtn = showType === 'alway'

            // 如果不是多弹窗模式，清除之前的弹窗
            if (!multi) {
                const overlays = map.getOverlays().getArray()
                overlays.forEach((oldOverlay: any) => {
                    map.removeOverlay(oldOverlay)
                })
            }

            const geometry = feature.getGeometry()
            const coordinate = getGeometryCenter(geometry)

            // 根据 content 类型选择不同的弹窗组件
            let PanelComponent: React.ComponentType<any>

            if (content === 'view') {
                // 画面弹窗 - 支持 view.code 或 viewCode
                const viewCode = view?.code || modalConfig?.viewCode
                PanelComponent = (props: any) => (
                    <ViewPanel
                        {...props}
                        data={record}
                        hidenCloseBtn={hidenCloseBtn}
                        viewId={view?.id}
                        viewConfig={view}
                        viewCode={viewCode}
                    />
                )
            } else if (content === 'custom') {
                // 自定义React代码弹窗
                PanelComponent = (props: any) => (
                    <CustomPanel
                        {...props}
                        data={record}
                        hidenCloseBtn={hidenCloseBtn}
                        customCode={customCode || ''}
                    />
                )
            } else {
                // 默认弹窗
                PanelComponent = (props: any) => (
                    <DefaultPanel
                        {...props}
                        data={record}
                        hidenCloseBtn={hidenCloseBtn}
                    />
                )
            }

            const popup = createOverLayer({
                map,
                coordinate,
                popupConfig: {
                    onClose: () => {
                        feature.un('change', onFeatureChange)
                    },
                    className: 'overlay',
                    id: `overlay-${record.table || record._table}-${record.id}`,
                    overlayConfig: {
                        positioning: positioning || 'top-center',
                        offset: [offsetX || 0, offsetY || 0]
                    }
                },
                APP: PanelComponent
            })

            const onFeatureChange = (evt: any) => {
                const geometry = evt.target.getGeometry()
                const coordinate = getGeometryCenter(geometry)
                popup?.setPosition(coordinate)
            }

            feature.on('change', onFeatureChange)
        }, [map])

        // Click Handler - 使用 OpenLayers Overlay
        React.useEffect(() => {
            if (!map) return

            const handleClick = (e: any) => {
                const pixel = map.getEventPixel(e.originalEvent)
                const feature = map.forEachFeatureAtPixel(pixel, (feature: any) => feature, {
                    hitTolerance: 5
                })

                if (feature) {
                    // Check if it's a cluster feature
                    const clusteredFeatures = feature.get('features')

                    if (clusteredFeatures) {
                        // It's a cluster
                        if (clusteredFeatures.length > 1) {
                            // Multiple features clustered
                            if (map.getView()) {
                                const extent = createEmpty()
                                clusteredFeatures.forEach((f: any) => extend(extent, f.getGeometry().getExtent()))

                                // Check if all points are at the same location
                                const firstCoords = clusteredFeatures[0].getGeometry().getCoordinates()
                                const isSameLocation = clusteredFeatures.every((f: any) => {
                                    const coords = f.getGeometry().getCoordinates()
                                    return coords[0] === firstCoords[0] && coords[1] === firstCoords[1]
                                })

                                if (isSameLocation) {
                                    map.getView().animate({
                                        center: firstCoords,
                                        zoom: map.getView().getZoom() + 1,
                                        duration: 500
                                    })
                                } else {
                                    map.getView().fit(extent, {
                                        duration: 500,
                                        padding: [50, 50, 50, 50]
                                    })
                                }
                            }
                            return // Stop here for clusters > 1
                        } else if (clusteredFeatures.length === 1) {
                            // Single feature in cluster
                            const originalFeature = clusteredFeatures[0]
                            const record = originalFeature.get('markerRecord')

                            if (!record) return

                            // Determine modal config
                            const configs = Array.isArray(modalConfigRef.current) ? modalConfigRef.current : [modalConfigRef.current]
                            const targetConfig = configs.find((c: any) => c?.showType === 'click') || configs[0]

                            if (targetConfig && targetConfig.showType === 'click') {
                                createRecordOverlay({ feature: originalFeature, record, modalConfig: targetConfig })
                            }
                            return
                        }
                    }

                    // Regular feature (not clustered or different layer type)
                    const record = feature.get('markerRecord')
                    if (!record) return

                    // Determine modal config
                    const configs = Array.isArray(modalConfigRef.current) ? modalConfigRef.current : [modalConfigRef.current]
                    const targetConfig = configs.find((c: any) => c?.showType === 'click') || configs[0]

                    if (targetConfig && targetConfig.showType === 'click') {
                        createRecordOverlay({ feature, record, modalConfig: targetConfig })
                    }
                }
            }

            map.on('singleclick', handleClick)

            return () => {
                map.un('singleclick', handleClick)
            }
        }, [map, createRecordOverlay])

        // 更新缓存标记配置
        React.useEffect(() => { markerScaleRef.current = markerScale }, [markerScale])
        React.useEffect(() => { highlightRef.current = highlightMarker }, [highlightMarker])

        // 样式函数 - 参考 record.js 的实现逻辑
        const styleFn = React.useCallback((feature: any) => {
            const markerRecord = feature.get('markerRecord')
            const tableGisConfig = feature.get('tableGisConfig')
            const selected = feature.get('selected')
            const markerTags = feature.get('markerTags')
            const markerType = feature.get('markerType') || 'Point'
            const markerInitStyle = feature.get('markerInitStyle')
            const markerLabel = feature.get('markerLabel')
            const visible = feature.get('visible')

            // 检查可见性
            if (isBoolean(visible) && visible === false) {
                return null
            }

            let zoomScale = null
            // 仅对点标记实施缩放
            if (markerScaleRef.current && markerType === 'Point') {
                const view = map?.getView()
                if (view) {
                    const zoom = view.getZoom() || 0
                    markerScaleRef.current.forEach((val: any) => {
                        if (zoom >= val?.from && zoom <= val?.to) {
                            zoomScale = val?.scale
                        }
                    })
                }
            }

            // 选中样式合并 - 与 record.js 保持一致
            const viewStyle = (selected ? merge(cloneDeep(marker), highlightRef.current) : marker) || {}
            const zIndex = selected ? 9 : 0
            const style = markerInitStyle ? merge({}, markerInitStyle, viewStyle) : viewStyle
            set(style, 'text.text', markerLabel)

            if (markerType === 'Point') {
                // 如果设置了图标脚本（最高优先级）
                if (viewStyle.iconScript && viewStyle.open) {
                    const result = parseIconScript({
                        iconScript: viewStyle.iconScript,
                        record: markerRecord,
                        tags: markerTags,
                        style: olStyle
                    })
                    // 如果脚本返回字符串，替换iconsrc；如果返回Style类，直接使用
                    if (result != null) {
                        if (isString(result)) {
                            set(style, 'icon.iconSrc', result)
                        } else if (isObject(result)) {
                            return result
                        }
                    }
                } else {
                    // 处理记录在线图标（第二优先级）
                    if (markerInitStyle?.onlineIcon && markerInitStyle.onlineIcon.length > 0) {
                        if (markerRecord?.online) {
                            set(style, 'icon.iconSrc', markerInitStyle.onlineIcon)
                        } else {
                            set(style, 'icon.iconSrc', markerInitStyle.iconUrl)
                        }
                    } else {
                        // 向后兼容：将旧的 marker.point.src 映射到 icon.iconSrc
                        // 只有在没有使用新格式 icon.iconSrc 时才进行转换
                        if (viewStyle.point?.src && !viewStyle.icon?.iconSrc) {
                            set(style, 'icon.iconSrc', viewStyle.point.src)
                        }
                    }
                }

                // 处理方向角度
                const directionField = tableGisConfig?.course
                const direction = directionField ? markerTags?.course : markerTags?.direction

                // 图标按 direction 数据点方向旋转
                set(style, 'icon.rotateWithView', true)
                if (isNumber(direction)) {
                    set(style, 'icon.rotation', direction * (Math.PI / 180))
                }
            }

            // style,应包含{ icon, line, polygon, circle, semicircle, text },具体数据结构参考map/schema下对应的文件
            const baseStyle = createStyleClass({ markerType, style, zIndex, zoomScale, fill: null, stroke: null })

            // 检查是否需要绘制序号（线、面类型）
            const styleKeyMap: Record<string, string> = {
                'LineString': 'line',
                'Polygon': 'polygon',
                'Circle': 'circle',
                'Semicircle': 'semicircle'
            }
            const styleKey = styleKeyMap[markerType]
            const enableNumber = styleKey && style?.[styleKey]?.snumber

            if (!enableNumber) {
                return baseStyle
            }

            return createNumberLabelStyles({
                geometry: feature.getGeometry(),
                baseStyle
            })
        }, [marker, map])

        // 聚合样式函数
        const styleClusterFn = React.useCallback((feature: any) => {
            const features = feature.get('features')
            const size = features?.length
            if (size == 1) {
                return styleFn(features[0])
            } else {
                return clusterStyle(cluster || {}, size)
            }
        }, [cluster, styleFn])

        // 清除 WebSocket 订阅
        const clearWs = React.useCallback((fns: any) => {
            if (fns) {
                Object.keys(fns).forEach((k) => {
                    const unwsFn = fns[k]
                    if (unwsFn && typeof unwsFn === 'function') unwsFn()
                })
            }
        }, [])

        // 订阅数据点和记录
        const subDataPointAndRecord = React.useCallback((data: any[], tableTags: any) => {
            if (wsRef.current) {
                clearWs(wsRef.current)
            }

            tableRecordsRef.current = data
            // 存储表配置映射
            tableRef.current = data.reduce((obj: any, item: any) => {
                obj[item.tableId] = item
                return obj
            }, {})

            // 数据点值
            let needSubDataPoint: any[] = []
            // 记录
            const needSubRecord: any[] = []
            // 表的添加和删除
            const needSubTable: any[] = []

            data?.forEach((item) => {
                needSubTable.push({ tableId: item.tableId, all: true, opsType: ['add', 'delete'] })
                if (item?.gis?.mapping === "dataPoint") {
                    item.record.forEach((r: any) => {
                        const tableId = r._table || r.tableId || item.tableId
                        const subtags = getPointMarkerSubProps(r, item.gis, tableTags, item.tableId)
                        needSubDataPoint = needSubDataPoint.concat(subtags)
                        needSubRecord.push({ tableId, id: r.id, opsType: ['edit'] })
                    })
                } else if (item?.gis?.mapping === "map" || item?.gis?.mapping === "noLimit") {
                    item.record.forEach((r: any) => {
                        const tableId = r._table || r.tableId || item.tableId
                        needSubRecord.push({ tableId, id: r.id, opsType: ['edit'] })
                    })
                }
            })

            if (needSubDataPoint.length > 0) {
                wsRef.current['point'] = subscribePoint('data', needSubDataPoint)
            }
            if (needSubRecord.length > 0) {
                wsRef.current['record'] = subscribeRecord('tabledata', needSubRecord)
            }
            if (needSubTable.length > 0) {
                wsRef.current['table'] = subscribeTable('tabledata', needSubTable)
            }
        }, [subscribePoint, subscribeRecord, subscribeTable, clearWs, tableTags])

        // 更新 ref
        React.useEffect(() => {
            subDataPointAndRecordRef.current = subDataPointAndRecord
        }, [subDataPointAndRecord])

        // WebSocket 数据处理 - 合并到一个 useEffect，使用空依赖数组，只注册一次
        React.useEffect(() => {
            const { pendingUpdates, updaters } = wsDataRef.current

            // 数据点类型 - 数据点类型标记点的位置修改
            onPointData((data: any) => {
                const source = sourceRef.current
                if (!source) return
                // 1. 检查数据有效性
                if (!data?.tableId || !data.id || !data.fields) return
                const table = tableRef.current[data.tableId]
                if (!table || !table.gis) return

                const gisConfig = table.gis
                const featureId = `${data.tableId}|${data.id}`

                // 2. 合并数据到缓存
                if (!pendingUpdates[featureId]) {
                    pendingUpdates[featureId] = { ...data }
                } else {
                    pendingUpdates[featureId] = {
                        ...pendingUpdates[featureId],
                        ...data,
                        fields: { ...pendingUpdates[featureId].fields, ...data.fields }
                    }
                }

                // 3. 执行防抖更新
                if (updaters[featureId]) {
                    updaters[featureId].cancel()
                }
                updaters[featureId] = debounce(() => {
                    try {
                        const mergedData = pendingUpdates[featureId]
                        if (!mergedData) return

                        const feature = source.getFeatureById(featureId)
                        if (!feature) return

                        const hasCoordsUpdate = gisConfig.lon in mergedData.fields && gisConfig.lat in mergedData.fields

                        if (hasCoordsUpdate) {
                            const geometry = feature.getGeometry()
                            const newLon = mergedData.fields[gisConfig.lon]
                            const newLat = mergedData.fields[gisConfig.lat]
                            if (geometry && typeof newLon === 'number' && typeof newLat === 'number') {
                                const transform = getTransformTo3857(coordinateTypeRef.current)
                                geometry.setCoordinates(transform([newLon, newLat]))
                            }
                        }

                        // 更新属性
                        const markerTags = feature.get('markerTags') || {}
                        Object.keys(mergedData.fields || {}).forEach(tagId => {
                            markerTags[tagId] = mergedData.fields[tagId]
                        })
                        feature.set('markerTags', { ...markerTags })
                        feature.changed()
                    } catch (error) {
                        console.error('更新要素时出错:', error)
                    } finally {
                        delete pendingUpdates[featureId]
                        delete updaters[featureId]
                    }
                }, DEBOUNCE_DELAY, { maxWait: 1000 })

                updaters[featureId]()
            })

            // 表记录类型 - 表字段类型的标记点位置修改
            onRecordData((data: any) => {
                const source = sourceRef.current
                if (!source) return
                if (data._opsDataType !== 'edit') return

                const tid = data._table || data.tableId
                const rid = data.id || data.tableDataId
                const table = tableRef.current[tid]
                if (!table || !table.gis) return

                const gisConfig = table.gis
                const featureId = `${tid}|${rid}`
                const mapping = gisConfig.mapping

                if (mapping === 'map') {
                    const field = gisConfig.map
                    const lng = data[field]?.lng
                    const lat = data[field]?.lat
                    if (typeof lng === 'number' && typeof lat === 'number') {
                        const feature = source.getFeatureById(featureId)
                        const geometry = feature?.getGeometry()
                        if (geometry) {
                            const transform = getTransformTo3857(coordinateTypeRef.current)
                            geometry.setCoordinates(transform([lng, lat]))
                        }
                    }
                } else if (mapping === 'dataPoint') {
                    // 记录修改属性只监听在线状态的变化
                    const feature = source.getFeatureById(featureId)
                    if (feature) {
                        const markerRecord = feature.get('markerRecord')
                        const isOnline = markerRecord?.online
                        if ('online' in data && isOnline !== data['online']) {
                            feature.set('markerRecord', {
                                ...markerRecord,
                                online: data['online']
                            })
                        }
                    }
                }
            })

            // 处理新增和删除
            onTableData((data: any) => {
                const source = sourceRef.current
                if (!source || !data?._opsDataType) return

                if (data._opsDataType === 'add') {
                    const current = cloneDeep(tableRef.current)
                    const tid = data?._table || data?.tableId || data?.table
                    if (!current[tid]) return

                    const normalized = {
                        ...data,
                        _table: tid,
                        tableId: tid,
                        id: data?.id || data?.tableDataId
                    }
                    current[tid].record.push(normalized)
                    tableRef.current = current
                    const subdata = Object.keys(current).map(k => current[k])
                    // 更新订阅数据
                    if (subDataPointAndRecordRef.current) {
                        subDataPointAndRecordRef.current(subdata, tableTagsRef.current)
                    }
                    // 创建新标记
                    const feature = createEmptyFeature(normalized)
                    source.addFeature(feature)
                } else if (data._opsDataType === 'delete') {
                    const tid = data._table || data.tableId
                    const rid = data.id || data.tableDataId
                    const featureId = `${tid}|${rid}`

                    if (data._deleteAll) {
                        const recordList = tableRef.current[tid]?.record || []
                        recordList.forEach((r: any) => {
                            const newid = `${tid}|${r.id}`
                            const feature = source.getFeatureById(newid)
                            if (feature) source.removeFeature(feature)
                        })
                    } else {
                        const feature = source.getFeatureById(featureId)
                        if (feature) source.removeFeature(feature)
                    }
                }
            })
        }, []) // 空依赖数组 - 只注册一次

        // 卸载时清除 WS
        React.useEffect(() => {
            return () => {
                clearWs(wsRef.current)
            }
        }, [clearWs])

        // 数据查询主逻辑 - 完全对应 record.js 的三种模式
        const loadData = React.useCallback(async () => {

            try {
                let result: any = null

                // 模式 1: queryRecordInit - 有表记录数据
                if (hasRecord) {

                    // 提取所有涉及的表ID
                    const tableIds = new Set<string>()
                    tableData.forEach((r: any) => {
                        // 支持多种格式：_table, tableId, table.id, table
                        const tid = r._table || r.tableId || r.table?.id || (typeof r.table === 'string' ? r.table : null)
                        if (tid) tableIds.add(tid)
                    })
                    const uniqueTableIds = Array.from(tableIds)

                    if (uniqueTableIds.length === 0) {
                        return { features: [], tableRecords: [] }
                    }

                    // 获取表配置
                    const tableList = await getGISTable(uniqueTableIds)
                    const tableMap = keyBy(tableList, 'id')

                    // 按表分组数据
                    const dataByTable: Record<string, any[]> = {}
                    tableData.forEach((r: any) => {
                        const tid = r._table || r.tableId || r.table?.id
                        if (tid && tableMap[tid]) {
                            if (!dataByTable[tid]) dataByTable[tid] = []
                            dataByTable[tid].push(r)
                        }
                    })

                    // 使用 getReord 逐个查询完整记录（与 record.js 一致）
                    let features: any[] = []
                    const tableRecordObj: Record<string, any> = {}

                    for (const r of tableData) {
                        const tableId = r._table || r.tableId || r.table?.id || (typeof r.table === 'string' ? r.table : null)

                        if (!tableId || !tableMap[tableId]) {
                            continue
                        }

                        if (!r.id) {
                            continue
                        }

                        // 重新查询完整记录
                        const record = await getReord(tableId, r.id)
                        const tableGisConfig = tableMap[tableId]?.gis

                        // 按表分组记录
                        if (tableRecordObj[tableId]) {
                            tableRecordObj[tableId].record.push(record)
                        } else {
                            tableRecordObj[tableId] = {
                                gis: tableGisConfig,
                                tableId,
                                record: [record]
                            }
                        }

                        // 生成 features
                        const recordFeatures = await generateTableMarker([record], tableGisConfig, coordinateType, tableTags, tableId)
                        features = features.concat(recordFeatures)
                    }

                    const tableRecords = Object.values(tableRecordObj)
                    result = { features, featureslist: [features], tableRecords }
                }
                // 模式 2: queryTableAndRecordInit - 有指定表（单个表对象）
                else if (hasTable) {

                    // 获取指定表的配置
                    const tableList = await getGISTable([table.id])

                    if (tableList.length === 0) {
                        return { features: [], tableRecords: [] }
                    }

                    const tableConfig = tableList[0]

                    if (!tableConfig.gis || isEmpty(tableConfig.gis)) {
                        return { features: [], tableRecords: [] }
                    }

                    let rfilter: any = {}

                    // 应用部门过滤
                    if (department && department.length > 0) {
                        const tableDepartmentFilter = await getTableDepartmentFilter([table.id], department)
                        const filter = omit(tableDepartmentFilter[table.id], 'NoDepart')
                        if (tableDepartmentFilter[table.id]?.NoDepart) {
                            // 该表不可访问
                            return { features: [], tableRecords: [] }
                        }
                        rfilter = filter
                    }

                    // 应用查询过滤器
                    if (tableFilters && !isEmpty(tableFilters)) {
                        const tableFilterObj = getQueryFilter ? getQueryFilter(tableFilters, tableConfig.schema) : tableFilters
                        rfilter = { ...rfilter, ...tableFilterObj }
                    }


                    // 查询记录
                    const tableRecord = await getTableRecord(tableConfig, rfilter)

                    if (!tableRecord || !tableRecord.record) {
                        return { features: [], tableRecords: [] }
                    }

                    // 生成 features
                    const features = await generateTableMarker(
                        tableRecord.record,
                        tableRecord.gis,
                        coordinateType,
                        tableTags,
                        tableRecord.tableId
                    )

                    result = {
                        features,
                        featureslist: [features],
                        tableRecords: [tableRecord]
                    }
                }
                // 模式 3: queryAllTableAndDataInit - 查询所有GIS表
                else {

                    // 获取所有GIS表
                    const tableList = await getGISTable()

                    // 过滤有效的GIS表
                    let tableListAvailable = tableList.filter((t: any) => {
                        const gis = t?.gis
                        const mapping = gis?.mapping
                        if (!mapping || t.id === "普通表地理信息") return false
                        const p1 = mapping === 'dataPoint' && gis.lat && gis.lon
                        const p2 = mapping === 'map' && gis.map
                        const p3 = mapping === 'noLimit'
                        return p1 || p2 || p3
                    })

                    if (tableListAvailable.length === 0) {
                        return { features: [], tableRecords: [] }
                    }

                    // 应用部门过滤
                    let departmentFilters: Record<string, any> = {}
                    if (department && department.length > 0) {
                        const tableids = tableListAvailable.map((t: any) => t.id)
                        departmentFilters = await getTableDepartmentFilter(tableids, department)

                        // 过滤掉 NoDepart 的表
                        tableListAvailable = tableListAvailable.filter((t: any) => {
                            return !departmentFilters[t.id]?.NoDepart
                        })
                    }

                    // 并发查询所有表的记录
                    const promiseFns: Promise<any>[] = []
                    tableListAvailable.forEach((t: any) => {
                        let filter = {}
                        if (department && department.length > 0 && departmentFilters[t.id]) {
                            filter = omit(departmentFilters[t.id], 'NoDepart')
                        }
                        promiseFns.push(getTableRecord(t, filter))
                    })

                    const tableRecords = await Promise.all(promiseFns)

                    // 生成 features
                    const featureslist: any[] = []
                    for (const element of tableRecords) {
                        const features = await generateTableMarker(
                            element.record,
                            element.gis,
                            coordinateType,
                            tableTags,
                            element.tableId
                        )
                        featureslist.push(features)
                    }

                    result = {
                        features: featureslist.flat(),
                        featureslist,
                        tableRecords
                    }
                }

                return result || { features: [], tableRecords: [] }

            } catch (e) {
                return { features: [], tableRecords: [] }
            }

        }, [hasRecord, hasTable, table, tableData, coordinateType, tableFilters, department, getQueryFilter, tableTags])

        // generateTableMarker - 生成表标记
        const generateTableMarker = async (
            recordList: any[],
            tableGisConfig: any,
            coordinateType?: string,
            tableTags?: any,
            tableId?: string
        ) => {

            const allFeatures: any[] = []
            const mapping = tableGisConfig?.mapping

            if (!mapping) {
                return allFeatures
            }

            if (mapping === 'dataPoint') {
                const subTags = recordList.flatMap((t: any) => getPointMarkerSubProps(t, tableGisConfig, tableTags, tableId))

                if (subTags.length > 0) {
                    const dataPoints = await getTableRecordDataPoint(subTags)
                    const dataMap = keyBy(dataPoints, (d: any) => `${d.id}`)

                    recordList.forEach((r: any) => {
                        const dpLat = dataMap[r.id]?.[tableGisConfig.lat]
                        const dpLon = dataMap[r.id]?.[tableGisConfig.lon]

                        if (typeof dpLat === 'number' && typeof dpLon === 'number') {
                            const f = createFeature({
                                type: 'Point',
                                record: r,
                                coordinate: [dpLon, dpLat],
                                style: tableGisConfig.Point,
                                coordinateType,
                                markerTags: dataMap[r.id],
                                tableGisConfig
                            })
                            allFeatures.push(f)
                        }
                    })
                }

            } else if (mapping === 'map') {
                const mapField = tableGisConfig.map
                recordList.forEach((r: any) => {
                    const loc = r[mapField]
                    if (loc && loc.lng && loc.lat) {
                        const f = createFeature({
                            type: 'Point',
                            record: r,
                            coordinate: [loc.lng, loc.lat],
                            style: tableGisConfig.Point,
                            coordinateType,
                            tableGisConfig
                        })
                        allFeatures.push(f)
                    }
                })
            } else if (mapping === 'noLimit') {
                recordList.forEach((r: any) => {
                    const gisSource = r._settings?.gis

                    if (gisSource?.location?.data) {
                        gisSource.location.data.forEach((d: any) => {
                            let mergedStyle = { ...tableGisConfig[d.type] }
                            if (gisSource.location.geometryStyle) {
                                mergedStyle = merge({}, mergedStyle, gisSource.location.geometryStyle)
                            }
                            if (d.style) {
                                mergedStyle = merge({}, mergedStyle, d.style)
                            }

                            const f = createFeature({
                                type: d.type,
                                record: r,
                                coordinate: d.coordinates,
                                style: mergedStyle,
                                coordinateType,
                                tableGisConfig
                            })

                            allFeatures.push(f)
                        })
                    } else {
                        const emptyFeature = createEmptyFeature(r)
                        allFeatures.push(emptyFeature)
                    }
                })
            }

            return allFeatures
        }

        // 防抖数据初始化
        const debouncedInit = React.useMemo(() => debounce(async () => {
            if (!map) return
            const source = sourceRef.current
            if (!source) return

            // 清除现有数据
            source.clear()

            const currentRequest = Symbol('currentRequest')
            requestTracker.current = currentRequest

            try {
                const result = await loadData()

                if (requestTracker.current === currentRequest) {
                    if (result?.features && result.features.length > 0) {
                        source.addFeatures(result.features)
                    }

                    if (result?.tableRecords) {
                        subDataPointAndRecord(result.tableRecords, tableTags)
                    }
                }
            } catch (error) {
                if (requestTracker.current === currentRequest) {
                }
            }

        }, DEBOUNCE_DELAY), [
            map,
            loadData,
            hasRecord,
            hasTable,
            table?.id,
            Array.isArray(department) ? department.map((d: any) => d?.id).join() : '',
            Array.isArray(tableData) ? tableData.map((d: any) => d?.id).join() : '',
            JSON.stringify(tableFilters)
        ])

        // 地图数据初始化
        React.useEffect(() => {
            debouncedInit()
            return () => {
                debouncedInit.cancel()
                requestTracker.current = null
            }
        }, [debouncedInit])

        // 初始化地图层
        React.useEffect(() => {
            if (!map) return

            const { opacity, zIndex, maxResolution, minResolution, maxZoom, minZoom } = layerBase || {}

            // 基础数据source
            const baseSource = new VectorSource({ features: [] })
            const nonPointSource = new VectorSource({ features: [] })
            const pointSource = new VectorSource({ features: [] })

            sourceRef.current = baseSource
            pointSourceRef.current = pointSource

            // baseSource添加feature时，自动分发到点/非点source
            baseSource.on('addfeature', (e: any) => {
                const targetFeature = e.feature
                const type = targetFeature.getGeometry()?.getType()
                if (type === 'Point') {
                    (pointSource as VectorSource).addFeature(targetFeature as Feature<Geometry>);
                } else {
                    (nonPointSource as VectorSource).addFeature(targetFeature as Feature<Geometry>);
                }

                // 如果配置了弹窗，且showType为alway时，创建弹窗
                const configs = Array.isArray(modalConfigRef.current) ? modalConfigRef.current : [modalConfigRef.current]
                const hasAlwayShow = configs.some((c: any) => c?.showType === 'alway')

                if (hasAlwayShow) {
                    const record = targetFeature.get('markerRecord')
                    const alwayConfig = configs.find((c: any) => c?.showType === 'alway')
                    if (alwayConfig && record) {
                        createRecordOverlay({ feature: targetFeature, record, modalConfig: alwayConfig })
                    }
                }
            })

            baseSource.on('removefeature', (e: any) => {
                const feature = e.feature
                const type = feature?.getGeometry()?.getType()
                if (type === 'Point') {
                    pointSource.removeFeature(feature)
                } else {
                    nonPointSource.removeFeature(feature)
                }
            })

            baseSource.on('clear', () => {
                nonPointSource.clear()
                pointSource.clear()
            })

            // 创建点图层
            const createPointsLayer = () => {
                const layerlist = []
                const layerconfig = {
                    opacity,
                    zIndex,
                    maxResolution,
                    minResolution,
                    maxZoom,
                    minZoom,
                }

                if (cluster?.show) {
                    const clusterSource = new Cluster({
                        distance: cluster.distance || 20,
                        minDistance: cluster.minDistance || 10,
                        source: pointSource
                    })
                    const clusterLayer = new VectorLayer({
                        source: clusterSource,
                        style: styleClusterFn,
                        properties: { layerType: 'cluster' },
                        ...layerconfig
                    })
                    clusterLayer.set('id', 'cluster_default')
                    layerlist.push(clusterLayer)
                }
                if (heatmap?.show) {
                    const heatmapLayer = new Heatmap({
                        source: pointSource,
                        blur: heatmap?.blur || 15,
                        radius: heatmap?.radius || 8,
                        gradient: createHeatmapGradient(heatmap?.gradient || []),
                        properties: { layerType: 'heatmap' },
                        zIndex: 888
                    })
                    heatmapLayer.set('id', 'heatmap_default')
                    layerlist.push(heatmapLayer)
                }
                if (!cluster?.show && !heatmap?.show) {
                    const layer = new VectorLayer({
                        source: pointSource,
                        style: styleFn,
                        properties: { layerType: 'default' },
                        ...layerconfig
                    })
                    layer.set('id', 'default')
                    layerlist.push(layer)
                }
                return layerlist.filter(Boolean)
            }

            const pointsLayerList = createPointsLayer()
            pointsLayerList.forEach((l: any) => map.addLayer(l))

            const nonPointLayer = new VectorLayer({
                source: nonPointSource,
                style: styleFn,
                properties: { layerType: 'base' },
                opacity,
                zIndex,
                maxResolution,
                minResolution,
                maxZoom,
                minZoom,
            })
            nonPointLayer.set('id', 'default')
            map.addLayer(nonPointLayer)
            layerRef.current = [nonPointLayer, ...pointsLayerList]

            return () => {
                // 清除所有overlay
                if (map) {
                    const overlays = map.getOverlays().getArray().slice()
                    overlays.forEach((overlay: any) => {
                        map.removeOverlay(overlay)
                        const element = overlay.getElement()
                        if (element && element.parentNode) {
                            element.parentNode.removeChild(element)
                        }
                    })
                }

                if (map && layerRef.current) {
                    layerRef.current.forEach((l: any) => {
                        try {
                            map.removeLayer(l)
                        } catch (e) {
                            console.warn('Remove layer failed', e)
                        }
                    })
                }
                // Ensure everything is cleared from map to avoid leaks
                if (map) {
                    const layersToRemove: any[] = []
                    map.getLayers().forEach((l: any) => {
                        const layerId = l.get('id')
                        if (layerId === 'default' || layerId === 'cluster_default' || layerId === 'heatmap_default') {
                            layersToRemove.push(l)
                        }
                    })
                    layersToRemove.forEach(l => map.removeLayer(l))
                }
            }
        }, [map?.ol_uid, createRecordOverlay])

        // Visibility
        React.useEffect(() => {
            if (!layerRef.current) return
            layerRef.current.forEach((l: any) => l.setVisible(display))
        }, [display])

        // 在挂载后修改配置项更新地图标记点 - 强制刷新样式
        React.useEffect(() => {
            if (layerRef.current.length > 0) {
                layerRef.current.forEach((l: any) => {
                    const isClusterLayer = l?.get('layerType') == 'cluster'
                    if (isClusterLayer) {
                        l.setStyle(styleClusterFn)
                    } else {
                        l.setStyle(styleFn)
                    }
                    // 强制刷新图层，确保样式更新生效
                    l.changed()
                })
            }
        }, [
            cluster?.text,
            cluster?.radius,
            cluster?.color,
            cluster?.font,
            cluster?.background,
            JSON.stringify(marker),
            styleFn,
            styleClusterFn
        ])

        // 聚合配置更新
        React.useEffect(() => {
            const clusterLayer = layerRef.current.find((l: any) => l?.get('layerType') == 'cluster')
            const clusterSource = clusterLayer?.getSource()
            if (clusterSource) {
                cluster?.distance && clusterSource.setDistance(cluster.distance || 20)
                cluster?.minDistance && clusterSource.setMinDistance(cluster.minDistance || 10)
            }
        }, [
            cluster?.distance,
            cluster?.minDistance,
        ])

        // 热力图配置更新
        React.useEffect(() => {
            const heatmapLayer = layerRef.current.find((l: any) => l?.get('layerType') == 'heatmap')
            if (heatmapLayer) {
                heatmap?.blur && heatmapLayer.setBlur(heatmap.blur)
                heatmap?.gradient && heatmapLayer.setGradient(createHeatmapGradient(heatmap.gradient))
                heatmap?.radius && heatmapLayer.setRadius(heatmap.radius)
            }
        }, [
            heatmap?.gradient,
            heatmap?.radius,
            heatmap?.blur
        ])

        // 热力图和聚合显示隐藏时更新layer
        React.useEffect(() => {
            if (!map) return
            let nonPointLayer: any
            layerRef.current?.forEach((layer: any) => {
                if (!layer) return
                const layerType = layer.get('layerType')
                if (layerType === 'base') { nonPointLayer = layer }
                if (layerType === 'heatmap' || layerType === 'cluster' || layerType === 'default' || layerType === 'table') {
                    map.removeLayer(layer)
                }
            })

            const { opacity, zIndex, maxResolution, minResolution, maxZoom, minZoom } = layerBase || {}
            const layerconfig = {
                opacity,
                zIndex,
                maxResolution,
                minResolution,
                maxZoom,
                minZoom,
            }

            const createPointsLayer = () => {
                const layerlist = []
                if (cluster?.show) {
                    const clusterSource = new Cluster({
                        distance: cluster.distance || 20,
                        minDistance: cluster.minDistance || 10,
                        source: pointSourceRef.current
                    })
                    const clusterLayer = new VectorLayer({
                        source: clusterSource,
                        style: styleClusterFn,
                        properties: { layerType: 'cluster' },
                        ...layerconfig
                    })
                    clusterLayer.set('id', 'cluster_default')
                    layerlist.push(clusterLayer)
                }
                if (heatmap?.show) {
                    const heatmapLayer = new Heatmap({
                        source: pointSourceRef.current,
                        blur: heatmap?.blur || 15,
                        radius: heatmap?.radius || 8,
                        gradient: createHeatmapGradient(heatmap?.gradient || []),
                        properties: { layerType: 'heatmap' },
                        zIndex: 888
                    })
                    heatmapLayer.set('id', 'heatmap_default')
                    layerlist.push(heatmapLayer)
                }
                if (!cluster?.show && !heatmap?.show) {
                    const layer = new VectorLayer({
                        source: pointSourceRef.current,
                        style: styleFn,
                        properties: { layerType: 'default' },
                        ...layerconfig
                    })
                    layer.set('id', 'default')
                    layerlist.push(layer)
                }
                return layerlist.filter(Boolean)
            }

            const pointsLayerList = createPointsLayer()
            pointsLayerList.forEach((l: any) => map.addLayer(l))

            // Rebuild layerRef carefully
            const newLayers = pointsLayerList
            if (nonPointLayer) {
                newLayers.unshift(nonPointLayer)
            }
            layerRef.current = newLayers
        }, [cluster?.show, heatmap?.show])

        const { selectConfig, ...restProps } = props

        return (
            <div
                ref={ref}
                className={cn("table-views", className)}
                style={{ display: 'none' }}
                {...restProps}
            />
        )
    }
)

GisTableLayer.displayName = "GisTableLayer"

export { GisTableLayer }
