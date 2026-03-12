## FormDate - 日期选择器组件

### 导入路径
```tsx
import { FormDate } from '@/components/airiot/form-date/form-date'
```

### 基础用法
```tsx
import { FormDate } from '@/components/airiot/form-date/form-date'

function DateExample() {
  const [date, setDate] = useState(null)

  return (
    <FormDate
      value={date}
      onChange={setDate}
      placeholder="选择日期"
      format="YYYY-MM-DD"
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | Date \| string | - | 选中值 |
| onChange | (date) => void | - | 变化回调 |
| placeholder | string | '请选择日期' | 占位符 |
| format | string | 'YYYY-MM-DD' | 日期格式 |
| disabled | boolean | false | 是否禁用 |
| allowClear | boolean | true | 是否显示清除按钮 |

### 示例
```tsx
import { FormDate, FormItem, Card, Space } from '@/components/airiot'

function DatePickerDemo() {
  const [birthDate, setBirthDate] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  return (
    <Card cardTitle="日期选择器">
      <Space direction="vertical" style={{ width: '100%' }}>
        <FormItem label="出生日期">
          <FormDate
            value={birthDate}
            onChange={setBirthDate}
            placeholder="请选择出生日期"
            format="YYYY年MM月DD日"
            disabledDate={(current) => {
              // 禁用未来的日期
              return current && current > new Date()
            }}
          />
        </FormItem>

        <FormItem label="活动日期范围">
          <Space>
            <FormDate
              value={startDate}
              onChange={setStartDate}
              placeholder="开始日期"
            />
            <span>至</span>
            <FormDate
              value={endDate}
              onChange={setEndDate}
              placeholder="结束日期"
              disabledDate={(current) => {
                // 禁用早于开始日期的日期
                return startDate && current < startDate
              }}
            />
          </Space>
        </FormItem>

        <FormItem label="会议日期">
          <FormDate
            value={null}
            onChange={(date) => console.log('会议日期:', date)}
            placeholder="选择会议日期"
            format="YYYY/MM/DD"
            allowClear={true}
          />
        </FormItem>
      </Space>
    </Card>
  )
}
```

### 日期格式
- YYYY: 4位年份
- MM: 2位月份
- DD: 2位日期
- HH: 小时 (24小时制)
- mm: 分钟
- ss: 秒

### 注意事项
- 支持日期范围选择
- 可以禁用特定日期
- 支持自定义格式化