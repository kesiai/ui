# Iteration 迭代组件

## 简介

`Iteration` 是一个数据迭代容器组件，用于遍历数组数据并批量渲染子组件。

- **数据遍历**：自动遍历数组中的每一项数据
- **上下文传递**：通过 Context API 向子组件传递当前项的数据和索引
- **简化开发**：无需手动编写 map 循环，提高开发效率
- **类型安全**：提供完整的 TypeScript 类型定义
- **灵活使用**：可与任何组件配合使用

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `iterationList` | `any[]` | 是 | `[]` | 需要迭代的数据数组 |
| `children` | `ReactNode` | 是 | - | 子组件（会为每个数据项渲染一次） |

### IterationContext 数据结构

子组件可以通过 `useContext(IterationContext)` 获取以下数据：

```typescript
interface IterationContextValue {
  value: any    // 当前迭代项的数据
  index: number // 当前迭代项的索引（从 0 开始）
}
```

## 基本用法

### 1. 基础迭代

最简单的使用方式，遍历数组并渲染列表：

```tsx
import { Iteration } from '@/registry/components/container-iteration/iteration'
import { useContext } from 'react'
import { IterationContext } from '@airiot/client'

// 迭代项组件
function Item() {
  const { value, index } = useContext(IterationContext)

  return (
    <div className="p-4 mb-2 bg-slate-50 rounded">
      <span className="font-medium">索引: {index}</span>
      <span className="ml-4">{value.name}</span>
    </div>
  )
}

// 使用迭代组件
function App() {
  const data = [
    { id: 1, name: '项目 1' },
    { id: 2, name: '项目 2' },
    { id: 3, name: '项目 3' }
  ]

  return (
    <Iteration iterationList={data}>
      <Item />
    </Iteration>
  )
}
```

### 2. 渲染对象列表

遍历对象数组：

```tsx
const users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' }
]

<Iteration iterationList={users}>
  <UserItem />
</Iteration>
```

### 3. 渲染数字数组

遍历简单数组：

```tsx
const numbers = [10, 20, 30, 40, 50]

<Iteration iterationList={numbers}>
  <NumberItem />
</Iteration>
```

### 4. 动态数据

使用 API 返回的数据：

```tsx
function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers().then(data => setUsers(data))
  }, [])

  return (
    <Iteration iterationList={users}>
      <UserCard />
    </Iteration>
  )
}
```

## 完整示例

### 用户卡片列表

```tsx
import { Iteration } from '@/registry/components/container-iteration/iteration'
import { useContext } from 'react'
import { IterationContext } from '@airiot/client'

// 用户卡片组件
function UserCard() {
  const { value, index } = useContext(IterationContext)

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          {value.name.charAt(0)}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{value.name}</h3>
          <p className="text-sm text-slate-600">{value.email}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-500">
          ID: {value.id}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs ${
          value.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value.status === 'active' ? '活跃' : '离线'}
        </span>
      </div>
    </div>
  )
}

// 使用示例
function UserList() {
  const users = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', status: 'active' },
    { id: 2, name: '李四', email: 'lisi@example.com', status: 'active' },
    { id: 3, name: '王五', email: 'wangwu@example.com', status: 'inactive' }
  ]

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">用户列表</h2>
      <Iteration iterationList={users}>
        <UserCard />
      </Iteration>
    </div>
  )
}
```

### 任务列表

```tsx
import { Iteration } from '@/registry/components/container-iteration/iteration'
import { useContext } from 'react'
import { IterationContext } from '@airiot/client'

// 任务项组件
function TaskItem() {
  const { value, index } = useContext(IterationContext)

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }

  return (
    <div className="flex items-center p-4 mb-3 bg-white rounded-lg shadow-sm border-l-4"
         style={{ borderLeftColor: value.priority === 'high' ? '#ef4444' : value.priority === 'medium' ? '#f59e0b' : '#22c55e' }}>
      <div className="flex-1">
        <h4 className="font-semibold text-slate-800">{value.title}</h4>
        <p className="text-sm text-slate-600 mt-1">{value.description}</p>
        <div className="flex items-center mt-2 space-x-4">
          <span className="text-xs text-slate-500">
            截止: {value.deadline}
          </span>
          <span className={`px-2 py-1 rounded text-xs text-white ${priorityColors[value.priority]}`}>
            {value.priority === 'high' ? '高' : value.priority === 'medium' ? '中' : '低'}
          </span>
        </div>
      </div>
      <div className="ml-4">
        <input
          type="checkbox"
          className="w-5 h-5 text-blue-600 rounded"
          checked={value.completed}
          onChange={() => console.log('切换任务:', index)}
        />
      </div>
    </div>
  )
}

// 使用示例
function TaskList() {
  const tasks = [
    {
      title: '完成项目文档',
      description: '编写项目的技术文档和使用说明',
      deadline: '2024-01-15',
      priority: 'high',
      completed: false
    },
    {
      title: '代码审查',
      description: '审查团队成员提交的代码',
      deadline: '2024-01-16',
      priority: 'medium',
      completed: false
    },
    {
      title: '更新依赖包',
      description: '更新项目中的第三方依赖包',
      deadline: '2024-01-20',
      priority: 'low',
      completed: true
    }
  ]

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">任务列表</h2>
      <Iteration iterationList={tasks}>
        <TaskItem />
      </Iteration>
    </div>
  )
}
```

### 产品网格

```tsx
import { Iteration } from '@/registry/components/container-iteration/iteration'
import { useContext } from 'react'
import { IterationContext } from '@airiot/client'

// 产品卡片组件
function ProductCard() {
  const { value, index } = useContext(IterationContext)

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-linear-to-br from-blue-400 to-purple-600 flex items-center justify-center">
        <span className="text-white text-6xl font-bold">{value.id}</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{value.name}</h3>
        <p className="text-slate-600 mb-4">{value.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            {value.price}
          </span>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            购买
          </button>
        </div>
      </div>
    </div>
  )
}

// 使用示例
function ProductGrid() {
  const products = [
    { id: 1, name: '产品 A', description: '优质产品 A', price: '¥299' },
    { id: 2, name: '产品 B', description: '优质产品 B', price: '¥399' },
    { id: 3, name: '产品 C', description: '优质产品 C', price: '¥499' },
    { id: 4, name: '产品 D', description: '优质产品 D', price: '¥599' },
    { id: 5, name: '产品 E', description: '优质产品 E', price: '¥699' },
    { id: 6, name: '产品 F', description: '优质产品 F', price: '¥799' }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">产品列表</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Iteration iterationList={products}>
          <ProductCard />
        </Iteration>
      </div>
    </div>
  )
}
```

### 数据表格

```tsx
import { Iteration } from '@/registry/components/container-iteration/iteration'
import { useContext } from 'react'
import { IterationContext } from '@airiot/client'

// 表格行组件
function TableRow() {
  const { value, index } = useContext(IterationContext)

  return (
    <tr className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
        {value.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
        {value.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
        {value.department}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
        {value.position}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value.status === 'active' ? '在职' : '离职'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
        {value.joinDate}
      </td>
    </tr>
  )
}

// 使用示例
function EmployeeTable() {
  const employees = [
    { id: 1, name: '张三', department: '技术部', position: '工程师', status: 'active', joinDate: '2023-01-15' },
    { id: 2, name: '李四', department: '产品部', position: '产品经理', status: 'active', joinDate: '2023-03-20' },
    { id: 3, name: '王五', department: '设计部', position: '设计师', status: 'inactive', joinDate: '2022-06-10' },
    { id: 4, name: '赵六', department: '技术部', position: '架构师', status: 'active', joinDate: '2022-11-05' }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">员工列表</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-slate-200">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">姓名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">部门</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">职位</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">入职日期</th>
            </tr>
          </thead>
          <tbody>
            <Iteration iterationList={employees}>
              <TableRow />
            </Iteration>
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

### 统计卡片

```tsx
import { Iteration } from '@/registry/components/container-iteration/iteration'
import { useContext } from 'react'
import { IterationContext } from '@airiot/client'

// 统计卡片组件
function StatCard() {
  const { value, index } = useContext(IterationContext)

  const colors = [
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-orange-400 to-orange-600'
  ]

  const icons = ['👥', '💰', '📊', '⭐']

  return (
    <div className={`bg-linear-to-br ${colors[index % colors.length]} rounded-xl p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-1">{value.label}</p>
          <p className="text-3xl font-bold">{value.value}</p>
          <p className="text-sm mt-2 opacity-80">{value.change}</p>
        </div>
        <div className="text-4xl">{icons[index % icons.length]}</div>
      </div>
    </div>
  )
}

// 使用示例
function StatGrid() {
  const stats = [
    { label: '总用户', value: '10,234', change: '+12.5%' },
    { label: '总收入', value: '¥1.2M', change: '+8.3%' },
    { label: '订单数', value: '5,678', change: '+15.7%' },
    { label: '满意度', value: '98.5%', change: '+2.1%' }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">数据统计</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Iteration iterationList={stats}>
          <StatCard />
        </Iteration>
      </div>
    </div>
  )
}
```

## 注意事项

1. **必须使用 Context**：子组件必须使用 `useContext(IterationContext)` 来获取当前迭代项的数据和索引

2. **数据类型**：`iterationList` 可以是任何类型的数组，但建议保持数据结构的一致性

3. **索引从 0 开始**：`index` 从 0 开始计数，符合 JavaScript 的数组索引规范

4. **唯一 key**：组件内部使用 `index` 作为 key，如果数据项有唯一 ID，建议在子组件中使用

5. **性能考虑**：对于大量数据（超过 100 项），建议配合虚拟滚动使用，以提高性能

6. **数据更新**：当 `iterationList` 改变时，组件会自动重新渲染所有子组件

7. **嵌套使用**：可以在一个迭代组件的子组件中再嵌套另一个迭代组件，实现多维数据展示

8. **空数组处理**：当 `iterationList` 为空数组时，不会渲染任何子组件

9. **Context 作用域**：`IterationContext` 只在 `Iteration` 组件的直接子组件中有效

10. **样式一致性**：所有子组件使用相同的数据结构，便于保持样式的一致性
