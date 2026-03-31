> **安装命令**: `npx shadcn@latest add @kesi/video-button`

# 云台控制

## 简介

`ButtonWidget` 是一个专业的视频云台控制组件，提供全方位的摄像头云台操作界面。

- **8方向控制**：支持上、下、左、右及四个斜向的精确云台控制
- **变焦控制**：提供放大和缩小按钮，控制摄像头焦距
- **双模式**：支持点击和按住两种操作模式，适应不同使用习惯
- **品牌适配**：内置海康和萤石两种云台协议支持
- **自动指令**：根据设备表自动获取云台命令并发送
- **精美界面**：圆形布局设计，直观易用

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `size` | `number \| string` | 否 | `220` | 控制器尺寸（像素或 CSS 尺寸值） |
| `bg` | `string` | 否 | `'rgb(34, 38, 65)'` | 背景颜色 |
| `btnColor` | `string` | 否 | `'rgb(117, 124, 153)'` | 按钮图标颜色 |
| `controlMode` | `'click' \| 'hold'` | 否 | `'hold'` | 控制模式，点击或按住 |
| `disable` | `boolean` | 否 | `false` | 是否禁用控制 |
| `tableData` | `object` | 否 | `{}` | 设备表数据 |
| `table` | `object` | 否 | `{}` | 设备表信息 |
| `buttonType` | `'hk' \| 'ez'` | 否 | `'hk'` | 云台类型，海康或萤石 |
| `onActionClick` | `(action: PtzAction) => void` | 否 | - | 点击动作回调 |
| `onActionStart` | `(action: PtzAction) => void` | 否 | - | 动作开始回调 |
| `onActionEnd` | `(action: PtzAction) => void` | 否 | - | 动作结束回调 |
| `cellKey` | `string` | 否 | - | 单元格唯一标识 |

### PtzAction（云台动作）

支持的所有云台控制动作：

```typescript
type PtzAction =
  | "up"        // 上
  | "down"      // 下
  | "left"      // 左
  | "right"     // 右
  | "upLeft"    // 左上
  | "upRight"   // 右上
  | "downLeft"  // 左下
  | "downRight" // 右下
  | "zoomIn"    // 放大
  | "zoomOut"   // 缩小
```

## 基本用法

### 1. 基础云台控制

使用设备数据进行云台控制的最简单方式。

```tsx
import { ButtonWidget } from '@/components/kesi/video-button/video-button'

function Example() {
  const tableData = {
    id: 'camera-001',
    table: { id: 'ptz-camera-table' }
  }

  return (
    <ButtonWidget
      tableData={tableData}
      buttonType="hk"
      cellKey="ptz-control"
    />
  )
}
```

### 2. 自定义样式

自定义控制器的颜色和尺寸。

```tsx
function Example() {
  return (
    <ButtonWidget
      tableData={tableData}
      size={280}
      bg="rgb(15, 23, 42)"
      btnColor="rgb(148, 163, 184)"
      cellKey="custom-style"
    />
  )
}
```

### 3. 点击模式

使用点击模式而非按住模式操作云台。

```tsx
function Example() {
  return (
    <ButtonWidget
      tableData={tableData}
      controlMode="click"
      buttonType="hk"
      cellKey="click-mode"
    />
  )
}
```

### 4. 萤石云台

使用萤石云台协议。

```tsx
function Example() {
  return (
    <ButtonWidget
      tableData={tableData}
      buttonType="ez"
      controlMode="click"
      cellKey="ezviz-ptz"
    />
  )
}
```

### 5. 响应式尺寸

根据容器大小动态调整控制器尺寸。

```tsx
function Example() {
  const [size, setSize] = useState(220)

  return (
    <div>
      <input
        type="range"
        min="150"
        max="400"
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
      />
      <ButtonWidget
        tableData={tableData}
        size={size}
        cellKey="responsive-size"
      />
    </div>
  )
}
```

### 6. 事件监听

监听云台控制的各种动作。

```tsx
function Example() {
  const [currentAction, setCurrentAction] = useState(null)

  const handleActionStart = (action) => {
    setCurrentAction(`开始: ${action}`)
  }

  const handleActionEnd = (action) => {
    setCurrentAction(`结束: ${action}`)
  }

  return (
    <div>
      <div className="mb-4">当前动作: {currentAction || '无'}</div>
      <ButtonWidget
        tableData={tableData}
        buttonType="hk"
        controlMode="hold"
        onActionStart={handleActionStart}
        onActionEnd={handleActionEnd}
        cellKey="event-listener"
      />
    </div>
  )
}
```

### 7. 条件禁用

根据特定条件禁用云台控制。

```tsx
function Example() {
  const [hasPermission, setHasPermission] = useState(true)

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={hasPermission}
          onChange={(e) => setHasPermission(e.target.checked)}
        />
        有控制权限
      </label>

      <ButtonWidget
        tableData={tableData}
        disable={!hasPermission}
        cellKey="conditional-disable"
      />
    </div>
  )
}
```

## 完整示例

### 视频监控控制台

创建一个包含视频播放和云台控制的完整监控控制台。

```tsx
import { ButtonWidget } from '@/components/kesi/video-button/video-button'
import { VideoWidget } from '@/components/kesi/video-widget/video-widget'
import { useState } from 'react'

function MonitoringConsole() {
  const [selectedCamera, setSelectedCamera] = useState(null)
  const [ptzAction, setPtzAction] = useState('')

  const cameras = [
    { id: 'cam-001', name: '大厅', table: { id: 'ptz-camera-table' } },
    { id: 'cam-002', name: '入口', table: { id: 'ptz-camera-table' } },
    { id: 'cam-003', name: '出口', table: { id: 'ptz-camera-table' } }
  ]

  const handleActionStart = (action) => {
    setPtzAction(`正在执行: ${action}`)
  }

  const handleActionEnd = (action) => {
    setTimeout(() => setPtzAction(''), 1000)
  }

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* 左侧视频区域 */}
      <div className="flex-1 p-4">
        <div className="w-full h-full bg-black rounded-lg overflow-hidden">
          {selectedCamera ? (
            <VideoWidget
              tableData={selectedCamera}
              type="hls"
              videoAction="preview"
              cellKey="console-video"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              请选择摄像头
            </div>
          )}
        </div>
      </div>

      {/* 右侧控制面板 */}
      <div className="w-80 bg-slate-800 p-4 flex flex-col">
        {/* 摄像头选择 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">摄像头选择</h2>
          <div className="space-y-2">
            {cameras.map(camera => (
              <button
                key={camera.id}
                onClick={() => setSelectedCamera(camera)}
                className={`w-full px-4 py-2 rounded text-left transition-colors ${
                  selectedCamera?.id === camera.id
                    ? 'bg-blue-500'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {camera.name}
              </button>
            ))}
          </div>
        </div>

        {/* 云台控制 */}
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">云台控制</h2>

          {ptzAction && (
            <div className="mb-4 px-4 py-2 bg-blue-500/20 rounded text-blue-300 text-sm">
              {ptzAction}
            </div>
          )}

          {selectedCamera ? (
            <ButtonWidget
              tableData={selectedCamera}
              table={selectedCamera.table}
              size={240}
              buttonType="hk"
              controlMode="hold"
              onActionStart={handleActionStart}
              onActionEnd={handleActionEnd}
              cellKey="console-ptz"
            />
          ) : (
            <div className="text-gray-400">请先选择摄像头</div>
          )}
        </div>
      </div>
    </div>
  )
}
```

### 预设位置控制

添加预设位置功能，快速定位到常用位置。

```tsx
function PresetControl() {
  const [presets, setPresets] = useState([
    { id: 1, name: '正门', action: 'upRight' },
    { id: 2, name: '大厅', action: 'left' },
    { id: 3, name: '通道', action: 'down' }
  ])

  const handlePresetClick = (preset) => {
    console.log('移动到预设:', preset.name)
    // 这里可以发送预设位置命令
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">预设位置</h2>

      {/* 云台控制 */}
      <div className="flex justify-center mb-6">
        <ButtonWidget
          tableData={tableData}
          buttonType="hk"
          size={200}
          cellKey="preset-ptz"
        />
      </div>

      {/* 预设按钮 */}
      <div className="grid grid-cols-3 gap-3">
        {presets.map(preset => (
          <button
            key={preset.id}
            onClick={() => handlePresetClick(preset)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  )
}
```

### 巡航路线控制

设置和执行巡航路线。

```tsx
function CruiseControl() {
  const [cruisePoints, setCruisePoints] = useState([])
  const [isCruising, setIsCruising] = useState(false)
  const [currentPoint, setCurrentPoint] = useState(0)

  const addCruisePoint = () => {
    // 添加当前位置到巡航点
    const newPoint = {
      id: Date.now(),
      name: `点 ${cruisePoints.length + 1}`,
      position: { x: 0, y: 0, z: 0 } // 实际应从云台获取
    }
    setCruisePoints([...cruisePoints, newPoint])
  }

  const startCruise = () => {
    if (cruisePoints.length < 2) {
      alert('至少需要2个巡航点')
      return
    }
    setIsCruising(true)
    setCurrentPoint(0)

    // 模拟巡航
    const interval = setInterval(() => {
      setCurrentPoint(prev => {
        const next = (prev + 1) % cruisePoints.length
        if (next === 0) {
          clearInterval(interval)
          setIsCruising(false)
        }
        return next
      })
    }, 3000)
  }

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <ButtonWidget
          tableData={tableData}
          buttonType="hk"
          cellKey="cruise-ptz"
        />

        <div className="flex-1">
          <h3 className="font-semibold mb-3">巡航路线</h3>

          <div className="mb-3 space-y-2">
            {cruisePoints.map((point, index) => (
              <div
                key={point.id}
                className={`px-3 py-2 rounded ${
                  currentPoint === index && isCruising
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {point.name}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={addCruisePoint}
              disabled={isCruising}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
            >
              添加点
            </button>
            <button
              onClick={startCruise}
              disabled={isCruising || cruisePoints.length < 2}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              开始巡航
            </button>
            <button
              onClick={() => {
                setIsCruising(false)
                setCruisePoints([])
              }}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              清除
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 多云台控制

同时控制多个云台设备。

```tsx
function MultiPtzControl() {
  const [selectedDevices, setSelectedDevices] = useState([])

  const devices = [
    { id: 'cam-001', name: '大厅', table: { id: 'ptz-table' } },
    { id: 'cam-002', name: '入口', table: { id: 'ptz-table' } },
    { id: 'cam-003', name: '出口', table: { id: 'ptz-table' } },
    { id: 'cam-004', name: '走廊', table: { id: 'ptz-table' } }
  ]

  const handleActionStart = (action) => {
    console.log('同步控制设备:', selectedDevices, '动作:', action)
    // 向所有选中的设备发送控制命令
  }

  const toggleDevice = (device) => {
    if (selectedDevices.find(d => d.id === device.id)) {
      setSelectedDevices(selectedDevices.filter(d => d.id !== device.id))
    } else {
      setSelectedDevices([...selectedDevices, device])
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">多云台同步控制</h2>

      <div className="flex gap-6">
        {/* 设备选择 */}
        <div className="w-64">
          <h3 className="font-medium mb-3">选择设备</h3>
          <div className="space-y-2">
            {devices.map(device => (
              <label key={device.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedDevices.find(d => d.id === device.id)}
                  onChange={() => toggleDevice(device)}
                  className="w-4 h-4"
                />
                {device.name}
              </label>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            已选择: {selectedDevices.length} 个设备
          </div>
        </div>

        {/* 云台控制 */}
        <div className="flex-1 flex justify-center">
          {selectedDevices.length > 0 ? (
            <ButtonWidget
              tableData={selectedDevices[0]}
              table={selectedDevices[0].table}
              size={200}
              buttonType="hk"
              onActionStart={handleActionStart}
              cellKey="multi-ptz"
            />
          ) : (
            <div className="text-gray-400">请选择要控制的设备</div>
          )}
        </div>
      </div>
    </div>
  )
}
```

### 自定义动作映射

将云台动作映射为自定义功能。

```tsx
function CustomActionMapping() {
  const actionMap = {
    up: '上移',
    down: '下移',
    left: '左移',
    right: '右移',
    upLeft: '左上移动',
    upRight: '右上移动',
    downLeft: '左下移动',
    downRight: '右下移动',
    zoomIn: '放大',
    zoomOut: '缩小'
  }

  const handleActionClick = (action) => {
    console.log(`执行自定义动作: ${actionMap[action]}`)
    // 这里可以执行自定义逻辑
  }

  return (
    <div>
      <h3>自定义云台控制</h3>
      <ButtonWidget
        tableData={tableData}
        buttonType="hk"
        controlMode="click"
        onActionClick={handleActionClick}
        cellKey="custom-action"
      />
    </div>
  )
}
```

## 注意事项

1. **设备表配置**：确保设备表中正确配置了云台相关的命令定义

2. **控制模式选择**：
   - `hold` 模式：按住按钮时云台持续移动，松开停止（推荐）
   - `click` 模式：点击按钮云台移动一段距离

3. **海康 vs 萤石**：
   - 海康（`hk`）：使用 HTTP Proxy 发送 ptzStart/ptzStop 命令
   - 萤石（`ez`）：使用标准的 driver/command 接口

4. **权限验证**：在禁用控制器前，建议先验证用户是否有控制权限

5. **响应式设计**：建议尺寸范围在 150-400 像素之间

6. **颜色对比**：按钮颜色应与背景色有足够对比度，确保可见性

7. **性能考虑**：快速连续发送命令可能导致设备响应延迟，建议添加防抖

8. **错误处理**：网络异常或设备离线时，应显示适当的错误提示

9. **状态同步**：多个控制器控制同一设备时，需要同步状态

10. **触摸支持**：组件使用 Pointer Events，同时支持鼠标和触摸屏操作
