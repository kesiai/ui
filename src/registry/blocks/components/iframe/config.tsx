import { Iframe } from '@/registry/blocks/components/iframe/iframe'
import { ComponentConfig } from '@/app/config/types'

export const iframePropsConfig = [
  {
    name: 'iframeSrc',
    label: 'iframe 地址',
    type: 'text' as const,
    default: '',
    placeholder: 'https://example.com',
    description: '手动输入地址需要写 http:// 或 https://'
  },
  {
    name: 'hasToken',
    label: '携带 token',
    type: 'boolean' as const,
    default: false,
    description: '点击是，会进行权限认证，非 admin 用户进行验证'
  }
]

export const iframeDefaultProps = {
  iframeSrc: '',
  hasToken: false
}

const renderIframePreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full h-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-4" style={{ minHeight: '400px' }}>
        <Iframe
          iframeSrc={props.iframeSrc}
          hasToken={props.hasToken}
        />
      </div>
    </div>
  )
}

const renderIframeCodePreview = (props: Record<string, any>) => {
  if (!props.iframeSrc) {
    return `<Iframe
  // 请配置 iframe 地址
/>`
  }

  let code = `<Iframe`
  code += `\n  iframeSrc="${props.iframeSrc}"`
  if (props.hasToken) {
    code += `\n  hasToken`
  }
  code += `\n  useToken={() => {
    // 返回你的 token
    return 'your-token'
  }}`
  code += `\n/>`

  return code
}

const renderIframeCustomForm = (props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
  if (props.hasToken) {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-slate-700 mb-2">
          Token 配置说明
        </p>
        <div className="text-sm text-slate-600">
          <p>启用携带 token 后，会进行权限认证。需要传入 useToken 函数来获取 token：</p>
          <code className="block mt-2 px-2 py-1 bg-white rounded text-xs">
            {`useToken={() => {
  // 从你的状态管理或 API 获取 token
  return token
}}`}
          </code>
        </div>
      </div>
    )
  }
  return null
}

export const iframeConfig: ComponentConfig = {
  id: 'iframe',
  name: 'Iframe 嵌入',
  propsConfig: iframePropsConfig,
  defaultProps: iframeDefaultProps,
  renderPreview: renderIframePreview,
  renderCodePreview: renderIframeCodePreview,
  renderCustomForm: renderIframeCustomForm
}
