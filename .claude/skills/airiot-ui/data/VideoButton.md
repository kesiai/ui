## VideoButton - 视频控制按钮组件

### 导入路径
```tsx
import { VideoButton } from '@/components/airiot/video-button/video-button'
```

### 基础用法
```tsx
import { VideoButton } from '@/components/airiot/video-button/video-button'

function VideoButtonExample() {
  return (
    <VideoButton
      type="play"
      onClick={handlePlay}
      size="large"
      disabled={false}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | 'play' \| 'pause' \| 'stop' \| 'fullscreen' \| 'volume' | 'play' | 按钮类型 |
| onClick | () => void | - | 点击回调 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 尺寸 |
| disabled | boolean | false | 是否禁用 |

### 示例
```tsx
import { VideoButton, VideoWidget } from '@/components/airiot'

function VideoControl() {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  return (
    <div>
      <VideoWidget
        src="/demo/video.mp4"
        controls={false}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <VideoButton
          type={playing ? 'pause' : 'play'}
          onClick={() => {
            const video = document.querySelector('video')
            if (video) {
              playing ? video.pause() : video.play()
            }
          }}
        />

        <VideoButton
          type="volume"
          onClick={() => {
            const video = document.querySelector('video')
            if (video) {
              video.muted = !video.muted
              setMuted(!muted)
            }
          }}
          muted={muted}
        />

        <VideoButton
          type="fullscreen"
          onClick={() => {
            const video = document.querySelector('video')
            if (video) {
              if (video.requestFullscreen) {
                video.requestFullscreen()
              }
            }
          }}
        />
      </div>
    </div>
  )
}
```

### 按钮类型
- play: 播放按钮
- pause: 暂停按钮
- stop: 停止按钮
- fullscreen: 全屏按钮
- volume: 音量按钮

### 注意事项
- 需要配合 VideoWidget 使用
- 支持动态状态切换
- 可以自定义图标和样式