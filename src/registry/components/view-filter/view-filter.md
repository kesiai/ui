> **安装命令**: `npx shadcn@latest add @kesi/view-filter`

# ViewFilter 筛选组件

## 简介

`ViewFilter` 是一个数据筛选表单组件，用于快速构建数据查询和筛选功能。

- **自动表单生成**：根据 Model 的字段定义自动生成筛选表单
- **灵活的字段配置**：支持配置需要筛选的字段及其显示顺序
- **自动数据绑定**：筛选条件自动同步到 Model 的 `wheres.filter` 状态
- **内置操作按钮**：提供查询和重置按钮，一键应用或清空筛选条件
- **样式可定制**：支持通过 `classNames` 自定义表单各部分的样式

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `filters` | `Array<{key: string, name: string}>` | 否 | `[]` | 筛选字段配置 |
| `classNames` | `FormClassNames` | 否 | - | 自定义样式类名 |

### filters 配置

筛选字段数组，每个元素包含：

- `key`：字段在 Model 中的字段名
- `name`：字段显示的标签名

```typescript
const filters = [
  { key: 'username', name: '用户名' },
  { key: 'email', name: '邮箱' },
  { key: 'status', name: '状态' }
]
```

### classNames 配置

用于自定义表单各元素的样式类名。

```typescript
interface FormClassNames {
  form?: string;        // 表单容器
  group?: string;       // 字段组容器
  field?: string;       // 字段容器
  label?: string;       // 标签
  input?: string;       // 输入框
  description?: string; // 描述文字
  error?: string;       // 错误信息
}
```

## 基本用法

### 1. 基础筛选

最简单的用法，使用所有 Model 字段生成筛选表单。

```tsx
import { ViewFilter } from '@/components/kesi/view-filter/view-filter'
import { ViewModel } from '@/components/kesi/view-model/view-model'

function BasicFilter() {
  return (
    <ViewModel tableId="user" modelName="user">
      <ViewFilter />
    </ViewModel>
  )
}
```

### 2. 指定筛选字段

只显示指定的筛选字段，隐藏其他字段。

```tsx
import { ViewFilter } from '@/components/kesi/view-filter/view-filter'
import { ViewModel } from '@/components/kesi/view-model/view-model'

function SpecifiedFieldsFilter() {
  const filters = [
    { key: 'username', name: '用户名' },
    { key: 'email', name: '邮箱' },
    { key: 'status', name: '状态' }
  ]

  return (
    <ViewModel tableId="user" modelName="user">
      <ViewFilter filters={filters} />
    </ViewModel>
  )
}
```

### 3. 自定义样式

使用 `classNames` 自定义表单样式。

```tsx
import { ViewFilter } from '@/components/kesi/view-filter/view-filter'
import { ViewModel } from '@/components/kesi/view-model/view-model'

function CustomStyleFilter() {
  const filters = [
    { key: 'name', name: '姓名' },
    { key: 'department', name: '部门' }
  ]

  const classNames = {
    group: 'grid grid-cols-2 gap-4',
    field: 'space-y-1',
    label: 'text-sm font-medium text-gray-700',
    input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
  }

  return (
    <ViewModel tableId="employee" modelName="employee">
      <ViewFilter
        filters={filters}
        classNames={classNames}
      />
    </ViewModel>
  )
}
```

### 4. 配合数据表格使用

筛选组件通常与表格组件配合使用。

```tsx
import { ViewFilter } from '@/components/kesi/view-filter/view-filter'
import { ViewDataTable } from '@/components/kesi/view-data-table/view-data-table'
import { ViewModel } from '@/components/kesi/view-model/view-model'

function FilterWithTable() {
  const filters = [
    { key: 'title', name: '任务标题' },
    { key: 'status', name: '状态' },
    { key: 'priority', name: '优先级' }
  ]

  return (
    <ViewModel tableId="task_def" modelName="task">
      <div className="space-y-4">
        {/* 筛选区域 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">筛选条件</h3>
          <ViewFilter filters={filters} />
        </div>

        {/* 数据表格 */}
        <ViewDataTable />
      </div>
    </ViewModel>
  )
}
```

### 5. 使用布局预设

使用预定义的布局样式快速构建美观的筛选表单。

```tsx
import { ViewFilter } from '@/components/kesi/view-filter/view-filter'
import { ViewModel } from '@/components/kesi/view-model/view-model'
import { layoutPresets } from '@/components/kesi/form/config'

function PresetLayoutFilter() {
  const filters = [
    { key: 'keyword', name: '关键词' },
    { key: 'category', name: '分类' },
    { key: 'dateRange', name: '日期范围' },
    { key: 'status', name: '状态' }
  ]

  // 使用紧凑布局
  const classNames = {
    group: layoutPresets.compact.container,
    field: layoutPresets.compact.field,
    label: layoutPresets.compact.label,
    input: layoutPresets.compact.input
  }

  return (
    <ViewModel tableId="article" modelName="article">
      <ViewFilter
        filters={filters}
        classNames={classNames}
      />
    </ViewModel>
  )
}
```

### 6. 横向布局

将筛选条件横向排列，适合字段较少的情况。

```tsx
import { ViewFilter } from '@/components/kesi/view-filter/view-filter'
import { ViewModel } from '@/components/kesi/view-model/view-model'

function HorizontalFilter() {
  const filters = [
    { key: 'status', name: '状态' },
    { key: 'date', name: '日期' }
  ]

  const classNames = {
    group: 'flex gap-4 items-end'
  }

  return (
    <ViewModel tableId="order" modelName="order">
      <ViewFilter
        filters={filters}
        classNames={classNames}
      />
    </ViewModel>
  )
}
```

## 完整示例

### 用户筛选页面

创建一个完整的用户筛选页面，包含多种筛选条件。

```tsx
import { ViewFilter } from '@/components/kesi/view-filter/view-filter'
import { ViewDataTable, TableColumn } from '@/components/kesi/view-data-table/view-data-table'
import { ViewModel } from '@/components/kesi/view-model/view-model'
import { Card } from '@/components/ui/card'

function UserFilterPage() {
  const filters = [
    { key: 'username', name: '用户名' },
    { key: 'email', name: '邮箱' },
    { key: 'role', name: '角色' },
    { key: 'department', name: '部门' },
    { key: 'status', name: '状态' },
    { key: 'createdAfter', name: '注册时间' }
  ]

  const classNames = {
    group: 'grid grid-cols-3 gap-4',
    field: 'space-y-1',
    label: 'text-sm font-medium text-gray-700',
    input: 'w-full px-3 py-2 border border-gray-300 rounded-md'
  }

  return (
    <ViewModel tableId="user" modelName="user">
      <div className="space-y-6">
        {/* 筛选区域 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">用户筛选</h3>
          <ViewFilter
            filters={filters}
            classNames={classNames}
          />
        </Card>

        {/* 结果展示 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">用户列表</h3>
          <ViewDataTable>
            <TableColumn name="id" title="ID" width={80} />
            <TableColumn name="username" title="用户名" width={120} />
            <TableColumn name="email" title="邮箱" width={200} />
            <TableColumn name="role" title="角色" width={100} />
            <TableColumn name="department" title="部门" width={120} />
            <TableColumn name="status" title="状态" width={80} />
          </ViewDataTable>
        </Card>
      </div>
    </ViewModel>
  )
}
```

### 任务筛选与统计

创建一个任务筛选页面，配合统计信息展示。

```tsx
import { ViewFilter } from '@/components/kesi/view-filter/view-filter'
import { ViewDataTable, TableColumn } from '@/components/kesi/view-data-table/view-data-table'
import { ViewModel } from '@/components/kesi/view-model/view-model'
import { Badge } from '@/components/ui/badge'
import { useModelList } from '@airiot/client'

function TaskFilterWithStats() {
  const filters = [
    { key: 'title', name: '任务标题' },
    { key: 'assignee', name: '负责人' },
    { key: 'status', name: '状态' },
    { key: 'priority', name: '优先级' },
    { key: 'deadlineFrom', name: '截止日期从' },
    { key: 'deadlineTo', name: '截止日期到' }
  ]

  const classNames = {
    group: 'grid grid-cols-3 gap-4',
    field: 'space-y-1'
  }

  return (
    <ViewModel tableId="task_def" modelName="task">
      <div className="space-y-6">
        {/* 统计信息 */}
        <div className="grid grid-cols-4 gap-4">
          <StatsCard title="总任务数" value={useTotalCount()} />
          <StatsCard title="进行中" value={useStatusCount('in_progress')} />
          <StatsCard title="已完成" value={useStatusCount('completed')} />
          <StatsCard title="逾期" value={useOverdueCount()} />
        </div>

        {/* 筛选区域 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">筛选条件</h3>
          <ViewFilter
            filters={filters}
            classNames={classNames}
          />
        </div>

        {/* 任务列表 */}
        <ViewDataTable>
          <TableColumn name="id" title="ID" />
          <TableColumn name="title" title="任务标题" />
          <TableColumn name="assignee" title="负责人" />
          <TableColumn name="status" title="状态" />
          <TableColumn name="priority" title="优先级" />
          <TableColumn name="deadline" title="截止日期" />
        </ViewDataTable>
      </div>
    </ViewModel>
  )
}

function StatsCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
```

### 订单筛选

创建一个订单筛选页面，支持多种筛选条件组合。

```tsx
import { ViewFilter } from '@/components/kesi/view-filter/view-filter'
import { ViewDataTable, TableColumn } from '@/components/kesi/view-data-table/view-data-table'
import { ViewModel } from '@/components/kesi/view-model/view-model'

function OrderFilterPage() {
  const filters = [
    { key: 'orderNo', name: '订单号' },
    { key: 'customerName', name: '客户名称' },
    { key: 'product', name: '产品' },
    { key: 'amountMin', name: '金额（起）' },
    { key: 'amountMax', name: '金额（止）' },
    { key: 'orderDateFrom', name: '下单日期从' },
    { key: 'orderDateTo', name: '下单日期到' },
    { key: 'status', name: '订单状态' }
  ]

  const classNames = {
    group: 'grid grid-cols-4 gap-4',
    field: 'space-y-1'
  }

  return (
    <ViewModel tableId="order" modelName="order">
      <div className="space-y-6">
        {/* 筛选条件 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">订单筛选</h3>
          <ViewFilter
            filters={filters}
            classNames={classNames}
          />
        </div>

        {/* 订单列表 */}
        <ViewDataTable>
          <TableColumn name="id" title="订单号" width={150} />
          <TableColumn name="customerName" title="客户名称" width={120} />
          <TableColumn name="product" title="产品" />
          <TableColumn name="amount" title="金额" width={100} />
          <TableColumn name="status" title="状态" width={100} />
          <TableColumn name="orderDate" title="下单日期" width={150} />
        </ViewDataTable>
      </div>
    </ViewModel>
  )
}
```

## 注意事项

1. **Model 依赖**：`ViewFilter` 组件必须包裹在 `ViewModel` 组件中使用，因为它依赖 Model 的字段定义和数据管理功能。

2. **字段类型**：筛选字段的输入控件类型由 Model 中字段的类型决定：
   - `string`：文本输入框
   - `number`：数字输入框
   - `boolean`：选择框
   - `enum`：下拉选择框
   - `date`：日期选择器

3. **查询逻辑**：点击"查询"按钮时，组件会：
   - 将筛选条件更新到 Model 的 `wheres.filter` 状态
   - 调用 `getItems()` 方法重新获取数据

4. **重置逻辑**：点击"重置"按钮时，组件会：
   - 清空表单输入
   - 清空 Model 的 `wheres.filter` 状态
   - 调用 `getItems()` 方法重新获取数据

5. **字段配置**：如果 `filters` 为空数组，组件会使用 Model 中的所有字段生成表单。建议明确指定需要筛选的字段。

6. **样式定制**：`classNames` 对象中的每个属性都是可选的，只传入需要自定义的样式类名即可。

7. **布局建议**：
   - 字段较少（1-2 个）时，使用横向布局
   - 字段适中（3-4 个）时，使用 2-3 列网格布局
   - 字段较多（5+ 个）时，使用 3-4 列网格布局

8. **与分页配合**：筛选组件会自动重置分页到第一页，确保用户能看到筛选结果。

9. **性能考虑**：对于大量数据，建议在服务端实现筛选逻辑，而不是在客户端筛选。

10. **按钮样式**：查询和重置按钮的样式已内置，如需自定义，请考虑使用其他表单组件或自行实现。

11. **字段命名**：`filters` 配置中的 `key` 必须与 Model 中的字段名完全匹配，否则无法正确筛选。

12. **日期范围**：对于日期范围筛选，建议在 Model 中定义两个独立字段（如 `dateFrom` 和 `dateTo`），而不是使用单个字段。
