## FormUpload - 文件上传组件

### 导入路径
```tsx
import { FormUpload } from '@/components/airiot/form-upload/form-upload'
```

### 基础用法
```tsx
import { FormUpload } from '@/components/airiot/form-upload/form-upload'

function UploadExample() {
  const [fileList, setFileList] = useState([])

  return (
    <FormUpload
      fileList={fileList}
      onChange={setFileList}
      multiple={true}
      accept=".jpg,.png,.pdf"
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| fileList | Array | [] | 文件列表 |
| onChange | (files) => void | - | 变化回调 |
| multiple | boolean | false | 是否多选 |
| accept | string | '' | 接受的文件类型 |
| maxSize | number | 10 | 最大文件大小(MB) |
| disabled | boolean | false | 是否禁用 |

### 示例
```tsx
import { FormUpload, FormItem, Card, Space, Progress } from '@/components/airiot'

function FileUploadDemo() {
  const [fileList, setFileList] = useState([])
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    setUploading(true)
    // 模拟上传过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    setUploading(false)
    console.log('上传完成:', fileList)
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    const isPdf = file.type === 'application/pdf'
    const isLt5M = file.size / 1024 / 1024 < 5

    if (!isJpgOrPng && !isPdf) {
      alert('只能上传 JPG/PNG/PDF 文件!')
      return false
    }
    if (!isLt5M) {
      alert('图片必须小于 5MB!')
      return false
    }
    return true
  }

  return (
    <Card cardTitle="文件上传">
      <Space direction="vertical" style={{ width: '100%' }}>
        <FormItem label="上传文件">
          <FormUpload
            fileList={fileList}
            onChange={setFileList}
            multiple={true}
            accept=".jpg,.png,.pdf"
            maxSize={5}
            beforeUpload={beforeUpload}
            disabled={uploading}
          />
        </FormItem>

        {fileList.map((file, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{file.name}</span>
            <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            <Progress percent={Math.random() * 100} size="small" />
          </div>
        ))}

        <div style={{ textAlign: 'right' }}>
          <button
            onClick={handleUpload}
            disabled={fileList.length === 0 || uploading}
            style={{
              padding: '8px 16px',
              background: fileList.length === 0 || uploading ? '#ccc' : '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: fileList.length === 0 || uploading ? 'not-allowed' : 'pointer'
            }}
          >
            {uploading ? '上传中...' : '开始上传'}
          </button>
        </div>
      </Space>
    </Card>
  )
}
```

### 支持的文件类型
- 图片: .jpg, .jpeg, .png, .gif
- 文档: .pdf, .doc, .docx, .txt
- 其他: .zip, .rar, .xlsx

### 上传限制
- 文件大小: 可配置最大值
- 文件数量: 支持多选
- 文件类型: 可配置接受类型

### 注意事项
- 支持拖拽上传
- 可自定义上传逻辑
- 支持文件预览和删除