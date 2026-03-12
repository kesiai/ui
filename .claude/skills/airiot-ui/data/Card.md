# Card 卡片容器

## 导入路径

```tsx
import { Card } from '@/components/airiot/container-card/container-card'
```

## 基础用法

```tsx
import { Card } from '@/components/airiot/container-card/container-card'

function CardExample() {
  return (
    <Card
      cardTitle="卡片标题"
      cardBordered={true}
      cardPadding={24}
    >
      {/* 卡片内容 */}
    </Card>
  )
}
```

## Props

- `cardTitle` - 卡片标题
- `cardBordered` - 是否有边框 (默认: true)
- `cardPadding` - 边距，单位像素 (默认: 24)

## 示例

### 自定义标题和边框

```tsx
<Card
  cardTitle="自定义标题"
  cardBordered={false}
  cardPadding={32}
>
  内容区域
</Card>
```

## 注意事项
- 卡片会自动计算内容区域高度，减去标题高度
- 支持字符串或对象类型的标题