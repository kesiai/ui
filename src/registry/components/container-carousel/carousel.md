# Carousel 轮播容器组件

## 简介

`Carousel` 是一个轮播容器组件，用于循环展示多个内容区域。

- **自动播放**：支持自动轮播，可自定义播放速度
- **双向轮播**：支持正序和倒序两种轮播方向
- **灵活布局**：支持水平和垂直两种布局方向
- **触摸支持**：支持鼠标拖拽和触摸滑动
- **平滑过渡**：可自定义切换速度和过渡效果
- **导航控制**：支持箭头导航和圆点指示器
- **范围过滤**：支持只显示指定范围的内容

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `autoplay` | `boolean` | 否 | `false` | 自动滚动 |
| `autoplaySpeed` | `number` | 否 | `3` | 停留时间（秒） |
| `speed` | `number` | 否 | `0.5` | 切换速度（秒） |
| `cssEase` | `string` | 否 | `'ease'` | 轮播过渡（'ease' 或 'linear'） |
| `hideDots` | `boolean` | 否 | `false` | 隐藏导航点 |
| `vertical` | `'horizontal' \| 'vertical'` | 否 | `'horizontal'` | 轮播方向 |
| `rtl` | `'sequence' \| 'flashback'` | 否 | `'sequence'` | 轮播顺序（正序或倒序） |
| `arrows` | `boolean` | 否 | `false` | 隐藏箭头 |
| `draggable` | `boolean` | 否 | `true` | 允许拖拽翻页 |
| `range` | `{ start?: number; end?: number }` | 否 | - | 显示范围（从第几个到第几个，从 1 开始） |
| `doEvents` | `(event: string) => void` | 否 | - | 事件回调 |
| `children` | `ReactNode` | 否 | - | 子组件 |
| `className` | `string` | 否 | - | 自定义类名 |
| `style` | `CSSProperties` | 否 | - | 自定义样式 |

## 基本用法

### 1. 基础轮播

最简单的使用方式，创建三个轮播页：

```tsx
import { Carousel } from '@/registry/components/container-carousel/carousel'

function App() {
  return (
    <Carousel>
      <div className="flex items-center justify-center h-full bg-blue-500 text-white">
        <p>第一页</p>
      </div>
      <div className="flex items-center justify-center h-full bg-green-500 text-white">
        <p>第二页</p>
      </div>
      <div className="flex items-center justify-center h-full bg-purple-500 text-white">
        <p>第三页</p>
      </div>
    </Carousel>
  )
}
```

### 2. 自动播放

启用自动轮播，设置停留时间：

```tsx
<Carousel
  autoplay={true}
  autoplaySpeed={5}
>
  <div>页面 1</div>
  <div>页面 2</div>
  <div>页面 3</div>
</Carousel>
```

### 3. 垂直轮播

设置轮播方向为垂直：

```tsx
<Carousel
  vertical="vertical"
  autoplay={true}
  autoplaySpeed={3}
>
  <div>垂直轮播 1</div>
  <div>垂直轮播 2</div>
  <div>垂直轮播 3</div>
</Carousel>
```

### 4. 隐藏导航元素

隐藏箭头和圆点：

```tsx
<Carousel
  arrows={true}
  hideDots={true}
>
  <div>页面 1</div>
  <div>页面 2</div>
  <div>页面 3</div>
</Carousel>
```

## 完整示例

### 图片轮播

```tsx
import { Carousel } from '@/registry/components/container-carousel/carousel'

function ImageCarousel() {
  const images = [
    {
      url: '/images/slide1.jpg',
      title: '图片 1',
      description: '这是第一张图片的描述'
    },
    {
      url: '/images/slide2.jpg',
      title: '图片 2',
      description: '这是第二张图片的描述'
    },
    {
      url: '/images/slide3.jpg',
      title: '图片 3',
      description: '这是第三张图片的描述'
    }
  ]

  return (
    <Carousel
      autoplay={true}
      autoplaySpeed={4}
      speed={0.8}
      className="h-96"
    >
      {images.map((image, index) => (
        <div key={index} className="relative h-full">
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-6">
            <h3 className="text-white text-2xl font-bold mb-2">
              {image.title}
            </h3>
            <p className="text-white/90">{image.description}</p>
          </div>
        </div>
      ))}
    </Carousel>
  )
}
```

### 产品展示轮播

```tsx
import { Carousel } from '@/registry/components/container-carousel/carousel'

function ProductCarousel() {
  const products = [
    {
      name: '产品 A',
      price: '¥299',
      features: ['功能 1', '功能 2', '功能 3']
    },
    {
      name: '产品 B',
      price: '¥399',
      features: ['功能 1', '功能 2', '功能 3', '功能 4']
    },
    {
      name: '产品 C',
      price: '¥499',
      features: ['功能 1', '功能 2', '功能 3', '功能 4', '功能 5']
    }
  ]

  return (
    <Carousel
      autoplay={true}
      autoplaySpeed={5}
      cssEase="ease"
      className="h-125"
    >
      {products.map((product, index) => (
        <div key={index} className="h-full p-8">
          <div className="bg-white rounded-2xl shadow-xl h-full p-8 flex flex-col items-center justify-center">
            <div className="w-32 h-32 bg-linear-to-br from-blue-400 to-purple-600 rounded-full mb-6"></div>
            <h3 className="text-3xl font-bold mb-2">{product.name}</h3>
            <p className="text-4xl font-bold text-blue-600 mb-6">{product.price}</p>
            <ul className="text-center space-y-2 mb-8">
              {product.features.map((feature, i) => (
                <li key={i} className="text-slate-600">
                  ✓ {feature}
                </li>
              ))}
            </ul>
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              立即购买
            </button>
          </div>
        </div>
      ))}
    </Carousel>
  )
}
```

### 数据卡片轮播

```tsx
import { Carousel } from '@/registry/components/container-carousel/carousel'

function DataCardCarousel() {
  const stats = [
    {
      title: '总用户数',
      value: '10,234',
      change: '+12.5%',
      trend: 'up',
      color: 'blue'
    },
    {
      title: '活跃用户',
      value: '8,567',
      change: '+8.3%',
      trend: 'up',
      color: 'green'
    },
    {
      title: '转化率',
      value: '3.2%',
      change: '-2.1%',
      trend: 'down',
      color: 'red'
    },
    {
      title: '总收入',
      value: '¥1.2M',
      change: '+15.7%',
      trend: 'up',
      color: 'purple'
    }
  ]

  return (
    <Carousel
      autoplay={true}
      autoplaySpeed={3}
      speed={0.5}
      className="h-64"
    >
      {stats.map((stat, index) => (
        <div key={index} className="h-full p-4">
          <div className={`bg-linear-to-br from-${stat.color}-400 to-${stat.color}-600 rounded-xl p-6 h-full flex flex-col justify-center text-white`}>
            <h3 className="text-lg font-medium mb-2 opacity-90">{stat.title}</h3>
            <p className="text-5xl font-bold mb-2">{stat.value}</p>
            <p className={`text-sm ${stat.trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
              {stat.change} 较上月
            </p>
          </div>
        </div>
      ))}
    </Carousel>
  )
}
```

### 垂直轮播示例

```tsx
import { Carousel } from '@/registry/components/container-carousel/carousel'

function VerticalCarousel() {
  const notices = [
    {
      title: '系统通知',
      content: '系统将于今晚 22:00 进行维护，预计耗时 2 小时',
      time: '2024-01-01 10:00'
    },
    {
      title: '功能更新',
      content: '新增数据导出功能，支持 Excel 和 CSV 格式',
      time: '2024-01-02 14:30'
    },
    {
      title: '安全提示',
      content: '请定期更换密码，保护账户安全',
      time: '2024-01-03 09:15'
    }
  ]

  return (
    <div className="h-80">
      <Carousel
        vertical="vertical"
        autoplay={true}
        autoplaySpeed={4}
        hideDots={false}
        className="h-full"
      >
        {notices.map((notice, index) => (
          <div key={index} className="h-full p-6">
            <div className="bg-white rounded-lg shadow-md h-full p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">
                  {notice.title}
                </h3>
                <span className="text-sm text-slate-500">{notice.time}</span>
              </div>
              <p className="text-slate-600 flex-1">{notice.content}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  )
}
```

### 范围过滤示例

```tsx
import { Carousel } from '@/registry/components/container-carousel/carousel'

function RangeCarousel() {
  const items = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `项目 ${i + 1}`,
    description: `这是第 ${i + 1} 个项目的描述`
  }))

  // 只显示第 3-7 项
  return (
    <Carousel
      range={{ start: 3, end: 7 }}
      autoplay={true}
      autoplaySpeed={3}
      className="h-80"
    >
      {items.map((item) => (
        <div key={item.id} className="h-full p-4">
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-lg h-full p-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
              {item.id}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {item.title}
            </h3>
            <p className="text-slate-600">{item.description}</p>
          </div>
        </div>
      ))}
    </Carousel>
  )
}
```

### 自定义过渡效果

```tsx
import { Carousel } from '@/registry/components/container-carousel/carousel'

function CustomTransitionCarousel() {
  return (
    <Carousel
      autoplay={true}
      autoplaySpeed={3}
      speed={1.5}
      cssEase="linear"
      rtl="flashback"
      className="h-96"
    >
      <div className="flex items-center justify-center h-full bg-linear-to-br from-pink-500 to-rose-500 text-white text-3xl font-bold">
        倒序轮播 1
      </div>
      <div className="flex items-center justify-center h-full bg-linear-to-r from-amber-500 to-orange-500 text-white text-3xl font-bold">
        倒序轮播 2
      </div>
      <div className="flex items-center justify-center h-full bg-linear-to-r from-emerald-500 to-teal-500 text-white text-3xl font-bold">
        倒序轮播 3
      </div>
    </Carousel>
  )
}
```

## 注意事项

1. **容器高度**：使用垂直轮播时，建议给容器设置固定高度，以确保轮播正常显示

2. **自动播放**：启用 `autoplay` 后，轮播会自动切换。用户交互时会暂停自动播放

3. **切换速度**：`speed` 控制切换动画的时长，单位为秒，建议范围 0.1-2 秒

4. **停留时间**：`autoplaySpeed` 控制每个页面的停留时间，单位为秒，建议范围 1-10 秒

5. **范围过滤**：`range` 的 `start` 和 `end` 都是从 1 开始计数，包含边界值。例如 `{ start: 2, end: 4 }` 会显示第 2、3、4 项

6. **拖拽支持**：`draggable` 设置为 `false` 后，用户无法通过拖拽切换页面，只能通过箭头按钮

7. **导航点**：`hideDots` 控制是否显示底部的圆点导航，建议在页面较少时显示，页面较多时隐藏

8. **箭头按钮**：`arrows` 设置为 `true` 会隐藏左右箭头，适合纯自动播放的场景

9. **轮播顺序**：`rtl="flashback"` 为倒序轮播，会从最后一页开始向前轮播

10. **事件回调**：`doEvents` 会在切换时触发，传入 'beforeChange' 事件字符串，可用于跟踪用户行为

11. **垂直模式**：使用 `vertical="vertical"` 时，确保父容器有明确的高度，否则可能显示异常

12. **性能优化**：轮播页数过多时，建议使用 `range` 限制显示范围，以提高性能
