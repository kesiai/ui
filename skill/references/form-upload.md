> **安装命令**: `npx shadcn@latest add @kesi/form-upload`

# Form.Upload 文件上传

## 简介

`FormUpload` 是一个功能强大的文件上传组件，支持图片、视频、音频和普通文件的上传。

- **多种展示样式**：支持图片卡片、文本列表、视频、音频四种展示模式
- **自动压缩**：可对图片进行自动压缩以减小文件大小
- **水印功能**：支持为图片添加水印保护
- **进度显示**：实时显示上传进度
- **文件预览**：支持图片预览和文件下载

## 适用场景

- 表单中的图片上传（用户头像、产品图片等）
- 文件附件上传（文档、表格等）
- 视频/音频媒体上传
- 需要水印保护的图片上传
- 需要自动压缩的图片上传

## Props 参数说明

### BaseFormFieldProps 基础属性（继承）

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `any` | 否 | - | 当前值（受控模式） |
| `onChange` | `(value: any) => void` | 否 | - | 值变更回调 |
| `onBlur` | `() => void` | 否 | - | 失焦回调 |
| `name` | `string` | 否 | - | 字段名 |
| `ref` | `Ref<any>` | 否 | - | ref 引用 |
| `id` | `string` | 否 | - | 字段 ID |
| `schema` | `Record<string, any>` | 否 | - | 表单 schema |
| `record` | `any` | 否 | - | 表单记录数据 |

### FormUploadProps 组件属性

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `styleType` | `'picture-card' \| 'text' \| 'video' \| 'audio'` | 否 | `'picture-card'` | 展示样式类型 |
| `accept` | `string` | 否 | - | 接受的文件类型，如 `.jpg,.png` |
| `size` | `number` | 否 | - | 文件大小限制（MB） |
| `width` | `number` | 否 | `104` | 图片卡片宽度（px） |
| `height` | `number` | 否 | `104` | 图片卡片高度（px） |
| `maxUploadNum` | `number` | 否 | - | 最大上传数量 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `onlyCamera` | `boolean` | 否 | `false` | 仅相机上传 |
| `uploadPosition` | `'media' \| 'local'` | 否 | - | 上传位置 |
| `uploadFolder` | `boolean` | 否 | - | 是否启用上传文件夹 |
| `folderType` | `'folder' \| 'upload'` | 否 | - | 文件夹类型 |
| `folder` | `string` | 否 | - | 文件夹路径 |
| `base64` | `boolean` | 否 | `false` | 是否 base64 编码 |
| `autoZip` | `boolean` | 否 | `false` | 是否自动压缩图片 |
| `autoName` | `boolean` | 否 | `false` | 是否自动重命名文件 |
| `watermark` | `object` | 否 | - | 水印配置 |
| `sort` | `'asc' \| 'desc'` | 否 | - | 排序方式 |
| `mediaDelete` | `boolean` | 否 | `false` | 是否允许删除媒体文件 |
| `ftp` | `boolean` | 否 | `false` | 是否 FTP 上传 |
| `textToAudio` | `boolean` | 否 | `false` | 文本转音频 |
| `defaultVal` | `any` | 否 | - | 默认值 |
| `defaultValType` | `string` | 否 | - | 默认值类型 |
| `key` | `string` | 否 | - | 键名（用于生成唯一样式） |
| `uploadType` | `'upload_attachment' \| 'upload_attachment_group'` | 否 | - | 上传类型，单文件/多文件 |

### watermark 水印配置

```typescript
interface WatermarkConfig {
  use: boolean                    // 是否启用水印
  color?: string                  // 水印颜色，默认 'gray'
  fontSize?: number               // 字体大小，默认 100
  contentType?: 'time' | 'user' | 'text'  // 内容类型
  content?: string                // 自定义文本内容
  position?: string               // 位置，如 'left-top', 'center', 'repeat'
  rotate?: number                 // 旋转角度
  space?: number                  // 重复间距（repeat 模式）
}
```

## 基本用法

### 1. 图片卡片上传

使用图片卡片样式上传图片（单文件模式）。

```tsx
import { FormUpload } from '@/components/kesi/form-upload/form-upload'

function Example() {
  const [file, setFile] = useState(null)

  return (
    <FormUpload
      value={file}
      onChange={setFile}
      uploadType="upload_attachment"
    />
  )
}
```

### 2. 文本列表上传

使用文本列表样式上传文件（多文件模式）。

```tsx
import { FormUploadGroup } from '@/components/kesi/form-upload/form-upload'

function Example() {
  const [files, setFiles] = useState([])

  return (
    <FormUploadGroup
      value={files}
      onChange={setFiles}
      styleType="text"
    />
  )
}
```

### 3. 限制文件类型

只允许上传特定类型的文件。

```tsx
function Example() {
  const [file, setFile] = useState(null)

  return (
    <FormUpload
      value={file}
      onChange={setFile}
      uploadType="upload_attachment"
      accept=".jpg,.png,.jpeg"
    />
  )
}
```

### 4. 限制文件大小

限制上传文件的最大尺寸。

```tsx
function Example() {
  const [file, setFile] = useState(null)

  return (
    <FormUpload
      value={file}
      onChange={setFile}
      uploadType="upload_attachment"
      size={5}
    />
  )
}
```

### 5. 限制上传数量

设置最大上传文件数量。

```tsx
function Example() {
  const [files, setFiles] = useState([])

  return (
    <FormUploadGroup
      value={files}
      onChange={setFiles}
      maxUploadNum={3}
    />
  )
}
```

### 6. 自动压缩

上传时自动压缩图片以减小文件大小。

```tsx
function Example() {
  const [file, setFile] = useState(null)

  return (
    <FormUpload
      value={file}
      onChange={setFile}
      uploadType="upload_attachment"
      autoZip
    />
  )
}
```

### 7. 自定义卡片尺寸

设置图片卡片的宽度和高度。

```tsx
function Example() {
  const [file, setFile] = useState(null)

  return (
    <FormUpload
      value={file}
      onChange={setFile}
      uploadType="upload_attachment"
      width={200}
      height={200}
    />
  )
}
```

### 8. 添加水印

为上传的图片添加水印。

```tsx
function Example() {
  const [file, setFile] = useState(null)

  return (
    <FormUpload
      value={file}
      onChange={setFile}
      uploadType="upload_attachment"
      watermark={{
        use: true,
        contentType: 'text',
        content: 'My Company',
        color: 'rgba(0, 0, 0, 0.3)',
        fontSize: 80,
        position: 'repeat'
      }}
    />
  )
}
```

## 完整示例

### 用户头像上传

上传用户头像，限制为单个图片文件。

```tsx
import { FormUpload } from '@/components/kesi/form-upload/form-upload'

function AvatarUpload() {
  const [avatar, setAvatar] = useState(null)

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium mb-2">用户头像</label>
      <FormUpload
        value={avatar}
        onChange={setAvatar}
        uploadType="upload_attachment"
        accept=".jpg,.png,.jpeg"
        size={2}
        width={150}
        height={150}
        maxUploadNum={1}
      />
      <p className="mt-2 text-sm text-gray-500">
        支持 JPG、PNG 格式，文件大小不超过 2MB
      </p>
    </div>
  )
}
```

### 产品图片上传

上传产品展示图片，支持多图上传。

```tsx
import { FormUploadGroup } from '@/components/kesi/form-upload/form-upload'

function ProductImages() {
  const [images, setImages] = useState([])

  return (
    <div className="w-full max-w-2xl">
      <label className="block text-sm font-medium mb-2">产品图片</label>
      <FormUploadGroup
        value={images}
        onChange={setImages}
        accept=".jpg,.png,.jpeg"
        size={5}
        width={120}
        height={120}
        maxUploadNum={9}
        autoZip
      />
      <p className="mt-2 text-sm text-gray-500">
        最多上传 9 张图片，单张不超过 5MB
      </p>
    </div>
  )
}
```

### 附件上传

上传各类文档附件。

```tsx
import { FormUploadGroup } from '@/components/kesi/form-upload/form-upload'

function AttachmentUpload() {
  const [attachments, setAttachments] = useState([])

  return (
    <div className="w-full max-w-2xl">
      <label className="block text-sm font-medium mb-2">相关附件</label>
      <FormUploadGroup
        value={attachments}
        onChange={setAttachments}
        styleType="text"
        size={10}
        maxUploadNum={5}
      />
      <p className="mt-2 text-sm text-gray-500">
        支持 PDF、Word、Excel 等格式，单个文件不超过 10MB
      </p>
    </div>
  )
}
```

### 带水印的图片上传

上传带水印保护的图片。

```tsx
import { FormUpload } from '@/components/kesi/form-upload/form-upload'

function WatermarkedUpload() {
  const [file, setFile] = useState(null)

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium mb-2">图片上传（带水印）</label>
      <FormUpload
        value={file}
        onChange={setFile}
        uploadType="upload_attachment"
        watermark={{
          use: true,
          contentType: 'time',
          color: 'rgba(255, 0, 0, 0.3)',
          fontSize: 60,
          position: 'right-bottom',
          rotate: 30
        }}
      />
      <p className="mt-2 text-sm text-gray-500">
        上传的图片将自动添加时间水印
      </p>
    </div>
  )
}
```

### 视频上传

上传视频文件。

```tsx
import { FormUpload } from '@/components/kesi/form-upload/form-upload'

function VideoUpload() {
  const [video, setVideo] = useState(null)

  return (
    <div className="w-full max-w-2xl">
      <label className="block text-sm font-medium mb-2">视频文件</label>
      <FormUpload
        value={video}
        onChange={setVideo}
        uploadType="upload_attachment"
        styleType="video"
        accept=".mp4,.avi,.mov"
        size={100}
      />
      <p className="mt-2 text-sm text-gray-500">
        支持 MP4、AVI、MOV 格式，文件大小不超过 100MB
      </p>
    </div>
  )
}
```

### 证件上传

上传身份证、护照等证件照片。

```tsx
import { FormUpload } from '@/components/kesi/form-upload/form-upload'

function IdCardUpload() {
  const [frontCard, setFrontCard] = useState(null)
  const [backCard, setBackCard] = useState(null)

  return (
    <div className="space-y-6 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium mb-2">身份证正面</label>
        <FormUpload
          value={frontCard}
          onChange={setFrontCard}
          uploadType="upload_attachment"
          accept=".jpg,.png,.jpeg"
          width={200}
          height={140}
          maxUploadNum={1}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">身份证反面</label>
        <FormUpload
          value={backCard}
          onChange={setBackCard}
          uploadType="upload_attachment"
          accept=".jpg,.png,.jpeg"
          width={200}
          height={140}
          maxUploadNum={1}
        />
      </div>
    </div>
  )
}
```

## 注意事项

1. **文件类型限制**：通过 `accept` 属性限制可上传的文件类型，使用扩展名格式如 `.jpg,.png`

2. **安全限制**：组件内置了危险文件扩展名黑名单（如 .exe, .js, .php 等），这些文件无法上传

3. **单文件/多文件**：`uploadType="upload_attachment"` 为单文件模式（使用 `FormUpload`），`uploadType="upload_attachment_group"` 为多文件模式（也可使用 `FormUploadGroup`）

4. **文件大小验证**：超过 `size` 限制的文件会在上传前被拦截，并显示错误提示

5. **自动压缩**：`autoZip` 只对图片生效，根据文件大小自动选择压缩比例（0.1-0.5）

6. **水印配置**：水印功能只对图片生效，支持时间、用户名、自定义文本三种内容类型

7. **上传进度**：上传过程中会显示进度条，上传完成后可预览或删除文件

8. **媒体库上传**：组件预留了媒体库上传接口（当前显示为占位符），需要配合 MediaModal 组件使用

9. **文件命名**：`autoName` 启用后会使用随机字符串重命名文件，保留原始扩展名

10. **认证依赖**：组件依赖 `@airiot/client` 的 `useUser` hook 获取用户信息用于水印等功能
