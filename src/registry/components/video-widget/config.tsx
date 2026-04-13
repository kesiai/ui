import { VideoWidget } from '@/registry/components/video-widget/video-widget'
import { ComponentConfig, PropConfig } from '@/app/config/types'
import documentationMd from './video-widget.md?raw'

// Default values aligned with workspace-v4 VideoCommon
const defaultJessConfigute = {
  videoBuffer: 1,
  isResize: false,
  hotKey: false,
  background: '',
  loadingText: "",
  debug: false,
  showBandwidth: false,
  supportDblclickFullscreen: false,
  keepScreenOn: false,
  hasAudio: true,
  rotate: 0,
  operateBtns: {
    fullscreen: true,
    screenshot: true,
    play: true,
    audio: true,
    record: true
  },
  forceNoOffscreen: true,
  isNotMute: false,
  useMSE: false,
  useWCS: false,
  wcsUseVideoRender: false,
  autoWasm: true,
  hiddenAutoPause: false,
  isFlv: false,
  timeout: 10,
  recordType: 'flv',
  showPerformance: {
    showAll: false,
    playMode: false,
    videoFormat: false,
    audioRate: false,
    videoRate: false,
    videoFrameRate: false,
    videoPeakFrameRate: false,
    decodingFrameRate: false,
    playSmooth: false,
    losingFrame: false,
    playDuration: false
  }
}

const defaultWebrtcConfig = {
  server: '',
  app: '',
  stream: '',
  secret: '',
  autoplay: true,
  muted: true,
  showLatency: true,
  showControls: true,
  debug: false,
  reconnectAttempts: 3,
  reconnectInterval: 5000
}

const defaultConfigure = {
  controls: true,
  resolution: '1920x1080',
  frameRate: 25
}

export const videoControlPropsConfig: PropConfig[] = [
  {
    name: 'videoType',
    label: '类型',
    type: 'select' as const,
    default: 'dataVideo',
    options: [
      { value: 'dataVideo', label: '设备表视频' },
      { value: 'customVideo', label: '自定义视频' }
    ],
    description: '选择视频来源类型'
  },
  {
    name: 'tableData',
    label: '设备',
    type: 'json' as const,
    default: JSON.stringify({}, null, 2),
    description: '选择设备表数据'
  },
  {
    name: 'warnTableData',
    label: '报警设备',
    type: 'json' as const,
    default: JSON.stringify({}, null, 2),
    description: '选择报警设备数据'
  },
  {
    name: 'streamType',
    label: '码流',
    type: 'select' as const,
    default: 'main',
    options: [
      { value: 'main', label: '主码流' },
      { value: 'sub', label: '子码流' }
    ]
  },
  {
    name: 'fullscreenStreamType',
    label: '全屏切换主码流',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'type',
    label: '视频类型',
    type: 'select' as const,
    default: '',
    options: [
      { value: 'mp4', label: 'MP4' },
      { value: 'flv', label: 'FLV 直播' },
      { value: 'hls', label: 'HLS 直播' },
      { value: 'rtsp', label: 'RTSP 拉流' },
      { value: 'rtmp', label: 'RTMP 直播' },
      { value: 'rtmp-ws', label: 'RTMP 拉流' },
      { value: 'ezopen', label: '萤石云' },
      { value: 'ws-raw', label: 'WS-RAW' },
      { value: 'webrtc', label: 'WebRTC' }
    ]
  },
  {
    name: 'urlSource',
    label: '地址来源',
    type: 'select' as const,
    default: 'url',
    options: [
      { value: 'url', label: '输入' },
      { value: 'uploadUrl', label: '上传' }
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
    name: 'uploadUrl',
    label: '视频列表',
    type: 'json' as const,
    default: JSON.stringify({}, null, 2),
    description: '上传视频配置'
  },
  {
    name: 'accessToken',
    label: '萤石云Token',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'videoAction',
    label: '播放类型',
    type: 'select' as const,
    default: 'preview',
    options: [
      { value: 'preview', label: '预览' },
      { value: 'record', label: '回放' }
    ]
  },
  {
    name: 'recordStartTime',
    label: '开始时间',
    type: 'text' as const,
    default: '',
    description: '回放开始时间'
  },
  {
    name: 'recordEndTime',
    label: '结束时间',
    type: 'text' as const,
    default: '',
    description: '回放结束时间'
  },
  {
    name: 'show',
    label: '显示占位图',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'defaultImage',
    label: '默认图片',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'configure',
    label: '高级配置',
    type: 'json' as const,
    default: JSON.stringify(defaultConfigure, null, 2),
    description: '高级配置参数'
  },
  {
    name: 'jessConfigute',
    label: 'Jessibuca配置',
    type: 'json' as const,
    default: JSON.stringify(defaultJessConfigute, null, 2),
    description: 'Jessibuca 播放器配置'
  },
  {
    name: 'webrtcConfig',
    label: 'WebRTC配置',
    type: 'json' as const,
    default: JSON.stringify(defaultWebrtcConfig, null, 2),
    description: 'WebRTC 播放配置'
  },
  {
    name: 'errorReload',
    label: '错误重连时间',
    type: 'number' as const,
    default: 5,
    min: 0,
    description: '视频异常重连时间(秒)'
  }
]

export const videoControlDefaultProps = {
  videoType: 'dataVideo',
  tableData: JSON.stringify({}),
  warnTableData: JSON.stringify({}),
  streamType: 'main',
  fullscreenStreamType: true,
  type: '',
  urlSource: 'url',
  url: '',
  uploadUrl: JSON.stringify({}),
  accessToken: '',
  videoAction: 'preview',
  recordStartTime: '',
  recordEndTime: '',
  show: false,
  defaultImage: '',
  configure: JSON.stringify(defaultConfigure),
  jessConfigute: JSON.stringify(defaultJessConfigute),
  webrtcConfig: JSON.stringify(defaultWebrtcConfig),
  errorReload: 5
}

const renderVideoControlPreview = (props: Record<string, any>) => {
  const parseJson = (val: any, defaultVal: any) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch {
        return defaultVal
      }
    }
    return val || defaultVal
  }

  const tableData = parseJson(props.tableData, {})
  const warnTableData = parseJson(props.warnTableData, {})
  const uploadUrl = parseJson(props.uploadUrl, {})
  const configure = parseJson(props.configure, defaultConfigure)
  const jessConfigute = parseJson(props.jessConfigute, defaultJessConfigute)
  const webrtcConfig = parseJson(props.webrtcConfig, defaultWebrtcConfig)

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full h-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-4">
        <VideoWidget
          videoType={props.videoType}
          tableData={tableData}
          warnTableData={warnTableData}
          streamType={props.streamType}
          fullscreenStreamType={props.fullscreenStreamType}
          type={props.type}
          urlSource={props.urlSource}
          url={props.url}
          uploadUrl={uploadUrl}
          accessToken={props.accessToken}
          videoAction={props.videoAction}
          recordStartTime={props.recordStartTime}
          recordEndTime={props.recordEndTime}
          show={props.show}
          defaultImage={props.defaultImage}
          configure={configure}
          jessConfigute={jessConfigute}
          webrtcConfig={webrtcConfig}
          errorReload={props.errorReload}
        />
      </div>
    </div>
  )
}

const renderVideoControlCodePreview = (props: Record<string, any>) => {
  const parseJson = (val: any, defaultVal: any) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val)
      } catch {
        return defaultVal
      }
    }
    return val || defaultVal
  }

  const tableData = parseJson(props.tableData, {})
  const warnTableData = parseJson(props.warnTableData, {})
  const uploadUrl = parseJson(props.uploadUrl, {})
  const configure = parseJson(props.configure, defaultConfigure)
  const jessConfigute = parseJson(props.jessConfigute, defaultJessConfigute)
  const webrtcConfig = parseJson(props.webrtcConfig, defaultWebrtcConfig)

  return `<VideoWidget
  videoType="${props.videoType}"
  tableData={${JSON.stringify(tableData)}}
  warnTableData={${JSON.stringify(warnTableData)}}
  streamType="${props.streamType}"
  fullscreenStreamType={${props.fullscreenStreamType}}
  type="${props.type}"
  urlSource="${props.urlSource}"
  url="${props.url}"
  uploadUrl={${JSON.stringify(uploadUrl)}}
  accessToken="${props.accessToken}"
  videoAction="${props.videoAction}"
  recordStartTime="${props.recordStartTime}"
  recordEndTime="${props.recordEndTime}"
  show={${props.show}}
  defaultImage="${props.defaultImage}"
  configure={${JSON.stringify(configure)}}
  jessConfigute={${JSON.stringify(jessConfigute)}}
  webrtcConfig={${JSON.stringify(webrtcConfig)}}
  errorReload={${props.errorReload}}
/>`
}

export const videoControlConfig: ComponentConfig = {
  id: 'video-widget',
  name: '视频播放器',
  propsConfig: videoControlPropsConfig,
  defaultProps: videoControlDefaultProps,
  renderPreview: renderVideoControlPreview,
  renderCodePreview: renderVideoControlCodePreview,
  documentation: documentationMd
}
