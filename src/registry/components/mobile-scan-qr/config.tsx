import { MobileScanQR } from '@/registry/components/mobile-scan-qr/mobile-scan-qr'
import { ComponentConfig } from '@/app/config/types'

export const mobileScanQRPropsConfig = [
  {
    name: 'text',
    label: '按钮文字',
    type: 'text' as const,
    default: '扫描二维码'
  },
  {
    name: 'previewMode',
    label: '预览模式',
    type: 'boolean' as const,
    default: false,
    description: '预览模式下不触发扫描（用于预览演示）'
  }
]

export const mobileScanQRDefaultProps = {
  text: '扫描二维码',
  previewMode: false
}

const renderMobileScanQRPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <MobileScanQR
          text={props.text}
        />
        <p className="mt-4 text-xs text-slate-500">
          点击按钮打开扫描器扫描二维码
        </p>
      </div>
    </div>
  )
}

const renderMobileScanQRCodePreview = (props: Record<string, any>) => {
  return `<MobileScanQR
  text="${props.text}"
  ${props.previewMode ? 'previewMode' : ''}
/>`
}

export const mobileScanQRConfig: ComponentConfig = {
  id: 'mobile-scan-qr',
  name: 'MobileScanQR 二维码扫描',
  propsConfig: mobileScanQRPropsConfig,
  defaultProps: mobileScanQRDefaultProps,
  renderPreview: renderMobileScanQRPreview,
  renderCodePreview: renderMobileScanQRCodePreview
}
