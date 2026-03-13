### ⚠️ 组合使用说明

> **重要**: view-batch 是 视图系统 的子组件，不能单独使用。
>
> 必须配合父组件 view-model 使用。请查看 [视图系统 完整指南](data/view-system.md) 了解正确的使用方法。

# BatchActions 批量操作组件

## 简介

`BatchActions` 是一个为数据列表提供批量操作功能的组件集合，支持批量删除和批量修改等常用操作。

- **两个核心组件**：提供 BatchDeleteAction 和 BatchChangeAction 两个批量操作组件
- **智能选中管理**：通过 useModelSelect hook 自动获取和管理选中的数据项
- **批量删除**：一次性删除多条选中数据，带确认提示
- **批量修改**：使用 SchemaForm 表单批量修改选中数据的字段值
- **自动数据刷新**：操作成功后自动刷新列表数据，保持数据同步

## Props 参数说明

### BatchActions 组件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `actions` | `BatchActionType[]` | 否 | `['batch-delete', 'batch-change']` | 启用的批量操作数组 |
| `variant` | `'buttons' \| 'dropdown'` | 否 | `'dropdown'` | 操作按钮的展示方式 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用所有操作（无选中项时自动禁用） |
| `children` | `ReactNode` | 否 | - | 自定义额外操作项 |

**BatchActionType 类型**：`'batch-delete' | 'batch-change'`

### BatchDeleteAction 组件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `children` | `ReactNode` | 否 | 默认按钮 | 自定义触发元素 |

### BatchChangeAction 组件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `children` | `ReactNode` | 否 | 默认按钮 | 自定义触发元素 |

## 基本用法

### 1. 使用 BatchActions 容器组件（推荐）

最简单的方式是使用 BatchActions 容器组件，它会自动管理所有批量操作。

```tsx
import { BatchActions } from '@/components/airiot/view-batch/view-batch'

function DataTable() {
  return (
    <BatchActions
      actions={['batch-delete', 'batch-change']}
      variant="dropdown"
    />
  )
}
```

### 2. 按钮组形式

使用按钮组形式可以更直观地展示所有操作，并显示选中项数量。

```tsx
import { BatchActions } from '@/components/airiot/view-batch/view-batch'

function DataTable() {
  return (
    <BatchActions
      actions={['batch-delete', 'batch-change']}
      variant="buttons"
    />
  )
}
```

### 3. 单独使用 BatchDeleteAction

单独使用批量删除组件，提供更大的灵活性。

```tsx
import { BatchDeleteAction } from '@/components/airiot/view-batch/view-batch'

function DataTable() {
  return (
    <div className="flex items-center gap-2">
      <BatchDeleteAction>
        <Button variant="destructive">
          删除选中项
        </Button>
      </BatchDeleteAction>
    </div>
  )
}
```

### 4. 单独使用 BatchChangeAction

单独使用批量修改组件，配合自定义字段配置。

```tsx
import { BatchChangeAction } from '@/components/airiot/view-batch/view-batch'

function DataTable() {
  return (
    <div className="flex items-center gap-2">
      <BatchChangeAction>
        <Button variant="outline">
          批量修改
        </Button>
      </BatchChangeAction>
    </div>
  )
}
```

### 5. 自定义额外操作

通过 children 属性添加自定义操作项。

```tsx
import { BatchActions } from '@/components/airiot/view-batch/view-batch'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

function DataTable() {
  const handleExport = () => {
    console.log('导出选中项')
  }

  return (
    <BatchActions variant="dropdown">
      <DropdownMenuItem onClick={handleExport}>
        导出选中项
      </DropdownMenuItem>
    </BatchActions>
  )
}
```

### 6. 仅启用部分操作

根据业务需求只启用特定的批量操作。

```tsx
import { BatchActions } from '@/components/airiot/view-batch/view-batch'

function ReadOnlyTable() {
  return (
    <BatchActions
      actions={['batch-change']}
      variant="dropdown"
    />
  )
}
```

### 7. 禁用状态

在特定条件下禁用所有批量操作。

```tsx
import { BatchActions } from '@/components/airiot/view-batch/view-batch'

function LockedTable({ isLocked }: { isLocked: boolean }) {
  return (
    <BatchActions
      actions={['batch-delete', 'batch-change']}
      disabled={isLocked}
    />
  )
}
```

## 完整示例

### 用户管理批量操作

完整的用户管理表格，包含批量删除和批量修改功能。

```tsx
import { BatchActions } from '@/components/airiot/view-batch/view-batch'
import { useModelSelect } from '@airiot/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
}

function UserTable() {
  const { items, loading } = useModelGetItems()
  const { selected, toggle } = useModelSelect<User>()

  return (
    <div className="space-y-4">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">用户管理</h2>
        <BatchActions
          actions={['batch-delete', 'batch-change']}
          variant="buttons"
        />
      </div>

      {/* 数据表格 */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selected.length > 0 && selected.length === items?.length}
                onCheckedChange={(checked) => {
                  items?.forEach(item => {
                    if (checked) {
                      toggle(item.id)
                    } else {
                      toggle(item.id)
                    }
                  })
                }}
              />
            </TableHead>
            <TableHead>姓名</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead>角色</TableHead>
            <TableHead>状态</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selected.some(s => s.id === user.id)}
                  onCheckedChange={() => toggle(user.id)}
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

### 订单批量处理系统

订单管理系统的批量处理功能，包含状态更新和删除。

```tsx
import { BatchActions, BatchChangeAction } from '@/components/airiot/view-batch/view-batch'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useModelSelect } from '@airiot/client'

interface Order {
  id: string
  orderNo: string
  customerName: string
  totalAmount: number
  status: string
}

function OrderBatchSystem() {
  const { selected } = useModelSelect<Order>()
  const { model } = useModel()

  return (
    <div className="space-y-4">
      {/* 批量操作栏 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">批量操作</h3>
              {selected.length > 0 && (
                <p className="text-sm text-slate-600 mt-1">
                  已选择 <Badge variant="secondary">{selected.length}</Badge> 个订单
                </p>
              )}
            </div>
            <BatchActions
              actions={['batch-delete', 'batch-change']}
              variant="buttons"
            />
          </div>
        </CardContent>
      </Card>

      {/* 批量修改说明 */}
      {selected.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <p className="text-sm text-blue-800">
              <strong>批量修改提示：</strong>
              {model.batchChangeFields ? (
                <>
                  可修改字段：{Array.isArray(model.batchChangeFields)
                    ? model.batchChangeFields.join('、')
                    : model.batchChangeFields}
                </>
              ) : (
                '默认可修改：name、money 字段'
              )}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 订单列表 */}
      <div className="space-y-2">
        {selected.map(order => (
          <Card key={order.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{order.orderNo}</p>
                <p className="text-sm text-slate-600">{order.customerName}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">¥{order.totalAmount}</p>
                <Badge variant="outline">{order.status}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### 设备批量维护

设备管理系统中的批量维护功能。

```tsx
import { BatchDeleteAction, BatchChangeAction } from '@/components/airiot/view-batch/view-batch'
import { Button } from '@/components/ui/button'
import { Trash2, Edit, Wrench } from 'lucide-react'

function DeviceBatchMaintenance() {
  return (
    <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-lg">
      <span className="text-sm font-medium">批量操作：</span>

      <BatchChangeAction>
        <Button variant="outline" size="sm">
          <Wrench className="h-4 w-4 mr-2" />
          批量维护
        </Button>
      </BatchChangeAction>

      <BatchChangeAction>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          批量编辑
        </Button>
      </BatchChangeAction>

      <BatchDeleteAction>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          批量删除
        </Button>
      </BatchDeleteAction>
    </div>
  )
}
```

## 注意事项

1. **ViewModel 上下文依赖**：所有 BatchAction 组件都需要在 ViewModel 提供的上下文中使用，否则无法获取选中数据和执行操作

2. **选中项管理**：组件使用 useModelSelect hook 自动获取选中数据，无需手动传递选中项

3. **批量删除确认**：BatchDeleteAction 会显示确认对话框，列出所有待删除项，避免误操作

4. **批量修改字段**：BatchChangeAction 默认显示 name 和 money 字段，可通过 model.batchChangeFields 配置可修改字段

5. **自动禁用机制**：当没有选中项时，下拉菜单模式会自动禁用主按钮

6. **数据刷新策略**：批量修改成功后，如果有返回值会更新对应项，否则刷新整个列表

7. **按钮组模式**：buttons 模式会始终显示所有按钮，即使没有选中项

8. **操作并发性**：批量删除使用 Promise.all 并发执行，批量修改也支持并发

9. **错误处理**：操作失败时会在组件内部处理错误，不会影响列表的正常显示

10. **表单验证**：批量修改使用 SchemaForm，会根据模型定义进行字段验证
