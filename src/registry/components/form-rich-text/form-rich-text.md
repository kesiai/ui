> **安装命令**: `npx shadcn@latest add @kesi/form-rich-text`

# Form.RichText 富文本

## 简介

`FormRichText` 是一个基于 TipTap 的轻量级富文本编辑器组件，提供丰富的文本编辑和格式化功能。

- **轻量模块化**：基于 TipTap 按需加载扩展，体积远小于 CKEditor
- **丰富编辑功能**：支持标题、粗体、斜体、下划线、链接、列表、表格、图片等多种格式
- **颜色与字体**：支持字体颜色、背景颜色（快捷色板 + 自定义取色器）、中文字体切换
- **图片上传**：内置图片上传功能，上传至 `/core/media/img` 接口
- **只读预览**：支持禁用模式下的富文本内容预览
- **列表优化**：在列表中显示时，提供弹窗查看功能

## 依赖

组件依赖以下 TipTap 扩展包：

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-underline @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-text-style @tiptap/extension-color @tiptap/extension-highlight @tiptap/extension-font-family @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header @tiptap/extension-image
```

同时需要安装 `@tailwindcss/typography` 以支持 `prose` 排版样式，并在全局 CSS 中注册：

```css
@plugin "@tailwindcss/typography";
```

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `string` | 否 | - | 当前富文本内容（HTML 格式） |
| `onChange` | `(value: string) => void` | 否 | - | 内容变化回调 |
| `placeholder` | `string` | 否 | `'编辑富文本'` | 占位提示文本 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用（只读模式） |
| `defaultVal` | `string` | 否 | - | 默认值 |
| `defaultValType` | `'fixed' \| 'logic'` | 否 | `'fixed'` | 默认值类型 |
| `inList` | `boolean` | 否 | `false` | 是否在列表中显示 |
| `title` | `string` | 否 | - | 字段标题（列表弹窗预览时显示） |
| `ediforms` | `boolean` | 否 | - | 是否可编辑字段 |
| `toolbar` | `object` | 否 | - | 保留字段，当前版本暂不支持自定义工具栏 |
| `record` | `any` | 否 | - | 表单记录数据 |

### 工具栏功能

组件内置工具栏包含以下功能：

| 功能 | 说明 |
|------|------|
| 撤销 / 重做 | 支持操作历史回退 |
| 标题1 / 标题2 / 标题3 | 切换段落标题级别 |
| 加粗 / 斜体 / 下划线 | 基础文字格式 |
| 字体颜色 / 背景颜色 | 快捷色板 + 自定义取色器 + 重置 |
| 插入链接 | 弹窗输入链接地址 |
| 插入图片 | 选择本地图片上传 |
| 无序列表 / 有序列表 | 列表排版 |
| 引用 | 块引用 |
| 插入表格 | 插入 3x3 表格（含表头） |
| 字体选择 | 宋体、黑体、微软雅黑等中文字体 |

### 支持的字体

默认、宋体、新宋体、仿宋、楷体、黑体、微软雅黑、隶书、幼圆

## 基本用法

### 1. 基础富文本编辑

```tsx
import { FormRichText } from '@/components/kesi/form-rich-text'
import { useState } from 'react'

function Example() {
  const [content, setContent] = useState('<p>欢迎使用富文本编辑器</p>')

  return (
    <FormRichText
      value={content}
      onChange={setContent}
      placeholder="编辑富文本"
    />
  )
}
```

### 2. 只读预览模式

```tsx
function Example() {
  const [content] = useState('<p>这是一段只读的富文本内容</p>')

  return (
    <FormRichText
      value={content}
      onChange={() => {}}
      disabled
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
      value={content}
      onChange={() => {}}
      disabled
      inList
      title="文章内容"
    />
  )
}
```

### 4. 带默认值

```tsx
function Example() {
  const [content, setContent] = useState('')

  return (
    <FormRichText
      value={content}
      onChange={setContent}
      defaultVal="<h1>标题</h1><p>默认内容</p>"
      defaultValType="fixed"
    />
  )
}
```

## 完整示例

### 文章发布编辑器

```tsx
import { FormRichText } from '@/components/kesi/form-rich-text'
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
          value={content}
          onChange={setContent}
          placeholder="开始编写您的文章..."
          ediforms
        />
      </div>

      <Button onClick={handlePublish}>发布文章</Button>
    </div>
  )
}
```

### 公告内容编辑（编辑/预览切换）

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
        value={announcement}
        onChange={setAnnouncement}
        disabled={isPreview}
        placeholder="请输入公告内容"
      />
    </div>
  )
}
```

## 注意事项

1. **内容格式**：组件使用 HTML 格式存储和传输富文本内容，`value` 和 `onChange` 处理的都是 HTML 字符串。

2. **排版样式**：编辑器内容使用 Tailwind CSS `prose` 类进行排版，需要安装 `@tailwindcss/typography` 插件并在全局 CSS 中通过 `@plugin "@tailwindcss/typography"` 注册。

3. **图片上传**：组件内置图片上传功能，上传接口为 `/core/media/img`，使用 `localStorage` 中的 `token` 进行鉴权。如需修改上传接口，请编辑组件中的 `uploadImage` 函数。

4. **默认值生效时机**：默认值会在组件初始化时自动设置，但如果 `defaultValType` 为 `'logic'`，则不会自动设置默认值，等待逻辑计算后手动设置。

5. **列表模式优化**：当 `inList` 为 `true` 且组件处于禁用状态时，富文本内容会显示为"查看内容"链接，点击后在弹窗中查看完整内容。

6. **链接处理**：在预览模式下，组件会自动为所有链接添加 `target="_Blank"` 属性，确保链接在新标签页中打开。

7. **键盘快捷键**：支持 `Ctrl+Z` 撤销、`Ctrl+Shift+Z` / `Ctrl+Y` 重做、`Ctrl+B` 加粗、`Ctrl+I` 斜体、`Ctrl+U` 下划线等常用快捷键。

8. **样式隔离**：编辑器内容样式通过 `.custom-text-editor .tiptap` 选择器隔离，不会影响页面其他部分。
