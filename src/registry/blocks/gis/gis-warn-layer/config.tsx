
import { WarnViews } from '@/registry/blocks/gis/gis-warn-layer/warn-views'
import { TableViews } from '../gis-table-layer/table-views'
import { MapContainer } from '../gis-map-core/map-container'
import { ComponentConfig } from '@/app/config/types'

// 默认配置
const defaultWarnViewsProps = {
    table: [],
    tableData: [],
    department: [],
    dataType: true,
    type: '',
    level: '',
    duration: 0.4,
    radius: 20,
    background: 'rgba(255, 0, 0, 0.5)',
    overrunHide: undefined,
    display: true
}

export const warnViewsPropsConfig = [
    {
        name: 'table',
        label: '数据表',
        type: 'text' as const,
        default: JSON.stringify([]),
        description: '过滤报警的数据表，格式: [{id: "表ID", title: "表名"}]'
    },
    {
        name: 'tableData',
        label: '表记录',
        type: 'text' as const,
        default: JSON.stringify([]),
        description: '过滤报警的表记录，格式: [{id: "记录ID", _table: "表ID"}]'
    },
    {
        name: 'department',
        label: '部门',
        type: 'text' as const,
        default: JSON.stringify([]),
        description: '过滤报警的部门，格式: [{id: "部门ID"}]'
    },
    {
        name: 'type',
        label: '报警类别',
        type: 'text' as const,
        default: '',
        description: '过滤报警类别'
    },
    {
        name: 'level',
        label: '报警级别',
        type: 'select' as const,
        default: '',
        options: [
            { value: '', label: '全部' },
            { value: '低', label: '低' },
            { value: '中', label: '中' },
            { value: '高', label: '高' }
        ],
        description: '过滤报警级别'
    },
    {
        name: 'dataType',
        label: '初始显示历史数据',
        type: 'boolean' as const,
        default: false,
        description: '勾选后，初始打开地图会将满足条件的数据中，未处理的报警查询回来并显示'
    },
    {
        name: 'background',
        label: '颜色',
        type: 'text' as const,
        default: 'rgba(255, 0, 0, 0.5)',
        description: '闪烁动画颜色'
    },
    {
        name: 'duration',
        label: '动画速度',
        type: 'number' as const,
        default: 0.4,
        min: 0.1,
        max: 2,
        step: 0.1,
        description: '闪烁动画速度（数值越大越快）'
    },
    {
        name: 'radius',
        label: '闪烁半径',
        type: 'number' as const,
        default: 20,
        min: 10,
        max: 100,
        step: 5,
        description: '闪烁动画的最大半径'
    },
    {
        name: 'overrunHideOvermax',
        label: '层级隐藏-大于等于',
        type: 'number' as const,
        default: undefined,
        min: 3,
        max: 18,
        step: 1,
        description: '当地图层级大于等于该值时隐藏报警层'
    },
    {
        name: 'overrunHideOvermin',
        label: '层级隐藏-小于等于',
        type: 'number' as const,
        default: undefined,
        min: 3,
        max: 18,
        step: 1,
        description: '当地图层级小于等于该值时隐藏报警层'
    },
    {
        name: 'display',
        label: '显示',
        type: 'boolean' as const,
        default: true
    }
]

export const warnViewsDefaultProps = {
    table: JSON.stringify(defaultWarnViewsProps.table),
    tableData: JSON.stringify(defaultWarnViewsProps.tableData),
    department: JSON.stringify(defaultWarnViewsProps.department),
    dataType: defaultWarnViewsProps.dataType,
    type: defaultWarnViewsProps.type,
    level: defaultWarnViewsProps.level,
    duration: defaultWarnViewsProps.duration,
    radius: defaultWarnViewsProps.radius,
    background: defaultWarnViewsProps.background,
    overrunHideOvermax: undefined,
    overrunHideOvermin: undefined,
    display: defaultWarnViewsProps.display
}

const renderWarnViewsPreview = (props: Record<string, any>) => {
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

    const table = parseJson(props.table, [])
    const tableData = parseJson(props.tableData, [])
    const department = parseJson(props.department, [])

    // 构建 overrunHide 对象
    const overrunHide =
        props.overrunHideOvermax !== undefined || props.overrunHideOvermin !== undefined
            ? {
                overmax: props.overrunHideOvermax,
                overmin: props.overrunHideOvermin
            }
            : undefined

    return (
        <div className="flex flex-col">
            {/* 地图容器 */}
            <div className="rounded-lg overflow-hidden border border-slate-200">
                <MapContainer
                    width="100%"
                    height={400}
                    viewOptions={{
                        position: { center: [116.391, 39.9042] },
                        zoom: 10
                    }}
                    cellKey="preview-map"
                >
                    <TableViews
                        table={table}
                        tableData={tableData}
                        cellKey="preview-table"
                    />
                    <WarnViews
                        table={table}
                        tableData={tableData}
                        department={department}
                        dataType={props.dataType ?? warnViewsDefaultProps.dataType}
                        type={props.type || warnViewsDefaultProps.type}
                        level={props.level || warnViewsDefaultProps.level}
                        duration={props.duration ?? warnViewsDefaultProps.duration}
                        radius={props.radius ?? warnViewsDefaultProps.radius}
                        background={props.background || warnViewsDefaultProps.background}
                        overrunHide={overrunHide}
                        display={props.display ?? warnViewsDefaultProps.display}
                        cellKey="preview-warn"
                    />
                </MapContainer>
            </div>

            {/* 说明文本 */}
            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-900">
                    <strong>提示：</strong>报警层需要配合数据表层一起使用。预览中已默认添加了同名的表数据层。
                </p>
            </div>
        </div>
    )
}

const renderWarnViewsCodePreview = (props: Record<string, any>) => {
    const overrunHideCode =
        props.overrunHideOvermax !== undefined || props.overrunHideOvermin !== undefined
            ? `
  overrunHide={{
    overmax: ${props.overrunHideOvermax ?? 'undefined'},
    overmin: ${props.overrunHideOvermin ?? 'undefined'}
  }}`
            : ''

    const tableProp = props.table || '[]'
    const tableDataProp = props.tableData || '[]'

    return `<TableViews
  table={${tableProp}}
  tableData={${tableDataProp}}
  cellKey="table-layer"
  map={mapInstance}
/>
<WarnViews
  table={${tableProp}}
  tableData={${tableDataProp}}
  department={${props.department || '[]'}}
  dataType={${props.dataType ?? false}}
  type="${props.type || ''}"
  level="${props.level || ''}"
  duration={${props.duration ?? 0.4}}
  radius={${props.radius ?? 20}}
  background="${props.background || 'rgba(255, 0, 0, 0.5)'}"${overrunHideCode}
  display={${props.display ?? true}}
  cellKey="warn-layer"
  map={mapInstance}
/>`
}

export const warnViewsConfig: ComponentConfig = {
    id: 'warn-views',
    name: '报警层',
    propsConfig: warnViewsPropsConfig,
    defaultProps: warnViewsDefaultProps,
    renderPreview: renderWarnViewsPreview,
    renderCodePreview: renderWarnViewsCodePreview
}
