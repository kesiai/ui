# DateRange 日期范围选择器

## 简介

`DateRange` 是一个日期范围选择组件，用于选择开始和结束日期或时间。

- **多种格式**：支持日期、日期时间、时间三种范围格式
- **独立选择**：开始和结束时间分别使用独立的日历控件
- **清晰显示**：选中范围以按钮形式展示，支持清空操作
- **灵活输出**：输出格式统一为 "开始值 - 结束值"
- **禁用支持**：支持禁用状态

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `string` | 否 | - | 当前值，格式：`"开始 - 结束"` |
| `onChange` | `(value: string \| null) => void` | 否 | - | 值改变时的回调 |
| `format` | `'date' \| 'datetime' \| 'time'` | 否 | `'date'` | 日期格式 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `placeholder` | `string` | 否 | `'请选择日期范围'` | 占位符文本 |
| `cellKey` | `string` | 否 | - | 单元格键值 |

### format 格式说明

| 格式 | 输出示例 | 说明 |
|------|----------|------|
| `date` | `2024-01-01 - 2024-12-31` | 日期范围 |
| `datetime` | `2024-01-01 00:00:00 - 2024-12-31 23:59:59` | 日期时间范围 |
| `time` | `08:00:00 - 18:00:00` | 时间范围 |

## 基本用法

### 1. 日期范围选择

最常用的日期范围选择，用于筛选某段时间的数据。

```tsx
import DateRange from '@/components/airiot/form-date-range/form-date-range'

function Example() {
  const [range, setRange] = useState('')

  return (
    <DateRange
      format="date"
      value={range}
      onChange={setRange}
      placeholder="请选择日期范围"
    />
  )
}
```

### 2. 日期时间范围

同时选择日期和时间，适合需要精确到秒的场景。

```tsx
function Example() {
  const [range, setRange] = useState('')

  return (
    <DateRange
      format="datetime"
      value={range}
      onChange={setRange}
      placeholder="请选择日期时间范围"
    />
  )
}
```

### 3. 时间范围

只选择时间，不包含日期。

```tsx
function Example() {
  const [range, setRange] = useState('')

  return (
    <DateRange
      format="time"
      value={range}
      onChange={setRange}
      placeholder="请选择时间范围"
    />
  )
}
```

### 4. 禁用状态

禁用日期范围选择器。

```tsx
function Example() {
  const [range, setRange] = useState('2024-01-01 - 2024-12-31')

  return (
    <DateRange
      format="date"
      value={range}
      onChange={setRange}
      disabled
    />
  )
}
```

### 5. 自定义占位符

自定义提示文本。

```tsx
function Example() {
  const [range, setRange] = useState('')

  return (
    <DateRange
      format="date"
      value={range}
      onChange={setRange}
      placeholder="选择查询时间段"
    />
  )
}
```

## 完整示例

### 订单查询筛选

在订单管理系统中按日期范围查询订单。

```tsx
import DateRange from '@/components/airiot/form-date-range/form-date-range'

function OrderFilter() {
  const [dateRange, setDateRange] = useState('')
  const [orders, setOrders] = useState([])

  const handleSearch = () => {
    // 使用 dateRange 查询订单
    console.log('查询范围:', dateRange)
    // 实际项目中这里会调用 API
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">订单日期</label>
          <DateRange
            format="date"
            value={dateRange}
            onChange={setDateRange}
            placeholder="选择订单日期范围"
            cellKey="order-date"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          查询
        </button>
      </div>

      {dateRange && (
        <div className="p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-900">
            查询范围: {dateRange}
          </p>
        </div>
      )}
    </div>
  )
}
```

### 考勤打卡记录

查询员工在某个时间段内的打卡记录。

```tsx
function AttendanceFilter() {
  const [timeRange, setTimeRange] = useState('')

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium mb-2">打卡时间</label>
      <DateRange
        format="datetime"
        value={timeRange}
        onChange={setTimeRange}
        placeholder="选择打卡时间范围"
        cellKey="attendance-time"
      />

      {timeRange && (
        <div className="mt-4 p-4 bg-green-50 rounded-md">
          <h4 className="font-medium text-green-900 mb-2">筛选条件</h4>
          <p className="text-sm text-green-700">
            时间范围: {timeRange}
          </p>
          <button className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
            导出记录
          </button>
        </div>
      )}
    </div>
  )
}
```

### 营业时段设置

设置店铺每天的营业时间段。

```tsx
function BusinessHoursSetting() {
  const [hours, setHours] = useState('09:00:00 - 18:00:00')

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">营业时间设置</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">每日营业时段</label>
        <DateRange
          format="time"
          value={hours}
          onChange={setHours}
          placeholder="设置营业时间"
          cellKey="business-hours"
        />
      </div>

      {hours && (
        <div className="p-4 bg-yellow-50 rounded-md">
          <p className="text-sm text-yellow-900">
            店铺将在 {hours} 期间营业
          </p>
        </div>
      )}

      <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        保存设置
      </button>
    </div>
  )
}
```

### 项目周期管理

设置项目的开始和结束日期。

```tsx
function ProjectPeriod() {
  const [period, setPeriod] = useState('')
  const [projectName, setProjectName] = useState('')

  const calculateDuration = () => {
    if (!period || !period.includes(' - ')) return null
    const [start, end] = period.split(' - ')
    const startDate = new Date(start)
    const endDate = new Date(end)
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium mb-2">项目名称</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="输入项目名称"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">项目周期</label>
        <DateRange
          format="date"
          value={period}
          onChange={setPeriod}
          placeholder="选择项目起止日期"
          cellKey="project-period"
        />
      </div>

      {period && (
        <div className="p-4 bg-blue-50 rounded-md space-y-2">
          <p className="text-sm text-blue-900">项目周期: {period}</p>
          {calculateDuration() !== null && (
            <p className="text-sm text-blue-700">
              共 {calculateDuration()} 天
            </p>
          )}
        </div>
      )}
    </div>
  )
}
```

### 数据统计报表

选择时间范围生成统计报表。

```tsx
function ReportGenerator() {
  const [range, setRange] = useState('')
  const [reportType, setReportType] = useState('daily')

  return (
    <div className="space-y-4 w-full max-w-2xl p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium">生成统计报表</h3>

      <div>
        <label className="block text-sm font-medium mb-2">报表类型</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="daily">日报</option>
          <option value="weekly">周报</option>
          <option value="monthly">月报</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">统计时间</label>
        <DateRange
          format="datetime"
          value={range}
          onChange={setRange}
          placeholder="选择统计时间范围"
          cellKey="report-range"
        />
      </div>

      <button
        disabled={!range}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300"
      >
        生成报表
      </button>
    </div>
  )
}
```

## 注意事项

1. **输出格式**：无论选择什么格式，输出的都是 "开始值 - 结束值" 的字符串格式

2. **独立选择**：开始和结束日期分别选择，先选择开始日期，再选择结束日期

3. **部分范围**：允许只选择开始或结束日期，输出时会保留未选择的一侧为空

4. **清除操作**：点击清除按钮会将整个范围清空，触发 `onChange(null)`

5. **时间格式**：`datetime` 模式下，日历和时间选择器并排显示，方便同时选择

6. **禁用状态**：禁用状态下，无法打开日期选择器，也无法清除已选范围

7. **中文本地化**：日期显示使用中文本地化（需要 zhCN locale）

8. **输入限制**：组件不直接支持手动输入，必须通过日期选择器选择

9. **cellKey 用途**：`cellKey` 用于唯一标识组件实例，在表格等场景中使用

10. **范围验证**：组件本身不验证开始时间是否小于结束时间，需要在外部处理
