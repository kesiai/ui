# QRCode 二维码

## 简介

`QRCode` 是一个基于 canvas 的二维码生成组件，可以将文本、URL 等内容转换为二维码图片。

- **简单易用**：只需提供内容即可生成二维码
- **高度可定制**：支持自定义尺寸、边距、颜色
- **Canvas 渲染**：基于 canvas 渲染，性能优异
- **自动容错**：内置容错处理，确保可扫描性
- **响应式**：支持动态更新内容

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `content` | `string` | 是 | - | 二维码内容（文本或 URL） |
| `width` | `number` | 否 | `200` | 二维码宽度（像素） |
| `margin` | `number` | 否 | `1` | 二维码边距（格子数） |
| `darkColor` | `string` | 否 | `'#000000'` | 前景色（二维码颜色） |
| `lightColor` | `string` | 否 | `'#ffffff'` | 背景色 |
| `cellKey` | `string` | 是 | - | 唯一标识符，用于生成 canvas ID |

## 基本用法

### 1. 基本 URL 二维码

生成一个简单的 URL 二维码。

```tsx
import QRCodeComp from '@/components/airiot/qrcode'

function Example() {
  return (
    <QRCodeComp
      content="https://example.com"
      cellKey="url-qr"
    />
  )
}
```

### 2. 文本内容二维码

将文本内容转换为二维码。

```tsx
function Example() {
  return (
    <QRCodeComp
      content="Hello, World!"
      cellKey="text-qr"
    />
  )
}
```

### 3. 自定义尺寸和边距

调整二维码的大小和边距。

```tsx
function Example() {
  return (
    <QRCodeComp
      content="https://example.com"
      width={300}
      margin={2}
      cellKey="custom-qr"
    />
  )
}
```

### 4. 自定义颜色

使用自定义的前景色和背景色。

```tsx
function Example() {
  return (
    <QRCodeComp
      content="https://example.com"
      darkColor="#3b82f6"
      lightColor="#f0f9ff"
      cellKey="colored-qr"
    />
  )
}
```

### 5. 动态内容

根据用户输入动态生成二维码。

```tsx
import { useState } from 'react'

function Example() {
  const [text, setText] = useState('')

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入内容生成二维码"
        className="border p-2 rounded"
      />
      {text && (
        <QRCodeComp
          content={text}
          cellKey="dynamic-qr"
        />
      )}
    </div>
  )
}
```

### 6. 下载二维码

提供下载功能。

```tsx
import { useRef } from 'react'

function Example() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'qrcode.png'
      link.href = url
      link.click()
    }
  }

  return (
    <div>
      <QRCodeComp
        content="https://example.com"
        cellKey="download-qr"
      />
      <button onClick={handleDownload}>下载二维码</button>
    </div>
  )
}
```

### 7. 二维码卡片

创建一个带标题的二维码卡片。

```tsx
function Example() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h3 className="text-lg font-semibold mb-4">扫描访问网站</h3>
      <div className="flex justify-center mb-4">
        <QRCodeComp
          content="https://example.com"
          width={250}
          cellKey="card-qr"
        />
      </div>
      <p className="text-sm text-gray-600">使用手机扫描二维码</p>
    </div>
  )
}
```

## 完整示例

### 联系方式二维码

生成包含联系方式的二维码。

```tsx
import QRCodeComp from '@/components/airiot/qrcode'

function ContactQRCode() {
  const contactInfo = `
BEGIN:VCARD
VERSION:3.0
FN:张三
ORG:示例公司
TEL:13800138000
EMAIL:zhangsan@example.com
END:VCARD
  `.trim()

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">联系方式</h3>
      <div className="flex justify-center">
        <QRCodeComp
          content={contactInfo}
          width={200}
          darkColor="#1f2937"
          lightColor="#f9fafb"
          cellKey="contact-qr"
        />
      </div>
    </div>
  )
}
```

### WiFi 配置二维码

生成 WiFi 连接配置二维码。

```tsx
function WiFiQRCode() {
  const generateWiFiString = (ssid: string, password: string, security: 'WPA' | 'WEP' | 'nopass') => {
    return `WIFI:T:${security};S:${ssid};P:${password};;`
  }

  const wifiConfig = generateWiFiString('MyNetwork', 'password123', 'WPA')

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">扫描连接 WiFi</h3>
      <p className="text-sm text-gray-600 mb-4">SSID: MyNetwork</p>
      <div className="flex justify-center">
        <QRCodeComp
          content={wifiConfig}
          width={250}
          darkColor="#3b82f6"
          lightColor="#eff6ff"
          cellKey="wifi-qr"
        />
      </div>
    </div>
  )
}
```

## 注意事项

1. **内容长度**：内容越长，二维码越复杂，建议控制在合理范围内。
2. **尺寸选择**：宽度建议至少 200px，确保扫描设备能够识别。
3. **颜色对比**：确保前景色和背景色有足够对比度，否则可能影响扫描。
4. **cellKey 唯一性**：同一页面多个二维码时，确保 cellKey 唯一。
5. **容错率**：组件使用默认容错率，适合大多数场景。
6. **浏览器兼容**：依赖 canvas，确保目标浏览器支持。
