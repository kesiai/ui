import { ButtonWidget } from '@/registry/components/video-button/video-button'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './video-button.md?raw'

export const buttonControlPropsConfig = [
  {
    name: 'tableData',
    label: '设备',
    type: 'json' as const,
    default: JSON.stringify({}, null, 2),
    description: '选择设备表数据'
  },
  {
    name: 'table',
    label: '设备表',
    type: 'json' as const,
    default: JSON.stringify({}, null, 2),
    description: '设备表信息'
  },
  {
    name: 'buttonType',
    label: '云台类型',
    type: 'select' as const,
    default: 'hk',
    options: [
      { value: 'hk', label: '海康' },
      { value: 'ez', label: '萤石' }
    ]
  },
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
  tableData: {},
  table: {},
  buttonType: 'hk' as const,
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
          tableData={props.tableData}
          table={props.table}
          buttonType={props.buttonType}
        />
      </div>
    </div>
  )
}

const renderbuttonControlCodePreview = (props: Record<string, any>) => {
  return `<ButtonWidget
  size={${props.size}}
  bg="${props.bg}"
  btnColor="${props.btnColor}"
  controlMode="${props.controlMode}"
  disable={${props.disable}}
  tableData={tableData}
  table={table}
  buttonType="${props.buttonType}"
/>`
}

export const buttonControlConfig: ComponentConfig = {
  id: 'video-button',
  name: '云台控制',
  propsConfig: buttonControlPropsConfig,
  defaultProps: buttonControlDefaultProps,
  renderPreview: renderbuttonControlPreview,
  renderCodePreview: renderbuttonControlCodePreview,
  documentation: documentationMd
}
