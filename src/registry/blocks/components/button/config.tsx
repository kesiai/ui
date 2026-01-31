import { Button } from '@/registry/blocks/components/button/button'
import { ComponentConfig } from '@/app/config/types'

export const buttonPropsConfig = [
  {
    name: 'text',
    label: '按钮文字',
    type: 'text' as const,
    default: '按钮',
    placeholder: '请输入按钮文字'
  },
  {
    name: 'variant',
    label: '按钮样式',
    type: 'select' as const,
    default: 'default',
    options: [
      { value: 'default', label: '默认' },
      { value: 'destructive', label: '危险' },
      { value: 'outline', label: '轮廓' },
      { value: 'secondary', label: '次要' },
      { value: 'ghost', label: '幽灵' },
      { value: 'link', label: '链接' }
    ]
  },
  {
    name: 'size',
    label: '按钮尺寸',
    type: 'select' as const,
    default: 'default',
    options: [
      { value: 'default', label: '默认' },
      { value: 'sm', label: '小' },
      { value: 'lg', label: '大' },
      { value: 'icon', label: '图标' }
    ]
  },
  {
    name: 'border',
    label: '隐藏边框',
    type: 'boolean' as const,
    default: false,
    description: '点击是，按钮无边框'
  },
  {
    name: 'disable',
    label: '禁用状态',
    type: 'boolean' as const,
    default: false,
    description: '可以用来实现隐藏按钮功能'
  },
  {
    name: 'isSubmit',
    label: '表单提交键',
    type: 'boolean' as const,
    default: false,
    description: '点击是，按钮为表单提交按钮，和表单配合使用的情况下可使用此功能'
  },
  {
    name: 'isReset',
    label: '表单重置键',
    type: 'boolean' as const,
    default: false,
    description: '点击是，按钮为表单重置按钮，和表单配合使用的情况下可使用此功能'
  },
  {
    name: 'loading',
    label: '加载状态',
    type: 'boolean' as const,
    default: false
  }
]

export const buttonDefaultProps = {
  text: '按钮',
  variant: 'default' as const,
  size: 'default' as const,
  border: false,
  disable: false,
  isSubmit: false,
  isReset: false,
  loading: false
}

const renderButtonPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8">
        <Button
          text={props.text}
          variant={props.variant}
          size={props.size}
          border={props.border}
          disable={props.disable}
          isSubmit={props.isSubmit}
          isReset={props.isReset}
          loading={props.loading}
        />
      </div>
    </div>
  )
}

const renderButtonCodePreview = (props: Record<string, any>) => {
  let code = `<Button`
  if (props.text !== '按钮') {
    code += `\n  text="${props.text}"`
  }
  if (props.variant !== 'default') {
    code += `\n  variant="${props.variant}"`
  }
  if (props.size !== 'default') {
    code += `\n  size="${props.size}"`
  }
  if (props.border) {
    code += `\n  border`
  }
  if (props.disable) {
    code += `\n  disable`
  }
  if (props.isSubmit) {
    code += `\n  isSubmit`
  }
  if (props.isReset) {
    code += `\n  isReset`
  }
  if (props.loading) {
    code += `\n  loading`
  }
  code += `\n/>`

  return code
}

const renderButtonCustomForm = (props: Record<string, any>, _onChange: (name: string, value: any) => void) => {
  if (props.isSubmit || props.isReset) {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-slate-700 mb-2">
          表单集成说明
        </p>
        <div className="text-sm text-slate-600">
          <p>按钮需要与 FormContext 配合使用：</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {props.isSubmit && <li>• 提交按钮：点击时触发表单提交</li>}
            {props.isReset && <li>• 重置按钮：点击时触发表单重置</li>}
          </ul>
          <code className="block mt-2 px-2 py-1 bg-white rounded text-xs">
            {`import { FormContext } from '@/lib/form-context'

<FormContext.Provider value={{ handleSubmit, onReset }}>
  <YourForm>
    <Button isSubmit={true} />
  </YourForm>
</FormContext.Provider>`}
          </code>
        </div>
      </div>
    )
  }
  return null
}

export const buttonConfig: ComponentConfig = {
  id: 'button',
  name: 'Button 按钮',
  propsConfig: buttonPropsConfig,
  defaultProps: buttonDefaultProps,
  renderPreview: renderButtonPreview,
  renderCodePreview: renderButtonCodePreview,
  renderCustomForm: renderButtonCustomForm
}
