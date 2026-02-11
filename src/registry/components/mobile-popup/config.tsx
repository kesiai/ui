import { MobilePopup } from '@/registry/components/mobile-popup/mobile-popup'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './mobile-popup.md?raw'

export const mobilePopupPropsConfig = [
  {
    name: 'text',
    label: '按钮文字',
    type: 'text' as const,
    default: '弹出框'
  },
  {
    name: 'title',
    label: '标题',
    type: 'text' as const,
    default: ''
  },
  {
    name: 'position',
    label: '抽屉位置',
    type: 'select' as const,
    default: 'bottom',
    options: [
      { value: 'left', label: '左' },
      { value: 'right', label: '右' },
      { value: 'top', label: '上' },
      { value: 'bottom', label: '下' }
    ]
  },
  {
    name: 'mask',
    label: '显示蒙层',
    type: 'boolean' as const,
    default: true
  },
  {
    name: 'showCloseButton',
    label: '显示关闭按钮',
    type: 'boolean' as const,
    default: false
  },
  {
    name: 'showFormSubmitBtn',
    label: '保存按钮',
    type: 'boolean' as const,
    default: false,
    description: '可将子元素[数据表单]的[保存]按钮显示在底部'
  },
  {
    name: 'showFormCancelBtn',
    label: '取消按钮',
    type: 'boolean' as const,
    default: false,
    description: '可将子元素[数据表单]的[取消]按钮显示在底部'
  }
]

export const mobilePopupDefaultProps = {
  text: '弹出框',
  title: '',
  position: 'bottom' as 'left' | 'right' | 'top' | 'bottom',
  mask: true,
  showCloseButton: false,
  showFormSubmitBtn: false,
  showFormCancelBtn: false
}

const renderMobilePopupPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8 bg-slate-100">
      <div className="w-full max-w-md bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <MobilePopup
          text={props.text}
          title={props.title}
          position={props.position}
          mask={props.mask}
          showCloseButton={props.showCloseButton}
          showFormSubmitBtn={props.showFormSubmitBtn}
          showFormCancelBtn={props.showFormCancelBtn}
        >
          <div className="p-4 text-center text-slate-500">
            弹出框内容区域
          </div>
        </MobilePopup>
      </div>
    </div>
  )
}

const renderMobilePopupCodePreview = (props: Record<string, any>) => {
  return `<MobilePopup
  text="${props.text}"
  ${props.title ? `title="${props.title}"` : ''}
  position="${props.position}"
  ${!props.mask ? 'mask={false}' : ''}
  ${props.showCloseButton ? 'showCloseButton' : ''}
  ${props.showFormSubmitBtn ? 'showFormSubmitBtn' : ''}
  ${props.showFormCancelBtn ? 'showFormCancelBtn' : ''}
>
  <div>弹出框内容</div>
</MobilePopup>`
}

export const mobilePopupConfig: ComponentConfig = {
  id: 'mobile-popup',
  name: 'MobilePopup 弹出框',
  propsConfig: mobilePopupPropsConfig,
  defaultProps: mobilePopupDefaultProps,
  renderPreview: renderMobilePopupPreview,
  renderCodePreview: renderMobilePopupCodePreview,
  documentation: documentationMd
}
