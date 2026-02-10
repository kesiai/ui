# MobileLocation 定位

## 简介

`MobileLocation` 是一个基于百度地图 API 的移动端定位组件，可以获取用户当前位置的详细地址信息。

- **自动定位**：页面加载后自动获取当前位置
- **地址解析**：将经纬度转换为详细的中文地址
- **状态提示**：定位过程中显示加载动画
- **错误处理**：定位失败时显示错误信息
- **数据回调**：返回地址、经纬度等完整信息

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `ak` | `string` | 否 | `''` | 百度地图 API Key（必须配置才能使用） |
| `placeholder` | `string` | 否 | `'定位中...'` | 占位符文字 |
| `defaultValue` | `string` | 否 | `''` | 默认地址值 |
| `value` | `string` | 否 | - | 当前值（受控） |
| `onChange` | `(data: { address: string; lat: number; lng: number }) => void` | 否 | - | 值变化回调 |
| `onSuccess` | `(data: { address: string; lat: number; lng: number }) => void` | 否 | - | 定位成功回调 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `size` | `'sm' \| 'md' \| 'lg'` | 否 | `'md'` | 输入框尺寸 |

## 基本用法

### 1. 基础定位

最简单的定位组件。

```tsx
import { MobileLocation } from '@/registry/components/mobile-location'

function Example() {
  return (
    <MobileLocation
      ak="YOUR_BAIDU_MAP_AK"
    />
  )
}
```

### 2. 自定义占位符

修改占位符文字。

```tsx
function Example() {
  return (
    <MobileLocation
      ak="YOUR_BAIDU_MAP_AK"
      placeholder="正在获取您的位置..."
    />
  )
}
```

### 3. 尺寸调整

调整输入框的尺寸。

```tsx
function Example() {
  return (
    <div className="space-y-4">
      <MobileLocation
        ak="YOUR_BAIDU_MAP_AK"
        size="sm"
        placeholder="小尺寸"
      />
      <MobileLocation
        ak="YOUR_BAIDU_MAP_AK"
        size="md"
        placeholder="中等尺寸"
      />
      <MobileLocation
        ak="YOUR_BAIDU_MAP_AK"
        size="lg"
        placeholder="大尺寸"
      />
    </div>
  )
}
```

### 4. 监听定位结果

获取定位成功的地址信息。

```tsx
import { useState } from 'react'

function Example() {
  const [location, setLocation] = useState(null)

  return (
    <div>
      <MobileLocation
        ak="YOUR_BAIDU_MAP_AK"
        onSuccess={(data) => {
          setLocation(data)
          console.log('定位成功:', data)
        }}
      />
      {location && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <p><strong>地址:</strong> {location.address}</p>
          <p><strong>经度:</strong> {location.lng}</p>
          <p><strong>纬度:</strong> {location.lat}</p>
        </div>
      )}
    </div>
  )
}
```

### 5. 受控模式

完全控制定位组件的值。

```tsx
import { useState } from 'react'

function Example() {
  const [address, setAddress] = useState('')

  return (
    <div>
      <MobileLocation
        ak="YOUR_BAIDU_MAP_AK"
        value={address}
        onChange={(data) => {
          setAddress(data.address)
        }}
      />
      <p className="mt-4">当前地址: {address}</p>
    </div>
  )
}
```

### 6. 禁用状态

禁用定位功能。

```tsx
function Example() {
  return (
    <MobileLocation
      ak="YOUR_BAIDU_MAP_AK"
      disabled
      defaultValue="北京市朝阳区"
    />
  )
}
```

## 完整示例

### 收货地址表单

创建一个收货地址表单，包含定位功能。

```tsx
import { MobileLocation } from '@/registry/components/mobile-location'
import { useState } from 'react'
import { Button } from '@/registry/components/button/button'
import { Input } from '@/registry/components/input/input'

function ShippingAddressForm() {
  const [location, setLocation] = useState(null)
  const [detailAddress, setDetailAddress] = useState('')

  const handleSubmit = () => {
    if (location) {
      const fullAddress = {
        ...location,
        detail: detailAddress
      }
      console.log('提交地址:', fullAddress)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">收货地址</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            定位地址
          </label>
          <MobileLocation
            ak="YOUR_BAIDU_MAP_AK"
            onSuccess={(data) => setLocation(data)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            详细地址
          </label>
          <Input
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            placeholder="门牌号、楼层等"
          />
        </div>

        {location && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm">
              <strong>定位地址:</strong> {location.address}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              经度: {location.lng.toFixed(6)}, 纬度: {location.lat.toFixed(6)}
            </p>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!location}
          className="w-full"
        >
          保存地址
        </Button>
      </div>
    </div>
  )
}
```

### 位置记录应用

记录用户的当前位置。

```tsx
import { MobileLocation } from '@/registry/components/mobile-location'
import { useState } from 'react'
import { Button } from '@/registry/components/button/button'

function LocationTracker() {
  const [locations, setLocations] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null)

  const handleRecordLocation = () => {
    if (currentLocation) {
      const record = {
        ...currentLocation,
        timestamp: new Date().toLocaleString()
      }
      setLocations([...locations, record])
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">位置记录</h2>
      
      <div className="space-y-4">
        <MobileLocation
          ak="YOUR_BAIDU_MAP_AK"
          onSuccess={setCurrentLocation}
          placeholder="获取当前位置"
        />

        {currentLocation && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="font-medium mb-2">当前位置</p>
            <p className="text-sm">{currentLocation.address}</p>
            <Button
              onClick={handleRecordLocation}
              className="mt-3"
              size="sm"
            >
              记录位置
            </Button>
          </div>
        )}

        {locations.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">已记录位置 ({locations.length})</h3>
            {locations.map((loc, index) => (
              <div key={index} className="p-3 bg-white border rounded">
                <p className="text-sm">{loc.address}</p>
                <p className="text-xs text-gray-500 mt-1">{loc.timestamp}</p>
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

1. **API Key 必需**：必须提供有效的百度地图 API Key (`ak` 参数)，否则无法定位。

2. **HTTPS 要求**：在 iOS 设备上，定位功能需要使用 HTTPS 协议。

3. **权限请求**：首次使用时会请求用户的位置权限，用户必须授权才能定位。

4. **定位精度**：定位精度取决于设备和网络环境，误差可能在几米到几百米之间。

5. **错误处理**：如果定位失败，组件会显示错误提示信息。

6. **百度地图 SDK**：组件会动态加载百度地图的 JavaScript API，无需额外安装。

7. **网络依赖**：定位功能需要网络连接，建议在定位前检查网络状态。

8. **回调数据**：`onChange` 和 `onSuccess` 回调返回的数据包含：
   - `address`: 完整的中文地址
   - `lat`: 纬度
   - `lng`: 经度

9. **API Key 申请**：需要在百度地图开放平台申请 API Key：https://lbsyun.baidu.com/

10. **费用说明**：百度地图定位服务有一定的免费额度，超出后可能产生费用。
