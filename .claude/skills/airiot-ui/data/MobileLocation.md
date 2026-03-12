## MobileLocation - 移动端定位组件

### 导入路径
```tsx
import { MobileLocation } from '@/components/airiot/mobile-location/mobile-location'
```

### 基础用法
```tsx
import { MobileLocation } from '@/components/airiot/mobile-location/mobile-location'

function LocationExample() {
  const [currentLocation, setCurrentLocation] = useState(null)
  const [permission, setPermission] = useState('denied')

  return (
    <MobileLocation
      onLocationUpdate={setCurrentLocation}
      onPermissionChange={setPermission}
      enableHighAccuracy={true}
    >
      {({ location, loading, error }) => (
        <div>
          {loading && <div>正在定位...</div>}
          {error && <div>定位失败: {error}</div>}
          {location && (
            <div>
              <div>纬度: {location.latitude}</div>
              <div>经度: {location.longitude}</div>
              <div>精度: {location.accuracy}米</div>
            </div>
          )}
        </div>
      )}
    </MobileLocation>
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| onLocationUpdate | (location) => void | - | 位置更新回调 |
| onPermissionChange | (status) => void | - | 权限变化回调 |
| enableHighAccuracy | boolean | true | 是否启用高精度 |
| maximumAge | number | 30000 | 最大缓存时间 |

### 示例
```tsx
import { MobileLocation, Button, Card } from '@/components/airiot'

function LocationTracker() {
  const [location, setLocation] = useState(null)
  const [tracking, setTracking] = useState(false)
  const [permission, setPermission] = useState(null)

  return (
    <Card cardTitle="位置追踪">
      <MobileLocation
        onLocationUpdate={setLocation}
        onPermissionChange={setPermission}
        enableHighAccuracy={true}
      >
        {({ location: loc, loading, error }) => (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Button
                type={tracking ? 'default' : 'primary'}
                onClick={() => setTracking(!tracking)}
                style={{ width: '100%' }}
              >
                {tracking ? '停止追踪' : '开始追踪'}
              </Button>
            </div>

            {loading && <div>正在获取位置...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {loc && (
              <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                <div><strong>当前位置：</strong></div>
                <div>纬度: {loc.latitude.toFixed(6)}</div>
                <div>经度: {loc.longitude.toFixed(6)}</div>
                <div>精度: ±{loc.accuracy.toFixed(0)}米</div>
                <div>更新时间: {new Date(loc.timestamp).toLocaleTimeString()}</div>
              </div>
            )}
          </div>
        )}
      </MobileLocation>
    </Card>
  )
}
```

### 权限状态
- granted: 已授权
- denied: 已拒绝
- prompt: 需要用户授权

### 注意事项
- 需要 HTTPS 环境
- iOS 需要用户手动授权
- 支持后台定位