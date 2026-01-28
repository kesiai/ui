import { VideoPeriodsWidget } from '@/registry/blocks/video/video-periods-widget/video-periods-widget'
import { ComponentConfig } from '../types'

export const videoPeriodsPropsConfig = [
  {
    name: 'period',
    label: '周期类型',
    type: 'select' as const,
    default: 'week',
    options: [
      { value: 'week', label: '按周' },
      { value: 'everyday', label: '每天' }
    ]
  },
  {
    name: 'recordingMode',
    label: '录制模式',
    type: 'select' as const,
    default: 'CMR',
    options: [
      { value: 'CMR', label: '连续录制' },
      { value: 'ALARM', label: '报警录制' },
      { value: 'MANUAL', label: '手动录制' }
    ]
  },
  {
    name: 'showActions',
    label: '显示操作按钮',
    type: 'boolean' as const,
    default: true,
    description: '是否显示添加、清空等操作按钮'
  },
  {
    name: 'readonly',
    label: '只读模式',
    type: 'boolean' as const,
    default: false,
    description: '是否启用只读模式，禁用所有编辑功能'
  }
]

export const videoPeriodsDefaultProps = {
  period: 'week' as const,
  recordingMode: 'CMR' as const,
  showActions: true,
  readonly: false
}

const renderVideoPeriodsPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <VideoPeriodsWidget
          period={props.period}
          recordingMode={props.recordingMode}
          showActions={props.showActions}
          readonly={props.readonly}
          value={[
            {
              id: 'preview-1',
              name: '预览时间段1',
              day_of_week: props.period === 'week' ? 'Monday' : '',
              start_time: '09:00',
              end_time: '11:00',
              length: 120,
              recording_mode: props.recordingMode,
              segmentTime: { count: 10, unit: 'm' }
            },
            {
              id: 'preview-2',
              name: '预览时间段2',
              day_of_week: props.period === 'week' ? 'Wednesday' : '',
              start_time: '14:00',
              end_time: '16:30',
              length: 150,
              recording_mode: props.recordingMode,
              segmentTime: { count: 10, unit: 'm' }
            }
          ]}
          onChange={() => {}}
        />
      </div>
    </div>
  )
}

const renderVideoPeriodsCodePreview = (props: Record<string, any>) => {
  let code = `<VideoPeriodsWidget`
  if (props.period !== 'week') {
    code += `\n  period="${props.period}"`
  }
  if (props.recordingMode !== 'CMR') {
    code += `\n  recordingMode="${props.recordingMode}"`
  }
  if (!props.showActions) {
    code += `\n  showActions={false}`
  }
  if (props.readonly) {
    code += `\n  readonly`
  }
  code += `\n  value={timeSegments}`
  code += `\n  onChange={handleTimeSegmentsChange}`
  code += `\n/>`

  return code
}

const renderVideoPeriodsCustomForm = (props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
  if (props.readonly) {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-blue-800 mb-2">
          只读模式
        </p>
        <div className="text-sm text-blue-700">
          <p>当前组件处于只读模式，用户无法修改录制计划。</p>
          <p>如需编辑，请在属性面板中关闭"只读模式"选项。</p>
        </div>
      </div>
    )
  }

  if (!props.showActions) {
    return (
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm font-medium text-yellow-800 mb-2">
          操作按钮已隐藏
        </p>
        <div className="text-sm text-yellow-700">
          <p>当前已隐藏操作按钮，用户无法添加或删除时间段。</p>
          <p>如需显示操作按钮，请在属性面板中开启"显示操作按钮"选项。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
      <p className="text-sm font-medium text-green-800 mb-2">
        使用说明
      </p>
      <div className="text-sm text-green-700">
        <p>录制计划组件功能：</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>• 点击"添加时间段"为每天或指定日期添加录制时段</li>
          <li>• 时间段显示为蓝色条块，可查看时间范围</li>
          <li>• 点击时间段上的删除按钮可移除该时段</li>
          <li>• 切换周期类型会清空当前配置</li>
          <li>• 修改录制模式会影响所有时间段</li>
        </ul>
      </div>
    </div>
  )
}

export const videoPeriodsConfig: ComponentConfig = {
  id: 'videoPeriods',
  name: '录制计划',
  propsConfig: videoPeriodsPropsConfig,
  defaultProps: videoPeriodsDefaultProps,
  renderPreview: renderVideoPeriodsPreview,
  renderCodePreview: renderVideoPeriodsCodePreview,
  renderCustomForm: renderVideoPeriodsCustomForm
}
