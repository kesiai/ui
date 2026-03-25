# MobilePopup 弹出框

## 简介

`MobilePopup` 是一个移动端弹出框组件，支持从不同方向弹出，可自定义标题和按钮。

- **多方向弹出**：支持上、下、左、右四个方向弹出
- **自定义按钮**：可显示保存和取消按钮
- **位置灵活**：可设置弹出框的位置和方向
- **蒙层控制**：可控制是否显示遮罩蒙层
- **事件回调**：支持打开、关闭和提交等事件回调

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `text` | `string` | 否 | `'弹出框'` | 触发按钮文字 |
| `title` | `string` | 否 | `''` | 弹出框标题 |
| `position` | `'left' \| 'right' \| 'top' \| 'bottom'` | 否 | `'bottom'` | 抽屉位置 |
| `mask` | `boolean` | 否 | `true` | 是否显示蒙层 |
| `showCloseButton` | `boolean` | 否 | `false` | 是否显示关闭按钮 |
| `showFormSubmitBtn` | `boolean` | 否 | `false` | 是否显示保存按钮 |
| `showFormCancelBtn` | `boolean` | 否 | `false` | 是否显示取消按钮 |
| `popVisible` | `boolean` | 否 | - | 是否显示弹出框（受控） |
| `onOpen` | `() => void` | 否 | - | 打开回调 |
| `onClose` | `() => void` | 否 | - | 关闭回调 |
| `onSubmit` | `() => void` | 否 | - | 保存回调 |
| `children` | `ReactNode` | 否 | - | 弹出框内容 |

## 基本用法

### 1. 基础弹出框

最简单的弹出框示例。

```tsx
import { MobilePopup } from '@/registry/components/kesi/mobile-popup'

function Example() {
  return (
    <MobilePopup text="打开弹出框">
      <div className="p-4">
        <p>这是弹出框的内容</p>
      </div>
    </MobilePopup>
  )
}
```

### 2. 带标题的弹出框

添加标题。

```tsx
function Example() {
  return (
    <MobilePopup
      text="查看详情"
      title="详细信息"
    >
      <div className="p-4">
        <p>这里是详细信息内容</p>
      </div>
    </MobilePopup>
  )
}
```

### 3. 不同方向弹出

从不同方向弹出。

```tsx
function Example() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <MobilePopup text="从上弹出" position="top">
        <div className="p-4">从上方弹出</div>
      </MobilePopup>
      <MobilePopup text="从下弹出" position="bottom">
        <div className="p-4">从下方弹出</div>
      </MobilePopup>
      <MobilePopup text="从左弹出" position="left">
        <div className="p-4">从左侧弹出</div>
      </MobilePopup>
      <MobilePopup text="从右弹出" position="right">
        <div className="p-4">从右侧弹出</div>
      </MobilePopup>
    </div>
  )
}
```

### 4. 带操作按钮

显示保存和取消按钮。

```tsx
function Example() {
  return (
    <MobilePopup
      text="编辑"
      title="编辑信息"
      showFormSubmitBtn
      showFormCancelBtn
      onSubmit={() => console.log('保存')}
    >
      <div className="p-4">
        <input
          type="text"
          placeholder="请输入内容"
          className="w-full px-3 py-2 border rounded"
        />
      </div>
    </MobilePopup>
  )
}
```

### 5. 隐藏蒙层

不显示遮罩蒙层。

```tsx
function Example() {
  return (
    <MobilePopup
      text="打开"
      mask={false}
    >
      <div className="p-4">
        <p>无蒙层弹出框</p>
      </div>
    </MobilePopup>
  )
}
```

### 6. 显示关闭按钮

在弹出框右上角显示关闭按钮。

```tsx
function Example() {
  return (
    <MobilePopup
      text="打开"
      title="带关闭按钮"
      showCloseButton
    >
      <div className="p-4">
        <p>点击右上角 X 关闭</p>
      </div>
    </MobilePopup>
  )
}
```

### 7. 受控模式

完全控制弹出框的显示状态。

```tsx
import { useState } from 'react'

function Example() {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <button onClick={() => setVisible(true)}>
        打开弹出框
      </button>
      <MobilePopup
        text=""
        popVisible={visible}
        onOpen={() => setVisible(true)}
        onClose={() => setVisible(false)}
      >
        <div className="p-4">
          <p>受控模式的弹出框</p>
          <button onClick={() => setVisible(false)}>
            关闭
          </button>
        </div>
      </MobilePopup>
    </div>
  )
}
```

## 完整示例

### 表单编辑弹出框

创建一个完整的表单编辑弹出框。

```tsx
import { MobilePopup } from '@/registry/components/kesi/mobile-popup'
import { Input } from '@/registry/components/kesi/input/input'
import { useState } from 'react'

function EditFormPopup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const handleSubmit = () => {
    console.log('提交表单:', formData)
  }

  return (
    <MobilePopup
      text="编辑信息"
      title="编辑用户信息"
      showFormSubmitBtn
      showFormCancelBtn
      onSubmit={handleSubmit}
    >
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            姓名
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="请输入姓名"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            邮箱
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="请输入邮箱"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            电话
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="请输入电话"
          />
        </div>
      </div>
    </MobilePopup>
  )
}
```

### 确认对话框

创建一个确认操作的对话框。

```tsx
import { MobilePopup } from '@/registry/components/kesi/mobile-popup'
import { useState } from 'react'

function ConfirmDialog() {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleConfirm = () => {
    console.log('确认删除')
    setShowConfirm(false)
  }

  return (
    <div>
      <button
        onClick={() => setShowConfirm(true)}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        删除项目
      </button>

      <MobilePopup
        text=""
        popVisible={showConfirm}
        onOpen={() => setShowConfirm(true)}
        onClose={() => setShowConfirm(false)}
        title="确认删除"
        showFormSubmitBtn
        showFormCancelBtn
        onSubmit={handleConfirm}
      >
        <div className="p-6 text-center">
          <p className="text-lg mb-4">
            确定要删除这个项目吗？
          </p>
          <p className="text-sm text-gray-500">
            此操作不可撤销
          </p>
        </div>
      </MobilePopup>
    </div>
  )
}
```

## 注意事项

1. **按钮文字**：`text` 属性设置触发按钮的文字。

2. **位置选择**：`position` 决定弹出框的方向，移动端通常使用 `bottom`。

3. **蒙层**：`mask={false}` 时，点击弹出框外部不会关闭。

4. **按钮优先级**：`showFormSubmitBtn` 和 `showFormCancelBtn` 可同时显示。

5. **内容滚动**：弹出框内容超出高度时会自动显示滚动条。

6. **受控模式**：使用 `popVisible` 实现受控模式时，需要手动控制打开和关闭。

7. **事件顺序**：点击保存按钮时，先触发 `onSubmit`，然后自动关闭弹出框。

8. **自定义触发**：设置 `text=""` 可以隐藏触发按钮，通过 `popVisible` 控制显示。
