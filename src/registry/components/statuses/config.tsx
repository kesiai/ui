import { Statuses } from '@/registry/components/statuses/statuses'
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

// 预设设备表选项
const tableOptions = [
  { value: JSON.stringify({ id: 'table1', name: '设备表1' }, null, 2), label: '设备表1' },
  { value: JSON.stringify({ id: 'table2', name: '温度监控表' }, null, 2), label: '温度监控表' },
  { value: JSON.stringify({ id: 'table3', name: '湿度监控表' }, null, 2), label: '湿度监控表' }
]

// 预设设备列表选项
const nodesOptions = [
  {
    value: JSON.stringify([
      { id: 'device1', name: '设备1' },
      { id: 'device2', name: '设备2' }
    ], null, 2),
    label: '2个设备'
  },
  {
    value: JSON.stringify([
      { id: 'device1', name: '温度传感器1' },
      { id: 'device2', name: '温度传感器2' },
      { id: 'device3', name: '温度传感器3' }
    ], null, 2),
    label: '3个温度传感器'
  },
  {
    value: JSON.stringify([
      { id: 'sensor1', name: '传感器A' },
      { id: 'sensor2', name: '传感器B' },
      { id: 'sensor3', name: '传感器C' },
      { id: 'sensor4', name: '传感器D' }
    ], null, 2),
    label: '4个传感器'
  }
]

// 预设数据点配置选项
const tagsOptions = [
  {
    value: JSON.stringify([
      {
        tags: { id: 'temp', name: '温度' },
        status: [
          { name: '正常', activeType: 'activeKey' as const, activeKey: 'normal', text: '正常', bgColor: '#22c55e', color: '#ffffff' },
          { name: '警告', activeType: 'activeKey' as const, activeKey: 'warning', text: '警告', bgColor: '#f59e0b', color: '#ffffff' },
          { name: '错误', activeType: 'activeKey' as const, activeKey: 'error', text: '错误', bgColor: '#ef4444', color: '#ffffff' }
        ]
      },
      {
        tags: { id: 'humidity', name: '湿度' },
        status: [
          { name: '正常', activeType: 'range' as const, minKey: 0, maxKey: 60, text: '正常', bgColor: '#22c55e', color: '#ffffff' },
          { name: '警告', activeType: 'range' as const, minKey: 60, maxKey: 80, text: '警告', bgColor: '#f59e0b', color: '#ffffff' }
        ]
      }
    ], null, 2),
    label: '温度+湿度（2个数据点）'
  },
  {
    value: JSON.stringify([
      {
        tags: { id: 'temp', name: '温度' },
        status: [
          { name: '正常', activeType: 'range' as const, minKey: 0, maxKey: 30, text: '正常', bgColor: '#22c55e', color: '#ffffff' },
          { name: '偏高', activeType: 'range' as const, minKey: 30, maxKey: 50, text: '偏高', bgColor: '#f59e0b', color: '#ffffff' },
          { name: '过高', activeType: 'range' as const, minKey: 50, maxKey: 100, text: '过高', bgColor: '#ef4444', color: '#ffffff' }
        ]
      }
    ], null, 2),
    label: '仅温度（3个状态范围）'
  },
  {
    value: JSON.stringify([
      {
        tags: { id: 'status', name: '运行状态' },
        status: [
          { name: '运行中', activeType: 'activeKey' as const, activeKey: 'running', text: '运行中', bgColor: '#22c55e', color: '#ffffff' },
          { name: '停止', activeType: 'activeKey' as const, activeKey: 'stopped', text: '停止', bgColor: '#6b7280', color: '#ffffff' },
          { name: '故障', activeType: 'activeKey' as const, activeKey: 'fault', text: '故障', bgColor: '#ef4444', color: '#ffffff' }
        ]
      }
    ], null, 2),
    label: '运行状态（3个枚举值）'
  }
]

export const statusesPropsConfig = [
  {
    name: 'table',
    label: '设备表',
    type: 'select' as const,
    default: tableOptions[0].value,
    options: tableOptions,
    description: '选择预设的设备表配置'
  },
  {
    name: 'nodes',
    label: '设备列表',
    type: 'select' as const,
    default: nodesOptions[0].value,
    options: nodesOptions,
    description: '选择预设的设备列表'
  },
  {
    name: 'tags',
    label: '数据点配置',
    type: 'select' as const,
    default: tagsOptions[0].value,
    options: tagsOptions,
    description: '选择预设的数据点配置，包含状态显示规则'
  },
  {
    name: 'tagTimeoutState',
    label: '数据点超时状态',
    type: 'text' as const,
    default: JSON.stringify({
      open: false,
      text: '离线',
      bgColor: '#6b7280',
      color: '#ffffff'
    }, null, 2),
    description: '数据点超时状态配置，JSON格式'
  },
  {
    name: 'mock',
    label: '模拟数据',
    type: 'text' as const,
    default: '',
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
  table: tableOptions[0].value,
  nodes: nodesOptions[0].value,
  tags: tagsOptions[0].value,
  tagTimeoutState: {
    open: false,
    text: '离线',
    bgColor: '#6b7280',
    color: '#ffffff'
  },
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
  const table = typeof props.table === 'string' ? JSON.parse(props.table) : props.table
  const nodes = typeof props.nodes === 'string' ? JSON.parse(props.nodes) : props.nodes || exampleDevices
  const tags = typeof props.tags === 'string' ? JSON.parse(props.tags) : props.tags || exampleDataPoints
  const tagTimeoutState = typeof props.tagTimeoutState === 'string' ? JSON.parse(props.tagTimeoutState) : props.tagTimeoutState
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
          <Statuses
            table={table}
            nodes={nodes}
            tags={tags}
            tagTimeoutState={tagTimeoutState}
            mock={props.mock}
            blinkOnStateChange={props.blinkOnStateChange}
            flex={flex}
            width={props.width || 100}
            height={props.height || 100}
            deviceValues={deviceValues}
          />
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
  let code = `<Statuses`
  if (props.blinkOnStateChange) {
    code += `\n  blinkOnStateChange`
  }
  if (props.mock) {
    code += `\n  mock`
  }
  if (props.width !== 100) {
    code += `\n  width={${props.width}}`
  }
  if (props.height !== 100) {
    code += `\n  height={${props.height}}`
  }
  code += `\n  table={${typeof props.table === 'string' ? props.table : JSON.stringify(props.table, null, 2)}}`
  code += `\n  nodes={${typeof props.nodes === 'string' ? props.nodes : JSON.stringify(props.nodes || exampleDevices, null, 2)}}`
  code += `\n  tags={${typeof props.tags === 'string' ? props.tags : JSON.stringify(props.tags || exampleDataPoints, null, 2)}}`
  code += `\n  tagTimeoutState={${typeof props.tagTimeoutState === 'string' ? props.tagTimeoutState : JSON.stringify(props.tagTimeoutState, null, 2)}}`
  code += `\n  flex={${typeof props.flex === 'string' ? props.flex : JSON.stringify(props.flex, null, 2)}}`
  code += `\n  deviceValues={deviceValues} // 从外部数据源获取`
  code += `\n/>`

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
