# Panel 面板

## 导入路径

```tsx
import { Panel } from '@/components/airiot/container-panel/container-panel'
```

## 基础用法

```tsx
import { Panel } from '@/components/airiot/container-panel/container-panel'

function PanelExample() {
  const panels = [
    { title: '面板1' },
    { title: '面板2' }
  ]

  return (
    <Panel panels={panels} accordion={true}>
      {/* 面板内容 */}
    </Panel>
  )
}
```

## Props

- `panels` - 面板配置数组
- `accordion` - 是否手风琴模式 (默认: true)
- `collapsible` - 允许全部折叠 (默认: false)
- `defaultValue` - 默认展开的面板索引
- `value` - 受控模式当前展开的面板
- `onValueChange` - 展开状态变化回调

## 示例

### 多面板配置

```tsx
const panels = [
  {
    title: '用户信息',
    forceRender: true
  },
  {
    title: '权限设置'
  },
  {
    title: '系统配置',
    forceRender: true
  }
]

<Panel
  panels={panels}
  accordion={false} // 允许多个同时展开
  collapsible={true}
  defaultValue={[0, 2]}
>
  <div>用户内容</div>
  <div>权限内容</div>
  <div>配置内容</div>
</Panel>
```

## 注意事项
- 手风琴模式下只能展开一个面板
- forceRender会强制渲染面板内容
- 支持单个或多个默认展开