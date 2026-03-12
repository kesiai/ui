# Modal 弹窗

## 简介

`Modal` 是一个模态对话框容器组件，用于在当前页面之上展示重要信息或收集用户输入。

- **灵活控制**：支持受控和非受控模式，满足不同使用场景
- **可定制尺寸**：支持自定义宽度和高度，适应不同内容需求
- **按钮配置**：内置触发、保存和取消按钮，可灵活配置
- **表单集成**：提供 Modal Context，支持与内部表单组件通信
- **动画效果**：基于 Radix UI，提供流畅的打开/关闭动画

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `title` | `string` | 否 | `'弹窗标题'` | 弹窗标题，显示在顶部 |
| `description` | `string` | 否 | - | 弹窗描述，显示在标题下方 |
| `open` | `boolean` | 否 | - | 受控模式：弹窗是否打开 |
| `onOpenChange` | `(open: boolean) => void` | 否 | - | 打开状态变化回调 |
| `modalWidth` | `number \| string` | 否 | `500` | 弹窗宽度（像素或百分比） |
| `modalHeight` | `number \| string` | 否 | - | 弹窗高度（像素或百分比） |
| `hiddenMask` | `boolean` | 否 | `false` | 是否隐藏遮罩层 |
| `destroyOnClose` | `boolean` | 否 | `false` | 关闭时是否销毁内容 |
| `showTrigger` | `boolean` | 否 | `false` | 是否显示触发按钮 |
| `triggerText` | `string` | 否 | `'打开弹窗'` | 触发按钮文字 |
| `showSubmitButton` | `boolean` | 否 | `false` | 是否显示保存按钮 |
| `showCancelButton` | `boolean` | 否 | `false` | 是否显示取消按钮 |
| `submitText` | `string` | 否 | `'保存'` | 保存按钮文字 |
| `cancelText` | `string` | 否 | `'取消'` | 取消按钮文字 |
| `onSubmit` | `() => void \| Promise<void>` | 否 | - | 保存按钮点击回调 |
| `onCancel` | `() => void` | 否 | - | 取消按钮点击回调 |
| `children` | `ReactNode` | 否 | - | 弹窗内容区域子元素 |

### modalWidth 和 modalHeight

控制弹窗的尺寸。支持数字（像素）或字符串（如 `'500px'`、`'80%'`）。

**示例：**
```tsx
<Modal modalWidth={800} modalHeight="600px">
  {/* 内容 */}
</Modal>
```

### 受控模式

使用 `open` 和 `onOpenChange` 完全控制弹窗的打开/关闭状态。

**示例：**
```tsx
const [open, setOpen] = useState(false)

<Modal open={open} onOpenChange={setOpen}>
  {/* 内容 */}
</Modal>
```

## 基本用法

### 1. 基础弹窗

创建一个带标题的基础弹窗，使用触发按钮打开。

```tsx
import { Modal } from '@/registry/components/airiot/container-modal'
import { useState } from 'react'

function Example() {
  const [open, setOpen] = useState(false)

  return (
    <Modal
      title="系统通知"
      open={open}
      onOpenChange={setOpen}
      showTrigger={true}
      triggerText="查看通知"
    >
      <div className="py-4">
        <p>您有3条未读消息</p>
      </div>
    </Modal>
  )
}
```

### 2. 自定义尺寸

调整弹窗的宽度和高度以适应不同内容。

```tsx
function Example() {
  const [open, setOpen] = useState(false)

  return (
    <Modal
      title="大尺寸弹窗"
      open={open}
      onOpenChange={setOpen}
      modalWidth={800}
      modalHeight={600}
      showTrigger={true}
    >
      <div className="py-4">
        <p>这是一个800x600的弹窗</p>
      </div>
    </Modal>
  )
}
```

### 3. 百分比宽度

使用百分比宽度实现响应式弹窗。

```tsx
function Example() {
  const [open, setOpen] = useState(false)

  return (
    <Modal
      title="响应式弹窗"
      open={open}
      onOpenChange={setOpen}
      modalWidth="80%"
      showTrigger={true}
    >
      <div className="py-4">
        <p>弹窗宽度为视口宽度的80%</p>
      </div>
    </Modal>
  )
}
```

### 4. 带操作按钮

显示底部保存和取消按钮。

```tsx
function Example() {
  const [open, setOpen] = useState(false)

  const handleSubmit = () => {
    console.log('保存操作')
    setOpen(false)
  }

  const handleCancel = () => {
    console.log('取消操作')
    setOpen(false)
  }

  return (
    <Modal
      title="确认操作"
      open={open}
      onOpenChange={setOpen}
      showTrigger={true}
      showSubmitButton={true}
      showCancelButton={true}
      submitText="确认"
      cancelText="放弃"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    >
      <div className="py-4">
        <p>确定要执行此操作吗？</p>
      </div>
    </Modal>
  )
}
```

### 5. 销毁模式

关闭时销毁内容，下次打开时重新创建。

```tsx
function Example() {
  const [open, setOpen] = useState(false)

  return (
    <Modal
      title="数据加载"
      open={open}
      onOpenChange={setOpen}
      destroyOnClose={true}
      showTrigger={true}
    >
      <div className="py-4">
        <p>每次打开都会重新渲染此内容</p>
        <p>当前时间：{new Date().toLocaleString()}</p>
      </div>
    </Modal>
  )
}
```

### 6. 带描述的弹窗

添加描述文字，提供更多上下文信息。

```tsx
function Example() {
  const [open, setOpen] = useState(false)

  return (
    <Modal
      title="删除确认"
      description="此操作无法撤销，请谨慎操作"
      open={open}
      onOpenChange={setOpen}
      showTrigger={true}
      showSubmitButton={true}
      showCancelButton={true}
      submitText="删除"
      cancelText="取消"
    >
      <div className="py-4">
        <p>确定要删除这条记录吗？</p>
      </div>
    </Modal>
  )
}
```

## 完整示例

### 表单弹窗

创建一个包含表单的弹窗，支持验证和提交。

```tsx
import { Modal } from '@/registry/components/airiot/container-modal'
import { Button } from '@/registry/components/airiot/button'
import { useState } from 'react'

function FormModal() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const handleSubmit = async () => {
    // 验证表单
    if (!formData.name || !formData.email) {
      alert('请填写必填项')
      return
    }

    // 提交数据
    console.log('提交表单：', formData)

    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 关闭弹窗
    setOpen(false)
  }

  const handleCancel = () => {
    // 重置表单
    setFormData({ name: '', email: '', phone: '' })
    setOpen(false)
  }

  return (
    <Modal
      title="添加用户"
      description="请填写用户基本信息"
      open={open}
      onOpenChange={setOpen}
      modalWidth={500}
      showTrigger={true}
      triggerText="添加用户"
      showSubmitButton={true}
      showCancelButton={true}
      submitText="提交"
      cancelText="取消"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    >
      <div className="space-y-4 py-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            placeholder="请输入姓名"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            邮箱 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            placeholder="请输入邮箱"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">电话</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            placeholder="请输入电话"
          />
        </div>
      </div>
    </Modal>
  )
}
```

### 确认对话框

创建一个确认操作的对话框，包含警告信息。

```tsx
import { Modal } from '@/registry/components/airiot/container-modal'
import { useState } from 'react'

function ConfirmModal() {
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    // 执行删除操作
    console.log('删除项目')
    setOpen(false)
  }

  return (
    <Modal
      title="删除确认"
      description="您即将删除以下项目"
      open={open}
      onOpenChange={setOpen}
      modalWidth={400}
      showTrigger={true}
      triggerText="删除项目"
      showSubmitButton={true}
      showCancelButton={true}
      submitText="确认删除"
      cancelText="取消"
      onSubmit={handleDelete}
    >
      <div className="py-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-yellow-600 mr-2">⚠️</div>
            <div>
              <p className="font-medium text-yellow-800">警告</p>
              <p className="text-sm text-yellow-700 mt-1">
                删除后数据将无法恢复，请确保已备份重要数据。
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>项目名称：</strong>示例项目</p>
          <p><strong>创建时间：</strong>2024-01-15</p>
          <p><strong>包含数据：</strong>123 条记录</p>
        </div>
      </div>
    </Modal>
  )
}
```

### 详情查看弹窗

创建一个展示详细信息的弹窗。

```tsx
import { Modal } from '@/registry/components/airiot/container-modal'
import { useState } from 'react'

function DetailModal() {
  const [open, setOpen] = useState(false)

  const user = {
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    department: '技术部',
    position: '高级工程师',
    joinDate: '2020-03-15',
    skills: ['React', 'TypeScript', 'Node.js', 'Python']
  }

  return (
    <Modal
      title="用户详情"
      open={open}
      onOpenChange={setOpen}
      modalWidth={600}
      modalHeight={500}
      showTrigger={true}
      triggerText="查看详情"
    >
      <div className="py-4">
        <dl className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <dt className="text-gray-500">姓名</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div className="flex justify-between py-2 border-b">
            <dt className="text-gray-500">邮箱</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div className="flex justify-between py-2 border-b">
            <dt className="text-gray-500">电话</dt>
            <dd className="font-medium">{user.phone}</dd>
          </div>
          <div className="flex justify-between py-2 border-b">
            <dt className="text-gray-500">部门</dt>
            <dd className="font-medium">{user.department}</dd>
          </div>
          <div className="flex justify-between py-2 border-b">
            <dt className="text-gray-500">职位</dt>
            <dd className="font-medium">{user.position}</dd>
          </div>
          <div className="flex justify-between py-2 border-b">
            <dt className="text-gray-500">入职时间</dt>
            <dd className="font-medium">{user.joinDate}</dd>
          </div>
          <div className="py-2">
            <dt className="text-gray-500 mb-2">技能标签</dt>
            <dd className="flex flex-wrap gap-2">
              {user.skills.map(skill => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                >
                  {skill}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </Modal>
  )
}
```

## 注意事项

1. **受控模式**：推荐使用受控模式（`open` + `onOpenChange`）来管理弹窗状态，这样可以更好地控制弹窗的打开和关闭逻辑

2. **数据销毁**：`destroyOnClose` 适合用于包含图表或复杂组件的场景，确保每次打开都是全新状态，但会丢失未保存的输入

3. **表单集成**：弹窗内置了 `ModalWigetContext`，可以与表单组件（如 form-container）集成，自动处理表单验证和提交状态

4. **高度限制**：当设置 `modalHeight` 时，内容区域会出现滚动条，建议根据内容量合理设置高度，避免内容被截断

5. **异步提交**：`onSubmit` 支持 Promise，可以在提交函数中执行异步操作，按钮会自动显示加载状态

6. **宽度建议**：推荐使用固定宽度（如 400、500、600、800）或百分比（如 '80%'），避免使用过小的宽度导致内容显示不全
