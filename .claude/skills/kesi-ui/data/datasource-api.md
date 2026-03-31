> **安装命令**: `npx shadcn@latest add @kesi/datasource-api`

# DatasourceApi API 数据源组件

## 简介

`DatasourceApi` 是一个 API 数据源容器组件，用于从外部 API 获取数据并提供给子组件使用。

- **纯容器组件**：不包含任何布局和样式
- **Context 集成**：内部集成 `ContextProvider`，子组件通过 `useContextProvider` 获取数据
- **自动数据管理**：数据自动存储到 Jotai atom，通过组件 ID 访问
- **定时轮询**：支持设置定时轮询间隔
- **认证支持**：支持 appkey/appsecret 认证

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `id` | `string` | 是 | `'api-data-source'` | 数据源唯一标识，用于存储和访问数据 |
| `url` | `string` | 是 | `''` | API 请求地址，支持 4 种形式（见下方说明） |
| `method` | `'GET' \| 'POST' \| 'PUT' \| 'PATCH' \| 'DELETE'` | 否 | `'GET'` | HTTP 请求方法 |
| `headers` | `Array<{ name: string; value: string }>` | 否 | `[]` | 请求头配置 |
| `body` | `Array<{ name: string; value: string }>` | 否 | `[]` | 请求体参数 |
| `predata` | `boolean` | 否 | `false` | 是否预处理数据为图表格式（{ dimensions, source }） |
| `table` | `any` | 否 | - | 数据表配置，当 URL 包含 `{table}` 占位符时必填 |
| `appkey` | `string` | 否 | - | 认证 AppKey，当 URL 包含 `{appkey}` 占位符时必填 |
| `appsecret` | `string` | 否 | - | 认证 AppSecret，当 URL 包含 `{appsecret}` 占位符时必填 |
| `interval` | `number` | 否 | `0` | 轮询间隔（毫秒），0 表示不轮询 |
| `submit` | `string` | 否 | - | 提交触发器标识，值变化时触发数据刷新 |
| `children` | `ReactNode` | 否 | - | 子组件 |

### URL 参数的 4 种形式

`url` 参数支持以下 4 种形式，不同形式需要配置不同的关联参数：

#### 形式 1: 表数据查询（需要 table 参数）

```typescript
url: 'core/t/{table}/d'
```

- **说明**：查询指定表的数据
- **占位符**：`{table}` 会被替换为 `table.id` 的值
- **关联参数**：必须配置 `table` 参数
- **示例**：
  ```tsx
  <DatasourceApi
    url="core/t/{table}/d"
    table={{ id: "user", title: "用户表" }}
  />
  ```
  实际请求路径：`core/t/user/d`

#### 形式 2: 系统接口（无需其他参数）

```typescript
url: 'core/systemVariable'
```

- **说明**：调用内部系统接口
- **关联参数**：无需额外配置
- **示例**：
  ```tsx
  <DatasourceApi
    url="core/systemVariable"
  />
  ```

#### 形式 3: 认证接口（需要 appkey 和 appsecret 参数）

```typescript
url: 'core/auth/token?appkey={appkey}&appsecret={appsecret}'
```

- **说明**：需要认证的接口调用
- **占位符**：`{appkey}` 和 `{appsecret}` 会被对应参数值替换
- **关联参数**：必须同时配置 `appkey` 和 `appsecret`
- **示例**：
  ```tsx
  <DatasourceApi
    url="core/auth/token?appkey={appkey}&appsecret={appsecret}"
    appkey="my-app-key"
    appsecret="my-app-secret"
  />
  ```
  实际请求路径：`core/auth/token?appkey=my-app-key&appsecret=my-app-secret`

#### 形式 4: 外部 HTTP 接口（无需其他参数）

```typescript
url: 'https://api.example.com/data'
url: 'http://localhost:8080/api/users'
```

- **说明**：调用外部 HTTP(S) 接口
- **判断条件**：URL 以 `http://` 或 `https://` 开头
- **关联参数**：无需额外配置
- **示例**：
  ```tsx
  <DatasourceApi
    url="https://api.example.com/users"
    method="GET"
  />
  ```

### 参数关联关系总结

| URL 形式 | 必需参数 | 可选参数 |
|---------|---------|---------|
| `core/t/{table}/d` | `table` | - |
| `core/systemVariable` | - | - |
| `core/auth/token?appkey={appkey}&appsecret={appsecret}` | `appkey`, `appsecret` | - |
| `https://...` 或 `http://...` | - | - |

### 参数依赖验证

组件会自动检查参数配置是否完整：
- 形式 1 缺少 `table` 参数时，会在控制台输出警告并终止请求
- 形式 3 缺少 `appkey` 或 `appsecret` 参数时，会在控制台输出警告并终止请求

## 基本用法

### 1. 表数据查询（形式 1）

查询内部表数据，使用 `{table}` 占位符：

```tsx
import { DatasourceApi } from '@/components/kesi/datasource-api'

function TableDataExample() {
  return (
    <DatasourceApi
      id="user-table-data"
      url="core/t/{table}/d"
      table={{ id: 'user', title: '用户表' }}
    >
      <DataTable />
    </DatasourceApi>
  )
}
```

### 2. 系统接口调用（形式 2）

调用系统内部接口：

```tsx
function SystemVariableExample() {
  return (
    <DatasourceApi
      id="system-vars"
      url="core/systemVariable"
    >
      <VariableDisplay />
    </DatasourceApi>
  )
}
```

### 3. 认证接口调用（形式 3）

使用 appkey/appsecret 认证的接口：

```tsx
function AuthTokenExample() {
  return (
    <DatasourceApi
      id="auth-token"
      url="core/auth/token?appkey={appkey}&appsecret={appsecret}"
      appkey="your-app-key"
      appsecret="your-app-secret"
    >
      <TokenDisplay />
    </DatasourceApi>
  )
}
```

### 4. 外部 HTTP 接口调用（形式 4）

调用外部 HTTP(S) 接口：

```tsx
function ExternalApiExample() {
  return (
    <DatasourceApi
      id="external-data"
      url="https://jsonplaceholder.typicode.com/users"
      method="GET"
    >
      <UserList />
    </DatasourceApi>
  )
}
```

### 5. 带请求头的外部接口

```tsx
<DatasourceApi
  id="secure-data"
  url="https://api.example.com/data"
  method="GET"
  headers={[
    { name: 'Authorization', value: 'Bearer token123' },
    { name: 'Content-Type', value: 'application/json' }
  ]}
>
  <SecureDataTable />
</DatasourceApi>
```

### 6. POST 请求

```tsx
<DatasourceApi
  id="create-user"
  url="https://api.example.com/users"
  method="POST"
  headers={[
    { name: 'Content-Type', value: 'application/json' }
  ]}
  body={[
    { name: 'name', value: 'John Doe' },
    { name: 'email', value: 'john@example.com' }
  ]}
>
  <SuccessMessage />
</DatasourceApi>
```

### 7. 定时轮询数据

每 5 秒自动刷新数据：

```tsx
<DatasourceApi
  id="realtime-data"
  url="https://api.example.com/status"
  interval={5000}
>
  <RealtimeChart />
</DatasourceApi>
```

### 5. 子组件获取数据

子组件使用 `useContextProvider` 获取数据：

```tsx
import { useContextProvider } from '@/components/kesi/container-context-provider'

function DataDisplay() {
  const { data, loading } = useContextProvider()[0]

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

### 6. 使用 useDatasetSet 访问数据

通过组件 ID 从 Jotai atom 获取数据：

```tsx
import { useDataset } from '@airiot/client'

function AnotherComponent() {
  const { data, loading } = useDataset('user-data')

  return (
    <div>
      {loading ? '加载中...' : JSON.stringify(data)}
    </div>
  )
}
```

## 完整示例

### 数据表格展示

```tsx
import { DatasourceApi } from '@/components/kesi/datasource-api'
import { useContextProvider } from '@/components/kesi/container-context-provider'

function UserTable() {
  const { data, loading } = useContextProvider()[0]

  if (loading) return <div>加载中...</div>
  if (!data) return <div>无数据</div>

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>姓名</th>
          <th>邮箱</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user: any) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function App() {
  return (
    <DatasourceApi
      id="users"
      url="https://jsonplaceholder.typicode.com/users"
      method="GET"
      interval={0}
    >
      <UserTable />
    </DatasourceApi>
  )
}
```

### 实时监控数据

```tsx
import { DatasourceApi } from '@/components/kesi/datasource-api'

function MonitorDashboard() {
  return (
    <DatasourceApi
      id="monitor-data"
      url="https://api.example.com/metrics"
      method="GET"
      interval={3000}
      headers={[
        { name: 'Authorization', value: 'Bearer your-token' }
      ]}
    >
      <MetricsChart />
      <StatusPanel />
    </DatasourceApi>
  )
}
```

## 注意事项

1. **唯一 ID**：每个 `DatasourceApi` 的 `id` 必须唯一，避免数据冲突
2. **HTTPS**：生产环境建议使用 HTTPS 接口
3. **错误处理**：建议在子组件中处理加载和错误状态
4. **轮询间隔**：`interval` 设置过小可能造成性能问题，建议不低于 1000ms
5. **认证安全**：避免在前端代码中硬编码敏感信息，建议通过环境变量管理
6. **数据格式**：确保 API 返回的是标准 JSON 格式
