# Image 图片

## 简介

`Image` 是一个功能完善的图片展示组件，支持多种图片格式和自定义配置，适用于各种图片展示场景。

- **多格式支持**：支持常见图片格式（JPG、PNG、GIF 等）和 SVG 矢量图
- **缓存控制**：可通过添加时间戳参数避免浏览器缓存，确保显示最新图片
- **SVG 优化**：支持 SVG 内容的内联展示和等比缩放控制
- **背景定制**：支持自定义背景颜色，支持渐变效果
- **友好占位**：当图片地址为空时显示友好的占位提示

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `src` | `string` | 否 | `''` | 图片的 URL 地址，支持 http://、https:// 或相对路径 |
| `alt` | `string` | 否 | `'图片'` | 图片的替代文本，当图片无法显示时显示 |
| `addParameters` | `boolean` | 否 | `false` | 是否在 URL 后添加时间戳参数，避免浏览器缓存 |
| `preserveAspectRatio` | `boolean` | 否 | `true` | SVG 图片是否等比缩放，仅对 SVG 有效 |
| `backgroundColor` | `string` | 否 | `''` | 图片的背景颜色，支持十六进制、RGB 和渐变 |

### 图片地址格式说明

`src` 属性支持多种图片地址格式：

- **绝对路径**：`https://example.com/image.jpg` 或 `http://example.com/image.png`
- **相对路径**：`/images/logo.png` 或 `./assets/image.jpg`
- **Base64**：`data:image/png;base64,iVBORw0KGgo...`
- **SVG 文件**：`/assets/icon.svg`

### 背景颜色格式

`backgroundColor` 属性支持多种颜色格式：

- **十六进制**：`#ffffff` 或 `#fff`
- **RGB**：`rgb(255, 255, 255)`
- **RGBA**：`rgba(255, 255, 255, 0.5)`
- **渐变**：`linear-gradient(90deg, #ff0000, #0000ff)`

## 基本用法

### 1. 基础图片

最简单的图片展示，使用网络图片地址。

```tsx
import { Image } from '@/registry/components/kesi/image'

function Example() {
  return (
    <Image
      src="https://picsum.photos/400/300"
      alt="示例图片"
    />
  )
}
```

### 2. 本地图片

使用相对路径加载本地图片。

```tsx
function Example() {
  return (
    <Image
      src="/images/logo.png"
      alt="公司 Logo"
    />
  )
}
```

### 3. 带背景色的图片

为图片设置背景颜色，适用于透明图片。

```tsx
function Example() {
  return (
    <Image
      src="/images/icon.png"
      alt="图标"
      backgroundColor="#f0f0f0"
    />
  )
}
```

### 4. 渐变背景

使用渐变背景色创建特殊效果。

```tsx
function Example() {
  return (
    <Image
      src="/images/mask.png"
      alt="渐变背景图片"
      backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    />
  )
}
```

### 5. 避免缓存

使用 addParameters 属性避免浏览器缓存。

```tsx
function Example() {
  return (
    <Image
      src="https://example.com/dynamic-image.jpg"
      alt="动态图片"
      addParameters={true}
    />
  )
}
```

### 6. SVG 图片

展示 SVG 矢量图。

```tsx
function Example() {
  return (
    <Image
      src="/images/chart.svg"
      alt="图表"
      preserveAspectRatio={true}
    />
  )
}
```

### 7. 占位状态

当图片地址为空时显示占位提示。

```tsx
function Example() {
  return (
    <Image
      src=""
      alt="请上传图片"
    />
  )
}
```

## 完整示例

### 产品图片展示

创建一个产品展示卡片，包含产品图片。

```tsx
import { Image } from '@/registry/components/kesi/image'

function Example() {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ height: '300px', backgroundColor: '#f9fafb' }}>
        <Image
          src="https://picsum.photos/800/600"
          alt="产品图片"
          backgroundColor="#f9fafb"
        />
      </div>
      <div style={{ padding: '16px' }}>
        <h3>产品名称</h3>
        <p>产品描述文字</p>
      </div>
    </div>
  )
}
```

### 头像展示

创建一个圆形头像展示。

```tsx
import { Image } from '@/registry/components/kesi/image'

function Example() {
  return (
    <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden' }}>
      <Image
        src="https://picsum.photos/200/200"
        alt="用户头像"
        backgroundColor="#e5e7eb"
      />
    </div>
  )
}
```

### 动态加载图片

模拟动态加载图片的场景，使用 addParameters 避免缓存。

```tsx
import { Image } from '@/registry/components/kesi/image'
import { useState } from 'react'

function Example() {
  const [imageVersion, setImageVersion] = useState(1)

  const refreshImage = () => {
    setImageVersion(prev => prev + 1)
  }

  return (
    <div>
      <div style={{ height: '300px', marginBottom: '16px' }}>
        <Image
          src={`https://picsum.photos/800/600?v=${imageVersion}`}
          alt="随机图片"
          addParameters={true}
        />
      </div>
      <button onClick={refreshImage}>
        刷新图片
      </button>
    </div>
  )
}
```

### 图标展示

展示多个 SVG 图标，带背景色。

```tsx
import { Image } from '@/registry/components/kesi/image'

function Example() {
  const icons = [
    { name: '首页', src: '/icons/home.svg', color: '#3b82f6' },
    { name: '设置', src: '/icons/settings.svg', color: '#10b981' },
    { name: '用户', src: '/icons/user.svg', color: '#f59e0b' },
  ]

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {icons.map(icon => (
        <div
          key={icon.name}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <Image
            src={icon.src}
            alt={icon.name}
            backgroundColor={icon.color}
            preserveAspectRatio={true}
          />
        </div>
      ))}
    </div>
  )
}
```

### 图片画廊

创建一个图片画廊展示。

```tsx
import { Image } from '@/registry/components/kesi/image'

function Example() {
  const images = [
    'https://picsum.photos/400/300?random=1',
    'https://picsum.photos/400/300?random=2',
    'https://picsum.photos/400/300?random=3',
    'https://picsum.photos/400/300?random=4',
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
      {images.map((src, index) => (
        <div
          key={index}
          style={{
            aspectRatio: '4/3',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb'
          }}
        >
          <Image
            src={src}
            alt={`图片 ${index + 1}`}
            backgroundColor="#f3f4f6"
          />
        </div>
      ))}
    </div>
  )
}
```

### 空状态占位

展示图片未上传时的空状态。

```tsx
import { Image } from '@/registry/components/kesi/image'

function Example() {
  return (
    <div style={{ width: '100%', height: '200px' }}>
      <Image
        src=""
        alt="暂无图片"
        backgroundColor="#f9fafb"
      />
    </div>
  )
}
```

## 注意事项

1. **图片尺寸**：组件默认使用 `object-fit: contain` 保持图片比例，图片会完整显示在容器中。如果需要填满容器，可以通过自定义 style 覆盖此属性。

2. **缓存问题**：当图片 URL 不变但内容更新时（如动态生成的图片），建议启用 `addParameters` 属性，通过添加时间戳参数强制浏览器重新加载图片。

3. **SVG 处理**：组件会自动检测 `.svg` 扩展名，对于 SVG 图片：
   - 如果设置了 `svgContent` 属性，会将 SVG 内容作为 HTML 内联渲染
   - `preserveAspectRatio` 属性仅对 SVG 有效，控制是否保持宽高比

4. **背景颜色优先级**：`backgroundColor` 会应用在图片容器的背景上，对于透明图片（如 PNG、SVG），背景色会透过透明区域显示。

5. **图片占位**：当 `src` 为空字符串或未设置时，组件会显示一个虚线边框的占位区域，提示"请上传图片"。

6. **性能优化**：
   - 避免在 `addParameters` 模式下频繁更新图片 URL，会导致每次都重新请求图片
   - 对于大量图片展示，建议使用懒加载技术（可通过自定义 className 实现）

7. **可访问性**：务必为图片设置有意义的 `alt` 文本，这不仅有助于屏幕阅读器用户，也在图片加载失败时提供替代信息。

8. **图片拖拽**：组件默认禁用了图片的拖拽和选择功能（`userSelect: none` 和 `draggable: false`），如需启用，可通过 style 或 className 覆盖。
