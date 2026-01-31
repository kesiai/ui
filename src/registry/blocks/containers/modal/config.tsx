import { Modal } from '@/registry/blocks/containers/modal/modal'
import { ComponentConfig } from '@/app/config/types'

export const modalPropsConfig = [
  {
    name: 'title',
    label: '弹窗标题',
    type: 'text' as const,
    default: '弹窗标题',
    placeholder: '请输入标题'
  },
  {
    name: 'description',
    label: '弹窗描述',
    type: 'text' as const,
    default: '',
    placeholder: '请输入描述'
  },
  {
    name: 'modalWidth',
    label: '弹窗宽度',
    type: 'text' as const,
    default: '500px',
    placeholder: '500px 或 80%'
  },
  {
    name: 'modalHeight',
    label: '弹窗高度',
    type: 'text' as const,
    default: '',
    placeholder: '400px'
  },
  {
    name: 'showTrigger',
    label: '显示触发按钮',
    type: 'boolean' as const,
    default: false,
    description: '是否显示触发弹窗的按钮'
  },
  {
    name: 'triggerText',
    label: '触发按钮文字',
    type: 'text' as const,
    default: '打开弹窗',
    placeholder: '请输入按钮文字'
  },
  {
    name: 'hiddenMask',
    label: '隐藏遮罩',
    type: 'boolean' as const,
    default: false,
    description: '配置弹窗打开时页面是否有遮罩效果'
  },
  {
    name: 'destroyOnClose',
    label: '关闭时销毁数据',
    type: 'boolean' as const,
    default: false,
    description: '勾选后每次打开弹窗，弹窗内的数据会重新加载'
  },
  {
    name: 'showSubmitButton',
    label: '显示保存按钮',
    type: 'boolean' as const,
    default: false,
    description: '在弹窗底部显示保存按钮'
  },
  {
    name: 'showCancelButton',
    label: '显示取消按钮',
    type: 'boolean' as const,
    default: false,
    description: '在弹窗底部显示取消按钮'
  }
]

export const modalDefaultProps = {
  title: '弹窗标题',
  description: '',
  modalWidth: '500px',
  modalHeight: '',
  showTrigger: false,
  triggerText: '打开弹窗',
  hiddenMask: false,
  destroyOnClose: false,
  showSubmitButton: false,
  showCancelButton: false
}

const renderModalPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <Modal
          title={props.title}
          description={props.description}
          modalWidth={props.modalWidth}
          modalHeight={props.modalHeight}
          showTrigger={true}
          triggerText={props.triggerText}
          hiddenMask={props.hiddenMask}
          destroyOnClose={props.destroyOnClose}
          showSubmitButton={props.showSubmitButton}
          showCancelButton={props.showCancelButton}
        >
          <div className="flex items-center justify-center py-8 text-slate-400">
            <p>弹窗内容区域</p>
          </div>
        </Modal>
      </div>
    </div>
  )
}

const renderModalCodePreview = (props: Record<string, any>) => {
  let code = `<Modal`
  if (props.title !== '弹窗标题') {
    code += `\n  title="${props.title}"`
  }
  if (props.description) {
    code += `\n  description="${props.description}"`
  }
  if (props.modalWidth !== '500px') {
    code += `\n  modalWidth="${props.modalWidth}"`
  }
  if (props.modalHeight) {
    code += `\n  modalHeight="${props.modalHeight}"`
  }
  if (props.showTrigger) {
    code += `\n  showTrigger`
    if (props.triggerText !== '打开弹窗') {
      code += `\n  triggerText="${props.triggerText}"`
    }
  }
  if (props.hiddenMask) {
    code += `\n  hiddenMask`
  }
  if (props.destroyOnClose) {
    code += `\n  destroyOnClose`
  }
  if (props.showSubmitButton) {
    code += `\n  showSubmitButton`
  }
  if (props.showCancelButton) {
    code += `\n  showCancelButton`
  }
  code += `\n  open={open}`
  code += `\n  onOpenChange={setOpen}`
  code += `\n>`
  code += `\n  {/* 你的内容 */}`
  code += `\n</Modal>`

  return code
}

const renderModalCustomForm = (props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
  if (props.showSubmitButton || props.showCancelButton) {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-slate-700 mb-2">
          底部按钮说明
        </p>
        <div className="text-sm text-slate-600">
          <p>启用底部按钮后，可以通过回调函数处理按钮点击事件：</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {props.showSubmitButton && <li>• 保存按钮：点击时调用 onSubmit 回调</li>}
            {props.showCancelButton && <li>• 取消按钮：点击时调用 onCancel 回调并关闭弹窗</li>}
          </ul>
          <code className="block mt-2 px-2 py-1 bg-white rounded text-xs">
            {`<Modal
  showSubmitButton={true}
  showCancelButton={true}
  onSubmit={() => console.log('保存')}
  onCancel={() => console.log('取消')}
>
  {/* 内容 */}
</Modal>`}
          </code>
        </div>
      </div>
    )
  }
  return null
}

export const modalConfig: ComponentConfig = {
  id: 'modal',
  name: 'Modal 弹窗',
  propsConfig: modalPropsConfig,
  defaultProps: modalDefaultProps,
  renderPreview: renderModalPreview,
  renderCodePreview: renderModalCodePreview,
  renderCustomForm: renderModalCustomForm
}
