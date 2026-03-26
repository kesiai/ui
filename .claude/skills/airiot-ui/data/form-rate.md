# Rate 星级评价

## 简介

`Rate` 是一个简洁优雅的星级评价组件，用于收集用户评分反馈。

- **动态评分**：根据分数自动改变星星颜色
- **可清空**：支持点击已选星星清空评分
- **悬停预览**：鼠标悬停时预览评分效果
- **分数显示**：可选显示当前分数
- **三种尺寸**：提供小、中、大三种尺寸

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `value` | `number` | 否 | `0` | 当前评分值 |
| `count` | `number` | 否 | `5` | 星星总数 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `allowClear` | `boolean` | 否 | `true` | 是否允许清除 |
| `showScore` | `boolean` | 否 | `false` | 是否显示分数 |
| `size` | `'sm' \| 'md' \| 'lg'` | 否 | `'md'` | 星星尺寸 |
| `onChange` | `(value: number) => void` | 否 | - | 评分改变时的回调 |
| `cellKey` | `string` | 否 | - | 单元格键值 |

## 基本用法

### 1. 基础星级评价

最简单的五星级评价。

```tsx
import { Rate } from '@/components/kesi/form-rate/form-rate'

function Example() {
  const [rating, setRating] = useState(0)

  return (
    <Rate
      value={rating}
      onChange={setRating}
    />
  )
}
```

### 2. 显示分数

显示当前评分和总分。

```tsx
function Example() {
  const [rating, setRating] = useState(0)

  return (
    <Rate
      value={rating}
      onChange={setRating}
      showScore
    />
  )
}
```

### 3. 禁用清空

禁用后点击已选星星不会清空评分。

```tsx
function Example() {
  const [rating, setRating] = useState(4)

  return (
    <Rate
      value={rating}
      onChange={setRating}
      allowClear={false}
    />
  )
}
```

### 4. 禁用状态

禁用状态下无法修改评分。

```tsx
function Example() {
  return (
    <Rate
      value={4}
      disabled
    />
  )
}
```

### 5. 自定义星星数量

设置星星总数为 10。

```tsx
function Example() {
  const [rating, setRating] = useState(0)

  return (
    <Rate
      value={rating}
      onChange={setRating}
      count={10}
    />
  )
}
```

### 6. 不同尺寸

使用不同尺寸的星星。

```tsx
function Example() {
  const [rating1, setRating1] = useState(0)
  const [rating2, setRating2] = useState(0)
  const [rating3, setRating3] = useState(0)

  return (
    <div className="space-y-4">
      <Rate value={rating1} onChange={setRating1} size="sm" />
      <Rate value={rating2} onChange={setRating2} size="md" />
      <Rate value={rating3} onChange={setRating3} size="lg" />
    </div>
  )
}
```

### 7. 半星效果（模拟）

通过设置不同的星星数量实现半星效果。

```tsx
function Example() {
  const [rating, setRating] = useState(0)

  return (
    <Rate
      value={rating}
      onChange={setRating}
      count={10}
      showScore
    />
  )
}
```

## 完整示例

### 商品评价

为商品打分，支持显示分数。

```tsx
import { Rate } from '@/components/kesi/form-rate/form-rate'

function ProductRating() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    console.log('评分:', rating)
    console.log('评论:', comment)
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">商品评分</label>
        <Rate
          value={rating}
          onChange={setRating}
          showScore
          size="lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">评价内容</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={4}
          placeholder="分享您的使用体验..."
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!rating}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
      >
        提交评价
      </button>
    </div>
  )
}
```

### 服务满意度调查

收集客户对服务的满意度评价。

```tsx
function ServiceSurvey() {
  const [ratings, setRatings] = useState({
    attitude: 0,
    speed: 0,
    quality: 0
  })

  const updateRating = (key: string, value: number) => {
    setRatings(prev => ({ ...prev, [key]: value }))
  }

  const average = Object.values(ratings).reduce((a, b) => a + b, 0) / 3

  return (
    <div className="w-full max-w-2xl space-y-6 p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium">服务满意度调查</h3>

      <div>
        <label className="block text-sm font-medium mb-2">服务态度</label>
        <Rate
          value={ratings.attitude}
          onChange={(value) => updateRating('attitude', value)}
          showScore
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">响应速度</label>
        <Rate
          value={ratings.speed}
          onChange={(value) => updateRating('speed', value)}
          showScore
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">服务质量</label>
        <Rate
          value={ratings.quality}
          onChange={(value) => updateRating('quality', value)}
          showScore
        />
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600">
          平均评分: {average.toFixed(1)} / 5.0
        </p>
      </div>
    </div>
  )
}
```

### 餐厅点评

对餐厅的各方面进行评价。

```tsx
function RestaurantReview() {
  const [rating, setRating] = useState({
    food: 0,
      service: 0,
      environment: 0,
      price: 0
  })

  const aspects = [
    { key: 'food', label: '菜品口味' },
    { key: 'service', label: '服务质量' },
    { key: 'environment', label: '环境氛围' },
    { key: 'price', label: '性价比' }
  ]

  const overall = Object.values(rating).reduce((a, b) => a + b, 0) / 4

  return (
    <div className="w-full max-w-md space-y-4">
      <h3 className="text-lg font-medium">餐厅评价</h3>

      {aspects.map(aspect => (
        <div key={aspect.key}>
          <label className="block text-sm font-medium mb-2">{aspect.label}</label>
          <Rate
            value={rating[aspect.key]}
            onChange={(value) => setRating(prev => ({ ...prev, [aspect.key]: value }))}
            cellKey={`restaurant-${aspect.key}`}
          />
        </div>
      ))}

      <div className="pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">综合评分</span>
          <span className="text-lg font-bold text-blue-600">
            {overall.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  )
}
```

### 技能评分

为技能水平打分，使用更多星级。

```tsx
function SkillRating() {
  const [skills, setSkills] = useState([
    { name: 'JavaScript', level: 7 },
    { name: 'TypeScript', level: 6 },
    { name: 'React', level: 8 },
    { name: 'Node.js', level: 5 }
  ])

  const updateSkill = (index: number, level: number) => {
    setSkills(prev => {
      const updated = [...prev]
      updated[index].level = level
      return updated
    })
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <h3 className="text-lg font-medium">技能自评</h3>

      {skills.map((skill, index) => (
        <div key={skill.name} className="flex items-center gap-4">
          <span className="w-24 text-sm font-medium">{skill.name}</span>
          <div className="flex-1">
            <Rate
              value={skill.level}
              onChange={(value) => updateSkill(index, value)}
              count={10}
              showScore
              cellKey={`skill-${skill.name}`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
```

### 只读评分展示

展示已有的评分，不允许修改。

```tsx
function RatingDisplay({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
      <Rate
        value={rating}
        count={count}
        disabled
        size="sm"
      />
      <span className="text-sm font-medium">{rating}.{count}</span>
    </div>
  )
}

// 使用示例
function ProductCard() {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-medium">产品名称</h3>
      <div className="mt-2 flex items-center gap-2">
        <RatingDisplay rating={4} count={5} />
        <span className="text-sm text-gray-500">(128 条评价)</span>
      </div>
    </div>
  )
}
```

### 评分历史趋势

展示历史评分变化趋势。

```tsx
function RatingHistory() {
  const [history, setHistory] = useState([
    { date: '2024-01', rating: 4 },
    { date: '2024-02', rating: 5 },
    { date: '2024-03', rating: 3 },
    { date: '2024-04', rating: 4 }
  ])

  return (
    <div className="w-full max-w-md space-y-3">
      <h3 className="text-lg font-medium">评分历史</h3>

      {history.map((item, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
          <span className="text-sm text-gray-600">{item.date}</span>
          <div className="flex items-center gap-2">
            <Rate value={item.rating} disabled size="sm" />
            <span className="text-sm font-medium">{item.rating}.0</span>
          </div>
        </div>
      ))}
    </div>
  )
}
```

## 注意事项

1. **评分颜色**：星星颜色会根据评分自动变化：低分显示红色，中分显示黄色，高分显示绿色

2. **清空操作**：当 `allowClear` 为 `true` 时，点击当前评分的最后一颗星星会将评分清零

3. **悬停效果**：鼠标悬停时会预览评分效果，移开后恢复到实际评分

4. **受控模式**：必须使用 `value` 和 `onChange` 来控制评分状态

5. **禁用状态**：禁用后星星呈半透明状，无法交互

6. **分数显示**：`showScore` 会在星星左侧显示 "当前评分/总分" 格式的分数

7. **星星数量**：`count` 可以设置为任意正整数，建议不超过 10 颗星星

8. **小数评分**：组件本身不支持半星，但可以通过增加星星数量来模拟（如设置为 10 颗星表示 5.0 分制）

9. **cellKey 用途**：在表格等场景中用于唯一标识组件实例

10. **尺寸限制**：只提供三种预设尺寸，自定义尺寸需要通过 CSS 覆盖
