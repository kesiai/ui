import { Player, AudioTrack } from './player'
import { ComponentConfig } from '@/app/config/types'

// 示例音频列表
const examplePlaylist: AudioTrack[] = [
  {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    title: '测试音频1',
    type: 'mp3'
  },
  {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    title: '测试音频2',
    type: 'mp3'
  },
  {
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    title: '测试音频3',
    type: 'mp3'
  }
]

export const playerPropsConfig = [
  {
    name: 'showControls',
    label: '显示控制按钮',
    type: 'boolean' as const,
    default: true,
    description: '是否显示播放/暂停、上一首、下一首等控制按钮'
  },
  {
    name: 'showProgress',
    label: '显示进度条',
    type: 'boolean' as const,
    default: true,
    description: '是否显示音频播放进度条'
  },
  {
    name: 'showVolume',
    label: '显示音量控制',
    type: 'boolean' as const,
    default: true,
    description: '是否显示音量调节滑块'
  },
  {
    name: 'showPlaylist',
    label: '显示播放列表按钮',
    type: 'boolean' as const,
    default: false,
    description: '是否显示播放列表切换按钮'
  },
  {
    name: 'loop',
    label: '单曲循环',
    type: 'boolean' as const,
    default: false,
    description: '启用后，当前音频播放完成后会重新播放'
  },
  {
    name: 'loopAll',
    label: '列表循环',
    type: 'boolean' as const,
    default: false,
    description: '启用后，播放到最后一首后会回到第一首继续播放'
  },
  {
    name: 'autoNext',
    label: '自动播放下一首',
    type: 'boolean' as const,
    default: false,
    description: '启用后，当前音频播放完成后自动播放下一首'
  },
  {
    name: 'autoplay',
    label: '自动播放',
    type: 'boolean' as const,
    default: false,
    description: '启用后，页面加载时自动开始播放'
  },
  {
    name: 'initialVolume',
    label: '初始音量',
    type: 'range' as const,
    default: 1,
    min: 0,
    max: 1,
    step: 0.1,
    description: '设置播放器的初始音量（0-1）'
  },
  {
    name: 'width',
    label: '宽度',
    type: 'text' as const,
    default: '100%',
    placeholder: '如: 100%, 400px, auto',
    description: '设置播放器的宽度'
  },
  {
    name: 'height',
    label: '高度',
    type: 'number' as const,
    default: 40,
    min: 30,
    max: 100,
    description: '设置播放器的高度（像素）'
  }
]

export const playerDefaultProps = {
  playlist: examplePlaylist,
  showControls: true,
  showProgress: true,
  showVolume: true,
  showPlaylist: false,
  loop: false,
  loopAll: false,
  autoNext: false,
  autoplay: false,
  initialVolume: 1,
  width: '100%',
  height: 40
}

const renderPlayerPreview = (props: Record<string, any>) => {
  const displayPlaylist = props.showPlaylist
    ? examplePlaylist.slice(0, 2) // 预览时只显示2个音频
    : examplePlaylist.slice(0, 1) // 默认只显示1个音频

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <div className="text-center mb-6">
          <p className="text-sm text-slate-600 mb-2">音频播放器预览</p>
          <p className="text-xs text-slate-500">
            点击播放按钮试听 • 实际使用时请替换为真实音频 URL
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Player
            playlist={displayPlaylist}
            showControls={props.showControls}
            showProgress={props.showProgress}
            showVolume={props.showVolume}
            showPlaylist={props.showPlaylist}
            loop={props.loop}
            loopAll={props.loopAll}
            autoNext={props.autoNext}
            autoplay={props.autoplay}
            initialVolume={props.initialVolume}
            width="100%"
            height={props.height}
          />
        </div>
        <div className="mt-6 text-xs text-slate-500 text-center">
          <p className="mb-2">当前播放列表：</p>
          <div className="space-y-1">
            {displayPlaylist.map((track: AudioTrack, index: number) => (
              <div key={index} className="flex items-center gap-2 bg-white rounded border p-2">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-slate-700">{track.title || track.src}</p>
                  <p className="text-xs text-slate-400 truncate">{track.src}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const renderPlayerCodePreview = (props: Record<string, any>) => {
  const playlistStr = props.showPlaylist
    ? `[\n    { src: 'audio1.mp3', title: '音频 1' },\n    { src: 'audio2.mp3', title: '音频 2' }\n  ]`
    : `[\n    { src: 'audio.mp3', title: '音频' }\n  ]`

  let code = `<Player`
  code += `\n  playlist={${playlistStr}}`

  if (!props.showControls) code += `\n  showControls={false}`
  if (!props.showProgress) code += `\n  showProgress={false}`
  if (!props.showVolume) code += `\n  showVolume={false}`
  if (props.showPlaylist) code += `\n  showPlaylist`
  if (props.loop) code += `\n  loop`
  if (props.loopAll) code += `\n  loopAll`
  if (props.autoNext) code += `\n  autoNext`
  if (props.autoplay) code += `\n  autoplay`
  if (props.initialVolume !== 1) code += `\n  initialVolume={${props.initialVolume}}`
  if (props.width !== '100%') code += `\n  width="${props.width}"`
  if (props.height !== 40) code += `\n  height={${props.height}}`

  code += `\n  width="100%"`
  code += `\n  height={40}`
  code += `\n/>`

  return code
}

const renderPlayerCustomForm = (props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-sm font-medium text-slate-700 mb-3">
        播放器配置说明
      </p>
      <div className="text-sm text-slate-600 space-y-3">
        <p>音频播放器支持多种播放模式：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>• <strong>单曲循环</strong>：当前音频重复播放</li>
          <li>• <strong>列表循环</strong>：播放完最后首后回到第一首</li>
          <li>• <strong>自动播放下一首</strong>：顺序播放列表中的音频</li>
        </ul>
        <div className="mt-3 p-3 bg-white rounded border border-blue-100">
          <p className="font-medium mb-2">音频列表配置：</p>
          <pre className="text-xs overflow-x-auto bg-slate-50 p-2 rounded">
{`const playlist: AudioTrack[] = [
  {
    src: '/audio/sample.mp3',
    title: '示例音频',
    type: 'mp3'
  },
  // 更多音频...
]`}
          </pre>
        </div>
        <div className="mt-2 p-3 bg-white rounded border border-blue-100">
          <p className="font-medium mb-2">事件回调：</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><code>onProgress</code> - 播放进度变化</li>
            <li><code>onPlayerStateChange</code> - 播放状态变化</li>
            <li><code>onTrackChange</code> - 音轨切换</li>
            <li><code>onVolumeChange</code> - 音量变化</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export const playerConfig: ComponentConfig = {
  id: 'player',
  name: 'Player 音频播放器',
  propsConfig: playerPropsConfig,
  defaultProps: playerDefaultProps,
  renderPreview: renderPlayerPreview,
  renderCodePreview: renderPlayerCodePreview,
  renderCustomForm: renderPlayerCustomForm
}
