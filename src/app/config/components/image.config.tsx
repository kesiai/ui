import { Image } from '@/registry/blocks/components/image/image'
import { ComponentConfig } from '../types'

export const imagePropsConfig = [
  {
    name: 'src',
    label: '图片地址',
    type: 'text' as const,
    default: '',
    placeholder: 'https://example.com/image.jpg',
    description: '支持 http://、https:// 或相对路径'
  },
  {
    name: 'alt',
    label: '替代文本',
    type: 'text' as const,
    default: '图片',
    placeholder: '请输入图片描述',
    description: '图片无法显示时显示的文本'
  },
  {
    name: 'addParameters',
    label: '增加浏览器参数',
    type: 'boolean' as const,
    default: false,
    description: '勾选后，可以避免图片重名时图片不重新加载的问题'
  },
  {
    name: 'preserveAspectRatio',
    label: '等比缩放（SVG）',
    type: 'boolean' as const,
    default: true,
    description: '仅对 SVG 有效，控制 SVG 是否等比缩放'
  },
  {
    name: 'backgroundColor',
    label: '背景颜色',
    type: 'color' as const,
    default: '',
    description: '图片背景颜色，支持渐变'
  }
]

export const imageDefaultProps = {
  src: '',
  alt: '图片',
  addParameters: false,
  preserveAspectRatio: true,
  backgroundColor: ''
}

const renderImagePreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full h-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-4" style={{ minHeight: '400px' }}>
        <Image
          src={props.src}
          alt={props.alt}
          addParameters={props.addParameters}
          preserveAspectRatio={props.preserveAspectRatio}
          backgroundColor={props.backgroundColor}
        />
      </div>
    </div>
  )
}

const renderImageCodePreview = (props: Record<string, any>) => {
  if (!props.src) {
    return `<Image
  // 请配置图片地址
/>`
  }

  let code = `<Image`
  code += `\n  src="${props.src}"`
  if (props.alt !== '图片') {
    code += `\n  alt="${props.alt}"`
  }
  if (props.addParameters) {
    code += `\n  addParameters`
  }
  if (!props.preserveAspectRatio) {
    code += `\n  preserveAspectRatio={false}`
  }
  if (props.backgroundColor) {
    code += `\n  backgroundColor="${props.backgroundColor}"`
  }
  code += `\n/>`

  return code
}

const renderImageCustomForm = (props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
  if (props.src && props.src.includes('.svg')) {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-slate-700 mb-2">
          SVG 配置说明
        </p>
        <div className="text-sm text-slate-600">
          <p>检测到 SVG 图片，可以使用以下选项：</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>• 等比缩放：控制 SVG 是否等比缩放</li>
            <li>• 背景颜色：SVG 透明区域的背景色</li>
          </ul>
        </div>
      </div>
    )
  }
  return null
}

export const imageConfig: ComponentConfig = {
  id: 'image',
  name: 'Image 图片',
  propsConfig: imagePropsConfig,
  defaultProps: imageDefaultProps,
  renderPreview: renderImagePreview,
  renderCodePreview: renderImageCodePreview,
  renderCustomForm: renderImageCustomForm
}
