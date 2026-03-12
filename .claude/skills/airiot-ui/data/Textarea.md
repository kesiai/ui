## Textarea - 文本域组件

### 导入路径
```tsx
import { Textarea } from '@/components/airiot/textarea/textarea'
```

### 基础用法
```tsx
import { Textarea } from '@/components/airiot/textarea/textarea'

function TextareaExample() {
  const [value, setValue] = useState('')

  return (
    <Textarea
      value={value}
      onChange={setValue}
      placeholder="请输入内容..."
      rows={4}
      maxLength={500}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | string | - | 文本值 |
| onChange | (value) => void | - | 值变化回调 |
| placeholder | string | - | 占位符 |
| rows | number | 4 | 行数 |
| maxLength | number | - | 最大长度 |
| disabled | boolean | false | 是否禁用 |
| resize | 'none' \| 'both' \| 'horizontal' \| 'vertical' | 'vertical' | 调整大小 |

### 示例
```tsx
import { Textarea, Button, Card } from '@/components/airiot'

function CommentForm() {
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    console.log('提交评论:', comment)
  }

  return (
    <Card cardTitle="发表评论">
      <Textarea
        value={comment}
        onChange={setComment}
        placeholder="请输入您的评论..."
        rows={6}
        maxLength={1000}
        resize="vertical"
      />
      <div style={{ marginTop: 8, textAlign: 'right' }}>
        <span style={{ color: '#999', marginRight: 8 }}>
          {comment.length}/1000
        </span>
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={!comment.trim()}
        >
          提交
        </Button>
      </div>
    </Card>
  )
}
```

### 注意事项
- 支持自动高度调整
- 可以显示字数统计
- 支持键盘快捷键