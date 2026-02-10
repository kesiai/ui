# ViewPagination 分页组件

## 简介

`ViewPagination` 是一个功能完整的分页组件，用于处理大数据集的分页展示。

- **自动数据绑定**：通过 Model hooks 自动管理分页状态和总数据量
- **灵活的配置选项**：支持显示/隐藏总数、每页条数选择器、快速跳转等功能
- **智能页码展示**：自动计算页码，省略号显示，避免页码过多
- **响应式设计**：适配各种屏幕尺寸，保持良好的用户体验
- **禁用状态支持**：支持禁用状态，适用于只读场景

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `showSizeChanger` | `boolean` | 否 | `false` | 是否显示每页条数选择器 |
| `showQuickJumper` | `boolean` | 否 | `true` | 是否显示快速跳转输入框 |
| `showTotal` | `boolean` | 否 | `false` | 是否显示数据总数 |
| `pageSizeOptions` | `number[]` | 否 | `[10, 20, 50, 100]` | 每页条数选项 |
| `className` | `string` | 否 | - | 自定义样式类名 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用分页组件 |

## 基本用法

### 1. 基础分页

最简单的分页组件，只有上一页、下一页和页码。

```tsx
import { ViewPagination } from '@/registry/components/view-pagination/view-pagination'
import { ViewModel } from '@/registry/components/view-model/view-model'

function BasicPagination() {
  return (
    <ViewModel tableId="task_def" modelName="task">
      <ViewPagination />
    </ViewModel>
  )
}
```

### 2. 显示总数

显示当前数据集的总记录数。

```tsx
import { ViewPagination } from '@/registry/components/view-pagination/view-pagination'
import { ViewModel } from '@/registry/components/view-model/view-model'

function PaginationWithTotal() {
  return (
    <ViewModel tableId="task_def" modelName="task">
      <ViewPagination showTotal={true} />
    </ViewModel>
  )
}
```

### 3. 每页条数选择器

允许用户切换每页显示的数据条数。

```tsx
import { ViewPagination } from '@/registry/components/view-pagination/view-pagination'
import { ViewModel } from '@/registry/components/view-model/view-model'

function PaginationWithSizeChanger() {
  return (
    <ViewModel tableId="task_def" modelName="task">
      <ViewPagination
        showSizeChanger={true}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </ViewModel>
  )
}
```

### 4. 快速跳转

提供输入框，让用户可以直接跳转到指定页码。

```tsx
import { ViewPagination } from '@/registry/components/view-pagination/view-pagination'
import { ViewModel } from '@/registry/components/view-model/view-model'

function PaginationWithJumper() {
  return (
    <ViewModel tableId="task_def" modelName="task">
      <ViewPagination showQuickJumper={true} />
    </ViewModel>
  )
}
```

### 5. 完整功能

启用所有功能的完整分页组件。

```tsx
import { ViewPagination } from '@/registry/components/view-pagination/view-pagination'
import { ViewModel } from '@/registry/components/view-model/view-model'

function FullPagination() {
  return (
    <ViewModel tableId="task_def" modelName="task">
      <ViewPagination
        showTotal={true}
        showSizeChanger={true}
        showQuickJumper={true}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </ViewModel>
  )
}
```

### 6. 禁用状态

在某些场景下禁用分页组件。

```tsx
import { ViewPagination } from '@/registry/components/view-pagination/view-pagination'
import { ViewModel } from '@/registry/components/view-model/view-model'

function DisabledPagination() {
  return (
    <ViewModel tableId="task_def" modelName="task">
      <ViewPagination disabled={true} />
    </ViewModel>
  )
}
```

### 7. 配合数据表格使用

将分页组件与数据表格配合使用。

```tsx
import { ViewPagination } from '@/registry/components/view-pagination/view-pagination'
import { ViewDataTable } from '@/registry/components/view-data-table/view-data-table'
import { ViewModel } from '@/registry/components/view-model/view-model'

function TableWithPagination() {
  return (
    <ViewModel tableId="task_def" modelName="task">
      <div className="space-y-4">
        {/* 数据表格 */}
        <ViewDataTable />

        {/* 分页组件 */}
        <ViewPagination
          showTotal={true}
          showSizeChanger={true}
          showQuickJumper={true}
        />
      </div>
    </ViewModel>
  )
}
```

### 8. 自定义每页条数选项

自定义每页条数选择器的选项。

```tsx
import { ViewPagination } from '@/registry/components/view-pagination/view-pagination'
import { ViewModel } from '@/registry/components/view-model/view-model'

function CustomPageSizeOptions() {
  return (
    <ViewModel tableId="task_def" modelName="task">
      <ViewPagination
        showSizeChanger={true}
        pageSizeOptions={[5, 10, 25, 50, 100, 200]}
      />
    </ViewModel>
  )
}
```

## 完整示例

### 任务列表分页

创建一个完整的任务列表页面，包含表格和分页。

```tsx
import { ViewPagination } from '@/registry/components/view-pagination/view-pagination'
import { ViewDataTable, TableColumn } from '@/registry/components/view-data-table/view-data-table'
import { ViewModel } from '@/registry/components/view-model/view-model'
import { Card } from '@/components/ui/card'

function TaskListWithPagination() {
  return (
    <ViewModel tableId="task_def" modelName="task">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold">任务管理</h1>
          <p className="text-gray-600">查看和管理所有任务</p>
        </div>

        {/* 数据表格 */}
        <Card className="p-6">
          <ViewDataTable>
            <TableColumn name="id" title="任务ID" width={120} />
            <TableColumn name="title" title="任务标题" />
            <TableColumn name="status" title="状态" width={100} />
            <TableColumn name="priority" title="优先级" width={100} />
            <TableColumn name="assignee" title="负责人" width={120} />
            <TableColumn name="deadline" title="截止日期" width={150} />
          </ViewDataTable>
        </Card>

        {/* 分页组件 */}
        <div className="flex justify-center">
          <ViewPagination
            showTotal={true}
            showSizeChanger={true}
            showQuickJumper={true}
            pageSizeOptions={[10, 20, 50, 100]}
            className="bg-white p-4 rounded-lg shadow"
          />
        </div>
      </div>
    </ViewModel>
  )
}
```

### 用户管理分页

创建一个用户管理页面，展示分页的各种功能。

```tsx
import { ViewPagination } from '@/registry/components/view-pagination/view-pagination'
import { ViewDataTable, TableColumn } from '@/registry/components/view-data-table/view-data-table'
import { ViewModel } from '@/registry/components/view-model/view-model'
import { Button } from '@/components/ui/button'

function UserManagementWithPagination() {
  return (
    <ViewModel tableId="user" modelName="user">
      <div className="space-y-6">
        {/* 工具栏 */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">用户管理</h1>
          <Button>添加用户</Button>
        </div>

        {/* 用户列表 */}
        <ViewDataTable>
          <TableColumn name="id" title="ID" width={80} />
          <TableColumn name="username" title="用户名" width={120} />
          <TableColumn name="email" title="邮箱" width={200} />
          <TableColumn name="role" title="角色" width={100} />
          <TableColumn name="department" title="部门" width={150} />
          <TableColumn name="status" title="状态" width={80} />
          <TableColumn name="lastLogin" title="最后登录" width={150} />
          <TableColumn name="actions" title="操作" fixed="right" width={150} />
        </ViewDataTable>

        {/* 分页 */}
        <ViewPagination
          showTotal={true}
          showSizeChanger={true}
          showQuickJumper={false}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </div>
    </ViewModel>
  )
}
```

### 简洁分页样式

创建一个简洁的分页组件，只显示必要的功能。

```tsx
import { ViewPagination } from '@/registry/components/view-pagination/view-pagination'
import { ViewDataTable } from '@/registry/components/view-data-table/view-data-table'
import { ViewModel } from '@/registry/components/view-model/view-model'

function MinimalPagination() {
  return (
    <ViewModel tableId="logs" modelName="log">
      <div className="space-y-4">
        <ViewDataTable />

        <div className="flex justify-between items-center">
          <ViewPagination
            showTotal={true}
            showSizeChanger={false}
            showQuickJumper={false}
          />
        </div>
      </div>
    </ViewModel>
  )
}
```

### 移动端适配的分页

为移动端优化的分页组件布局。

```tsx
import { ViewPagination } from '@/registry/components/view-pagination/view-pagination'
import { ViewDataTable } from '@/registry/components/view-data-table/view-data-table'
import { ViewModel } from '@/registry/components/view-model/view-model'

function MobilePagination() {
  return (
    <ViewModel tableId="products" modelName="product">
      <div className="space-y-4">
        <ViewDataTable />

        {/* 移动端分页：垂直布局 */}
        <div className="md:hidden">
          <ViewPagination
            showTotal={true}
            showSizeChanger={true}
            showQuickJumper={false}
            pageSizeOptions={[10, 20, 50]}
            className="flex-col gap-4"
          />
        </div>

        {/* 桌面端分页：水平布局 */}
        <div className="hidden md:block">
          <ViewPagination
            showTotal={true}
            showSizeChanger={true}
            showQuickJumper={true}
            pageSizeOptions={[10, 20, 50, 100]}
          />
        </div>
      </div>
    </ViewModel>
  )
}
```

### 带统计信息的分页

在分页组件上方显示额外的统计信息。

```tsx
import { ViewPagination } from '@/registry/components/view-pagination/view-pagination'
import { ViewDataTable } from '@/registry/components/view-data-table/view-data-table'
import { ViewModel } from '@/registry/components/view-model/view-model'
import { useModelPagination, useModelPageSize, useModelCount } from '@airiot/client'

function PaginationWithStats() {
  return (
    <ViewModel tableId="orders" modelName="order">
      <div className="space-y-4">
        <ViewDataTable />

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              显示统计信息...
            </div>
          </div>

          <ViewPagination
            showTotal={false}
            showSizeChanger={true}
            showQuickJumper={true}
          />
        </div>
      </div>
    </ViewModel>
  )
}
```

## 注意事项

1. **Model 依赖**：`ViewPagination` 组件必须包裹在 `ViewModel` 组件中使用，因为它依赖以下 hooks：
   - `useModelPagination`：获取分页状态和切换页码
   - `useModelPageSize`：获取和设置每页条数
   - `useModelCount`：获取数据总数

2. **数据获取**：分页组件不会自动触发数据获取，需要配合 `ViewDataTable` 或手动调用 `getItems()` 方法。

3. **页码计算**：组件会根据 `items`（总页数）和 `activePage`（当前页）自动计算需要显示的页码，超过 7 页时会使用省略号。

4. **快速跳转限制**：快速跳转输入框只在总页数大于 5 时显示，避免页面过于拥挤。

5. **每页条数选项**：确保 `pageSizeOptions` 数组中的值都是正整数，且按升序排列。

6. **禁用状态**：当 `disabled` 为 `true` 时，所有交互（翻页、切换每页条数、快速跳转）都会被禁用。

7. **样式定制**：通过 `className` 属性可以添加自定义样式，但请注意不要覆盖核心样式，否则可能影响布局。

8. **性能考虑**：对于大数据集，建议：
   - 合理设置每页条数（10-100 之间）
   - 避免在页码过多时使用快速跳转
   - 在服务端实现分页逻辑

9. **与筛选配合**：当使用 `ViewFilter` 组件时，筛选条件改变会自动重置到第一页，确保用户能看到筛选结果。

10. **与排序配合**：排序操作不会重置当前页码，用户可以保持在当前页面查看排序后的结果。

11. **总页数为 1**：当总页数只有 1 页时，组件仍然会显示，但翻页按钮会被禁用。

12. **响应式设计**：在移动端设备上，建议：
   - 隐藏快速跳转功能
   - 减少每页条数选项
   - 使用垂直布局

13. **国际化**：组件文本（"上一页"、"下一页"、"跳至"、"页"等）目前是中文硬编码，如需其他语言，请自行实现分页组件。

14. **浏览器兼容性**：组件使用现代 CSS 特性，建议在支持 ES6+ 的现代浏览器中使用。
