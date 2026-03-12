## Bar - 条形组件

### 导入路径
```tsx
import { Bar } from '@/components/airiot/bar/bar'
```

### 基础用法
```tsx
import { Bar } from '@/components/airiot/bar/bar'

function BarExample() {
  return (
    <Bar
      value={75}
      max={100}
      color="primary"
      showLabel={true}
      animated={true}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | number | - | 当前值 |
| max | number | 100 | 最大值 |
| color | string | 'primary' | 颜色主题 |
| showLabel | boolean | true | 是否显示标签 |
| animated | boolean | true | 是否启用动画 |
| height | number | 20 | 高度 |
| rounded | boolean | false | 是否圆角 |

### 示例
```tsx
import { Bar, Card } from '@/components/airiot'

function ProgressExample() {
  const stats = [
    { label: 'CPU使用率', value: 65, max: 100 },
    { label: '内存使用率', value: 45, max: 100 },
    { label: '磁盘使用率', value: 80, max: 100 }
  ]

  return (
    <Card cardTitle="系统状态">
      {stats.map((stat, index) => (
        <div key={index} style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 4 }}>
            {stat.label}: {stat.value}%
          </div>
          <Bar
            value={stat.value}
            max={stat.max}
            color={stat.value > 70 ? 'error' : 'success'}
            height={8}
            rounded={true}
          />
        </div>
      ))}
    </Card>
  )
}
```

### 注意事项
- 适合展示进度或比例数据
- 支持多种颜色主题
- 可以配合 Card 使用