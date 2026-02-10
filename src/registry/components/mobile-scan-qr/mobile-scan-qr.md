# MobileScanQR 二维码扫描

## 简介

`MobileScanQR` 是一个移动端二维码扫描组件，使用摄像头扫描二维码并解析内容。

- **摄像头调用**：自动调用设备摄像头进行扫描
- **实时识别**：使用 jsQR 库实时识别二维码
- **URL 处理**：自动识别并跳转 URL 链接
- **扫描动画**：带有扫描线动画效果
- **结果回调**：支持扫描成功后的回调处理

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `text` | `string` | 否 | `'扫描二维码'` | 按钮文字 |
| `onSuccess` | `(data: string) => void` | 否 | - | 二维码扫描成功回调 |
| `onChange` | `(value: string) => void` | 否 | - | 值变化回调 |
| `onRoute` | `(url: string) => void` | 否 | - | 扫描二维码 url 跳转事件（非 URL 时触发） |

## 基本用法

### 1. 基础扫描

最简单的二维码扫描。

```tsx
import { MobileScanQR } from '@/registry/components/mobile-scan-qr'

function Example() {
  return (
    <MobileScanQR
      text="扫描二维码"
    />
  )
}
```

### 2. 监听扫描结果

获取扫描成功的内容。

```tsx
function Example() {
  const handleSuccess = (data) => {
    console.log('扫描结果:', data)
    alert(`扫描成功: ${data}`)
  }

  return (
    <MobileScanQR
      text="扫描二维码"
      onSuccess={handleSuccess}
    />
  )
}
```

### 3. 自定义按钮文字

修改触发按钮的文字。

```tsx
function Example() {
  return (
    <MobileScanQR
      text="扫一扫"
    />
  )
}
```

### 4. 处理非 URL 内容

处理扫描到的非 URL 内容。

```tsx
function Example() {
  const handleRoute = (content) => {
    console.log('非 URL 内容:', content)
    // 处理文本内容，如显示、保存等
  }

  return (
    <MobileScanQR
      text="扫描"
      onRoute={handleRoute}
    />
  )
}
```

### 5. 完整事件处理

同时处理所有事件。

```tsx
function Example() {
  const handleChange = (data) => {
    console.log('值变化:', data)
  }

  const handleSuccess = (data) => {
    console.log('扫描成功:', data)
  }

  const handleRoute = (content) => {
    console.log('路由处理:', content)
  }

  return (
    <MobileScanQR
      text="扫描二维码"
      onChange={handleChange}
      onSuccess={handleSuccess}
      onRoute={handleRoute}
    />
  )
}
```

## 完整示例

### 扫码登录

创建一个扫码登录功能。

```tsx
import { MobileScanQR } from '@/registry/components/mobile-scan-qr'
import { useState } from 'react'
import { Button } from '@/registry/components/button/button'

function QRCodeLogin() {
  const [scanResult, setScanResult] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleSuccess = (data) => {
    setScanResult(data)
    // 模拟登录验证
    if (data.includes('login:')) {
      const token = data.replace('login:', '')
      console.log('登录 token:', token)
      setIsLoggedIn(true)
    }
  }

  if (isLoggedIn) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          登录成功
        </h2>
        <p>欢迎回来！</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">扫码登录</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm">
            请使用其他设备扫描下方二维码进行登录
          </p>
        </div>

        <MobileScanQR
          text="扫描二维码"
          onSuccess={handleSuccess}
        />

        {scanResult && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm">
              扫描结果: {scanResult}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
```

### 扫码添加商品

扫描商品二维码添加到购物车。

```tsx
import { MobileScanQR } from '@/registry/components/mobile-scan-qr'
import { useState } from 'react'

function ProductScanner() {
  const [cart, setCart] = useState([])
  const [lastScanned, setLastScanned] = useState('')

  const handleSuccess = (data) => {
    setLastScanned(data)
    
    // 模拟解析商品码
    if (data.startsWith('PRODUCT:')) {
      const productId = data.replace('PRODUCT:', '')
      const product = {
        id: productId,
        name: `商品 ${productId}`,
        price: Math.floor(Math.random() * 100) + 10
      }
      setCart([...cart, product])
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">扫码添加商品</h2>
      
      <div className="space-y-4">
        <MobileScanQR
          text="扫描商品码"
          onSuccess={handleSuccess}
        />

        {lastScanned && (
          <div className="p-3 bg-green-50 rounded text-sm">
            ✓ 已扫描: {lastScanned}
          </div>
        )}

        {cart.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">购物车 ({cart.length})</h3>
            {cart.map((item, index) => (
              <div key={index} className="p-3 bg-white border rounded">
                <div className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="font-medium">¥{item.price}</span>
                </div>
              </div>
            ))}
            <div className="p-3 bg-blue-50 rounded font-medium">
              总计: ¥{cart.reduce((sum, item) => sum + item.price, 0)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

### 扫码签到

扫描二维码进行签到。

```tsx
import { MobileScanQR } from '@/registry/components/mobile-scan-qr'
import { useState } from 'react'

function CheckInScanner() {
  const [checkIns, setCheckIns] = useState([])
  const [message, setMessage] = useState('')

  const handleSuccess = (data) => {
    // 验证签到码
    if (data.startsWith('CHECKIN:')) {
      const location = data.replace('CHECKIN:', '')
      const now = new Date().toLocaleString()
      
      const newCheckIn = {
        location,
        time: now
      }
      
      setCheckIns([newCheckIn, ...checkIns])
      setMessage(`✓ 已在 ${location} 签到成功`)
      
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage('✗ 无效的签到码')
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">扫码签到</h2>
      
      <div className="space-y-4">
        {message && (
          <div className={`
            p-3 rounded text-center
            ${message.includes('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
          `}>
            {message}
          </div>
        )}

        <MobileScanQR
          text="扫描签到码"
          onSuccess={handleSuccess}
        />

        {checkIns.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">签到记录</h3>
            {checkIns.map((checkIn, index) => (
              <div key={index} className="p-3 bg-white border rounded">
                <div className="flex justify-between">
                  <span>📍 {checkIn.location}</span>
                  <span className="text-sm text-gray-500">{checkIn.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

## 注意事项

1. **摄像头权限**：首次使用时会请求摄像头权限，用户必须授权才能使用。

2. **HTTPS 要求**：在 iOS 设备上，摄像头访问需要使用 HTTPS 协议。

3. **jsQR 依赖**：组件使用 jsQR 库进行二维码识别，会自动动态加载。

4. **环境光要求**：扫描时需要足够的光线，建议在明亮环境下使用。

5. **URL 自动跳转**：扫描到 URL 时会自动跳转，如需自定义处理使用 `onRoute`。

6. **扫描距离**：建议距离二维码 10-30 厘米，确保二维码清晰可见。

7. **兼容性**：支持现代浏览器的 `getUserMedia` API，IE 等旧浏览器不支持。

8. **错误处理**：如果设备不支持摄像头或用户拒绝权限，会显示错误提示。

9. **资源释放**：关闭扫描器时会自动释放摄像头资源。

10. **扫码频率**：组件会持续扫描，识别到二维码后自动停止并返回结果。

11. **预览模式**：在配置中可设置 `previewMode` 属性禁用实际扫描（用于演示）。
