import * as React from "react"
import { cn } from "@/lib/utils"
import { Card as ShadcnCard, CardHeader, CardTitle } from "@/registry/components/ui/card/card"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 卡片标题
   */
  cardTitle?: string
  /**
   * 是否有边框
   */
  cardBordered?: boolean
  /**
   * 边距
   */
  cardPadding?: number
  /**
   * 子元素
   */
  children?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      cardTitle = '',
      cardBordered = true,
      cardPadding = 24,
      children,
      ...props
    },
    ref
  ) => {
    // 处理标题
    const title = React.useMemo(() => {
      if (typeof cardTitle === 'string') {
        return cardTitle
      }
      try {
        return JSON.stringify(cardTitle)
      } catch {
        return '标题'
      }
    }, [cardTitle])

    // 计算内容区域高度（减去标题高度）
    const contentStyle = {
      height: 'calc(100% - 73px)', // 默认标题高度约为 73px
      padding: cardPadding ? `${cardPadding}px` : undefined,
      position: 'relative' as const,
      overflow: 'auto' as const
    }

    return (
      <ShadcnCard
        ref={ref}
        className={cn("dashboard-container-card", className)}
        style={{
          width: '100%',
          height: '100%',
          border: cardBordered ? undefined : 'none'
        }}
        {...props}
      >
        {title && (
          <CardHeader className="pb-3">
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <div style={contentStyle}>
          {children}
        </div>
      </ShadcnCard>
    )
  }
)

Card.displayName = "Card"

export { Card }
