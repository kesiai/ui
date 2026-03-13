# Form.RichText 富文本

## 简介

`FormRichText` 是一个基于 CKEditor 5 的富文本编辑器组件，提供强大的文本编辑和格式化功能。

- **丰富编辑功能**：支持标题、粗体、斜体、下划线、链接、列表、表格等多种格式
- **自定义工具栏**：支持自定义工具栏配置，按需显示编辑功能
- **图片上传**：集成图片上传适配器，支持插入和管理图片
- **只读预览**：支持禁用模式下的富文本内容预览
- **列表优化**：在列表中显示时，提供弹窗查看功能

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `input` | `object` | 否 | - | 表单输入对象 |
| `input.value` | `string` | 否 | - | 当前富文本内容（HTML 格式） |
| `input.onChange` | `(value: string) => void` | 否 | - | 内容变化回调 |
| `field` | `object` | 否 | - | 字段配置对象 |
| `field.schema` | `object` | 否 | - | 字段 schema 配置 |
| `field.schema.placeholder` | `string` | 否 | `'编辑富文本'` | 占位提示文本 |
| `field.schema.disabled` | `boolean` | 否 | `false` | 是否禁用（只读模式） |
| `field.schema.defaultVal` | `string` | 否 | - | 默认值 |
| `field.schema.defaultValType` | `'fixed' \| 'logic'` | 否 | `'fixed'` | 默认值类型 |
| `field.schema.inList` | `boolean` | 否 | `false` | 是否在列表中显示 |
| `field.schema.key` | `string` | 否 | - | 字段唯一标识 |
| `field.schema.title` | `string` | 否 | - | 字段标题 |
| `field.schema.ediforms` | `boolean` | 否 | `true` | 是否可编辑字段 |
| `field.schema.toolbar` | `object` | 否 | - | 自定义工具栏配置 |
| `meta` | `any` | 否 | - | 元数据 |
| `record` | `any` | 否 | - | 记录数据 |

### 默认工具栏

组件默认包含以下工具栏项目：

- `heading`：标题
- `bold`：粗体
- `italic`：斜体
- `underline`：下划线
- `link`：链接
- `bulletedList`：无序列表
- `numberedList`：有序列表
- `outdent`：减少缩进
- `indent`：增加缩进
- `blockQuote`：引用
- `insertTable`：插入表格
- `fontFamily`：字体
- `fontSize`：字号
- `fontColor`：字体颜色
- `fontBackgroundColor`：背景颜色
- `undo`：撤销
- `redo`：重做

## 基本用法

### 1. 基础富文本编辑

最简单的富文本编辑器，使用默认工具栏。

```tsx
import { FormRichText } from '@/components/airiot/form-rich-text'
import { useState } from 'react'

function Example() {
  const [content, setContent] = useState('<p>欢迎使用富文本编辑器</p>')

  return (
    <FormRichText
      input={{
        value: content,
        onChange: setContent
      }}
      field={{
        schema: {
          placeholder: '编辑富文本'
        }
      }}
    />
  )
}
```

### 2. 只读预览模式

禁用编辑功能，只显示富文本内容。

```tsx
function Example() {
  const [content] = useState('<p>这是一段只读的富文本内容</p>')

  return (
    <FormRichText
      input={{
        value: content,
        onChange: () => {}
      }}
      field={{
        schema: {
          disabled: true
        }
      }}
    />
  )
}
```

### 3. 列表中显示

在表格或列表中显示富文本，点击查看完整内容。

```tsx
function Example() {
  const [content] = useState('<p>这是一段较长的富文本内容...</p>')

  return (
    <FormRichText
      input={{
        value: content,
        onChange: () => {}
      }}
      field={{
        schema: {
          disabled: true,
          inList: true,
          title: '文章内容'
        }
      }}
    />
  )
}
```

### 4. 带默认值

设置初始的富文本内容。

```tsx
function Example() {
  const [content, setContent] = useState('')

  return (
    <FormRichText
      input={{
        value: content,
        onChange: setContent
      }}
      field={{
        schema: {
          defaultVal: '<h1>标题</h1><p>默认内容</p>',
          defaultValType: 'fixed'
        }
      }}
    />
  )
}
```

## 完整示例

### 文章发布编辑器

用于创建和编辑文章内容的富文本编辑器。

```tsx
import { FormRichText } from '@/components/airiot/form-rich-text'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

function ArticleEditor() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handlePublish = () => {
    console.log('发布文章:', { title, content })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>文章标题</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="请输入文章标题"
        />
      </div>

      <div className="space-y-2">
        <Label>文章内容</Label>
        <FormRichText
          input={{
            value: content,
            onChange: setContent
          }}
          field={{
            schema: {
              placeholder: '开始编写您的文章...',
              key: 'article-content',
              ediforms: true
            }
          }}
        />
      </div>

      <Button onClick={handlePublish}>发布文章</Button>
    </div>
  )
}
```

### 产品描述编辑

编辑产品详细描述，支持图片和表格。

```tsx
function ProductDescriptionForm() {
  const [description, setDescription] = useState('')

  return (
    <div className="space-y-4">
      <FormRichText
        input={{
          value: description,
          onChange: setDescription
        }}
        field={{
          schema: {
            placeholder: '请输入产品详细描述',
            defaultVal: '<h2>产品特点</h2><ul><li>特点1</li><li>特点2</li></ul>',
            key: 'product-description'
          }
        }}
      />

      <div className="text-sm text-gray-500">
        支持：标题、列表、表格、图片、链接等格式
      </div>
    </div>
  )
}
```

### 公告内容编辑

编辑系统公告，支持预览和编辑切换。

```tsx
function AnnouncementEditor() {
  const [announcement, setAnnouncement] = useState('')
  const [isPreview, setIsPreview] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant={!isPreview ? 'default' : 'outline'}
          onClick={() => setIsPreview(false)}
        >
          编辑
        </Button>
        <Button
          variant={isPreview ? 'default' : 'outline'}
          onClick={() => setIsPreview(true)}
        >
          预览
        </Button>
      </div>

      <FormRichText
        input={{
          value: announcement,
          onChange: setAnnouncement
        }}
        field={{
          schema: {
            disabled: isPreview,
            placeholder: '请输入公告内容',
            key: 'announcement-content'
          }
        }}
      />
    </div>
  )
}
```

## 注意事项

1. **CKEditor 依赖**：组件依赖 `@ckeditor/ckeditor5-react` 和 `@ckeditor/ckeditor5-build-decoupled-document`，需要确保这些包已正确安装。

2. **内容格式**：组件使用 HTML 格式存储和传输富文本内容，`value` 和 `onChange` 处理的都是 HTML 字符串。

3. **图片上传**：组件集成了自定义的上传适配器 `RichTextUploadAdapter`，需要配置图片上传的 API 接口才能正常使用图片插入功能。

4. **工具栏分离**：使用 Decoupled Editor 模式，工具栏和编辑区域是分离的，工具栏会自动插入到编辑区域上方。

5. **中文语言包**：组件默认加载中文语言包（`zh-cn`），并扩展了一些自定义翻译，提升中文用户体验。

6. **默认值生效时机**：默认值会在组件初始化时自动设置，但如果 `defaultValType` 为 `'logic'`，则不会自动设置默认值，等待逻辑计算后手动设置。

7. **列表模式优化**：当 `inList` 为 `true` 且组件处于禁用状态时，富文本内容会显示为"查看内容"链接，点击后在弹窗中查看完整内容，避免在列表中占用过多空间。

8. **链接处理**：在预览模式下，组件会自动为所有链接添加 `target="_Blank"` 属性，确保链接在新标签页中打开。

9. **自定义工具栏**：可以通过 `field.schema.toolbar` 自定义工具栏配置，完全控制显示的编辑功能。传空对象 `{}` 使用默认工具栏，传自定义配置覆盖默认配置。

10. **样式隔离**：编辑器内容使用 `.ck-content` 类名进行样式隔离，确保编辑器内的样式不影响页面其他部分。
