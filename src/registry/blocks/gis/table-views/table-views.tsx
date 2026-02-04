'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import VectorSource from 'ol/source/Vector'
import { Vector as VectorLayer, Heatmap } from 'ol/layer'
import Cluster from 'ol/source/Cluster'
// @ts-ignore
import { useMap } from '../map-container/map-container'
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
    parseIconScript
} from './utils'
import _ from 'lodash'
// @ts-ignore
import * as olStyle from 'ol/style'

// 默认标记图标（绿色图钉）
const DEFAULT_MARKER_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDI0IDM2Ij48cGF0aCBmaWxsPSIjNENBRjUwIiBkPSJNMTIgMEMxOC42MjcgMCAyNC41MzczIDI0IDEyIDI0UzAgMjAuMjc0IDAgMTJDMCA1LjM3MyA1LjM3MyAwIDEyIDB6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNyIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg=='

export interface TableViewsProps {
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
     * 单元格唯一标识
     */
    cellKey?: string
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
const getPointMarkerSubProps = (record: any, tableGisConfig: any, tableTags?: any[]) => {
    const { lat, lon, direction, course, velocity, rideHeight } = tableGisConfig || {}
    const tableId = record?._table || record?.tableId || record?.table
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

const TableViews = React.forwardRef<HTMLDivElement, TableViewsProps>(
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
            cellKey,
            map: mapProp,
            marker: markerProp,
            highlightMarker: highlightMarkerProp,
            markerScale: markerScaleProp,
            ...props
        },
        ref
    ) => {
        const contextMap = useMap()
        const map = mapProp || contextMap
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

        // 更新缓存标记配置
        React.useEffect(() => { markerScaleRef.current = markerScale }, [markerScale])
        React.useEffect(() => { highlightRef.current = highlightMarker }, [highlightMarker])

        // 样式函数
        const styleFn = React.useCallback((feature: any) => {
            const record = feature.get('record')
            const tableGisConfig = feature.get('tableGisConfig')
            const selected = feature.get('selected')
            const markerTags = feature.get('markerTags')
            const markerType = feature.get('markerType') || 'Point'  // 从 feature 获取，不是从配置
            const markerInitStyle = feature.get('markerInitStyle')
            const online = record?.online !== false

            // Merge marker configs
            let mergedMarker = { ...marker }
            if (tableGisConfig?.Point) {
                mergedMarker = _.merge({}, mergedMarker, { point: tableGisConfig.Point })
            }

            let mergedHighlight = { ...highlightMarker }
            const currentMarker = selected ? mergedHighlight : mergedMarker

            const iconScript = currentMarker?.point?.iconScript
            const visible = currentMarker?.point?.visible !== false

            if (!visible) return []

            // Determine icon source (使用默认图标)
            let src = markerInitStyle?.src || markerInitStyle?.icon || DEFAULT_MARKER_ICON

            // 图标脚本处理
            if (iconScript) {
                const parsedSrc = parseIconScript({
                    iconScript,
                    record,
                    tags: markerTags,
                    style: olStyle
                })
                if (parsedSrc) src = parsedSrc
            }
            // 在线/离线图标处理
            else if (markerInitStyle?.onlineIcon && markerInitStyle?.iconUrl) {
                src = online ? markerInitStyle.onlineIcon : markerInitStyle.iconUrl
            }

            // Apply scale
            let scale = markerInitStyle?.scale || 1
            if (markerScaleRef.current?.length) {
                const view = map?.getView()
                if (view) {
                    const zoom = view.getZoom() || 0
                    for (const s of markerScaleRef.current) {
                        if (s.minZoom <= zoom && zoom <= s.maxZoom) {
                            scale = s.scale
                            break
                        }
                    }
                }
            }

            // Rotation handling
            let rotation = 0
            if (markerTags) {
                const direction = markerTags.direction || markerTags.course
                if (typeof direction === 'number') {
                    rotation = direction * (Math.PI / 180)
                }
            }

            const styleConfig = {
                ...markerInitStyle,
                icon: {
                    ...markerInitStyle?.icon,
                    iconSrc: src,
                    scale,
                    rotation,
                    rotateWithView: !!rotation
                }
            }

            return createStyleClass({
                markerType,
                style: styleConfig,
                zIndex: selected ? 9 : 0,
                zoomScale: scale
            })
        }, [marker, highlightMarker, map])

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
                    const tableMap = _.keyBy(tableList, 'id')

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
                        const recordFeatures = await generateTableMarker([record], tableGisConfig, coordinateType, tableTags)
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

                    if (!tableConfig.gis || _.isEmpty(tableConfig.gis)) {
                        return { features: [], tableRecords: [] }
                    }

                    let rfilter: any = {}

                    // 应用部门过滤
                    if (department && department.length > 0) {
                        const tableDepartmentFilter = await getTableDepartmentFilter([table.id], department)
                        const filter = _.omit(tableDepartmentFilter[table.id], 'NoDepart')
                        if (tableDepartmentFilter[table.id]?.NoDepart) {
                            // 该表不可访问
                            return { features: [], tableRecords: [] }
                        }
                        rfilter = filter
                    }

                    // 应用查询过滤器
                    if (tableFilters && !_.isEmpty(tableFilters)) {
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
                        tableTags
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
                            filter = _.omit(departmentFilters[t.id], 'NoDepart')
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
                            tableTags
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
            tableTags?: any
        ) => {

            const allFeatures: any[] = []
            const mapping = tableGisConfig?.mapping

            if (!mapping) {
                return allFeatures
            }

            if (mapping === 'dataPoint') {
                const subTags = recordList.flatMap((t: any) => getPointMarkerSubProps(t, tableGisConfig, tableTags))

                if (subTags.length > 0) {
                    const dataPoints = await getTableRecordDataPoint(subTags)
                    const dataMap = _.keyBy(dataPoints, (d: any) => `${d.id}`)

                    recordList.forEach((r: any) => {
                        const dpLat = dataMap[r.id]?.[tableGisConfig.lat]
                        const dpLon = dataMap[r.id]?.[tableGisConfig.lon]

                        if (dpLat && dpLon) {
                            const f = createFeature({
                                type: 'Point',
                                record: r,
                                coordinate: [dpLon, dpLat],
                                style: tableGisConfig.Point,
                                coordinateType,
                                markerTags: dataMap[r.id],
                                cellKey,
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
                            cellKey,
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
                                mergedStyle = _.merge({}, mergedStyle, gisSource.location.geometryStyle)
                            }
                            if (d.style) {
                                mergedStyle = _.merge({}, mergedStyle, d.style)
                            }

                            const f = createFeature({
                                type: d.type,
                                record: r,
                                coordinate: d.coordinates,
                                style: mergedStyle,
                                coordinateType,
                                cellKey,
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
        const debouncedInit = React.useMemo(() => _.debounce(async () => {
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
                        result.features.forEach((f: any) => f.set('cellKey', cellKey))
                        source.addFeatures(result.features)
                    } else {
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

            // 注册 pointSource 到 map
            if (cellKey) {
                try {
                    map.set(`gisv2.record.pointSource:${cellKey}`, pointSource)
                } catch (e) {
                    console.error(e)
                }
            }

            // baseSource添加feature时，自动分发到点/非点source
            baseSource.on('addfeature', (e: any) => {
                const targetFeature = e.feature
                const type = targetFeature.getGeometry()?.getType()
                if (type === 'Point') {
                    pointSource.addFeature(targetFeature)
                } else {
                    nonPointSource.addFeature(targetFeature)
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
                        id: 'cluster_' + cellKey,
                        layerType: 'cluster',
                        style: styleClusterFn,
                        ...layerconfig
                    })
                    layerlist.push(clusterLayer)
                }
                if (heatmap?.show) {
                    const heatmapLayer = new Heatmap({
                        source: pointSource,
                        id: 'heatmap_' + cellKey,
                        layerType: 'heatmap',
                        blur: heatmap?.blur || 15,
                        radius: heatmap?.radius || 8,
                        gradient: createHeatmapGradient(heatmap?.gradient || []),
                        zIndex: 888
                    })
                    layerlist.push(heatmapLayer)
                }
                if (!cluster?.show && !heatmap?.show) {
                    const layer = new VectorLayer({
                        source: pointSource,
                        id: cellKey,
                        layerType: 'default',
                        style: styleFn,
                        properties: { layerType: 'table', cellKey },
                        ...layerconfig
                    })
                    layerlist.push(layer)
                }
                return layerlist.filter(Boolean)
            }

            const pointsLayerList = createPointsLayer()
            pointsLayerList.forEach((l: any) => map.addLayer(l))

            const nonPointLayer = new VectorLayer({
                source: nonPointSource,
                id: cellKey,
                style: styleFn,
                layerType: 'base',
                opacity,
                zIndex,
                maxResolution,
                minResolution,
                maxZoom,
                minZoom,
            })
            map.addLayer(nonPointLayer)
            layerRef.current = [nonPointLayer, ...pointsLayerList]

            return () => {
                if (cellKey && map.unset) {
                    try { map.unset(`gisv2.record.pointSource:${cellKey}`) } catch (e) { }
                }
                if (map && layerRef.current) {
                    layerRef.current.forEach((l: any) => {
                        map.removeLayer(l)
                    })
                }
            }
        }, [map?.ol_uid])

        // Visibility
        React.useEffect(() => {
            if (!layerRef.current) return
            layerRef.current.forEach((l: any) => l.setVisible(display))
        }, [display])

        // 在挂载后修改配置项更新地图标记点
        React.useEffect(() => {
            if (layerRef.current.length > 0) {
                layerRef.current.forEach((l: any) => {
                    const isClusterLayer = l?.get('layerType') == 'cluster'
                    if (isClusterLayer) {
                        l.setStyle(styleClusterFn)
                    } else {
                        l.setStyle(styleFn)
                    }
                })
            }
        }, [
            cluster?.text,
            cluster?.radius,
            cluster?.color,
            cluster?.font,
            cluster?.background,
            JSON.stringify(marker)
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
            let nonPointLayer
            layerRef.current?.forEach((layer: any) => {
                if (!layer) return
                const layerType = layer.get('layerType')
                if (!layerType) { nonPointLayer = layer }
                if (layerType == 'heatmap' || layerType == 'cluster' || layerType == 'default') {
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
                        id: 'cluster_' + cellKey,
                        layerType: 'cluster',
                        style: styleClusterFn,
                        ...layerconfig
                    })
                    layerlist.push(clusterLayer)
                }
                if (heatmap?.show) {
                    const heatmapLayer = new Heatmap({
                        source: pointSourceRef.current,
                        id: 'heatmap_' + cellKey,
                        layerType: 'heatmap',
                        blur: heatmap?.blur || 15,
                        radius: heatmap?.radius || 8,
                        gradient: createHeatmapGradient(heatmap?.gradient || []),
                        zIndex: 888
                    })
                    layerlist.push(heatmapLayer)
                }
                if (!cluster?.show && !heatmap?.show) {
                    const layer = new VectorLayer({
                        source: pointSourceRef.current,
                        id: cellKey,
                        layerType: 'default',
                        style: styleFn,
                        ...layerconfig
                    })
                    layerlist.push(layer)
                }
                return layerlist.filter(Boolean)
            }

            const pointsLayerList = createPointsLayer()
            pointsLayerList.forEach((l: any) => map.addLayer(l))
            layerRef.current = [nonPointLayer, ...pointsLayerList]
        }, [cluster?.show, heatmap?.show])

        const { modalConfig, selectConfig, ...restProps } = props

        return (
            <div
                ref={ref}
                className={cn("table-views", className)}
                style={{ display: 'none' }}
                data-cell-key={cellKey}
                {...restProps}
            />
        )
    }
)

TableViews.displayName = "TableViews"

export { TableViews }
