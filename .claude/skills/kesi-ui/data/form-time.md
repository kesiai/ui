> **安装命令**: `npx shadcn@latest add @kesi/form-time`

# Form.Time 时间选择器

## 简介

`FormTime` 是一个简洁的时间输入组件，使用浏览器原生的时间选择器。

- **原生体验**：使用浏览器原生时间控件，性能优异
- **格式灵活**：支持时:分和时:分:秒两种格式
- **自动格式化**：根据配置自动格式化输出
- **默认值支持**：支持配置默认值及默认值类型

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `string` | 否 | - | 当前值 |
| `onChange` | `(value: string \| null) => void` | 否 | - | 值变化回调 |
| `timeFormat` | `string` | 否 | `'HH:mm:ss'` | 时间格式，支持 `HH:mm` 或 `HH:mm:ss` |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `defaultVal` | `string` | 否 | - | 默认值 |
| `defaultValType` | `'fixed' \| 'logic'` | 否 | `'fixed'` | 默认值类型，`fixed` 表示固定默认值，`logic` 表示逻辑默认值（不自动填充） |

## 基本用法

### 1. 基础时间选择

使用默认配置选择时间，输出格式为 HH:mm:ss。

```tsx
import { FormTime } from '@/components/kesi/form-time'

function Example() {
  const [time, setTime] = useState('')

  return (
    <FormTime
      value={time}
      onChange={setTime}
    />
  )
}
```

### 2. 时分格式

只选择小时和分钟，不包含秒。

```tsx
function Example() {
  const [time, setTime] = useState('')

  return (
    <FormTime
      value={time}
      onChange={setTime}
      timeFormat="HH:mm"
    />
  )
}
```

### 3. 禁用状态

禁用时间选择器。

```tsx
function Example() {
  const [time, setTime] = useState('14:30:00')

  return (
    <FormTime
      value={time}
      onChange={setTime}
      disabled
    />
  )
}
```

### 4. 带默认值

设置默认时间值，组件挂载时自动填充。

```tsx
function Example() {
  const [time, setTime] = useState('')

  return (
    <FormTime
      value={time}
      onChange={setTime}
      defaultVal="09:00:00"
    />
  )
}
```

### 5. 逻辑默认值

使用 `defaultValType="logic"` 时，默认值不会自动填充到输入框。

```tsx
function Example() {
  const [time, setTime] = useState('')

  return (
    <FormTime
      value={time}
      onChange={setTime}
      defaultVal="00:00:00"
      defaultValType="logic"
    />
  )
}
```

## 完整示例

### 工作打卡时间

记录员工的上班和下班打卡时间。

```tsx
import { FormTime } from '@/components/kesi/form-time'

function WorkTimeTracker() {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  return (
    <div className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium mb-2">上班时间</label>
        <FormTime
          value={startTime}
          onChange={setStartTime}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">下班时间</label>
        <FormTime
          value={endTime}
          onChange={setEndTime}
        />
      </div>

      {startTime && endTime && (
        <div className="p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-900">
            工作时间: {startTime} - {endTime}
          </p>
        </div>
      )}
    </div>
  )
}
```

### 会议安排

安排会议的开始时间（只需精确到分钟）。

```tsx
function MeetingScheduler() {
  const [meetingTime, setMeetingTime] = useState('')

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium mb-2">会议开始时间</label>
      <FormTime
        value={meetingTime}
        onChange={setMeetingTime}
        timeFormat="HH:mm"
      />
      {meetingTime && (
        <p className="mt-2 text-sm text-gray-600">
          会议将于 {meetingTime} 开始
        </p>
      )}
    </div>
  )
}
```

### 定时任务设置

设置定时任务的执行时间。

```tsx
function ScheduledTask() {
  const [executeTime, setExecuteTime] = useState('')
  const [taskName, setTaskName] = useState('')

  return (
    <div className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium mb-2">任务名称</label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="请输入任务名称"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">执行时间</label>
        <FormTime
          value={executeTime}
          onChange={setExecuteTime}
          defaultVal="00:00:00"
        />
      </div>

      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        创建定时任务
      </button>
    </div>
  )
}
```

### 营业时间设置

设置店铺的营业开始和结束时间。

```tsx
function BusinessHours() {
  const [openTime, setOpenTime] = useState('09:00')
  const [closeTime, setCloseTime] = useState('18:00')

  return (
    <div className="space-y-4 w-full max-w-md p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-900">营业时间设置</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">开门时间</label>
          <FormTime
            value={openTime}
            onChange={setOpenTime}
            timeFormat="HH:mm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">打烊时间</label>
          <FormTime
            value={closeTime}
            onChange={setCloseTime}
            timeFormat="HH:mm"
          />
        </div>
      </div>

      <div className="pt-2">
        <p className="text-sm text-gray-600">
          营业时间: {openTime} - {closeTime}
        </p>
      </div>
    </div>
  )
}
```

## 注意事项

1. **输入格式**：组件使用 HTML5 原生 `input type="time"`，浏览器会自动处理时间选择界面

2. **格式转换**：内部会将输入值转换为配置的格式输出，即使 `timeFormat` 是 `HH:mm:ss`，输入界面也只显示到分钟

3. **默认值生效**：`defaultVal` 会在组件挂载后自动生效，但仅在当前值为空且 `defaultValType` 为 `fixed` 时设置

4. **清空处理**：当用户清空输入时，`onChange` 回调会接收到 `null` 而不是空字符串

5. **时区处理**：组件不处理时区问题，所有时间都视为本地时间

6. **验证提示**：组件本身不包含验证功能，需要在外部实现输入验证

7. **moment.js 依赖**：组件内部使用 moment.js 处理时间格式化，确保项目中已安装该依赖

8. **受控模式**：使用 `value` 和 `onChange` 控制组件状态
