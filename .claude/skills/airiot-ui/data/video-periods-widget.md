### ⚠️ 组合使用说明

> **重要**: video-periods-widget 是 视频系统 的子组件，不能单独使用。
>
> 必须配合父组件 video-widget 使用。请查看 [视频系统 完整指南](data/video-system.md) 了解正确的使用方法。

# 录制计划

## 简介

`VideoPeriodsWidget` 是一个专业的视频录制计划配置组件，支持可视化编辑和管理设备的录像时间段。

- **可视化编辑**：直观的时间轴界面，支持拖拽、点击创建和调整时间段
- **灵活周期**：支持按周设置（每天不同）和每天统一设置两种模式
- **多种模式**：支持连续录制、报警录制、手动录制三种录像模式
- **快捷操作**：支持复制、粘贴、批量删除等快捷操作
- **精确控制**：支持分钟级别的精确时间段调整
- **只读模式**：提供只读模式，适用于查看已配置的计划

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `period` | `'week' \| 'everyday'` | 否 | `'week'` | 周期类型，按周或每天 |
| `recordingMode` | `'CMR' \| 'ALARM' \| 'MANUAL'` | 否 | `'CMR'` | 录制模式 |
| `value` | `TimeSegment[]` | 否 | `[]` | 时间段数据数组 |
| `tableData` | `object` | 否 | `{}` | 设备信息 |
| `onChange` | `(value: TimeSegment[]) => void` | 否 | - | 值变化回调函数 |
| `showActions` | `boolean` | 否 | `true` | 是否显示操作按钮 |
| `readonly` | `boolean` | 否 | `false` | 是否只读模式 |
| `cellKey` | `string` | 否 | - | 单元格唯一标识 |

### TimeSegment（时间段）

时间段对象的类型定义：

```typescript
interface TimeSegment {
  id?: string                    // 唯一标识
  name: string                   // 名称
  day_of_week: string            // 星期（Monday-Sunday，空表示每天）
  start_time: string             // 开始时间（HH:mm 格式）
  end_time: string               // 结束时间（HH:mm 格式）
  length: number                 // 时长（分钟）
  recording_mode: RecordingMode  // 录制模式
  segmentTime: {                 // 分段配置
    count: number                // 数量
    unit: 'm' | 'h'              // 单位（分钟或小时）
  }
}
```

### RecordingMode（录制模式）

- `CMR`：连续录制（Continuous Recording）
- `ALARM`：报警录制（仅在触发报警时录制）
- `MANUAL`：手动录制（需要手动触发）

## 基本用法

### 1. 基础录制计划

创建一个按周设置的录制计划。

```tsx
import { VideoPeriodsWidget } from '@/registry/components/airiot/video-periods-widget/video-periods-widget'
import { useState } from 'react'

function Example() {
  const [segments, setSegments] = useState([])

  return (
    <VideoPeriodsWidget
      period="week"
      recordingMode="CMR"
      value={segments}
      onChange={setSegments}
    />
  )
}
```

### 2. 每天统一设置

为每天设置相同的录制时间段。

```tsx
function Example() {
  const [segments, setSegments] = useState([
    {
      id: '1',
      name: '录制1',
      day_of_week: '',
      start_time: '09:00',
      end_time: '18:00',
      length: 540,
      recording_mode: 'CMR',
      segmentTime: { count: 10, unit: 'm' }
    }
  ])

  return (
    <VideoPeriodsWidget
      period="everyday"
      recordingMode="CMR"
      value={segments}
      onChange={setSegments}
    />
  )
}
```

### 3. 报警录制计划

设置为报警触发时才录制。

```tsx
function Example() {
  return (
    <VideoPeriodsWidget
      period="week"
      recordingMode="ALARM"
      value={segments}
      onChange={setSegments}
      showActions={true}
    />
  )
}
```

### 4. 只读查看模式

以只读模式查看已配置的录制计划。

```tsx
function Example() {
  return (
    <VideoPeriodsWidget
      period="week"
      recordingMode="CMR"
      value={existingSegments}
      readonly={true}
      showActions={false}
    />
  )
}
```

### 5. 隐藏操作按钮

隐藏添加、删除等操作按钮，仅用于展示。

```tsx
function Example() {
  return (
    <VideoPeriodsWidget
      period="week"
      recordingMode="CMR"
      value={segments}
      onChange={setSegments}
      showActions={false}
    />
  )
}
```

### 6. 工作日录制设置

仅在工作日（周一至周五）设置录制。

```tsx
function Example() {
  const [segments, setSegments] = useState([
    {
      id: '1',
      name: 'Monday录制0',
      day_of_week: 'Monday',
      start_time: '08:00',
      end_time: '20:00',
      length: 720,
      recording_mode: 'CMR',
      segmentTime: { count: 10, unit: 'm' }
    }
    // ... 其他工作日
  ])

  return (
    <VideoPeriodsWidget
      period="week"
      recordingMode="CMR"
      value={segments}
      onChange={setSegments}
    />
  )
}
```

### 7. 多时间段设置

在同一天设置多个录制时间段。

```tsx
function Example() {
  const [segments, setSegments] = useState([
    {
      id: '1',
      name: 'Monday录制0',
      day_of_week: 'Monday',
      start_time: '09:00',
      end_time: '12:00',
      length: 180,
      recording_mode: 'CMR',
      segmentTime: { count: 10, unit: 'm' }
    },
    {
      id: '2',
      name: 'Monday录制1',
      day_of_week: 'Monday',
      start_time: '14:00',
      end_time: '18:00',
      length: 240,
      recording_mode: 'CMR',
      segmentTime: { count: 10, unit: 'm' }
    }
  ])

  return (
    <VideoPeriodsWidget
      period="week"
      recordingMode="CMR"
      value={segments}
      onChange={setSegments}
    />
  )
}
```

## 完整示例

### 设备录制配置

为监控设备配置完整的录制计划。

```tsx
import { VideoPeriodsWidget } from '@/registry/components/airiot/video-periods-widget/video-periods-widget'
import { useState } from 'react'

function DeviceRecordingConfig() {
  const [device, setDevice] = useState(null)
  const [period, setPeriod] = useState('week')
  const [recordingMode, setRecordingMode] = useState('CMR')
  const [segments, setSegments] = useState([])

  const devices = [
    { id: 'cam-001', name: '大厅摄像头' },
    { id: 'cam-002', name: '入口摄像头' }
  ]

  const handleSave = async () => {
    // 保存录制计划到服务器
    console.log('保存录制计划:', {
      deviceId: device.id,
      period,
      recordingMode,
      segments
    })

    // 调用 API 保存
    // await saveRecordingPlan(device.id, segments)
    alert('录制计划已保存')
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">设备录制配置</h2>

      {/* 设备选择 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">选择设备</label>
        <select
          value={device?.id || ''}
          onChange={(e) => {
            const selected = devices.find(d => d.id === e.target.value)
            setDevice(selected)
            // 加载设备的录制计划
            if (selected) {
              // loadRecordingPlan(selected.id)
            }
          }}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">请选择设备</option>
          {devices.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* 周期和模式选择 */}
      {device && (
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">周期类型</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="week">按周设置</option>
              <option value="everyday">每天统一</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">录制模式</label>
            <select
              value={recordingMode}
              onChange={(e) => setRecordingMode(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="CMR">连续录制</option>
              <option value="ALARM">报警录制</option>
              <option value="MANUAL">手动录制</option>
            </select>
          </div>
        </div>
      )}

      {/* 录制计划编辑 */}
      {device && (
        <div className="mb-6">
          <VideoPeriodsWidget
            period={period}
            recordingMode={recordingMode}
            value={segments}
            onChange={setSegments}
            tableData={device}
            showActions={true}
            cellKey="device-config"
          />
        </div>
      )}

      {/* 保存按钮 */}
      {device && (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setSegments([])}
            className="px-6 py-2 border rounded hover:bg-gray-50"
          >
            清空
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            保存配置
          </button>
        </div>
      )}
    </div>
  )
}
```

### 录制计划模板

提供常用的录制计划模板，快速应用。

```tsx
function RecordingPlanTemplates() {
  const [segments, setSegments] = useState([])

  const templates = {
    workingHours: {
      name: '工作时间',
      periods: [
        { day: 'Monday', start: '09:00', end: '18:00' },
        { day: 'Tuesday', start: '09:00', end: '18:00' },
        { day: 'Wednesday', start: '09:00', end: '18:00' },
        { day: 'Thursday', start: '09:00', end: '18:00' },
        { day: 'Friday', start: '09:00', end: '18:00' }
      ]
    },
    allDay: {
      name: '全天录制',
      periods: [
        { day: '', start: '00:00', end: '23:59' }
      ]
    },
    nightWatch: {
      name: '夜间值守',
      periods: [
        { day: 'Monday', start: '18:00', end: '08:00' },
        { day: 'Tuesday', start: '18:00', end: '08:00' },
        { day: 'Wednesday', start: '18:00', end: '08:00' },
        { day: 'Thursday', start: '18:00', end: '08:00' },
        { day: 'Friday', start: '18:00', end: '08:00' }
      ]
    }
  }

  const applyTemplate = (template) => {
    const newSegments = template.periods.map((p, index) => ({
      id: `${template.name}-${index}`,
      name: `${p.day || '每天'}录制${index}`,
      day_of_week: p.day,
      start_time: p.start,
      end_time: p.end,
      length: calculateDuration(p.start, p.end),
      recording_mode: 'CMR',
      segmentTime: { count: 10, unit: 'm' }
    }))
    setSegments(newSegments)
  }

  const calculateDuration = (start, end) => {
    const [sh, sm] = start.split(':').map(Number)
    const [eh, em] = end.split(':').map(Number)
    return (eh * 60 + em) - (sh * 60 + sm)
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">录制计划模板</h2>

      <div className="mb-6 flex gap-3">
        {Object.entries(templates).map(([key, template]) => (
          <button
            key={key}
            onClick={() => applyTemplate(template)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {template.name}
          </button>
        ))}
      </div>

      <VideoPeriodsWidget
        period="week"
        recordingMode="CMR"
        value={segments}
        onChange={setSegments}
        showActions={true}
        cellKey="template-plan"
      />
    </div>
  )
}
```

### 计划对比查看

并排查看多个设备的录制计划。

```tsx
function PlanComparison() {
  const [devices] = useState([
    { id: 'cam-001', name: '大厅', segments: [] },
    { id: 'cam-002', name: '入口', segments: [] },
    { id: 'cam-003', name: '出口', segments: [] }
  ])

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">录制计划对比</h2>

      <div className="grid grid-cols-3 gap-4">
        {devices.map(device => (
          <div key={device.id} className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">{device.name}</h3>
            <VideoPeriodsWidget
              period="week"
              recordingMode="CMR"
              value={device.segments}
              onChange={(newSegments) => {
                // 更新设备的录制计划
                console.log('更新', device.id, newSegments)
              }}
              showActions={true}
              cellKey={`compare-${device.id}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 批量配置

为多个设备批量配置相同的录制计划。

```tsx
function BatchConfiguration() {
  const [selectedDevices, setSelectedDevices] = useState([])
  const [masterPlan, setMasterPlan] = useState([])

  const devices = [
    { id: 'cam-001', name: '大厅摄像头' },
    { id: 'cam-002', name: '入口摄像头' },
    { id: 'cam-003', name: '出口摄像头' },
    { id: 'cam-004', name: '走廊摄像头' }
  ]

  const applyToSelected = () => {
    if (selectedDevices.length === 0) {
      alert('请至少选择一个设备')
      return
    }

    if (masterPlan.length === 0) {
      alert('请先配置录制计划')
      return
    }

    // 将主计划应用到所有选中的设备
    selectedDevices.forEach(deviceId => {
      console.log(`应用计划到设备 ${deviceId}:`, masterPlan)
      // await saveRecordingPlan(deviceId, masterPlan)
    })

    alert(`已成功应用到 ${selectedDevices.length} 个设备`)
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">批量配置录制计划</h2>

      {/* 设备选择 */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">选择要配置的设备</h3>
        <div className="grid grid-cols-4 gap-3">
          {devices.map(device => (
            <label key={device.id} className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedDevices.includes(device.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDevices([...selectedDevices, device.id])
                  } else {
                    setSelectedDevices(selectedDevices.filter(id => id !== device.id))
                  }
                }}
                className="w-4 h-4"
              />
              {device.name}
            </label>
          ))}
        </div>
      </div>

      {/* 主计划配置 */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">配置录制计划</h3>
        <VideoPeriodsWidget
          period="week"
          recordingMode="CMR"
          value={masterPlan}
          onChange={setMasterPlan}
          showActions={true}
          cellKey="batch-plan"
        />
      </div>

      {/* 应用按钮 */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          已选择 {selectedDevices.length} 个设备
        </div>
        <button
          onClick={applyToSelected}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          应用到选中设备
        </button>
      </div>
    </div>
  )
}
```

### 计划导入导出

支持录制计划的导入和导出功能。

```tsx
function PlanImportExport() {
  const [segments, setSegments] = useState([])

  const exportPlan = () => {
    const plan = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      segments: segments
    }

    const blob = new Blob([JSON.stringify(plan, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recording-plan-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importPlan = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const plan = JSON.parse(e.target.result)
        if (plan.segments && Array.isArray(plan.segments)) {
          setSegments(plan.segments)
          alert('导入成功')
        } else {
          alert('无效的计划文件')
        }
      } catch (err) {
        alert('解析文件失败')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">录制计划导入导出</h2>

      <div className="mb-6 flex gap-3">
        <button
          onClick={exportPlan}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          导出计划
        </button>

        <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
          导入计划
          <input
            type="file"
            accept=".json"
            onChange={importPlan}
            className="hidden"
          />
        </label>
      </div>

      <VideoPeriodsWidget
        period="week"
        recordingMode="CMR"
        value={segments}
        onChange={setSegments}
        showActions={true}
        cellKey="import-export-plan"
      />
    </div>
  )
}
```

## 注意事项

1. **时间格式**：`start_time` 和 `end_time` 必须使用 `HH:mm` 格式（24小时制）

2. **时间段不重叠**：同一天的时间段不能重叠，创建时会自动检查

3. **最小时间单位**：时间段的最小单位为 1 分钟

4. **日期处理**：
   - `period='week'` 时，`day_of_week` 必须指定（Monday-Sunday）
   - `period='everyday'` 时，`day_of_week` 应为空字符串

5. **复制功能**：复制功能仅在 `period='week'` 模式下可用

6. **只读模式**：设置 `readonly` 后，无法创建、编辑或删除时间段

7. **数据同步**：修改 `value` 时必须通过 `onChange` 回调，不要直接修改

8. **性能考虑**：时间段数量建议不超过 50 个，过多可能影响性能

9. **分段配置**：`segmentTime` 用于控制录像文件的分段大小

10. **录制模式**：
    - `CMR`：按计划连续录制
    - `ALARM`：仅在触发报警时录制
    - `MANUAL`：需要手动触发录制
