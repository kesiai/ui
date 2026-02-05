# Modal 弹窗组件

## 简介

`Modal` 是一个弹窗容器组件，用于在页面上显示模态对话框。

- **灵活的尺寸控制**：支持自定义弹窗的宽度和高度
- **触发按钮配置**：可配置是否显示触发按钮及按钮文字
- **底部操作按钮**：支持显示保存和取消按钮
- **表单集成**：内置表单上下文，可与表单组件无缝集成
- **受控/非受控模式**：支持受控和非受控两种使用方式
- **销毁机制**：支持关闭时销毁内容，避免数据残留

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `title` | `string` | 否 | `'弹窗标题'` | 弹窗标题 |
| `description` | `string` | 否 | `''` | 弹窗描述 |
| `open` | `boolean` | 否 | - | 是否打开（受控模式） |
| `onOpenChange` | `(open: boolean) => void` | 否 | - | 打开状态变化回调 |
| `modalWidth` | `number \| string` | 否 | `500` | 弹窗宽度（数字或带单位字符串，如 '500px'） |
| `modalHeight` | `number \| string` | 否 | - | 弹窗高度（数字或带单位字符串，如 '400px'） |
| `hiddenMask` | `boolean` | 否 | `false` | 隐藏遮罩 |
| `destroyOnClose` | `boolean` | 否 | `false` | 关闭时销毁数据 |
| `showTrigger` | `boolean` | 否 | `false` | 显示触发按钮 |
| `triggerText` | `string` | 否 | `'打开弹窗'` | 触发按钮文字 |
| `showSubmitButton` | `boolean` | 否 | `false` | 显示保存按钮 |
| `showCancelButton` | `boolean` | 否 | `false` | 显示取消按钮 |
| `submitText` | `string` | 否 | `'保存'` | 保存按钮文字 |
| `cancelText` | `string` | 否 | `'取消'` | 取消按钮文字 |
| `onSubmit` | `() => void \| Promise<void>` | 否 | - | 保存按钮点击回调 |
| `onCancel` | `() => void` | 否 | - | 取消按钮点击回调 |
| `children` | `ReactNode` | 否 | - | 子组件 |
| `className` | `string` | 否 | - | 自定义类名 |
| `style` | `CSSProperties` | 否 | - | 自定义样式 |

## 基本用法

### 1. 基础弹窗

最简单的使用方式，手动控制打开状态：

```tsx
import { Modal } from '@/registry/components/container-modal/modal'
import { Button } from '@/registry/components/button/button'
import { useState } from 'react'

function App() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>打开弹窗</Button>
      <Modal
        title="基础弹窗"
        open={open}
        onOpenChange={setOpen}
      >
        <p>这是弹窗内容</p>
      </Modal>
    </div>
  )
}
```

### 2. 带触发按钮的弹窗

使用内置的触发按钮：

```tsx
<Modal
  title="带触发按钮"
  showTrigger={true}
  triggerText="点击打开"
>
  <p>点击按钮打开弹窗</p>
</Modal>
```

### 3. 自定义尺寸

设置弹窗的宽度和高度：

```tsx
<Modal
  title="自定义尺寸"
  modalWidth={800}
  modalHeight={600}
  open={open}
  onOpenChange={setOpen}
>
  <p>弹窗宽度 800px，高度 600px</p>
</Modal>
```

### 4. 带操作按钮

显示底部的保存和取消按钮：

```tsx
<Modal
  title="确认操作"
  showSubmitButton={true}
  showCancelButton={true}
  submitText="确认"
  cancelText="放弃"
  onSubmit={async () => {
    await handleSubmit()
    console.log('已保存')
  }}
  onCancel={() => {
    console.log('已取消')
  }}
  open={open}
  onOpenChange={setOpen}
>
  <p>确定要执行此操作吗？</p>
</Modal>
```

## 完整示例

### 表单弹窗

```tsx
import { Modal } from '@/registry/components/container-modal/modal'
import { Button } from '@/registry/components/button/button'
import { useState } from 'react'

function FormModal() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  const handleSubmit = async () => {
    // 提交表单数据
    console.log('提交数据:', formData)
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    setOpen(false)
  }

  const handleCancel = () => {
    // 重置表单
    setFormData({ name: '', email: '' })
    setOpen(false)
  }

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        添加用户
      </Button>

      <Modal
        title="添加用户"
        description="请填写用户信息"
        modalWidth={500}
        showSubmitButton={true}
        showCancelButton={true}
        submitText="保存"
        cancelText="取消"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        open={open}
        onOpenChange={setOpen}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              用户名
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="请输入用户名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              邮箱
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="请输入邮箱"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
```

### 详情查看弹窗

```tsx
import { Modal } from '@/registry/components/container-modal/modal'
import { useState } from 'react'

interface User {
  id: number
  name: string
  email: string
  role: string
}

function UserDetail() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const showUserDetail = () => {
    // 模拟获取用户数据
    setUser({
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com',
      role: '管理员'
    })
    setOpen(true)
  }

  return (
    <div>
      <button onClick={showUserDetail}>查看用户详情</button>

      <Modal
        title="用户详情"
        modalWidth={600}
        destroyOnClose={true}
        open={open}
        onOpenChange={setOpen}
      >
        {user && (
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                {user.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-slate-600">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-600">用户 ID</span>
                <span className="font-medium">{user.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-slate-600">角色</span>
                <span className="font-medium">{user.role}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">状态</span>
                <span className="text-green-600 font-medium">活跃</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
```

### 大型内容弹窗

```tsx
import { Modal } from '@/registry/components/container-modal/modal'
import { useState } from 'react'

function LargeContentModal() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setOpen(true)}>查看日志</button>

      <Modal
        title="系统日志"
        modalWidth={900}
        modalHeight={600}
        showCancelButton={true}
        cancelText="关闭"
        open={open}
        onOpenChange={setOpen}
      >
        <div className="space-y-2 font-mono text-sm">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="py-1 border-b">
              <span className="text-slate-500">
                {new Date().toLocaleString()}
              </span>
              <span className="ml-4 text-slate-700">
                [INFO] 系统日志条目 {i + 1}
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
```

## 注意事项

1. **受控模式**：推荐使用 `open` 和 `onOpenChange` 来控制弹窗状态，这样可以更好地管理弹窗的打开和关闭

2. **销毁机制**：当 `destroyOnClose` 设置为 `true` 时，弹窗关闭时会销毁内容，再次打开时会重新创建组件，适合需要重置状态的场景

3. **高度限制**：设置 `modalHeight` 后，内容区域超出高度会自动显示滚动条，建议在内容较多时使用

4. **表单集成**：组件内置了 `ModalWidgetContext`，可以与表单组件配合使用，实现表单验证和提交功能

5. **按钮回调**：`onSubmit` 和 `onCancel` 回调会在按钮点击后自动关闭弹窗，如需阻止关闭，可以在回调中抛出错误

6. **样式覆盖**：可以通过 `className` 和 `style` props 自定义弹窗样式，但要注意可能会影响组件的默认布局

7. **触发按钮**：使用 `showTrigger` 时，组件会自动渲染一个触发按钮，适合简单的使用场景，复杂场景建议自己控制触发方式
