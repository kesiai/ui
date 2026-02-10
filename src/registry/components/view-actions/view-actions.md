# ViewActions 操作组件集合

## 简介

`ViewActions` 是一个为数据列表操作提供完整 CRUD 功能的组件集合，包含了查看、编辑、删除、新建、导出和复制等常用操作。

- **6个独立组件**：提供 CreateAction、ViewAction、EditAction、DeleteAction、ExportAction、CopyAction 六个独立操作组件，可单独使用或组合使用
- **容器组件**：提供 Actions 容器组件，可批量管理多个操作并支持按钮组和下拉菜单两种展示方式
- **自动数据管理**：内置数据加载、保存、删除等逻辑，无需手动处理 API 调用和状态管理
- **灵活的交互方式**：支持 Dialog 和 Popover 两种交互模式，提供流畅的用户体验
- **自动刷新机制**：编辑和新建操作成功后自动刷新列表数据，保持数据同步

## Props 参数说明

### Actions 组件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `itemId` | `string` | 否* | - | 要操作的数据ID（除 create 外其他操作必需） |
| `item` | `{ id: string } & any` | 否* | - | 数据对象（包含 id 字段），与 itemId 二选一 |
| `modelId` | `string` | 否 | - | 模型标识符，用于指定操作的模型 |
| `actions` | `ActionType[]` | 否 | `['view', 'edit']` | 启用的操作数组 |
| `variant` | `'buttons' \| 'dropdown'` | 否 | `'dropdown'` | 操作按钮的展示方式 |

**ActionType 类型**：`'create' | 'edit' | 'delete' | 'view' | 'export' | 'copy'`

### CreateAction 组件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `children` | `ReactNode` | 否 | 默认按钮 | 自定义触发元素 |

### ViewAction 组件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `itemId` | `string` | 是 | - | 要查看的数据ID |
| `children` | `ReactNode` | 否 | 默认按钮 | 自定义触发元素 |

### EditAction 组件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `itemId` | `string` | 是 | - | 要编辑的数据ID |
| `children` | `ReactNode` | 否 | 默认按钮 | 自定义触发元素 |

### DeleteAction 组件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `itemId` | `string` | 是 | - | 要删除的数据ID |
| `confirmMessage` | `string` | 否 | `'确定要删除这条数据吗？'` | 删除确认提示信息 |
| `children` | `ReactNode` | 否 | 默认按钮 | 自定义触发元素 |

### ExportAction 组件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `itemId` | `string` | 是 | - | 要导出的数据ID |
| `format` | `'json' \| 'csv' \| 'excel'` | 否 | `'json'` | 导出文件格式 |
| `children` | `ReactNode` | 否 | 默认按钮 | 自定义触发元素 |

### CopyAction 组件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `itemId` | `string` | 是 | - | 要复制的数据ID |
| `children` | `ReactNode` | 否 | 默认按钮 | 自定义触发元素 |

## 基本用法

### 1. 使用 Actions 容器组件（推荐）

最简单的方式是使用 Actions 容器组件，它会自动管理所有操作的显示和交互。

```tsx
import { Actions } from '@/registry/components/view-actions/view-actions'

function DataTable() {
  return (
    <Actions
      modelId="user"
      itemId="692004b03b11710131077e40"
      actions={['view', 'edit', 'delete', 'export', 'copy']}
      variant="dropdown"
    />
  )
}
```

### 2. 按钮组形式

使用按钮组形式可以更直观地展示所有操作。

```tsx
import { Actions } from '@/registry/components/view-actions/view-actions'

function DataTable() {
  return (
    <Actions
      modelId="task"
      itemId={item.id}
      actions={['view', 'edit', 'delete']}
      variant="buttons"
    />
  )
}
```

### 3. 单独使用 CreateAction

CreateAction 不需要 itemId，通常用于表格顶部的新建按钮。

```tsx
import { CreateAction } from '@/registry/components/view-actions/view-actions'

function DataTable() {
  return (
    <div className="flex justify-between items-center">
      <h2>用户列表</h2>
      <CreateAction modelId="user" />
    </div>
  )
}
```

### 4. 自定义触发元素

可以传入自定义的按钮或触发元素。

```tsx
import { EditAction } from '@/registry/components/view-actions/view-actions'
import { Button } from '@/components/ui/button'

function DataTable({ itemId }) {
  return (
    <EditAction itemId={itemId}>
      <Button variant="outline" size="sm">
        编辑此条目
      </Button>
    </EditAction>
  )
}
```

### 5. 使用 item 对象

可以直接传入包含 id 的数据对象，无需单独传递 itemId。

```tsx
import { Actions } from '@/registry/components/view-actions/view-actions'

function DataTable({ user }) {
  return (
    <Actions
      item={user}
      actions={['view', 'edit', 'delete']}
      variant="dropdown"
    />
  )
}
```

### 6. 删除操作自定义确认信息

为删除操作提供更具体的确认信息。

```tsx
import { DeleteAction } from '@/registry/components/view-actions/view-actions'

function DataTable({ itemId }) {
  return (
    <DeleteAction
      itemId={itemId}
      confirmMessage="删除此用户后将无法恢复，确定要删除吗？"
    />
  )
}
```

### 7. 导出不同格式

导出操作支持 JSON、CSV 和 Excel 三种格式。

```tsx
import { ExportAction } from '@/registry/components/view-actions/view-actions'

function DataTable({ itemId }) {
  return (
    <div className="flex gap-2">
      <ExportAction itemId={itemId} format="json">
        <Button variant="outline">导出 JSON</Button>
      </ExportAction>
      <ExportAction itemId={itemId} format="csv">
        <Button variant="outline">导出 CSV</Button>
      </ExportAction>
    </div>
  )
}
```

## 完整示例

### 用户管理表格

完整的用户管理表格，包含新建、查看、编辑、删除等操作。

```tsx
import { Actions, CreateAction } from '@/registry/components/view-actions/view-actions'
import { useModelGetItems } from '@airiot/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface User {
  id: string
  name: string
  email: string
  role: string
}

function UserTable() {
  const { items, loading } = useModelGetItems()

  if (loading) return <div>加载中...</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">用户管理</h2>
        <CreateAction modelId="user">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            新建用户
          </button>
        </CreateAction>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead>角色</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-right">
                <Actions
                  item={user}
                  actions={['view', 'edit', 'delete', 'copy']}
                  variant="buttons"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

### 任务列表卡片

使用卡片布局的任务列表，展示更灵活的操作方式。

```tsx
import { Actions } from '@/registry/components/view-actions/view-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Task {
  id: string
  title: string
  status: string
  priority: string
  assignee: string
}

function TaskCard({ task }: { task: Task }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{task.title}</CardTitle>
        <Actions
          item={task}
          actions={['view', 'edit', 'delete']}
          variant="dropdown"
        />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Badge className={statusColors[task.status]}>
            {task.status}
          </Badge>
          <span>•</span>
          <span>{task.priority}</span>
          <span>•</span>
          <span>{task.assignee}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function TaskBoard() {
  const { items: tasks } = useModelGetItems()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks?.map((task: Task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
```

### 数据导出中心

提供多种导出格式的数据导出中心。

```tsx
import { ExportAction } from '@/registry/components/view-actions/view-actions'
import { Button } from '@/components/ui/button'
import { Download, FileJson, FileSpreadsheet } from 'lucide-react'

function ExportCenter({ itemId }: { itemId: string }) {
  return (
    <div className="space-y-4 p-6 bg-slate-50 rounded-lg">
      <h3 className="text-lg font-semibold">导出数据</h3>
      <p className="text-sm text-slate-600">
        选择您需要的导出格式
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ExportAction itemId={itemId} format="json">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
            <FileJson className="h-8 w-8" />
            <span>JSON 格式</span>
            <span className="text-xs text-slate-500">适合开发者使用</span>
          </Button>
        </ExportAction>

        <ExportAction itemId={itemId} format="csv">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
            <FileSpreadsheet className="h-8 w-8" />
            <span>CSV 格式</span>
            <span className="text-xs text-slate-500">适合 Excel 打开</span>
          </Button>
        </ExportAction>

        <ExportAction itemId={itemId} format="excel">
          <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
            <Download className="h-8 w-8" />
            <span>Excel 格式</span>
            <span className="text-xs text-slate-500">保持格式和样式</span>
          </Button>
        </ExportAction>
      </div>
    </div>
  )
}
```

## 注意事项

1. **ViewModel 上下文依赖**：所有 Action 组件都需要在 ViewModel 提供的上下文中使用，否则无法获取数据和执行操作

2. **itemId 必需性**：除 CreateAction 外，所有操作都需要 itemId 或 item 参数（包含 id 字段），否则组件不会渲染

3. **自动刷新机制**：EditAction 和 CreateAction 在保存成功后会自动调用 `getItems()` 刷新列表，确保数据同步

4. **删除操作不可逆**：DeleteAction 执行的删除操作是不可逆的，建议在 confirmMessage 中提供明确的提示信息

5. **导出格式限制**：Excel 格式导出目前仍使用 JSON 内容，需要集成 xlsx 等第三方库才能生成真正的 Excel 文件

6. **自定义触发器**：所有 Action 组件都支持 children 自定义触发元素，但需要注意保持与原组件的交互逻辑一致

7. **Dialog 尺寸**：View 和 Edit 操作的 Dialog 默认使用 `max-w-4xl` 宽度，对于字段较多的表单可能需要调整

8. **性能考虑**：Dropdown 模式下所有操作都会预加载到 DOM 中，而 Buttons 模式会直接渲染所有按钮，根据实际需求选择合适的展示方式
