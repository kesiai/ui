import { ButtonWidget } from '@/registry/blocks/video/button-widget/button-widget'
import { ComponentConfig } from '../types'

export const buttonControlPropsConfig = [
  {
    name: 'size',
    label: '尺寸',
    type: 'number' as const,
    default: 220,
    min: 120,
    max: 600,
    step: 10
  },
  {
    name: 'bg',
    label: '背景色',
    type: 'color' as const,
    default: '#222641'
  },
  {
    name: 'btnColor',
    label: '按钮颜色',
    type: 'color' as const,
    default: '#757c99'
  },
  {
    name: 'controlMode',
    label: '控制模式',
    type: 'select' as const,
    default: 'hold',
    options: [
      { value: 'hold', label: '按住' },
      { value: 'click', label: '点击' }
    ]
  },
  {
    name: 'disable',
    label: '禁用状态',
    type: 'boolean' as const,
    default: false
  }
]

export const buttonControlDefaultProps = {
  size: 220,
  bg: '#222641',
  btnColor: '#757c99',
  controlMode: 'hold' as const,
  disable: false
}

const renderbuttonControlPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8 flex items-center justify-center">
        <ButtonWidget
          size={props.size}
          bg={props.bg}
          btnColor={props.btnColor}
          controlMode={props.controlMode}
          disable={props.disable}
        />
      </div>
    </div>
  )
}

const renderbuttonControlCodePreview = (props: Record<string, any>) => {
  let code = `<ButtonWidget`
  if (props.size !== 220) {
    code += `\n  size={${props.size}}`
  }
  if (props.bg !== '#222641') {
    code += `\n  bg="${props.bg}"`
  }
  if (props.btnColor !== '#757c99') {
    code += `\n  btnColor="${props.btnColor}"`
  }
  if (props.controlMode !== 'hold') {
    code += `\n  controlMode="${props.controlMode}"`
  }
  if (props.disable) {
    code += `\n  disable`
  }
  code += `\n/>`

  return code
}

const renderbuttonControlCustomForm = (props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
  return null
}

export const buttonControlConfig: ComponentConfig = {
  id: 'buttonControl',
  name: '云台控制',
  propsConfig: buttonControlPropsConfig,
  defaultProps: buttonControlDefaultProps,
  renderPreview: renderbuttonControlPreview,
  renderCodePreview: renderbuttonControlCodePreview,
  renderCustomForm: renderbuttonControlCustomForm
}
