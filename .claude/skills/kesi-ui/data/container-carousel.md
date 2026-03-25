# Carousel 轮播容器

## 简介

`Carousel` 是一个功能强大的轮播容器组件，支持自动播放、手动切换、垂直/水平方向等多种轮播模式。

- **自动播放**：支持自动轮播，可配置停留时间
- **灵活切换**：支持点击箭头、拖拽、点击导航点等多种切换方式
- **双向滚动**：支持正序和倒序轮播
- **方向可选**：支持水平和垂直两种轮播方向
- **自定义动画**：可配置切换速度和过渡效果

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `autoplay` | `boolean` | 否 | `false` | 开启滚动，轮播容器内容会自动滚动 |
| `autoplaySpeed` | `number` | 否 | `3` | 轮播容器开启自动滚动后，每一个轮播页面的停留时长（秒） |
| `speed` | `number` | 否 | `0.5` | 轮播容器内内容轮播切换的时长（秒） |
| `hideDots` | `boolean` | 否 | `false` | 隐藏轮播容器播放时的导航点 |
| `arrows` | `boolean` | 否 | `false` | 隐藏轮播容器左右两侧的箭头 |
| `draggable` | `boolean` | 否 | `true` | 允许通过鼠标在轮播容器上方拖拽的形式翻页 |
| `vertical` | `'horizontal' \| 'vertical'` | 否 | `'horizontal'` | 轮播容器轮播页滚动的方向 |
| `rtl` | `'sequence' \| 'flashback'` | 否 | `'sequence'` | 轮播容器轮播页滚动的顺序 |
| `cssEase` | `'ease' \| 'linear'` | 否 | `'ease'` | 设置轮播容器内组件轮播的过渡方式 |
| `range` | `{ start?: number; end?: number }` | 否 | `undefined` | 限制轮播显示的子元素范围（从1开始计数） |
| `doEvents` | `(event: string) => void` | 否 | - | 事件回调函数，`beforeChange` 事件在切换前触发 |

## 基本用法

### 1. 基础轮播

最简单的轮播容器，包含多个子元素。

```tsx
import { Carousel } from '@/components/kesi/container-carousel'

function Example() {
  return (
    <Carousel>
      <div className="flex items-center justify-center h-full bg-blue-500 text-white">
        第一页
      </div>
      <div className="flex items-center justify-center h-full bg-purple-500 text-white">
        第二页
      </div>
      <div className="flex items-center justify-center h-full bg-pink-500 text-white">
        第三页
      </div>
    </Carousel>
  )
}
```

### 2. 自动播放轮播

开启自动播放，设置停留时间。

```tsx
function Example() {
  return (
    <Carousel
      autoplay={true}
      autoplaySpeed={5}
    >
      <div>第一页</div>
      <div>第二页</div>
      <div>第三页</div>
    </Carousel>
  )
}
```

### 3. 垂直轮播

切换为垂直方向轮播。

```tsx
function Example() {
  return (
    <Carousel
      vertical="vertical"
      autoplay={true}
      autoplaySpeed={3}
    >
      <div>第一页</div>
      <div>第二页</div>
      <div>第三页</div>
    </Carousel>
  )
}
```

### 4. 自定义切换效果

配置切换速度和过渡动画。

```tsx
function Example() {
  return (
    <Carousel
      speed={1}
      cssEase="linear"
      autoplay={true}
    >
      <div>第一页</div>
      <div>第二页</div>
      <div>第三页</div>
    </Carousel>
  )
}
```

### 5. 倒序轮播

从最后一页开始倒序轮播。

```tsx
function Example() {
  return (
    <Carousel
      rtl="flashback"
      autoplay={true}
    >
      <div>第一页</div>
      <div>第二页</div>
      <div>第三页</div>
    </Carousel>
  )
}
```

### 6. 隐藏导航元素

隐藏导航点和箭头。

```tsx
function Example() {
  return (
    <Carousel
      hideDots={true}
      arrows={true}
    >
      <div>第一页</div>
      <div>第二页</div>
      <div>第三页</div>
    </Carousel>
  )
}
```

### 7. 限制显示范围

只显示特定范围的子元素。

```tsx
function Example() {
  return (
    <Carousel
      range={{ start: 2, end: 4 }}
    >
      <div>第一页（不显示）</div>
      <div>第二页</div>
      <div>第三页</div>
      <div>第四页</div>
      <div>第五页（不显示）</div>
    </Carousel>
  )
}
```

## 完整示例

### 图片轮播展示

创建一个完整的图片轮播展示组件。

```tsx
import { Carousel } from '@/components/kesi/container-carousel'
import { cn } from '@/lib/utils'

function ImageCarousel() {
  const slides = [
    {
      id: 1,
      title: '美丽风景 1',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      description: '壮丽的山川河流'
    },
    {
      id: 2,
      title: '美丽风景 2',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      description: '宁静的自然风光'
    },
    {
      id: 3,
      title: '美丽风景 3',
      image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
      description: '清新的森林气息'
    }
  ]

  return (
    <Carousel
      autoplay={true}
      autoplaySpeed={4}
      speed={0.8}
      className="h-full"
    >
      {slides.map((slide) => (
        <div
          key={slide.id}
          className="relative h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl">{slide.description}</p>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  )
}
```

### 产品展示轮播

创建一个产品展示的轮播组件。

```tsx
import { Carousel } from '@/components/kesi/container-carousel'
import { Button } from '@/components/kesi/button/button'

function ProductCarousel() {
  const products = [
    {
      id: 1,
      name: '产品 A',
      price: '¥299',
      features: ['功能 1', '功能 2', '功能 3']
    },
    {
      id: 2,
      name: '产品 B',
      price: '¥399',
      features: ['功能 1', '功能 2', '功能 3', '功能 4']
    },
    {
      id: 3,
      name: '产品 C',
      price: '¥499',
      features: ['功能 1', '功能 2', '功能 3', '功能 4', '功能 5']
    }
  ]

  return (
    <div className="p-8">
      <Carousel
        autoplay={true}
        autoplaySpeed={5}
        className="h-96"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8"
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {product.name}
              </h3>
              <p className="text-4xl font-bold text-blue-600 mb-6">
                {product.price}
              </p>
              <ul className="text-gray-600 mb-8 space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
              <Button>立即购买</Button>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}
```

## 注意事项

1. **容器高度**：轮播容器需要明确的高度才能正常显示，建议通过 `className` 或 `style` 设置高度。

2. **子元素数量**：至少需要两个子元素才能实现轮播效果，如果子元素为空会显示提示信息。

3. **垂直模式**：使用垂直轮播时，确保父容器有足够的高度空间。

4. **自动播放**：自动播放会在用户手动操作后继续执行，如需用户操作后停止，需要自行实现控制逻辑。

5. **range 参数**：`range.start` 和 `range.end` 都是从 1 开始计数，不是从 0 开始。

6. **事件处理**：`doEvents` 回调中的 `beforeChange` 事件在每次切换前触发，可用于记录用户行为或执行自定义逻辑。

7. **性能优化**：如果子元素包含大量数据或复杂组件，建议使用懒加载或虚拟滚动优化性能。
