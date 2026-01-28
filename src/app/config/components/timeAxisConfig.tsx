import { useState } from 'react'
import { TimeAxisWidget, VideoRecord } from '@/registry/blocks/video/time-axis/time-axis'
import { ComponentConfig, PropConfig } from '../types'

// 属性配置
const timeAxisPropsConfig: PropConfig[] = [
  {
    name: 'width',
    label: '时间轴宽度',
    type: 'number',
    default: 600,
    min: 200,
    max: 1200,
    step: 10
  },
  {
    name: 'height',
    label: '时间轴高度',
    type: 'number',
    default: 50,
    min: 30,
    max: 100,
    step: 5
  },
  {
    name: 'readonly',
    label: '是否只读',
    type: 'boolean',
    default: false
  },
  {
    name: 'scaleColor',
    label: '刻度颜色',
    type: 'color',
    default: '#ffffff'
  },
  {
    name: 'background',
    label: '背景颜色',
    type: 'color',
    default: '#374151'
  },
  {
    name: 'textColor',
    label: '文字颜色',
    type: 'color',
    default: '#ffffff'
  },
  {
    name: 'textSize',
    label: '文字大小',
    type: 'number',
    default: 12,
    min: 10,
    max: 20,
    step: 1
  }
]

// 默认属性值
const timeAxisDefaultProps = {
  width: 600,
  height: 50,
  readonly: false,
  scaleColor: '#ffffff',
  background: '#374151',
  textColor: '#ffffff',
  textSize: 12
}

// 示例视频记录数据
const sampleVideoRecords: VideoRecord[] = [
  {
    startTime: Math.floor(Date.now() / 1000) - 3600, // 1小时前
    endTime: Math.floor(Date.now() / 1000) - 1800    // 30分钟前
  },
  {
    startTime: Math.floor(Date.now() / 1000) - 1200, // 20分钟前
    endTime: Math.floor(Date.now() / 1000) - 600     // 10分钟前
  },
  {
    startTime: Math.floor(Date.now() / 1000) - 300,  // 5分钟前
    endTime: Math.floor(Date.now() / 1000)           // 现在
  }
]

// 预览组件包装器
const TimeAxisPreview = ({ props }: { props: Record<string, any> }) => {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000) - 900) // 15分钟前

  const handleTimeChange = (time: number, direction?: "left" | "right") => {
    console.log('Time changed:', time, direction)
    setCurrentTime(time)
  }

  // 组装 axisConfiguration 对象
  const axisConfiguration = {
    scaleColor: props.scaleColor || '#ffffff',
    background: props.background || '#374151',
    textColor: props.textColor || '#ffffff',
    textSize: props.textSize || 12
  }

  return (
    <div className="h-full flex items-center justify-center">
      <TimeAxisWidget
        width={props.width}
        height={props.height}
        readonly={props.readonly}
        axisConfiguration={axisConfiguration}
        currentTime={currentTime}
        videoRecords={sampleVideoRecords}
        onTimeChange={handleTimeChange}
        cellKey="preview"
      />
    </div>
  )
}

// 渲染预览
const renderTimeAxisPreview = (props: Record<string, any>) => {
  return <TimeAxisPreview props={props} />
}

// 代码预览
const renderTimeAxisCodePreview = (props: Record<string, any>) => {
  return `import { TimeAxisWidget } from '@/registry/blocks/video/time-axis/time-axis'

// 视频记录数据
const videoRecords = [
  {
    startTime: ${Math.floor(Date.now() / 1000) - 3600},
    endTime: ${Math.floor(Date.now() / 1000) - 1800}
  },
  {
    startTime: ${Math.floor(Date.now() / 1000) - 1200},
    endTime: ${Math.floor(Date.now() / 1000) - 600}
  }
]

export default function TimeAxisDemo() {
  const [currentTime, setCurrentTime] = useState(${Math.floor(Date.now() / 1000)})

  return (
    <TimeAxisWidget
      width={${props.width}}
      height={${props.height}}
      readonly={${props.readonly}}
      axisConfiguration={{
        scaleColor: "${props.axisConfiguration?.scaleColor || '#ffffff'}",
        background: "${props.axisConfiguration?.background || '#374151'}",
        textColor: "${props.axisConfiguration?.textColor || '#ffffff'}",
        textSize: ${props.axisConfiguration?.textSize || 12}
      }}
      currentTime={currentTime}
      videoRecords={videoRecords}
      onTimeChange={(time, direction) => {
        console.log('Time changed:', time, direction)
        setCurrentTime(time)
      }}
    />
  )
}`
}

// 组件配置
export const timeAxisConfig: ComponentConfig = {
  id: 'time-axis-widget',
  name: '视频时间轴',
  propsConfig: timeAxisPropsConfig,
  defaultProps: timeAxisDefaultProps,
  renderPreview: renderTimeAxisPreview,
  renderCodePreview: renderTimeAxisCodePreview
}

export default timeAxisConfig
