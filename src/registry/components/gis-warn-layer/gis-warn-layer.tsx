'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import _ from 'lodash'
// @ts-ignore
import VectorSource from 'ol/source/Vector'
// @ts-ignore
import { Vector as VectorLayer } from 'ol/layer'
// @ts-ignore
import { getVectorContext } from 'ol/render'
// @ts-ignore
import { unByKey } from 'ol/Observable'
// @ts-ignore
import * as style from 'ol/style'
// @ts-ignore
import * as geom from 'ol/geom'
import { useMap } from '../gis-map-core/gis-map-core'
import { createAPI, useWS } from '@airiot/client'

/**
 * 获取地图上所有数据表层的 pointSource
 * 数据表层会将 pointSource 注册到 map 上，key 格式为 gisv2.record.pointSource:${cellKey}
 */
const getAllPointSources = (map: any) => {
    if (!map) return []
    const sources: any[] = []
    const properties = map.getProperties() || {}
    Object.keys(properties).forEach(key => {
        if (key.startsWith('gisv2.record.pointSource:')) {
            const pointSource = properties[key]
            if (pointSource) {
                sources.push(pointSource)
            }
        }
    })
    return sources
}

/**
 * 从所有 pointSource 中根据 tableId 和 tableDataId 查找 feature 并获取实时坐标
 */
const getFeatureCoordinate = (sources: any[], tableId: string, tableDataId: string) => {
    const featureId = `${tableId}|${tableDataId}`
    for (const pointSource of sources) {
        const feature = pointSource.getFeatureById(featureId)
        if (feature) {
            const geometry = feature.getGeometry()
            if (geometry && geometry.getType() === 'Point') {
                return geometry.getCoordinates()
            }
        }
    }
    return null
}

// 辅助函数：判断是否在指定层级范围内
const isInRange = (zoom: number, overmax?: number, overmin?: number) => {
    if (overmax !== undefined && zoom >= overmax) return true
    if (overmin !== undefined && zoom <= overmin) return true
    return false
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

export interface WarnViewsProps {
    /**
     * 数据表过滤
     */
    table?: any
    /**
     * 表记录过滤
     */
    tableData?: any
    /**
     * 部门过滤
     */
    department?: any
    /**
     * 数据类型：true 表示初始查询历史报警
     */
    dataType?: boolean
    /**
     * 报警类别
     */
    type?: string
    /**
     * 报警级别
     */
    level?: string
    /**
     * 动画持续时间（速度）
     */
    duration?: number
    /**
     * 闪烁半径
     */
    radius?: number
    /**
     * 背景颜色
     */
    background?: string
    /**
     * 层级隐藏配置
     */
    overrunHide?: {
        overmax?: number
        overmin?: number
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
     * 地图实例（由父组件传入）
     */
    map?: any
}

const WarnViews = React.forwardRef<HTMLDivElement, WarnViewsProps>(
    (
        {
            className,
            table: tableProp,
            tableData: tableDataProp,
            department: departmentProp,
            dataType = false,
            type,
            level,
            duration = 0.4,
            radius: radiusValue = 20,
            background = 'rgba(255, 0, 0, 0.5)',
            overrunHide,
            display = true,
            cellKey = 'warn-layer',
            map: mapProp,
            ...props
        },
        ref
    ) => {
        const contextMap = useMap()
        const map = mapProp || contextMap

        // 解析 JSON 参数
        const table = React.useMemo(() => parseJsonProp(tableProp, []), [tableProp])
        const tableData = React.useMemo(() => parseJsonProp(tableDataProp, []), [tableDataProp])
        const department = React.useMemo(() => parseJsonProp(departmentProp, []), [departmentProp])

        // 存储当前报警数据 { [warningId]: { tableId, tableDataId, ... } }
        // 注意：不再缓存 coordinate，而是在动画渲染时实时获取
        const warningMapRef = useRef<Map<string, any>>(new Map())
        // 存储动画图层
        const layerRef = useRef<any>(null)
        // 存储动画事件监听器
        const animateListenerRef = useRef<any>(null)
        // 动画半径
        const radiusRef = useRef(0)
        // 标记点位数据是否已加载
        const [pointSourcesReady, setPointSourcesReady] = useState(false)

        // 实时从地图获取所有 pointSource 中的坐标
        const getCoordinateByRecord = useCallback(
            (tableId: string, tableDataId: string) => {
                if (!map) return null
                const sources = getAllPointSources(map)
                return getFeatureCoordinate(sources, tableId, tableDataId)
            },
            [map]
        )

        // 检查地图上是否存在指定的 feature
        const hasFeatureOnMap = useCallback(
            (tableId: string, tableDataId: string) => {
                return getCoordinateByRecord(tableId, tableDataId) !== null
            },
            [getCoordinateByRecord]
        )

        // 过滤报警数据
        const filterWarning = useCallback(
            (warning: any) => {
                // 过滤数据表
                if (table?.length > 0) {
                    const tableIds = table.map((t: any) => t.id)
                    if (!tableIds.includes(warning.tableId)) {
                        return false
                    }
                }
                // 过滤表记录
                if (tableData?.length > 0) {
                    const recordIds = tableData.map((r: any) => r.id)
                    if (!recordIds.includes(warning.tableDataId)) {
                        return false
                    }
                }
                // 过滤部门
                if (department?.length > 0) {
                    const deptIds = department.map((d: any) => d.id)
                    const warningDepts = warning.department || []
                    const hasDept = warningDepts.some((wd: any) => deptIds.includes(wd.id))
                    if (!hasDept && warningDepts.length > 0) {
                        return false
                    }
                }
                // 过滤报警类别
                if (type && warning.type !== type) {
                    return false
                }
                // 过滤报警级别
                if (level && warning.level !== level) {
                    return false
                }
                return true
            },
            [table, tableData, department, type, level]
        )

        // 查询历史报警数据
        const fetchHistoryWarnings = useCallback(async () => {
            const query: any = {
                sort: { time: -1 }, skip: 0, limit: 100,
                filter: {
                    status: '未确认',
                    recoveryTime: { '$exists': false }
                },
                project: {
                    status: 1,
                    processed: 1,
                    id: 1,
                    time: 1,
                    table: 1,
                    tableData: 1,
                    department: 1,
                    level: 1,
                    type: 1,
                    tableId: 1,
                    tableDataId: 1
                }
            }

            // 添加过滤条件
            if (level) {
                query.filter.level = level
            }
            if (type) {
                query.filter.type = type
            }
            if (table?.length > 0) {
                query.filter.tableId = { $in: table.map((t: any) => t.id) }
            }
            if (tableData?.length > 0) {
                query.filter.tableDataId = { $in: tableData.map((r: any) => r.id) }
            }

            try {
                const api = createAPI({ resource: 'warning/warning' })
                const queryStr = encodeURIComponent(JSON.stringify(query))
                const { json } = await api.fetch('?query=' + queryStr)
                return json || []
            } catch (error) {
                console.error('查询历史报警失败:', error)
                return []
            }
        }, [level, type, table, tableData])

        // 添加报警到地图（只存储报警信息，不缓存坐标）
        const addWarningToMap = useCallback(
            (warning: any) => {
                const { id, tableId, tableDataId } = warning
                // 检查地图上是否存在对应的 feature
                if (!hasFeatureOnMap(tableId, tableDataId)) {
                    return false
                }

                warningMapRef.current.set(id, {
                    ...warning
                })
                return true
            },
            [hasFeatureOnMap]
        )

        // 从地图移除报警
        const removeWarningFromMap = useCallback((warningId: string) => {
            warningMapRef.current.delete(warningId)
        }, [])

        // 创建闪烁动画 - 实时从地图 feature 获取坐标
        const createFlashAnimation = useCallback(
            (event: any) => {
                if (warningMapRef.current.size === 0) return

                const maxRadius = radiusValue || 20
                const speed = duration || 0.4

                if (radiusRef.current >= maxRadius) {
                    radiusRef.current = 0
                }

                const vectorContext = getVectorContext(event)
                const pointStyle = new style.Style({
                    image: new style.Circle({
                        radius: radiusRef.current,
                        fill: new style.Fill({
                            color: background || 'rgba(255, 0, 0, 0.5)'
                        }),
                        stroke: new style.Stroke({
                            color: background || 'rgba(255, 0, 0, 0.5)',
                            width: 0
                        })
                    })
                })

                vectorContext.setStyle(pointStyle)

                // 绘制所有报警点 - 实时获取坐标，确保与地图 marker 位置同步
                warningMapRef.current.forEach((warning) => {
                    const coordinate = getCoordinateByRecord(warning.tableId, warning.tableDataId)
                    if (coordinate) {
                        const point = new geom.Point(coordinate)
                        vectorContext.drawGeometry(point)
                    }
                })

                radiusRef.current += speed
                map.render()
            },
            [map, radiusValue, duration, background, getCoordinateByRecord]
        )

        // 更新图层可见性（根据层级隐藏配置）
        const updateLayerVisibility = useCallback(
            (zoom: number) => {
                if (!overrunHide || !layerRef.current) return
                const { overmax, overmin } = overrunHide
                const inRange = isInRange(zoom, overmax, overmin)
                layerRef.current.setVisible(!inRange)
            },
            [overrunHide]
        )

        // 初始化图层
        useEffect(() => {
            if (!map) return

            const warnSource = new VectorSource({ wrapX: false })
            const warnLayer = new VectorLayer({
                source: warnSource,
                id: `${cellKey}_warning_layer`,
                zIndex: 888,
                style: () =>
                    new style.Style({
                        image: new style.Circle({
                            radius: 1,
                            fill: new style.Fill({ color: 'transparent' })
                        })
                    })
            } as any)

            map.addLayer(warnLayer)
            layerRef.current = warnLayer

            // 添加动画监听
            animateListenerRef.current = warnLayer.on('postrender', createFlashAnimation)

            // 初始化层级隐藏
            updateLayerVisibility(map.getView().getZoom())

            // 监听地图缩放
            const zoomListener = map.getView().on('change:resolution', () => {
                updateLayerVisibility(map.getView().getZoom())
            })

            return () => {
                if (animateListenerRef.current) {
                    unByKey(animateListenerRef.current)
                }
                if (zoomListener) {
                    unByKey(zoomListener)
                }
                if (map && layerRef.current) {
                    map.removeLayer(layerRef.current)
                }
                warningMapRef.current.clear()
            }
        }, [map, cellKey, createFlashAnimation, updateLayerVisibility])

        // 更新动画监听器（当动画参数变化时）
        useEffect(() => {
            if (!layerRef.current || !map) return

            if (animateListenerRef.current) {
                unByKey(animateListenerRef.current)
            }
            animateListenerRef.current = layerRef.current.on('postrender', createFlashAnimation)
            map.render()
        }, [createFlashAnimation, map])

        // 监听地图上 pointSource 的变化，检测数据表层中的 feature 是否加载完成
        useEffect(() => {
            if (!map) return

            const sourceListeners: any[] = []

            const checkPointSourcesHasFeatures = () => {
                const sources = getAllPointSources(map)
                // 检查是否有 source 且至少有一个 source 中有 feature
                const hasFeatures = sources.some((s: any) => s.getFeatures().length > 0)
                if (hasFeatures) {
                    setPointSourcesReady(true)
                    return true
                }
                return false
            }

            // 初始检查
            if (checkPointSourcesHasFeatures()) {
                return
            }

            // 监听所有 pointSource 的 addfeature 事件
            const setupListeners = () => {
                const sources = getAllPointSources(map)
                sources.forEach((pointSource: any) => {
                    const listener = pointSource.on('addfeature', () => {
                        if (checkPointSourcesHasFeatures()) {
                            // 移除所有监听器
                            sourceListeners.forEach((l: any) => unByKey(l))
                            sourceListeners.length = 0
                        }
                    })
                    sourceListeners.push(listener)
                })
            }

            // 定时检查 pointSource 是否已注册，并设置监听器
            const timer = setInterval(() => {
                const sources = getAllPointSources(map)
                if (sources.length > 0 && sourceListeners.length === 0) {
                    setupListeners()
                    // 再次检查，因为可能在设置监听器之前已经有 feature 了
                    if (checkPointSourcesHasFeatures()) {
                        clearInterval(timer)
                    }
                }
            }, 200)

            return () => {
                clearInterval(timer)
                sourceListeners.forEach((l: any) => unByKey(l))
            }
        }, [map])

        // 初始化：查询历史报警（如果 dataType 为 true）
        useEffect(() => {

            if (!map || !dataType || !pointSourcesReady) return

            const shouldShow = display

            if (!shouldShow) {
                warningMapRef.current.clear()
                map.render()
                return
            }
 
            fetchHistoryWarnings().then((warnings) => {
                warningMapRef.current.clear()

                warnings.forEach((warning: any) => {
                    const normalizedWarning = {
                        ...warning,
                        tableId: warning.tableId || warning.table?.id,
                        tableDataId: warning.tableDataId || warning.tableData?.id
                    }

                    if (filterWarning(normalizedWarning)) {
                        addWarningToMap(normalizedWarning)
                    }
                })

                map.render()
            })
        }, [map, dataType, pointSourcesReady, display, fetchHistoryWarnings, filterWarning, addWarningToMap])

        // 显示/隐藏控制
        useEffect(() => {
            if (!map) return

            const shouldShow = display

            if (!shouldShow) {
                warningMapRef.current.clear()
                map.render()
            }
        }, [map, display])

        // WebSocket 订阅报警推送
        const { subscribe, onData } = useWS()

        // 订阅报警
        useEffect(() => {
            if (!map) return

            // 构建订阅参数
            const tableDataSetting: any[] = []

            if (tableData?.length > 0) {
                // 按表分组
                const tableGroups: Record<string, any[]> = {}
                tableData.forEach((item: any) => {
                    const tableId = item._table || item.table?.id
                    if (!tableGroups[tableId]) {
                        tableGroups[tableId] = []
                    }
                    tableGroups[tableId].push({ id: item.id })
                })
                Object.keys(tableGroups).forEach(tableId => {
                    tableDataSetting.push({
                        table: { id: tableId },
                        selectRecord: tableGroups[tableId]
                    })
                })
            } else if (table?.length > 0) {
                table.forEach((t: any) => {
                    tableDataSetting.push({
                        table: { id: t.id },
                        selectRecord: []
                    })
                })
            }

            const wsParams: any = {}

            if (tableDataSetting.length > 0) {
                wsParams.tableDataSetting = tableDataSetting
            }

            // 订阅报警推送
            const unsubscribe = subscribe('warning', wsParams)

            return () => {
                if (unsubscribe && _.isFunction(unsubscribe)) {
                    unsubscribe()
                }
            }
        }, [map, table, tableData, subscribe])

        // 处理报警推送数据
        useEffect(() => {
            const handleWarningData = (data: any) => {
                if (!data || !_.isPlainObject(data)) return

                const { id, recoveryTime, status, processed } = data

                if (!display) {
                    warningMapRef.current.clear()
                    map?.render()
                    return
                }

                // 报警恢复或已确认/已处理，移除动画
                if (recoveryTime || status === '已确认' || processed === '已处理') {
                    removeWarningFromMap(id)
                    map?.render()
                    return
                }

                // 过滤报警
                if (!filterWarning(data)) {
                    return
                }

                // 添加新报警
                addWarningToMap(data)
                map?.render()
            }

            onData(handleWarningData)
        }, [map, display, filterWarning, addWarningToMap, removeWarningFromMap, onData])

        return (
            <div
                ref={ref}
                className={cn('warn-views-layer', className)}
                style={{ display: 'none' }}
                data-cell-key={cellKey}
                {...props}
            />
        )
    }
)

WarnViews.displayName = 'WarnViews'

export { WarnViews }
