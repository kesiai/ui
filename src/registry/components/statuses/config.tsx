import { Statuses } from '@/registry/components/statuses/statuses'
import ViewModel from '../view-model/view-model'
import { ComponentConfig } from '@/app/config/types'

// 示例设备配置
const exampleDevices = [
  { id: 'device1', name: '设备1' },
  { id: 'device2', name: '设备2' }
]

// 示例数据点配置
const exampleDataPoints = [
  {
    tags: {
      id: 'temp',
      name: '温度'
    },
    status: [
      {
        name: '正常',
        activeType: 'activeKey' as const,
        activeKey: 'normal',
        text: '正常',
        bgColor: '#22c55e',
        color: '#ffffff'
      },
      {
        name: '警告',
        activeType: 'activeKey' as const,
        activeKey: 'warning',
        text: '警告',
        bgColor: '#f59e0b',
        color: '#ffffff'
      },
      {
        name: '错误',
        activeType: 'activeKey' as const,
        activeKey: 'error',
        text: '错误',
        bgColor: '#ef4444',
        color: '#ffffff'
      }
    ]
  },
  {
    tags: {
      id: 'humidity',
      name: '湿度'
    },
    status: [
      {
        name: '正常',
        activeType: 'range' as const,
        minKey: 0,
        maxKey: 60,
        text: '正常',
        bgColor: '#22c55e',
        color: '#ffffff'
      },
      {
        name: '警告',
        activeType: 'range' as const,
        minKey: 60,
        maxKey: 80,
        text: '警告',
        bgColor: '#f59e0b',
        color: '#ffffff'
      }
    ]
  }
]

// 示例设备数据值（用于预览）
const exampleDeviceValues = {
  device1: {
    temp: { value: 'normal', time: '2024-01-01 12:00:00' },
    humidity: { value: 45, time: '2024-01-01 12:00:00' }
  },
  device2: {
    temp: { value: 'warning', time: '2024-01-01 12:00:00' },
    humidity: { value: 75, time: '2024-01-01 12:00:00' }
  }
}

export const statusesPropsConfig = [
  {
    name: 'tableId',
    label: '设备表',
    type: 'table-id' as const,
    default: null,
    description: '设备表ID，用于从表获取设备数据'
  },
  {
    name: 'nodes',
    label: '设备列表',
    type: 'table-data' as const,
    default: [],
    dependsOn: 'tableId', // 依赖 tableId 配置项
    multiple: true,
    description: '从设备表中选择设备，支持多选'
  },
  {
    name: 'tags',
    label: '数据点配置',
    type: 'table-tags' as const,
    default: [],
    dependsOn: 'tableId', // 依赖 tableId 配置项
    multiple: true,
    description: '从设备表中选择数据点（tag类型的字段），支持多选'
  },
  {
    name: 'dataPointStatus',
    label: '数据点状态',
    type: 'json' as const,
    default: [
      {
        activeType: 'activeKey',
        activeKey: 'offline',
        text: '离线',
        bgColor: '#6b7280',
        color: '#ffffff'
      }
    ],
    description: '数据点状态配置，JSON数组格式。支持条件类型：activeKey(固定值)、range(范围值)'
  },
  {
    name: 'mock',
    label: '模拟数据',
    type: 'text' as const,
    default: '',
    placeholder: '例如: {"device1": {"temp": "normal"}} - 设备ID为键，数据点ID为值',
    description: '模拟数据，用于预览效果'
  },
  {
    name: 'blinkOnStateChange',
    label: '状态切换闪烁',
    type: 'boolean' as const,
    default: false,
    description: '状态切换时是否触发闪烁动画'
  },
  {
    name: 'flex',
    label: '布局配置',
    type: 'select' as const,
    default: JSON.stringify({
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center'
    }, null, 2),
    options: [
      {
        value: JSON.stringify({
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          alignContent: 'flex-start'
        }, null, 2),
        label: '水平排列-换行-左对齐'
      },
      {
        value: JSON.stringify({
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center'
        }, null, 2),
        label: '水平排列-换行-居中'
      },
      {
        value: JSON.stringify({
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignContent: 'center'
        }, null, 2),
        label: '水平排列-换行-两端对齐'
      },
      {
        value: JSON.stringify({
          flexDirection: 'column',
          flexWrap: 'nowrap',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          alignContent: 'flex-start'
        }, null, 2),
        label: '垂直排列-不换行'
      },
      {
        value: JSON.stringify({
          flexDirection: 'column',
          flexWrap: 'nowrap',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center'
        }, null, 2),
        label: '垂直排列-居中'
      },
      {
        value: JSON.stringify({
          flexDirection: 'row',
          flexWrap: 'nowrap',
          justifyContent: 'flex-start',
          alignItems: 'center',
          alignContent: 'center'
        }, null, 2),
        label: '水平排列-不换行'
      }
    ],
    description: '选择预设的Flex布局配置'
  },
  {
    name: 'width',
    label: '子组件宽',
    type: 'number' as const,
    default: 100,
    description: '每个状态组件的宽度'
  },
  {
    name: 'height',
    label: '子组件高',
    type: 'number' as const,
    default: 100,
    description: '每个状态组件的高度'
  },
  {
    name: 'deviceValues',
    label: '设备数据值',
    type: 'text' as const,
    default: JSON.stringify(exampleDeviceValues, null, 2),
    description: '设备当前数据值，用于预览，JSON格式'
  }
]

export const statusesDefaultProps = {
  tableId: null,
  nodes: [],
  tags: [],
  dataPointStatus: [
    {
      activeType: 'activeKey',
      activeKey: 'offline',
      text: '离线',
      bgColor: '#6b7280',
      color: '#ffffff'
    }
  ],
  mock: '',
  blinkOnStateChange: false,
  flex: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'flex-start'
  },
  width: 100,
  height: 100,
  deviceValues: exampleDeviceValues
}

const renderStatusesPreview = (props: Record<string, any>) => {
  // 解析JSON字符串的props
  let nodes = Array.isArray(props.nodes) ? props.nodes : (typeof props.nodes === 'string' ? JSON.parse(props.nodes) : props.nodes || exampleDevices)

  // 如果 nodes 是字符串数组（从 table-data 选择器返回的 ID），需要转换为 DeviceConfig 对象
  // 注意：由于我们无法在这里再次查询表数据，暂时使用 ID 作为 name
  if (nodes.length > 0 && typeof nodes[0] === 'string') {
    nodes = nodes.map((id: string) => ({ id, name: id }))
  }

  // 处理 tags：从新的简单格式 [{ id, name }] 转换为组件期望的格式
  const tags = Array.isArray(props.tags)
    ? props.tags.map((tag: any) => ({
        tags: { id: tag.id, name: tag.name },
        status: []
      }))
    : (typeof props.tags === 'string' ? JSON.parse(props.tags) : props.tags || exampleDataPoints)
  const dataPointStatus = props.dataPointStatus || []
  const flex = typeof props.flex === 'string' ? JSON.parse(props.flex) : props.flex
  const deviceValues = typeof props.deviceValues === 'string' ? JSON.parse(props.deviceValues) : props.deviceValues || exampleDeviceValues

  const totalDevices = nodes?.length || 0
  const totalDataPoints = tags?.length || 0
  const totalStatuses = totalDevices * totalDataPoints

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <div className="text-center mb-6">
          <p className="text-sm text-slate-600 mb-4">状态组件组预览</p>
          <p className="text-xs text-slate-500 mb-4">
            设备数: <span className="font-mono font-bold text-lg">{totalDevices}</span> |
            数据点数: <span className="font-mono font-bold text-lg">{totalDataPoints}</span> |
            总状态数: <span className="font-mono font-bold text-lg">{totalStatuses}</span>
          </p>
          <div className="grid grid-cols-4 gap-2 text-xs text-slate-600 mb-4">
            <button
              onClick={() => {/* 预览中不允许交互，需要在表单中切换 */ }}
              className="px-2 py-1 bg-white rounded border"
              title="在右侧表单中切换"
            >
              normal
            </button>
            <button
              className="px-2 py-1 bg-white rounded border"
              title="在右侧表单中切换"
            >
              warning
            </button>
            <button
              className="px-2 py-1 bg-white rounded border"
              title="在右侧表单中切换"
            >
              error
            </button>
            <button
              className="px-2 py-1 bg-white rounded border"
              title="在右侧表单中切换"
            >
              offline
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center flex-wrap gap-2 w-full">
          {props.tableId ? (
            <ViewModel tableId={props.tableId}>
              <Statuses
                nodes={nodes}
                tags={tags}
                dataPointStatus={dataPointStatus}
                mock={props.mock}
                blinkOnStateChange={props.blinkOnStateChange}
                flex={flex}
                width={props.width || 100}
                height={props.height || 100}
                deviceValues={deviceValues}
              />
            </ViewModel>
          ) : (
            <Statuses
              nodes={nodes}
              tags={tags}
              dataPointStatus={dataPointStatus}
              mock={props.mock}
              blinkOnStateChange={props.blinkOnStateChange}
              flex={flex}
              width={props.width || 100}
              height={props.height || 100}
              deviceValues={deviceValues}
            />
          )}
        </div>
        <div className="mt-6 text-xs text-slate-500">
          <p className="mb-2">设备数据状态映射:</p>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {nodes?.map((node: any) =>
              tags?.map((tag: any) => {
                const value = deviceValues?.[node.id]?.[tag.tags.id]?.value || 'unknown'
                return (
                  <div key={`${node.id}-${tag.tags.id}`} className="text-center p-2 bg-white rounded border">
                    <div className="font-medium">{node.name || node.id}</div>
                    <div className="text-slate-600">{tag.tags.name}: {JSON.stringify(value)}</div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const renderStatusesCodePreview = (props: Record<string, any>) => {
  let statusesProps = []
  if (props.blinkOnStateChange) {
    statusesProps.push(`\n  blinkOnStateChange`)
  }
  if (props.mock) {
    statusesProps.push(`\n  mock`)
  }
  if (props.width !== 100) {
    statusesProps.push(`\n  width={${props.width}}`)
  }
  if (props.height !== 100) {
    statusesProps.push(`\n  height={${props.height}}`)
  }

  // 处理 tags 用于代码预览：转换为组件期望的格式
  const tagsForCode = Array.isArray(props.tags)
    ? props.tags.map((tag: any) => ({
        tags: { id: tag.id, name: tag.name },
        status: []
      }))
    : (typeof props.tags === 'string' ? JSON.parse(props.tags) : props.tags || exampleDataPoints)

  const tagsStr = typeof props.tags === 'string' ? props.tags : JSON.stringify(tagsForCode, null, 2)
  const dataPointStatusStr = typeof props.dataPointStatus === 'string' ? props.dataPointStatus : JSON.stringify(props.dataPointStatus || [], null, 2)
  const flexStr = typeof props.flex === 'string' ? props.flex : JSON.stringify(props.flex, null, 2)

  // 如果提供了 nodes 且不是 tableId 模式，显示 nodes 参数
  if (!props.tableId && props.nodes && props.nodes.length > 0) {
    const nodesStr = Array.isArray(props.nodes) ? JSON.stringify(props.nodes, null, 2) : props.nodes
    statusesProps.push(`\n  nodes={${nodesStr}}`)
  }

  statusesProps.push(`\n  tags={${tagsStr}}`)
  statusesProps.push(`\n  dataPointStatus={${dataPointStatusStr}}`)
  statusesProps.push(`\n  flex={${flexStr}}`)
  statusesProps.push(`\n  deviceValues={deviceValues} // 从外部数据源获取`)

  let code
  if (props.tableId) {
    code = `import { ViewModel } from '@/registry/components/view-model/view-model'
import { Statuses } from '@/registry/components/statuses/statuses'

const MyStatuses = () => {
  return (
    <ViewModel tableId="${props.tableId}">
      <Statuses${statusesProps.join('')}
      />
    </ViewModel>
  )
}`
  } else {
    code = `import { Statuses } from '@/registry/components/statuses/statuses'

const MyStatuses = () => {
  return (
    <Statuses${statusesProps.join('')}
    />
  )
}`
  }

  return code
}

const renderStatusesCustomForm = (_props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-sm font-medium text-slate-700 mb-2">
        状态指示器组配置说明
      </p>
      <div className="text-sm text-slate-600 space-y-2">
        <p>Statuses组件通过设备和数据点的组合来生成多个状态指示器：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>• <strong>设备配置(devices)</strong>：选择要监控的设备列表</li>
          <li>• <strong>数据点配置(dataPoints)</strong>：选择要监控的数据点，每个设备都会使用这些数据点</li>
          <li>• <strong>状态组配置(statusGroups)</strong>：定义不同数据值对应的状态显示规则</li>
          <li>• <strong>设备数据值(deviceValues)</strong>：实时数据源，提供设备当前的数据值</li>
        </ul>
        <p><strong>生成逻辑：</strong>组件会为每个"设备+数据点"的组合生成一个状态指示器，总数 = 设备数 × 数据点数</p>
        <div className="mt-3 p-3 bg-white rounded border border-blue-100">
          <p className="font-medium mb-2">配置示例：</p>
          <pre className="text-xs overflow-x-auto">
            {`// 设备配置
devices: [
  { id: 'device1', name: '温度传感器', dataPoints: ['temp'] },
  { id: 'device2', name: '湿度传感器', dataPoints: ['humidity'] }
]

// 数据点配置
dataPoints: ['temp', 'humidity']

// 状态配置
statusGroups: [
  {
    value: 'normal',
    statuses: [{ name: '正常', activeValue: 'normal', bgColor: '#22c55e' }]
  },
  {
    value: 'warning',
    statuses: [{ name: '警告', activeValue: 'warning', bgColor: '#f59e0b' }]
  }
]

// 实时数据
deviceValues: {
  device1: { temp: 'normal' },
  device2: { humidity: 'warning' }
}`}
          </pre>
        </div>
        <p className="mt-2 text-orange-600">
          💡 <strong>注意：</strong>deviceValues需要从外部数据源实时获取，通常通过WebSocket或API调用。
        </p>
      </div>
    </div>
  )
}

export const statusesConfig: ComponentConfig = {
  id: 'statuses',
  name: 'Statuses 状态指示器组',
  propsConfig: statusesPropsConfig,
  defaultProps: statusesDefaultProps,
  renderPreview: renderStatusesPreview,
  renderCodePreview: renderStatusesCodePreview,
  renderCustomForm: renderStatusesCustomForm
}
