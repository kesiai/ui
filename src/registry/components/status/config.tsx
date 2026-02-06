import { Status } from '@/registry/components/status/status'
import { ComponentConfig } from '@/app/config/types'

// 示例状态配置
const exampleStatuses = [
  {
    name: '正常',
    activeType: 'value' as const,
    activeValue: 'normal',
    text: '正常',
    bgColor: '#22c55e',
    textColor: '#ffffff'
  },
  {
    name: '警告',
    activeType: 'value' as const,
    activeValue: 'warning',
    text: '警告',
    bgColor: '#f59e0b',
    textColor: '#ffffff'
  },
  {
    name: '错误',
    activeType: 'value' as const,
    activeValue: 'error',
    text: '错误',
    bgColor: '#ef4444',
    textColor: '#ffffff'
  }
]

export const statusPropsConfig = [
  {
    name: 'value',
    label: '当前值',
    type: 'select' as const,
    default: 'normal',
    options: [
      { value: 'normal', label: '正常' },
      { value: 'warning', label: '警告' },
      { value: 'error', label: '错误' },
      { value: 'offline', label: '离线' }
    ],
    description: '设置当前状态值，用于匹配不同的状态配置'
  },
  {
    name: 'blinkOnStateChange',
    label: '状态切换闪烁',
    type: 'boolean' as const,
    default: false,
    description: '状态切换时是否触发闪烁动画'
  }
]

export const statusDefaultProps = {
  value: 'normal',
  statuses: exampleStatuses,
  blinkOnStateChange: false
}

const renderStatusPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <div className="text-center mb-6">
          <p className="text-sm text-slate-600 mb-4">状态指示器预览</p>
          <p className="text-xs text-slate-500 mb-4">当前值: <span className="font-mono font-bold text-lg">{props.value}</span></p>
          <div className="grid grid-cols-4 gap-2 text-xs text-slate-600 mb-4">
            <button
              onClick={() => {/* 预览中不允许交互，需要在表单中切换 */}}
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
        <div className="flex items-center justify-center">
          <Status
            value={props.value}
            statuses={exampleStatuses}
            blinkOnStateChange={props.blinkOnStateChange}
            width="100%"
            height={120}
          />
        </div>
        <div className="mt-6 grid grid-cols-4 gap-2 text-xs text-slate-500">
          <div className="text-center p-2 bg-white rounded border">
            <div className="w-4 h-4 rounded-full bg-green-500 mx-auto mb-1"></div>
            正常
          </div>
          <div className="text-center p-2 bg-white rounded border">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mx-auto mb-1"></div>
            警告
          </div>
          <div className="text-center p-2 bg-white rounded border">
            <div className="w-4 h-4 rounded-full bg-red-500 mx-auto mb-1"></div>
            错误
          </div>
          <div className="text-center p-2 bg-white rounded border">
            <div className="w-4 h-4 rounded-full bg-slate-400 mx-auto mb-1"></div>
            离线
          </div>
        </div>
      </div>
    </div>
  )
}

const renderStatusCodePreview = (props: Record<string, any>) => {
  let code = `<Status`
  if (props.value !== 'normal') {
    code += `\n  value="${props.value}"`
  }
  if (props.blinkOnStateChange) {
    code += `\n  blinkOnStateChange`
  }
  code += `\n  statuses={[`
  code += `\n    {`
  code += `\n      name: '正常',`
  code += `\n      activeType: 'value',`
  code += `\n      activeValue: 'normal',`
  code += `\n      text: '正常',`
  code += `\n      bgColor: '#22c55e',`
  code += `\n      textColor: '#ffffff'`
  code += `\n    },`
  code += `\n    // ... 更多状态配置`
  code += `\n  ]}`
  code += `\n  width="100%"`
  code += `\n  height={80}`
  code += `\n/>`

  return code
}

const renderStatusCustomForm = (props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-sm font-medium text-slate-700 mb-2">
        状态配置说明
      </p>
      <div className="text-sm text-slate-600 space-y-2">
        <p>状态组件通过 value 匹配不同的状态配置：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>• 支持固定值匹配（activeType: 'value'）</li>
          <li>• 支持范围匹配（activeType: 'range'）</li>
          <li>• 每个状态可配置文字、颜色、背景图等</li>
        </ul>
        <div className="mt-3 p-3 bg-white rounded border border-blue-100">
          <p className="font-medium mb-2">示例配置：</p>
          <pre className="text-xs overflow-x-auto">
{`[
  {
    name: '正常',
    activeType: 'value',
    activeValue: 'normal',
    text: '正常',
    bgColor: '#22c55e',
    textColor: '#ffffff'
  },
  {
    name: '警告',
    activeType: 'value',
    activeValue: 'warning',
    text: '警告',
    bgColor: '#f59e0b',
    textColor: '#ffffff'
  }
]`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export const statusConfig: ComponentConfig = {
  id: 'status',
  name: 'Status 状态指示器',
  propsConfig: statusPropsConfig,
  defaultProps: statusDefaultProps,
  renderPreview: renderStatusPreview,
  renderCodePreview: renderStatusCodePreview,
  renderCustomForm: renderStatusCustomForm
}
