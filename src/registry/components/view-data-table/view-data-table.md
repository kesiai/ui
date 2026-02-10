# ViewDataTable 数据表格

## 简介

`ViewDataTable` 是一个功能强大的数据表格组件，基于 TanStack Table 构建，提供了丰富的数据展示和交互功能。

- **数据驱动**：通过 Model 自动获取和管理数据，无需手动处理数据请求
- **列配置灵活**：支持动态列定义、列宽调整、列固定和列排序
- **交互丰富**：内置行选择、列排序、列宽拖拽调整等功能
- **样式可定制**：支持多种表格布局样式，包括密集模式、边框、斑马纹等
- **响应式设计**：支持横向滚动，适配各种屏幕尺寸

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `className` | `string` | 否 | - | 自定义样式类名 |
| `tableLayout` | `TableLayoutProps` | 否 | 见下方 | 表格布局配置 |
| `tableOptions` | `TableOptions` | 否 | - | TanStack Table 配置选项 |
| `gridOptions` | `DataGridProps` | 否 | - | DataGrid 组件配置选项 |
| `children` | `ReactElement[]` | 否 | - | TableColumn 子组件 |

### TableLayoutProps

表格布局配置对象，控制表格的视觉样式和交互行为。

```typescript
interface TableLayoutProps {
  border?: boolean;              // 表格边框，默认 true
  dense?: boolean;               // 密集模式，默认 false
  cellBorder?: boolean;          // 单元格边框，默认 false
  rowBorder?: boolean;           // 行边框，默认 true
  rowRounded?: boolean;          // 行圆角，默认 false
  stripped?: boolean;            // 斑马纹，默认 false
  headerBackground?: boolean;    // 表头背景，默认 true
  headerBorder?: boolean;        // 表头边框，默认 true
  headerSticky?: boolean;        // 表头固定，默认 true
  width?: 'auto' | 'fixed';      // 列宽模式，默认 'fixed'
  layout?: 'auto' | 'fixed';     // 表格布局，默认 'fixed'
  columnsVisibility?: boolean;   // 列可见性，默认 false
  columnsResizable?: boolean;    // 列可调整，默认 true
  columnsPinnable?: boolean;     // 列可固定，默认 true
  columnsMovable?: boolean;      // 列可移动，默认 false
  columnsDraggable?: boolean;    // 列可拖拽，默认 false
  rowsDraggable?: boolean;       // 行可拖拽，默认 false
}
```

### TableColumn Props

通过 `TableColumn` 子组件可以自定义列的配置。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `name` | `string` | 是 | - | 列的字段名 |
| `title` | `string` | 否 | - | 列标题 |
| `width` | `number` | 否 | - | 列宽度 |
| `fixed` | `boolean \| 'left' \| 'right'` | 否 | - | 列固定位置 |
| `header` | `ReactNode` | 否 | - | 自定义表头 |
| `cell` | `ReactNode` | 否 | - | 自定义单元格 |
| `type` | `string` | 否 | - | 字段类型 |
| `level2` | `string` | 否 | - | 二级表头分组 |
| `children` | `ReactNode \| ((props: any) => ReactNode)` | 否 | - | 自定义渲染函数 |

## 基本用法

### 1. 基础数据表格

最简单的用法，使用 Model 自动获取数据并展示。

```tsx
import { ViewDataTable } from '@/registry/components/view-data-table/view-data-table'
import { ViewModel } from '@/registry/components/view-model/view-model'

function BasicTable() {
  return (
    <ViewModel tableId="task_def" modelName="task">
      <ViewDataTable />
    </ViewModel>
  )
}
```

### 2. 自定义表格布局

通过 `tableLayout` 属性自定义表格的视觉样式。

```tsx
import { ViewDataTable } from '@/registry/components/view-data-table/view-data-table'

function CustomStyledTable() {
  const tableLayout = {
    dense: true,           // 紧凑模式
    stripped: true,        // 斑马纹
    headerSticky: true,    // 固定表头
    columnsResizable: true // 可调整列宽
  }

  return (
    <ViewModel tableId="task_def" modelName="task">
      <ViewDataTable tableLayout={tableLayout} />
    </ViewModel>
  )
}
```

### 3. 自定义列配置

使用 `TableColumn` 子组件自定义列的渲染方式。

```tsx
import { ViewDataTable, TableColumn } from '@/registry/components/view-data-table/view-data-table'

function CustomColumnsTable() {
  return (
    <ViewModel tableId="user" modelName="user">
      <ViewDataTable>
        <TableColumn
          name="id"
          title="ID"
          width={80}
          fixed="left"
        />
        <TableColumn
          name="name"
          title="姓名"
          width={120}
        />
        <TableColumn
          name="email"
          title="邮箱"
          cell={(props) => {
            const value = props.getValue()
            return <a href={`mailto:${value}`}>{value}</a>
          }}
        />
        <TableColumn
          name="status"
          title="状态"
          type="boolean"
        />
      </ViewDataTable>
    </ViewModel>
  )
}
```

### 4. 禁用行选择和排序

```tsx
import { ViewDataTable } from '@/registry/components/view-data-table/view-data-table'

function ReadOnlyTable() {
  return (
    <ViewModel tableId="logs" modelName="log">
      <ViewDataTable
        tableOptions={{
          enableRowSelection: false,
          enableSorting: false,
          enableMultiSort: false
        }}
      />
    </ViewModel>
  )
}
```

### 5. 固定列

将重要列固定到左侧或右侧。

```tsx
import { ViewDataTable, TableColumn } from '@/registry/components/view-data-table/view-data-table'

function FixedColumnsTable() {
  return (
    <ViewModel tableId="orders" modelName="order">
      <ViewDataTable>
        <TableColumn
          name="id"
          title="订单号"
          fixed="left"
          width={120}
        />
        <TableColumn name="product" title="产品" />
        <TableColumn name="quantity" title="数量" />
        <TableColumn name="price" title="价格" />
        <TableColumn name="total" title="总额" />
        <TableColumn
          name="actions"
          title="操作"
          fixed="right"
          width={100}
        />
      </ViewDataTable>
    </ViewModel>
  )
}
```

### 6. 二级表头

使用 `level2` 属性创建分组表头。

```tsx
import { ViewDataTable, TableColumn } from '@/registry/components/view-data-table/view-data-table'

function GroupedHeaderTable() {
  return (
    <ViewModel tableId="products" modelName="product">
      <ViewDataTable>
        <TableColumn name="id" title="ID" />
        <TableColumn name="name" title="产品名称" level2="基本信息" />
        <TableColumn name="category" title="分类" level2="基本信息" />
        <TableColumn name="price" title="价格" level2="价格信息" />
        <TableColumn name="cost" title="成本" level2="价格信息" />
        <TableColumn name="profit" title="利润" level2="价格信息" />
      </ViewDataTable>
    </ViewModel>
  )
}
```

### 7. 自定义单元格渲染

使用 `children` 函数完全自定义单元格内容。

```tsx
import { ViewDataTable, TableColumn } from '@/registry/components/view-data-table/view-data-table'

function CustomCellTable() {
  return (
    <ViewModel tableId="users" modelName="user">
      <ViewDataTable>
        <TableColumn name="avatar" title="头像">
          {(props) => {
            const url = props.getValue()
            return <img src={url} alt="头像" className="w-8 h-8 rounded-full" />
          }}
        </TableColumn>
        <TableColumn name="name" title="姓名" />
        <TableColumn name="tags" title="标签">
          {(props) => {
            const tags = props.getValue() || []
            return (
              <div className="flex gap-1">
                {tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )
          }}
        </TableColumn>
      </ViewDataTable>
    </ViewModel>
  )
}
```

## 完整示例

### 任务管理表格

创建一个完整的任务管理表格，支持选择、排序和自定义操作列。

```tsx
import { ViewDataTable, TableColumn } from '@/registry/components/view-data-table/view-data-table'
import { ViewModel } from '@/registry/components/view-model/view-model'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useModelState } from '@airiot/client'

function TaskManagementTable() {
  const [selected] = useModelState('selected')

  const handleBatchDelete = () => {
    console.log('删除选中的任务:', selected)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">任务管理</h2>
        {selected?.length > 0 && (
          <Button variant="destructive" onClick={handleBatchDelete}>
            删除选中 ({selected.length})
          </Button>
        )}
      </div>

      <ViewModel tableId="task_def" modelName="task">
        <ViewDataTable
          tableLayout={{
            border: true,
            headerSticky: true,
            columnsResizable: true,
            columnsPinnable: true,
            stripped: true
          }}
        >
          <TableColumn
            name="id"
            title="任务ID"
            width={120}
            fixed="left"
          />
          <TableColumn
            name="title"
            title="任务标题"
            width={200}
          />
          <TableColumn
            name="status"
            title="状态"
            width={100}
          >
            {(props) => {
              const status = props.getValue()
              const statusMap = {
                pending: { label: '待处理', color: 'bg-yellow-100 text-yellow-800' },
                in_progress: { label: '进行中', color: 'bg-blue-100 text-blue-800' },
                completed: { label: '已完成', color: 'bg-green-100 text-green-800' }
              }
              const config = statusMap[status] || statusMap.pending
              return (
                <Badge className={config.color}>
                  {config.label}
                </Badge>
              )
            }}
          </TableColumn>
          <TableColumn
            name="priority"
            title="优先级"
            width={100}
          >
            {(props) => {
              const priority = props.getValue()
              const colors = {
                high: 'text-red-600',
                medium: 'text-yellow-600',
                low: 'text-green-600'
              }
              return <span className={colors[priority]}>{priority}</span>
            }}
          </TableColumn>
          <TableColumn
            name="assignee"
            title="负责人"
            width={120}
          />
          <TableColumn
            name="deadline"
            title="截止日期"
            width={150}
          />
          <TableColumn
            name="progress"
            title="进度"
            width={100}
          >
            {(props) => {
              const progress = props.getValue()
              return (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs">{progress}%</span>
                </div>
              )
            }}
          </TableColumn>
          <TableColumn
            name="actions"
            title="操作"
            fixed="right"
            width={150}
          >
            {(props) => {
              const row = props.row
              return (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">编辑</Button>
                  <Button size="sm" variant="ghost">删除</Button>
                </div>
              )
            }}
          </TableColumn>
        </ViewDataTable>
      </ViewModel>
    </div>
  )
}
```

### 用户列表表格

创建一个用户列表，包含头像、状态和操作列。

```tsx
import { ViewDataTable, TableColumn } from '@/registry/components/view-data-table/view-data-table'
import { ViewModel } from '@/registry/components/view-model/view-model'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function UserListTable() {
  return (
    <ViewModel tableId="user" modelName="user">
      <ViewDataTable
        tableLayout={{
          dense: false,
          border: true,
          headerBackground: true,
          columnsResizable: true,
          rowBorder: true
        }}
        tableOptions={{
          initialState: {
            sorting: [
              { id: 'createdAt', desc: true }
            ]
          }
        }}
      >
        <TableColumn
          name="id"
          title="ID"
          width={80}
        />
        <TableColumn
          name="avatar"
          title="头像"
          width={80}
        >
          {(props) => {
            const avatar = props.getValue()
            return (
              <img
                src={avatar || '/default-avatar.png'}
                alt="头像"
                className="w-10 h-10 rounded-full"
              />
            )
          }}
        </TableColumn>
        <TableColumn
          name="username"
          title="用户名"
          width={120}
        />
        <TableColumn
          name="email"
          title="邮箱"
          width={200}
        />
        <TableColumn
          name="role"
          title="角色"
          width={100}
        >
          {(props) => {
            const role = props.getValue()
            const roleColors = {
              admin: 'bg-purple-100 text-purple-800',
              user: 'bg-gray-100 text-gray-800',
              moderator: 'bg-blue-100 text-blue-800'
            }
            return (
              <Badge className={roleColors[role]}>
                {role}
              </Badge>
            )
          }}
        </TableColumn>
        <TableColumn
          name="isActive"
          title="状态"
          width={80}
        >
          {(props) => {
            const isActive = props.getValue()
            return (
              <Badge variant={isActive ? 'default' : 'secondary'}>
                {isActive ? '活跃' : '禁用'}
              </Badge>
            )
          }}
        </TableColumn>
        <TableColumn
          name="lastLogin"
          title="最后登录"
          width={150}
        />
        <TableColumn
          name="actions"
          title="操作"
          fixed="right"
          width={180}
        >
          {(props) => (
            <div className="flex gap-2">
              <Button size="sm" variant="outline">查看</Button>
              <Button size="sm" variant="outline">编辑</Button>
              <Button size="sm" variant="ghost">删除</Button>
            </div>
          )}
        </TableColumn>
      </ViewDataTable>
    </ViewModel>
  )
}
```

## 注意事项

1. **Model 配置**：必须在使用 `ViewDataTable` 的外层包裹 `ViewModel` 组件，并正确配置 `tableId` 和 `modelName`，否则无法获取数据。

2. **性能优化**：对于大数据量（超过 1000 行），建议启用虚拟滚动或分页功能，避免一次性渲染过多 DOM 节点。

3. **列固定**：固定的列（`fixed` 属性）需要设置明确的 `width`，否则可能影响布局效果。

4. **自定义渲染**：使用 `TableColumn` 的 `children` 或 `cell` 属性时，注意函数参数是 `CellContext` 对象，通过 `getValue()` 获取单元格值，通过 `row.original` 获取整行数据。

5. **排序状态**：组件会自动将排序状态同步到 Model 的 `order` 状态，确保后端接口支持排序参数。

6. **行选择**：选中的行会自动同步到 Model 的 `selected` 状态，可以通过 `useModelState('selected')` 获取选中项。

7. **样式覆盖**：如需深度定制样式，建议使用 `className` 属性配合 Tailwind CSS，而不是修改组件内部样式。

8. **二级表头**：使用 `level2` 属性时，确保具有相同 `level2` 值的列在配置中连续排列，否则分组会出错。
