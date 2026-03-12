# 视频播放器

## 简介

`VideoWidget` 是一个功能强大的通用视频播放器组件，支持多种视频协议和流媒体格式，适用于实时监控、视频回放、直播等场景。

- **多协议支持**：支持 HLS、FLV、RTSP、RTMP、WebRTC、EZOPEN 等主流视频协议
- **灵活配置**：支持从数据点设备、自定义 URL 或上传的视频列表播放
- **直播与回放**：支持实时预览和历史录像回放两种模式
- **自动适配**：根据视频类型自动选择合适的播放器（原生、Jessibuca、CKPlayer、StreamVideo）
- **错误处理**：内置错误重连机制，确保播放稳定性

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `videoType` | `'dataVideo' \| 'customVideo'` | 否 | `'dataVideo'` | 视频来源类型，设备表视频或自定义视频 |
| `tableData` | `object` | 否 | `{}` | 设备表数据，包含设备 ID 和表信息 |
| `warnTableData` | `object` | 否 | `{}` | 报警设备数据，用于报警联动视频 |
| `streamType` | `'main' \| 'sub'` | 否 | `'main'` | 码流类型，主码流或子码流 |
| `fullscreenStreamType` | `boolean` | 否 | `true` | 全屏时是否切换到主码流 |
| `type` | `VideoType` | 否 | `''` | 视频类型，支持的协议类型 |
| `urlSource` | `'url' \| 'uploadUrl'` | 否 | `'url'` | 地址来源，输入或上传 |
| `url` | `string` | 否 | `''` | 视频 URL 地址 |
| `uploadUrl` | `object` | 否 | `{}` | 上传的视频列表配置 |
| `accessToken` | `string` | 否 | `''` | 萤石云访问 Token |
| `videoAction` | `'preview' \| 'record'` | 否 | `'preview'` | 播放类型，预览或回放 |
| `recordStartTime` | `string` | 否 | `''` | 回放开始时间 |
| `recordEndTime` | `string` | 否 | `''` | 回放结束时间 |
| `show` | `boolean` | 否 | `false` | 无视频时是否显示占位图 |
| `defaultImage` | `string` | 否 | `''` | 默认占位图片 URL |
| `configure` | `object` | 否 | 见下方 | 高级配置参数 |
| `jessConfigute` | `object` | 否 | 见下方 | Jessibuca 播放器配置 |
| `webrtcConfig` | `object` | 否 | 见下方 | WebRTC 播放配置 |
| `errorReload` | `number` | 否 | `5` | 错误重连时间（秒） |
| `cellKey` | `string` | 否 | - | 单元格唯一标识 |

### configure（高级配置）

视频播放器的高级配置对象，包含以下默认值：

```typescript
{
  controls: true,          // 是否显示控制栏
  resolution: '1920x1080', // 视频分辨率
  frameRate: 25            // 帧率
}
```

### jessConfigute（Jessibuca 配置）

Jessibuca 播放器的详细配置，用于 RTSP/WS-RAW 等协议：

```typescript
{
  videoBuffer: 1,           // 视频缓冲长度
  isResize: false,          // 是否自动调整大小
  hotKey: false,            // 是否启用快捷键
  background: '',           // 背景颜色
  loadingText: "",          // 加载提示文本
  debug: false,             // 是否开启调试模式
  showBandwidth: false,     // 是否显示带宽
  supportDblclickFullscreen: false,  // 是否支持双击全屏
  keepScreenOn: false,      // 是否保持屏幕常亮
  hasAudio: true,           // 是否有音频
  rotate: 0,                // 旋转角度
  operateBtns: {            // 操作按钮配置
    fullscreen: true,
    screenshot: true,
    play: true,
    audio: true,
    record: true
  },
  forceNoOffscreen: true,   // 强制不使用离屏渲染
  isNotMute: false,         // 是否取消静音
  useMSE: false,            // 是否使用 MSE
  useWCS: false,            // 是否使用 WCS
  wcsUseVideoRender: false, // WCS 是否使用视频渲染
  autoWasm: true,           // 是否自动加载 WASM
  hiddenAutoPause: false,   // 隐藏时是否自动暂停
  isFlv: false,             // 是否为 FLV
  timeout: 10,              // 超时时间
  recordType: 'flv',        // 录制类型
  showPerformance: {        // 性能显示配置
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
```

### webrtcConfig（WebRTC 配置）

WebRTC 播放器的配置：

```typescript
{
  server: '',                // WebRTC 服务器地址
  app: '',                   // 应用名称
  stream: '',               // 流名称
  secret: '',               // 密钥
  autoplay: true,           // 是否自动播放
  muted: true,              // 是否静音
  showLatency: true,        // 是否显示延迟
  showControls: true,       // 是否显示控制栏
  debug: false,             // 是否开启调试
  reconnectAttempts: 3,     // 重连尝试次数
  reconnectInterval: 5000   // 重连间隔（毫秒）
}
```

## 基本用法

### 1. 播放设备表视频

从设备表数据获取视频流并播放，适用于实时监控场景。

```tsx
import { VideoWidget } from '@/registry/components/airiot/video-widget/video-widget'

function Example() {
  const tableData = {
    id: 'device-001',
    table: { id: 'video-device-table' }
  }

  return (
    <VideoWidget
      videoType="dataVideo"
      tableData={tableData}
      streamType="main"
      type="hls"
      videoAction="preview"
      cellKey="live-preview"
    />
  )
}
```

### 2. 播放自定义 URL 视频

直接通过 URL 播放视频流，适用于已知的视频源地址。

```tsx
function Example() {
  return (
    <VideoWidget
      videoType="customVideo"
      type="hls"
      url="https://example.com/live/stream.m3u8"
      videoAction="preview"
      cellKey="custom-url"
    />
  )
}
```

### 3. RTSP 实时流播放

使用 Jessibuca 播放器播放 RTSP 实时流。

```tsx
function Example() {
  const tableData = {
    id: 'camera-001',
    table: { id: 'camera-table' }
  }

  return (
    <VideoWidget
      videoType="dataVideo"
      tableData={tableData}
      type="rtsp"
      streamType="main"
      jessConfigute={{
        videoBuffer: 0.5,
        hasAudio: true,
        operateBtns: {
          fullscreen: true,
          screenshot: true,
          play: true,
          audio: true,
          record: false
        }
      }}
      cellKey="rtsp-stream"
    />
  )
}
```

### 4. 视频回放

播放指定时间段的历史录像。

```tsx
function Example() {
  const tableData = {
    id: 'device-001',
    table: { id: 'video-device-table' }
  }

  return (
    <VideoWidget
      videoType="dataVideo"
      tableData={tableData}
      videoAction="record"
      recordStartTime="2024-01-01T00:00:00Z"
      recordEndTime="2024-01-01T23:59:59Z"
      cellKey="playback"
    />
  )
}
```

### 5. FLV 直播流播放

播放 FLV 格式的直播流。

```tsx
function Example() {
  return (
    <VideoWidget
      videoType="customVideo"
      type="flv"
      url="ws://example.com/live/stream.flv"
      videoAction="preview"
      cellKey="flv-live"
    />
  )
}
```

### 6. WebRTC 低延迟播放

使用 WebRTC 协议实现超低延迟的视频播放。

```tsx
function Example() {
  return (
    <VideoWidget
      videoType="customVideo"
      type="webrtc"
      url="webrtc://example.com/live/stream"
      webrtcConfig={{
        server: 'wss://example.com/ws',
        showLatency: true,
        reconnectAttempts: 5
      }}
      cellKey="webrtc-stream"
    />
  )
}
```

### 7. 萤石云视频播放

播放萤石云平台的视频流。

```tsx
function Example() {
  const tableData = {
    id: 'ezviz-camera-001',
    table: { id: 'ezviz-table' }
  }

  return (
    <VideoWidget
      videoType="dataVideo"
      tableData={tableData}
      type="ezopen"
      accessToken="your-access-token"
      videoAction="preview"
      cellKey="ezviz-stream"
    />
  )
}
```

## 完整示例

### 视频监控中心

创建一个包含多个视频播放器的监控中心界面。

```tsx
import { VideoWidget } from '@/registry/components/airiot/video-widget/video-widget'
import { useState } from 'react'

function MonitoringCenter() {
  const [selectedCamera, setSelectedCamera] = useState('cam-001')

  const cameras = [
    { id: 'cam-001', name: '入口监控', table: { id: 'camera-table' } },
    { id: 'cam-002', name: '出口监控', table: { id: 'camera-table' } },
    { id: 'cam-003', name: '大厅监控', table: { id: 'camera-table' } },
    { id: 'cam-004', name: '仓库监控', table: { id: 'camera-table' } }
  ]

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {cameras.map(camera => (
        <div key={camera.id} className="relative">
          <div className="absolute top-2 left-2 z-10 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {camera.name}
          </div>
          <VideoWidget
            videoType="dataVideo"
            tableData={camera}
            type="hls"
            streamType="main"
            videoAction="preview"
            configure={{
              controls: true,
              resolution: '1920x1080',
              frameRate: 25
            }}
            cellKey={`monitor-${camera.id}`}
          />
        </div>
      ))}
    </div>
  )
}
```

### 报警联动视频

当报警触发时自动播放关联的摄像头视频。

```tsx
import { VideoWidget } from '@/registry/components/airiot/video-widget/video-widget'
import { useEffect, useState } from 'react'

function AlarmLinkageVideo() {
  const [alarmData, setAlarmData] = useState(null)

  useEffect(() => {
    // 模拟接收报警数据
    const mockAlarm = {
      tableData: {
        id: 'alarm-001',
        table: { id: 'alarm-table' }
      },
      linkageVideo: {
        id: 'linked-camera-001',
        table: { id: 'camera-table' }
      }
    }
    setAlarmData(mockAlarm)
  }, [])

  return (
    <div className="w-full h-full">
      {alarmData && (
        <VideoWidget
          videoType="dataVideo"
          warnTableData={alarmData}
          type="rtsp"
          streamType="main"
          videoAction="preview"
          errorReload={3}
          cellKey="alarm-linkage"
        />
      )}
    </div>
  )
}
```

### 视频回放查询

支持日期和时间选择的视频回放功能。

```tsx
import { VideoWidget } from '@/registry/components/airiot/video-widget/video-widget'
import { useState } from 'react'

function VideoPlayback() {
  const [startTime, setStartTime] = useState('2024-01-01T00:00:00Z')
  const [endTime, setEndTime] = useState('2024-01-01T23:59:59Z')
  const [device, setDevice] = useState({
    id: 'device-001',
    table: { id: 'video-device-table' }
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <span>至</span>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button
          onClick={() => {/* 查询视频 */}}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          查询
        </button>
      </div>

      <div className="w-full h-96">
        <VideoWidget
          videoType="dataVideo"
          tableData={device}
          videoAction="record"
          recordStartTime={startTime}
          recordEndTime={endTime}
          cellKey="playback-query"
        />
      </div>
    </div>
  )
}
```

### 多协议自适应播放

根据设备类型自动选择最佳播放协议。

```tsx
import { VideoWidget } from '@/registry/components/airiot/video-widget/video-widget'

function AdaptiveVideoPlayer() {
  const devices = [
    { id: 'hls-device', protocol: 'hls' },
    { id: 'rtsp-device', protocol: 'rtsp' },
    { id: 'webrtc-device', protocol: 'webrtc' }
  ]

  return (
    <div className="space-y-4">
      {devices.map(device => (
        <div key={device.id} className="border rounded p-4">
          <h3 className="text-lg font-semibold mb-2">
            {device.id} ({device.protocol})
          </h3>
          <VideoWidget
            videoType="dataVideo"
            tableData={{
              id: device.id,
              table: { id: 'video-device-table' }
            }}
            type={device.protocol}
            streamType="main"
            videoAction="preview"
            cellKey={`adaptive-${device.id}`}
          />
        </div>
      ))}
    </div>
  )
}
```

## 注意事项

1. **视频类型匹配**：确保 `type` 属性与实际视频流的协议类型匹配，否则可能无法正常播放

2. **设备表数据格式**：`tableData` 必须包含 `id` 和 `table.id` 字段，格式应为 `{ id: 'device-id', table: { id: 'table-id' } }`

3. **时间格式**：回放时间需使用 ISO 8601 格式，如 `2024-01-01T00:00:00Z`

4. **HTTPS 限制**：某些协议（如 RTMP）在 HTTPS 环境下可能需要特殊的代理或转换

5. **性能优化**：建议主码流用于重要监控，子码流用于多画面预览以节省带宽

6. **错误重连**：设置合理的 `errorReload` 值，避免频繁重连导致服务器压力

7. **浏览器兼容性**：HLS 在某些浏览器（如 Firefox）中可能需要使用 hls.js 等库

8. **跨域问题**：自定义 URL 需确保服务器配置了正确的 CORS 策略

9. **内存管理**：长时间使用多个播放器时注意监控内存使用，及时销毁不需要的实例

10. **音频权限**：自动播放视频时建议启用 `muted` 属性以避免浏览器权限限制
