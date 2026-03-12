# Image 图片

## 导入路径

```tsx
import { Image } from '@/components/airiot/image'
```

## 基础用法

```tsx
import { Image } from '@/components/airiot/image'

function MyComponent() {
  return (
    <Image
      src="/path/to/image.jpg"
      alt="示例图片"
      width={300}
      height={200}
    />
  )
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | string | - | 图片地址 |
| alt | string | - | 替代文本 |
| width | number \| string | - | 图片宽度 |
| height | number \| string | - | 图片高度 |
| rounded | boolean | false | 是否圆角 |
| objectFit | 'contain' \| 'cover' \| 'fill' | 'cover' | 图片填充方式 |
| lazy | boolean | true | 是否懒加载 |

## 示例

### 基础图片

```tsx
import { Image } from '@/components/airiot/image'

function BasicImage() {
  return (
    <Image
      src="https://example.com/image.jpg"
      alt="示例图片"
      width={300}
      height={200}
    />
  )
}
```

### 圆角图片

```tsx
import { Image } from '@/components/airiot/image'

function RoundedImage() {
  return (
    <Image
      src="https://example.com/image.jpg"
      alt="圆角图片"
      width={200}
      height={200}
      rounded
    />
  )
}
```

### 不同填充方式

```tsx
import { Image } from '@/components/airiot/image'

function ImageFit() {
  return (
    <div className="space-y-4">
      <div className="w-48 h-32 border">
        <Image
          src="https://example.com/image.jpg"
          alt="contain"
          width="100%"
          height="100%"
          objectFit="contain"
        />
      </div>
      <div className="w-48 h-32 border">
        <Image
          src="https://example.com/image.jpg"
          alt="cover"
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </div>
      <div className="w-48 h-32 border">
        <Image
          src="https://example.com/image.jpg"
          alt="fill"
          width="100%"
          height="100%"
          objectFit="fill"
        />
      </div>
    </div>
  )
}
```

### 响应式图片

```tsx
import { Image } from '@/components/airiot/image'

function ResponsiveImage() {
  return (
    <div className="max-w-full">
      <Image
        src="https://example.com/image.jpg"
        alt="响应式图片"
        width="100%"
        height="auto"
      />
    </div>
  )
}
```