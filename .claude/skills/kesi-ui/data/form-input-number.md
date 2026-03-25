# Form.InputNumber 数字输入框

## 简介

`FormInputNumber` 是一个用于输入数字的表单组件，提供数字验证、精度控制和格式化显示功能。

- **数值验证**：支持最小值、最大值限制，自动验证并修正超出范围的输入
- **精度控制**：支持小数位数和数值精度配置，失焦时自动格式化
- **多种样式**：提供 default、outline、filled、ghost 四种样式变体
- **尺寸灵活**：支持 sm、md、lg 三种尺寸选择
- **丰富配置**：支持前缀、后缀、单位、前后置标签等自定义选项

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `number` | 否 | - | 当前值（受控模式） |
| `defaultValue` | `number` | 否 | - | 默认值（非受控模式） |
| `placeholder` | `string` | 否 | `'请输入数字'` | 占位提示文本 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `readOnly` | `boolean` | 否 | `false` | 是否只读 |
| `bordered` | `boolean` | 否 | `true` | 是否显示边框 |
| `autoFocus` | `boolean` | 否 | `false` | 是否自动聚焦 |
| `min` | `number` | 否 | - | 最小值限制 |
| `max` | `number` | 否 | - | 最大值限制 |
| `decimal` | `number` | 否 | `null` | 小数位数（优先于 precision） |
| `precision` | `number` | 否 | - | 数值精度 |
| `step` | `number` | 否 | `1` | 步长 |
| `unit` | `string` | 否 | `''` | 单位文本 |
| `prefix` | `ReactNode` | 否 | - | 前缀内容 |
| `suffix` | `ReactNode` | 否 | - | 后缀内容 |
| `addonBefore` | `ReactNode` | 否 | - | 前置标签 |
| `addonAfter` | `ReactNode` | 否 | - | 后置标签 |
| `variant` | `'default' \| 'outline' \| 'filled' \| 'ghost'` | 否 | `'default'` | 样式变体 |
| `size` | `'sm' \| 'md' \| 'lg'` | 否 | `'md'` | 尺寸 |
| `onChange` | `(value: number \| undefined, event: ChangeEvent) => void` | 否 | - | 值变化回调 |
| `onBlur` | `(event: FocusEvent) => void` | 否 | - | 失焦回调 |
| `onFocus` | `(event: FocusEvent) => void` | 否 | - | 聚焦回调 |
| `onPressEnter` | `(event: KeyboardEvent) => void` | 否 | - | 回车键回调 |
| `onInput` | `(event: ChangeEvent) => void` | 否 | - | 输入回调 |

## 基本用法

### 1. 基础数字输入

最简单的数字输入框，支持基本的数值输入。

```tsx
import { FormInputNumber } from '@/components/kesi/form-input-number'

function Example() {
  return (
    <FormInputNumber
      placeholder="请输入数字"
    />
  )
}
```

### 2. 带单位的前缀后缀

使用前缀、后缀和单位来增强输入框的可读性。

```tsx
function Example() {
  return (
    <FormInputNumber
      prefix={<span>$</span>}
      suffix="USD"
      unit="元"
    />
  )
}
```

### 3. 数值范围限制

设置最小值和最大值，自动验证并限制输入范围。

```tsx
function Example() {
  return (
    <FormInputNumber
      min={0}
      max={100}
      placeholder="请输入 0-100 之间的数字"
    />
  )
}
```

### 4. 小数精度控制

使用 precision 或 decimal 控制小数位数，失焦时自动格式化。

```tsx
function Example() {
  return (
    <FormInputNumber
      precision={2}
      placeholder="保留两位小数"
    />
  )
}
```

### 5. 带前后置标签

使用 addonBefore 和 addonAfter 添加前后置标签。

```tsx
function Example() {
  return (
    <FormInputNumber
      addonBefore={<span>数量</span>}
      addonAfter={<span>件</span>}
    />
  )
}
```

### 6. 不同样式变体

使用 variant 属性切换不同的视觉样式。

```tsx
function Example() {
  return (
    <div className="space-y-2">
      <FormInputNumber variant="default" defaultValue={50} />
      <FormInputNumber variant="outline" defaultValue={50} />
      <FormInputNumber variant="filled" defaultValue={50} />
      <FormInputNumber variant="ghost" defaultValue={50} />
    </div>
  )
}
```

### 7. 不同尺寸

使用 size 属性调整组件尺寸。

```tsx
function Example() {
  return (
    <div className="space-y-2">
      <FormInputNumber size="sm" defaultValue={50} placeholder="小尺寸" />
      <FormInputNumber size="md" defaultValue={50} placeholder="中尺寸" />
      <FormInputNumber size="lg" defaultValue={50} placeholder="大尺寸" />
    </div>
  )
}
```

## 完整示例

### 商品价格设置

实现一个商品价格设置表单，包含价格、库存、折扣等字段。

```tsx
import { FormInputNumber } from '@/components/kesi/form-input-number'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

function ProductPriceForm() {
  const [price, setPrice] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [stock, setStock] = useState<number>(0)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>商品价格</Label>
        <FormInputNumber
          value={price}
          onChange={setPrice}
          prefix={<span>¥</span>}
          precision={2}
          min={0}
          placeholder="请输入商品价格"
        />
      </div>

      <div className="space-y-2">
        <Label>折扣率 (%)</Label>
        <FormInputNumber
          value={discount}
          onChange={setDiscount}
          min={0}
          max={100}
          precision={1}
          suffix="%"
          placeholder="0-100"
        />
      </div>

      <div className="space-y-2">
        <Label>库存数量</Label>
        <FormInputNumber
          value={stock}
          onChange={setStock}
          min={0}
          step={1}
          addonBefore={<span>库存</span>}
          placeholder="请输入库存数量"
        />
      </div>
    </div>
  )
}
```

### 科学测量数据录入

用于科学实验数据的精确录入，支持高精度和单位显示。

```tsx
function ScientificDataForm() {
  const [temperature, setTemperature] = useState<number | undefined>()
  const [pressure, setPressure] = useState<number | undefined>()
  const [humidity, setHumidity] = useState<number | undefined>()

  return (
    <div className="space-y-4">
      <FormInputNumber
        value={temperature}
        onChange={setTemperature}
        precision={2}
        min={-273.15}
        unit="°C"
        placeholder="温度 (°C)"
      />

      <FormInputNumber
        value={pressure}
        onChange={setPressure}
        precision={3}
        min={0}
        unit="Pa"
        placeholder="气压 (Pa)"
      />

      <FormInputNumber
        value={humidity}
        onChange={setHumidity}
        precision={1}
        min={0}
        max={100}
        unit="%"
        placeholder="相对湿度 (%)"
      />
    </div>
  )
}
```

### 表格编辑器中的数字输入

在表格编辑器中使用，支持紧凑布局和快速输入。

```tsx
function TableNumberEditor() {
  const [value, setValue] = useState<number>()

  return (
    <FormInputNumber
      value={value}
      onChange={setValue}
      size="sm"
      bordered={false}
      variant="ghost"
      precision={0}
      autoFocus
      onPressEnter={(e) => {
        // 处理回车，移动到下一行
        console.log('Enter pressed')
      }}
    />
  )
}
```

## 注意事项

1. **精度控制优先级**：`decimal` 属性优先于 `precision` 属性，当两者同时存在时，使用 `decimal` 的值。这是为了兼容旧版本的 `form-number` 组件配置。

2. **失焦格式化**：数值的格式化（如小数位数、范围限制）在失焦时触发，而不是在输入过程中实时触发，这样不会影响用户的输入体验。

3. **受控与非受控模式**：组件同时支持受控模式（使用 `value` 和 `onChange`）和非受控模式（使用 `defaultValue`）。在受控模式下，父组件完全控制数值；在非受控模式下，组件内部维护状态。

4. **空值处理**：当输入框清空时，`onChange` 回调会传入 `undefined`，而不是 `null` 或空字符串，方便后续处理。

5. **步长功能**：`step` 属性用于控制数字输入框的步长（通过上下箭头或滚动），但不影响手动输入的数值。

6. **样式组合**：`variant` 和 `size` 可以组合使用，例如 `variant="filled"` 和 `size="lg"` 可以同时生效，实现不同的视觉效果。
