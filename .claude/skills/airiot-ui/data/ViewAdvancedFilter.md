## ViewAdvancedFilter - 高级过滤器组件

### 导入路径
```tsx
import { ViewAdvancedFilter } from '@/components/airiot/view-advanced-filter/view-advanced-filter'
```

### 基础用法
```tsx
import { ViewAdvancedFilter } from '@/components/airiot/view-advanced-filter/view-advanced-filter'

function AdvancedFilterExample() {
  return (
    <ViewAdvancedFilter
      onFilter={handleFilter}
      onReset={handleReset}
      defaultCollapsed={false}
    >
      <SelectField name="category" label="分类" />
      <DateRangeField name="dateRange" label="日期范围" />
      <InputField name="keyword" label="关键词" />
    </ViewAdvancedFilter>
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| onFilter | (values) => void | - | 过滤回调 |
| onReset | () => void | - | 重置回调 |
| defaultCollapsed | boolean | true | 默认是否折叠 |
| showCollapseButton | boolean | true | 是否显示折叠按钮 |

### 示例
```tsx
import {
  ViewAdvancedFilter,
  Select,
  DatePicker,
  Input,
  Button
} from '@/components/airiot'

function UserFilter() {
  const [filterValues, setFilterValues] = useState({})

  return (
    <ViewAdvancedFilter
      onFilter={(values) => {
        setFilterValues(values)
        console.log('过滤条件:', values)
      }}
      onReset={() => setFilterValues({})}
      defaultCollapsed={false}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <div>
            <label>用户状态</label>
            <Select
              name="status"
              options={[
                { label: '全部', value: '' },
                { label: '启用', value: 'active' },
                { label: '禁用', value: 'inactive' }
              ]}
            />
          </div>

          <div>
            <label>注册时间</label>
            <DatePicker.RangePicker name="registerDate" />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label>关键词搜索</label>
            <Input
              name="keyword"
              placeholder="搜索用户名/邮箱/手机号"
            />
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <Button onClick={() => console.log('应用过滤')}>
            应用过滤
          </Button>
          <Button type="default" onClick={() => console.log('重置')}>
            重置
          </Button>
        </div>
      </Space>
    </ViewAdvancedFilter>
  )
}
```

### 功能特性
- 支持多条件组合过滤
- 可折叠设计节省空间
- 支持日期范围选择
- 智能默认值管理

### 注意事项
- 建议配合 ViewDataTable 使用
- 支持复杂条件组合
- 可以保存过滤历史