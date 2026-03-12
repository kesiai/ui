# Tabs 标签页

## 导入路径

```tsx
import { Tabs } from '@/components/airiot/container-tabs/container-tabs'
```

## 基础用法

```tsx
import { Tabs } from '@/components/airiot/container-tabs/container-tabs'

function TabsExample() {
  const tabs = [
    { title: '标签1' },
    { title: '标签2' }
  ]

  return (
    <Tabs tabs={tabs} defaultValue="tab1">
      {/* 标签内容 */}
    </Tabs>
  )
}
```

## Props

- `tabs` - 标签配置数组
- `defaultValue` - 默认激活的标签值
- `value` - 受控模式当前激活的标签值
- `onValueChange` - 激活状态变化回调
- `orientation` - 标签位置 ('top', 'right', 'bottom', 'left')
- `variant` - 标签样式 ('default', 'underline', 'pills')

## 示例

### 多标签配置

```tsx
const tabs = [
  {
    title: '用户管理',
    icon: '/icons/user.svg'
  },
  {
    title: '权限设置',
    selectedIcon: '/icons/selected-user.svg'
  },
  {
    title: '系统配置',
    forceRender: true
  }
]

<Tabs
  tabs={tabs}
  defaultValue="user"
  orientation="top"
>
  <div>用户内容</div>
  <div>权限内容</div>
  <div>配置内容</div>
</Tabs>
```

## 注意事项
- 标签值会自动转换为字符串
- 支持图标配置
- forceRender会强制渲染标签内容