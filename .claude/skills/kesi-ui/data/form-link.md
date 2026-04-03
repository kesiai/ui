> **安装命令**: `npx shadcn@latest add @kesi/form-link`

# Form.Link 链接

## 简介

`FormLink` 是一个用于输入链接地址的表单组件，支持内部链接和外部链接两种模式。

- **双模式支持**：支持内部链接（从系统菜单中选择）和外部链接（手动输入）两种模式
- **灵活配置**：可根据业务需求选择链接类型和输入方式
- **简洁易用**：提供简洁的 API 接口，易于集成到表单中
- **状态管理**：支持禁用状态，防止误操作
- **可扩展**：预留菜单项选择器接口，方便后续功能扩展

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `string` | 否 | - | 当前链接值 |
| `onChange` | `(value: string) => void` | 否 | - | 值变化回调 |
| `placeholder` | `string` | 否 | - | 占位提示文本 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `linkType` | `'in' \| 'out'` | 否 | `'out'` | 链接类型：内部链接/外部链接 |
| `onBlur` | `() => void` | 否 | - | 失焦回调 |
| `name` | `string` | 否 | - | 字段名（react-hook-form） |
| `id` | `string` | 否 | - | 字段 ID（FormField 生成） |
| `schema` | `Record<string, any>` | 否 | - | 表单 schema |
| `record` | `any` | 否 | - | 表单记录数据 |

### linkType

链接类型，决定使用哪种输入方式：

- `'in'`：内部链接，从系统菜单项中选择（功能待迁移）
- `'out'`：外部链接，手动输入完整的 URL 地址

## 基本用法

### 1. 外部链接输入

默认模式，用户手动输入完整的 URL 地址。

```tsx
import { FormLink } from '@/components/kesi/form-link'
import { useState } from 'react'

function Example() {
  const [value, setValue] = useState('')

  return (
    <FormLink
      value={value}
      onChange={setValue}
      linkType="out"
      placeholder="请输入链接地址"
    />
  )
}
```

### 2. 内部链接选择

从系统内置的菜单项中选择（功能待迁移）。

```tsx
function Example() {
  const [value, setValue] = useState('')

  return (
    <FormLink
      value={value}
      onChange={setValue}
      linkType="in"
      placeholder="选择系统内置的菜单项"
    />
  )
}
```

### 3. 禁用状态

设置禁用状态，防止用户修改链接。

```tsx
function Example() {
  const [value, setValue] = useState('https://example.com')

  return (
    <FormLink
      value={value}
      onChange={setValue}
      linkType="out"
      disabled
    />
  )
}
```

### 4. 带默认值

设置默认链接值，方便用户快速开始。

```tsx
function Example() {
  const [value, setValue] = useState('https://example.com')

  return (
    <FormLink
      value={value}
      onChange={setValue}
      linkType="out"
      placeholder="请输入链接"
    />
  )
}
```

## 完整示例

### 导航菜单配置

用于配置导航菜单的链接地址，支持内部和外部链接。

```tsx
import { FormLink } from '@/components/kesi/form-link'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useState } from 'react'

function NavigationMenuForm() {
  const [linkType, setLinkType] = useState<'in' | 'out'>('out')
  const [linkValue, setLinkValue] = useState('')

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>链接类型</Label>
        <Select value={linkType} onValueChange={setLinkType}>
          <option value="out">外部链接</option>
          <option value="in">内部链接</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>链接地址</Label>
        <FormLink
          value={linkValue}
          onChange={setLinkValue}
          linkType={linkType}
          placeholder={linkType === 'out'
            ? '请输入完整的 URL 地址'
            : '选择系统内置的菜单项'}
        />
      </div>
    </div>
  )
}
```

### 页面跳转配置

配置页面跳转按钮的链接，支持动态切换链接类型。

```tsx
function ButtonLinkConfig() {
  const [config, setConfig] = useState({
    linkType: 'out' as 'in' | 'out',
    url: 'https://example.com'
  })

  return (
    <div className="space-y-4">
      <FormLink
        value={config.url}
        onChange={(url) => setConfig({ ...config, url })}
        linkType={config.linkType}
        placeholder="请输入目标链接"
      />

      <div className="text-sm text-gray-500">
        当前类型：{config.linkType === 'out' ? '外部链接' : '内部链接'}
      </div>
    </div>
  )
}
```

### 批量链接管理

管理多个链接配置，每个链接可独立设置类型和值。

```tsx
function LinkManager() {
  const [links, setLinks] = useState([
    { id: '1', type: 'out' as const, value: '' },
    { id: '2', type: 'in' as const, value: '' }
  ])

  return (
    <div className="space-y-4">
      {links.map((link, index) => (
        <div key={link.id} className="space-y-2">
          <div className="font-medium">链接 {index + 1}</div>
          <FormLink
            value={link.value}
            onChange={(value) => {
              const newLinks = [...links]
              newLinks[index].value = value
              setLinks(newLinks)
            }}
            linkType={link.type}
            placeholder={link.type === 'out'
              ? '请输入外部链接'
              : '选择内部菜单项'}
          />
        </div>
      ))}
    </div>
  )
}
```

## 注意事项

1. **内部链接功能待迁移**：当 `linkType` 设置为 `'in'` 时，菜单项选择器功能尚未完全实现，目前显示为占位状态，等待后续从旧版本迁移。

2. **禁用状态**：通过 `disabled` 属性控制禁用状态，防止用户修改链接值。

3. **值格式**：外部链接需要输入完整的 URL 地址（包括协议头，如 `https://`），内部链接则是系统菜单项的唯一标识。

4. **与表单集成**：该组件可直接使用 `value` 和 `onChange` 进行受控绑定，也可通过 `FormField` 组件自动注入表单状态。

5. **onChange 回调**：当用户修改链接值时，`onChange` 回调会返回新的字符串值，父组件需要更新状态以保持同步。

6. **扩展性**：组件预留了 `MenuItemSelect` 子组件的接口，当菜单项选择器功能完成后，内部链接模式将自动启用。
