# Form.Switch 开关组件

## 简介

`FormSwitch` 是一个开关切换组件，用于在两个互斥状态之间切换。

- **简单直观**：开关形式清晰展示当前状态
- **两种尺寸**：支持标准和小尺寸
- **受控/非受控**：支持受控和非受控两种模式
- **禁用控制**：支持禁用状态
- **自动聚焦**：支持自动获取焦点

## 适用场景

- 设置开关（如通知、暗黑模式等）
- 功能启用/禁用
- 状态切换
- 布尔值配置
- 权限开关

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `checked` | `boolean` | 否 | - | 当前状态（受控模式） |
| `defaultChecked` | `boolean` | 否 | `false` | 默认状态（非受控模式） |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `autoFocus` | `boolean` | 否 | `false` | 自动聚焦 |
| `size` | `'default' \| 'small'` | 否 | `'default'` | 尺寸 |
| `onChange` | `(checked: boolean) => void` | 否 | - | 状态变化回调 |

## 尺寸规格

| 尺寸 | 宽度 | 高度 | 滑块大小 |
|------|------|------|---------|
| `default` | 44px | 24px | 20px |
| `small` | 36px | 20px | 16px |

## 基本用法

### 1. 基础开关

```tsx
import { FormSwitch } from '@/components/kesi/form-switch/form-switch'

function BasicSwitch() {
  return <FormSwitch />
}
```

### 2. 默认开启

```tsx
function SwitchWithDefault() {
  return <FormSwitch defaultChecked />
}
```

### 3. 受控模式

```tsx
import { useState } from 'react'

function ControlledSwitch() {
  const [checked, setChecked] = useState(false)

  return (
    <div>
      <FormSwitch
        checked={checked}
        onChange={setChecked}
      />
      <p className="mt-2">状态: {checked ? '开启' : '关闭'}</p>
    </div>
  )
}
```

### 4. 禁用状态

```tsx
function DisabledSwitch() {
  return (
    <div className="space-y-2">
      <FormSwitch disabled defaultChecked={false} />
      <FormSwitch disabled defaultChecked={true} />
    </div>
  )
}
```

### 5. 小尺寸

```tsx
function SmallSwitch() {
  return <FormSwitch size="small" />
}
```

### 6. 带标签

```tsx
function SwitchWithLabel() {
  const [enabled, setEnabled] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <FormSwitch
        checked={enabled}
        onChange={setEnabled}
      />
      <span className="text-sm">
        {enabled ? '已启用' : '已禁用'}
      </span>
    </div>
  )
}
```

## 完整示例

### 通知设置

```tsx
import { FormSwitch } from '@/components/kesi/form-switch/form-switch'
import { useState } from 'react'

function NotificationSettings() {
  const [emailNotification, setEmailNotification] = useState(true)
  const [pushNotification, setPushNotification] = useState(false)
  const [smsNotification, setSmsNotification] = useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">通知设置</h3>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">邮件通知</p>
          <p className="text-sm text-gray-500">接收邮件提醒</p>
        </div>
        <FormSwitch
          checked={emailNotification}
          onChange={setEmailNotification}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">推送通知</p>
          <p className="text-sm text-gray-500">接收推送消息</p>
        </div>
        <FormSwitch
          checked={pushNotification}
          onChange={setPushNotification}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">短信通知</p>
          <p className="text-sm text-gray-500">接收短信提醒</p>
        </div>
        <FormSwitch
          checked={smsNotification}
          onChange={setSmsNotification}
        />
      </div>
    </div>
  )
}
```

### 暗黑模式切换

```tsx
import { FormSwitch } from '@/components/kesi/form-switch/form-switch'
import { useState } from 'react'

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked)
    // 实际应用中这里会切换主题
    if (checked) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="flex items-center gap-3 p-4 border rounded-lg">
      <span className="text-sm">☀️</span>
      <FormSwitch
        checked={darkMode}
        onChange={toggleDarkMode}
      />
      <span className="text-sm">🌙</span>
    </div>
  )
}
```

### 功能开关

```tsx
import { FormSwitch } from '@/components/kesi/form-switch/form-switch'
import { useState } from 'react'

function FeatureToggles() {
  const [features, setFeatures] = useState({
    betaFeatures: false,
    analytics: true,
    autoSave: true,
    experimental: false
  })

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFeatures(prev => ({ ...prev, [feature]: checked }))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">功能设置</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">测试版功能</p>
            <p className="text-sm text-gray-500">体验最新的测试功能</p>
          </div>
          <FormSwitch
            checked={features.betaFeatures}
            onChange={(checked) => handleFeatureChange('betaFeatures', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">数据分析</p>
            <p className="text-sm text-gray-500">帮助我们改进产品</p>
          </div>
          <FormSwitch
            checked={features.analytics}
            onChange={(checked) => handleFeatureChange('analytics', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">自动保存</p>
            <p className="text-sm text-gray-500">自动保存您的工作</p>
          </div>
          <FormSwitch
            checked={features.autoSave}
            onChange={(checked) => handleFeatureChange('autoSave', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">实验性功能</p>
            <p className="text-sm text-gray-500">尝试实验性功能（可能不稳定）</p>
          </div>
          <FormSwitch
            checked={features.experimental}
            onChange={(checked) => handleFeatureChange('experimental', checked)}
          />
        </div>
      </div>
    </div>
  )
}
```

### 隐私设置

```tsx
import { FormSwitch } from '@/components/kesi/form-switch/form-switch'
import { useState } from 'react'

function PrivacySettings() {
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true
  })

  const handlePrivacyChange = (key: string, checked: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: checked }))
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">隐私设置</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <p className="font-medium">公开资料</p>
            <p className="text-sm text-gray-500">让其他用户可以查看您的资料</p>
          </div>
          <FormSwitch
            checked={privacy.profileVisible}
            onChange={(checked) => handlePrivacyChange('profileVisible', checked)}
          />
        </div>

        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <p className="font-medium">显示邮箱</p>
            <p className="text-sm text-gray-500">在资料中显示您的邮箱地址</p>
          </div>
          <FormSwitch
            checked={privacy.showEmail}
            onChange={(checked) => handlePrivacyChange('showEmail', checked)}
          />
        </div>

        <div className="flex items-center justify-between py-2 border-b">
          <div>
            <p className="font-medium">显示电话</p>
            <p className="text-sm text-gray-500">在资料中显示您的电话号码</p>
          </div>
          <FormSwitch
            checked={privacy.showPhone}
            onChange={(checked) => handlePrivacyChange('showPhone', checked)}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-medium">允许私信</p>
            <p className="text-sm text-gray-500">允许其他用户向您发送私信</p>
          </div>
          <FormSwitch
            checked={privacy.allowMessages}
            onChange={(checked) => handlePrivacyChange('allowMessages', checked)}
          />
        </div>
      </div>
    </div>
  )
}
```

### 状态切换列表

```tsx
import { FormSwitch } from '@/components/kesi/form-switch/form-switch'
import { useState } from 'react'

interface ToggleItem {
  id: string
  name: string
  description: string
  enabled: boolean
}

function ToggleList() {
  const [items, setItems] = useState<ToggleItem[]>([
    { id: '1', name: '项目 A', description: '项目 A 的描述', enabled: true },
    { id: '2', name: '项目 B', description: '项目 B 的描述', enabled: false },
    { id: '3', name: '项目 C', description: '项目 C 的描述', enabled: true }
  ])

  const handleToggle = (id: string, checked: boolean) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, enabled: checked } : item
      )
    )
  }

  return (
    <div className="space-y-2">
      {items.map(item => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500">{item.description}</p>
          </div>
          <FormSwitch
            checked={item.enabled}
            onChange={(checked) => handleToggle(item.id, checked)}
          />
        </div>
      ))}
    </div>
  )
}
```

### 权限管理

```tsx
import { FormSwitch } from '@/components/kesi/form-switch/form-switch'
import { useState } from 'react'

function PermissionManagement() {
  const [permissions, setPermissions] = useState({
    read: true,
    write: false,
    delete: false,
    share: false
  })

  const handlePermissionChange = (key: string, checked: boolean) => {
    setPermissions(prev => ({ ...prev, [key]: checked }))
  }

  const permissionLabels = {
    read: '查看权限',
    write: '编辑权限',
    delete: '删除权限',
    share: '分享权限'
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">权限管理</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(permissions).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm">{permissionLabels[key as keyof typeof permissionLabels]}</span>
            <FormSwitch
              checked={value}
              onChange={(checked) => handlePermissionChange(key, checked)}
              size="small"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 自动保存示例

```tsx
import { FormSwitch } from '@/components/kesi/form-switch/form-switch'
import { useState, useEffect } from 'react'

function AutoSaveExample() {
  const [autoSave, setAutoSave] = useState(true)
  const [content, setContent] = useState('')
  const [lastSaved, setLastSaved] = useState<Date>()

  useEffect(() => {
    if (!autoSave) return

    const timer = setTimeout(() => {
      // 模拟保存操作
      console.log('自动保存:', content)
      setLastSaved(new Date())
    }, 1000)

    return () => clearTimeout(timer)
  }, [content, autoSave])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">文档编辑</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">自动保存</span>
          <FormSwitch
            checked={autoSave}
            onChange={setAutoSave}
            size="small"
          />
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="输入内容..."
        className="w-full h-40 p-3 border rounded-lg resize-none"
      />

      {lastSaved && autoSave && (
        <p className="text-sm text-gray-500">
          最后保存: {lastSaved.toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}
```

## 注意事项

1. **受控与非受控模式**：
   - 提供 `checked` 属性时为受控模式，需要通过 `onChange` 更新
   - 提供 `defaultChecked` 时为非受控模式，组件内部管理状态

2. **状态变化**：
   - `onChange` 回调参数为布尔值，表示新的状态
   - 点击开关会立即触发状态变化

3. **禁用状态**：
   - 禁用时开关无法切换
   - 禁用状态下仍会显示当前状态，但不可交互

4. **尺寸选择**：
   - `default`：标准尺寸，适合大多数场景
   - `small`：小尺寸，适合紧凑布局

5. **自动聚焦**：
   - `autoFocus` 会让开关在组件挂载时自动获取焦点
   - 适合用在需要快速操作的表单中

6. **可访问性**：
   - 开关组件内置无障碍支持
   - 支持键盘操作（空格键切换）

7. **样式定制**：
   - 可以通过 `className` 自定义样式
   - 开关状态通过 `data-state` 属性区分
