# Popover 气泡卡片

## 简介

`Popover` 是一个弹出气泡卡片组件，支持点击和鼠标悬停两种触发方式，可在指定位置显示额外内容。

- **触发灵活**：支持点击和鼠标悬停两种触发方式
- **位置可控**：支持上、下、左、右四个方位的弹出位置
- **尺寸自定义**：可自定义弹出内容的宽度和高度
- **状态管理**：支持受控和非受控两种使用模式
- **交互友好**：可禁用触发按钮，支持自定义样式

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `buttonName` | `string` | 否 | `'气泡卡片'` | 按钮文字 |
| `hiddenBtn` | `boolean` | 否 | `false` | 隐藏按钮 |
| `disable` | `boolean` | 否 | `false` | 禁用状态 |
| `trigger` | `'hover' \| 'click'` | 否 | `'click'` | 定义鼠标触发气泡卡片显示时的交互方式 |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | 否 | `'top'` | 以按钮为参考，气泡卡片显示的位置 |
| `width` | `number \| string` | 否 | `200` | 弹出内容的宽度（数字或带单位字符串） |
| `height` | `number \| string` | 否 | `200` | 弹出内容的高度（数字或带单位字符串） |
| `open` | `boolean` | 否 | - | 是否打开（受控模式） |
| `onOpenChange` | `(open: boolean) => void` | 否 | - | 打开状态变化回调 |

## 基本用法

### 1. 基础气泡卡片

最简单的气泡卡片，点击按钮显示内容。

```tsx
import { Popover } from '@/registry/components/container-popover'

function Example() {
  return (
    <Popover>
      <div className="p-4">
        <p>这是气泡卡片的内容</p>
      </div>
    </Popover>
  )
}
```

### 2. 自定义按钮文字

修改触发按钮的文字。

```tsx
function Example() {
  return (
    <Popover
      buttonName="查看详情"
      placement="bottom"
    >
      <div className="p-4">
        <h3 className="font-bold mb-2">详细信息</h3>
        <p>这里是详细的内容描述</p>
      </div>
    </Popover>
  )
}
```

### 3. 悬停触发

鼠标悬停时自动显示气泡。

```tsx
function Example() {
  return (
    <Popover
      trigger="hover"
      buttonName="悬停查看"
      placement="top"
    >
      <div className="p-4">
        <p>鼠标悬停时显示的内容</p>
      </div>
    </Popover>
  )
}
```

### 4. 自定义尺寸

设置弹出内容的宽度和高度。

```tsx
function Example() {
  return (
    <Popover
      width={400}
      height={300}
      placement="right"
    >
      <div className="p-4">
        <h3 className="font-bold mb-2">大尺寸气泡</h3>
        <p>这是一个更大的弹出内容区域</p>
      </div>
    </Popover>
  )
}
```

### 5. 受控模式

通过 state 控制气泡的打开和关闭。

```tsx
import { useState } from 'react'

function Example() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setOpen(true)}>
        打开气泡
      </button>
      <Popover
        open={open}
        onOpenChange={setOpen}
        hiddenBtn
      >
        <div className="p-4">
          <p>受控模式下的气泡卡片</p>
          <button onClick={() => setOpen(false)}>
            关闭
          </button>
        </div>
      </Popover>
    </div>
  )
}
```

### 6. 禁用状态

禁用气泡卡片的触发功能。

```tsx
function Example() {
  return (
    <Popover
      disable
      buttonName="已禁用"
    >
      <div className="p-4">
        <p>这个气泡无法打开</p>
      </div>
    </Popover>
  )
}
```

### 7. 不同位置

展示不同方位的气泡弹出。

```tsx
function Example() {
  return (
    <div className="flex gap-4">
      <Popover placement="top" buttonName="上">
        <div className="p-2">上方弹出</div>
      </Popover>
      <Popover placement="bottom" buttonName="下">
        <div className="p-2">下方弹出</div>
      </Popover>
      <Popover placement="left" buttonName="左">
        <div className="p-2">左侧弹出</div>
      </Popover>
      <Popover placement="right" buttonName="右">
        <div className="p-2">右侧弹出</div>
      </Popover>
    </div>
  )
}
```

## 完整示例

### 用户信息卡片

创建一个显示用户详细信息的气泡卡片。

```tsx
import { Popover } from '@/registry/components/container-popover'
import { Avatar } from '@/registry/components/avatar/avatar'

function UserInfoPopover() {
  const user = {
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    department: '技术部',
    phone: '138****8888'
  }

  return (
    <Popover
      buttonName={user.name}
      width={320}
      placement="bottom"
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12" />
          <div>
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">邮箱：</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">部门：</span>
            <span>{user.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">电话：</span>
            <span>{user.phone}</span>
          </div>
        </div>
      </div>
    </Popover>
  )
}
```

### 操作菜单

创建一个包含多个操作选项的气泡菜单。

```tsx
import { Popover } from '@/registry/components/container-popover'
import { Button } from '@/registry/components/button/button'

function ActionMenuPopover() {
  const actions = [
    { label: '编辑', icon: '✏️', onClick: () => console.log('编辑') },
    { label: '复制', icon: '📋', onClick: () => console.log('复制') },
    { label: '分享', icon: '📤', onClick: () => console.log('分享') },
    { label: '删除', icon: '🗑️', onClick: () => console.log('删除'), danger: true }
  ]

  return (
    <Popover
      buttonName="操作"
      width={200}
      placement="bottom"
    >
      <div className="p-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`
              w-full flex items-center gap-2 px-3 py-2 rounded
              hover:bg-gray-100 transition-colors text-left
              ${action.danger ? 'text-red-600 hover:bg-red-50' : ''}
            `}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </Popover>
  )
}
```

### 表单辅助说明

为表单字段提供详细的帮助信息。

```tsx
import { Popover } from '@/registry/components/container-popover'
import { Input } from '@/registry/components/input/input'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'

function FormHelpPopover() {
  return (
    <div className="flex items-center gap-2">
      <Input placeholder="请输入用户名" />
      <Popover
        buttonName=""
        hiddenBtn
        width={300}
        trigger="hover"
      >
        <div className="p-3">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <QuestionMarkCircledIcon className="h-4 w-4" />
            用户名规则
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 长度 4-20 个字符</li>
            <li>• 只能包含字母、数字和下划线</li>
            <li>• 必须以字母开头</li>
            <li>• 不能使用特殊符号</li>
          </ul>
        </div>
      </Popover>
    </div>
  )
}
```

## 注意事项

1. **悬停模式**：`trigger="hover"` 模式下，鼠标移开按钮时气泡会自动关闭，不适合需要用户交互的场景。

2. **隐藏按钮**：`hiddenBtn={true}` 时，触发区域变为透明，常用于自定义触发器或受控模式。

3. **宽度高度**：可以使用数字（像素）或字符串（如 `'100%'`、`'300px'`）来设置尺寸。

4. **受控模式**：使用 `open` 和 `onOpenChange` 实现受控模式时，`hiddenBtn` 通常设为 `true`。

5. **位置溢出**：如果弹出内容超出视口，组件会自动调整位置以确保内容可见。

6. **嵌套使用**：不建议在气泡卡片内部再嵌套另一个气泡卡片，可能导致交互混乱。

7. **性能考虑**：如果气泡内容复杂，建议使用懒加载或延迟渲染提升性能。
