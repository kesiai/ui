import { Popover } from '@/registry/components/container-popover/container-popover'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './container-popover.md?raw'

export const popoverPropsConfig = [
  {
    name: 'buttonName',
    label: '按钮文字',
    type: 'text' as const,
    default: '气泡卡片',
    placeholder: '请输入按钮文字'
  },
  {
    name: 'hiddenBtn',
    label: '隐藏按钮',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'disable',
    label: '禁用状态',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'trigger',
    label: '触发方式',
    type: 'select' as const,
    default: 'click',
    options: [
      { value: 'hover', label: '鼠标经过' },
      { value: 'click', label: '鼠标点击' }
    ],
    description: '定义鼠标触发气泡卡片显示时的交互方式'
  },
  {
    name: 'placement',
    label: '位置',
    type: 'select' as const,
    default: 'top',
    options: [
      { value: 'top', label: '上' },
      { value: 'bottom', label: '下' },
      { value: 'left', label: '左' },
      { value: 'right', label: '右' }
    ],
    description: '以按钮为参考，气泡卡片显示的位置'
  },
  {
    name: 'width',
    label: '宽度',
    type: 'text' as const,
    default: '200',
    placeholder: '200 或 200px'
  },
  {
    name: 'height',
    label: '高度',
    type: 'text' as const,
    default: '200',
    placeholder: '200 或 200px'
  }
]

export const popoverDefaultProps = {
  buttonName: '气泡卡片',
  hiddenBtn: false,
  disable: false,
  trigger: 'click' as const,
  placement: 'top' as const,
  width: 200,
  height: 200
}

const renderPopoverPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <Popover
          buttonName={props.buttonName}
          hiddenBtn={props.hiddenBtn}
          disable={props.disable}
          trigger={props.trigger}
          placement={props.placement}
          width={props.width}
          height={props.height}
        >
          <div className="flex items-center justify-center h-full text-slate-400">
            <p>气泡内容区域</p>
          </div>
        </Popover>
      </div>
    </div>
  )
}

const renderPopoverCodePreview = (props: Record<string, any>) => {
  let code = `<Popover`
  if (props.buttonName !== '气泡卡片') {
    code += `\n  buttonName="${props.buttonName}"`
  }
  if (props.hiddenBtn) {
    code += `\n  hiddenBtn`
  }
  if (props.disable) {
    code += `\n  disable`
  }
  if (props.trigger !== 'click') {
    code += `\n  trigger="${props.trigger}"`
  }
  if (props.placement !== 'top') {
    code += `\n  placement="${props.placement}"`
  }
  if (props.width !== 200) {
    code += `\n  width={${props.width}}`
  }
  if (props.height !== 200) {
    code += `\n  height={${props.height}}`
  }
  code += `\n  open={open}`
  code += `\n  onOpenChange={setOpen}`
  code += `\n>`
  code += `\n  {/* 气泡内容 */}`
  code += `\n</Popover>`

  return code
}

const renderPopoverCustomForm = (props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
  if (props.trigger === 'hover') {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-slate-700 mb-2">
          Hover 模式说明
        </p>
        <div className="text-sm text-slate-600">
          <p>当触发方式设置为"鼠标经过"时：</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>• 鼠标移到按钮上时自动显示气泡</li>
            <li>• 鼠标移开时自动隐藏气泡</li>
            <li>• 适合显示提示信息或快捷操作</li>
          </ul>
        </div>
      </div>
    )
  }
  return null
}

export const popoverConfig: ComponentConfig = {
  id: 'container-popover',
  name: '气泡卡片',
  propsConfig: popoverPropsConfig,
  defaultProps: popoverDefaultProps,
  renderPreview: renderPopoverPreview,
  renderCodePreview: renderPopoverCodePreview,
  renderCustomForm: renderPopoverCustomForm,
  documentation: documentationMd
}
