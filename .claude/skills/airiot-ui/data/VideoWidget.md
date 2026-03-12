# VideoWidget 视频播放容器

## 导入路径

```tsx
import {
  VideoWidget,
  VideoButton,
  VideoPlaybackWidget,
  VideoTimeAxisWidget,
  VideoPeriodsWidget
} from '@/components/airiot/video'
```

## 完整使用示例

```tsx
import {
  VideoWidget,
  VideoButton,
  VideoPlaybackWidget,
  VideoTimeAxisWidget,
  VideoPeriodsWidget
} from '@/components/airiot/video'
import { Button } from '@/components/airiot/button'
import { Text } from '@/components/airiot/text'

function VideoPlayerExample() {
  // 视频配置
  const videoConfig = {
    src: '/path/to/video.mp4',
    poster: '/path/to/poster.jpg',
    controls: true,
    autoplay: false,
    muted: false
  }

  // 时间轴标记
  const periods = [
    {
      id: 1,
      start: 0,
      end: 30,
      color: '#00ff00',
      label: '时间段1'
    },
    {
      id: 2,
      start: 60,
      end: 90,
      color: '#ff0000',
      label: '时间段2'
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Text variant="title">视频播放器示例</Text>
        <div className="space-x-2">
          <Button onClick={() => console.log('加载视频')}>加载视频</Button>
          <Button onClick={() => console.log('重置')}>重置</Button>
        </div>
      </div>

      <VideoWidget {...videoConfig}>
        {/* 播放控件 */}
        <VideoPlaybackWidget
          onPlay={(time) => console.log('播放:', time)}
          onPause={(time) => console.log('暂停:', time)}
          onTimeUpdate={(time) => console.log('时间更新:', time)}
        />

        {/* 自定义按钮 */}
        <VideoButton
          icon="play"
          tooltip="播放"
          onClick={() => console.log('点击播放')}
        />

        {/* 时间轴 */}
        <VideoTimeAxisWidget
          duration={120}
          onSeek={(time) => console.log('跳转到:', time)}
        >
          {/* 时间轴标记 */}
          <VideoPeriodsWidget
            periods={periods}
            onPeriodClick={(period) => console.log('点击时间段:', period)}
          />
        </VideoTimeAxisWidget>
      </VideoWidget>

      {/* 播放控制面板 */}
      <div className="flex items-center space-x-4">
        <Button onClick={() => console.log('播放/暂停')}>
          播放/暂停
        </Button>
        <Button onClick={() => console.log('音量')}>
          音量
        </Button>
        <Button onClick={() => console.log('全屏')}>
          全屏
        </Button>
      </div>
    </div>
  )
}
```

## Props

### VideoWidget

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | string | - | 视频源地址 |
| poster | string | - | 视频封面 |
| controls | boolean | true | 是否显示默认控件 |
| autoplay | boolean | false | 是否自动播放 |
| muted | boolean | false | 是否静音 |
| style | React.CSSProperties | - | 容器样式 |
| onTimeUpdate | (time: number) => void | - | 时间更新事件 |
| onPlay | () => void | - | 播放事件 |
| onPause | () => void | - | 暂停事件 |
| onEnded | () => void | - | 结束事件 |

### VideoPlaybackWidget

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| onPlay | (time: number) => void | - | 播放事件 |
| onPause | (time: number) => void | - | 暂停事件 |
| onTimeUpdate | (time: number) => void | - | 时间更新事件 |
| className | string | - | 自定义样式类 |

### VideoButton

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| icon | string | - | 图标名称 |
| tooltip | string | - | 提示文本 |
| onClick | () => void | - | 点击事件 |
| disabled | boolean | false | 是否禁用 |
| size | 'sm' \| 'md' \| 'lg' | 'md' | 按钮大小 |

### VideoTimeAxisWidget

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| duration | number | - | 视频总时长（秒） |
| currentTime | number | 0 | 当前时间（秒） |
| onSeek | (time: number) => void | - | 跳转事件 |
| className | string | - | 自定义样式类 |

### VideoPeriodsWidget

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| periods | Period[] | - | 时间段数组 |
| onPeriodClick | (period: Period) => void | - | 点击时间段事件 |
| height | number | 20 | 时间轴高度 |

### Period

```tsx
interface Period {
  id: number | string
  start: number // 开始时间（秒）
  end: number // 结束时间（秒）
  color: string // 颜色
  label?: string // 标签
}
```

## 注意事项

- VideoWidget 是视频播放器的根容器，必须作为最外层组件
- 子组件的顺序会影响渲染顺序，请合理安排
- 使用 VideoTimeAxisWidget 时，需要确保包含 VideoPeriodsWidget 作为子组件
- 视频源需要支持CORS，否则可能出现跨域问题
- 建议使用 VideoPlaybackWidget 来处理播放事件，而不是直接使用 VideoWidget 的事件