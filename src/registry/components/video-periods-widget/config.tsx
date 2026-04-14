import { useState } from 'react'
import { VideoPeriodsWidget, TimeSegment } from '@/registry/components/video-periods-widget/video-periods-widget'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './video-periods-widget.md?raw'

export const videoPeriodsPropsConfig = [
  {
    name: 'tableData',
    label: '设备',
    type: 'json' as const,
    default: JSON.stringify({}, null, 2),
    description: '选择设备表数据'
  },
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
  tableData: {},
  period: 'week' as const,
  recordingMode: 'CMR' as const,
  showActions: true,
  readonly: false
}

// 预览组件包装器，使用内部状态管理
const VideoPeriodsPreview = ({ props }: { props: Record<string, any> }) => {
  const getInitialData = (): TimeSegment[] => [
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
  ]

  const [segments, setSegments] = useState<TimeSegment[]>(getInitialData())

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <VideoPeriodsWidget
          period={props.period}
          recordingMode={props.recordingMode}
          showActions={props.showActions}
          readonly={props.readonly}
          tableData={props.tableData}
          value={segments}
          onChange={(newSegments) => setSegments(newSegments)}
        />
      </div>
    </div>
  )
}

const renderVideoPeriodsPreview = (props: Record<string, any>) => {
  return <VideoPeriodsPreview props={props} />
}

const renderVideoPeriodsCodePreview = (props: Record<string, any>) => {
  return `<VideoPeriodsWidget
  period="${props.period}"
  recordingMode="${props.recordingMode}"
  showActions={${props.showActions}}
  readonly={${props.readonly}}
  tableData={tableData}
  value={timeSegments}
  onChange={handleTimeSegmentsChange}
/>`
}

export const videoPeriodsConfig: ComponentConfig = {
  id: 'video-periods-widget',
  name: '录制计划',
  propsConfig: videoPeriodsPropsConfig,
  defaultProps: videoPeriodsDefaultProps,
  renderPreview: renderVideoPeriodsPreview,
  renderCodePreview: renderVideoPeriodsCodePreview,
  documentation: documentationMd
}
