# TextArea 多行文本

## 简介

`TextArea` 是一个多行文本输入组件，基于原生 textarea 元素封装。

- **简单易用**：直接使用 content 或 value 属性设置内容
- **首行缩进**：支持文本首行缩进配置
- **响应式尺寸**：自适应容器高度
- **原生属性**：支持所有原生 textarea 属性
- **样式一致**：使用统一的样式系统

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `content` | `string` | 否 | `''` | 文字内容（优先使用 value） |
| `value` | `string` | 否 | - | 受控值（优先于 content） |
| `textIndent` | `number` | 否 | `0` | 首行缩进（像素） |
| `placeholder` | `string` | 否 | - | 占位提示文本 |
| `rows` | `number` | 否 | - | 显示行数 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `readOnly` | `boolean` | 否 | `false` | 是否只读 |
| `className` | `string` | 否 | - | 自定义样式类名 |
| ...其他 | `React.TextareaHTMLAttributes<HTMLTextAreaElement>` | 否 | - | 所有原生 textarea 属性 |

## 基本用法

### 1. 基本使用

使用 content 属性设置默认文本。

```tsx
import { TextArea } from '@/components/airiot/textarea'

function Example() {
  return (
    <TextArea
      content="这是默认文本内容"
      rows={4}
    />
  )
}
```

### 2. 受控模式

使用 value 和 onChange 实现受控输入。

```tsx
function Example() {
  const [text, setText] = useState('')

  return (
    <TextArea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="请输入内容"
      rows={5}
    />
  )
}
```

### 3. 首行缩进

设置文本首行缩进。

```tsx
function Example() {
  return (
    <TextArea
      content="这是一段需要首行缩进的文本。缩进可以提升阅读体验，常用于段落开头。"
      textIndent={32}
      rows={3}
    />
  )
}
```

### 4. 只读和禁用

控制文本框的交互状态。

```tsx
function Example() {
  return (
    <div>
      <TextArea
        content="只读文本，不可编辑"
        readOnly
        rows={2}
      />
      <TextArea
        content="禁用文本，完全不可用"
        disabled
        rows={2}
      />
    </div>
  )
}
```

### 5. 多行输入

创建一个反馈表单。

```tsx
function Example() {
  return (
    <div>
      <label className="block mb-2">请输入您的反馈：</label>
      <TextArea
        placeholder="请详细描述您的建议或问题..."
        rows={6}
      />
    </div>
  )
}
```

### 6. 自定义样式

应用自定义样式类。

```tsx
function Example() {
  return (
    <TextArea
      content="自定义样式的文本框"
      className="border-blue-500 focus:ring-blue-500"
      rows={4}
    />
  )
}
```

### 7. 限制字符数

结合字符计数功能。

```tsx
function Example() {
  const [text, setText] = useState('')
  const maxLength = 200

  return (
    <div>
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxLength))}
        placeholder={`最多输入 ${maxLength} 个字符`}
        rows={4}
      />
      <p className="text-sm text-gray-500 mt-1">
        {text.length} / {maxLength}
      </p>
    </div>
  )
}
```

## 完整示例

### 评论组件

创建一个带验证的评论输入组件。

```tsx
import { TextArea } from '@/components/airiot/textarea'
import { useState } from 'react'

function CommentBox() {
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (comment.trim().length < 10) {
      setError('评论内容至少需要10个字符')
      return
    }
    setError('')
    // 提交评论
    console.log('提交评论:', comment)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">发表评论</h3>
      <TextArea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="请输入您的评论（至少10个字符）"
        rows={6}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {comment.length} 个字符
        </span>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          提交评论
        </button>
      </div>
    </div>
  )
}
```

## 注意事项

1. **value vs content**：`value` 优先于 `content`，受控模式使用 `value`。
2. **换行符**：支持 `\n` 换行符，会正确渲染为多行文本。
3. **自动调整高度**：容器高度为 100%，内部 textarea 也会填充容器。
4. **禁用调整大小**：默认 `resize-none`，不允许用户拖拽调整大小。
5. **最小高度**：设置了 `minHeight: '80px'` 确保最小高度。
6. **样式继承**：通过 className 可以覆盖默认样式。
