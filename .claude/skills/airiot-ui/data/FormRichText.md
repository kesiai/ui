## FormRichText - 富文本编辑器组件

### 导入路径
```tsx
import { FormRichText } from '@/components/airiot/form-rich-text/form-rich-text'
```

### 基础用法
```tsx
import { FormRichText } from '@/components/airiot/form-rich-text/form-rich-text'

function RichTextExample() {
  const [content, setContent] = useState('')

  return (
    <FormRichText
      value={content}
      onChange={setContent}
      height={300}
      placeholder="请输入内容..."
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | string | - | 富文本内容 |
| onChange | (content) => void | - | 变化回调 |
| height | number | 200 | 高度 |
| placeholder | string | '请输入内容' | 占位符 |
| toolbar | Array | ['bold', 'italic', 'underline'] | 工具栏 |
| uploadImage | (file) => Promise | - | 图片上传 |

### 示例
```tsx
import { FormRichText, FormItem, Card, Button } from '@/components/airiot'

function RichTextDemo() {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleImageUpload = async (file) => {
    // 模拟图片上传
    const url = URL.createObjectURL(file)
    return {
      url: url,
      alt: file.name
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitting(false)
    console.log('文章:', { title, content })
  }

  const toolbar = [
    'bold', 'italic', 'underline', 'strike',
    '|',
    'ul', 'ol', 'indent', 'outdent',
    '|',
    'link', 'image', 'table', 'code'
  ]

  return (
    <Card cardTitle="文章编辑器">
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="请输入文章标题"
          style={{
            width: '100%',
            padding: 8,
            fontSize: 16,
            border: '1px solid #ddd',
            borderRadius: 4
          }}
        />
      </div>

      <FormItem label="文章内容">
        <FormRichText
          value={content}
          onChange={setContent}
          height={400}
          placeholder="请输入文章内容..."
          toolbar={toolbar}
          uploadImage={handleImageUpload}
        />
      </FormItem>

      <div style={{ textAlign: 'right' }}>
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim() || submitting}
          loading={submitting}
        >
          {submitting ? '发布中...' : '发布文章'}
        </Button>
      </div>
    </Card>
  )
}
```

### 工具栏功能
- **文本格式**: 粗体、斜体、下划线、删除线
- **列表**: 有序列表、无序列表
- **缩进**: 增加缩进、减少缩进
- **插入**: 链接、图片、表格、代码
- **其他**: 对齐方式、字体大小、颜色

### 功能特性
- 支持实时预览
- 可自定义工具栏
- 支持图片上传
- HTML 格式输出

### 注意事项
- 内容以 HTML 格式保存
- 支持撤销/重做操作
- 可配置最大字符数限制