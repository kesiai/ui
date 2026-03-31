> **安装命令**: `npx shadcn@latest add @kesi/view-tools`

# ViewTools 工具组件集合

## 简介

`ViewTools` 是一个为数据表格提供常用工具功能的组件集合，包括记录数显示、分页设置和列显示控制。

- **三个核心工具**：提供 CountTool、PageSizeTool、ColumnsTool 三个常用工具组件
- **记录数显示**：CountTool 显示当前数据的总记录数
- **分页设置**：PageSizeTool 支持预设选项和自定义输入设置每页条数
- **列显示控制**：ColumnsTool 通过复选框控制表格列的显示与隐藏
- **灵活组合**：可自由组合显示需要的工具，也可单独使用各个工具

## Props 参数说明

### Tools 组件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `tools` | `ToolType[]` | 否 | `['count', 'pageSize', 'columns']` | 启用的工具数组 |
| `className` | `string` | 否 | - | 自定义样式类名 |
| `children` | `ReactNode` | 否 | - | 自定义额外工具项 |

**ToolType 类型**：`'count' | 'pageSize' | 'columns'`

### CountTool 组件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `className` | `string` | 否 | - | 自定义样式类名 |

### PageSizeTool 组件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `className` | `string` | 否 | - | 自定义样式类名 |

### ColumnsTool 组件

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `className` | `string` | 否 | - | 自定义样式类名 |

## 基本用法

### 1. 使用 Tools 容器组件（推荐）

最简单的方式是使用 Tools 容器组件，它会自动管理所有工具。

```tsx
import { Tools } from '@/components/kesi/view-tools/view-tools'

function DataTable() {
  return (
    <Tools tools={['count', 'pageSize', 'columns']} />
  )
}
```

### 2. 只显示部分工具

根据需要选择显示的工具。

```tsx
import { Tools } from '@/components/kesi/view-tools/view-tools'

function SimpleTable() {
  return (
    <Tools tools={['count', 'pageSize']} />
  )
}
```

### 3. 单独使用 CountTool

单独使用记录数显示工具。

```tsx
import { CountTool } from '@/components/kesi/view-tools/view-tools'

function RecordCount() {
  return (
    <div className="flex items-center gap-2">
      <CountTool />
      <span>条数据</span>
    </div>
  )
}
```

### 4. 单独使用 PageSizeTool

单独使用分页设置工具。

```tsx
import { PageSizeTool } from '@/components/kesi/view-tools/view-tools'

function PageSizeSetting() {
  return (
    <PageSizeTool />
  )
}
```

### 5. 单独使用 ColumnsTool

单独使用列显示控制工具。

```tsx
import { ColumnsTool } from '@/components/kesi/view-tools/view-tools'

function ColumnControl() {
  return (
    <ColumnsTool />
  )
}
```

### 6. 自定义样式

为工具组件添加自定义样式。

```tsx
import { Tools } from '@/components/kesi/view-tools/view-tools'

function StyledTools() {
  return (
    <Tools
      tools={['count', 'pageSize', 'columns']}
      className="bg-slate-100 p-2 rounded-lg"
    />
  )
}
```

### 7. 添加自定义工具

通过 children 添加自定义工具。

```tsx
import { Tools } from '@/components/kesi/view-tools/view-tools'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

function ExtendedTools() {
  return (
    <Tools tools={['count', 'pageSize']}>
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        导出
      </Button>
    </Tools>
  )
}
```

### 8. 完整工具栏

包含所有工具和自定义操作的工具栏。

```tsx
import { Tools } from '@/components/kesi/view-tools/view-tools'
import { Button } from '@/components/ui/button'
import { RefreshCw, Settings } from 'lucide-react'

function FullToolbar() {
  const handleRefresh = () => {
    console.log('刷新数据')
  }

  const handleSettings = () => {
    console.log('打开设置')
  }

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">数据列表</h2>

      <div className="flex items-center gap-2">
        <Tools tools={['count', 'pageSize', 'columns']} />

        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={handleSettings}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
```

## 完整示例

### 用户管理工具栏

完整的用户管理界面工具栏。

```tsx
import { Tools } from '@/components/kesi/view-tools/view-tools'
import { CreateAction } from '@/components/kesi/view-actions/view-actions'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw, Download } from 'lucide-react'

function UserManagementToolbar() {
  const handleRefresh = () => {
    console.log('刷新用户列表')
  }

  const handleExport = () => {
    console.log('导出用户数据')
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">用户管理</h2>
        <p className="text-sm text-slate-600">管理系统用户和权限</p>
      </div>

      <div className="flex items-center gap-3">
        <Tools tools={['count', 'pageSize', 'columns']} />

        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          刷新
        </Button>

        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          导出
        </Button>

        <CreateAction>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            新建用户
          </Button>
        </CreateAction>
      </div>
    </div>
  )
}
```

### 紧凑型工具栏

适合空间有限的紧凑型工具栏。

```tsx
import { Tools } from '@/components/kesi/view-tools/view-tools'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'

function CompactToolbar() {
  return (
    <div className="flex items-center gap-2">
      <Tools
        tools={['count', 'pageSize']}
        className="text-sm"
      />

      <div className="ml-auto">
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
```

### 数据分析面板

数据分析场景的工具栏配置。

```tsx
import { Tools } from '@/components/kesi/view-tools/view-tools'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function AnalyticsPanel() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>销售数据分析</CardTitle>
          <Badge variant="secondary">实时</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 工具栏 */}
          <div className="flex items-center justify-between">
            <Tools tools={['count', 'pageSize']} />

            <div className="text-sm text-slate-600">
              最后更新：刚刚
            </div>
          </div>

          {/* 数据内容 */}
          <div>
            {/* 数据表格或其他内容 */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 自定义列显示

自定义列显示工具的样式和行为。

```tsx
import { ColumnsTool } from '@/components/kesi/view-tools/view-tools'
import { Button } from '@/components/ui/button'
import { Columns3, Settings } from 'lucide-react'

function CustomColumnControl() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600">列显示：</span>
      <ColumnsTool />

      <Button variant="ghost" size="sm">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

### 移动端适配

针对移动端优化的工具栏布局。

```tsx
import { Tools } from '@/components/kesi/view-tools/view-tools'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'

function ResponsiveToolbar() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold">数据列表</h2>

      {isMobile ? (
        <Tools tools={['count']} />
      ) : (
        <Tools tools={['count', 'pageSize', 'columns']} />
      )}
    </div>
  )
}
```

### 多表格场景

在多个表格之间共享工具栏。

```tsx
import { Tools, PageSizeTool } from '@/components/kesi/view-tools/view-tools'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function MultiTableView() {
  return (
    <div className="space-y-4">
      {/* 共享工具栏 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">数据视图</h2>
        <PageSizeTool />
      </div>

      {/* 多个表格 */}
      <Tabs defaultValue="table1">
        <TabsList>
          <TabsTrigger value="table1">表格1</TabsTrigger>
          <TabsTrigger value="table2">表格2</TabsTrigger>
        </TabsList>

        <TabsContent value="table1">
          <Tools tools={['count', 'columns']} />
          {/* 表格1内容 */}
        </TabsContent>

        <TabsContent value="table2">
          <Tools tools={['count', 'columns']} />
          {/* 表格2内容 */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

## 注意事项

1. **ViewModel 上下文依赖**：所有 Tool 组件都需要在 ViewModel 提供的上下文中使用

2. **数据实时性**：CountTool 显示的记录数是实时的，会随着数据变化自动更新

3. **PageSizeTool 预设选项**：默认的预设选项由 ViewModel 配置决定，通常为 [10, 20, 50, 100]

4. **自定义每页条数**：PageSizeTool 支持通过输入框自定义每页条数，按 Enter 键确认

5. **ColumnsTool 响应式布局**：列显示工具会根据字段数量自动调整布局：
   - 字段数 ≤ 10：使用垂直列表布局
   - 字段数 > 10：使用网格布局（4列）

6. **字段过滤**：ColumnsTool 只显示 showInList 不为 false 的字段

7. **工具排列**：Tools 容器组件中的工具按固定顺序显示：count → pageSize → columns

8. **样式覆盖**：可以通过 className 属性自定义工具组件的样式

9. **自定义工具位置**：通过 children 添加的自定义工具会显示在预设工具之后

10. **状态同步**：所有工具组件的状态都会自动同步到 ViewModel 的全局状态中
