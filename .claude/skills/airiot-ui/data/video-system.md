# 视频系统完整使用指南

## 简介

视频系统是一组协同工作的组件，用于视频播放和时间控制。所有视频组件都必须以 `VideoWidget` 为核心，配合其他控件组件使用。

## 系统架构

```
VideoWidget (核心播放器)
├── VideoButton (控制按钮)
├── VideoPlaybackWidget (播放控件)
├── VideoTimeAxisWidget (时间轴)
└── VideoPeriodsWidget (视频时段)
```

## 基础使用

### 最小可用组合

```tsx
import { VideoWidget } from '@/components';

function SimpleVideoPlayer() {
  return (
    <VideoWidget
      src="/path/to/video.mp4"
      controls={true}
      autoPlay={false}
    />
  );
}
```

### 完整功能组合

```tsx
import {
  VideoWidget,
  VideoButton,
  VideoPlaybackWidget,
  VideoTimeAxisWidget,
  VideoPeriodsWidget
} from '@/components';

function CompleteVideoSystem() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="video-container">
      {/* 核心播放器 */}
      <VideoWidget
        src="/path/to/video.mp4"
        width="100%"
        height="400px"
        poster="/path/to/poster.jpg"
        autoPlay={false}
        muted={false}
        onTimeUpdate={setCurrentTime}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* 播放控件 */}
      <VideoPlaybackWidget
        isPlaying={isPlaying}
        onPlay={() => videoRef.current?.play()}
        onPause={() => videoRef.current?.pause()}
        onProgress={(time) => videoRef.current!.currentTime = time}
      />

      {/* 时间轴 */}
      <VideoTimeAxisWidget
        currentTime={currentTime}
        duration={videoRef.current?.duration || 0}
        onSeek={(time) => videoRef.current!.currentTime = time}
        markers={[
          { time: 10, label: "标记点1" },
          { time: 30, label: "标记点2" }
        ]}
      />

      {/* 视频时段 */}
      <VideoPeriodsWidget
        periods={[
          { start: 0, end: 10, label: "开场" },
          { start: 20, end: 40, label: "主要内容" }
        ]}
        onPeriodSelect={(period) => {
          if (videoRef.current) {
            videoRef.current.currentTime = period.start;
          }
        }}
      />

      {/* 控制按钮 */}
      <div className="video-controls">
        <VideoButton onClick={handlePlay}>播放</VideoButton>
        <VideoButton onClick={handlePause}>暂停</VideoButton>
        <VideoButton onClick={handleStop}>停止</VideoButton>
        <VideoButton onClick={handleFullscreen}>全屏</VideoButton>
      </div>
    </div>
  );
}
```

## 组件详解

### VideoWidget (核心播放器)

**必须作为核心组件**，提供视频播放功能。

**关键 Props**:
```tsx
interface VideoWidgetProps {
  src: string;              // 视频源
  width?: string | number;   // 宽度
  height?: string | number;  // 高度
  poster?: string;          // 封面图
  autoPlay?: boolean;       // 自动播放
  muted?: boolean;          // 静音
  controls?: boolean;       // 显示原生控件
  onTimeUpdate?: (time: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}
```

### VideoPlaybackWidget (播放控件)

提供播放/暂停、进度条等控制功能。

### VideoTimeAxisWidget (时间轴)

显示视频时间轴，支持跳转和标记点。

### VideoPeriodsWidget (视频时段)

管理视频的时间段，支持快速跳转。

### VideoButton (控制按钮)

通用的视频控制按钮。

## 常见模式

### 1. 简单播放器

```tsx
<VideoWidget
  src="/videos/sample.mp4"
  controls={false}
  autoPlay={false}
/>
```

### 2. 带时间轴的播放器

```tsx
function VideoWithTimeline() {
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div>
      <VideoWidget
        src="/videos/sample.mp4"
        onTimeUpdate={setCurrentTime}
      />

      <VideoTimeAxisWidget
        currentTime={currentTime}
        duration={120}
        onSeek={(time) => {
          // 跳转到指定时间
        }}
      />
    </div>
  );
}
```

### 3. 带标记点的播放器

```tsx
function VideoWithMarkers() {
  return (
    <VideoWidget src="/videos/sample.mp4">
      <VideoTimeAxisWidget
        markers={[
          { time: 10, label: "章节1" },
          { time: 30, label: "章节2" },
          { time: 50, label: "章节3" }
        ]}
      />
    </VideoWidget>
  );
}
```

### 4. 多视频时段管理

```tsx
function VideoWithPeriods() {
  return (
    <VideoWidget src="/videos/sample.mp4">
      <VideoPeriodsWidget
        periods={[
          { start: 0, end: 10, label: "介绍" },
          { start: 10, end: 50, label: "主要内容" },
          { start: 50, end: 60, label: "总结" }
        ]}
      />
    </VideoWidget>
  );
}
```

## 高级功能

### 1. 自定义控制栏

```tsx
function CustomVideoControls() {
  return (
    <VideoWidget src="/videos/sample.mp4">
      <div className="custom-controls">
        <VideoButton icon="play">播放</VideoButton>
        <VideoButton icon="pause">暂停</VideoButton>
        <VideoButton icon="stop">停止</VideoButton>
        <VideoButton icon="fullscreen">全屏</VideoButton>
      </div>
    </VideoWidget>
  );
}
```

### 2. 视频列表播放

```tsx
function VideoPlaylist() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videos = [
    { id: 1, src: "/videos/1.mp4", title: "视频1" },
    { id: 2, src: "/videos/2.mp4", title: "视频2" },
    { id: 3, src: "/videos/3.mp4", title: "视频3" }
  ];

  return (
    <VideoWidget
      src={videos[currentVideo].src}
      onEnded={() => {
        // 自动播放下一个
        setCurrentVideo((currentVideo + 1) % videos.length);
      }}
    >
      <VideoPlaybackWidget
        onPrevious={() => setCurrentVideo(prev => (prev - 1 + videos.length) % videos.length)}
        onNext={() => setCurrentVideo(prev => (prev + 1) % videos.length)}
      />
    </VideoWidget>
  );
}
```

## 注意事项

1. **必须使用 VideoWidget**：作为视频系统的核心容器
2. **组件组合**：根据需要组合使用其他视频组件
3. **事件处理**：监听视频事件进行状态管理
4. **性能优化**：大视频文件考虑预加载和缓存

## 最佳实践

1. **响应式设计**：确保视频容器适应不同屏幕尺寸
2. **用户体验**：提供加载状态和错误处理
3. **可访问性**：支持键盘操作和屏幕阅读器
4. **性能监控**：监控视频加载和播放性能