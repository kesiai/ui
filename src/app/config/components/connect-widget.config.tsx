import React, { useState } from 'react'
import { ConnectWidget, LineSegment } from '@/registry/blocks/advanced/connect-widget/connect-widget'
import { ComponentConfig, PropConfig } from '@/app/config/types'

// 属性配置
const connectWidgetPropsConfig: PropConfig[] = [
  {
    name: 'pathValue',
    label: '路径数据',
    type: 'text' as const,
    default: JSON.stringify([{ startPoint: { x: 50, y: 100 }, endPoint: { x: 350, y: 200 } }])
  },
  {
    name: 'shape',
    label: '连线类型',
    type: 'select',
    default: 'line',
    options: [
      { label: '直线', value: 'line' },
      { label: '折弯线', value: 'narrow-s' },
      { label: '贝塞尔曲线', value: 'bezier' }
    ]
  },
  {
    name: 'stroke',
    label: '线条颜色',
    type: 'color',
    default: '#000000'
  },
  {
    name: 'strokeWidth',
    label: '线条宽度',
    type: 'number',
    default: 2,
    min: 1,
    max: 20,
    step: 1
  },
  {
    name: 'startArrow',
    label: '起点箭头',
    type: 'select',
    default: 'none',
    options: [
      { label: '无', value: 'none' },
      { label: '实心箭头', value: 'arrow' },
      { label: '空心箭头', value: 'arrowOpen' },
      { label: '实心菱形', value: 'diamond' },
      { label: '空心菱形', value: 'diamondOpen' },
      { label: '实心圆形', value: 'circle' },
      { label: '空心圆形', value: 'circleOpen' },
      { label: '实心方形', value: 'square' },
      { label: '空心方形', value: 'squareOpen' }
    ]
  },
  {
    name: 'startArrowSize',
    label: '起点箭头大小',
    type: 'number',
    default: 2,
    min: 1,
    max: 10,
    step: 0.5
  },
  {
    name: 'endArrow',
    label: '终点箭头',
    type: 'select',
    default: 'none',
    options: [
      { label: '无', value: 'none' },
      { label: '实心箭头', value: 'arrow' },
      { label: '空心箭头', value: 'arrowOpen' },
      { label: '实心菱形', value: 'diamond' },
      { label: '空心菱形', value: 'diamondOpen' },
      { label: '实心圆形', value: 'circle' },
      { label: '空心圆形', value: 'circleOpen' },
      { label: '实心方形', value: 'square' },
      { label: '空心方形', value: 'squareOpen' }
    ]
  },
  {
    name: 'endArrowSize',
    label: '终点箭头大小',
    type: 'number',
    default: 2,
    min: 1,
    max: 10,
    step: 0.5
  },
  {
    name: 'radiusQ',
    label: '圆弧大小',
    type: 'number',
    default: 6,
    min: 0,
    max: 50,
    step: 1
  },
  {
    name: 'editMode',
    label: '编辑模式',
    type: 'boolean',
    default: true
  },
  {
    name: 'width',
    label: '宽度',
    type: 'number',
    default: 400,
    min: 100,
    max: 1000,
    step: 10
  },
  {
    name: 'height',
    label: '高度',
    type: 'number',
    default: 300,
    min: 100,
    max: 800,
    step: 10
  },
  {
    name: 'animation_show',
    label: '开启动画',
    type: 'boolean',
    default: false
  },
  {
    name: 'animation_duration',
    label: '动画时长(秒)',
    type: 'number',
    default: 2,
    min: 0.5,
    max: 10,
    step: 0.5
  },
  {
    name: 'animation_strokeDasharray',
    label: '虚线间隔',
    type: 'text',
    default: '10, 10'
  }
]

// 默认属性值
const connectWidgetDefaultProps = {
  pathValue: JSON.stringify([{ startPoint: { x: 50, y: 100 }, endPoint: { x: 350, y: 200 } }]),
  shape: 'line',
  stroke: '#000000',
  strokeWidth: 2,
  startArrow: 'none',
  startArrowSize: 2,
  endArrow: 'none',
  endArrowSize: 2,
  radiusQ: 6,
  editMode: true,
  width: 400,
  height: 300,
  animation_show: false,
  animation_duration: 2,
  animation_strokeDasharray: '10, 10'
}

// 预览组件包装器
const ConnectWidgetPreview = ({ props }: { props: Record<string, any> }) => {
  // 解析 pathValue JSON 字符串
  const parsePathValue = (value: string) => {
    try {
      return JSON.parse(value || '[]')
    } catch {
      return [{ startPoint: { x: 50, y: 150 }, endPoint: { x: 350, y: 150 } }]
    }
  }
  
  const [pathValue, setPathValue] = useState<LineSegment[]>(() => parsePathValue(props.pathValue))
  
  // 当 props.pathValue 变化时同步更新内部状态
  React.useEffect(() => {
    setPathValue(parsePathValue(props.pathValue))
  }, [props.pathValue])

  // 重组动画配置
  const animation = {
    show: props.animation_show,
    duration: props.animation_duration,
    strokeDasharray: props.animation_strokeDasharray,
    timing: 'linear' as const,
    orientation: 'forward' as const,
    strokeLinejoin: 'round' as const
  }

  console.log('[ConnectWidgetPreview] props.shape:', props.shape, 'pathValue:', pathValue)
  
  return (
    <div className="w-full border rounded-lg bg-gray-50 p-4">
      <ConnectWidget
        shape={props.shape}
        stroke={props.stroke}
        strokeWidth={props.strokeWidth}
        startArrow={props.startArrow}
        startArrowSize={props.startArrowSize}
        endArrow={props.endArrow}
        endArrowSize={props.endArrowSize}
        radiusQ={props.radiusQ}
        editMode={props.editMode}
        width={props.width}
        height={props.height}
        animation={animation}
        pathValue={pathValue}
        onPathValueChange={setPathValue}
      />
    </div>
  )
}

// 渲染预览
const renderConnectWidgetPreview = (props: Record<string, any>) => {
  return <ConnectWidgetPreview props={props} />
}

// 代码预览
const renderConnectWidgetCodePreview = (props: Record<string, any>) => {
  return `<ConnectWidget
      shape="${props.shape}"
      stroke="${props.stroke}"
      strokeWidth={${props.strokeWidth}}
      startArrow="${props.startArrow}"
      startArrowSize={${props.startArrowSize}}
      endArrow="${props.endArrow}"
      endArrowSize={${props.endArrowSize}}
      radiusQ={${props.radiusQ}}
      editMode={${props.editMode}}
      width={${props.width}}
      height={${props.height}}
      animation={{
        show: ${props.animation_show},
        duration: ${props.animation_duration},
        strokeDasharray: "${props.animation_strokeDasharray}",
        timing: "linear",
        orientation: "forward"
      }}
      pathValue="${props.pathValue}"
      onPathValueChange={setPathValue}
    />
`
}

// 组件配置
export const connectWidgetConfig: ComponentConfig = {
  id: 'connect-widget',
  name: '连线',
  propsConfig: connectWidgetPropsConfig,
  defaultProps: connectWidgetDefaultProps,
  renderPreview: renderConnectWidgetPreview,
  renderCodePreview: renderConnectWidgetCodePreview
}

export default connectWidgetConfig
