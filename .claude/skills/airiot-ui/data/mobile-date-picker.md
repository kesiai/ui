# MobileDatePicker 时间选择器

## 简介

`MobileDatePicker` 是一个功能强大的移动端时间选择器，支持从年到秒的多种时间精度选择。

- **多精度支持**：支持年、月、周、日、时、分、秒等多种时间精度
- **滚轮选择**：采用滚轮式选择器，符合移动端操作习惯
- **时间限制**：可设置最小和最大时间范围
- **周选择**：支持周和周-日两种特殊选择模式
- **流畅动画**：平滑的滚动动画和惯性效果

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `precision` | `'year' \| 'month' \| 'week' \| 'week-day' \| 'day' \| 'hour' \| 'minute' \| 'second'` | 否 | `'day'` | 选择精度 |
| `defaultValue` | `string` | 否 | `''` | 默认值（格式根据精度而定） |
| `value` | `string` | 否 | - | 当前值（受控） |
| `onChange` | `(value: string) => void` | 否 | - | 值变化回调 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `minDate` | `string` | 否 | - | 最小日期（用于 day、week-day 精度） |
| `maxDate` | `string` | 否 | - | 最大日期（用于 day、week-day 精度） |
| `minDateTime` | `string` | 否 | - | 最小时间（用于 hour、minute、second 精度） |
| `maxDateTime` | `string` | 否 | - | 最大时间（用于 hour、minute、second 精度） |

## 基本用法

### 1. 日期选择（默认）

选择年月日。

```tsx
import { MobileDatePicker } from '@/components/kesi/mobile-date-picker'

function Example() {
  return (
    <MobileDatePicker
      precision="day"
      placeholder="请选择日期"
    />
  )
}
```

### 2. 年月选择

只选择年到月。

```tsx
function Example() {
  return (
    <MobileDatePicker
      precision="month"
      placeholder="请选择年月"
    />
  )
}
```

### 3. 时间选择

选择时、分、秒。

```tsx
function Example() {
  return (
    <div className="space-y-4">
      <MobileDatePicker
        precision="hour"
        placeholder="选择到小时"
      />
      <MobileDatePicker
        precision="minute"
        placeholder="选择到分钟"
      />
      <MobileDatePicker
        precision="second"
        placeholder="选择到秒"
      />
    </div>
  )
}
```

### 4. 周选择

选择年份中的第几周。

```tsx
function Example() {
  return (
    <MobileDatePicker
      precision="week"
      placeholder="请选择周"
    />
  )
}
```

### 5. 周-日选择

选择年份中的第几周和星期几。

```tsx
function Example() {
  return (
    <MobileDatePicker
      precision="week-day"
      placeholder="请选择周和星期"
    />
  )
}
```

### 6. 限制时间范围

设置可选的时间范围。

```tsx
function Example() {
  return (
    <MobileDatePicker
      precision="day"
      minDate="2024-01-01"
      maxDate="2024-12-31"
      placeholder="选择 2024 年的日期"
    />
  )
}
```

### 7. 受控模式

完全控制选择器的值。

```tsx
import { useState } from 'react'

function Example() {
  const [datetime, setDatetime] = useState('2024-01-15 14:30')

  return (
    <div>
      <MobileDatePicker
        precision="minute"
        value={datetime}
        onChange={setDatetime}
      />
      <p className="mt-4">已选择: {datetime}</p>
    </div>
  )
}
```

### 8. 禁用状态

禁用时间选择器。

```tsx
function Example() {
  return (
    <MobileDatePicker
      precision="day"
      disabled
      defaultValue="2024-01-15"
    />
  )
}
```

## 完整示例

### 会议时间预约

创建一个会议时间预约表单。

```tsx
import { MobileDatePicker } from '@/components/kesi/mobile-date-picker'
import { useState } from 'react'
import { Button } from '@/components/kesi/button/button'

function MeetingScheduler() {
  const [datetime, setDatetime] = useState('')
  const today = new Date().toISOString().split('T')[0]

  const handleSchedule = () => {
    if (datetime) {
      console.log('预约会议时间:', datetime)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">预约会议</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            会议时间
          </label>
          <MobileDatePicker
            precision="minute"
            value={datetime}
            onChange={setDatetime}
            minDateTime={`${today} 00:00`}
            placeholder="选择会议时间"
          />
        </div>

        {datetime && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="font-medium mb-2">会议详情</p>
            <p className="text-gray-600">
              时间: {datetime}
            </p>
          </div>
        )}

        <Button
          onClick={handleSchedule}
          disabled={!datetime}
          className="w-full"
        >
          确认预约
        </Button>
      </div>
    </div>
  )
}
```

### 生日选择器

选择用户生日。

```tsx
import { MobileDatePicker } from '@/components/kesi/mobile-date-picker'

function BirthdayPicker() {
  const maxDate = new Date().toISOString().split('T')[0]
  const minDate = '1900-01-01'

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        选择出生日期
      </h3>
      
      <MobileDatePicker
        precision="day"
        maxDate={maxDate}
        minDate={minDate}
        placeholder="请选择生日"
      />
    </div>
  )
}
```

## 注意事项

1. **日期格式**：
   - `year`: `2024`
   - `month`: `2024-01`
   - `week`: `2024-3周`
   - `week-day`: `2024-3周-周一`
   - `day`: `2024-01-15`
   - `hour`: `2024-01-15 14`
   - `minute`: `2024-01-15 14:30`
   - `second`: `2024-01-15 14:30:45`

2. **时间范围限制**：
   - `minDate/maxDate`：仅对 `day` 和 `week-day` 精度生效
   - `minDateTime/maxDateTime`：仅对 `hour`、`minute`、`second` 精度生效

3. **滚轮操作**：组件采用模拟滚轮，支持拖拽滚动和惯性动画。

4. **确认机制**：用户需要点击"确定"按钮才会触发 `onChange`。

5. **暂存机制**：用户在滚轮上的选择会暂存，直到点击确定。

6. **年份数量**：默认显示前后各 10 年的年份范围。

7. **移动端优化**：专为移动端触摸操作优化，桌面端也支持鼠标拖拽。

8. **周计算**：周数从每年 1 月 1 日开始计算，第一周可能不足 7 天。
