# ContextProvider 上下文容器

## 简介

`ContextProvider` 是一个上下文数据提供者组件，用于向子组件树传递表格、表格数据和自定义数据。

- **数据共享**：通过 Context API 向子组件传递数据，避免 props 层层传递
- **类型安全**：提供完整的 TypeScript 类型定义
- **灵活配置**：支持传递 Table、TableData 和自定义数据数组
- **Hook 访问**：子组件通过 `useContextProvider` hook 获取上下文数据
- **性能优化**：使用 useMemo 缓存 context value，避免不必要的重渲染

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `table` | `Table` | 否 | `{ id: '', name: '' }` | 表格信息对象 |
| `tableData` | `TableData` | 否 | `{ id: '', name: '', table: { id: '', name: '' } }` | 表格数据对象 |
| `data` | `Array<any>` | 否 | `[]` | 自定义数据数组 |
| `children` | `ReactNode` | 是 | - | 子组件 |

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

创建上下文提供者并访问数据。

```tsx
import { ContextProvider, useContextProvider } from '@/registry/components/airiot/container-context-provider/context-provider'

function ChildComponent() {
  const { table, tableData, data } = useContextProvider()

  return (
    <div>
      <p>表格: {table.name}</p>
      <p>数据: {tableData.name}</p>
      <p>数组长度: {data.length}</p>
    </div>
  )
}

function Example() {
  const table = { id: 'table-001', name: '用户表' }
  const tableData = {
    id: 'data-001',
    name: '第一条数据',
    table: table
  }
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
      <ChildComponent />
    </ContextProvider>
  )
}
```

### 2. 多层级组件访问

在深层子组件中访问上下文数据。

```tsx
function DeepChildComponent() {
  const { table, tableData, data } = useContextProvider()

  return (
    <div className="p-4 border rounded">
      <h4>深层组件</h4>
      <p>表格 ID: {table.id}</p>
      <p>数据: {JSON.stringify(data)}</p>
    </div>
  )
}

function MiddleComponent() {
  return (
    <div>
      <h3>中间层组件</h3>
      <DeepChildComponent />
    </div>
  )
}

function Example() {
  return (
    <ContextProvider
      table={{ id: 't1', name: '测试表' }}
      tableData={{ id: 'd1', name: '测试数据', table: { id: 't1', name: '测试表' } }}
      data={[{ item: 'value' }]}
    >
      <MiddleComponent />
    </ContextProvider>
  )
}
```

### 3. 条件渲染

根据上下文数据条件渲染内容。

```tsx
function ConditionalComponent() {
  const { table, data } = useContextProvider()

  if (data.length === 0) {
    return <p>暂无数据</p>
  }

  return (
    <div>
      <h3>{table.name}</h3>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  )
}

function Example() {
  return (
    <ContextProvider
      table={{ id: 't1', name: '产品列表' }}
      tableData={{ id: 'd1', name: '数据1', table: { id: 't1', name: '产品列表' } }}
      data={[
        { id: 1, name: '产品 A', price: 299 },
        { id: 2, name: '产品 B', price: 399 }
      ]}
    >
      <ConditionalComponent />
    </ContextProvider>
  )
}
```

### 4. 嵌套 Context

使用多个 ContextProvider 提供不同的数据上下文。

```tsx
function Level2Child() {
  const context2 = useContextProvider()
  const context1 = useContextProvider() // 访问最内层

  return (
    <div>
      <p>层级 2: {context2.table.name}</p>
    </div>
  )
}

function Level1Child() {
  const context1 = useContextProvider()

  return (
    <div>
      <p>层级 1: {context1.table.name}</p>
      <ContextProvider
        table={{ id: 'inner', name: '内层表格' }}
        tableData={{ id: 'inner-data', name: '内层数据', table: { id: 'inner', name: '内层表格' } }}
        data={[]}
      >
        <Level2Child />
      </ContextProvider>
    </div>
  )
}
```

## 完整示例

### 表格详情页

创建一个完整的表格详情展示页面。

```tsx
import { ContextProvider, useContextProvider } from '@/registry/components/airiot/container-context-provider/context-provider'
import { useState, useEffect } from 'react'

// 表格信息组件
function TableInfo() {
  const { table } = useContextProvider()

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">{table.name}</h2>
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-medium">表格 ID:</span> {table.id}
        </p>
      </div>
    </div>
  )
}

// 数据列表组件
function DataTable() {
  const { data } = useContextProvider()

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-4">
      <h3 className="text-lg font-semibold mb-4">数据列表 ({data.length} 条)</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">名称</th>
              <th className="px-4 py-2 text-left">状态</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">
                  <span className={`
                    px-2 py-1 rounded text-xs
                    ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  `}>
                    {item.status === 'active' ? '激活' : '未激活'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 详情页组件
function TableDetailPage() {
  const [table, setTable] = useState({ id: 'table-001', name: '用户表' })
  const [tableData, setTableData] = useState({
    id: 'data-001',
    name: '用户数据',
    table: { id: 'table-001', name: '用户表' }
  })
  const [data, setData] = useState([
    { id: 1, name: '张三', status: 'active' },
    { id: 2, name: '李四', status: 'active' },
    { id: 3, name: '王五', status: 'inactive' }
  ])

  return (
    <div className="container mx-auto p-6">
      <ContextProvider
        table={table}
        tableData={tableData}
        data={data}
      >
        <TableInfo />
        <DataTable />
      </ContextProvider>
    </div>
  )
}
```

### 动态数据加载

结合 API 请求动态加载数据。

```tsx
import { ContextProvider, useContextProvider } from '@/registry/components/airiot/container-context-provider/context-provider'
import { useState, useEffect } from 'react'

function DataDisplay() {
  const { table, tableData, data } = useContextProvider()

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{table.name}</h3>
        <p className="text-sm text-gray-500">ID: {tableData.id}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item: any, index: number) => (
          <div key={index} className="bg-white p-4 rounded shadow-sm">
            <h4 className="font-medium">{item.title}</h4>
            <p className="text-sm text-gray-600 mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function DynamicDataContext() {
  const [table] = useState({
    id: 'dynamic-table',
    name: '动态数据表'
  })
  const [tableData] = useState({
    id: 'dynamic-data',
    name: '动态数据集',
    table: { id: 'dynamic-table', name: '动态数据表' }
  })
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟 API 请求
    setTimeout(() => {
      setData([
        { id: 1, title: '项目 1', description: '描述 1' },
        { id: 2, title: '项目 2', description: '描述 2' },
        { id: 3, title: '项目 3', description: '描述 3' }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div className="p-6 text-center">加载中...</div>
  }

  return (
    <ContextProvider
      table={table}
      tableData={tableData}
      data={data}
    >
      <DataDisplay />
    </ContextProvider>
  )
}
```

## 注意事项

1. **必须使用 Hook**：子组件必须使用 `useContextProvider()` hook 来获取上下文数据。

2. **Provider 范围**：Context 只在 Provider 的子组件树中可用，超出范围会抛出错误。

3. **默认值**：即使不传递某些参数，Provider 也会提供默认值，防止子组件访问失败。

4. **性能优化**：组件内部使用 `useMemo` 缓存 context value，只有在依赖改变时才重新创建。

5. **类型安全**：建议为 `data` 参数定义明确的类型，以获得更好的类型推断。

6. **错误处理**：如果在 Provider 外部使用 `useContextProvider`，会抛出明确的错误提示。

7. **数据更新**：当 table、tableData 或 data 改变时，所有使用这些数据的子组件会自动重新渲染。

8. **嵌套覆盖**：嵌套多个 ContextProvider 时，内层的 Context 值会覆盖外层的同名属性。
