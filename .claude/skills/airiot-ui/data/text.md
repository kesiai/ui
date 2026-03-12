# Text 文本

## 简介

`Text` 是一个灵活的文本展示组件，支持多种文本类型和显示模式，适用于各种文本展示场景。

- **丰富的文本类型**：支持从标题1到段落共7种文本类型，满足不同层级的文本展示需求
- **灵活的显示模式**：提供行内、块级和行内块三种显示模式，适应不同布局场景
- **文本格式控制**：支持首行缩进、去除空格、超出省略等多种文本格式化选项
- **占位文本支持**：当内容为空时显示占位文本，提升用户体验
- **完全可定制**：继承所有原生 div 属性，支持完整的样式定制

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `content` | `string \| number` | 否 | `''` | 要显示的文本内容 |
| `textType` | `'mainText' \| 'title1' \| 'title2' \| 'title3' \| 'title4' \| 'title5' \| 'paragraph'` | 否 | `'mainText'` | 文本的类型，决定渲染的 HTML 标签和样式 |
| `showMode` | `'inline' \| 'block' \| 'inline-block'` | 否 | `'inline'` | 文本的显示模式 |
| `textIndent` | `number` | 否 | `0` | 首行缩进的像素值 |
| `isTrim` | `boolean` | 否 | `false` | 是否去除文本中的所有空格 |
| `ellipsis` | `boolean` | 否 | `false` | 是否在文本超出时显示省略号 |
| `placeholder` | `string` | 否 | `'请输入文本信息'` | 当 content 为空时显示的占位文本 |

### textType 文本类型说明

不同的文本类型会渲染为不同的 HTML 标签，并应用相应的样式：

- **mainText**：渲染为 `<span>`，小号文本样式，适用于正文内容
- **title1**：渲染为 `<h1>`，超大号粗体文本（text-4xl font-bold），适用于主标题
- **title2**：渲染为 `<h2>`，大号粗体文本（text-3xl font-bold），适用于二级标题
- **title3**：渲染为 `<h3>`，中大号半粗体文本（text-2xl font-semibold），适用于三级标题
- **title4**：渲染为 `<h4>`，中号半粗体文本（text-xl font-semibold），适用于四级标题
- **title5**：渲染为 `<h5>`，中小号中等粗细文本（text-lg font-medium），适用于五级标题
- **paragraph**：渲染为 `<p>`，基础段落文本（text-base leading-relaxed），适用于段落内容

## 基本用法

### 1. 基础文本

最简单的文本展示，使用默认的正文样式。

```tsx
import { Text } from '@/registry/components/airiot/text'

function Example() {
  return <Text content="这是一段示例文本" />
}
```

### 2. 标题文本

使用不同的 textType 创建各级标题。

```tsx
function Example() {
  return (
    <div>
      <Text content="一级标题" textType="title1" />
      <Text content="二级标题" textType="title2" />
      <Text content="三级标题" textType="title3" />
    </div>
  )
}
```

### 3. 段落文本

使用 paragraph 类型展示段落内容。

```tsx
function Example() {
  return (
    <Text
      content="这是一个段落文本，适合展示较长的内容。"
      textType="paragraph"
      showMode="block"
    />
  )
}
```

### 4. 首行缩进

使用 textIndent 属性设置首行缩进。

```tsx
function Example() {
  return (
    <Text
      content="这是一段带有首行缩进的文本，适合中文排版。"
      textType="paragraph"
      showMode="block"
      textIndent={32}
    />
  )
}
```

### 5. 去除空格

使用 isTrim 属性去除文本中的所有空格。

```tsx
function Example() {
  return (
    <Text
      content="这 段 文 本 的 空 格 会 被 去 除"
      isTrim={true}
    />
  )
}
```

### 6. 文本省略

使用 ellipsis 属性在文本超出时显示省略号。

```tsx
function Example() {
  return (
    <div style={{ width: '200px' }}>
      <Text
        content="这是一段很长的文本，当超出容器宽度时会显示省略号"
        ellipsis={true}
        showMode="block"
      />
    </div>
  )
}
```

### 7. 占位文本

当 content 为空时显示占位文本。

```tsx
function Example() {
  return (
    <Text
      content=""
      placeholder="暂无数据"
    />
  )
}
```

## 完整示例

### 文章排版示例

创建一个包含标题和段落的文章排版示例。

```tsx
import { Text } from '@/registry/components/airiot/text'

function Example() {
  return (
    <article style={{ maxWidth: '800px' }}>
      <Text
        content="文章标题"
        textType="title1"
        showMode="block"
      />
      <Text
        content="副标题"
        textType="title3"
        showMode="block"
      />
      <Text
        content="这是第一段内容，文章正文通常使用段落样式。段落文本有适当的行高，阅读体验更好。"
        textType="paragraph"
        showMode="block"
        textIndent={32}
      />
      <Text
        content="这是第二段内容，每段都可以设置首行缩进，符合中文排版习惯。"
        textType="paragraph"
        showMode="block"
        textIndent={32}
      />
    </article>
  )
}
```

### 卡片内容展示

创建一个卡片式的文本展示组件。

```tsx
import { Text } from '@/registry/components/airiot/text'

function Example() {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
      <Text
        content="产品名称"
        textType="title4"
        showMode="block"
      />
      <Text
        content="这是产品的简短描述，使用正文样式展示。"
        textType="paragraph"
        showMode="block"
      />
      <div style={{ marginTop: '16px' }}>
        <Text
          content="价格：¥99"
          textType="title5"
        />
        <Text
          content="库存：有货"
          showMode="inline"
          style={{ marginLeft: '16px' }}
        />
      </div>
    </div>
  )
}
```

### 数据标签展示

创建并排显示的数据标签。

```tsx
import { Text } from '@/registry/components/airiot/text'

function Example() {
  return (
    <div className="flex gap-4">
      <div>
        <Text
          content="姓名："
          textType="title5"
        />
        <Text
          content="张三"
        />
      </div>
      <div>
        <Text
          content="年龄："
          textType="title5"
        />
        <Text
          content="25"
        />
      </div>
      <div>
        <Text
          content="状态："
          textType="title5"
        />
        <Text
          content="在线"
        />
      </div>
    </div>
  )
}
```

### 响应式文本容器

创建一个带有省略效果的响应式文本容器。

```tsx
import { Text } from '@/registry/components/airiot/text'

function Example() {
  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      <Text
        content="这是一个很长的标题，在窄屏幕上会自动显示省略号，确保布局不会被破坏"
        textType="title4"
        showMode="block"
        ellipsis={true}
      />
      <Text
        content="这是描述文本，同样支持超出省略功能。"
        textType="paragraph"
        showMode="block"
        ellipsis={true}
      />
    </div>
  )
}
```

## 注意事项

1. **显示模式选择**：`showMode` 属性控制文本的 CSS display 属性。标题类型默认为块级元素，正文类型默认为行内元素，根据布局需求选择合适的显示模式。

2. **文本省略限制**：当 `ellipsis` 为 true 时，文本会被限制为单行显示，超出部分显示省略号。如果需要多行省略效果，需要自定义 CSS 样式。

3. **空格处理**：`isTrim` 属性会去除所有空格（包括中间的空格），这可能会影响文本的可读性，建议仅在特定场景下使用。

4. **首行缩进**：`textIndent` 使用像素作为单位，推荐使用 2em（约 32px）作为中文段落的首行缩进值。

5. **占位文本样式**：当 `content` 为空时，占位文本会以灰色（#ccc）显示，与有内容时的文本颜色区分。

6. **HTML 标签语义**：不同的 `textType` 会渲染为不同的 HTML 标签（h1-h6、p、span），这有助于 SEO 和无障碍访问，请根据内容的语义层级选择合适的类型。

7. **样式继承**：组件继承所有原生 div 的 HTML 属性，可以通过 className 或 style 属性进一步定制样式，但要注意不要与内置样式冲突。
