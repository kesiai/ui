## ViewDetail - 详情视图组件

### 导入路径
```tsx
import { ViewDetail } from '@/components/airiot/view-detail/view-detail'
```

### 基础用法
```tsx
import { ViewDetail } from '@/components/airiot/view-detail/view-detail'

function DetailExample() {
  return (
    <ViewDetail
      data={userData}
      loading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
    >
      <DetailField label="用户名" field="username" />
      <DetailField label="邮箱" field="email" />
      <DetailField label="注册时间" field="createTime" />
    </ViewDetail>
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | object | {} | 数据对象 |
| loading | boolean | false | 加载状态 |
| onEdit | () => void | - | 编辑回调 |
| onDelete | () => void | - | 删除回调 |
| title | string | - | 标题 |
| showActions | boolean | true | 是否显示操作按钮 |

### 示例
```tsx
import {
  ViewDetail,
  DetailField,
  Avatar,
  Tag,
  Space,
  Button
} from '@/components/airiot'

function UserProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    // 模拟API调用
    setTimeout(() => {
      setUser({
        id: 1,
        username: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138000',
        avatar: '/avatars/zhangsan.jpg',
        role: 'admin',
        status: 'active',
        createTime: '2024-01-01 10:00:00',
        lastLogin: '2024-03-12 15:30:00'
      })
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <ViewDetail
      data={user}
      loading={loading}
      title="用户详情"
      onEdit={() => console.log('编辑用户')}
      onDelete={() => console.log('删除用户')}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Avatar
          src={user?.avatar}
          size={80}
          shape="circle"
        />
        <div style={{ marginLeft: 16 }}>
          <DetailField
            label="用户名"
            field="username"
            render={(value) => (
              <span style={{ fontSize: 20, fontWeight: 'bold' }}>
                {value}
              </span>
            )}
          />
          <DetailField
            label="角色"
            field="role"
            render={(value) => <Tag color="blue">{value}</Tag>}
          />
        </div>
      </div>

      <Space direction="vertical" style={{ width: '100%' }}>
        <DetailField label="邮箱" field="email" />
        <DetailField label="手机号" field="phone" />
        <DetailField label="注册时间" field="createTime" />
        <DetailField label="最后登录" field="lastLogin" />
      </Space>
    </ViewDetail>
  )
}
```

### 使用场景
- 用户详情页
- 产品详情展示
- 订单详情查看

### 注意事项
- 支持自定义字段渲染
- 可以嵌套使用其他组件
- 自动处理空值显示