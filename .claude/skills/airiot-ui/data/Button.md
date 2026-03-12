# Button 按钮

## 导入路径

```tsx
import { Button } from '@/components/airiot/button/button'
```

## 基础用法

```tsx
import { Button } from '@/components/airiot/button/button'

function MyComponent() {
  return (
    <Button onClick={() => console.log('Clicked')}>
      点击我
    </Button>
  )
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'default' \| 'primary' \| 'secondary' \| 'ghost' \| 'destructive' | 'default' | 按钮样式 |
| size | 'sm' \| 'md' \| 'lg' | 'md' | 按钮大小 |
| disabled | boolean | false | 是否禁用 |
| loading | boolean | false | 是否加载中 |
| onClick | () => void | - | 点击事件 |

## 示例

### 不同样式的按钮

```tsx
import { Button } from '@/components/airiot/button/button'

function ButtonVariants() {
  return (
    <div className="space-x-4">
      <Button variant="default">默认</Button>
      <Button variant="primary">主要</Button>
      <Button variant="secondary">次要</Button>
      <Button variant="ghost">幽灵</Button>
      <Button variant="destructive">危险</Button>
    </div>
  )
}
```

### 不同大小的按钮

```tsx
import { Button } from '@/components/airiot/button/button'

function ButtonSizes() {
  return (
    <div className="space-x-4">
      <Button size="sm">小号</Button>
      <Button size="md">中号</Button>
      <Button size="lg">大号</Button>
    </div>
  )
}
```

### 带加载状态的按钮

```tsx
import { Button } from '@/components/airiot/button/button'
import { useState } from 'react'

function LoadingButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  return (
    <Button loading={loading} onClick={handleClick}>
      {loading ? '加载中...' : '提交'}
    </Button>
  )
}
```