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
| `input` | `object` | 否 | - | 表单输入对象 |
| `input.value` | `string` | 否 | - | 当前链接值 |
| `input.onChange` | `(value: string) => void` | 否 | - | 值变化回调 |
| `field` | `object` | 否 | - | 字段配置对象 |
| `field.schema` | `object` | 否 | - | 字段 schema 配置 |
| `field.schema.linkType` | `'in' \| 'out'` | 否 | `'out'` | 链接类型：内部链接/外部链接 |
| `field.schema.placeholder` | `string` | 否 | `'请输入链接'` | 占位提示文本 |
| `field.schema.defaultVal` | `string` | 否 | - | 默认值 |
| `field.schema.disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用（优先级低于 schema.disabled） |
| `meta` | `any` | 否 | - | 元数据 |
| `record` | `any` | 否 | - | 记录数据 |

### field.schema

Schema 配置对象，用于定义组件的行为和默认值。

### linkType

链接类型，决定使用哪种输入方式：

- `'in'`：内部链接，从系统菜单项中选择（功能待迁移）
- `'out'`：外部链接，手动输入完整的 URL 地址

## 基本用法

### 1. 外部链接输入

默认模式，用户手动输入完整的 URL 地址。

```tsx
import { FormLink } from '@/registry/components/kesi/form-link'

function Example() {
  const [value, setValue] = useState('')

  return (
    <FormLink
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: {
          linkType: 'out',
          placeholder: '请输入链接地址'
        }
      }}
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
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: {
          linkType: 'in',
          placeholder: '选择系统内置的菜单项'
        }
      }}
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
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: {
          linkType: 'out',
          disabled: true
        }
      }}
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
      input={{
        value,
        onChange: setValue
      }}
      field={{
        schema: {
          linkType: 'out',
          placeholder: '请输入链接',
          defaultVal: 'https://example.com'
        }
      }}
    />
  )
}
```

## 完整示例

### 导航菜单配置

用于配置导航菜单的链接地址，支持内部和外部链接。

```tsx
import { FormLink } from '@/registry/components/kesi/form-link'
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
          input={{
            value: linkValue,
            onChange: setLinkValue
          }}
          field={{
            schema: {
              linkType,
              placeholder: linkType === 'out'
                ? '请输入完整的 URL 地址'
                : '选择系统内置的菜单项'
            }
          }}
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
        input={{
          value: config.url,
          onChange: (url) => setConfig({ ...config, url })
        }}
        field={{
          schema: {
            linkType: config.linkType,
            placeholder: '请输入目标链接'
          }
        }}
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
            input={{
              value: link.value,
              onChange: (value) => {
                const newLinks = [...links]
                newLinks[index].value = value
                setLinks(newLinks)
              }
            }}
            field={{
              schema: {
                linkType: link.type,
                placeholder: link.type === 'out'
                  ? '请输入外部链接'
                  : '选择内部菜单项'
              }
            }}
          />
        </div>
      ))}
    </div>
  )
}
```

## 注意事项

1. **内部链接功能待迁移**：当 `linkType` 设置为 `'in'` 时，菜单项选择器功能尚未完全实现，目前显示为占位状态，等待后续从旧版本迁移。

2. **禁用优先级**：`disabled` 属性和 `field.schema.disabled` 都可以控制禁用状态，但 `field.schema.disabled` 的优先级更高。

3. **值格式**：外部链接需要输入完整的 URL 地址（包括协议头，如 `https://`），内部链接则是系统菜单项的唯一标识。

4. **与表单集成**：该组件设计为在表单系统中使用，`input` 和 `field` 参数通常由表单框架自动传入，手动使用时需要按照规范传递这些参数。

5. **onChange 回调**：当用户修改链接值时，`onChange` 回调会返回新的字符串值，父组件需要更新状态以保持同步。

6. **扩展性**：组件预留了 `MenuItemSelect` 子组件的接口，当菜单项选择器功能完成后，内部链接模式将自动启用。
