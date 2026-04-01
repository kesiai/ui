import * as React from "react"
import * as THREE from "three"
import { Html } from "@react-three/drei"
import { cn } from "@/lib/utils"

export interface Model3dLayout3dProps {
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
  /** 布局宽度 */
  layoutWidth?: number
  /** 布局高度 */
  layoutHeight?: number
  /** 单元格键 */
  cellKey?: string
  /** 编辑模式 */
  editMode?: boolean
  /** 子组件 */
  children?: React.ReactNode
  /** 设置网格的回调（用于存储 mesh 信息） */
  setMeshs?: (updater: (state: any) => any) => void
  /** 类名 */
  className?: string
}

const Model3dLayout3d: React.FC<Model3dLayout3dProps> = ({
  meshConfig = {},
  isSprite = false,
  isFixd = false,
  layoutWidth = 400,
  layoutHeight = 250,
  cellKey = "",
  editMode = false,
  children,
  setMeshs,
  className,
}) => {
  const { position, scale, rotation } = meshConfig

  const cardRef = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState(false)
  const [mask, setMask] = React.useState(false)

  // 模拟从 store 获取 type，这里简化
  const type = "layout3d"

  // 当 meshConfig、isSprite、isFixd 变化时，通知父组件（如果 setMeshs 存在）
  React.useEffect(() => {
    if (setMeshs) {
      setMeshs((state: any) => ({
        ...state,
        [cellKey]: JSON.stringify({
          meshConfig,
          isSprite,
          isFixd,
          type,
        }),
      }))
    }
  }, [JSON.stringify(meshConfig), isSprite, isFixd])

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!editMode) {
      return
    }
    setVisible(true)
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    setMask(true)
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    setMask(false)
  }

  const handleCloseModal = () => {
    setVisible(false)
  }

  // 编辑模式下显示的遮罩层
  const maskElement = mask && editMode ? (
    <div
      className="layout_3d_mask"
      style={{
        fontSize: layoutWidth / 12,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      双击编辑
    </div>
  ) : null

  // 主内容：如果 visible 为 true（编辑模态框打开），则隐藏 children；否则显示 children
  const content = visible ? null : children

  // 编辑模态框（简化版，实际项目中可能需要使用 Modal 组件）
  const editModal = visible ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: layoutWidth,
          height: layoutHeight,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "16px", display: "flex", justifyContent: "space-between" }}>
          <span>编辑三维组件组</span>
          <button onClick={handleCloseModal}>关闭</button>
        </div>
        <div
          className="dashboard-cell-select"
          style={{ width: layoutWidth, height: layoutHeight - 50, border: "1px solid #ccc" }}
        >
          {React.useMemo(() => children, [])}
        </div>
      </div>
    </div>
  ) : null

  // 如果没有 setMeshs，说明不在三维空间中使用，显示提示
  if (!setMeshs) {
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
        <div className={cn("layout_3d", className)} style={{ color: "#999" }}>
          请放入三维空间中使用
        </div>
      </Html>
    )
  }

  const htmlContent = (
    <div
      ref={cardRef}
      className={cn("layout_3d", className)}
      style={{
        width: layoutWidth,
        height: layoutHeight,
        border: editMode ? "1px solid #CCCCCC" : "none",
        overflow: "hidden",
        position: "relative",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
    >
      {maskElement}
      {content}
      {editModal}
    </div>
  )

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

Model3dLayout3d.displayName = "Model3dLayout3d"

export { Model3dLayout3d }