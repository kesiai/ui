## FormDateRange - 日期范围选择器组件

### 导入路径
```tsx
import { FormDateRange } from '@/components/airiot/form-date-range/form-date-range'
```

### 基础用法
```tsx
import { FormDateRange } from '@/components/airiot/form-date-range/form-date-range'

function DateRangeExample() {
  const [range, setRange] = useState([null, null])

  return (
    <FormDateRange
      value={range}
      onChange={setRange}
      placeholder={['开始日期', '结束日期']}
      format="YYYY-MM-DD"
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | [Date, Date] | - | 日期范围 |
| onChange | (range) => void | - | 变化回调 |
| placeholder | [string, string] | ['开始', '结束'] | 占位符 |
| format | string | 'YYYY-MM-DD' | 日期格式 |
| disabled | boolean | false | 是否禁用 |
| showTime | boolean | false | 是否显示时间 |

### 示例
```tsx
import { FormDateRange, FormItem, Card, Space } from '@/components/airiot'

function DateRangeDemo() {
  const [reportRange, setReportRange] = useState([null, null])
  const [scheduleRange, setScheduleRange] = useState([null, null])

  const formatDate = (date) => {
    if (!date) return ''
    return date.toLocaleDateString('zh-CN')
  }

  const generateReport = () => {
    if (reportRange[0] && reportRange[1]) {
      console.log('生成报告:', {
        start: formatDate(reportRange[0]),
        end: formatDate(reportRange[1])
      })
    }
  }

  return (
    <Card cardTitle="日期范围选择">
      <Space direction="vertical" style={{ width: '100%' }}>
        <FormItem label="报告统计周期">
          <FormDateRange
            value={reportRange}
            onChange={setReportRange}
            placeholder={['开始日期', '结束日期']}
            format="YYYY年MM月DD日"
            disabled={false}
          />
          {reportRange[0] && reportRange[1] && (
            <div style={{ marginTop: 8, color: '#666' }}>
              统计周期: {formatDate(reportRange[0])} 至 {formatDate(reportRange[1])}
            </div>
          )}
        </FormItem>

        <FormItem label="项目排期">
          <FormDateRange
            value={scheduleRange}
            onChange={setScheduleRange}
            placeholder={'选择日期范围'}
            format="MM/DD"
            showTime={true}
            disabled={false}
          />
          {scheduleRange[0] && scheduleRange[1] && (
            <div style={{ marginTop: 8 }}>
              <div>
                开始: {scheduleRange[0].toLocaleString('zh-CN')}
              </div>
              <div>
                结束: {scheduleRange[1].toLocaleString('zh-CN')}
              </div>
            </div>
          )}
        </FormItem>

        <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5' }}>
          <h4>已选择的日期范围：</h4>
          <div>
            <p>报告周期:
              {reportRange[0] ? formatDate(reportRange[0]) : '未选择'} -
              {reportRange[1] ? formatDate(reportRange[1]) : '未选择'}
            </p>
            <p>项目排期:
              {scheduleRange[0] ? scheduleRange[0].toLocaleString() : '未选择'} -
              {scheduleRange[1] ? scheduleRange[1].toLocaleString() : '未选择'}
            </p>
          </div>
          <button
            onClick={generateReport}
            disabled={!reportRange[0] || !reportRange[1]}
            style={{
              marginTop: 8,
              padding: '6px 12px',
              background: !reportRange[0] || !reportRange[1] ? '#ccc' : '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: !reportRange[0] || !reportRange[1] ? 'not-allowed' : 'pointer'
            }}
          >
            生成报告
          </button>
        </div>
      </Space>
    </Card>
  )
}
```

### 日期范围限制
- 最小日期：可配置最早可选日期
- 最大日期：可配置最晚可选日期
- 时间跨度：可设置最大天数限制

### 快速选择
- 今天
- 最近7天
- 最近30天
- 本月
- 上月

### 注意事项
- 支持单独选择开始和结束日期
- 可以禁用特定日期
- 支持时间精确选择