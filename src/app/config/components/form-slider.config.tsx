import { FormSlider } from '@/registry/blocks/form/form-slider/form-slider'
import { ComponentConfig } from '../types'

export const formSliderPropsConfig = [
  {
    name: 'value',
    label: '初始值',
    type: 'text' as const,
    default: '0',
    description: '单个值或数组值，用逗号分隔多个值'
  },
  {
    name: 'disabled',
    label: '禁用',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'readOnly',
    label: '只读',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'min',
    label: '最小值',
    type: 'number' as const,
    default: 0
  },
  {
    name: 'max',
    label: '最大值',
    type: 'number' as const,
    default: 100
  },
  {
    name: 'step',
    label: '步长',
    type: 'number' as const,
    default: 1,
    min: 0
  },
  {
    name: 'range',
    label: '双滑块模式',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'dots',
    label: '拖拽到刻度上',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'vertical',
    label: '垂直方向',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'reverse',
    label: '反向坐标轴',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'marks',
    label: '刻度标记',
    type: 'array' as const,
    default: [],
    itemConfig: {
      type: 'object' as const,
      properties: [
        {
          name: 'number',
          label: '刻度值',
          type: 'number' as const,
          required: true
        },
        {
          name: 'label',
          label: '标记',
          type: 'text' as const,
          required: true
        }
      ]
    }
  }
]

export const formSliderDefaultProps = {
  disabled: false,
  readOnly: false,
  min: 0,
  max: 100,
  step: 1,
  range: false,
  dots: false,
  vertical: false,
  reverse: false,
  marks: []
}

const renderFormSliderPreview = (props: Record<string, any>) => {
  // 解析value字符串为数字或数字数组
  const parseValue = (valueStr: string) => {
    if (!valueStr) return props.range ? [20, 50] : 50
    const values = valueStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
    return values.length > 1 ? values : values[0] || 0
  }

  const sliderValue = parseValue(props.value)

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormSlider
          defaultValue={sliderValue}
          disabled={props.disabled}
          readOnly={props.readOnly}
          min={props.min}
          max={props.max}
          step={props.step}
          range={props.range}
          dots={props.dots}
          vertical={props.vertical}
          reverse={props.reverse}
          marks={props.marks}
        />
      </div>
    </div>
  )
}

const renderFormSliderCodePreview = (props: Record<string, any>) => {
  const parseValue = (valueStr: string) => {
    if (!valueStr) return props.range ? '[0, 100]' : '0'
    const values = valueStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
    return values.length > 1 ? `[${values.join(', ')}]` : values[0]?.toString() || '0'
  }

  const valueCode = `value={${parseValue(props.value)}}`

  return `<FormSlider
  ${valueCode}
  ${props.disabled ? 'disabled' : ''}
  ${props.readOnly ? 'readOnly' : ''}
  min={${props.min}}
  max={${props.max}}
  step={${props.step}}
  ${props.range ? 'range' : ''}
  ${props.dots ? 'dots' : ''}
  ${props.vertical ? 'vertical' : ''}
  ${props.reverse ? 'reverse' : ''}
  ${props.marks?.length > 0 ? `marks={${JSON.stringify(props.marks)}}` : ''}
/>`
}

export const formSliderConfig: ComponentConfig = {
  id: 'form-slider',
  name: 'Form.Slider 滑动输入条',
  propsConfig: formSliderPropsConfig,
  defaultProps: formSliderDefaultProps,
  renderPreview: renderFormSliderPreview,
  renderCodePreview: renderFormSliderCodePreview
}