# DataSourceTable 数据表源

## 导入路径

```tsx
import { DataSourceTable } from '@/components/airiot/data-source/datasource-table'
import { useState } from 'react'
```

## 基础用法

```tsx
import { DataSourceTable } from '@/components/airiot/data-source/datasource-table'

function TableExample() {
  const { data, loading, error, pagination } = DataSourceTable.useQuery({
    table: 'users',
    fields: ['id', 'name', 'email'],
    where: { status: 'active' },
    order: { createdAt: 'desc' },
    pagination: { page: 1, size: 10 }
  })

  if (loading) {
    return <div>加载中...</div>
  }

  if (error) {
    return <div>错误: {error.message}</div>
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>邮箱</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => pagination.prevPage()} disabled={!pagination.hasPrev}>
          上一页
        </button>
        <span>第 {pagination.page} 页，共 {pagination.total} 条</span>
        <button onClick={() => pagination.nextPage()} disabled={!pagination.hasNext}>
          下一页
        </button>
      </div>
    </div>
  )
}
```

## 高级用法

```tsx
import { DataSourceTable } from '@/components/airiot/data-source/datasource-table'
import { useMutation } from '@tanstack/react-query'

function AdvancedTableExample() {
  // 查询数据
  const { data: users, refetch } = DataSourceTable.useQuery({
    table: 'users',
    fields: ['id', 'name', 'email', 'status'],
    where: { department: 'IT' },
    pagination: { page: 1, size: 20 }
  })

  // 新增记录
  const createUser = DataSourceTable.useMutation({
    table: 'users',
    operation: 'insert',
    onSuccess: () => {
      refetch()
    }
  })

  // 更新记录
  const updateUser = DataSourceTable.useMutation({
    table: 'users',
    operation: 'update',
    where: { id: 1 },
    data: { status: 'inactive' },
    onSuccess: () => {
      refetch()
    }
  })

  // 删除记录
  const deleteUser = DataSourceTable.useMutation({
    table: 'users',
    operation: 'delete',
    where: { id: 1 },
    onSuccess: () => {
      refetch()
    }
  })

  // 批量操作
  const batchUpdate = DataSourceTable.useMutation({
    table: 'users',
    operation: 'batchUpdate',
    where: { department: 'IT' },
    data: { status: 'archived' },
    onSuccess: () => {
      refetch()
    }
  })

  return (
    <div>
      <h2>用户管理</h2>

      <button onClick={() => createUser.mutate({
        name: '新用户',
        email: 'newuser@example.com',
        department: 'IT'
      })}>
        添加用户
      </button>

      <button onClick={() => batchUpdate.mutate()}>
        批量归档
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>邮箱</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users?.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
                <button onClick={() => updateUser.mutate({ id: user.id })}>
                  更新
                </button>
                <button onClick={() => deleteUser.mutate({ id: user.id })}>
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

## Props

### DataSourceTable.useQuery

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| table | string | - | 表名 |
| fields | string[] | ['*'] | 查询字段 |
| where | object | - | 查询条件 |
| order | object | - | 排序条件 |
| pagination | object | { page: 1, size: 10 } | 分页条件 |
| queryKey | any[] | - | 缓存键 |

### DataSourceTable.useMutation

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| table | string | - | 表名 |
| operation | 'insert' \| 'update' \| 'delete' \| 'batchUpdate' | 'insert' | 操作类型 |
| where | object | - | 更新/删除条件 |
| data | object | - | 数据 |
| queryKey | any[] | - | 缓存键 |

## 方法

### DataSourceTable.find(options)

查找单条记录

```tsx
const user = await DataSourceTable.find({
  table: 'users',
  where: { id: 1 }
})
```

### DataSourceTable.insert(data, options)

插入记录

```tsx
const result = await DataSourceTable.insert({
  table: 'users',
  data: {
    name: '新用户',
    email: 'user@example.com'
  }
})
```

### DataSourceTable.update(where, data, options)

更新记录

```tsx
const result = await DataSourceTable.update({
  table: 'users',
  where: { id: 1 },
  data: { status: 'active' }
})
```

### DataSourceTable.delete(where, options)

删除记录

```tsx
const result = await DataSourceTable.delete({
  table: 'users',
  where: { id: 1 }
})
```

## 查询条件语法

### 基本条件

```tsx
where: {
  name: '张三', // 等于
  age: { gte: 18 }, // 大于等于
  status: { in: ['active', 'pending'] } // IN
}
```

### 逻辑运算

```tsx
where: {
  and: [
    { age: { gte: 18 } },
    { status: 'active' }
  ],
  or: [
    { department: 'IT' },
    { department: 'HR' }
  ]
}
```

### 排序

```tsx
order: {
  createdAt: 'desc', // 降序
  name: 'asc' // 升序
}
```

## 注意事项

- 使用前需要配置数据库连接
- 大数据量查询建议使用分页
- 批量操作前请确认数据安全性
- 更新操作建议使用乐观更新
- 查询结果会被自动缓存，使用queryKey可以管理缓存
- 支持事务操作，需要在配置中开启