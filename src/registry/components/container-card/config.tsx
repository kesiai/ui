import { Card } from '@/registry/components/container-card/container-card'
import { ComponentConfig } from '@/app/config/types'
import documentationMd from './container-card.md?raw'

export const cardPropsConfig = [
  {
    name: 'cardTitle',
    label: '标题',
    type: 'text' as const,
    default: '卡片标题',
    placeholder: '请输入标题'
  }
]

export const cardDefaultProps = {
  cardTitle: '卡片标题',
}
const renderCardPreview = (props: Record<string, any>) => {
  return (
    <Card
      cardTitle={props.cardTitle}
    >
      <div className="flex items-center justify-center h-full text-slate-400">
        <p>卡片内容区域</p>
      </div>
    </Card>
  )
}

const renderCardCodePreview = (props: Record<string, any>) => {
  let code = `<Card`
  if (props.cardTitle !== '卡片标题') {
    code += `\n  cardTitle="${props.cardTitle}"`
  }
  code += `\n>`
  code += `\n  {/* 你的内容 */}`
  code += `\n</Card>`

  return code
}

export const cardConfig: ComponentConfig = {
  id: 'container-card',
  name: '卡片',
  propsConfig: cardPropsConfig,
  defaultProps: cardDefaultProps,
  renderPreview: renderCardPreview,
  renderCodePreview: renderCardCodePreview,
  documentation: documentationMd
}
