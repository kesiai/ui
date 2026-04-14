import * as React from "react"
import * as THREE from "three"
import { Html } from "@react-three/drei"
import { cn } from "@/lib/utils"

export interface Model3dCardProps {
  /** 网格配置 */
  meshConfig?: {
    visible?: boolean
    position?: { x?: number; y?: number; z?: number }
    scale?: { x?: number; y?: number; z?: number }
    rotation?: { x?: number; y?: number; z?: number }
    opacity?: number
    color?: string
  }
  /** 是否作为精灵图 */
  isSprite?: boolean
  /** 是否固定 */
  isFixd?: boolean
  /** 卡片配置 */
  cardConfig?: {
    cardWidth?: string
    lineWidth?: string
    lineHeight?: string
  }
  /** 数据配置 */
  dataConfig?: {
    lineCount?: number
    dataList?: Array<{
      label: string
      value: any
    }>
  }
  /** 编辑模式 */
  editMode?: boolean
  /** 点击回调 */
  onClick?: () => void
  /** 类名 */
  className?: string
}

const Model3dCard: React.FC<Model3dCardProps> = ({
  meshConfig = {},
  isSprite = false,
  isFixd = false,
  cardConfig = {},
  dataConfig = {},
  editMode = false,
  onClick,
  className,
}) => {
  const { position, scale, rotation } = meshConfig
  const { cardWidth = "200px", lineWidth = "100px", lineHeight = "100px" } = cardConfig
  const { lineCount = 1, dataList = [] } = dataConfig

  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const getValue = (value: any) => {
    if (typeof value === "object") {
      return ""
    } else {
      return value
    }
  }

  const style = {
    wrap: {
      width: lineWidth ? `calc(${lineWidth} * 2)` : 0,
      height: lineHeight ? `calc(${lineHeight} * 2)` : 0,
    },
    content: {
      width: "100%",
      height: "50%",
    },
    cardWrap: {
      position: "absolute" as const,
      left: `calc(-${cardWidth} / 2)`,
      top: `calc(-24px * ${Math.round(dataList.length / lineCount)} - 20px)`,
      pointerEvents: "auto" as const,
    },
    card: {
      width: cardWidth,
    },
    cardItem: {
      width: `calc(100% / ${lineCount})`,
    },
    line: {
      width: lineWidth || 0,
      height: lineHeight || 0,
      overflow: "hidden" as const,
    },
    lineTop: {
      width: "100%",
      height: "50%",
      borderLeft: "1px solid #FFFFFF",
      borderBottom: "1px solid #FFFFFF",
    },
    lineBottom: {
      width: "100%",
      height: "50%",
      borderRight: "1px solid #FFFFFF",
    },
  }

  const handleClick = () => {
    onClick?.()
    if (editMode) {
      // 编辑模式下的逻辑
    }
  }

  const htmlContent = isVisible ? (
    <div className={cn("html_3d", className)}>
      <div className="card_3d" style={style.wrap} onClick={handleClick}>
        <div style={style.content}>
          <div style={style.cardWrap}>
            <div className="card_body" style={style.card}>
              {dataList.map((item, index) => (
                <div key={index} className="card_3d_item" style={style.cardItem}>
                  <span>{item.label}</span>&ensp;&ensp;
                  <span>{getValue(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={style.line}>
            <div style={style.lineTop}></div>
            <div style={style.lineBottom}></div>
          </div>
        </div>
      </div>
    </div>
  ) : null

  return (
    <Html
      transform={!isFixd}
      sprite={!!isSprite}
      distanceFactor={200}
      scale={[scale?.x || 1, scale?.y || 1, scale?.z || 1]}
      position={[position?.x || 0, position?.y || 0, position?.z || 0]}
      rotation={[
        THREE.MathUtils.degToRad(rotation?.x || 0),
        THREE.MathUtils.degToRad(rotation?.y || 0),
        THREE.MathUtils.degToRad(rotation?.z || 0),
      ]}
    >
      {htmlContent}
    </Html>
  )
}

Model3dCard.displayName = "Model3dCard"

export { Model3dCard }