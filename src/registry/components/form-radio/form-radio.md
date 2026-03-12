# Form.Radio 单选框组件

## 简介

`FormRadio` 是一个单选框组件，用于从多个选项中选择一个。

- **单选模式**：从多个选项中选择唯一一个
- **受控/非受控**：支持受控和非受控两种模式
- **禁用控制**：支持禁用状态和只读状态
- **样式变体**：提供多种样式变体和尺寸选择
- **可访问性**：内置无障碍支持

## 适用场景

- 性别选择
- 支付方式选择
- 配送方式选择
- 问卷单选题
- 选项唯一的配置项

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `options` | `Array<{ label: string; value: string \| number }>` | 否 | `[]` | 选项列表 |
| `value` | `string \| number` | 否 | - | 当前值（受控模式） |
| `defaultValue` | `string \| number` | 否 | - | 默认值（非受控模式） |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `readOnly` | `boolean` | 否 | `false` | 是否只读 |
| `variant` | `'default' \| 'outline' \| 'filled' \| 'ghost'` | 否 | `'default'` | 样式变体 |
| `size` | `'sm' \| 'md' \| 'lg'` | 否 | `'md'` | 尺寸 |
| `onChange` | `(value: string \| number) => void` | 否 | - | 值变化回调 |

## 基本用法

### 1. 基础单选框

```tsx
import { FormRadio } from '@/registry/components/airiot/form-radio/form-radio'

function BasicRadio() {
  const options = [
    { label: '选项 A', value: '1' },
    { label: '选项 B', value: '2' },
    { label: '选项 C', value: '3' }
  ]

  return <FormRadio options={options} />
}
```

### 2. 带默认值

```tsx
function RadioWithDefault() {
  const options = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' }
  ]

  return <FormRadio options={options} defaultValue="male" />
}
```

### 3. 受控模式

```tsx
import { useState } from 'react'

function ControlledRadio() {
  const [value, setValue] = useState('1')

  const options = [
    { label: '选项 A', value: '1' },
    { label: '选项 B', value: '2' },
    { label: '选项 C', value: '3' }
  ]

  return (
    <div>
      <FormRadio
        value={value}
        onChange={setValue}
        options={options}
      />
      <p className="mt-2">选中值: {value}</p>
    </div>
  )
}
```

### 4. 禁用状态

```tsx
function DisabledRadio() {
  const options = [
    { label: '选项 A', value: '1' },
    { label: '选项 B', value: '2' },
    { label: '选项 C', value: '3' }
  ]

  return (
    <FormRadio
      options={options}
      disabled
    />
  )
}
```

### 5. 只读状态

```tsx
function ReadOnlyRadio() {
  const options = [
    { label: '选项 A', value: '1' },
    { label: '选项 B', value: '2' }
  ]

  return (
    <FormRadio
      options={options}
      defaultValue="1"
      readOnly
    />
  )
}
```

### 6. 数字值

```tsx
function NumericRadio() {
  const options = [
    { label: '一星', value: 1 },
    { label: '二星', value: 2 },
    { label: '三星', value: 3 },
    { label: '四星', value: 4 },
    { label: '五星', value: 5 }
  ]

  return <FormRadio options={options} />
}
```

## 完整示例

### 性别选择

```tsx
import { FormRadio } from '@/registry/components/airiot/form-radio/form-radio'
import { useState } from 'react'

function GenderSelector() {
  const [gender, setGender] = useState('')

  const genderOptions = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
    { label: '保密', value: 'secret' }
  ]

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        性别
      </label>
      <FormRadio
        value={gender}
        onChange={setGender}
        options={genderOptions}
      />
    </div>
  )
}
```

### 支付方式选择

```tsx
import { FormRadio } from '@/registry/components/airiot/form-radio/form-radio'
import { useState } from 'react'

function PaymentMethod() {
  const [method, setMethod] = useState('wechat')

  const paymentOptions = [
    { label: '微信支付', value: 'wechat' },
    { label: '支付宝', value: 'alipay' },
    { label: '银行卡', value: 'card' },
    { label: '货到付款', value: 'cod' }
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">选择支付方式</h3>
      <FormRadio
        value={method}
        onChange={setMethod}
        options={paymentOptions}
      />
      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg">
        确认支付
      </button>
    </div>
  )
}
```

### 配送方式

```tsx
import { FormRadio } from '@/registry/components/airiot/form-radio/form-radio'
import { useState } from 'react'

function DeliveryMethod() {
  const [delivery, setDelivery] = useState('standard')

  const deliveryOptions = [
    {
      label: '标准配送（免费，3-5 个工作日）',
      value: 'standard'
    },
    {
      label: '快速配送（¥10，1-2 个工作日）',
      value: 'express'
    },
    {
      label: '次日达（¥20，次日送达）',
      value: 'nextday'
    }
  ]

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">配送方式</h3>
      <FormRadio
        value={delivery}
        onChange={setDelivery}
        options={deliveryOptions}
      />
    </div>
  )
}
```

### 问卷单选

```tsx
import { FormRadio } from '@/registry/components/airiot/form-radio/form-radio'
import { useState } from 'react'

function QuestionRadio() {
  const [answer, setAnswer] = useState<string>()

  const question = '您对我们的服务满意吗？'
  const options = [
    { label: '非常满意', value: 'very-satisfied' },
    { label: '满意', value: 'satisfied' },
    { label: '一般', value: 'neutral' },
    { label: '不满意', value: 'dissatisfied' },
    { label: '非常不满意', value: 'very-dissatisfied' }
  ]

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">{question}</h3>
      <FormRadio
        value={answer}
        onChange={setAnswer}
        options={options}
      />
      {answer && (
        <p className="mt-4 text-sm text-gray-600">
          您的选择: {options.find(opt => opt.value === answer)?.label}
        </p>
      )}
    </div>
  )
}
```

### 评分选择

```tsx
import { FormRadio } from '@/registry/components/airiot/form-radio/form-radio'

function RatingSelector() {
  const ratingOptions = [
    { label: '★', value: 1 },
    { label: '★★', value: 2 },
    { label: '★★★', value: 3 },
    { label: '★★★★', value: 4 },
    { label: '★★★★★', value: 5 }
  ]

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        请评分
      </label>
      <FormRadio
        options={ratingOptions}
        defaultValue={3}
      />
    </div>
  )
}
```

### 主题切换

```tsx
import { FormRadio } from '@/registry/components/airiot/form-radio/form-radio'
import { useState } from 'react'

function ThemeSwitcher() {
  const [theme, setTheme] = useState('light')

  const themeOptions = [
    { label: '浅色', value: 'light' },
    { label: '深色', value: 'dark' },
    { label: '跟随系统', value: 'system' }
  ]

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-sm font-medium mb-3">主题设置</h3>
      <FormRadio
        value={theme}
        onChange={setTheme}
        options={themeOptions}
      />
    </div>
  )
}
```

### 动态选项

```tsx
import { FormRadio } from '@/registry/components/airiot/form-radio/form-radio'
import { useState } from 'react'

function DynamicRadio() {
  const [options, setOptions] = useState([
    { label: '选项 A', value: '1' },
    { label: '选项 B', value: '2' }
  ])
  const [value, setValue] = useState('1')

  const addOption = () => {
    const newValue = options.length + 1
    const newOption = {
      label: `选项 ${String.fromCharCode(64 + newValue)}`,
      value: newValue.toString()
    }
    setOptions([...options, newOption])
  }

  return (
    <div>
      <button
        onClick={addOption}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        添加选项
      </button>

      <FormRadio
        value={value}
        onChange={setValue}
        options={options}
      />
    </div>
  )
}
```

### 带描述的选项

```tsx
import { FormRadio } from '@/registry/components/airiot/form-radio/form-radio'

function RadioWithDescription() {
  const options = [
    {
      label: '基础版 - 免费',
      value: 'basic'
    },
    {
      label: '专业版 - ¥99/月',
      value: 'pro'
    },
    {
      label: '企业版 - ¥999/月',
      value: 'enterprise'
    }
  ]

  return (
    <div className="space-y-2">
      {options.map(option => (
        <label
          key={option.value}
          className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <input
            type="radio"
            name="plan"
            value={option.value}
            className="mr-3"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}
```

## 注意事项

1. **受控与非受控模式**：
   - 提供 `value` 属性时为受控模式，需要通过 `onChange` 更新
   - 提供 `defaultValue` 时为非受控模式，组件内部管理状态

2. **值类型**：
   - 支持 `string` 和 `number` 类型的值
   - 内部会统一转换为字符串处理

3. **禁用与只读**：
   - `disabled`：完全禁用，所有选项都不可选
   - `readOnly`：只读模式，已有选项无法修改，但不影响视觉效果

4. **选项唯一性**：
   - 每个选项的 `value` 必须唯一
   - 重复的值会导致选择异常

5. **无障碍支持**：
   - 每个单选框都有关联的 label
   - 支持键盘导航

6. **样式变体**：
   - 组件支持 `variant` 和 `size` 属性
   - 可以通过 `className` 自定义样式

7. **选择行为**：
   - 同一时间只能选中一个选项
   - 点击已选中的选项不会取消选中
