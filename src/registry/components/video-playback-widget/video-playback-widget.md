# 视频回放

## 简介

`VideoPlaybackWidget` 是一个功能完整的视频回放组件，集成了视频播放器、时间轴和播放控制，提供直观的录像回放体验。

- **时间轴导航**：可视化时间轴显示录像分布，支持拖拽和点击定位
- **日期选择**：内置日期选择器，快速切换不同日期的录像
- **精确控制**：支持时:分:秒级别的精确时间定位
- **播放控制**：提供播放/暂停按钮，控制录像播放状态
- **自动定位**：自动查找最近的录像时间段并播放
- **实时显示**：显示当前播放时间的实时状态

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `videoHeight` | `number` | 否 | `400` | 视频播放区域高度（像素） |
| `timelineHeight` | `number` | 否 | `50` | 时间轴高度（像素） |
| `date` | `Date` | 否 | `new Date()` | 当前选择的日期 |
| `onDateChange` | `(date: Date) => void` | 否 | - | 日期改变回调函数 |
| `videoRecords` | `VideoRecord[]` | 否 | `[]` | 视频录像记录数组 |
| `isPlaying` | `boolean` | 否 | `false` | 是否正在播放 |
| `onPlayChange` | `(playing: boolean) => void` | 否 | - | 播放状态改变回调 |
| `currentTime` | `number` | 否 | 当前时间戳 | 当前时间（秒级时间戳） |
| `onTimeChange` | `(time: number) => void` | 否 | - | 时间改变回调函数 |
| `videoUrl` | `string` | 否 | - | 视频 URL（可选，优先使用 tableData） |
| `tableData` | `object` | 否 | `{}` | 设备信息，用于获取录像 |
| `backgroundColor` | `string` | 否 | `'rgba(13, 14, 27, 0.7)'` | 视频区背景颜色 |
| `timelineBackground` | `string` | 否 | `'rgb(55, 65, 81)'` | 时间轴背景颜色 |
| `timelineScaleColor` | `string` | 否 | `'rgb(255, 255, 255)'` | 时间轴刻度颜色 |
| `cellKey` | `string` | 否 | `'playback'` | 单元格唯一标识 |

### VideoRecord（录像记录）

录像记录对象的类型定义：

```typescript
interface VideoRecord {
  startTime: number  // 开始时间（秒级时间戳）
  endTime: number    // 结束时间（秒级时间戳）
}
```

### TimeHMS（时分秒）

时分秒选择器的值类型：

```typescript
interface TimeHMS {
  hour: string    // 小时（00-23）
  minute: string  // 分钟（00-59）
  second: string  // 秒（00-59）
}
```

## 基本用法

### 1. 基础回放功能

使用设备数据进行视频回放的最简单方式。

```tsx
import { VideoPlaybackWidget } from '@/registry/components/video-playback-widget/video-playback-widget'
import { useState } from 'react'

function Example() {
  const [date, setDate] = useState(new Date())
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))

  const tableData = {
    id: 'device-001',
    table: { id: 'video-device-table' }
  }

  return (
    <VideoPlaybackWidget
      tableData={tableData}
      date={date}
      onDateChange={setDate}
      isPlaying={isPlaying}
      onPlayChange={setIsPlaying}
      currentTime={currentTime}
      onTimeChange={setCurrentTime}
    />
  )
}
```

### 2. 自定义录像数据

手动提供录像记录数据，不依赖设备表。

```tsx
function Example() {
  const dayStart = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000)

  const videoRecords = [
    {
      startTime: dayStart + 8 * 3600,  // 08:00
      endTime: dayStart + 10 * 3600     // 10:00
    },
    {
      startTime: dayStart + 14 * 3600,  // 14:00
      endTime: dayStart + 16 * 3600     // 16:00
    }
  ]

  return (
    <VideoPlaybackWidget
      videoRecords={videoRecords}
      date={new Date()}
      videoHeight={500}
      timelineHeight={60}
    />
  )
}
```

### 3. 自定义样式

自定义时间轴和视频区域的颜色样式。

```tsx
function Example() {
  return (
    <VideoPlaybackWidget
      tableData={tableData}
      backgroundColor="rgb(0, 0, 0)"
      timelineBackground="rgb(30, 41, 59)"
      timelineScaleColor="rgb(100, 116, 139)"
      videoHeight={450}
      timelineHeight={55}
    />
  )
}
```

### 4. 响应式尺寸

根据容器大小动态调整视频和时间轴尺寸。

```tsx
function Example() {
  const [videoHeight, setVideoHeight] = useState(400)

  return (
    <div className="w-full">
      <button onClick={() => setVideoHeight(videoHeight + 50)}>
        增大视频
      </button>
      <VideoPlaybackWidget
        tableData={tableData}
        videoHeight={videoHeight}
        timelineHeight={Math.max(30, videoHeight / 10)}
      />
    </div>
  )
}
```

### 5. 事件监听

监听并响应各种用户交互事件。

```tsx
function Example() {
  const [events, setEvents] = useState([])

  const handleDateChange = (date) => {
    setEvents(prev => [...prev, `日期切换: ${date.toLocaleDateString()}`])
  }

  const handlePlayChange = (playing) => {
    setEvents(prev => [...prev, playing ? '开始播放' : '暂停播放'])
  }

  const handleTimeChange = (time) => {
    const date = new Date(time * 1000)
    setEvents(prev => [...prev, `时间变更: ${date.toLocaleTimeString()}`])
  }

  return (
    <div>
      <VideoPlaybackWidget
        tableData={tableData}
        onDateChange={handleDateChange}
        onPlayChange={handlePlayChange}
        onTimeChange={handleTimeChange}
      />
      <div className="mt-4">
        {events.map((event, i) => (
          <div key={i}>{event}</div>
        ))}
      </div>
    </div>
  )
}
```

### 6. 多设备对比

同时播放多个设备的录像进行对比。

```tsx
function Example() {
  const devices = [
    { id: 'cam-001', name: '入口' },
    { id: 'cam-002', name: '出口' }
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {devices.map(device => (
        <div key={device.id}>
          <h3>{device.name}</h3>
          <VideoPlaybackWidget
            tableData={{
              id: device.id,
              table: { id: 'camera-table' }
            }}
            videoHeight={300}
            timelineHeight={40}
            cellKey={`playback-${device.id}`}
          />
        </div>
      ))}
    </div>
  )
}
```

### 7. 时间范围限制

限制回放的日期范围，不允许选择未来日期。

```tsx
import { VideoPlaybackWidget } from '@/registry/components/video-playback-widget/video-playback-widget'

function Example() {
  const [date, setDate] = useState(new Date())

  const handleDateChange = (newDate) => {
    // 不允许选择未来日期
    if (newDate <= new Date()) {
      setDate(newDate)
    }
  }

  return (
    <VideoPlaybackWidget
      tableData={tableData}
      date={date}
      onDateChange={handleDateChange}
    />
  )
}
```

## 完整示例

### 监控回放系统

创建一个完整的监控录像回放系统，包含设备选择、日期选择和录像播放。

```tsx
import { VideoPlaybackWidget } from '@/registry/components/video-playback-widget/video-playback-widget'
import { useState } from 'react'

function MonitoringPlaybackSystem() {
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [date, setDate] = useState(new Date())
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))

  const devices = [
    { id: 'cam-001', name: '入口监控', table: { id: 'camera-table' } },
    { id: 'cam-002', name: '出口监控', table: { id: 'camera-table' } },
    { id: 'cam-003', name: '大厅监控', table: { id: 'camera-table' } }
  ]

  return (
    <div className="flex flex-col h-screen">
      {/* 顶部设备选择栏 */}
      <div className="bg-slate-800 text-white p-4">
        <div className="flex items-center gap-4">
          <label>选择设备:</label>
          <select
            value={selectedDevice?.id || ''}
            onChange={(e) => {
              const device = devices.find(d => d.id === e.target.value)
              setSelectedDevice(device)
            }}
            className="bg-slate-700 rounded px-3 py-2"
          >
            <option value="">请选择</option>
            {devices.map(device => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 回放区域 */}
      <div className="flex-1 bg-slate-900 p-4">
        {selectedDevice ? (
          <VideoPlaybackWidget
            tableData={selectedDevice}
            date={date}
            onDateChange={setDate}
            isPlaying={isPlaying}
            onPlayChange={setIsPlaying}
            currentTime={currentTime}
            onTimeChange={setCurrentTime}
            videoHeight={500}
            timelineHeight={60}
            backgroundColor="rgb(0, 0, 0)"
            timelineBackground="rgb(30, 41, 59)"
            timelineScaleColor="rgb(255, 255, 255)"
            cellKey="monitoring-playback"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            请选择要回放的设备
          </div>
        )}
      </div>

      {/* 状态栏 */}
      <div className="bg-slate-800 text-white p-2 text-sm">
        <div className="flex justify-between">
          <span>设备: {selectedDevice?.name || '-'}</span>
          <span>日期: {date.toLocaleDateString()}</span>
          <span>状态: {isPlaying ? '播放中' : '已暂停'}</span>
          <span>时间: {new Date(currentTime * 1000).toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
```

### 事件检索回放

根据事件时间快速定位并播放相关录像。

```tsx
import { VideoPlaybackWidget } from '@/registry/components/video-playback-widget/video-playback-widget'
import { useState, useEffect } from 'react'

function EventPlayback() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))
  const [date, setDate] = useState(new Date())

  const events = [
    {
      id: 'evt-001',
      name: '移动侦测',
      time: new Date('2024-01-01T10:30:00'),
      deviceId: 'cam-001'
    },
    {
      id: 'evt-002',
      name: '入侵报警',
      time: new Date('2024-01-01T14:45:00'),
      deviceId: 'cam-002'
    }
  ]

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    const eventTime = Math.floor(event.time.getTime() / 1000)
    setCurrentTime(eventTime)
    setDate(event.time)
  }

  return (
    <div className="flex h-screen">
      {/* 左侧事件列表 */}
      <div className="w-64 bg-slate-100 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">事件列表</h2>
        {events.map(event => (
          <div
            key={event.id}
            onClick={() => handleEventClick(event)}
            className={`p-3 rounded mb-2 cursor-pointer transition-colors ${
              selectedEvent?.id === event.id
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-slate-200'
            }`}
          >
            <div className="font-medium">{event.name}</div>
            <div className="text-sm opacity-75">
              {event.time.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* 右侧回放区域 */}
      <div className="flex-1 bg-slate-900 p-4">
        {selectedEvent && (
          <VideoPlaybackWidget
            tableData={{
              id: selectedEvent.deviceId,
              table: { id: 'camera-table' }
            }}
            date={date}
            onDateChange={setDate}
            currentTime={currentTime}
            onTimeChange={setCurrentTime}
            cellKey={`event-playback-${selectedEvent.id}`}
          />
        )}
      </div>
    </div>
  )
}
```

### 录像片段标注

在回放视频时添加事件标注功能。

```tsx
import { VideoPlaybackWidget } from '@/registry/components/video-playback-widget/video-playback-widget'
import { useState } from 'react'

function AnnotatedPlayback() {
  const [markers, setMarkers] = useState([])
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))
  const [date, setDate] = useState(new Date())

  const addMarker = () => {
    const newMarker = {
      id: Date.now(),
      time: currentTime,
      note: `标注 ${markers.length + 1}`
    }
    setMarkers([...markers, newMarker])
  }

  const jumpToMarker = (marker) => {
    setCurrentTime(marker.time)
    setDate(new Date(marker.time * 1000))
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 回放区域 */}
      <div className="flex-1">
        <VideoPlaybackWidget
          tableData={tableData}
          date={date}
          onDateChange={setDate}
          currentTime={currentTime}
          onTimeChange={setCurrentTime}
        />
      </div>

      {/* 标注控制栏 */}
      <div className="bg-slate-800 text-white p-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={addMarker}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            添加标注
          </button>
          <span className="text-sm">
            当前时间: {new Date(currentTime * 1000).toLocaleTimeString()}
          </span>
        </div>

        {/* 标注列表 */}
        <div className="flex gap-2 overflow-x-auto">
          {markers.map(marker => (
            <button
              key={marker.id}
              onClick={() => jumpToMarker(marker)}
              className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-sm"
            >
              {marker.note}
              <span className="ml-2 text-slate-400">
                {new Date(marker.time * 1000).toLocaleTimeString()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

## 注意事项

1. **时间戳格式**：`currentTime` 必须使用秒级时间戳（Unix timestamp），而不是毫秒级

2. **日期同步**：当修改 `currentTime` 跨越日期边界时，需要同步更新 `date` 属性

3. **录像查询**：组件会自动根据 `date` 查询当天录像，确保设备表数据正确

4. **自动定位**：时间点击或拖拽后，组件会自动查找并定位到最近的录像段

5. **性能考虑**：录像记录较多时建议分页加载，避免一次性加载大量数据

6. **时区处理**：日期和时间使用本地时区，API 调用时需要转换为 UTC 格式

7. **样式覆盖**：时间轴刻度颜色建议与背景色有足够对比度，确保可读性

8. **响应式设计**：视频和时间轴高度应根据容器大小动态调整

9. **状态管理**：建议使用 React 状态管理 `date`、`isPlaying` 和 `currentTime`

10. **错误处理**：当某时段无录像时，组件会显示"暂无视频"提示
