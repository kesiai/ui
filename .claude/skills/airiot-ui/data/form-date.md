# Form.Date 日期选择器

## 简介

`FormDate` 是一个功能全面的日期时间选择组件，支持多种日期格式和选择模式。

- **多种选择模式**：支持日期、时间、日期时间、周、月、季度、年份七种选择器
- **灵活的格式化**：自动根据选择器类型格式化输出
- **12/24小时制**：支持12小时和24小时制切换
- **可展开日历**：提供直接展开日历的模式
- **清除功能**：支持一键清除已选日期

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `string` | 否 | - | 当前值（ISO格式日期字符串） |
| `defaultValue` | `string` | 否 | - | 默认值 |
| `picker` | `'time' \| 'date' \| 'dateTime' \| 'week' \| 'month' \| 'quarter' \| 'year'` | 否 | `'date'` | 选择器类型 |
| `placeholder` | `string` | 否 | `'请选择日期'` | 占位符文本 |
| `size` | `'large' \| 'medium' \| 'small'` | 否 | `'medium'` | 组件尺寸 |
| `allowClear` | `boolean` | 否 | `true` | 是否显示清除按钮 |
| `autoFocus` | `boolean` | 否 | `false` | 是否自动获取焦点 |
| `bordered` | `boolean` | 否 | `true` | 是否显示边框 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `isCalendar` | `boolean` | 否 | `false` | 是否直接展开日历 |
| `use12Hours` | `boolean` | 否 | `false` | 是否使用12小时制 |
| `onChange` | `(value: string) => void` | 否 | - | 值改变时的回调 |

### picker 选择器类型

不同选择器类型的输出格式：

| 类型 | 输出格式 | 说明 |
|------|----------|------|
| `time` | `HH:mm:ss` | 时间选择器 |
| `date` | `YYYY-MM-DD` | 日期选择器 |
| `dateTime` | `YYYY-MM-DD HH:mm:ss` | 日期时间选择器 |
| `week` | `YYYY-第N周` | 周选择器 |
| `month` | `YYYY年MM月` | 月选择器 |
| `quarter` | `YYYY年QN` | 季度选择器 |
| `year` | `YYYY` | 年选择器 |

## 基本用法

### 1. 基础日期选择

最常用的日期选择器，用于选择具体日期。

```tsx
import { FormDate } from '@/components/airiot/form-date'

function Example() {
  return (
    <FormDate
      picker="date"
      placeholder="请选择日期"
    />
  )
}
```

### 2. 日期时间选择

同时选择日期和时间，适合预约、提醒等场景。

```tsx
function Example() {
  return (
    <FormDate
      picker="dateTime"
      placeholder="请选择日期和时间"
    />
  )
}
```

### 3. 时间选择

单独选择时间，用于记录具体时刻。

```tsx
function Example() {
  return (
    <FormDate
      picker="time"
      placeholder="请选择时间"
    />
  )
}
```

### 4. 月份选择

选择年月，适合按月统计或筛选的场景。

```tsx
function Example() {
  return (
    <FormDate
      picker="month"
      placeholder="请选择月份"
    />
  )
}
```

### 5. 季度选择

选择年份和季度，常用于财务报表等场景。

```tsx
function Example() {
  return (
    <FormDate
      picker="quarter"
      placeholder="请选择季度"
    />
  )
}
```

### 6. 年份选择

只选择年份，用于毕业年份、入职年份等场景。

```tsx
function Example() {
  return (
    <FormDate
      picker="year"
      placeholder="请选择年份"
    />
  )
}
```

### 7. 周选择

选择年份和周数，适合按周统计的场景。

```tsx
function Example() {
  return (
    <FormDate
      picker="week"
      placeholder="请选择周"
    />
  )
}
```

### 8. 日历展开模式

直接展示日历，不使用弹出框。

```tsx
function Example() {
  return (
    <FormDate
      picker="date"
      isCalendar
    />
  )
}
```

### 9. 受控模式

使用 `value` 和 `onChange` 完全控制组件状态。

```tsx
function Example() {
  const [date, setDate] = useState('')

  return (
    <FormDate
      value={date}
      onChange={setDate}
      picker="date"
      placeholder="请选择日期"
    />
  )
}
```

### 10. 不同尺寸

使用 `size` 属性调整组件大小。

```tsx
function Example() {
  return (
    <div className="space-y-4">
      <FormDate size="small" placeholder="小尺寸" />
      <FormDate size="medium" placeholder="中尺寸" />
      <FormDate size="large" placeholder="大尺寸" />
    </div>
  )
}
```

## 完整示例

### 生日选择器

选择出生日期，使用日期选择器并设置合理范围。

```tsx
import { FormDate } from '@/components/airiot/form-date'

function BirthdayPicker() {
  const [birthday, setBirthday] = useState('')

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium mb-2">出生日期</label>
      <FormDate
        value={birthday}
        onChange={setBirthday}
        picker="date"
        placeholder="请选择出生日期"
        size="medium"
      />
      {birthday && (
        <p className="mt-2 text-sm text-gray-600">
          选择的日期: {birthday}
        </p>
      )}
    </div>
  )
}
```

### 预约时间选择

选择日期和时间，适合预约系统使用。

```tsx
import { FormDate } from '@/components/airiot/form-date'

function AppointmentPicker() {
  const [appointmentTime, setAppointmentTime] = useState('')

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium mb-2">预约时间</label>
      <FormDate
        value={appointmentTime}
        onChange={setAppointmentTime}
        picker="dateTime"
        placeholder="请选择预约日期和时间"
        size="large"
        allowClear
      />
      {appointmentTime && (
        <div className="mt-2 p-3 bg-blue-50 rounded-md">
          <p className="text-sm font-medium text-blue-900">
            预约时间: {appointmentTime}
          </p>
        </div>
      )}
    </div>
  )
}
```

### 月度报表筛选

使用月份选择器筛选月度数据。

```tsx
function MonthlyReportFilter() {
  const [month, setMonth] = useState('')

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">报表月份</label>
        <FormDate
          value={month}
          onChange={setMonth}
          picker="month"
          placeholder="请选择月份"
          size="medium"
          allowClear
        />
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        查询报表
      </button>
    </div>
  )
}
```

### 季度目标设定

使用季度选择器设定季度目标。

```tsx
function QuarterTarget() {
  const [quarter, setQuarter] = useState('')

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium mb-2">目标季度</label>
      <FormDate
        value={quarter}
        onChange={setQuarter}
        picker="quarter"
        placeholder="请选择季度"
        size="medium"
      />
      {quarter && (
        <div className="mt-4 p-4 bg-green-50 rounded-md">
          <h3 className="font-medium text-green-900">{quarter} 目标</h3>
          <textarea
            className="mt-2 w-full p-2 border border-green-200 rounded-md"
            placeholder="请输入季度目标..."
            rows={3}
          />
        </div>
      )}
    </div>
  )
}
```

### 会议时间安排

使用日期时间选择器和12小时制安排会议。

```tsx
function MeetingScheduler() {
  const [meetingTime, setMeetingTime] = useState('')

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">会议时间</label>
        <FormDate
          value={meetingTime}
          onChange={setMeetingTime}
          picker="dateTime"
          placeholder="请选择会议时间"
          use12Hours
          size="large"
        />
      </div>

      {meetingTime && (
        <div className="p-4 bg-purple-50 rounded-md">
          <p className="text-sm text-purple-900">
            会议安排在: <span className="font-medium">{meetingTime}</span>
          </p>
        </div>
      )}
    </div>
  )
}
```

## 注意事项

1. **日期格式**：组件内部使用 ISO 格式（YYYY-MM-DD HH:mm:ss）处理日期，但会根据 `picker` 类型自动格式化显示

2. **受控模式**：使用 `value` 属性时，必须同时提供 `onChange` 回调，否则组件无法更新

3. **日期时间选择**：`dateTime` 模式下需要点击"确定"按钮才会触发 `onChange`，选择过程中只更新临时状态

4. **清除功能**：点击清除按钮会将值设为空字符串，并触发 `onChange('')`

5. **输入验证**：用户可以在输入框中手动输入日期，组件会验证输入的有效性

6. **12小时制**：`use12Hours` 只影响时间显示格式，不影响内部存储和输出格式

7. **日历展开**：`isCalendar` 模式下不显示输入框和弹出层，直接展示日历组件

8. **时间选择器**：`picker="time"` 使用独立的时间选择组件，不显示日历弹出层

9. **周选择**：周选择器高亮显示整个周，从周日到周六

10. **自动聚焦**：`autoFocus` 会在组件挂载时自动聚焦到输入框
