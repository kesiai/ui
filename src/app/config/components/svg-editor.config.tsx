import { SvgEditor } from '@/registry/blocks/advanced/svg-editor/svg-editor'
import { ComponentConfig } from '../types'

// 示例 SVG 内容
const exampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <g id="layer1">
    <rect id="rect1" x="100" y="100" width="150" height="100" fill="none" stroke="#3b82f6" stroke-width="2" data-type="rect" />
    <circle id="circle1" cx="400" cy="150" r="50" fill="none" stroke="#ef4444" stroke-width="2" data-type="ellipse" />
    <path id="path1" d="M 100 350 L 700 350" fill="none" stroke="#22c55e" stroke-width="2" data-type="line" />
  </g>
</svg>`

export const svgEditorPropsConfig = [
  {
    name: 'initialSvg',
    label: '初始 SVG',
    type: 'text' as const,
    default: exampleSvg,
    description: '设置初始 SVG 内容字符串'
  },
  {
    name: 'width',
    label: '宽度',
    type: 'text' as const,
    default: '100%',
    placeholder: '如: 100%, 800px, auto',
    description: '设置编辑器的宽度'
  },
  {
    name: 'height',
    label: '高度',
    type: 'text' as const,
    default: '100%',
    placeholder: '如: 100%, 600px, auto',
    description: '设置编辑器的高度'
  },
  {
    name: 'backgroundColor',
    label: '背景颜色',
    type: 'color' as const,
    default: '#ffffff',
    description: '设置画布的背景颜色'
  },
  {
    name: 'dashboardMode',
    label: '直接进入编辑模式',
    type: 'boolean' as const,
    default: false,
    description: 'false=展示模式（双击SVG进入编辑），true=直接进入编辑模式'
  },
]

export const svgEditorDefaultProps = {
  initialSvg: exampleSvg,
  width: '100%',
  height: '100%',
  backgroundColor: '#ffffff',
  dashboardMode: false,
}

const renderSvgEditorPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full w-full p-4">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-6 mb-4">
        <div className="text-center">
          <p className="text-sm text-slate-600 mb-2">SVG 绘图编辑器</p>
          <p className="text-xs text-slate-500">
            {props.dashboardMode
              ? '直接进入编辑模式 • 使用左侧树查看元素 • 右侧面板编辑属性 • 顶部工具栏绘制图形'
              : '展示模式 - 双击 SVG 进入编辑模式'}
          </p>
        </div>
      </div>
      <div className="w-full">
        <SvgEditor
          initialSvg={props.initialSvg}
          width={props.width}
          height={props.height}
          backgroundColor={props.backgroundColor}
          dashboardMode={props.dashboardMode}
          onDashboardModeChange={(isEditMode) => {
            console.log('Edit mode changed:', isEditMode)
          }}
          onSvgChange={(svg) => {
            console.log('SVG changed:', svg)
          }}
          onSelectionChange={(elements) => {
            console.log('Selection changed:', elements)
          }}
          onPropertyChange={(key, value) => {
            console.log('Property changed:', key, value)
          }}
        />
      </div>
      <div className="mt-6 text-xs text-slate-500">
        <p className="mb-2"><strong>使用说明：</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>展示模式</strong>：只显示 SVG 内容，双击 SVG 进入编辑模式</li>
          <li><strong>编辑模式</strong>：显示完整编辑器界面，包括左侧元素树、右侧属性面板和顶部工具栏</li>
          <li>点击左侧元素树中的节点选中对应 SVG 元素</li>
          <li>选中元素后，右侧属性面板会显示可编辑的属性</li>
          <li>使用工具栏的复制、删除、撤销/重做按钮进行编辑操作</li>
          <li>点击左侧元素列表上方的"退出编辑"按钮返回展示模式</li>
        </ul>
      </div>
    </div>
  )
}

const renderSvgEditorCodePreview = (props: Record<string, any>) => {
  let code = `<SvgEditor`
  code += `\n  initialSvg={\`${props.initialSvg}\`}`
  if (props.width !== '100%') code += `\n  width="${props.width}"`
  if (props.height !== '100%') code += `\n  height="${props.height}"`
  if (props.backgroundColor !== '#ffffff') code += `\n  backgroundColor="${props.backgroundColor}"`
  if (props.dashboardMode) code += `\n  dashboardMode={true}`

  code += `\n  width="100%"`
  code += `\n  height={40}`
  code += `\n/>`

  return code
}

const renderSvgEditorCustomForm = () => {
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-sm font-medium text-slate-700 mb-3">
        SVG 编辑器配置说明
      </p>
      <div className="space-y-3">
        <div className="text-sm text-slate-600">
          <p className="font-medium mb-1">基础配置</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><code>initialSvg</code> - 初始 SVG 内容字符串</li>
            <li><code>width</code> / <code>height</code> - 编辑器尺寸</li>
            <li><code>backgroundColor</code> - 画布背景色</li>
            <li><code>dashboardMode</code> - false=展示模式（双击进入编辑），true=直接进入编辑模式</li>
          </ul>
        </div>

        <div className="text-sm text-slate-600">
          <p className="font-medium mb-1">模式说明</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>展示模式 (dashboardMode=false，默认)</strong>：仅展示 SVG 内容，双击 SVG 进入编辑模式</li>
            <li><strong>编辑模式 (dashboardMode=true)</strong>：显示完整编辑器界面，包括左侧元素树、右侧属性面板和顶部工具栏</li>
            <li>在编辑模式下，点击左侧元素列表上方的"退出编辑"按钮可返回展示模式</li>
          </ul>
        </div>

        <div className="text-sm text-slate-600">
          <p className="font-medium mb-1">事件回调</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><code>onSvgChange(svg)</code> - SVG 内容变化时触发</li>
            <li><code>onSelectionChange(elements)</code> - 选中元素变化时触发</li>
            <li><code>onPropertyChange(key, value)</code> - 元素属性变化时触发</li>
            <li><code>onDashboardModeChange(isEditMode)</code> - 编辑模式变化时触发</li>
          </ul>
        </div>

        <div className="text-sm text-slate-600">
          <p className="font-medium mb-1">绘图工具</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><strong>选择</strong> (V) - 选择和操作 SVG 元素</li>
            <li><strong>铅笔</strong> (P) - 自由绘制线条</li>
            <li><strong>直线</strong> (L) - 绘制直线</li>
            <li><strong>矩形</strong> (R) - 绘制矩形</li>
            <li><strong>椭圆</strong> (O) - 绘制椭圆</li>
            <li><strong>钢笔</strong> (B) - 贝塞尔曲线绘制</li>
            <li><strong>星形</strong> (S) - 绘制五角星</li>
            <li><strong>多边形</strong> (G) - 绘制多边形</li>
          </ul>
        </div>

        <div className="text-sm text-slate-600">
          <p className="font-medium mb-1">编辑操作</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>复制 (Ctrl+C) - 复制选中的元素</li>
            <li>粘贴 (Ctrl+V) - 粘贴元素</li>
            <li>删除 (Ctrl+X) - 删除选中的元素</li>
            <li>撤销 (Ctrl+Z) - 撤销上一步操作</li>
            <li>重做 (Ctrl+Shift+Z) - 重做上一步撤销的操作</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export const svgEditorConfig: ComponentConfig = {
  id: 'svg-editor',
  name: 'SvgEditor - SVG 绘图编辑器',
  propsConfig: svgEditorPropsConfig,
  defaultProps: svgEditorDefaultProps,
  renderPreview: renderSvgEditorPreview,
  renderCodePreview: renderSvgEditorCodePreview,
  renderCustomForm: renderSvgEditorCustomForm,
}
