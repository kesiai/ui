# DataSourceRealtime 实时数据源

## 导入路径

```tsx
import { DataSourceRealtime } from '@/components/airiot/data-source/datasource-realtime'
import { useEffect, useState } from 'react'
```

## 基础用法

```tsx
import { DataSourceRealtime } from '@/components/airiot/data-source/datasource-realtime'

function RealtimeExample() {
  const [data, setData] = useState([])

  useEffect(() => {
    // 创建实时连接
    const connection = DataSourceRealtime.connect('ws://localhost:8080/realtime')

    // 订阅数据流
    const subscription = connection.subscribe('sensor_data', (data) => {
      setData(prev => [...prev, data])
    })

    // 清理连接
    return () => {
      subscription.unsubscribe()
      connection.disconnect()
    }
  }, [])

  return (
    <div>
      <h2>实时数据</h2>
      <div>
        {data.map((item, index) => (
          <div key={index}>
            {JSON.stringify(item)}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 高级用法

```tsx
import { DataSourceRealtime } from '@/components/airiot/data-source/datasource-realtime'
import { useState } from 'react'

function AdvancedRealtimeExample() {
  const [connection, setConnection] = useState(null)
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  // 连接到实时服务
  const connect = () => {
    const conn = DataSourceRealtime.connect('ws://localhost:8080/realtime', {
      reconnect: true,
      reconnectInterval: 5000,
      maxReconnectAttempts: 10
    })

    // 连接事件
    conn.on('open', () => {
      setIsConnected(true)
      console.log('连接已建立')
    })

    conn.on('close', () => {
      setIsConnected(false)
      console.log('连接已关闭')
    })

    conn.on('error', (error) => {
      console.error('连接错误:', error)
    })

    setConnection(conn)
  }

  // 订阅主题
  const subscribe = (topic) => {
    if (connection && connection.connected) {
      connection.subscribe(topic, (message) => {
        setMessages(prev => [...prev, { topic, message, timestamp: Date.now() }])
      })
    }
  }

  // 发布消息
  const publish = (topic, message) => {
    if (connection && connection.connected) {
      connection.publish(topic, message)
    }
  }

  // 断开连接
  const disconnect = () => {
    if (connection) {
      connection.disconnect()
      setConnection(null)
      setIsConnected(false)
    }
  }

  return (
    <div>
      <h2>实时消息系统</h2>

      <div>
        <button onClick={connect} disabled={isConnected}>
          连接
        </button>
        <button onClick={disconnect} disabled={!isConnected}>
          断开
        </button>
      </div>

      <div>
        <input
          placeholder="输入主题"
          value={topicInput}
          onChange={(e) => setTopicInput(e.target.value)}
        />
        <button onClick={() => subscribe(topicInput)}>
          订阅
        </button>
      </div>

      <div>
        <textarea
          placeholder="输入消息"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={() => publish(topicInput, messageInput)}>
          发布
        </button>
      </div>

      <div>
        <h3>消息列表</h3>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.topic}</strong>: {JSON.stringify(msg.message)}
              <small> - {new Date(msg.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

## Props

### DataSourceRealtime.connect(url, options?)

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| url | string | - | WebSocket服务器地址 |
| reconnect | boolean | true | 是否自动重连 |
| reconnectInterval | number | 5000 | 重连间隔（毫秒） |
| maxReconnectAttempts | number | 10 | 最大重连次数 |
| timeout | number | 10000 | 连接超时（毫秒） |

### 连接对象方法

#### connection.subscribe(topic, callback)

订阅主题

```tsx
connection.subscribe('sensor_data', (data) => {
  console.log('收到数据:', data)
})
```

#### connection.unsubscribe(topic)

取消订阅

```tsx
connection.unsubscribe('sensor_data')
```

#### connection.publish(topic, message)

发布消息

```tsx
connection.publish('control', { action: 'start' })
```

#### connection.disconnect()

断开连接

```tsx
connection.disconnect()
```

### 事件监听

#### on('open', callback)

连接建立事件

```tsx
connection.on('open', () => {
  console.log('WebSocket已连接')
})
```

#### on('close', callback)

连接关闭事件

```tsx
connection.on('close', (code, reason) => {
  console.log('WebSocket已关闭:', code, reason)
})
```

#### on('error', callback)

错误事件

```tsx
connection.on('error', (error) => {
  console.error('WebSocket错误:', error)
})
```

#### on('message', callback)

消息事件

```tsx
connection.on('message', (data) => {
  console.log('收到消息:', data)
})
```

## 注意事项

- WebSocket需要服务器支持
- 在组件卸载时记得断开连接，避免内存泄漏
- 自动重连功能会在连接断开时自动尝试重连
- 建议使用唯一的topic来区分不同类型的数据
- 对于大量数据，考虑使用二进制格式以提高性能
- 在生产环境中，建议添加心跳检测机制