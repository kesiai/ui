# Status 状态指示器

## 简介

`Status` 是一个状态指示器组件，根据当前值显示不同的状态样式。

- **多种匹配模式**：支持固定值匹配和范围匹配
- **丰富视觉效果**：自定义背景色、文字色、背景图片
- **动画提示**：状态切换时支持闪烁动画
- **声音提示**：可配置状态切换时播放音频
- **灵活尺寸**：支持自定义宽高

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `string \| number \| boolean` | 否 | - | 当前值，用于匹配状态 |
| `statuses` | `StatusConfig[]` | 否 | `[]` | 状态配置数组 |
| `blinkOnStateChange` | `boolean` | 否 | `false` | 状态切换时是否闪烁 |
| `width` | `string \| number` | 否 | - | 宽度 |
| `height` | `string \| number` | 否 | - | 高度 |

### StatusConfig

状态配置对象：

```typescript
interface StatusConfig {
  name: string                    // 状态名称
  activeType?: 'value' | 'range'  // 激活类型
  activeValue?: string | number | boolean  // 匹配的固定值
  minValue?: number               // 范围最小值（包含）
  maxValue?: number               // 范围最大值（不包含）
  text?: string                   // 显示文字
  bgColor?: string                // 背景色
  textColor?: string              // 文字颜色
  backgroundImage?: string        // 背景图片
  audioSrc?: string               // 音频文件 URL
}
```

## 基本用法

### 1. 固定值匹配

根据字符串值匹配状态。

```tsx
import { Status } from '@/components/kesi/status'

function Example() {
  const statuses = [
    { name: '正常', activeType: 'value', activeValue: 'normal', text: '正常', bgColor: '#22c55e', textColor: '#fff' },
    { name: '警告', activeType: 'value', activeValue: 'warning', text: '警告', bgColor: '#f59e0b', textColor: '#fff' },
    { name: '错误', activeType: 'value', activeValue: 'error', text: '错误', bgColor: '#ef4444', textColor: '#fff' }
  ]

  return <Status value="normal" statuses={statuses} width={120} height={60} />
}
```

### 2. 范围匹配

根据数值范围匹配状态。

```tsx
function Example() {
  const statuses = [
    { name: '正常', activeType: 'range', minValue: 0, maxValue: 60, text: '正常', bgColor: '#22c55e', textColor: '#fff' },
    { name: '警告', activeType: 'range', minValue: 60, maxValue: 80, text: '警告', bgColor: '#f59e0b', textColor: '#fff' },
    { name: '危险', activeType: 'range', minValue: 80, maxValue: 100, text: '危险', bgColor: '#ef4444', textColor: '#fff' }
  ]

  return <Status value={75} statuses={statuses} width={120} height={60} />
}
```

### 3. 闪烁动画

状态切换时显示闪烁效果。

```tsx
function Example() {
  const [value, setValue] = useState('normal')
  const statuses = [
    { name: '正常', activeValue: 'normal', text: '正常', bgColor: '#22c55e', textColor: '#fff' },
    { name: '警告', activeValue: 'warning', text: '警告', bgColor: '#f59e0b', textColor: '#fff' }
  ]

  return (
    <div>
      <button onClick={() => setValue(value === 'normal' ? 'warning' : 'normal')}>
        切换状态
      </button>
      <Status value={value} statuses={statuses} blinkOnStateChange width={120} height={60} />
    </div>
  )
}
```

### 4. 背景图片

使用背景图片代替纯色背景。

```tsx
function Example() {
  const statuses = [
    { name: '开启', activeValue: true, backgroundImage: '/images/on.png' },
    { name: '关闭', activeValue: false, backgroundImage: '/images/off.png' }
  ]

  return <Status value={true} statuses={statuses} width={100} height={100} />
}
```

## 注意事项

1. **匹配优先级**：遍历 `statuses` 数组，找到第一个匹配的状态即停止。
2. **范围匹配**：使用左闭右开区间 `[minValue, maxValue)`。
3. **未定义值**：`value` 为 `undefined` 或 `null` 时，匹配 `activeValue` 为 `'false'`、`'0'` 或 `false` 的状态。
4. **音频播放**：状态切换时会自动播放配置的音频，需要用户交互才能播放（浏览器限制）。
5. **闪烁动画**：闪烁持续 2 秒（3 次闪烁），可通过 CSS 自定义。
