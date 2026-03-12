## DataSourceInterface - 接口数据源

### 导入路径
```tsx
import { DataSourceInterface } from '@/components/airiot/datasource-interface/datasource-interface'
```

### 基础用法
```tsx
import { DataSourceInterface, DataView } from '@/components/airiot'

function InterfaceExample() {
  return (
    <DataSourceInterface
      interfaceId="user-api"
      endpoint="/api/users"
      method="GET"
      params={{ page: 1, size: 10 }}
    >
      <DataView />
    </DataSourceInterface>
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| interfaceId | string | - | 接口标识 |
| endpoint | string | - | 接口地址 |
| method | 'GET' \| 'POST' \| 'PUT' \| 'DELETE' | 'GET' | 请求方法 |
| params | object | {} | 请求参数 |
| headers | object | {} | 请求头 |
| timeout | number | 10000 | 超时时间 |

### 示例
```tsx
import { DataSourceInterface, Table } from '@/components/airiot'

function UserInterface() {
  return (
    <DataSourceInterface
      interfaceId="user-management"
      endpoint="/api/users"
      method="GET"
      params={{
        page: 1,
        size: 20,
        search: '张三'
      }}
      headers={{
        'Authorization': 'Bearer token'
      }}
    >
      <Table
        columns={[
          { field: 'id', title: 'ID' },
          { field: 'name', title: '姓名' },
          { field: 'email', title: '邮箱' }
        ]}
      />
    </DataSourceInterface>
  )
}
```

### 注意事项
- 接口需要预先配置
- 支持动态参数传递
- 自动处理加载状态和错误