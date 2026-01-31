import { Panel } from '@/registry/blocks/containers/panel/panel'
import { ComponentConfig } from '@/app/config/types'

export const panelPropsConfig = [
  {
    name: 'accordion',
    label: '手风琴模式',
    type: 'boolean' as const,
    default: true,
    description: '开启后只允许一个面板展开，关闭后允许同时展开多个面板'
  },
  {
    name: 'collapsible',
    label: '允许全部折叠',
    type: 'boolean' as const,
    default: false,
    description: '是否允许所有面板都处于折叠状态（仅在手风琴模式下有效）'
  },
  {
    name: 'defaultValue',
    label: '默认展开',
    type: 'number' as const,
    default: 0,
    min: 0,
    max: 10,
    step: 1,
    description: '默认展开的面板索引（从 0 开始）'
  }
]

export const panelDefaultProps = {
  accordion: true,
  collapsible: false,
  defaultValue: 0
}

const renderPanelPreview = (props: Record<string, any>) => {
  // 生成示例面板配置
  const panels = [
    { title: '面板 1', forceRender: false },
    { title: '面板 2', forceRender: false },
    { title: '面板 3', forceRender: false }
  ]

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <Panel
          accordion={props.accordion}
          collapsible={props.collapsible}
          defaultValue={props.defaultValue}
          panels={panels}
        >
          <div className="flex items-center justify-center py-8 text-slate-400">
            <p>面板 1 内容区域</p>
          </div>
          <div className="flex items-center justify-center py-8 text-slate-400">
            <p>面板 2 内容区域</p>
          </div>
          <div className="flex items-center justify-center py-8 text-slate-400">
            <p>面板 3 内容区域</p>
          </div>
        </Panel>
      </div>
    </div>
  )
}

const renderPanelCodePreview = (props: Record<string, any>) => {
  let code = `<Panel`
  if (!props.accordion) {
    code += `\n  accordion={false}`
  }
  if (props.collapsible) {
    code += `\n  collapsible`
  }
  if (props.defaultValue !== 0) {
    code += `\n  defaultValue={${props.defaultValue}}`
  }
  code += `\n  panels={[`
  code += `\n    { title: '面板 1' },`
  code += `\n    { title: '面板 2' },`
  code += `\n    { title: '面板 3' }`
  code += `\n  ]}`
  code += `\n  value={value}`
  code += `\n  onValueChange={setValue}`
  code += `\n>`
  code += `\n  {/* 面板内容 */}`
  code += `\n</Panel>`

  return code
}

const renderPanelCustomForm = (props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
  if (props.accordion) {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-slate-700 mb-2">
          手风琴模式说明
        </p>
        <div className="text-sm text-slate-600">
          <p>手风琴模式开启时：</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>• 同一时间只能展开一个面板</li>
            <li>• 点击其他面板会自动折叠当前面板</li>
            <li>• 启用"允许全部折叠"后，可以点击已展开的面板来折叠它</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
      <p className="text-sm font-medium text-slate-700 mb-2">
        多开模式说明
      </p>
      <div className="text-sm text-slate-600">
        <p>手风琴模式关闭时：</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>• 可以同时展开多个面板</li>
          <li>• 每个面板可以独立折叠和展开</li>
          <li>• 适用于需要对比多个内容场景</li>
        </ul>
      </div>
    </div>
  )
}

export const panelConfig: ComponentConfig = {
  id: 'panel',
  name: 'Panel 折叠面板',
  propsConfig: panelPropsConfig,
  defaultProps: panelDefaultProps,
  renderPreview: renderPanelPreview,
  renderCodePreview: renderPanelCodePreview,
  renderCustomForm: renderPanelCustomForm
}
