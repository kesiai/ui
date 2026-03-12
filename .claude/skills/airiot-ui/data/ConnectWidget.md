## ConnectWidget - 连接组件

### 导入路径
```tsx
import { ConnectWidget } from '@/components/airiot/connect-widget/connect-widget'
```

### 基础用法
```tsx
import { ConnectWidget } from '@/components/airiot/connect-widget/connect-widget'

function ConnectExample() {
  return (
    <ConnectWidget
      type="database"
      status="connected"
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | 'database' \| 'api' \| 'websocket' | 'database' | 连接类型 |
| status | 'disconnected' \| 'connecting' \| 'connected' \| 'error' | 'disconnected' | 连接状态 |
| onConnect | () => void | - | 连接成功回调 |
| onDisconnect | () => void | - | 断开连接回调 |
| config | object | {} | 连接配置 |

### 示例
```tsx
import { ConnectWidget, Button, Status } from '@/components/airiot'

function DatabaseConnection() {
  const [status, setStatus] = useState('disconnected')

  const handleConnect = () => {
    // 连接数据库逻辑
    setStatus('connected')
  }

  return (
    <div>
      <ConnectWidget
        type="database"
        status={status}
        onConnect={handleConnect}
        onDisconnect={() => setStatus('disconnected')}
        config={{
          host: 'localhost',
          port: 3306,
          database: 'mydb'
        }}
      />

      <Status
        status={status === 'connected' ? 'success' : 'error'}
        text={status === 'connected' ? '已连接' : '未连接'}
      />

      <Button onClick={handleConnect}>
        连接数据库
      </Button>
    </div>
  )
}
```

### 注意事项
- 支持多种连接类型
- 自动管理连接状态
- 提供视觉化的连接指示器