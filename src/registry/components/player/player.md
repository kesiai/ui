> **安装命令**: `npx shadcn@latest add @kesi/player`

# Player 音频播放器

## 简介

`Player` 是一个功能完整的音频播放器组件，支持单音频和播放列表模式。

- **完整的播放控制**：播放/暂停、上一首、下一首、进度拖动
- **多种播放模式**：单曲循环、列表循环、自动播放下一首
- **播放列表管理**：可视化播放列表，支持快速切换音轨
- **音量控制**：音量调节滑块和一键静音
- **响应式设计**：自适应布局，支持自定义尺寸

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `playlist` | `AudioTrack[] \| string` | 否 | `[]` | 音频列表或单个音频 URL |
| `initialIndex` | `number` | 否 | `0` | 初始音频索引 |
| `showControls` | `boolean` | 否 | `true` | 是否显示控制按钮 |
| `showProgress` | `boolean` | 否 | `true` | 是否显示进度条 |
| `showVolume` | `boolean` | 否 | `true` | 是否显示音量控制 |
| `showPlaylist` | `boolean` | 否 | `false` | 是否显示播放列表按钮 |
| `loop` | `boolean` | 否 | `false` | 单曲循环 |
| `loopAll` | `boolean` | 否 | `false` | 列表循环 |
| `autoNext` | `boolean` | 否 | `false` | 自动播放下一首 |
| `autoplay` | `boolean` | 否 | `false` | 自动播放 |
| `initialVolume` | `number` | 否 | `1` | 初始音量 (0-1) |
| `width` | `string \| number` | 否 | - | 宽度 |
| `height` | `string \| number` | 否 | `40` | 高度 |
| `onProgress` | `(progress) => void` | 否 | - | 进度变化回调 |
| `onPlayerStateChange` | `(playing) => void` | 否 | - | 播放状态变化回调 |
| `onTrackChange` | `(index, track) => void` | 否 | - | 音轨变化回调 |
| `onVolumeChange` | `(volume) => void` | 否 | - | 音量变化回调 |

### AudioTrack

音频轨道对象：

```typescript
interface AudioTrack {
  src: string        // 音频文件 URL
  title?: string     // 音频标题
  type?: string      // 音频类型 (mp3, wav, ogg, etc.)
}
```

## 基本用法

### 1. 单音频播放

播放单个音频文件。

```tsx
import { Player } from '@/components/kesi/player'

function Example() {
  return (
    <Player
      playlist="https://example.com/audio.mp3"
    />
  )
}
```

### 2. 播放列表

使用播放列表模式，支持多个音频。

```tsx
function Example() {
  const playlist = [
    { src: '/audio1.mp3', title: '第一首' },
    { src: '/audio2.mp3', title: '第二首' },
    { src: '/audio3.mp3', title: '第三首' }
  ]

  return (
    <Player
      playlist={playlist}
      showPlaylist
      autoNext
    />
  )
}
```

### 3. 单曲循环

启用单曲循环模式。

```tsx
function Example() {
  return (
    <Player
      playlist="https://example.com/audio.mp3"
      loop
    />
  )
}
```

### 4. 列表循环

播放完所有音频后重新开始。

```tsx
function Example() {
  const playlist = [
    { src: '/audio1.mp3', title: '第一首' },
    { src: '/audio2.mp3', title: '第二首' }
  ]

  return (
    <Player
      playlist={playlist}
      loopAll
      showPlaylist
    />
  )
}
```

### 5. 自定义尺寸

自定义播放器的宽度和高度。

```tsx
function Example() {
  return (
    <Player
      playlist="https://example.com/audio.mp3"
      width="600px"
      height={50}
    />
  )
}
```

### 6. 隐藏控制元素

选择性隐藏进度条或音量控制。

```tsx
function Example() {
  return (
    <Player
      playlist="https://example.com/audio.mp3"
      showProgress={false}
      showVolume={false}
    />
  )
}
```

### 7. 事件监听

监听播放器的各种事件。

```tsx
function Example() {
  const handleProgress = (progress) => {
    console.log('播放进度:', progress)
  }

  const handleStateChange = (playing) => {
    console.log('播放状态:', playing)
  }

  const handleTrackChange = (index, track) => {
    console.log('切换音轨:', index, track)
  }

  return (
    <Player
      playlist={[
        { src: '/audio1.mp3', title: '第一首' },
        { src: '/audio2.mp3', title: '第二首' }
      ]}
      onProgress={handleProgress}
      onPlayerStateChange={handleStateChange}
      onTrackChange={handleTrackChange}
    />
  )
}
```

## 完整示例

### 音乐播放器应用

创建一个完整的音乐播放器界面。

```tsx
import { Player, AudioTrack } from '@/components/kesi/player'
import { useState } from 'react'

function MusicPlayerApp() {
  const [playlist, setPlaylist] = useState<AudioTrack[]>([
    { src: '/songs/song1.mp3', title: '夜曲' },
    { src: '/songs/song2.mp3', title: '晴天' },
    { src: '/songs/song3.mp3', title: '稻香' }
  ])

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 专辑封面 */}
        <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <div className="text-white text-6xl">🎵</div>
        </div>

        {/* 歌曲信息 */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">
            {playlist[currentTrackIndex]?.title}
          </h2>
          <p className="text-gray-600 mb-6">未知艺术家</p>

          {/* 播放器 */}
          <Player
            playlist={playlist}
            initialIndex={currentTrackIndex}
            showPlaylist
            autoNext
            loopAll
            onTrackChange={(index) => setCurrentTrackIndex(index)}
          />
        </div>
      </div>
    </div>
  )
}
```

## 注意事项

1. **音频格式**：确保音频 URL 指向支持的格式（MP3、WAV、OGG 等）。
2. **跨域问题**：如果音频在不同域，需要配置 CORS 头。
3. **自动播放限制**：浏览器可能阻止自动播放，需要用户交互后才能播放。
4. **循环模式**：`loop` 和 `loopAll` 互斥，同时启用时 `loop` 优先。
5. **性能考虑**：大量音频文件会影响页面加载，考虑懒加载。
6. **移动端优化**：移动端可能需要调整布局和触控区域大小。
