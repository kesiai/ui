import { AIButton } from '@/registry/components/ai-button/ai-button'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './ai-button.md?raw'

export const aiButtonPropsConfig = [
  {
    name: 'label',
    label: '按钮文案',
    type: 'text' as const,
    default: 'AI 助手',
    description: '按钮上显示的文案'
  },
  {
    name: 'variant',
    label: '按钮样式',
    type: 'select' as const,
    default: 'default',
    options: [
      { value: 'default', label: '默认' },
      { value: 'secondary', label: '次要' },
      { value: 'outline', label: '轮廓' },
      { value: 'ghost', label: '幽灵' },
      { value: 'destructive', label: '危险' },
    ],
    description: '按钮变体'
  },
  {
    name: 'title',
    label: '弹窗标题',
    type: 'text' as const,
    default: 'AI 助手',
    description: '弹窗顶部标题'
  },
  {
    name: 'preamble',
    label: '系统提示词',
    type: 'text' as const,
    default: '',
    placeholder: '自定义系统提示词，定义助手行为/角色（首条消息注入）',
    description: '作为系统提示词在首条消息注入（ai-agent 的 preamble 能力）'
  },
  {
    name: 'dialogWidth',
    label: '弹窗宽度',
    type: 'text' as const,
    default: 'min(48rem, 92vw)',
    description: '弹窗宽度（CSS 值）'
  },
  {
    name: 'dialogHeight',
    label: '弹窗高度',
    type: 'text' as const,
    default: 'min(36rem, 85vh)',
    description: '弹窗高度（CSS 值）'
  },
]

export const aiButtonDefaultProps = {
  label: 'AI 助手',
  variant: 'default' as const,
  title: 'AI 助手',
  preamble: '',
  dialogWidth: 'min(48rem, 92vw)',
  dialogHeight: 'min(36rem, 85vh)',
}

export const aiButtonConfig: ComponentConfig = {
  id: 'ai-button',
  name: 'AI 按钮',
  propsConfig: aiButtonPropsConfig,
  defaultProps: aiButtonDefaultProps,
  renderPreview: (props: Record<string, any>) => {
    return (
      <div className="flex min-h-64 items-center justify-center p-8">
        <AIButton
          label={props.label}
          variant={props.variant}
          title={props.title}
          preamble={props.preamble}
          dialogWidth={props.dialogWidth}
          dialogHeight={props.dialogHeight}
        />
      </div>
    )
  },
  renderCodePreview: (props: Record<string, any>) => {
    const parts = ['<AIButton']
    parts.push(`  label="${props.label ?? 'AI 助手'}"`)
    if (props.variant && props.variant !== 'default') parts.push(`  variant="${props.variant}"`)
    if (props.title) parts.push(`  title="${props.title}"`)
    if (props.preamble) parts.push(`  preamble={\`${props.preamble}\`}`)
    parts.push('/>')
    return `import { AIButton } from "@/registry/components/ai-button/ai-button"\n\n${parts.join('\n')}`
  },
  documentation: documentationMd,
}

export default aiButtonConfig
