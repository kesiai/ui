## DataSourceMessage - 消息数据源

### 导入路径
```tsx
import { DataSourceMessage } from '@/components/airiot/datasource-message/datasource-message'
```

### 基础用法
```tsx
import { DataSourceMessage, MessageList } from '@/components/airiot'

function MessageExample() {
  return (
    <DataSourceMessage
      channel="notification"
      autoRefresh={true}
      refreshInterval={5000}
    >
      <MessageList />
    </DataSourceMessage>
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| channel | string | - | 消息频道 |
| autoRefresh | boolean | true | 是否自动刷新 |
| refreshInterval | number | 10000 | 刷新间隔（毫秒） |
| maxMessages | number | 100 | 最大消息数 |
| filter | (message) => boolean | - | 消息过滤函数 |

### 示例
```tsx
import { DataSourceMessage, Alert, Badge } from '@/components/airiot'

function NotificationCenter() {
  return (
    <DataSourceMessage
      channel="user-notifications"
      autoRefresh={true}
      refreshInterval={3000}
      maxMessages={50}
      filter={(msg) => msg.priority !== 'low'}
    >
      <div>
        <Badge count={5} />
        <Alert
          type="info"
          message="您有新消息"
          showIcon={true}
        />
      </div>
    </DataSourceMessage>
  )
}
```

### 注意事项
- 支持 WebSocket 和 HTTP 轮询两种方式
- 消息按时间排序
- 可以设置消息过期时间