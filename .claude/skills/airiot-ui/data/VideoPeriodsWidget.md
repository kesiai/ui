## VideoPeriodsWidget - 视频时段组件

### 导入路径
```tsx
import { VideoPeriodsWidget } from '@/components/airiot/video-periods-widget/video-periods-widget'
```

### 基础用法
```tsx
import { VideoPeriodsWidget } from '@/components/airiot/video-periods-widget/video-periods-widget'

function PeriodsWidgetExample() {
  const periods = [
    { start: 0, end: 30, label: '开场介绍' },
    { start: 60, end: 120, label: '主要内容' },
    { start: 180, end: 240, label: '总结' }
  ]

  return (
    <VideoPeriodsWidget
      periods={periods}
      currentTime={60}
      onPeriodSelect={handlePeriodSelect}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| periods | Array<{ start: number, end: number, label: string }> | [] | 时段列表 |
| currentTime | number | 0 | 当前时间 |
| onPeriodSelect | (period) => void | - | 时段选择回调 |
| showLabels | boolean | true | 是否显示标签 |

### 示例
```tsx
import { VideoPeriodsWidget, VideoWidget, Card } from '@/components/airiot'

function MeetingRecording() {
  const periods = [
    { start: 0, end: 300, label: '开场 (5分钟)' },
    { start: 300, end: 1200, label: '议题讨论 (15分钟)' },
    { start: 1200, end: 1800, label: '头脑风暴 (10分钟)' },
    { start: 1800, end: 2100, label: '总结 (5分钟)' }
  ]

  const [currentTime, setCurrentTime] = useState(0)

  return (
    <Card cardTitle="会议录像">
      <VideoWidget
        src="/meeting/recording.mp4"
        onTimeUpdate={(time) => setCurrentTime(time)}
      />

      <VideoPeriodsWidget
        periods={periods}
        currentTime={currentTime}
        onPeriodSelect={(period) => {
          const video = document.querySelector('video')
          if (video) {
            video.currentTime = period.start
          }
        }}
        showLabels={true}
      />

      <div style={{ marginTop: 16 }}>
        <h4>时段列表：</h4>
        {periods.map((period, index) => (
          <div key={index} style={{ marginBottom: 8 }}>
            <button
              onClick={() => {
                const video = document.querySelector('video')
                if (video) {
                  video.currentTime = period.start
                }
              }}
            >
              {period.label}
            </button>
          </div>
        ))}
      </div>
    </Card>
  )
}
```

### 时段数据格式
```typescript
interface VideoPeriod {
  start: number     // 开始时间（秒）
  end: number       // 结束时间（秒）
  label: string     // 时段标签
  color?: string    // 可选的颜色
}
```

### 注意事项
- 时间单位为秒
- 支持跳转到指定时段
- 可以自定义时段样式