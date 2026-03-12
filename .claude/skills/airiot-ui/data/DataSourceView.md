## DataSourceView - 视图数据源

### 导入路径
```tsx
import { DataSourceView } from '@/components/airiot/datasource-view/datasource-view'
```

### 基础用法
```tsx
import { DataSourceView } from '@/components/airiot/datasource-view/datasource-view'

function ViewExample() {
  return (
    <DataSourceView
      viewName="user-list"
      pageSize={20}
      enablePagination={true}
      sortField="createTime"
      sortOrder="desc"
    >
      {/* 视图数据展示内容 */}
    </DataSourceView>
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| viewName | string | - | 视图名称 |
| pageSize | number | 20 | 每页条目数 |
| enablePagination | boolean | true | 是否启用分页 |
| sortField | string | - | 排序字段 |
| sortOrder | 'asc' \| 'desc' | 'asc' | 排序顺序 |

### 示例
```tsx
import { DataSourceView, TableView } from '@/components/airiot'

function UserView() {
  return (
    <DataSourceView
      viewName="user-management"
      pageSize={50}
      enablePagination={true}
      sortField="username"
      sortOrder="asc"
    >
      <TableView
        columns={[
          { field: 'username', title: '用户名' },
          { field: 'email', title: '邮箱' },
          { field: 'role', title: '角色' }
        ]}
        showActions={true}
      />
    </DataSourceView>
  )
}
```

### 注意事项
- 视图数据从数据库视图读取
- 支持服务器端分页和排序
- 可以配置过滤条件
- 视图权限基于用户角色