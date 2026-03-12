# ViewDetail 详情组件

## 简介

`ViewDetail` 是一个用于展示数据详情的弹窗组件，支持多种字段类型的自动渲染和自定义渲染。

- **自动类型识别**：根据字段类型自动选择合适的展示方式（文本、数字、日期、布尔值、JSON 等）
- **灵活的触发方式**：支持触发器模式（按钮点击）和受控模式（通过 `open` 属性控制）
- **可配置尺寸**：提供 5 种弹窗尺寸选择，从小到大到全屏
- **自动数据获取**：通过 `useModelGet` hook 自动获取指定 ID 的数据详情
- **自定义字段渲染**：支持通过 `render` 函数完全自定义字段的展示方式

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `itemId` | `string` | 是 | - | 要查看详情的数据 ID |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | 否 | `'lg'` | 弹窗大小 |
| `trigger` | `ReactNode` | 否 | - | 触发弹窗的元素 |
| `open` | `boolean` | 否 | - | 受控模式：弹窗是否打开 |
| `onOpenChange` | `(open: boolean) => void` | 否 | - | 弹窗状态变化回调 |

### 尺寸说明

- `sm`：小尺寸，适合内容较少的详情
- `md`：中等尺寸，适合常规内容
- `lg`：大尺寸（默认），适合内容较多的详情
- `xl`：超大尺寸，适合内容丰富的详情
- `full`：全屏，适合复杂或内容非常多的详情

## 基本用法

### 1. 基础用法

使用触发器模式，通过按钮打开详情弹窗。

```tsx
import { ViewDetail } from '@/registry/components/airiot/view-detail/view-detail'
import { Button } from '@/components/ui/button'
import { ViewModel } from '@/registry/components/airiot/view-model/view-model'

function BasicDetail() {
  return (
    <ViewModel tableId="task_def" modelName="task">
      <ViewDetail
        itemId="692004b03b11710131077e3e"
        trigger={
          <Button variant="outline">查看详情</Button>
        }
      />
    </ViewModel>
  )
}
```

### 2. 受控模式

通过状态控制弹窗的打开和关闭。

```tsx
import { ViewDetail } from '@/registry/components/airiot/view-detail/view-detail'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ViewModel } from '@/registry/components/airiot/view-model/view-model'

function ControlledDetail() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')

  const handleViewDetail = (id: string) => {
    setSelectedId(id)
    setIsOpen(true)
  }

  return (
    <ViewModel tableId="task_def" modelName="task">
      <Button onClick={() => handleViewDetail('item-id-123')}>
        查看详情
      </Button>

      <ViewDetail
        itemId={selectedId}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </ViewModel>
  )
}
```

### 3. 自定义弹窗尺寸

根据内容量选择合适的弹窗尺寸。

```tsx
import { ViewDetail } from '@/registry/components/airiot/view-detail/view-detail'
import { Button } from '@/components/ui/button'
import { ViewModel } from '@/registry/components/airiot/view-model/view-model'

function SizeDetail() {
  return (
    <ViewModel tableId="task_def" modelName="task">
      <div className="flex gap-2">
        <ViewDetail
          itemId="item-1"
          size="sm"
          trigger={<Button>小尺寸</Button>}
        />
        <ViewDetail
          itemId="item-2"
          size="md"
          trigger={<Button>中尺寸</Button>}
        />
        <ViewDetail
          itemId="item-3"
          size="lg"
          trigger={<Button>大尺寸</Button>}
        />
        <ViewDetail
          itemId="item-4"
          size="xl"
          trigger={<Button>超大</Button>}
        />
        <ViewDetail
          itemId="item-5"
          size="full"
          trigger={<Button>全屏</Button>}
        />
      </div>
    </ViewModel>
  )
}
```

### 4. 在表格中使用

在数据表格的操作列中添加详情查看功能。

```tsx
import { ViewDataTable, TableColumn } from '@/registry/components/airiot/view-data-table/view-data-table'
import { ViewDetail } from '@/registry/components/airiot/view-detail/view-detail'
import { Button } from '@/components/ui/button'
import { ViewModel } from '@/registry/components/airiot/view-model/view-model'

function TableWithDetail() {
  return (
    <ViewModel tableId="task_def" modelName="task">
      <ViewDataTable>
        <TableColumn name="id" title="ID" />
        <TableColumn name="title" title="标题" />
        <TableColumn name="status" title="状态" />
        <TableColumn
          name="actions"
          title="操作"
          fixed="right"
          width={100}
        >
          {(props) => {
            const row = props.row.original
            return (
              <ViewDetail
                itemId={row.id}
                trigger={
                  <Button size="sm" variant="outline">
                    查看
                  </Button>
                }
              />
            )
          }}
        </TableColumn>
      </ViewDataTable>
    </ViewModel>
  )
}
```

### 5. 使用不同的触发元素

可以使用任何 React 元素作为触发器。

```tsx
import { ViewDetail } from '@/registry/components/airiot/view-detail/view-detail'
import { Eye, MoreVertical } from 'lucide-react'
import { ViewModel } from '@/registry/components/airiot/view-model/view-model'

function CustomTriggerDetail() {
  return (
    <ViewModel tableId="task_def" modelName="task">
      {/* 图标按钮 */}
      <ViewDetail
        itemId="item-1"
        trigger={
          <button className="p-2 hover:bg-gray-100 rounded">
            <Eye className="w-4 h-4" />
          </button>
        }
      />

      {/* 文本链接 */}
      <ViewDetail
        itemId="item-2"
        trigger={
          <a className="text-blue-600 hover:underline cursor-pointer">
            查看详情
          </a>
        }
      />

      {/* 卡片 */}
      <ViewDetail
        itemId="item-3"
        trigger={
          <div className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow">
            <h3 className="font-semibold">点击查看详情</h3>
            <p className="text-sm text-gray-500">卡片式触发器</p>
          </div>
        }
      />

      {/* 更多菜单 */}
      <ViewDetail
        itemId="item-4"
        trigger={
          <button className="p-2 hover:bg-gray-100 rounded">
            <MoreVertical className="w-4 h-4" />
          </button>
        }
      />
    </ViewModel>
  )
}
```

## 完整示例

### 任务详情页

创建一个完整的任务详情页面，包含所有任务相关字段的展示。

```tsx
import { ViewDetail } from '@/registry/components/airiot/view-detail/view-detail'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ViewModel } from '@/registry/components/airiot/view-model/view-model'
import { useState } from 'react'

function TaskDetailExample() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleViewDetail = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">任务列表</h2>

      <ViewModel tableId="task_def" modelName="task">
        {/* 任务列表 */}
        <div className="space-y-2">
          {['task-1', 'task-2', 'task-3'].map(taskId => (
            <div
              key={taskId}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div>
                <h3 className="font-semibold">任务 {taskId}</h3>
                <p className="text-sm text-gray-500">任务描述...</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleViewDetail(taskId)}
              >
                查看详情
              </Button>
            </div>
          ))}
        </div>

        {/* 详情弹窗 */}
        <ViewDetail
          itemId={selectedTaskId || ''}
          size="xl"
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      </ViewModel>
    </div>
  )
}
```

### 用户详情卡片

在用户管理页面中展示用户的完整信息。

```tsx
import { ViewDetail } from '@/registry/components/airiot/view-detail/view-detail'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ViewModel } from '@/registry/components/airiot/view-model/view-model'

function UserProfileDetail() {
  return (
    <ViewModel tableId="user" modelName="user">
      <ViewDetail
        itemId="user-123"
        size="lg"
        trigger={
          <Button variant="outline">查看个人资料</Button>
        }
      />
    </ViewModel>
  )
}
```

### 订单详情

展示订单的完整信息，包括商品列表、价格、配送信息等。

```tsx
import { ViewDetail } from '@/registry/components/airiot/view-detail/view-detail'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ViewModel } from '@/registry/components/airiot/view-model/view-model'

function OrderDetail() {
  return (
    <ViewModel tableId="order" modelName="order">
      <ViewDetail
        itemId="order-456"
        size="full"
        trigger={
          <Button>查看订单详情</Button>
        }
      />
    </ViewModel>
  )
}
```

### 多对象详情

在列表中为每一项提供详情查看功能。

```tsx
import { ViewDetail } from '@/registry/components/airiot/view-detail/view-detail'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { ViewModel } from '@/registry/components/airiot/view-model/view-model'

function MultipleItemsDetail() {
  const items = [
    { id: '1', name: '项目 1' },
    { id: '2', name: '项目 2' },
    { id: '3', name: '项目 3' },
  ]

  return (
    <ViewModel tableId="project" modelName="project">
      <div className="space-y-4">
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <span className="font-medium">{item.name}</span>
            <ViewDetail
              itemId={item.id}
              size="md"
              trigger={
                <Button size="sm" variant="ghost">
                  <Eye className="w-4 h-4 mr-2" />
                  查看详情
                </Button>
              }
            />
          </div>
        ))}
      </div>
    </ViewModel>
  )
}
```

## 注意事项

1. **Model 依赖**：`ViewDetail` 组件必须包裹在 `ViewModel` 组件中使用，因为它依赖 `useModelGet` hook 来获取数据。

2. **itemId 有效性**：确保传入的 `itemId` 是有效的数据 ID，否则会显示"暂无数据"。

3. **弹窗尺寸选择**：根据详情内容的多少选择合适的尺寸，避免内容过于拥挤或弹窗过大。

4. **触发器 vs 受控模式**：
   - 如果只是简单的点击按钮查看详情，使用 `trigger` 属性更方便
   - 如果需要更复杂的逻辑（如确认后打开、条件打开等），使用受控模式（`open` + `onOpenChange`）

5. **字段类型映射**：组件会根据 Model 中定义的字段类型自动选择渲染方式：
   - `boolean`：显示为"是/否"标签
   - `date`：自动格式化为本地日期时间
   - `number`：添加千分位分隔符
   - `json`：以代码格式展示
   - 其他类型：直接显示值

6. **加载状态**：组件内置了加载状态，数据获取时会显示加载动画。

7. **滚动区域**：详情内容超出高度时会自动出现滚动条，不会撑破弹窗。

8. **关闭按钮**：弹窗底部始终有"关闭"按钮，用户可以通过点击关闭或点击遮罩层关闭弹窗。

9. **只读模式**：`ViewDetail` 设计为只读展示，如需编辑功能，请使用表单组件。

10. **状态管理**：在受控模式下，需要自行管理 `open` 状态和 `itemId`，确保状态更新正确。
