## MobileCalendar - 移动端日历组件

### 导入路径
```tsx
import { MobileCalendar } from '@/components/airiot/mobile-calendar/mobile-calendar'
```

### 基础用法
```tsx
import { MobileCalendar } from '@/components/airiot/mobile-calendar/mobile-calendar'

function CalendarExample() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <MobileCalendar
      value={selectedDate}
      onChange={setSelectedDate}
      type="single"
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | Date | - | 选中日期 |
| onChange | (date) => void | - | 日期变化回调 |
| type | 'single' \| 'range' | 'single' | 选择类型 |
| minDate | Date | - | 最小日期 |
| maxDate | Date | - | 最大日期 |

### 示例
```tsx
import { MobileCalendar, Button, Card } from '@/components/airiot'

function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [dateRange, setDateRange] = useState(null)

  return (
    <Card cardTitle="选择日期">
      <div style={{ marginBottom: 16 }}>
        <h4>单日选择：</h4>
        <MobileCalendar
          value={selectedDate}
          onChange={setSelectedDate}
          type="single"
          minDate={new Date()}
        />
        {selectedDate && (
          <div style={{ marginTop: 8 }}>
            已选择: {selectedDate.toLocaleDateString()}
          </div>
        )}
      </div>

      <div>
        <h4>日期范围：</h4>
        <MobileCalendar
          value={dateRange}
          onChange={setDateRange}
          type="range"
          minDate={new Date()}
        />
        {dateRange && (
          <div style={{ marginTop: 8 }}>
            范围: {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
          </div>
        )}
      </div>
    </Card>
  )
}
```

### 选择类型
- single: 单日选择
- range: 日期范围选择

### 注意事项
- 触摸优化设计
- 支持月份快速切换
- 自适应屏幕尺寸