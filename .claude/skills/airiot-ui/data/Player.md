## Player - 播放器组件

### 导入路径
```tsx
import { Player } from '@/components/airiot/player/player'
```

### 基础用法
```tsx
import { Player } from '@/components/airiot/player/player'

function PlayerExample() {
  return (
    <Player
      src="/path/to/video.mp4"
      controls={true}
      autoplay={false}
      loop={false}
    />
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | string | - | 媒体源 |
| controls | boolean | true | 显示控制栏 |
| autoplay | boolean | false | 自动播放 |
| loop | boolean | false | 循环播放 |
| muted | boolean | false | 静音 |
| volume | number | 1 | 音量（0-1） |

### 示例
```tsx
import { Player, Button, Card } from '@/components/airiot'

function VideoPlayer() {
  const [playing, setPlaying] = useState(false)

  return (
    <Card cardTitle="视频播放器">
      <Player
        src="/demo/video.mp4"
        controls={true}
        autoplay={false}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div style={{ marginTop: 16 }}>
        <Button
          type={playing ? 'default' : 'primary'}
          onClick={() => {
            const player = document.querySelector('video')
            if (player) {
              playing ? player.pause() : player.play()
            }
          }}
        >
          {playing ? '暂停' : '播放'}
        </Button>
      </div>
    </Card>
  )
}
```

### 支持格式
- 视频：mp4, webm, ogg
- 音频：mp3, wav, ogg

### 注意事项
- 支持全屏播放
- 可以自定义控制栏
- 支持键盘快捷键