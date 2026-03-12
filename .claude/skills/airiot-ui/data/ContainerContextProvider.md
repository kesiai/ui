## ContainerContextProvider - 上下文提供者容器

### 导入路径
```tsx
import { ContainerContextProvider } from '@/components/airiot/container-context-provider/container-context-provider'
```

### 基础用法
```tsx
import { ContainerContextProvider,useContextProvider } from '@/components/airiot/container-context-provider/container-context-provider'

function App() {
  const contextValue = {
    user: { name: '张三', role: 'admin' },
    theme: 'dark',
    language: 'zh-CN'
  }

  const Name = () => {
    const context = useContextProvider()
    return <div>用户: {context.user.name}</div>
  }

  return (
    <ContainerContextProvider value={contextValue}>
      <Name />
    </ContainerContextProvider>
  )
}
```

### Props
| 属性     | 类型      | 默认值 | 说明     |
| -------- | --------- | ------ | -------- |
| value    | any       | -      | 上下文值 |
| children | ReactNode | -      | 子组件   |

### 示例
```tsx
import { ContainerContextProvider,useContextProvider } from '@/components/airiot/container-context-provider/container-context-provider'
import { Button } from '@/components/airiot/button/button'
import { Text } from '@/components/airiot/text/text'
function UserProvider() {
  const appContext = {
    user: { id: 1, name: '张三' },
    permissions: ['read', 'write']
  }
  const Name = () => {
    const context = useContextProvider()
    return <div>用户: {context.user.name}</div>
  }
  return (
    <ContainerContextProvider value={appContext}>
      <div>
        <Text>当前用户: <Name /></Text>
        <Button onClick={() => console.log(appContext)}>
          打印上下文
        </Button>
      </div>
    </ContainerContextProvider>
  )
}
```

### 注意事项
- 适合跨组件共享状态
- 避免过度使用，防止上下文污染
- 建议将相关状态组织在一起