> **安装命令**: `npx shadcn@latest add @kesi/form-area`

# Area 区域

## 简介

`Area` 是一个省市区三级联动的选择组件，支持单选级联和多选层级两种模式。

- **三级联动**：完整的省、市、区三级数据联动选择
- **灵活配置**：支持省、省市、省市区三种级别配置
- **单选级联**：单选模式采用级联导航，逐级选择
- **多选层级**：多选模式采用树形结构，支持展开折叠
- **数据兼容**：自动兼容旧版数据格式（-分隔转/分隔）

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `string \| string[]` | 否 | - | 当前值（多选时为数组，受控模式） |
| `defaultValue` | `string \| string[]` | 否 | - | 默认值（非受控模式） |
| `areaType` | `'p' \| 'pc' \| 'pca'` | 否 | `'pca'` | 区域类型 |
| `multiple` | `boolean` | 否 | `false` | 是否多选 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `onChange` | `(value: string \| string[]) => void` | 否 | - | 值变化回调 |

### areaType

区域类型，决定选择的层级：

- `'p'`：仅省级（单选：省 / 多选：多个省）
- `'pc'`：省市级（单选：省/市 / 多选：多个省或市）
- `'pca'`：省市区级（单选：省/市/区 / 多选：多个省、市或区）

### 值格式

#### 单选模式

返回使用 `/` 分隔的路径：

```typescript
'浙江省/杭州市/西湖区'  // 省市区
'浙江省/杭州市'          // 省市
'浙江省'                  // 省
```

#### 多选模式

返回字符串数组，每个元素是使用 `/` 分隔的完整路径：

```typescript
[
  '浙江省/杭州市',
  '浙江省/宁波市',
  '江苏省/南京市'
]
```

## 基本用法

### 1. 省市区三级联动

默认模式，完整的省、市、区三级选择。

```tsx
import { FormArea } from '@/components/kesi/form-area/form-area'
import { useState } from 'react'

function Example() {
  const [value, setValue] = useState('')

  return (
    <FormArea
      areaType="pca"
      value={value}
      onChange={setValue}
    />
  )
}
```

### 2. 仅省级选择

只选择省份，不显示市和区。

```tsx
function Example() {
  const [value, setValue] = useState('')

  return (
    <FormArea
      areaType="p"
      value={value}
      onChange={setValue}
    />
  )
}
```

### 3. 省市级选择

选择省份和城市，不显示区级。

```tsx
function Example() {
  const [value, setValue] = useState('')

  return (
    <FormArea
      areaType="pc"
      value={value}
      onChange={setValue}
    />
  )
}
```

### 4. 多选模式

支持选择多个区域。

```tsx
function Example() {
  const [value, setValue] = useState<string[]>([])

  return (
    <FormArea
      areaType="pca"
      multiple
      value={value}
      onChange={setValue}
    />
  )
}
```

### 5. 禁用状态

禁用区域选择器。

```tsx
function Example() {
  const [value] = useState('浙江省/杭州市')

  return (
    <FormArea
      areaType="pca"
      value={value}
      onChange={() => {}}
      disabled
    />
  )
}
```

## 完整示例

### 用户地址填写

用户收货地址的省市区选择。

```tsx
import { FormArea } from '@/components/kesi/form-area/form-area'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

function UserAddressForm() {
  const [address, setAddress] = useState({
    province: '',
    city: '',
    district: '',
    detail: ''
  })
  const [areaValue, setAreaValue] = useState('')

  const handleAreaChange = (value: string) => {
    setAreaValue(value)
    const parts = value.split('/')
    setAddress({
      ...address,
      province: parts[0] || '',
      city: parts[1] || '',
      district: parts[2] || ''
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>所在地区</Label>
        <FormArea
          areaType="pca"
          value={areaValue}
          onChange={handleAreaChange}
        />
      </div>

      <div className="space-y-2">
        <Label>详细地址</Label>
        <Input
          value={address.detail}
          onChange={(e) => setAddress({ ...address, detail: e.target.value })}
          placeholder="请输入详细地址"
        />
      </div>

      {areaValue && (
        <div className="text-sm text-gray-600">
          所选地区：{areaValue}
        </div>
      )}
    </div>
  )
}
```

### 业务范围选择

企业业务范围的多个区域选择。

```tsx
function BusinessScopeForm() {
  const [areas, setAreas] = useState<string[]>([])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>业务覆盖区域</Label>
        <FormArea
          areaType="pca"
          multiple
          value={areas}
          onChange={setAreas}
        />
      </div>

      {areas.length > 0 && (
        <div className="p-3 bg-blue-50 rounded">
          <div className="font-medium mb-2">已选 {areas.length} 个区域：</div>
          <div className="flex flex-wrap gap-2">
            {areas.map((area, index) => (
              <span key={index} className="px-2 py-1 bg-white rounded text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

### 数据统计区域

按省份或城市进行数据统计。

```tsx
function DataStatisticsFilter() {
  const [filter, setFilter] = useState({
    type: 'province' as 'province' | 'city',
    area: ''
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>统计范围</Label>
        <select
          value={filter.type}
          onChange={(e) => setFilter({
            ...filter,
            type: e.target.value as 'province' | 'city',
            area: ''
          })}
          className="w-full p-2 border rounded"
        >
          <option value="province">按省份</option>
          <option value="city">按城市</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>选择区域</Label>
        <FormArea
          areaType={filter.type === 'province' ? 'p' : 'pc'}
          value={filter.area}
          onChange={(area) => setFilter({ ...filter, area })}
        />
      </div>

      {filter.area && (
        <div className="p-3 bg-green-50 rounded">
          统计范围：{filter.area}
        </div>
      )}
    </div>
  )
}
```

## 注意事项

1. **数据加载**：省市区数据内嵌于组件中，无需额外加载外部数据源。

2. **单选级联导航**：单选模式采用逐级导航的方式，选择省后自动进入市级列表，选择市后自动进入区级列表，支持返回上一级。

3. **多选树形结构**：多选模式使用类似树形结构的层级展示，支持展开/折叠子级，可以独立选择任意层级的区域。

4. **值格式一致性**：无论单选还是多选，返回的值都使用 `/` 分隔的完整路径，便于后续处理和展示。

5. **禁用状态**：禁用状态下，单选模式的下拉菜单无法打开，多选模式的复选框无法点击。

6. **性能考虑**：省市区数据量较大，数据内嵌于组件中，无需异步加载。

7. **清空选择**：单选模式下，输入框清空时，`onChange` 会传入空字符串；多选模式下，清空按钮会传入空数组。

8. **受控与非受控**：支持受控模式（传入 `value` 和 `onChange`）和非受控模式（传入 `defaultValue`），请勿同时使用。
