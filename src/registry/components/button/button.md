# Button 按钮

## 简介

`Button` 是一个功能强大的按钮组件，基于 shadcn/ui Button 进行封装，提供了丰富的样式和交互选项。

- **多种样式变体**：支持默认、危险、轮廓、次要、幽灵和链接六种按钮样式
- **灵活的尺寸选择**：提供默认、小、大和图标四种尺寸选项，适应不同场景需求
- **表单集成**：内置表单提交和重置功能，与 FormContext 无缝配合
- **加载状态支持**：内置加载状态显示，提升用户交互体验
- **高度可定制**：支持禁用状态、边框隐藏等多种配置选项

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `text` | `string` | 否 | `'按钮'` | 按钮显示的文字内容 |
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | 否 | `'default'` | 按钮的视觉样式变体 |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | 否 | `'default'` | 按钮的尺寸大小 |
| `border` | `boolean` | 否 | `false` | 是否隐藏按钮边框，设置为 true 时使用 ghost 样式 |
| `disable` | `boolean` | 否 | `false` | 是否禁用按钮，禁用后无法点击 |
| `isSubmit` | `boolean` | 否 | `false` | 是否为表单提交按钮，需要与 FormContext 配合使用 |
| `isReset` | `boolean` | 否 | `false` | 是否为表单重置按钮，需要与 FormContext 配合使用 |
| `loading` | `boolean` | 否 | `false` | 是否显示加载状态，会自动继承 FormContext 的 loading 状态 |

### variant 样式说明

按钮提供了六种视觉样式，每种样式适用于不同的使用场景：

- **default**：默认样式，使用主题色填充，适用于主要操作按钮
- **destructive**：危险样式，红色主题，适用于删除、取消等危险操作
- **outline**：轮廓样式，带边框的透明背景，适用于次要操作
- **secondary**：次要样式，灰色主题，适用于辅助操作
- **ghost**：幽灵样式，无边框透明背景，适用于不需要强调的按钮
- **link**：链接样式，类似文本链接的样式，适用于链接式操作

## 基本用法

### 1. 基础按钮

最简单的按钮使用，只显示默认文字。

```tsx
import { Button } from '@/registry/components/button'

function Example() {
  return <Button />
}
```

### 2. 自定义文字和样式

设置按钮文字和视觉样式。

```tsx
function Example() {
  return (
    <Button
      text="点击我"
      variant="default"
    />
  )
}
```

### 3. 不同尺寸的按钮

使用 size 属性控制按钮大小。

```tsx
function Example() {
  return (
    <div className="flex gap-2">
      <Button text="小按钮" size="sm" />
      <Button text="默认按钮" size="default" />
      <Button text="大按钮" size="lg" />
    </div>
  )
}
```

### 4. 不同样式的按钮

使用 variant 属性切换按钮样式。

```tsx
function Example() {
  return (
    <div className="flex gap-2">
      <Button text="默认" variant="default" />
      <Button text="危险" variant="destructive" />
      <Button text="轮廓" variant="outline" />
      <Button text="次要" variant="secondary" />
      <Button text="幽灵" variant="ghost" />
      <Button text="链接" variant="link" />
    </div>
  )
}
```

### 5. 禁用状态

使用 disable 属性禁用按钮。

```tsx
function Example() {
  return (
    <Button
      text="禁用按钮"
      disable={true}
    />
  )
}
```

### 6. 加载状态

使用 loading 属性显示加载动画。

```tsx
function Example() {
  return (
    <Button
      text="加载中..."
      loading={true}
    />
  )
}
```

### 7. 无边框按钮

使用 border 属性隐藏按钮边框。

```tsx
function Example() {
  return (
    <Button
      text="无边框按钮"
      border={true}
    />
  )
}
```

## 完整示例

### 表单提交按钮

创建一个表单提交场景，使用 isSubmit 属性与 FormContext 配合。

```tsx
import { Button } from '@/registry/components/button'
import { FormContext } from '@/registry/lib/form-context'

function Example() {
  const handleSubmit = () => {
    console.log('表单已提交')
  }

  const handleReset = () => {
    console.log('表单已重置')
  }

  return (
    <FormContext.Provider value={{ handleSubmit, onReset: handleReset }}>
      <div className="space-y-4">
        <form>
          {/* 表单内容 */}
          <div className="p-4 border rounded">
            <p className="mb-2">表单字段区域</p>
          </div>

          {/* 表单操作按钮 */}
          <div className="flex gap-2 mt-4">
            <Button
              text="提交"
              variant="default"
              isSubmit={true}
            />
            <Button
              text="重置"
              variant="outline"
              isReset={true}
            />
          </div>
        </form>
      </div>
    </FormContext.Provider>
  )
}
```

### 异步操作按钮

模拟异步操作场景，显示加载状态。

```tsx
import { Button } from '@/registry/components/button'
import { useState } from 'react'

function Example() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    alert('操作完成！')
  }

  return (
    <Button
      text={loading ? '处理中...' : '点击执行'}
      loading={loading}
      disable={loading}
      onClick={handleClick}
    />
  )
}
```

### 按钮组示例

创建一组不同样式的操作按钮。

```tsx
import { Button } from '@/registry/components/button'

function Example() {
  return (
    <div className="flex gap-3 items-center">
      <Button
        text="新建"
        variant="default"
        size="default"
      />
      <Button
        text="编辑"
        variant="secondary"
        size="sm"
      />
      <Button
        text="删除"
        variant="destructive"
        size="sm"
      />
      <Button
        text="取消"
        variant="ghost"
        border={true}
      />
    </div>
  )
}
```

### 图标按钮示例

使用 icon 尺寸创建图标按钮（需要配合图标库使用）。

```tsx
import { Button } from '@/registry/components/button'

function Example() {
  return (
    <Button
      text="🔍"
      variant="outline"
      size="icon"
    />
  )
}
```

## 注意事项

1. **表单集成**：使用 `isSubmit` 或 `isReset` 属性时，必须确保按钮组件在 `FormContext.Provider` 的范围内，否则表单操作功能不会生效。

2. **禁用状态**：`disable` 属性支持 boolean 类型和字符串类型（'1'、'true' 等字符串值也会被识别为 true），这在处理来自数据源的配置时很有用。

3. **加载状态继承**：如果同时设置了 `loading` 属性和 `FormContext` 中的 `loading` 状态，两者会自动合并（OR 逻辑），任一为 true 都会显示加载状态。

4. **边框样式**：当 `border` 属性为 true 时，按钮会强制使用 `ghost` 变体样式，这会覆盖 `variant` 属性的设置。

5. **点击事件处理**：设置了 `isSubmit` 或 `isReset` 的按钮，在执行表单操作后仍会调用自定义的 `onClick` 事件处理器，可以在同一个按钮中同时处理表单操作和其他逻辑。

6. **样式定制**：组件使用 shadcn/ui 的 Button 作为基础，所有原生 button 的 HTML 属性（如 type、form 等）都可以通过 props 传递使用。
