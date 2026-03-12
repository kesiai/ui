## Status - 状态指示器组件

### 导入路径
```tsx
import { Status } from '@/components/airiot/status/status'
```

### 基础用法
```tsx
import { Status } from '@/components/airiot/status/status'

function StatusExample() {
  return (
    <Status
      status="success"
      text="成功"
      showIcon={true}
      pulse={false}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| status | 'success' \| 'warning' \| 'error' \| 'info' | 'info' | 状态类型 |
| text | string | '' | 状态文本 |
| showIcon | boolean | true | 是否显示图标 |
| pulse | boolean | false | 是否脉冲动画 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 尺寸 |

### 示例
```tsx
import { Status, Card, Space } from '@/components/airiot'

function StatusDemo() {
  const orders = [
    { id: 1, status: 'success', text: '已完成' },
    { id: 2, status: 'processing', text: '处理中' },
    { id: 3, status: 'error', text: '失败' },
    { id: 4, status: 'warning', text: '待审核' }
  ]

  return (
    <Card cardTitle="订单状态">
      <Space direction="vertical" style={{ width: '100%' }}>
        {orders.map((order) => (
          <div key={order.id} style={{ display: 'flex', alignItems: 'center' }}>
            <Status
              status={order.status}
              text={order.text}
              showIcon={true}
              size="small"
            />
          </div>
        ))}
      </Space>
    </Card>
  )
}
```

### 状态类型
- success - 成功（绿色）
- warning - 警告（黄色）
- error - 错误（红色）
- info - 信息（蓝色）

### 注意事项
- 可以用于表格行状态
- 支持自定义图标
- 适合用于状态标签