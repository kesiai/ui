
import { TableViews } from '@/registry/blocks/gis/gis-table-layer/table-views'
import { MapContainer } from '../gis-map-core/map-container'
import { ComponentConfig } from '@/app/config/types'
import { defaultDrawStyleProps } from '../gis-custom-layer/config'

const exampleData = {
    table: { id: 'A', title: 'A' },
    tableData: []
}

const exampleMarker = {
    // 示例点样式
    point: {
        src: defaultDrawStyleProps.featureStyle.point.src,
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
    }
}

const exampleHighlightMarker = {
    point: {
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

const tableOptions = [
    { value: JSON.stringify({ id: '地理信息', title: '地理信息' }), label: '地理信息' },
    { value: JSON.stringify({ id: 'A', title: 'A' }), label: '表 A' },
]

const tableDataOptions = [
    { value: JSON.stringify([]), label: '空数据' },
    { value: JSON.stringify([{ id: '1', name: '点位1', _table: 'A' }]), label: '示例数据 (1条)' }
]

export const tableViewsPropsConfig = [

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
        type: 'text' as const,
        default: {},
        description: '默认标记样式(参考 custom-views 样式结构)'
    },
    {
        name: 'highlightMarker',
        label: '高亮标记样式',
        type: 'text' as const,
        default: {},
        description: '选中高亮样式'
    },
    {
        name: 'department',
        label: '部门过滤',
        type: 'text' as const,
        default: [],
        description: '部门ID列表'
    },
    {
        name: 'tableFilters',
        label: '数据过滤',
        type: 'text' as const,
        default: {},
        description: '查询过滤条件'
    },
    {
        name: 'modalConfig',
        label: '弹窗配置',
        type: 'text' as const,
        default: {},
        description: '点击弹窗配置'
    },
    {
        name: 'selectConfig',
        label: '选中配置',
        type: 'text' as const,
        default: {},
        description: '选中变量配置'
    },
    {
        name: 'display',
        label: '是否显示',
        type: 'boolean' as const,
        default: true
    },
    // Layer Base
    {
        name: 'opacity',
        label: '透明度',
        type: 'number' as const,
        default: 1,
        min: 0,
        max: 1,
        step: 0.1
    },
    {
        name: 'zIndex',
        label: '层级',
        type: 'number' as const,
        default: 10
    },
    {
        name: 'minZoom',
        label: '最小缩放',
        type: 'number' as const,
        default: 0
    },
    {
        name: 'maxZoom',
        label: '最大缩放',
        type: 'number' as const,
        default: 22
    },
    // Heatmap
    {
        name: 'showHeatmap',
        label: '开启热力图',
        type: 'boolean' as const,
        default: false
    },
    {
        name: 'heatmapRadius',
        label: '热力半径',
        type: 'number' as const,
        default: 8
    },
    {
        name: 'heatmapBlur',
        label: '热力模糊',
        type: 'number' as const,
        default: 15
    },
    // Cluster
    {
        name: 'showCluster',
        label: '开启聚合',
        type: 'boolean' as const,
        default: false
    },
    {
        name: 'clusterDistance',
        label: '聚合距离',
        type: 'number' as const,
        default: 20
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
    modalConfig: JSON.stringify({ showType: 'click', content: 'default' }),
    selectConfig: JSON.stringify({}),
    display: true,
    opacity: 1,
    zIndex: 10,
    minZoom: 0,
    maxZoom: 22,
    showHeatmap: false,
    heatmapRadius: 8,
    heatmapBlur: 15,
    showCluster: false,
    clusterDistance: 20
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
                    display={props.display}
                    layerBase={{
                        opacity: props.opacity,
                        zIndex: props.zIndex,
                        minZoom: props.minZoom,
                        maxZoom: props.maxZoom
                    }}
                    heatmap={{
                        show: props.showHeatmap,
                        radius: props.heatmapRadius,
                        blur: props.heatmapBlur
                    }}
                    cluster={{
                        show: props.showCluster,
                        distance: props.clusterDistance
                    }}
                    cellKey="preview"
                />
            </MapContainer>
        </div>
    )
}

const renderTableViewsCodePreview = (props: Record<string, any>) => {
    return `<TableViews
  table={${props.table}}
  coordinateType="${props.coordinateType}"
  marker={${props.marker}}
  highlightMarker={${props.highlightMarker}}
  department={${props.department}}
  tableFilters={${props.tableFilters}}
  modalConfig={${props.modalConfig}}
  selectConfig={${props.selectConfig}}
  display={${props.display}}
  layerBase={{
    opacity: ${props.opacity},
    zIndex: ${props.zIndex},
    minZoom: ${props.minZoom},
    maxZoom: ${props.maxZoom}
  }}
  heatmap={{
    show: ${props.showHeatmap},
    radius: ${props.heatmapRadius},
    blur: ${props.heatmapBlur}
  }}
  cluster={{
    show: ${props.showCluster},
    distance: ${props.clusterDistance}
  }}
  cellKey="your-cell-key"
/>`
}

export const tableViewsConfig: ComponentConfig = {
    id: 'table-views',
    name: '数据表层',
    propsConfig: tableViewsPropsConfig,
    defaultProps: tableViewsDefaultProps,
    renderPreview: renderTableViewsPreview,
    renderCodePreview: renderTableViewsCodePreview
}
