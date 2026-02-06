import { Bar } from '@/registry/components/bar/bar'
import { ComponentConfig } from '@/app/config/types'

export const barPropsConfig = [
  {
    name: 'value',
    label: '当前值',
    type: 'number' as const,
    default: 50,
    min: 0,
    max: 100
  },
  {
    name: 'maxValue',
    label: '最大值',
    type: 'number' as const,
    default: 100,
    min: 1
  },
  {
    name: 'color',
    label: '填充颜色',
    type: 'color' as const,
    default: '#3b82f6'
  },
  {
    name: 'borderColor',
    label: '边框颜色',
    type: 'color' as const,
    default: ''
  },
  {
    name: 'direction',
    label: '方向',
    type: 'select' as const,
    default: 'horizontal',
    options: [
      { value: 'horizontal', label: '水平' },
      { value: 'vertical', label: '垂直' }
    ]
  },
  {
    name: 'position',
    label: '起始位置',
    type: 'select' as const,
    default: 'start',
    options: [
      { value: 'start', label: '起始位置' },
      { value: 'end', label: '末端位置' }
    ]
  },
  {
    name: 'visualMap',
    label: '启用颜色映射',
    type: 'boolean' as const,
    default: false
  }
]

export const barDefaultProps = {
  value: 50,
  maxValue: 100,
  color: '#3b82f6',
  borderColor: '',
  direction: 'horizontal' as 'horizontal' | 'vertical',
  position: 'start' as 'start' | 'end',
  visualMap: false
}

const renderBarPreview = (props: Record<string, any>) => {
  const visualMap = props.visualMap ? [
    { data: 30, color: '#22c55e' },
    { data: 60, color: '#eab308' },
    { data: 90, color: '#ef4444' }
  ] : []

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full h-48 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center p-4">
          <Bar
            value={props.value}
            maxValue={props.maxValue}
            color={props.color}
            borderColor={props.borderColor || undefined}
            direction={props.direction}
            position={props.position}
            visualMap={visualMap}
          />
        </div>
      </div>
    </div>
  )
}

const renderBarCodePreview = (props: Record<string, any>) => {
  return `<Bar
  value={${props.value}}
  maxValue={${props.maxValue}}
  color="${props.color}"
  ${props.borderColor ? `borderColor="${props.borderColor}"` : ''}
  direction="${props.direction}"
  position="${props.position}"
  ${props.visualMap ? `visualMap={[...]}` : ''}
/>`
}

const renderBarCustomForm = (props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
  if (!props.visualMap) return null

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-sm font-medium text-slate-700 mb-3">
        颜色映射配置
      </p>
      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-green-500"></div>
          <span>值 ≥ 30: 绿色</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-yellow-500"></div>
          <span>值 ≥ 60: 黄色</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-red-500"></div>
          <span>值 ≥ 90: 红色</span>
        </div>
      </div>
    </div>
  )
}

export const barConfig: ComponentConfig = {
  id: 'bar',
  name: 'Bar 进度条',
  propsConfig: barPropsConfig,
  defaultProps: barDefaultProps,
  renderPreview: renderBarPreview,
  renderCodePreview: renderBarCodePreview,
  renderCustomForm: renderBarCustomForm
}
