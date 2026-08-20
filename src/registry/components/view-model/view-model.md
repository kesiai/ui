> **安装命令**: `npx shadcn@latest add @kesi/view-model`

# ViewModel 模型视图容器

## 简介

`ViewModel` 是一个为数据表格提供上下文和配置的容器组件，所有 view-* 组件都需要在其内部使用。

- **上下文提供**：为子组件提供数据模型、状态管理和操作方法的共享上下文
- **灵活配置**：支持查询字段、筛选条件、排序规则等多种数据获取配置
- **双模式支持**：支持 tableId（外部表）和 modelName（内置模型）两种数据源
- **自动刷新**：可配置定时自动刷新数据，保持数据实时性
- **性能优化**：支持限制返回字段和数据量，提升性能

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `tableId` | `string` | 否* | - | 数据表的唯一标识符（与 modelName 二选一） |
| `modelName` | `string` | 否* | - | 内置模型名称（与 tableId 二选一） |
| `initQuery` | `boolean` | 否 | `false` | 是否在视图显示时就查询一次数据 |
| `queryFields` | `string[]` | 否 | - | 指定要查询的字段列表，为空则查询所有字段 |
| `projectAll` | `boolean` | 否 | `false` | 是否查询所有字段（包括嵌套字段） |
| `limit` | `number` | 否 | `10` | 限制返回的数据条数 |
| `tableFilters` | `TableFilter[]` | 否 | - | 表格筛选条件数组 |
| `fieldOrder` | `Record<string, 'asc' \| 'desc'>[]` | 否 | - | 字段排序规则 |
| `interval` | `number` | 否 | `0` | 数据自动刷新间隔（毫秒），0 表示不刷新 |
| `statePersistence` | `ViewStatePersistenceConfig` | 否 | - | 视图状态持久化配置（过滤器/分页/排序/列显示/列宽缓存） |
| `loadingComponent` | `ReactNode` | 否 | - | 加载时显示的组件 |
| `children` | `ReactNode` | 是 | - | 子组件 |

### TableFilter 接口

表格筛选条件接口：

```typescript
interface TableFilter {
  [key: string]: any  // 筛选条件的键值对
}
```

## 基本用法

### 1. 使用 tableId（外部表）

最常见的方式是通过 tableId 指定要查询的数据表。

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model'

function UserTable() {
  return (
    <ViewModel tableId="user">
      {/* 其他 view-* 组件 */}
    </ViewModel>
  )
}
```

### 2. 使用 modelName（内置模型）

使用项目中预定义的内置模型。

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model'

function TaskList() {
  return (
    <ViewModel modelName="task">
      {/* 其他 view-* 组件 */}
    </ViewModel>
  )
}
```

### 3. 立即查询数据

设置 initQuery 为 true，组件加载时立即查询数据。

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model'

function ProductList() {
  return (
    <ViewModel
      tableId="product"
      initQuery={true}
    >
      {/* 其他 view-* 组件 */}
    </ViewModel>
  )
}
```

### 4. 指定查询字段

只查询需要的字段，减少数据传输量。

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model'

function OrderList() {
  return (
    <ViewModel
      tableId="order"
      queryFields={['id', 'orderNo', 'status', 'totalAmount']}
    >
      {/* 其他 view-* 组件 */}
    </ViewModel>
  )
}
```

### 5. 查询所有字段

包括嵌套字段在内的所有字段。

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model'

function UserDetail() {
  return (
    <ViewModel
      tableId="user"
      projectAll={true}
    >
      {/* 其他 view-* 组件 */}
    </ViewModel>
  )
}
```

### 6. 限制返回数据量

设置 limit 限制返回的数据条数。

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model'

function TopProducts() {
  return (
    <ViewModel
      tableId="product"
      limit={20}
    >
      {/* 其他 view-* 组件 */}
    </ViewModel>
  )
}
```

### 7. 添加筛选条件

通过 tableFilters 添加数据筛选条件。

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model'

function ActiveUsers() {
  return (
    <ViewModel
      tableId="user"
      tableFilters={[
        { status: 'active' },
        { verified: true }
      ]}
    >
      {/* 其他 view-* 组件 */}
    </ViewModel>
  )
}
```

### 8. 设置排序规则

通过 fieldOrder 设置字段的排序规则。

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model'

function SortedProducts() {
  return (
    <ViewModel
      tableId="product"
      fieldOrder={[
        { createdAt: 'desc' },
        { name: 'asc' }
      ]}
    >
      {/* 其他 view-* 组件 */}
    </ViewModel>
  )
}
```

### 9. 自动刷新数据

设置 interval 定时自动刷新数据。

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model'

function RealtimeData() {
  return (
    <ViewModel
      tableId="sensor"
      interval={5000}  // 每5秒刷新一次
    >
      {/* 其他 view-* 组件 */}
    </ViewModel>
  )
}
```

### 10. 自定义加载组件

在数据加载时显示自定义的加载组件。

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model'
import { Loader2 } from 'lucide-react'

function CustomLoading() {
  const loadingComponent = (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">加载中...</span>
    </div>
  )

  return (
    <ViewModel
      tableId="user"
      loadingComponent={loadingComponent}
    >
      {/* 其他 view-* 组件 */}
    </ViewModel>
  )
}
```

## 完整示例

### 用户管理系统

完整的用户管理系统，包含查询、筛选、排序等功能。

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model'
import ViewDataTable, { TableColumn } from '@/components/kesi/view-data-table/view-data-table'
import ViewPagination from '@/components/kesi/view-pagination/view-pagination'
import Actions, { CreateAction } from '@/components/kesi/view-actions/view-actions'
import { Card } from '@/components/ui/card'

function UserManagement() {
  return (
    <div className="p-6">
      <Card>
        <ViewModel
          tableId="user"
          queryFields={['id', 'name', 'email', 'role', 'status', 'createdAt']}
          tableFilters={[
            { deleted: false }
          ]}
          fieldOrder={[
            { createdAt: 'desc' }
          ]}
          limit={50}
        >
          <div className="p-6 space-y-6">
            {/* 顶部工具栏 */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">用户管理</h2>
              <CreateAction />
            </div>

            {/* 数据表格 */}
            <ViewDataTable>
              <TableColumn name="id" title="ID" width={200} />
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
              >
                <Actions variant="dropdown" />
              </TableColumn>
            </ViewDataTable>

            {/* 分页 */}
            <ViewPagination />
          </div>
        </ViewModel>
      </Card>
    </div>
  )
}
```

### 实时数据监控

实时数据监控系统，自动刷新显示最新数据。

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model'
import ViewDataTable, { TableColumn } from '@/components/kesi/view-data-table/view-data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity } from 'lucide-react'

function DeviceMonitor() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            设备实时监控
            <Badge variant="secondary">自动刷新</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ViewModel
            tableId="device"
            queryFields={['id', 'name', 'type', 'status', 'temperature', 'humidity', 'lastUpdate']}
            tableFilters={[
              { status: 'online' }
            ]}
            fieldOrder={[
              { lastUpdate: 'desc' }
            ]}
            limit={100}
            interval={5000}  // 每5秒自动刷新
          >
            <ViewDataTable>
              <TableColumn name="id" title="设备ID" width={200} />
              <TableColumn name="name" title="设备名称" />
              <TableColumn name="type" title="设备类型" />
              <TableColumn name="status" title="状态" width={100}>
                {(value) => (
                  <Badge variant={value === 'online' ? 'default' : 'secondary'}>
                    {value}
                  </Badge>
                )}
              </TableColumn>
              <TableColumn name="temperature" title="温度(°C)" width={100} />
              <TableColumn name="humidity" title="湿度(%)" width={100} />
              <TableColumn name="lastUpdate" title="最后更新" width={180} />
            </ViewDataTable>
          </ViewModel>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 高级查询系统

支持复杂查询条件的数据列表。

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model'
import ViewDataTable, { TableColumn } from '@/components/kesi/view-data-table/view-data-table'
import ViewPagination from '@/components/kesi/view-pagination/view-pagination'
import ViewAdvancedFilter from '@/components/kesi/view-advanced-filter/view-advanced-filter'
import { useState } from 'react'

function AdvancedQuery() {
  const [filters, setFilters] = useState([])

  return (
    <div className="p-6 space-y-6">
      {/* 高级筛选 */}
      <ViewAdvancedFilter
        tableId="order"
        onFilterChange={(rules, operator) => {
          console.log('筛选条件:', rules, operator)
          setFilters(rules)
        }}
      />

      {/* 数据表格 */}
      <ViewModel
        tableId="order"
        queryFields={['id', 'orderNo', 'customerName', 'status', 'totalAmount', 'createdAt']}
        tableFilters={filters}
        fieldOrder={[
          { createdAt: 'desc' }
        ]}
        limit={100}
      >
        <ViewDataTable>
          <TableColumn name="id" title="订单ID" width={200} />
          <TableColumn name="orderNo" title="订单号" />
          <TableColumn name="customerName" title="客户名称" />
          <TableColumn name="status" title="状态" />
          <TableColumn name="totalAmount" title="订单金额" />
          <TableColumn name="createdAt" title="创建时间" />
        </ViewDataTable>

        <div className="mt-4">
          <ViewPagination />
        </div>
      </ViewModel>
    </div>
  )
}
```

### 嵌套数据展示

使用 projectAll 查询包括嵌套字段在内的所有数据。

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model'
import ViewDataTable, { TableColumn } from '@/components/kesi/view-data-table/view-data-table'
import { Card } from '@/components/ui/card'

function NestedDataView() {
  return (
    <Card>
      <ViewModel
        tableId="order"
        projectAll={true}  // 查询所有字段，包括嵌套字段
        limit={20}
      >
        <ViewDataTable>
          <TableColumn name="id" title="订单ID" width={200} />
          <TableColumn name="orderNo" title="订单号" />
          <TableColumn name="customer.name" title="客户名称" />
          <TableColumn name="customer.email" title="客户邮箱" />
          <TableColumn name="items" title="订单项">
            {(value) => (
              <div>
                {value?.map((item: any, index: number) => (
                  <div key={index}>
                    {item.productName} x {item.quantity}
                  </div>
                ))}
              </div>
            )}
          </TableColumn>
          <TableColumn name="totalAmount" title="总金额" />
        </ViewDataTable>
      </ViewModel>
    </Card>
  )
}
```

## 视图状态持久化（statePersistence）

缓存用户的视图状态：**过滤器值、分页（每页条数+页码）、排序、列显示、列宽**。
快照为 delta 语义——未调整过的段落不写入，回退到建表配置默认值（`tableSchema` 数组顺序 / `tableSchema[].width`）。
存储通道 `local`（浏览器）与 `remote`（数据库）**二选一**。

### 配置项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `channel` | `'local' \| 'remote'` | `'local'` | 存储通道，二选一 |
| `viewKey` | `string` | `tableId \| modelName` | 视图标识（同表多视图时区分用） |
| `storage` | `ViewStateStorage` | 内置适配器 | 完全自定义适配器（最高优先级） |
| `remote` | `RemoteViewStorageOptions` | - | channel='remote' 时的适配器配置 |
| `persist` | `('filter'\|'pagination'\|'order'\|'columns')[]` | 全部 | 持久化白名单 |
| `debounce` | `number` | `500` | 保存防抖（毫秒） |
| `userId` | `string` | 当前登录用户 | 存储 key 的用户段（区分同浏览器多账号） |
| `restoreTimeout` | `number` | `2000` | remote 加载超时，超时降级到默认值 |
| `onRestored` | `(state) => void` | - | 恢复完成回调 |

### 用法 1：缓存到浏览器（localStorage）

```tsx
<ViewModel tableId="device" statePersistence={{ channel: 'local' }}>
  <ViewFilter />
  <ViewDataTable showColumnSettings />
  <ViewPagination />
</ViewModel>
```

实际存储 key：`kesi.view-state.<viewKey>.<userId>`。

### 用法 2：缓存到数据库

**方式 A（推荐）：自定义读写回调**

```tsx
<ViewModel
  tableId="device"
  statePersistence={{
    channel: 'remote',
    remote: {
      loader: async (key) => (await fetch(`/api/view-state/${key}`)).json(),
      saver: async (key, state) => {
        await fetch(`/api/view-state/${key}`, {
          method: 'PUT',
          body: JSON.stringify(state)
        })
      }
    }
  }}
>
```

**方式 B：指定一张 KESI 配置表自动读写**（表由 kesi-cli 建表阶段规划或宿主指定，
期望记录结构 `{ user, viewKey, state: JSON字符串 }`）：

```tsx
<ViewModel
  tableId="device"
  statePersistence={{
    channel: 'remote',
    remote: { tableId: 'user_view_config' }
  }}
>
```

### 工作机制

- **恢复**：ViewModel 挂载时从存储加载快照，经校验（列 key 必须存在于当前 schema、宽度 clamp）后合入 initialValues；恢复的筛选值会回填 ViewFilter 表单
- **保存**：ViewStateSaver 订阅 model atoms（wheres/order/limit/skip/uiState），变更防抖 500ms 后写入存储
- **列宽/列显隐**：ViewDataTable 通过受控的 `columnSizing`/`columnVisibility` 桥接到 model 扩展 atom `uiState`（经 `modelRegistry.addModelAtoms` 注册，kesi-client 零改动）；开启 `showColumnSettings` 显示列显隐下拉
- **降级**：remote 读失败/超时回退建表默认值；写失败静默（下次变更重试）
- **优先级**：建表配置默认 < props（queryFields/limit/fieldOrder 等）< 用户缓存快照

## 注意事项

1. **上下文必需**：所有 view-* 组件（Actions、BatchActions、Tools 等）都必须在 ViewModel 内部使用

2. **tableId 与 modelName**：必须提供其中一个，如果都提供了，modelName 优先级更高

3. **initQuery 策略**：设置为 false 时，数据查询由内部组件（如 ViewDataTable）触发

4. **字段优化**：使用 queryFields 只查询需要的字段，可以显著提升性能

5. **嵌套字段**：projectAll 为 true 时会查询所有嵌套字段，可能导致性能问题

6. **筛选条件格式**：tableFilters 是对象数组，每个对象代表一组筛选条件

7. **排序优先级**：fieldOrder 数组中的排序规则按顺序应用，后面的规则会覆盖前面的

8. **自动刷新**：interval 设置后会在组件挂载时启动定时器，组件卸载时自动清理

9. **性能考虑**：大数据量场景下，合理使用 limit 和 queryFields 优化性能

10. **Schema 访问**：子组件可以通过 useModel hook 访问当前 ViewModel 的 schema 信息

11. **持久化配置稳定性**：statePersistence 建议定义为模块级常量（内联对象也可，存储实例按配置签名缓存，不会随渲染重建）

12. **session 恢复优先**：从编辑/新增页返回时（table.tsx 内置 sessionStorage 机制），会话内的页码/筛选优先于跨会话的持久化快照
