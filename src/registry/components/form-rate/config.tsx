import * as React from "react"
import { Rate } from '@/registry/components/form-rate/form-rate.tsx'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-rate.md?raw'

export const RatePreview: React.FC<{ props: Record<string, any> }> = ({ props }) => {
  const [value, setValue] = React.useState<number>(0)

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full">
        <Rate
          count={props.count || 5}
          disabled={props.disabled}
          allowClear={props.allowClear}
          showScore={props.showScore}
          size={props.size}
          value={value}
          onChange={setValue}
          cellKey="preview"
        />
        <p className="mt-4 text-sm text-slate-600">
          当前评分: {value}
        </p>
      </div>
    </div>
  )
}

export const ratePropsConfig = [
  {
    name: 'count',
    label: '星星总数',
    type: 'range' as const,
    default: 5,
    min: 1,
    max: 10,
    step: 1,
    description: '超过5级将使用线条模式（兼容 table-field）'
  },
  {
    name: 'defaultVal',
    label: '默认值',
    type: 'number' as const,
    default: 0,
    description: '兼容 table-field 配置'
  },
  {
    name: 'inList',
    label: '在列表中',
    type: 'boolean' as const,
    default: false,
    description: '在表格列表中显示时的样式（兼容 table-field）'
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'allowClear',
    label: '允许清除',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'showScore',
    label: '显示分数',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'size',
    label: '大小',
    type: 'select' as const,
    default: 'md',
    options: [
      { value: 'sm', label: '小' },
      { value: 'md', label: '中' },
      { value: 'lg', label: '大' }
    ]
  }
]

export const rateDefaultProps = {
  count: 5,
  defaultVal: 0,
  inList: false,
  disabled: false,
  allowClear: true,
  showScore: false,
  size: 'md'
}

const renderRatePreview = (props: Record<string, any>) => {
  return <RatePreview props={props} />
}

const renderRateCodePreview = (props: Record<string, any>) => {
  return `<Rate
  count={${props.count}}
  disabled={${props.disabled}}
  allowClear={${props.allowClear}}
  showScore={${props.showScore}}
  size="${props.size}"
  cellKey="your-cell-key"
/>`
}

export const rateConfig: ComponentConfig = {
  id: 'form-rate',
  name: 'Rate 星级评价',
  propsConfig: ratePropsConfig,
  defaultProps: rateDefaultProps,
  renderPreview: renderRatePreview,
  renderCodePreview: renderRateCodePreview,
  documentation: documentationMd
}
