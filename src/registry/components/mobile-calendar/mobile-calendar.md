# MobileCalendar 日历

## 简介

`MobileCalendar` 是一个移动端友好的日历选择组件，支持单日和日期区间两种选择模式。

- **双模式支持**：选择器模式（底部弹出）和日历模式（直接显示）
- **日期区间**：支持单日和日期范围两种选择方式
- **限制范围**：可设置最小和最大可选日期
- **清除功能**：支持再次点击清除已选日期
- **移动优化**：专为移动端设计的交互体验

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `mode` | `'picker' \| 'calendar'` | 否 | `'picker'` | 模式选择 |
| `selectionMode` | `'single' \| 'range'` | 否 | `'single'` | 日期选择类型 |
| `min` | `string` | 否 | `''` | 最小日期（格式：YYYY-MM-DD） |
| `max` | `string` | 否 | `''` | 最大日期（格式：YYYY-MM-DD） |
| `allowClear` | `boolean` | 否 | `true` | 是否允许再次点击后清除 |
| `placeholder` | `string` | 否 | `'请选择'` | 占位符文字 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `value` | `string \| string[]` | 否 | - | 当前值（受控） |
| `defaultValue` | `string \| string[]` | 否 | - | 默认值 |
| `onChange` | `(value: string \| string[]) => void` | 否 | - | 值变化回调 |

## 基本用法

### 1. 选择器模式（默认）

底部弹出日历选择器。

```tsx
import { MobileCalendar } from '@/registry/components/airiot/mobile-calendar'

function Example() {
  return (
    <MobileCalendar
      mode="picker"
      selectionMode="single"
      placeholder="请选择日期"
    />
  )
}
```

### 2. 日历模式

直接显示日历组件。

```tsx
function Example() {
  return (
    <div className="w-full">
      <MobileCalendar
        mode="calendar"
        selectionMode="single"
      />
    </div>
  )
}
```

### 3. 日期区间选择

选择开始和结束日期。

```tsx
function Example() {
  const [value, setValue] = useState([])

  return (
    <MobileCalendar
      mode="picker"
      selectionMode="range"
      value={value}
      onChange={setValue}
      placeholder="请选择日期范围"
    />
  )
}
```

### 4. 限制日期范围

设置可选择的日期范围。

```tsx
function Example() {
  return (
    <MobileCalendar
      mode="picker"
      selectionMode="single"
      min="2024-01-01"
      max="2024-12-31"
      placeholder="选择 2024 年的日期"
    />
  )
}
```

### 5. 禁用清除

不允许清除已选日期。

```tsx
function Example() {
  return (
    <MobileCalendar
      mode="picker"
      selectionMode="single"
      allowClear={false}
      defaultValue="2024-01-15"
    />
  )
}
```

### 6. 受控模式

完全控制日历的值。

```tsx
import { useState } from 'react'

function Example() {
  const [date, setDate] = useState('2024-01-15')

  return (
    <div>
      <MobileCalendar
        mode="picker"
        selectionMode="single"
        value={date}
        onChange={setDate}
      />
      <p className="mt-4">已选择: {date}</p>
    </div>
  )
}
```

### 7. 禁用状态

禁用日历选择器。

```tsx
function Example() {
  return (
    <MobileCalendar
      mode="picker"
      selectionMode="single"
      disabled
      defaultValue="2024-01-15"
    />
  )
}
```

## 完整示例

### 日期预订表单

创建一个酒店预订日期选择表单。

```tsx
import { MobileCalendar } from '@/registry/components/airiot/mobile-calendar'
import { useState } from 'react'
import { Button } from '@/registry/components/airiot/button/button'

function HotelBookingForm() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const today = new Date().toISOString().split('T')[0]

  const handleBook = () => {
    if (checkIn && checkOut) {
      console.log('预订:', { checkIn, checkOut })
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">酒店预订</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            入住日期
          </label>
          <MobileCalendar
            mode="picker"
            selectionMode="single"
            value={checkIn}
            onChange={setCheckIn}
            min={today}
            placeholder="选择入住日期"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            退房日期
          </label>
          <MobileCalendar
            mode="picker"
            selectionMode="single"
            value={checkOut}
            onChange={setCheckOut}
            min={checkIn || today}
            placeholder="选择退房日期"
          />
        </div>

        {checkIn && checkOut && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm">
              入住: {checkIn}
            </p>
            <p className="text-sm">
              退房: {checkOut}
            </p>
            <p className="text-sm font-medium mt-2">
              共 {Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))} 晚
            </p>
          </div>
        )}

        <Button
          onClick={handleBook}
          disabled={!checkIn || !checkOut}
          className="w-full"
        >
          立即预订
        </Button>
      </div>
    </div>
  )
}
```

### 活动日期选择器

选择活动的开始和结束日期范围。

```tsx
import { MobileCalendar } from '@/registry/components/airiot/mobile-calendar'

function EventDateRange() {
  const [dateRange, setDateRange] = useState([])

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        选择活动日期
      </h3>
      
      <MobileCalendar
        mode="picker"
        selectionMode="range"
        value={dateRange}
        onChange={setDateRange}
        placeholder="选择活动起止日期"
        min={new Date().toISOString().split('T')[0]}
      />

      {Array.isArray(dateRange) && dateRange.length === 2 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="font-medium">
            活动时间
          </p>
          <p className="text-gray-600">
            {dateRange[0]} 至 {dateRange[1]}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            共 {Math.ceil((new Date(dateRange[1]) - new Date(dateRange[0])) / (1000 * 60 * 60 * 24))} 天
          </p>
        </div>
      )}
    </div>
  )
}
```

## 注意事项

1. **日期格式**：日期必须使用 `YYYY-MM-DD` 格式，如 `2024-01-15`。

2. **范围选择**：`selectionMode="range"` 时，`value` 和 `onChange` 返回的是字符串数组 `[startDate, endDate]`。

3. **最小最大日期**：`min` 和 `max` 只接受字符串格式的日期。

4. **选择器模式**：`mode="picker"` 时会显示为可点击的输入框，点击后从底部弹出日历。

5. **日历模式**：`mode="calendar"` 时日历直接显示在页面上，适合作为独立组件使用。

6. **清除操作**：`allowClear={true}` 时，点击已选日期可以清除选择。

7. **受控模式**：使用 `value` 和 `onChange` 实现受控模式时，必须处理状态更新。

8. **移动端优化**：组件针对移动端进行了优化，在桌面端也能正常使用。

9. **时区问题**：组件使用本地时区，不需要处理时区转换。
