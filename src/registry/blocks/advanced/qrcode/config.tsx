import QRCodeComp from '@/registry/blocks/advanced/qrcode/qrcode'
import { ComponentConfig } from '@/app/config/types'

export const qrcodePropsConfig = [
  {
    name: 'content',
    label: '二维码内容',
    type: 'text' as const,
    default: 'https://example.com',
    placeholder: '请输入要生成的二维码内容'
  },
  {
    name: 'width',
    label: '宽度',
    type: 'range' as const,
    default: 200,
    min: 50,
    max: 500,
    step: 10
  },
  {
    name: 'margin',
    label: '边距',
    type: 'range' as const,
    default: 1,
    min: 0,
    max: 10,
    step: 1
  },
  {
    name: 'darkColor',
    label: '前景色',
    type: 'color' as const,
    default: '#000000'
  },
  {
    name: 'lightColor',
    label: '背景色',
    type: 'color' as const,
    default: '#ffffff'
  }
]

export const qrcodeDefaultProps = {
  content: 'https://example.com',
  width: 200,
  margin: 1,
  darkColor: '#000000',
  lightColor: '#ffffff'
}

const renderQRCodePreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full h-48 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
        <QRCodeComp
          content={props.content}
          width={props.width}
          margin={props.margin}
          darkColor={props.darkColor}
          lightColor={props.lightColor}
          cellKey="preview"
        />
      </div>
    </div>
  )
}

const renderQRCodeCodePreview = (props: Record<string, any>) => {
  return `<QRCodeComp
  content="${props.content}"
  width={${props.width}}
  margin={${props.margin}}
  darkColor="${props.darkColor}"
  lightColor="${props.lightColor}"
  cellKey="your-cell-key"
/>`
}

export const qrcodeConfig: ComponentConfig = {
  id: 'qrcode',
  name: 'QRCode 二维码',
  propsConfig: qrcodePropsConfig,
  defaultProps: qrcodeDefaultProps,
  renderPreview: renderQRCodePreview,
  renderCodePreview: renderQRCodeCodePreview
}
