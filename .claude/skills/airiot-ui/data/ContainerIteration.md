## ContainerIteration - 迭代容器

### 导入路径
```tsx
import { ContainerIteration } from '@/components/airiot/container-iteration/container-iteration'
```

### 基础用法
```tsx
import { ContainerIteration } from '@/components/airiot'

function ListExample() {
  const items = [
    { id: 1, name: '项目1' },
    { id: 2, name: '项目2' },
    { id: 3, name: '项目3' }
  ]

  return (
    <ContainerIteration items={items} keyField="id">
      {(item, index) => (
        <div>
          <Text>{index + 1}. {item.name}</Text>
        </div>
      )}
    </ContainerIteration>
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| items | Array | - | 迭代的数据数组 |
| keyField | string | - | 作为 key 的字段名 |
| renderItem | (item, index) => ReactNode | - | 渲染函数 |
| empty | ReactNode | - | 空状态显示 |

### 示例
```tsx
import { ContainerIteration, Card, Button } from '@/components/airiot'

function UserList() {
  const users = [
    { id: 1, name: '张三', role: 'admin' },
    { id: 2, name: '李四', role: 'user' }
  ]

  return (
    <ContainerIteration
      items={users}
      keyField="id"
      renderItem={(user) => (
        <Card
          cardTitle={user.name}
          cardBordered={true}
        >
          <div>角色: {user.role}</div>
          <Button size="small">编辑</Button>
        </Card>
      )}
      empty={<div>暂无用户数据</div>}
    />
  )
}
```

### 注意事项
- 必须指定 keyField
- renderItem 必须返回 ReactNode
- 支持自定义空状态显示