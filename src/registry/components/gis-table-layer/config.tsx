import { TableViews } from '@/registry/components/gis-table-layer/gis-table-layer'
import { MapContainer } from '../gis-map-core/gis-map-core'
import { ComponentConfig, PropConfig } from '@/app/config/types'
import { defaultDrawStyleProps } from '../gis-custom-layer/config'
import documentationMd from './gis-table-layer.md?raw'

const exampleData = {
    table: { id: '地理信息', title: '地理信息' },
    tableData: []
}

const exampleMarker = {
    // 示例图标样式（点标记）- 与 gisv2 项目对齐，使用 icon 而非 point
    icon: {
        iconSrc: defaultDrawStyleProps.featureStyle.point.src,
        scale: 1,
        anchor: [0.5, 0.5]
    },
    // 示例线样式
    line: {
        color: 'rgba(255, 0, 0, 0.8)',
        width: 3,
        snumber: true
    },
    // 示例面样式
    polygon: {
        color: 'rgba(0, 255, 0, 0.8)',
        width: 2,
        fillColor: 'rgba(0, 255, 0, 0.2)',
        snumber: true
    },
    // 示例圆样式
    circle: {
        color: 'rgba(0, 0, 255, 0.8)',
        width: 2,
        fillColor: 'rgba(0, 0, 255, 0.2)'
    },
    // 示例半圆样式
    semicircle: {
        color: 'rgba(255, 165, 0, 0.8)',
        width: 2,
        fillColor: 'rgba(255, 165, 0, 0.2)',
        isClose: true,
        startAngle: 0,
        endAngle: 180
    },
    // 示例文本样式
    text: {
        text: '',
        font: '12px Calibri,sans-serif',
        fill: 'rgba(0,0,0,1)',
        stroke: 'rgba(255,255,255,1)'
    }
}

const exampleHighlightMarker = {
    // 高亮图标样式 - 与 gisv2 项目对齐，使用 icon 而非 point
    icon: {
        scale: 1.2
    },
    line: {
        width: 5,
        color: 'rgba(255, 255, 0, 1)'
    },
    polygon: {
        fillColor: 'rgba(255, 255, 0, 0.4)'
    }
}

// 图层基础配置默认值（对应 baseLayerSchema.layerBase）
const defaultLayerBase = {
    opacity: 1,
    zIndex: 10,
    minZoom: 0,
    maxZoom: 22,
    maxResolution: undefined as number | undefined,
    minResolution: undefined as number | undefined
}

// 标记缩放配置默认值（对应 markerScale）
const defaultMarkerScale = [
    { from: 1, to: 5, scale: 0.8 },
    { from: 6, to: 10, scale: 1 },
    { from: 11, to: 18, scale: 1.2 }
]

// 热力图配置默认值（对应 heatmap）
const defaultHeatmap = {
    show: false,
    radius: 8,
    blur: 15,
    gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00']
}

// 聚合配置默认值（对应 cluster）
const defaultCluster = {
    show: false,
    distance: 20,
    minDistance: 10,
    radius: 30,
    text: '',
    font: 14,
    color: '#ffffff',
    background: 'rgba(0,0,0,0.6)'
}

const tableOptions = [
    { value: JSON.stringify({ id: '地理信息', title: '地理信息' }), label: '地理信息' },
    { value: JSON.stringify({ id: 'A', title: 'A' }), label: '表 A' },
]

const tableDataOptions = [
    { value: JSON.stringify([]), label: '空数据' },
    { value: JSON.stringify([{ id: '1', name: '点位1', _table: 'A' }]), label: '示例数据 (1条)' }
]

export const tableViewsPropsConfig: PropConfig[] = [

    {
        name: 'table',
        label: '数据表',
        type: 'select' as const,
        default: tableOptions[0].value,
        options: tableOptions,
        description: '选择数据表配置'
    },
    {
        name: 'tableData',
        label: '表记录',
        type: 'select' as const,
        default: tableDataOptions[0].value,
        options: tableDataOptions,
        description: '选择表记录数据'
    },
    {
        name: 'department',
        label: '部门过滤',
        type: 'json' as const,
        default: JSON.stringify([], null, 2),
        description: '部门过滤配置，对应原配置中的 department，JSON 数组，例如：[{"id":"dept-1"}]'
    },
    {
        name: 'tableFilters',
        label: '内置查询',
        type: 'json' as const,
        default: JSON.stringify({}, null, 2),
        description: '查询过滤条件，对应原配置中的 tableFilters，JSON 对象'
    },
    {
        name: 'coordinateType',
        label: '坐标系',
        type: 'select' as const,
        default: 'EPSG:4326',
        options: [
            { value: 'EPSG:4326', label: 'WGS84 (EPSG:4326)' },
            { value: 'EPSG:3857', label: 'Web Mercator (EPSG:3857)' },
            { value: 'GCJ02', label: 'GCJ02 (火星坐标)' },
            { value: 'BD09', label: 'BD09 (百度坐标)' }
        ]
    },
    {
        name: 'marker',
        label: '标记样式',
        type: 'json' as const,
        default: JSON.stringify(exampleMarker, null, 2),
        description: '标记样式配置，对应原配置中的 marker，JSON 结构示例见默认值'
    },
    {
        name: 'highlightMarker',
        label: '高亮标记样式',
        type: 'json' as const,
        default: JSON.stringify(exampleHighlightMarker, null, 2),
        description: '选中高亮样式配置，对应原配置中的 highlightMarker，JSON 结构示例见默认值'
    },
    {
        name: 'modalConfig',
        label: '弹窗配置',
        type: 'json' as const,
        default: JSON.stringify([{ showType: 'click', content: 'default' }], null, 2),
        description: '弹窗配置，对应原配置中的 modalConfig，JSON 数组/对象结构'
    },
    {
        name: 'selectConfig',
        label: '选中配置',
        type: 'json' as const,
        default: JSON.stringify({}, null, 2),
        description: '选中设置，对应原配置中的 selectConfig，JSON 对象'
    },
    {
        name: 'markerScale',
        label: '标记缩放配置 (markerScale)',
        type: 'json' as const,
        default: JSON.stringify(defaultMarkerScale, null, 2),
        description: '标记缩放数组，对应原配置中的 markerScale，JSON 数组：[{from,to,scale}]'
    },
    {
        name: 'tableTags',
        label: '表数据点 (tableTags)',
        type: 'json' as const,
        default: JSON.stringify([], null, 2),
        description: '表数据点数组，对应原配置中的 tableTags，JSON 数组'
    },
    {
        name: 'display',
        label: '是否显示',
        type: 'boolean' as const,
        default: true
    },
    // Layer Base（整体 JSON）
    {
        name: 'layerBase',
        label: '图层配置 (layerBase)',
        type: 'json' as const,
        default: JSON.stringify(defaultLayerBase, null, 2),
        description: '图层基础配置，对应 baseLayerSchema.layerBase，JSON 对象'
    },
    // Heatmap（整体 JSON）
    {
        name: 'heatmap',
        label: '热力图配置 (heatmap)',
        type: 'json' as const,
        default: JSON.stringify(defaultHeatmap, null, 2),
        description: '热力图配置，对应原配置中的 heatmap，JSON 对象'
    },
    // Cluster（整体 JSON）
    {
        name: 'cluster',
        label: '聚合配置 (cluster)',
        type: 'json' as const,
        default: JSON.stringify(defaultCluster, null, 2),
        description: '聚合配置，对应原配置中的 cluster，JSON 对象'
    }
]

export const tableViewsDefaultProps = {
    table: JSON.stringify(exampleData.table),
    tableData: JSON.stringify(exampleData.tableData),
    coordinateType: 'EPSG:4326',
    marker: JSON.stringify(exampleMarker),
    highlightMarker: JSON.stringify(exampleHighlightMarker),
    department: JSON.stringify([]),
    tableFilters: JSON.stringify({}),
    modalConfig: JSON.stringify([{ showType: 'click', content: 'default' }]),
    selectConfig: JSON.stringify({}),
    markerScale: JSON.stringify(defaultMarkerScale),
    tableTags: JSON.stringify([]),
    display: true,
    layerBase: defaultLayerBase,
    heatmap: defaultHeatmap,
    cluster: defaultCluster
}

const renderTableViewsPreview = (props: Record<string, any>) => {
    // 解析 JSON 属性，提供默认空值防止解析失败
    const parseJson = (val: any, defaultVal: any) => {
        if (typeof val === 'string') {
            try {
                return JSON.parse(val)
            } catch {
                return defaultVal
            }
        }
        return val || defaultVal
    }

    const table = parseJson(props.table, {})
    const tableData = parseJson(props.tableData, [])
    const marker = parseJson(props.marker, {})
    const highlightMarker = parseJson(props.highlightMarker, {})
    const department = parseJson(props.department, [])
    const tableFilters = parseJson(props.tableFilters, {})
    const modalConfig = parseJson(props.modalConfig, {})
    const selectConfig = parseJson(props.selectConfig, {})
    const markerScale = parseJson(props.markerScale, defaultMarkerScale)
    const tableTags = parseJson(props.tableTags, [])
    const layerBase = parseJson(props.layerBase, defaultLayerBase)
    const heatmap = parseJson(props.heatmap, defaultHeatmap)
    const cluster = parseJson(props.cluster, defaultCluster)

    return (
        <div className="w-full h-[400px] border border-gray-200 rounded overflow-hidden relative">
            <MapContainer>
                <TableViews
                    table={table}
                    tableData={tableData}
                    coordinateType={props.coordinateType}
                    marker={marker}
                    highlightMarker={highlightMarker}
                    department={department}
                    tableFilters={tableFilters}
                    modalConfig={modalConfig}
                    selectConfig={selectConfig}
                    markerScale={markerScale}
                    tableTags={tableTags}
                    display={props.display}
                    layerBase={layerBase}
                    heatmap={heatmap}
                    cluster={cluster}
                    cellKey="preview"
                />
            </MapContainer>
        </div>
    )
}

const renderTableViewsCodePreview = (props: Record<string, any>) => {
    const parseJson = (val: any, defaultVal: any) => {
        if (typeof val === 'string') {
            try {
                return JSON.parse(val)
            } catch {
                return defaultVal
            }
        }
        return val || defaultVal
    }

    const layerBase = parseJson(props.layerBase, defaultLayerBase)
    const heatmap = parseJson(props.heatmap, defaultHeatmap)
    const cluster = parseJson(props.cluster, defaultCluster)
    const markerScale = parseJson(props.markerScale, defaultMarkerScale)
    const tableTags = parseJson(props.tableTags, [])

    return `<TableViews
  table={${props.table}}
  coordinateType="${props.coordinateType}"
  marker={${props.marker}}
  highlightMarker={${props.highlightMarker}}
  department={${props.department}}
  tableFilters={${props.tableFilters}}
  modalConfig={${props.modalConfig}}
  selectConfig={${props.selectConfig}}
  markerScale={${JSON.stringify(markerScale)}}
  tableTags={${JSON.stringify(tableTags)}}
  display={${props.display}}
  layerBase={${JSON.stringify(layerBase)}}
  heatmap={${JSON.stringify(heatmap)}}
  cluster={${JSON.stringify(cluster)}}
  cellKey="your-cell-key"
/>`
}

export const tableViewsConfig: ComponentConfig = {
    id: 'gis-table-layer',
    name: '数据表层',
    propsConfig: tableViewsPropsConfig,
    defaultProps: tableViewsDefaultProps,
    renderPreview: renderTableViewsPreview,
    renderCodePreview: renderTableViewsCodePreview,
    documentation: documentationMd
}
