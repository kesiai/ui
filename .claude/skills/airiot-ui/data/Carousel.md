# Carousel 轮播图

## 导入路径

```tsx
import { Carousel } from '@/components/airiot/container-carousel/container-carousel'
```

## 基础用法

```tsx
import { Carousel } from '@/components/airiot/container-carousel/container-carousel'

function CarouselExample() {
  return (
    <Carousel
      autoplay={true}
      autoplaySpeed={3}
      speed={0.5}
      hideDots={false}
      arrows={true}
      draggable={true}
    >
      <div>第一页内容</div>
      <div>第二页内容</div>
      <div>第三页内容</div>
    </Carousel>
  )
}
```

## Props

- `autoplay` - 是否自动播放 (默认: false)
- `autoplaySpeed` - 自动播放间隔，秒 (默认: 3)
- `speed` - 切换速度，秒 (默认: 0.5)
- `hideDots` - 隐藏指示器 (默认: false)
- `arrows` - 显示箭头 (默认: true)
- `draggable` - 可拖拽 (默认: true)
- `vertical` - 垂直方向 ('horizontal', 'vertical')
- `cssEase` - 切换动画效果

## 示例

### 垂直轮播

```tsx
<Carousel
  autoplay={true}
  autoplaySpeed={2}
  vertical="vertical"
  hideDots={false}
  arrows={false}
>
  <div style={{ height: '300px' }}>内容1</div>
  <div style={{ height: '300px' }}>内容2</div>
  <div style={{ height: '300px' }}>内容3</div>
</Carousel>
```

## 注意事项
- 轮播图使用embla-carousel库
- 支持垂直和水平方向
- 可以配置自动播放和拖拽