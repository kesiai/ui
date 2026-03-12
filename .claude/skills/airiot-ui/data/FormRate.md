## FormRate - 评分组件

### 导入路径
```tsx
import { FormRate } from '@/components/airiot/form-rate/form-rate'
```

### 基础用法
```tsx
import { FormRate } from '@/components/airiot/form-rate/form-rate'

function RateExample() {
  const [value, setValue] = useState(0)

  return (
    <FormRate
      value={value}
      onChange={setValue}
      count={5}
      character="★"
      allowHalf={false}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | number | 0 | 当前值 |
| onChange | (value) => void | - | 变化回调 |
| count | number | 5 | 星星数量 |
| character | string | '★' | 字符 |
| allowHalf | boolean | false | 是否允许半星 |
| disabled | boolean | false | 是否禁用 |

### 示例
```tsx
import { FormRate, FormItem, Card, Space, Textarea } from '@/components/airiot'

function RatingDemo() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    console.log('评分:', rating)
    console.log('评论:', comment)
  }

  return (
    <Card cardTitle="产品评分">
      <Space direction="vertical" style={{ width: '100%' }}>
        <FormItem label="总体评分">
          <FormRate
            value={rating}
            onChange={setRating}
            count={5}
            character="★"
            allowHalf={true}
            disabled={false}
          />
          {rating > 0 && (
            <div style={{ marginTop: 8, color: '#666' }}>
              {rating >= 4.5 ? '非常满意' :
               rating >= 3.5 ? '满意' :
               rating >= 2.5 ? '一般' :
               rating >= 1.5 ? '不满意' : '非常不满意'}
            </div>
          )}
        </FormItem>

        <FormItem label="详细评价">
          <Textarea
            value={comment}
            onChange={setComment}
            placeholder="请分享您的使用体验..."
            rows={4}
            maxLength={500}
          />
          <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
            {comment.length}/500
          </div>
        </FormItem>

        <FormItem label="推荐给他人">
          <FormRate
            value={0}
            onChange={(value) => console.log('推荐评分:', value)}
            count={5}
            character="♥"
            allowHalf={false}
            style={{ color: '#ff4d4f' }}
          />
          <span style={{ marginLeft: 8 }}>愿意推荐吗？</span>
        </FormItem>

        <div style={{ textAlign: 'right' }}>
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            style={{
              padding: '8px 16px',
              background: rating === 0 ? '#ccc' : '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: rating === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            提交评价
          </button>
        </div>
      </Space>
    </Card>
  )
}
```

### 支持的字符
- 星星: ★、☆
- 心形: ♥、♡
- 数字: 1-5
- 自定义图标

### 评分标准
- 5星: 非常满意
- 4星: 满意
- 3星: 一般
- 2星: 不满意
- 1星: 非常不满意

### 注意事项
- 支持半星评分
- 可以禁用评分
- 支持自定义显示内容