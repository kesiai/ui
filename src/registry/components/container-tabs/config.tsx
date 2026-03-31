import { Tabs } from '@/registry/components/container-tabs/container-tabs'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './container-tabs.md?raw'

export const tabsPropsConfig = [
  {
    name: 'tabs',
    label: '标签配置',
    type: 'array' as const,
    default: [
      { title: '标签 1', icon: '', selectedIcon: '' },
      { title: '标签 2', icon: '', selectedIcon: '' },
      { title: '标签 3', icon: '', selectedIcon: '' }
    ],
    description: '配置标签页的标题和图标'
  },
  {
    name: 'orientation',
    label: '标签位置',
    type: 'select' as const,
    default: 'top',
    options: [
      { value: 'top', label: '上' },
      { value: 'bottom', label: '下' },
      { value: 'left', label: '左' },
      { value: 'right', label: '右' }
    ],
    description: '标签位于标签页容器的位置'
  },
  {
    name: 'variant',
    label: '标签样式',
    type: 'select' as const,
    default: 'line',
    options: [
      { value: 'line', label: '下划线页签' },
      { value: 'card', label: '卡片式页签' }
    ],
    description: '标签的视觉样式'
  },
  {
    name: 'defaultValue',
    label: '默认激活标签',
    type: 'select' as const,
    default: 'tab-0',
    options: [
      { value: 'tab-0', label: '标签 1' },
      { value: 'tab-1', label: '标签 2' },
      { value: 'tab-2', label: '标签 3' }
    ],
    description: '默认激活的标签页'
  },
  {
    name: 'destroyInactiveTabPane',
    label: '隐藏销毁',
    type: 'boolean' as const,
    default: false,
    description: '标签隐藏时销毁内容，如果标签内有图表组件，建议设置为"是"'
  }
]

export const tabsDefaultProps = {
  tabs: [
    { title: '标签 1', icon: '', selectedIcon: '' },
    { title: '标签 2', icon: '', selectedIcon: '' },
    { title: '标签 3', icon: '', selectedIcon: '' }
  ],
  orientation: 'top' as const,
  variant: 'line' as const,
  defaultValue: 'tab-0',
  destroyInactiveTabPane: false
}

const renderTabsPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8" style={{ minHeight: '400px' }}>
        <Tabs
          tabs={props.tabs}
          orientation={props.orientation}
          variant={props.variant}
          defaultValue={props.defaultValue}
          destroyInactiveTabPane={props.destroyInactiveTabPane}
        >
          <div className="flex items-center justify-center py-8 text-slate-400">
            <p>标签 1 内容区域</p>
          </div>
          <div className="flex items-center justify-center py-8 text-slate-400">
            <p>标签 2 内容区域</p>
          </div>
          <div className="flex items-center justify-center py-8 text-slate-400">
            <p>标签 3 内容区域</p>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

const renderTabsCodePreview = (props: Record<string, any>) => {
  let code = `<Tabs`
  code += `\n  tabs={[`
  props.tabs.forEach((tab: any, index: number) => {
    code += `\n    { title: '${tab.title || `Tab ${index + 1}`}'}`
    if (index < props.tabs.length - 1) code += ','
  })
  code += `\n  ]}`
  if (props.orientation !== 'top') {
    code += `\n  orientation="${props.orientation}"`
  }
  if (props.variant !== 'line') {
    code += `\n  variant="${props.variant}"`
  }
  if (props.defaultValue !== 'tab-0') {
    code += `\n  defaultValue="${props.defaultValue}"`
  }
  if (props.destroyInactiveTabPane) {
    code += `\n  destroyInactiveTabPane`
  }
  code += `\n  value={value}`
  code += `\n  onValueChange={setValue}`
  code += `\n>`
  code += `\n  {/* 标签内容 */}`
  code += `\n</Tabs>`

  return code
}

const renderTabsCustomForm = (props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
  if (props.destroyInactiveTabPane) {
    return (
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm font-medium text-slate-700 mb-2">
          隐藏销毁模式说明
        </p>
        <div className="text-sm text-slate-600">
          <p>启用"隐藏销毁"后：</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>• 未激活的标签内容会被完全销毁</li>
            <li>• 切换标签时会重新创建内容</li>
            <li>• 适用于包含图表等需要重新渲染的组件</li>
            <li>• 可以提高性能，但会丢失标签的滚动位置和输入状态</li>
          </ul>
        </div>
      </div>
    )
  }

  return null
}

export const tabsConfig: ComponentConfig = {
  id: 'container-tabs',
  name: '标签页',
  propsConfig: tabsPropsConfig,
  defaultProps: tabsDefaultProps,
  renderPreview: renderTabsPreview,
  renderCodePreview: renderTabsCodePreview,
  renderCustomForm: renderTabsCustomForm,
  documentation: documentationMd
}
