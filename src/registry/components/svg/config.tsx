import { SvgEditor } from './svg'
import { ComponentConfig } from '@/app/config/types'

// 示例 SVG 内容
const exampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <g id="layer1">
    <rect id="rect1" x="100" y="100" width="150" height="100" fill="none" stroke="#3b82f6" stroke-width="2" data-type="rect" />
    <circle id="circle1" cx="400" cy="150" r="50" fill="none" stroke="#ef4444" stroke-width="2" data-type="ellipse" />
    <path id="path1" d="M 100 350 L 700 350" fill="none" stroke="#22c55e" stroke-width="2" data-type="line" />
  </g>
</svg>`

// 属性配置
const svgEditorPropsConfig = [
  {
    name: 'initialSvg',
    label: 'SVG 内容',
    type: 'text' as const,
    default: exampleSvg,
    description: '设置要展示的 SVG 内容字符串'
  },
  {
    name: 'width',
    label: '容器宽度',
    type: 'text' as const,
    default: '100%',
    placeholder: '如: 100%, 800px, auto',
    description: '设置 SVG 容器的宽度'
  },
  {
    name: 'height',
    label: '容器高度',
    type: 'text' as const,
    default: '100%',
    placeholder: '如: 100%, 600px, auto',
    description: '设置 SVG 容器的高度'
  },
]

// 默认属性值
const svgEditorDefaultProps = {
  initialSvg: exampleSvg,
  width: '100%',
  height: '100%',
}

// 渲染预览
const renderSvgEditorPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full w-full p-4">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-6 mb-4">
        <div className="text-center">
          <p className="text-sm text-slate-600 mb-2">SVG 展示组件</p>
          <p className="text-xs text-slate-500">
            用于展示 SVG 内容，支持自定义尺寸
          </p>
        </div>
      </div>
      <div className="w-full" style={{ height: '600px' }}>
        <SvgEditor
          initialSvg={props.initialSvg}
          width={props.width}
          height={props.height}
        />
      </div>
      <div className="mt-6 text-xs text-slate-500">
        <p className="mb-2"><strong>使用说明：</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>SVG 内容</strong>：传入标准的 SVG 字符串即可展示</li>
          <li><strong>尺寸控制</strong>：通过 width 和 height 属性控制容器大小</li>
        </ul>
      </div>
    </div>
  )
}

// 代码预览
const renderSvgEditorCodePreview = (props: Record<string, any>) => {
  let code = `<SvgEditor`
  code += `\n  initialSvg={\`${props.initialSvg}\`}`
  if (props.width !== '100%') code += `\n  width="${props.width}"`
  if (props.height !== '100%') code += `\n  height="${props.height}"`

  code += `\n/>`

  return code
}

// 自定义表单
const renderSvgEditorCustomForm = () => {
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-sm font-medium text-slate-700 mb-3">
        SVG 展示组件配置说明
      </p>
      <div className="space-y-3">
        <div className="text-sm text-slate-600">
          <p className="font-medium mb-1">基础配置</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><code>initialSvg</code> - 要展示的 SVG 内容字符串</li>
            <li><code>width</code> / <code>height</code> - 容器尺寸（支持百分比、像素等）</li>
          </ul>
        </div>

        <div className="text-sm text-slate-600">
          <p className="font-medium mb-1">使用示例</p>
          <pre className="bg-slate-100 p-2 rounded text-xs overflow-x-auto">
{`<SvgEditor
  initialSvg={\`<svg>...</svg>\`}
  width="100%"
  height="600px"
/>`}
          </pre>
        </div>
      </div>
    </div>
  )
}

// 组件配置
export const svgConfig: ComponentConfig = {
  id: 'svg',
  name: 'SVG 展示组件',
  propsConfig: svgEditorPropsConfig,
  defaultProps: svgEditorDefaultProps,
  renderPreview: renderSvgEditorPreview,
  renderCodePreview: renderSvgEditorCodePreview,
  renderCustomForm: renderSvgEditorCustomForm,
}

export default svgConfig
