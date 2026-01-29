import { Layout, type LayoutType, type ComponentLayout } from '@/registry/blocks/containers/layout/layout'
import { ComponentConfig } from '../types'
import { useState } from 'react'

export const layoutPropsConfig = [
  {
    name: 'layoutType',
    label: '📐 布局方式',
    type: 'select' as const,
    default: 'flex',
    description: '选择布局类型',
    options: [
      { label: 'Flex 弹性布局', value: 'flex' },
      { label: 'Grid 网格布局', value: 'grid' },
      { label: 'Free 自由布局', value: 'free' },
      { label: 'Cover 叠加布局', value: 'cover' }
    ]
  },
  {
    name: 'editable',
    label: '✏️ 编辑模式',
    type: 'boolean' as const,
    default: false,
    description: '开启编辑模式，可拖拽调整布局（仅Free和Grid支持）'
  },
  {
    name: 'flex.flexDirection',
    label: '↔️ Flex 方向',
    type: 'select' as const,
    default: 'row',
    description: 'Flex布局方向',
    options: [
      { label: '水平方向', value: 'row' },
      { label: '水平反向', value: 'row-reverse' },
      { label: '垂直方向', value: 'column' },
      { label: '垂直反向', value: 'column-reverse' }
    ]
  },
  {
    name: 'flex.flexWrap',
    label: '🔄 Flex 换行',
    type: 'select' as const,
    default: 'wrap',
    description: 'Flex布局换行方式',
    options: [
      { label: '换行', value: 'wrap' },
      { label: '不换行', value: 'nowrap' },
      { label: '反向换行', value: 'wrap-reverse' }
    ]
  },
  {
    name: 'flex.justifyContent',
    label: '⚖️ 主轴对齐',
    type: 'select' as const,
    default: 'flex-start',
    description: '主轴对齐方式',
    options: [
      { label: '起始对齐', value: 'flex-start' },
      { label: '末尾对齐', value: 'flex-end' },
      { label: '居中对齐', value: 'center' },
      { label: '两端对齐', value: 'space-between' },
      { label: '均匀分布', value: 'space-around' },
      { label: '等间距', value: 'space-evenly' }
    ]
  },
  {
    name: 'flex.alignItems',
    label: '📏 交叉轴对齐',
    type: 'select' as const,
    default: 'flex-start',
    description: '交叉轴对齐方式',
    options: [
      { label: '起始对齐', value: 'flex-start' },
      { label: '末尾对齐', value: 'flex-end' },
      { label: '居中对齐', value: 'center' },
      { label: '拉伸', value: 'stretch' },
      { label: '基线对齐', value: 'baseline' }
    ]
  },
  {
    name: 'grid.cols',
    label: '📊 Grid 列数',
    type: 'number' as const,
    default: 12,
    min: 1,
    max: 24,
    step: 1,
    description: 'Grid布局列数'
  },
  {
    name: 'grid.yheight',
    label: '📏 Grid 行高',
    type: 'number' as const,
    default: 30,
    min: 10,
    max: 100,
    step: 5,
    description: 'Grid布局行高（像素）'
  },
  {
    name: 'grid.margin',
    label: '↔️ Grid 间距',
    type: 'number' as const,
    default: 10,
    min: 0,
    max: 50,
    step: 1,
    description: 'Grid布局间距（像素）'
  }
]

export const layoutDefaultProps = {
  layoutType: 'flex',
  editable: false,
  'flex.flexDirection': 'row',
  'flex.flexWrap': 'wrap',
  'flex.justifyContent': 'flex-start',
  'flex.alignItems': 'flex-start',
  'grid.cols': 12,
  'grid.yheight': 30,
  'grid.margin': 10
}

// 带状态的预览组件
function LayoutPreviewWrapper({ props: initialProps }: { props: Record<string, any> }) {
  const layoutType = (initialProps.layoutType as LayoutType) || 'flex'
  const editable = initialProps.editable || false

  // 内部状态管理布局数据
  const [componentLayout, setComponentLayout] = useState<ComponentLayout>({
    free: {
      'btn-1': { width: 80, height: 40, x: 10, y: 10 },
      'btn-2': { width: 100, height: 40, x: 120, y: 10 },
      'btn-3': { width: 80, height: 40, x: 10, y: 70 }
    },
    flex: {
      'btn-1': { width: 100, height: 40 },
      'btn-2': { width: 120, height: 40 },
      'btn-3': { width: 100, height: 40 }
    },
    grid: [
      { x: 0, y: 0, w: 3, h: 2, i: 'btn-1' },
      { x: 3, y: 0, w: 4, h: 2, i: 'btn-2' },
      { x: 7, y: 0, w: 3, h: 2, i: 'btn-3' }
    ]
  })

  // 构建layoutSettings
  const layoutSettings = {
    free: {
      resizeGrid: { x: 1, y: 1 },
      dragGrid: { x: 1, y: 1 },
      autoSize: false,
      deformation: false
    },
    flex: {
      flexDirection: initialProps['flex.flexDirection'] || 'row',
      flexWrap: initialProps['flex.flexWrap'] || 'wrap',
      justifyContent: initialProps['flex.justifyContent'] || 'flex-start',
      alignItems: initialProps['flex.alignItems'] || 'flex-start',
      alignContent: 'flex-start'
    },
    grid: {
      cols: initialProps['grid.cols'] || 12,
      yheight: initialProps['grid.yheight'] || 30,
      margin: initialProps['grid.margin'] || 10,
      gridMargin: 0
    }
  }

  return (
    <div className="h-full flex flex-col p-4" style={{ minHeight: '400px' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          {layoutType === 'free' && 'Free 自由布局'}
          {layoutType === 'flex' && 'Flex 弹性布局'}
          {layoutType === 'grid' && 'Grid 网格布局'}
          {layoutType === 'cover' && 'Cover 叠加布局'}
          {editable && ' (编辑模式)'}
        </h3>
        {editable && (layoutType === 'free' || layoutType === 'grid') && (
          <div className="text-sm text-gray-500">
            💡 拖拽组件可调整位置
          </div>
        )}
      </div>

      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
        <Layout
          layoutType={layoutType}
          layoutSettings={layoutSettings}
          componentLayout={componentLayout}
          editable={editable}
          onLayoutChange={setComponentLayout}
          className="h-full min-h-[300px] bg-white border-2 border-dashed border-gray-300 rounded-lg"
        >
          <button key="btn-1" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            按钮 1
          </button>
          <button key="btn-2" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            按钮 2
          </button>
          <button key="btn-3" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            按钮 3
          </button>
        </Layout>
      </div>

      {/* 显示当前布局数据 */}
      {editable && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">当前布局数据:</p>
          <pre className="text-xs text-gray-800 overflow-auto max-h-32">
            {JSON.stringify(componentLayout[layoutType], null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

const renderLayoutPreview = (props: Record<string, any>) => {
  return <LayoutPreviewWrapper props={props} />
}

const renderLayoutCodePreview = (props: Record<string, any>) => {
  const layoutType = props.layoutType || 'flex'
  const editable = props.editable || false
  const flexDirection = props['flex.flexDirection'] || 'row'
  const flexWrap = props['flex.flexWrap'] || 'wrap'

  let code = `import { Layout } from '@/registry/blocks/containers/layout/layout'

function App() {
  const [componentLayout, setComponentLayout] = useState({
    free: {
      'btn-1': { width: 80, height: 40, x: 10, y: 10 },
      'btn-2': { width: 100, height: 40, x: 120, y: 10 },
      'btn-3': { width: 80, height: 40, x: 10, y: 70 }
    },
    flex: {
      'btn-1': { width: 100, height: 40 },
      'btn-2': { width: 120, height: 40 },
      'btn-3': { width: 100, height: 40 }
    },
    grid: [
      { x: 0, y: 0, w: 3, h: 2, i: 'btn-1' },
      { x: 3, y: 0, w: 4, h: 2, i: 'btn-2' },
      { x: 7, y: 0, w: 3, h: 2, i: 'btn-3' }
    ]
  })

  const layoutSettings = {
    flex: {
      flexDirection: '${flexDirection}',
      flexWrap: '${flexWrap}',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignContent: 'flex-start'
    },
    grid: {
      cols: 12,
      yheight: 30,
      margin: 10,
      gridMargin: 0
    },
    free: {
      resizeGrid: { x: 1, y: 1 },
      dragGrid: { x: 1, y: 1 },
      autoSize: false,
      deformation: false
    }
  }

  return (
    <Layout
      layoutType="${layoutType}"
      layoutSettings={layoutSettings}
      componentLayout={componentLayout}
      editable={${editable}}
      onLayoutChange={setComponentLayout}
    >
      <button key="btn-1">按钮 1</button>
      <button key="btn-2">按钮 2</button>
      <button key="btn-3">按钮 3</button>
    </Layout>
  )
}`

  return code
}

export const layoutConfig: ComponentConfig = {
  id: 'layout',
  name: 'Layout 布局容器',
  propsConfig: layoutPropsConfig,
  defaultProps: layoutDefaultProps,
  renderPreview: renderLayoutPreview,
  renderCodePreview: renderLayoutCodePreview
}
