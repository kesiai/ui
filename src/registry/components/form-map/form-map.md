# Form.Map 地图定位

## 简介

`FormMap` 是一个基于高德地图的位置选择组件，支持地图选点和手动输入经纬度两种方式。

- **地图选点**：集成高德地图 API，可视化选择地理位置
- **手动输入**：支持手动输入经纬度坐标，适合精确坐标录入
- **智能搜索**：提供地点搜索功能，快速定位目标位置
- **自动定位**：支持自动获取当前位置作为默认值
- **灵活展示**：支持弹窗模式和直接展示模式，适应不同场景

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `input` | `object` | 是 | - | 表单输入对象 |
| `input.value` | `object` | 否 | - | 当前位置值 { name, lng, lat } |
| `input.onChange` | `(value: object \| null) => void` | 否 | - | 值变化回调 |
| `field` | `object` | 否 | - | 字段配置对象 |
| `field.schema` | `object` | 否 | - | 字段 schema 配置 |
| `field.schema.placeholder` | `string` | 否 | `'请选择位置'` | 占位提示文本 |
| `field.schema.lngLat` | `boolean` | 否 | `true` | 是否显示经纬度 |
| `field.schema.positionName` | `boolean` | 否 | `true` | 是否显示位置名称 |
| `field.schema.canEdit` | `boolean` | 否 | `true` | 是否可编辑 |
| `field.schema.canHand` | `boolean` | 否 | `true` | 是否可手动输入 |
| `field.schema.showType` | `'map' \| 'modal'` | 否 | `'modal'` | 展示方式 |
| `field.schema.size` | `'small' \| 'middle' \| 'large'` | 否 | `'middle'` | 尺寸 |
| `field.schema.defaultVal` | `object` | 否 | - | 默认位置值 |
| `field.schema.disabled` | `boolean` | 否 | `false` | 是否禁用 |

### 值格式 (Value Format)

组件返回的位置值格式：

```typescript
{
  name: string      // 位置名称（地址描述）
  lng: number       // 经度
  lat: number       // 纬度
}
```

### showType

展示方式，决定组件的渲染形式：

- `'modal'`：弹窗模式，点击按钮打开地图选择弹窗
- `'map'`：直接展示地图，地图始终显示在页面上

## 基本用法

### 1. 基础地图选点

默认使用弹窗模式，点击地图图标打开地图选择器。

```tsx
import { FormMap } from '@/registry/components/form-map'
import { useState } from 'react'

function Example() {
  const [location, setLocation] = useState<{ name?: string; lng: number; lat: number } | null>(null)

  return (
    <FormMap
      input={{
        value: location,
        onChange: setLocation
      }}
      field={{
        schema: {
          placeholder: '请选择位置'
        }
      }}
    />
  )
}
```

### 2. 直接展示地图

设置 `showType` 为 `'map'`，地图直接显示在页面上。

```tsx
function Example() {
  const [location, setLocation] = useState(null)

  return (
    <FormMap
      input={{
        value: location,
        onChange: setLocation
      }}
      field={{
        schema: {
          showType: 'map'
        }
      }}
    />
  )
}
```

### 3. 只显示位置名称

不显示经纬度坐标，只显示地址描述。

```tsx
function Example() {
  const [location, setLocation] = useState(null)

  return (
    <FormMap
      input={{
        value: location,
        onChange: setLocation
      }}
      field={{
        schema: {
          lngLat: false,
          positionName: true
        }
      }}
    />
  )
}
```

### 4. 禁用手动输入

只允许通过地图选点，不允许手动输入坐标。

```tsx
function Example() {
  const [location, setLocation] = useState(null)

  return (
    <FormMap
      input={{
        value: location,
        onChange: setLocation
      }}
      field={{
        schema: {
          canHand: false
        }
      }}
    />
  )
}
```

### 5. 不同尺寸

支持 small、middle、large 三种尺寸。

```tsx
function Example() {
  return (
    <div className="space-y-2">
      <FormMap
        input={{ value: null, onChange: () => {} }}
        field={{ schema: { size: 'small' } }}
      />
      <FormMap
        input={{ value: null, onChange: () => {} }}
        field={{ schema: { size: 'middle' } }}
      />
      <FormMap
        input={{ value: null, onChange: () => {} }}
        field={{ schema: { size: 'large' } }}
      />
    </div>
  )
}
```

## 完整示例

### 门店地址管理

管理连锁门店的地理位置信息。

```tsx
import { FormMap } from '@/registry/components/form-map'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

function StoreLocationForm() {
  const [storeName, setStoreName] = useState('')
  const [location, setLocation] = useState(null)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>门店名称</Label>
        <Input
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="请输入门店名称"
        />
      </div>

      <div className="space-y-2">
        <Label>门店位置</Label>
        <FormMap
          input={{
            value: location,
            onChange: setLocation
          }}
          field={{
            schema: {
              placeholder: '请选择门店位置',
              lngLat: true,
              positionName: true,
              canHand: true
            }
          }}
        />
      </div>

      {location && (
        <div className="text-sm text-gray-600">
          <p>门店地址：{location.name}</p>
          <p>经纬度：{location.lng}, {location.lat}</p>
        </div>
      )}
    </div>
  )
}
```

### 物流配送范围

设置物流配送的覆盖范围中心点。

```tsx
function DeliveryRangeForm() {
  const [centerPoint, setCenterPoint] = useState(null)
  const [radius, setRadius] = useState(5)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>配送中心位置</Label>
        <FormMap
          input={{
            value: centerPoint,
            onChange: setCenterPoint
          }}
          field={{
            schema: {
              placeholder: '请选择配送中心',
              showType: 'map',
              lngLat: true,
              positionName: true
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>配送半径 (公里)</Label>
        <Input
          type="number"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />
      </div>
    </div>
  )
}
```

### 巡检点位配置

配置巡检点位的地理位置信息。

```tsx
function InspectionPointForm() {
  const [point, setPoint] = useState({
    name: '',
    location: null
  })

  return (
    <div className="space-y-4">
      <FormMap
        input={{
          value: point.location,
          onChange: (location) => setPoint({ ...point, location })
        }}
        field={{
          schema: {
            placeholder: '请选择巡检点位',
            lngLat: true,
            positionName: true,
            canHand: true,
            size: 'middle'
          }
        }}
      />

      {point.location && (
        <div className="p-3 bg-blue-50 rounded text-sm">
          <p><strong>巡检点位置：</strong>{point.location.name}</p>
          <p><strong>坐标：</strong>{point.location.lng.toFixed(6)}, {point.location.lat.toFixed(6)}</p>
        </div>
      )}
    </div>
  )
}
```

## 注意事项

1. **GIS 组件待迁移**：当前版本中的地图组件使用占位符 `GisPlaceholder`，实际的 GIS 功能需要从旧版本迁移。迁移前，地图选择功能显示为占位状态。

2. **高德地图 API**：组件依赖高德地图 API（`@amap/amap-jsapi-loader`），需要确保网络可以访问高德地图服务，并且需要有效的 API Key。

3. **浏览器定位**：组件使用浏览器原生的 `navigator.geolocation` API 获取当前位置，需要用户授权，并且在 HTTPS 环境下才能正常工作。

4. **坐标系统**：组件使用高德地图的坐标系统（GCJ-02），与其他地图系统（如百度地图 BD-09）的坐标可能存在偏移。

5. **手动输入验证**：手动输入经纬度时，组件会验证输入的合法性，确保经度在 -180 到 180 之间，纬度在 -90 到 90 之间。

6. **地址逆编码**：地图选点后，组件会通过逆地理编码 API 获取详细的地址描述，这需要额外的网络请求。

7. **默认值处理**：如果没有设置默认值，组件会在初始化时尝试获取当前定位作为默认值。如果定位失败，则保持为空。

8. **显示值格式**：输入框显示的值由 `lngLat` 和 `positionName` 控制，可以组合显示：
   - 都为 `true`：显示 "地址名称 (经度,纬度)"
   - 只显示名称：只显示地址描述
   - 只显示坐标：只显示 "(经度,纬度)"
