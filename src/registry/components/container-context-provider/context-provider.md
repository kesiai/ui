# ContextProvider 上下文容器组件

## 简介

`ContextProvider` 是一个 React Context 容器组件，用于在组件树中共享数据和状态。

- **Context 传递**：通过 React Context API 在组件树中传递数据
- **类型安全**：提供完整的 TypeScript 类型定义
- **性能优化**：使用 `useMemo` 缓存 context 值，避免不必要的重新渲染
- **简化访问**：提供 `useContextProvider` hook 简化子组件访问数据

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `children` | `ReactNode` | 是 | - | 子组件 |
| `table` | `Table` | 否 | `{ id: '', name: '' }` | 表格信息 |
| `tableData` | `TableData` | 否 | `{ id: '', name: '', table: { id: '', name: '' } }` | 表格数据 |
| `data` | `Array<any>` | 否 | `[]` | 上下文中传递的数据数组 |

### 类型定义

```typescript
interface Table {
  id: string
  name: string
}

interface TableData {
  id: string
  name: string
  table: Table
}

interface ContextProviderContextValue {
  table: Table
  tableData: TableData
  data: Array<any>
}
```

## 基本用法

### 1. 基础使用

最简单的使用方式，只传递 children：

```tsx
import { ContextProvider } from '@/registry/components/container-context-provider/context-provider'

function App() {
  return (
    <ContextProvider>
      <YourComponent />
    </ContextProvider>
  )
}
```

### 2. 传递数据

传递 table、tableData 和 data 数据：

```tsx
import { ContextProvider } from '@/registry/components/container-context-provider/context-provider'

function App() {
  const table = { id: 'user-table', name: '用户表' }
  const tableData = { id: 'user-001', name: '张三', table }
  const data = [
    { id: 1, name: '项目1' },
    { id: 2, name: '项目2' }
  ]

  return (
    <ContextProvider
      table={table}
      tableData={tableData}
      data={data}
    >
      <YourComponent />
    </ContextProvider>
  )
}
```

### 3. 子组件访问数据

子组件使用 `useContextProvider` hook 访问上下文数据：

```tsx
import { useContextProvider } from '@/registry/components/container-context-provider/context-provider'

function ChildComponent() {
  const { table, tableData, data } = useContextProvider()

  return (
    <div>
      <p>表格: {table.name}</p>
      <p>数据: {tableData.name}</p>
      <p>数据条数: {data.length}</p>
    </div>
  )
}
```

## 完整示例

### 数据表格展示

```tsx
import { ContextProvider, useContextProvider } from '@/registry/components/container-context-provider/context-provider'

// 数据展示组件
function DataTable() {
  const { table, tableData, data } = useContextProvider()

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{table.name}</h3>
      <div className="text-sm text-slate-600 mb-4">
        当前数据: {tableData.name}
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">名称</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any) => (
            <tr key={item.id}>
              <td className="border p-2">{item.id}</td>
              <td className="border p-2">{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 应用组件
function App() {
  const table = { id: 'products', name: '产品表' }
  const tableData = { id: 'prod-001', name: '产品A', table }
  const data = [
    { id: 1, name: '产品1' },
    { id: 2, name: '产品2' },
    { id: 3, name: '产品3' }
  ]

  return (
    <ContextProvider
      table={table}
      tableData={tableData}
      data={data}
    >
      <DataTable />
    </ContextProvider>
  )
}
```

### 多层嵌套使用

```tsx
import { ContextProvider, useContextProvider } from '@/registry/components/container-context-provider/context-provider'

// 深层子组件
function DeepChild() {
  const { data } = useContextProvider()

  return (
    <div className="p-4 bg-blue-50 rounded">
      <p className="text-sm font-medium">深层组件访问数据</p>
      <p className="text-xs text-slate-600">数据条数: {data.length}</p>
    </div>
  )
}

// 中间层组件
function MiddleComponent() {
  return (
    <div className="p-4 bg-green-50 rounded">
      <p className="font-medium mb-2">中间层组件</p>
      <DeepChild />
    </div>
  )
}

// 应用组件
function App() {
  const data = [
    { id: 1, name: '项目1', status: 'active' },
    { id: 2, name: '项目2', status: 'pending' }
  ]

  return (
    <ContextProvider data={data}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">多层嵌套示例</h2>
        <MiddleComponent />
      </div>
    </ContextProvider>
  )
}
```

## 注意事项

1. **必须使用 hook**：子组件必须使用 `useContextProvider` hook 来访问上下文数据，不能直接使用 React 的 `useContext`

2. **Provider 范围**：只有被 `ContextProvider` 包裹的子组件才能访问上下文数据

3. **数据更新**：当 table、tableData 或 data 改变时，所有使用 `useContextProvider` 的子组件都会重新渲染

4. **默认值**：table、tableData 和 data 都有默认值，可以不传递

5. **性能优化**：组件内部使用 `useMemo` 缓存 context 值，只有在依赖项改变时才重新创建

6. **类型安全**：建议在使用时配合 TypeScript，以获得完整的类型检查
