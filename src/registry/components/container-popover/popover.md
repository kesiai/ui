# Popover 气泡卡片组件

## 简介

`Popover` 是一个气泡卡片容器组件，用于在触发元素附近显示浮层内容。

- **多种触发方式**：支持点击和悬停两种触发方式
- **灵活定位**：支持上、下、左、右四个方向的定位
- **尺寸可调**：可自定义气泡卡片的宽度和高度
- **按钮配置**：可隐藏默认按钮，使用自定义触发元素
- **受控/非受控模式**：支持受控和非受控两种使用方式
- **智能定位**：自动根据空间调整位置，确保内容完全可见

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `buttonName` | `string` | 否 | `'气泡卡片'` | 按钮文字 |
| `hiddenBtn` | `boolean` | 否 | `false` | 隐藏按钮 |
| `disable` | `boolean` | 否 | `false` | 禁用状态 |
| `trigger` | `'hover' \| 'click'` | 否 | `'click'` | 触发方式 |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | 否 | `'top'` | 位置 |
| `width` | `number \| string` | 否 | `200` | 宽度（数字或带单位字符串） |
| `height` | `number \| string` | 否 | `200` | 高度（数字或带单位字符串） |
| `open` | `boolean` | 否 | - | 是否打开（受控模式） |
| `onOpenChange` | `(open: boolean) => void` | 否 | - | 打开状态变化回调 |
| `children` | `ReactNode` | 否 | - | 子组件 |
| `className` | `string` | 否 | - | 自定义类名 |
| `style` | `CSSProperties` | 否 | - | 自定义样式 |

## 基本用法

### 1. 基础气泡卡片

最简单的使用方式：

```tsx
import { Popover } from '@/registry/components/container-popover/popover'

function App() {
  return (
    <Popover>
      <div className="p-4">
        <p>这是气泡卡片内容</p>
      </div>
    </Popover>
  )
}
```

### 2. 悬停触发

鼠标悬停时显示气泡：

```tsx
<Popover
  trigger="hover"
  buttonName="悬停查看"
>
  <div className="p-4">
    <p>鼠标悬停时显示</p>
  </div>
</Popover>
```

### 3. 自定义位置

设置气泡显示在按钮下方：

```tsx
<Popover
  placement="bottom"
  buttonName="查看详情"
>
  <div className="p-4">
    <p>气泡显示在下方</p>
  </div>
</Popover>
```

### 4. 自定义尺寸

设置气泡卡片的宽度和高度：

```tsx
<Popover
  width={400}
  height={300}
  buttonName="大尺寸气泡"
>
  <div className="p-4">
    <p>这是一个大尺寸的气泡卡片</p>
    <p>宽度 400px，高度 300px</p>
  </div>
</Popover>
```

## 完整示例

### 用户信息气泡

```tsx
import { Popover } from '@/registry/components/container-popover/popover'

function UserInfoPopover() {
  const user = {
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    avatar: '/avatars/zhangsan.jpg'
  }

  return (
    <Popover
      buttonName={user.name}
      width={300}
      placement="bottom"
    >
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
            {user.name.charAt(0)}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-slate-600">{user.email}</p>
          </div>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">角色</span>
            <span className="font-medium">{user.role}</span>
          </div>
          <button className="w-full mt-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            个人设置
          </button>
        </div>
      </div>
    </Popover>
  )
}
```

### 操作菜单

```tsx
import { Popover } from '@/registry/components/container-popover/popover'

function ActionMenu() {
  const actions = [
    { name: '编辑', icon: '✏️', onClick: () => console.log('编辑') },
    { name: '分享', icon: '📤', onClick: () => console.log('分享') },
    { name: '删除', icon: '🗑️', onClick: () => console.log('删除'), danger: true }
  ]

  return (
    <Popover
      buttonName="操作"
      width={200}
      placement="bottom"
    >
      <div className="py-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`w-full px-4 py-2 text-left flex items-center hover:bg-slate-100 ${
              action.danger ? 'text-red-600' : 'text-slate-700'
            }`}
          >
            <span className="mr-2">{action.icon}</span>
            {action.name}
          </button>
        ))}
      </div>
    </Popover>
  )
}
```

### 快捷提示

```tsx
import { Popover } from '@/registry/components/container-popover/popover'

function QuickTip() {
  return (
    <Popover
      trigger="hover"
      buttonName="💡 提示"
      width={250}
      placement="right"
    >
      <div className="p-4">
        <h4 className="font-semibold mb-2">使用提示</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• 点击按钮可以打开对话框</li>
          <li>• 双击可以快速编辑</li>
          <li>• 拖拽可以调整顺序</li>
        </ul>
      </div>
    </Popover>
  )
}
```

### 受控模式示例

```tsx
import { Popover } from '@/registry/components/container-popover/popover'
import { useState } from 'react'

function ControlledPopover() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        {open ? '关闭' : '打开'}气泡
      </button>

      <Popover
        buttonName="手动控制"
        open={open}
        onOpenChange={setOpen}
        width={300}
      >
        <div className="p-4">
          <p className="mb-4">这是受控模式的气泡卡片</p>
          <p className="text-sm text-slate-600">
            当前状态: {open ? '打开' : '关闭'}
          </p>
          <button
            onClick={() => setOpen(false)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            关闭
          </button>
        </div>
      </Popover>
    </div>
  )
}
```

### 自定义触发元素

```tsx
import { Popover } from '@/registry/components/container-popover/popover'

function CustomTrigger() {
  return (
    <div className="relative">
      <Popover
        hiddenBtn={true}
        open={open}
        onOpenChange={setOpen}
        width={300}
        placement="bottom"
      >
        <div className="p-4">
          <p>使用自定义触发元素</p>
        </div>
      </Popover>

      {/* 自定义触发按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
      >
        自定义按钮
      </button>
    </div>
  )
}
```

### 搜索建议

```tsx
import { Popover } from '@/registry/components/container-popover/popover'
import { useState } from 'react'

function SearchSuggestion() {
  const [value, setValue] = useState('')
  const suggestions = [
    'React',
    'Vue',
    'Angular',
    'Svelte',
    'Next.js'
  ].filter(item => item.toLowerCase().includes(value.toLowerCase()))

  return (
    <Popover
      buttonName="搜索"
      width={300}
      placement="bottom"
    >
      <div className="p-4">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="输入关键词..."
          className="w-full px-3 py-2 border rounded-lg mb-3"
        />
        {suggestions.length > 0 ? (
          <ul className="space-y-1">
            {suggestions.map((item, index) => (
              <li
                key={index}
                className="px-3 py-2 hover:bg-slate-100 rounded cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 text-center py-2">
            无搜索结果
          </p>
        )}
      </div>
    </Popover>
  )
}
```

## 注意事项

1. **触发方式选择**：点击模式适合操作类场景，悬停模式适合提示类场景，使用时注意区分

2. **悬停模式注意**：使用 `trigger="hover"` 时，鼠标移开按钮会自动关闭气泡，不适合需要交互的场景

3. **尺寸设置**：`width` 和 `height` 可以是数字（默认单位为 px）或字符串（如 '300px'、'50%'）

4. **定位方向**：`placement` 指定了气泡的首选方向，当空间不足时会自动调整到其他方向

5. **隐藏按钮**：`hiddenBtn` 设置为 `true` 时，组件会渲染一个透明的占位元素，需要自己控制触发方式

6. **禁用状态**：`disable` 设置为 `true` 时，按钮变为禁用状态，无法点击打开气泡

7. **内容溢出**：气泡内容设置了 `overflow: auto`，内容超出指定高度时会自动显示滚动条

8. **性能优化**：气泡内容尽量保持轻量，避免渲染大量组件，以提高性能

9. **z-index 问题**：如果气泡被其他元素遮挡，可以通过 `className` 添加自定义样式调整 z-index

10. **受控模式**：使用受控模式时，需要同时设置 `open` 和 `onOpenChange`，否则无法正常工作
