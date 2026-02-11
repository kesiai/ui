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
  },
  {
    name: 'cardBordered',
    label: '是否有边框',
    type: 'boolean' as const,
    default: true,
    description: '设置是否显示卡片容器的外边框'
  },
  {
    name: 'cardPadding',
    label: '边距',
    type: 'number' as const,
    default: 24,
    min: 0,
    max: 100,
    step: 1,
    description: '设置容器内容区域与边框的距离（像素）'
  }
]

export const cardDefaultProps = {
  cardTitle: '卡片标题',
  cardBordered: true,
  cardPadding: 24
}

const renderCardPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full h-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-4" style={{ minHeight: '400px' }}>
        <Card
          cardTitle={props.cardTitle}
          cardBordered={props.cardBordered}
          cardPadding={props.cardPadding}
        >
          <div className="flex items-center justify-center h-full text-slate-400">
            <p>卡片内容区域</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

const renderCardCodePreview = (props: Record<string, any>) => {
  let code = `<Card`
  if (props.cardTitle !== '卡片标题') {
    code += `\n  cardTitle="${props.cardTitle}"`
  }
  if (!props.cardBordered) {
    code += `\n  cardBordered={false}`
  }
  if (props.cardPadding !== 24) {
    code += `\n  cardPadding={${props.cardPadding}}`
  }
  code += `\n>`
  code += `\n  {/* 你的内容 */}`
  code += `\n</Card>`

  return code
}

export const cardConfig: ComponentConfig = {
  id: 'container-card',
  name: 'Card 卡片',
  propsConfig: cardPropsConfig,
  defaultProps: cardDefaultProps,
  renderPreview: renderCardPreview,
  renderCodePreview: renderCardCodePreview,
  documentation: documentationMd
}
