### ⚠️ 组合使用说明

> **重要**: video-time-axis 是 视频系统 的子组件，不能单独使用。
>
> 必须配合父组件 video-widget 使用。请查看 [视频系统 完整指南](data/video-system.md) 了解正确的使用方法。

# 视频时间轴

## 简介

`TimeAxisWidget` 是一个专业的视频时间轴组件，用于可视化显示视频录像分布并提供精确的时间导航功能。

- **可视化展示**：清晰展示视频录像的时间段分布，用黄色区域标识
- **精确导航**：支持拖拽和点击操作，精确到分钟级别的时间定位
- **实时提示**：鼠标悬停显示当前位置的精确时间
- **自动获取**：支持从设备自动获取录像记录数据
- **高度可定制**：支持自定义颜色、尺寸等外观属性
- **只读模式**：提供只读模式，禁用编辑功能

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `width` | `number` | 否 | `600` | 时间轴宽度（像素） |
| `height` | `number` | 否 | `50` | 时间轴高度（像素） |
| `currentTime` | `number` | 否 | 当前时间戳 | 当前时间（秒级时间戳） |
| `videoRecords` | `VideoRecord[]` | 否 | `[]` | 视频录像记录数组 |
| `tableData` | `object` | 否 | `{}` | 设备信息，用于自动获取录像 |
| `axisConfiguration` | `AxisConfiguration` | 否 | 见下方 | 时间轴配置对象 |
| `onTimeChange` | `(time: number, direction?: 'left' \| 'right') => void` | 否 | - | 时间改变回调函数 |
| `readonly` | `boolean` | 否 | `false` | 是否启用只读模式 |
| `cellKey` | `string` | 否 | `'default'` | 单元格唯一标识 |

### AxisConfiguration（时间轴配置）

时间轴的外观配置对象：

```typescript
interface AxisConfiguration {
  scaleColor?: string    // 刻度颜色，默认 '#ffffff'
  background?: string    // 背景颜色，默认 '#374151'
  textColor?: string     // 文字颜色，默认 '#ffffff'
  textSize?: number      // 文字大小，默认 12
}
```

### VideoRecord（录像记录）

录像记录支持多种时间格式：

```typescript
interface VideoRecord {
  startTime: number | string  // 开始时间（秒级时间戳或字符串）
  endTime: number | string    // 结束时间（秒级时间戳或字符串）
  StartTime?: string          // 可选的 ISO 时间字符串
  EndTime?: string            // 可选的 ISO 时间字符串
}
```

## 基本用法

### 1. 基础时间轴

使用默认配置创建一个简单的时间轴。

```tsx
import { TimeAxisWidget } from '@/components/kesi/video-time-axis/time-axis'
import { useState } from 'react'

function Example() {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))

  const handleTimeChange = (time, direction) => {
    setCurrentTime(time)
    console.log(`时间变化: ${new Date(time * 1000).toLocaleString()}, 方向: ${direction}`)
  }

  return (
    <TimeAxisWidget
      currentTime={currentTime}
      onTimeChange={handleTimeChange}
    />
  )
}
```

### 2. 显示录像分布

在时间轴上显示视频录像的时间段。

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
    <TimeAxisWidget
      currentTime={Math.floor(Date.now() / 1000)}
      videoRecords={videoRecords}
      onTimeChange={(time) => console.log('跳转到:', new Date(time * 1000))}
    />
  )
}
```

### 3. 自定义样式

自定义时间轴的颜色和尺寸。

```tsx
function Example() {
  const axisConfiguration = {
    scaleColor: '#94a3b8',
    background: '#1e293b',
    textColor: '#cbd5e1',
    textSize: 14
  }

  return (
    <TimeAxisWidget
      width={800}
      height={60}
      currentTime={Math.floor(Date.now() / 1000)}
      axisConfiguration={axisConfiguration}
      onTimeChange={(time) => console.log('时间:', time)}
    />
  )
}
```

### 4. 只读模式

禁用时间轴的拖拽和点击功能。

```tsx
function Example() {
  return (
    <TimeAxisWidget
      currentTime={Math.floor(Date.now() / 1000)}
      readonly={true}
      videoRecords={videoRecords}
    />
  )
}
```

### 5. 自动获取录像

通过设备数据自动获取录像记录。

```tsx
function Example() {
  const tableData = {
    id: 'device-001',
    table: { id: 'video-device-table' }
  }

  return (
    <TimeAxisWidget
      tableData={tableData}
      currentTime={Math.floor(Date.now() / 1000)}
      onTimeChange={(time) => {
        console.log('查询时间:', new Date(time * 1000))
      }}
      cellKey="auto-records"
    />
  )
}
```

### 6. 监听拖拽方向

区分用户向左或向右拖拽时间轴。

```tsx
function Example() {
  const [direction, setDirection] = useState(null)

  const handleTimeChange = (time, dir) => {
    setDirection(dir)
    console.log(`向${dir === 'left' ? '后' : '前'}拖拽到:`, new Date(time * 1000))
  }

  return (
    <div>
      <div>拖拽方向: {direction || '无'}</div>
      <TimeAxisWidget
        currentTime={Math.floor(Date.now() / 1000)}
        onTimeChange={handleTimeChange}
      />
    </div>
  )
}
```

### 7. 动态更新录像

录像数据变化时自动刷新显示。

```tsx
function Example() {
  const [records, setRecords] = useState([])
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))

  const loadRecords = async (date) => {
    // 模拟从服务器获取录像
    const newRecords = await fetchVideoRecords(date)
    setRecords(newRecords)
  }

  return (
    <div>
      <button onClick={() => loadRecords(new Date())}>
        刷新录像
      </button>
      <TimeAxisWidget
        currentTime={currentTime}
        videoRecords={records}
        onTimeChange={setCurrentTime}
      />
    </div>
  )
}
```

## 完整示例

### 录像查询系统

创建一个完整的录像查询界面，时间轴与视频播放器联动。

```tsx
import { TimeAxisWidget } from '@/components/kesi/video-time-axis/time-axis'
import { VideoWidget } from '@/components/kesi/video-widget/video-widget'
import { useState, useEffect } from 'react'

function VideoQuerySystem() {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))
  const [videoRecords, setVideoRecords] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [device, setDevice] = useState({
    id: 'device-001',
    table: { id: 'video-device-table' }
  })

  // 当时间改变时，查询并播放视频
  const handleTimeChange = (time, direction) => {
    setCurrentTime(time)
    setSelectedTime(time)

    // 检查该时间是否有录像
    const hasVideo = videoRecords.some(record => {
      const start = typeof record.startTime === 'number'
        ? record.startTime
        : parseInt(record.startTime)
      const end = typeof record.endTime === 'number'
        ? record.endTime
        : parseInt(record.endTime)
      return time >= start && time <= end
    })

    if (hasVideo) {
      console.log('播放视频:', new Date(time * 1000))
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      {/* 视频播放区域 */}
      <div className="flex-1 p-4">
        <div className="w-full h-full bg-black rounded-lg overflow-hidden">
          {selectedTime ? (
            <VideoWidget
              tableData={device}
              videoAction="record"
              recordStartTime={new Date(selectedTime * 1000).toISOString()}
              recordEndTime={new Date((selectedTime + 3600) * 1000).toISOString()}
              cellKey="query-system"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              请在时间轴上选择时间
            </div>
          )}
        </div>
      </div>

      {/* 时间轴区域 */}
      <div className="p-4 bg-slate-800">
        <div className="mb-2 text-sm">
          当前时间: {new Date(currentTime * 1000).toLocaleString()}
        </div>
        <TimeAxisWidget
          width={window.innerWidth - 32}
          height={60}
          currentTime={currentTime}
          videoRecords={videoRecords}
          tableData={device}
          axisConfiguration={{
            scaleColor: '#94a3b8',
            background: '#1e293b',
            textColor: '#cbd5e1',
            textSize: 12
          }}
          onTimeChange={handleTimeChange}
          cellKey="query-timeline"
        />
      </div>
    </div>
  )
}
```

### 多设备时间轴对比

并排显示多个设备的时间轴，方便对比查看。

```tsx
function MultiDeviceTimeline() {
  const devices = [
    { id: 'cam-001', name: '入口', table: { id: 'camera-table' } },
    { id: 'cam-002', name: '出口', table: { id: 'camera-table' } },
    { id: 'cam-003', name: '大厅', table: { id: 'camera-table' } }
  ]

  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))
  const [records, setRecords] = useState({})

  // 同步所有时间轴的当前时间
  const handleTimeChange = (time) => {
    setCurrentTime(time)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">多设备录像对比</h2>

      <div className="space-y-4">
        {devices.map(device => (
          <div key={device.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{device.name}</h3>
              <span className="text-sm text-gray-500">
                {new Date(currentTime * 1000).toLocaleTimeString()}
              </span>
            </div>

            <TimeAxisWidget
              width={800}
              height={50}
              currentTime={currentTime}
              videoRecords={records[device.id] || []}
              tableData={device}
              axisConfiguration={{
                scaleColor: '#64748b',
                background: '#f1f5f9',
                textColor: '#475569',
                textSize: 11
              }}
              onTimeChange={handleTimeChange}
              cellKey={`timeline-${device.id}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 时间轴标注系统

在时间轴上添加自定义标注点。

```tsx
function AnnotatedTimeline() {
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))
  const [markers, setMarkers] = useState([])

  const addMarker = () => {
    const newMarker = {
      id: Date.now(),
      time: currentTime,
      label: `标注 ${markers.length + 1}`,
      color: ['red', 'blue', 'green', 'orange'][markers.length % 4]
    }
    setMarkers([...markers, newMarker])
  }

  const jumpToMarker = (marker) => {
    setCurrentTime(marker.time)
  }

  return (
    <div className="p-4">
      {/* 工具栏 */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={addMarker}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          添加标注
        </button>
        <span className="text-sm text-gray-600">
          当前时间: {new Date(currentTime * 1000).toLocaleTimeString()}
        </span>
      </div>

      {/* 时间轴 */}
      <TimeAxisWidget
        width={800}
        height={60}
        currentTime={currentTime}
        onTimeChange={setCurrentTime}
        cellKey="annotated-timeline"
      />

      {/* 标注列表 */}
      <div className="mt-4">
        <h3 className="font-medium mb-2">标注列表</h3>
        <div className="flex flex-wrap gap-2">
          {markers.map(marker => (
            <button
              key={marker.id}
              onClick={() => jumpToMarker(marker)}
              className="px-3 py-1 rounded text-sm text-white"
              style={{ backgroundColor: marker.color }}
            >
              {marker.label}
              <span className="ml-1 opacity-75">
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

### 时间轴缩放

支持不同时间范围的时间轴显示。

```tsx
function ZoomableTimeline() {
  const [zoom, setZoom] = useState('day') // 'hour', 'day', 'week'
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))

  const zoomSettings = {
    hour: { width: 1200, height: 80, label: '1小时' },
    day: { width: 800, height: 50, label: '24小时' },
    week: { width: 1200, height: 40, label: '7天' }
  }

  const settings = zoomSettings[zoom]

  return (
    <div>
      {/* 缩放控制 */}
      <div className="mb-4 flex gap-2">
        {Object.entries(zoomSettings).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setZoom(key)}
            className={`px-4 py-2 rounded ${
              zoom === key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {value.label}
          </button>
        ))}
      </div>

      {/* 时间轴 */}
      <TimeAxisWidget
        width={settings.width}
        height={settings.height}
        currentTime={currentTime}
        onTimeChange={setCurrentTime}
        cellKey={`zoomable-${zoom}`}
      />
    </div>
  )
}
```

## 注意事项

1. **时间戳格式**：`currentTime` 必须使用秒级时间戳（Unix timestamp），不要使用毫秒级

2. **录像格式**：`videoRecords` 中的时间可以是数字（秒级时间戳）或字符串

3. **性能优化**：录像记录较多时（超过 100 条），建议虚拟滚动或分片渲染

4. **边界处理**：拖拽时间轴时会自动限制在录像的时间范围内

5. **颜色对比**：刻度和文字颜色应与背景色有足够对比度，确保可读性

6. **响应式设计**：组件宽度固定，如需响应式应在父组件中动态计算宽度

7. **只读模式**：设置 `readonly` 后，时间轴不再响应点击和拖拽事件

8. **数据同步**：当 `tableData` 改变时，会自动重新获取录像记录

9. **时区处理**：时间使用本地时区显示，内部转换为 UTC 进行计算

10. **画布渲染**：使用 Canvas 渲染，确保在支持 Canvas 的浏览器中使用
