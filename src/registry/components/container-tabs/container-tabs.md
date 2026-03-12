# Tabs 标签页

## 简介

`Tabs` 是一个标签页容器组件，用于在多个内容面板之间切换展示。

- **灵活布局**：支持上下左右四个方向的标签布局
- **多种样式**：提供下划线页签和卡片式页签两种样式
- **图标支持**：每个标签可配置普通和选中状态的图标
- **性能优化**：支持强制渲染和隐藏销毁模式
- **受控模式**：支持受控和非受控两种使用方式

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `tabs` | `TabConfig[]` | 是 | `[]` | 标签配置数组 |
| `defaultValue` | `string` | 否 | `'tab-0'` | 默认激活的标签值 |
| `value` | `string` | 否 | - | 受控模式：当前激活的标签值 |
| `onValueChange` | `(value: string) => void` | 否 | - | 激活状态变化回调 |
| `orientation` | `'top' \| 'bottom' \| 'left' \| 'right'` | 否 | `'top'` | 标签位置 |
| `variant` | `'line' \| 'card'` | 否 | `'line'` | 标签样式 |
| `destroyInactiveTabPane` | `boolean` | 否 | `false` | 是否销毁未激活的标签内容 |
| `children` | `ReactNode` | 否 | - | 标签内容子元素 |

### TabConfig

单个标签的配置对象。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `title` | `string` | 是 | - | 标签标题 |
| `icon` | `string` | 否 | - | 标签图标 URL |
| `selectedIcon` | `string` | 否 | - | 选中状态的图标 URL |
| `forceRender` | `boolean` | 否 | `false` | 是否强制渲染（即使未展开也渲染） |

### destroyInactiveTabPane

启用后，未激活的标签内容会被完全销毁，切换时重新创建。适合包含图表等需要重新渲染的组件。

**示例：**
```tsx
<Tabs
  tabs={[{ title: '标签1' }, { title: '标签2' }]}
  destroyInactiveTabPane={true}
>
  {/* 内容 */}
</Tabs>
```

## 基本用法

### 1. 基础标签页

创建一个简单的顶部标签页。

```tsx
import { Tabs } from '@/registry/components/airiot/container-tabs'
import { useState } from 'react'

function Example() {
  const [value, setValue] = useState('tab-0')

  return (
    <Tabs
      tabs={[
        { title: '概览' },
        { title: '详情' },
        { title: '设置' }
      ]}
      value={value}
      onValueChange={setValue}
    >
      <div className="p-4">概览内容</div>
      <div className="p-4">详情内容</div>
      <div className="p-4">设置内容</div>
    </Tabs>
  )
}
```

### 2. 左侧标签布局

将标签放置在左侧，适合更多标签的场景。

```tsx
function Example() {
  const [value, setValue] = useState('tab-0')

  return (
    <Tabs
      tabs={[
        { title: '用户管理' },
        { title: '角色管理' },
        { title: '权限管理' },
        { title: '系统设置' }
      ]}
      orientation="left"
      value={value}
      onValueChange={setValue}
    >
      <div className="p-4">用户管理内容</div>
      <div className="p-4">角色管理内容</div>
      <div className="p-4">权限管理内容</div>
      <div className="p-4">系统设置内容</div>
    </Tabs>
  )
}
```

### 3. 卡片式标签

使用卡片式样式的标签页。

```tsx
function Example() {
  const [value, setValue] = useState('tab-0')

  return (
    <Tabs
      tabs={[
        { title: '首页' },
        { title: '产品' },
        { title: '关于' }
      ]}
      variant="card"
      value={value}
      onValueChange={setValue}
    >
      <div className="p-4">首页内容</div>
      <div className="p-4">产品内容</div>
      <div className="p-4">关于内容</div>
    </Tabs>
  )
}
```

### 4. 带图标的标签

为标签添加图标，增强视觉效果。

```tsx
function Example() {
  const [value, setValue] = useState('tab-0')

  return (
    <Tabs
      tabs={[
        {
          title: '首页',
          icon: '/icons/home.png',
          selectedIcon: '/icons/home-active.png'
        },
        {
          title: '消息',
          icon: '/icons/message.png',
          selectedIcon: '/icons/message-active.png'
        },
        {
          title: '设置',
          icon: '/icons/settings.png',
          selectedIcon: '/icons/settings-active.png'
        }
      ]}
      value={value}
      onValueChange={setValue}
    >
      <div className="p-4">首页内容</div>
      <div className="p-4">消息内容</div>
      <div className="p-4">设置内容</div>
    </Tabs>
  )
}
```

### 5. 隐藏销毁模式

启用隐藏销毁，适合包含图表的标签页。

```tsx
function Example() {
  const [value, setValue] = useState('tab-0')

  return (
    <Tabs
      tabs={[
        { title: '折线图' },
        { title: '柱状图' },
        { title: '饼图' }
      ]}
      destroyInactiveTabPane={true}
      value={value}
      onValueChange={setValue}
    >
      <div className="p-4">
        {/* 折线图组件 */}
      </div>
      <div className="p-4">
        {/* 柱状图组件 */}
      </div>
      <div className="p-4">
        {/* 饼图组件 */}
      </div>
    </Tabs>
  )
}
```

### 6. 底部标签布局

将标签放置在底部。

```tsx
function Example() {
  const [value, setValue] = useState('tab-0')

  return (
    <Tabs
      tabs={[
        { title: '标签1' },
        { title: '标签2' },
        { title: '标签3' }
      ]}
      orientation="bottom"
      value={value}
      onValueChange={setValue}
    >
      <div className="p-4">内容1</div>
      <div className="p-4">内容2</div>
      <div className="p-4">内容3</div>
    </Tabs>
  )
}
```

### 7. 右侧标签布局

将标签放置在右侧。

```tsx
function Example() {
  const [value, setValue] = useState('tab-0')

  return (
    <Tabs
      tabs={[
        { title: '选项A' },
        { title: '选项B' },
        { title: '选项C' }
      ]}
      orientation="right"
      value={value}
      onValueChange={setValue}
    >
      <div className="p-4">选项A内容</div>
      <div className="p-4">选项B内容</div>
      <div className="p-4">选项C内容</div>
    </Tabs>
  )
}
```

## 完整示例

### 数据分析面板

创建一个包含多个图表标签的数据分析面板。

```tsx
import { Tabs } from '@/registry/components/airiot/container-tabs'
import { useState } from 'react'

function AnalyticsPanel() {
  const [value, setValue] = useState('tab-0')

  return (
    <div className="w-full h-full">
      <Tabs
        tabs={[
          { title: '流量分析', icon: '/icons/traffic.png' },
          { title: '用户分析', icon: '/icons/users.png' },
          { title: '转化分析', icon: '/icons/conversion.png' },
          { title: '收入分析', icon: '/icons/revenue.png' }
        ]}
        orientation="left"
        destroyInactiveTabPane={true}
        value={value}
        onValueChange={setValue}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">流量分析</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded">
              <div className="text-2xl font-bold">12,345</div>
              <div className="text-sm text-gray-600">今日访问量</div>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <div className="text-2xl font-bold">+23%</div>
              <div className="text-sm text-gray-600">环比增长</div>
            </div>
          </div>
          <div className="bg-gray-50 h-64 rounded flex items-center justify-center">
            <p className="text-gray-400">流量趋势图表区域</p>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">用户分析</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 p-4 rounded">
              <div className="text-2xl font-bold">8,901</div>
              <div className="text-sm text-gray-600">总用户数</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <div className="text-2xl font-bold">1,234</div>
              <div className="text-sm text-gray-600">新增用户</div>
            </div>
            <div className="bg-pink-50 p-4 rounded">
              <div className="text-2xl font-bold">67%</div>
              <div className="text-sm text-gray-600">活跃率</div>
            </div>
          </div>
          <div className="bg-gray-50 h-64 rounded flex items-center justify-center">
            <p className="text-gray-400">用户分布图表区域</p>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">转化分析</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <span>注册转化率</span>
              <span className="font-bold">12.5%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <span>购买转化率</span>
              <span className="font-bold">8.3%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <span>复购率</span>
              <span className="font-bold">23.7%</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">收入分析</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded">
              <div className="text-2xl font-bold">¥123,456</div>
              <div className="text-sm text-gray-600">本月收入</div>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <div className="text-2xl font-bold">+15%</div>
              <div className="text-sm text-gray-600">同比增长</div>
            </div>
          </div>
          <div className="bg-gray-50 h-64 rounded flex items-center justify-center">
            <p className="text-gray-400">收入趋势图表区域</p>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
```

### 用户设置页面

创建一个多标签的设置页面。

```tsx
import { Tabs } from '@/registry/components/airiot/container-tabs'
import { useState } from 'react'

function SettingsPage() {
  const [value, setValue] = useState('tab-0')

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs
        tabs={[
          { title: '基本资料' },
          { title: '账号安全' },
          { title: '通知设置' },
          { title: '隐私设置' }
        ]}
        variant="line"
        value={value}
        onValueChange={setValue}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">基本资料</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">用户名</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                defaultValue="zhangsan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">邮箱</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded"
                defaultValue="zhangsan@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">个人简介</label>
              <textarea
                className="w-full px-3 py-2 border rounded"
                rows={4}
                defaultValue="这是一段个人简介"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">账号安全</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <div className="font-medium">登录密码</div>
                <div className="text-sm text-gray-500">上次修改：30天前</div>
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                修改密码
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded">
              <div>
                <div className="font-medium">两步验证</div>
                <div className="text-sm text-gray-500">已启用</div>
              </div>
              <button className="px-4 py-2 border rounded">
                管理
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">通知设置</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">邮件通知</div>
                <div className="text-sm text-gray-500">接收重要更新邮件</div>
              </div>
              <input type="checkbox" defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">短信通知</div>
                <div className="text-sm text-gray-500">接收验证码和安全提醒</div>
              </div>
              <input type="checkbox" defaultChecked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">推送通知</div>
                <div className="text-sm text-gray-500">接收浏览器推送通知</div>
              </div>
              <input type="checkbox" defaultChecked={false} />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">隐私设置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">谁可以查看我的资料</label>
              <select className="w-full px-3 py-2 border rounded">
                <option>所有人</option>
                <option>仅好友</option>
                <option>仅自己</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">是否显示在线状态</label>
              <select className="w-full px-3 py-2 border rounded">
                <option>显示</option>
                <option>隐藏</option>
              </select>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
```

## 注意事项

1. **标签值格式**：标签值自动格式为 `tab-{index}`（从0开始），在 `value` 和 `defaultValue` 中使用此格式

2. **内容顺序**：`children` 中的内容元素顺序必须与 `tabs` 数组顺序一一对应

3. **销毁模式**：启用 `destroyInactiveTabPane` 后，未激活的标签内容会被完全销毁，适合包含图表等需要重新渲染的组件，但会丢失滚动位置和输入状态

4. **强制渲染**：在 `TabConfig` 中设置 `forceRender: true` 可以让标签内容即使未激活也保留在 DOM 中，适合需要保持状态的场景

5. **方向适配**：左右布局（`left`/`right`）适合标签较多的情况，上下布局（`top`/`bottom`）更适合少量标签

6. **样式选择**：`line` 样式更简洁，适合大多数场景；`card` 样式更突出，适合需要强调标签切换的场景

7. **图标尺寸**：图标建议尺寸为 14x14 像素，过大的图标会影响标签显示效果
