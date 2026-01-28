import { VideoWidget } from '@/registry/blocks/video/video-widget/video-widget'
import { ComponentConfig } from '../types'

export const videoControlPropsConfig = [
  {
    name: 'type',
    label: '视频类型',
    type: 'select' as const,
    default: 'mp4',
    options: [
      { value: 'mp4', label: 'MP4 视频' },
      { value: 'flv', label: 'FLV 直播视频' },
      { value: 'hls', label: 'HLS 直播视频' },
      { value: 'm3u8', label: 'M3U8 直播视频' },
      { value: 'rtmp', label: 'RTMP 直播视频' },
      { value: 'rtsp', label: 'RTSP 拉流视频' }
    ]
  },
  {
    name: 'url',
    label: '视频地址',
    type: 'text' as const,
    default: '',
    placeholder: '请输入视频地址'
  },
  {
    name: 'autoplay',
    label: '自动播放',
    type: 'boolean' as const,
    default: false,
    description: '页面加载后自动播放视频'
  },
  {
    name: 'loop',
    label: '循环播放',
    type: 'boolean' as const,
    default: false,
    description: '视频播放结束后重新开始'
  },
  {
    name: 'controls',
    label: '显示控制栏',
    type: 'boolean' as const,
    default: true,
    description: '显示视频播放控制栏'
  },
  {
    name: 'muted',
    label: '静音播放',
    type: 'boolean' as const,
    default: false,
    description: '视频默认静音状态'
  },
  {
    name: 'width',
    label: '宽度',
    type: 'text' as const,
    default: '100%',
    placeholder: '例如: 100%, 400px'
  },
  {
    name: 'height',
    label: '高度',
    type: 'text' as const,
    default: '100%',
    placeholder: '例如: 100%, 300px'
  },
  {
    name: 'poster',
    label: '封面图片',
    type: 'text' as const,
    default: '',
    placeholder: '视频封面图片地址'
  },
  {
    name: 'errorReload',
    label: '错误重连时间',
    type: 'number' as const,
    default: 5,
    min: 0,
    max: 60,
    step: 1,
    description: '视频加载失败后的重连间隔（秒），0表示不重连'
  },
  {
    name: 'showPlaceholder',
    label: '显示占位图',
    type: 'boolean' as const,
    default: false,
    description: '视频加载失败时显示占位图'
  },
  {
    name: 'defaultImage',
    label: '占位图片',
    type: 'text' as const,
    default: '',
    placeholder: '占位图片地址'
  }
]

export const videoControlDefaultProps = {
  type: 'mp4' as const,
  url: '',
  autoplay: false,
  loop: false,
  controls: true,
  muted: false,
  width: '100%',
  height: '100%',
  poster: '',
  errorReload: 5,
  showPlaceholder: false,
  defaultImage: ''
}

const renderVideoControlPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <VideoWidget
          type={props.type}
          url={props.url}
          autoplay={props.autoplay}
          loop={props.loop}
          controls={props.controls}
          muted={props.muted}
          width={props.width}
          height={props.height}
          poster={props.poster}
          errorReload={props.errorReload}
          showPlaceholder={props.showPlaceholder}
          defaultImage={props.defaultImage}
          cellKey="preview"
        />
      </div>
    </div>
  )
}

const renderVideoControlCodePreview = (props: Record<string, any>) => {
  return `<VideoWidget
  type="${props.type}"
  url="${props.url}"
  autoplay={${props.autoplay}}
  loop={${props.loop}}
  controls={${props.controls}}
  muted={${props.muted}}
  width="${props.width}"
  height="${props.height}"
  poster="${props.poster}"
  errorReload={${props.errorReload}}
  showPlaceholder={${props.showPlaceholder}}
  defaultImage="${props.defaultImage}"
  cellKey="your-cell-key"
/>`
}

export const videoControlConfig: ComponentConfig = {
  id: 'videoControl',
  name: '视频播放器',
  propsConfig: videoControlPropsConfig,
  defaultProps: videoControlDefaultProps,
  renderPreview: renderVideoControlPreview,
  renderCodePreview: renderVideoControlCodePreview
}
