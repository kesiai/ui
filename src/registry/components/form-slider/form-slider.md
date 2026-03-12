# Form.Slider 滑动输入条组件

## 简介

`FormSlider` 是一个功能丰富的滑动输入条组件，支持单值和范围选择。

- **双模式**：支持单滑块和双滑块（范围选择）
- **刻度标记**：支持自定义刻度标记
- **方向支持**：支持水平和垂直方向
- **步长控制**：可设置步长和吸附到刻度
- **受控/非受控**：支持受控和非受控两种模式
- **反向坐标**：支持反向坐标轴

## 适用场景

- 音量调节
- 亮度调节
- 价格范围选择
- 进度控制
- 数值快速调整
- 范围筛选

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `number \| number[]` | 否 | - | 当前值（受控模式） |
| `defaultValue` | `number \| number[]` | 否 | `10` | 默认值（非受控模式） |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `readOnly` | `boolean` | 否 | `false` | 是否只读 |
| `min` | `number` | 否 | `0` | 最小值 |
| `max` | `number` | 否 | `100` | 最大值 |
| `step` | `number` | 否 | `1` | 步长 |
| `range` | `boolean` | 否 | `false` | 双滑块模式（范围选择） |
| `dots` | `boolean` | 否 | `false` | 拖拽到刻度上（步长吸附） |
| `marks` | `Array<{ number: number; label: string }>` | 否 | - | 刻度标记 |
| `vertical` | `boolean` | 否 | `false` | 垂直方向 |
| `reverse` | `boolean` | 否 | `false` | 反向坐标轴 |
| `onChange` | `(value: number \| number[]) => void` | 否 | - | 值变化回调 |
| `onAfterChange` | `(value: number \| number[]) => void` | 否 | - | 拖拽结束回调 |

## 基本用法

### 1. 基础滑块

```tsx
import { FormSlider } from '@/registry/components/airiot/form-slider/form-slider'

function BasicSlider() {
  return <FormSlider />
}
```

### 2. 设置范围

```tsx
function SliderWithRange() {
  return (
    <FormSlider
      min={0}
      max={200}
      defaultValue={50}
    />
  )
}
```

### 3. 设置步长

```tsx
function SliderWithStep() {
  return (
    <FormSlider
      min={0}
      max={10}
      step={0.5}
      defaultValue={5}
    />
  )
}
```

### 4. 双滑块模式

```tsx
function RangeSlider() {
  return (
    <FormSlider
      range
      defaultValue={[20, 80]}
    />
  )
}
```

### 5. 带刻度标记

```tsx
function SliderWithMarks() {
  const marks = [
    { number: 0, label: '0°C' },
    { number: 25, label: '25°C' },
    { number: 50, label: '50°C' },
    { number: 75, label: '75°C' },
    { number: 100, label: '100°C' }
  ]

  return (
    <FormSlider
      marks={marks}
      defaultValue={50}
    />
  )
}
```

### 6. 受控模式

```tsx
import { useState } from 'react'

function ControlledSlider() {
  const [value, setValue] = useState(50)

  return (
    <div>
      <FormSlider
        value={value}
        onChange={setValue}
      />
      <p className="mt-2">当前值: {value}</p>
    </div>
  )
}
```

### 7. 禁用状态

```tsx
function DisabledSlider() {
  return (
    <FormSlider
      defaultValue={50}
      disabled
    />
  )
}
```

### 8. 垂直方向

```tsx
function VerticalSlider() {
  return (
    <div style={{ height: '200px' }}>
      <FormSlider
        vertical
        defaultValue={50}
      />
    </div>
  )
}
```

### 9. 反向坐标轴

```tsx
function ReverseSlider() {
  return (
    <FormSlider
      reverse
      defaultValue={80}
    />
  )
}
```

### 10. 吸附到刻度

```tsx
function DotsSlider() {
  return (
    <FormSlider
      min={0}
      max={100}
      step={10}
      dots
      defaultValue={30}
    />
  )
}
```

## 完整示例

### 音量控制

```tsx
import { FormSlider } from '@/registry/components/airiot/form-slider/form-slider'
import { useState } from 'react'

function VolumeControl() {
  const [volume, setVolume] = useState(50)

  const marks = [
    { number: 0, label: '🔇' },
    { number: 50, label: '🔉' },
    { number: 100, label: '🔊' }
  ]

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">音量</span>
        <span className="text-sm text-gray-600">{volume}%</span>
      </div>
      <FormSlider
        value={volume}
        onChange={setVolume}
        marks={marks}
      />
    </div>
  )
}
```

### 价格范围选择

```tsx
import { FormSlider } from '@/registry/components/airiot/form-slider/form-slider'
import { useState } from 'react'

function PriceRange() {
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 500])

  const marks = [
    { number: 0, label: '¥0' },
    { number: 250, label: '¥250' },
    { number: 500, label: '¥500' },
    { number: 750, label: '¥750' },
    { number: 1000, label: '¥1000' }
  ]

  return (
    <div className="w-full max-w-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">价格范围</h3>
        <span className="text-sm text-gray-600">
          ¥{priceRange[0]} - ¥{priceRange[1]}
        </span>
      </div>
      <FormSlider
        range
        min={0}
        max={1000}
        step={50}
        marks={marks}
        value={priceRange}
        onChange={setPriceRange}
      />
    </div>
  )
}
```

### 亮度调节

```tsx
import { FormSlider } from '@/registry/components/airiot/form-slider/form-slider'
import { useState } from 'react'

function BrightnessControl() {
  const [brightness, setBrightness] = useState(70)

  return (
    <div className="p-4 border rounded-lg w-full max-w-md">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">🌑</span>
        <FormSlider
          value={brightness}
          onChange={setBrightness}
          className="flex-1"
        />
        <span className="text-xl">☀️</span>
      </div>
      <p className="text-center text-sm text-gray-600">
        亮度: {brightness}%
      </p>
    </div>
  )
}
```

### 进度控制

```tsx
import { FormSlider } from '@/registry/components/airiot/form-slider/form-slider'
import { useState } from 'react'

function ProgressControl() {
  const [progress, setProgress] = useState(30)

  const marks = [
    { number: 0, label: '0%' },
    { number: 25, label: '25%' },
    { number: 50, label: '50%' },
    { number: 75, label: '75%' },
    { number: 100, label: '100%' }
  ]

  const handleChange = (value: number | number[]) => {
    const numValue = Array.isArray(value) ? value[0] : value
    setProgress(numValue)
  }

  const handleAfterChange = (value: number | number[]) => {
    const numValue = Array.isArray(value) ? value[0] : value
    console.log('拖拽结束，最终值:', numValue)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          播放进度
        </label>
        <FormSlider
          value={progress}
          onChange={handleChange}
          onAfterChange={handleAfterChange}
          marks={marks}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>0:00</span>
        <span>{Math.floor(progress / 100 * 180)}:00</span>
        <span>3:00</span>
      </div>
    </div>
  )
}
```

### 年龄范围筛选

```tsx
import { FormSlider } from '@/registry/components/airiot/form-slider/form-slider'
import { useState } from 'react'

function AgeRangeFilter() {
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 65])

  const marks = [
    { number: 0, label: '0' },
    { number: 18, label: '18' },
    { number: 30, label: '30' },
    { number: 50, label: '50' },
    { number: 65, label: '65' },
    { number: 100, label: '100+' }
  ]

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">年龄范围</h3>
      <p className="text-sm text-gray-600 mb-4">
        筛选年龄在 {ageRange[0]} - {ageRange[1]} 岁之间
      </p>
      <FormSlider
        range
        min={0}
        max={100}
        marks={marks}
        value={ageRange}
        onChange={setAgeRange}
        dots
      />
    </div>
  )
}
```

### 温度调节

```tsx
import { FormSlider } from '@/registry/components/airiot/form-slider/form-slider'
import { useState } from 'react'

function TemperatureControl() {
  const [temperature, setTemperature] = useState(22)

  const marks = [
    { number: 16, label: '16°C' },
    { number: 20, label: '20°C' },
    { number: 24, label: '24°C' },
    { number: 28, label: '28°C' },
    { number: 32, label: '32°C' }
  ]

  const getTemperatureColor = (temp: number) => {
    if (temp < 18) return 'text-blue-600'
    if (temp < 24) return 'text-green-600'
    if (temp < 28) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">温度控制</h3>
      <FormSlider
        min={16}
        max={32}
        step={0.5}
        marks={marks}
        value={temperature}
        onChange={setTemperature}
        dots
      />
      <div className="mt-4 text-center">
        <span className={`text-4xl font-bold ${getTemperatureColor(temperature)}`}>
          {temperature}°C
        </span>
      </div>
    </div>
  )
}
```

### 多个滑块

```tsx
import { FormSlider } from '@/registry/components/airiot/form-slider/form-slider'
import { useState } from 'react'

function MultipleSliders() {
  const [bass, setBass] = useState(50)
  const [mid, setMid] = useState(50)
  const [treble, setTreble] = useState(50)

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h3 className="text-lg font-semibold mb-6">音频均衡器</h3>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm">低音 (Bass)</label>
            <span className="text-sm text-gray-400">{bass}</span>
          </div>
          <FormSlider
            value={bass}
            onChange={setBass}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm">中音 (Mid)</label>
            <span className="text-sm text-gray-400">{mid}</span>
          </div>
          <FormSlider
            value={mid}
            onChange={setMid}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm">高音 (Treble)</label>
            <span className="text-sm text-gray-400">{treble}</span>
          </div>
          <FormSlider
            value={treble}
            onChange={setTreble}
          />
        </div>
      </div>
    </div>
  )
}
```

### 垂直滑块组

```tsx
import { FormSlider } from '@/registry/components/airiot/form-slider/form-slider'
import { useState } from 'react'

function VerticalSliders() {
  const [values, setValues] = useState([70, 50, 30])

  return (
    <div className="flex gap-8 items-end p-6 border rounded-lg" style={{ height: '250px' }}>
      {values.map((value, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium">{value}</span>
          <div style={{ height: '200px' }}>
            <FormSlider
              vertical
              value={value}
              onChange={(v) => {
                const newValues = [...values]
                newValues[index] = Array.isArray(v) ? v[0] : v
                setValues(newValues)
              }}
            />
          </div>
          <span className="text-sm text-gray-600">通道 {index + 1}</span>
        </div>
      ))}
    </div>
  )
}
```

### 实时预览

```tsx
import { FormSlider } from '@/registry/components/airiot/form-slider/form-slider'
import { useState } from 'react'

function SliderWithPreview() {
  const [size, setSize] = useState(100)
  const [opacity, setOpacity] = useState(100)
  const [rotation, setRotation] = useState(0)

  return (
    <div className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">实时预览</h3>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              大小: {size}px
            </label>
            <FormSlider
              min={50}
              max={200}
              value={size}
              onChange={setSize}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              透明度: {opacity}%
            </label>
            <FormSlider
              min={0}
              max={100}
              value={opacity}
              onChange={setOpacity}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              旋转: {rotation}°
            </label>
            <FormSlider
              min={0}
              max={360}
              value={rotation}
              onChange={setRotation}
            />
          </div>
        </div>

        <div className="flex items-center justify-center bg-gray-100 rounded-lg">
          <div
            className="bg-blue-500 rounded flex items-center justify-center text-white"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity / 100,
              transform: `rotate(${rotation}deg)`
            }}
          >
            预览
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 注意事项

1. **受控与非受控模式**：
   - 提供 `value` 属性时为受控模式，需要通过 `onChange` 更新
   - 提供 `defaultValue` 时为非受控模式，组件内部管理状态
   - 范围模式下 `defaultValue` 应该是数组 `[min, max]`

2. **单值与范围模式**：
   - `range=false`：单滑块模式，返回单个数值
   - `range=true`：双滑块模式，返回数值数组 `[min, max]`

3. **步长控制**：
   - `step` 设置滑块移动的最小单位
   - `dots=true` 时，滑块会自动吸附到最近的步长位置

4. **值的变化**：
   - `onChange`：拖拽过程中实时触发
   - `onAfterChange`：拖拽结束时触发（松开鼠标）

5. **刻度标记**：
   - `marks` 数组的 `number` 必须在 `min` 和 `max` 之间
   - 刻度标记会显示对应的标签文本

6. **方向控制**：
   - `vertical=false`：水平方向（默认）
   - `vertical=true`：垂直方向
   - 使用垂直方向时，需要设置父容器高度

7. **反向坐标**：
   - `reverse=true` 时，滑块从右到左或从下到上
   - 与 `vertical` 可以组合使用

8. **禁用与只读**：
   - `disabled`：完全禁用，滑块不可移动
   - `readOnly`：只读模式，滑块不可移动但保持交互反馈

9. **边界值**：
   - 确保 `min < max`
   - 范围模式下，第一个值必须小于第二个值

10. **性能优化**：
    - 避免在 `onChange` 中执行复杂计算
    - 使用 `onAfterChange` 处理需要延迟的操作
