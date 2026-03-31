> **安装命令**: `npx shadcn@latest add @kesi/form-upload`

# Form.Upload 文件上传

## 简介

`FormUpload` 是一个功能强大的文件上传组件，支持图片、视频、音频和普通文件的上传。

- **多种展示样式**：支持图片卡片、文本列表、视频、音频四种展示模式
- **自动压缩**：可对图片进行自动压缩以减小文件大小
- **水印功能**：支持为图片添加水印保护
- **进度显示**：实时显示上传进度
- **文件预览**：支持图片预览和文件下载

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `input` | `{ value?: any; onChange?: (value: any) => void }` | 是 | - | 输入值和变更回调 |
| `field` | `{ schema?: UploadSchema }` | 否 | - | 字段配置 |
| `field.schema.styleType` | `'picture-card' \| 'text' \| 'video' \| 'audio'` | 否 | `'picture-card'` | 展示样式 |
| `field.schema.accept` | `string` | 否 | - | 接受的文件类型，如 `.jpg,.png` |
| `field.schema.size` | `number` | 否 | - | 文件大小限制（MB） |
| `field.schema.width` | `number` | 否 | `104` | 图片卡片宽度（px） |
| `field.schema.height` | `number` | 否 | `104` | 图片卡片高度（px） |
| `field.schema.maxUploadNum` | `number` | 否 | - | 最大上传数量 |
| `field.schema.disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `field.schema.autoZip` | `boolean` | 否 | `false` | 是否自动压缩图片 |
| `field.schema.autoName` | `boolean` | 否 | `false` | 是否自动重命名文件 |
| `field.schema.watermark` | `object` | 否 | - | 水印配置 |
| `type` | `'upload_attachment' \| 'upload_attachment_group'` | 否 | - | 上传类型 |
| `cellKey` | `string` | 否 | - | 单元格键值 |

### input 输入对象

```typescript
interface InputProps {
  value?: any          // 当前文件值
  onChange?: (value: any) => void  // 文件变更回调
}
```

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

使用图片卡片样式上传图片。

```tsx
import { FormUpload } from '@/components/kesi/form-upload'

function Example() {
  const [file, setFile] = useState(null)

  return (
    <FormUpload
      input={{
        value: file,
        onChange: setFile
      }}
      field={{
        schema: {
          styleType: 'picture-card'
        }
      }}
      type="upload_attachment"
    />
  )
}
```

### 2. 文本列表上传

使用文本列表样式上传文件。

```tsx
function Example() {
  const [files, setFiles] = useState([])

  return (
    <FormUpload
      input={{
        value: files,
        onChange: setFiles
      }}
      field={{
        schema: {
          styleType: 'text'
        }
      }}
      type="upload_attachment_group"
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
      input={{
        value: file,
        onChange: setFile
      }}
      field={{
        schema: {
          styleType: 'picture-card',
          accept: '.jpg,.png,.jpeg'
        }
      }}
      type="upload_attachment"
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
      input={{
        value: file,
        onChange: setFile
      }}
      field={{
        schema: {
          styleType: 'picture-card',
          size: 5  // 限制为 5MB
        }
      }}
      type="upload_attachment"
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
    <FormUpload
      input={{
        value: files,
        onChange: setFiles
      }}
      field={{
        schema: {
          styleType: 'picture-card',
          maxUploadNum: 3  // 最多上传 3 个文件
        }
      }}
      type="upload_attachment_group"
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
      input={{
        value: file,
        onChange: setFile
      }}
      field={{
        schema: {
          styleType: 'picture-card',
          autoZip: true
        }
      }}
      type="upload_attachment"
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
      input={{
        value: file,
        onChange: setFile
      }}
      field={{
        schema: {
          styleType: 'picture-card',
          width: 200,
          height: 200
        }
      }}
      type="upload_attachment"
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
      input={{
        value: file,
        onChange: setFile
      }}
      field={{
        schema: {
          styleType: 'picture-card',
          watermark: {
            use: true,
            contentType: 'text',
            content: 'My Company',
            color: 'rgba(0, 0, 0, 0.3)',
            fontSize: 80,
            position: 'repeat'
          }
        }
      }}
      type="upload_attachment"
    />
  )
}
```

## 完整示例

### 用户头像上传

上传用户头像，限制为单个图片文件。

```tsx
import { FormUpload } from '@/components/kesi/form-upload'

function AvatarUpload() {
  const [avatar, setAvatar] = useState(null)

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium mb-2">用户头像</label>
      <FormUpload
        input={{
          value: avatar,
          onChange: setAvatar
        }}
        field={{
          schema: {
            styleType: 'picture-card',
            accept: '.jpg,.png,.jpeg',
            size: 2,
            width: 150,
            height: 150,
            maxUploadNum: 1
          }
        }}
        type="upload_attachment"
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
function ProductImages() {
  const [images, setImages] = useState([])

  return (
    <div className="w-full max-w-2xl">
      <label className="block text-sm font-medium mb-2">产品图片</label>
      <FormUpload
        input={{
          value: images,
          onChange: setImages
        }}
        field={{
          schema: {
            styleType: 'picture-card',
            accept: '.jpg,.png,.jpeg',
            size: 5,
            width: 120,
            height: 120,
            maxUploadNum: 9,
            autoZip: true
          }
        }}
        type="upload_attachment_group"
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
function AttachmentUpload() {
  const [attachments, setAttachments] = useState([])

  return (
    <div className="w-full max-w-2xl">
      <label className="block text-sm font-medium mb-2">相关附件</label>
      <FormUpload
        input={{
          value: attachments,
          onChange: setAttachments
        }}
        field={{
          schema: {
            styleType: 'text',
            size: 10,
            maxUploadNum: 5
          }
        }}
        type="upload_attachment_group"
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
function WatermarkedUpload() {
  const [file, setFile] = useState(null)

  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium mb-2">图片上传（带水印）</label>
      <FormUpload
        input={{
          value: file,
          onChange: setFile
        }}
        field={{
          schema: {
            styleType: 'picture-card',
            watermark: {
              use: true,
              contentType: 'time',
              color: 'rgba(255, 0, 0, 0.3)',
              fontSize: 60,
              position: 'right-bottom',
              rotate: 30
            }
          }
        }}
        type="upload_attachment"
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
function VideoUpload() {
  const [video, setVideo] = useState(null)

  return (
    <div className="w-full max-w-2xl">
      <label className="block text-sm font-medium mb-2">视频文件</label>
      <FormUpload
        input={{
          value: video,
          onChange: setVideo
        }}
        field={{
          schema: {
            styleType: 'video',
            accept: '.mp4,.avi,.mov',
            size: 100
          }
        }}
        type="upload_attachment"
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
function IdCardUpload() {
  const [frontCard, setFrontCard] = useState(null)
  const [backCard, setBackCard] = useState(null)

  return (
    <div className="space-y-6 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium mb-2">身份证正面</label>
        <FormUpload
          input={{
            value: frontCard,
            onChange: setFrontCard
          }}
          field={{
            schema: {
              styleType: 'picture-card',
              accept: '.jpg,.png,.jpeg',
              width: 200,
              height: 140,
              maxUploadNum: 1
            }
          }}
          type="upload_attachment"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">身份证反面</label>
        <FormUpload
          input={{
            value: backCard,
            onChange: setBackCard
          }}
          field={{
            schema: {
              styleType: 'picture-card',
              accept: '.jpg,.png,.jpeg',
              width: 200,
              height: 140,
              maxUploadNum: 1
            }
          }}
          type="upload_attachment"
        />
      </div>
    </div>
  )
}
```

## 注意事项

1. **文件类型限制**：通过 `accept` 属性限制可上传的文件类型，使用扩展名格式如 `.jpg,.png`

2. **安全限制**：组件内置了危险文件扩展名黑名单（如 .exe, .js, .php 等），这些文件无法上传

3. **单文件/多文件**：`type="upload_attachment"` 为单文件模式，`type="upload_attachment_group"` 为多文件模式

4. **文件大小验证**：超过 `size` 限制的文件会在上传前被拦截，并显示错误提示

5. **自动压缩**：`autoZip` 只对图片生效，根据文件大小自动选择压缩比例（0.1-0.5）

6. **水印配置**：水印功能只对图片生效，支持时间、用户名、自定义文本三种内容类型

7. **上传进度**：上传过程中会显示进度条，上传完成后可预览或删除文件

8. **媒体库上传**：组件预留了媒体库上传接口（当前显示为占位符），需要配合 MediaModal 组件使用

9. **文件命名**：`autoName` 启用后会使用随机字符串重命名文件，保留原始扩展名

10. **认证依赖**：组件依赖 `@airiot/client` 的 `useUser` hook 获取用户信息用于水印等功能
