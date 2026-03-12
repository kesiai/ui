# Popover 浮层

## 导入路径

```tsx
import { Popover } from '@/components/airiot/container-popover/container-popover'
```

## 基础用法

```tsx
import { Popover } from '@/components/airiot/container-popover/container-popover'

function PopoverExample() {
  return (
    <Popover
      buttonName="点击触发"
      placement="bottom"
      width={200}
      height={100}
    >
      {/* 浮层内容 */}
    </Popover>
  )
}
```

## Props

- `buttonName` - 按钮文字
- `hiddenBtn` - 隐藏按钮 (默认: false)
- `disable` - 禁用状态 (默认: false)
- `trigger` - 触发方式 ('hover', 'click')
- `placement` - 位置 ('top', 'bottom', 'left', 'right')
- `width` - 宽度
- `height` - 高度
- `open` - 是否打开
- `onOpenChange` - 打开状态变化回调

## 示例

### 悬停触发

```tsx
<Popover
  buttonName="悬停我"
  trigger="hover"
  placement="right"
  width={300}
>
  <div>悬停显示的内容</div>
</Popover>
```

### 自定义触发按钮

```tsx
<Popover
  hiddenBtn={true}
  trigger="click"
  placement="top"
>
  <div>点击显示的内容</div>
</Popover>
```

## 注意事项
- 支持点击和悬停两种触发方式
- 可以隐藏自定义按钮
- 支持四个方向的位置配置