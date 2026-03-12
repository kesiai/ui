## FormTime - 时间选择器组件

### 导入路径
```tsx
import { FormTime } from '@/components/airiot/form-time/form-time'
```

### 基础用法
```tsx
import { FormTime } from '@/components/airiot/form-time/form-time'

function TimeExample() {
  const [time, setTime] = useState(null)

  return (
    <FormTime
      value={time}
      onChange={setTime}
      placeholder="选择时间"
      format="HH:mm:ss"
      use12Hour={false}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | string | - | 时间值 |
| onChange | (time) => void | - | 变化回调 |
| placeholder | string | '请选择时间' | 占位符 |
| format | string | 'HH:mm:ss' | 时间格式 |
| use12Hour | boolean | false | 是否使用12小时制 |
| disabled | boolean | false | 是否禁用 |

### 示例
```tsx
import { FormTime, FormItem, Card, Space } from '@/components/airiot'

function TimePickerDemo() {
  const [workStart, setWorkStart] = useState('09:00')
  const [workEnd, setWorkEnd] = useState('18:00')
  const [breakTime, setBreakTime] = useState('12:30')

  const totalHours = () => {
    const start = new Date(`2000-01-01 ${workStart}`)
    const end = new Date(`2000-01-01 ${workEnd}`)
    const diff = (end - start) / (1000 * 60 * 60)
    return diff.toFixed(1)
  }

  return (
    <Card cardTitle="工作时间设置">
      <Space direction="vertical" style={{ width: '100%' }}>
        <FormItem label="上班时间">
          <FormTime
            value={workStart}
            onChange={setWorkStart}
            format="HH:mm"
            use12Hour={false}
          />
        </FormItem>

        <FormItem label="下班时间">
          <FormTime
            value={workEnd}
            onChange={setWorkEnd}
            format="HH:mm"
            use12Hour={false}
          />
        </FormItem>

        <FormItem label="午休时间">
          <FormTime
            value={breakTime}
            onChange={setBreakTime}
            format="HH:mm"
            use12Hour={false}
          />
        </FormItem>

        <div style={{
          padding: 16,
          background: '#f0f0f0',
          borderRadius: 8,
          marginTop: 16
        }}>
          <h4>工作时间统计：</h4>
          <p>上班: {workStart}</p>
          <p>下班: {workEnd}</p>
          <p>午休: {breakTime}</p>
          <p style={{ marginTop: 8, fontWeight: 'bold' }}>
            工作时长: {totalHours()} 小时
          </p>
        </div>
      </Space>
    </Card>
  )
}
```

### 时间格式
- HH: 小时 (24小时制)
- hh: 小时 (12小时制)
- mm: 分钟
- ss: 秒
- A: AM/PM (12小时制)

### 时间选择
- 支持下拉选择
- 支持键盘输入
- 支持快速选择

### 注意事项
- 24小时制显示: 00:00 - 23:59
- 12小时制显示: 12:00 AM - 11:59 PM
- 支持自定义时间格式