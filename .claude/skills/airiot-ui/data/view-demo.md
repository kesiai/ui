# ViewDemo 综合演示

## 简介

`ViewDemo` 是一个综合演示组件，展示了如何组合使用多个 view 组件构建一个完整的数据管理界面。

- **完整示例**：展示了表格、分页、操作、批量操作、工具栏等组件的组合使用
- **最佳实践**：提供了组件协作和数据流的最佳实践示例
- **开箱即用**：可以直接复制代码作为项目模板使用
- **功能齐全**：包含了新建、查看、编辑、删除、批量操作等完整 CRUD 功能

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `modelName` | `string` | 否 | - | 内置模型名称 |
| `tableId` | `string` | 否 | `'task_def'` | 数据表格的唯一标识符 |

## 基本用法

### 1. 使用默认配置

最简单的方式是直接使用 ViewDemo 组件，它会自动使用 task_def 表格。

```tsx
import { ViewDemo } from '@/components/airiot/view-demo/view-demo'

function App() {
  return <ViewDemo />
}
```

### 2. 指定数据源

为 ViewDemo 指定要显示的数据模型。

```tsx
import { ViewDemo } from '@/components/airiot/view-demo/view-demo'

function App() {
  return <ViewDemo tableId="user" />
}
```

### 3. 使用内置模型

使用项目中预定义的内置模型。

```tsx
import { ViewDemo } from '@/components/airiot/view-demo/view-demo'

function App() {
  return <ViewDemo modelName="user" tableId="user" />
}
```

## 完整示例

### 自定义综合管理界面

基于 ViewDemo 的结构，创建一个自定义的用户管理界面。

```tsx
import ViewModel from '@/components/airiot/view-model/view-model'
import ViewDataTable, { TableColumn } from '@/components/airiot/view-data-table/view-data-table'
import ViewPagination from '@/components/airiot/view-pagination/view-pagination'
import Actions, { CreateAction } from '@/components/airiot/view-actions/view-actions'
import Tools from '@/components/airiot/view-tools/view-tools'
import BatchActions from '@/components/airiot/view-batch/view-batch'
import { Card } from '@/components/ui/card'

function UserManagement() {
  return (
    <div className="p-6">
      <ViewModel tableId="user">
        <Card className="p-6 space-y-6">
          {/* 顶部工具栏 */}
          <div className="flex items-center justify-between">
            <CreateAction>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                新建用户
              </button>
            </CreateAction>
            <Tools tools={['count', 'pageSize', 'columns']} />
          </div>

          {/* 数据表格 */}
          <ViewDataTable>
            <TableColumn name="id" title="ID" width={180} />
            <TableColumn name="name" title="姓名" />
            <TableColumn name="email" title="邮箱" />
            <TableColumn name="role" title="角色" />
            <TableColumn name="status" title="状态" />
            <TableColumn name="createdAt" title="创建时间" />
            <TableColumn
              name="__actions__"
              title="操作"
              width={80}
              enableSorting={false}
              enableHiding={false}
              enableResizing={false}
            >
              <Actions
                variant="dropdown"
                actions={['view', 'edit', 'delete', 'export', 'copy']}
              />
            </TableColumn>
          </ViewDataTable>

          {/* 底部工具栏 */}
          <div className="flex items-center justify-between">
            <BatchActions actions={['batch-change', 'batch-delete']} />
            <ViewPagination />
          </div>
        </Card>
      </ViewModel>
    </div>
  )
}
```

### 任务管理系统

基于 ViewDemo 结构的任务管理系统示例。

```tsx
import ViewModel from '@/components/airiot/view-model/view-model'
import ViewDataTable, { TableColumn } from '@/components/airiot/view-data-table/view-data-table'
import ViewPagination from '@/components/airiot/view-pagination/view-pagination'
import Actions, { CreateAction } from '@/components/airiot/view-actions/view-actions'
import Tools from '@/components/airiot/view-tools/view-tools'
import BatchActions from '@/components/airiot/view-batch/view-batch'
import { Badge } from '@/components/ui/badge'

function TaskManagement() {
  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">任务管理</h1>
          <p className="text-slate-600 mt-2">管理和跟踪所有任务</p>
        </div>
        <Badge variant="secondary">管理后台</Badge>
      </div>

      <ViewModel tableId="task_def">
        <div className="bg-white rounded-lg border shadow-sm p-6 space-y-6">
          {/* 顶部操作栏 */}
          <div className="flex items-center justify-between">
            <CreateAction modelName="task_def">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <span>新建任务</span>
              </button>
            </CreateAction>
            <Tools
              tools={['count', 'pageSize', 'columns', 'refresh']}
              buttonVariant="outline"
            />
          </div>

          {/* 任务列表 */}
          <ViewDataTable>
            <TableColumn name="id" title="任务ID" width={200} />
            <TableColumn name="name" title="任务名称" width={250} />
            <TableColumn name="status" title="状态" width={120}>
              {(value) => {
                const statusColors = {
                  pending: 'bg-yellow-100 text-yellow-800',
                  in_progress: 'bg-blue-100 text-blue-800',
                  completed: 'bg-green-100 text-green-800'
                }
                return (
                  <Badge className={statusColors[value] || 'bg-gray-100'}>
                    {value}
                  </Badge>
                )
              }}
            </TableColumn>
            <TableColumn name="priority" title="优先级" width={100} />
            <TableColumn name="assignee" title="负责人" width={120} />
            <TableColumn name="dueDate" title="截止日期" width={120} />
            <TableColumn name="createdAt" title="创建时间" width={180} />
            <TableColumn
              name="__actions__"
              title=""
              width={80}
              enableSorting={false}
              enableHiding={false}
              enableResizing={false}
            >
              <Actions
                variant="dropdown"
                actions={['view', 'edit', 'delete', 'copy']}
              />
            </TableColumn>
          </ViewDataTable>

          {/* 底部工具栏 */}
          <div className="flex items-center justify-between border-t pt-4">
            <BatchActions
              actions={['batch-delete']}
              variant="buttons"
            />
            <ViewPagination
              pageSizeOptions={[10, 20, 50, 100]}
              defaultPageSize={20}
            />
          </div>
        </div>
      </ViewModel>
    </div>
  )
}
```

### 设备监控面板

基于 ViewDemo 结构的设备监控面板示例。

```tsx
import ViewModel from '@/components/airiot/view-model/view-model'
import ViewDataTable, { TableColumn } from '@/components/airiot/view-data-table/view-data-table'
import ViewPagination from '@/components/airiot/view-pagination/view-pagination'
import Actions from '@/components/airiot/view-actions/view-actions'
import Tools from '@/components/airiot/view-tools/view-tools'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity } from 'lucide-react'

function DeviceMonitor() {
  return (
    <div className="p-6 space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">设备总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">在线设备</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">142</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">离线设备</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">14</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">告警设备</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">3</div>
          </CardContent>
        </Card>
      </div>

      {/* 设备列表 */}
      <ViewModel tableId="device">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                设备列表
              </CardTitle>
              <Tools tools={['count', 'pageSize', 'columns', 'refresh']} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ViewDataTable>
              <TableColumn name="id" title="设备ID" width={200} />
              <TableColumn name="name" title="设备名称" />
              <TableColumn name="type" title="设备类型" width={120} />
              <TableColumn name="status" title="状态" width={100}>
                {(value) => (
                  <Badge
                    variant={value === 'online' ? 'default' : 'secondary'}
                  >
                    {value}
                  </Badge>
                )}
              </TableColumn>
              <TableColumn name="temperature" title="温度(°C)" width={100} />
              <TableColumn name="humidity" title="湿度(%)" width={100} />
              <TableColumn name="lastUpdate" title="最后更新" width={180} />
              <TableColumn
                name="__actions__"
                title="操作"
                width={80}
                enableSorting={false}
              >
                <Actions
                  variant="dropdown"
                  actions={['view', 'edit']}
                />
              </TableColumn>
            </ViewDataTable>

            <div className="flex justify-center">
              <ViewPagination />
            </div>
          </CardContent>
        </Card>
      </ViewModel>
    </div>
  )
}
```

## 注意事项

1. **ViewModel 必需**：ViewDemo 必须在 ViewModel 组件内部使用，否则无法获取数据和执行操作

2. **组件版本**：确保所有 view-* 组件版本兼容，建议使用同一版本的组件库

3. **表格列配置**：TableColumn 的 __actions__ 列是固定的操作列，不要修改其配置

4. **数据模型**：tableId 必须在系统中存在，否则会显示"无可配置项"

5. **权限控制**：根据实际需求，可以使用权限控制来隐藏或禁用某些操作

6. **响应式设计**：在移动端，建议将 variant 改为 dropdown 以节省空间

7. **性能优化**：大数据量时，考虑使用虚拟滚动或分页优化性能

8. **国际化**：如需支持多语言，需要在所有组件中添加 i18n 配置

9. **样式定制**：可以通过 className 或 style 属性自定义组件样式

10. **扩展功能**：可以根据业务需求添加自定义列、自定义操作等功能
