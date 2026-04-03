import * as React from "react"
import * as THREE from "three"
import { Points, Point } from "@react-three/drei"

export interface Model3dPointsProps {
  /** 网格配置 */
  meshConfig?: {
    visible?: boolean
    position?: { x?: number; y?: number; z?: number }
    scale?: { x?: number; y?: number; z?: number }
    opacity?: number
    color?: string
  }
  /** 材质配置 */
  materialsConfig?: {
    materials?: any[]
  }
  /** 编辑模式 */
  editMode?: boolean
  /** 名称 */
  name?: string
  /** 点击回调 */
  onClick?: () => void
  /** 粒子数量 */
  count?: number
}

const Model3dPoints: React.FC<Model3dPointsProps> = ({
  meshConfig = {},
  materialsConfig = {},
  editMode = false,
  onClick,
  count = 1000,
}) => {
  const { visible, position, scale, opacity, color } = meshConfig
  const { materials } = materialsConfig

  // 避免未使用参数警告
  if (editMode) {
    // 编辑模式逻辑占位
  }
  if (materials) {
    // 材质配置占位
  }
  if (onClick) {
    // 点击事件占位
  }

  const pointsRef = React.useRef<THREE.Points>(null)
  const materialRef = React.useRef<THREE.PointsMaterial>(null)

  // 注释掉全局存储逻辑，因为迁移后可能不需要
  // React.useEffect(() => {
  //   if (pointsRef.current && materialRef.current) {
  //     if (!window.model3d) {
  //       window.model3d = {}
  //     }
  //     if (!window.model3d_material) {
  //       window.model3d_material = {}
  //     }
  //     window.model3d[name] = pointsRef.current
  //     window.model3d_material[name] = [materialRef.current]
  //   }
  // }, [name])

  const gProps = {
    visible: visible,
    position: [position?.x || 0, position?.y || 0, position?.z || 0] as [number, number, number],
    scale: [scale?.x || 1, scale?.y || 1, scale?.z || 1] as [number, number, number],
  }

  const mProps = {
    opacity: opacity,
    transparent: true,
    color: color ? new THREE.Color(color) : undefined,
    vertexColors: true,
  }

  // 生成随机点
  const pointsList = React.useMemo(() => {
    return Array.from({ length: count }, () => [
      Math.random() * 100 - 50,
      Math.random() * 100 - 50,
      Math.random() * 100 - 50,
    ])
  }, [count])

  return (
    <Points ref={pointsRef} {...gProps}>
      <pointsMaterial ref={materialRef} {...mProps} />
      {pointsList.map((p, idx) => (
        <Point key={idx} position={p as [number, number, number]} color="red" />
      ))}
    </Points>
  )
}

Model3dPoints.displayName = "Model3dPoints"

export { Model3dPoints }