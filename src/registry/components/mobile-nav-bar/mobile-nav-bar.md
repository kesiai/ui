> **安装命令**: `npx shadcn@latest add @kesi/mobile-nav-bar`

# MobileNavBar 标题栏

## 简介

`MobileNavBar` 是一个移动端页面标题栏组件，提供返回按钮、标题显示和自定义图标等功能。

- **返回控制**：支持自定义返回按钮文字和行为
- **标题居中**：自动保持标题在视觉中心
- **图标支持**：可自定义左侧图标
- **禁用功能**：可禁用返回功能
- **简洁设计**：符合移动端设计规范

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `title` | `string` | 否 | `'标题栏'` | 标题文字 |
| `back` | `string` | 否 | `''` | 返回区域文字 |
| `backArrow` | `boolean` | 否 | `true` | 是否显示返回箭头 |
| `icon` | `string` | 否 | `''` | 左侧图标 URL |
| `onBack` | `() => void` | 否 | - | 返回按钮点击回调（默认使用浏览器历史回退） |
| `disableBack` | `boolean` | 否 | `false` | 是否禁用返回功能 |

## 基本用法

### 1. 基础标题栏

最简单的标题栏。

```tsx
import { MobileNavBar } from '@/components/kesi/mobile-nav-bar'

function Example() {
  return (
    <MobileNavBar
      title="页面标题"
    />
  )
}
```

### 2. 带返回按钮

显示返回箭头和文字。

```tsx
function Example() {
  return (
    <MobileNavBar
      title="详情页"
      back="返回"
    />
  )
}
```

### 3. 自定义返回行为

自定义返回按钮的点击事件。

```tsx
function Example() {
  const handleBack = () => {
    console.log('自定义返回')
    // 执行自定义逻辑
  }

  return (
    <MobileNavBar
      title="设置"
      back="返回"
      onBack={handleBack}
    />
  )
}
```

### 4. 自定义图标

使用自定义图标替代返回按钮。

```tsx
function Example() {
  return (
    <MobileNavBar
      title="首页"
      icon="https://example.com/logo.png"
    />
  )
}
```

### 5. 禁用返回

禁用返回功能。

```tsx
function Example() {
  return (
    <MobileNavBar
      title="欢迎使用"
      backArrow={false}
      disableBack
    />
  )
}
```

### 6. 仅显示箭头

只显示返回箭头，不显示文字。

```tsx
function Example() {
  return (
    <MobileNavBar
      title="个人中心"
      backArrow={true}
    />
  )
}
```

## 完整示例

### 完整页面布局

创建一个包含标题栏的完整移动端页面。

```tsx
import { MobileNavBar } from '@/components/kesi/mobile-nav-bar'

function UserCenterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNavBar
        title="个人中心"
        back="返回"
      />
      
      <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <h3 className="font-medium mb-2">用户信息</h3>
          <p className="text-gray-600">姓名: 张三</p>
          <p className="text-gray-600">手机: 138****8888</p>
        </div>

        <div className="bg-white p-4 rounded-lg">
          <h3 className="font-medium mb-2">账号设置</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span>修改密码</span>
              <span className="text-gray-400">›</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>隐私设置</span>
              <span className="text-gray-400">›</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 多级导航

实现多级页面导航。

```tsx
import { MobileNavBar } from '@/components/kesi/mobile-nav-bar'
import { useState } from 'react'

function MultiLevelNavigation() {
  const [currentLevel, setCurrentLevel] = useState(1)

  const titles = {
    1: '一级页面',
    2: '二级页面',
    3: '三级页面'
  }

  const handleBack = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1)
    } else {
      window.history.back()
    }
  }

  return (
    <div>
      <MobileNavBar
        title={titles[currentLevel]}
        back="返回"
        onBack={handleBack}
      />
      
      <div className="p-4">
        <p>当前层级: {currentLevel}</p>
        {currentLevel < 3 && (
          <button
            onClick={() => setCurrentLevel(currentLevel + 1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            进入下一级
          </button>
        )}
      </div>
    </div>
  )
}
```

## 注意事项

1. **标题长度**：建议标题文字不超过 10 个字符，超出会被截断。

2. **返回优先级**：当同时设置 `icon` 和 `back`/`backArrow` 时，`icon` 优先显示。

3. **默认行为**：不设置 `onBack` 时，点击返回按钮会调用 `window.history.back()`。

4. **布局平衡**：组件会自动添加右侧占位空间，保持标题视觉居中。

5. **图标尺寸**：建议使用 20x20 像素的图标，图标会显示为 20x20。

6. **禁用状态**：`disableBack={true}` 时，返回按钮会变灰且不可点击。

7. **固定定位**：标题栏通常需要固定在页面顶部，建议配合 CSS 实现。

8. **样式自定义**：可以通过 `className` 自定义样式。
