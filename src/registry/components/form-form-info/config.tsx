import { FormFormInfo } from '@/registry/components/form-form-info/form-form-info'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './form-form-info.md?raw'

export const formFormInfoPropsConfig = [
  {
    name: 'widgetContent',
    label: '组件代码',
    type: 'text' as const,
    default: '',
    description: '动态组件代码（待实现 Babel 转换）'
  }
]

export const formFormInfoDefaultProps = {
  widgetContent: ''
}

const renderFormFormInfoPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <FormFormInfo
          schema={{
            widgetContent: props.widgetContent
          }}
        />
      </div>
    </div>
  )
}

const renderFormFormInfoCodePreview = (props: Record<string, any>) => {
  return `<FormFormInfo
  schema={{
    widgetContent: "${props.widgetContent}"
  }}
/>`
}

export const formFormInfoConfig: ComponentConfig = {
  id: 'form-form-info',
  name: '表单信息',
  propsConfig: formFormInfoPropsConfig,
  defaultProps: formFormInfoDefaultProps,
  renderPreview: renderFormFormInfoPreview,
  renderCodePreview: renderFormFormInfoCodePreview,
  documentation: documentationMd
}

export default formFormInfoConfig
