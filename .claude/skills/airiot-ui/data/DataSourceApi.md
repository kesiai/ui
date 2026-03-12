# DataSourceApi API数据源

## 导入路径

```tsx
import { DataSourceApi } from '@/components/airiot/data-source/datasource-api'
import { useQuery } from '@tanstack/react-query'
```

## 基础用法

```tsx
import { DataSourceApi } from '@/components/airiot/data-source/datasource-api'

function ApiExample() {
  const { data, loading, error } = DataSourceApi.useQuery({
    url: '/api/users',
    method: 'GET'
  })

  if (loading) {
    return <div>加载中...</div>
  }

  if (error) {
    return <div>错误: {error.message}</div>
  }

  return (
    <div>
      {data?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

## 高级用法

```tsx
import { DataSourceApi } from '@/components/airiot/data-source/datasource-api'
import { useMutation } from '@tanstack/react-query'

function AdvancedApiExample() {
  // GET查询
  const { data: users, refetch } = DataSourceApi.useQuery({
    url: '/api/users',
    method: 'GET',
    params: { page: 1, size: 10 },
    queryKey: ['users', { page: 1, size: 10 }]
  })

  // POST请求
  const createUser = DataSourceApi.useMutation({
    url: '/api/users',
    method: 'POST',
    onSuccess: () => {
      // 成功回调
      refetch()
    },
    onError: (error) => {
      // 错误处理
      console.error('创建失败:', error)
    }
  })

  // 更新请求
  const updateUser = DataSourceApi.useMutation({
    url: '/api/users/{id}',
    method: 'PUT',
    pathParams: { id: 1 },
    body: { name: '新名字' }
  })

  // 删除请求
  const deleteUser = DataSourceApi.useMutation({
    url: '/api/users/{id}',
    method: 'DELETE',
    pathParams: { id: 1 },
    onSuccess: () => {
      refetch()
    }
  })

  return (
    <div>
      <button onClick={() => createUser.mutate({ name: '新用户' })}>
        创建用户
      </button>

      <button onClick={() => updateUser.mutate()}>
        更新用户
      </button>

      <button onClick={() => deleteUser.mutate()}>
        删除用户
      </button>
    </div>
  )
}
```

## Props

### DataSourceApi.useQuery

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| url | string | - | API地址 |
| method | 'GET' \| 'POST' \| 'PUT' \| 'DELETE' \| 'PATCH' | 'GET' | HTTP方法 |
| params | object | - | URL参数 |
| headers | object | - | 请求头 |
| queryKey | any[] | - | 查询键值 |
| enabled | boolean | true | 是否启用查询 |
| staleTime | number | 0 | 数据过期时间（毫秒） |
| cacheTime | number | 5 * 60 * 1000 | 缓存时间（毫秒） |

### DataSourceApi.useMutation

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| url | string | - | API地址 |
| method | 'POST' \| 'PUT' \| 'DELETE' \| 'PATCH' | 'POST' | HTTP方法 |
| body | any | - | 请求体 |
| pathParams | object | - | 路径参数 |
| headers | object | - | 请求头 |
| onSuccess | (data: any) => void | - | 成功回调 |
| onError | (error: Error) => void | - | 错误回调 |
| onSettled | () => void | - | 完成（无论成功失败）回调 |

## 方法

### DataSourceApi.get(url, options?)

发送GET请求

```tsx
const response = await DataSourceApi.get('/api/users', {
  params: { page: 1 },
  headers: { 'Authorization': 'Bearer token' }
})
```

### DataSourceApi.post(url, data, options?)

发送POST请求

```tsx
const response = await DataSourceApi.post('/api/users', {
  name: '新用户',
  email: 'user@example.com'
})
```

### DataSourceApi.put(url, data, options?)

发送PUT请求

```tsx
const response = await DataSourceApi.put('/api/users/1', {
  name: '更新用户'
})
```

### DataSourceApi.delete(url, options?)

发送DELETE请求

```tsx
const response = await DataSourceApi.delete('/api/users/1')
```

## 拦截器

### 请求拦截器

```tsx
DataSourceApi.addRequestInterceptor((config) => {
  // 添加token
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
})
```

### 响应拦截器

```tsx
DataSourceApi.addResponseInterceptor((response) => {
  // 统一处理响应
  if (response.data.code !== 200) {
    throw new Error(response.data.message)
  }
  return response.data
}, (error) => {
  // 统一处理错误
  console.error('请求错误:', error)
  return Promise.reject(error)
})
```

## 注意事项

- 使用前确保已经正确配置了React Query
- 对于复杂的数据结构，建议使用queryKey来缓存数据
- 在组件卸载时，会自动取消正在进行的请求
- 支持并发请求，会自动合并相同的请求
- 建议在项目全局配置基础URL和公共headers