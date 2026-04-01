import { useState } from 'react'
import { VideoPlaybackWidget, VideoRecord } from '@/registry/components/video-playback-widget/video-playback-widget'
import { ComponentConfig, PropConfig } from '@/app/config/types'
import documentationMd from './video-playback-widget.md?raw'

// 属性配置
const videoPlaybackPropsConfig: PropConfig[] = [
  {
    name: 'tableData',
    label: '设备',
    type: 'json',
    default: JSON.stringify({}, null, 2),
    description: '选择设备表数据'
  },
  {
    name: 'videoHeight',
    label: '视频高度',
    type: 'number',
    default: 400,
    min: 200,
    max: 800,
    step: 10
  },
  {
    name: 'timelineHeight',
    label: '时间轴高度',
    type: 'number',
    default: 50,
    min: 30,
    max: 100,
    step: 5
  },
  {
    name: 'backgroundColor',
    label: '视频区背景色',
    type: 'color',
    default: 'rgba(13, 14, 27, 0.7)'
  },
  {
    name: 'timelineBackground',
    label: '时间轴背景色',
    type: 'color',
    default: '#374151'
  },
  {
    name: 'timelineScaleColor',
    label: '时间轴刻度颜色',
    type: 'color',
    default: '#ffffff'
  }
]

// 默认属性值
const videoPlaybackDefaultProps = {
  tableData: {},
  videoHeight: 400,
  timelineHeight: 50,
  backgroundColor: 'rgba(13, 14, 27, 0.7)',
  timelineBackground: '#374151',
  timelineScaleColor: '#ffffff'
}

// 示例视频记录数据
const dayStart = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000)

const sampleVideoRecords: VideoRecord[] = [
  {
    startTime: dayStart + 8 * 3600,  // 08:00
    endTime: dayStart + 10 * 3600    // 10:00
  },
  {
    startTime: dayStart + 12 * 3600, // 12:00
    endTime: dayStart + 14 * 3600    // 14:00
  },
  {
    startTime: dayStart + 16 * 3600, // 16:00
    endTime: dayStart + 18 * 3600    // 18:00
  }
]

// 预览组件包装器
const VideoPlaybackPreview = ({ props }: { props: Record<string, any> }) => {
  const [date, setDate] = useState(new Date())
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(dayStart + 9 * 3600) // 09:00

  return (
    <div className="w-full max-w-4xl mx-auto">
      <VideoPlaybackWidget
        videoHeight={props.videoHeight}
        timelineHeight={props.timelineHeight}
        backgroundColor={props.backgroundColor}
        timelineBackground={props.timelineBackground}
        timelineScaleColor={props.timelineScaleColor}
        tableData={props.tableData}
        date={date}
        onDateChange={setDate}
        isPlaying={isPlaying}
        onPlayChange={setIsPlaying}
        currentTime={currentTime}
        onTimeChange={setCurrentTime}
        videoRecords={sampleVideoRecords}
        cellKey="preview"
      />
    </div>
  )
}

// 渲染预览
const renderVideoPlaybackPreview = (props: Record<string, any>) => {
  return <VideoPlaybackPreview props={props} />
}

// 代码预览
const renderVideoPlaybackCodePreview = (props: Record<string, any>) => {
  return `import { VideoPlaybackWidget } from '@/registry/components/video-playback-widget/video-playback-widget'
import { useState } from 'react'

// 视频记录数据
const videoRecords = [
  { startTime: ${dayStart + 8 * 3600}, endTime: ${dayStart + 10 * 3600} },  // 08:00-10:00
  { startTime: ${dayStart + 12 * 3600}, endTime: ${dayStart + 14 * 3600} }, // 12:00-14:00
  { startTime: ${dayStart + 16 * 3600}, endTime: ${dayStart + 18 * 3600} }  // 16:00-18:00
]

export default function VideoPlaybackDemo() {
  const [date, setDate] = useState(new Date())
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(${dayStart + 9 * 3600})

  return (
    <VideoPlaybackWidget
      videoHeight={${props.videoHeight}}
      timelineHeight={${props.timelineHeight}}
      backgroundColor="${props.backgroundColor}"
      timelineBackground="${props.timelineBackground}"
      timelineScaleColor="${props.timelineScaleColor}"
      tableData={tableData}
      date={date}
      onDateChange={setDate}
      isPlaying={isPlaying}
      onPlayChange={setIsPlaying}
      currentTime={currentTime}
      onTimeChange={setCurrentTime}
      videoRecords={videoRecords}
    />
  )
}`
}

// 组件配置
export const videoPlaybackConfig: ComponentConfig = {
  id: 'video-playback-widget',
  name: '视频回放',
  propsConfig: videoPlaybackPropsConfig,
  defaultProps: videoPlaybackDefaultProps,
  renderPreview: renderVideoPlaybackPreview,
  renderCodePreview: renderVideoPlaybackCodePreview,
  documentation: documentationMd
}

export default videoPlaybackConfig
