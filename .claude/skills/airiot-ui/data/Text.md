# Text 文本

## 导入路径

```tsx
import { Text } from '@/components/airiot/text'
```

## 基础用法

```tsx
import { Text } from '@/components/airiot/text'

function MyComponent() {
  return (
    <Text>
      这是一个文本组件
    </Text>
  )
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'body' \| 'title' \| 'subtitle' \| 'caption' | 'body' | 文本样式 |
| size | 'sm' \| 'md' \| 'lg' | 'md' | 文本大小 |
| weight | 'normal' \| 'medium' \| 'bold' | 'normal' | 字重 |
| color | 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' | 'primary' | 文本颜色 |
| align | 'left' \| 'center' \| 'right' | 'left' | 对齐方式 |
| ellipsis | boolean | false | 是否省略号 |

## 示例

### 不同样式的文本

```tsx
import { Text } from '@/components/airiot/text'

function TextVariants() {
  return (
    <div className="space-y-2">
      <Text variant="title">标题文本</Text>
      <Text variant="subtitle">副标题文本</Text>
      <Text variant="body">正文文本</Text>
      <Text variant="caption">说明文本</Text>
    </div>
  )
}
```

### 不同大小的文本

```tsx
import { Text } from '@/components/airiot/text'

function TextSizes() {
  return (
    <div className="space-y-2">
      <Text size="sm">小号文本</Text>
      <Text size="md">中号文本</Text>
      <Text size="lg">大号文本</Text>
    </div>
  )
}
```

### 不同字重的文本

```tsx
import { Text } from '@/components/airiot/text'

function TextWeights() {
  return (
    <div className="space-y-2">
      <Text weight="normal">普通文本</Text>
      <Text weight="medium">中等文本</Text>
      <Text weight="bold">加粗文本</Text>
    </div>
  )
}
```

### 带颜色的文本

```tsx
import { Text } from '@/components/airiot/text'

function TextColors() {
  return (
    <div className="space-y-2">
      <Text color="primary">主要文本</Text>
      <Text color="secondary">次要文本</Text>
      <Text color="success">成功文本</Text>
      <Text color="warning">警告文本</Text>
      <Text color="error">错误文本</Text>
    </div>
  )
}
```

### 文本省略

```tsx
import { Text } from '@/components/airiot/text'

function EllipsisText() {
  return (
    <div className="w-32">
      <Text ellipsis>
        这是一段很长的文本，需要显示省略号的效果
      </Text>
    </div>
  )
}
```